from fastapi import FastAPI, Depends, HTTPException
from contextlib import asynccontextmanager
from sqlalchemy.orm import Session
from typing import List
from models import DirectEmission, EnergyEmission, ValueChainEmission
from database import SessionLocal, engine, Base
from pydantic import BaseModel
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
# Pydantic Schemas (with auto id, start_date, end_date)
# ------------------------------
class DirectEmissionSchema(BaseModel):
    section: str
    material: str
    unit: str
    quantity: float
    emission_factor: float
    emission_factor_unit: str | None = None
    ghg_emission: float
    location: str | None = None
    start_date: datetime.date
    end_date: datetime.date

    class Config:
        from_attributes = True

class DirectEmissionOutSchema(DirectEmissionSchema):
    id: int

class EnergyEmissionSchema(BaseModel):
    section: str
    material: str
    unit: str
    quantity: float
    emission_factor: float
    ghg_emission: float
    location: str | None = None
    start_date: datetime.date
    end_date: datetime.date

    class Config:
        from_attributes = True

class EnergyEmissionOutSchema(EnergyEmissionSchema):
    id: int

class ValueChainEmissionSchema(BaseModel):
    section: str | None = None
    material: str | None = None
    unit: str | None = None
    quantity: float | None = None
    emission_factor: float | None = None
    ghg_emission: float | None = None
    start_date: datetime.date | None = None
    end_date: datetime.date | None = None

    class Config:
        from_attributes = True

class ValueChainEmissionOutSchema(ValueChainEmissionSchema):
    id: int

# ------------------------------
# CRUD Endpoints - Scope 1
# ------------------------------
@app.post("/scope1/", response_model=DirectEmissionOutSchema)
def create_scope1_emission(item: DirectEmissionSchema, db: Session = Depends(get_db)):
    emission = DirectEmission(**item.model_dump())
    db.add(emission)
    db.commit()
    db.refresh(emission)
    return emission

@app.get("/scope1/", response_model=List[DirectEmissionOutSchema])
def list_scope1_emissions(db: Session = Depends(get_db)):
    return db.query(DirectEmission).all()

@app.get("/scope1/{emission_id}", response_model=DirectEmissionOutSchema)
def get_scope1_emission(emission_id: int, db: Session = Depends(get_db)):
    emission = db.query(DirectEmission).filter(DirectEmission.id == emission_id).first()
    if not emission:
        raise HTTPException(status_code=404, detail="Emission not found")
    return emission

@app.delete("/scope1/{emission_id}")
def delete_scope1_emission(emission_id: int, db: Session = Depends(get_db)):
    emission = db.query(DirectEmission).filter(DirectEmission.id == emission_id).first()
    if not emission:
        raise HTTPException(status_code=404, detail="Emission not found")
    db.delete(emission)
    db.commit()
    return {"detail": "Deleted"}

# ------------------------------
# Scope 2
# ------------------------------
@app.post("/scope2/", response_model=EnergyEmissionOutSchema)
def create_scope2_emission(item: EnergyEmissionSchema, db: Session = Depends(get_db)):
    emission = EnergyEmission(**item.model_dump())
    db.add(emission)
    db.commit()
    db.refresh(emission)
    return emission

@app.get("/scope2/", response_model=List[EnergyEmissionOutSchema])
def list_scope2_emissions(db: Session = Depends(get_db)):
    return db.query(EnergyEmission).all()

@app.get("/scope2/{emission_id}", response_model=EnergyEmissionOutSchema)
def get_scope2_emission(emission_id: int, db: Session = Depends(get_db)):
    emission = db.query(EnergyEmission).filter(EnergyEmission.id == emission_id).first()
    if not emission:
        raise HTTPException(status_code=404, detail="Emission not found")
    return emission


@app.delete("/scope2/{emission_id}")
def delete_scope2_emission(emission_id: int, db: Session = Depends(get_db)):
    emission = db.query(EnergyEmission).filter(EnergyEmission.id == emission_id).first()
    if not emission:
        raise HTTPException(status_code=404, detail="Emission not found")
    db.delete(emission)
    db.commit()
    return {"detail": "Deleted"}
# ------------------------------
# Scope 3
# ------------------------------
@app.post("/scope3/", response_model=ValueChainEmissionOutSchema)
def create_scope3_emission(item: ValueChainEmissionSchema, db: Session = Depends(get_db)):
    emission = ValueChainEmission(**item.model_dump())
    db.add(emission)
    db.commit()
    db.refresh(emission)
    return emission

@app.get("/scope3/", response_model=List[ValueChainEmissionOutSchema])
def list_scope3_emissions(db: Session = Depends(get_db)):
    return db.query(ValueChainEmission).all()

@app.get("/scope3/{emission_id}", response_model=ValueChainEmissionOutSchema)
def get_scope3_emission(emission_id: int, db: Session = Depends(get_db)):
    emission = db.query(ValueChainEmission).filter(ValueChainEmission.id == emission_id).first()
    if not emission:
        raise HTTPException(status_code=404, detail="Emission not found")
    return emission


@app.delete("/scope3/{emission_id}")
def delete_scope3_emission(emission_id: int, db: Session = Depends(get_db)):
    emission = db.query(ValueChainEmission).filter(ValueChainEmission.id == emission_id).first()
    if not emission:
        raise HTTPException(status_code=404, detail="Emission not found")
    db.delete(emission)
    db.commit()
    return {"detail": "Deleted"}