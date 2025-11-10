import React from 'react';
import PersonalPortfolio from '../components/PersonalPortfolio';

const Home = ({ isDarkMode, setIsDarkMode }) => {
  return <PersonalPortfolio isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />;
};

export default Home;
