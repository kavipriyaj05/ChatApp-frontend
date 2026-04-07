import React, { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectMessages,
  selectMessagesLoading,
  selectHasMoreMessages,
  selectMessagePage,
  selectWsConnected,
  selectActiveChat,
} from '../chatSlice';
import { fetchMessageHistory, deleteMessage } from '../chatApi';
import useWebSocket from '../useWebSocket';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';

/**
 * Main chat window — shows message history, handles WebSocket,
 * infinite scroll (load older messages), and message actions.
 * Owner: Mahalakshmi (Module 2)
 *
 * @param {number} currentUserId - Logged-in user's ID
 */
const ChatWindow = ({ currentUserId }) => {
  const dispatch = useDispatch();
  const activeChat = useSelector(selectActiveChat);
  const messages = useSelector(selectMessages);
  const messagesLoading = useSelector(selectMessagesLoading);
  const hasMore = useSelector(selectHasMoreMessages);
  const page = useSelector(selectMessagePage);
  const wsConnected = useSelector(selectWsConnected);

  const chatId = activeChat?.id;
  const bottomRef = useRef(null);
  const topRef = useRef(null);

  const { sendMessage, sendTyping, sendStatusUpdate } = useWebSocket(chatId, currentUserId);

  // ── Load initial messages when chat changes ─────────────────────────────
  useEffect(() => {
    if (!chatId) return;
    dispatch(fetchMessageHistory(chatId, 0, 30));
  }, [chatId]);

  // ── Auto-scroll to bottom on new messages ───────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  // ── Mark messages as SEEN when chat is opened ───────────────────────────
  useEffect(() => {
    if (!chatId || !currentUserId) return;
    // Trigger bulk-seen via WebSocket for all unread messages
    messages
      .filter((m) => m.senderId !== currentUserId && m.status !== 'SEEN')
      .forEach((m) => sendStatusUpdate(m.id, 'SEEN'));
  }, [chatId, messages.length]);

  // ── Infinite scroll — load older messages ───────────────────────────────
  const handleScroll = useCallback(
    (e) => {
      if (e.target.scrollTop === 0 && hasMore && !messagesLoading) {
        dispatch(fetchMessageHistory(chatId, page, 30));
      }
    },
    [chatId, hasMore, messagesLoading, page]
  );

  // ── Send handler ─────────────────────────────────────────────────────────
  const handleSend = useCallback(
    ({ content, messageType }) => {
      sendMessage({ content, messageType });
    },
    [sendMessage]
  );

  // ── Typing handler ───────────────────────────────────────────────────────
  const handleTyping = useCallback(
    (isTyping) => {
      const username = localStorage.getItem('username') || '';
      sendTyping(isTyping, username);
    },
    [sendTyping]
  );

  // ── Delete handler ───────────────────────────────────────────────────────
  const handleDelete = useCallback(
    (messageId) => {
      dispatch(deleteMessage(messageId));
    },
    [dispatch]
  );

  // ── Determine other participant name ─────────────────────────────────────
  const getOtherParticipantName = () => {
    if (!activeChat) return 'Chat';
    return activeChat.participantOneId === currentUserId
      ? activeChat.participantTwoUsername
      : activeChat.participantOneUsername;
  };

  const getOtherParticipantPic = () => {
    if (!activeChat) return null;
    return activeChat.participantOneId === currentUserId
      ? activeChat.participantTwoProfilePicture
      : activeChat.participantOneProfilePicture;
  };

  if (!activeChat) {
    return (
      <div className="chat-empty-state">
        <div className="chat-empty-icon">💬</div>
        <h3>Select a conversation</h3>
        <p>Choose a chat from the sidebar to start messaging.</p>
      </div>
    );
  }

  return (
    <div className="chat-window">
      {/* ── Header ── */}
      <div className="chat-window-header">
        <div className="chat-header-avatar">
          {getOtherParticipantPic() ? (
            <img src={getOtherParticipantPic()} alt="avatar" />
          ) : (
            <span className="avatar-initials">
              {getOtherParticipantName().charAt(0).toUpperCase()}
            </span>
          )}
          <span className={`online-dot ${activeChat.otherUserOnline ? 'online' : 'offline'}`} />
        </div>
        <div className="chat-header-info">
          <h3 className="chat-header-name">{getOtherParticipantName()}</h3>
          <span className="chat-header-status">
            {wsConnected
              ? activeChat.otherUserOnline
                ? 'Online'
                : 'Last seen recently'
              : 'Connecting…'}
          </span>
        </div>
        {!wsConnected && <span className="ws-badge ws-badge--offline">● Reconnecting</span>}
      </div>

      {/* ── Messages ── */}
      <div className="chat-messages-container" onScroll={handleScroll}>
        {messagesLoading && (
          <div className="messages-loading">
            <div className="spinner" /> Loading messages…
          </div>
        )}

        <div ref={topRef} />

        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            currentUserId={currentUserId}
            onDelete={handleDelete}
          />
        ))}

        {/* Typing indicator */}
        <TypingIndicator chatId={chatId} />

        <div ref={bottomRef} />
      </div>

      {/* ── Input bar ── */}
      <MessageInput
        onSend={handleSend}
        onTyping={handleTyping}
        disabled={!wsConnected}
      />
    </div>
  );
};

export default ChatWindow;
