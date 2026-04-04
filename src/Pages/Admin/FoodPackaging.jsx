import { useState, useEffect } from "react";
import DashboardLayout from "../../DashboardLayout/DashboardLayout";
import {
  FiEdit2,
  FiX,
  FiCheck,
  FiAlertTriangle,
  FiPackage,
  FiPlus,
  FiTrash2,
  FiToggleLeft,
  FiToggleRight,
} from "react-icons/fi";
import api from "../../utils/api";

// ─────────────────────────────────────────────────────────────────────────────
// DEV TOGGLE
// Set to `false` once the real endpoints are ready — nothing else needs to change.
// ─────────────────────────────────────────────────────────────────────────────
const USING_DUMMY_DATA = false;

const DUMMY_PACKAGES = [
  { id: 1, size_name: "Small", price: 150, is_active: true },
  { id: 2, size_name: "Medium", price: 300, is_active: true },
  { id: 3, size_name: "Big", price: 500, is_active: false },
];
// ─────────────────────────────────────────────────────────────────────────────

// ── Shared modal shell ────────────────────────────────────────────────────────

const ModalShell = ({
  isOpen,
  onClose,
  icon: Icon,
  title,
  subtitle,
  children,
  footer,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <Icon className="w-4 h-4 text-orange-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">{title}</h2>
              {subtitle && (
                <p className="text-xs text-gray-400 mt-0.5 capitalize">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">{children}</div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
          {footer}
        </div>
      </div>
    </div>
  );
};

const ErrorBanner = ({ message }) =>
  message ? (
    <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
      <FiAlertTriangle className="w-4 h-4 flex-shrink-0" />
      {message}
    </div>
  ) : null;

const SpinnerBtn = ({
  saving,
  savingLabel,
  defaultLabel,
  onClick,
  disabled,
  icon: Icon = FiCheck,
}) => (
  <button
    onClick={onClick}
    disabled={saving || disabled}
    className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm shadow-orange-200"
  >
    {saving ? (
      <>
        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
        {savingLabel}
      </>
    ) : (
      <>
        <Icon className="w-4 h-4" />
        {defaultLabel}
      </>
    )}
  </button>
);

// ── Edit Price Modal ──────────────────────────────────────────────────────────

const EditPriceModal = ({ isOpen, onClose, onSuccess, editingPackage }) => {
  const [price, setPrice] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setPrice(editingPackage?.price ?? "");
    setError("");
  }, [isOpen, editingPackage]);

  const handleSubmit = async () => {
    if (price === "" || isNaN(Number(price)) || Number(price) < 0) {
      setError("Please enter a valid price.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (USING_DUMMY_DATA) {
        await new Promise((res) => setTimeout(res, 500));
      } else {
        await api.put(`/admin/packagings/${editingPackage.id}`, {
          price: Number(price),
        });
      }
      onSuccess({ id: editingPackage.id, price: Number(price) });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update price.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      icon={FiPackage}
      title="Update Price"
      subtitle={editingPackage?.size_name}
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <SpinnerBtn
            saving={saving}
            savingLabel="Saving…"
            defaultLabel="Save Price"
            onClick={handleSubmit}
          />
        </>
      }
    >
      <ErrorBanner message={error} />
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
          New Price (₦)
        </label>
        <input
          type="number"
          min={0}
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="e.g. 150"
          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
          autoFocus
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
      </div>
    </ModalShell>
  );
};

// ── Create Package Modal ──────────────────────────────────────────────────────

