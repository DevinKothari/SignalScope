function MetricCards({ ticker, summary, status, snapshot }) {
  const safeDirection = Number(summary?.direction ?? 0);
  const safePrice = Number(snapshot?.price ?? 0);
  const safeChange = Number(snapshot?.change ?? 0);
  const safePercent = Number(snapshot?.percent ?? 0);
  const safeVolume = snapshot?.volume ?? 'N/A';
  const safeVolatility = snapshot?.volatility ?? 'Low';

  const directionLabel = safeDirection >= 0 ? 'Bullish' : 'Bearish';

  const directionValue = `${safeDirection >= 0 ? '+' : ''}${safeDirection.toFixed(2)}`;

  const price = safePrice
    ? `$${safePrice.toFixed(2)}`
    : 'N/A';

  const move = `${safeChange >= 0 ? '+' : ''}${safeChange.toFixed(2)} (${safePercent.toFixed(2)}%)`;

  const cards = [
    {
      label: ticker,
      value: price,
      helper: move
    },
    {
      label: 'Top News Impact',
      value: `${summary?.topImpact ?? 0}%`,
      helper: 'Highest ranked headline score'
    },
    {
      label: 'Forecast Bias',
      value: directionLabel,
      helper: `${directionValue} projected move`
    },
    {
      label: 'Volatility',
      value: safeVolatility,
      helper: `${safeVolume} estimated volume`
    },
    {
      label: 'Data Mode',
      value: status === 'live' ? 'Live API' : 'Demo',
      helper: `${summary?.candles ?? 0} candles loaded`
    }
  ];

  return (
    <section className="metrics-grid five-cards">
      {cards.map((card) => (
        <article className="metric-card" key={card.label}>
          <span>{card.label}</span>
          <strong>{card.value}</strong>
          <p>{card.helper}</p>
        </article>
      ))}
    </section>
  );
}

export default MetricCards;