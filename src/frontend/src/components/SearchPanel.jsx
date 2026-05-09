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
      <p className="search-helper">Enter a ticker to refresh the dashboard view.</p>
    </form>
  );
}

export default SearchPanel;
