import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import DashboardLayout from "../../DashboardLayout/DashboardLayout";
import OrderDetailsModal from "../../Components/Modals/OrderDetailsModal";
import DeliveryPinModal from "../../Components/Modals/DeliveryPinModal";
import {
  Eye,
  Clock,
  Check,
  Truck,
  Plus,
  X,
  Package,
  Send,
  CreditCard,
  CheckCircle,
  ChefHat,
  PackageCheck,
  UserPlus,
  XCircle,
  Search,
  DollarSign,
  Flame,
  ChevronDown,
  Store,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";



const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    color: "bg-gray-100 text-gray-600",
    icon: Clock,
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-blue-100 text-blue-600",
    icon: DollarSign,
  },
  processing: {
    label: "Processing",
    color: "bg-purple-100 text-purple-600",
    icon: Flame,
  },
  in_kitchen: {
    label: "In Kitchen",
    color: "bg-orange-100 text-orange-600",
    icon: ChefHat,
  },
  ready: {
    label: "Ready",
    color: "bg-yellow-100 text-yellow-600",
    icon: Package,
  },
  dispatched: {
    label: "Dispatched",
    color: "bg-indigo-100 text-indigo-600",
    icon: Truck,
  },
  completed: {
    label: "Completed",
    color: "bg-green-100 text-green-600",
    icon: Check,
  },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-600", icon: X },
};

const getStatusColor = (status) =>
  STATUS_CONFIG[status]?.color ?? "bg-gray-100 text-gray-600";

const getStatusLabel = (status) => STATUS_CONFIG[status]?.label ?? status;

const getStatusIcon = (status) => {
  const Icon = STATUS_CONFIG[status]?.icon;
  return Icon ? <Icon className="w-3 h-3" /> : null;
};

const TABS_BY_ROLE = {
  admin: [
    "all",
    "pending",
    "confirmed",
    "processing",
    "in_kitchen",
    "ready",
    "dispatched",
    "completed",
    "cancelled",
  ],
  supervisor: [
    "all",
    "pending",
    "confirmed",
    "processing",
    "in_kitchen",
    "ready",
    "dispatched",
    "completed",
    "cancelled",
  ],
  // Kitchen only sees orders explicitly sent to them via "Send to Kitchen"
  kitchen: ["all", "in_kitchen", "processing"],
  delivery_agent: ["all", "available", "active", "completed"],
  attendant: [
    "all",
    "pending",
    "confirmed",
    "in_kitchen",
    "processing",
    "ready",
    "completed",
  ],
};

