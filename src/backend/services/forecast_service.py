import requests

from core.config import get_settings
from services.market_service import get_market_summary


def _direction(change: float) -> str:
    if change > 0:
        return "Bullish"
    if change < 0:
        return "Bearish"
    return "Neutral"


def _volatility_label(change_percent: float) -> str:
    if abs(change_percent) >= 2:
        return "High"
    if abs(change_percent) >= 0.75:
        return "Medium"
    return "Low"


def _series_key_for_timeframe(timeframe: str) -> str:
    if timeframe == "hourly":
        return "Time Series (60min)"
    return "Time Series (Daily)"


def _alpha_vantage_params(ticker: str, timeframe: str, api_key: str) -> dict:
    if timeframe == "hourly":
        return {
            "function": "TIME_SERIES_INTRADAY",
            "symbol": ticker,
            "interval": "60min",
            "outputsize": "compact",
            "entitlement": "delayed",
            "apikey": api_key,
        }

    return {
        "function": "TIME_SERIES_DAILY_ADJUSTED",
        "symbol": ticker,
        "outputsize": "compact",
        "entitlement": "delayed",
        "apikey": api_key,
    }


def _build_rule_based_projection(
    ticker: str,
    last_close: float,
    change_percent: float,
    data_source: str,
    timeframe: str,
) -> dict:
    trend = _direction(change_percent)
    volatility_label = _volatility_label(change_percent)
    step = max(abs(change_percent) / 100, 0.003)
    bias = 1 if change_percent >= 0 else -1

    period_prefix = "H" if timeframe == "hourly" else "D"
    horizon = "Next 4 hourly candles" if timeframe == "hourly" else "Next 4 daily candles"

    candles = []
    current = last_close

    for i in range(1, 5):
        projected_close = current * (1 + bias * step * 0.35)
        high = max(current, projected_close) * (1 + step * 0.45)
        low = min(current, projected_close) * (1 - step * 0.45)

        candles.append({
            "period": f"{period_prefix}+{i}",
            "open": round(current, 2),
            "high": round(high, 2),
            "low": round(low, 2),
            "close": round(projected_close, 2),
            "direction": _direction(projected_close - current),
            "timeframe": timeframe,
        })

        current = projected_close

    return {
        "ticker": ticker,
        "timeframe": timeframe,
        "horizon": horizon,
        "trend": trend,
        "confidence_label": "Moderate" if volatility_label != "High" else "Cautious",
        "volatility_label": volatility_label,
        "explanation": (
            "Projection uses recent hourly candle movement for short-term analysis."
            if timeframe == "hourly"
            else "Projection uses recent daily candle movement for broader trend context."
        ),
        "data_source": data_source,
        "candles": candles,
    }


def get_forecast(ticker: str, timeframe: str = "hourly") -> dict:
    ticker = ticker.upper().strip()
    timeframe = timeframe.lower().strip()

    if timeframe not in ["hourly", "daily"]:
        timeframe = "hourly"

    settings = get_settings()

    if settings.use_real_market_data and settings.alpha_vantage_api_key:
        try:
            url = "https://www.alphavantage.co/query"
            params = _alpha_vantage_params(ticker, timeframe, settings.alpha_vantage_api_key)

            response = requests.get(url, params=params, timeout=12)
            response.raise_for_status()

            payload = response.json()
            series = payload.get(_series_key_for_timeframe(timeframe), {})

            if len(series) >= 2:
                periods = sorted(series.keys(), reverse=True)
                latest = float(series[periods[0]]["4. close"])
                previous = float(series[periods[1]]["4. close"])
                change_percent = ((latest - previous) / previous) * 100 if previous else 0

                return _build_rule_based_projection(
                    ticker=ticker,
                    last_close=latest,
                    change_percent=change_percent,
                    data_source="alpha_vantage_delayed",
                    timeframe=timeframe,
                )

        except Exception:
            pass

    summary = get_market_summary(ticker)

    return _build_rule_based_projection(
        ticker=ticker,
        last_close=summary["price"],
        change_percent=summary["change_percent"],
        data_source=summary["data_source"],
        timeframe=timeframe,
    )