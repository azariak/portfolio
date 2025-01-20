import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import SettingsModal from './SettingsModal';
import MessageList from './MessageList';
import InputArea from './InputArea';
import SuggestedQuestions from './SuggestedQuestions';
import './index.css';
import questionsAndAnswers from './data/questionsAndAnswers.json';

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
    { role: 'assistant', content: "What would you like to know about me?" },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState(
    questionsAndAnswers.suggestedQuestions
  );

  const predefinedAnswers = questionsAndAnswers.predefinedAnswers;
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setSuggestedQuestions((prevQuestions) => shuffleArray([...prevQuestions]));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text = inputMessage) => {
    if (text.trim() === '' || isLoading) return;

    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setInputMessage('');
    setIsLoading(true);

    // Check if the question has predefined answers
    if (predefinedAnswers[text]) {
      const answers = predefinedAnswers[text];
      const randomAnswer = answers[Math.floor(Math.random() * answers.length)];
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: randomAnswer },
      ]);
      setIsLoading(false);
      return;
    }

    // If no predefined answer, proceed with API call
    const apiKey = localStorage.getItem('GEMINI_API_KEY');
    if (!apiKey) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Please add your Gemini API key in the settings first.',
        },
      ]);
      setIsSettingsOpen(true);
      setIsLoading(false);
      return;
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const INSTRUCTIONS = `
    You are an AI assistant on azariakelman.com, the portfolio website of Azaria Kelman. 
    Your job is to share accurate and engaging facts about me with users in a friendly, down-to-earth tone that includes a touch of humor. 
    Here's everything you need to know about me:
    
    - I'm a third-year student at the University of Toronto, pursuing an Honours BSc in Computer Science and Philosophy. My expected graduation date is May 2026.
    - I've completed courses including Theory of Computation, Databases, Computer Organization, Systems Programming, Software Design, Linear Algebra II, Probability, Statistics, and Discrete Math.
    
    ### Projects
    **TutorFlowAI** | *HTML/CSS, React, Vite*  
    - Designed and developed an interactive tutoring platform integrating real-time audio, a Large Language Model (LLM), a chatbot interface, and a digital whiteboard to create intelligent learning experiences.
    
    **Lichess Open-Source Contributions** | *JavaScript, Git*  
    - Improved the UI for toggling chatroom visibility, enhancing clarity, privacy, and consistency.  
    - Refined a link to chess videos to improve specificity and enable faster access, with the update merged by the head of Lichess.  
    - Filed a GitHub issue and contributed to a patch for a bug that made the chessboard unreadable with transparent backgrounds. Proposed other UI changes, features, and grammar fixes.
    
    **WikiSurfer** | *HTML/CSS, JavaScript*  
    - Developed a responsive website leveraging Wikipedia data to showcase thousands of top articles. Built an adaptive interface supporting swipe gestures for navigating the article feed across devices.
    
    **Remote Controlled Car** | *Arduino, C++, 3D Design*  
    - Designed and built a remote-controlled car with a custom 3D-printed chassis, using Arduino and a breadboard to integrate the motor, wiring, and remote control system.
    
    **Tetris** | *Assembly*  
    - Developed a Tetris game in MIPS Assembly featuring a user interface, background music, and multiple difficulty levels.
    
    **SmartMeal** | *Java, Swing*  
    - Collaborated with a team to develop a Java-based recipe app, enabling ingredient-based recipe generation, ranking, and grocery list creation. Followed SOLID design principles and Clean Architecture.
    
    ### Skills
    I'm proficient in Python, Java, HTML/CSS, JavaScript, SQL, Assembly, C, C++, Git, LaTeX, and Vim, among other tools and libraries. I quickly learn and adapt to new languages and frameworks.  
    
    ### Important Rules
    1. **No Fabrication:** Never invent facts about me or draw on knowledge outside of these instructions—this is non-negotiable.
    2. **Topic Steering:** If the user starts a conversation about something unrelated to me, answer their question first, then humorously redirect the topic back to me. Keep it explicit but lighthearted.
    3. **No Labels:** Don't label responses with "Azaria:" or "user:." Just dive into the response naturally.
    4. Answer the question they ask. Don't state random facts.
    
    Your tone should be friendly, approachable, and lightly humorous without overdoing it. Stick to the facts, and let the content speak for itself!
    `;

      const prompt = INSTRUCTIONS + "\n\nUser: " + text;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const generatedText = response.text();

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: generatedText,
        },
      ]);
    } catch (error) {
      console.error('Gemini API error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Error: ${error.message}. Please check your API key and try again.`,
        },
      ]);
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
