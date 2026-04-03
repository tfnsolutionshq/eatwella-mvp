import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PublicRouteGuard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="bg-white h-screen"></div>;
  }

  if (user) {
    if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    if (
      user.role === "supervisor" ||
      user.role === "kitchen" ||
      user.role === "delivery_agent" ||
      user.role === "attendant"
    ) {
      return <Navigate to="/admin/orders" replace />;
    }
  }

  return <Outlet />;
};

export default PublicRouteGuard;
