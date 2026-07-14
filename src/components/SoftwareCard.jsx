import React from 'react';
import './SoftwareCard.css';
import { analytics } from '../utils/analytics';

/**
 * Terminal / browser-window styled card for the Software section.
 * Chrome bar with three traffic-light dots, then the software name
 * in monospace uppercase. The whole card links out.
 */
const SoftwareCard = ({ title, description, link }) => (
  <a
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    className="software-card"
    onClick={() => analytics.softwareClick(title)}
  >
    <div className="software-card-bar" aria-hidden="true">
      <span className="software-dot" />
      <span className="software-dot" />
      <span className="software-dot" />
    </div>
    <div className="software-card-body">
      <span className="software-card-name">{title}</span>
      {description && (
        <span className="software-card-desc">{description.trim()}</span>
      )}
    </div>
  </a>
);

export default SoftwareCard;
