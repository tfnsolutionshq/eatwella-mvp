import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaTimes } from "react-icons/fa";
import { FiMapPin, FiChevronDown, FiGrid } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import { del } from "framer-motion/client";

// ─────────────────────────────────────────────────────────────────────────────
// DEV TOGGLE
// Set to `false` once the real endpoint is ready — nothing else needs to change.
// ─────────────────────────────────────────────────────────────────────────────
const USING_DUMMY_TABLES = true;

const DUMMY_TABLES = [
  { id: 1, name: "A1", is_available: true },
  { id: 2, name: "A2", is_available: true },
  { id: 3, name: "A3", is_available: false },
  { id: 4, name: "B1", is_available: true },
  { id: 5, name: "B2", is_available: false },
  { id: 6, name: "C1", is_available: true },
];

/**
 * Fetch available dine-in tables.
 * Swap the body of this function for a real API call when the endpoint lands:
 *
 *   const { data } = await api.get("/tables");
 *   const all = Array.isArray(data) ? data : (data.data ?? []);
 *   return all.filter((t) => t.is_available);
 *
 * Each table object must have at least: { id, name, is_available }
 */
const fetchAvailableTables = async () => {
  if (USING_DUMMY_TABLES) {
    await new Promise((res) => setTimeout(res, 400)); // simulate network
    return DUMMY_TABLES.filter((t) => t.is_available);
  }
  const { data } = await api.get("/tables");
  const all = Array.isArray(data) ? data : (data.data ?? []);
  return all.filter((t) => t.is_available);
};
// ─────────────────────────────────────────────────────────────────────────────

function OrderTypeForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, removeDiscount } = useCart();
  const { user } = useAuth();
  const orderType = location.state?.orderType || "pickup";
  const paymentMethod = location.state?.paymentMethod;

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    zipCode: "",
    deliveryAddress: "",
  });

  // ── Delivery location state ────────────────────────────────────────────────
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [locationsError, setLocationsError] = useState(null);
  const [deliveryLocations, setDeliveryLocations] = useState([]);

  // ── Other state ───────────────────────────────────────────────────────────
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingTax, setIsLoadingTax] = useState(false);
  const [removingDiscount, setRemovingDiscount] = useState(false);
  const [taxList, setTaxList] = useState([]);

  const cartItems = cart?.items || [];

  // ── Totals ────────────────────────────────────────────────────────────────

  const getItemTotal = (item) =>
    (Number(item.menu.price) + Number(item.packaging?.price ?? 0)) *
    item.quantity;

  const subtotal = cartItems.reduce((sum, item) => sum + getItemTotal(item), 0);

  const deliveryFee =
    orderType === "delivery" ? Number(selectedLocation?.delivery_fee ?? 0) : 0;
  const discountAmount = Number(cart?.discount_amount || 0);
  const subtotalAfterDiscount = subtotal - discountAmount;
  const originalTotal = subtotal + deliveryFee;
  const discountPercent =
    originalTotal > 0 ? Math.round((discountAmount / originalTotal) * 100) : 0;
  const totalTaxAmount = taxList.reduce(
    (sum, tax) => sum + (tax.rate / 100) * subtotal,
    0,
  );
  const grandTotal = subtotalAfterDiscount + deliveryFee + totalTaxAmount;

  // ── Data fetching ─────────────────────────────────────────────────────────

  const getTaxes = async () => {
    setIsLoadingTax(true);
    try {
      const { data } = await api.get("/taxes");
      setTaxList(data);
    } catch (err) {
      console.error("Failed to fetch taxes:", err);
    } finally {
      setIsLoadingTax(false);
    }
  };

  const getDeliveryLocations = async () => {
    setIsLoadingLocations(true);
    setLocationsError(null);
    try {
      const { data } = await api.get("/zones");
      console.log("The locations: ", data);
      const active = (Array.isArray(data) ? data : (data.data ?? [])).filter(
        (loc) => loc.is_active,
      );
      setDeliveryLocations(active);
    } catch (err) {
      console.error("Failed to fetch delivery locations:", err);
      setLocationsError("Could not load delivery locations. Please try again.");
    } finally {
      setIsLoadingLocations(false);
    }
  };

  const getTables = async () => {
    setIsLoadingTables(true);
    setTablesError(null);
    try {
      const tables = await fetchAvailableTables();
      setAvailableTables(tables);
    } catch (err) {
      console.error("Failed to fetch tables:", err);
      setTablesError("Could not load tables. Please try again.");
    } finally {
      setIsLoadingTables(false);
    }
  };

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        zipCode: user.postal_code || "",
      }));
    }
    getTaxes();
    if (orderType === "delivery") getDeliveryLocations();
    if (orderType === "dine-in") getTables();
  }, [user]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSelectLocation = (loc) => {
    setSelectedLocation(loc);
    setLocationDropdownOpen(false);
  };

  const handleSubmit = async () => {
    // console.log("Here we are: ", formData);
    if (!formData.fullName || !formData.email || !formData.phone) {
      alert("Please fill in all required fields");
      return;
    }

    if (orderType === "delivery" && !selectedLocation) {
      alert("Please select a delivery location");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        order_type: orderType === "dine-in" ? "dine" : orderType,
        customer_name: formData.fullName,
        customer_email: formData.email,
        customer_phone: formData.phone,
        payment_type: paymentMethod,
        callback_url: `${window.location.origin}/receipt`,
        items: cartItems.map((item) => ({
          menu_id: item.menu.id,
          quantity: item.quantity,
          packaging_id: item.packaging_id,
        })),
      };

      if (orderType === "delivery") {
        payload.delivery_city = selectedLocation.city;
        payload.delivery_address = formData.deliveryAddress;
        payload.delivery_zip = formData.zipCode;
        payload.delivery_zone_id = selectedLocation.id;
      }

      const response = await api.post("/checkout", payload);

      if (paymentMethod === "cash") {
        navigate(`/receipt/${response.data.order.id}`);
        return;
      }

      if (response.data.payment?.authorization_url) {
        window.location.href = response.data.payment.authorization_url;
      } else {
        alert("Failed to initialize payment gateway");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert(error.response?.data?.message || "Failed to process payment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveDiscount = async () => {
    setRemovingDiscount(true);
    const res = await removeDiscount();
    setRemovingDiscount(false);
    if (!res?.success) alert(res?.message || "Failed to remove discount");
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="bg-gray-50 py-12 px-4 md:px-6 min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        <button
          onClick={() => navigate("/cart")}
          className="flex items-center gap-2 text-gray-600 mb-8 hover:text-gray-800"
        >
          <FaArrowLeft />
          <span>Back</span>
        </button>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-start">
          {/* ── Form Section ── */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-6">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+234 800 000 0000"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* ── Delivery: location selector ── */}
            {orderType === "delivery" && (
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                  Delivery Location *
                </label>

                {locationsError ? (
                  <div className="flex items-center justify-between px-4 py-3 rounded-2xl border border-red-200 bg-red-50 text-sm text-red-600">
                    <span>{locationsError}</span>
                    <button
                      type="button"
                      onClick={getDeliveryLocations}
                      className="ml-3 text-xs font-semibold underline hover:no-underline flex-shrink-0"
                    >
                      Retry
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        !isLoadingLocations &&
                        setLocationDropdownOpen((o) => !o)
                      }
                      className={`w-full px-4 py-3 rounded-2xl border bg-gray-50 text-sm text-left flex items-center justify-between transition focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        selectedLocation
                          ? "border-orange-300 text-gray-800"
                          : "border-gray-200 text-gray-400"
                      } ${isLoadingLocations ? "opacity-60 cursor-not-allowed" : ""}`}
                    >
                      <span className="flex items-center gap-2">
                        <FiMapPin
                          className={`w-4 h-4 flex-shrink-0 ${selectedLocation ? "text-orange-500" : "text-gray-400"}`}
                        />
                        {isLoadingLocations
                          ? "Loading locations…"
                          : selectedLocation
                            ? `${selectedLocation.name} — ${selectedLocation.city?.name}`
                            : "Select a delivery location"}
                      </span>
                      <FiChevronDown
                        className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${locationDropdownOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {locationDropdownOpen && (
                      <div className="absolute z-20 mt-2 w-full bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden max-h-64 overflow-y-auto">
                        {deliveryLocations.length === 0 ? (
                          <p className="px-4 py-4 text-sm text-gray-400 text-center">
                            No delivery locations available.
                          </p>
                        ) : (
                          deliveryLocations.map((loc) => (
                            <button
                              key={loc.id}
                              type="button"
                              onClick={() => handleSelectLocation(loc)}
                              className={`w-full px-4 py-3 text-left flex items-center justify-between hover:bg-orange-50 transition-colors ${
                                selectedLocation?.id === loc.id
                                  ? "bg-orange-50"
                                  : ""
                              }`}
                            >
                              <div>
                                <p className="text-sm font-semibold text-gray-800">
                                  {loc.name}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                  {loc.city?.name}
                                </p>
                              </div>
                              <span className="text-sm font-bold text-orange-500 flex-shrink-0 ml-4">
                                ₦{Number(loc.delivery_fee).toLocaleString()}
                              </span>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )}

                {selectedLocation && (
                  <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-orange-50 border border-orange-100 rounded-xl text-xs text-orange-700">
                    <FiMapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>
                      Delivering to:{" "}
                      <strong>
                        {selectedLocation.name}, {selectedLocation.city?.name}
                      </strong>
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* ZIP code — only relevant for delivery */}
            {orderType === "delivery" && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                    Delivery Address *
                  </label>
                  <input
                    type="text"
                    name="deliveryAddress"
                    value={formData.delivery_address}
                    onChange={handleChange}
                    placeholder="Admin Block A"
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="224455"
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </>
            )}
          </div>

          {/* ── Order Summary ── */}
          <div className="bg-white rounded-3xl p-6 md:p-8 h-fit border border-gray-100 shadow-sm">
            <h3 className="font-black text-xl mb-6">Order Summary</h3>

            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id}>
                  <div className="flex justify-between">
                    <span className="text-gray-700">
                      {item.quantity}x {item.menu?.name}
                    </span>
                    <span className="font-bold">
                      {new Intl.NumberFormat("en-NG", {
                        style: "currency",
                        currency: "NGN",
                        minimumFractionDigits: 0,
                      }).format(getItemTotal(item))}
                    </span>
                  </div>
                  {item.packaging && (
                    <div className="flex justify-between items-center mt-1 ml-3">
                      <span className="text-xs text-gray-400 capitalize">
                        Packaging:{" "}
                        <span className="font-medium text-gray-500">
                          {item.packaging.size_name}
                        </span>
                      </span>
                      <span className="text-xs text-gray-400">
                        +₦{Number(item.packaging.price).toLocaleString()}
                        <span className="text-gray-300"> / item</span>
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-3 mb-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-bold">
                  {new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                    minimumFractionDigits: 0,
                  }).format(subtotal)}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>{`Discount (${discountPercent}%)`}:</span>
                  <span className="font-bold flex items-center gap-2">
                    -₦
                    {discountAmount
                      .toFixed(2)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    <button
                      onClick={handleRemoveDiscount}
                      disabled={removingDiscount}
                      className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {removingDiscount ? (
                        <span className="spinner" />
                      ) : (
                        <FaTimes className="w-3 h-3" />
                      )}
                    </button>
                  </span>
                </div>
              )}

              {orderType === "delivery" && (
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Delivery Fee
                    {selectedLocation && (
                      <span className="ml-1 text-xs text-gray-400">
                        ({selectedLocation.name})
                      </span>
                    )}
                    :
                  </span>
                  {selectedLocation ? (
                    <span className="font-bold">
                      ₦{Number(deliveryFee).toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400 italic">
                      Select a location
                    </span>
                  )}
                </div>
              )}

              {isLoadingTax ? (
                <p className="text-center text-sm text-gray-400 p-2">
                  Loading Tax Amounts...
                </p>
              ) : (
                taxList?.map((tax) => {
                  const taxAmount = (tax.rate / 100) * subtotal;
                  return (
                    <div key={tax.id} className="flex justify-between">
                      <span className="text-gray-600">{`${tax.name} (${tax.rate}%)`}</span>
                      <span className="font-bold">
                        {new Intl.NumberFormat("en-NG", {
                          style: "currency",
                          currency: "NGN",
                          minimumFractionDigits: 0,
                        }).format(Math.ceil(taxAmount))}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200 mb-6">
              <span className="font-black text-xl">Total Paid:</span>
              <span className="font-black text-2xl text-orange-500">
                {new Intl.NumberFormat("en-NG", {
                  style: "currency",
                  currency: "NGN",
                  minimumFractionDigits: 0,
                }).format(Math.ceil(grandTotal))}
              </span>
            </div>

            <button
              onClick={handleSubmit}
              disabled={
                isSubmitting ||
                isLoadingTax ||
                (orderType === "delivery" && !selectedLocation)
              }
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-full font-bold transition-colors"
            >
              {isSubmitting ? "Processing..." : "Pay Now"}
            </button>

            {orderType === "delivery" && !selectedLocation && (
              <p className="text-center text-xs text-gray-400 mt-3">
                Select a delivery location to continue
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderTypeForm;
