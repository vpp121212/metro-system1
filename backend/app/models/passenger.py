from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..database import Base


class Passenger(Base):
    __tablename__ = "passengers"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    incident_id: Mapped[int] = mapped_column(ForeignKey("incidents.id", ondelete="CASCADE"))
    name: Mapped[str | None] = mapped_column(String(100))
    age: Mapped[int | None] = mapped_column(Integer)
    phone: Mapped[str | None] = mapped_column(String(50))
    emergency_contact: Mapped[str | None] = mapped_column(String(100))
    passenger_status: Mapped[str | None] = mapped_column(String(50))
    hospital_name: Mapped[str | None] = mapped_column(String(200))
    ambulance_ref: Mapped[str | None] = mapped_column(String(50))
    first_aid_given: Mapped[str | None] = mapped_column(String(500))

    incident: Mapped["Incident"] = relationship(back_populates="passengers")
