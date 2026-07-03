from datetime import time

from sqlalchemy import ForeignKey, Integer, String, Time
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..database import Base


class StationEvacuation(Base):
    __tablename__ = "station_evacuations"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    incident_id: Mapped[int] = mapped_column(ForeignKey("incidents.id", ondelete="CASCADE"))
    evacuation_order_time: Mapped[time | None] = mapped_column(Time)
    evacuation_start_time: Mapped[time | None] = mapped_column(Time)
    evacuation_completion_time: Mapped[time | None] = mapped_column(Time)
    station_clear_notification_time: Mapped[time | None] = mapped_column(Time)
    station_reopening_time: Mapped[time | None] = mapped_column(Time)

    incident: Mapped["Incident"] = relationship(back_populates="evacuation")
