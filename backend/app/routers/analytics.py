from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..services.data_service import DataService

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


@router.get("/passenger-flow")
def get_passenger_flow(db: Session = Depends(get_db)):
    svc = DataService(db)
    return svc.get_passenger_flow_24h()


@router.get("/line-distribution")
def get_line_distribution(db: Session = Depends(get_db)):
    svc = DataService(db)
    return svc.get_line_distribution()


@router.get("/weekly")
def get_weekly(db: Session = Depends(get_db)):
    svc = DataService(db)
    return svc.get_weekly_data()


@router.get("/delays")
def get_delays(db: Session = Depends(get_db)):
    svc = DataService(db)
    return svc.get_delay_data()


@router.get("/performance")
def get_performance(db: Session = Depends(get_db)):
    svc = DataService(db)
    return svc.get_performance_radar()


@router.get("/station-density")
def get_station_density(db: Session = Depends(get_db)):
    svc = DataService(db)
    return svc.get_station_density()


@router.get("/predictions")
def get_predictions(db: Session = Depends(get_db)):
    svc = DataService(db)
    return svc.get_predictions()
