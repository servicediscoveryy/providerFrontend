import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BookingState } from "./bookingTypes";
import { fetchBookings } from "./bookingThunks";

const initialState: BookingState = {
  bookings: [],
  loading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    clearBookings: (state) => {
      state.bookings = [];
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
      });
  },
});

export const { clearBookings } = bookingSlice.actions;
export default bookingSlice.reducer;
