import { useState, useEffect } from "react";
import DashboardLayout from "../../DashboardLayout/DashboardLayout";
import {
  FiEdit2,
  FiX,
  FiCheck,
  FiAlertTriangle,
  FiPackage,
} from "react-icons/fi";
import api from "../../utils/api";

// ─────────────────────────────────────────────────────────────────────────────
// DEV TOGGLE
// Set to `false` once the real endpoints are ready — nothing else needs to change.
// ─────────────────────────────────────────────────────────────────────────────
const USING_DUMMY_DATA = false;

const DUMMY_PACKAGES = [
  { id: 1, name: "Small", price: 150 },
  { id: 2, name: "Medium", price: 300 },
  { id: 3, name: "Big", price: 500 },
];
// ─────────────────────────────────────────────────────────────────────────────

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
        // Simulate network delay so the saving spinner is visible
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
              <FiPackage className="w-4 h-4 text-orange-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Update Price
              </h2>
              <p className="text-xs text-gray-400 mt-0.5 capitalize">
                {editingPackage?.name}
              </p>
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
        <div className="px-6 py-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
              <FiAlertTriangle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

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
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm shadow-orange-200"
          >
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <FiCheck className="w-4 h-4" />
                Save Price
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Size badge styling ────────────────────────────────────────────────────────

const SIZE_STYLES = {
  small: { badge: "bg-blue-50 text-blue-600 border-blue-100" },
  medium: { badge: "bg-orange-50 text-orange-600 border-orange-100" },
  big: { badge: "bg-purple-50 text-purple-600 border-purple-100" },
};

const getSizeStyle = (name = "") =>
  SIZE_STYLES[name.toLowerCase()] ?? SIZE_STYLES.medium;

// ── Main Page ─────────────────────────────────────────────────────────────────

const PackagingManagement = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      if (USING_DUMMY_DATA) {
        await new Promise((res) => setTimeout(res, 400)); // simulate network
        setPackages(DUMMY_PACKAGES);
      } else {
        const { data } = await api.get("/admin/packagings");
        setPackages(data);
        // setPackages(Array.isArray(data) ? data : (data.data ?? []));
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

  const openEdit = (pkg) => {
    setEditingPackage(pkg);
    setModalOpen(true);
  };

  // When in dummy mode, update the price locally instead of refetching.
  // When using real endpoints, just refetch from the API.
  const handleUpdateSuccess = ({ id, price }) => {
    if (USING_DUMMY_DATA) {
      setPackages((prev) =>
        prev.map((p) => (p.id === id ? { ...p, price } : p)),
      );
    } else {
      fetchPackages();
    }
  };

  return (
    <>
      <EditPriceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleUpdateSuccess}
        editingPackage={editingPackage}
      />

      <DashboardLayout>
        <div className="p-6 space-y-6 bg-gray-50/50 min-h-full">
          {/* Page Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Food Packaging
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                View and update prices for each packaging size
              </p>
            </div>

            {/* Dev banner — only visible while dummy data is active */}
            {USING_DUMMY_DATA && (
              <div className="bg-amber-50 border border-amber-300 text-amber-700 px-4 py-2 rounded-lg text-xs font-medium">
                🛠 Dev mode: using dummy data. Set{" "}
                <code className="font-mono">USING_DUMMY_DATA = false</code> when
                endpoints are ready.
              </div>
            )}
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <span className="w-7 h-7 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {packages.map((pkg) => {
                const style = getSizeStyle(pkg.name);
                return (
                  <div
                    key={pkg.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col"
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

                    {/* Price display */}
                    <div className="p-5 flex-1 flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Current Price
                      </span>
                      <span className="text-2xl font-black text-orange-500">
                        ₦{Number(pkg.price).toLocaleString()}
                      </span>
                    </div>

                    {/* Footer */}
                    <div className="p-4 bg-gray-50 border-t border-gray-100">
                      <button
                        onClick={() => openEdit(pkg)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors shadow-sm"
                      >
                        <FiEdit2 className="w-4 h-4" />
                        Update Price
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
