from datetime import time

from sqlalchemy import ForeignKey, Integer, String, Time
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..database import Base


class IncidentDetection(Base):
    __tablename__ = "incident_detections"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    incident_id: Mapped[int] = mapped_column(ForeignKey("incidents.id", ondelete="CASCADE"))
    discovered_by: Mapped[str | None] = mapped_column(String(100))
    first_reporter: Mapped[str | None] = mapped_column(String(100))
    emergency_code: Mapped[str | None] = mapped_column(String(50))
    permit_number: Mapped[str | None] = mapped_column(String(50))
    detection_time: Mapped[time | None] = mapped_column(Time)
    occ_notification_time: Mapped[time | None] = mapped_column(Time)
    occ_response_time: Mapped[time | None] = mapped_column(Time)

    incident: Mapped["Incident"] = relationship(back_populates="detection")
