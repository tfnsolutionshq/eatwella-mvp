import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  ModalWrapper,
  ErrorBanner,
} from "../../Components/UserDashboard/shared";
import { FiEye, FiEyeOff } from "react-icons/fi";
import api from "../../utils/api";
import { useToast } from "../../context/ToastContext";

function SettingsPage() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
  });
  const [deletePassword, setDeletePassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showDeletePasswordVisible, setShowDeletePasswordVisible] =
    useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.put("/customer/change-password", passwordData);
      setShowPasswordModal(false);
      setPasswordData({ current_password: "", new_password: "" });
      showToast("Password changed successfully", "success");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const email = user.email;
    const password = deletePassword;
    try {
      const response = await api.delete("/customer/delete-account", {
        email,
        password,
      });
      logout();
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
        <div className="p-6">
          <h2 className="text-lg font-semibold">Account Settings</h2>
        </div>
        <div className="px-6 pb-6 space-y-3">
          <button
            onClick={() => setShowPasswordModal(true)}
            className="w-full bg-gray-100 hover:bg-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 transition-colors"
          >
            Change Password
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full bg-red-50 hover:bg-red-100 rounded-xl px-4 py-3 text-sm text-red-600 transition-colors"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <ModalWrapper
          onClose={() => {
            setShowPasswordModal(false);
            setError("");
            setPasswordData({ current_password: "", new_password: "" });
          }}
        >
          <form onSubmit={handleChangePassword}>
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold">Change Password</h3>
            </div>
            <div className="p-6 space-y-4">
              {error && <ErrorBanner message={error} />}
              {[
                { label: "Current Password", key: "current_password" },
                { label: "New Password", key: "new_password" },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                  </label>
                  <div className="relative">
                    <input
                      type={
                        key === "current_password"
                          ? showCurrentPassword
                            ? "text"
                            : "password"
                          : showNewPassword
                            ? "text"
                            : "password"
                      }
                      value={passwordData[key]}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          [key]: e.target.value,
                        })
                      }
                      placeholder={
                        key === "current_password"
                          ? "Enter current password"
                          : "Enter new password"
                      }
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        key === "current_password"
                          ? setShowCurrentPassword(!showCurrentPassword)
                          : setShowNewPassword(!showNewPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {key === "current_password" ? (
                        showCurrentPassword ? (
                          <FiEyeOff className="w-5 h-5" />
                        ) : (
                          <FiEye className="w-5 h-5" />
                        )
                      ) : showNewPassword ? (
                        <FiEyeOff className="w-5 h-5" />
                      ) : (
                        <FiEye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowPasswordModal(false);
                  setError("");
                  setPasswordData({ current_password: "", new_password: "" });
                }}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 disabled:opacity-50"
              >
                {loading ? "Changing..." : "Change Password"}
              </button>
            </div>
          </form>
        </ModalWrapper>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <ModalWrapper
          onClose={() => {
            setShowDeleteModal(false);
            setError("");
            setDeletePassword("");
          }}
        >
          <form onSubmit={handleDeleteAccount}>
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-red-600">Delete Account</h3>
              <p className="text-sm text-gray-600 mt-2">
                This action cannot be undone. Please enter your password to
                confirm.
              </p>
            </div>
            <div className="p-6 space-y-4">
              {error && <ErrorBanner message={error} />}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showDeletePasswordVisible ? "text" : "password"}
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowDeletePasswordVisible(!showDeletePasswordVisible)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showDeletePasswordVisible ? (
                      <FiEyeOff className="w-5 h-5" />
                    ) : (
                      <FiEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setError("");
                  setDeletePassword("");
                }}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Delete Account"}
              </button>
            </div>
          </form>
        </ModalWrapper>
      )}
    </div>
  );
}

export default SettingsPage;
