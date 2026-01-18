import React, { useState, useEffect, useRef } from 'react';
import './CommandLine.css';
import projectsData from '../data/projects.json';
import booksData from '../data/books.json';
import softwareData from '../data/software.json';
import questionsAndAnswers from '../data/questionsAndAnswers.json';

const CommandLine = () => {
  const [history, setHistory] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);
  const terminalRef = useRef(null);

  const BANNER = `
    ╔═══════════════════════════════════════════╗
    ║   Welcome to Azaria's Terminal v1.0      ║
    ║   Type 'help' for available commands     ║
    ╚═══════════════════════════════════════════╝
  `;

  useEffect(() => {
    setHistory([{ type: 'output', content: BANNER }]);
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const commands = {
    help: () => ({
      type: 'output',
      content: `Available commands:
  help            - Show this help message
  about           - Learn about me
  ask <question>  - Ask AI anything about me
  projects        - List all projects
  project <id>    - Show details for a specific project
  books           - List my bookshelf
  software        - List software I use
  clear           - Clear the terminal
  banner          - Show welcome banner
  date            - Show current date and time
  echo <text>     - Echo back the text
  `
    }),

    about: () => ({
      type: 'output',
      content: `Azaria Kelman
Developer | Problem Solver | Tech Enthusiast

Visit other sections to learn more:
- /ask - Chat with AI about me
- /projects - View my work
- /books - See what I'm reading
- /software - Check out my favorite tools
      `
    }),

    projects: () => ({
      type: 'output',
      content: `My Projects:\n${projectsData.map((p, i) =>
        `${i + 1}. ${p.title} - ${p.description.substring(0, 60)}...`
      ).join('\n')}\n\nUse 'project <number>' to see details`
    }),

    project: (args) => {
      const id = parseInt(args[0]);
      if (!id || id < 1 || id > projectsData.length) {
        return { type: 'error', content: 'Invalid project ID. Use "projects" to see all projects.' };
      }
      const project = projectsData[id - 1];
      return {
        type: 'output',
        content: `${project.title}
${'─'.repeat(project.title.length)}
${project.description}

Tech Stack: ${project.techStack?.join(', ') || 'N/A'}
${project.github ? `GitHub: ${project.github}` : ''}
${project.link ? `Demo: ${project.link}` : ''}
        `
      };
    },

    books: () => ({
      type: 'output',
      content: `My Bookshelf:\n${booksData.map((b, i) =>
        `${i + 1}. "${b.title}" by ${b.author}`
      ).join('\n')}`
    }),

    software: () => ({
      type: 'output',
      content: `Software I Use:\n${softwareData.map((s, i) =>
        `${i + 1}. ${s.title} - ${s.description}`
      ).join('\n')}`
    }),

    clear: () => {
      setHistory([]);
      return null;
    },

    banner: () => ({
      type: 'output',
      content: BANNER
    }),

    date: () => ({
      type: 'output',
      content: new Date().toString()
    }),

    echo: (args) => ({
      type: 'output',
      content: args.join(' ')
    }),

    ask: async (args, updateHistory) => {
      const question = args.join(' ');
      if (!question.trim()) {
        return {
          type: 'error',
          content: 'Please provide a question. Usage: ask <question>'
        };
      }

      // Add a loading message
      const loadingIndex = updateHistory({ type: 'output', content: 'Thinking...' });

      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: question,
            systemInstructions: questionsAndAnswers.systemInstructions
          }),
        });

        if (!response.ok) {
          let errorMessage = `API error: ${response.status}`;
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorData.details || errorMessage;
          } catch (e) {
            // If JSON parsing fails, try to get text
            try {
              const errorText = await response.text();
              if (errorText) errorMessage = errorText;
            } catch (textError) {
              // Fall back to status-based message
            }
          }
          throw new Error(errorMessage);
        }

        if (!response.body) {
          throw new Error('Response body is null');
        }

        // Remove loading message and prepare for streaming
        updateHistory({ type: 'output', content: '' }, loadingIndex);

        const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
        let fullResponse = '';

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const lines = value.split('\n');
          for (const line of lines) {
            if (line.startsWith('data:')) {
              try {
                const json = JSON.parse(line.substring(5).trim());
                if (json.chunk) {
                  fullResponse += json.chunk;
                  updateHistory({ type: 'output', content: fullResponse }, loadingIndex);
                } else if (json.error) {
                  throw new Error(`Server error: ${json.details || json.error}`);
                }
              } catch (e) {
                if (e.message.includes('Server error')) throw e;
                console.error("Error parsing SSE line:", line, e);
              }
            }
          }
        }

        return null; // Already handled by updateHistory
      } catch (error) {
        console.error('Ask command error:', error);
        updateHistory({
          type: 'error',
          content: `Error: ${error.message || 'Failed to get AI response'}`
        }, loadingIndex);
        return null;
      }
    }
  };

  const executeCommand = async (input) => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setHistory(prev => [...prev, { type: 'input', content: trimmed }]);
    setCommandHistory(prev => [...prev, trimmed]);
    setHistoryIndex(-1);

    const [cmd, ...args] = trimmed.split(' ');
    const command = cmd.toLowerCase();

    if (commands[command]) {
      // Helper function to update history at a specific index
      let loadingIndexRef = null;
      const updateHistory = (item, index = null) => {
        if (index !== null) {
          // Update existing item at index
          setHistory(prev => {
            const newHistory = [...prev];
            newHistory[index] = item;
            return newHistory;
          });
          return index;
        } else {
          // Add new item and return its index
          setHistory(prev => {
            loadingIndexRef = prev.length;
            return [...prev, item];
          });
          return loadingIndexRef;
        }
      };

      const result = await commands[command](args, updateHistory);
      if (result) {
        setHistory(prev => [...prev, result]);
      }
    } else {
      setHistory(prev => [...prev, {
        type: 'error',
        content: `Command not found: ${command}. Type 'help' for available commands.`
      }]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeCommand(currentInput);
      setCurrentInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else {
        setHistoryIndex(-1);
        setCurrentInput('');
      }
    }
  };

  return (
    <div className="terminal-container" onClick={() => inputRef.current?.focus()}>
      <div className="terminal-header">
        <div className="terminal-buttons">
          <span className="terminal-button close"></span>
          <span className="terminal-button minimize"></span>
          <span className="terminal-button maximize"></span>
        </div>
        <div className="terminal-title">terminal@azariak.com</div>
      </div>
      <div className="terminal-body" ref={terminalRef}>
        {history.map((item, index) => (
          <div key={index} className={`terminal-line ${item.type}`}>
            {item.type === 'input' ? (
              <><span className="prompt">visitor@azariak:~$</span> {item.content}</>
            ) : (
              <pre className={item.type === 'error' ? 'error-text' : ''}>{item.content}</pre>
            )}
          </div>
        ))}
        <div className="terminal-line current">
          <span className="prompt">visitor@azariak:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="terminal-input"
            autoFocus
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
};

export default CommandLine;
