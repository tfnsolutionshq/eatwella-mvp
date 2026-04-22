import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaTimes } from "react-icons/fa";
import { FiMapPin, FiChevronDown, FiCheckCircle } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import { checkWorkingHourAvailability } from "../../utils/checkWorkingHours";
import WorkingHoursClosedModal from "../Modals/WorkingHoursInfoModal";

// ─────────────────────────────────────────────────────────────────────────────
// DEV TOGGLE
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

const fetchAvailableTables = async () => {
  if (USING_DUMMY_TABLES) {
    await new Promise((res) => setTimeout(res, 400));
    return DUMMY_TABLES.filter((t) => t.is_available);
  }
  const { data } = await api.get("/tables");
  const all = Array.isArray(data) ? data : (data.data ?? []);
  return all.filter((t) => t.is_available);
};

function OrderTypeForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useCart();
  const { user } = useAuth();
  const orderType = location.state?.orderType || "pickup";
  const paymentMethod = location.state?.paymentMethod;

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    deliveryAddress: "",
  });

  // ── Saved delivery details ─────────────────────────────────────────────────
  // Uses the first saved address from the user's profile (user.addresses[0]).
  // The zone object within it maps directly to the selectedLocation shape.
  const savedDelivery = user?.addresses?.[0] ?? null;
  const hasSavedDelivery = orderType === "delivery" && !!savedDelivery;
  const [useSavedDelivery, setUseSavedDelivery] = useState(false);

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
  const [checkingHours, setCheckingHours] = useState(false);
  const [availableTables, setAvailableTables] = useState([]);
  const [isLoadingTables, setIsLoadingTables] = useState(false);
  const [tablesError, setTablesError] = useState(null);
  const [closedModal, setClosedModal] = useState({
    open: false,
    message: "",
    schedule: [],
  });

  const cartItems = cart?.items || [];

  // ── Totals ────────────────────────────────────────────────────────────────
  const getItemTotal = (item) =>
    (Number(item.menu.price) + Number(item.packaging?.price ?? 0)) *
    item.quantity;

  // Items + packaging
  const subtotal = cartItems.reduce((sum, item) => sum + getItemTotal(item), 0);

  // Delivery (separate)
  const deliveryFee =
    orderType === "delivery" ? Number(selectedLocation?.delivery_fee ?? 0) : 0;

  // Discount (applies ONLY to subtotal)
  const discountValue = Number(cart?.discount?.value ?? 0);
  const discountType = cart?.discount?.type ?? null;

  let discountAmount = 0;

  if (discountType === "percentage") {
    discountAmount = (discountValue / 100) * subtotal;
  } else if (discountType === "fixed") {
    discountAmount = discountValue;
  }

  // Prevent negative edge case
  const safeDiscount = Math.min(discountAmount, subtotal);

  // Apply discount correctly
  const subtotalAfterDiscount = subtotal - safeDiscount;

  // Tax should apply AFTER discount (this is industry standard)
  const totalTaxAmount = taxList.reduce(
    (sum, tax) => sum + (tax.rate / 100) * subtotalAfterDiscount,
    0,
  );

  // Final total
  const grandTotal = subtotalAfterDiscount + deliveryFee + totalTaxAmount;

  // Discount %
  const discountPercent =
    subtotal > 0 ? Math.round((safeDiscount / subtotal) * 100) : 0;

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
      }));
    }
    getTaxes();
    if (orderType === "delivery") getDeliveryLocations();
    if (orderType === "dine-in") getTables();
  }, [user]);

  // ── Apply / clear saved delivery details when checkbox toggles ────────────
  useEffect(() => {
    if (!hasSavedDelivery) return;

    if (useSavedDelivery) {
      // savedDelivery.zone matches the shape the rest of the form expects
      // for selectedLocation (id, name, delivery_fee, is_active, etc.)
      setSelectedLocation(savedDelivery.zone);
      setFormData((prev) => ({
        ...prev,
        deliveryAddress: savedDelivery.street_address,
      }));
    } else {
      setSelectedLocation(null);
      setFormData((prev) => ({
        ...prev,
        deliveryAddress: "",
      }));
    }
  }, [useSavedDelivery]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSelectLocation = (loc) => {
    setSelectedLocation(loc);
    setLocationDropdownOpen(false);
    // If the user manually picks a different zone, uncheck the saved-delivery box
    if (useSavedDelivery && loc.id !== savedDelivery?.zone?.id) {
      setUseSavedDelivery(false);
    }
  };

  const checkThenSubmit = async () => {
    setCheckingHours(true);
    try {
      const { available, message, schedule } =
        await checkWorkingHourAvailability();
      if (!available) {
        setClosedModal({ open: true, message, schedule });
        return;
      }
      await handleSubmit();
    } finally {
      setCheckingHours(false);
    }
  };

  const handleSubmit = async () => {
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
            {/* Personal fields */}
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

            {/* ── Saved delivery opt-in ── */}
            {hasSavedDelivery && (
              <label className="flex items-start gap-3 cursor-pointer group select-none">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={useSavedDelivery}
                  onChange={(e) => setUseSavedDelivery(e.target.checked)}
                />

                <div
                  className={`mt-0.5 w-5 h-5 flex-shrink-0 rounded-md border-2 flex items-center justify-center transition-colors ${
                    useSavedDelivery
                      ? "bg-orange-500 border-orange-500"
                      : "border-gray-300 group-hover:border-orange-400"
                  }`}
                >
                  {useSavedDelivery && (
                    <svg
                      className="w-3 h-3 text-white"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        d="M2 6l3 3 5-5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>

                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-700 leading-snug">
                    Use my saved delivery details
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                    <span className="font-medium text-gray-500">
                      {savedDelivery.zone.name}
                    </span>
                    {" · "}
                    {savedDelivery.street_address}
                  </p>
                </div>

                {useSavedDelivery && (
                  <span className="flex-shrink-0 flex items-center gap-1 text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-200 rounded-full px-2.5 py-0.5">
                    <FiCheckCircle className="w-3 h-3" />
                    Applied
                  </span>
                )}
              </label>
            )}

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
                            ? selectedLocation.name
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
                              <p className="text-sm font-semibold text-gray-800">
                                {loc.name}
                              </p>
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
                      Delivering to: <strong>{selectedLocation.name}</strong>
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* ── Delivery address + ZIP ── */}
            {orderType === "delivery" && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                    Delivery Address *
                  </label>
                  <input
                    type="text"
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={(e) => {
                      handleChange(e);
                      // Uncheck saved details if the user edits the address manually
                      if (
                        useSavedDelivery &&
                        e.target.value !== savedDelivery?.street_address
                      ) {
                        setUseSavedDelivery(false);
                      }
                    }}
                    placeholder="Admin Block A"
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
                      {item.quantity}x {item.menu?.name} (
                      {new Intl.NumberFormat("en-NG", {
                        style: "currency",
                        currency: "NGN",
                        minimumFractionDigits: 0,
                      }).format(item.menu?.price)}
                      )
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

              {safeDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>{`Discount (${discountPercent}%)`}:</span>
                  <span className="font-bold flex items-center gap-2">
                    -
                    {new Intl.NumberFormat("en-NG", {
                      style: "currency",
                      currency: "NGN",
                      minimumFractionDigits: 0,
                    }).format(Math.ceil(discountAmount))}
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
                      {new Intl.NumberFormat("en-NG", {
                        style: "currency",
                        currency: "NGN",
                        minimumFractionDigits: 0,
                      }).format(Math.ceil(deliveryFee))}
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
                  const taxAmount = (tax.rate / 100) * subtotalAfterDiscount;
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
              onClick={checkThenSubmit}
              disabled={
                isSubmitting ||
                checkingHours ||
                taxList.length < 1 ||
                (orderType === "delivery" && !selectedLocation)
              }
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-full font-bold transition-colors"
            >
              {isSubmitting || checkingHours || taxList.length < 1
                ? "Processing..."
                : "Pay Now"}
            </button>

            {orderType === "delivery" && !selectedLocation && (
              <p className="text-center text-xs text-gray-400 mt-3">
                Select a delivery location to continue
              </p>
            )}
          </div>
        </div>
      </div>

      <WorkingHoursClosedModal
        isOpen={closedModal.open}
        message={closedModal.message}
        schedule={closedModal.schedule}
        onClose={() =>
          setClosedModal({ open: false, message: "", schedule: [] })
        }
      />
    </div>
  );
}

export default OrderTypeForm;
