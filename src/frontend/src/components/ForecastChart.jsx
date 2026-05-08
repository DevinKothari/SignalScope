function ForecastChart({ ticker, forecast }) {
  const values = forecast.flatMap((item) => [item.high, item.low, item.upper_bound, item.lower_bound]);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const getY = (price) => 220 - ((price - min) / range) * 180;
  const getX = (index) => 45 + index * (500 / Math.max(1, forecast.length - 1));
  const closePath = forecast.map((item, index) => `${index === 0 ? 'M' : 'L'} ${getX(index)} ${getY(item.close)}`).join(' ');

  return (
    <section className="panel forecast-panel" id="forecast">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Forecast</p>
          <h2>{ticker} Short-Term Candle View</h2>
        </div>
        <span className="badge">Next session estimate</span>
      </div>

      <div className="chart-wrap">
        <svg viewBox="0 0 600 260" role="img" aria-label={`${ticker} forecast chart`}>
          <line x1="40" y1="25" x2="40" y2="225" className="axis" />
          <line x1="40" y1="225" x2="565" y2="225" className="axis" />
          <text x="8" y="32" className="chart-label">{max.toFixed(2)}</text>
          <text x="8" y="225" className="chart-label">{min.toFixed(2)}</text>
          <path d={closePath} className="close-line" fill="none" />
          {forecast.map((item, index) => {
            const x = getX(index);
            const openY = getY(item.open);
            const closeY = getY(item.close);
            const highY = getY(item.high);
            const lowY = getY(item.low);
            const bodyTop = Math.min(openY, closeY);
            const bodyHeight = Math.max(7, Math.abs(closeY - openY));
            const up = item.close >= item.open;

            return (
              <g key={item.timestamp}>
                <line x1={x} y1={highY} x2={x} y2={lowY} className="wick" />
                <rect x={x - 9} y={bodyTop} width="18" height={bodyHeight} rx="4" className={up ? 'candle up' : 'candle down'} />
                <text x={x - 14} y="246" className="chart-label">
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </section>
  );
}

export default ForecastChart;
