const companyNames = {
  AAPL: 'Apple',
  MSFT: 'Microsoft',
  NVDA: 'NVIDIA',
  TSLA: 'Tesla',
  AMD: 'AMD',
  SPY: 'S&P 500 ETF',
  QQQ: 'Nasdaq 100 ETF',
  META: 'Meta',
  AMZN: 'Amazon'
};

const categories = ['Company News', 'Volume', 'Macro', 'Sector'];

export function buildDemoNews(ticker) {
  const name = companyNames[ticker] || ticker;
  return [
    {
      headline: `${name} momentum improves after stronger sector demand`,
      source: 'Market Desk',
      impact_score: 0.88,
      category: 'Company News',
      published_at: '28 min ago',
      rationale: 'Direct ticker mention with positive demand signal and high short-term relevance.',
      takeaway: 'Potential support for bullish intraday sentiment if volume confirms.'
    },
    {
      headline: `Traders watch ${ticker} as volume rises above recent average`,
      source: 'Trading Wire',
      impact_score: 0.76,
      category: 'Volume',
      published_at: '46 min ago',
      rationale: 'Volume expansion can increase short-term movement and draw trader attention.',
      takeaway: 'Worth monitoring for continuation or rejection near key levels.'
    },
    {
      headline: 'Federal Reserve commentary keeps broader market volatility elevated',
      source: 'Macro Brief',
      impact_score: 0.63,
      category: 'Macro',
      published_at: '1 hr ago',
      rationale: 'Macro commentary can shift risk appetite across indexes and large-cap names.',
      takeaway: 'May increase volatility even when company-specific news is neutral.'
    },
    {
      headline: `${name} supplier outlook remains mixed heading into next session`,
      source: 'Sector Watch',
      impact_score: 0.51,
      category: 'Sector',
      published_at: '2 hr ago',
      rationale: 'Supplier commentary creates indirect exposure but has lower immediate conviction.',
      takeaway: 'Useful context, but not enough alone to drive a trade decision.'
    }
  ];
}

export function buildDemoForecast(ticker) {
  const base = ticker === 'TSLA' ? 275 : ticker === 'NVDA' ? 145 : ticker === 'SPY' ? 620 : ticker === 'QQQ' ? 530 : 190;
  const now = new Date();

  return Array.from({ length: 8 }, (_, index) => {
    const open = base + index * 0.9 + Math.sin(index) * 1.4;
    const close = open + (index % 2 === 0 ? 1.25 : -0.65);
    const high = Math.max(open, close) + 1.8;
    const low = Math.min(open, close) - 1.5;

    return {
      timestamp: new Date(now.getTime() + index * 15 * 60 * 1000).toISOString(),
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      lower_bound: Number((low - 0.9).toFixed(2)),
      upper_bound: Number((high + 0.9).toFixed(2))
    };
  });
}

export function buildMarketSnapshot(ticker, forecast) {
  const first = forecast[0];
  const last = forecast[forecast.length - 1];
  const change = first && last ? last.close - first.open : 0;
  const percent = first ? (change / first.open) * 100 : 0;
  const avgRange = forecast.length
    ? forecast.reduce((total, candle) => total + (candle.high - candle.low), 0) / forecast.length
    : 0;

  return {
    price: last?.close || 0,
    change,
    percent,
    volume: ticker === 'SPY' || ticker === 'QQQ' ? '54.2M' : '31.8M',
    volatility: avgRange > 4 ? 'High' : avgRange > 2.5 ? 'Moderate' : 'Low'
  };
}
