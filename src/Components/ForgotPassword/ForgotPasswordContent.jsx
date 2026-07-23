import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../utils/api";

function ForgotPasswordContent() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSuccess("");

    if (!email.trim()) {
      setErrors(["Please enter your email address"]);
      return;
    }

    try {
      setLoading(true);
      await api.post("/forgot-password", { email: email.trim() });
      setSuccess(
        "If this email is registered, you will receive a password reset link shortly.",
      );
      setEmail("");
    } catch (error) {
      if (error.response) {
        const msg = error.response.data?.message || "Failed to send reset link";
        if (error.response.data?.errors) {
          const errs = Object.values(error.response.data.errors).flat();
          setErrors(errs);
        } else {
          setErrors([msg]);
        }
      } else if (error.request) {
        setErrors(["Network error. Please try again."]);
      } else {
        setErrors(["An unexpected error occurred"]);
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
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {errors.length > 0 && (
              <div className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-2xl px-3 py-2">
                {errors.map((error, index) => (
                  <p key={index}>{error}</p>
                ))}
              </div>
            )}

            {success && (
              <div className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-2xl px-3 py-2">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm tracking-wide disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <Link
            to="/account/login"
            className="mt-4 text-sm text-orange-500 hover:text-orange-600"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordContent;
