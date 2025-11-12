import React from 'react';
import './Home.css';

const Home = () => {
  const qaPairs = {
    "Who are you?": "I'm a University of Toronto student studying Computer Science and Philosophy. "
    // "More coming soon...": ""
  };

  return (
    <div className="home-container">
      <div className="intro-text">
        <h1>Welcome! I'm Azaria Kelman👋</h1>
      </div>
      <div className="qa-section">
        {Object.entries(qaPairs).map(([question, answer]) => (
          <div className="qa-pair" key={question}>
            <h2 className="question">{question}</h2>
            <p className="answer">{answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
