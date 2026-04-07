import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    // Other slices will be added by team members:
    // chat: chatReducer,    (Maha)
    // group: groupReducer,  (Jeyanth)
    // media: mediaReducer,  (Kavi)
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
