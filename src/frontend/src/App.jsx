import { useMemo, useState } from 'react';
import { getCandles, getForecast, getMarketSummary, getTopNews } from './services/api.js';
import { buildDemoForecast, buildDemoNews, buildMarketSnapshot } from './services/demoData.js';
import Header from './components/Header.jsx';
import SearchPanel from './components/SearchPanel.jsx';
import MetricCards from './components/MetricCards.jsx';
import NewsTable from './components/NewsTable.jsx';
import ForecastChart from './components/ForecastChart.jsx';
import MethodologyPanel from './components/MethodologyPanel.jsx';
import Watchlist from './components/Watchlist.jsx';
import MarketStatus from './components/MarketStatus.jsx';
import StockHeader from './components/StockHeader.jsx';
import AnalysisSummary from './components/AnalysisSummary.jsx';
import CandlestickChart from './components/CandlestickChart.jsx';

function App() {
  const [ticker, setTicker] = useState('AAPL');
  const [activeTicker, setActiveTicker] = useState(null);
  const [timeframe, setTimeframe] = useState('hourly');
  const [news, setNews] = useState(buildDemoNews('AAPL'));
  const [forecast, setForecast] = useState(buildDemoForecast('AAPL'));
  const [chartRange, setChartRange] = useState('1D');
  const [candles, setCandles] = useState([]);
  const [marketSummary, setMarketSummary] = useState(null);
  const [status, setStatus] = useState('demo');
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(
    new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  );

  const summary = useMemo(() => {
    const topNews = news[0];
    const first = forecast[0];
    const last = forecast[forecast.length - 1];
    const direction = first && last ? last.close - first.open : 0;

    return {
      topImpact: topNews ? Math.round(topNews.impact_score * 100) : 0,
      direction,
      confidence: Math.min(92, Math.max(55, Math.round((topNews?.impact_score || 0.65) * 100))),
      candles: forecast.length
    };
  }, [news, forecast]);

  const snapshot = useMemo(() => {
    if (marketSummary) {
      return {
        price: marketSummary.price ?? 0,
        change: marketSummary.change ?? 0,
        percent: marketSummary.change_percent ?? marketSummary.percent ?? 0,
        volume: marketSummary.volume ?? 0,
        volatility: marketSummary.volatility_label ?? marketSummary.volatility ?? 'Low'
      };
    }

    return buildMarketSnapshot(activeTicker || 'AAPL', forecast);
  }, [activeTicker, forecast, marketSummary]);

  async function analyzeTicker(symbol) {
    const cleanTicker = symbol.trim().toUpperCase();
    if (!cleanTicker) return;

    setTicker(cleanTicker);
    setStatus('loading');
    setError('');
    setActiveTicker(cleanTicker);

    try {
      const [newsData, forecastData, summaryData, candleData] = await Promise.all([
        getTopNews(cleanTicker),
        getForecast(cleanTicker, timeframe),
        getMarketSummary(cleanTicker),
        getCandles(cleanTicker, chartRange)
      ]);

      setNews(Array.isArray(newsData) && newsData.length ? newsData : buildDemoNews(cleanTicker));
      setForecast(Array.isArray(forecastData) && forecastData.length ? forecastData : buildDemoForecast(cleanTicker));
      setCandles(Array.isArray(candleData) ? candleData : []);
      setMarketSummary(summaryData?.price ? summaryData : null);
      setStatus(
        summaryData?.data_source === 'alpha_vantage' || summaryData?.data_source === 'alpha_vantage_delayed'
          ? 'live'
          : 'demo'
      );
    } catch (requestError) {
      setNews(buildDemoNews(cleanTicker));
      setForecast(buildDemoForecast(cleanTicker));
      setMarketSummary(null);
      setStatus('demo');
      setError('Backend unavailable or API limit reached. Showing fallback data for the selected ticker.');
    } finally {
      setLastUpdated(new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }));
    }
  }

  async function handleChartRangeChange(range) {
    if (!activeTicker) return;

    setChartRange(range);

    try {
      const candleData = await getCandles(activeTicker, range);
      setCandles(Array.isArray(candleData) ? candleData : []);
    } catch {
      setCandles([]);
    }
  }

  function handleSearch(event) {
    event.preventDefault();
    analyzeTicker(ticker);
  }

  function goHome() {
    setActiveTicker(null);
    setError('');
  }

  if (!activeTicker) {
    return (
      <main className="app-shell">
        <Header />

        <section className="hero-card">
          <div>
            <p className="eyebrow">Market intelligence dashboard</p>
            <h1>SignalScope</h1>
            <p className="hero-copy">
              Search a stock to view price movement, ranked market headlines, and a short-term rule-based forecast.
            </p>
          </div>

          <SearchPanel ticker={ticker} setTicker={setTicker} onSearch={handleSearch} status={status} />
        </section>

        <section className="dashboard-grid top-grid">
          <div className="panel-card">
            <p className="eyebrow">Start with a ticker</p>
            <h2>Look up a stock</h2>
            <p>
              Enter a symbol like AAPL, TSLA, NVDA, MSFT, or SPY to open a dedicated stock analysis page.
            </p>
          </div>

          <div className="side-stack">
            <Watchlist activeTicker={activeTicker} onSelect={analyzeTicker} />
            <div className="panel-card">
              <p className="eyebrow">Data mode</p>
              <h3>Market data is delayed</h3>
              <p>
                SignalScope currently uses Alpha Vantage delayed market data with fallback demo data when external
                API limits or errors occur.
              </p>
            </div>
          </div>
        </section>

        <MethodologyPanel />
      </main>
    );
  }

  return (
    <main className="app-shell">
      <Header />

      <button className="back-button" onClick={goHome}>
        ← Back to search
      </button>

      <section className="hero-card stock-hero">
        <div>
          <p className="eyebrow">Stock analysis</p>
          <h1>{activeTicker}</h1>
          <p className="hero-copy">
            {status === 'live'
              ? 'Using Alpha Vantage 15-minute delayed market data.'
              : 'Using fallback market data while live data is unavailable.'}
          </p>
        </div>

        <SearchPanel ticker={ticker} setTicker={setTicker} onSearch={handleSearch} status={status} />
      </section>

      {error && <div className="notice">{error}</div>}

      <StockHeader ticker={activeTicker} snapshot={snapshot} status={status} />
      <MarketStatus lastUpdated={lastUpdated} />
      <MetricCards ticker={activeTicker} summary={summary} status={status} snapshot={snapshot} />
      <AnalysisSummary summary={summary} snapshot={snapshot} status={status} />
      
      <section className="timeframe-toggle-card">
        <div>
          <p className="eyebrow">Forecast timeframe</p>
          <h3>{timeframe === 'hourly' ? 'Hourly candle analysis' : 'Daily candle analysis'}</h3>
        </div>

        <div className="timeframe-toggle-group">
          <button
            className={timeframe === 'hourly' ? 'timeframe-button active' : 'timeframe-button'}
            onClick={() => {
              setTimeframe('hourly');
              analyzeTicker(activeTicker);
            }}
          >
            Hourly
          </button>

          <button
            className={timeframe === 'daily' ? 'timeframe-button active' : 'timeframe-button'}
            onClick={() => {
              setTimeframe('daily');
              analyzeTicker(activeTicker);
            }}
          >
            Daily
          </button>
        </div>
      </section>

      <section className="stock-detail-layout">
        <div className="stock-main-column">
          <section className="chart-shell">
            <div className="range-toggle-group">
              {['1D', '1W', '1M', '3M', '1Y', '5Y'].map((range) => (
                <button
                  key={range}
                  className={chartRange === range ? 'range-button active' : 'range-button'}
                  onClick={() => handleChartRangeChange(range)}
                >
                  {range}
                </button>
              ))}
            </div>

            <CandlestickChart ticker={activeTicker} range={chartRange} candles={candles} />
          </section>

          <section className="watch-card">
            <p className="eyebrow">What to watch</p>
            <h3>Key signals for {activeTicker}</h3>
            <ul>
              <li>Price reaction compared with recent candle direction</li>
              <li>Headline impact score and category concentration</li>
              <li>Volatility level compared with recent volume</li>
              <li>Whether the rule-based forecast bias stays consistent</li>
            </ul>
          </section>
        </div>

        <aside className="stock-side-column">
          <Watchlist activeTicker={activeTicker} onSelect={analyzeTicker} />
          <NewsTable news={news} />
        </aside>
      </section>

      <MethodologyPanel />
    </main>
  );
}

export default App;