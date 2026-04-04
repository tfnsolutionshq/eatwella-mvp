import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminOrSupervisorGuard = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) return <Navigate to="/admin/login" replace />;

  if (user.role !== "admin" && user.role !== "supervisor") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
};

export default AdminOrSupervisorGuard;
