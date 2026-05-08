const companyNames = {
  AAPL: 'Apple',
  MSFT: 'Microsoft',
  NVDA: 'NVIDIA',
  TSLA: 'Tesla',
  AMD: 'AMD',
  SPY: 'S&P 500 ETF',
  QQQ: 'Nasdaq 100 ETF'
};

export function buildDemoNews(ticker) {
  const name = companyNames[ticker] || ticker;
  return [
    {
      headline: `${name} momentum improves after stronger sector demand`,
      source: 'Market Desk',
      impact_score: 0.88,
      rationale: 'Company mention, positive demand signal, high market relevance'
    },
    {
      headline: `Analysts watch ${ticker} as volume rises above recent average`,
      source: 'Trading Wire',
      impact_score: 0.76,
      rationale: 'Ticker-specific volume signal and short-term trader attention'
    },
    {
      headline: 'Federal Reserve commentary keeps broader market volatility elevated',
      source: 'Macro Brief',
      impact_score: 0.63,
      rationale: 'Macro event may affect index direction and risk appetite'
    },
    {
      headline: `${name} supplier outlook remains mixed heading into next session`,
      source: 'Sector Watch',
      impact_score: 0.51,
      rationale: 'Indirect company exposure, moderate relevance'
    }
  ];
}

export function buildDemoForecast(ticker) {
  const base = ticker === 'TSLA' ? 275 : ticker === 'NVDA' ? 145 : ticker === 'SPY' ? 620 : 190;
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
