import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
    currentUser: null
};

// Create slice
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // Reducer to set the current user
        setCurrentUser: (state, action) => {
            state.currentUser = action.payload;  // No need for spread operator with immer (default with Redux Toolkit)
        }
    }
});

// Export actions
export const { setCurrentUser } = userSlice.actions;

// Export the selector for accessing currentUser from the store
export const selectCurrentUser = (state) => state.user.currentUser;

// Export the reducer
export default userSlice.reducer;
