import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import HamburgerMenu from './components/HamburgerMenu';
import HeaderControls from './components/HeaderControls';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Books from './pages/Books';
import './index.css';

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`app-layout ${isDarkMode ? 'dark' : 'light'}`}>
      {isMobile ? <HamburgerMenu /> : <Sidebar />}
      <main className="main-content">
        <HeaderControls isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        <Routes>
          <Route path="/" element={<Home isDarkMode={isDarkMode} />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/books" element={<Books />} />
        </Routes>
        </main>
    </div>
  );
};

export default App;
