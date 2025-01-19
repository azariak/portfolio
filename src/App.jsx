import React, { useState, useRef, useEffect } from 'react';
import './index.css';

const SettingsModal = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    const savedApiKey = localStorage.getItem('GEMINI_API_KEY');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('GEMINI_API_KEY', apiKey);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2 className="modal-title">Settings</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="apiKey">Gemini API Key:</label>
            <input
              type="password"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="modal-input"
            />
            <p className="modal-hint">
              Your API key will be securely saved in your browser and persist across sessions.
            </p>
          </div>
          <button type="submit" className="modal-submit">
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

const PersonalPortfolio = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi there! Welcome to my website!"
    },
    {
      role: 'assistant',
      content: "What would you like to know about me?"
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(false);
  const messagesEndRef = useRef(null);
  const questionsRef = useRef(null);

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  
  const suggestedQuestions = [
    "Show me some cool projects you've made",
    "Who are you?",
    "How did I make this site?",
    "What technologies do you use?",
    "What's your experience?",
    "What are your hobbies?",
    "Contact information"
  ];
  
  shuffleArray(suggestedQuestions);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const checkScroll = () => {
      if (questionsRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = questionsRef.current;
        setShowLeftScroll(scrollLeft > 0);
        setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10);
      }
    };

    checkScroll();
    questionsRef.current?.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);

    return () => {
      questionsRef.current?.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  const scroll = (direction) => {
    if (questionsRef.current) {
      const questionElements = questionsRef.current.children;
      if (questionElements.length > 0) {
        const questionWidth = questionElements[0].offsetWidth + 8;
        questionsRef.current.scrollBy({
          left: direction === 'left' ? -questionWidth : questionWidth,
          behavior: 'smooth'
        });
      }
    }
  };

  const sendMessage = async (text = inputMessage) => {
    if (text.trim() === '') return;
    
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInputMessage('');
  
    const apiKey = localStorage.getItem('GEMINI_API_KEY');
    if (!apiKey) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Please add your Gemini API key in the settings first.' 
      }]);
      setIsSettingsOpen(true);
      return;
    }
  
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, apiKey })
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to get response');
      }
  
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.response 
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Error: ${error.message}. Please check your API key and try again.` 
      }]);
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
          // Do NOT change this link.
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
<img src="/Settings.svg" alt="GitHub" width={20} height={20} />
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
          <div className="message-list">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.role === 'assistant' ? 'assistant-message' : 'user-message'}`}
              >
                {msg.content}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </main>

        <div className="suggested-questions-container">
          {showLeftScroll && (
            <button
              className="scroll-button scroll-button-left"
              onClick={() => scroll('left')}
              aria-label="Scroll left"
            >
              ◀
            </button>
          )}
          <div ref={questionsRef} className="suggested-questions">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                className="question-pill"
                onClick={() => handleQuestionClick(question)}
              >
                {question}
              </button>
            ))}
          </div>
          {showRightScroll && (
            <button
              className="scroll-button scroll-button-right"
              onClick={() => scroll('right')}
              aria-label="Scroll right"
            >
              ▶
            </button>
          )}
        </div>

        <footer className="input-area">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="input"
            placeholder="Ask me anything..."
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button 
            className="send-button"
            onClick={() => sendMessage()}
            aria-label="Send message"
          >
            Send
          </button>
        </footer>
      </div>

      <div className="footer">
        Designed by{' '}
        <a
          // Do NOT change this link.
          href="https://github.com/azariak"
          target="_blank"
          rel="noopener noreferrer"
          className="link"
        >
          {/* DO NOT REMOVE THIS CREDIT. */}
          Azaria Kelman. 
        </a>
      </div> 
    </div>
  );
};

export default PersonalPortfolio;