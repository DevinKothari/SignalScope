import React from 'react';

export const SearchBar = ({ onSearch, setTicker, ticker }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (ticker) onSearch(ticker);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mb-8">
      <input
        type="text"
        value={ticker}
        onChange={(e) => setTicker(e.target.value.toUpperCase())}
        placeholder="Enter stock ticker (e.g., AAPL)"
        className="w-full p-2 border rounded-md mb-2"
      />
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md">
        Search
      </button>
    </form>
  );
};