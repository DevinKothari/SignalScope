from fastapi import APIRouter, Query

from services.candles_service import get_candles

router = APIRouter(prefix="/api", tags=["Candles"])


@router.get("/candles")
def candles(
    ticker: str = Query(default="AAPL"),
    range: str = Query(default="1D"),
):
    return get_candles(ticker, range)