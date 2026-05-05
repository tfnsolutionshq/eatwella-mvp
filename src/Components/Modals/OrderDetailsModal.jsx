import { FiX } from "react-icons/fi";
import { Download } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import ReceiptPDF from "../ReceiptPDF";
import { useCallback, useEffect, useState } from "react";

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

const OrderDetailsModal = ({ isOpen, onClose, order }) => {
  // ✅ ALL hooks must be called unconditionally, before any early returns
  const deviceType = useDeviceType();
  const paperSize = PAPER_SIZE_MAP[deviceType];

  const handlePrint = useCallback(async () => {
    if (!order) return;
    try {
      const blob = await pdf(
        // ✅ paperSize is now correctly passed in
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
  }, [order, paperSize]); // ✅ paperSize added to dependency array

  // ✅ Early return comes AFTER all hook calls
  if (!isOpen || !order) return null;

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-orange-100 text-orange-600",
      processing: "bg-purple-100 text-purple-600",
      completed: "bg-green-100 text-green-600",
    };
    return colors[status] || "bg-gray-100 text-gray-600";
  };

  const subtotal =
    order.order_items?.reduce((sum, item) => {
      const packagingPrice = item.packaging?.price ?? 0;
      return sum + (item.subtotal ?? 0) + packagingPrice * (item.quantity ?? 1);
    }, 0) ?? 0;

  // useEffect(() => {
  //   console.log("Order data in modal:", order);
  // }, [order]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-[800px] shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
            <p className="text-sm text-gray-500 mt-1">
              Complete information about this order
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 hover:bg-gray-100 p-2 rounded-lg transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Order Info */}
          <div className="grid grid-cols-2 gap-6 pb-6 border-b border-gray-100">
            <div>
              <p className="text-sm text-gray-500 mb-1">Order Type</p>
              <p className="text-base font-medium text-gray-900">
                {order.order_type === "dine"
                  ? "Dine-in"
                  : order.order_type?.charAt(0).toUpperCase() +
                    order.order_type?.slice(1)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Delivery City</p>
              <p className="text-base font-medium text-gray-900">
                {order.delivery_zone.city.name ?? "N/A"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Delivery Address</p>
              <p className="text-base font-medium text-gray-900">
                {order.delivery_address ?? "N/A"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Delivery Zone</p>
              <p className="text-base font-medium text-gray-900">
                {order.delivery_zone.name ?? "N/A"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Order Number</p>
              <p className="text-base font-medium text-gray-900">
                #{order.order_number}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Status</p>
              <span
                className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
              >
                {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
              </span>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Customer Email</p>
              <p className="text-base font-medium text-gray-900 text-wrap">
                {order.customer_email}
              </p>
            </div>

            {order.attendant && (
              <>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Attendant Name</p>
                  <p className="text-base font-medium text-gray-900">
                    {order.attendant.name}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Attendant Email</p>
                  <p className="text-base font-medium text-gray-900 text-wrap">
                    {order.attendant.email}
                  </p>
                </div>
              </>
            )}

            {order.delivery_agent && (
              <>
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    Delivery Agent Name
                  </p>
                  <p className="text-base font-medium text-gray-900">
                    {order.delivery_agent.name}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    Delivery Agent Email
                  </p>
                  <p className="text-base font-medium text-gray-900 text-wrap">
                    {order.delivery_agent.email}
                  </p>
                </div>
              </>
            )}

            <div>
              <p className="text-sm text-gray-500 mb-1">Created At</p>
              <p className="text-base font-medium text-gray-900">
                {new Date(order.created_at).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="pb-6 border-b border-gray-100">
            <h3 className="text-base font-medium text-gray-900 mb-4">
              Payment Information
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Invoice Number:</span>
                <span className="text-sm font-medium text-gray-900">
                  {order.invoice?.invoice_number || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Payment Method:</span>
                <span className="text-sm font-medium text-gray-900">
                  {order.invoice?.payment_method?.toUpperCase() || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Payment Status:</span>
                <span
                  className={`px-2.5 py-1 text-xs font-medium rounded-full ${order.invoice?.payment_status === "paid" ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"}`}
                >
                  {order.invoice?.payment_status?.toUpperCase() || "N/A"}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-base font-medium text-gray-900 mb-4">
              Order Items
            </h3>
            <div className="space-y-4 mb-4">
              {order.order_items?.map((item) => {
                const imageUrl =
                  item.menu?.images && item.menu.images.length > 0
                    ? item.menu.images[0]
                    : null;
                return (
                  <div key={item.id} className="flex gap-3">
                    {imageUrl && (
                      <img
                        src={imageUrl}
                        alt={item.menu?.name || "Menu item"}
                        className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                        onError={(e) => {
                          console.log("Image failed to load:", imageUrl);
                          e.target.src = "https://via.placeholder.com/64";
                        }}
                      />
                    )}
                    <div className="flex-1 flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {item.menu?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.packaging &&
                            "Packaging Size: " +
                              item.packaging.size_name
                                .toUpperCase()
                                .slice(0, 1)
                                .concat(item.packaging.size_name.slice(1)) +
                              " (" +
                              new Intl.NumberFormat("en-NG", {
                                style: "currency",
                                currency: "NGN",
                                minimumFractionDigits: 0,
                              }).format(item.packaging.price) +
                              ")"}
                        </p>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {new Intl.NumberFormat("en-NG", {
                          style: "currency",
                          currency: "NGN",
                          minimumFractionDigits: 0,
                        }).format(item.subtotal)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-2 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Subtotal</span>
                <span className="text-sm font-medium text-gray-900">
                  {new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                    minimumFractionDigits: 0,
                  }).format(subtotal)}
                </span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Discount</span>
                  <span className="text-sm font-medium text-green-600">
                    {new Intl.NumberFormat("en-NG", {
                      style: "currency",
                      currency: "NGN",
                      minimumFractionDigits: 0,
                    }).format(order.discount_amount)}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-lg font-bold text-gray-900">
                  Total Amount
                </span>
                <span className="text-xl font-bold text-orange-500">
                  {new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                    minimumFractionDigits: 0,
                  }).format(Math.ceil(order.final_amount))}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={handlePrint}
                className="w-full bg-orange-500 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Print Receipt</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
