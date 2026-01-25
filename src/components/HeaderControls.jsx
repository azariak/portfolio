import React, { useState } from 'react';
import './HeaderControls.css';
import { analytics } from '../utils/analytics';

const HeaderControls = ({ isDarkMode, setIsDarkMode }) => {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText('azaria.kelman@mail.utoronto.ca');
      setCopied(true);
      setTimeout(() => setCopied(false), 2500); // Reset after 2.5 seconds
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  return (
    <div className="header-controls">
      <div className="email-button-wrapper">
        <button
          className="control-button"
          onClick={copyEmail}
          aria-label="Copy email address"
        >
          <span style={{ fontSize: '1.5rem', fontWeight: '900', textShadow: '0 0 1px currentColor' }}>
            ✉
          </span>
        </button>
        {copied && <div className="copied-message">Copied to clipboard!</div>}
      </div>
      <button
        className="control-button"
        onClick={() => window.open('https://www.linkedin.com/in/azaria-kelman/', '_blank')}
        aria-label="Open LinkedIn"
      >
        <img src="/linkedin.png" alt="LinkedIn" width={24} height={24} />
      </button>
      <button
        className="control-button"
        onClick={() => window.open('https://github.com/azariak/portfolio', '_blank')}
        aria-label="Open GitHub"
      >
        <img src="/github-mark-white.png" alt="GitHub" width={20} height={20} />
      </button>
      <button
        className="control-button"
        onClick={() => { analytics.darkModeToggle(!isDarkMode); setIsDarkMode(!isDarkMode); }}
        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <span style={{ filter: 'grayscale(100%) brightness(200%)' }}>
          {isDarkMode ? '☀️' : '🌙'}
        </span>
      </button>
    </div>
  );
};

export default HeaderControls;
