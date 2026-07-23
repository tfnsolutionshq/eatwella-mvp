import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "../../DashboardLayout/DashboardLayout";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiCheck,
  FiAlertTriangle,
  FiRefreshCw,
  FiToggleLeft,
  FiToggleRight,
  FiCreditCard,
  FiDollarSign,
} from "react-icons/fi";
import api from "../../utils/api";
import { useToast } from "../../context/ToastContext";

const TABS = [
  { key: "transfer", label: "Transfer", icon: FiCreditCard },
  { key: "pos", label: "POS", icon: FiDollarSign },
];

const ENDPOINT = "/admin/payment-accounts";

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

const TransferModal = ({ isOpen, onClose, onSuccess, editingItem }) => {
  const isEdit = !!editingItem;
  const [form, setForm] = useState({
    label: "",
    account_name: "",
    account_number: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setError("");
    setForm(
      isEdit
        ? {
            label: editingItem.label ?? "",
            account_name: editingItem.account_name ?? "",
            account_number: editingItem.account_number ?? "",
          }
        : { label: "", account_name: "", account_number: "" },
    );
  }, [isOpen, editingItem]);

  const handleSubmit = async () => {
    if (
      !form.label.trim() ||
      !form.account_name.trim() ||
      !form.account_number.trim()
    ) {
      setError("Fill up all fields!");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        type: "transfer",
        label: form.label.trim(),
        account_name: form.account_name.trim(),
        account_number: form.account_number.trim(),
      };
      if (isEdit) {
        const { data } = await api.put(
          `${ENDPOINT}/${editingItem.id}`,
          payload,
        );
        onSuccess({ type: "edit", data });
      } else {
        const { data } = await api.post(ENDPOINT, payload);
        onSuccess({ type: "add", data });
      }
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to save transfer account. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      icon={FiCreditCard}
      title={isEdit ? "Edit Transfer Account" : "Add Transfer Account"}
      subtitle={isEdit ? editingItem?.label : "Add a new transfer account"}
      footer={
        <>
          <CancelBtn onClose={onClose} />
          <SpinnerBtn
            saving={saving}
            savingLabel="Saving…"
            defaultLabel={isEdit ? "Save Changes" : "Add Account"}
            onClick={handleSubmit}
          />
        </>
      }
    >
      <ErrorBanner message={error} />
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
          Label *
        </label>
        <input
          type="text"
          value={form.label}
          onChange={(e) => setForm({ ...form, label: e.target.value })}
          placeholder="e.g. GTBank"
          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
          autoFocus
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
          Account Name *
        </label>
        <input
          type="text"
          value={form.account_name}
          onChange={(e) => setForm({ ...form, account_name: e.target.value })}
          placeholder="e.g. John Doe"
          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
          Account Number *
        </label>
        <input
          type="text"
          value={form.account_number}
          onChange={(e) => setForm({ ...form, account_number: e.target.value })}
          placeholder="e.g. 0123456789"
          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
      </div>
    </ModalShell>
  );
};

const PosModal = ({ isOpen, onClose, onSuccess, editingItem }) => {
  const isEdit = !!editingItem;
  const [form, setForm] = useState({ label: "", account_number: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setError("");
    setForm(
      isEdit
        ? {
            label: editingItem.label ?? "",
            account_number: editingItem.account_number ?? "",
          }
        : { label: "", account_number: "" },
    );
  }, [isOpen, editingItem]);

  const handleSubmit = async () => {
    if (!form.label.trim() || !form.account_number.trim()) {
      setError("Fill up all fields!");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        type: "pos",
        label: form.label.trim(),
        account_number: form.account_number.trim(),
      };
      if (isEdit) {
        const { data } = await api.put(
          `${ENDPOINT}/${editingItem.id}`,
          payload,
        );
        onSuccess({ type: "edit", data });
      } else {
        const { data } = await api.post(ENDPOINT, payload);
        onSuccess({ type: "add", data });
      }
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to save POS account. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      icon={FiDollarSign}
      title={isEdit ? "Edit POS Account" : "Add POS Account"}
      subtitle={isEdit ? editingItem?.label : "Add a new POS account"}
      footer={
        <>
          <CancelBtn onClose={onClose} />
          <SpinnerBtn
            saving={saving}
            savingLabel="Saving…"
            defaultLabel={isEdit ? "Save Changes" : "Add Account"}
            onClick={handleSubmit}
          />
        </>
      }
    >
      <ErrorBanner message={error} />
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
          Label *
        </label>
        <input
          type="text"
          value={form.label}
          onChange={(e) => setForm({ ...form, label: e.target.value })}
          placeholder="e.g. Zenith"
          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
          autoFocus
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
          Account Number *
        </label>
        <input
          type="text"
          value={form.account_number}
          onChange={(e) => setForm({ ...form, account_number: e.target.value })}
          placeholder="e.g. 0123456789"
          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
      </div>
    </ModalShell>
  );
};

