from __future__ import annotations

import datetime
from typing import Optional

from sqlalchemy.orm import Session
from sqlalchemy import func

from ..models import Line, PassengerRecord, Train, Alert, Station


class ReportService:
    def __init__(self, db: Session):
        self.db = db

    def generate(
        self,
        report_type: str = "daily",
        line_filter: str = "all",
        from_date: Optional[str] = None,
        to_date: Optional[str] = None,
    ) -> dict:
        now = datetime.datetime.utcnow()
        if report_type == "daily":
            start = now - datetime.timedelta(days=1)
        elif report_type == "weekly":
            start = now - datetime.timedelta(weeks=1)
        elif report_type == "monthly":
            start = now - datetime.timedelta(days=30)
        else:
            start = now - datetime.timedelta(days=1)

        if from_date:
            try:
                start = datetime.datetime.fromisoformat(from_date)
            except ValueError:
                pass

        query = self.db.query(PassengerRecord).filter(PassengerRecord.timestamp >= start)
        if line_filter != "all":
            try:
                line_id = int(line_filter)
                query = query.filter(PassengerRecord.line_id == line_id)
            except ValueError:
                pass

        total_passengers = query.with_entities(func.sum(PassengerRecord.count)).scalar() or 0
        avg_density = query.with_entities(func.avg(PassengerRecord.density_percent)).scalar() or 0

        lines = self.db.query(Line).order_by(Line.order).all()
        line_data = []
        for line in lines:
            lq = query.filter(PassengerRecord.line_id == line.id)
            count = lq.with_entities(func.sum(PassengerRecord.count)).scalar() or 0
            line_data.append({
                "name_ar": line.name_ar,
                "name_en": line.name_en,
                "color": line.color,
                "passengers": count,
            })

        active_trains = self.db.query(func.count(Train.id)).filter(Train.status == "active").scalar() or 0
        total_trains = self.db.query(func.count(Train.id)).scalar() or 0
        total_stations = self.db.query(func.count(Station.id)).scalar() or 0
        critical_alerts = self.db.query(func.count(Alert.id)).filter(
            Alert.type == "critical", Alert.is_acknowledged == False
        ).scalar() or 0

        return {
            "report_type": report_type,
            "period": {
                "from": start.isoformat(),
                "to": now.isoformat(),
            },
            "summary": {
                "total_passengers": total_passengers,
                "average_density": round(avg_density, 1),
                "active_trains": active_trains,
                "total_trains": total_trains,
                "total_stations": total_stations,
                "critical_alerts": critical_alerts,
                "system_health": round(99.2, 1),
            },
            "line_data": line_data,
            "generated_at": now.isoformat(),
        }
