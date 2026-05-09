const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

function normalizeImpactScore(score) {
  if (typeof score !== 'number') return 0.65;
  return score > 1 ? score / 100 : score;
}

function formatVolume(value) {
  const number = Number(value || 0);
  if (!number) return 'N/A';
  if (number >= 1_000_000_000) return `${(number / 1_000_000_000).toFixed(1)}B`;
  if (number >= 1_000_000) return `${(number / 1_000_000).toFixed(1)}M`;
  if (number >= 1_000) return `${(number / 1_000).toFixed(1)}K`;
  return String(number);
}

async function fetchJson(path) {
  const response = await fetch(`${API_BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`Request failed: ${path}`);
  }
  return response.json();
}

export async function getTopNews(ticker) {
  const data = await fetchJson(`/api/top-news?ticker=${encodeURIComponent(ticker)}`);

  if (!Array.isArray(data)) return [];

  return data.map((item) => ({
    headline: item.headline || item.title || `${ticker} market update`,
    source: item.source || 'Market Feed',
    impact_score: normalizeImpactScore(item.impact_score),
    category: item.category || 'Company News',
    published_at: item.published_at || 'Recently',
    rationale: item.rationale || item.why_it_matters || 'Ranked using source timing, ticker relevance, category, and market context.',
    takeaway: item.takeaway || item.why_it_matters || 'Useful context for short-term market monitoring.',
    data_source: item.data_source || 'backend'
  }));
}

export async function getForecast(ticker) {
  const data = await fetchJson(`/api/forecast?ticker=${encodeURIComponent(ticker)}`);
  const candles = Array.isArray(data) ? data : data.candles;

  if (!Array.isArray(candles)) return [];

  const now = new Date();

  return candles.map((item, index) => {
    const high = Number(item.high || 0);
    const low = Number(item.low || 0);

    return {
      timestamp: item.timestamp || new Date(now.getTime() + index * 15 * 60 * 1000).toISOString(),
      open: Number(item.open || 0),
      high,
      low,
      close: Number(item.close || 0),
      lower_bound: Number(item.lower_bound || (low ? low - 0.75 : 0)),
      upper_bound: Number(item.upper_bound || (high ? high + 0.75 : 0)),
      direction: item.direction || 'Neutral',
      period: item.period || `T+${index + 1}`
    };
  });
}

export async function getMarketSummary(ticker) {
  const data = await fetchJson(`/api/market-summary?ticker=${encodeURIComponent(ticker)}`);

  return {
    ticker: data.ticker || ticker,
    companyName: data.company_name || data.companyName || ticker,
    price: Number(data.price || 0),
    change: Number(data.change || 0),
    percent: Number(data.change_percent || data.percent || 0),
    volume: formatVolume(data.volume),
    volatility: data.volatility_label || data.volatility || 'N/A',
    sessionStatus: data.session_status || 'N/A',
    lastUpdated: data.last_updated || new Date().toISOString(),
    dataSource: data.data_source || 'backend'
  };
}
