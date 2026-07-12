from __future__ import annotations

import datetime
import random
from typing import Optional

from sqlalchemy.orm import Session

from ..models import Alert, Train, Station


class SimulationService:
    def __init__(self, db: Session):
        self.db = db
        self._active_scenario: Optional[str] = None

    @property
    def is_running(self) -> bool:
        return self._active_scenario is not None

    def run_scenario(self, scenario: str) -> dict:
        self._active_scenario = scenario
        handlers = {
            "emergency": self._run_emergency,
            "breakdown": self._run_breakdown,
            "crowd": self._run_crowd,
            "maintenance": self._run_maintenance,
            "weather": self._run_weather,
        }
        handler = handlers.get(scenario, self._run_default)
        return handler()

    def stop(self) -> dict:
        self._active_scenario = None
        return {"status": "stopped", "scenario": None, "message": "Simulation stopped"}

    def _run_emergency(self) -> dict:
        station = self.db.query(Station).first()
        alert = Alert(
            type="critical",
            title_ar="\u0645\u062d\u0627\u0643\u0627\u0629: \u062d\u0627\u0644\u0629 \u0637\u0648\u0627\u0631\u0626",
            title_en="Simulation: Emergency Situation",
            description_ar="\u062a\u0645 \u062a\u0634\u063a\u064a\u0644 \u0645\u062d\u0627\u0643\u0627\u0629 \u062d\u0627\u0644\u0629 \u0637\u0648\u0627\u0631\u0626 \u0641\u064a \u0645\u062d\u0637\u0629 \u0627\u062e\u062a\u0628\u0627\u0631\u064a\u0629",
            description_en="Emergency scenario simulation activated at test station",
            station_id=station.id if station else None,
            is_acknowledged=False,
            created_at=datetime.datetime.utcnow(),
        )
        self.db.add(alert)
        self.db.commit()
        return {"status": "running", "scenario": "emergency", "message": "Emergency simulation started"}

    def _run_breakdown(self) -> dict:
        trains = self.db.query(Train).filter(Train.status == "active").limit(2).all()
        for t in trains:
            t.status = "maintenance"
        alert = Alert(
            type="warning",
            title_ar="\u0645\u062d\u0627\u0643\u0627\u0629: \u0639\u0637\u0644 \u0641\u064a \u0627\u0644\u0642\u0637\u0627\u0631",
            title_en="Simulation: Train Breakdown",
            description_ar="\u062a\u0645 \u062a\u0634\u063a\u064a\u0644 \u0645\u062d\u0627\u0643\u0627\u0629 \u0639\u0637\u0644 \u062a\u0642\u0646\u064a \u0641\u064a \u0642\u0637\u0627\u0631",
            description_en="Train technical breakdown simulation activated",
            is_acknowledged=False,
            created_at=datetime.datetime.utcnow(),
        )
        self.db.add(alert)
        self.db.commit()
        return {"status": "running", "scenario": "breakdown", "message": "Breakdown simulation started"}

    def _run_crowd(self) -> dict:
        alert = Alert(
            type="warning",
            title_ar="\u0645\u062d\u0627\u0643\u0627\u0629: \u0627\u0632\u062f\u062d\u0627\u0645 \u0634\u062f\u064a\u062f",
            title_en="Simulation: Heavy Crowd",
            description_ar="\u0645\u062d\u0627\u0643\u0627\u0629 \u062a\u062c\u0645\u0639 \u0643\u062b\u064a\u0641 \u0641\u064a \u0627\u0644\u0645\u062d\u0637\u0629 \u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629",
            description_en="Heavy crowd simulation at main station",
            is_acknowledged=False,
            created_at=datetime.datetime.utcnow(),
        )
        self.db.add(alert)
        self.db.commit()
        return {"status": "running", "scenario": "crowd", "message": "Crowd simulation started"}

    def _run_maintenance(self) -> dict:
        alert = Alert(
            type="info",
            title_ar="\u0645\u062d\u0627\u0643\u0627\u0629: \u0635\u064a\u0627\u0646\u0629 \u0645\u062e\u0637\u0637\u0629",
            title_en="Simulation: Scheduled Maintenance",
            description_ar="\u0645\u062d\u0627\u0643\u0627\u0629 \u0635\u064a\u0627\u0646\u0629 \u0648\u0642\u0627\u0626\u064a\u0629 \u0639\u0644\u0649 \u0633\u0643\u0629 \u062e\u0637 \u0645\u0639\u064a\u0646",
            description_en="Preventive maintenance simulation on selected line track",
            is_acknowledged=False,
            created_at=datetime.datetime.utcnow(),
        )
        self.db.add(alert)
        self.db.commit()
        return {"status": "running", "scenario": "maintenance", "message": "Maintenance simulation started"}

    def _run_weather(self) -> dict:
        alert = Alert(
            type="warning",
            title_ar="\u0645\u062d\u0627\u0643\u0627\u0629: \u0638\u0631\u0648\u0641 \u062c\u0648\u064a\u0629",
            title_en="Simulation: Weather Conditions",
            description_ar="\u0645\u062d\u0627\u0643\u0627\u0629 \u062a\u0623\u062b\u064a\u0631 \u0638\u0631\u0648\u0641 \u062c\u0648\u064a\u0629 \u0642\u0627\u0633\u064a\u0629 \u0639\u0644\u0649 \u062a\u0634\u063a\u064a\u0644 \u0627\u0644\u0642\u0637\u0627\u0631\u0627\u062a",
            description_en="Severe weather impact simulation on train operations",
            is_acknowledged=False,
            created_at=datetime.datetime.utcnow(),
        )
        self.db.add(alert)
        self.db.commit()
        return {"status": "running", "scenario": "weather", "message": "Weather simulation started"}

    def _run_default(self) -> dict:
        return {"status": "running", "scenario": "default", "message": "Default simulation started"}
