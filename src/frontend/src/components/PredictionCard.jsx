function PredictionCard({ prediction }) {
  if (!prediction) return null;

  const biasClass =
    prediction.bias === 'Bullish'
      ? 'positive-text'
      : prediction.bias === 'Bearish'
        ? 'negative-text'
        : '';

  return (
    <section className="prediction-card">
      <div className="prediction-header">
        <div>
          <p className="eyebrow">Rule-based prediction</p>
          <h2 className={biasClass}>{prediction.bias}</h2>
        </div>

        <div className="prediction-score">
          <span>Confidence</span>
          <strong>{prediction.confidence}%</strong>
        </div>
      </div>

      <div className="prediction-grid">
        <div>
          <span>Risk</span>
          <strong>{prediction.risk}</strong>
        </div>
        <div>
          <span>Trend Strength</span>
          <strong>{prediction.trendStrength}</strong>
        </div>
        <div>
          <span>Directional Score</span>
          <strong>{prediction.directionalScore}</strong>
        </div>
      </div>

      <div className="prediction-signals">
        <h3>Why this signal?</h3>
        <ul>
          {prediction.signals.map((signal) => (
            <li key={signal}>{signal}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default PredictionCard;