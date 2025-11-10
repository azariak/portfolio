import React from 'react';

const HeaderControls = ({ isDarkMode, setIsDarkMode }) => {
  return (
    <div className="header-controls">
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
        onClick={() => setIsDarkMode(!isDarkMode)}
        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>
    </div>
  );
};

export default HeaderControls;
