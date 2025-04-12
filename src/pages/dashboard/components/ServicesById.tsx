import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { BASEURL } from "../../../constant";

// Define types for service data
interface Rating {
  _id: string;
  userId: {
    _id: string;
    email: string;
    profilePicture: string;
  };
  rating: number;
  description: string;
  createdAt: string;
}

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
  ratings: Rating[];
  ratingAvg: Array<{ _id: string; avgRating: number; totalRating: number }>;
}

const API_URL = BASEURL + "/api/v1/services";

const ServicesById: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchServiceById = async () => {
      try {
        const response = await axios.get<{ data: Service }>(
          `${API_URL}/${id}`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );
        console.log(response.data.data);
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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold mb-6">{service?.title}</h2>

        <div className="grid md:grid-cols-2 gap-8 bg-white p-6 rounded-lg shadow-lg mb-8">
          {/* Image Slider Section */}
          <div className="relative w-full">
            {service?.image?.length ? (
              <div className="relative">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentIndex}
                    src={service.image[currentIndex]}
                    alt={`Service Image ${currentIndex + 1}`}
                    className="w-full h-[400px] object-cover rounded-lg shadow-lg"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                  />
                </AnimatePresence>

                <button
                  className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-gray-800/70 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition"
                  onClick={prevSlide}
                >
                  <ChevronLeft size={24} />
                </button>

                <button
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-gray-800/70 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition"
                  onClick={nextSlide}
                >
                  <ChevronRight size={24} />
                </button>

                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                  {service.image.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentIndex ? "bg-white" : "bg-white/50"
                      }`}
                      onClick={() => setCurrentIndex(index)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center">No images available</p>
            )}
          </div>

          {/* Details Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    size={20}
                    className={`${
                      index < (service?.ratingAvg?.[0]?.avgRating || 0)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-medium">
                {service?.ratingAvg?.[0]?.avgRating?.toFixed(1) || "No ratings"}{" "}
                ({service?.ratingAvg?.[0]?.totalRating || 0} reviews)
              </span>
            </div>

            <div className="grid gap-3">
              <div>
                <span className="font-semibold">Category:</span>
                <span className="ml-2">
                  {service?.category?.category || "N/A"}
                </span>
              </div>

              <div>
                <span className="font-semibold">Description:</span>
                <p className="mt-1 text-gray-600">{service?.description}</p>
              </div>

              <div>
                <span className="font-semibold">Location:</span>
                <span className="ml-2">{service?.location}</span>
              </div>

              <div>
                <span className="font-semibold">Price:</span>
                <span className="ml-2 text-xl font-bold text-green-600">
                  ₹{service?.price}
                </span>
              </div>

              <div>
                <span className="font-semibold">Status:</span>
                <span
                  className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${
                    service?.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {service?.status}
                </span>
              </div>

              <div>
                <span className="font-semibold">Views:</span>
                <span className="ml-2">{service?.view}</span>
              </div>

              <div>
                <span className="font-semibold">Listed on:</span>
                <span className="ml-2">
                  {new Date(service?.createdAt || "").toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-6">Reviews</h3>
          <div className="space-y-6">
            {service?.ratings?.length ? (
              service.ratings.map((rating) => (
                <div
                  key={rating._id}
                  className="border-b border-gray-200 last:border-0 pb-6"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={rating.userId.profilePicture}
                      alt={rating.userId.email}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {rating.userId.email}
                        </span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, index) => (
                            <Star
                              key={index}
                              size={16}
                              className={`${
                                index < rating.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 mt-2">{rating.description}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(rating.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No reviews yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesById;
