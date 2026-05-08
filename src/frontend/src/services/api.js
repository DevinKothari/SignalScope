const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export async function getTopNews(ticker) {
  const response = await fetch(`${API_BASE_URL}/api/top-news?ticker=${encodeURIComponent(ticker)}`);
  if (!response.ok) {
    throw new Error('News request failed');
  }
  return response.json();
}

export async function getForecast(ticker) {
  const response = await fetch(`${API_BASE_URL}/api/forecast?ticker=${encodeURIComponent(ticker)}`);
  if (!response.ok) {
    throw new Error('Forecast request failed');
  }
  return response.json();
}
