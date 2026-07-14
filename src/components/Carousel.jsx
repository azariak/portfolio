import { Children, useCallback, useEffect, useRef, useState } from 'react';
import './Carousel.css';

/**
 * Editorial carousel — shows 3-4 separated cards at a time in a
 * horizontal scroll-snap track, with a page-progress indicator and
 * prev/next arrows below. Each child is wrapped as a slide.
 */
const Carousel = ({ children, ariaLabel }) => {
  const trackRef = useRef(null);
  const [overflowing, setOverflowing] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [steps, setSteps] = useState(1);
  const [activeStep, setActiveStep] = useState(0);

  // One step per single-card scroll position (total cards - visible + 1)
  const metrics = () => {
    const el = trackRef.current;
    if (!el) return null;
    const slides = el.querySelectorAll('.carousel-slide');
    const first = slides[0];
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const step = first ? first.offsetWidth + gap : el.clientWidth;
    const perView = step ? Math.max(1, Math.round((el.clientWidth + gap) / step)) : 1;
    const positions = Math.max(1, slides.length - perView + 1);
    return { step, positions };
  };

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setOverflowing(scrollWidth > clientWidth + 1);
    setAtStart(scrollLeft <= 1);
    setAtEnd(scrollLeft + clientWidth >= scrollWidth - 1);

    const m = metrics();
    if (!m) return;
    setSteps(m.positions);
    setActiveStep(
      Math.min(m.positions - 1, Math.max(0, Math.round(scrollLeft / m.step)))
    );
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

  const goToStep = (i) => {
    const el = trackRef.current;
    const m = metrics();
    if (!el || !m) return;
    const target = Math.min(m.positions - 1, Math.max(0, i));
    el.scrollTo({ left: target * m.step, behavior: 'smooth' });
  };

  // Arrows move one card from wherever the scroll currently sits
  const page = (dir) => {
    const el = trackRef.current;
    const m = metrics();
    if (!el || !m) return;
    const current = Math.round(el.scrollLeft / m.step);
    goToStep(current + dir);
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
          <div className="carousel-progress" aria-hidden="true">
            {Array.from({ length: steps }).map((_, i) => (
              <button
                key={i}
                type="button"
                className={`carousel-dot ${i === activeStep ? 'active' : ''}`}
                onClick={() => goToStep(i)}
                aria-label={`Go to position ${i + 1}`}
                tabIndex={-1}
              />
            ))}
          </div>

          <div className="carousel-arrows">
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
        </div>
      )}
    </div>
  );
};

export default Carousel;
