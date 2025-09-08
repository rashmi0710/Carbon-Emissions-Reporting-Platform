from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from contextlib import asynccontextmanager
from typing import List, Optional
from models import EmissionFactor, EmissionRecord, BusinessMetric, AuditLog
from database import SessionLocal, engine, Base
from pydantic import BaseModel, Field
import datetime

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created")
    yield
    print("👋 App shutting down")

app = FastAPI(lifespan=lifespan)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ------------------------------
# Pydantic Schemas
# ------------------------------

class EmissionFactorSchema(BaseModel):
    activity: str
    unit: str
    co2e_value: float
    source: Optional[str] = None
    valid_from: datetime.date
    valid_to: datetime.date

    class Config:
        from_attributes = True

class EmissionFactorOutSchema(EmissionFactorSchema):
    id: int

class EmissionRecordSchema(BaseModel):
    scope: str = Field(..., pattern="^(Scope1|Scope2)$")
    activity: str
    unit: str
    quantity: float
    recorded_at: datetime.date
    location: Optional[str] = None
    user_id: Optional[int] = None

    class Config:
        from_attributes = True

class EmissionRecordOutSchema(EmissionRecordSchema):
    id: int
    emission_factor_id: int
    ghg_emission: float

class BusinessMetricSchema(BaseModel):
    metric_date: datetime.date
    metric_name: str
    value: float

    class Config:
        from_attributes = True

class BusinessMetricOutSchema(BusinessMetricSchema):
    id: int

class AuditLogSchema(BaseModel):
    record_id: int
    field_name: str
    old_value: Optional[str] = None
    new_value: Optional[str] = None
    changed_by: Optional[int] = None
    changed_at: datetime.date
    reason: Optional[str] = None

    class Config:
        from_attributes = True

class AuditLogOutSchema(AuditLogSchema):
    id: int

# ------------------------------
# EmissionFactor CRUD
# ------------------------------
@app.post("/factors/", response_model=EmissionFactorOutSchema)
def create_emission_factor(item: EmissionFactorSchema, db: Session = Depends(get_db)):
    factor = EmissionFactor(**item.model_dump())
    db.add(factor)
    db.commit()
    db.refresh(factor)
    return factor

@app.get("/factors/", response_model=List[EmissionFactorOutSchema])
def list_emission_factors(db: Session = Depends(get_db)):
    return db.query(EmissionFactor).all()

@app.get("/factors/{factor_id}", response_model=EmissionFactorOutSchema)
def get_emission_factor(factor_id: int, db: Session = Depends(get_db)):
    factor = db.query(EmissionFactor).filter(EmissionFactor.id == factor_id).first()
    if not factor:
        raise HTTPException(status_code=404, detail="Factor not found")
    return factor

@app.delete("/factors/{factor_id}")
def delete_emission_factor(factor_id: int, db: Session = Depends(get_db)):
    factor = db.query(EmissionFactor).filter(EmissionFactor.id == factor_id).first()
    if not factor:
        raise HTTPException(status_code=404, detail="Factor not found")
    db.delete(factor)
    db.commit()
    return {"detail": "Deleted"}

# ------------------------------
# BusinessMetric CRUD
# ------------------------------
@app.post("/metrics/", response_model=BusinessMetricOutSchema)
def create_metric(item: BusinessMetricSchema, db: Session = Depends(get_db)):
    metric = BusinessMetric(**item.model_dump())
    db.add(metric)
    db.commit()
    db.refresh(metric)
    return metric

@app.get("/metrics/", response_model=List[BusinessMetricOutSchema])
def list_metrics(db: Session = Depends(get_db)):
    return db.query(BusinessMetric).all()

@app.get("/metrics/{metric_id}", response_model=BusinessMetricOutSchema)
def get_metric(metric_id: int, db: Session = Depends(get_db)):
    metric = db.query(BusinessMetric).filter(BusinessMetric.id == metric_id).first()
    if not metric:
        raise HTTPException(status_code=404, detail="Metric not found")
    return metric

@app.delete("/metrics/{metric_id}")
def delete_metric(metric_id: int, db: Session = Depends(get_db)):
    metric = db.query(BusinessMetric).filter(BusinessMetric.id == metric_id).first()
    if not metric:
        raise HTTPException(status_code=404, detail="Metric not found")
    db.delete(metric)
    db.commit()
    return {"detail": "Deleted"}

