from pydantic import BaseModel


class MonthlyTrend(BaseModel):
    month: str
    count: int


class KPIResponse(BaseModel):
    total_incidents: int
    open_incidents: int
    closed_incidents: int
    total_injuries: int
    total_fatalities: int
    avg_response_time: float | None
    avg_evacuation_time: float | None
    incidents_by_station: dict[str, int]
    incidents_by_type: dict[str, int]
    monthly_trend: list[MonthlyTrend]

    class Config:
        from_attributes = True
