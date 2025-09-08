from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, Enum
from sqlalchemy.orm import relationship
from database import Base

class EmissionFactor(Base):
    __tablename__ = "emission_factors"
    id = Column(Integer, primary_key=True, index=True)
    activity = Column(String(128), nullable=False)
    unit = Column(String(32), nullable=False)
    co2e_value = Column(Float, nullable=False)  # e.g. kgCO2e per unit
    source = Column(String(256))
    valid_from = Column(Date, nullable=False)
    valid_to = Column(Date, nullable=False)

    # One-to-many relationship for emissions using this factor
    emissions = relationship("EmissionRecord", back_populates="factor")


class EmissionRecord(Base):
    __tablename__ = "emission_records"
    id = Column(Integer, primary_key=True, index=True)
    scope = Column(Enum("Scope1", "Scope2", "Scope3", name="scope_enum"), nullable=False)
    activity = Column(String(128), nullable=False)
    unit = Column(String(32), nullable=False)
    quantity = Column(Float, nullable=False)
    emission_factor_id = Column(Integer, ForeignKey("emission_factors.id"), nullable=False)
    ghg_emission = Column(Float, nullable=False)
    recorded_at = Column(Date, nullable=False)
    location = Column(String(128))
    user_id = Column(Integer)

    # Relationship to the emission factor used
    factor = relationship("EmissionFactor", back_populates="emissions")


class BusinessMetric(Base):
    __tablename__ = "business_metrics"
    id = Column(Integer, primary_key=True, index=True)
    metric_date = Column(Date, nullable=False)
    metric_name = Column(String(128), nullable=False)
    value = Column(Float, nullable=False)


# Optional: AuditLog for tracking manual overrides/changes
class AuditLog(Base):
    __tablename__ = "audit_log"
    id = Column(Integer, primary_key=True, index=True)
    record_id = Column(Integer, ForeignKey("emission_records.id"), nullable=False)
    field_name = Column(String(128), nullable=False)
    old_value = Column(String(256))
    new_value = Column(String(256))
    changed_by = Column(Integer)
    changed_at = Column(Date, nullable=False)
    reason = Column(String(256))

    # Relationship to the emission record changed
    emission_record = relationship("EmissionRecord")