from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from ..database import get_db
from ..services.report_service import ReportService

router = APIRouter(prefix="/api/reports", tags=["reports"])


@router.get("/generate")
def generate_report(
    type: str = Query("daily"),
    line: str = Query("all"),
    from_date: Optional[str] = Query(None, alias="from"),
    to_date: Optional[str] = Query(None, alias="to"),
    db: Session = Depends(get_db),
):
    svc = ReportService(db)
    return svc.generate(
        report_type=type,
        line_filter=line,
        from_date=from_date,
        to_date=to_date,
    )