# ------------------------------
# EmissionRecord CRUD (Scope 1 & 2)
# ------------------------------
def get_valid_factor(db: Session, activity: str, unit: str, recorded_at: datetime.date):
    return db.query(EmissionFactor).filter(
        EmissionFactor.activity == activity,
        EmissionFactor.unit == unit,
        EmissionFactor.valid_from <= recorded_at,
        EmissionFactor.valid_to >= recorded_at
    ).first()

@app.post("/scope1/", response_model=EmissionRecordOutSchema)
def create_scope1_emission(item: EmissionRecordSchema, db: Session = Depends(get_db)):
    if item.scope != "Scope1":
        raise HTTPException(status_code=400, detail="Scope must be 'Scope1'")
    factor = get_valid_factor(db, item.activity, item.unit, item.recorded_at)
    if not factor:
        raise HTTPException(status_code=404, detail="Valid emission factor not found.")
    ghg_emission = item.quantity * factor.co2e_value
    record = EmissionRecord(
        scope="Scope1",
        activity=item.activity,
        unit=item.unit,
        quantity=item.quantity,
        emission_factor_id=factor.id,
        ghg_emission=ghg_emission,
        recorded_at=item.recorded_at,
        location=item.location,
        user_id=item.user_id
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

@app.post("/scope2/", response_model=EmissionRecordOutSchema)
def create_scope2_emission(item: EmissionRecordSchema, db: Session = Depends(get_db)):
    if item.scope != "Scope2":
        raise HTTPException(status_code=400, detail="Scope must be 'Scope2'")
    factor = get_valid_factor(db, item.activity, item.unit, item.recorded_at)
    if not factor:
        raise HTTPException(status_code=404, detail="Valid emission factor not found.")
    ghg_emission = item.quantity * factor.co2e_value
    record = EmissionRecord(
        scope="Scope2",
        activity=item.activity,
        unit=item.unit,
        quantity=item.quantity,
        emission_factor_id=factor.id,
        ghg_emission=ghg_emission,
        recorded_at=item.recorded_at,
        location=item.location,
        user_id=item.user_id
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

@app.get("/emissions/", response_model=List[EmissionRecordOutSchema])
def list_emissions(db: Session = Depends(get_db)):
    return db.query(EmissionRecord).all()

@app.get("/emissions/{emission_id}", response_model=EmissionRecordOutSchema)
def get_emission(emission_id: int, db: Session = Depends(get_db)):
    emission = db.query(EmissionRecord).filter(EmissionRecord.id == emission_id).first()
    if not emission:
        raise HTTPException(status_code=404, detail="Emission not found")
    return emission

@app.delete("/emissions/{emission_id}")
def delete_emission(emission_id: int, db: Session = Depends(get_db)):
    emission = db.query(EmissionRecord).filter(EmissionRecord.id == emission_id).first()
    if not emission:
        raise HTTPException(status_code=404, detail="Emission not found")
    db.delete(emission)
    db.commit()
    return {"detail": "Deleted"}

# ------------------------------
# Audit Log CRUD
# ------------------------------
@app.post("/audit/", response_model=AuditLogOutSchema)
def create_audit_log(item: AuditLogSchema, db: Session = Depends(get_db)):
    log = AuditLog(**item.model_dump())
    db.add(log)
    db.commit()
    db.refresh(log)
    return log

@app.get("/audit/", response_model=List[AuditLogOutSchema])
def list_audit_logs(db: Session = Depends(get_db)):
    return db.query(AuditLog).all()

# ------------------------------
# Emission Intensity Reporting
# ------------------------------
@app.get("/intensity/")
def emission_intensity(metric_name: str, metric_date: datetime.date, db: Session = Depends(get_db)):
    # Total GHG on that date
    total_ghg = db.query(EmissionRecord).filter(
        EmissionRecord.recorded_at == metric_date
    ).with_entities(EmissionRecord.ghg_emission).all()
    total_ghg = sum([row.ghg_emission for row in total_ghg])

    # Business metric on that date
    metric = db.query(BusinessMetric).filter(
        BusinessMetric.metric_name == metric_name,
        BusinessMetric.metric_date == metric_date
    ).first()
    if not metric or metric.value == 0:
        raise HTTPException(status_code=404, detail="Business metric not found or zero value")

    intensity = total_ghg / metric.value
    return {
        "metric_name": metric_name,
        "metric_date": str(metric_date),
        "total_ghg_emission": total_ghg,
        "metric_value": metric.value,
        "intensity": intensity
    }
