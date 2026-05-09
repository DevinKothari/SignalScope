from services.candles_service import get_candles
from services.market_service import get_market_summary


def _label_from_score(score: float) -> str:
    if score >= 2.0:
        return "Bullish"
    if score <= -2.0:
        return "Bearish"
    return "Neutral"


def _risk_from_volatility(avg_range_percent: float) -> str:
    if avg_range_percent >= 2.5:
        return "High"
    if avg_range_percent >= 1.0:
        return "Medium"
    return "Low"


def _trend_strength(score: float) -> str:
    absolute = abs(score)

    if absolute >= 5:
        return "Very Strong"
    if absolute >= 3:
        return "Strong"
    if absolute >= 1.5:
        return "Moderate"
    return "Weak"


def _confidence(score: float, risk: str) -> int:
    confidence = 50 + min(35, abs(score) * 7)

    if risk == "High":
        confidence -= 8
    elif risk == "Low":
        confidence += 4

    return int(max(45, min(92, confidence)))


def get_prediction(ticker: str, range_value: str = "1D") -> dict:
    ticker = ticker.upper().strip()

    summary = get_market_summary(ticker)
    range_value = range_value.upper().strip()
    candle_response = get_candles(ticker, range_value)
    candles = candle_response.get("candles", [])[-20:]

    if len(candles) < 4:
        change_percent = float(summary["change_percent"])
        volatility = summary["volatility_label"]

        fallback_score = change_percent * 1.2

        return {
            "ticker": ticker,
            "range": range_value,
            "bias": _label_from_score(fallback_score),
            "confidence": _confidence(fallback_score, volatility),
            "risk": volatility,
            "trend_strength": _trend_strength(fallback_score),
            "directional_score": round(fallback_score, 2),
            "signals": [
                "Prediction used market summary because candle history was limited.",
                "Signal strength may improve when more intraday candles are available.",
            ],
            "data_source": summary["data_source"],
        }

    green_candles = 0
    red_candles = 0
    strong_closes = 0
    weak_closes = 0
    total_range_percent = 0
    momentum_score = 0

    for candle in candles:
        open_price = float(candle["open"])
        high = float(candle["high"])
        low = float(candle["low"])
        close = float(candle["close"])

        if open_price <= 0:
            continue

        candle_change = close - open_price
        candle_range = max(high - low, 0.01)
        range_percent = (candle_range / open_price) * 100
        close_position = (close - low) / candle_range

        total_range_percent += range_percent

        if candle_change > 0:
            green_candles += 1
            momentum_score += 0.6
        elif candle_change < 0:
            red_candles += 1
            momentum_score -= 0.6

        if close_position >= 0.7:
            strong_closes += 1
            momentum_score += 0.4
        elif close_position <= 0.3:
            weak_closes += 1
            momentum_score -= 0.4

    first_close = float(candles[0]["close"])
    last_close = float(candles[-1]["close"])
    price_change_percent = ((last_close - first_close) / first_close) * 100 if first_close else 0

    green_ratio = green_candles / len(candles)
    red_ratio = red_candles / len(candles)
    avg_range_percent = total_range_percent / len(candles)

    directional_score = (
        momentum_score
        + price_change_percent * 1.25
        + (green_ratio - red_ratio) * 4
    )

    risk = _risk_from_volatility(avg_range_percent)
    bias = _label_from_score(directional_score)

    signals = []

    if bias == "Bullish":
        signals.append("Recent candles show stronger buying pressure than selling pressure.")
    elif bias == "Bearish":
        signals.append("Recent candles show stronger selling pressure than buying pressure.")
    else:
        signals.append("Recent candle behavior is mixed with no clear directional advantage.")

    if price_change_percent > 0:
        signals.append("Short-term price movement is trending upward.")
    elif price_change_percent < 0:
        signals.append("Short-term price movement is trending downward.")

    if strong_closes > weak_closes:
        signals.append("More candles are closing near their highs, suggesting buyer strength.")
    elif weak_closes > strong_closes:
        signals.append("More candles are closing near their lows, suggesting seller pressure.")

    if avg_range_percent >= 2.5:
        signals.append("Average candle range is elevated, increasing prediction risk.")
    elif avg_range_percent < 1:
        signals.append("Average candle range is controlled, lowering volatility risk.")

    return {
        "ticker": ticker,
        "range": range_value,
        "bias": bias,
        "confidence": _confidence(directional_score, risk),
        "risk": risk,
        "trend_strength": _trend_strength(directional_score),
        "directional_score": round(directional_score, 2),
        "signals": signals,
        "data_source": candle_response.get("data_source", summary["data_source"]),
    }