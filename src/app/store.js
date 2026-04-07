import { configureStore } from '@reduxjs/toolkit';
import groupReducer from '../features/group/groupSlice';

const store = configureStore({
  reducer: {
    group: groupReducer,
  },
});

export default store;