const CreatePackageModal = ({ isOpen, onClose, onSuccess }) => {
  const [sizeName, setSizeName] = useState("");
  const [price, setPrice] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setSizeName("");
    setPrice("");
    setError("");
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!sizeName.trim()) {
      setError("Please enter a package name.");
      return;
    }
    if (price === "" || isNaN(Number(price)) || Number(price) < 0) {
      setError("Please enter a valid price.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      let newPackage;
      if (USING_DUMMY_DATA) {
        await new Promise((res) => setTimeout(res, 500));
        newPackage = {
          id: Date.now(),
          size_name: sizeName.trim(),
          price: Number(price),
          is_active: true,
        };
      } else {
        const { data } = await api.post("/admin/packagings", {
          size_name: sizeName.trim(),
          price: Number(price),
        });
        newPackage = data;
      }
      onSuccess(newPackage);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create package.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      icon={FiPlus}
      title="New Package"
      subtitle="Add a packaging size"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <SpinnerBtn
            saving={saving}
            savingLabel="Creating…"
            defaultLabel="Create Package"
            icon={FiPlus}
            onClick={handleSubmit}
          />
        </>
      }
    >
      <ErrorBanner message={error} />
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
          Package Name
        </label>
        <input
          type="text"
          value={sizeName}
          onChange={(e) => setSizeName(e.target.value)}
          placeholder="e.g. Large"
          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
          autoFocus
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
          Price (₦)
        </label>
        <input
          type="number"
          min={0}
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="e.g. 750"
          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
      </div>
    </ModalShell>
  );
};

// ── Delete Confirm Modal ──────────────────────────────────────────────────────

const DeleteConfirmModal = ({ isOpen, onClose, onSuccess, pkg }) => {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) setError("");
  }, [isOpen]);

  const handleDelete = async () => {
    setDeleting(true);
    setError("");
    try {
      if (USING_DUMMY_DATA) {
        await new Promise((res) => setTimeout(res, 500));
      } else {
        await api.delete(`/admin/packagings/${pkg.id}`);
      }
      onSuccess(pkg.id);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete package.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      icon={FiTrash2}
      title="Delete Package"
      subtitle={pkg?.size_name}
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {deleting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Deleting…
              </>
            ) : (
              <>
                <FiTrash2 className="w-4 h-4" />
                Delete
              </>
            )}
          </button>
        </>
      }
    >
      <ErrorBanner message={error} />
      <p className="text-sm text-gray-600">
        Are you sure you want to delete the{" "}
        <span className="font-semibold capitalize">{pkg?.size_name}</span>{" "}
        package? This action cannot be undone.
      </p>
    </ModalShell>
  );
};

// ── Size badge styling ────────────────────────────────────────────────────────

const SIZE_STYLES = {
  small: { badge: "bg-blue-50 text-blue-600 border-blue-100" },
  medium: { badge: "bg-orange-50 text-orange-600 border-orange-100" },
  big: { badge: "bg-purple-50 text-purple-600 border-purple-100" },
};

const getSizeStyle = (name = "") =>
  SIZE_STYLES[name.toLowerCase()] ?? {
    badge: "bg-gray-50 text-gray-600 border-gray-100",
  };

// ── Main Page ─────────────────────────────────────────────────────────────────

