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
  FiGlobe,
  FiMap,
  FiNavigation,
} from "react-icons/fi";
import api from "../../utils/api";

// ─────────────────────────────────────────────────────────────────────────────
// DEV TOGGLE
// ─────────────────────────────────────────────────────────────────────────────
const USING_DUMMY_DATA = false;

const DUMMY_STATES = [
  { id: 1, name: "Anambra", is_active: true, code: "AN" },
  { id: 2, name: "Lagos", is_active: true, code: "LA" },
  { id: 3, name: "Abuja", is_active: false, code: "AB" },
];
const DUMMY_CITIES = [
  { id: 1, name: "Awka", state_id: 1, is_active: true },
  { id: 2, name: "Onitsha", state_id: 1, is_active: true },
  { id: 3, name: "Ikeja", state_id: 2, is_active: false },
];
const DUMMY_ZONES = [
  {
    id: 1,
    name: "Nnamdi Azikiwe University (NAU)",
    city_id: 1,
    delivery_fee: 500,
    is_active: true,
  },
  {
    id: 2,
    name: "Awka Town Centre",
    city_id: 1,
    delivery_fee: 300,
    is_active: true,
  },
  {
    id: 3,
    name: "Onitsha Main Market",
    city_id: 2,
    delivery_fee: 700,
    is_active: false,
  },
];
// ─────────────────────────────────────────────────────────────────────────────

// ── Tab config ────────────────────────────────────────────────────────────────
const TABS = [
  { key: "states", label: "States", icon: FiGlobe, endpoint: "/states" },
  { key: "cities", label: "Cities", icon: FiMap, endpoint: "/cities" },
  { key: "zones", label: "Zones", icon: FiNavigation, endpoint: "/zones" },
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
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
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
        <div className="px-6 py-5 space-y-4">{children}</div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
          {footer}
        </div>
      </div>
    </div>
  );
};

// ── Shared helpers ────────────────────────────────────────────────────────────
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

// ── STATE Modal ───────────────────────────────────────────────────────────────
const StateModal = ({ isOpen, onClose, onSuccess, editingItem }) => {
  const isEdit = !!editingItem;
  const [form, setForm] = useState({ name: "", code: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setError("");
    setForm(
      isEdit
        ? {
            name: editingItem.name ?? "",
            code: editingItem.code ?? "",
          }
        : { name: "", code: "" },
    );
  }, [isOpen, editingItem]);

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.code.trim()) {
      setError("Fill up all fields!");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        name: form.name.trim(),
        code: form.code.trim(),
      };
      if (USING_DUMMY_DATA) {
        await new Promise((r) => setTimeout(r, 500));
        const data = isEdit
          ? { ...editingItem, ...payload }
          : { id: Date.now(), ...payload };
        onSuccess({ type: isEdit ? "edit" : "add", data });
      } else {
        if (isEdit) {
          const { data } = await api.put(
            `/admin/states/${editingItem.id}`,
            payload,
          );
          onSuccess({ type: "edit", data });
        } else {
          const { data } = await api.post("/admin/states", payload);
          onSuccess({ type: "add", data });
        }
      }
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to save state. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      icon={FiGlobe}
      title={isEdit ? "Edit State" : "Add State"}
      subtitle={isEdit ? editingItem?.name : "Add a new state"}
      footer={
        <>
          <CancelBtn onClose={onClose} />
          <SpinnerBtn
            saving={saving}
            savingLabel="Saving…"
            defaultLabel={isEdit ? "Save Changes" : "Add State"}
            onClick={handleSubmit}
          />
        </>
      }
    >
      <ErrorBanner message={error} />
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
          State Name *
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="e.g. Anambra"
          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
          autoFocus
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
          State Code *
        </label>
        <input
          type="text"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
          placeholder="e.g. AN"
          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
      </div>
    </ModalShell>
  );
};

