function formatPrice(value) {
  const number = Number(value ?? 0);
  return number ? `$${number.toFixed(2)}` : 'N/A';
}

function formatMove(change, percent) {
  const safeChange = Number(change ?? 0);
  const safePercent = Number(percent ?? 0);
  const sign = safeChange >= 0 ? '+' : '';

  return `${sign}${safeChange.toFixed(2)} (${sign}${safePercent.toFixed(2)}%)`;
}

function formatVolume(value) {
  const number = Number(value ?? 0);

  if (!number) return 'N/A';
  if (number >= 1_000_000_000) return `${(number / 1_000_000_000).toFixed(2)}B`;
  if (number >= 1_000_000) return `${(number / 1_000_000).toFixed(2)}M`;
  if (number >= 1_000) return `${(number / 1_000).toFixed(2)}K`;

  return number.toLocaleString();
}

function MetricCards({ ticker, summary, status, snapshot }) {
  const safeDirection = Number(summary?.direction ?? 0);
  const safePrice = Number(snapshot?.price ?? 0);
  const safeChange = Number(snapshot?.change ?? 0);
  const safePercent = Number(snapshot?.percent ?? 0);
  const safeVolume = snapshot?.volume ?? 0;
  const safeVolatility = snapshot?.volatility ?? 'Low';

  const directionLabel =
    Math.abs(safeDirection) < 0.25 ? 'Neutral' : safeDirection >= 0 ? 'Bullish' : 'Bearish';

  const directionValue = `${safeDirection >= 0 ? '+' : ''}${safeDirection.toFixed(2)}`;

  const cards = [
    {
      label: ticker,
      value: formatPrice(safePrice),
      helper: formatMove(safeChange, safePercent),
      detail: 'Latest available market price'
    },
    {
      label: 'Daily Volume',
      value: formatVolume(safeVolume),
      helper: 'Recent trading activity',
      detail: status === 'live' ? 'Pulled from Alpha Vantage delayed data' : 'Demo market dataset'
    },
    {
      label: 'Volatility',
      value: safeVolatility,
      helper: 'Based on recent price movement',
      detail: 'Used to support short-term risk context'
    },
    {
      label: 'Forecast Bias',
      value: directionLabel,
      helper: `${directionValue} projected move`,
      detail: `${summary?.candles ?? 0} candles analyzed`
    },
    {
      label: 'Top News Impact',
      value: `${summary?.topImpact ?? 0}%`,
      helper: 'Highest ranked headline score',
      detail: 'Rule-based impact scoring'
    },
    {
      label: 'Data Mode',
      value: status === 'live' ? 'Live API' : 'Demo',
      helper: status === 'live' ? '15-minute delayed market data' : 'Fallback mode active',
      detail: 'Backend remains available during API limits'
    }
  ];

  return (
    <section className="metrics-grid">
      {cards.map((card) => (
        <article className="metric-card" key={card.label}>
          <span>{card.label}</span>
          <strong>{card.value}</strong>
          <p>{card.helper}</p>
          <small>{card.detail}</small>
        </article>
      ))}
    </section>
  );
}

export default MetricCards;