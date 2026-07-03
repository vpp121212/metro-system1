from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import schemas
from ..database import get_db
from ..services import incident_service
from ..services.pdf_service import generate_incident_report
from ..services.incident_service import get_incident

router = APIRouter(prefix="/api/incidents", tags=["incidents"])


@router.post("", response_model=schemas.IncidentDetailResponse)
def create(data: schemas.IncidentCreate, db: Session = Depends(get_db)):
    return incident_service.create_incident(db, data)


@router.get("", response_model=list[schemas.IncidentListItem])
def list_all(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    incidents = incident_service.list_incidents(db, skip=skip, limit=limit)
    return incidents


@router.get("/{incident_id}", response_model=schemas.IncidentDetailResponse)
def get(incident_id: int, db: Session = Depends(get_db)):
    incident = get_incident(db, incident_id)
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    return incident


@router.put("/{incident_id}", response_model=schemas.IncidentDetailResponse)
def update(incident_id: int, data: schemas.IncidentUpdate, db: Session = Depends(get_db)):
    incident = incident_service.update_incident(db, incident_id, data)
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    return incident


@router.delete("/{incident_id}")
def delete(incident_id: int, db: Session = Depends(get_db)):
    deleted = incident_service.delete_incident(db, incident_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Incident not found")
    return {"message": "Incident deleted successfully"}


@router.get("/{incident_id}/report")
def download_report(incident_id: int, db: Session = Depends(get_db)):
    incident = get_incident(db, incident_id)
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    return generate_incident_report(incident)
