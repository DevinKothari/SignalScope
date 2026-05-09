#Health Check Service
```mermaid
sequenceDiagram
    participant Frontend
    participant HealthRouter as health_router.py
    participant FastAPI

    Frontend->>FastAPI: GET /api/health
    FastAPI->>HealthRouter: route health()
    HealthRouter-->>FastAPI: status, message, version
    FastAPI-->>Frontend: JSON HealthResponse
```
#Status Service
```mermaid
sequenceDiagram
    participant Frontend
    participant StatusRouter as status_router.py
    participant Config as config.py
    participant FastAPI

    Frontend->>FastAPI: GET /api/status
    FastAPI->>StatusRouter: route status()
    StatusRouter->>Config: get_settings()
    Config-->>StatusRouter: API flags and key availability
    StatusRouter-->>FastAPI: backend mode, market mode, news mode
    FastAPI-->>Frontend: JSON status response
```
#Market Summary Service
```mermaid
sequenceDiagram
    participant Frontend
    participant MarketRouter as market_router.py
    participant MarketService as market_service.py
    participant Config as config.py
    participant AlphaVantage as Alpha Vantage API
    participant DemoData as demo_data.py
    participant FastAPI

    Frontend->>FastAPI: GET /api/market-summary?ticker=AAPL
    FastAPI->>MarketRouter: route market_summary(ticker)
    MarketRouter->>MarketService: get_market_summary(ticker)
    MarketService->>Config: get_settings()
    Config-->>MarketService: alpha_vantage_api_key, use_real_market_data

    alt Real market data enabled and API key exists
        MarketService->>AlphaVantage: TIME_SERIES_INTRADAY 5min, entitlement=delayed
        AlphaVantage-->>MarketService: intraday candle data
        MarketService->>MarketService: parse latest candle close, open, volume
        MarketService->>MarketService: calculate change, change_percent, volatility_label
        MarketService-->>MarketRouter: alpha_vantage_delayed market summary
    else API disabled, key missing, rate limited, or no quote data
        MarketService->>DemoData: MARKET_DEMO fallback
        DemoData-->>MarketService: demo price, change, volume, volatility
        MarketService-->>MarketRouter: demo_backend market summary
    end

    MarketRouter-->>FastAPI: Market summary JSON
    FastAPI-->>Frontend: price, change, change_percent, volume, volatility, data_source
```

