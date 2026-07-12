from pathlib import Path
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from .database import engine, Base, SessionLocal
from .seed import run_seed
from .routers import (
    dashboard, map, cameras, analytics,
    alerts, simulation, reports, settings,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        run_seed(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="TrainEye API",
    description="Riyadh Metro Command Center Dashboard Backend",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dashboard.router)
app.include_router(map.router)
app.include_router(cameras.router)
app.include_router(analytics.router)
app.include_router(alerts.router)
app.include_router(simulation.router)
app.include_router(reports.router)
app.include_router(settings.router)


@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "TrainEye API", "version": "1.0.0"}


static_dir = Path(__file__).resolve().parent.parent / "static"
if static_dir.exists():
    app.mount("/assets", StaticFiles(directory=str(static_dir / "assets")), name="assets") if (static_dir / "assets").exists() else None

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        file_path = static_dir / full_path
        if file_path.is_file():
            return FileResponse(str(file_path))
        return FileResponse(str(static_dir / "index.html"))
