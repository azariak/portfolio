import { useEffect, useState } from 'react';
import booksData from '../data/books.json';
import { analytics } from '../utils/analytics';
import './Bookshelf.css';

// Earthy book-spine tones, assigned round-robin down the shelf
const PALETTE = [
  '#7a3b2e', '#2e4a3f', '#5a4a2e', '#6b2f42', '#2e3a4a', '#4a3a2e',
  '#3f2e4a', '#3a4a2e', '#4a2e33', '#2e453f', '#5a3a2a',
];

const books = booksData.map((book, i) => ({
  ...book,
  color: PALETTE[i % PALETTE.length],
}));

const Bookshelf = () => {
  const [activeIdx, setActiveIdx] = useState(null);
  const active = activeIdx !== null ? books[activeIdx] : null;

  const open = (i) => {
    setActiveIdx(i);
    analytics.featureCardClick(`Book: ${books[i].title}`);
  };
  const close = () => setActiveIdx(null);

  // Close the modal on Escape while it's open
  useEffect(() => {
    if (!active) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active]);

  return (
    <>
      <div className="bookshelf">
        {books.map((book, i) => (
          <button
            key={i}
            type="button"
            className="book-spine"
            style={{ '--spine': book.color }}
            onClick={() => open(i)}
          >
            <span className="book-spine-sheen" aria-hidden="true" />
            <span className="book-spine-title">{book.title}</span>
            <span className="book-spine-divider" aria-hidden="true" />
            <span className="book-spine-author">{book.author}</span>
          </button>
        ))}
      </div>

      {active && (
        <div className="book-modal-overlay" onClick={close}>
          <div
            className="book-modal"
            role="dialog"
            aria-modal="true"
            aria-label={active.title}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="book-modal-close" onClick={close} aria-label="Close">
              ×
            </button>
            <div className="book-modal-swatch" style={{ background: active.color }} />
            <h3 className="book-modal-title">{active.title}</h3>
            <div className="book-modal-author">{active.author}</div>
            <p className="book-modal-desc">{active.description}</p>
            <div className="book-modal-links">
              {active.bookWiki && (
                <a
                  href={active.bookWiki}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="book-modal-link primary"
                  onClick={() => analytics.bookClick(active.title)}
                >
                  Book →
                </a>
              )}
              {active.authorWiki && (
                <a
                  href={active.authorWiki}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="book-modal-link"
                  onClick={() => analytics.authorClick(active.author)}
                >
                  Author →
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Bookshelf;
