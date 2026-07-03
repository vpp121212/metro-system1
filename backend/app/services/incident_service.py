from datetime import date, datetime

from sqlalchemy import func
from sqlalchemy.orm import Session

from .. import models, schemas
from ..utils.helpers import parse_date, parse_time


def generate_incident_number(db: Session) -> str:
    today = date.today()
    count = db.query(func.count(models.Incident.id)).filter(
        func.date(models.Incident.created_at) == today
    ).scalar()
    return f"INC-{today.strftime('%Y%m%d')}-{count + 1:04d}"


def _apply_main(data: dict, incident: models.Incident):
    for key, value in data.items():
        setattr(incident, key, value)


def _convert_times(data: dict, fields: list[str]):
    for f in fields:
        if f in data:
            data[f] = parse_time(data[f])


TIME_FIELDS = {
    "detection": ["detection_time", "occ_notification_time", "occ_response_time"],
    "passengers": ["ambulance_request_time", "ambulance_arrival_time", "handover_time", "departure_time"],
    "train_operations": ["rescue_start_time", "rescue_end_time", "handover_to_occ_time", "return_to_service_time"],
    "evacuation": ["evacuation_order_time", "evacuation_start_time", "evacuation_completion_time",
                    "station_clear_notification_time", "station_reopening_time"],
}


def create_incident(db: Session, data: schemas.IncidentCreate) -> models.Incident:
    inc_data = data.model_dump(exclude_unset=True)
    nested_keys = {"detection", "incident_types", "passengers", "train_operations", "evacuation", "staff", "impact"}
    main_data = {k: v for k, v in inc_data.items() if k not in nested_keys}

    if main_data.get("date"):
        main_data["date"] = parse_date(main_data["date"])
    if main_data.get("time"):
        main_data["time"] = parse_time(main_data["time"])

    incident = models.Incident(**main_data)
    incident.incident_number = generate_incident_number(db)

    if data.detection:
        det = data.detection.model_dump(exclude_unset=True)
        _convert_times(det, TIME_FIELDS["detection"])
        incident.detection = models.IncidentDetection(**det)

    if data.incident_types:
        incident.incident_types = [models.IncidentType(**t.model_dump()) for t in data.incident_types]

    if data.passengers:
        incident.passengers = [models.Passenger(**p.model_dump()) for p in data.passengers]

    if data.train_operations:
        tdata = data.train_operations.model_dump(exclude_unset=True)
        _convert_times(tdata, TIME_FIELDS["train_operations"])
        incident.train_operations = models.TrainOperation(**tdata)

    if data.evacuation:
        edata = data.evacuation.model_dump(exclude_unset=True)
        _convert_times(edata, TIME_FIELDS["evacuation"])
        incident.evacuation = models.StationEvacuation(**edata)

    if data.staff:
        incident.staff = [models.StaffMember(**s.model_dump()) for s in data.staff]

    if data.impact:
        impact_data = data.impact.model_dump(exclude_unset=True)
        if impact_data.get("incident_closed"):
            impact_data["closed_at"] = datetime.utcnow()
        incident.impact = models.ImpactAssessment(**impact_data)

    db.add(incident)
    db.commit()
    db.refresh(incident)
    return incident


def get_incident(db: Session, incident_id: int) -> models.Incident | None:
    return db.query(models.Incident).filter(models.Incident.id == incident_id).first()


def list_incidents(db: Session, skip: int = 0, limit: int = 100) -> list[models.Incident]:
    return db.query(models.Incident).order_by(models.Incident.created_at.desc()).offset(skip).limit(limit).all()


def update_incident(db: Session, incident_id: int, data: schemas.IncidentUpdate) -> models.Incident | None:
    incident = get_incident(db, incident_id)
    if not incident:
        return None

    inc_data = data.model_dump(exclude_unset=True)
    nested_keys = {"detection", "incident_types", "passengers", "train_operations", "evacuation", "staff", "impact"}
    main_data = {k: v for k, v in inc_data.items() if k not in nested_keys}

    if "date" in main_data:
        main_data["date"] = parse_date(main_data["date"])
    if "time" in main_data:
        main_data["time"] = parse_time(main_data["time"])

    _apply_main(main_data, incident)

    if data.detection is not None:
        det = data.detection.model_dump(exclude_unset=True)
        _convert_times(det, TIME_FIELDS["detection"])
        if incident.detection:
            for k, v in det.items():
                setattr(incident.detection, k, v)
        else:
            incident.detection = models.IncidentDetection(**det)

    if data.incident_types is not None:
        incident.incident_types.clear()
        incident.incident_types = [models.IncidentType(**t.model_dump()) for t in data.incident_types]

    if data.passengers is not None:
        incident.passengers.clear()
        for p in data.passengers:
            pdata = p.model_dump()
            _convert_times(pdata, TIME_FIELDS["passengers"])
            incident.passengers.append(models.Passenger(**pdata))

    if data.train_operations is not None:
        tdata = data.train_operations.model_dump(exclude_unset=True)
        _convert_times(tdata, TIME_FIELDS["train_operations"])
        if incident.train_operations:
            for k, v in tdata.items():
                setattr(incident.train_operations, k, v)
        else:
            incident.train_operations = models.TrainOperation(**tdata)

    if data.evacuation is not None:
        edata = data.evacuation.model_dump(exclude_unset=True)
        _convert_times(edata, TIME_FIELDS["evacuation"])
        if incident.evacuation:
            for k, v in edata.items():
                setattr(incident.evacuation, k, v)
        else:
            incident.evacuation = models.StationEvacuation(**edata)

    if data.staff is not None:
        incident.staff.clear()
        incident.staff = [models.StaffMember(**s.model_dump()) for s in data.staff]

    if data.impact is not None:
        imp = data.impact.model_dump(exclude_unset=True)
        if incident.impact:
            for k, v in imp.items():
                setattr(incident.impact, k, v)
            if imp.get("incident_closed") and not incident.impact.closed_at:
                incident.impact.closed_at = datetime.utcnow()
        else:
            impact_obj = models.ImpactAssessment(**imp)
            if imp.get("incident_closed"):
                impact_obj.closed_at = datetime.utcnow()
            incident.impact = impact_obj

    db.commit()
    db.refresh(incident)
    return incident


def delete_incident(db: Session, incident_id: int) -> bool:
    incident = get_incident(db, incident_id)
    if not incident:
        return False
    db.delete(incident)
    db.commit()
    return True
