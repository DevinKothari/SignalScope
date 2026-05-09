from fastapi import APIRouter
from models.schemas import WatchlistResponse
from services.demo_data import WATCHLIST

router = APIRouter(prefix="/api", tags=["Watchlist"])


@router.get("/watchlist", response_model=WatchlistResponse)
def watchlist():
    return {"tickers": WATCHLIST, "data_source": "demo_backend"}
