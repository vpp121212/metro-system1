from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..services.data_service import DataService

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/summary")
def get_summary(db: Session = Depends(get_db)):
    svc = DataService(db)
    return svc.get_dashboard_summary()


@router.get("/line-status")
def get_line_status(db: Session = Depends(get_db)):
    svc = DataService(db)
    return svc.get_line_status()


@router.get("/recent-alerts")
def get_recent_alerts(db: Session = Depends(get_db)):
    svc = DataService(db)
    return svc.get_recent_alerts()
