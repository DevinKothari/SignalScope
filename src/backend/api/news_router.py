from fastapi import APIRouter, Query
from models.schemas import NewsItem
from services.news_service import get_top_news

router = APIRouter(prefix="/api", tags=["News"])


@router.get("/top-news", response_model=list[NewsItem])
def top_news(ticker: str = Query(default="AAPL")):
    return get_top_news(ticker)
