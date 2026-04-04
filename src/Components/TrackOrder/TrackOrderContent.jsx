import React, { useState, useEffect } from "react";
import {
  Search,
  ChevronLeft,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Package,
  SquareAsteriskIcon,
  User,
} from "lucide-react";
import api from "../../utils/api";

// ── Currency formatter ────────────────────────────────────────────────────────
const ngn = (amount) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(Math.ceil(Number(amount ?? 0)));

// ── Per-item subtotal: item.subtotal (price × qty) + packaging_price × qty ──
// item.subtotal from the API does NOT include packaging. packaging_price is
// the per-unit cost stored directly on each order_item.
const getItemSubtotal = (item) =>
  Number(item.subtotal) + Number(item.packaging_price ?? 0) * item.quantity;

function TrackOrderContent() {
  const [step, setStep] = useState("search"); // search | details
  const [formData, setFormData] = useState({ orderId: "" });
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    if (!formData.orderId) {
      setError("Please enter your order ID");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await api.get(`/orders/track/${formData.orderId}`);
      setOrderData(response.data);
      setStep("details");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Order not found. Please check your details and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep("search");
    setFormData({ orderId: "" });
    setOrderData(null);
    setError("");
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  useEffect(() => {
    if (!orderData) {
      return;
    }
  }, [orderData]);

  const getTimelineStatus = (currentStatus) => {
    const s = (currentStatus || "").toLowerCase();
    return {
      placed: [
        "confirmed",
        "processing",
        "ready",
        "dispatched",
        "completed",
      ].includes(s),
      confirmed: [
        "confirmed",
        "processing",
        "ready",
        "dispatched",
        "completed",
      ].includes(s),
      processing: ["processing", "ready", "dispatched", "completed"].includes(
        s,
      ),
      ready: ["ready", "dispatched", "completed"].includes(s),
      dispatched: ["dispatched", "completed"].includes(s),
      completed: s === "completed",
    };
  };

  // ── Search view ─────────────────────────────────────────────────────────────
  if (step === "search") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50 px-4 py-12">
        <div className="bg-white w-full max-w-lg p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-orange-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Find Your Order
            </h1>
            <p className="text-gray-500 text-center">
              Enter your order ID to track your order
            </p>
          </div>

          <form onSubmit={handleTrackOrder} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Order ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="orderId"
                value={formData.orderId}
                onChange={handleInputChange}
                placeholder="ORD-123456 or 123456"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
              <p className="text-xs text-gray-400 mt-1">
                Found in your order confirmation email
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white font-bold py-4 rounded-full hover:bg-orange-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Track Order
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Details view ────────────────────────────────────────────────────────────
  const timeline = getTimelineStatus(orderData.status);
  const isDelivery = orderData.order_type === "delivery";
  const statusValue = (orderData.status || "pending").toLowerCase();
  const statusLabel =
    statusValue.replace("_", " ").charAt(0).toUpperCase() +
    statusValue.replace("_", " ").slice(1);

  const items = orderData.order_items || [];

  // ── Corrected financial figures ─────────────────────────────────────────────
  // items subtotal = sum of (menu price × qty) + (packaging price × qty) per item
  const itemsSubtotal = items.reduce(
    (sum, item) => sum + getItemSubtotal(item),
    0,
  );
  const discountAmount = Number(orderData.discount_amount ?? 0);
  const deliveryFee = Number(orderData.delivery_fee ?? 0);
  const taxAmount = Number(orderData.tax_amount ?? 0);
  const taxDetails = orderData.tax_details ?? null; // e.g. { VAT: { rate: 7.5, amount: 150 } }

  // Recalculated grand total = itemsSubtotal - discount + deliveryFee + tax
  // We still show the API's final_amount as the authoritative "Total Paid" figure,
  // but the breakdown rows now add up correctly to match it.
  const recalculatedTotal =
    itemsSubtotal - discountAmount + (isDelivery ? deliveryFee : 0) + taxAmount;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
      {/* Back */}
      <button
        onClick={() => setStep("search")}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ChevronLeft className="w-5 h-5 mr-1" />
        Back
      </button>

      {/* Status Banner */}
      <div className="bg-orange-50 rounded-2xl p-6 mb-8 border border-orange-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
            <Truck className="w-6 h-6 text-orange-600" />
          </div>
          <h2
            className={`text-xl font-extrabold capitalize ${
              statusValue === "completed"
                ? "text-green-700"
                : statusValue === "cancelled"
                  ? "text-red-600"
                  : "text-orange-600"
            }`}
          >
            {statusLabel}
          </h2>
        </div>
        <div className="flex flex-col items-start md:items-end gap-2">
          <div className="bg-white/80 px-4 py-2 rounded-lg text-sm font-mono font-medium text-gray-600 border border-orange-100">
            #{orderData.order_number || orderData.id}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
        <h3 className="font-bold text-lg mb-6">Order Timeline</h3>
        <div className="relative">
          <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-100" />
          <div className="space-y-8">
            {[
              {
                key: "placed",
                label: "Order Placed",
                sub: "Your order has been received",
                icon: CheckCircle,
                activeClass: "bg-green-100 text-green-600",
                time: formatDate(orderData.created_at).split(",")[1],
              },
              {
                key: "confirmed",
                label: "Confirmed",
                sub: "Restaurant confirmed your order",
                icon: CheckCircle,
                activeClass: "bg-green-100 text-green-600",
                time: timeline.confirmed
                  ? formatDate(orderData.updated_at).split(",")[1]
                  : null,
              },
              {
                key: "processing",
                label: "Processing",
                sub: "Your order is being prepared",
                icon: Clock,
                activeClass: "bg-green-100 text-green-600",
                time: null,
              },
              {
                key: "ready",
                label: "Ready",
                sub: isDelivery ? "Ready for dispatch" : "Ready for pickup",
                icon: Package,
                activeClass: "bg-green-100 text-green-600",
                time: null,
              },
              ...(isDelivery
                ? [
                    {
                      key: "dispatched",
                      label: "Dispatched",
                      sub: "Your order is on the way",
                      icon: Truck,
                      activeClass: "bg-orange-500 text-white",
                      time: null,
                    },
                  ]
                : []),
              {
                key: "completed",
                label: "Completed",
                sub: "Order successfully delivered",
                icon: CheckCircle,
                activeClass: "bg-green-500 text-white",
                time: null,
              },
            ].map(({ key, label, sub, icon: Icon, activeClass, time }) => {
              const active = timeline[key];
              return (
                <div key={key} className="relative flex gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${active ? activeClass : "bg-gray-100 text-gray-400"}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4
                          className={`font-semibold ${active ? "text-gray-900" : "text-gray-500"}`}
                        >
                          {label}
                        </h4>
                        <p className="text-sm text-gray-500">{sub}</p>
                      </div>
                      {time && (
                        <span className="text-sm text-gray-400">{time}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Customer Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h3 className="font-bold text-lg mb-6">Customer Information</h3>
          <div className="space-y-6">
            {[
              {
                icon: Package,
                label: "Order Type",
                value: orderData.order_type,
                capitalize: true,
              },
              ...(orderData.delivery_pin
                ? [
                    {
                      icon: SquareAsteriskIcon,
                      label: "Delivery PIN",
                      value: orderData.delivery_pin,
                    },
                  ]
                : []),
              { icon: Mail, label: "Email", value: orderData.customer_email },
              { icon: Phone, label: "Phone", value: orderData.customer_phone },
              {
                icon: Calendar,
                label: "Order Date",
                value: formatDate(orderData.created_at),
              },
              ...(isDelivery
                ? [
                    {
                      icon: MapPin,
                      label: "Delivery Address",
                      value: [
                        orderData.delivery_address,
                        orderData.delivery_city,
                        orderData.delivery_zip,
                      ]
                        .filter(Boolean)
                        .join(", "),
                    },
                  ]
                : []),
              ...(!isDelivery && orderData.table_number
                ? [
                    {
                      icon: User,
                      label: "Table Number",
                      value: orderData.table_number,
                    },
                  ]
                : []),
            ].map(({ icon: Icon, label, value, capitalize }) => (
              <div key={label} className="flex items-start gap-4">
                <Icon className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">{label}</p>
                  <p
                    className={`font-medium ${capitalize ? "capitalize" : ""}`}
                  >
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h3 className="font-bold text-lg mb-6">Order Summary</h3>

          {/* Line items */}
          <div className="space-y-4 mb-6">
            {items.map((item, index) => {
              const itemTotal = getItemSubtotal(item);
              return (
                <div
                  key={index}
                  className="flex justify-between items-start gap-4"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900">
                      {item.quantity}× {item.menu?.name || "Item"}
                    </p>
                    {item.menu?.description && (
                      <p className="text-xs text-gray-400 truncate max-w-[200px]">
                        {item.menu.description}
                      </p>
                    )}
                    {/* Packaging line — only when present */}
                    {Number(item.packaging_price) > 0 && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        + Packaging: {ngn(item.packaging_price)} / item
                      </p>
                    )}
                  </div>
                  {/* Corrected subtotal = (menu price + packaging price) × qty */}
                  <p className="font-medium text-gray-900 shrink-0">
                    {ngn(itemTotal)}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Totals breakdown */}
          <div className="border-t border-gray-100 pt-4 space-y-2.5">
            {/* Items subtotal (menu + packaging) */}
            <div className="flex justify-between text-gray-600 text-sm">
              <span>Items Subtotal</span>
              <span className="font-medium text-gray-800">
                {ngn(itemsSubtotal)}
              </span>
            </div>

            {/* Discount */}
            {discountAmount > 0 && (
              <div className="flex justify-between text-green-600 text-sm">
                <span>Discount</span>
                <span className="font-medium">-{ngn(discountAmount)}</span>
              </div>
            )}

            {/* Delivery fee */}
            {isDelivery && (
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Delivery Fee</span>
                <span className="font-medium text-gray-800">
                  {ngn(deliveryFee)}
                </span>
              </div>
            )}

            {/* Tax rows — per tax type from tax_details when available */}
            {taxDetails
              ? Object.entries(taxDetails).map(([taxName, tax]) => (
                  <div
                    key={taxName}
                    className="flex justify-between text-gray-600 text-sm"
                  >
                    <span>
                      {taxName}{" "}
                      <span className="text-gray-400 text-xs">
                        ({tax.rate}%)
                      </span>
                    </span>
                    <span className="font-medium text-gray-800">
                      {ngn(tax.amount)}
                    </span>
                  </div>
                ))
              : taxAmount > 0 && (
                  <div className="flex justify-between text-gray-600 text-sm">
                    <span>Tax</span>
                    <span className="font-medium text-gray-800">
                      {ngn(taxAmount)}
                    </span>
                  </div>
                )}

            {/* Total Paid — use API's final_amount as the authoritative figure */}
            <div className="flex justify-between text-xl font-bold text-orange-600 pt-3 border-t border-gray-100 mt-1">
              <span>Total Paid</span>
              <span>{ngn(orderData.final_amount ?? recalculatedTotal)}</span>
            </div>
          </div>

          {/* Payment method */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
            <span className="text-gray-500 text-sm">Payment Method</span>
            <span className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-xs font-medium text-gray-700 capitalize">
              {orderData.invoice?.payment_method ||
                orderData.payment_type ||
                "Unknown"}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <button
          onClick={handleReset}
          className="flex-1 bg-white border border-gray-200 text-gray-700 font-bold py-4 rounded-full hover:bg-gray-50 transition-colors"
        >
          Track Another Order
        </button>
        <button className="flex-1 bg-orange-500 text-white font-bold py-4 rounded-full hover:bg-orange-600 transition-colors">
          Contact Support
        </button>
      </div>
    </div>
  );
}

export default TrackOrderContent;
