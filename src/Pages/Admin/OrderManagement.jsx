import React, { useState, useEffect } from "react";
import DashboardLayout from "../../DashboardLayout/DashboardLayout";
import OrderDetailsModal from "../../Components/Modals/OrderDetailsModal";
import DeliveryPhotoModal from "../../Components/Modals/DeliveryPhotoModal";
import DeliveryPinModal from "../../Components/Modals/DeliveryPinModal";
import {
  FiFilter,
  FiEye,
  FiClock,
  FiCheck,
  FiTruck,
  FiPlus,
  FiX,
  FiUser,
  FiPackage,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

// ---------------------------------------------------------------------------
// Delivery-agent data source
// ---------------------------------------------------------------------------
// DUMMY DATA — replace `fetchDeliveryAgents` body with a real API call once
// the endpoint is available:
//
//   const response = await api.get("/admin/delivery-agents");
//   return response.data.data; // or whatever the shape is
//
// Each agent object must have at least: { id, name, email }
// ---------------------------------------------------------------------------
const DUMMY_DELIVERY_AGENTS = [
  { id: 1, name: "Chidi Okafor", email: "chidi.okafor@dispatch.com" },
  { id: 2, name: "Amaka Eze", email: "amaka.eze@dispatch.com" },
  { id: 3, name: "Emeka Nwosu", email: "emeka.nwosu@dispatch.com" },
  { id: 4, name: "Ngozi Adeyemi", email: "ngozi.adeyemi@dispatch.com" },
  { id: 5, name: "Tunde Obi", email: "tunde.obi@dispatch.com" },
];

/**
 * Fetch delivery agents.
 * Swap the body of this function for a real API call when the endpoint lands.
 */
const fetchDeliveryAgents = async () => {
  const { data } = await api.get("/supervisor/delivery-agents");
  return data;
  // return DUMMY_DELIVERY_AGENTS;
};

// ---------------------------------------------------------------------------
// Status helpers
// ---------------------------------------------------------------------------

/**
 * Single source of truth for all order statuses.
 * Add/remove entries here and tabs + badge colours update everywhere.
 */
const STATUS_CONFIG = {
  pending: { label: "Pending", color: "bg-gray-100 text-gray-600" },
  confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-600" },
  processing: { label: "Processing", color: "bg-purple-100 text-purple-600" },
  ready: { label: "Ready", color: "bg-yellow-100 text-yellow-600" },
  dispatched: { label: "Dispatched", color: "bg-indigo-100 text-indigo-600" },
  completed: { label: "Completed", color: "bg-green-100 text-green-600" },
};

const getStatusColor = (status) =>
  STATUS_CONFIG[status]?.color ?? "bg-gray-100 text-gray-600";

const getStatusLabel = (status) => STATUS_CONFIG[status]?.label ?? status;

const getStatusIcon = (status) => {
  if (status === "completed") return <FiCheck className="w-3 h-3" />;
  if (status === "confirmed") return <FiClock className="w-3 h-3" />;
  if (status === "ready") return <FiPackage className="w-3 h-3" />;
  if (status === "dispatched") return <FiTruck className="w-3 h-3" />;
  return null;
};

// ---------------------------------------------------------------------------
// Per-role tab definitions
// ---------------------------------------------------------------------------
const TABS_BY_ROLE = {
  admin: [
    "all",
    "pending",
    "confirmed",
    "processing",
    "ready",
    "dispatched",
    "completed",
  ],
  supervisor: [
    "all",
    "pending",
    "confirmed",
    "processing",
    "ready",
    "dispatched",
    "completed",
  ],
  // "all" is first so kitchen lands on it by default — orders that are marked
  // ready remain in view instead of disappearing off the active tab.
  kitchen: ["all", "confirmed", "processing"],
  delivery_agent: ["all", "dispatched", "completed"],
  attendant: ["all", "pending", "confirmed", "ready", "completed"],
};

// ---------------------------------------------------------------------------
// AssignAgentModal
// ---------------------------------------------------------------------------
const AssignAgentModal = ({
  isOpen,
  onClose,
  onConfirm,
  agents,
  isLoading,
  isAssigning,
  order,
}) => {
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (isOpen) setSelected(null);
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
            <FiX className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-4 max-h-72 overflow-y-auto space-y-2">
          {isLoading ? (
            <p className="text-sm text-gray-400 text-center py-6">
              Loading agents…
            </p>
          ) : agents.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">
              No delivery agents available.
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
                  <FiCheck className="ml-auto w-4 h-4 text-orange-500 shrink-0" />
                )}
              </button>
            ))
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
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
// OrderManagement
// ---------------------------------------------------------------------------
const OrderManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Each role starts on its own default tab
  const roleTabs = TABS_BY_ROLE[user.role] ?? [
    "all",
    ...Object.keys(STATUS_CONFIG),
  ];
  const [activeTab, setActiveTab] = useState(roleTabs[0]);

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
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [changingStatusId, setChangingStatusId] = useState(null);
  const [loadingOrderDetails, setLoadingOrderDetails] = useState(null);
  const [isDeliveryPhotoOpen, setIsDeliveryPhotoOpen] = useState(false);
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState(null);

  // Delivery PIN modal
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinError, setPinError] = useState(null);
  const [isVerifyingPin, setIsVerifyingPin] = useState(false);
  const [pendingPinOrder, setPendingPinOrder] = useState(null);

  // Assign-agent modal
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignTargetOrder, setAssignTargetOrder] = useState(null);
  const [deliveryAgents, setDeliveryAgents] = useState([]);
  const [loadingAgents, setLoadingAgents] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [page, activeTab]);

  // ── Data fetching ──────────────────────────────────────────────────────────

  const fetchOrders = async () => {
    setIsLoadingOrders(true);
    try {
      if (user.role === "kitchen") {
        let rawOrders = allKitchenOrders;

        const sortDescending = (items) =>
          [...items].sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime(),
          );

        if (rawOrders.length === 0) {
          const response = await api.get("/kitchen/orders/confirmed");
          const payload = response?.data;
          const data = payload?.data ?? payload ?? [];
          rawOrders = Array.isArray(data) ? data : [];
          rawOrders = sortDescending(rawOrders);
          setAllKitchenOrders(rawOrders);
        } else {
          rawOrders = sortDescending(rawOrders);
          setAllKitchenOrders(rawOrders);
        }

        const tabFiltered =
          activeTab === "all"
            ? rawOrders
            : rawOrders.filter((order) => order.status === activeTab);

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

        if (currentPage !== page) {
          setPage(currentPage);
        }

        return;
      }

      const params = {
        page,
        per_page: pagination.per_page,
      };

      let response;
      if (user.role === "admin") {
        response = await api.get("/admin/orders", { params });
      } else if (user.role === "supervisor") {
        response = await api.get("/supervisor/orders", { params });
      } else if (user.role === "delivery_agent") {
        // Delivery agent sees only orders assigned to them
        response = await api.get("/delivery-agent/orders", { params });
      } else if (user.role === "attendant") {
        response = await api.get("/attendant/orders", { params });
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
      console.log("fetched orders:", rawData);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const getVisiblePageNumbers = () => {
    const totalPages = pagination.last_page;
    const current = pagination.current_page;

    if (totalPages <= 7) {
      // For small number of pages, show from 2 to total-1
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
      alert(err.response?.data?.message || "Failed to load order details");
    } finally {
      setLoadingOrderDetails(null);
    }
  };

  // ── Assign agent (supervisor / admin) ──────────────────────────────────────

  const openAssignModal = async (order) => {
    setAssignTargetOrder(order);
    setIsAssignModalOpen(true);
    if (deliveryAgents.length === 0) {
      setLoadingAgents(true);
      try {
        const agents = await fetchDeliveryAgents();
        setDeliveryAgents(agents);
      } catch (err) {
        console.error("Failed to load delivery agents:", err);
      } finally {
        setLoadingAgents(false);
      }
    }
  };

  const handleAssignAgent = async (agentId) => {
    if (!assignTargetOrder) return;
    setIsAssigning(true);
    try {
      await api.patch(
        `/supervisor/orders/${assignTargetOrder.id}/assign-delivery-agent`,
        { delivery_agent_id: agentId },
      );
      // Optimistic update: the order moves to "dispatched" after assignment
      setOrders((prev) =>
        prev.map((o) =>
          o.id === assignTargetOrder.id ? { ...o, status: "dispatched" } : o,
        ),
      );
      setIsAssignModalOpen(false);
      setAssignTargetOrder(null);
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to assign delivery agent.");
    } finally {
      setIsAssigning(false);
    }
  };

  // ── PIN flow (delivery completion) ─────────────────────────────────────────

  const openPinModal = (orderId) => {
    setPendingPinOrder({ orderId });
    setPinError(null);
    setIsPinModalOpen(true);
  };

  const handlePinConfirm = async (pin) => {
    const { orderId } = pendingPinOrder;
    setIsVerifyingPin(true);
    setPinError(null);
    try {
      // Supervisors and delivery agents share the same completion flow;
      // point each to the appropriate endpoint.
      const endpoint =
        user.role === "supervisor"
          ? `/supervisor/orders/${orderId}/complete`
          : `/delivery-agent/orders/${orderId}/complete`;

      await api.post(endpoint, { delivery_pin: pin });
      setIsPinModalOpen(false);
      setPendingPinOrder(null);
      fetchOrders();
      if (selectedOrder?.id === orderId) {
        const { data } = await api.get(`/admin/orders/${orderId}`);
        setSelectedOrder(data);
      }
    } catch (err) {
      setPinError(
        err.response?.data?.message || "Incorrect PIN. Please try again.",
      );
    } finally {
      setIsVerifyingPin(false);
    }
  };

  // ── Status update helpers ──────────────────────────────────────────────────

  /** Advance an order through its status lifecycle for kitchen / admin roles. */
  const handleStatusUpdate = async (order) => {
    const { id: orderId, status } = order;
    setChangingStatusId(orderId);

    try {
      if (user.role === "kitchen") {
        if (status === "confirmed") {
          await api.post(`/kitchen/orders/preparing`, { order_ids: [orderId] });
        } else if (status === "processing") {
          await api.post(`/kitchen/orders/ready`, { order_ids: [orderId] });
        }
      } else if (user.role === "admin") {
        const nextStatus = status === "confirmed" ? "processing" : "ready";
        await api.put(`/admin/orders/${orderId}`, { status: nextStatus });
      }

      fetchOrders();
      if (selectedOrder?.id === orderId) {
        const { data } = await api.get(`/admin/orders/${orderId}`);
        setSelectedOrder(data);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update order status");
    } finally {
      setChangingStatusId(null);
    }
  };

  /**
   * Mark a ready non-delivery order as completed.
   * Used by attendants, supervisors, and admins — each hits their own endpoint.
   */
  const handleNonDeliveryComplete = async (orderId) => {
    setChangingStatusId(orderId);
    const endpointByRole = {
      attendant: `/admin/orders/${orderId}`,
      supervisor: `/admin/orders/${orderId}`,
      admin: `/admin/orders/${orderId}/complete`,
    };
    const endpoint = endpointByRole[user.role];
    if (!endpoint) return;
    try {
      await api.put(endpoint, { status: "completed" });
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to complete order");
    } finally {
      setChangingStatusId(null);
    }
  };

  /**
   * Attendant confirms cash payment for a pending order, moving it to "confirmed".
   * Update the endpoint below to match the actual route when confirmed with the backend.
   */
  const handleConfirmPayment = async (orderId) => {
    setChangingStatusId(orderId);
    try {
      await api.put(`/admin/orders/${orderId}`, { status: "confirmed" });
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to confirm payment");
    } finally {
      setChangingStatusId(null);
    }
  };

  // ── Action button renderer ─────────────────────────────────────────────────

  /**
   * Returns the single primary action button for each order card.
   * All role + status combinations live here — one place to update.
   */
  const renderActionButton = (order) => {
    const { id, status, order_type } = order;
    const busy = changingStatusId === id;

    // Convenience wrapper for the common orange button
    const OrangeBtn = ({ label, onClick }) => (
      <button
        onClick={onClick}
        disabled={busy}
        className="flex-1 px-4 py-2.5 bg-orange-500 rounded-xl text-sm font-medium text-white hover:bg-orange-600 transition-colors shadow-sm shadow-orange-200 disabled:bg-orange-500/50 disabled:cursor-not-allowed"
      >
        {busy ? "Updating…" : label}
      </button>
    );

    const AssignBtn = ({ onClickFn }) => (
      <button
        onClick={onClickFn}
        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 rounded-xl text-sm font-medium text-white hover:bg-orange-600 transition-colors shadow-sm shadow-orange-200"
      >
        <FiUser className="w-4 h-4" />
        Assign Agent
      </button>
    );

    // ── Kitchen ──────────────────────────────────────────────────────────────
    // Only kitchen staff may move an order into "processing" or "ready".
    // No other role sees these buttons.
    if (user.role === "kitchen") {
      if (status === "confirmed")
        return (
          <OrangeBtn
            label="Start Processing"
            onClick={() => handleStatusUpdate(order)}
          />
        );
      if (status === "processing")
        return (
          <OrangeBtn
            label="Mark as Ready"
            onClick={() => handleStatusUpdate(order)}
          />
        );
    }

    // ── Delivery agent ────────────────────────────────────────────────────────
    if (user.role === "delivery_agent") {
      if (status === "dispatched")
        return (
          <OrangeBtn
            label="Complete Delivery"
            onClick={() => openPinModal(id)}
          />
        );
    }

    // ── Supervisor ────────────────────────────────────────────────────────────
    if (user.role === "supervisor") {
      // Delivery orders that are ready need an agent assigned (→ dispatched)
      if (status === "ready" && order_type === "delivery")
        return <AssignBtn onClickFn={() => openAssignModal(order)} />;
      // Non-delivery ready orders can be completed directly
      if (status === "ready" && order_type !== "delivery")
        return (
          <OrangeBtn
            label="Mark as Completed"
            onClick={() => handleNonDeliveryComplete(id)}
          />
        );
      // Supervisor can step in and complete a dispatched delivery via PIN
      if (status === "dispatched")
        return (
          <OrangeBtn
            label="Complete Delivery"
            onClick={() => openPinModal(id)}
          />
        );
    }

    // ── Attendant ─────────────────────────────────────────────────────────────
    if (user.role === "attendant") {
      // Pending orders: attendant confirms cash payment on the spot
      if (status === "pending")
        return (
          <OrangeBtn
            label="Confirm Payment"
            onClick={() => handleConfirmPayment(id)}
          />
        );
      // Attendants can mark non-delivery ready orders as completed (customer picked up)
      if (status === "ready" && order_type !== "delivery")
        return (
          <OrangeBtn
            label="Mark as Completed"
            onClick={() => handleNonDeliveryComplete(id)}
          />
        );
    }

    // ── Admin ─────────────────────────────────────────────────────────────────
    if (user.role === "admin") {
      // Admin does NOT assign delivery agents anymore

      if (status === "ready" && order_type !== "delivery")
        return (
          <OrangeBtn
            label="Mark as Completed"
            onClick={() => handleNonDeliveryComplete(id)}
          />
        );
    }

    return null;
  };

  // ── Filtered orders ────────────────────────────────────────────────────────

  const filteredOrders =
    activeTab === "all" ? orders : orders.filter((o) => o.status === activeTab);

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
        agents={deliveryAgents}
        isLoading={loadingAgents}
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
      <DeliveryPhotoModal
        isOpen={isDeliveryPhotoOpen}
        onClose={() => {
          setIsDeliveryPhotoOpen(false);
          setPendingStatusUpdate(null);
        }}
        onConfirm={(photo) => {
          confirmStatusUpdate(
            pendingStatusUpdate.orderId,
            pendingStatusUpdate.status,
            photo,
          );
          setIsDeliveryPhotoOpen(false);
          setPendingStatusUpdate(null);
        }}
      />
      <OrderDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
      />

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
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                <FiFilter className="w-4 h-4" />
                Filter
              </button>
              {user?.role === "attendant" && (
                <button
                  onClick={() => navigate("/admin/create-order")}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors shadow-sm shadow-orange-200"
                >
                  <FiPlus className="w-4 h-4" />
                  Add Order
                </button>
              )}
            </div>
          </div>

          {/* Status tabs — each role sees only its relevant tabs */}
          <div className="bg-white p-2 rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
            <div className="flex items-center gap-2 min-w-max">
              {roleTabs.map((tab) => {
                const count =
                  tab === "all"
                    ? orders.length
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
                    {tab === "all" ? "All Orders" : getStatusLabel(tab)} (
                    {count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Orders grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredOrders.length === 0 ? (
              <div className="col-span-full text-center py-16 text-gray-400 text-sm">
                No orders found.
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col"
                >
                  {/* Card header */}
                  <div className="p-5 border-b border-gray-50 flex items-start justify-between">
                    <div>
                      <span className="font-bold text-gray-900 text-lg">
                        #{order.order_number}
                      </span>
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
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(order.status)}`}
                    >
                      {getStatusIcon(order.status)}
                      {getStatusLabel(order.status)}
                    </span>
                  </div>

                  {/* Order items */}
                  <div className="p-5 flex-1">
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
                      <span className="font-bold text-gray-900">Total</span>
                      <span className="text-xl font-bold text-orange-500">
                        {new Intl.NumberFormat("en-NG", {
                          style: "currency",
                          currency: "NGN",
                          minimumFractionDigits: 0,
                        }).format(Math.ceil(order.final_amount))}
                      </span>
                    </div>
                  </div>

                  {/* Card footer / actions */}
                  <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center gap-3">
                    <button
                      onClick={() => loadOrderDetails(order.id)}
                      disabled={loadingOrderDetails === order.id}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors shadow-sm disabled:bg-white/50 disabled:cursor-not-allowed"
                    >
                      {loadingOrderDetails === order.id ? (
                        "Loading..."
                      ) : (
                        <>
                          <FiEye className="w-4 h-4" />
                          Details
                        </>
                      )}
                    </button>

                    {renderActionButton(order)}
                  </div>
                </div>
              ))
            )}
          </div>

          {pagination.last_page > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 border-t border-gray-200 pt-6">
              {isLoadingOrders ? (
                <div className="text-sm text-gray-500 w-full text-center">
                  Loading Page…
                </div>
              ) : (
                <>
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
                </>
              )}
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
};

export default OrderManagement;
