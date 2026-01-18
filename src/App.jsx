import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import HamburgerMenu from './components/HamburgerMenu';
import HeaderControls from './components/HeaderControls';
import Home from './pages/Home';
import AskMeAnything from './pages/AskMeAnything';
import Projects from './pages/Projects';
import Books from './pages/Books';
import Software from './pages/Software';
import Blog from './pages/Blog';
import CommandLine from './pages/CommandLine';
import './index.css';

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ignore if already on terminal page
      if (location.pathname === '/terminal') return;

      // Ignore if user is typing in an input/textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      // Navigate to terminal on "/" key
      if (e.key === '/') {
        e.preventDefault();
        navigate('/terminal');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [location.pathname, navigate]);

  return (
    <div className={`app-layout ${isDarkMode ? 'dark' : 'light'}`}>
      {isMobile ? <HamburgerMenu /> : <Sidebar />}
      <main className="main-content">
        <HeaderControls isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        <Routes>
          <Route path="/" element={<Home isDarkMode={isDarkMode} />} />
          <Route path="/ask" element={<AskMeAnything isDarkMode={isDarkMode} />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/books" element={<Books />} />
          <Route path="/software" element={<Software />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/terminal" element={<CommandLine />} />
        </Routes>
        </main>
    </div>
  );
};

export default App;
