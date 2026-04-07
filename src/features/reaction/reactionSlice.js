import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/axiosInstance';

// ── Thunks ──────────────────────────────────────────────────────────

export const fetchReactions = createAsyncThunk(
  'reaction/fetchReactions',
  async (messageId, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/api/media/messages/${messageId}/reactions`);
      return { messageId, reactions: data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch reactions');
    }
  }
);

export const addReaction = createAsyncThunk(
  'reaction/addReaction',
  async ({ messageId, emoji }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(`/api/media/messages/${messageId}/reactions`, { emoji });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add reaction');
    }
  }
);

export const removeReaction = createAsyncThunk(
  'reaction/removeReaction',
  async (reactionId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/media/messages/0/reactions/${reactionId}`);
      return reactionId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to remove reaction');
    }
  }
);

// ── Slice ───────────────────────────────────────────────────────────

const reactionSlice = createSlice({
  name: 'reaction',
  initialState: {
    // Map of messageId → reactions[]
    reactionsByMessage: {},
    loading: false,
    error: null,
  },
  reducers: {
    addRealtimeReaction: (state, action) => {
      const { messageId } = action.payload;
      if (!state.reactionsByMessage[messageId]) {
        state.reactionsByMessage[messageId] = [];
      }
      state.reactionsByMessage[messageId].push(action.payload);
    },
    removeRealtimeReaction: (state, action) => {
      const { messageId, reactionId } = action.payload;
      if (state.reactionsByMessage[messageId]) {
        state.reactionsByMessage[messageId] = state.reactionsByMessage[
          messageId
        ].filter((r) => r.id !== reactionId);
      }
    },
    clearReactionError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchReactions
      .addCase(fetchReactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReactions.fulfilled, (state, action) => {
        state.loading = false;
        state.reactionsByMessage[action.payload.messageId] =
          action.payload.reactions;
      })
      .addCase(fetchReactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // addReaction
      .addCase(addReaction.fulfilled, (state, action) => {
        const reaction = action.payload;
        const msgId = reaction.messageId;
        if (!state.reactionsByMessage[msgId]) {
          state.reactionsByMessage[msgId] = [];
        }
        state.reactionsByMessage[msgId].push(reaction);
      })
      // removeReaction
      .addCase(removeReaction.fulfilled, (state, action) => {
        Object.keys(state.reactionsByMessage).forEach((msgId) => {
          state.reactionsByMessage[msgId] = state.reactionsByMessage[
            msgId
          ].filter((r) => r.id !== action.payload);
        });
      });
  },
});

export const {
  addRealtimeReaction,
  removeRealtimeReaction,
  clearReactionError,
} = reactionSlice.actions;
export default reactionSlice.reducer;
