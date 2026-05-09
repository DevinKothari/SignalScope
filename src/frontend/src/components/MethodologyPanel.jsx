function MethodologyPanel() {
  return (
    <section className="panel methodology" id="methodology">
      <div>
        <p className="eyebrow">Methodology</p>
        <h2>How SignalScope Scores Market Context</h2>
        <p>
          SignalScope uses a rules-based data science approach to organize market information. The dashboard combines headline relevance, source timing, category weight, volatility, and recent price movement to produce a clean trader-facing view.
        </p>
      </div>
      <div className="method-grid">
        <div><strong>1</strong><span>Rank ticker-specific and macro headlines by market relevance.</span></div>
        <div><strong>2</strong><span>Compare impact score against price movement and volatility.</span></div>
        <div><strong>3</strong><span>Display a short-term forecast view with a readable bias signal.</span></div>
      </div>
    </section>
  );
}

export default MethodologyPanel;
