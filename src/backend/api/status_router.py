from fastapi import APIRouter
from core.config import get_settings
from models.schemas import StatusResponse

router = APIRouter(prefix="/api", tags=["Status"])


@router.get("/status", response_model=StatusResponse)
def status():
    settings = get_settings()
    market_mode = "alpha_vantage" if settings.use_real_market_data and settings.alpha_vantage_api_key else "demo_backend"
    news_mode = "news_api" if settings.use_real_news_data and settings.news_api_key else "demo_backend"
    return {
        "app": "SignalScope API",
        "version": "0.3.0",
        "backend_mode": "stateless",
        "market_data": market_mode,
        "news_data": news_mode,
        "database": "not_required_for_current_mvp",
        "data_source": market_mode,
    }
