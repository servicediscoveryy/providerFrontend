import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import DashboardLayout from "../pages/dashboard/DashboardLayout";
import OverViewPage from "../pages/dashboard/components/OverViewPage";
import Services from "../pages/dashboard/components/services";
import ServicesById from "../pages/dashboard/components/ServicesById";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route path="/dashboard" element={<OverViewPage />} />
        <Route path="/dashboard/services" element={<Services />} />
        <Route path="/dashboard/services/:id" element={<ServicesById />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
};

export default AppRoutes;
