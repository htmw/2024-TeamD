import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
    currentUser: null,
};

// Create slice
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // Reducer to set the current user
        setCurrentUser: (state, action) => {
            return {
                ...state,
                currentUser: action.payload,
            };
        },
    },
});

export const { setCurrentUser } = userSlice.actions;

export const selectCurrentUser = (state) => {
    return (state.user.currentUser);
}

export default userSlice.reducer;