import React, { useEffect } from 'react';
import './Popup.css';

const Popup = ({ url, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!url) {
    return null;
  }

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <div className="popup-controls">
          <a href={url} target="_blank" rel="noopener noreferrer" className="popup-open-new-tab">
            <img src="/open-in-new-tab.svg" alt="Open in new tab" />
          </a>
          <button className="popup-close" onClick={onClose}>&times;</button>
        </div>
        <iframe src={url} title="Project Preview" width="100%" height="100%"></iframe>
      </div>
    </div>
  );
};

export default Popup;