const DeleteConfirmModal = ({ isOpen, onClose, onSuccess, item }) => {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) setError("");
  }, [isOpen]);

  const handleDelete = async () => {
    setDeleting(true);
    setError("");
    try {
      await api.delete(`${ENDPOINT}/${item.id}`);
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
      subtitle={item?.label}
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
        <span className="font-semibold">{item?.label}</span>? This action cannot
        be undone.
      </p>
    </ModalShell>
  );
};

const AccountCard = ({ item, onEdit, onDelete, onToggle, togglingId }) => {
  const isTransfer = item.type === "transfer";
  const Icon = isTransfer ? FiCreditCard : FiDollarSign;
  const toggling = togglingId === item.id;

  return (
    <div
      className={`bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col transition-opacity ${item.is_active ? "border-gray-100" : "border-gray-100 opacity-60"}`}
    >
      <div className="p-5 border-b border-gray-50 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.is_active ? "bg-orange-100" : "bg-gray-100"}`}
          >
            <Icon
              className={`w-5 h-5 ${item.is_active ? "text-orange-500" : "text-gray-400"}`}
            />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-gray-900 text-base leading-tight truncate">
              {item.label}
            </h3>
            {isTransfer ? (
              <p className="text-sm text-gray-500 mt-0.5 truncate">
                {item.account_name}
              </p>
            ) : null}
          </div>
        </div>
        <span
          className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold ${item.is_active ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}
        >
          {item.is_active ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="p-5 flex-1 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Account Number</span>
          <span className="text-sm font-bold text-gray-800">
            {item.account_number}
          </span>
        </div>
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
        <button
          onClick={() => onDelete(item)}
          className="flex items-center justify-center gap-2 px-3 py-2.5 bg-white border border-red-100 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors shadow-sm"
          title="Delete account"
        >
          <FiTrash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const PaymentAccountManagement = () => {
  const [activeTab, setActiveTab] = useState("transfer");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const [fetchError, setFetchError] = useState("");

  const [itemModal, setItemModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const filteredItems = items.filter((i) => i.type === activeTab);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setFetchError("");
    try {
      const { data } = await api.get(ENDPOINT);
      const transfer = Array.isArray(data.transfer) ? data.transfer : [];
      const pos = Array.isArray(data.pos) ? data.pos : [];
      setItems([...transfer, ...pos]);
    } catch (err) {
      setFetchError(
        err.response?.data?.message || "Failed to load payment accounts.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

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

  const handleModalSuccess = () => {
    fetchItems();
  };

  const handleDeleteSuccess = () => {
    fetchItems();
  };

  const handleToggle = async (item) => {
    setTogglingId(item.id);
    try {
      await api.patch(`${ENDPOINT}/${item.id}/toggle`);
      setItems((prev) =>
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

  const stats = {
    total: filteredItems.length,
    active: filteredItems.filter((i) => i.is_active).length,
    inactive: filteredItems.filter((i) => !i.is_active).length,
  };

  const currentTab = TABS.find((t) => t.key === activeTab);
  const addLabel =
    activeTab === "transfer" ? "Add Transfer Account" : "Add POS Account";

  return (
    <>
      {activeTab === "transfer" && (
        <TransferModal
          isOpen={itemModal}
          onClose={() => setItemModal(false)}
          onSuccess={handleModalSuccess}
          editingItem={editingItem}
        />
      )}
      {activeTab === "pos" && (
        <PosModal
          isOpen={itemModal}
          onClose={() => setItemModal(false)}
          onSuccess={handleModalSuccess}
          editingItem={editingItem}
        />
      )}
      {deleteModal && (
        <DeleteConfirmModal
          isOpen={deleteModal}
          onClose={() => setDeleteModal(false)}
          onSuccess={handleDeleteSuccess}
          item={deletingItem}
        />
      )}

      <DashboardLayout>
        <div className="p-6 space-y-6 bg-gray-50/50 min-h-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Payment Accounts
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage transfer and POS payment accounts
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={openAdd}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors shadow-sm shadow-orange-200"
              >
                <FiPlus className="w-4 h-4" />
                {addLabel}
              </button>
            </div>
          </div>

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

          {!loading && !fetchError && filteredItems.length > 0 && (
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

          {fetchError && !loading && (
            <div className="flex items-center justify-between gap-4 px-5 py-4 bg-red-50 border border-red-100 rounded-2xl">
              <div className="flex items-center gap-3 text-red-600 text-sm">
                <FiAlertTriangle className="w-4 h-4 flex-shrink-0" />
                {fetchError}
              </div>
              <button
                onClick={() => fetchItems()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-red-100 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
              >
                <FiRefreshCw className="w-3.5 h-3.5" /> Retry
              </button>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
              <p className="text-gray-500 text-sm font-medium tracking-wide">
                Loading {currentTab?.label} accounts...
              </p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                {currentTab && (
                  <currentTab.icon className="w-7 h-7 text-gray-300" />
                )}
              </div>
              <p className="text-gray-500 font-medium">
                No {currentTab?.label.toLowerCase()} accounts found
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Click "{addLabel}" to create the first one.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <AccountCard
                  key={item.id}
                  item={item}
                  onEdit={openEdit}
                  onDelete={openDelete}
                  onToggle={handleToggle}
                  togglingId={togglingId}
                />
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
};

export default PaymentAccountManagement;
