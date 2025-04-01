import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { BASEURL } from "../../../constant";

const CreateService = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    image: [],
    price: "",
    tags: [],
    location: "",
  });
  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [tagInput, setTagInput] = useState("");

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Image Upload to Cloudinary
const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return; // Ensure files exist

    const files: File[] = Array.from(e.target.files); // Convert FileList to File[]
    if (files.length === 0) return;

    setUploading(true);

    try {
      const uploadedImages = await Promise.all(
        files.map(async (file): Promise<string> => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", "serviceImages"); // Replace with your Cloudinary preset

          const res = await axios.post<{ secure_url: string }>(
            "https://api.cloudinary.com/v1_1/dbsrluq8e/image/upload",
            formData
          );

          return res.data.secure_url;
        })
      );

      setFormData((prev) => ({
        ...prev,
        image: [...prev.image, ...uploadedImages], // Append new images
      }));
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setUploading(false);
    }
};


  // Remove Image from Preview
const handleRemoveImage = (imageUrl) => {
    setFormData((prev) => ({
      ...prev,
      image: prev.image.filter((img) => img !== imageUrl),
    }));
};

  // Handle Adding Tags
const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
};

  // Remove Tag
  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const API_URL = BASEURL + "/api/v1/provider-services";

  // Submit Form Data to Backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(API_URL, formData, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },

      });
      console.log(response.data);
      onClose(); // Close modal after successful submission
    } catch (error) {
      console.error(
        "Error creating service:",
        error.response?.data || error.message
      );
    }
  };

  // Fetch Categories from Backend
  useEffect(() => {
    if (open) {
      axios
        .get(BASEURL + "/api/v1/category")
        .then((res) => setCategories(res.data.data)) // Assuming response is an array of categories
        .catch((err) => console.error("Error fetching categories:", err));
    }
  }, [open]);

  const handleCategoryChange = (e) => {
    setFormData({ ...formData, category: e.target.value }); // Store category ID
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle className="text-lg font-semibold">
        Create Service
      </DialogTitle>
      <DialogContent className="space-y-4 p-6">
        <TextField
          fullWidth
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          multiline
          rows={3}
        />
        <FormControl fullWidth>
          <InputLabel id="category-label">Select Category</InputLabel>
          <Select
            labelId="category-label"
            value={formData.category || ""}
            onChange={handleCategoryChange}
            required
          >
            {categories.length > 0 ? (
              categories.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>
                  {cat.category}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No categories available</MenuItem>
            )}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          type="number"
          label="Price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
        />

        {/* Tags Input */}
        <div className="space-y-2">
          <TextField
            fullWidth
            label="Add tags (press Enter)"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
          />
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                onDelete={() => handleRemoveTag(tag)}
                className="cursor-pointer"
              />
            ))}
          </div>
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="mt-2"
          />
          {uploading && (
            <div className="flex items-center gap-2 text-blue-500">
              <CircularProgress size={20} /> Uploading...
            </div>
          )}
          {/* Preview Selected Images */}
          {formData.image.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.image.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={img}
                    alt={`Preview ${index}`}
                    className="w-24 h-24 object-cover rounded-md border"
                  />
                  <button
                    onClick={() => handleRemoveImage(img)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>

      <DialogActions className="p-6">
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={uploading}>
          Create Service
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateService;
