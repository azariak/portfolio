import React, { useEffect } from 'react';
import PersonalPortfolio from '../components/PersonalPortfolio';

const AskMeAnything = ({ isDarkMode }) => {
  useEffect(() => {
    document.title = 'Azaria Kelman - Ask Me Anything';
  }, []);

  return <PersonalPortfolio isDarkMode={isDarkMode} />;
};

export default AskMeAnything;
