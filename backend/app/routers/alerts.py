from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Alert
from ..services.data_service import DataService

router = APIRouter(prefix="/api/alerts", tags=["alerts"])


@router.get("/stats")
def get_alert_stats(db: Session = Depends(get_db)):
    svc = DataService(db)
    return svc.get_alert_stats()


@router.get("")
def get_alerts(
    type: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(Alert).order_by(Alert.created_at.desc())
    if type:
        q = q.filter(Alert.type == type)
    alerts = q.all()
    svc = DataService(db)
    return [svc._alert_dict(a) for a in alerts]


@router.put("/{alert_id}/acknowledge")
def acknowledge_alert(alert_id: int, db: Session = Depends(get_db)):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    alert.is_acknowledged = True
    db.commit()
    svc = DataService(db)
    return svc._alert_dict(alert)


@router.delete("/{alert_id}")
def delete_alert(alert_id: int, db: Session = Depends(get_db)):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    db.delete(alert)
    db.commit()
    return {"status": "deleted", "id": alert_id}
