import React from 'react';
import './Card.css';

const Card = ({ title, description, link, image, bookWiki, authorWiki }) => {
  const cardTitle = bookWiki ? (
    <a href={bookWiki} target="_blank" rel="noopener noreferrer" className="card-link">
      {title}
    </a>
  ) : (
    title
  );

  const cardDescription = authorWiki ? (
    <a href={authorWiki} target="_blank" rel="noopener noreferrer" className="card-link">
      {description}
    </a>
  ) : (
    description
  );

  return (
    <div className="card">
      {image && <img src={image} alt={title} className="card-image" />}
      <div className="card-content">
        <h3 className="card-title">{cardTitle}</h3>
        <p className="card-description">{cardDescription}</p>
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="card-link learn-more"
          >
            Learn More
          </a>
        )}
      </div>
    </div>
  );
};

export default Card;
