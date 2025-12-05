import React from 'react';
import { ResponsiveContainer, CandlestickChart as ReCandlestick, XAxis, YAxis, Tooltip, Candlestick, Line } from 'recharts';

export const ForecastChart = ({ forecast }) => {
  const chartData = forecast.map(item => ({
    x: new Date(item.timestamp).getTime(),
    open: item.open,
    high: item.high,
    low: item.low,
    close: item.close,
    lower: item.lower_bound,
    upper: item.upper_bound
  }));

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Price Forecast (Next 4 Candles)</h2>
      {forecast.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <ReCandlestick width={730} height={250} data={chartData}>
            <XAxis dataKey="x" tickFormatter={(time) => new Date(time).toLocaleTimeString()} />
            <YAxis domain={['auto', 'auto']} />
            <Tooltip />
            <Candlestick
              dataKey="open"
              dataKey="high"
              dataKey="low"
              dataKey="close"
              fill="#8884d8"
              stroke="#8884d8"
            />
            <Line type="monotone" dataKey="lower" stroke="#ff7300" dot={false} />
            <Line type="monotone" dataKey="upper" stroke="#ff7300" dot={false} />
          </ReCandlestick>
        </ResponsiveContainer>
      ) : (
        <p>No forecast available yet.</p>
      )}
    </div>
  );
};