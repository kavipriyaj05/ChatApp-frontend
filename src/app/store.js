import { configureStore } from '@reduxjs/toolkit';
import mediaReducer from '../features/media/mediaSlice';
import notificationReducer from '../features/notification/notificationSlice';
import reactionReducer from '../features/reaction/reactionSlice';
import chatReducer from '../features/chat/chatSlice';
const store = configureStore({
  reducer: {
    // auth: authReducer,       // Karthik's slice
    // chat: chatReducer,       // Maha's slice
    // group: groupReducer,     // Jeyanth's slice
    chat: chatReducer,
    media: mediaReducer,        // Kavi's slice
    notification: notificationReducer, // Kavi's slice
    reaction: reactionReducer,  // Kavi's slice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck:{
      ignoredPaths: ['chat.messages'],
    }),
  devTools: process.env.NODE_ENV !== 'production',

export default store;
