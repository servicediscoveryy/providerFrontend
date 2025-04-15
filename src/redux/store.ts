import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/features/user/userSlices";
import bookingReducer from "./slices/features/booking/bookingSlices";

export const store = configureStore({
  reducer: {
    user: userReducer,
    booking: bookingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
