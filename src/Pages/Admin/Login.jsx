import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdRestaurant } from "react-icons/md";
import { FiMail, FiLock, FiEye, FiEyeOff, FiHome } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";

const ROLE_REDIRECT = {
  attendant: "/attendant/orders",
  delivery_agent: "/delivery/orders",
  kitchen: "/kitchen/orders",
  supervisor: "/supervisor/orders",
  store_keeper: "/store-keeper/menu",
};

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [staffType, setStaffType] = useState("admin"); // "admin" | "staff"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [outletId, setOutletId] = useState("");
  const [outlets, setOutlets] = useState([]);
  const [loadingOutlets, setLoadingOutlets] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Fetch outlets whenever the user switches to "Other Staff"
  useEffect(() => {
    if (staffType !== "staff") return;
    let cancelled = false;
    const fetchOutlets = async () => {
      setLoadingOutlets(true);
      setOutletId("");
      try {
        const { data } = await api.get("/outlets");
        if (!cancelled) {
          const list = Array.isArray(data) ? data : (data.data ?? []);
          setOutlets(list);
        }
      } catch (_) {
        if (!cancelled) setOutlets([]);
      } finally {
        if (!cancelled) setLoadingOutlets(false);
      }
    };
    fetchOutlets();
    return () => {
      cancelled = true;
    };
  }, [staffType]);

  const handleStaffTypeChange = (type) => {
    setStaffType(type);
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (staffType === "staff" && !outletId) {
      setError("Please select your outlet.");
      return;
    }

    setLoading(true);
    try {
      const payload =
        staffType === "staff"
          ? { email, password, outlet_id: outletId }
          : { email, password };

      const { data } = await api.post("/login", payload);
      login(data.token, data.user, data.outlet);
      navigate(ROLE_REDIRECT[data.user?.role] ?? "/admin/dashboard");
    } catch (err) {
      if (
        err.response?.status === 401 ||
        err.response?.status === 403 ||
        err.response?.status === 422
      ) {
        setError("Invalid credentials");
      } else {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Login failed. Please try again",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white mb-4">
              <MdRestaurant className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Eatwella</h1>
            <p className="text-sm text-gray-500 mt-1">Staff Portal</p>
          </div>

          {/* Staff type selector */}
          <div className="flex gap-3 mb-6">
            {[
              { value: "admin", label: "Admin" },
              { value: "staff", label: "Other Staff" },
            ].map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => handleStaffTypeChange(value)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                  staffType === value
                    ? "bg-orange-500 text-white border-orange-500 shadow-sm shadow-orange-200"
                    : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Outlet selector — staff only */}
            {staffType === "staff" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Outlet
                </label>
                <div className="relative">
                  <FiHome className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  {loadingOutlets ? (
                    <div className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-400 flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-gray-300 border-t-orange-500 rounded-full animate-spin" />
                      Loading outlets…
                    </div>
                  ) : (
                    <select
                      value={outletId}
                      onChange={(e) => setOutletId(e.target.value)}
                      required
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-900 focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none appearance-none"
                    >
                      <option value="">Select your outlet…</option>
                      {outlets.map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-12 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <FiEyeOff className="w-5 h-5" />
                  ) : (
                    <FiEye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || (staffType === "staff" && loadingOutlets)}
              className="w-full px-4 py-3 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors shadow-sm shadow-orange-200 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in…" : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
