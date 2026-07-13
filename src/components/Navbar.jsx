import React, { useState, useEffect } from 'react';
// import SettingsModal from '../SettingsModal';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'About', id: 'about' },
  { label: 'Projects', id: 'projects' },
  { label: 'Articles', id: 'articles' },
  { label: 'Books', id: 'books' },
  { label: 'Software', id: 'software' },
  { label: 'Terminal', id: 'terminal' },
  // { label: 'Ask Me', id: 'ask' },
];

const Navbar = ({ isDarkMode, setIsDarkMode }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [bulbPulling, setBulbPulling] = useState(false);
  // const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) setMenuOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    setBulbPulling(true);
    setTimeout(() => setBulbPulling(false), 500);
  };

  const scrollTo = (id) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 60;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    const path = id === 'hero' ? '/' : `/${id}`;
    window.history.pushState(null, '', path);
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${menuOpen ? 'menu-open' : ''}`}>
        <div className="navbar-inner">
          {/* Logo */}
          <button
            className="navbar-logo"
            onClick={() => scrollTo('hero')}
            aria-label="Scroll to top"
          >
            AK
          </button>

          {/* Desktop links */}
          <ul className="navbar-links" role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <button
                  className={`navbar-link ${activeSection === link.id ? 'active' : ''}`}
                  onClick={() => scrollTo(link.id)}
                >
                  {link.label}
                  {link.id === 'terminal' && (
                    <kbd className="nav-kbd">/</kbd>
                  )}
                </button>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="navbar-actions">
            {/* Settings icon commented out
            <button
              className="icon-btn"
              onClick={() => setIsSettingsOpen(true)}
              aria-label="Settings"
              title="Settings / API Key"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </button>
            */}

            <div className={`bulb-toggle ${bulbPulling ? 'pulling' : ''}`}>
              <span className="bulb-cord-line" />
              <span className="bulb-cord-knot" />
              <button
                className={`bulb-btn ${!isDarkMode ? 'on' : ''}`}
                onClick={toggleTheme}
                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                title={isDarkMode ? 'Light mode' : 'Dark mode'}
              >
                <svg viewBox="0 0 48 72" width="24" height="36" aria-hidden="true">
                  <path className="glass" d="M24 6 C12 6 6 15 6 24 C6 32 11 36 14 41 L14 47 L34 47 L34 41 C37 36 42 32 42 24 C42 15 36 6 24 6 Z" />
                  <path className="fil" fill="none" d="M18 41 L20 31 Q24 26 28 31 L30 41" />
                  <rect className="base" x="15" y="47" width="18" height="5" rx="1.5" />
                  <rect className="base" x="16.5" y="53" width="15" height="3.5" rx="1.2" />
                  <rect className="base" x="18.5" y="58" width="11" height="3.5" rx="1.2" />
                </svg>
              </button>
            </div>

            {/* Hamburger */}
            <button
              className={`hamburger ${menuOpen ? 'open' : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`mobile-menu ${menuOpen ? 'visible' : ''}`}>
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              className={`mobile-link ${activeSection === link.id ? 'active' : ''}`}
              onClick={() => scrollTo(link.id)}
            >
              {link.label}
            </button>
          ))}
        </div>
      </nav>

      {/* <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} /> */}
    </>
  );
};

export default Navbar;
