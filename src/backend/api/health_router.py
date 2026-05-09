from fastapi import APIRouter
from models.schemas import HealthResponse

router = APIRouter(prefix="/api", tags=["Health"])


@router.get("/health", response_model=HealthResponse)
def health():
    return {
        "status": "ok",
        "message": "SignalScope backend is running.",
        "version": "0.3.0",
    }
