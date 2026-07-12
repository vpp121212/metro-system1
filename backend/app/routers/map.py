from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..services.data_service import DataService

router = APIRouter(prefix="/api/map", tags=["map"])


@router.get("/lines")
def get_lines_with_stations(db: Session = Depends(get_db)):
    svc = DataService(db)
    return svc.get_line_stations()


@router.get("/trains")
def get_train_positions(db: Session = Depends(get_db)):
    svc = DataService(db)
    return svc.get_train_positions()


@router.get("/stations")
def get_all_stations(db: Session = Depends(get_db)):
    svc = DataService(db)
    return svc.get_all_stations()
