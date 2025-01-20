import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import SettingsModal from './SettingsModal';
import MessageList from './MessageList';
import InputArea from './InputArea';
import SuggestedQuestions from './SuggestedQuestions';
import './index.css';
import questionsAndAnswers from './data/questionsAndAnswers.json';

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
    { role: 'assistant', content: "What would you like to know about me?" },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState(
    questionsAndAnswers.suggestedQuestions
  );

  const predefinedAnswers = questionsAndAnswers.predefinedAnswers;
  const systemInstructions = questionsAndAnswers.systemInstructions;
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setSuggestedQuestions((prevQuestions) => shuffleArray([...prevQuestions]));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateResponse = async (text, apiKey) => {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = systemInstructions + "\n\nUser: " + text;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  };

  const sendMessage = async (text = inputMessage) => {
    if (text.trim() === '' || isLoading) return;

    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setInputMessage('');
    setIsLoading(true);

    const simulateThinking = () => new Promise(resolve => setTimeout(resolve, 900));

    if (predefinedAnswers[text]) {
      await simulateThinking();
      const answers = predefinedAnswers[text];
      const randomAnswer = answers[Math.floor(Math.random() * answers.length)];
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: randomAnswer },
      ]);
      setIsLoading(false);
      return;
    }

    try {
      let response;

      // Try with local API key first
      const localApiKey = localStorage.getItem('GEMINI_API_KEY');
      if (localApiKey) {
        try {
          response = await generateResponse(text, localApiKey);
        } catch (error) {
          console.error('Local API key error:', error);
          if (error.message.includes('Invalid API key')) {
            localStorage.removeItem('GEMINI_API_KEY');
          }
        }
      }

      // If local key failed, try server API
      if (!response) {
        try {
          const serverResponse = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: text }),
          });

          if (!serverResponse.ok) {
            throw new Error('Server API failed');
          }

          const data = await serverResponse.json();
          response = data.response;
        } catch (error) {
          console.error('Server API error:', error);
        }
      }

      // If both local and server failed, prompt user
      if (!response) {
        throw new Error('Both local and server APIs failed');
      }

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: response },
      ]);
    } catch (error) {
      console.error('API error:', error);
      await simulateThinking();
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'An error occurred. Please check your API key in the settings or try again later.',
        },
      ]);
      setIsSettingsOpen(true);
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
          <div ref={messagesEndRef} />
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
