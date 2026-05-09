from typing import List, Optional
from pydantic import BaseModel


class HealthResponse(BaseModel):
    status: str
    message: str
    version: str


class StatusResponse(BaseModel):
    app: str
    version: str
    backend_mode: str
    market_data: str
    news_data: str
    database: str
    data_source: str


class NewsItem(BaseModel):
    id: str
    ticker: str
    title: str
    source: str
    published_at: str
    category: str
    impact_score: int
    impact_label: str
    why_it_matters: str
    url: Optional[str] = None
    data_source: str


class ForecastCandle(BaseModel):
    period: str
    open: float
    high: float
    low: float
    close: float
    direction: str


class ForecastResponse(BaseModel):
    ticker: str
    horizon: str
    trend: str
    confidence_label: str
    volatility_label: str
    explanation: str
    data_source: str
    candles: List[ForecastCandle]


class MarketSummary(BaseModel):
    ticker: str
    company_name: str
    price: float
    change: float
    change_percent: float
    volume: int
    volatility_label: str
    session_status: str
    last_updated: str
    data_source: str


class WatchlistResponse(BaseModel):
    tickers: List[str]
    data_source: str
