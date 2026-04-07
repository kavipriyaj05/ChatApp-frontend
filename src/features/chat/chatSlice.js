import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Active chat
  activeChatId: null,
  activeChat: null,

  // Chat list (sidebar)
  chats: [],
  chatsLoading: false,
  chatsError: null,

  // Messages for the active chat
  messages: [],
  messagesLoading: false,
  messagesError: null,
  hasMoreMessages: true,
  messagePage: 0,

  // WebSocket state
  wsConnected: false,

  // Typing indicator  { chatId: { userId, username, isTyping } }
  typingIndicators: {},

  // Sending state
  sendingMessage: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // ── Active chat ──────────────────────────────────────────────────────────
    setActiveChat(state, action) {
      state.activeChatId = action.payload?.id ?? null;
      state.activeChat = action.payload;
      state.messages = [];
      state.messagePage = 0;
      state.hasMoreMessages = true;
    },
    clearActiveChat(state) {
      state.activeChatId = null;
      state.activeChat = null;
      state.messages = [];
      state.typingIndicators = {};
    },

    // ── Chat list ────────────────────────────────────────────────────────────
    setChatsLoading(state, action) {
      state.chatsLoading = action.payload;
    },
    setChats(state, action) {
      state.chats = action.payload;
      state.chatsLoading = false;
      state.chatsError = null;
    },
    setChatsError(state, action) {
      state.chatsError = action.payload;
      state.chatsLoading = false;
    },
    addOrUpdateChat(state, action) {
      const idx = state.chats.findIndex((c) => c.id === action.payload.id);
      if (idx >= 0) {
        state.chats[idx] = action.payload;
      } else {
        state.chats.unshift(action.payload);
      }
    },

    // ── Messages ─────────────────────────────────────────────────────────────
    setMessagesLoading(state, action) {
      state.messagesLoading = action.payload;
    },
    setMessages(state, action) {
      // Prepend older messages (pagination)
      state.messages = [...action.payload, ...state.messages];
      state.messagesLoading = false;
      state.messagesError = null;
      state.hasMoreMessages = action.payload.length > 0;
      state.messagePage += 1;
    },
    setMessagesError(state, action) {
      state.messagesError = action.payload;
      state.messagesLoading = false;
    },

    // Incoming message from WebSocket
    receiveMessage(state, action) {
      const msg = action.payload;
      const exists = state.messages.some((m) => m.id === msg.id);
      if (!exists) {
        state.messages.push(msg);
      }
      // Update last message in chat list
      const chatIdx = state.chats.findIndex((c) => c.id === msg.chatId);
      if (chatIdx >= 0) {
        state.chats[chatIdx] = {
          ...state.chats[chatIdx],
          lastMessage: msg.content || `[${msg.messageType}]`,
          lastMessageAt: msg.sentAt,
        };
        // Move updated chat to top
        const updated = state.chats.splice(chatIdx, 1)[0];
        state.chats.unshift(updated);
      }
    },

    // Update message status (DELIVERED / SEEN)
    updateMessageStatus(state, action) {
      const { messageId, status } = action.payload;
      const idx = state.messages.findIndex((m) => m.id === messageId);
      if (idx >= 0) {
        state.messages[idx] = { ...state.messages[idx], status };
      }
    },

    // Soft delete
    markMessageDeleted(state, action) {
      const idx = state.messages.findIndex((m) => m.id === action.payload);
      if (idx >= 0) {
        state.messages[idx] = { ...state.messages[idx], isDeleted: true, content: null };
      }
    },

    setSendingMessage(state, action) {
      state.sendingMessage = action.payload;
    },

    // ── WebSocket ────────────────────────────────────────────────────────────
    setWsConnected(state, action) {
      state.wsConnected = action.payload;
    },

    // ── Typing indicator ─────────────────────────────────────────────────────
    setTypingIndicator(state, action) {
      const { chatId, senderId, senderUsername, typing } = action.payload;
      if (typing) {
        state.typingIndicators[chatId] = { senderId, senderUsername };
      } else {
        delete state.typingIndicators[chatId];
      }
    },
    clearTypingIndicator(state, action) {
      delete state.typingIndicators[action.payload]; // payload = chatId
    },
  },
});

export const {
  setActiveChat,
  clearActiveChat,
  setChatsLoading,
  setChats,
  setChatsError,
  addOrUpdateChat,
  setMessagesLoading,
  setMessages,
  setMessagesError,
  receiveMessage,
  updateMessageStatus,
  markMessageDeleted,
  setSendingMessage,
  setWsConnected,
  setTypingIndicator,
  clearTypingIndicator,
} = chatSlice.actions;

// ── Selectors ─────────────────────────────────────────────────────────────────
export const selectChats = (state) => state.chat.chats;
export const selectChatsLoading = (state) => state.chat.chatsLoading;
export const selectActiveChat = (state) => state.chat.activeChat;
export const selectActiveChatId = (state) => state.chat.activeChatId;
export const selectMessages = (state) => state.chat.messages;
export const selectMessagesLoading = (state) => state.chat.messagesLoading;
export const selectHasMoreMessages = (state) => state.chat.hasMoreMessages;
export const selectMessagePage = (state) => state.chat.messagePage;
export const selectWsConnected = (state) => state.chat.wsConnected;
export const selectTypingIndicator = (chatId) => (state) =>
  state.chat.typingIndicators[chatId] ?? null;
export const selectSendingMessage = (state) => state.chat.sendingMessage;

export default chatSlice.reducer;
