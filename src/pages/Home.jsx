import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Popup from '../components/Popup';
import CommandLine from './CommandLine';
import PersonalPortfolio from '../components/PersonalPortfolio';
import projectsData from '../data/projects.json';
import softwareData from '../data/software.json';
import booksData from '../data/books.json';
import articlesData from '../data/articles.json';
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

        {/* Desktop-only Braille dot-art portrait, top right — morphs into photo on hover */}
        <div className="hero-portrait" aria-hidden="true">
        <span className="hero-portrait-hit" />
        <div className="hero-dotart" />
          <img className="hero-portrait-img" src="/portrait-dots.png" alt="" loading="lazy" />
        </div>

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
            Bullet Chess&ensp;·&ensp;Writing&ensp;·&ensp;Tennis&ensp;·&ensp;Skiing
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
              <h2 className="section-heading"><em>Building things</em></h2>
              <p className="about-body">
                I'm a fourth-year student at the University of Toronto, studying
                Computer Science and Philosophy. Have a look at what I've been
                building below, or{' '}
                <button className="about-link" onClick={copyEmail}>
                  {emailCopied ? 'copied ✓' : 'reach out'}
                </button>
                {' '}— always happy to chat.
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
          <h2 className="section-heading-sm">Selected works</h2>

          <div className="card-grid">
            {visibleProjects.map((project, i) => {
              const isFreelance = project.title === 'Freelance Work';
              return (
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
                  hideLink={isFreelance}
                  eyebrow={isFreelance ? 'Available for hire' : undefined}
                />
              );
            })}
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
          ARTICLES
          ═══════════════════════════════════ */}
      <section id="articles" className="section section-ruled">
        <div className="section-container articles-container">
          <div className="section-label">03 &mdash; Articles</div>
          <h2 className="section-heading-sm">Things I've written</h2>

          <ul className="articles-list" role="list">
            {articlesData.map((article, i) => (
              <li key={i} className="article-item">
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="article-link"
                  onClick={() => analytics.featureCardClick(`Article: ${article.title}`)}
                >
                  <span className="article-title">{article.title}</span>
                  <span className="article-pub">{article.date}</span>
                </a>
              </li>
            ))}
          </ul>
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
            Some books I've recently read and enjoyed.
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
          SOFTWARE
          ═══════════════════════════════════ */}
      <section id="software" className="section">
        <div className="section-container">
          <div className="section-label">05 &mdash; Software</div>
          <h2 className="section-heading-sm">Software I like</h2>

          <div className="card-grid">
            {softwareData.map((sw, i) => (
              <Card
                key={i}
                title={sw.title}
                description={sw.description}
                link={sw.link}
                bookWiki={sw.link}
                trackingCategory="software"
                hideLink
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
          <div className="section-label">06 &mdash; Terminal</div>
          <h2 className="section-heading-sm">Try the interface</h2>
          <p className="section-description">
            Type <code className="inline-code">help</code> for available commands.
            Press <code className="inline-code">/</code> anywhere on the page to jump here.
          </p>

          <CommandLine />
        </div>
      </section>

      {/* ═══════════════════════════════════
          ASK ME ANYTHING (hidden)
          ═══════════════════════════════════ */}
      {/* <section id="ask" className="section section-ruled">
        <div className="section-container">
          <div className="section-label">06 &mdash; Ask Me</div>
          <h2 className="section-heading-sm">Ask me anything</h2>
          <p className="section-description">
            Powered by Gemini — ask about my projects, background, or interests.
          </p>

          <div className="ask-wrapper">
            <PersonalPortfolio isDarkMode={isDarkMode} />
          </div>
        </div>
      </section> */}

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
