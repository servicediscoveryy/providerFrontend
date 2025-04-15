import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  user: {
    userId: string;
    email: string;
    role: string;
    picture: string;
  } | null;
}

const initialState: UserState = {
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        userId: string;
        email: string;
        role: string;
        picture: string;
      }>
    ) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
