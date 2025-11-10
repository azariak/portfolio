import React from 'react';
import './Card.css';

const Card = ({ title, description: author, link, image, bookWiki, authorWiki }) => {
  return (
    <div className="card">
      {image && <img src={image} alt={title} className="card-image" />}
      <div className="card-content">
        <h3 className="card-title">
          <a href={bookWiki} target="_blank" rel="noopener noreferrer" className="card-link">
            {title}
          </a>
        </h3>
        <p className="card-description">
          <a href={authorWiki} target="_blank" rel="noopener noreferrer" className="card-link">
            {author}
          </a>
        </p>
      </div>
    </div>
  );
};

export default Card;
