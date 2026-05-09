from datetime import datetime, timezone

WATCHLIST = ["AAPL", "TSLA", "NVDA", "SPY", "MSFT"]

MARKET_DEMO = {
    "AAPL": {"company_name": "Apple Inc.", "price": 212.44, "change": 1.27, "change_percent": 0.60, "volume": 58342000, "volatility_label": "Medium"},
    "TSLA": {"company_name": "Tesla Inc.", "price": 182.36, "change": -3.84, "change_percent": -2.06, "volume": 94218000, "volatility_label": "High"},
    "NVDA": {"company_name": "NVIDIA Corporation", "price": 123.71, "change": 2.91, "change_percent": 2.41, "volume": 120772000, "volatility_label": "High"},
    "SPY": {"company_name": "SPDR S&P 500 ETF Trust", "price": 612.25, "change": 0.88, "change_percent": 0.14, "volume": 68294000, "volatility_label": "Low"},
    "MSFT": {"company_name": "Microsoft Corporation", "price": 432.10, "change": 1.62, "change_percent": 0.38, "volume": 28133000, "volatility_label": "Medium"},
}

NEWS_DEMO = {
    "AAPL": [
        ("Apple supplier updates point to stronger device demand", "Company News", 78, "High", "Supplier updates can influence expectations for revenue and margins."),
        ("Analysts watch Apple services growth ahead of next report", "Earnings", 66, "Medium", "Services growth is a key margin driver for Apple."),
    ],
    "TSLA": [
        ("Tesla shares move as investors weigh delivery expectations", "Company News", 84, "High", "Delivery expectations can quickly affect sentiment and short-term price action."),
        ("EV sector volatility remains elevated", "Sector", 72, "High", "Sector volatility can amplify moves in individual EV names."),
    ],
    "NVDA": [
        ("NVIDIA demand outlook remains in focus for chip investors", "Sector", 88, "High", "AI chip demand is closely tied to revenue expectations and momentum."),
        ("Semiconductor stocks trade higher with risk appetite", "Macro", 61, "Medium", "Risk appetite can support growth-oriented technology names."),
    ],
    "SPY": [
        ("Major indexes hold steady as investors watch economic data", "Macro", 69, "Medium", "Broad market ETFs respond heavily to macroeconomic expectations."),
        ("Market breadth improves across large-cap sectors", "Market", 58, "Medium", "Breadth can indicate whether a move is supported by multiple sectors."),
    ],
    "MSFT": [
        ("Microsoft cloud demand remains a key investor focus", "Company News", 74, "High", "Cloud growth is a major driver of Microsoft valuation."),
        ("Software sector trades mixed as rates stay in focus", "Sector", 55, "Medium", "Rate expectations can affect software valuation multiples."),
    ],
}


def now_iso():
    return datetime.now(timezone.utc).isoformat()
