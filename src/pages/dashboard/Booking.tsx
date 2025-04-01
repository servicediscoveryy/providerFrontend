// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//     Box,
//     Typography,
//     TextField,
//     FormControl,
//     InputLabel,
//     Select,
//     MenuItem,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Paper,
//     CircularProgress,
//     TablePagination,
//     Chip,
// } from "@mui/material";
// import { BASEURL } from "../../constant";

// const Booking = () => {
//     const [bookings, setBookings] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");
//     const [searchQuery, setSearchQuery] = useState("");
//     const [selectedStatus, setSelectedStatus] = useState("all");
//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(10);

//     useEffect(() => {
//         const fetchBookings = async () => {
//             try {
//                 const response = await axios.get(`${BASEURL}/api/v1/booking/provider`, {
//                     headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
//                 });
//                 setBookings(response.data.data);
//             } catch (err) {
//                 console.error("Error fetching bookings:", err);
//                 setError("Failed to fetch bookings. Please try again.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchBookings();
//     }, []);

//     const handleOrderStatusChange = async (bookingId, newStatus) => {
//         try {
//             const response = await axios.put(BASEURL + `/api/bookings/${bookingId}/status`, {
//                 headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },

//                 body: JSON.stringify({ orderStatus: newStatus }),
//             });


//             alert("Order status updated successfully");
//             // Optionally refresh the data or update state
//         } catch (error) {
//             console.error(error);
//             alert("Error updating order status");
//         }
//     };



//     // 🔎 Search & Filter Logic
//     const filteredBookings = bookings
//         .filter((booking) =>
//             [booking?.serviceId?.title, booking?.userId?.email]
//                 .filter(Boolean)
//                 .some((value) => value.toLowerCase().includes(searchQuery.toLowerCase()))
//         )
//         .filter((booking) =>
//             selectedStatus === "all" ? true : booking.paymentStatus === selectedStatus
//         );

//     // 📌 Pagination Handlers
//     const handleChangePage = (event, newPage) => setPage(newPage);
//     const handleChangeRowsPerPage = (event) => {
//         setRowsPerPage(parseInt(event.target.value, 10));
//         setPage(0);
//     };

//     return (
//         <Box sx={{ width: "90%", margin: "auto", mt: 4 }}>
//             <Typography variant="h5" gutterBottom fontWeight={600}>
//                 Provider Bookings
//             </Typography>

//             {/* Search & Filter */}
//             <Box display="flex" gap={2} mb={2}>
//                 <TextField
//                     label="Search by Service or Email"
//                     variant="outlined"
//                     fullWidth
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                 />

//                 <FormControl sx={{ minWidth: 200 }}>
//                     <InputLabel>Status</InputLabel>
//                     <Select
//                         value={selectedStatus}
//                         onChange={(e) => setSelectedStatus(e.target.value)}
//                     >
//                         <MenuItem value="all">All</MenuItem>
//                         <MenuItem value="pending">Pending</MenuItem>
//                         <MenuItem value="captured">Captured</MenuItem>
//                         <MenuItem value="failed">Failed</MenuItem>
//                     </Select>
//                 </FormControl>
//             </Box>

//             {/* Loading & Error Handling */}
//             {loading && (
//                 <Box display="flex" justifyContent="center" my={3}>
//                     <CircularProgress />
//                 </Box>
//             )}
//             {error && <Typography color="error">{error}</Typography>}

//             {/* Booking Table */}
//             {!loading && !error && (
//                 <>
//                     <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3, overflowX: "auto" }}>
//                         <Table>
//                             <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
//                                 <TableRow>
//                                     <TableCell><b>#</b></TableCell>
//                                     <TableCell><b>Service</b></TableCell>
//                                     <TableCell><b>Amount</b></TableCell>
//                                     <TableCell><b>User Email</b></TableCell>
//                                     <TableCell><b>Address</b></TableCell>
//                                     <TableCell><b>Order Status</b></TableCell>
//                                     <TableCell><b>Payment Status</b></TableCell>
//                                     <TableCell><b>Created At</b></TableCell>
//                                 </TableRow>
//                             </TableHead>
//                             <TableBody>
//                                 {filteredBookings
//                                     .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                                     .map((booking, index) => (
//                                         <TableRow
//                                             key={booking._id}
//                                             sx={{ backgroundColor: index % 2 === 0 ? "#fafafa" : "#ffffff" }}
//                                         >
//                                             <TableCell>{page * rowsPerPage + index + 1}</TableCell>
//                                             <TableCell>{booking.serviceId?.title || "N/A"}</TableCell>
//                                             <TableCell>₹{booking.amount}</TableCell>
//                                             <TableCell>{booking.userId?.email || "N/A"}</TableCell>
//                                             <TableCell>
//                                                 {booking.addressId
//                                                     ? `${booking.addressId.street || ""}, ${booking.addressId.city || ""}`
//                                                     : "N/A"}
//                                             </TableCell>
//                                             <TableCell>
//                                                 <Select
//                                                     value={booking?.orderStatus || "pending"}
//                                                     onChange={(e) => handleOrderStatusChange(booking._id, e.target.value)}
//                                                 >
//                                                     <MenuItem value="pending">Pending</MenuItem>
//                                                     <MenuItem value="accepted">Accepted</MenuItem>
//                                                     <MenuItem value="completed">Completed</MenuItem>
//                                                     <MenuItem value="cancelled">Cancelled</MenuItem>
//                                                 </Select>
//                                             </TableCell>

