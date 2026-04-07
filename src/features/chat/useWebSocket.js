import { useEffect, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  connectWebSocket,
  disconnectWebSocket,
  subscribeToTopic,
  unsubscribeFromTopic,
  publishMessage,
  isConnected,
} from '../../services/websocketClient';
import {
  receiveMessage,
  setTypingIndicator,
  updateMessageStatus,
  setWsConnected,
} from './chatSlice';

/**
 * Custom hook to manage WebSocket connection and subscriptions for a chat.
 *
 * @param {number|null} chatId    - Active chat ID to subscribe to
 * @param {number|null} currentUserId - Current authenticated user's ID
 *
 * Usage:
 *   const { sendMessage, sendTyping, updateStatus } = useWebSocket(chatId, userId);
 */
const useWebSocket = (chatId, currentUserId) => {
  const dispatch = useDispatch();
  const typingTimerRef = useRef(null);
  const token = localStorage.getItem('accessToken');

  // ── Connect on mount, disconnect on unmount ─────────────────────────────
  useEffect(() => {
    if (!token) return;

    connectWebSocket(
      token,
      () => {
        dispatch(setWsConnected(true));
        console.log('[useWebSocket] WS connected');
      },
      (err) => {
        dispatch(setWsConnected(false));
        console.error('[useWebSocket] WS error:', err);
      }
    );

    return () => {
      disconnectWebSocket();
      dispatch(setWsConnected(false));
    };
  }, [token]);

  // ── Subscribe/unsubscribe per active chat ───────────────────────────────
  useEffect(() => {
    if (!chatId || !isConnected()) return;

    // Subscribe to new messages for this chat
    subscribeToTopic(`/topic/chat.${chatId}`, (payload) => {
      if (payload.status && payload.messageId) {
        // It's a status update broadcast
        dispatch(updateMessageStatus({ messageId: payload.id, status: payload.status }));
      } else {
        // It's a new message
        dispatch(receiveMessage(payload));
      }
    });

    // Subscribe to typing indicators
    subscribeToTopic(`/topic/typing.${chatId}`, (payload) => {
      dispatch(setTypingIndicator(payload));
      // Auto-clear typing indicator after 3 seconds
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      if (payload.typing) {
        typingTimerRef.current = setTimeout(() => {
          dispatch(setTypingIndicator({ ...payload, typing: false }));
        }, 3000);
      }
    });

    return () => {
      unsubscribeFromTopic(`/topic/chat.${chatId}`);
      unsubscribeFromTopic(`/topic/typing.${chatId}`);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    };
  }, [chatId]);

  // ── Actions ──────────────────────────────────────────────────────────────

  /** Send a message via WebSocket → /app/chat.send */
  const sendMessage = useCallback(
    ({ content, messageType = 'TEXT', mediaId = null }) => {
      if (!chatId || !currentUserId) return;
      publishMessage('/app/chat.send', {
        chatId,
        senderId: currentUserId,
        content,
        messageType,
        mediaId,
      });
    },
    [chatId, currentUserId]
  );

  /** Send typing event via WebSocket → /app/chat.typing */
  const sendTyping = useCallback(
    (isTyping, senderUsername = '') => {
      if (!chatId || !currentUserId) return;
      publishMessage('/app/chat.typing', {
        chatId,
        senderId: currentUserId,
        senderUsername,
        typing: isTyping,
      });
    },
    [chatId, currentUserId]
  );

  /** Update message status via WebSocket → /app/message.status */
  const sendStatusUpdate = useCallback(
    (messageId, status) => {
      if (!chatId || !currentUserId) return;
      publishMessage('/app/message.status', {
        messageId,
        chatId,
        userId: currentUserId,
        status,
      });
    },
    [chatId, currentUserId]
  );

  return { sendMessage, sendTyping, sendStatusUpdate };
};

export default useWebSocket;
