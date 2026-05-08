import React, { useState, useEffect } from "react";
import DashboardLayout from "../../DashboardLayout/DashboardLayout";
import {
  FiArrowLeft,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiUser,
  FiShoppingBag,
  FiEdit2,
  FiTrash2,
  FiX,
  FiSave,
  FiAlertTriangle,
  FiSlash,
  FiCheckCircle,
} from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../utils/api";
import { useToast } from "../../context/ToastContext";

const Field = ({
  label,
  name,
  type = "text",
  options,
  form,
  errors,
  onChange,
}) => {
  if (!onChange) console.warn(`Field "${name}" is missing onChange prop`);
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {label}
      </label>
      {options ? (
        <select
          name={name}
          value={form[name]}
          onChange={onChange}
          className="px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <>
          <input
            type={type}
            name={name}
            value={form[name]}
            onChange={onChange}
            className={`px-3 py-2.5 rounded-xl border text-sm text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition ${
              errors[name] ? "border-red-400" : "border-gray-200"
            }`}
          />
          {errors[name] && (
            <p className="text-xs text-red-500 mt-0.5">{errors[name]}</p>
          )}
        </>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   Edit Modal
───────────────────────────────────────────── */
const EditUserModal = ({ user, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    birthday: user.birthday
      ? new Date(user.birthday).toISOString().split("T")[0]
      : "",
    role: user.role || "user",
    street_address: user.street_address || "",
    closest_landmark: user.closest_landmark || "",
    state: user.state || "",
    postal_code: user.postal_code || "",
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required.";
    if (!form.email.trim()) errs.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      errs.email = "Enter a valid email.";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    try {
      setSaving(true);
      await onSave(form);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Edit User</h2>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <FiUser className="w-4 h-4 text-orange-400" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Full Name"
                name="name"
                form={form}
                errors={errors}
                onChange={handleChange}
              />
              <Field
                label="Email"
                name="email"
                type="email"
                form={form}
                errors={errors}
                onChange={handleChange}
              />
              <Field
                label="Phone"
                name="phone"
                type="tel"
                form={form}
                errors={errors}
                onChange={handleChange}
              />
              <Field
                label="Birthday"
                name="birthday"
                type="date"
                form={form}
                errors={errors}
                onChange={handleChange}
              />
              <Field
                label="Role"
                name="role"
                form={form}
                errors={errors}
                onChange={handleChange}
                options={[
                  { value: "user", label: "User" },
                  { value: "admin", label: "Admin" },
                ]}
              />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <FiMapPin className="w-4 h-4 text-orange-400" />
              Primary Address
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Field
                  label="Street Address"
                  name="street_address"
                  form={form}
                  errors={errors}
                  onChange={handleChange}
                />
              </div>
              <Field
                label="Closest Landmark"
                name="closest_landmark"
                form={form}
                errors={errors}
                onChange={handleChange}
              />
              <Field
                label="State"
                name="state"
                form={form}
                errors={errors}
                onChange={handleChange}
              />
              <Field
                label="Postal Code"
                name="postal_code"
                form={form}
                errors={errors}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/60">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
          >
            <FiSave className="w-4 h-4" />
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Delete Confirmation Modal
───────────────────────────────────────────── */
const DeleteConfirmModal = ({ user, onClose, onConfirm }) => {
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    setDeleting(true);
    try {
      await onConfirm();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-5">
        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <FiAlertTriangle className="w-7 h-7 text-red-500" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Delete User?</h2>
          <p className="text-sm text-gray-500">
            You're about to permanently delete{" "}
            <span className="font-semibold text-gray-800">{user.name}</span>.
            This action cannot be undone.
          </p>
        </div>
        <div className="flex items-center gap-3 p-3 bg-red-50 rounded-xl border border-red-100">
          <div className="w-9 h-9 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={deleting}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
          >
            <FiTrash2 className="w-4 h-4" />
            {deleting ? "Deleting…" : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Suspend Confirmation Modal
───────────────────────────────────────────── */
const SuspendConfirmModal = ({ user, onClose, onConfirm }) => {
  const [suspending, setSuspending] = useState(false);

  const handleConfirm = async () => {
    setSuspending(true);
    try {
      await onConfirm();
    } finally {
      setSuspending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-5">
        <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
          <FiSlash className="w-7 h-7 text-amber-500" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-bold text-gray-900 mb-1">
            Suspend User?
          </h2>
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-800">{user.name}</span>{" "}
            will lose access to their account. You can unsuspend them at any
            time.
          </p>
        </div>
        <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
          <div className="w-9 h-9 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={suspending}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
          >
            <FiSlash className="w-4 h-4" />
            {suspending ? "Suspending…" : "Yes, Suspend"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Unsuspend Confirmation Modal
───────────────────────────────────────────── */
const UnsuspendConfirmModal = ({ user, onClose, onConfirm }) => {
  const [unsuspending, setUnsuspending] = useState(false);

  const handleConfirm = async () => {
    setUnsuspending(true);
    try {
      await onConfirm();
    } finally {
      setUnsuspending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-5">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <FiCheckCircle className="w-7 h-7 text-green-500" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-bold text-gray-900 mb-1">
            Unsuspend User?
          </h2>
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-800">{user.name}</span>{" "}
            will regain full access to their account.
          </p>
        </div>
        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-100">
          <div className="w-9 h-9 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={unsuspending}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
          >
            <FiCheckCircle className="w-4 h-4" />
            {unsuspending ? "Unsuspending…" : "Yes, Unsuspend"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
const SingleUser = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showUnsuspendModal, setShowUnsuspendModal] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/admin/users/${userId}`);
      setUser(data);
    } catch (err) {
      console.error("Failed to fetch user:", err);
      showToast("Failed to load user details", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async (form) => {
    try {
      const { data } = await api.put(`/admin/users/${userId}`, form);
      if (data) {
        fetchUser();
        setShowEditModal(false);
      }
    } catch (err) {
      console.error("Failed to update user:", err);
      showToast("Failed to update user. Please try again.", "error");
    }
  };

  // Fixed: body must be an array of user IDs per the route spec
  const handleDeleteUser = async () => {
    try {
      await api.delete(`/admin/users`, { data: { ids: [userId] } });
      navigate("/admin/users");
    } catch (err) {
      showToast(
        err.response?.data?.message ||
          err.response?.data?.error ||
          JSON.stringify(err.response?.data) ||
          "Failed to delete user. Please try again.",
        "error"
      );
    }
  };

  const handleSuspendUser = async () => {
    try {
      await api.patch(`/admin/users/${userId}/suspend`);
      setShowSuspendModal(false);
      fetchUser();
    } catch (err) {
      console.error("Failed to suspend user:", err);
      showToast("Failed to suspend user. Please try again.", "error");
    }
  };

  const handleUnsuspendUser = async () => {
    try {
      await api.patch(`/admin/users/${userId}/unsuspend`);
      setShowUnsuspendModal(false);
      fetchUser();
    } catch (err) {
      console.error("Failed to unsuspend user:", err);
      showToast("Failed to unsuspend user. Please try again.", "error");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-orange-100 text-orange-600",
      processing: "bg-purple-100 text-purple-600",
      confirmed: "bg-green-100 text-green-600",
      completed: "bg-green-100 text-green-600",
    };
    return colors[status] || "bg-gray-100 text-gray-600";
  };

  const getRoleBadge = (role) => {
    return role === "admin"
      ? "bg-purple-100 text-purple-600"
      : "bg-blue-100 text-blue-600";
  };

  const isSuspended = user?.is_suspended;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 text-center text-gray-500">
          Loading user details...
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="p-6 text-center text-gray-500">User not found</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 bg-gray-50/50 min-h-full">
        {/* Modals */}
        {showEditModal && (
          <EditUserModal
            user={user}
            onClose={() => setShowEditModal(false)}
            onSave={handleSaveEdit}
          />
        )}
        {showDeleteModal && (
          <DeleteConfirmModal
            user={user}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleDeleteUser}
          />
        )}
        {showSuspendModal && (
          <SuspendConfirmModal
            user={user}
            onClose={() => setShowSuspendModal(false)}
            onConfirm={handleSuspendUser}
          />
        )}
        {showUnsuspendModal && (
          <UnsuspendConfirmModal
            user={user}
            onClose={() => setShowUnsuspendModal(false)}
            onConfirm={handleUnsuspendUser}
          />
        )}

        {/* Back */}
        <button
          onClick={() => navigate("/admin/users")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Users</span>
        </button>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Profile Header */}
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-white">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  {/* Suspended badge on avatar */}
                  {isSuspended && (
                    <span className="absolute -bottom-1 -right-1 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center border-2 border-white">
                      <FiSlash className="w-3 h-3 text-white" />
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {user.name}
                  </h1>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadge(user.role)}`}
                    >
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                    {/* Suspended status badge */}
                    {isSuspended && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 flex items-center gap-1">
                        <FiSlash className="w-3 h-3" />
                        Suspended
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition shadow-sm"
                >
                  <FiEdit2 className="w-4 h-4" />
                  Edit
                </button>

                {/* Toggle between Suspend and Unsuspend */}
                {isSuspended ? (
                  <button
                    onClick={() => setShowUnsuspendModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-green-200 bg-green-50 hover:bg-green-100 text-green-600 text-sm font-semibold transition"
                  >
                    <FiCheckCircle className="w-4 h-4" />
                    Unsuspend
                  </button>
                ) : (
                  <button
                    onClick={() => setShowSuspendModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-600 text-sm font-semibold transition"
                  >
                    <FiSlash className="w-4 h-4" />
                    Suspend
                  </button>
                )}

                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-semibold transition"
                >
                  <FiTrash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Contact Info */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <FiMail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Email</p>
                    <p className="text-sm font-medium text-gray-900">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <FiPhone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Phone</p>
                    <p className="text-sm font-medium text-gray-900">
                      {user.phone || "Not provided"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <FiCalendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Birthday</p>
                    <p className="text-sm font-medium text-gray-900">
                      {user.birthday
                        ? new Date(user.birthday).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "Not provided"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <FiUser className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Member Since</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(user.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Primary Address */}
            {(user.street_address || user.state || user.postal_code) && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Primary Address
                </h2>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-start gap-3">
                    <FiMapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      {user.street_address && (
                        <p className="text-sm text-gray-900 mb-1">
                          {user.street_address}
                        </p>
                      )}
                      {user.closest_landmark && (
                        <p className="text-sm text-gray-600 mb-1">
                          Near {user.closest_landmark}
                        </p>
                      )}
                      <p className="text-sm text-gray-600">
                        {[user.state, user.postal_code]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Saved Addresses */}
            {user.addresses && user.addresses.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Saved Addresses ({user.addresses.length})
                </h2>
                <div className="space-y-3">
                  {user.addresses.map((address) => (
                    <div
                      key={address.id}
                      className="p-4 bg-gray-50 rounded-xl border border-gray-100"
                    >
                      <div className="flex items-start gap-3">
                        <FiMapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-900 mb-1">
                            {address.street_address}
                          </p>
                          {address.closest_landmark && (
                            <p className="text-sm text-gray-600 mb-1">
                              Near {address.closest_landmark}
                            </p>
                          )}
                          <p className="text-sm text-gray-600">
                            {[address.state, address.postal_code]
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            Added{" "}
                            {new Date(address.created_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Order History */}
            {user.orders && user.orders.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Order History ({user.orders.length})
                </h2>
                <div className="space-y-4">
                  {user.orders.map((order) => (
                    <div
                      key={order.id}
                      className="p-4 bg-gray-50 rounded-xl border border-gray-100"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <FiShoppingBag className="w-4 h-4 text-gray-400" />
                          <span className="font-bold text-gray-900">
                            #{order.order_number}
                          </span>
                        </div>
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      </div>
                      <div className="space-y-2 mb-3">
                        {order.order_items?.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-gray-600">
                              <span className="text-gray-400 mr-2">
                                {item.quantity}x
                              </span>
                              {item.menu?.name}
                            </span>
                            <span className="font-medium text-gray-900">
                              {new Intl.NumberFormat("en-NG", {
                                style: "currency",
                                currency: "NGN",
                                minimumFractionDigits: 0,
                              }).format(Math.ceil(item.subtotal))}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                        <div className="text-xs text-gray-500">
                          {new Date(order.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}{" "}
                          • {order.order_type}
                        </div>
                        <span className="text-lg font-bold text-orange-500">
                          {new Intl.NumberFormat("en-NG", {
                            style: "currency",
                            currency: "NGN",
                            minimumFractionDigits: 0,
                          }).format(Math.ceil(order.final_amount))}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {user.orders && user.orders.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
            <FiShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No orders yet</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SingleUser;