// ── CITY Modal ────────────────────────────────────────────────────────────────
const CityModal = ({ isOpen, onClose, onSuccess, editingItem, states }) => {
  const isEdit = !!editingItem;
  const [form, setForm] = useState({ name: "", state_id: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setError("");
    setForm(
      isEdit
        ? {
            name: editingItem.name ?? "",
            state_id: editingItem.state_id ?? "",
          }
        : { name: "", state_id: states[0]?.id ?? "" },
    );
  }, [isOpen, editingItem, states]);

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      setError("City name is required.");
      return;
    }
    if (!form.state_id) {
      setError("Please select a state.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        name: form.name.trim(),
        state_id: Number(form.state_id),
      };
      if (USING_DUMMY_DATA) {
        await new Promise((r) => setTimeout(r, 500));
        const data = isEdit
          ? { ...editingItem, ...payload }
          : { id: Date.now(), ...payload };
        onSuccess({ type: isEdit ? "edit" : "add", data });
      } else {
        if (isEdit) {
          const { data } = await api.put(
            `/admin/cities/${editingItem.id}`,
            payload,
          );
          onSuccess({ type: "edit", data });
        } else {
          const { data } = await api.post("/admin/cities", payload);
          onSuccess({ type: "add", data });
        }
      }
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to save city. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      icon={FiMap}
      title={isEdit ? "Edit City" : "Add City"}
      subtitle={isEdit ? editingItem?.name : "Add a new city"}
      footer={
        <>
          <CancelBtn onClose={onClose} />
          <SpinnerBtn
            saving={saving}
            savingLabel="Saving…"
            defaultLabel={isEdit ? "Save Changes" : "Add City"}
            onClick={handleSubmit}
          />
        </>
      }
    >
      <ErrorBanner message={error} />
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
          City Name *
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="e.g. Awka"
          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
          autoFocus
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
          State *
        </label>
        <select
          value={form.state_id}
          onChange={(e) => setForm({ ...form, state_id: e.target.value })}
          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition bg-white"
        >
          <option value="">Select a state…</option>
          {states.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>
    </ModalShell>
  );
};

// ── ZONE Modal ────────────────────────────────────────────────────────────────
const ZoneModal = ({ isOpen, onClose, onSuccess, editingItem, cities }) => {
  const isEdit = !!editingItem;
  const [form, setForm] = useState({
    name: "",
    city_id: "",
    delivery_fee: "",
    is_active: true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setError("");
    setForm(
      isEdit
        ? {
            name: editingItem.name ?? "",
            city_id: editingItem.city_id ?? "",
            delivery_fee: editingItem.delivery_fee ?? "",
            is_active: editingItem.is_active ?? true,
          }
        : {
            name: "",
            city_id: cities[0]?.id ?? "",
            delivery_fee: "",
            is_active: true,
          },
    );
  }, [isOpen, editingItem, cities]);

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      setError("Zone name is required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        name: form.name.trim(),
        city_id: form.city_id ? Number(form.city_id) : undefined,
        delivery_fee:
          form.delivery_fee === "" ? null : Number(form.delivery_fee),
        is_active: form.is_active,
      };
      if (USING_DUMMY_DATA) {
        await new Promise((r) => setTimeout(r, 500));
        const data = isEdit
          ? { ...editingItem, ...payload }
          : { id: Date.now(), ...payload };
        onSuccess({ type: isEdit ? "edit" : "add", data });
      } else {
        if (isEdit) {
          const { data } = await api.put(
            `/admin/zones/${editingItem.id}`,
            payload,
          );
          onSuccess({ type: "edit", data });
        } else {
          const { data } = await api.post("/admin/zones", payload);
          onSuccess({ type: "add", data });
        }
      }
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to save zone. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      icon={FiNavigation}
      title={isEdit ? "Edit Zone" : "Add Delivery Zone"}
      subtitle={isEdit ? editingItem?.name : "Add a new delivery zone"}
      footer={
        <>
          <CancelBtn onClose={onClose} />
          <SpinnerBtn
            saving={saving}
            savingLabel="Saving…"
            defaultLabel={isEdit ? "Save Changes" : "Add Zone"}
            onClick={handleSubmit}
          />
        </>
      }
    >
      <ErrorBanner message={error} />
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
          Zone Name *
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="e.g. Nnamdi Azikiwe University (NAU)"
          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
          autoFocus
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
          City
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
          Delivery Fee (₦)
        </label>
        <input
          type="number"
          min={0}
          value={form.delivery_fee}
          onChange={(e) => setForm({ ...form, delivery_fee: e.target.value })}
          placeholder="e.g. 500"
          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
      </div>
      <ToggleRow
        label="Available for delivery"
        description="Customers can select this zone at checkout"
        value={form.is_active}
        onChange={(v) => setForm({ ...form, is_active: v })}
      />
    </ModalShell>
  );
};

