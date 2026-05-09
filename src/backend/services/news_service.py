from services.demo_data import NEWS_DEMO, now_iso


def get_top_news(ticker: str) -> list[dict]:
    ticker = ticker.upper().strip()
    items = NEWS_DEMO.get(ticker, NEWS_DEMO["AAPL"])
    output = []
    for idx, (title, category, score, label, reason) in enumerate(items, start=1):
        output.append({
            "id": f"{ticker}-{idx}",
            "ticker": ticker,
            "title": title,
            "source": "Demo Market Wire",
            "published_at": now_iso(),
            "category": category,
            "impact_score": score,
            "impact_label": label,
            "why_it_matters": reason,
            "url": None,
            "data_source": "demo_backend",
        })
    return output
