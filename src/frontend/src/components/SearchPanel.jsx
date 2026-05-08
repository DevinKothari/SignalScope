const popularTickers = ['AAPL', 'NVDA', 'TSLA', 'MSFT', 'AMD', 'SPY'];

function SearchPanel({ ticker, setTicker, onSearch, status }) {
  return (
    <form className="search-card" onSubmit={onSearch}>
      <label htmlFor="ticker">Search ticker</label>
      <div className="search-row">
        <input
          id="ticker"
          value={ticker}
          onChange={(event) => setTicker(event.target.value.toUpperCase())}
          placeholder="AAPL"
          maxLength="8"
        />
        <button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Loading...' : 'Analyze'}
        </button>
      </div>
      <div className="ticker-pills">
        {popularTickers.map((symbol) => (
          <button key={symbol} type="button" onClick={() => setTicker(symbol)}>
            {symbol}
          </button>
        ))}
      </div>
    </form>
  );
}

export default SearchPanel;
