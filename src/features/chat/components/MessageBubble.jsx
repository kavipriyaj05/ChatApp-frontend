import React from 'react';
import MessageStatusIcon from './MessageStatusIcon';

/**
 * Individual message bubble component.
 * Owner: Mahalakshmi (Module 2)
 *
 * @param {object} message        - MessageResponse from backend
 * @param {number} currentUserId  - Logged-in user's ID
 * @param {Function} onDelete     - Callback to delete message
 */
const MessageBubble = ({ message, currentUserId, onDelete }) => {
  const isMine = message.senderId === currentUserId;
  const isDeleted = message.isDeleted;

  const formatTime = (isoStr) => {
    if (!isoStr) return '';
    return new Date(isoStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`msg-row ${isMine ? 'msg-row--mine' : 'msg-row--theirs'}`}>
      {/* Avatar — only for incoming messages */}
      {!isMine && (
        <div className="msg-avatar">
          {message.senderProfilePicture ? (
            <img src={message.senderProfilePicture} alt={message.senderUsername} />
          ) : (
            <span className="msg-avatar-initials">
              {message.senderUsername?.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
      )}

      <div className={`msg-bubble ${isMine ? 'msg-bubble--mine' : 'msg-bubble--theirs'}`}>
        {/* Sender name for incoming */}
        {!isMine && (
          <span className="msg-sender-name">{message.senderUsername}</span>
        )}

        {/* Message content */}
        {isDeleted ? (
          <p className="msg-content msg-content--deleted">🚫 This message was deleted.</p>
        ) : message.messageType === 'TEXT' ? (
          <p className="msg-content">{message.content}</p>
        ) : message.messageType === 'IMAGE' ? (
          <div className="msg-media">
            <img src={`/api/media/file/${message.mediaId}`} alt="shared" className="msg-image" />
          </div>
        ) : (
          <div className="msg-file">
            <span className="msg-file-icon">📎</span>
            <a href={`/api/media/file/${message.mediaId}`} target="_blank" rel="noreferrer">
              Download File
            </a>
          </div>
        )}

        {/* Timestamp + status */}
        <div className="msg-footer">
          <span className="msg-time">{formatTime(message.sentAt)}</span>
          {isMine && <MessageStatusIcon status={message.status} />}
        </div>

        {/* Delete button — only own messages */}
        {isMine && !isDeleted && (
          <button
            className="msg-delete-btn"
            onClick={() => onDelete(message.id)}
            title="Delete message"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
