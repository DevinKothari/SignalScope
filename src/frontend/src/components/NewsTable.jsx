import { useMemo, useState } from 'react';

function impactLabel(score) {
  if (score >= 0.8) return 'High';
  if (score >= 0.6) return 'Medium';
  return 'Low';
}

function NewsTable({ news }) {
  const [filter, setFilter] = useState('All');
  const filters = ['All', 'High Impact', 'Company News', 'Macro', 'Volume'];

  const filteredNews = useMemo(() => {
    if (filter === 'All') return news;
    if (filter === 'High Impact') return news.filter((item) => item.impact_score >= 0.8);
    return news.filter((item) => item.category === filter);
  }, [filter, news]);

  return (
    <section className="panel" id="news">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Ranked Headlines</p>
          <h2>Market Impact Feed</h2>
        </div>
        <span className="badge">Scored feed</span>
      </div>

      <div className="filter-row">
        {filters.map((item) => (
          <button key={item} className={filter === item ? 'filter active' : 'filter'} onClick={() => setFilter(item)}>
            {item}
          </button>
        ))}
      </div>

      <div className="news-list">
        {filteredNews.map((item, index) => (
          <article className="news-card" key={`${item.headline}-${index}`}>
            <div className="rank">#{index + 1}</div>
            <div>
              <div className="news-title-row">
                <h3>{item.headline}</h3>
                <span className={`impact ${impactLabel(item.impact_score).toLowerCase()}`}>{impactLabel(item.impact_score)}</span>
              </div>
              <p>{item.rationale}</p>
              <p className="takeaway">Why it matters: {item.takeaway}</p>
              <div className="news-meta">
                <span>{item.source}</span>
                <span>{item.published_at}</span>
                <span>{item.category}</span>
                <span>{Math.round(item.impact_score * 100)}%</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default NewsTable;