const PackagingManagement = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal visibility
  const [editModal, setEditModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  // Which package is being acted on
  const [editingPackage, setEditingPackage] = useState(null);
  const [deletingPackage, setDeletingPackage] = useState(null);

  // Per-card toggling spinner (keyed by package id)
  const [togglingId, setTogglingId] = useState(null);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      if (USING_DUMMY_DATA) {
        await new Promise((res) => setTimeout(res, 400));
        setPackages(DUMMY_PACKAGES);
      } else {
        const { data } = await api.get("/admin/packagings");
        setPackages(Array.isArray(data) ? data : (data.data ?? []));
      }
    } catch (err) {
      console.error("Failed to fetch packages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const openEdit = (pkg) => {
    setEditingPackage(pkg);
    setEditModal(true);
  };
  const openDelete = (pkg) => {
    setDeletingPackage(pkg);
    setDeleteModal(true);
  };

  const handleUpdateSuccess = ({ id, price }) => {
    if (USING_DUMMY_DATA) {
      setPackages((prev) =>
        prev.map((p) => (p.id === id ? { ...p, price } : p)),
      );
    } else {
      fetchPackages();
    }
  };

  const handleCreateSuccess = (newPackage) => {
    if (USING_DUMMY_DATA) {
      setPackages((prev) => [...prev, newPackage]);
    } else {
      fetchPackages();
    }
  };

  const handleDeleteSuccess = (id) => {
    if (USING_DUMMY_DATA) {
      setPackages((prev) => prev.filter((p) => p.id !== id));
    } else {
      fetchPackages();
    }
  };

  const handleToggle = async (pkg) => {
    setTogglingId(pkg.id);
    try {
      if (USING_DUMMY_DATA) {
        await new Promise((res) => setTimeout(res, 400));
        setPackages((prev) =>
          prev.map((p) =>
            p.id === pkg.id ? { ...p, is_active: !p.is_active } : p,
          ),
        );
      } else {
        await api.patch(`/admin/packagings/${pkg.id}/toggle`);
        // Optimistic update — flip locally; fetchPackages() would also work
        setPackages((prev) =>
          prev.map((p) =>
            p.id === pkg.id ? { ...p, is_active: !p.is_active } : p,
          ),
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update availability.");
    } finally {
      setTogglingId(null);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <>
      <EditPriceModal
        isOpen={editModal}
        onClose={() => setEditModal(false)}
        onSuccess={handleUpdateSuccess}
        editingPackage={editingPackage}
      />
      <CreatePackageModal
        isOpen={createModal}
        onClose={() => setCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />
      <DeleteConfirmModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onSuccess={handleDeleteSuccess}
        pkg={deletingPackage}
      />

      <DashboardLayout>
        <div className="p-6 space-y-6 bg-gray-50/50 min-h-full">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Food Packaging
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage packaging sizes, prices, and availability
              </p>
            </div>
            <div className="flex items-center gap-3">
              {USING_DUMMY_DATA && (
                <div className="bg-amber-50 border border-amber-300 text-amber-700 px-3 py-1.5 rounded-lg text-xs font-medium">
                  🛠 Dev mode —{" "}
                  <code className="font-mono">USING_DUMMY_DATA = false</code>{" "}
                  when ready.
                </div>
              )}
              <button
                onClick={() => setCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors shadow-sm shadow-orange-200"
              >
                <FiPlus className="w-4 h-4" />
                New Package
              </button>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <span className="w-7 h-7 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center py-16 text-gray-400 text-sm">
              No packages found. Create one to get started.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {packages.map((pkg) => {
                const style = getSizeStyle(pkg.size_name);
                const toggling = togglingId === pkg.id;

                return (
                  <div
                    key={pkg.id}
                    className={`bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col transition-opacity ${
                      pkg.is_active
                        ? "border-gray-100"
                        : "border-gray-100 opacity-60"
                    }`}
                  >
                    {/* Card Header */}
                    <div className="p-5 border-b border-gray-50 flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FiPackage className="w-5 h-5 text-orange-500" />
                      </div>
                      <h3 className="font-bold text-gray-900 text-base capitalize">
                        {pkg.size_name}
                      </h3>
                      <span
                        className={`ml-auto px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${style.badge}`}
                      >
                        {pkg.size_name}
                      </span>
                    </div>

                    {/* Price + availability */}
                    <div className="p-5 flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Current Price
                        </span>
                        <span className="text-2xl font-black text-orange-500">
                          ₦{Number(pkg.price).toLocaleString()}
                        </span>
                      </div>

                      {/* Availability toggle row */}
                      <div className="flex items-center justify-between pt-2 border-t border-dashed border-gray-100">
                        <span className="text-sm text-gray-500">Available</span>
                        <button
                          onClick={() => handleToggle(pkg)}
                          disabled={toggling}
                          title={
                            pkg.is_active
                              ? "Click to disable"
                              : "Click to enable"
                          }
                          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                            pkg.is_active
                              ? "bg-green-50 text-green-600 border-green-100 hover:bg-green-100"
                              : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"
                          }`}
                        >
                          {toggling ? (
                            <span className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                          ) : pkg.is_active ? (
                            <FiToggleRight className="w-4 h-4" />
                          ) : (
                            <FiToggleLeft className="w-4 h-4" />
                          )}
                          {pkg.is_active ? "Active" : "Inactive"}
                        </button>
                      </div>
                    </div>

                    {/* Footer actions */}
                    <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center gap-2">
                      <button
                        onClick={() => openEdit(pkg)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors shadow-sm"
                      >
                        <FiEdit2 className="w-4 h-4" />
                        Update Price
                      </button>
                      <button
                        onClick={() => openDelete(pkg)}
                        className="flex items-center justify-center gap-2 px-3 py-2.5 bg-white border border-red-100 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors shadow-sm"
                        title="Delete package"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
};

export default PackagingManagement;
