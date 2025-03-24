import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  ShoppingCart,
  ChevronDown,
  Search,
  MapPin,
} from "lucide-react";
import Logo from "../../assets/logo/Logo.png";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const NavBar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location, setLocation] = useState("Fetching location...");
  const [searchResult, setSearchResult] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  // Prevent infinite re-renders
  useEffect(() => {
    if (searchResult.length === 0) {
      setSearchResult((prev) => [...prev, "1"]);
    }
  }, [searchResult]);

  // Fetch User Location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(
            `Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)}`
          );
        },
        () => setLocation("Location access denied")
      );
    }
  }, []);

  return (
    <nav className="bg-white text-black py-1 px-3">
      <div className="max-w-[95rem] mx-auto">
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <a href="/" className="flex items-center">
            <img src={Logo} alt="SkillLink Logo" className="h-8 w-auto" />
            <span className="text-xl font-bold ml-2">SkillLink</span>
          </a>

          {/* Search Bar & Location */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-4 items-center relative">
            <div className="flex w-full bg-white rounded-md border focus-within:ring-2 focus-within:ring-blue-400">
              <input
                type="text"
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for products, brands and more"
                className="w-full px-4 py-2 text-sm text-gray-700 outline-none rounded-l-md"
              />
              <button className="px-6 text-[#2874f0] hover:bg-gray-100">
                <Search className="w-5 h-5" />
              </button>
            </div>
            {searchResult.length > 0 && query !== "" && (
              <div className="absolute bg-white w-full shadow-xl top-10 rounded-lg px-3">
                <div className="flex items-center px-4 py-2 border-b">
                  <Search className="w-4 h-4 mr-2" /> tushar shitole
                </div>
                <div className="px-4 py-2 border-b">hello how are</div>
                <div className="px-4 py-2">sangam mundhe</div>
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              className="button  px-2 py-1 font-bold text-sm hover:underline"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <a
              href="/seller"
              className="text-sm font-medium hover:text-blue-600"
            >
              Register As Provider
            </a>
            {/* <div className="relative group">
              <button className="flex items-center text-sm font-medium hover:text-blue-600">
                More <ChevronDown className="w-4 h-4 ml-1" />
              </button>
            </div> */}
            <a
              href="/cart"
              className="flex items-center text-sm font-medium hover:text-blue-600"
            >
              <ShoppingCart className="w-5 h-5 mr-2" /> Cart
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 focus:outline-none"
            aria-label="Toggle Menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden py-2 relative">
          <div className="flex w-full bg-white rounded-md border focus-within:ring-2 focus-within:ring-blue-400">
            <input
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Search for products, brands and more"
              className="w-full px-4 py-2 text-sm text-gray-700 outline-none rounded-l-md"
            />
            <button className="px-6 text-[#2874f0] hover:bg-gray-100">
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Search Results */}
          {searchResult.length > 0 && query !== "" && (
            <div className="absolute bg-white w-full shadow-xl mt-2">
              <div className="flex items-center px-4 py-2 border-b">
                <Search className="w-4 h-4 mr-2" /> tushar shitole
              </div>
              <div className="px-4 py-2 border-b">hello how are</div>
              <div className="px-4 py-2">sangam mundhe</div>
            </div>
          )}

          {/* Location */}
          <div className="text-sm text-gray-600 flex items-center mt-2">
            <MapPin className="w-5 h-5 mr-1 text-[#2874f0]" /> {location}
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden bg-white text-gray-800 absolute left-0 right-0 shadow-lg z-50"
            >
              <div className="flex flex-col divide-y divide-gray-200">
                <a
                  href="/login"
                  className="px-4 py-3 text-[#2874f0] font-medium hover:bg-gray-100"
                >
                  Login
                </a>
                <a href="/seller" className="px-4 py-3 hover:bg-gray-100">
                  Become a Seller
                </a>
                <a href="/more" className="px-4 py-3 hover:bg-gray-100">
                  More
                </a>
                <a
                  href="/cart"
                  className="px-4 py-3 flex items-center hover:bg-gray-100"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" /> Cart
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default NavBar;
