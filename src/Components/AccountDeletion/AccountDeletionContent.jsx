import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";

function AccountDeletionContent() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [deleted, setDeleted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    if (!email || !password) {
      setErrors(prevErrors => [...prevErrors, "Please fill in both fields"]);
      return;
    }

    try {
      setLoading(true);
      await api.delete("/customer/delete-account", {
        data: { email, password }
      });
      if (user) {
        logout();
        navigate("/", { replace: true });
      } else {
        setDeleted(true);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.data?.errors) {
          const errObj = error.response.data.errors;
          Object.values(errObj).forEach(errArr => {
            if (Array.isArray(errArr)) {
              errArr.forEach(msg => {
                setErrors(prevErrors => [...prevErrors, msg]);
              });
            }
          });
        } else {
          setErrors(prevErrors => [...prevErrors, error.response.data?.message || "Failed to delete account"]);
        }
      } else if (error.request) {
        setErrors(prevErrors => [...prevErrors, "Network error. Please try again."]);
      } else {
        setErrors(prevErrors => [...prevErrors, "An unexpected error occurred"]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 py-12 px-4 md:px-6 min-h-[60vh]">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 px-8 py-10 flex flex-col items-stretch text-center">
          {deleted ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <span className="text-green-600 text-3xl">&#10003;</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Account Deleted</h2>
              <p className="text-gray-600 text-sm">
                Your account has been successfully deleted. We're sorry to see you go.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 pr-14 rounded-2xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-3 flex items-center text-xs text-gray-500"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {errors.length > 0 && (
                <div className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-2xl px-3 py-2">
                  {errors.map((error, index) => (
                    <p key={index}>{error}</p>
                  ))}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full bg-red-500 hover:bg-red-600 text-white font-semibold text-sm tracking-wide disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Deleting account..." : "Delete Account"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default AccountDeletionContent;
