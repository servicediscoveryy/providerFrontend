import { useEffect, useState } from "react";
import axios from "axios";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
  Typography,
  useMediaQuery,
  CircularProgress,
  TableFooter,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import EditServiceModal from "./EditServiceModal"; // Import Edit Modal Component
import CreateService from "./CreateService";

const API_URL = "http://localhost:3000/api/v1/provider-services";

const Services = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [editService, setEditService] = useState(null); // State for Edit Modal
  const [openCreateService, setOpenCreateService] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  // Fetch Services
  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL, {
        params: { page: page + 1, limit: rowsPerPage },
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },

      });
      setServices(response.data.data);
      setTotalCount(response.data.pagination.totalItems);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, [page, rowsPerPage]);

  // Handle Page Change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle Rows Per Page Change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Open Delete Confirmation Dialog
  const handleOpenDialog = (id) => {
    setSelectedServiceId(id);
    setOpenDialog(true);
  };

  // Close Delete Dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedServiceId(null);
  };

  // Open Edit Modal
  const handleEditClick = (service) => {
    setEditService(service);
  };

  // Close Edit Modal
  const handleCloseEditModal = () => {
    setEditService(null);
  };

  // Update Service in UI after Editing
  const handleServiceUpdate = (updatedService) => {
    setServices((prev) =>
      prev.map((service) =>
        service._id === updatedService._id ? updatedService : service
      )
    );
  };

  // Delete Service
  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/${selectedServiceId}`);
      fetchServices();
    } catch (error) {
      console.error("Error deleting service:", error);
    }
    handleCloseDialog();
  };

  const handleCreateServiceOpen = () => {
    setOpenCreateService(true);
  };
  const handleCreateServiceCLose = () => {
    setOpenCreateService(false);
  };

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <div className="flex justify-between">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Manage Services
        </h2>

        <h2
          onClick={() => handleCreateServiceOpen()}
          className="text-xl cursor-pointer bg-blue-400 px-2 py-1 hover:bg-blue-600 text-white rounded-md font-semibold mb-4 text-center"
        >
          Create Service
        </h2>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <CircularProgress />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Title
                    </Typography>
                  </TableCell>
                  {!isSmallScreen && (
                    <TableCell>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Category
                      </Typography>
                    </TableCell>
                  )}
                  <TableCell>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Price
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="subtitle1" fontWeight="bold">
                      Actions
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {services.map((service) => (
                  <TableRow key={service._id} hover>
                    <TableCell
                      className="cursor-pointer"
                      onClick={() =>
                        navigate("/services/" + service._id)
                      }
                      sx={{ textTransform: "capitalize" }}
                    >
                      {service?.title}
                    </TableCell>
                    {!isSmallScreen && (
                      <TableCell sx={{ textTransform: "capitalize" }}>
                        {service?.category.category}
                      </TableCell>
                    )}
                    <TableCell sx={{ textTransform: "capitalize" }}>
                      ${service?.price}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEditClick(service)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{ color: "red" }}
                        onClick={() => handleOpenDialog(service._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>

              {/* Pagination Footer */}
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    count={totalCount}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this service? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Modal */}
      {editService && (
        <EditServiceModal
          open={Boolean(editService)}
          onClose={handleCloseEditModal}
          service={editService}
          onUpdate={handleServiceUpdate}
        />
      )}

      <CreateService
        open={openCreateService}
        onClose={handleCreateServiceCLose}
      />
    </div>
  );
};

export default Services;
