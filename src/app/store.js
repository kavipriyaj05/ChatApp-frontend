import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import chatReducer from '../features/chat/chatSlice';
import groupReducer from '../features/group/groupSlice';
import mediaReducer from '../features/media/mediaSlice';
import notificationReducer from '../features/notification/notificationSlice';
import reactionReducer from '../features/reaction/reactionSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,              // Karthik's slice
    chat: chatReducer,              // Maha's slice
    group: groupReducer,            // Jeyanth's slice
    media: mediaReducer,            // Kavi's slice
    notification: notificationReducer, // Kavi's slice
    reaction: reactionReducer,      // Kavi's slice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ['chat.messages'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
