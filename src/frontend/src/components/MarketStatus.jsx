function getMarketSession(now = new Date()) {
  const day = now.getDay();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const weekday = day >= 1 && day <= 5;

  if (!weekday) return 'Closed';
  if (minutes < 6 * 60 + 30) return 'Pre-market';
  if (minutes <= 13 * 60) return 'Open';
  if (minutes <= 17 * 60) return 'After-hours';
  return 'Closed';
}

function MarketStatus({ lastUpdated }) {
  const session = getMarketSession();

  return (
    <section className="status-strip">
      <div>
        <span className="status-dot" />
        <strong>Market Session</strong>
        <p>{session}</p>
      </div>
      <div>
        <strong>Last Updated</strong>
        <p>{lastUpdated}</p>
      </div>
      <div>
        <strong>Coverage</strong>
        <p>News impact, price action, volatility</p>
      </div>
    </section>
  );
}

export default MarketStatus;
