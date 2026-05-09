const watchlist = ['AAPL', 'NVDA', 'TSLA', 'MSFT', 'AMD', 'SPY', 'QQQ'];

function Watchlist({ activeTicker, onSelect }) {
  return (
    <section className="panel compact-panel">
      <div className="panel-header slim">
        <div>
          <p className="eyebrow">Watchlist</p>
          <h2>Quick Select</h2>
        </div>
      </div>
      <div className="watchlist-grid">
        {watchlist.map((symbol) => (
          <button
            key={symbol}
            type="button"
            className={symbol === activeTicker ? 'watchlist-item active' : 'watchlist-item'}
            onClick={() => onSelect(symbol)}
          >
            {symbol}
          </button>
        ))}
      </div>
    </section>
  );
}

export default Watchlist;
