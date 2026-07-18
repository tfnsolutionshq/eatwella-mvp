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
  FiToggleLeft,
  FiToggleRight,
  FiHome,
  FiUserCheck,
  FiTruck,
  FiMap,
  FiLoader,
} from "react-icons/fi";
import api from "../../utils/api";
import { useToast } from "../../context/ToastContext";
import { useGeolocation } from "../../hooks/useGeolocation";

// ─────────────────────────────────────────────────────────────────────────────
// DEV TOGGLES — for outlets
// ─────────────────────────────────────────────────────────────────────────────
const USING_DUMMY_OUTLETS = false;

const DUMMY_OUTLETS = [
  {
    id: 1,
    name: "Eatwella — NAU Branch",
    city_id: 1,
    address: "Nnamdi Azikiwe University Main Gate, Awka",
    phone: "08011111111",
    is_active: true,
  },
  {
    id: 2,
    name: "Eatwella — Awka Town",
    city_id: 1,
    address: "15 Zik Avenue, Awka",
    phone: "08022222222",
    is_active: true,
  },
  {
    id: 3,
    name: "Eatwella — Onitsha",
    city_id: 2,
    address: "Bridge Head Market Road, Onitsha",
    phone: "08033333333",
    is_active: false,
  },
  {
    id: 4,
    name: "Eatwella — Ikeja",
    city_id: 3,
    address: "Allen Avenue, Ikeja, Lagos",
    phone: "08044444444",
    is_active: true,
  },
];

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
      <div className="relative flex flex-col justify-between w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-auto h-[600px]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <Icon className="w-4 h-4 text-orange-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">{title}</h2>
              {subtitle && (
                <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
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
        <div className="px-6 py-5 space-y-4 h-full overflow-y-auto">
          {children}
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
          {footer}
        </div>
      </div>
    </div>
  );
};

// ── Shared helpers ────────────────────────────────────────────────────────────
const ErrorBanner = ({ message, retryFunction }) =>
  message ? (
    <div className="flex justify-between items-center gap-2 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
      <div className="flex items-center">
      <FiAlertTriangle className="w-4 h-4 flex-shrink-0 mr-2" />
      {message}
      </div>
      <button onClick={retryFunction} className="bg-red-600 rounded-lg text-white py-2 px-3">Retry</button>
    </div>
  ) : null;