// ---------------------------------------------------------------------------
// OutletSelect — single-select with "All Outlets" as default
// ---------------------------------------------------------------------------
const OutletSelect = ({ outlets, selectedId, onChange, isLoading }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const label = selectedId
    ? (outlets.find((o) => o.id === selectedId)?.name ?? "Select outlet")
    : "All Outlets";

  if (isLoading) {
    return <div className="h-9 w-44 bg-gray-200 rounded-lg animate-pulse" />;
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 pl-3 pr-2.5 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors shadow-sm min-w-[11rem]"
      >
        <Store className="w-4 h-4 text-gray-400 shrink-0" />
        <span className="flex-1 text-left truncate">{label}</span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded-xl shadow-lg w-56 py-1.5 max-h-72 overflow-y-auto">
          <button
            onClick={() => {
              onChange(null);
              setOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors text-left"
          >
            <span
              className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                !selectedId
                  ? "bg-orange-500 border-orange-500"
                  : "border-gray-300"
              }`}
            >
              {!selectedId && <Check className="w-3 h-3 text-white" />}
            </span>
            <span className="truncate text-gray-700">All Outlets</span>
          </button>
          <div className="mx-3 my-1 border-t border-gray-100" />
          {outlets.length === 0 && (
            <p className="px-4 py-3 text-sm text-gray-400">No outlets found.</p>
          )}
          {outlets.map((outlet) => {
            const selected = outlet.id === selectedId;
            return (
              <button
                key={outlet.id}
                onClick={() => {
                  onChange(outlet.id);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors text-left"
              >
                <span
                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                    selected
                      ? "bg-orange-500 border-orange-500"
                      : "border-gray-300"
                  }`}
                >
                  {selected && <Check className="w-3 h-3 text-white" />}
                </span>
                <span className="truncate text-gray-700">{outlet.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// AssignAgentModal
// ---------------------------------------------------------------------------
const AssignAgentModal = ({
  isOpen,
  onClose,
  onConfirm,
  isAssigning,
  order,
}) => {
  const [selected, setSelected] = useState(null);
  const [agents, setAgents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 15,
  });

  useEffect(() => {
    if (isOpen) {
      setSelected(null);
      setPage(1);
      setSearchQuery("");
      setDebouncedSearch("");
      fetchAgents(1, "");
    }
  }, [isOpen, order?.id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (!isOpen) return;
    setPage(1);
    fetchAgents(1, debouncedSearch);
  }, [debouncedSearch]);

  useEffect(() => {
    if (!isOpen) return;
    fetchAgents(page, debouncedSearch);
  }, [page]);

  const fetchAgents = async (pageNum, search) => {
    setIsLoading(true);
    try {
      const { data } = await api.get("/admin/users", {
        params: { role: "delivery_agent", page: pageNum, search },
      });
      const list = Array.isArray(data?.data) ? data.data : [];
      setAgents(list);
      setPagination({
        current_page: data?.current_page ?? pageNum,
        last_page: data?.last_page ?? 1,
        total: data?.total ?? list.length,
        per_page: data?.per_page ?? 15,
      });
    } catch (err) {
      console.error("Failed to load delivery agents:", err);
      setAgents([]);
    } finally {
      setIsLoading(false);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Assign Delivery Agent
            </h2>
            {order && (
              <p className="text-xs text-gray-400 mt-0.5">
                Order #{order.order_number}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-4 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search delivery agents..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
            />
          </div>
        </div>

        <div className="px-6 pb-4 overflow-y-auto flex-1 space-y-2 min-h-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
            </div>
          ) : agents.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">
              No delivery agents found.
            </p>
          ) : (
            agents.map((agent) => (
              <button
                key={agent.id}
                onClick={() => setSelected(agent.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                  selected === agent.id
                    ? "border-orange-400 bg-orange-50 ring-1 ring-orange-300"
                    : "border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-gray-100"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${
                    selected === agent.id
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {agent.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {agent.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {agent.email}
                  </p>
                </div>
                {selected === agent.id && (
                  <Check className="ml-auto w-4 h-4 text-orange-500 shrink-0" />
                )}
              </button>
            ))
          )}
        </div>

        {pagination.last_page > 1 && (
          <div className="px-6 pb-4 shrink-0">
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

        <div className="px-6 py-4 border-t border-gray-100 flex gap-3 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => selected && onConfirm(selected)}
            disabled={!selected || isAssigning}
            className="flex-1 px-4 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors shadow-sm shadow-orange-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAssigning ? "Assigning…" : "Assign Agent"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// SettleOrderModal
// ---------------------------------------------------------------------------
const SettleOrderModal = ({
  isOpen,
  onClose,
  onConfirm,
  order,
  isSettling,
}) => {
  const [paymentType, setPaymentType] = useState("cash");
  const [posService, setPosService] = useState("OPay");
  const [bankAccount, setBankAccount] = useState("OPayFirst");
  const [action, setAction] = useState("confirmed");

  useEffect(() => {
    if (isOpen) {
      setPaymentType("cash");
      setPosService("OPay");
      setBankAccount("OPayFirst");
      setAction("confirmed");
    }
  }, [isOpen, order?.id]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Confirm Payment</h2>
            {order && (
              <p className="text-xs text-gray-400 mt-0.5">
                Order #{order.order_number}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method
            </label>
            <select
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none"
            >
              <option value="cash">Cash</option>
              <option value="pos">POS</option>
              <option value="transfer">Transfer</option>
            </select>
          </div>

          {paymentType === "pos" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                POS Service
              </label>
              <select
                value={posService}
                onChange={(e) => setPosService(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none"
              >
                <option value="OPay">OPay</option>
              </select>
            </div>
          )}

          {paymentType === "transfer" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank Account
              </label>
              <select
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none"
              >
                <option value="OPayFirst">OPay - 6550510874</option>
                <option value="OPaySecond">OPay - 6425460090</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Next Action
            </label>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="action"
                  value="confirmed"
                  checked={action === "confirmed"}
                  onChange={(e) => setAction(e.target.value)}
                  className="w-4 h-4 text-orange-500 focus:ring-orange-300 border-gray-300"
                />
                <span className="text-sm text-gray-700">Confirm Order</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="action"
                  value="send_to_kitchen"
                  checked={action === "send_to_kitchen"}
                  onChange={(e) => setAction(e.target.value)}
                  className="w-4 h-4 text-orange-500 focus:ring-orange-300 border-gray-300"
                />
                <span className="text-sm text-gray-700">Send to Kitchen</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="action"
                  value="complete"
                  checked={action === "complete"}
                  onChange={(e) => setAction(e.target.value)}
                  className="w-4 h-4 text-orange-500 focus:ring-orange-300 border-gray-300"
                />
                <span className="text-sm text-gray-700">Complete Order</span>
              </label>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              onConfirm({
                payment_type: paymentType,
                pos_service: paymentType === "pos" ? posService : undefined,
                bank_account:
                  paymentType === "transfer" ? bankAccount : undefined,
                action: action === "confirmed" ? undefined : action,
              })
            }
            disabled={isSettling}
            className="flex-1 px-4 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors shadow-sm shadow-orange-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSettling ? "Updating…" : "Update Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// OrderManagement
// ---------------------------------------------------------------------------
const OrderManagement = () => {
  const navigate = useNavigate();
  const { user, outlet } = useAuth();
  const { showToast } = useToast();

  const roleTabs = TABS_BY_ROLE[user.role] ?? [
    "all",
    ...Object.keys(STATUS_CONFIG),
  ];
  const [activeTab, setActiveTab] = useState(roleTabs[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // ── Outlet filter (admin only) ─────────────────────────────────────────────
  const isAdmin = user.role === "admin";
  const [outlets, setOutlets] = useState([]);
  const [selectedOutletId, setSelectedOutletId] = useState(null); // null until outlets load
  const [isOutletsLoading, setIsOutletsLoading] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;
    const fetchOutlets = async () => {
      setIsOutletsLoading(true);
      try {
        const { data } = await api.get("/outlets");
        const list = data?.data ?? data ?? [];
        const outletList = Array.isArray(list) ? list : [];
        setOutlets(outletList);
        // Default to "All Outlets" (null) — user picks from dropdown
      } catch (err) {
        console.error("Failed to fetch outlets:", err);
      } finally {
        setIsOutletsLoading(false);
      }
    };
    fetchOutlets();
  }, [isAdmin]);

  const handleOutletChange = (nextId) => {
    setSelectedOutletId(nextId);
    setPage(1);
  };

  const [orders, setOrders] = useState([]);
  const [allKitchenOrders, setAllKitchenOrders] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    from: 0,
    to: 0,
    per_page: 15,
  });
  const [page, setPage] = useState(1);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // General status-change loading state (keyed by order ID)
  const [changingIds, setChangingIds] = useState(new Set());

  // Separate loading state for "Start Processing" actions (keyed by order ID)
  const [processingIds, setProcessingIds] = useState(new Set());

  // Separate loading state for "Mark as Ready" actions (keyed by order ID)
  const [markingReadyIds, setMarkingReadyIds] = useState(new Set());

  // Separate loading state for "Mark as Completed" actions (keyed by order ID)
  const [completingIds, setCompletingIds] = useState(new Set());

  // Separate loading state for cancellation actions (keyed by order ID)
  const [cancellingIds, setCancellingIds] = useState(new Set());

  // Separate loading state exclusively for "Send to Kitchen" (keyed by order ID)
  // This ensures the send-to-kitchen spinner never bleeds into other action buttons
  const [sendingToKitchenIds, setSendingToKitchenIds] = useState(new Set());

  const [loadingOrderDetails, setLoadingOrderDetails] = useState(null);

  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinError, setPinError] = useState(null);
  const [isVerifyingPin, setIsVerifyingPin] = useState(false);
  const [pendingPinOrder, setPendingPinOrder] = useState(null);

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignTargetOrder, setAssignTargetOrder] = useState(null);
  const [isAssigning, setIsAssigning] = useState(false);

  const [isSettleModalOpen, setIsSettleModalOpen] = useState(false);
  const [settleTargetOrder, setSettleTargetOrder] = useState(null);
  const [isSettling, setIsSettling] = useState(false);

  const [cancelModal, setCancelModal] = useState({ open: false, order: null });

  const [deliveryCounts, setDeliveryCounts] = useState({
    all: 0,
    available: 0,
    active: 0,
    completed: 0,
  });

  // Separate loading state for Accept/Ignore actions (delivery agent)
  const [acceptingIds, setAcceptingIds] = useState(new Set());
  const [ignoringIds, setIgnoringIds] = useState(new Set());

  // ── Loading-state helpers ──────────────────────────────────────────────────

  const setChanging = (id) => setChangingIds((prev) => new Set(prev).add(id));
  const clearChanging = (id) =>
    setChangingIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });

  const setProcessing = (id) =>
    setProcessingIds((prev) => new Set(prev).add(id));
  const clearProcessing = (id) =>
    setProcessingIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });

  const setMarkingReady = (id) =>
    setMarkingReadyIds((prev) => new Set(prev).add(id));
  const clearMarkingReady = (id) =>
    setMarkingReadyIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });

  const setCompleting = (id) =>
    setCompletingIds((prev) => new Set(prev).add(id));
  const clearCompleting = (id) =>
    setCompletingIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });

  const setCancelling = (id) =>
    setCancellingIds((prev) => new Set(prev).add(id));
  const clearCancelling = (id) =>
    setCancellingIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });

  const setSendingToKitchen = (id) =>
    setSendingToKitchenIds((prev) => new Set(prev).add(id));
  const clearSendingToKitchen = (id) =>
    setSendingToKitchenIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });

  const setAccepting = (id) =>
    setAcceptingIds((prev) => new Set(prev).add(id));
  const clearAccepting = (id) =>
    setAcceptingIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });

  const setIgnoring = (id) =>
    setIgnoringIds((prev) => new Set(prev).add(id));
  const clearIgnoring = (id) =>
    setIgnoringIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, activeTab, searchQuery, selectedOutletId]);

  // ── Data fetching ──────────────────────────────────────────────────────────

  // Search state
  const [searchInput, setSearchInput] = useState("");

  // Debounced search effect
  useEffect(() => {
    const timerId = setTimeout(() => {
      setSearchQuery(searchInput);
      setPage(1); // Reset to first page when searching
    }, 300); // 300ms delay

    return () => clearTimeout(timerId);
  }, [searchInput]);

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchQuery("");
    setPage(1);
  };

  const fetchOrders = async (silent = false) => {
    if (silent) {
      setIsRefreshing(true);
    } else {
      setIsLoadingOrders(true);
    }
    try {
      if (user.role === "kitchen") {
        let rawOrders = allKitchenOrders;

        const sortDescending = (items) =>
          [...items].sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime(),
          );

        // Kitchen only sees orders that were explicitly sent via "Send to Kitchen"
        const response = await api.get("/kitchen/orders/confirmed", {
          params: outlet?.id ? { outlet_id: outlet.id } : undefined,
        });
        const payload = response?.data;
        const data = payload?.data ?? payload ?? [];
        rawOrders = Array.isArray(data) ? data : [];
        rawOrders = sortDescending(rawOrders);
        setAllKitchenOrders(rawOrders);

        // Apply search filter if search query exists
        let filteredOrders = rawOrders;
        if (searchQuery.trim()) {
          const searchLower = searchQuery.toLowerCase().trim();
          filteredOrders = rawOrders.filter((order) => {
            // Search by Order ID
            if (order.order_number?.toLowerCase().includes(searchLower)) {
              return true;
            }
            // Search by customer phone
            if (order.customer_phone?.toLowerCase().includes(searchLower)) {
              return true;
            }
            // Search by customer email
            if (order.customer_email?.toLowerCase().includes(searchLower)) {
              return true;
            }
            // Search by customer name
            if (order.customer_name?.toLowerCase().includes(searchLower)) {
              return true;
            }
            // Search by transaction reference
            if (
              order.transaction_reference?.toLowerCase().includes(searchLower)
            ) {
              return true;
            }
            // Search by payment reference
            if (order.payment_reference?.toLowerCase().includes(searchLower)) {
              return true;
            }
            return false;
          });
        }

        const tabFiltered =
          activeTab === "all"
            ? filteredOrders
            : filteredOrders.filter((order) => order.status === activeTab);

        const total = tabFiltered.length;
        const perPage = pagination.per_page;
        const lastPage = Math.max(1, Math.ceil(total / perPage));
        const currentPage = Math.min(page, lastPage);
        const from = total === 0 ? 0 : (currentPage - 1) * perPage + 1;
        const to = Math.min(total, currentPage * perPage);
        const pageOrders = tabFiltered.slice(
          (currentPage - 1) * perPage,
          currentPage * perPage,
        );

        setOrders(pageOrders);
        setPagination((prev) => ({
          ...prev,
          current_page: currentPage,
          last_page: lastPage,
          total,
          from,
          to,
        }));
        if (currentPage !== page) setPage(currentPage);
        return;
      }

      // Build params - always fetch all data for client-side filtering when searching
      const params = { page, per_page: pagination.per_page };

      // Attach outlet filter for admin — always scope to the selected outlet
      if (isAdmin && selectedOutletId) {
        params["outlet_ids[]"] = selectedOutletId;
      }

      // Non-admin roles scope orders to their assigned outlet (except delivery agents)
      if (!isAdmin && outlet?.id && user.role !== "delivery_agent") {
        params["outlet_ids[]"] = outlet.id;
      }

      // Fetch delivery agent counts for tab display (status=all to get full dataset)
      if (user.role === "delivery_agent") {
        try {
          const countParams = {
            status: "all",
            per_page: 1000,
            page: 1,
          };
          if (isAdmin && selectedOutletId) {
            countParams["outlet_ids[]"] = selectedOutletId;
          }
          const countRes = await api.get("/delivery-agent/orders", {
            params: countParams,
          });
          const countRaw = countRes?.data;
          const countData = countRaw?.data ?? countRaw ?? [];
          const countOrders = Array.isArray(countData) ? countData : [];
          setDeliveryCounts({
            all: countRaw?.total ?? countOrders.length,
            available: countOrders.filter((o) => o.status === "ready").length,
            active: countRaw?.total ?? countOrders.length,
            completed: countOrders.filter((o) => o.status === "completed")
              .length,
          });
        } catch (e) {
          // count fetch errors are non-critical
        }
      }

      let response;

      if (searchQuery.trim()) {
        // When searching, fetch a larger dataset to filter client-side
        setIsSearching(true);
        const searchParams = { ...params, per_page: 100 }; // Fetch more records for search
        // Preserve outlet filter when searching
        if (isAdmin && selectedOutletId) {
          searchParams["outlet_ids[]"] = selectedOutletId;
        }

        if (user.role === "admin") {
          response = await api.get("/admin/orders", { params: searchParams });
        } else if (user.role === "supervisor") {
          response = await api.get("/supervisor/orders", {
            params: searchParams,
          });
        } else if (user.role === "attendant") {
          response = await api.get("/attendant/orders", {
            params: searchParams,
          });
        } else if (user.role === "delivery_agent") {
          response = await api.get("/delivery-agent/orders", {
            params: { ...searchParams, status: activeTab },
          });
        }

        // Apply client-side filtering for multi-field search
        const rawData = response?.data;
        const allData = rawData?.data ?? rawData;
        const allOrders = Array.isArray(allData) ? allData : [];

        const searchLower = searchQuery.toLowerCase().trim();
        const filteredOrders = allOrders.filter((order) => {
          // Search by Order ID
          if (order.order_number?.toLowerCase().includes(searchLower)) {
            return true;
          }
          // Search by customer phone
          if (order.customer_phone?.toLowerCase().includes(searchLower)) {
            return true;
          }
          // Search by customer email
          if (order.customer_email?.toLowerCase().includes(searchLower)) {
            return true;
          }
          // Search by customer name
          if (order.customer_name?.toLowerCase().includes(searchLower)) {
            return true;
          }
          // Search by transaction reference
          if (
            order.transaction_reference?.toLowerCase().includes(searchLower)
          ) {
            return true;
          }
          // Search by payment reference
          if (order.payment_reference?.toLowerCase().includes(searchLower)) {
            return true;
          }
          return false;
        });

        // Apply status tab filtering (API already filters for delivery_agent)
        const tabFiltered =
          user.role === "delivery_agent"
            ? filteredOrders
            : activeTab === "all"
              ? filteredOrders
              : filteredOrders.filter((order) => order.status === activeTab);

        // Apply pagination to filtered results
        const total = tabFiltered.length;
        const perPage = pagination.per_page;
        const lastPage = Math.max(1, Math.ceil(total / perPage));
        const currentPage = Math.min(page, lastPage);
        const from = total === 0 ? 0 : (currentPage - 1) * perPage + 1;
        const to = Math.min(total, currentPage * perPage);
        const pageOrders = tabFiltered.slice(
          (currentPage - 1) * perPage,
          currentPage * perPage,
        );

        setOrders(pageOrders);
        setPagination({
          current_page: currentPage,
          last_page: lastPage,
          total,
          from,
          to,
          per_page: pagination.per_page,
        });
        if (currentPage !== page) setPage(currentPage);
        return;
      } else {
        // Use regular endpoints when no search query
        if (user.role === "admin") {
          response = await api.get("/admin/orders", { params });
        } else if (user.role === "supervisor") {
          response = await api.get("/supervisor/orders", { params });
        } else if (user.role === "delivery_agent") {
          response = await api.get("/delivery-agent/orders", {
            params: { ...params, status: activeTab },
          });
        } else if (user.role === "attendant") {
          response = await api.get("/attendant/orders", { params });
        }
      }

      const rawData = response?.data;
      const pageData = rawData?.data ?? rawData;
      const pageOrders = Array.isArray(pageData) ? pageData : [];

      setOrders(pageOrders);
      setPagination({
        current_page: rawData?.current_page ?? page,
        last_page: rawData?.last_page ?? 1,
        total: rawData?.total ?? pageOrders.length,
        from: rawData?.from ?? (pageOrders.length ? 1 : 0),
        to: rawData?.to ?? pageOrders.length,
        per_page: rawData?.per_page ?? pagination.per_page,
      });
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      showToast("Failed to fetch orders", "error");
    } finally {
      if (silent) {
        setIsRefreshing(false);
      } else {
        setIsLoadingOrders(false);
      }
      setIsSearching(false);
    }
  };

  // Keep a ref so the interval always calls fetchOrders with the latest state,
  // avoiding the stale-closure problem where the interval would ignore
  // the currently selected outlet.
  const fetchOrdersRef = useRef(null);
  fetchOrdersRef.current = fetchOrders;

  useEffect(() => {
    const interval = setInterval(() => {
      fetchOrdersRef.current(true);
    }, 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getVisiblePageNumbers = () => {
    const totalPages = pagination.last_page;
    const current = pagination.current_page;

    if (totalPages <= 7) {
      if (totalPages <= 1) return [];
      return Array.from(
        { length: Math.max(0, totalPages - 2) },
        (_, i) => i + 2,
      );
    }

    let start = Math.max(2, current + 1);
    let end = start + 5;
    if (end > totalPages - 1) {
      end = totalPages - 1;
      start = Math.max(2, end - 5);
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const loadOrderDetails = async (orderId) => {
    const endpointByRole = {
      admin: `/admin/orders/${orderId}`,
      supervisor: `/supervisor/orders/${orderId}`,
      kitchen: `/kitchen/orders/${orderId}`,
      delivery_agent: `/delivery-agent/orders/${orderId}`,
      attendant: `/attendant/orders/${orderId}`,
    };
    const endpoint = endpointByRole[user.role];
    if (!endpoint) return;
    try {
      setLoadingOrderDetails(orderId);
      const { data } = await api.get(endpoint);
      setSelectedOrder(data);
      setIsDetailsOpen(true);
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to load order details",
        "error",
      );
    } finally {
      setLoadingOrderDetails(null);
    }
  };

  // ── Send to Kitchen ────────────────────────────────────────────────────────
  // Uses its own dedicated loading set (sendingToKitchenIds) so it never
  // triggers the "Updating…" state on other action buttons for the same order.

  const handleSendToKitchen = async (orderId) => {
    setSendingToKitchen(orderId);
    try {
      await api.post(`/admin/orders/${orderId}/send-to-kitchen`);
      showToast("Order sent to kitchen successfully", "success");
      fetchOrders(true);
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to send order to kitchen",
        "error",
      );
    } finally {
      clearSendingToKitchen(orderId);
    }
  };

  // ── Assign agent ───────────────────────────────────────────────────────────

  const openAssignModal = (order) => {
    setAssignTargetOrder(order);
    setIsAssignModalOpen(true);
  };

  const handleAssignAgent = async (agentId) => {
    if (!assignTargetOrder) return;
    setIsAssigning(true);
    try {
      await api.patch(
        `/supervisor/orders/${assignTargetOrder.id}/assign-delivery-agent`,
        { delivery_agent_id: agentId },
      );
      setOrders((prev) =>
        prev.map((o) =>
          o.id === assignTargetOrder.id ? { ...o, status: "dispatched" } : o,
        ),
      );
      showToast("Delivery agent assigned successfully", "success");
      setIsAssignModalOpen(false);
      setAssignTargetOrder(null);
      fetchOrders(true);
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to assign delivery agent",
        "error",
      );
    } finally {
      setIsAssigning(false);
    }
  };

  // ── PIN flow ───────────────────────────────────────────────────────────────

  const openPinModal = (orderId) => {
    setPendingPinOrder({ orderId });
    setPinError(null);
    setIsPinModalOpen(true);
  };

  const handlePinConfirm = async (pin) => {
    const { orderId } = pendingPinOrder;
    setIsVerifyingPin(true);
    setCompleting(orderId);
    setPinError(null);
    try {
      const endpoint =
        user.role === "supervisor" || user.role === "admin"
          ? `/supervisor/orders/${orderId}/complete`
          : `/delivery-agent/orders/${orderId}/complete`;
      await api.post(endpoint, { delivery_pin: pin });
      showToast("Delivery completed successfully", "success");
      setIsPinModalOpen(false);
      setPendingPinOrder(null);
      fetchOrders(true);
      if (selectedOrder?.id === orderId) {
        const { data } = await api.get(`/admin/orders/${orderId}`);
        setSelectedOrder(data);
      }
    } catch (err) {
      setPinError(
        err.response?.data?.message || "Incorrect PIN. Please try again",
      );
    } finally {
      setIsVerifyingPin(false);
      clearCompleting(orderId);
    }
  };

  const handleDeliveryComplete = async (orderId) => {
    setCompleting(orderId);
    try {
      await api.post(`/delivery-agent/orders/${orderId}/complete`);
      showToast("Order completed successfully", "success");
      fetchOrders(true);
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to complete order",
        "error",
      );
    } finally {
      clearCompleting(orderId);
    }
  };

  // ── Accept / Ignore Order (delivery agent) ─────────────────────────────────

  const handleAcceptOrder = async (orderId) => {
    setAccepting(orderId);
    try {
      await api.post(`/delivery-agent/orders/${orderId}/accept`);
      showToast("Order accepted successfully", "success");
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, status: "dispatched", delivery_agent_id: user.id }
            : o,
        ),
      );
      fetchOrders(true);
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to accept order",
        "error",
      );
    } finally {
      clearAccepting(orderId);
    }
  };

  const handleIgnoreOrder = async (orderId) => {
    setIgnoring(orderId);
    try {
      await api.post(`/delivery-agent/orders/${orderId}/ignore`);
      showToast("Order ignored", "success");
      fetchOrders(true);
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to ignore order",
        "error",
      );
    } finally {
      clearIgnoring(orderId);
    }
  };

  // ── Cancel Order Confirmation ───────────────────────────────────────────────────

  const openCancelModal = (order) => {
    setCancelModal({ open: true, order });
  };

  const closeCancelModal = () => {
    setCancelModal({ open: false, order: null });
  };

  const confirmCancelOrder = async () => {
    if (!cancelModal.order) return;
    handleCancelOrder(cancelModal.order.id);
  };

  // ── Cancel Order ───────────────────────────────────────────────────────────

  const handleCancelOrder = async (orderId) => {
    setCancelling(orderId);
    closeCancelModal();
    try {
      await api.put(`/admin/orders/${orderId}`, { status: "cancelled" });
      showToast("Order cancelled successfully", "success");
      fetchOrders(true);
      if (selectedOrder?.id === orderId) {
        const { data } = await api.get(`/admin/orders/${orderId}`);
        setSelectedOrder(data);
      }
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to cancel order",
        "error",
      );
    } finally {
      clearCancelling(orderId);
    }
  };

  // ── Status updates ─────────────────────────────────────────────────────────

  const handleStatusUpdate = async (order, actionType) => {
    const { id: orderId, status } = order;

    // Use different loading states based on the action type
    if (actionType === "processing") {
      setProcessing(orderId);
    } else if (actionType === "ready") {
      setMarkingReady(orderId);
    } else {
      setChanging(orderId);
    }

    try {
      if (user.role === "kitchen") {
        if (status === "in_kitchen") {
          await api.post(`/kitchen/orders/preparing`, { order_ids: [orderId] });
          showToast("Order is now being processed", "success");
        } else if (status === "processing") {
          await api.post(`/kitchen/orders/ready`, { order_ids: [orderId] });
          showToast("Order marked as ready", "success");
        }
      } else if (
        user.role === "admin" ||
        user.role === "supervisor" ||
        user.role === "attendant"
      ) {
        let nextStatus;
        if (actionType === "processing") {
          nextStatus = "processing";
        } else if (actionType === "ready") {
          nextStatus = "ready";
        } else {
          // Default fallback logic
          nextStatus = status === "confirmed" ? "processing" : "ready";
        }
        await api.put(`/admin/orders/${orderId}`, { status: nextStatus });
        showToast(
          nextStatus === "processing"
            ? "Order is now being processed"
            : "Order is ready for pickup",
          "success",
        );
      }
      fetchOrders(true);
      if (selectedOrder?.id === orderId) {
        const { data } = await api.get(`/admin/orders/${orderId}`);
        setSelectedOrder(data);
      }
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to update order status",
        "error",
      );
    } finally {
      if (actionType === "processing") {
        clearProcessing(orderId);
      } else if (actionType === "ready") {
        clearMarkingReady(orderId);
      } else {
        clearChanging(orderId);
      }
    }
  };

  const handleNonDeliveryComplete = async (orderId) => {
    setCompleting(orderId);
    try {
      await api.put(`/admin/orders/${orderId}`, { status: "completed" });
      showToast("Order marked as completed", "success");
      fetchOrders(true);
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to complete order",
        "error",
      );
    } finally {
      clearCompleting(orderId);
    }
  };

  // Complete a confirmed order directly — used for counter-pickup items that
  // don't need to go through the kitchen at all.
  const handleCompleteFromConfirmed = async (orderId) => {
    setCompleting(orderId);
    try {
      await api.put(`/admin/orders/${orderId}`, { status: "completed" });
      showToast("Order marked as completed", "success");
      fetchOrders(true);
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to complete order",
        "error",
      );
    } finally {
      clearCompleting(orderId);
    }
  };

  const handleSettleOrder = async (settleData) => {
    if (!settleTargetOrder) return;
    setIsSettling(true);
    setChanging(settleTargetOrder.id);
    try {
      await api.patch(
        `/admin/orders/${settleTargetOrder.id}/settle`,
        settleData,
      );
      showToast("Order payment confirmed and updated", "success");
      setIsSettleModalOpen(false);
      setSettleTargetOrder(null);
      fetchOrders(true);
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to update order",
        "error",
      );
    } finally {
      setIsSettling(false);
      clearChanging(settleTargetOrder.id);
    }
  };

  const handleConfirmPayment = async (orderId) => {
    setChanging(orderId);
    try {
      await api.put(`/admin/orders/${orderId}`, { status: "confirmed" });
      showToast("Payment confirmed successfully", "success");
      fetchOrders(true);
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to confirm payment",
        "error",
      );
    } finally {
      clearChanging(orderId);
    }
  };

  // ── Action button renderer ─────────────────────────────────────────────────
  // Returns an array of button elements. Each will be rendered full-width,
  // stacked below the "Details" button on its own row.

  const renderActionButtons = (order) => {
    const { id, status, order_type } = order;
    const busy =
      changingIds.has(id) ||
      processingIds.has(id) ||
      completingIds.has(id) ||
      sendingToKitchenIds.has(id) ||
      cancellingIds.has(id) ||
      markingReadyIds.has(id);
    const isProcessing = processingIds.has(id);
    const isMarkingReady = markingReadyIds.has(id);
    const isCompleting = completingIds.has(id);
    const sendingToKitchen = sendingToKitchenIds.has(id);
    const isCancelling = cancellingIds.has(id);

    // Full-width orange action button with icon
    const OrangeBtn = ({ label, onClick, actionType, icon: Icon }) => {
      let isDisabled = busy;
      let loadingText = "Updating...";

      if (actionType === "processing") {
        isDisabled = isProcessing;
        loadingText = "Processing...";
      } else if (actionType === "ready") {
        isDisabled = isMarkingReady;
        loadingText = "Marking Ready...";
      } else if (actionType === "completing") {
        isDisabled = isCompleting;
        loadingText = "Completing...";
      } else if (actionType === "confirming") {
        isDisabled = changingIds.has(id);
        loadingText = "Confirming...";
      }

      return (
        <button
          onClick={onClick}
          disabled={isDisabled}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 rounded-xl text-sm font-medium text-white hover:bg-orange-600 transition-colors shadow-sm shadow-orange-200 disabled:bg-orange-500/50 disabled:cursor-not-allowed"
        >
          {isDisabled ? (
            loadingText
          ) : (
            <>
              {Icon && <Icon className="w-4 h-4" />}
              {label}
            </>
          )}
        </button>
      );
    };

    // Full-width red cancel button
    const CancelBtn = () => (
      <button
        onClick={() => openCancelModal(order)}
        disabled={isCancelling}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 rounded-xl text-sm font-medium text-white hover:bg-red-600 transition-colors shadow-sm shadow-red-200 disabled:bg-red-500/50 disabled:cursor-not-allowed"
      >
        <XCircle className="w-4 h-4" />
        {isCancelling ? "Cancelling..." : "Cancel Order"}
      </button>
    );

    // Full-width assign button
    const AssignBtn = ({ onClickFn }) => (
      <button
        onClick={onClickFn}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 rounded-xl text-sm font-medium text-white hover:bg-orange-600 transition-colors shadow-sm shadow-orange-200"
      >
        <UserPlus className="w-4 h-4" />
        Assign Agent
      </button>
    );

    // Send-to-Kitchen button uses its own isolated loading state (sendingToKitchen)
    // so it never sets `busy` and never disables unrelated action buttons on the same card.
    const SendToKitchenBtn = () => (
      <button
        onClick={() => handleSendToKitchen(id)}
        disabled={sendingToKitchen}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 rounded-xl text-sm font-medium text-white hover:bg-orange-600 transition-colors shadow-sm shadow-orange-200 disabled:bg-orange-500/50 disabled:cursor-not-allowed"
      >
        <Send className="w-4 h-4" />
        {sendingToKitchen ? "Sending…" : "Send to Kitchen"}
      </button>
    );

    const buttons = [];

    // ── Kitchen ──────────────────────────────────────────────────────────────
    if (user.role === "kitchen") {
      if (status === "confirmed" || status === "in_kitchen")
        buttons.push(
          <OrangeBtn
            key="start"
            label="Start Processing"
            onClick={() => handleStatusUpdate(order, "processing")}
            actionType="processing"
            icon={ChefHat}
          />,
        );
      if (status === "processing")
        buttons.push(
          <OrangeBtn
            key="ready"
            label="Mark as Ready"
            onClick={() => handleStatusUpdate(order, "ready")}
            actionType="ready"
            icon={PackageCheck}
          />,
        );
    }

    // ── Admin ─────────────────────────────────────────────────────────────────
    if (user.role === "admin") {
      if (status === "pending") {
        const isGateway =
          order.payment_type === "gateway" ||
          order.payment_type?.toLowerCase().includes("paystack");

        buttons.push(
          <OrangeBtn
            key="confirm-payment"
            label="Confirm Payment"
            onClick={() => {
              if (isGateway) {
                handleConfirmPayment(id);
              } else {
                setSettleTargetOrder(order);
                setIsSettleModalOpen(true);
              }
            }}
            actionType="confirming"
            icon={CreditCard}
          />,
        );
      }
      if (status === "confirmed") {
        buttons.push(<SendToKitchenBtn key="send-kitchen" />);
        buttons.push(
          <OrangeBtn
            key="ready"
            label="Mark as Ready"
            onClick={() => handleStatusUpdate(order, "ready")}
            actionType="ready"
            icon={PackageCheck}
          />,
        );
        if (order_type === "delivery")
          buttons.push(
            <AssignBtn key="assign" onClickFn={() => openAssignModal(order)} />,
          );
      }
      if (status === "in_kitchen") {
        buttons.push(
          <OrangeBtn
            key="process"
            label="Start Processing"
            onClick={() => handleStatusUpdate(order, "processing")}
            actionType="processing"
            icon={ChefHat}
          />,
        );
      }
      if (status === "processing") {
        buttons.push(
          <OrangeBtn
            key="ready"
            label="Mark as Ready"
            onClick={() => handleStatusUpdate(order, "ready")}
            actionType="ready"
            icon={PackageCheck}
          />,
        );
      }
      if (status === "ready" && order_type === "delivery") {
        buttons.push(
          <AssignBtn key="assign" onClickFn={() => openAssignModal(order)} />,
        );
      }
      if (status === "ready" && order_type !== "delivery")
        buttons.push(
          <OrangeBtn
            key="complete-ready"
            label="Mark as Completed"
            onClick={() => handleNonDeliveryComplete(id)}
            actionType="completing"
            icon={CheckCircle}
          />,
        );
      if (status === "dispatched")
        buttons.push(
          <OrangeBtn
            key="complete-dispatched"
            label="Complete Delivery"
            onClick={() => openPinModal(id)}
            actionType="completing"
            icon={Truck}
          />,
        );

      // Add cancel button for all non-cancelled orders (except those paid via Paystack/gateway)
      if (
        status !== "cancelled" &&
        status !== "completed" &&
        order.payment_type !== "gateway" &&
        !order.payment_type?.toLowerCase().includes("paystack")
      ) {
        buttons.push(
          <CancelBtn key="cancel" onClick={() => openCancelModal(order)} />,
        );
      }
    }

    // ── Delivery agent ────────────────────────────────────────────────────────
    if (user.role === "delivery_agent") {
      if (status === "ready") {
        const isAccepting = acceptingIds.has(id);
        const isIgnoring = ignoringIds.has(id);
        buttons.push(
          <button
            key="accept"
            onClick={() => handleAcceptOrder(id)}
            disabled={isAccepting || isIgnoring}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500 rounded-xl text-sm font-medium text-white hover:bg-green-600 transition-colors shadow-sm shadow-green-200 disabled:bg-green-500/50 disabled:cursor-not-allowed"
          >
            {isAccepting ? (
              "Accepting..."
            ) : (
              <><Check className="w-4 h-4" /> Accept Order</>
            )}
          </button>,
          <button
            key="ignore"
            onClick={() => handleIgnoreOrder(id)}
            disabled={isAccepting || isIgnoring}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 rounded-xl text-sm font-medium text-white hover:bg-red-600 transition-colors shadow-sm shadow-red-200 disabled:bg-red-500/50 disabled:cursor-not-allowed"
          >
            {isIgnoring ? (
              "Ignoring..."
            ) : (
              <><X className="w-4 h-4" /> Ignore Order</>
            )}
          </button>,
        );
      }
      if (status === "dispatched") {
        const isAssignedToMe =
          activeTab === "active" || order.delivery_agent_id === user.id;
        if (isAssignedToMe)
          buttons.push(
            <OrangeBtn
              key="complete"
              label="Complete Delivery"
              onClick={() => openPinModal(id)}
              actionType="completing"
              icon={CheckCircle}
            />,
          );
      }
    }

    // ── Supervisor ────────────────────────────────────────────────────────────
    if (user.role === "supervisor") {
      if (status === "pending") {
        const isGateway =
          order.payment_type === "gateway" ||
          order.payment_type?.toLowerCase().includes("paystack");

        buttons.push(
          <OrangeBtn
            key="confirm-payment"
            label="Confirm Payment"
            onClick={() => {
              if (isGateway) {
                handleConfirmPayment(id);
              } else {
                setSettleTargetOrder(order);
                setIsSettleModalOpen(true);
              }
            }}
            actionType="confirming"
            icon={CreditCard}
          />,
        );
      }
      if (status === "confirmed") {
        buttons.push(<SendToKitchenBtn key="send-kitchen" />);
        buttons.push(
          <OrangeBtn
            key="ready"
            label="Mark as Ready"
            onClick={() => handleStatusUpdate(order, "ready")}
            actionType="ready"
            icon={PackageCheck}
          />,
        );
        if (order_type === "delivery")
          buttons.push(
            <AssignBtn key="assign" onClickFn={() => openAssignModal(order)} />,
          );
      }
      if (status === "in_kitchen") {
        buttons.push(
          <OrangeBtn
            key="process"
            label="Start Processing"
            onClick={() => handleStatusUpdate(order, "processing")}
            actionType="processing"
            icon={ChefHat}
          />,
        );
      }
      if (status === "processing") {
        buttons.push(
          <OrangeBtn
            key="ready"
            label="Mark as Ready"
            onClick={() => handleStatusUpdate(order, "ready")}
            actionType="ready"
            icon={PackageCheck}
          />,
        );
      }
      if (status === "ready" && order_type === "delivery")
        buttons.push(
          <AssignBtn key="assign" onClickFn={() => openAssignModal(order)} />,
        );
      if (status === "ready" && order_type !== "delivery")
        buttons.push(
          <OrangeBtn
            key="complete-ready"
            label="Mark as Completed"
            onClick={() => handleNonDeliveryComplete(id)}
            actionType="completing"
            icon={CheckCircle}
          />,
        );
      if (status === "dispatched")
        buttons.push(
          <OrangeBtn
            key="complete-dispatched"
            label="Complete Delivery"
            onClick={() => openPinModal(id)}
            actionType="completing"
            icon={Truck}
          />,
        );

      // Add cancel button for all non-cancelled orders (except those paid via Paystack/gateway)
      if (
        status !== "cancelled" &&
        status !== "completed" &&
        order.payment_type !== "gateway" &&
        !order.payment_type?.toLowerCase().includes("paystack")
      ) {
        buttons.push(
          <CancelBtn key="cancel" onClick={() => openCancelModal(order)} />,
        );
      }
    }

    // ── Attendant ─────────────────────────────────────────────────────────────
    if (user.role === "attendant") {
      if (status === "pending") {
        const isGateway =
          order.payment_type === "gateway" ||
          order.payment_type?.toLowerCase().includes("paystack");

        buttons.push(
          <OrangeBtn
            key="confirm"
            label="Confirm Payment"
            onClick={() => {
              if (isGateway) {
                handleConfirmPayment(id);
              } else {
                setSettleTargetOrder(order);
                setIsSettleModalOpen(true);
              }
            }}
            actionType="confirming"
            icon={CreditCard}
          />,
        );
      }
      if (status === "confirmed") {
        // Attendant can send to kitchen for items that need preparation,
        // OR mark as ready for items available at the counter.
        buttons.push(<SendToKitchenBtn key="send-kitchen" />);
        if (order_type !== "delivery") {
          buttons.push(
            <OrangeBtn
              key="complete-confirmed"
              label="Mark as Completed"
              onClick={() => handleNonDeliveryComplete(id)}
              actionType="completing"
              icon={CheckCircle}
            />,
          );
        }
      }
      if (status === "ready" && order_type !== "delivery")
        buttons.push(
          <OrangeBtn
            key="complete-ready"
            label="Mark as Completed"
            onClick={() => handleNonDeliveryComplete(id)}
            actionType="completing"
            icon={CheckCircle}
          />,
        );
    }

    return buttons;
  };

  // ── Filtered orders ────────────────────────────────────────────────────────

  const filteredOrders =
    user.role === "delivery_agent"
      ? orders
      : activeTab === "all"
        ? orders.filter((o) => {
            // For kitchen, delivery agent, and attendant roles, exclude cancelled orders from "All Orders"
            if (
              (user.role === "kitchen" ||
                user.role === "delivery_agent" ||
                user.role === "attendant") &&
              o.status === "cancelled"
            ) {
              return false;
            }
            return true;
          })
        : orders.filter((o) => o.status === activeTab);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      <AssignAgentModal
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false);
          setAssignTargetOrder(null);
        }}
        onConfirm={handleAssignAgent}
        isAssigning={isAssigning}
        order={assignTargetOrder}
      />
      <DeliveryPinModal
        isOpen={isPinModalOpen}
        onClose={() => {
          setIsPinModalOpen(false);
          setPendingPinOrder(null);
          setPinError(null);
        }}
        onConfirm={handlePinConfirm}
        isVerifying={isVerifyingPin}
        error={pinError}
      />
      <OrderDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
      />
      <SettleOrderModal
        isOpen={isSettleModalOpen}
        onClose={() => {
          setIsSettleModalOpen(false);
          setSettleTargetOrder(null);
        }}
        onConfirm={handleSettleOrder}
        order={settleTargetOrder}
        isSettling={isSettling}
      />

      {/* Cancel Order Confirmation Modal */}
      {cancelModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeCancelModal}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Cancel Order
                </h2>
                {cancelModal.order && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    Order #{cancelModal.order.order_number}
                  </p>
                )}
              </div>
              <button
                onClick={closeCancelModal}
                className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 py-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <X className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    Are you sure you want to cancel this order?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              {cancelModal.order && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Order Total:</span>
                    <span className="font-bold text-orange-500">
                      {new Intl.NumberFormat("en-NG", {
                        style: "currency",
                        currency: "NGN",
                        minimumFractionDigits: 0,
                      }).format(Math.ceil(cancelModal.order.final_amount))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-600">Customer:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {cancelModal.order.customer_email}
                    </span>
                  </div>
                </div>
              )}

              <div className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
                <strong>Warning:</strong> Cancelling this order will process any
                necessary refunds and notify the customer.
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button
                onClick={closeCancelModal}
                disabled={cancellingIds.has(cancelModal.order?.id)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Keep Order
              </button>
              <button
                onClick={confirmCancelOrder}
                disabled={cancellingIds.has(cancelModal.order?.id)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors shadow-sm shadow-red-200 disabled:bg-red-500/50 disabled:cursor-not-allowed"
              >
                {cancellingIds.has(cancelModal.order?.id)
                  ? "Cancelling…"
                  : "Cancel Order"}
              </button>
            </div>
          </div>
        </div>
      )}

      <DashboardLayout>
        <div className="p-6 space-y-6 bg-gray-50/50 min-h-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Order Management
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Monitor and manage all orders
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Outlet filter — admin only */}
              {isAdmin && (
                <OutletSelect
                  outlets={outlets}
                  selectedId={selectedOutletId}
                  onChange={handleOutletChange}
                  isLoading={isOutletsLoading}
                />
              )}
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by Order ID, Phone, Email, Name or Ref..."
                  onChange={(e) => setSearchInput(e.target.value)}
                  value={searchInput}
                  className="pl-10 pr-10 py-2 w-full sm:w-80 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-colors shadow-sm"
                />
                {searchInput && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                {isSearching && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-orange-500 rounded-full animate-spin" />
                  </div>
                )}
              </div>
              <button
                onClick={() => fetchOrders(true)}
                disabled={isRefreshing}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
              >
                {isRefreshing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                    Refreshing...
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4" />
                    Refresh
                  </>
                )}
              </button>
              {(user?.role === "attendant" ||
                user?.role === "admin" ||
                user?.role === "supervisor") && (
                <button
                  onClick={() => {
                    if (user.role === "attendant") {
                      navigate("/attendant/create-order");
                    }
                    if (user.role === "admin") {
                      navigate("/admin/create-order");
                    }
                    if (user.role === "supervisor") {
                      navigate("/supervisor/create-order");
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors shadow-sm shadow-orange-200"
                >
                  <Plus className="w-4 h-4" />
                  Add Order
                </button>
              )}
            </div>
          </div>

          {/* Status tabs */}
          <div className="bg-white p-2 rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
            <div className="flex items-center gap-2 min-w-max">
              {roleTabs.map((tab) => {
                const count =
                  user.role === "delivery_agent"
                    ? deliveryCounts[tab]
                    : tab === "all"
                      ? orders.filter((o) => {
                          // For kitchen, delivery agent, and attendant roles, exclude cancelled orders from "All Orders" count
                          if (
                            (user.role === "kitchen" ||
                              user.role === "delivery_agent" ||
                              user.role === "attendant") &&
                            o.status === "cancelled"
                          ) {
                            return false;
                          }
                          return true;
                        }).length
                      : orders.filter((o) => o.status === tab).length;
                return (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      setPage(1);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab
                        ? "bg-gray-200 text-gray-900 shadow-sm font-semibold"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {tab === "all" ? "All Orders" : tab === "available" ? "Available Orders" : tab === "active" ? "Active Orders" : getStatusLabel(tab)}{" "}
                    {isLoadingOrders ? (
                      <span className="inline-block w-5 h-3.5 bg-gray-200 rounded animate-pulse align-middle" />
                    ) : (
                      <span>({count})</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search Results Indicator */}
          {searchQuery.trim() && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <Search className="w-4 h-4" />
                <span>
                  Searching across Order ID, Phone, Email, Name & Ref for "
                  {searchQuery}"
                  {!isSearching && (
                    <span className="font-medium ml-1">
                      ({pagination.total}{" "}
                      {pagination.total === 1 ? "order" : "orders"} found)
                    </span>
                  )}
                </span>
              </div>
              <button
                onClick={handleClearSearch}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
              >
                Clear search
              </button>
            </div>
          )}

          {/* Orders grid */}
          {isLoadingOrders && !isRefreshing ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
              <p className="text-gray-500 text-sm font-medium tracking-wide">
                Loading Orders...
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredOrders.length === 0 ? (
                  <div className="col-span-full text-center py-16 text-gray-400 text-sm">
                    {searchQuery.trim() ? (
                      <>
                        <div className="mb-2">
                          <Search className="w-12 h-12 mx-auto text-gray-300" />
                        </div>
                        <div className="font-medium">
                          No orders found for "{searchQuery}"
                        </div>
                        <div className="text-xs mt-1">
                          Try searching with Order ID, Phone, Email, Name or
                          Reference
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="mb-2">
                          <Package className="w-12 h-12 mx-auto text-gray-300" />
                        </div>
                        <div>No orders found.</div>
                      </>
                    )}
                  </div>
                ) : (
                  filteredOrders.map((order) => {
                    const actionButtons = renderActionButtons(order);
                    return (
                      <div
                        key={order.id}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col"
                      >
                        {/* Card header */}
                        <div className="p-5 border-b border-gray-50 flex items-start justify-between">
                          <div className="min-w-0 flex-1">
                            <span className="font-bold text-gray-900 text-lg">
                              #{order.order_number}
                            </span>
                            {user.role === "delivery_agent" ? (
                              <>
                                <div className="text-sm text-gray-500 mt-1">
                                  <span className="font-medium">Pickup:</span>{" "}
                                  {order.restaurant_location ?? "N/A"}
                                </div>
                                <div className="text-sm text-gray-500">
                                  <span className="font-medium">Deliver to:</span>{" "}
                                  {order.delivery_address ?? "N/A"}
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="text-sm text-gray-500 mt-0.5">
                                  {order.customer_email}
                                </div>
                                <div className="text-xs text-gray-400 mt-0.5">
                                  {new Date(order.created_at).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    },
                                  )}{" "}
                                  at{" "}
                                  {new Date(order.created_at).toLocaleTimeString(
                                    "en-US",
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    },
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                          <span
                            className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(order.status)}`}
                          >
                            {getStatusIcon(order.status)}
                            {getStatusLabel(order.status)}
                          </span>
                        </div>

                        {/* Order items */}
                        <div className="p-5 flex-1">
                          {user.role === "delivery_agent" ? (
                            <div className="space-y-3">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Items</span>
                                <span className="font-medium text-gray-900">
                                  {order.total_items ?? 0}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                  Delivery Fee
                                </span>
                                <span className="font-medium text-gray-900">
                                  {new Intl.NumberFormat("en-NG", {
                                    style: "currency",
                                    currency: "NGN",
                                    minimumFractionDigits: 0,
                                  }).format(order.delivery_fee ?? 0)}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="space-y-3 mb-6">
                                {order.order_items?.map((item) => (
                                  <div key={item.id}>
                                    <div className="flex justify-between text-sm">
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
                                        }).format(item.subtotal)}
                                      </span>
                                    </div>
                                    {item.packaging && (
                                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>
                                          Packaging:{" "}
                                          {item.packaging.size_name
                                            .charAt(0)
                                            .toUpperCase() +
                                            item.packaging.size_name.slice(1)}
                                        </span>
                                        <span>
                                          {new Intl.NumberFormat("en-NG", {
                                            style: "currency",
                                            currency: "NGN",
                                            minimumFractionDigits: 0,
                                          }).format(item.packaging.price)}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                              <div className="pt-4 border-t border-dashed border-gray-200 flex items-end justify-between">
                                <span className="font-bold text-gray-900">
                                  Total
                                </span>
                                <span className="text-xl font-bold text-orange-500">
                                  {new Intl.NumberFormat("en-NG", {
                                    style: "currency",
                                    currency: "NGN",
                                    minimumFractionDigits: 0,
                                  }).format(Math.ceil(order.final_amount))}
                                </span>
                              </div>
                            </>
                          )}
                        </div>

                        {/* Card footer */}
                        <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-col gap-2">
                          {/* Details — own row */}
                          <button
                            onClick={() => loadOrderDetails(order.id)}
                            disabled={loadingOrderDetails === order.id}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors shadow-sm disabled:bg-white/50 disabled:cursor-not-allowed"
                          >
                            {loadingOrderDetails === order.id ? (
                              "Loading..."
                            ) : (
                              <>
                                <Eye className="w-4 h-4" />
                                Details
                              </>
                            )}
                          </button>

                          {/* Action buttons — stacked below */}
                          {actionButtons.length > 0 && (
                            <div className="flex flex-col gap-2">
                              {actionButtons}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Pagination */}
              {pagination.last_page > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 border-t border-gray-200 pt-6">
                  <div className="text-sm text-gray-500">
                    Showing {pagination.from} to {pagination.to} of{" "}
                    {pagination.total} orders
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      disabled={pagination.current_page === 1}
                      onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                      className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    <button
                      disabled={pagination.current_page === 1}
                      onClick={() => setPage(1)}
                      className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      First
                    </button>
                    {getVisiblePageNumbers().map((pageNumber) => (
                      <button
                        key={pageNumber}
                        onClick={() => setPage(pageNumber)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 transition-colors ${
                          pagination.current_page === pageNumber
                            ? "bg-orange-500 text-white border-orange-500"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    ))}
                    <button
                      disabled={
                        pagination.current_page === pagination.last_page
                      }
                      onClick={() => setPage(pagination.last_page)}
                      className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Last
                    </button>
                    <button
                      disabled={
                        pagination.current_page === pagination.last_page
                      }
                      onClick={() =>
                        setPage((prev) =>
                          Math.min(pagination.last_page, prev + 1),
                        )
                      }
                      className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </DashboardLayout>
    </>
  );
};

export default OrderManagement;
