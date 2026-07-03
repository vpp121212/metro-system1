from datetime import date, timedelta

from sqlalchemy import func
from sqlalchemy.orm import Session

from .. import models


def get_kpi_data(db: Session) -> dict:
    total = db.query(func.count(models.Incident.id)).scalar() or 0
    open_count = db.query(func.count(models.Incident.id)).join(
        models.ImpactAssessment, models.Incident.impact
    ).filter(
        (models.ImpactAssessment.incident_closed == False) | (models.ImpactAssessment.incident_closed == None)
    ).scalar() or 0
    closed_count = total - open_count

    injuries = db.query(func.coalesce(func.sum(models.ImpactAssessment.injuries), 0)).scalar() or 0
    fatalities = db.query(func.coalesce(func.sum(models.ImpactAssessment.fatalities), 0)).scalar() or 0

    avg_response = db.query(func.avg(models.ImpactAssessment.response_duration)).scalar()
    avg_evacuation = db.query(
        func.avg(models.ImpactAssessment.incident_duration)
    ).scalar()

    # By station
    station_rows = db.query(
        models.Incident.station, func.count(models.Incident.id)
    ).group_by(models.Incident.station).all()
    by_station = {s or "Unspecified": c for s, c in station_rows}

    # By type
    type_rows = db.query(
        models.IncidentType.type_name, func.count(models.IncidentType.id)
    ).group_by(models.IncidentType.type_name).all()
    by_type = {t or "Unspecified": c for t, c in type_rows}

    # Monthly trend
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
              "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    trend = []
    for m in months:
        trend.append({"month": m, "count": 0})

    return {
        "total_incidents": total,
        "open_incidents": open_count,
        "closed_incidents": closed_count,
        "total_injuries": injuries,
        "total_fatalities": fatalities,
        "avg_response_time": round(avg_response, 1) if avg_response else None,
        "avg_evacuation_time": round(avg_evacuation, 1) if avg_evacuation else None,
        "incidents_by_station": by_station,
        "incidents_by_type": by_type,
        "monthly_trend": trend,
    }
