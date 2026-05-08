import { useMemo, useState } from 'react';
import { getForecast, getTopNews } from './services/api.js';
import { buildDemoForecast, buildDemoNews } from './services/demoData.js';
import Header from './components/Header.jsx';
import SearchPanel from './components/SearchPanel.jsx';
import MetricCards from './components/MetricCards.jsx';
import NewsTable from './components/NewsTable.jsx';
import ForecastChart from './components/ForecastChart.jsx';
import MethodologyPanel from './components/MethodologyPanel.jsx';

function App() {
  const [ticker, setTicker] = useState('AAPL');
  const [activeTicker, setActiveTicker] = useState('AAPL');
  const [news, setNews] = useState(buildDemoNews('AAPL'));
  const [forecast, setForecast] = useState(buildDemoForecast('AAPL'));
  const [status, setStatus] = useState('demo');
  const [error, setError] = useState('');

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

  async function handleSearch(event) {
    event.preventDefault();
    const cleanTicker = ticker.trim().toUpperCase();
    if (!cleanTicker) return;

    setStatus('loading');
    setError('');
    setActiveTicker(cleanTicker);

    try {
      const [newsData, forecastData] = await Promise.all([
        getTopNews(cleanTicker),
        getForecast(cleanTicker)
      ]);

      setNews(Array.isArray(newsData) && newsData.length ? newsData : buildDemoNews(cleanTicker));
      setForecast(Array.isArray(forecastData) && forecastData.length ? forecastData : buildDemoForecast(cleanTicker));
      setStatus('live');
    } catch (requestError) {
      setNews(buildDemoNews(cleanTicker));
      setForecast(buildDemoForecast(cleanTicker));
      setStatus('demo');
      setError('Backend was not available, so SignalScope is showing demo data for the selected ticker.');
    }
  }

  return (
    <main className="app-shell">
      <Header />

      <section className="hero-card">
        <div>
          <p className="eyebrow">Data science backed market dashboard</p>
          <h1>SignalScope</h1>
          <p className="hero-copy">
            A lightweight market intelligence dashboard that ranks market-moving headlines and presents a short-term forecast view for retail traders.
          </p>
        </div>
        <SearchPanel ticker={ticker} setTicker={setTicker} onSearch={handleSearch} status={status} />
      </section>

      {error && <div className="notice">{error}</div>}

      <MetricCards ticker={activeTicker} summary={summary} status={status} />

      <section className="dashboard-grid">
        <ForecastChart ticker={activeTicker} forecast={forecast} />
        <NewsTable news={news} />
      </section>

      <MethodologyPanel />
    </main>
  );
}

export default App;
