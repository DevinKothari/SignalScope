from fastapi import APIRouter, Query
from models.schemas import MarketSummary
from services.market_service import get_market_summary

router = APIRouter(prefix="/api", tags=["Market"])


@router.get("/market-summary")
def market_summary(ticker: str = Query(default="AAPL")):
    return get_market_summary(ticker)
