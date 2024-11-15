import { configureStore } from '@reduxjs/toolkit';
import userReducer from './components/userSlice'; // Adjust the path if needed

const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export default store;
