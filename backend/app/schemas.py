from __future__ import annotations

import datetime
from typing import Optional

from pydantic import BaseModel


class LineOut(BaseModel):
    id: int
    name_ar: str
    name_en: str
    color: str
    order: int

    model_config = {"from_attributes": True}


class StationOut(BaseModel):
    id: int
    name_ar: str
    name_en: str
    line_id: int
    order: int
    lat: float
    lng: float
    is_interchange: bool

    model_config = {"from_attributes": True}


class TrainOut(BaseModel):
    id: int
    line_id: int
    name: str
    status: str
    current_station_id: Optional[int]
    speed: float
    direction: str
    last_updated: datetime.datetime

    model_config = {"from_attributes": True}


class CameraOut(BaseModel):
    id: int
    station_id: int
    line_id: int
    status: str
    name: str

    model_config = {"from_attributes": True}


class AlertOut(BaseModel):
    id: int
    type: str
    title_ar: str
    title_en: str
    description_ar: str
    description_en: str
    line_id: Optional[int]
    station_id: Optional[int]
    is_acknowledged: bool
    created_at: datetime.datetime

    model_config = {"from_attributes": True}


class PassengerRecordOut(BaseModel):
    id: int
    line_id: int
    station_id: int
    count: int
    timestamp: datetime.datetime
    density_percent: float

    model_config = {"from_attributes": True}


class SystemHealthOut(BaseModel):
    id: int
    health_percent: float
    uptime_seconds: int
    timestamp: datetime.datetime

    model_config = {"from_attributes": True}


class SettingsOut(BaseModel):
    language: str
    theme: str
    notifications_enabled: bool
    auto_refresh_seconds: int
    alert_sound: bool
    map_refresh_seconds: int

    model_config = {"from_attributes": True}


class SettingsUpdate(BaseModel):
    language: Optional[str] = None
    theme: Optional[str] = None
    notifications_enabled: Optional[bool] = None
    auto_refresh_seconds: Optional[int] = None
    alert_sound: Optional[bool] = None
    map_refresh_seconds: Optional[int] = None


class SimulationRequest(BaseModel):
    scenario: str


class SimulationResponse(BaseModel):
    status: str
    scenario: str
    message: str
