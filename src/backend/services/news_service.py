from typing import List
from models.schemas import NewsItem
from utils.data_fetcher import fetch_news  # For real API; mock for now

class NewsService:
    def get_top_news(self, ticker: str) -> List[NewsItem]:
        # Use real fetch (uncomment when API key set)
        # raw_news = fetch_news(ticker)
        # Process with NLP/scoring here (placeholder: mock sorting)

        # Mock data
        mock_news = [
            {"headline": f"{ticker} Earnings Beat Expectations", "source": "Polygon", "impact_score": 0.85, "rationale": "Earnings keyword, recent"},
            {"headline": "Market Volatility Due to Fed Policy", "source": "GDELT", "impact_score": 0.65, "rationale": "Sector prior, volatility context"},
            {"headline": f"{ticker} CEO Resigns Amid Scandal", "source": "Polygon", "impact_score": 0.92, "rationale": "Company mention, high recency"},
            {"headline": "Global Trade Tensions Rise", "source": "GDELT", "impact_score": 0.45, "rationale": "Geopolitical, low proximity"},
        ]
        sorted_news = sorted(mock_news, key=lambda x: x["impact_score"], reverse=True)
        return [NewsItem(**item) for item in sorted_news[:5]]