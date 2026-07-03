from datetime import date, datetime, time

from sqlalchemy import Date, DateTime, String, Text, Time, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..database import Base


class Incident(Base):
    __tablename__ = "incidents"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    incident_number: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    date: Mapped[date] = mapped_column(Date, nullable=True)
    day: Mapped[str | None] = mapped_column(String(20))
    time: Mapped[time | None] = mapped_column(Time)
    shift: Mapped[str | None] = mapped_column(String(20))
    station: Mapped[str | None] = mapped_column(String(100))
    location: Mapped[str | None] = mapped_column(String(200))
    platform_track: Mapped[str | None] = mapped_column(String(50))
    description: Mapped[str | None] = mapped_column(Text)

    created_by_name: Mapped[str | None] = mapped_column(String(100))
    created_by_employee_id: Mapped[str | None] = mapped_column(String(50))
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    detection: Mapped["IncidentDetection | None"] = relationship(back_populates="incident", uselist=False, cascade="all, delete-orphan")
    incident_types: Mapped[list["IncidentType"]] = relationship(back_populates="incident", cascade="all, delete-orphan")
    passengers: Mapped[list["Passenger"]] = relationship(back_populates="incident", cascade="all, delete-orphan")
    train_operations: Mapped["TrainOperation | None"] = relationship(back_populates="incident", uselist=False, cascade="all, delete-orphan")
    evacuation: Mapped["StationEvacuation | None"] = relationship(back_populates="incident", uselist=False, cascade="all, delete-orphan")
    staff: Mapped[list["StaffMember"]] = relationship(back_populates="incident", cascade="all, delete-orphan")
    impact: Mapped["ImpactAssessment | None"] = relationship(back_populates="incident", uselist=False, cascade="all, delete-orphan")
