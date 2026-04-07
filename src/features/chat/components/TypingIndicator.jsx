import React from 'react';
import { useSelector } from 'react-redux';
import { selectTypingIndicator } from '../chatSlice';

/**
 * Typing indicator component — shows animated dots when the other user is typing.
 * Owner: Mahalakshmi (Module 2)
 */
const TypingIndicator = ({ chatId }) => {
  const typing = useSelector(selectTypingIndicator(chatId));

  if (!typing) return null;

  return (
    <div className="typing-indicator-wrapper">
      <div className="typing-bubble">
        <span className="typing-username">{typing.senderUsername}</span>
        <span className="typing-text"> is typing</span>
        <span className="typing-dots">
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
        </span>
      </div>
    </div>
  );
};

export default TypingIndicator;
