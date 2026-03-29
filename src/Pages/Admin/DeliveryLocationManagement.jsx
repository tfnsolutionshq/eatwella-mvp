import { useState } from "react";
import DashboardLayout from "../../DashboardLayout/DashboardLayout";
import {
  FiMapPin,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiCheck,
  FiAlertTriangle,
} from "react-icons/fi";

// ── Dummy Data ───────────────────────────────────────────────────────────────

const DUMMY_LOCATIONS = [
  {
    id: 1,
    name: "Awka Central",
    state: "Anambra",
    city: "Awka",
    delivery_fee: 500,
    estimated_time: "20–30 mins",
    is_available: true,
  },
  {
    id: 2,
    name: "Onitsha Main Market Area",
    state: "Anambra",
    city: "Onitsha",
    delivery_fee: 800,
    estimated_time: "35–50 mins",
    is_available: true,
  },
  {
    id: 3,
    name: "Nnewi Tech Hub Zone",
    state: "Anambra",
    city: "Nnewi",
    delivery_fee: 1000,
    estimated_time: "45–60 mins",
    is_available: false,
  },
  {
    id: 4,
    name: "Enugu GRA",
    state: "Enugu",
    city: "Enugu",
    delivery_fee: 1200,
    estimated_time: "50–70 mins",
    is_available: true,
  },
  {
    id: 5,
    name: "Asaba Okpanam Road",
    state: "Delta",
    city: "Asaba",
    delivery_fee: 1500,
    estimated_time: "60–80 mins",
    is_available: true,
  },
  {
    id: 6,
    name: "Agbor Express Zone",
    state: "Delta",
    city: "Agbor",
    delivery_fee: 1800,
    estimated_time: "75–90 mins",
    is_available: false,
  },
];

let nextId = DUMMY_LOCATIONS.length + 1;

// ── Modal ────────────────────────────────────────────────────────────────────

