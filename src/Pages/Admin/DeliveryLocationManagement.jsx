import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "../../DashboardLayout/DashboardLayout";
import {
  FiMapPin,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiCheck,
  FiAlertTriangle,
  FiRefreshCw,
} from "react-icons/fi";
import api from "../../utils/api";

// ── Location Modal ───────────────────────────────────────────────────────────

const LocationModal = ({ isOpen, onClose, onSuccess, editingLocation }) => {
  const isEdit = !!editingLocation;

  const blankForm = {
    name: "",
    city_id: 1,
    delivery_fee: "",
    is_active: true,
  };

  const [form, setForm] = useState(blankForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Re-populate form whenever the modal opens or the target location changes
  useEffect(() => {
    if (!isOpen) return;
    setError("");
    if (isEdit) {
      setForm({
        name: editingLocation.name ?? "",
        city_id: editingLocation.city_id ?? "",
        delivery_fee: editingLocation.delivery_fee ?? "",
        is_active: editingLocation.is_active ?? true,
      });
    } else {
      setForm(blankForm);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editingLocation]);

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      setError("Location name is required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        name: form.name.trim(),
        city_id: form.city_id || undefined,
        delivery_fee:
          form.delivery_fee === "" ? null : Number(form.delivery_fee),
        is_active: form.is_active,
      };

      if (isEdit) {
        const { data } = await api.put(
          `/admin/zones/${editingLocation.id}`,
          payload,
        );
        onSuccess({ type: "edit", data });
      } else {
        console.log("the payload: ", payload);
        const { data } = await api.post("/admin/zones", payload);
        onSuccess({ type: "add", data });
      }
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to save location. Please try again.",
      );
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
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <FiMapPin className="w-4 h-4 text-orange-500" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">
              {isEdit ? "Edit Location" : "Add Delivery Location"}
            </h2>
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
              Location Name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Nnamdi Azikiwe University (NAU)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Delivery Fee (₦)
            </label>
            <input
              type="number"
              min={0}
              value={form.delivery_fee}
              onChange={(e) =>
                setForm({ ...form, delivery_fee: e.target.value })
              }
              placeholder="e.g. 500"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
            />
          </div>

          {/* Availability toggle */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
            <div>
              <p className="text-sm font-semibold text-gray-700">
                Available for delivery
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Customers can select this location at checkout
              </p>
            </div>
            <button
              type="button"
              onClick={() => setForm({ ...form, is_active: !form.is_active })}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
                form.is_active ? "bg-orange-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                  form.is_active ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
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
                {isEdit ? "Save Changes" : "Add Location"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Skeleton Card ────────────────────────────────────────────────────────────

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
    <div className="p-5 border-b border-gray-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-100 rounded-xl" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-100 rounded-lg w-3/4" />
          <div className="h-3 bg-gray-100 rounded-lg w-1/2" />
        </div>
      </div>
    </div>
    <div className="p-5 space-y-3">
      <div className="h-3 bg-gray-100 rounded-lg w-full" />
      <div className="h-3 bg-gray-100 rounded-lg w-2/3" />
    </div>
    <div className="p-4 bg-gray-50 border-t border-gray-100">
      <div className="h-9 bg-gray-100 rounded-xl" />
    </div>
  </div>
);

// ── Main Page ────────────────────────────────────────────────────────────────

const DeliveryLocationManagement = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [search, setSearch] = useState("");
  const [filterTab, setFilterTab] = useState("all");
  const [togglingId, setTogglingId] = useState(null);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ── Fetch locations from API ─────────────────────────────────────────────
  const fetchLocations = useCallback(async () => {
    setLoading(true);
    setFetchError("");
    try {
      const { data } = await api.get("/zones");
      console.log("Here we go: ", data);
      setLocations(data);
    } catch (err) {
      setFetchError(
        err.response?.data?.message || "Failed to load delivery locations.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  // ── Toggle is_active ─────────────────────────────────────────────────────
  const toggleAvailability = async (location) => {
    console.log("ID over here: ", location.id);

    setTogglingId(location.id);
    try {
      const { data } = await api.patch(`/admin/zones/${location.id}/toggle`, {
        is_active: !location.is_active,
      });
      console.log("the data returned: ", data);
      // setLocations((prev) => prev.map((l) => (l.id === data.id ? data : l)));
    } catch {
      // Silently ignore – no optimistic update was made so state is still correct
    } finally {
      setTogglingId(null);
    }
  };

  const openAdd = () => {
    setEditingLocation(null);
    setModalOpen(true);
  };

  const openEdit = (location) => {
    setEditingLocation(location);
    setModalOpen(true);
  };

  const handleModalSuccess = ({ type, data }) => {
    if (type === "add") {
      setLocations((prev) => [...prev, data]);
    } else if (type === "edit") {
      setLocations((prev) => prev.map((l) => (l.id === data.id ? data : l)));
    }
  };

  // ── Filtering ────────────────────────────────────────────────────────────
  const filtered = locations
    .filter((l) => {
      if (filterTab === "available") return l.is_active;
      if (filterTab === "unavailable") return !l.is_active;
      return true;
    })
    .filter((l) => {
      const q = search.toLowerCase();
      return (
        l.name?.toLowerCase().includes(q) ||
        l.city?.name?.toLowerCase().includes(q)
      );
    });

  const stats = {
    total: locations.length,
    available: locations.filter((l) => l.is_active).length,
    unavailable: locations.filter((l) => !l.is_active).length,
  };

  return (
    <>
      <LocationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleModalSuccess}
        editingLocation={editingLocation}
      />
      <DashboardLayout>
        <div className="p-6 space-y-6 bg-gray-50/50 min-h-full">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Delivery Locations
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage delivery zones and their availability
              </p>
            </div>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors shadow-sm shadow-orange-200 self-start sm:self-auto"
            >
              <FiPlus className="w-4 h-4" />
              Add Location
            </button>
          </div>

          {/* Filter Tabs + Search */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="bg-white p-1.5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-1 overflow-x-auto flex-shrink-0 w-full">
              {[
                { key: "all", label: `All (${stats.total})` },
                { key: "available", label: `Available (${stats.available})` },
                {
                  key: "unavailable",
                  label: `Unavailable (${stats.unavailable})`,
                },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilterTab(tab.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    filterTab === tab.key
                      ? "bg-gray-200 text-gray-900 font-semibold shadow-sm"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Error state */}
          {fetchError && !loading && (
            <div className="flex items-center justify-between gap-4 px-5 py-4 bg-red-50 border border-red-100 rounded-2xl">
              <div className="flex items-center gap-3 text-red-600 text-sm">
                <FiAlertTriangle className="w-4 h-4 flex-shrink-0" />
                {fetchError}
              </div>
              <button
                onClick={fetchLocations}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-red-100 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
              >
                <FiRefreshCw className="w-3.5 h-3.5" />
                Retry
              </button>
            </div>
          )}

          {/* Location Cards */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FiMapPin className="w-7 h-7 text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">No locations found</p>
              <p className="text-sm text-gray-400 mt-1">
                {search
                  ? "Try a different search term"
                  : "Add your first delivery location to get started"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((location) => (
                <div
                  key={location.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col"
                >
                  {/* Card Header */}
                  <div className="p-5 border-b border-gray-50">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            location.is_active ? "bg-orange-100" : "bg-gray-100"
                          }`}
                        >
                          <FiMapPin
                            className={`w-5 h-5 ${
                              location.is_active
                                ? "text-orange-500"
                                : "text-gray-400"
                            }`}
                          />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-gray-900 text-base leading-tight truncate">
                            {location.name}
                          </h3>
                          {location.city && (
                            <p className="text-sm text-gray-500 mt-0.5 truncate">
                              {location.city.name}
                            </p>
                          )}
                        </div>
                      </div>
                      <span
                        className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          location.is_active
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {location.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 space-y-3">
                    {location.delivery_fee !== null &&
                      location.delivery_fee !== undefined &&
                      location.delivery_fee !== "" && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Delivery fee</span>
                          <span className="font-semibold text-gray-800">
                            ₦{Number(location.delivery_fee).toLocaleString()}
                          </span>
                        </div>
                      )}

                    {/* Availability Toggle */}
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        Availability
                      </span>
                      <button
                        onClick={() => toggleAvailability(location)}
                        disabled={togglingId === location.id}
                        title={
                          location.is_active
                            ? "Click to disable"
                            : "Click to enable"
                        }
                        className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-60 ${
                          location.is_active ? "bg-orange-500" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                            location.is_active
                              ? "translate-x-5"
                              : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center gap-2">
                    <button
                      onClick={() => openEdit(location)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors shadow-sm"
                    >
                      <FiEdit2 className="w-4 h-4" />
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
};

export default DeliveryLocationManagement;
