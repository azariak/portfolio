import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import HamburgerMenu from './components/HamburgerMenu';
import Home from './pages/Home';
import Projects from './pages/Projects';
import ThingsIRead from './pages/ThingsIRead';
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
        <Routes>
          <Route path="/" element={<Home isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/things-i-read" element={<ThingsIRead />} />
        </Routes>
        </main>
    </div>
  );
};

export default App;
