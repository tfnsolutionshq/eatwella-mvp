import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiX, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import api from "../../utils/api";
import { useToast } from "../../context/ToastContext";

function ForgotPasswordContent() {
  const navigate = useNavigate();

  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const inputRefs = useRef([]);

  const [step, setStep] = useState("email");
  const [resetToken, setResetToken] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetErrors, setResetErrors] = useState([]);

  useEffect(() => {
    if (showOtpModal) {
      setOtp(["", "", "", "", "", ""]);
      setOtpError("");
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
    }
  }, [showOtpModal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    if (!email.trim()) {
      setErrors(["Please enter your email address"]);
      return;
    }

    try {
      setLoading(true);
      await api.post("/forgot-password", { email: email.trim() });
      setShowOtpModal(true);
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

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "Enter" && otp.every((d) => d !== "")) {
      handleOtpSubmit();
    }
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const handleOtpSubmit = async () => {
    const fullOtp = otp.join("");
    if (fullOtp.length !== 6) return;

    try {
      setOtpLoading(true);
      setOtpError("");
      const response = await api.post("/verify-otp", {
        email: email.trim(),
        otp: fullOtp,
      });
      const token = response.data.reset_token;
      console.log(token);
      setResetToken(token);
      setStep("reset");
      setShowOtpModal(false);
    } catch (error) {
      if (error.response) {
        setOtpError(
          error.response.data?.message || "Invalid OTP. Please try again.",
        );
      } else if (error.request) {
        setOtpError("Network error. Please try again.");
      } else {
        setOtpError("An unexpected error occurred");
      }
    } finally {
      setOtpLoading(false);
    }
  };

  const isOtpComplete = otp.every((d) => d !== "");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetErrors([]);

    if (!password.trim()) {
      setResetErrors(["Enter a new password"]);
      return;
    }
    if (password.length < 6) {
      setResetErrors(["Password must be at least 6 characters"]);
      return;
    }
    if (password !== passwordConfirmation) {
      setResetErrors(["Passwords do not match"]);
      return;
    }

    try {
      setResetLoading(true);
      const response = await api.post("/reset-password", {
        email: email.trim(),
        reset_token: resetToken,
        password,
        password_confirmation: passwordConfirmation,
      });
      showToast(response.data.message, "success");
      setStep("email");
      setEmail("");
      setPassword("");
      setPasswordConfirmation("");
      setResetToken("");
      navigate("/account/login");
    } catch (error) {
      if (error.response) {
        const msg = error.response.data?.message || "Failed to reset password";
        if (error.response.data?.errors) {
          const errs = Object.values(error.response.data.errors).flat();
          setResetErrors(errs);
        } else {
          setResetErrors([msg]);
        }
      } else if (error.request) {
        setResetErrors(["Network error. Please try again."]);
      } else {
        setResetErrors(["An unexpected error occurred"]);
      }
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 py-12 px-4 md:px-6 min-h-[60vh]">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 px-8 py-10 flex flex-col items-stretch text-center">
          {step === "email" ? (
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm tracking-wide disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          ) : (
            <form
              onSubmit={handleResetPassword}
              className="space-y-6 text-left"
            >
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showNewPassword ? (
                      <FiEyeOff className="w-5 h-5" />
                    ) : (
                      <FiEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <FiEyeOff className="w-5 h-5" />
                    ) : (
                      <FiEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {resetErrors.length > 0 && (
                <div className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-2xl px-3 py-2">
                  {resetErrors.map((error, index) => (
                    <p key={index}>{error}</p>
                  ))}
                </div>
              )}

              <button
                type="submit"
                disabled={resetLoading}
                className="w-full py-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm tracking-wide disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {resetLoading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}

          <Link
            to="/account/login"
            className="mt-4 text-sm text-orange-500 hover:text-orange-600"
          >
            Back to Login
          </Link>
        </div>
      </div>

      {showOtpModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => !otpLoading && setShowOtpModal(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <FiLock className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">
                    Verify OTP
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Enter the 6-digit code sent to your email
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowOtpModal(false)}
                disabled={otpLoading}
                className="text-gray-400 hover:text-gray-500 hover:bg-gray-100 p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center justify-center gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={handleOtpPaste}
                    disabled={otpLoading}
                    className={`w-14 h-14 text-center text-2xl font-bold rounded-xl border-2 outline-none transition-all
                      ${
                        otpError
                          ? "border-red-400 bg-red-50 text-red-600"
                          : digit
                            ? "border-orange-400 bg-orange-50 text-orange-600"
                            : "border-gray-200 bg-gray-50 text-gray-900 focus:border-orange-400 focus:bg-orange-50"
                      }
                      disabled:opacity-60 disabled:cursor-not-allowed`}
                  />
                ))}
              </div>

              {otpError && (
                <p className="text-sm text-red-500 text-center font-medium">
                  {otpError}
                </p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setShowOtpModal(false)}
                  disabled={otpLoading}
                  className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleOtpSubmit}
                  disabled={!isOtpComplete || otpLoading}
                  className="flex-1 px-4 py-2.5 bg-orange-500 rounded-xl text-sm font-medium text-white hover:bg-orange-600 transition-colors shadow-sm shadow-orange-200 disabled:bg-orange-300 disabled:cursor-not-allowed"
                >
                  {otpLoading ? "Verifying..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ForgotPasswordContent;
