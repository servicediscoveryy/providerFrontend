import { useEffect, useState, KeyboardEvent, ChangeEvent } from "react";
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
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import axios, { AxiosError } from "axios";
import { BASEURL } from "../../../constant";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";

interface Category {
  _id: string;
  category: string;
}

interface ServiceFormData {
  title: string;
  description: string;
  category: string;
  image: string[];
  price: string;
  tags: string[];
  location: string;
  coordinates: [number, number];
}

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

interface CreateServiceProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void; // Callback for successful creation
}

const CreateService = ({ open, onClose, onSuccess }: CreateServiceProps) => {
  const [formData, setFormData] = useState<ServiceFormData>({
    title: "",
    description: "",
    category: "",
    image: [],
    price: "",
    tags: [],
    location: "",
    coordinates: [0, 0],
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [uploading, setUploading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null); // Clear error when user makes changes
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files);
    setUploading(true);

    try {
      const uploadedImages = await Promise.all(
        files.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", "serviceImages");

          const res = await axios.post<{ secure_url: string }>(
            "https://api.cloudinary.com/v1_1/dbsrluq8e/image/upload",
            formData
          );
          return res.data.secure_url;
        })
      );

      setFormData((prev) => ({
        ...prev,
        image: [...prev.image, ...uploadedImages],
      }));
    } catch (error) {
      console.error("Image upload failed:", error);
      setError("Failed to upload images. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (imageUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      image: prev.image.filter((img) => img !== imageUrl),
    }));
  };

  const handleAddTag = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()],
        }));
        setTagInput("");
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation
    if (!formData.title || !formData.description || !formData.category) {
      setError("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    try {
      await axios.post(`${BASEURL}/api/v1/provider-services`, formData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
      onClose();
      if (onSuccess) onSuccess(); // Notify parent of success
      // Reset form after successful submission
      setFormData({
        title: "",
        description: "",
        category: "",
        image: [],
        price: "",
        tags: [],
        location: "",
        coordinates: [0, 0],
      });
    } catch (err) {
      const error = err as AxiosError;
      console.error(
        "Error creating service:",
        error.response?.data || error.message
      );
      setError(
        (error.response?.data as { message?: string })?.message ||
          "Failed to create service. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get<{ data: Category[] }>(
          `${BASEURL}/api/v1/category`
        );
        setCategories(res.data.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please try again later.");
      }
    };

    if (open) {
      fetchCategories();
    }
  }, [open]);

  const handleCategoryChange = (e: { target: { value: string } }) => {
    setFormData({ ...formData, category: e.target.value });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle className="text-lg font-semibold flex justify-between items-center">
        Create Service
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers className="space-y-4 p-4">
        {error && (
          <Typography color="error" variant="body2" className="mb-2">
            {error}
          </Typography>
        )}

        <TextField
          fullWidth
          label="Title *"
          name="title"
          value={formData.title}
          onChange={handleChange}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Description *"
          name="description"
          value={formData.description}
          onChange={handleChange}
          multiline
          rows={3}
          margin="normal"
        />

        <FormControl fullWidth margin="normal">
          <InputLabel id="category-label">Category *</InputLabel>
          <Select
            labelId="category-label"
            value={formData.category}
            onChange={handleCategoryChange}
            label="Category *"
          >
            {categories.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box display="flex" gap={2}>
          <TextField
            fullWidth
            type="number"
            label="Price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            margin="normal"
          />
        </Box>

        <Box display="flex" alignItems="center" gap={2} mt={1}>
          <Button
            variant="outlined"
            onClick={() => {
              if (!navigator.geolocation) {
                setError("Geolocation is not supported by your browser.");
                return;
              }

              navigator.geolocation.getCurrentPosition(
                (position) => {
                  const { latitude, longitude } = position.coords;
                  setFormData((prev) => ({
                    ...prev,
                    coordinates: [longitude, latitude], // backend expects [lng, lat]
                  }));
                },
                (err) => {
                  console.error(err);
                  setError("Failed to retrieve location.");
                }
              );
            }}
          >
            Use My Location
          </Button>
          <Typography variant="body2">
            Coordinates: {formData.coordinates.join(", ")}
          </Typography>
        </Box>

        <Box marginTop={2}>
          <TextField
            fullWidth
            label="Add tags (press Enter)"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            helperText="Press Enter to add each tag"
          />
          <Box display="flex" flexWrap="wrap" gap={1} marginTop={1}>
            {formData.tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                onDelete={() => handleRemoveTag(tag)}
              />
            ))}
          </Box>
        </Box>

        <Box marginTop={2}>
          <Button
            component="label"
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            disabled={uploading}
          >
            Upload Images
            <VisuallyHiddenInput
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
            />
          </Button>
          {uploading && (
            <Box display="flex" alignItems="center" gap={1} marginTop={1}>
              <CircularProgress size={20} />
              <Typography variant="body2">Uploading...</Typography>
            </Box>
          )}
          {formData.image.length > 0 && (
            <Box display="flex" flexWrap="wrap" gap={2} marginTop={2}>
              {formData.image.map((img, index) => (
                <Box key={index} position="relative">
                  <img
                    src={img}
                    alt={`Preview ${index}`}
                    style={{
                      width: 100,
                      height: 100,
                      objectFit: "cover",
                      borderRadius: 4,
                    }}
                  />
                  <IconButton
                    onClick={() => handleRemoveImage(img)}
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      backgroundColor: "error.main",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "error.dark",
                      },
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ padding: 2 }}>
        <Button onClick={onClose} color="secondary" disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={uploading || isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
        >
          {isSubmitting ? "Creating..." : "Create Service"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateService;
