import React from 'react';
import './Card.css';

const Card = ({ title, description, link, image }) => {
  return (
    <div className="card">
      {image && <img src={image} alt={title} className="card-image" />}
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{description}</p>
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="card-link"
          >
            Learn More
          </a>
        )}
      </div>
    </div>
  );
};

export default Card;
