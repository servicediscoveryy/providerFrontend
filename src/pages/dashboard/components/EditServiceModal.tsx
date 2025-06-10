// import { useState } from "react";
// import axios from "axios";
// import {
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Button,
//   TextField,
// } from "@mui/material";

// const EditServiceModal = ({ open, onClose, service, onUpdate }) => {
//   const [title, setTitle] = useState(service.title);
//   const [description, setDescription] = useState(service.description);
//   const [price, setPrice] = useState(service.price);
//   const [location, setLocation] = useState(service.location);
//   const [category, setCategory] = useState(service.category?.category || "");
//   const [status, setStatus] = useState(service.status);
//   const [images, setImages] = useState([]);
//   const [previewUrls, setPreviewUrls] = useState(service.image || []);

//   // Handle File Selection
//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (!event.target.files) return; // Ensure files exist

//     const files: File[] = Array.from(event.target.files); // Explicitly cast to File[]
//     setImages(files);

//     // Preview Selected Images
//     const previewImages = files.map((file) => URL.createObjectURL(file));
//     setPreviewUrls(previewImages);
//   };


//   // Handle Form Submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("description", description);
//     formData.append("price", price);
//     formData.append("location", location);
//     formData.append("category", category);
//     formData.append("status", status);

//     // Append images if selected
//     images.forEach((image) => {
//       formData.append("images", image);
//     });

//     try {
//       const response = await axios.patch(
//         `http://localhost:3000/api/v1/provider-services/${service._id}`,
//         formData,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );

//       onUpdate(response.data); // Update UI
//       onClose(); // Close modal
//     } catch (error) {
//       console.error("Error updating service:", error);
//     }
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
//       <DialogTitle>Edit Service</DialogTitle>
//       <DialogContent>
//         <form onSubmit={handleSubmit}>
//           <TextField
//             fullWidth
//             margin="dense"
//             label="Title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//           />
//           <TextField
//             fullWidth
//             margin="dense"
//             label="Description"
//             multiline
//             rows={3}
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//           />
//           <TextField
//             fullWidth
//             margin="dense"
//             label="Price"
//             type="number"
//             value={price}
//             onChange={(e) => setPrice(e.target.value)}
//           />
//           <TextField
//             fullWidth
//             margin="dense"
//             label="Location"
//             value={location}
//             onChange={(e) => setLocation(e.target.value)}
//           />
//           <TextField
//             fullWidth
//             margin="dense"
//             label="Category"
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//           />
//           <TextField
//             fullWidth
//             margin="dense"
//             label="Status"
//             select
//             SelectProps={{ native: true }}
//             value={status}
//             onChange={(e) => setStatus(e.target.value)}
//           >
//             <option value="active">Active</option>
//             <option value="inactive">Inactive</option>
//           </TextField>

//           {/* Image Upload */}
//           <input
//             type="file"
//             multiple
//             onChange={handleFileChange}
//             className="mt-3"
//           />

//           {/* Image Preview */}
//           <div className="flex gap-2 mt-2">
//             {previewUrls.map((img, index) => (
//               <img
//                 key={index}
//                 src={img}
//                 alt="Preview"
//                 className="w-20 h-20 object-cover rounded"
//               />
//             ))}
//           </div>

//           <DialogActions>
//             <Button onClick={onClose} color="error">
//               Cancel
//             </Button>
//             <Button type="submit" color="primary">
//               Update
//             </Button>
//           </DialogActions>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default EditServiceModal;
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
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { BASEURL } from "../../../constant";

interface Category {
  _id: string;
  category: string;
}

