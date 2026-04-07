import React, { useState, useRef, useCallback } from 'react';

/**
 * Message input bar with text field, emoji placeholder, and send button.
 * Owner: Mahalakshmi (Module 2)
 *
 * @param {Function} onSend       - Called with { content, messageType }
 * @param {Function} onTyping     - Called with boolean (isTyping)
 * @param {boolean}  disabled     - Disables input when WS not connected
 */
const MessageInput = ({ onSend, onTyping, disabled = false }) => {
  const [text, setText] = useState('');
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);

  const handleChange = (e) => {
    setText(e.target.value);

    // Fire typing=true once per burst
    if (!isTypingRef.current && onTyping) {
      onTyping(true);
      isTypingRef.current = true;
    }

    // Stop typing after 1.5s of inactivity
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      if (onTyping) onTyping(false);
      isTypingRef.current = false;
    }, 1500);
  };

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed) return;

    onSend({ content: trimmed, messageType: 'TEXT' });
    setText('');

    // Stop typing indicator immediately on send
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    if (onTyping) onTyping(false);
    isTypingRef.current = false;
  }, [text, onSend, onTyping]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="msg-input-bar">
      {/* Emoji button — wired to EmojiReactionPicker by Kavi (Module 4) */}
      <button className="msg-input-emoji-btn" title="Emoji" disabled={disabled}>
        😊
      </button>

      <textarea
        id="message-input"
        className="msg-input-field"
        placeholder={disabled ? 'Connecting…' : 'Type a message…'}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        rows={1}
      />

      {/* File upload — wired to FileUploader by Kavi (Module 4) */}
      <button className="msg-input-attach-btn" title="Attach file" disabled={disabled}>
        📎
      </button>

      <button
        id="send-message-btn"
        className="msg-input-send-btn"
        onClick={handleSend}
        disabled={disabled || !text.trim()}
        title="Send"
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
        </svg>
      </button>
    </div>
  );
};

export default MessageInput;
