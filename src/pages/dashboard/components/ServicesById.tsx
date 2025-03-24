import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Define types for service data
interface Service {
  _id: string;
  title: string;
  description: string;
  category: { _id: string; category: string };
  location: string;
  price: number;
  status: string;
  image: string[];
  view: number;
  createdAt: string;
  updatedAt: string;
}

const API_URL = "http://localhost:3000/api/v1/provider-services"; // Your API URL

const ServicesById: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get ID from URL
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch service details by ID
  useEffect(() => {
    const fetchServiceById = async () => {
      try {
        const response = await axios.get<{ data: Service }>(`${API_URL}/${id}`);
        setService(response.data.data);
      } catch (err) {
        setError("Failed to fetch service details.");
      } finally {
        setLoading(false);
      }
    };

    fetchServiceById();
  }, [id]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === (service?.image.length || 1) - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? (service?.image.length || 1) - 1 : prevIndex - 1
    );
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500 mt-10">{error}</div>;

  return (
    <div className="container mx-auto ">
      <h2 className="text-3xl font-semibold mb-4">{service?.title}</h2>

      <div className="grid md:grid-cols-2 gap-6 bg-white p-6 rounded-lg shadow-lg">
        {/* Image Slider Section */}
        <div className="relative w-full max-w-2xl mx-auto">
          {service?.image?.length ? (
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentIndex}
                  src={
                    service.image[currentIndex] ||
                    "https://via.placeholder.com/600"
                  }
                  alt={`Service Image ${currentIndex + 1}`}
                  className="w-full h-64 object-cover rounded-lg shadow-lg"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                />
              </AnimatePresence>

              {/* Previous Button */}
              <button
                className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700"
                onClick={prevSlide}
              >
                <ChevronLeft size={24} />
              </button>

              {/* Next Button */}
              <button
                className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700"
                onClick={nextSlide}
              >
                <ChevronRight size={24} />
              </button>
            </div>
          ) : (
            <p className="text-gray-500 text-center">No images available</p>
          )}
        </div>

        {/* Details Section */}
        <div className="space-y-3 px-3">
          <p>
            <strong>Category:</strong> {service?.category?.category || "N/A"}
          </p>
          <p>
            <strong>Description:</strong> {service?.description}
          </p>
          <p>
            <strong>Location:</strong> {service?.location}
          </p>
          <p>
            <strong>Price:</strong> ₹{service?.price}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`px-2 py-1 rounded ${
                service?.status === "active"
                  ? "bg-green-200 text-green-800"
                  : "bg-red-200 text-red-800"
              }`}
            >
              {service?.status}
            </span>
          </p>
          <p>
            <strong>Views:</strong> {service?.view}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(service?.createdAt).toLocaleDateString()}
          </p>
          <p>
            <strong>Updated At:</strong>{" "}
            {new Date(service?.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServicesById;
