// store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './userSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,

  },
});

export default store;
