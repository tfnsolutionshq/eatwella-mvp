// Components/RoutingComponents/StaffGuard.jsx

import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const STAFF_ROLES = [
  "supervisor",
  "kitchen",
  "delivery_agent",
  "attendant",
  "cashier",
];

const StaffGuard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="bg-white h-screen"></div>;
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // Allow staff
  if (STAFF_ROLES.includes(user.role)) {
    return <Outlet />;
  }

  // Optional: allow admin too
  if (user.role === "admin") {
    return <Outlet />;
  }

  return <Navigate to="/" replace />;
};

export default StaffGuard;
