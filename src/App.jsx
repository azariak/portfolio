import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import articlesData from './data/articles.json';
import './index.css';

// Split out: the article view pulls in react-markdown, which would otherwise
// add ~40kB gzipped to the home page for content that lives on another route.
const Article = lazy(() => import('./pages/Article'));

const ARTICLE_PATH = /^\/articles\/(.+?)\/?$/;

const matchArticle = (pathname) => {
  const slug = pathname.match(ARTICLE_PATH)?.[1];
  return slug ? articlesData.find((a) => a.slug === slug) : undefined;
};

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [path, setPath] = useState(() => window.location.pathname);

  const article = matchArticle(path);

  // Lightweight history-based navigation — the site has no router, and an
  // article is the only non-home view.
  const navigate = useCallback((to) => {
    window.history.pushState({}, '', to);
    setPath(to);
  }, []);

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    document.title = 'Azaria Kelman';
  }, []);

  // Scroll to section based on URL path on initial load
  useEffect(() => {
    if (matchArticle(window.location.pathname)) return;
    const path = window.location.pathname.replace(/^\//, '').toLowerCase();
    if (path) {
      setTimeout(() => {
        const el = document.getElementById(path);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 60;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);

  // Press "/" to scroll to terminal section (home only — no terminal on an article)
  useEffect(() => {
    if (article) return;
    const handleKeyPress = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === '/') {
        e.preventDefault();
        const el = document.getElementById('terminal');
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 60;
          window.scrollTo({ top, behavior: 'smooth' });
          // Focus the terminal input after scrolling
          setTimeout(() => {
            el.querySelector('.terminal-input')?.focus();
          }, 500);
        }
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [article]);

  // Opening an article starts it at the top; returning lands back on the list.
  useEffect(() => {
    if (article) window.scrollTo(0, 0);
  }, [article]);

  const closeArticle = useCallback(() => {
    navigate('/');
    requestAnimationFrame(() => {
      const el = document.getElementById('articles');
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 60;
        window.scrollTo({ top });
      }
    });
  }, [navigate]);

  return (
    <div className={`app ${isDarkMode ? 'dark' : 'light'}`}>
      {article ? (
        <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
          <Article article={article} onBack={closeArticle} />
        </Suspense>
      ) : (
        <>
          <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
          <Home isDarkMode={isDarkMode} onOpenArticle={navigate} />
        </>
      )}
    </div>
  );
};

export default App;
