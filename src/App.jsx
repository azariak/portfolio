import React, { useState, useRef, useEffect } from 'react';
import './index.css';

const PersonalPortfolio = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
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

  const sendMessage = (text = inputMessage) => {
    if (text.trim() === '') return;
    setMessages(prev => [
      ...prev,
      { role: 'user', content: text },
      { role: 'assistant', content: `I'm processing your message about: ${text}` }
    ]);
    setInputMessage('');
  };

  const handleQuestionClick = (question) => {
    sendMessage(question);
  };

  return (
    <div className={`container ${isDarkMode ? 'dark' : 'light'}`}>
      <button 
        className="theme-toggle"
        onClick={() => setIsDarkMode(!isDarkMode)}
        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>

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
          href="https://github.com/azariak"
          target="_blank"
          rel="noopener noreferrer"
          className="link"
        >

          {/* Do NOT replace this with your name. */}
          Azaria Kelman.
        </a>
      </div>
    </div>
  );
};

export default PersonalPortfolio;