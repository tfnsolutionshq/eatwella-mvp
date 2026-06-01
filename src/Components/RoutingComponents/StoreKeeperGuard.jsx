// Components/RoutingComponents/StoreKeeperGuard.jsx

import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const StoreKeeperGuard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="bg-white h-screen"></div>;
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (user.role === "store_keeper") {
    return <Outlet />;
  }

  // Redirect other roles to their appropriate home
  if (user.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Navigate to="/admin/orders" replace />;
};

export default StoreKeeperGuard;
