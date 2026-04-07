import React, { useState, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { uploadMedia } from '../../media/mediaSlice';

/**
 * Message input bar with text field, emoji picker, file attach, and send button.
 *
 * @param {Function} onSend       - Called with { content, messageType, mediaId }
 * @param {Function} onTyping     - Called with boolean (isTyping)
 * @param {boolean}  disabled     - Disables input when WS not connected
 */

const EMOJI_LIST = ['😀','😂','❤️','👍','🎉','🔥','😍','🤔','😢','👋','💯','🙏','😎','🥳','✨','💪'];

const MessageInput = ({ onSend, onTyping, disabled = false }) => {
  const dispatch = useDispatch();
  const [text, setText] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [uploading, setUploading] = useState(false);
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);
  const fileInputRef = useRef(null);

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

  // ── Emoji picker ──────────────────────────────────────────────
  const handleEmojiClick = (emoji) => {
    setText((prev) => prev + emoji);
    setShowEmoji(false);
  };

  // ── File attachment ───────────────────────────────────────────
  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await dispatch(uploadMedia(file)).unwrap();
      // Send a message with the media info
      const isImage = file.type.startsWith('image/');
      onSend({
        content: isImage ? result.url : `📎 ${result.fileName}`,
        messageType: isImage ? 'IMAGE' : 'FILE',
        mediaId: result.id,
      });
    } catch (err) {
      console.error('File upload failed:', err);
    } finally {
      setUploading(false);
      // Reset the file input
      e.target.value = '';
    }
  };

  return (
    <div className="msg-input-bar" style={{ position: 'relative' }}>
      {/* Emoji Picker Popup */}
      {showEmoji && (
        <div
          style={{
            position: 'absolute', bottom: '100%', left: 0,
            background: 'var(--bg-bubble-in)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)', padding: '10px',
            display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 4,
            boxShadow: 'var(--shadow)', zIndex: 10, marginBottom: 6,
          }}
        >
          {EMOJI_LIST.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleEmojiClick(emoji)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 22, padding: 4, borderRadius: 6,
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Emoji button */}
      <button
        className="msg-input-emoji-btn"
        title="Emoji"
        disabled={disabled}
        onClick={() => setShowEmoji(!showEmoji)}
        style={{ background: showEmoji ? 'var(--bg-bubble-in)' : undefined }}
      >
        😊
      </button>

      <textarea
        id="message-input"
        className="msg-input-field"
        placeholder={disabled ? 'Connecting…' : uploading ? 'Uploading file…' : 'Type a message…'}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled || uploading}
        rows={1}
      />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept="image/*,.pdf,.doc,.docx,.txt,.zip,.rar"
      />

      {/* File upload button */}
      <button
        className="msg-input-attach-btn"
        title="Attach file"
        disabled={disabled || uploading}
        onClick={handleFileClick}
      >
        {uploading ? '⏳' : '📎'}
      </button>

      <button
        id="send-message-btn"
        className="msg-input-send-btn"
        onClick={handleSend}
        disabled={disabled || uploading || !text.trim()}
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
