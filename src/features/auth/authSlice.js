import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authApi from './authApi';

// ─── Async Thunks ────────────────────────────────────────────

export const registerUser = createAsyncThunk(
  'auth/register',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authApi.register(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Registration failed' });
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authApi.login(data);
      if (response.data.token) {
        localStorage.setItem('accessToken', response.data.token);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('user', JSON.stringify({
          username: response.data.username,
          email: response.data.email,
        }));
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Login failed' });
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authApi.verifyOtp(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'OTP verification failed' });
    }
  }
);

export const resendOtp = createAsyncThunk(
  'auth/resendOtp',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authApi.resendOtp(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Failed to resend OTP' });
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const response = await authApi.forgotPassword(email);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Failed to send reset email' });
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authApi.resetPassword(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Password reset failed' });
    }
  }
);

// ─── Slice ───────────────────────────────────────────────────

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('accessToken') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  isVerified: null,
  loading: false,
  error: null,
  message: null,
  otpSent: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isVerified = null;
      state.error = null;
      state.message = null;
      state.otpSent = false;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
    setOAuth2Tokens: (state, action) => {
      const { token, refreshToken, username, email } = action.payload;
      state.token = token;
      state.refreshToken = refreshToken;
      state.user = { username, email };
      state.isAuthenticated = true;
      state.isVerified = true;
      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify({ username, email }));
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.otpSent = true;
        state.isVerified = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Registration failed';
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        if (action.payload.token) {
          state.token = action.payload.token;
          state.refreshToken = action.payload.refreshToken;
          state.user = {
            username: action.payload.username,
            email: action.payload.email,
          };
          state.isAuthenticated = true;
          state.isVerified = true;
        } else {
          state.isVerified = false;
          state.otpSent = true;
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Login failed';
      })

      // Verify OTP
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.isVerified = true;
        state.otpSent = false;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'OTP verification failed';
      })

      // Resend OTP
      .addCase(resendOtp.pending, (state) => {
        state.loading = true;
      })
      .addCase(resendOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to resend OTP';
      })

      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.otpSent = true;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to send reset email';
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.otpSent = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Password reset failed';
      });
  },
});

export const { logout, clearError, clearMessage, setOAuth2Tokens } = authSlice.actions;
export default authSlice.reducer;
