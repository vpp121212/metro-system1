from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..database import Base


class ImpactAssessment(Base):
    __tablename__ = "impact_assessments"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    incident_id: Mapped[int] = mapped_column(ForeignKey("incidents.id", ondelete="CASCADE"))
    incident_duration: Mapped[int | None] = mapped_column(Integer)
    response_duration: Mapped[int | None] = mapped_column(Integer)
    train_delays: Mapped[int | None] = mapped_column(Integer)
    passengers_affected: Mapped[int | None] = mapped_column(Integer)
    injuries: Mapped[int | None] = mapped_column(Integer)
    fatalities: Mapped[int | None] = mapped_column(Integer)
    equipment_affected: Mapped[str | None] = mapped_column(String(500))
    cause: Mapped[str | None] = mapped_column(Text)
    corrective_actions: Mapped[str | None] = mapped_column(Text)
    lessons_learned: Mapped[str | None] = mapped_column(Text)
    incident_closed: Mapped[bool | None] = mapped_column(Boolean, default=False)
    closed_at: Mapped[datetime | None] = mapped_column(DateTime)

    incident: Mapped["Incident"] = relationship(back_populates="impact")
