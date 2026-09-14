import { useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { articleBodies } from '../data/articleBodies';
import './Article.css';

const WORDS_PER_MINUTE = 225;

const Article = ({ article, onBack }) => {
  const body = articleBodies[article.slug];
  const [progress, setProgress] = useState(0);

  const readingTime = useMemo(
    () => Math.max(1, Math.round(body.trim().split(/\s+/).length / WORDS_PER_MINUTE)),
    [body]
  );

  useEffect(() => {
    document.title = `${article.title} — Azaria Kelman`;
    return () => { document.title = 'Azaria Kelman'; };
  }, [article.title]);

  // Esc goes back, mirroring the "/" shortcut convention on the home page.
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onBack();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onBack]);

  // Reading progress, rAF-throttled so the scroll handler stays cheap.
  useEffect(() => {
    let frame = null;

    const measure = () => {
      frame = null;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };

    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(measure);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    measure();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <article className="article-page">
      <div className="article-progress" aria-hidden="true">
        <div
          className="article-progress-bar"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      <div className="article-page-inner">
        <button
          className="article-back article-back-top"
          onClick={onBack}
          title="Back (Esc)"
        >
          <span className="article-back-arrow" aria-hidden="true">&larr;</span>
          Back
        </button>

        <header className="article-page-head">
          <div className="article-page-pub">{article.publication}</div>
          <h1 className="article-page-title">{article.title}</h1>
          {article.subtitle && (
            <p className="article-page-subtitle">{article.subtitle}</p>
          )}
          <div className="article-page-meta">
            <time dateTime={article.datetime}>{article.date}</time>
            <span className="article-page-sep" aria-hidden="true">&middot;</span>
            <span>{readingTime} min read</span>
          </div>
        </header>

        <div className="article-page-body">
          <ReactMarkdown>{body}</ReactMarkdown>
        </div>

        <footer className="article-page-foot">
          <button className="article-back" onClick={onBack}>
            <span className="article-back-arrow" aria-hidden="true">&larr;</span>
            Back to articles
          </button>
        </footer>
      </div>
    </article>
  );
};

export default Article;
