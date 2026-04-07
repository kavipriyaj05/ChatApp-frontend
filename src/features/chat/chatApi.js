import axiosInstance from '../../services/axiosInstance';
import {
  setChatsLoading,
  setChats,
  setChatsError,
  setMessagesLoading,
  setMessages,
  setMessagesError,
  addOrUpdateChat,
  markMessageDeleted,
  updateMessageStatus,
} from './chatSlice';

// ── Fetch All Chats for Sidebar ───────────────────────────────────────────────
export const fetchAllChats = () => async (dispatch) => {
  dispatch(setChatsLoading(true));
  try {
    const res = await axiosInstance.get('/api/chats/user');
    dispatch(setChats(res.data));
    return res.data;
  } catch (err) {
    dispatch(setChatsError(err.response?.data?.message || 'Failed to load chats'));
    throw err;
  }
};

// ── Create or Get a 1-to-1 Chat ───────────────────────────────────────────────
export const createOrGetChat = (targetUserId) => async (dispatch) => {
  try {
    const res = await axiosInstance.post('/api/chats', { targetUserId });
    dispatch(addOrUpdateChat(res.data));
    return res.data;
  } catch (err) {
    console.error('[chatApi] createOrGetChat error:', err);
    throw err;
  }
};

// ── Fetch Chat Details ────────────────────────────────────────────────────────
export const fetchChatById = (chatId) => async (dispatch) => {
  try {
    const res = await axiosInstance.get(`/api/chats/${chatId}`);
    dispatch(addOrUpdateChat(res.data));
    return res.data;
  } catch (err) {
    console.error('[chatApi] fetchChatById error:', err);
    throw err;
  }
};

// ── Fetch Message History (paginated) ─────────────────────────────────────────
export const fetchMessageHistory = (chatId, page = 0, size = 30) => async (dispatch) => {
  dispatch(setMessagesLoading(true));
  try {
    const res = await axiosInstance.get(`/api/chats/${chatId}/messages`, {
      params: { page, size },
    });
    dispatch(setMessages(res.data));
    return res.data;
  } catch (err) {
    dispatch(setMessagesError(err.response?.data?.message || 'Failed to load messages'));
    throw err;
  }
};

// ── Update Message Status (REST fallback) ─────────────────────────────────────
export const updateMessageStatusRest = (messageId, status) => async (dispatch) => {
  try {
    const res = await axiosInstance.put(`/api/chats/messages/${messageId}/status`, null, {
      params: { status },
    });
    dispatch(updateMessageStatus({ messageId, status: res.data.status }));
    return res.data;
  } catch (err) {
    console.error('[chatApi] updateMessageStatus error:', err);
    throw err;
  }
};

// ── Soft Delete a Message ─────────────────────────────────────────────────────
export const deleteMessage = (messageId) => async (dispatch) => {
  try {
    await axiosInstance.delete(`/api/chats/messages/${messageId}`);
    dispatch(markMessageDeleted(messageId));
  } catch (err) {
    console.error('[chatApi] deleteMessage error:', err);
    throw err;
  }
};
