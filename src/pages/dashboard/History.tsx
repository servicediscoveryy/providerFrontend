import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/store";
import {
  selectError,
  selectLoading,
  selectUsers,
} from "../../redux/slices/features/booking/bookingSelectors";
import { fetchUsers } from "../../redux/slices/features/booking/bookingThunks";
import {
  Avatar,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  CircularProgress,
} from "@mui/material";

const History = () => {
  const dispatch = useDispatch<AppDispatch>();
  const usersData = useSelector(selectUsers);
  const error = useSelector(selectError);
  const loading = useSelector(selectLoading);
  // @ts-expect-error
  const totalUsers = usersData?.totalUsers || 0; // Total users from API
  // @ts-expect-error
  const totalPages = usersData?.totalPages || 1; // Total pages from API
  // @ts-expect-error
  const userList = usersData?.users || []; // Actual list of users

  // Use currentPage from API, default to 0
  const [page, setPage] = useState(
    // @ts-expect-error
    usersData?.currentPage ? usersData?.currentPage - 1 : 0
  );
  const [rowsPerPage, setRowsPerPage] = useState(10); // Default limit

  // Fetch users when page or rowsPerPage changes
  useEffect(() => {
    // @ts-expect-error
    dispatch(fetchUsers({ page: page + 1, limit: rowsPerPage })); // API expects 1-based index
  }, [dispatch, page, rowsPerPage]);

  // Handle page change
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page when rows per page changes
  };

  return (
    <Grid
      container
      justifyContent="center"
      sx={{ padding: 2, overflowX: "auto" }}
    >
      <Grid item xs={12} md={10}>
        <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell>Avatar</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Service</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    {error}
                  </TableCell>
                </TableRow>
              ) : userList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No bookings found.
                  </TableCell>
                </TableRow>
              ) : (
                userList.map((user) => (
                  <TableRow key={user.user._id}>
                    <TableCell>
                      {user?.user?.profilePicture ? (
                        <Avatar
                          src={user?.user?.profilePicture}
                          alt="Avatar"
                          sx={{ width: 40, height: 40 }}
                        />
                      ) : (
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            bgcolor: "#1976d2",
                            color: "white",
                          }}
                        >
                          {user?.user?.firstName[0]}
                          {user?.user?.lastName[0]}
                        </Avatar>
                      )}
                    </TableCell>
                    <TableCell>
                      {user?.user?.firstName} {user?.user?.lastName}
                    </TableCell>
                    <TableCell>{user?.user?.email}</TableCell>
                    <TableCell>{user?.user?.phone || "N/A"}</TableCell>
                    <TableCell>{user?.service?.title}</TableCell>
                    <TableCell>₹{user?.service?.price}</TableCell>
                    <TableCell>{user?.service?.status}</TableCell>
                    <TableCell>
                      {new Date(user?.service?.date).toLocaleDateString(
                        "en-US",
                        { year: "numeric", month: "long", day: "numeric" }
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={totalUsers} // Dynamic total count
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Grid>
    </Grid>
  );
};

export default History;
