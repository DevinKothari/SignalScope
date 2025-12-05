import React, { useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { NewsTable } from './components/NewsTable';
import { ForecastChart } from './components/ForecastChart';
import { LoadingSpinner } from './components/LoadingSpinner';
import api from './services/api';

function App() {
  const [ticker, setTicker] = useState('');
  const [news, setNews] = useState([]);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (newTicker) => {
    setLoading(true);
    setError(null);
    try {
      const newsRes = await api.get(`/api/top-news?ticker=${newTicker}`);
      setNews(newsRes.data);
      const forecastRes = await api.get(`/api/forecast?ticker=${newTicker}`);
      setForecast(forecastRes.data);
    } catch (err) {
      setError('Failed to fetch data. Ensure backend is running.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-6">SignalScope</h1>
      <SearchBar onSearch={fetchData} setTicker={setTicker} ticker={ticker} />
      {loading && <LoadingSpinner />}
      {error && <p className="text-red-500">{error}</p>}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        <NewsTable news={news} />
        <ForecastChart forecast={forecast} />
      </div>
    </div>
  );
}

export default App;