import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import api from "../../utils/api";

function LoginContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { clearCart } = useCart();
  const initialEmail = location.state?.email || "";

  const [phoneOrEmail, setPhoneOrEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    if (!phoneOrEmail || !password) {
      setErrors((prevErrors) => [...prevErrors, "Please fill in both fields"]);
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/customer/login", {
        login: phoneOrEmail,
        password,
      });
      const data = response.data;
      if (data?.token && data?.user) {
        login(data.token, data.user);
        clearCart();
      }
      navigate("/account/dashboard", { replace: true });
    } catch (error) {
      if (error.response) {
        if (error.response.data?.errors) {
          error.response.data?.errors?.login.map((loginError) => {
            setErrors((prevErrors) => [...prevErrors, loginError]);
          });
        } else {
          setErrors((prevErrors) => [
            ...prevErrors,
            error.response.data?.message || "Failed to login",
          ]);
        }
      } else if (error.request) {
        setErrors((prevErrors) => [
          ...prevErrors,
          "Network error. Please try again.",
        ]);
      } else {
        setErrors((prevErrors) => [
          ...prevErrors,
          "An unexpected error occurred",
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 py-12 px-4 md:px-6 min-h-[60vh]">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 px-8 py-10 flex flex-col items-stretch text-center">
          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                Phone Number or Email
              </label>
              <input
                type="text"
                value={phoneOrEmail}
                onChange={(e) => setPhoneOrEmail(e.target.value)}
                placeholder="Enter your phone number or email"
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

            <div>
              <Link
                to="/forgot-password"
                className="text-sm text-orange-500 underline flex justify-end"
              >
                Forgot Password?
              </Link>
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
              className="w-full py-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm tracking-wide disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => navigate("/account/create")}
            className="mt-4 text-sm text-orange-500 hover:text-orange-600"
          >
            Create an account
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginContent;
