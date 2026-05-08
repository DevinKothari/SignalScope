function impactLabel(score) {
  if (score >= 0.8) return 'High';
  if (score >= 0.6) return 'Medium';
  return 'Low';
}

function NewsTable({ news }) {
  return (
    <section className="panel" id="news">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Ranked Headlines</p>
          <h2>Market Impact Feed</h2>
        </div>
        <span className="badge">Data science scoring</span>
      </div>

      <div className="news-list">
        {news.map((item, index) => (
          <article className="news-card" key={`${item.headline}-${index}`}>
            <div className="rank">#{index + 1}</div>
            <div>
              <h3>{item.headline}</h3>
              <p>{item.rationale}</p>
              <div className="news-meta">
                <span>{item.source}</span>
                <span>{impactLabel(item.impact_score)} Impact</span>
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
