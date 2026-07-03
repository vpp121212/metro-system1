import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

from .database import engine, Base
from .routers import incidents, kpi

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Smart Metro Operations Management System",
    description="Smart Metro Station Operations Management System",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(incidents.router)
app.include_router(kpi.router)


@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "Smart Metro Operations System is running"}


static_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "static")
assets_dir = os.path.join(static_dir, "assets")
if os.path.isdir(assets_dir):
    app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")


if os.path.isdir(static_dir):
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        if not full_path or full_path == "index.html":
            index_path = os.path.join(static_dir, "index.html")
            if os.path.isfile(index_path):
                return FileResponse(index_path, media_type="text/html")
        raise HTTPException(status_code=404, detail="Not found")
else:
    @app.get("/{full_path:path}")
    async def not_found(full_path: str):
        raise HTTPException(status_code=404, detail="Not found")
