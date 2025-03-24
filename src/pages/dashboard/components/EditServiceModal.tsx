import { useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";

const EditServiceModal = ({ open, onClose, service, onUpdate }) => {
  const [title, setTitle] = useState(service.title);
  const [description, setDescription] = useState(service.description);
  const [price, setPrice] = useState(service.price);
  const [location, setLocation] = useState(service.location);
  const [category, setCategory] = useState(service.category?.category || "");
  const [status, setStatus] = useState(service.status);
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState(service.image || []);

  // Handle File Selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return; // Ensure files exist

    const files: File[] = Array.from(event.target.files); // Explicitly cast to File[]
    setImages(files);

    // Preview Selected Images
    const previewImages = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(previewImages);
  };


  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("location", location);
    formData.append("category", category);
    formData.append("status", status);

    // Append images if selected
    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      const response = await axios.patch(
        `http://localhost:3000/api/v1/provider-services/${service._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      onUpdate(response.data); // Update UI
      onClose(); // Close modal
    } catch (error) {
      console.error("Error updating service:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Service</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="dense"
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Description"
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Status"
            select
            SelectProps={{ native: true }}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </TextField>

          {/* Image Upload */}
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="mt-3"
          />

          {/* Image Preview */}
          <div className="flex gap-2 mt-2">
            {previewUrls.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="Preview"
                className="w-20 h-20 object-cover rounded"
              />
            ))}
          </div>

          <DialogActions>
            <Button onClick={onClose} color="error">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Update
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditServiceModal;