interface EditServiceProps {
  open: boolean;
  onClose: () => void;
  service: any;
  onUpdate?: (updated: any) => void;
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

const EditServiceModal = ({ open, onClose, service, onUpdate }: EditServiceProps) => {
  const [formData, setFormData] = useState({
    title: service.title || "",
    description: service.description || "",
    category: service.category || "",
    image: service.image || [],
    price: service.price || "",
    tags: service.tags || [],
    location: service.location || "",
    coordinates: service.geoLocation?.coordinates || [0, 0],
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [uploading, setUploading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get<{ data: Category[] }>(`${BASEURL}/api/v1/category`);
        setCategories(res.data.data);
      } catch (err) {
        setError("Failed to load categories.");
      }
    };

    if (open) fetchCategories();
  }, [open]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleCategoryChange = (e: { target: { value: string } }) => {
    setFormData((prev) => ({ ...prev, category: e.target.value }));
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files);
    setUploading(true);

    try {
      const uploadedImages = await Promise.all(
        files.map(async (file) => {
          const data = new FormData();
          data.append("file", file);
          data.append("upload_preset", "serviceImages");

          const res = await axios.post("https://api.cloudinary.com/v1_1/dbsrluq8e/image/upload", data);
          return res.data.secure_url;
        })
      );

      setFormData((prev) => ({
        ...prev,
        image: [...prev.image, ...uploadedImages],
      }));
    } catch (err) {
      setError("Failed to upload images.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (imgUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      image: prev.image.filter((img) => img !== imgUrl),
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

  const handleUpdate = async () => {
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        coordinates: JSON.stringify(formData.coordinates),
      };

      const res = await axios.patch(
        `${BASEURL}/api/v1/provider-services/${service._id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      if (onUpdate) onUpdate(res.data.data);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update service.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle className="text-lg font-semibold flex justify-between items-center">
        Edit Service
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers className="space-y-4 p-4">
        {error && <Typography color="error">{error}</Typography>}

        <TextField fullWidth label="Title" name="title" value={formData.title} onChange={handleChange} />
        <TextField
          fullWidth
          label="Description"
          name="description"
          multiline
          rows={3}
          value={formData.description}
          onChange={handleChange}
        />

        <FormControl fullWidth>
          <InputLabel id="cat-label">Category</InputLabel>
          <Select labelId="cat-label" value={formData.category} onChange={handleCategoryChange}>
            {categories.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box display="flex" gap={2}>
          <TextField fullWidth label="Price" name="price" type="number" value={formData.price} onChange={handleChange} />
          <TextField fullWidth label="Location" name="location" value={formData.location} onChange={handleChange} />
        </Box>

        <Box display="flex" alignItems="center" gap={2}>
          <Button
            onClick={() => {
              navigator.geolocation.getCurrentPosition(
                ({ coords }) =>
                  setFormData((prev) => ({
                    ...prev,
                    coordinates: [coords.longitude, coords.latitude],
                  })),
                () => setError("Failed to fetch location")
              );
            }}
          >
            Use My Location
          </Button>
          <Typography variant="body2">
            Coordinates: {formData.coordinates.join(", ")}
          </Typography>
        </Box>

        <TextField
          fullWidth
          label="Add tags"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleAddTag}
        />
        <Box display="flex" gap={1} flexWrap="wrap">
          {formData.tags.map((tag) => (
            <Chip key={tag} label={tag} onDelete={() => handleRemoveTag(tag)} />
          ))}
        </Box>

        <Box marginTop={2}>
          <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />} disabled={uploading}>
            Upload Images
            <VisuallyHiddenInput type="file" multiple accept="image/*" onChange={handleImageUpload} />
          </Button>

          {uploading && (
            <Box display="flex" alignItems="center" gap={1} mt={1}>
              <CircularProgress size={20} />
              <Typography>Uploading...</Typography>
            </Box>
          )}

          <Box display="flex" gap={2} flexWrap="wrap" mt={2}>
            {formData.image.map((img, index) => (
              <Box key={index} position="relative">
                <img src={img} alt="preview" width={100} height={100} style={{ objectFit: "cover", borderRadius: 4 }} />
                <IconButton
                  size="small"
                  onClick={() => handleRemoveImage(img)}
                  sx={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    backgroundColor: "error.main",
                    color: "white",
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary" disabled={isSubmitting}>
          Cancel
        </Button>
        <Button onClick={handleUpdate} variant="contained" disabled={isSubmitting || uploading}>
          {isSubmitting ? <CircularProgress size={20} /> : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditServiceModal;
