import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
      state.isLoggedIn = true;
    },
    logoutUser: (state) => {
      state.currentUser = null;
      state.isLoggedIn = false;
    },
  },
});

export const { setCurrentUser, logoutUser } = userSlice.actions;

// Selector for logged-in status
export const selectCurrentUser = (state) => state.user.currentUser;
export const selectLoggedIn = (state) => state.user.isLoggedIn;

export default userSlice.reducer;
