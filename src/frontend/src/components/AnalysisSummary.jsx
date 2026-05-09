function AnalysisSummary({ summary, snapshot, status }) {
  const direction = Number(summary?.direction ?? 0);
  const confidence = Number(summary?.confidence ?? 0);
  const volatility = snapshot?.volatility ?? 'Low';

  const bias =
    Math.abs(direction) < 0.25 ? 'Neutral' : direction > 0 ? 'Bullish' : 'Bearish';

  return (
    <section className="analysis-summary-card">
      <div>
        <p className="eyebrow">Signal summary</p>
        <h2>{bias} short-term setup</h2>
        <p>
          SignalScope is reading recent price movement, volatility, headline impact, and candle behavior to build a rule-based market view.
        </p>
      </div>

      <div className="analysis-summary-grid">
        <div>
          <span>Bias</span>
          <strong>{bias}</strong>
        </div>
        <div>
          <span>Confidence</span>
          <strong>{confidence}%</strong>
        </div>
        <div>
          <span>Volatility</span>
          <strong>{volatility}</strong>
        </div>
        <div>
          <span>Data</span>
          <strong>{status === 'live' ? 'Delayed API' : 'Demo'}</strong>
        </div>
      </div>
    </section>
  );
}

export default AnalysisSummary;