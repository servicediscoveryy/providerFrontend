import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import DashboardLayout from "../pages/dashboard/DashboardLayout";
import OverViewPage from "../pages/dashboard/components/OverViewPage";
import ServicesById from "../pages/dashboard/components/ServicesById";
import Services from "../pages/dashboard/components/Services";
import Booking from "../pages/dashboard/Booking";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route path="/dashboard" element={<OverViewPage />} />
        <Route path="/dashboard/services" element={<Services />} />
        <Route path="/dashboard/services/:id" element={<ServicesById />} />
        <Route path="/dashboard/bookings" element={<Booking />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
};

export default AppRoutes;
