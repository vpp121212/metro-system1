from datetime import date, time
from pydantic import BaseModel


# ── Detection ──
class DetectionBase(BaseModel):
    discovered_by: str | None = None
    first_reporter: str | None = None
    emergency_code: str | None = None
    permit_number: str | None = None
    detection_time: str | None = None
    occ_notification_time: str | None = None
    occ_response_time: str | None = None


class DetectionCreate(DetectionBase):
    pass


class DetectionUpdate(DetectionBase):
    pass


class DetectionResponse(DetectionBase):
    id: int

    class Config:
        from_attributes = True


# ── Incident Type ──
class IncidentTypeBase(BaseModel):
    type_name: str


class IncidentTypeCreate(IncidentTypeBase):
    pass


class IncidentTypeResponse(IncidentTypeBase):
    id: int

    class Config:
        from_attributes = True


# ── Passenger ──
class PassengerBase(BaseModel):
    name: str | None = None
    age: int | None = None
    phone: str | None = None
    emergency_contact: str | None = None
    passenger_status: str | None = None
    hospital_name: str | None = None
    ambulance_ref: str | None = None
    first_aid_given: str | None = None
    ambulance_request_time: str | None = None
    ambulance_arrival_time: str | None = None
    handover_time: str | None = None
    departure_time: str | None = None


class PassengerCreate(PassengerBase):
    pass


class PassengerUpdate(PassengerBase):
    pass


class PassengerResponse(PassengerBase):
    id: int

    class Config:
        from_attributes = True


# ── Train Operations ──
class TrainOperationBase(BaseModel):
    train_number: str | None = None
    current_location: str | None = None
    destination: str | None = None
    operation_mode: str | None = None
    rescue_train_number: str | None = None
    rescue_start_time: str | None = None
    rescue_end_time: str | None = None
    handover_to_occ_time: str | None = None
    return_to_service_time: str | None = None


class TrainOperationCreate(TrainOperationBase):
    pass


class TrainOperationUpdate(TrainOperationBase):
    pass


class TrainOperationResponse(TrainOperationBase):
    id: int

    class Config:
        from_attributes = True


# ── Evacuation ──
class EvacuationBase(BaseModel):
    evacuation_order_time: str | None = None
    evacuation_start_time: str | None = None
    evacuation_completion_time: str | None = None
    station_clear_notification_time: str | None = None
    station_reopening_time: str | None = None


class EvacuationCreate(EvacuationBase):
    pass


class EvacuationUpdate(EvacuationBase):
    pass


class EvacuationResponse(EvacuationBase):
    id: int

    class Config:
        from_attributes = True


# ── Staff Member ──
class StaffMemberBase(BaseModel):
    name: str | None = None
    employee_id: str | None = None
    role: str | None = None
    notes: str | None = None
    digital_signature: str | None = None


class StaffMemberCreate(StaffMemberBase):
    pass


class StaffMemberUpdate(StaffMemberBase):
    pass


class StaffMemberResponse(StaffMemberBase):
    id: int

    class Config:
        from_attributes = True


# ── Impact ──
class ImpactBase(BaseModel):
    incident_duration: int | None = None
    response_duration: int | None = None
    evacuation_duration: int | None = None
    rescue_duration: int | None = None
    train_delays: int | None = None
    passengers_affected: int | None = None
    injuries: int | None = None
    fatalities: int | None = None
    equipment_affected: str | None = None
    cause: str | None = None
    corrective_actions: str | None = None
    lessons_learned: str | None = None
    incident_closed: bool | None = None


class ImpactCreate(ImpactBase):
    pass


class ImpactUpdate(ImpactBase):
    pass


class ImpactResponse(ImpactBase):
    id: int
    closed_at: str | None = None

    class Config:
        from_attributes = True


# ── Incident ──
class IncidentBase(BaseModel):
    date: str | None = None
    day: str | None = None
    time: str | None = None
    shift: str | None = None
    station: str | None = None
    location: str | None = None
    platform_track: str | None = None
    description: str | None = None
    created_by_name: str | None = None
    created_by_employee_id: str | None = None


class IncidentCreate(IncidentBase):
    detection: DetectionCreate | None = None
    incident_types: list[IncidentTypeCreate] = []
    passengers: list[PassengerCreate] = []
    train_operations: TrainOperationCreate | None = None
    evacuation: EvacuationCreate | None = None
    staff: list[StaffMemberCreate] = []
    impact: ImpactCreate | None = None


class IncidentUpdate(IncidentBase):
    detection: DetectionUpdate | None = None
    incident_types: list[IncidentTypeCreate] | None = None
    passengers: list[PassengerCreate] | None = None
    train_operations: TrainOperationUpdate | None = None
    evacuation: EvacuationUpdate | None = None
    staff: list[StaffMemberCreate] | None = None
    impact: ImpactUpdate | None = None


class IncidentResponse(IncidentBase):
    id: int
    incident_number: str
    created_at: str | None = None
    updated_at: str | None = None

    class Config:
        from_attributes = True


class IncidentListItem(IncidentResponse):
    incident_types: list[IncidentTypeResponse] = []


class IncidentDetailResponse(IncidentResponse):
    detection: DetectionResponse | None = None
    incident_types: list[IncidentTypeResponse] = []
    passengers: list[PassengerResponse] = []
    train_operations: TrainOperationResponse | None = None
    evacuation: EvacuationResponse | None = None
    staff: list[StaffMemberResponse] = []
    impact: ImpactResponse | None = None
