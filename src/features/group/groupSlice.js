import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as groupApi from './groupApi';

// ========================
// ASYNC THUNKS
// ========================

export const fetchChatList = createAsyncThunk(
  'group/fetchChatList',
  async (_, { rejectWithValue }) => {
    try {
      return await groupApi.getChatList();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch chat list');
    }
  }
);

export const fetchGroupDetails = createAsyncThunk(
  'group/fetchGroupDetails',
  async (groupId, { rejectWithValue }) => {
    try {
      return await groupApi.getGroup(groupId);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch group');
    }
  }
);

export const createNewGroup = createAsyncThunk(
  'group/createNewGroup',
  async (groupData, { rejectWithValue }) => {
    try {
      return await groupApi.createGroup(groupData);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create group');
    }
  }
);

export const updateGroupInfo = createAsyncThunk(
  'group/updateGroupInfo',
  async ({ groupId, groupData }, { rejectWithValue }) => {
    try {
      return await groupApi.updateGroup(groupId, groupData);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update group');
    }
  }
);

export const deleteGroupById = createAsyncThunk(
  'group/deleteGroupById',
  async (groupId, { rejectWithValue }) => {
    try {
      await groupApi.deleteGroup(groupId);
      return groupId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete group');
    }
  }
);

export const fetchGroupMembers = createAsyncThunk(
  'group/fetchGroupMembers',
  async (groupId, { rejectWithValue }) => {
    try {
      return await groupApi.getGroupMembers(groupId);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch members');
    }
  }
);

export const addGroupMember = createAsyncThunk(
  'group/addGroupMember',
  async ({ groupId, userId }, { rejectWithValue }) => {
    try {
      await groupApi.addMember(groupId, userId);
      return { groupId, userId };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add member');
    }
  }
);

export const removeGroupMember = createAsyncThunk(
  'group/removeGroupMember',
  async ({ groupId, userId }, { rejectWithValue }) => {
    try {
      await groupApi.removeMember(groupId, userId);
      return { groupId, userId };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to remove member');
    }
  }
);

export const searchUsersThunk = createAsyncThunk(
  'group/searchUsers',
  async (query, { rejectWithValue }) => {
    try {
      return await groupApi.searchUsers(query);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Search failed');
    }
  }
);

// ========================
// SLICE
// ========================

const groupSlice = createSlice({
  name: 'group',
  initialState: {
    chatList: [],
    chatListLoading: false,
    selectedGroup: null,
    selectedGroupLoading: false,
    members: [],
    membersLoading: false,
    searchResults: [],
    searchLoading: false,
    error: null,
    showCreateModal: false,
    showInfoPanel: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setShowCreateModal: (state, action) => {
      state.showCreateModal = action.payload;
    },
    setShowInfoPanel: (state, action) => {
      state.showInfoPanel = action.payload;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearSelectedGroup: (state) => {
      state.selectedGroup = null;
      state.members = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Chat list
      .addCase(fetchChatList.pending, (state) => { state.chatListLoading = true; })
      .addCase(fetchChatList.fulfilled, (state, action) => {
        state.chatListLoading = false;
        state.chatList = action.payload;
      })
      .addCase(fetchChatList.rejected, (state, action) => {
        state.chatListLoading = false;
        state.error = action.payload;
      })
      // Group details
      .addCase(fetchGroupDetails.pending, (state) => { state.selectedGroupLoading = true; })
      .addCase(fetchGroupDetails.fulfilled, (state, action) => {
        state.selectedGroupLoading = false;
        state.selectedGroup = action.payload;
      })
      .addCase(fetchGroupDetails.rejected, (state, action) => {
        state.selectedGroupLoading = false;
        state.error = action.payload;
      })
      // Create group
      .addCase(createNewGroup.fulfilled, (state, action) => {
        state.chatList.unshift({ ...action.payload, type: 'GROUP' });
        state.showCreateModal = false;
      })
      .addCase(createNewGroup.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Update group
      .addCase(updateGroupInfo.fulfilled, (state, action) => {
        state.selectedGroup = action.payload;
        const idx = state.chatList.findIndex((c) => c.id === action.payload.id);
        if (idx >= 0) {
          state.chatList[idx] = { ...state.chatList[idx], name: action.payload.name, avatarUrl: action.payload.avatar };
        }
      })
      // Delete group
      .addCase(deleteGroupById.fulfilled, (state, action) => {
        state.chatList = state.chatList.filter((c) => c.id !== action.payload);
        state.selectedGroup = null;
        state.members = [];
      })
      // Members
      .addCase(fetchGroupMembers.pending, (state) => { state.membersLoading = true; })
      .addCase(fetchGroupMembers.fulfilled, (state, action) => {
        state.membersLoading = false;
        state.members = action.payload;
      })
      .addCase(fetchGroupMembers.rejected, (state, action) => {
        state.membersLoading = false;
        state.error = action.payload;
      })
      // Add member
      .addCase(addGroupMember.fulfilled, (state) => {
        // Refetch members will be triggered by the component
      })
      // Remove member
      .addCase(removeGroupMember.fulfilled, (state, action) => {
        state.members = state.members.filter((m) => m.userId !== action.payload.userId);
      })
      // Search
      .addCase(searchUsersThunk.pending, (state) => { state.searchLoading = true; })
      .addCase(searchUsersThunk.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchUsersThunk.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  setShowCreateModal,
  setShowInfoPanel,
  clearSearchResults,
  clearSelectedGroup,
} = groupSlice.actions;

export default groupSlice.reducer;