const LocationModal = ({ isOpen, onClose, onSuccess, editingLocation }) => {
  const isEdit = !!editingLocation;
  const [form, setForm] = useState({
    name: "",
    state: "",
    city: "",
    delivery_fee: "",
    estimated_time: "",
    is_available: true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Reset form when modal opens
  const prevOpen = isOpen;
  if (isOpen && !prevOpen) {
    // handled via key trick below
  }

  const resetForm = () => {
    setError("");
    if (isEdit) {
      setForm({
        name: editingLocation.name || "",
        state: editingLocation.state || "",
        city: editingLocation.city || "",
        delivery_fee: editingLocation.delivery_fee ?? "",
        estimated_time: editingLocation.estimated_time || "",
        is_available: editingLocation.is_available ?? true,
      });
    } else {
      setForm({
        name: "",
        state: "",
        city: "",
        delivery_fee: "",
        estimated_time: "",
        is_available: true,
      });
    }
  };

  // Use a flag to initialise form once on open
  const [lastOpenState, setLastOpenState] = useState(false);
  if (isOpen !== lastOpenState) {
    setLastOpenState(isOpen);
    if (isOpen) {
      setTimeout(resetForm, 0);
    }
  }

  const handleSubmit = () => {
    if (!form.name.trim() || !form.state.trim() || !form.city.trim()) {
      setError("Name, state, and city are required.");
      return;
    }
    setSaving(true);
    setError("");

    // Simulate async save
    setTimeout(() => {
      const payload = {
        ...form,
        delivery_fee:
          form.delivery_fee === "" ? null : Number(form.delivery_fee),
      };
      if (isEdit) {
        onSuccess({ type: "edit", data: { ...editingLocation, ...payload } });
      } else {
        onSuccess({ type: "add", data: { id: nextId++, ...payload } });
      }
      setSaving(false);
      onClose();
    }, 400);
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

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Location Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Onitsha Main Market Area"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                State *
              </label>
              <input
                type="text"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                placeholder="e.g. Anambra"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                City *
              </label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="e.g. Onitsha"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
              />
            </div>

            <div className="col-span-2">
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
              onClick={() =>
                setForm({ ...form, is_available: !form.is_available })
              }
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
                form.is_available ? "bg-orange-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                  form.is_available ? "translate-x-5" : "translate-x-0"
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

// ── Delete Confirm Modal ─────────────────────────────────────────────────────

const DeleteModal = ({ location, onClose, onSuccess }) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = () => {
    setDeleting(true);
    setTimeout(() => {
      onSuccess(location.id);
      setDeleting(false);
      onClose();
    }, 400);
  };

  if (!location) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 text-center">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiTrash2 className="w-6 h-6 text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            Delete Location?
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            <span className="font-semibold text-gray-700">{location.name}</span>{" "}
            will be permanently removed. This cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-60 transition-colors"
            >
              {deleting ? "Deleting…" : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Main Page ────────────────────────────────────────────────────────────────

const DeliveryLocationManagement = () => {
  const [locations, setLocations] = useState(DUMMY_LOCATIONS);
  const [search, setSearch] = useState("");
  const [filterTab, setFilterTab] = useState("all");
  const [togglingId, setTogglingId] = useState(null);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const toggleAvailability = (location) => {
    setTogglingId(location.id);
    setTimeout(() => {
      setLocations((prev) =>
        prev.map((l) =>
          l.id === location.id ? { ...l, is_available: !l.is_available } : l,
        ),
      );
      setTogglingId(null);
    }, 300);
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

  const handleDeleteSuccess = (id) => {
    setLocations((prev) => prev.filter((l) => l.id !== id));
  };

  const filtered = locations
    .filter((l) => {
      if (filterTab === "available") return l.is_available;
      if (filterTab === "unavailable") return !l.is_available;
      return true;
    })
    .filter((l) => {
      const q = search.toLowerCase();
      return (
        l.name?.toLowerCase().includes(q) ||
        l.city?.toLowerCase().includes(q) ||
        l.state?.toLowerCase().includes(q)
      );
    });

  const stats = {
    total: locations.length,
    available: locations.filter((l) => l.is_available).length,
    unavailable: locations.filter((l) => !l.is_available).length,
  };

  return (
    <>
      <LocationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleModalSuccess}
        editingLocation={editingLocation}
      />
      <DeleteModal
        location={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onSuccess={handleDeleteSuccess}
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

          {/* Filter Tabsm */}

          <div className="bg-white p-1.5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-1 overflow-x-auto">
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

          {/* Location Cards */}
          {filtered.length === 0 ? (
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
                          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${location.is_available ? "bg-orange-100" : "bg-gray-100"}`}
                        >
                          <FiMapPin
                            className={`w-5 h-5 ${location.is_available ? "text-orange-500" : "text-gray-400"}`}
                          />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-gray-900 text-base leading-tight truncate">
                            {location.name}
                          </h3>
                          <p className="text-sm text-gray-500 mt-0.5 truncate">
                            {location.city}, {location.state}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold ${location.is_available ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}
                      >
                        {location.is_available ? "Available" : "Unavailable"}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 space-y-3">
                    {location.delivery_fee !== undefined &&
                      location.delivery_fee !== null &&
                      location.delivery_fee !== "" && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Delivery fee</span>
                          <span className="font-semibold text-gray-800">
                            ₦{Number(location.delivery_fee).toLocaleString()}
                          </span>
                        </div>
                      )}

                    {location.estimated_time && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">
                          Est. delivery time
                        </span>
                        <span className="font-semibold text-gray-800">
                          {location.estimated_time}
                        </span>
                      </div>
                    )}

                    {/* Toggle Row */}
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        Availability
                      </span>
                      <button
                        onClick={() => toggleAvailability(location)}
                        disabled={togglingId === location.id}
                        title={
                          location.is_available
                            ? "Click to disable"
                            : "Click to enable"
                        }
                        className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
                          location.is_available
                            ? "bg-orange-500"
                            : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                            location.is_available
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
                    <button
                      onClick={() => setDeleteTarget(location)}
                      className="flex items-center justify-center w-10 h-10 bg-white border border-gray-200 rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-colors shadow-sm"
                    >
                      <FiTrash2 className="w-4 h-4" />
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