const SpinnerBtn = ({
  saving,
  savingLabel,
  defaultLabel,
  onClick,
  disabled,
  icon: Icon = FiCheck,
  variant = "primary",
}) => {
  const base =
    "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm";
  const styles =
    variant === "danger"
      ? `${base} bg-red-500 text-white hover:bg-red-600 shadow-red-200`
      : `${base} bg-orange-500 text-white hover:bg-orange-600 shadow-orange-200`;
  return (
    <button onClick={onClick} disabled={saving || disabled} className={styles}>
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
};

const CancelBtn = ({ onClose }) => (
  <button
    onClick={onClose}
    className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
  >
    Cancel
  </button>
);

// ── Outlet Modal ──────────────────────────────────────────────────────────────
const OutletModal = ({ isOpen, onClose, onSuccess, editingItem, cities }) => {
  const isEdit = !!editingItem;
  const [form, setForm] = useState({
    name: "",
    city_id: "",
    address: "",
    phone: "",
    longitude: null,
    latitude: null,
    is_active: true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const {
    getLocation,
    loadingLocation,
    error: locationError,
  } = useGeolocation();

  const handleAutoFill = () => {
    getLocation(({ latitude, longitude }) => {
      setForm((prev) => ({
        ...prev,
        longitude: parseFloat(longitude.toFixed(4)),
        latitude: parseFloat(latitude.toFixed(4)),
      }));
    });
  };

  useEffect(() => {
    if (!isOpen) return;
    setError("");
    setForm(
      isEdit
        ? {
            name: editingItem.name ?? "",
            city_id: editingItem.city_id ?? "",
            address: editingItem.address ?? "",
            phone: editingItem.phone ?? "",
            longitude: editingItem.longitude ?? null,
            latitude: editingItem.latitude ?? null,
          }
        : {
            name: "",
            city_id: cities[0]?.id ?? "",
            address: "",
            phone: "",
            longitude: null,
            latitude: null,
          },
    );
  }, [isOpen, editingItem, cities]);

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      setError("Outlet name is required.");
      return;
    }
    if (!form.city_id) {
      setError("Please select a city.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        name: form.name.trim(),
        city_id: Number(form.city_id),
        address: form.address.trim() || undefined,
        phone: form.phone.trim() || undefined,
        longitude: form.longitude || null,
        latitude: form.latitude || null,
      };
      if (isEdit) {
        const { data } = await api.put(
          `/admin/outlets/${editingItem.id}`,
          payload,
        );
        onSuccess({ type: "edit", data });
      } else {
        const { data } = await api.post("/admin/outlets", payload);
        onSuccess({ type: "add", data });
      }
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to save outlet. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      icon={FiHome}
      title={isEdit ? "Edit Outlet" : "Add Outlet"}
      subtitle={isEdit ? editingItem?.name : "Add a new restaurant outlet"}
      footer={
        <>
          <CancelBtn onClose={onClose} />
          <SpinnerBtn
            saving={saving}
            savingLabel="Saving…"
            defaultLabel={isEdit ? "Save Changes" : "Add Outlet"}
            onClick={handleSubmit}
          />
        </>
      }
    >
      <ErrorBanner message={error} />
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
          Outlet Name *
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="e.g. Eatwella NAU Branch"
          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
          autoFocus
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
          City *
        </label>
        <select
          value={form.city_id}
          onChange={(e) => setForm({ ...form, city_id: e.target.value })}
          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition bg-white"
        >
          <option value="">Select a city…</option>
          {cities.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
          Address
        </label>
        <input
          type="text"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          placeholder="e.g. 12 University Road, Awka"
          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
          Phone
        </label>
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="e.g. 08012345678"
          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
          Longitude
        </label>
        <input
          type="number"
          value={form.longitude ?? ""}
          onChange={(e) => setForm({ ...form, longitude: e.target.value })}
          placeholder="e.g. 3.3792"
          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
          min={-180}
          max={180}
          step="any"
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
          Latitude
        </label>
        <input
          type="number"
          value={form.latitude ?? ""}
          onChange={(e) => setForm({ ...form, latitude: e.target.value })}
          placeholder="e.g. 6.5244"
          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
          min={-90}
          max={90}
          step="any"
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
      </div>
      <button
        className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors shadow-sm shadow-orange-200 disabled:opacity-30 disabled:cursor-not-allowed"
        disabled={loadingLocation}
        onClick={handleAutoFill}
      >
        {loadingLocation ? <FiLoader className="animate-spin" /> : <FiMapPin />}{" "}
        {loadingLocation ? "Detecting location..." : "Use Current Location"}
      </button>
      {error && <p className="text-red-500 text-sm">{locationError}</p>}
    </ModalShell>
  );
};

// ── Assign Supervisor Modal ───────────────────────────────────────────────────
const AssignSupervisorModal = ({ isOpen, onClose, outlet, onAssigned }) => {
  const { showToast } = useToast();
  const [supervisors, setSupervisors] = useState([]);
  const [loadingSupervisors, setLoadingSupervisors] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [initialAssignedIds, setInitialAssignedIds] = useState([]);
  const [saving, setSaving] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    from: 0,
    to: 0,
    per_page: 15,
  });

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch supervisors assigned to this outlet and record their IDs
  const fetchAssignedSupervisors = useCallback(async () => {
    if (!outlet?.id) return;
    try {
      const { data } = await api.get(
        `/admin/outlets/${outlet.id}/users`,
        { params: { role: "supervisor" } },
      );
      const assignedList = Array.isArray(data) ? data : (data.data ?? []);
      const assignedIds = assignedList.map((sup) => sup.id);
      setInitialAssignedIds(assignedIds);
      setSelectedIds(assignedIds);
    } catch (_) {
      // non-fatal — assigned state just won't be pre-highlighted
    }
  }, [outlet?.id]);

  // Fetch all supervisors (paginated) for the picker list
  const fetchSupervisors = useCallback(
    async (pageNum, search = "") => {
      setLoadingSupervisors(true);
      setFetchError("");
      try {
        const { data } = await api.get("/admin/users", {
          params: { role: "supervisor", page: pageNum, search },
        });
        const supervisorList = Array.isArray(data?.data) ? data.data : [];
        setSupervisors(supervisorList);
        setPagination({
          current_page: data?.current_page ?? pageNum,
          last_page: data?.last_page ?? 1,
          total: data?.total ?? supervisorList.length,
          from: data?.from ?? 1,
          to: data?.to ?? supervisorList.length,
          per_page: data?.per_page ?? 15,
        });
      } catch (err) {
        setFetchError(
          err.response?.data?.message || "Failed to load supervisors.",
        );
      } finally {
        setLoadingSupervisors(false);
      }
    },
    [],
  );

  // Reset and load both lists whenever the modal opens
  useEffect(() => {
    if (!isOpen) return;
    setSelectedIds([]);
    setInitialAssignedIds([]);
    setPage(1);
    setSearchQuery("");
    setDebouncedSearchQuery("");
    fetchAssignedSupervisors();
    fetchSupervisors(1, "");
  }, [isOpen, fetchAssignedSupervisors, fetchSupervisors]);

  // Reload picker when search changes
  useEffect(() => {
    if (!isOpen) return;
    setPage(1);
    fetchSupervisors(1, debouncedSearchQuery);
  }, [debouncedSearchQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reload picker when page changes
  useEffect(() => {
    if (!isOpen) return;
    fetchSupervisors(page, debouncedSearchQuery);
  }, [page, debouncedSearchQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleSelect = (id, isAlreadyAssigned) => {
    // Already-assigned supervisors can only be removed via the remove button
    if (isAlreadyAssigned) return;
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleRemove = async (sup) => {
    setRemovingId(sup.id);
    try {
      await api.delete(`/admin/outlets/${outlet.id}/remove-user/${sup.id}`, {
        data: { city_ids: [1] },
      });
      showToast(`${sup.name} removed from ${outlet.name}.`, "success");
      // Optimistically remove from local state, then re-sync both lists
      setSelectedIds((prev) => prev.filter((x) => x !== sup.id));
      setInitialAssignedIds((prev) => prev.filter((x) => x !== sup.id));
      fetchAssignedSupervisors();
      fetchSupervisors(page, debouncedSearchQuery);
      onAssigned?.();
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to remove supervisor.",
        "error",
      );
    } finally {
      setRemovingId(null);
    }
  };

  const handleConfirm = async () => {
    const newlySelectedIds = selectedIds.filter(
      (id) => !initialAssignedIds.includes(id),
    );
    if (newlySelectedIds.length === 0) return;
    setSaving(true);
    try {
      await api.post(`/admin/outlets/${outlet.id}/assign-supervisor`, {
        user_ids: newlySelectedIds,
      });
      showToast(
        `${newlySelectedIds.length} supervisor${newlySelectedIds.length > 1 ? "s" : ""} assigned to ${outlet.name}.`,
        "success",
      );
      onAssigned?.();
      onClose();
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to assign supervisors.",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  const getVisiblePageNumbers = () => {
    const totalPages = pagination.last_page;
    const current = pagination.current_page;
    if (totalPages <= 1) return [];
    if (totalPages <= 7)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    let start = Math.max(1, current - 2);
    let end = Math.min(totalPages, current + 2);
    if (current <= 3) end = Math.min(7, totalPages);
    else if (current >= totalPages - 2) start = totalPages - 6;
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  // IDs selected by the admin that weren't already assigned before the modal opened
  const newlySelectedIds = selectedIds.filter(
    (id) => !initialAssignedIds.includes(id),
  );

  // True when every supervisor in the picker is already assigned to this outlet
  // AND the admin hasn't added any new selections.
  const allAlreadyAssigned =
    !loadingSupervisors &&
    supervisors.length > 0 &&
    supervisors.every((sup) => initialAssignedIds.includes(sup.id)) &&
    newlySelectedIds.length === 0;

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      icon={FiHome}
      title="Assign Supervisors"
      subtitle={outlet?.name}
      footer={
        <>
          <CancelBtn onClose={onClose} />
          <SpinnerBtn
            saving={saving}
            savingLabel="Assigning…"
            defaultLabel={
              allAlreadyAssigned
                ? "All Supervisors Assigned"
                : newlySelectedIds.length > 0
                  ? `Assign ${newlySelectedIds.length} Supervisor${newlySelectedIds.length > 1 ? "s" : ""}`
                  : "Assign"
            }
            onClick={handleConfirm}
            disabled={allAlreadyAssigned || newlySelectedIds.length === 0}
          />
        </>
      }
    >
      {/* Search input */}
      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search supervisors..."
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
        />
      </div>

      {/* Selected count badge — only counts newly selected, not pre-assigned */}
      {newlySelectedIds.length > 0 && (
        <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 border border-orange-100 rounded-xl text-sm text-orange-700 font-medium">
          <FiCheck className="w-4 h-4" />
          {newlySelectedIds.length} supervisor
          {newlySelectedIds.length > 1 ? "s" : ""} selected to assign
        </div>
      )}

      <ErrorBanner message={fetchError} retryFunction={fetchSupervisors} />

      {/* Supervisor list */}
      {loadingSupervisors ? (
        <div className="flex items-center justify-center py-10 h-full">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
        </div>
      ) : supervisors.length === 0 ? (
        <div className="text-center py-8 text-gray-400 text-sm">
          No supervisors found on this page.
        </div>
      ) : (
        <div className="space-y-2 pr-1">
          {supervisors.map((sup) => {
            const selected = selectedIds.includes(sup.id);
            const alreadyAssigned = initialAssignedIds.includes(sup.id);
            const isRemoving = removingId === sup.id;
            return (
              <div
                key={sup.id}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors ${
                  selected
                    ? "bg-orange-50 border-orange-300"
                    : "bg-white border-gray-200"
                }`}
              >
                {/* Clickable left section — only selectable for unassigned supervisors */}
                <button
                  type="button"
                  disabled={alreadyAssigned}
                  onClick={() => toggleSelect(sup.id, alreadyAssigned)}
                  className="flex items-center gap-3 flex-1 min-w-0 text-left disabled:cursor-default"
                >
                  {/* Avatar */}
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold ${
                      selected
                        ? "bg-orange-500 text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {sup.name?.charAt(0).toUpperCase() ?? "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p
                        className={`text-sm font-semibold truncate ${selected ? "text-orange-700" : "text-gray-800"}`}
                      >
                        {sup.name}
                      </p>
                      {alreadyAssigned && (
                        <span className="flex-shrink-0 px-2 py-0.5 bg-green-100 text-green-600 text-xs font-semibold rounded-full">
                          Assigned
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 truncate">
                      {sup.email}
                    </p>
                  </div>
                  {/* Checkbox — only shown for unassigned supervisors */}
                  {!alreadyAssigned && (
                    <div
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        selected
                          ? "bg-orange-500 border-orange-500"
                          : "border-gray-300"
                      }`}
                    >
                      {selected && <FiCheck className="w-3 h-3 text-white" />}
                    </div>
                  )}
                </button>

                {/* Remove button — only for already-assigned supervisors */}
                {alreadyAssigned && (
                  <button
                    type="button"
                    onClick={() => handleRemove(sup)}
                    disabled={isRemoving}
                    title="Remove from outlet"
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-white border border-red-100 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isRemoving ? (
                      <span className="w-3.5 h-3.5 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                    ) : (
                      <FiTrash2 className="w-3.5 h-3.5" />
                    )}
                    {isRemoving ? "Removing…" : "Remove"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination.last_page > 1 && (
        <div className="border-t border-gray-100 pt-3 space-y-2">
          <p className="text-xs text-gray-400 text-center">
            Showing page {pagination.current_page} of {pagination.last_page}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            <button
              disabled={pagination.current_page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Prev
            </button>
            {getVisiblePageNumbers().map((num) => (
              <button
                key={num}
                onClick={() => setPage(num)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  pagination.current_page === num
                    ? "bg-orange-500 text-white border-orange-500"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {num}
              </button>
            ))}
            <button
              disabled={pagination.current_page === pagination.last_page}
              onClick={() =>
                setPage((p) => Math.min(pagination.last_page, p + 1))
              }
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </ModalShell>
  );
};

// ── Assign Delivery Agent Modal ───────────────────────────────────────────────────
const AssignDeliveryAgentModal = ({ isOpen, onClose, outlet, onAssigned }) => {
  const { showToast } = useToast();
  const [deliveryAgents, setDeliveryAgents] = useState([]);
  const [loadingDeliveryAgents, setLoadingDeliveryAgents] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [initialAssignedIds, setInitialAssignedIds] = useState([]);
  const [saving, setSaving] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    from: 0,
    to: 0,
    per_page: 15,
  });

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch delivery agents assigned to this outlet and record their IDs
  const fetchAssignedDeliveryAgents = useCallback(async () => {
    if (!outlet?.id) return;
    try {
      const { data } = await api.get(
        `/admin/outlets/${outlet.id}/users`,
        { params: { role: "delivery_agent" } },
      );
      const assignedList = Array.isArray(data) ? data : (data.data ?? []);
      const assignedIds = assignedList.map((agent) => agent.id);
      setInitialAssignedIds(assignedIds);
      setSelectedIds(assignedIds);
    } catch (_) {
      // non-fatal
    }
  }, [outlet?.id]);

  // Fetch all delivery agents (paginated) for the picker list
  const fetchDeliveryAgents = useCallback(
    async (pageNum, search = "") => {
      setLoadingDeliveryAgents(true);
      setFetchError("");
      try {
        const { data } = await api.get("/admin/users", {
          params: { role: "delivery_agent", page: pageNum, search },
        });
        const deliveryAgentList = Array.isArray(data?.data) ? data.data : [];
        setDeliveryAgents(deliveryAgentList);
        setPagination({
          current_page: data?.current_page ?? pageNum,
          last_page: data?.last_page ?? 1,
          total: data?.total ?? deliveryAgentList.length,
          from: data?.from ?? 1,
          to: data?.to ?? deliveryAgentList.length,
          per_page: data?.per_page ?? 15,
        });
      } catch (err) {
        setFetchError(
          err.response?.data?.message || "Failed to load delivery agents.",
        );
      } finally {
        setLoadingDeliveryAgents(false);
      }
    },
    [],
  );

  // Reset and load both lists whenever the modal opens
  useEffect(() => {
    if (!isOpen) return;
    setSelectedIds([]);
    setInitialAssignedIds([]);
    setPage(1);
    setSearchQuery("");
    setDebouncedSearchQuery("");
    fetchAssignedDeliveryAgents();
    fetchDeliveryAgents(1, "");
  }, [isOpen, fetchAssignedDeliveryAgents, fetchDeliveryAgents]);

  // Reload picker when search changes
  useEffect(() => {
    if (!isOpen) return;
    setPage(1);
    fetchDeliveryAgents(1, debouncedSearchQuery);
  }, [debouncedSearchQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reload picker when page changes
  useEffect(() => {
    if (!isOpen) return;
    fetchDeliveryAgents(page, debouncedSearchQuery);
  }, [page, debouncedSearchQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleSelect = (id, isAlreadyAssigned) => {
    // Already-assigned delivery agents can only be removed via the remove button
    if (isAlreadyAssigned) return;
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleRemove = async (agent) => {
    setRemovingId(agent.id);
    try {
      await api.delete(`/admin/outlets/${outlet.id}/remove-user/${agent.id}`, {
        data: { city_ids: [1] },
      });
      showToast(`${agent.name} removed from ${outlet.name}.`, "success");
      // Optimistically remove from local state, then re-sync both lists
      setSelectedIds((prev) => prev.filter((x) => x !== agent.id));
      setInitialAssignedIds((prev) => prev.filter((x) => x !== agent.id));
      fetchAssignedDeliveryAgents();
      fetchDeliveryAgents(page, debouncedSearchQuery);
      onAssigned?.();
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to remove delivery agent.",
        "error",
      );
    } finally {
      setRemovingId(null);
    }
  };

  const handleConfirm = async () => {
    const newlySelectedIds = selectedIds.filter(
      (id) => !initialAssignedIds.includes(id),
    );
    if (newlySelectedIds.length === 0) return;
    setSaving(true);
    try {
      await api.post(`/admin/outlets/${outlet.id}/assign-delivery-agent`, {
        user_ids: newlySelectedIds,
      });
      showToast(
        `${newlySelectedIds.length} delivery agent${newlySelectedIds.length > 1 ? "s" : ""} assigned to ${outlet.name}.`,
        "success",
      );
      onAssigned?.();
      onClose();
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to assign delivery agents.",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  const getVisiblePageNumbers = () => {
    const totalPages = pagination.last_page;
    const current = pagination.current_page;
    if (totalPages <= 1) return [];
    if (totalPages <= 7)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    let start = Math.max(1, current - 2);
    let end = Math.min(totalPages, current + 2);
    if (current <= 3) end = Math.min(7, totalPages);
    else if (current >= totalPages - 2) start = totalPages - 6;
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  // IDs selected by the admin that weren't already assigned before the modal opened
  const newlySelectedIds = selectedIds.filter(
    (id) => !initialAssignedIds.includes(id),
  );

  // True when every delivery agent in the picker is already assigned to this outlet
  // AND the admin hasn't added any new selections.
  const allAlreadyAssigned =
    !loadingDeliveryAgents &&
    deliveryAgents.length > 0 &&
    deliveryAgents.every((agent) => initialAssignedIds.includes(agent.id)) &&
    newlySelectedIds.length === 0;

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      icon={FiTruck}
      title="Assign Delivery Agents"
      subtitle={outlet?.name}
      footer={
        <>
          <CancelBtn onClose={onClose} />
          <SpinnerBtn
            saving={saving}
            savingLabel="Assigning…"
            defaultLabel={
              allAlreadyAssigned
                ? "All Delivery Agents Assigned"
                : newlySelectedIds.length > 0
                  ? `Assign ${newlySelectedIds.length} Delivery Agent${newlySelectedIds.length > 1 ? "s" : ""}`
                  : "Assign"
            }
            onClick={handleConfirm}
            disabled={allAlreadyAssigned || newlySelectedIds.length === 0}
          />
        </>
      }
    >
      {/* Search input */}
      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search delivery agents..."
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
        />
      </div>

      {/* Selected count badge — only counts newly selected, not pre-assigned */}
      {newlySelectedIds.length > 0 && (
        <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 border border-orange-100 rounded-xl text-sm text-orange-700 font-medium">
          <FiCheck className="w-4 h-4" />
          {newlySelectedIds.length} delivery agent
          {newlySelectedIds.length > 1 ? "s" : ""} selected to assign
        </div>
      )}

      <ErrorBanner message={fetchError} />

      {/* Delivery agent list */}
      {loadingDeliveryAgents ? (
        <div className="flex items-center justify-center py-10 h-full">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
        </div>
      ) : deliveryAgents.length === 0 ? (
        <div className="text-center py-8 text-gray-400 text-sm">
          No delivery agents found on this page.
        </div>
      ) : (
        <div className="space-y-2 pr-1">
          {deliveryAgents.map((agent) => {
            const selected = selectedIds.includes(agent.id);
            const alreadyAssigned = initialAssignedIds.includes(agent.id);
            const isRemoving = removingId === agent.id;
            return (
              <div
                key={agent.id}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors ${
                  selected
                    ? "bg-orange-50 border-orange-300"
                    : "bg-white border-gray-200"
                }`}
              >
                {/* Clickable left section — only selectable for unassigned delivery agents */}
                <button
                  type="button"
                  disabled={alreadyAssigned}
                  onClick={() => toggleSelect(agent.id, alreadyAssigned)}
                  className="flex items-center gap-3 flex-1 min-w-0 text-left disabled:cursor-default"
                >
                  {/* Avatar */}
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold ${
                      selected
                        ? "bg-orange-500 text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {agent.name?.charAt(0).toUpperCase() ?? "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p
                        className={`text-sm font-semibold truncate ${selected ? "text-orange-700" : "text-gray-800"}`}
                      >
                        {agent.name}
                      </p>
                      {alreadyAssigned && (
                        <span className="flex-shrink-0 px-2 py-0.5 bg-green-100 text-green-600 text-xs font-semibold rounded-full">
                          Assigned
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 truncate">
                      {agent.email}
                    </p>
                  </div>
                  {/* Checkbox — only shown for unassigned delivery agents */}
                  {!alreadyAssigned && (
                    <div
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        selected
                          ? "bg-orange-500 border-orange-500"
                          : "border-gray-300"
                      }`}
                    >
                      {selected && <FiCheck className="w-3 h-3 text-white" />}
                    </div>
                  )}
                </button>

                {/* Remove button — only for already-assigned delivery agents */}
                {alreadyAssigned && (
                  <button
                    type="button"
                    onClick={() => handleRemove(agent)}
                    disabled={isRemoving}
                    title="Remove from outlet"
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-white border border-red-100 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isRemoving ? (
                      <span className="w-3.5 h-3.5 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                    ) : (
                      <FiTrash2 className="w-3.5 h-3.5" />
                    )}
                    {isRemoving ? "Removing…" : "Remove"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination.last_page > 1 && (
        <div className="border-t border-gray-100 pt-3 space-y-2">
          <p className="text-xs text-gray-400 text-center">
            Showing page {pagination.current_page} of {pagination.last_page}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            <button
              disabled={pagination.current_page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Prev
            </button>
            {getVisiblePageNumbers().map((num) => (
              <button
                key={num}
                onClick={() => setPage(num)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  pagination.current_page === num
                    ? "bg-orange-500 text-white border-orange-500"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {num}
              </button>
            ))}
            <button
              disabled={pagination.current_page === pagination.last_page}
              onClick={() =>
                setPage((p) => Math.min(pagination.last_page, p + 1))
              }
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </ModalShell>
  );
};

// ── Outlet Card ───────────────────────────────────────────────────────────────
const OutletCard = ({
  item,
  onEdit,
  onToggle,
  togglingId,
  cityMap,
  onAssignSupervisor,
  onAssignDeliveryAgent,
}) => {
  const toggling = togglingId === item.id;
  const cityName =
    cityMap[item.city_id] ?? (item.city_id ? `City #${item.city_id}` : null);
  return (
    <div
      className={`bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col transition-opacity ${item.is_active ? "border-gray-100" : "border-gray-100 opacity-60"}`}
    >
      <div className="p-5 border-b border-gray-50 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.is_active ? "bg-orange-100" : "bg-gray-100"}`}
          >
            <FiHome
              className={`w-5 h-5 ${item.is_active ? "text-orange-500" : "text-gray-400"}`}
            />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-gray-900 text-base leading-tight truncate">
              {item.name}
            </h3>
            {cityName && (
              <p className="text-sm text-gray-500 mt-0.5 truncate">
                {cityName}
              </p>
            )}
          </div>
        </div>
        <span
          className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold ${item.is_active ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}
        >
          {item.is_active ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="p-5 flex-1 space-y-2">
        {cityName && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 rounded-lg">
            <FiMap className="w-3.5 h-3.5 text-purple-500" />
            <span className="text-xs font-semibold text-purple-600">
              {cityName}
            </span>
          </div>
        )}
        {item.address && (
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <FiMapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
            <span className="leading-snug">{item.address}</span>
          </div>
        )}
        {item.phone && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="text-gray-400 text-xs">📞</span>
            <span>{item.phone}</span>
          </div>
        )}
        <div className="flex items-center justify-between pt-2 border-t border-dashed border-gray-100">
          <span className="text-sm text-gray-500">Status</span>
          <button
            onClick={() => onToggle(item)}
            disabled={toggling}
            title={item.is_active ? "Click to disable" : "Click to enable"}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              item.is_active
                ? "bg-green-50 text-green-600 border-green-100 hover:bg-green-100"
                : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"
            }`}
          >
            {toggling ? (
              <span className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
            ) : item.is_active ? (
              <FiToggleRight className="w-4 h-4" />
            ) : (
              <FiToggleLeft className="w-4 h-4" />
            )}
            {item.is_active ? "Active" : "Inactive"}
          </button>
        </div>
        <div className="flex items-center mt-5 justify-between gap-2 text-sm text-gray-600">
          <span className="text-xs">Supervisors Assigned</span>
          <span className="font-bold">{item.supervisors_count}</span>
        </div>
        <div className="flex items-center mt-2 justify-between gap-2 text-sm text-gray-600">
          <span className="text-xs">Delivery Agents Assigned</span>
          <span className="font-bold">{item.delivery_agents_count ?? 0}</span>
        </div>
      </div>

      <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-col items-center gap-2">
        <button
          onClick={() => onEdit(item)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors shadow-sm w-full"
        >
          <FiEdit2 className="w-4 h-4" /> Edit
        </button>
        <button
          onClick={() => onAssignSupervisor(item)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 border border-orange-200 rounded-xl text-sm font-medium text-white hover:bg-orange-600 transition-colors shadow-sm w-full"
        >
          <FiUserCheck className="w-4 h-4" /> Supervisors
        </button>
        <button
          onClick={() => onAssignDeliveryAgent(item)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 border border-orange-200 rounded-xl text-sm font-medium text-white hover:bg-orange-600 transition-colors shadow-sm w-full"
        >
          <FiTruck className="w-4 h-4" /> Delivery Agents
        </button>
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const OutletManagement = () => {
  const [outlets, setOutlets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const [fetchError, setFetchError] = useState("");

  // Reference maps (kept in memory for labelling)
  const [cityMap, setCityMap] = useState({}); // id → city name
  const [citiesList, setCitiesList] = useState([]);

  // Modal state
  const [itemModal, setItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [assignModal, setAssignModal] = useState(false);
  const [assigningOutlet, setAssigningOutlet] = useState(null);
  const [assignDeliveryAgentModal, setAssignDeliveryAgentModal] =
    useState(false);
  const [assigningDeliveryAgentOutlet, setAssigningDeliveryAgentOutlet] =
    useState(null);

  // ── Reference data loaders ─────────────────────────────────────────────────
  const loadCities = useCallback(async () => {
    try {
      const { data } = await api.get("/cities");
      const list = Array.isArray(data) ? data : (data.data ?? []);
      setCitiesList(list);
      const map = {};
      list.forEach((c) => {
        map[c.id] = c.name;
      });
      setCityMap(map);
    } catch (_) {
      // silent
    }
  }, []);

  // Load reference data once on mount
  useEffect(() => {
    loadCities();
  }, [loadCities]);

  // ── Fetch outlets ──────────────────────────────────────────────────────────────
  const fetchOutlets = useCallback(async () => {
    setLoading(true);
    setFetchError("");
    try {
      if (USING_DUMMY_OUTLETS) {
        await new Promise((r) => setTimeout(r, 400));
        setOutlets(DUMMY_OUTLETS);
      } else {
        const { data } = await api.get("/admin/outlets");
        const list = Array.isArray(data) ? data : (data.data ?? []);

        // Enrich each outlet with accurate supervisors_count and
        // delivery_agents_count from the dedicated outlet-users endpoint.
        const enriched = await Promise.all(
          list.map(async (outlet) => {
            try {
              const [supRes, agentRes] = await Promise.all([
                api.get(`/admin/outlets/${outlet.id}/users`, {
                  params: { role: "supervisor" },
                }),
                api.get(`/admin/outlets/${outlet.id}/users`, {
                  params: { role: "delivery_agent" },
                }),
              ]);
              const supList = Array.isArray(supRes.data)
                ? supRes.data
                : (supRes.data.data ?? []);
              const agentList = Array.isArray(agentRes.data)
                ? agentRes.data
                : (agentRes.data.data ?? []);
              return {
                ...outlet,
                supervisors_count: supList.length,
                delivery_agents_count: agentList.length,
              };
            } catch (_) {
              return outlet;
            }
          }),
        );

        setOutlets(enriched);
      }
    } catch (err) {
      setFetchError(err.response?.data?.message || "Failed to load outlets.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOutlets();
  }, [fetchOutlets]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const openAdd = () => {
    setEditingItem(null);
    setItemModal(true);
  };
  const openEdit = (item) => {
    setEditingItem(item);
    setItemModal(true);
  };
  const openAssignSupervisor = (item) => {
    setAssigningOutlet(item);
    setAssignModal(true);
  };
  const openAssignDeliveryAgent = (item) => {
    setAssigningDeliveryAgentOutlet(item);
    setAssignDeliveryAgentModal(true);
  };

  const handleModalSuccess = ({ type, data }) => {
    if (USING_DUMMY_OUTLETS) {
      setOutlets((prev) =>
        type === "add"
          ? [...prev, data]
          : prev.map((i) => (i.id === data.id ? data : i)),
      );
    } else {
      fetchOutlets();
    }
  };

  const handleToggle = async (item) => {
    setTogglingId(item.id);
    try {
      if (USING_DUMMY_OUTLETS) {
        await new Promise((r) => setTimeout(r, 400));
      } else {
        await api.patch(`/admin/outlets/${item.id}/toggle`);
      }
      setOutlets((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, is_active: !i.is_active } : i,
        ),
      );
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to update availability.",
        "error",
      );
    } finally {
      setTogglingId(null);
    }
  };

  // ── Derived ────────────────────────────────────────────────────────────────
  const stats = {
    total: outlets.length,
    active: outlets.filter((i) => i.is_active).length,
    inactive: outlets.filter((i) => !i.is_active).length,
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Outlet modal */}
      <OutletModal
        isOpen={itemModal}
        onClose={() => setItemModal(false)}
        onSuccess={handleModalSuccess}
        editingItem={editingItem}
        cities={citiesList}
      />
      {/* Assign supervisor modal */}
      <AssignSupervisorModal
        isOpen={assignModal}
        onClose={() => setAssignModal(false)}
        outlet={assigningOutlet}
        onAssigned={() => fetchOutlets()}
      />
      {/* Assign delivery agent modal */}
      <AssignDeliveryAgentModal
        isOpen={assignDeliveryAgentModal}
        onClose={() => setAssignDeliveryAgentModal(false)}
        outlet={assigningDeliveryAgentOutlet}
        onAssigned={() => fetchOutlets()}
      />

      <DashboardLayout>
        <div className="p-6 space-y-6 bg-gray-50/50 min-h-full">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Outlet Management
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage restaurant outlets
              </p>
            </div>
            <div className="flex items-center gap-3">
              {USING_DUMMY_OUTLETS && (
                <div className="bg-amber-50 border border-amber-300 text-amber-700 px-3 py-1.5 rounded-lg text-xs font-medium">
                  🛠 Dev mode — USING_DUMMY_OUTLETS
                </div>
              )}
              <button
                onClick={openAdd}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors shadow-sm shadow-orange-200"
              >
                <FiPlus className="w-4 h-4" />
                Add Outlet
              </button>
            </div>
          </div>

          {/* Stats bar */}
          {!loading && !fetchError && outlets.length > 0 && (
            <div className="flex items-center gap-4">
              <div className="text-xs text-gray-500">
                <span className="font-semibold text-gray-700">
                  {stats.total}
                </span>{" "}
                total
              </div>
              <div className="w-px h-4 bg-gray-200" />
              <div className="text-xs text-green-600">
                <span className="font-semibold">{stats.active}</span> active
              </div>
              <div className="w-px h-4 bg-gray-200" />
              <div className="text-xs text-gray-400">
                <span className="font-semibold">{stats.inactive}</span> inactive
              </div>
            </div>
          )}

          {/* Error state */}
          {fetchError && !loading && (
            <div className="flex items-center justify-between gap-4 px-5 py-4 bg-red-50 border border-red-100 rounded-2xl">
              <div className="flex items-center gap-3 text-red-600 text-sm">
                <FiAlertTriangle className="w-4 h-4 flex-shrink-0" />
                {fetchError}
              </div>
              <button
                onClick={() => fetchOutlets()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-red-100 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
              >
                <FiRefreshCw className="w-3.5 h-3.5" /> Retry
              </button>
            </div>
          )}

          {/* Content */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
              <p className="text-gray-500 text-sm font-medium tracking-wide">
                Loading Outlets…
              </p>
            </div>
          ) : outlets.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FiHome className="w-7 h-7 text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">No outlets found</p>
              <p className="text-sm text-gray-400 mt-1">
                Click "Add Outlet" to create the first one.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {outlets.map((item) => (
                <OutletCard
                  key={item.id}
                  item={item}
                  onEdit={openEdit}
                  onToggle={handleToggle}
                  togglingId={togglingId}
                  cityMap={cityMap}
                  onAssignSupervisor={openAssignSupervisor}
                  onAssignDeliveryAgent={openAssignDeliveryAgent}
                />
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
};

export default OutletManagement;