#Candles Service
```mermaid
sequenceDiagram
    participant Frontend
    participant CandlesRouter as candles_router.py
    participant CandlesService as candles_service.py
    participant Config as config.py
    participant AlphaVantage as Alpha Vantage API
    participant DemoData as demo candle generator
    participant FastAPI

    Frontend->>FastAPI: GET /api/candles?ticker=NVDA&range=1W
    FastAPI->>CandlesRouter: route candles(ticker, range)
    CandlesRouter->>CandlesService: get_candles(ticker, range)
    CandlesService->>CandlesService: validate range: 1D, 1W, 1M, 3M, 1Y, 5Y
    CandlesService->>Config: get_settings()
    Config-->>CandlesService: API key and real data flag

    alt Range = 1D
        CandlesService->>AlphaVantage: TIME_SERIES_INTRADAY, interval=5min, entitlement=delayed
        AlphaVantage-->>CandlesService: 5-minute intraday OHLC candles
    else Range = 1W
        CandlesService->>AlphaVantage: TIME_SERIES_INTRADAY, interval=60min, entitlement=delayed
        AlphaVantage-->>CandlesService: hourly OHLC candles
    else Range = 1M, 3M, 1Y, 5Y
        CandlesService->>AlphaVantage: TIME_SERIES_DAILY_ADJUSTED, entitlement=delayed
        AlphaVantage-->>CandlesService: daily OHLC candles
    end

    alt Alpha Vantage returned valid series
        CandlesService->>CandlesService: select candle limit for range
        CandlesService->>CandlesService: normalize time, open, high, low, close
        CandlesService-->>CandlesRouter: alpha_vantage_delayed candles
    else API error or empty response
        CandlesService->>DemoData: generate demo candles for ticker/range
        DemoData-->>CandlesService: demo OHLC candles
        CandlesService-->>CandlesRouter: demo_backend candles
    end

    CandlesRouter-->>FastAPI: Candles JSON
    FastAPI-->>Frontend: candles array for candlestick chart
```
#Forecast Service
```mermaid
sequenceDiagram
    participant Frontend
    participant ForecastRouter as forecast_router.py
    participant ForecastService as forecast_service.py
    participant Config as config.py
    participant AlphaVantage as Alpha Vantage API
    participant MarketService as market_service.py
    participant FastAPI

    Frontend->>FastAPI: GET /api/forecast?ticker=AAPL&timeframe=hourly
    FastAPI->>ForecastRouter: route forecast(ticker, timeframe)
    ForecastRouter->>ForecastService: get_forecast(ticker, timeframe)
    ForecastService->>ForecastService: validate timeframe: hourly or daily
    ForecastService->>Config: get_settings()
    Config-->>ForecastService: API key and real data flag

    alt timeframe = hourly
        ForecastService->>AlphaVantage: TIME_SERIES_INTRADAY, interval=60min, entitlement=delayed
        AlphaVantage-->>ForecastService: hourly OHLC data
    else timeframe = daily
        ForecastService->>AlphaVantage: TIME_SERIES_DAILY_ADJUSTED, entitlement=delayed
        AlphaVantage-->>ForecastService: daily OHLC data
    end

    alt Alpha Vantage returned at least two candles
        ForecastService->>ForecastService: compare latest close vs previous close
        ForecastService->>ForecastService: calculate change_percent
        ForecastService->>ForecastService: build next 4 rule-based projected candles
        ForecastService-->>ForecastRouter: forecast response with H+ or D+ candles
    else API error or limited data
        ForecastService->>MarketService: get_market_summary(ticker)
        MarketService-->>ForecastService: latest market summary or fallback
        ForecastService->>ForecastService: build fallback rule-based projection
        ForecastService-->>ForecastRouter: fallback forecast response
    end

    ForecastRouter-->>FastAPI: ForecastResponse JSON
    FastAPI-->>Frontend: trend, confidence_label, volatility_label, projected candles
```
#Forecast Insight Service
```mermaid
sequenceDiagram
    participant Frontend
    participant ForecastRouter as forecast_router.py
    participant ForecastService as forecast_service.py
    participant FastAPI

    Frontend->>FastAPI: GET /api/forecast-insight?ticker=AAPL&timeframe=daily
    FastAPI->>ForecastRouter: route forecast_insight(ticker, timeframe)
    ForecastRouter->>ForecastService: get_forecast(ticker, timeframe)
    ForecastService-->>ForecastRouter: forecast data
    ForecastRouter->>ForecastRouter: extract summary fields only
    ForecastRouter-->>FastAPI: ticker, timeframe, trend, confidence, volatility, explanation
    FastAPI-->>Frontend: forecast insight JSON
```
#Prediction Service
```mermaid
sequenceDiagram
    participant Frontend
    participant PredictionRouter as prediction_router.py
    participant PredictionService as prediction_service.py
    participant CandlesService as candles_service.py
    participant MarketService as market_service.py
    participant FastAPI

    Frontend->>FastAPI: GET /api/prediction?ticker=NVDA&range=1W
    FastAPI->>PredictionRouter: route prediction(ticker, range)
    PredictionRouter->>PredictionService: get_prediction(ticker, range)
    PredictionService->>MarketService: get_market_summary(ticker)
    MarketService-->>PredictionService: latest price, change, volatility, volume
    PredictionService->>CandlesService: get_candles(ticker, range)
    CandlesService-->>PredictionService: OHLC candles for selected range

    alt Candle history has enough candles
        PredictionService->>PredictionService: count green/red candles
        PredictionService->>PredictionService: calculate close position inside candles
        PredictionService->>PredictionService: calculate average candle range
        PredictionService->>PredictionService: calculate price_change_percent
        PredictionService->>PredictionService: compute directional_score
        PredictionService->>PredictionService: derive bias, confidence, risk, trend strength
        PredictionService-->>PredictionRouter: range-based prediction result
    else Candle history is limited
        PredictionService->>PredictionService: use market_summary fallback
        PredictionService->>PredictionService: derive fallback bias and confidence
        PredictionService-->>PredictionRouter: fallback prediction result
    end

    PredictionRouter-->>FastAPI: Prediction JSON
    FastAPI-->>Frontend: bias, confidence, risk, trend_strength, directional_score, signals
```
#News Service
```mermaid
sequenceDiagram
    participant Frontend
    participant NewsRouter as news_router.py
    participant NewsService as news_service.py
    participant DemoData as demo_data.py
    participant FastAPI

    Frontend->>FastAPI: GET /api/top-news?ticker=AAPL
    FastAPI->>NewsRouter: route top_news(ticker)
    NewsRouter->>NewsService: get_top_news(ticker)
    NewsService->>DemoData: select ticker-specific demo headlines
    DemoData-->>NewsService: ranked demo headlines
    NewsService->>NewsService: normalize impact_score, category, rationale, timestamp
    NewsService-->>NewsRouter: news list
    NewsRouter-->>FastAPI: top news JSON
    FastAPI-->>Frontend: ranked headline feed
```
#Watchlist Service
```mermaid
sequenceDiagram
    participant Frontend
    participant WatchlistRouter as watchlist_router.py
    participant DemoData as demo_data.py
    participant FastAPI

    Frontend->>FastAPI: GET /api/watchlist
    FastAPI->>WatchlistRouter: route watchlist()
    WatchlistRouter->>DemoData: get static supported ticker list
    DemoData-->>WatchlistRouter: AAPL, NVDA, TSLA, MSFT, AMD, SPY, QQQ
    WatchlistRouter-->>FastAPI: watchlist JSON
    FastAPI-->>Frontend: quick select tickers
```
#Frontend Stock Search and Analysis Flow
```mermaid
sequenceDiagram
    participant User
    participant Frontend as React App.jsx
    participant API as services/api.js
    participant Backend as FastAPI Backend
    participant Chart as CandlestickChart.jsx
    participant Prediction as PredictionCard.jsx

    User->>Frontend: Enter ticker and click Analyze
    Frontend->>Frontend: normalize ticker and set loading state

    par Load market/news/forecast/chart/prediction data
        Frontend->>API: getTopNews(ticker)
        API->>Backend: GET /api/top-news?ticker={ticker}
        Backend-->>API: news JSON
    and
        Frontend->>API: getForecast(ticker, timeframe)
        API->>Backend: GET /api/forecast?ticker={ticker}&timeframe={timeframe}
        Backend-->>API: forecast JSON
    and
        Frontend->>API: getMarketSummary(ticker)
        API->>Backend: GET /api/market-summary?ticker={ticker}
        Backend-->>API: market summary JSON
    and
        Frontend->>API: getCandles(ticker, chartRange)
        API->>Backend: GET /api/candles?ticker={ticker}&range={range}
        Backend-->>API: candle JSON
    and
        Frontend->>API: getPrediction(ticker, chartRange)
        API->>Backend: GET /api/prediction?ticker={ticker}&range={range}
        Backend-->>API: prediction JSON
    end

    API-->>Frontend: normalized data
    Frontend->>Chart: render OHLC candlestick data
    Frontend->>Prediction: render range-based prediction
    Frontend->>Frontend: update stock overview, metrics, news, and what-to-watch sections
```
#Chart Range Change Flow
```mermaid
sequenceDiagram
    participant User
    participant Frontend as React App.jsx
    participant API as services/api.js
    participant Backend as FastAPI Backend
    participant Chart as CandlestickChart.jsx
    participant Prediction as PredictionCard.jsx

    User->>Frontend: Click chart range button: 1D, 1W, 1M, 3M, 1Y, or 5Y
    Frontend->>Frontend: setChartRange(range)

    par Refresh range-specific market view
        Frontend->>API: getCandles(activeTicker, range)
        API->>Backend: GET /api/candles?ticker={ticker}&range={range}
        Backend-->>API: range-specific OHLC candles
    and
        Frontend->>API: getPrediction(activeTicker, range)
        API->>Backend: GET /api/prediction?ticker={ticker}&range={range}
        Backend-->>API: range-specific prediction
    and
        Frontend->>API: getForecast(activeTicker, derivedTimeframe)
        API->>Backend: GET /api/forecast?ticker={ticker}&timeframe={hourly|daily}
        Backend-->>API: timeframe-specific forecast
    end

    API-->>Frontend: normalized candles, prediction, forecast
    Frontend->>Chart: update candlestick chart
    Frontend->>Prediction: update prediction card
    Frontend->>Frontend: update forecast and signal summary
```
#Fallback Data Flow
```mermaid
sequenceDiagram
    participant Frontend
    participant Backend as FastAPI Backend
    participant Service as Backend Service
    participant AlphaVantage as Alpha Vantage API
    participant DemoData as Demo Data

    Frontend->>Backend: Request market data
    Backend->>Service: execute service function
    Service->>AlphaVantage: request delayed market data

    alt API succeeds
        AlphaVantage-->>Service: valid market data
        Service-->>Backend: data_source = alpha_vantage_delayed
        Backend-->>Frontend: live delayed data
    else API limit, API failure, no data, or missing key
        AlphaVantage-->>Service: error, empty payload, or rate limit response
        Service->>DemoData: load fallback data
        DemoData-->>Service: demo dataset
        Service-->>Backend: data_source = demo_backend
        Backend-->>Frontend: fallback data response
    end
```