import React from 'react';

export const NewsTable = ({ news }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Top Headlines</h2>
      {news.length > 0 ? (
        <table className="w-full border-collapse bg-white shadow-md rounded-md overflow-hidden">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-left">Headline</th>
              <th className="p-2 text-left">Source</th>
              <th className="p-2 text-left">Impact</th>
              <th className="p-2 text-left">Rationale</th>
            </tr>
          </thead>
          <tbody>
            {news.map((item, idx) => (
              <tr key={idx} className="border-t">
                <td className="p-2">{item.headline}</td>
                <td className="p-2">{item.source}</td>
                <td className="p-2">{item.impact_score.toFixed(2)}</td>
                <td className="p-2">{item.rationale}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No news available yet.</p>
      )}
    </div>
  );
};