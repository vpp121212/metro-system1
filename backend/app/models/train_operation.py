from datetime import time

from sqlalchemy import ForeignKey, Integer, String, Time
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..database import Base


class TrainOperation(Base):
    __tablename__ = "train_operations"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    incident_id: Mapped[int] = mapped_column(ForeignKey("incidents.id", ondelete="CASCADE"))
    train_number: Mapped[str | None] = mapped_column(String(50))
    current_location: Mapped[str | None] = mapped_column(String(200))
    destination: Mapped[str | None] = mapped_column(String(200))
    operation_mode: Mapped[str | None] = mapped_column(String(50))
    rescue_train_number: Mapped[str | None] = mapped_column(String(50))
    rescue_start_time: Mapped[time | None] = mapped_column(Time)
    rescue_end_time: Mapped[time | None] = mapped_column(Time)
    handover_to_occ_time: Mapped[time | None] = mapped_column(Time)
    return_to_service_time: Mapped[time | None] = mapped_column(Time)

    incident: Mapped["Incident"] = relationship(back_populates="train_operations")
