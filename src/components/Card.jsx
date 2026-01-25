import React from 'react';
import './Card.css';
import { analytics } from '../utils/analytics';

const Card = ({ title, description, link, image, bookWiki, authorWiki, onLearnMoreClick, isMobile, trackingCategory }) => {
  // Track card clicks based on category
  const trackClick = (isPopup = false) => {
    if (trackingCategory === 'books') {
      isPopup ? analytics.bookPopupOpen(title) : analytics.bookClick(title);
    } else if (trackingCategory === 'projects') {
      isPopup ? analytics.projectPopupOpen(title) : analytics.projectClick(title);
    } else if (trackingCategory === 'software') {
      analytics.softwareClick(title);
    }
  };

  // Helper function to create a clickable link or button based on popup availability
  const createLinkElement = (url, text, className = 'card-link') => {
    if (onLearnMoreClick && !isMobile) {
      return (
        <button onClick={() => { trackClick(true); onLearnMoreClick(url); }} className={className}>
          {text}
        </button>
      );
    }
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className={className} onClick={() => trackClick(false)}>
        {text}
      </a>
    );
  };

  const cardTitle = bookWiki ? createLinkElement(bookWiki, title) : title;
  const cardDescription = authorWiki ? createLinkElement(authorWiki, description) : description;

  return (
    <div className={`card ${image && bookWiki ? 'book-card' : ''}`}>
      {image && <img src={image} alt={title} className="card-image" />}
      <div className="card-content">
        <h3 className="card-title">{cardTitle}</h3>
        <p className="card-description">{cardDescription}</p>
        {link && createLinkElement(link, 'Learn More', 'card-link learn-more')}
      </div>
    </div>
  );
};

export default Card;
