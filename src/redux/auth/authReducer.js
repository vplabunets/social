import { createSlice } from '@reduxjs/toolkit';

const state = {
  userId: null,
  name: null,
  email: null,
  stateChange: false,
  userPhoto: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState: state,
  reducers: {
    updateUserProfile: (state, { payload }) => {
      return {
        ...state,
        userId: payload.userId,
        name: payload.name,
        email: payload.email,
        userPhoto: payload.userPhoto,
      };
    },
    authStateChange: (state, { payload }) => {
      return {
        ...state,
        stateChange: payload.stateChange,
      };
    },
    authSignOut: () => state,
  },
});
