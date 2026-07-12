from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from ..database import get_db
from ..services.data_service import DataService

router = APIRouter(prefix="/api/cameras", tags=["cameras"])


@router.get("")
def get_cameras(
    line: Optional[int] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    svc = DataService(db)
    return svc.get_cameras(line_id=line, status=status)
