// Components/RoutingComponents/AdminGuard.jsx

import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminGuard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="bg-white h-screen"></div>;
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/admin/orders" replace />;
  }

  return <Outlet />;
};

export default AdminGuard;
