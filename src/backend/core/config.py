import os
from functools import lru_cache
from pathlib import Path

from dotenv import load_dotenv


BASE_DIR = Path(__file__).resolve().parents[1]
ENV_PATH = BASE_DIR / ".env"

load_dotenv(dotenv_path=ENV_PATH)


class Settings:
    def __init__(self):
        self.alpha_vantage_api_key = os.getenv("ALPHA_VANTAGE_API_KEY", "")
        self.news_api_key = os.getenv("NEWS_API_KEY", "")
        self.use_real_market_data = os.getenv("USE_REAL_MARKET_DATA", "false").lower() == "true"
        self.use_real_news_data = os.getenv("USE_REAL_NEWS_DATA", "false").lower() == "true"


@lru_cache
def get_settings() -> Settings:
    return Settings()