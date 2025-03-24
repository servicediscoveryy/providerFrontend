import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ReactNode } from "react";

interface RoleBasedProtectedRouteProps {
  children: ReactNode; // This indicates any valid React child
  allowedRoles?: string[]; // Optional array of strings for allowed roles
}

const RoleBasedProtectedRoute = ({
  children,
  allowedRoles = [],
}: RoleBasedProtectedRouteProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // @ts-ignore
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    const userRole = storedUser?.role;

    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
      navigate("/", { replace: true });
      return;
    }
  }, [location.pathname, navigate, allowedRoles]);

  return <>{children}</>;
};

export default RoleBasedProtectedRoute;
