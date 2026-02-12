import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import { analytics } from '../utils/analytics';

const Home = () => {
  useEffect(() => {
    document.title = 'Azaria Kelman';
  }, []);

  const links = [
    { title: "Projects", path: "/projects" },
    // { title: "Books", path: "/books" },
    { title: "Software", path: "/software" },
    // { title: "Ask Me Anything", path: "/ask" },
  ];

  return (
    <div className="home-container">
      <div className="hero">
        <h1 className="name">Azaria Kelman</h1>
        <p className="tagline">Computer Science & Philosophy at University of Toronto</p>
      </div>

      <div className="about">
        <p className="interests">
          Reading · Chess · GeoGuessr · Tennis · Skiing
        </p>
      </div>

      <nav className="nav-links">
        {links.map((link) => (
          <Link
            to={link.path}
            key={link.title}
            className="nav-link"
            onClick={() => analytics.featureCardClick(link.title)}
          >
            {link.title}
          </Link>
        ))}
      </nav>

      <footer className="home-footer">
        <a href="mailto:azaria.kelman@mail.utoronto.ca" className="footer-link">Email</a>
        <span className="separator">·</span>
        <a href="https://github.com/azariak" target="_blank" rel="noopener noreferrer" className="footer-link">GitHub</a>
        <span className="separator">·</span>
        <a href="https://www.linkedin.com/in/azaria-kelman/" target="_blank" rel="noopener noreferrer" className="footer-link">LinkedIn</a>
      </footer>
    </div>
  );
};

export default Home;
