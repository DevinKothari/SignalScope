from fastapi import APIRouter, Query

from services.prediction_service import get_prediction

router = APIRouter(prefix="/api", tags=["Prediction"])


@router.get("/prediction")
def prediction(
    ticker: str = Query(default="AAPL"),
    range: str = Query(default="1D"),
):
    return get_prediction(ticker, range)