import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import { LoaderCircle } from "lucide-react";
import { sessionUser } from "../utils/helper";

interface RoleBasedProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const RoleBasedProtectedRoute = ({
  children,
  allowedRoles = [],
}: RoleBasedProtectedRouteProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); // Add loading state

  useEffect(() => {
    const storedUser = sessionUser();
    if (!storedUser) {
      navigate("/login", { replace: true });
      return;
    }

    const user = (storedUser);
    const userRole = user?.role || "user"; // Get the role from user data

    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
      navigate("/login", { replace: true });
      return;
    }

    setIsCheckingAuth(false); // Authentication check complete
  }, [location.pathname, navigate, allowedRoles]);

  if (isCheckingAuth) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderCircle className="animate-spin w-10 h-10 text-gray-500" />
      </div>
    );
  }


  return <>{children}</>;
};

export default RoleBasedProtectedRoute;
