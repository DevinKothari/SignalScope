function Header({
  ticker,
  setTicker,
  onSearch,
  status,
}) {
  return (
    <header className="app-header">
      <div className="brand-block">
        <div className="brand-logo">SS</div>

        <div>
          <strong>SignalScope</strong>
          <span>Market News + Forecast Dashboard</span>
        </div>
      </div>

      <form className="navbar-search" onSubmit={onSearch}>
        <input
          value={ticker}
          onChange={(event) => setTicker(event.target.value.toUpperCase())}
          placeholder="Search ticker"
        />

        <button type="submit">
          {status === 'loading' ? 'Loading...' : 'Analyze'}
        </button>
      </form>
    </header>
  );
}

export default Header;