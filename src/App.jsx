import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import SettingsModal from './SettingsModal';
import MessageList from './MessageList';
import InputArea from './InputArea';
import SuggestedQuestions from './SuggestedQuestions';
import './index.css';

// Add the shuffleArray function
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

const PersonalPortfolio = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi there! Welcome to my website!" },
    { role: 'assistant', content: "What would you like to know about me?" }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState([
    "Show me some cool projects you've made",
    "Who are you?",
    "How did I make this site?",
    "What technologies do you use?",
    "What's your experience?",
    "What are your hobbies?",
    "Contact information"
  ]);

  useEffect(() => {
    setSuggestedQuestions(prevQuestions => shuffleArray([...prevQuestions]));
  }, []);

  const sendMessage = async (text = inputMessage) => {
    if (text.trim() === '' || isLoading) return;

    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInputMessage('');
    setIsLoading(true);

    const apiKey = localStorage.getItem('GEMINI_API_KEY');
    if (!apiKey) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Please add your Gemini API key in the settings first.' 
      }]);
      setIsSettingsOpen(true);
      setIsLoading(false);
      return;
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const INSTRUCTIONS = [
        "You are azariakelman.com, the portfolio website of Azaria Kelman.",
        "Your job is to tell the user about me in a sincere way.",
        "Some things about me: I'm a third year studying Computer Science and Philosophy at the University of Toronto."
      ].join(' ');

      const prompt = INSTRUCTIONS + "\n\nUser: " + text;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const generatedText = response.text();

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: generatedText 
      }]);
    } catch (error) {
      console.error('Gemini API error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Error: ${error.message}. Please check your API key and try again.` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionClick = (question) => {
    sendMessage(question);
  };

  return (
    <div className={`container ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="header-controls">
        <button 
          className="control-button"
          onClick={() => setIsDarkMode(!isDarkMode)}
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
        <button 
          className="control-button"
          onClick={() => window.open('https://github.com/azariak/portfolio', '_blank')}
          aria-label="GitHub Profile"
        >
          <img src="/github-mark-white.png" alt="GitHub" width={20} height={20} />
        </button>
        <button 
          className="control-button"
          onClick={() => setIsSettingsOpen(true)}
          aria-label="Open Settings"
        >
          <img src="/Settings.svg" alt="Settings" width={20} height={20} />
        </button>
      </div>

      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <div className="content">
        <header className="header">
          <h1 className="header-title">Ask About Me 👋</h1>
        </header>

        <main className="chat-container">
          <MessageList messages={messages} />
        </main>

        <SuggestedQuestions 
          suggestedQuestions={suggestedQuestions} 
          handleQuestionClick={handleQuestionClick} 
        />

        <InputArea 
          inputMessage={inputMessage} 
          setInputMessage={setInputMessage} 
          sendMessage={sendMessage} 
          isLoading={isLoading} 
        />

        <div className="ai-disclaimer">
          AI responses are not perfect. Sometimes it makes stuff up about me.
        </div>
      </div>

      <div className="footer">
        Designed by{' '}
        <a
          href="https://github.com/azariak"
          target="_blank"
          rel="noopener noreferrer"
          className="link"
        >
          Azaria Kelman.
        </a>
      </div> 
    </div>
  );
};

export default PersonalPortfolio;
