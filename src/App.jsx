import React, { useState, useRef, useEffect } from 'react';

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

  const theme = isDarkMode ? {
    background: '#1a1a1a',
    cardBg: '#2a2a2a',
    text: '#ffffff',
    textSecondary: '#a0a0a0',
    border: '#404040',
    button: '#4a4a4a',
    buttonHover: '#5a5a5a',
    input: '#333333',
    chatBg: '#252525',
    pillBg: '#333333',
    pillHover: '#404040',
    scrollButton: 'rgba(42, 42, 42, 0.9)',
    scrollbarThumb: '#404040',
    scrollbarTrack: '#2a2a2a'
  } : {
    background: '#f8f4eb',
    cardBg: '#ffffff',
    text: '#2c2c2c',
    textSecondary: '#666666',
    border: '#e8e1d4',
    button: '#826f5d',
    buttonHover: '#6d5c4d',
    input: '#ffffff',
    chatBg: '#f0f0f0',
    pillBg: '#e8e1d4',
    pillHover: '#d8d1c4',
    scrollButton: 'rgba(255, 255, 255, 0.9)',
    scrollbarThumb: '#c0c0c0',
    scrollbarTrack: '#f0f0f0'
  };

  const styles = {
    container: {
      height: '100vh',
      width: '100vw',
      padding: '1rem',
      backgroundColor: theme.background,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxSizing: 'border-box',
      margin: 0,
      position: 'relative',
      overflow: 'hidden',
    },
    content: {
      width: '100%',
      maxWidth: '800px',
      height: '650px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: theme.cardBg,
      borderRadius: '1rem',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
      overflow: 'hidden',
    },
    themeToggle: {
      position: 'fixed',
      right: '1rem',
      top: '1rem',
      width: '2.5rem',
      height: '2.5rem',
      borderRadius: '0.5rem',
      backgroundColor: theme.button,
      border: 'none',
      color: '#ffffff',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background-color 0.2s',
      fontSize: '1.2rem',
      zIndex: 10,
    },
    header: {
      padding: '1rem',
      borderBottom: `1px solid ${theme.border}`,
      textAlign: 'center',
      backgroundColor: theme.cardBg,
    },
    headerTitle: {
      color: theme.text,
      fontSize: '1.5rem',
      fontWeight: 'bold',
      margin: 0,
    },
    chatContainer: {
      flex: 1,
      overflowY: 'auto',
      padding: '1rem',
      backgroundColor: theme.chatBg,
      scrollBehavior: 'smooth',
      scrollbarWidth: 'thin',
      '&::-webkit-scrollbar': {
        width: '8px',
      },
      '&::-webkit-scrollbar-track': {
        background: theme.scrollbarTrack,
        borderRadius: '4px',
      },
      '&::-webkit-scrollbar-thumb': {
        background: theme.scrollbarThumb,
        borderRadius: '4px',
      },
    },
    messageList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    message: {
      maxWidth: '80%',
      padding: '0.75rem',
      borderRadius: '0.75rem',
      fontSize: '0.875rem',
      wordBreak: 'break-word',
    },
    assistantMessage: {
      backgroundColor: theme.button,
      color: '#ffffff',
      alignSelf: 'flex-start',
    },
    userMessage: {
      backgroundColor: theme.border,
      color: theme.text,
      alignSelf: 'flex-end',
    },
    suggestedQuestionsContainer: {
      position: 'relative',
      padding: '0.5rem 1rem',
      borderTop: `1px solid ${theme.border}`,
      backgroundColor: theme.cardBg,
    },
    suggestedQuestions: {
      display: 'flex',
      gap: '0.5rem',
      overflowX: 'auto',
      scrollBehavior: 'smooth',
      msOverflowStyle: 'none',
      scrollbarWidth: 'none',
      padding: '0.5rem',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
    scrollButton: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '2rem',
      height: '2rem',
      borderRadius: '50%',
      backgroundColor: theme.scrollButton,
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: theme.text,
      zIndex: 2,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      transition: 'opacity 0.2s',
    },
    scrollButtonLeft: {
      left: 0,
    },
    scrollButtonRight: {
      right: 0,
    },
    questionPill: {
      backgroundColor: theme.pillBg,
      color: theme.text,
      padding: '0.5rem 1rem',
      borderRadius: '999px',
      fontSize: '0.875rem',
      border: 'none',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      transition: 'background-color 0.2s',
      '&:hover': {
        backgroundColor: theme.pillHover,
      },
    },
    inputArea: {
      display: 'flex',
      padding: '1rem',
      borderTop: `1px solid ${theme.border}`,
      backgroundColor: theme.cardBg,
      gap: '0.5rem',
    },
    input: {
      flex: 1,
      padding: '0.75rem',
      borderRadius: '0.375rem',
      border: `1px solid ${theme.border}`,
      backgroundColor: theme.input,
      color: theme.text,
      fontSize: '0.875rem',
      '&:focus': {
        outline: 'none',
        borderColor: theme.button,
      },
    },
    sendButton: {
      padding: '0.75rem 1.25rem',
      borderRadius: '0.375rem',
      backgroundColor: theme.button,
      color: '#ffffff',
      border: 'none',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      fontSize: '0.875rem',
      '&:hover': {
        backgroundColor: theme.buttonHover,
      },
    },
    footer: {
      position: 'fixed',
      bottom: '0.5rem',
      left: '0',
      right: '0',
      textAlign: 'center',
      fontSize: 'clamp(0.75rem, 1.8vw, 0.875rem)',
      color: theme.textSecondary,
      pointerEvents: 'none',
      zIndex: 10,
    },
    link: {
      color: theme.button,
      textDecoration: 'none',
      fontWeight: 'bold',
      pointerEvents: 'auto',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  };

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
        // Get the width of a single question pill plus its margin
        const questionWidth = questionElements[0].offsetWidth + 8; // 8px for the gap
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
    <div style={styles.container}>
      <button 
        style={styles.themeToggle}
        onClick={() => setIsDarkMode(!isDarkMode)}
        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>

      <div style={styles.content}>
        <header style={styles.header}>
          <h1 style={styles.headerTitle}>Ask About Me 👋</h1>
        </header>

        <main style={styles.chatContainer}>
          <div style={styles.messageList}>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  ...styles.message,
                  ...(msg.role === 'assistant' ? styles.assistantMessage : styles.userMessage)
                }}
              >
                {msg.content}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </main>

        <div style={styles.suggestedQuestionsContainer}>
          {showLeftScroll && (
            <button
              style={{...styles.scrollButton, ...styles.scrollButtonLeft}}
              onClick={() => scroll('left')}
              aria-label="Scroll left"
            >
              ◀
            </button>
          )}
          <div ref={questionsRef} style={styles.suggestedQuestions}>
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                style={styles.questionPill}
                onClick={() => handleQuestionClick(question)}
              >
                {question}
              </button>
            ))}
          </div>
          {showRightScroll && (
            <button
              style={{...styles.scrollButton, ...styles.scrollButtonRight}}
              onClick={() => scroll('right')}
              aria-label="Scroll right"
            >
              ▶
            </button>
          )}
        </div>

        <footer style={styles.inputArea}>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            style={styles.input}
            placeholder="Ask me anything..."
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button 
            style={styles.sendButton}
            onClick={() => sendMessage()}
            aria-label="Send message"
          >
            Send
          </button>
        </footer>
      </div>

      <div style={styles.footer}>
        Designed by{' '}
        <a
          href="https://github.com/azariak"
          target="_blank"
          rel="noopener noreferrer"
          style={styles.link}
        >
          Azaria Kelman.
        </a>
      </div>
    </div>
  );
};

export default PersonalPortfolio;