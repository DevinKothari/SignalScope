from fastapi import APIRouter, Query
from models.schemas import ForecastResponse
from services.forecast_service import get_forecast

router = APIRouter(prefix="/api", tags=["Forecast"])


@router.get("/forecast", response_model=ForecastResponse)
def forecast(
    ticker: str = Query(default="AAPL"),
    timeframe: str = Query(default="hourly"),
):
    return get_forecast(ticker, timeframe)


@router.get("/forecast-insight")
def forecast_insight(
    ticker: str = Query(default="AAPL"),
    timeframe: str = Query(default="hourly"),
):
    forecast_data = get_forecast(ticker, timeframe)

    return {
        "ticker": forecast_data["ticker"],
        "timeframe": forecast_data["timeframe"],
        "trend": forecast_data["trend"],
        "confidence_label": forecast_data["confidence_label"],
        "volatility_label": forecast_data["volatility_label"],
        "explanation": forecast_data["explanation"],
        "data_source": forecast_data["data_source"],
    }