import { useMemo, useState } from 'react';
import { getForecast, getMarketSummary, getTopNews } from './services/api.js';
import { buildDemoForecast, buildDemoNews, buildMarketSnapshot } from './services/demoData.js';
import Header from './components/Header.jsx';
import SearchPanel from './components/SearchPanel.jsx';
import MetricCards from './components/MetricCards.jsx';
import NewsTable from './components/NewsTable.jsx';
import ForecastChart from './components/ForecastChart.jsx';
import MethodologyPanel from './components/MethodologyPanel.jsx';
import Watchlist from './components/Watchlist.jsx';
import MarketStatus from './components/MarketStatus.jsx';

function App() {
  const [ticker, setTicker] = useState('AAPL');
  const [activeTicker, setActiveTicker] = useState('AAPL');
  const [news, setNews] = useState(buildDemoNews('AAPL'));
  const [forecast, setForecast] = useState(buildDemoForecast('AAPL'));
  const [marketSummary, setMarketSummary] = useState(null);
  const [status, setStatus] = useState('demo');
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }));

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

  return buildMarketSnapshot(activeTicker, forecast);
  }, [activeTicker, forecast, marketSummary]);
  async function analyzeTicker(symbol) {
    const cleanTicker = symbol.trim().toUpperCase();
    if (!cleanTicker) return;

    setTicker(cleanTicker);
    setStatus('loading');
    setError('');
    setActiveTicker(cleanTicker);

    try {
      const [newsData, forecastData, summaryData] = await Promise.all([
        getTopNews(cleanTicker),
        getForecast(cleanTicker),
        getMarketSummary(cleanTicker)
      ]);

      setNews(Array.isArray(newsData) && newsData.length ? newsData : buildDemoNews(cleanTicker));
      setForecast(Array.isArray(forecastData) && forecastData.length ? forecastData : buildDemoForecast(cleanTicker));
      setMarketSummary(summaryData?.price ? summaryData : null);
      setStatus(summaryData?.data_source === 'alpha_vantage' ? 'live' : 'demo');
    } catch (requestError) {
      setNews(buildDemoNews(cleanTicker));
      setForecast(buildDemoForecast(cleanTicker));
      setMarketSummary(null);
      setStatus('demo');
      setError('Backend unavailable or API limit reached. Showing demo data for the selected ticker.');
    } finally {
      setLastUpdated(new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }));
    }
  }

  function handleSearch(event) {
    event.preventDefault();
    analyzeTicker(ticker);
  }

  return (
    <main className="app-shell">
      <Header />

      <section className="hero-card">
        <div>
          <p className="eyebrow">Market intelligence dashboard</p>
          <h1>SignalScope</h1>
          <p className="hero-copy">
            A lightweight dashboard that ranks market-moving headlines and presents a short-term forecast view for active retail traders.
          </p>
        </div>
        <SearchPanel ticker={ticker} setTicker={setTicker} onSearch={handleSearch} status={status} />
      </section>

      {error && <div className="notice">{error}</div>}

      <MarketStatus lastUpdated={lastUpdated} />
      <MetricCards ticker={activeTicker} summary={summary} status={status} snapshot={snapshot} />

      <section className="dashboard-grid top-grid">
        <ForecastChart ticker={activeTicker} forecast={forecast} summary={summary} />
        <div className="side-stack">
          <Watchlist activeTicker={activeTicker} onSelect={analyzeTicker} />
          <NewsTable news={news} />
        </div>
      </section>

      <MethodologyPanel />
    </main>
  );
}

export default App;
