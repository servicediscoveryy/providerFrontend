import { RootState } from "../../../store";

export const selectBookings = (state: RootState) => state.booking.bookings;
export const selectLoading = (state: RootState) => state.booking.loading;
export const selectError = (state: RootState) => state.booking.error;