//                                             <TableCell>
//                                                 <Chip
//                                                     label={booking.paymentStatus}
//                                                     color={
//                                                         booking.paymentStatus === "captured"
//                                                             ? "success"
//                                                             : booking.paymentStatus === "failed"
//                                                                 ? "error"
//                                                                 : "warning"
//                                                     }
//                                                     variant="outlined"
//                                                 />
//                                             </TableCell>
//                                             <TableCell>
//                                                 {new Date(booking.createdAt)?.toLocaleDateString()}{" "}
//                                                 {new Date(booking.createdAt)?.toLocaleTimeString()}
//                                             </TableCell>
//                                         </TableRow>
//                                     ))}
//                             </TableBody>
//                         </Table>
//                     </TableContainer>

//                     {/* Pagination */}
//                     <Box display="flex" justifyContent="flex-end" mt={2}>
//                         <TablePagination
//                             component="div"
//                             count={filteredBookings.length}
//                             page={page}
//                             onPageChange={handleChangePage}
//                             rowsPerPage={rowsPerPage}
//                             onRowsPerPageChange={handleChangeRowsPerPage}
//                             labelRowsPerPage="Rows per page"
//                             sx={{ mr: 2 }}
//                         />
//                     </Box>
//                 </>
//             )}
//         </Box>
//     );
// };

// export default Booking;
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
} from "@mui/material";
import { BASEURL } from "../../constant";

const Booking = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get(`${BASEURL}/api/v1/booking/provider`, {
                    headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
                });
                setBookings(response.data.data);
            } catch (err) {
                console.error("Error fetching bookings:", err);
                setError("Failed to fetch bookings. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const handleOrderStatusChange = async (bookingId, newStatus) => {
        try {
            const response = await axios.put(BASEURL + `/api/v1/booking/${bookingId}`, {

                orderStatus: newStatus
            },
                {
                    headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
                });

            alert("Order status updated successfully");
        } catch (error) {
            console.error(error);
            alert("Error updating order status");
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

    return (
        <Box sx={{ width: "100%", maxWidth: "1200px", margin: "auto", mt: 4 }}>
            <Typography variant="h5" gutterBottom fontWeight={600}>
                Provider Bookings
            </Typography>

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

            {/* Loading & Error Handling */}
            {loading && (
                <Box display="flex" justifyContent="center" my={3}>
                    <CircularProgress />
                </Box>
            )}
            {error && <Typography color="error">{error}</Typography>}

            {/* Booking Table (For Desktop & Tablets) */}
            {!loading && !error && !isMobile && (
                <>
                    <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3, overflowX: "auto" }}>
                        <Table>
                            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                                <TableRow>
                                    <TableCell><b>#</b></TableCell>
                                    <TableCell><b>Service</b></TableCell>
                                    <TableCell><b>Amount</b></TableCell>
                                    <TableCell><b>User Email</b></TableCell>
                                    <TableCell><b>Address</b></TableCell>
                                    <TableCell><b>Order Status</b></TableCell>
                                    <TableCell><b>Payment Status</b></TableCell>
                                    <TableCell><b>Created At</b></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredBookings
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((booking, index) => (
                                        <TableRow
                                            key={booking._id}
                                            sx={{ backgroundColor: index % 2 === 0 ? "#fafafa" : "#ffffff" }}
                                        >
                                            <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                            <TableCell>{booking.serviceId?.title || "N/A"}</TableCell>
                                            <TableCell>₹{booking.amount}</TableCell>
                                            <TableCell>{booking.userId?.email || "N/A"}</TableCell>
                                            <TableCell>
                                                {booking.addressId
                                                    ? `${booking.addressId.street || ""}, ${booking.addressId.city || ""}`
                                                    : "N/A"}
                                            </TableCell>
                                            <TableCell>
                                                <Select
                                                    value={booking?.orderStatus || "pending"}
                                                    onChange={(e) => handleOrderStatusChange(booking._id, e.target.value)}
                                                >
                                                    <MenuItem value="pending">Pending</MenuItem>
                                                    <MenuItem value="accepted">Accepted</MenuItem>
                                                    <MenuItem value="completed">Completed</MenuItem>
                                                    <MenuItem value="cancelled">Cancelled</MenuItem>
                                                </Select>
                                            </TableCell>

                                            <TableCell>
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
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {new Date(booking.createdAt)?.toLocaleDateString()}{" "}
                                                {new Date(booking.createdAt)?.toLocaleTimeString()}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

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
        </Box>
    );
};

export default Booking;
