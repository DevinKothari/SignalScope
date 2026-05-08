function MetricCards({ ticker, summary, status }) {
  const directionLabel = summary.direction >= 0 ? 'Bullish' : 'Bearish';
  const directionValue = `${summary.direction >= 0 ? '+' : ''}${summary.direction.toFixed(2)}`;

  const cards = [
    { label: 'Ticker', value: ticker, helper: 'Currently analyzed symbol' },
    { label: 'Top News Impact', value: `${summary.topImpact}%`, helper: 'Highest ranked headline score' },
    { label: 'Forecast Bias', value: directionLabel, helper: `${directionValue} projected move` },
    { label: 'Data Mode', value: status === 'live' ? 'Live API' : 'Demo', helper: `${summary.candles} forecast candles loaded` }
  ];

  return (
    <section className="metrics-grid">
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
