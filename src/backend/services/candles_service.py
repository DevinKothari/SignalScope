from datetime import datetime
import requests

from core.config import get_settings


VALID_RANGES = ["1D", "1W", "1M", "3M", "1Y", "5Y"]


def _safe_range(range_value: str) -> str:
    range_value = range_value.upper().strip()
    return range_value if range_value in VALID_RANGES else "1D"


def _alpha_vantage_params(ticker: str, range_value: str, api_key: str) -> dict:
    if range_value == "1D":
        return {
            "function": "TIME_SERIES_INTRADAY",
            "symbol": ticker,
            "interval": "5min",
            "outputsize": "full",
            "entitlement": "delayed",
            "apikey": api_key,
        }

    if range_value == "1W":
        return {
            "function": "TIME_SERIES_INTRADAY",
            "symbol": ticker,
            "interval": "60min",
            "outputsize": "full",
            "entitlement": "delayed",
            "apikey": api_key,
        }

    return {
        "function": "TIME_SERIES_DAILY_ADJUSTED",
        "symbol": ticker,
        "outputsize": "full" if range_value == "5Y" else "compact",
        "entitlement": "delayed",
        "apikey": api_key,
    }


def _series_key(range_value: str) -> str:
    if range_value == "1D":
        return "Time Series (5min)"
    if range_value == "1W":
        return "Time Series (60min)"
    return "Time Series (Daily)"


def _limit_for_range(range_value: str) -> int:
    limits = {
        "1D": 78,
        "1W": 40,
        "1M": 22,
        "3M": 66,
        "1Y": 252,
        "5Y": 1260,
    }

    return limits.get(range_value, 78)


def _format_candle(timestamp: str, candle: dict, range_value: str) -> dict:
    if range_value in ["1D", "1W"]:
        time_value = timestamp.replace(" ", "T")
    else:
        time_value = timestamp

    return {
        "time": time_value,
        "open": round(float(candle.get("1. open", 0)), 4),
        "high": round(float(candle.get("2. high", 0)), 4),
        "low": round(float(candle.get("3. low", 0)), 4),
        "close": round(float(candle.get("4. close", 0)), 4),
    }


def _demo_candles(ticker: str, range_value: str) -> dict:
    base_prices = {
        "AAPL": 212.44,
        "TSLA": 178.25,
        "NVDA": 124.91,
        "MSFT": 418.72,
        "SPY": 520.31,
    }

    base = base_prices.get(ticker, base_prices["AAPL"])
    count = _limit_for_range(range_value)

    candles = []
    current = base

    for index in range(count):
        change = ((index % 7) - 3) * 0.08
        open_price = current
        close_price = max(1, open_price + change)
        high_price = max(open_price, close_price) + 0.35
        low_price = min(open_price, close_price) - 0.35

        candles.append({
            "time": index + 1,
            "open": round(open_price, 2),
            "high": round(high_price, 2),
            "low": round(low_price, 2),
            "close": round(close_price, 2),
        })

        current = close_price

    return {
        "ticker": ticker,
        "range": range_value,
        "data_source": "demo_backend",
        "candles": candles,
        "last_updated": datetime.utcnow().isoformat(),
    }


def get_candles(ticker: str, range_value: str) -> dict:
    ticker = ticker.upper().strip()
    range_value = _safe_range(range_value)
    settings = get_settings()

    if settings.use_real_market_data and settings.alpha_vantage_api_key:
        try:
            url = "https://www.alphavantage.co/query"
            params = _alpha_vantage_params(ticker, range_value, settings.alpha_vantage_api_key)

            response = requests.get(url, params=params, timeout=15)
            response.raise_for_status()

            payload = response.json()
            series = payload.get(_series_key(range_value), {})

            if series:
                timestamps = sorted(series.keys())[-_limit_for_range(range_value):]
                candles = [
                    _format_candle(timestamp, series[timestamp], range_value)
                    for timestamp in timestamps
                ]

                return {
                    "ticker": ticker,
                    "range": range_value,
                    "data_source": "alpha_vantage_delayed",
                    "candles": candles,
                    "last_updated": datetime.utcnow().isoformat(),
                }

        except Exception:
            pass

    return _demo_candles(ticker, range_value)