import { useEffect, useRef, useState } from 'react';
import { createChart, CandlestickSeries } from 'lightweight-charts';

function CandlestickChart({ ticker, range, candles }) {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const [hoverData, setHoverData] = useState(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      height: 420,
      layout: {
        background: { color: 'transparent' },
        textColor: '#94a3b8',
      },
      grid: {
        vertLines: { color: 'rgba(148, 163, 184, 0.08)' },
        horzLines: { color: 'rgba(148, 163, 184, 0.08)' },
      },
      rightPriceScale: {
        borderColor: 'rgba(148, 163, 184, 0.15)',
      },
      timeScale: {
        borderColor: 'rgba(148, 163, 184, 0.15)',
        timeVisible: range === '1D' || range === '1W',
        secondsVisible: false,
      },
      crosshair: {
        mode: 1,
      },
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderUpColor: '#22c55e',
      borderDownColor: '#ef4444',
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    });

    chart.subscribeCrosshairMove((param) => {
      if (!param || !param.time || !param.seriesData) {
        setHoverData(null);
        return;
      }

      const candle = param.seriesData.get(series);

      if (!candle) {
        setHoverData(null);
        return;
      }

      setHoverData({
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
        range: candle.high - candle.low,
      });
    });

    chartRef.current = chart;
    seriesRef.current = series;

    function handleResize() {
      if (!chartContainerRef.current || !chartRef.current) return;
      chartRef.current.applyOptions({
        width: chartContainerRef.current.clientWidth,
      });
    }

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [range]);

  useEffect(() => {
    if (!seriesRef.current || !Array.isArray(candles) || candles.length === 0) return;

    seriesRef.current.setData(candles);
    chartRef.current?.timeScale().fitContent();
  }, [candles]);

  return (
    <section className="chart-card candlestick-card">
      <div className="chart-card-header">
        <div>
          <p className="eyebrow">Price chart</p>
          <h2>{ticker} Candlestick Chart</h2>
        </div>
        <span>{range}</span>
      </div>

      {hoverData && (
        <div className="ohlc-hover-bar">
          <span>O {hoverData.open.toFixed(2)} </span>
          <span>H {hoverData.high.toFixed(2)} </span>
          <span>L {hoverData.low.toFixed(2)} </span>
          <span>C {hoverData.close.toFixed(2)} </span>
          <span>R {hoverData.range.toFixed(2)}</span>
        </div>
      )}

      <div ref={chartContainerRef} className="candlestick-container" />
    </section>
  );
}

export default CandlestickChart;