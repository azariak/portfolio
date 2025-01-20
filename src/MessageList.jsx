import React from 'react';

const MessageList = ({ messages }) => {
  return (
    <div className="message-list">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`message ${msg.role === 'assistant' ? 'assistant-message' : 'user-message'}`}
        >
          {msg.content}
        </div>
      ))}
    </div>
  );
};

export default MessageList;
