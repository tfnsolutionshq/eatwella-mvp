import { useState, useEffect, useCallback } from "react";
import {
  CheckCircle,
  Download,
  User,
  Clock,
  Loader2,
  Copy,
  Check,
} from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { PDFDownloadLink, pdf } from "@react-pdf/renderer";
import ReceiptPDF from "../ReceiptPDF";
import api from "../../utils/api";

// ── Device detection ──────────────────────────────────────────────────────────
// POS machines typically have narrow screens (≤ 480px), touch interfaces,
// and may identify themselves via user-agent strings common in embedded browsers.
function useDeviceType() {
  const [deviceType, setDeviceType] = useState("desktop");

  useEffect(() => {
    const detectDevice = () => {
      const width = window.screen.width;
      const ua = navigator.userAgent.toLowerCase();

      const isPOSByWidth = width <= 600;
      const isPOSByUA =
        /pos|terminal|sunmi|ingenico|pax |verifone|newland|epson|star\s?micronics/i.test(
          ua,
        );
      // Touch-only narrow devices are almost always POS in a food-service context
      const isPOSByTouch =
        width <= 600 &&
        navigator.maxTouchPoints > 0 &&
        !/iphone|ipad|android/i.test(ua);

      if (isPOSByUA || isPOSByWidth || isPOSByTouch) {
        setDeviceType("pos");
      } else {
        setDeviceType("desktop");
      }
    };

    detectDevice();
    window.addEventListener("resize", detectDevice);
    return () => window.removeEventListener("resize", detectDevice);
  }, []);

  return deviceType;
}

// Paper size config per device
const PAPER_SIZE_MAP = {
  pos: "58mm", // Standard thermal receipt width; swap to "80mm" if your POS uses 80mm rolls
  desktop: "A5",
};

// ─────────────────────────────────────────────────────────────────────────────

function ReceiptDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { fetchCart, clearCart } = useCart();
  const { orderId } = useParams();
  const [order, setOrder] = useState(location.state?.order || null);
  const [isLoading, setIsLoading] = useState(!location.state?.order);
  const [fetchError, setFetchError] = useState(null);
  const [zones, setZones] = useState([]);
  const [copied, setCopied] = useState(false);

  const deviceType = useDeviceType();
  const paperSize = PAPER_SIZE_MAP[deviceType];

  useEffect(() => {
    const clearAndFetch = async () => {
      await clearCart();
      await fetchCart();
    };
    clearAndFetch();
  }, []);

  useEffect(() => {
    const loadZones = async () => {
      try {
        const res = await api.get("/zones");
        const payload = res.data;
        const data = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data)
            ? payload.data
            : [];
        setZones(data);
      } catch (e) {
        console.error("Failed to load zones", e);
      }
    };
    loadZones();
  }, []);

  useEffect(() => {
    if (!order && orderId) {
      (async () => {
        try {
          setIsLoading(true);
          setFetchError(null);
          const res = await api.get(`/orders/track/${orderId}`);
          setOrder(res.data);
        } catch (e) {
          if (e.response?.status === 404) {
            setFetchError("not_found");
          } else {
            setFetchError("network_error");
          }
        } finally {
          setIsLoading(false);
        }
      })();
    }
  }, [order, orderId]);

  // Generates a PDF blob and opens the browser/OS print dialog
  const handlePrint = useCallback(async () => {
    if (!order) return;
    try {
      const blob = await pdf(
        <ReceiptPDF order={order} paperSize={paperSize} />,
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const printWindow = window.open(url, "_blank");
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.focus();
          printWindow.print();
        };
      }
    } catch (err) {
      console.error("Print failed:", err);
    }
  }, [order, paperSize]);

  const statusValue = (order?.status || "pending").toLowerCase();
  const statusLabel =
    statusValue.charAt(0).toUpperCase() + statusValue.slice(1);

  const handleCopyOrderId = () => {
    const idToCopy = order.order_number || order.id || "";
    navigator.clipboard.writeText(idToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const statusClasses = (() => {
    if (statusValue === "completed") return "bg-green-100 text-green-700";
    if (statusValue === "cancelled") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  })();

  // ── Loading state ──
  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex flex-col items-center justify-center gap-4 py-10">
            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-800 mb-1">
                Loading your receipt
              </h3>
              <p className="text-sm text-gray-500">
                Fetching details for order{" "}
                <span className="font-semibold text-gray-700">#{orderId}</span>
                ...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Error state ──
  if (fetchError) {
    const isNotFound = fetchError === "not_found";
    return (
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center ${isNotFound ? "bg-gray-50" : "bg-red-50"}`}
            >
              <Clock
                className={`w-8 h-8 ${isNotFound ? "text-gray-400" : "text-red-400"}`}
              />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">
                {isNotFound ? "Order Not Found" : "Failed to load order"}
              </h3>
              <p className="text-sm text-gray-500 mb-6 max-w-sm">
                {isNotFound
                  ? `We couldn't find an order with ID #${orderId}. Please check the link and try again.`
                  : "We could not load your order details. Please check your connection and try again."}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              {!isNotFound && (
                <button
                  onClick={() => {
                    setFetchError(null);
                    setOrder(null);
                  }}
                  className="flex-1 bg-orange-500 text-white px-6 py-3 rounded-full font-bold hover:bg-orange-600 transition-colors"
                >
                  Try Again
                </button>
              )}
              <button
                onClick={() => navigate("/menu")}
                className={`flex-1 font-bold px-6 py-3 rounded-full transition-colors ${
                  isNotFound
                    ? "bg-orange-500 text-white hover:bg-orange-600"
                    : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Return to Menu
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── No order found ──
  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">No Order Found</h2>
        <button
          onClick={() => navigate("/menu")}
          className="bg-orange-500 text-white px-6 py-3 rounded-full font-bold"
        >
          Return to Menu
        </button>
      </div>
    );
  }

  const matchedZone = zones.find(
    (zone) =>
      zone.id === order.delivery_zone_id ||
      zone.id === order.delivery_zone_id?.toString(),
  );
  const matchedZoneName = matchedZone?.name || matchedZone?.zone_name || "";

  const receiptAddress = order.delivery_address
    ? matchedZoneName
      ? `${matchedZoneName}, ${order.delivery_address}`
      : order.delivery_address
    : "N/A";

  const items = order.items || order.order_items || [];
  const subtotal =
    order.order_items?.reduce((sum, item) => {
      const packagingPrice = item.packaging_price ?? 0;
      return sum + (item.subtotal ?? 0) + packagingPrice * (item.quantity ?? 1);
    }, 0) ?? 0;

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-white" strokeWidth={3} />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-2">
          Order Confirmed!
        </h2>
        <p className="text-center text-gray-500 text-sm mb-6">
          Thank you for your order
        </p>

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-xs text-gray-500 mb-1">Order ID</p>
              <div className="flex items-center justify-center gap-2">
                <p className="text-xl font-bold mb-1">
                  {order.order_number || order.id || "PENDING"}
                </p>
                <button
                  onClick={handleCopyOrderId}
                  className="text-gray-400 hover:text-orange-500 transition-colors mt-[-4px]"
                  title="Copy order ID"
                >
                  {copied ? (
                    <span className="flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="ml-1 text-xs">Copied!</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <Copy className="w-4 h-4" />
                      <span className="ml-1 text-xs">Copy</span>
                    </span>
                  )}
                </button>
              </div>
            </div>
            <div className="flex flex-col items-center md:items-end gap-2">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${statusClasses}`}
              >
                {statusLabel}
              </span>
            </div>
          </div>
          {order.delivery_pin && (
            <div className="text-center mt-5">
              <p>
                Your Delivery PIN:{" "}
                <span className="font-bold">{order.delivery_pin}</span>
              </p>
              <p className="text-gray-500 mt-1 italic">
                Save and provide this PIN to the delivery agent who will come
                with your order.
              </p>
            </div>
          )}
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-4">Order Details</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Address</span>
              <span className="text-gray-900">{receiptAddress}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Order Type</span>
              <span className="text-gray-900 capitalize">
                {(order.order_type === "dine" && "dine-in") || "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Customer</span>
              <span className="text-gray-900">
                {order.customer_name || "Guest"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Email:</span>
              <span className="text-gray-900">
                {order.customer_email || "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Phone:</span>
              <span className="text-gray-900">
                {order.customer_phone || "N/A"}
              </span>
            </div>
            {order.table_number && (
              <div className="flex justify-between">
                <span className="text-gray-500">Table:</span>
                <span className="text-gray-900">#{order.table_number}</span>
              </div>
            )}
          </div>
        </div>

        <div className="border-t pt-4 mb-4">
          <div className="space-y-2 text-sm">
            {items.map((item, index) => (
              <div key={index} className="flex justify-between">
                <div className="text-gray-700">
                  {item.quantity}x {item.menu?.name || item.name || "Item"}{" "}
                  <br />
                  <span className="text-xs text-gray-500">
                    {item.packaging_price
                      ? "Packaging: " +
                        new Intl.NumberFormat("en-NG", {
                          style: "currency",
                          currency: "NGN",
                          minimumFractionDigits: 0,
                        }).format(item.packaging_price)
                      : ""}
                  </span>
                </div>
                <span className="text-gray-900">
                  {new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                    minimumFractionDigits: 0,
                  }).format(item.menu?.price || item.price || 0)}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-semibold mt-4">
            <span>Tax Charges:</span>
            <span>
              {new Intl.NumberFormat("en-NG", {
                style: "currency",
                currency: "NGN",
                minimumFractionDigits: 0,
              }).format(order.tax_details.VAT.amount)}{" "}
              ({order.tax_details.VAT.type})
            </span>
          </div>
        </div>

        <div className="border-t pt-4 mb-4">
          <div className="flex justify-between font-semibold mb-2">
            <span>Total Payment:</span>
            <span className="text-orange-500">
              {new Intl.NumberFormat("en-NG", {
                style: "currency",
                currency: "NGN",
                minimumFractionDigits: 0,
              }).format(subtotal + (order.tax_details?.VAT?.amount ?? 0))}
            </span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Mode of Payment:</span>
            <span className="text-orange-500 capitalize">
              {order.payment_type || order.invoice?.payment_method || "N/A"}
            </span>
          </div>
        </div>

        <div className="text-center mb-4">
          <p className="text-sm text-gray-600 mb-3">
            Would you like to create an account to track your orders?
          </p>
          <Link to="/account/create">
            <button className="w-full bg-orange-500 text-white py-3 rounded-full font-medium hover:bg-orange-600 flex items-center justify-center gap-2">
              <User className="w-4 h-4" />
              Create Account
            </button>
          </Link>
        </div>

        {/* Download / Print button — fires print dialog on click */}
        <div className="mt-4">
          <button
            onClick={handlePrint}
            className="w-full bg-orange-500 text-white py-3 rounded-full flex flex-col lg:flex-row items-center justify-center gap-2 hover:bg-orange-600 transition-colors"
          >
            <div className="flex items-center">
              <Download className="w-4 h-4 mr-3" />
              <span>Download / Print Receipt</span>
            </div>
            <span className="text-xs opacity-75 ml-1">
              ({deviceType === "pos" ? "POS thermal" : "A5 PDF"})
            </span>
          </button>
        </div>

        <button
          onClick={() => navigate("/menu")}
          className="w-full text-black py-3 rounded-lg font-medium flex items-center justify-center gap-2"
        >
          Place Another Order
        </button>
      </div>
    </div>
  );
}

export default ReceiptDetails;
