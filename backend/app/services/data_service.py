from __future__ import annotations

import datetime
import random
from typing import Optional, List

from sqlalchemy.orm import Session
from sqlalchemy import func

from ..models import (
    Line, Station, Train, Camera, Alert,
    PassengerRecord, SystemHealth,
)


class DataService:
    def __init__(self, db: Session):
        self.db = db

    def get_dashboard_summary(self) -> dict:
        active_trains = self.db.query(func.count(Train.id)).filter(Train.status == "active").scalar() or 0
        total_trains = self.db.query(func.count(Train.id)).scalar() or 0
        total_passengers = self.db.query(func.sum(PassengerRecord.count)).scalar() or 0
        hour_avg = self.db.query(func.avg(PassengerRecord.count)).scalar() or 0
        health = self.db.query(SystemHealth).order_by(SystemHealth.id.desc()).first()
        unack_alerts = self.db.query(func.count(Alert.id)).filter(
            Alert.is_acknowledged == False
        ).scalar() or 0
        critical_alerts = self.db.query(func.count(Alert.id)).filter(
            Alert.type == "critical", Alert.is_acknowledged == False
        ).scalar() or 0
        return {
            "active_trains": active_trains,
            "total_trains": total_trains,
            "passengers_per_hour": int(hour_avg),
            "total_passengers_today": total_passengers,
            "avg_delay_percent": round(random.uniform(2.5, 4.5), 1),
            "safety_score": round(random.uniform(99.5, 99.9), 1),
            "system_health": health.health_percent if health else 99.2,
            "uptime_hours": (health.uptime_seconds // 3600) if health else 720,
            "active_alerts": unack_alerts,
            "critical_alerts": critical_alerts,
            "active_cameras": self.db.query(func.count(Camera.id)).filter(Camera.status == "active").scalar() or 0,
            "total_cameras": self.db.query(func.count(Camera.id)).scalar() or 0,
        }

    def get_line_status(self) -> List[dict]:
        lines = self.db.query(Line).order_by(Line.order).all()
        result = []
        for line in lines:
            station_count = self.db.query(func.count(Station.id)).filter(Station.line_id == line.id).scalar()
            active_trains = self.db.query(func.count(Train.id)).filter(
                Train.line_id == line.id, Train.status == "active"
            ).scalar()
            status = random.choices(
                ["normal", "delayed", "issue"],
                weights=[80, 15, 5]
            )[0]
            result.append({
                "id": line.id,
                "name_ar": line.name_ar,
                "name_en": line.name_en,
                "color": line.color,
                "status": status,
                "station_count": station_count,
                "active_trains": active_trains,
                "delay_minutes": round(random.uniform(0, 8), 1) if status == "delayed" else 0,
                "passengers_today": self._line_passenger_count(line.id),
            })
        return result

    def get_recent_alerts(self, limit: int = 10) -> List[dict]:
        alerts = (
            self.db.query(Alert)
            .filter(Alert.is_acknowledged == False)
            .order_by(Alert.created_at.desc())
            .limit(limit)
            .all()
        )
        return [self._alert_dict(a) for a in alerts]

    def get_all_stations(self) -> List[dict]:
        stations = self.db.query(Station).order_by(Station.line_id, Station.order).all()
        return [self._station_dict(s) for s in stations]

    def get_line_stations(self) -> List[dict]:
        lines = self.db.query(Line).order_by(Line.order).all()
        result = []
        for line in lines:
            stations = (
                self.db.query(Station)
                .filter(Station.line_id == line.id)
                .order_by(Station.order)
                .all()
            )
            result.append({
                "id": line.id,
                "name_ar": line.name_ar,
                "name_en": line.name_en,
                "color": line.color,
                "stations": [self._station_dict(s) for s in stations],
            })
        return result

    def get_train_positions(self) -> List[dict]:
        trains = self.db.query(Train).filter(Train.status == "active").all()
        result = []
        for t in trains:
            station = t.current_station
            line = t.line
            result.append({
                "id": t.id,
                "line_id": t.line_id,
                "line_name_en": line.name_en if line else "",
                "line_color": line.color if line else "#666",
                "name": t.name,
                "status": t.status,
                "lat": station.lat + random.uniform(-0.002, 0.002) if station else 24.75,
                "lng": station.lng + random.uniform(-0.002, 0.002) if station else 46.75,
                "speed": round(random.uniform(20, 120), 1),
                "direction": t.direction,
                "current_station_id": t.current_station_id,
                "current_station_name": station.name_en if station else "Unknown",
            })
        return result

    def get_cameras(self, line_id: Optional[int] = None, status: Optional[str] = None) -> List[dict]:
        q = self.db.query(Camera)
        if line_id:
            q = q.filter(Camera.line_id == line_id)
        if status:
            q = q.filter(Camera.status == status)
        cameras = q.all()
        result = []
        for c in cameras:
            station = c.station
            result.append({
                "id": c.id,
                "station_id": c.station_id,
                "station_name": station.name_en if station else "Unknown",
                "station_name_ar": station.name_ar if station else "",
                "line_id": c.line_id,
                "status": c.status,
                "name": c.name,
            })
        return result

    def get_passenger_flow_24h(self) -> List[dict]:
        now = datetime.datetime.utcnow()
        result = []
        for h in range(24):
            ts = now - datetime.timedelta(hours=23 - h)
            hour = ts.hour
            total = (
                self.db.query(func.sum(PassengerRecord.count))
                .filter(func.strftime("%H", PassengerRecord.timestamp) == f"{hour:02d}")
                .scalar()
            ) or 0
            result.append({
                "hour": f"{hour:02d}:00",
                "passengers": total,
            })
        return result

    def get_line_distribution(self) -> List[dict]:
        lines = self.db.query(Line).order_by(Line.order).all()
        total = self.db.query(func.sum(PassengerRecord.count)).scalar() or 1
        result = []
        for line in lines:
            count = (
                self.db.query(func.sum(PassengerRecord.count))
                .filter(PassengerRecord.line_id == line.id)
                .scalar()
            ) or 0
            result.append({
                "name_ar": line.name_ar,
                "name_en": line.name_en,
                "color": line.color,
                "passengers": count,
                "percentage": round(count / total * 100, 1),
            })
        return result

    def get_weekly_data(self) -> List[dict]:
        days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        result = []
        for day in days:
            base = random.randint(200000, 400000)
            result.append({"day": day, "passengers": base})
        return result

    def get_delay_data(self) -> List[dict]:
        lines = self.db.query(Line).order_by(Line.order).all()
        return [
            {
                "name_ar": l.name_ar,
                "name_en": l.name_en,
                "color": l.color,
                "avg_delay": round(random.uniform(1.0, 6.0), 1),
                "max_delay": round(random.uniform(5.0, 15.0), 1),
                "on_time_percent": round(random.uniform(85, 98), 1),
            }
            for l in lines
        ]

    def get_performance_radar(self) -> List[dict]:
        return [
            {"metric": "Reliability", "value": round(random.uniform(85, 98), 1), "fullMark": 100},
            {"metric": "Punctuality", "value": round(random.uniform(88, 99), 1), "fullMark": 100},
            {"metric": "Safety", "value": round(random.uniform(95, 100), 1), "fullMark": 100},
            {"metric": "Efficiency", "value": round(random.uniform(80, 95), 1), "fullMark": 100},
            {"metric": "Capacity", "value": round(random.uniform(70, 90), 1), "fullMark": 100},
            {"metric": "Maintenance", "value": round(random.uniform(85, 97), 1), "fullMark": 100},
        ]

    def get_station_density(self) -> List[dict]:
        stations = (
            self.db.query(
                Station,
                func.sum(PassengerRecord.count).label("total"),
            )
            .join(PassengerRecord, PassengerRecord.station_id == Station.id)
            .group_by(Station.id)
            .order_by(func.sum(PassengerRecord.count).desc())
            .limit(10)
            .all()
        )
        return [
            {
                "name_ar": s[0].name_ar,
                "name_en": s[0].name_en,
                "density": round(min(100, (s[1] or 0) / 200), 1),
                "passengers": s[1] or 0,
            }
            for s in stations
        ]

    def get_predictions(self) -> List[dict]:
        now = datetime.datetime.utcnow()
        result = []
        for h in range(12):
            ts = now + datetime.timedelta(hours=h)
            hour = ts.hour
            actual = self._predicted_count(hour)
            result.append({
                "hour": f"{hour:02d}:00",
                "predicted": actual,
                "upper": int(actual * 1.15),
                "lower": int(actual * 0.85),
            })
        return result

    def get_alert_stats(self) -> dict:
        total = self.db.query(func.count(Alert.id)).scalar() or 0
        unacked = self.db.query(func.count(Alert.id)).filter(Alert.is_acknowledged == False).scalar() or 0
        by_type = {}
        for t in ["critical", "warning", "info"]:
            by_type[t] = self.db.query(func.count(Alert.id)).filter(
                Alert.type == t, Alert.is_acknowledged == False
            ).scalar() or 0
        return {
            "total": total,
            "unacknowledged": unacked,
            "by_type": by_type,
        }

    def _line_passenger_count(self, line_id: int) -> int:
        return self.db.query(func.sum(PassengerRecord.count)).filter(
            PassengerRecord.line_id == line_id
        ).scalar() or 0

    def _alert_dict(self, a: Alert) -> dict:
        return {
            "id": a.id,
            "type": a.type,
            "title_ar": a.title_ar,
            "title_en": a.title_en,
            "description_ar": a.description_ar,
            "description_en": a.description_en,
            "line_id": a.line_id,
            "station_id": a.station_id,
            "is_acknowledged": a.is_acknowledged,
            "created_at": a.created_at.isoformat() if a.created_at else None,
        }

    def _station_dict(self, s: Station) -> dict:
        return {
            "id": s.id,
            "name_ar": s.name_ar,
            "name_en": s.name_en,
            "line_id": s.line_id,
            "order": s.order,
            "lat": s.lat,
            "lng": s.lng,
            "is_interchange": s.is_interchange,
        }

    def _predicted_count(self, hour: int) -> int:
        pattern = {
            0: 800, 1: 400, 2: 200, 3: 150, 4: 300, 5: 600,
            6: 1500, 7: 2500, 8: 3500, 9: 3200, 10: 2800, 11: 2600,
            12: 2400, 13: 2600, 14: 2800, 15: 3000, 16: 3500, 17: 4200,
            18: 4000, 19: 3500, 20: 3000, 21: 2500, 22: 1800, 23: 1200,
        }
        return pattern.get(hour, 1000)
