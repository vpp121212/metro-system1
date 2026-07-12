from __future__ import annotations

import datetime
from typing import Optional, List

from sqlalchemy import Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


class Line(Base):
    __tablename__ = "lines"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name_ar: Mapped[str] = mapped_column(String(100))
    name_en: Mapped[str] = mapped_column(String(100))
    color: Mapped[str] = mapped_column(String(20))
    order: Mapped[int] = mapped_column(Integer)

    stations: Mapped[List["Station"]] = relationship(back_populates="line")
    trains: Mapped[List["Train"]] = relationship(back_populates="line")
    cameras: Mapped[List["Camera"]] = relationship(back_populates="line")
    alerts: Mapped[List["Alert"]] = relationship(back_populates="line")
    passenger_records: Mapped[List["PassengerRecord"]] = relationship(back_populates="line")


class Station(Base):
    __tablename__ = "stations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name_ar: Mapped[str] = mapped_column(String(100))
    name_en: Mapped[str] = mapped_column(String(100))
    line_id: Mapped[int] = mapped_column(Integer, ForeignKey("lines.id"))
    order: Mapped[int] = mapped_column(Integer)
    lat: Mapped[float] = mapped_column(Float)
    lng: Mapped[float] = mapped_column(Float)
    is_interchange: Mapped[bool] = mapped_column(Boolean, default=False)

    line: Mapped["Line"] = relationship(back_populates="stations")
    trains: Mapped[List["Train"]] = relationship(back_populates="current_station")
    cameras: Mapped[List["Camera"]] = relationship(back_populates="station")
    alerts: Mapped[List["Alert"]] = relationship(back_populates="station")
    passenger_records: Mapped[List["PassengerRecord"]] = relationship(back_populates="station")


class Train(Base):
    __tablename__ = "trains"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    line_id: Mapped[int] = mapped_column(Integer, ForeignKey("lines.id"))
    name: Mapped[str] = mapped_column(String(50))
    status: Mapped[str] = mapped_column(String(20))
    current_station_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("stations.id"), nullable=True)
    speed: Mapped[float] = mapped_column(Float, default=0.0)
    direction: Mapped[str] = mapped_column(String(20), default="forward")
    last_updated: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.utcnow)

    line: Mapped["Line"] = relationship(back_populates="trains")
    current_station: Mapped[Optional["Station"]] = relationship(back_populates="trains")


class Camera(Base):
    __tablename__ = "cameras"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    station_id: Mapped[int] = mapped_column(Integer, ForeignKey("stations.id"))
    line_id: Mapped[int] = mapped_column(Integer, ForeignKey("lines.id"))
    status: Mapped[str] = mapped_column(String(20))
    name: Mapped[str] = mapped_column(String(100))

    station: Mapped["Station"] = relationship(back_populates="cameras")
    line: Mapped["Line"] = relationship(back_populates="cameras")


class Alert(Base):
    __tablename__ = "alerts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    type: Mapped[str] = mapped_column(String(20))
    title_ar: Mapped[str] = mapped_column(String(200))
    title_en: Mapped[str] = mapped_column(String(200))
    description_ar: Mapped[str] = mapped_column(Text)
    description_en: Mapped[str] = mapped_column(Text)
    line_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("lines.id"), nullable=True)
    station_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("stations.id"), nullable=True)
    is_acknowledged: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.utcnow)

    line: Mapped[Optional["Line"]] = relationship(back_populates="alerts")
    station: Mapped[Optional["Station"]] = relationship(back_populates="alerts")


class PassengerRecord(Base):
    __tablename__ = "passenger_records"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    line_id: Mapped[int] = mapped_column(Integer, ForeignKey("lines.id"))
    station_id: Mapped[int] = mapped_column(Integer, ForeignKey("stations.id"))
    count: Mapped[int] = mapped_column(Integer)
    timestamp: Mapped[datetime.datetime] = mapped_column(DateTime)
    density_percent: Mapped[float] = mapped_column(Float)

    line: Mapped["Line"] = relationship(back_populates="passenger_records")
    station: Mapped["Station"] = relationship(back_populates="passenger_records")


class SystemHealth(Base):
    __tablename__ = "system_health"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    health_percent: Mapped[float] = mapped_column(Float)
    uptime_seconds: Mapped[int] = mapped_column(Integer)
    timestamp: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.utcnow)


class Settings(Base):
    __tablename__ = "settings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    language: Mapped[str] = mapped_column(String(10), default="en")
    theme: Mapped[str] = mapped_column(String(20), default="dark")
    notifications_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    auto_refresh_seconds: Mapped[int] = mapped_column(Integer, default=30)
    alert_sound: Mapped[bool] = mapped_column(Boolean, default=True)
    map_refresh_seconds: Mapped[int] = mapped_column(Integer, default=5)
