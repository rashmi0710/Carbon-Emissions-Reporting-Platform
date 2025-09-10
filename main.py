from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import extract, func, desc
from contextlib import asynccontextmanager
from typing import List, Optional
from models import EmissionFactor, EmissionRecord, BusinessMetric, AuditLog
from database import SessionLocal, engine, Base
from pydantic import BaseModel, Field
from sqlalchemy import and_ 
import datetime
from typing import List

# ------------------------------
# App & Middleware
# ------------------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created")
    yield
    print("👋 App shutting down")

# ------------------------------
# DB Dependency
# ------------------------------
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
    scope: str = Field(..., pattern="^(Scope1|Scope2|Scope3)$")
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
# Utility
# ------------------------------
def get_valid_factor(db: Session, activity: str, unit: str, recorded_at: datetime.date):
    return db.query(EmissionFactor).filter(
        EmissionFactor.activity == activity,
        EmissionFactor.unit == unit,
        EmissionFactor.valid_from <= recorded_at,
        EmissionFactor.valid_to >= recorded_at
    ).first()

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
# EmissionRecord CRUD
# ------------------------------
@app.post("/emissions/", response_model=EmissionRecordOutSchema)
def create_emission(item: EmissionRecordSchema, db: Session = Depends(get_db)):
    factor = get_valid_factor(db, item.activity, item.unit, item.recorded_at)
    if not factor:
        raise HTTPException(status_code=404, detail="Valid emission factor not found.")
    ghg_emission = item.quantity * factor.co2e_value
    record = EmissionRecord(
        scope=item.scope,
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

# ------------------------------
# Analytics Endpoints
# ------------------------------
@app.get("/analytics/yoy")
def yoy_emissions(db: Session = Depends(get_db)):
    """Year-over-Year emissions by scope"""
    results = (
        db.query(
            extract("year", EmissionRecord.recorded_at).label("year"),
            EmissionRecord.scope,
            func.sum(EmissionRecord.ghg_emission).label("total")
        )
        .group_by("year", EmissionRecord.scope)
        .order_by("year")
        .all()
    )

    return [
        {
            # Format year as yyyy-mm-dd (default first day of year)
            "year": datetime.date(int(r.year), 1, 1).strftime("%Y-%m-%d"),
            "scope": r.scope,
            "total": float(r.total)
        }
        for r in results
    ]

@app.get("/analytics/hotspots")
def emission_hotspots(limit: int = 5, db: Session = Depends(get_db)):
    """Top activities contributing to emissions"""
    results = (
        db.query(
            EmissionRecord.activity,
            func.sum(EmissionRecord.ghg_emission).label("total_emission")
        )
        .group_by(EmissionRecord.activity)
        .order_by(desc("total_emission"))
        .limit(limit)
        .all()
    )
    return [{"activity": r.activity, "total_emission": r.total_emission} for r in results]

@app.get("/analytics/trend")
def emission_trend(scope: Optional[str] = None, db: Session = Depends(get_db)):
    """Emissions trend over time (monthly) with yyyy-dd-mm format"""
    query = db.query(
        extract("year", EmissionRecord.recorded_at).label("year"),
        extract("month", EmissionRecord.recorded_at).label("month"),
        func.sum(EmissionRecord.ghg_emission).label("total")
    )
    if scope:
        query = query.filter(EmissionRecord.scope == scope)

    results = (
        query.group_by("year", "month")
        .order_by("year", "month")
        .all()
    )

    return [
        {
            "date": datetime.date(int(r.year), int(r.month), 1).strftime("%Y-%d-%m"),  
            "total": r.total
        }
        for r in results
    ]



@app.get("/audit_logs/all", response_model=List[AuditLogOutSchema])
def get_all_audit_logs(db: Session = Depends(get_db)):
    logs = db.query(AuditLog).all()
    return logs


# ------------------------------
# Emission Intensity
# ------------------------------
@app.get("/intensity/")
def emission_intensity(metric_name: str, metric_date: datetime.date, db: Session = Depends(get_db)):
    total_ghg = db.query(EmissionRecord).filter(
        EmissionRecord.recorded_at == metric_date
    ).with_entities(func.sum(EmissionRecord.ghg_emission)).scalar() or 0

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


@app.get("/analytics/historical")
def historical_emissions(db: Session = Depends(get_db)):
    records = (
        db.query(
            EmissionRecord.id,
            EmissionRecord.activity,
            EmissionRecord.recorded_at,
            EmissionRecord.quantity,
            EmissionRecord.unit,
            EmissionRecord.ghg_emission,
            EmissionFactor.co2e_value
        )
        .join(EmissionFactor, and_(
            EmissionFactor.activity == EmissionRecord.activity,
            EmissionFactor.unit == EmissionRecord.unit,
            EmissionRecord.recorded_at.between(EmissionFactor.valid_from, EmissionFactor.valid_to)
        ))
        .all()
    )

    return [
        {
            "id": r.id,
            "activity": r.activity,
            "date": r.recorded_at.strftime("%Y-%m-%d"),
            "quantity": r.quantity,
            "unit": r.unit,
            "factor_used": r.co2e_value,
            "calculated_emission": r.quantity * r.co2e_value,
            "stored_emission": r.ghg_emission
        }
        for r in records
    ]
