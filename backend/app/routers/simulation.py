from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..schemas import SimulationRequest
from ..services.simulation_service import SimulationService

router = APIRouter(prefix="/api/simulation", tags=["simulation"])


@router.post("/run")
def run_simulation(req: SimulationRequest, db: Session = Depends(get_db)):
    svc = SimulationService(db)
    return svc.run_scenario(req.scenario)


@router.post("/stop")
def stop_simulation(db: Session = Depends(get_db)):
    svc = SimulationService(db)
    return svc.stop()