// ── Delete Confirm Modal ──────────────────────────────────────────────────────
const DeleteConfirmModal = ({ isOpen, onClose, onSuccess, item, endpoint }) => {
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
        await new Promise((r) => setTimeout(r, 500));
      } else {
        await api.delete(`${endpoint}/${item.id}`);
      }
      onSuccess(item.id);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      icon={FiTrash2}
      title="Confirm Delete"
      subtitle={item?.name}
      footer={
        <>
          <CancelBtn onClose={onClose} />
          <SpinnerBtn
            saving={deleting}
            savingLabel="Deleting…"
            defaultLabel="Delete"
            onClick={handleDelete}
            icon={FiTrash2}
            variant="danger"
          />
        </>
      }
    >
      <ErrorBanner message={error} />
      <p className="text-sm text-gray-600">
        Are you sure you want to delete{" "}
        <span className="font-semibold">{item?.name}</span>? This action cannot
        be undone.
      </p>
    </ModalShell>
  );
};

// ── Toggle row (reusable) ─────────────────────────────────────────────────────
const ToggleRow = ({ label, description, value, onChange }) => (
  <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
    <div>
      <p className="text-sm font-semibold text-gray-700">{label}</p>
      {description && (
        <p className="text-xs text-gray-400 mt-0.5">{description}</p>
      )}
    </div>
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${value ? "bg-orange-500" : "bg-gray-300"}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${value ? "translate-x-5" : "translate-x-0"}`}
      />
    </button>
  </div>
);

// ── Skeleton Card ─────────────────────────────────────────────────────────────
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

// ── State Card ────────────────────────────────────────────────────────────────
const StateCard = ({ item, onEdit, onDelete }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
    <div className="p-5 border-b border-gray-50 flex items-start gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-orange-100">
          <FiGlobe className="w-5 h-5 text-orange-500" />
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-gray-900 text-base leading-tight truncate">
            {item.name}, {item.code}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">State</p>
        </div>
      </div>
    </div>
    <div className="flex-1" />
    <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center gap-2">
      <button
        onClick={() => onEdit(item)}
        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors shadow-sm"
      >
        <FiEdit2 className="w-4 h-4" /> Edit
      </button>
      <button
        onClick={() => onDelete(item)}
        className="flex items-center justify-center gap-2 px-3 py-2.5 bg-white border border-red-100 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors shadow-sm"
        title="Delete state"
      >
        <FiTrash2 className="w-4 h-4" />
      </button>
    </div>
  </div>
);

// ── City Card ─────────────────────────────────────────────────────────────────
const CityCard = ({ item, onEdit, onDelete, stateMap }) => {
  const stateName = stateMap[item.state_id] ?? `State #${item.state_id}`;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
      <div className="p-5 border-b border-gray-50 flex items-start gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-orange-100">
            <FiMap className="w-5 h-5 text-orange-500" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-gray-900 text-base leading-tight truncate">
              {item.name}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5 truncate">{stateName}</p>
          </div>
        </div>
      </div>
      <div className="p-5 flex-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-lg">
          <FiGlobe className="w-3.5 h-3.5 text-blue-500" />
          <span className="text-xs font-semibold text-blue-600">
            {stateName}
          </span>
        </div>
      </div>
      <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center gap-2">
        <button
          onClick={() => onEdit(item)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors shadow-sm"
        >
          <FiEdit2 className="w-4 h-4" /> Edit
        </button>
        <button
          onClick={() => onDelete(item)}
          className="flex items-center justify-center gap-2 px-3 py-2.5 bg-white border border-red-100 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors shadow-sm"
          title="Delete city"
        >
          <FiTrash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ── Zone Card ─────────────────────────────────────────────────────────────────
const ZoneCard = ({ item, onEdit, onToggle, togglingId, cityMap }) => {
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
            <FiNavigation
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

      <div className="p-5 flex-1 space-y-3">
        {cityName && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 rounded-lg">
            <FiMap className="w-3.5 h-3.5 text-purple-500" />
            <span className="text-xs font-semibold text-purple-600">
              {cityName}
            </span>
          </div>
        )}
        {item.delivery_fee !== null &&
          item.delivery_fee !== undefined &&
          item.delivery_fee !== "" && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Delivery Fee</span>
              <span className="text-2xl font-black text-orange-500">
                {new Intl.NumberFormat("en-NG", {
                  style: "currency",
                  currency: "NGN",
                  minimumFractionDigits: 0,
                }).format(Number(item.delivery_fee))}
              </span>
            </div>
          )}
        <div className="flex items-center justify-between pt-2 border-t border-dashed border-gray-100">
          <span className="text-sm text-gray-500">Available</span>
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
      </div>

      <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center gap-2">
        <button
          onClick={() => onEdit(item)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors shadow-sm"
        >
          <FiEdit2 className="w-4 h-4" /> Edit
        </button>
        {/* No delete endpoint for zones per spec */}
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const DeliveryLocationManagement = () => {
  const [activeTab, setActiveTab] = useState("states");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  // Cross-tab reference maps (kept in memory for labelling)
  // { [id]: name }
  const [stateMap, setStateMap] = useState({}); // id → state name
  const [cityMap, setCityMap] = useState({}); // id → city name

  // Flat lists for selects in modals
  const [statesList, setStatesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);

  // Modal state
  const [itemModal, setItemModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  // ── Reference data loaders ─────────────────────────────────────────────────
  const loadStates = useCallback(async () => {
    try {
      if (USING_DUMMY_DATA) {
        setStatesList(DUMMY_STATES);
        const map = {};
        DUMMY_STATES.forEach((s) => {
          map[s.id] = s.name;
        });
        setStateMap(map);
      } else {
        const { data } = await api.get("/states");
        const list = Array.isArray(data) ? data : (data.data ?? []);
        setStatesList(list);
        const map = {};
        list.forEach((s) => {
          map[s.id] = s.name;
        });
        setStateMap(map);
      }
    } catch (_) {
      /* silent */
    }
  }, []);

  const loadCities = useCallback(async () => {
    try {
      if (USING_DUMMY_DATA) {
        setCitiesList(DUMMY_CITIES);
        const map = {};
        DUMMY_CITIES.forEach((c) => {
          map[c.id] = c.name;
        });
        setCityMap(map);
      } else {
        const { data } = await api.get("/cities");
        const list = Array.isArray(data) ? data : (data.data ?? []);
        setCitiesList(list);
        const map = {};
        list.forEach((c) => {
          map[c.id] = c.name;
        });
        setCityMap(map);
      }
    } catch (_) {
      /* silent */
    }
  }, []);

  // Load reference data once on mount
  useEffect(() => {
    loadStates();
    loadCities();
  }, [loadStates, loadCities]);

  // ── Tab fetch ──────────────────────────────────────────────────────────────
  const fetchItems = useCallback(async (tab) => {
    setLoading(true);
    setFetchError("");
    try {
      const endpointMap = {
        states: "/states",
        cities: "/cities",
        zones: "/zones",
      };
      const dummyMap = {
        states: DUMMY_STATES,
        cities: DUMMY_CITIES,
        zones: DUMMY_ZONES,
      };

      if (USING_DUMMY_DATA) {
        await new Promise((r) => setTimeout(r, 400));
        const list = dummyMap[tab];
        setItems(list);
        // Keep reference maps up to date
        if (tab === "states") {
          const map = {};
          list.forEach((s) => {
            map[s.id] = s.name;
          });
          setStateMap(map);
          setStatesList(list);
        }
        if (tab === "cities") {
          const map = {};
          list.forEach((c) => {
            map[c.id] = c.name;
          });
          setCityMap(map);
          setCitiesList(list);
        }
      } else {
        const { data } = await api.get(endpointMap[tab]);
        const list = Array.isArray(data) ? data : (data.data ?? []);
        setItems(list);
        if (tab === "states") {
          const map = {};
          list.forEach((s) => {
            map[s.id] = s.name;
          });
          setStateMap(map);
          setStatesList(list);
        }
        if (tab === "cities") {
          const map = {};
          list.forEach((c) => {
            map[c.id] = c.name;
          });
          setCityMap(map);
          setCitiesList(list);
        }
      }
    } catch (err) {
      setFetchError(err.response?.data?.message || `Failed to load ${tab}.`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems(activeTab);
  }, [activeTab, fetchItems]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const openAdd = () => {
    setEditingItem(null);
    setItemModal(true);
  };
  const openEdit = (item) => {
    setEditingItem(item);
    setItemModal(true);
  };
  const openDelete = (item) => {
    setDeletingItem(item);
    setDeleteModal(true);
  };

  const handleModalSuccess = ({ type, data }) => {
    if (USING_DUMMY_DATA) {
      setItems((prev) =>
        type === "add"
          ? [...prev, data]
          : prev.map((i) => (i.id === data.id ? data : i)),
      );
    } else {
      fetchItems(activeTab);
      // Refresh reference maps if state/city changed
      if (activeTab === "states") loadStates();
      if (activeTab === "cities") loadCities();
    }
  };

  const handleDeleteSuccess = (id) => {
    if (USING_DUMMY_DATA) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    } else {
      fetchItems(activeTab);
      if (activeTab === "states") loadStates();
      if (activeTab === "cities") loadCities();
    }
  };

  const handleToggle = async (item) => {
    setTogglingId(item.id);
    try {
      if (USING_DUMMY_DATA) {
        await new Promise((r) => setTimeout(r, 400));
      } else {
        await api.patch(`/admin/zones/${item.id}/toggle`);
      }
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, is_active: !i.is_active } : i,
        ),
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update availability.");
    } finally {
      setTogglingId(null);
    }
  };

  // ── Derived ────────────────────────────────────────────────────────────────
  const stats = {
    total: items.length,
    active: items.filter((i) => i.is_active).length,
    inactive: items.filter((i) => !i.is_active).length,
  };

  const currentTab = TABS.find((t) => t.key === activeTab);
  const addLabel =
    activeTab === "states"
      ? "Add State"
      : activeTab === "cities"
        ? "Add City"
        : "Add Zone";

  const deleteEndpointMap = {
    states: "/admin/states",
    cities: "/admin/cities",
    zones: "/admin/zones",
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* State modal */}
      {activeTab === "states" && (
        <StateModal
          isOpen={itemModal}
          onClose={() => setItemModal(false)}
          onSuccess={handleModalSuccess}
          editingItem={editingItem}
        />
      )}
      {/* City modal */}
      {activeTab === "cities" && (
        <CityModal
          isOpen={itemModal}
          onClose={() => setItemModal(false)}
          onSuccess={handleModalSuccess}
          editingItem={editingItem}
          states={statesList}
        />
      )}
      {/* Zone modal */}
      {activeTab === "zones" && (
        <ZoneModal
          isOpen={itemModal}
          onClose={() => setItemModal(false)}
          onSuccess={handleModalSuccess}
          editingItem={editingItem}
          cities={citiesList}
        />
      )}
      {/* Delete modal — not shown for zones */}
      {activeTab !== "zones" && (
        <DeleteConfirmModal
          isOpen={deleteModal}
          onClose={() => setDeleteModal(false)}
          onSuccess={handleDeleteSuccess}
          item={deletingItem}
          endpoint={deleteEndpointMap[activeTab]}
        />
      )}

      <DashboardLayout>
        <div className="p-6 space-y-6 bg-gray-50/50 min-h-full">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Delivery Locations
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage states, cities and delivery zones
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
                onClick={openAdd}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors shadow-sm shadow-orange-200"
              >
                <FiPlus className="w-4 h-4" />
                {addLabel}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white p-1.5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-1 overflow-x-auto w-full">
            <div className="flex items-center gap-2 min-w-max">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => {
                      if (tab.key !== activeTab) {
                        setActiveTab(tab.key);
                        setItems([]);
                      }
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.key
                        ? "bg-gray-200 text-gray-900 shadow-sm font-semibold"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                    {!loading && activeTab === tab.key && (
                      <span className="text-xs bg-orange-100 text-orange-600 font-bold px-1.5 py-0.5 rounded-full">
                        {stats.total}
                      </span>
                    )}
                    {loading && activeTab === tab.key && (
                      <span className="inline-block w-5 h-3.5 bg-gray-200 rounded animate-pulse align-middle" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stats bar */}
          {!loading && !fetchError && items.length > 0 && (
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
                onClick={() => fetchItems(activeTab)}
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
                Loading {currentTab?.label}...
              </p>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                {currentTab && (
                  <currentTab.icon className="w-7 h-7 text-gray-300" />
                )}
              </div>
              <p className="text-gray-500 font-medium">
                No {currentTab?.label.toLowerCase()} found
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Click "{addLabel}" to create the first one.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {items.map((item) => {
                if (activeTab === "states") {
                  return (
                    <StateCard
                      key={item.id}
                      item={item}
                      onEdit={openEdit}
                      onDelete={openDelete}
                    />
                  );
                }
                if (activeTab === "cities") {
                  return (
                    <CityCard
                      key={item.id}
                      item={item}
                      onEdit={openEdit}
                      onDelete={openDelete}
                      stateMap={stateMap}
                    />
                  );
                }
                return (
                  <ZoneCard
                    key={item.id}
                    item={item}
                    onEdit={openEdit}
                    onToggle={handleToggle}
                    togglingId={togglingId}
                    cityMap={cityMap}
                  />
                );
              })}
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
};

export default DeliveryLocationManagement;
