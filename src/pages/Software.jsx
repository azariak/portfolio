import React, { useEffect } from 'react';
import Card from '../components/Card';
import softwareData from '../data/software.json';
import './Software.css';

const Software = () => {
  useEffect(() => {
    document.title = 'Azaria Kelman - Software';
  }, []);

  return (
    <div className="software-page">
      <h1>Software I Like</h1>
      <div className="card-grid">
        {softwareData.map((software, index) => (
          <Card
            key={index}
            title={software.title}
            description={software.description}
            link={software.link}
            trackingCategory="software"
          />
        ))}
      </div>
    </div>
  );
};

export default Software;
