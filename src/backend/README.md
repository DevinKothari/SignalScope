# SignalScope Backend

FastAPI backend for the SignalScope MVP.

## Current Mode

- Market data: Alpha Vantage if configured, otherwise demo fallback
- News data: Demo backend for now
- Database: Not required for current MVP
- Forecasting: Rule-based data science projection

## Environment Setup

Create a `.env` file in this folder:

```env
ALPHA_VANTAGE_API_KEY=your_key_here
NEWS_API_KEY=
USE_REAL_MARKET_DATA=true
USE_REAL_NEWS_DATA=false
```

## Run

```powershell
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Test URLs

```text
http://localhost:8000/api/health
http://localhost:8000/api/status
http://localhost:8000/api/market-summary?ticker=AAPL
http://localhost:8000/api/forecast?ticker=AAPL
http://localhost:8000/api/top-news?ticker=AAPL
http://localhost:8000/api/watchlist
```
