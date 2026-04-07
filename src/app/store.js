import { configureStore } from '@reduxjs/toolkit';
import chatReducer from '../features/chat/chatSlice';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    // auth: authReducer,    // Karthik's slice — added by Karthik (Module 1)
    // group: groupReducer,  // Jeyanth's slice — added by Jeyanth (Module 3)
    // media: mediaReducer,  // Kavi's slice   — added by Kavi (Module 4)
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable date values in Redux state
        ignoredPaths: ['chat.messages'],
      },
    }),
});

export default store;
