from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import schemas
from ..database import get_db
from ..services import kpi_service

router = APIRouter(prefix="/api/kpi", tags=["kpi"])


@router.get("", response_model=schemas.KPIResponse)
def get_kpi(db: Session = Depends(get_db)):
    return kpi_service.get_kpi_data(db)
