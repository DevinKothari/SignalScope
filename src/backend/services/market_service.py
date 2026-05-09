from datetime import datetime
import requests

from core.config import get_settings
from services.demo_data import MARKET_DEMO, now_iso


def _session_status() -> str:
    hour = datetime.now().hour
    if 6 <= hour < 13:
        return "Market Open"
    if 13 <= hour < 17:
        return "After Hours"
    return "Market Closed"


def get_market_summary(ticker: str) -> dict:
    ticker = ticker.upper().strip()
    settings = get_settings()
    fallback_reason = "Real market data disabled or API key missing."

    if settings.use_real_market_data and settings.alpha_vantage_api_key:
        try:
            url = "https://www.alphavantage.co/query"
            params = {
                "function": "TIME_SERIES_INTRADAY",
                "symbol": ticker,
                "interval": "5min",
                "entitlement": "delayed",
                "apikey": settings.alpha_vantage_api_key,
            }

            response = requests.get(url, params=params, timeout=12)
            response.raise_for_status()
            payload = response.json()

            time_series = payload.get("Time Series (5min)", {})

            if time_series:
                latest_time = sorted(time_series.keys())[-1]
                latest_candle = time_series[latest_time]

                price = float(latest_candle.get("4. close", 0))
                open_price = float(latest_candle.get("1. open", price))
                volume = int(float(latest_candle.get("5. volume", 0)))

                change = price - open_price
                change_percent = (change / open_price) * 100 if open_price else 0
                volatility = "High" if abs(change_percent) >= 2 else "Medium" if abs(change_percent) >= 0.75 else "Low"

                return {
                    "ticker": ticker,
                    "company_name": ticker,
                    "price": round(price, 2),
                    "change": round(change, 2),
                    "change_percent": round(change_percent, 2),
                    "volume": volume,
                    "volatility_label": volatility,
                    "session_status": _session_status(),
                    "last_updated": latest_time,
                    "data_source": "alpha_vantage_delayed",
                }

            fallback_reason = payload.get("Note") or payload.get("Information") or payload.get("Error Message") or payload.get("message") or "Alpha Vantage returned no intraday data."

        except Exception as error:
            fallback_reason = f"Alpha Vantage request failed: {str(error)}"

    base = MARKET_DEMO.get(ticker, MARKET_DEMO["AAPL"])
    return {
        "ticker": ticker,
        **base,
        "session_status": _session_status(),
        "last_updated": now_iso(),
        "data_source": "demo_backend",
        "fallback_reason": fallback_reason,
        "real_market_data_enabled": settings.use_real_market_data,
        "api_key_loaded": bool(settings.alpha_vantage_api_key),
    }