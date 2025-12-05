from pydantic import BaseModel

class NewsItem(BaseModel):
    headline: str
    source: str
    impact_score: float
    rationale: str

class ForecastItem(BaseModel):
    timestamp: str
    open: float
    high: float
    low: float
    close: float
    lower_bound: float
    upper_bound: float