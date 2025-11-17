import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const qaPairs = {
    "Who are you?": "I'm a University of Toronto student studying Computer Science and Philosophy. "
    // "More coming soon...": ""
  };

  const features = [
    {
      title: "Ask Anything",
      path: "/ask",
      description: "Have a question? Ask me anything using AI! Get personalized responses based on my knowledge and experiences."
    },
    {
      title: "Projects",
      path: "/projects",
      description: "Explore the projects I've built, from web applications to a game I made in Assembly."
    },
    {
      title: "My Bookshelf",
      path: "/books",
      description: "Discover some books I've read recently that have recently shaped my thinking and interests across various topics."
    },
    {
      title: "Software I Like",
      path: "/software",
      description: "A curated list of software tools and applications that I find useful."
    }
  ];

  return (
    <div className="home-container">
      <div className="intro-text">
        <h1>Welcome! I'm Azaria Kelman</h1>
      </div>
      <div className="qa-section">
        {Object.entries(qaPairs).map(([question, answer]) => (
          <div className="qa-pair" key={question}>
            <h2 className="question">{question}</h2>
            <p className="answer">{answer}</p>
          </div>
        ))}
      </div>
      
      <div className="features-tour">
        <h2 className="tour-heading">Explore the Site</h2>
        <div className="features-grid">
          {features.map((feature) => (
            <Link to={feature.path} key={feature.title} className="feature-card">
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
