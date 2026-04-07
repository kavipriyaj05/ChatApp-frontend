import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/axiosInstance';

// ── Thunks ──────────────────────────────────────────────────────────

export const uploadMedia = createAsyncThunk(
  'media/uploadMedia',
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await axiosInstance.post('/api/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Upload failed');
    }
  }
);

export const uploadMultipleMedia = createAsyncThunk(
  'media/uploadMultipleMedia',
  async (files, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      files.forEach((f) => formData.append('files', f));
      const { data } = await axiosInstance.post('/api/media/upload/multiple', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Upload failed');
    }
  }
);

export const fetchMediaById = createAsyncThunk(
  'media/fetchMediaById',
  async (mediaId, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/api/media/${mediaId}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Fetch failed');
    }
  }
);

export const deleteMedia = createAsyncThunk(
  'media/deleteMedia',
  async (mediaId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/media/${mediaId}`);
      return mediaId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Delete failed');
    }
  }
);

// ── Slice ───────────────────────────────────────────────────────────

const mediaSlice = createSlice({
  name: 'media',
  initialState: {
    uploadedFiles: [],
    currentFile: null,
    uploading: false,
    uploadProgress: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearMediaError: (state) => {
      state.error = null;
    },
    clearUploadedFiles: (state) => {
      state.uploadedFiles = [];
    },
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // uploadMedia
      .addCase(uploadMedia.pending, (state) => {
        state.uploading = true;
        state.error = null;
        state.uploadProgress = 0;
      })
      .addCase(uploadMedia.fulfilled, (state, action) => {
        state.uploading = false;
        state.uploadedFiles.push(action.payload);
        state.uploadProgress = 100;
      })
      .addCase(uploadMedia.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload;
      })
      // uploadMultipleMedia
      .addCase(uploadMultipleMedia.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(uploadMultipleMedia.fulfilled, (state, action) => {
        state.uploading = false;
        state.uploadedFiles.push(...action.payload);
      })
      .addCase(uploadMultipleMedia.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload;
      })
      // fetchMediaById
      .addCase(fetchMediaById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMediaById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentFile = action.payload;
      })
      .addCase(fetchMediaById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // deleteMedia
      .addCase(deleteMedia.fulfilled, (state, action) => {
        state.uploadedFiles = state.uploadedFiles.filter(
          (f) => f.id !== action.payload
        );
      });
  },
});

export const { clearMediaError, clearUploadedFiles, setUploadProgress } =
  mediaSlice.actions;
export default mediaSlice.reducer;
