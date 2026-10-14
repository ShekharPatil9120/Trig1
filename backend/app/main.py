from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router

app = FastAPI(
    title="Student Record Management API",
    version="0.1.0",
    description="Backend API for the School Student Record Management System.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
    expose_headers=["Content-Disposition"],
)

app.include_router(api_router)


@app.get("/")
def root() -> dict[str, str]:
    return {
        "message": "Student Record Management API is running",
        "health": "/health",
        "docs": "/docs",
    }


@app.get("/favicon.ico", include_in_schema=False)
def favicon() -> Response:
    return Response(status_code=204)


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}
