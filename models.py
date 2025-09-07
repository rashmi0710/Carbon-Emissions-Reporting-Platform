from sqlalchemy import Column, Integer, String, Float, Date
from database import Base

class DirectEmission(Base):
    __tablename__ = "direct_emissions"
    id = Column(Integer, primary_key=True, index=True)
    section = Column(String(64))
    material = Column(String(64))
    unit = Column(String(32))
    quantity = Column(Float)
    emission_factor = Column(Float)
    emission_factor_unit = Column(String(32))
    ghg_emission = Column(Float)
    location = Column(String(128))
    start_date = Column(Date)
    end_date = Column(Date)

class EnergyEmission(Base):
    __tablename__ = "energy_emissions"
    id = Column(Integer, primary_key=True, index=True)
    section = Column(String(64))
    material = Column(String(64))
    unit = Column(String(32))
    quantity = Column(Float)
    emission_factor = Column(Float)
    ghg_emission = Column(Float)
    location = Column(String(128))
    start_date = Column(Date)
    end_date = Column(Date)

class ValueChainEmission(Base):
    __tablename__ = "value_chain_emissions"
    id = Column(Integer, primary_key=True, index=True)
    section = Column(String(64))
    material = Column(String(64))
    unit = Column(String(32))
    quantity = Column(Float)
    emission_factor = Column(Float)
    ghg_emission = Column(Float)
    start_date = Column(Date)
    end_date = Column(Date)
