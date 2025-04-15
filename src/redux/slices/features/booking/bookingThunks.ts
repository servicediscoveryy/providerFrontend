import { createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
import { Booking, User } from "./bookingTypes";
import axios from "axios";
import { BASEURL } from "../../../../constant";

export const fetchBookings = createAsyncThunk<
  Booking[],
  void,
  { rejectValue: String }
>("booking,/fetchBookings", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASEURL}/api/v1/booking/provider`, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
    });

    return response.data.data; // Return the array of bookings
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data.message || "Failed to fetch the Bookings"
    );
  }
});

export const fetchUsers = createAsyncThunk<
  User[],
  void,
  { rejectValue: String }
>("booking,/users", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASEURL}/api/v1/provider-services/users?page=1&limit=10`, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
    });
    
    return response.data.data; // Return the array of bookings
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data.message || "Failed to fetch the Bookings"
    );
  }
});
