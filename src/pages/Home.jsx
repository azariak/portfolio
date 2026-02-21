import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Popup from '../components/Popup';
import CommandLine from './CommandLine';
import PersonalPortfolio from '../components/PersonalPortfolio';
import projectsData from '../data/projects.json';
import softwareData from '../data/software.json';
import booksData from '../data/books.json';
import { analytics } from '../utils/analytics';
import './Home.css';

const EMAIL = 'azaria.kelman@mail.utoronto.ca';

const Home = ({ isDarkMode }) => {
  const [popupUrl, setPopupUrl] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [emailCopied, setEmailCopied] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const copyEmail = () => {
    navigator.clipboard.writeText(EMAIL).then(() => {
      setEmailCopied(true);
      analytics.featureCardClick('Email Copy');
      setTimeout(() => setEmailCopied(false), 2000);
    });
  };

  const visibleProjects = projectsData.filter((p) => !p.hidden);
  const projectsWithoutPopup = ['Lichess Open-Source Contributions'];

  const openPopup = (url) => setPopupUrl(url);
  const closePopup = () => setPopupUrl(null);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 58;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <div className="page">

      {/* ═══════════════════════════════════
          HERO
          ═══════════════════════════════════ */}
      <section id="hero" className="hero-section">
        {/* Subtle diagonal pattern overlay */}
        <div className="hero-pattern" aria-hidden="true" />

        <div className="hero-inner">
          <div className="hero-eyebrow">
            <span className="hero-location">Toronto, Canada</span>
          </div>

          <h1 className="hero-name">
            <span className="hero-name-line">Azaria</span>
            <span className="hero-name-line hero-name-indent">Kelman</span>
          </h1>

          <div className="hero-rule" aria-hidden="true" />

          <p className="hero-subtitle">
            Computer Science &amp; Philosophy<br />
            University of Toronto
          </p>

          <p className="hero-interests">
            Reading&ensp;·&ensp;Bullet Chess&ensp;·&ensp;GeoGuessr&ensp;·&ensp;Tennis&ensp;·&ensp;Skiing
          </p>

          <div className="hero-actions">
            <button className="hero-cta" onClick={copyEmail}>
              {emailCopied ? 'Copied ✓' : 'Get in touch'}
            </button>
            <a
              href="https://github.com/azariak"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-link-btn"
              onClick={() => analytics.featureCardClick('GitHub')}
            >
              GitHub ↗
            </a>
            <a
              href="https://www.linkedin.com/in/azaria-kelman/"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-link-btn"
              onClick={() => analytics.featureCardClick('LinkedIn')}
            >
              LinkedIn ↗
            </a>
          </div>
        </div>

        <button
          className="hero-scroll"
          onClick={() => scrollTo('about')}
          aria-label="Scroll to about"
        >
          <span className="hero-scroll-label">scroll</span>
          <span className="hero-scroll-arrow">↓</span>
        </button>
      </section>

      {/* ═══════════════════════════════════
          ABOUT
          ═══════════════════════════════════ */}
      <section id="about" className="section">
        <div className="section-container">
          <div className="section-label">01 &mdash; About</div>
          <div className="about-grid">
            <div className="about-left">
              <h2 className="section-heading">Building things<br /><em>that matter.</em></h2>
              <p className="about-body">
                I'm a fourth-year student at the University of Toronto studying
                Computer Science and Philosophy.
              </p>

            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          PROJECTS
          ═══════════════════════════════════ */}
      <section id="projects" className="section section-ruled">
        <div className="section-container">
          <div className="section-label">02 &mdash; Projects</div>
          <h2 className="section-heading-sm">Selected work</h2>

          <div className="card-grid">
            {visibleProjects.map((project, i) => (
              <Card
                key={i}
                title={project.title}
                description={project.description}
                link={project.link}
                onLearnMoreClick={
                  projectsWithoutPopup.includes(project.title) ? undefined : openPopup
                }
                isMobile={isMobile}
                trackingCategory="projects"
              />
            ))}
          </div>

          <p className="section-footnote">
            <a
              href="https://github.com/azariak"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => analytics.featureCardClick('GitHub More')}
            >
              More on GitHub ↗
            </a>
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════
          SOFTWARE
          ═══════════════════════════════════ */}
      <section id="software" className="section">
        <div className="section-container">
          <div className="section-label">03 &mdash; Software</div>
          <h2 className="section-heading-sm">Software I Like</h2>

          <div className="card-grid">
            {softwareData.map((sw, i) => (
              <Card
                key={i}
                title={sw.title}
                description={sw.description}
                link={sw.link}
                trackingCategory="software"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          BOOKS
          ═══════════════════════════════════ */}
      <section id="books" className="section section-ruled">
        <div className="section-container">
          <div className="section-label">04 &mdash; Books</div>
          <h2 className="section-heading-sm">My bookshelf</h2>
          <p className="section-description">
            Some books I've recently been reading and enjoyed.
          </p>

          <div className="books-grid">
            {booksData.map((book, i) => (
              <Card
                key={i}
                title={book.title}
                description={book.author}
                image={book.image}
                bookWiki={book.bookWiki}
                authorWiki={book.authorWiki}
                onLearnMoreClick={
                  ['The Mind-Body Problem'].includes(book.title) ? undefined : openPopup
                }
                isMobile={isMobile}
                trackingCategory="books"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          TERMINAL
          ═══════════════════════════════════ */}
      <section id="terminal" className="section">
        <div className="section-container">
          <div className="section-label">05 &mdash; Terminal</div>
          <h2 className="section-heading-sm">Try the interface</h2>
          <p className="section-description">
            Type <code className="inline-code">help</code> for available commands.
            Press <code className="inline-code">/</code> anywhere on the page to jump here.
          </p>

          <CommandLine />
        </div>
      </section>

      {/* ═══════════════════════════════════
          ASK ME ANYTHING
          ═══════════════════════════════════ */}
      <section id="ask" className="section section-ruled">
        <div className="section-container">
          <div className="section-label">06 &mdash; Ask Me</div>
          <h2 className="section-heading-sm">Ask me anything</h2>
          <p className="section-description">
            Powered by Gemini AI — ask about my projects, background, or interests.
          </p>

          <div className="ask-wrapper">
            <PersonalPortfolio isDarkMode={isDarkMode} />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          FOOTER
          ═══════════════════════════════════ */}
      <footer className="site-footer">
        <div className="section-container footer-inner">
          <span className="footer-sig">Azaria Kelman</span>
          <div className="footer-links">
            <button className="footer-email-btn" onClick={copyEmail}>
              {emailCopied ? 'Copied ✓' : 'Email'}
            </button>
            <span className="footer-sep">·</span>
            <a href="https://github.com/azariak" target="_blank" rel="noopener noreferrer">GitHub</a>
            <span className="footer-sep">·</span>
            <a href="https://www.linkedin.com/in/azaria-kelman/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>
      </footer>

      {popupUrl && <Popup url={popupUrl} onClose={closePopup} />}
    </div>
  );
};

export default Home;
