from core.config import get_settings
from services.market_service import get_market_summary
import requests


def _direction(change: float) -> str:
    if change > 0:
        return "Bullish"
    if change < 0:
        return "Bearish"
    return "Neutral"


def _build_rule_based_projection(ticker: str, last_close: float, change_percent: float, data_source: str) -> dict:
    trend = _direction(change_percent)
    volatility_label = "High" if abs(change_percent) >= 2 else "Medium" if abs(change_percent) >= 0.75 else "Low"
    step = max(abs(change_percent) / 100, 0.003)
    bias = 1 if change_percent >= 0 else -1

    candles = []
    current = last_close
    for i in range(1, 5):
        projected_close = current * (1 + bias * step * 0.35)
        high = max(current, projected_close) * (1 + step * 0.45)
        low = min(current, projected_close) * (1 - step * 0.45)
        candles.append({
            "period": f"T+{i}",
            "open": round(current, 2),
            "high": round(high, 2),
            "low": round(low, 2),
            "close": round(projected_close, 2),
            "direction": _direction(projected_close - current),
        })
        current = projected_close

    return {
        "ticker": ticker,
        "horizon": "Next 4 candles",
        "trend": trend,
        "confidence_label": "Moderate" if volatility_label != "High" else "Cautious",
        "volatility_label": volatility_label,
        "explanation": "Projection uses recent price change and volatility to create a rule-based short-horizon view.",
        "data_source": data_source,
        "candles": candles,
    }


def get_forecast(ticker: str) -> dict:
    ticker = ticker.upper().strip()
    settings = get_settings()

    if settings.use_real_market_data and settings.alpha_vantage_api_key:
        try:
            url = "https://www.alphavantage.co/query"
            params = {
                "function": "TIME_SERIES_DAILY",
                "symbol": ticker,
                "outputsize": "compact",
                "apikey": settings.alpha_vantage_api_key,
            }
            response = requests.get(url, params=params, timeout=12)
            response.raise_for_status()
            payload = response.json()
            series = payload.get("Time Series (Daily)", {})
            if len(series) >= 2:
                dates = sorted(series.keys(), reverse=True)
                latest = float(series[dates[0]]["4. close"])
                previous = float(series[dates[1]]["4. close"])
                change_percent = ((latest - previous) / previous) * 100
                return _build_rule_based_projection(ticker, latest, change_percent, "alpha_vantage")
        except Exception:
            pass

    summary = get_market_summary(ticker)
    return _build_rule_based_projection(ticker, summary["price"], summary["change_percent"], summary["data_source"])
