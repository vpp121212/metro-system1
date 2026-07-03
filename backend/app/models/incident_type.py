from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..database import Base


class IncidentType(Base):
    __tablename__ = "incident_types"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    incident_id: Mapped[int] = mapped_column(ForeignKey("incidents.id", ondelete="CASCADE"))
    type_name: Mapped[str] = mapped_column(String(100))

    incident: Mapped["Incident"] = relationship(back_populates="incident_types")
