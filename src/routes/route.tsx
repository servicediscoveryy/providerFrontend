import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import DashboardLayout from "../pages/dashboard/DashboardLayout";
import OverViewPage from "../pages/dashboard/components/OverViewPage";
import ServicesById from "../pages/dashboard/components/ServicesById";
import Services from "../pages/dashboard/components/Services";
import Booking from "../pages/dashboard/Booking";
import RoleBasedProtectedRoute from "./protectedRoute";
import Profile from "../pages/Profile";
import History from "../pages/dashboard/History";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Protect entire Dashboard */}
      <Route
        path="/"
        element={
          <RoleBasedProtectedRoute allowedRoles={["provider"]}>
            <DashboardLayout />
          </RoleBasedProtectedRoute>
        }
      > 
        <Route path="/" element={<OverViewPage />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:id" element={<ServicesById />} />
        <Route path="/bookings" element={<Booking />} />
        <Route path="/history" element={<History />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
};

export default AppRoutes;
