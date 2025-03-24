import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from "@mui/material";
import { BASEURL } from "../../constant";

const Booking = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2RiMTMwNzMzMGE3NjVhZjlkOTNlNGEiLCJlbWFpbCI6InByb3ZpZGVyQGdtYWlsLmNvbSIsInJvbGUiOiJwcm92aWRlciIsImlhdCI6MTc0MjgxNzYzNCwiZXhwIjoxNzQyOTA0MDM0fQ.DLsrDGAqQvvDsW9a7-JCVS-SysOpqeKjQVqfto8ZwHs"
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get(BASEURL + "/api/v1/booking/provider", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setBookings(response.data.data);
            } catch (error) {
                console.error("Error fetching bookings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Provider Bookings</h2>
            {loading ? (
                <div className="flex justify-center items-center h-32">
                    <CircularProgress />
                </div>
            ) : (
                <TableContainer component={Paper} className="shadow-md rounded-lg">
                    <Table>
                        <TableHead className="bg-gray-100">
                            <TableRow>
                                <TableCell className="font-semibold">Service</TableCell>
                                <TableCell className="font-semibold">Amount</TableCell>
                                <TableCell className="font-semibold">User Email</TableCell>
                                <TableCell className="font-semibold">Address</TableCell>
                                <TableCell className="font-semibold">Order Status</TableCell>
                                <TableCell className="font-semibold">Payment Status</TableCell>
                                <TableCell className="font-semibold">Created At</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {bookings.map((booking) => (
                                <TableRow key={booking._id} className="hover:bg-gray-50">
                                    <TableCell>{booking.serviceId?.title || "N/A"}</TableCell>
                                    <TableCell>${booking.amount}</TableCell>
                                    <TableCell>{booking.userId?.email || "N/A"}</TableCell>
                                    <TableCell>
                                        {booking.addressId?.street}, {booking.addressId?.city}
                                    </TableCell>
                                    <TableCell className="capitalize font-medium">
                                        <span className={`px-2 py-1 rounded-md text-white ${booking.orderStatus === "pending" ? "bg-yellow-500" :
                                            booking.orderStatus === "completed" ? "bg-green-500" : "bg-red-500"
                                            }`}>
                                            {booking.orderStatus}
                                        </span>
                                    </TableCell>
                                    <TableCell className="capitalize font-medium">
                                        <span className={`px-2 py-1 rounded-md text-white ${booking.paymentStatus === "pending" ? "bg-yellow-500" :
                                            booking.paymentStatus === "captured" ? "bg-green-500" : "bg-red-500"
                                            }`}>
                                            {booking.paymentStatus}
                                        </span>
                                    </TableCell>
                                    <TableCell>{new Date(booking.createdAt).toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </div>
    );
};

export default Booking;