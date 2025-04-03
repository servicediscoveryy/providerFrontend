import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Box,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    TablePagination,
    Chip,
    Grid,
    useMediaQuery,
    useTheme,
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    DialogActions,
} from "@mui/material";
import { BASEURL } from "../../constant";
import { selectBookings, selectError, selectLoading } from "../../redux/slices/features/booking/bookingSelectors";
import { useDispatch, useSelector } from "react-redux";
import { fetchBookings } from "../../redux/slices/features/booking/bookingThunks";
import { AppDispatch } from "../../redux/store";
import Shimmer from "../../components/shimmer/Loading";

const Booking = () => {

    const bookings = useSelector(selectBookings)
    const error = useSelector(selectError)
    const loading = useSelector(selectLoading)
    const dispatch = useDispatch<AppDispatch>();

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [otpDialogOpen, setOtpDialogOpen] = useState(false);
    const [currentBookingId, setCurrentBookingId] = useState(null);
    const [otp, setOtp] = useState("");


    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        if (bookings.length === 0) {
            dispatch(fetchBookings())
        }
    }, []);




    const handleOrderStatusChange = async (bookingId, newStatus) => {
        try {

            if (newStatus === "completed") {
                setCurrentBookingId(bookingId);
                setOtpDialogOpen(true);

            } else {

                const response = await axios.put(BASEURL + `/api/v1/booking/${bookingId}`, {

                    orderStatus: newStatus
                },
                    {
                        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
                    });

                if (response.data.success) {
                    dispatch(fetchBookings())
                    alert("Order status updated successfully");
                }
            }

        } catch (error) {
            console.error(error);
            alert("Error updating order status");
        }
    };




    const handleSendOtp = async (bookingId) => {
        try {
            await axios.post(`${BASEURL}/api/v1/booking/booking-otp`, { bookingId }, {
                headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
            });
            alert("OTP sent to user.");
        } catch (error) {
            console.error("Error sending OTP:", error);
            alert("Failed to send OTP.");
        }
        return;
    }


    const handleVerifyOtp = async () => {
        try {
            const response = await axios.post(`${BASEURL}/api/v1/booking/booking-otp/verify`, {
                bookingId: currentBookingId,
                otp,
            }, {
                headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
            });
            if (response.data.success) {
                dispatch(fetchBookings())
                alert("Booking completed successfully!");
                setOtpDialogOpen(false);
                setOtp("");
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            alert("Invalid OTP. Please try again.");
        }
    };




    // 🔎 Search & Filter Logic
    const filteredBookings = bookings
        .filter((booking) =>
            [booking?.serviceId?.title, booking?.userId?.email]
                .filter(Boolean)
                .some((value) => value.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .filter((booking) =>
            selectedStatus === "all" ? true : booking.paymentStatus === selectedStatus
        );

    // 📌 Pagination Handlers
    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    if (loading) return <Shimmer />


    return (
        <Box sx={{ width: "100%", margin: "auto", }}>


            {/* Search & Filter */}
            <Grid container spacing={2} mb={2}>
                <Grid item xs={12} sm={6} md={8}>
                    <TextField
                        label="Search by Service or Email"
                        variant="outlined"
                        fullWidth
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="captured">Captured</MenuItem>
                            <MenuItem value="failed">Failed</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            {error && <Typography color="error">{error}</Typography>}

            {/* Booking Table (For Desktop & Tablets) */}
            {!loading && !error && !isMobile && (
                <>
                    <div className="overflow-x-auto  text-white rounded-md">
                        <table className="min-w-full border border-gray-300 shadow-md rounded-md">
                            <thead className="bg-gray-700 text-white">
                                <tr>
                                    <th className="py-3 px-4 border-b text-left font-semibold whitespace-nowrap">#</th>
                                    <th className="py-3 px-4 border-b text-left font-semibold whitespace-nowrap">Service</th>
                                    <th className="py-3 px-4 border-b text-left font-semibold whitespace-nowrap">Amount</th>
                                    <th className="py-3 px-4 border-b text-left font-semibold whitespace-nowrap">User Email</th>
                                    <th className="py-3 px-4 border-b text-left font-semibold whitespace-nowrap">Address</th>
                                    <th className="py-3 px-4 border-b text-left font-semibold whitespace-nowrap">Order Status</th>
                                    <th className="py-3 px-4 border-b text-left font-semibold whitespace-nowrap">Payment Status</th>
                                    <th className="py-3 px-4 border-b text-left font-semibold whitespace-nowrap">Created At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBookings
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((booking, index) => (
                                        <tr
                                            key={booking._id}
                                            className="bg-white text-black"

                                        >
                                            <td className="py-2 px-4 border-b">{page * rowsPerPage + index + 1}</td>
                                            <td title={booking?.serviceId?.title} className="py-2 px-4 border-b">{booking.serviceId?.title || "N/A"}</td>
                                            <td className="py-2 px-4 border-b">₹{booking.amount}</td>
                                            <td title={booking?.userId?.email} className="py-2 px-4 border-b truncate max-w-[150px]">{booking.userId?.email || "N/A"}</td>
                                            <td className="py-2 px-4 border-b truncate max-w-[150px]">
                                                {booking.addressId
                                                    ? `${booking.addressId.street || ""}, ${booking.addressId.city || ""}`
                                                    : "N/A"}
                                            </td>
                                            <td className="py-2 px-4 border-b">
                                                <select
                                                    value={booking?.orderStatus || "pending"}
                                                    onChange={(e) => handleOrderStatusChange(booking._id, e.target.value)}
                                                    disabled={booking.orderStatus === "completed"}
                                                    className="bg-gray-900 text-white border border-gray-400 rounded px-2 py-1 text-sm"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="accepted">Accepted</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                            <td className="py-2 px-4 border-b">
                                                <span
                                                    className={`px-2 py-1 rounded text-xs ${booking.paymentStatus === "captured"
                                                        ? "bg-green-500"
                                                        : booking.paymentStatus === "failed"
                                                            ? "bg-red-500"
                                                            : "bg-yellow-500"
                                                        }`}
                                                >
                                                    {booking.paymentStatus}
                                                </span>
                                            </td>
                                            <td className="py-2 px-4 border-b whitespace-nowrap">
                                                {new Date(booking.createdAt)?.toLocaleDateString()}{" "}
                                                {new Date(booking.createdAt)?.toLocaleTimeString()}
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <Box display="flex" justifyContent="flex-end" mt={2}>
                        <TablePagination
                            component="div"
                            count={filteredBookings.length}
                            page={page}
                            onPageChange={handleChangePage}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            labelRowsPerPage="Rows per page"
                            sx={{ mr: 2 }}
                        />
                    </Box>
                </>
            )}

            {/* Card Layout (For Mobile) */}
            {isMobile && !loading && !error && (
                <Box>
                    {filteredBookings
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((booking, index) => (
                            <Box
                                key={booking._id}
                                sx={{
                                    backgroundColor: index % 2 === 0 ? "#fafafa" : "#ffffff",
                                    border: "1px solid #ddd",
                                    borderRadius: "8px",
                                    padding: "16px",
                                    marginBottom: "16px",
                                }}
                            >
                                <Typography variant="h6">{booking.serviceId?.title || "N/A"}</Typography>
                                <Typography variant="body2">Amount: ₹{booking.amount}</Typography>
                                <Typography variant="body2">User: {booking.userId?.email || "N/A"}</Typography>
                                <Typography variant="body2">
                                    Address:{" "}
                                    {booking.addressId
                                        ? `${booking.addressId.street || ""}, ${booking.addressId.city || ""}`
                                        : "N/A"}
                                </Typography>
                                <Typography variant="body2">Status: {booking.orderStatus}</Typography>
                                <Chip
                                    label={booking.paymentStatus}
                                    color={
                                        booking.paymentStatus === "captured"
                                            ? "success"
                                            : booking.paymentStatus === "failed"
                                                ? "error"
                                                : "warning"
                                    }
                                    variant="outlined"
                                    size="small"
                                    sx={{ marginTop: "8px" }}
                                />
                            </Box>
                        ))}
                </Box>
            )}




            <Dialog open={otpDialogOpen} onClose={() => setOtpDialogOpen(false)}>
                <DialogTitle>Verify OTP</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Enter OTP"
                        variant="outlined"
                        fullWidth
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                </DialogContent>
                <Button onClick={() => handleSendOtp(currentBookingId)}>SendOtp</Button>
                <DialogActions>
                    <Button onClick={() => setOtpDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleVerifyOtp} variant="contained" color="primary">Verify</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Booking;
