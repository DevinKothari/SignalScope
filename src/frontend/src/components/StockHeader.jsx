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

function StockHeader({ ticker, snapshot, status }) {
  const isPositive = Number(snapshot?.change ?? 0) >= 0;

  return (
    <section className="stock-header-card">
      <div>
        <p className="eyebrow">Stock overview</p>
        <h1>{ticker}</h1>
        <div className="stock-price-row">
          <strong>{formatPrice(snapshot?.price)}</strong>
          <span className={isPositive ? 'positive-text' : 'negative-text'}>
            {formatMove(snapshot?.change, snapshot?.percent)}
          </span>
        </div>
      </div>

      <div className="stock-header-meta">
        <span>{status === 'live' ? 'Live API' : 'Demo Mode'}</span>
        <span>{status === 'live' ? '15-minute delayed market data' : 'Fallback dataset active'}</span>
      </div>
    </section>
  );
}

export default StockHeader;