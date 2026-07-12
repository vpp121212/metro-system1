from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Settings
from ..schemas import SettingsOut, SettingsUpdate

router = APIRouter(prefix="/api/settings", tags=["settings"])


@router.get("")
def get_settings(db: Session = Depends(get_db)):
    settings = db.query(Settings).first()
    if not settings:
        settings = Settings()
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return SettingsOut.model_validate(settings)


@router.put("")
def update_settings(update: SettingsUpdate, db: Session = Depends(get_db)):
    settings = db.query(Settings).first()
    if not settings:
        settings = Settings()
        db.add(settings)
        db.commit()
        db.refresh(settings)

    update_data = update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(settings, key, value)
    db.commit()
    db.refresh(settings)
    return SettingsOut.model_validate(settings)
