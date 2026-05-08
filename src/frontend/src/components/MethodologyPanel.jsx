function MethodologyPanel() {
  return (
    <section className="panel methodology" id="methodology">
      <div>
        <p className="eyebrow">Class Submission Scope</p>
        <h2>Project Methodology</h2>
        <p>
          SignalScope is currently a data science backed prototype. It uses structured scoring logic, headline relevance, market context, and short-term candle calculations to demonstrate the intended workflow without requiring a completed production model.
        </p>
      </div>
      <div className="method-grid">
        <div><strong>1</strong><span>Collect market and ticker-specific headlines</span></div>
        <div><strong>2</strong><span>Rank headlines by relevance, proximity, and potential impact</span></div>
        <div><strong>3</strong><span>Display short-term candle estimates for trader review</span></div>
      </div>
    </section>
  );
}

export default MethodologyPanel;
