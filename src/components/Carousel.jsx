import { Children, useCallback, useEffect, useRef, useState } from 'react';
import './Carousel.css';

/**
 * Editorial carousel — shows 3-4 items at a time in a horizontal
 * scroll-snap track with prev/next arrows. Keeps the 1px-gap border
 * look of the card grids. Each child is wrapped as a slide.
 */
const Carousel = ({ children, ariaLabel }) => {
  const trackRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [overflowing, setOverflowing] = useState(false);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setOverflowing(scrollWidth > clientWidth + 1);
    setAtStart(scrollLeft <= 1);
    setAtEnd(scrollLeft + clientWidth >= scrollWidth - 1);
  }, []);

  useEffect(() => {
    update();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [update]);

  const page = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const slide = el.querySelector('.carousel-slide');
    // width of one slide + the 1px gap between slides
    const step = slide ? slide.offsetWidth + 1 : el.clientWidth;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  return (
    <div className="carousel" role="group" aria-label={ariaLabel}>
      <div className="carousel-track" ref={trackRef}>
        {Children.map(children, (child) => (
          <div className="carousel-slide">{child}</div>
        ))}
      </div>

      {overflowing && (
        <div className="carousel-controls">
          <button
            type="button"
            className="carousel-arrow"
            onClick={() => page(-1)}
            disabled={atStart}
            aria-label="Previous"
          >
            ←
          </button>
          <button
            type="button"
            className="carousel-arrow"
            onClick={() => page(1)}
            disabled={atEnd}
            aria-label="Next"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
};

export default Carousel;
