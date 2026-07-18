import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaTimes } from "react-icons/fa";
import { FiMapPin, FiChevronDown, FiCheckCircle, FiHome } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
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
  const { showToast } = useToast(); // Added useToast hook
  const orderType = location.state?.orderType || "pickup";
  const paymentMethod = location.state?.paymentMethod;

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    deliveryAddress: "",
  });

  // ── Saved delivery details ─────────────────────────────────────────────────
  const savedAddresses = user?.addresses ?? [];
  const hasSavedAddresses =
    orderType === "delivery" && savedAddresses.length > 0;
  const [selectedSavedAddress, setSelectedSavedAddress] = useState(null);
  const [useManualSelection, setUseManualSelection] = useState(false);

  // ── Delivery location state ────────────────────────────────────────────────
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [locationsError, setLocationsError] = useState(null);
  const [deliveryLocations, setDeliveryLocations] = useState([]);

  // ── State → City → Zone hierarchy for manual selection ───────────────────────
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [zones, setZones] = useState([]);
  const [isCitiesLoading, setIsCitiesLoading] = useState(false);
  const [isZonesLoading, setIsZonesLoading] = useState(false);
  const [manualAddressForm, setManualAddressForm] = useState({
    state_id: null,
    city_id: null,
    city_name: "",
    zone_id: null,
    street_address: "",
  });

  // ── Other state ───────────────────────────────────────────────────────────
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingTax, setIsLoadingTax] = useState(false);
  const [removingDiscount, setRemovingDiscount] = useState(false);
  const [taxList, setTaxList] = useState([]);
  const [taxMode, setTaxMode] = useState(null); // "inclusive" | "exclusive"
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

  // Base food price only (excluding packaging)
  const baseSubtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.menu.price) * item.quantity,
    0,
  );

  // Packaging fees only
  const totalPackagingFee = cartItems.reduce(
    (sum, item) => sum + (item.packaging?.price ?? 0) * item.quantity,
    0,
  );

  // Items + packaging
  const subtotal = baseSubtotal + totalPackagingFee;

  // Delivery (separate)
  const deliveryFee =
    orderType === "delivery" ? Number(selectedLocation?.delivery_fee ?? 0) : 0;

  // Discount (applies ONLY to base food price)
  const discountValue = Number(cart?.discount?.value ?? 0);
  const discountType = cart?.discount?.type ?? null;

  let discountAmount = 0;

  if (discountType === "percentage") {
    discountAmount = (discountValue / 100) * baseSubtotal;
  } else if (discountType === "fixed") {
    discountAmount = discountValue;
  }

  // Prevent negative edge case
  const safeDiscount = Math.min(discountAmount, baseSubtotal);

  // Apply discount correctly to base price only
  const baseSubtotalAfterDiscount = baseSubtotal - safeDiscount;

  // Tax should apply to base food price AFTER discount (excluding packaging)
  // Only applies when tax mode is exclusive; inclusive tax is already in item prices
  const isExclusiveTax = taxMode === "exclusive";

  const totalTaxAmount = isExclusiveTax
    ? taxList.reduce(
        (sum, tax) => sum + (Number(tax.rate) / 100) * baseSubtotalAfterDiscount,
        0,
      )
    : 0;

  // Final total includes discounted base price + packaging + delivery + tax (if exclusive)
  const grandTotal =
    baseSubtotalAfterDiscount +
    totalPackagingFee +
    deliveryFee +
    totalTaxAmount;

  // Discount %
  const discountPercent =
    baseSubtotal > 0 ? Math.round((safeDiscount / baseSubtotal) * 100) : 0;

  // ── Data fetching ─────────────────────────────────────────────────────────
  const getTaxes = async () => {
    setIsLoadingTax(true);
    try {
      const response = await api.get("/tax-mode");
      const taxModeValue = response.data.data?.tax_mode ?? response.data.tax_mode;
      setTaxMode(taxModeValue);
      if (taxModeValue === "exclusive"){
        const { data } = await api.get("/taxes");
        setTaxList(data.taxes ?? []);
      }
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

    // Fetch states for manual address selection
    const fetchStates = async () => {
      try {
        const statesRes = await api.get("/states");
        setStates(statesRes.data);
      } catch (err) {
        console.error("Failed to fetch states:", err);
      }
    };
    fetchStates();
  }, [user]);

  // ── Apply saved address when selected ──────────────────────────────────────
  useEffect(() => {
    if (selectedSavedAddress && !useManualSelection) {
      // selectedSavedAddress.zone matches the shape the rest of the form expects
      // for selectedLocation (id, name, delivery_fee, is_active, etc.)
      setSelectedLocation(selectedSavedAddress.zone);
      setFormData((prev) => ({
        ...prev,
        deliveryAddress: selectedSavedAddress.street_address,
      }));
    } else if (useManualSelection) {
      // Clear saved address data when switching to manual selection
      setSelectedSavedAddress(null);
    }
  }, [selectedSavedAddress, useManualSelection]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSelectLocation = (loc) => {
    setSelectedLocation(loc);
    setLocationDropdownOpen(false);
    // When manually selecting a zone, clear saved address selection
    setSelectedSavedAddress(null);
    setUseManualSelection(true);
  };

  const handleSelectSavedAddress = (address) => {
    setSelectedSavedAddress(address);
    setUseManualSelection(false);
    setLocationDropdownOpen(false);
  };

  const handleUseManualSelection = () => {
    setUseManualSelection(true);
    setSelectedSavedAddress(null);
    setSelectedLocation(null);
    setManualAddressForm({
      state_id: null,
      city_id: null,
      zone_id: null,
      street_address: "",
    });
    setCities([]);
    setZones([]);
  };

  const handleLocationChange = async (e, key) => {
    if (e.target.value === "") {
      if (key === "state") {
        setCities([]);
        setZones([]);
        setManualAddressForm({
          ...manualAddressForm,
          [`${key}_id`]: e.target.value,
        });
      } else if (key === "city") {
        setZones([]);
        setManualAddressForm({
          ...manualAddressForm,
          [`${key}_id`]: e.target.value,
        });
      }
      return;
    }

    if (key === "state") {
      setManualAddressForm({
        ...manualAddressForm,
        [`${key}_id`]: e.target.value,
      });
      setIsCitiesLoading(true);
      setCities([]);
      setZones([]);
      try {
        const cityRes = await api.get(`/cities?state_id=${e.target.value}`);
        setCities(cityRes.data);
      } finally {
        setIsCitiesLoading(false);
      }
    }

    if (key === "city") {
      const selectedCity = cities.find(
        (city) => city.id.toString() === e.target.value,
      );
      setManualAddressForm({
        ...manualAddressForm,
        [`${key}_id`]: e.target.value,
        city_name: selectedCity ? selectedCity.name : "",
      });
      setIsZonesLoading(true);
      setZones([]);
      try {
        const zoneRes = await api.get(`/zones?city_id=${e.target.value}`);
        const activeZones = zoneRes.data.filter((zone) => zone.is_active);
        setZones(activeZones);
      } finally {
        setIsZonesLoading(false);
      }
    }

    if (key === "zone") {
      setManualAddressForm({
        ...manualAddressForm,
        [`${key}_id`]: e.target.value,
      });
      // Update selectedLocation when zone is selected
      const selectedZone = zones.find(
        (zone) => zone.id.toString() === e.target.value,
      );
      if (selectedZone) {
        setSelectedLocation(selectedZone);
      }
    }

    if (key === "street_address") {
      setManualAddressForm({
        ...manualAddressForm,
        street_address: e.target.value,
      });
      setFormData((prev) => ({ ...prev, deliveryAddress: e.target.value }));
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
      showToast("Please fill in all required fields", "error");
      return;
    }
    if (orderType === "delivery" && !selectedLocation) {
      showToast("Please select a delivery zone", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        order_type: orderType === "dine-in" ? "dine" : orderType,
        payment_type: paymentMethod,
        customer_name: formData.fullName,
        customer_email: formData.email,
        customer_phone: formData.phone,
        callback_url: `${window.location.origin}/receipt`,
        items: cartItems.map((item) => ({
          menu_id: item.menu.id,
          quantity: item.quantity,
          packaging_id: item.packaging_id,
        })),
      };

      if (orderType === "delivery") {
        if (selectedLocation) {
          payload.delivery_zone_id = selectedLocation.id;
          // Extract city name from saved address or manual selection
          payload.delivery_city =
            selectedSavedAddress?.city?.name ||
            selectedSavedAddress?.zone?.city?.name ||
            selectedLocation?.city?.name ||
            manualAddressForm.city_name ||
            "";
        }
        payload.delivery_address = formData.deliveryAddress;
      }

      const response = await api.post("/checkout", payload);

      if (paymentMethod === "cash") {
        navigate(`/receipt/${response.data.order.id}`);
        return;
      }

      if (response.data.payment?.authorization_url) {
        window.location.href = response.data.payment.authorization_url;
      } else {
        showToast("Failed to initialize payment gateway", "error");
      }
    } catch (error) {
      console.error("Payment error:", error);
      showToast(
        error.response?.data?.message || "Failed to process payment",
        "error",
      );
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

            {/* ── Saved address selection ── */}
            {hasSavedAddresses && (
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                  Saved Addresses
                </label>

                {!useManualSelection && selectedSavedAddress ? (
                  <div className="relative">
                    <div className="w-full px-4 py-3 rounded-2xl border border-orange-300 bg-orange-50 text-sm text-left flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <FiHome className="w-4 h-4 text-orange-500 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-gray-800">
                            {selectedSavedAddress.zone.name}
                          </div>
                          <div className="text-xs text-gray-600">
                            {selectedSavedAddress.street_address}
                          </div>
                        </div>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSavedAddress(null);
                          setUseManualSelection(true);
                        }}
                        className="text-xs text-orange-600 hover:text-orange-700 font-medium"
                      >
                        Change
                      </button>
                    </div>

                    <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-100 rounded-xl text-xs text-green-700">
                      <FiCheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>
                        Using saved address:{" "}
                        <strong>{selectedSavedAddress.zone.name}</strong>
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <select
                      value=""
                      onChange={(e) => {
                        const addressId = e.target.value;
                        if (addressId) {
                          const address = savedAddresses.find(
                            (addr) => addr.id.toString() === addressId,
                          );
                          if (address) {
                            handleSelectSavedAddress(address);
                          }
                        }
                      }}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">Select a saved address</option>
                      {savedAddresses.map((address) => (
                        <option key={address.id} value={address.id}>
                          {address.zone.name} - {address.street_address}
                        </option>
                      ))}
                    </select>

                    <div className="flex items-center justify-center">
                      <span className="text-xs text-gray-400">or</span>
                    </div>

                    <button
                      type="button"
                      onClick={handleUseManualSelection}
                      className="w-full px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-2xl border border-gray-200 transition-colors"
                    >
                      {manualAddressForm.state_id ||
                      manualAddressForm.city_id ||
                      manualAddressForm.zone_id ||
                      manualAddressForm.street_address
                        ? "Clear selection"
                        : "Select zone manually"}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ── Manual address entry: State → City → Zone ── */}
            {orderType === "delivery" &&
              (!hasSavedAddresses || useManualSelection) && (
                <div className="space-y-4">
                  {/* State Selection */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                      State *
                    </label>
                    <select
                      value={manualAddressForm.state_id || ""}
                      onChange={(e) => handleLocationChange(e, "state")}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">Select a state</option>
                      {states.map((state) => (
                        <option key={state.id} value={state.id}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* City Selection */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                      City *
                    </label>
                    <select
                      value={manualAddressForm.city_id || ""}
                      onChange={(e) => handleLocationChange(e, "city")}
                      disabled={!manualAddressForm.state_id || isCitiesLoading}
                      className="w-full px-4 py-3 rounded-2xl border bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {isCitiesLoading
                          ? "Loading cities..."
                          : !manualAddressForm.state_id
                            ? "Select a state first"
                            : "Select a city"}
                      </option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Zone Selection */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                      Zone *
                    </label>
                    <select
                      value={manualAddressForm.zone_id || ""}
                      onChange={(e) => handleLocationChange(e, "zone")}
                      disabled={!manualAddressForm.city_id || isZonesLoading}
                      className="w-full px-4 py-3 rounded-2xl border bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {isZonesLoading
                          ? "Loading zones..."
                          : !manualAddressForm.city_id
                            ? "Select a city first"
                            : "Select a zone"}
                      </option>
                      {zones.map((zone) => (
                        <option key={zone.id} value={zone.id}>
                          {zone.name || zone.zone_name}
                        </option>
                      ))}
                    </select>
                  </div>

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
                      handleLocationChange(e, "street_address");
                      // Clear saved address if the user edits the address manually
                      if (
                        selectedSavedAddress &&
                        e.target.value !== selectedSavedAddress.street_address
                      ) {
                        setSelectedSavedAddress(null);
                        setUseManualSelection(true);
                      }
                    }}
                    readOnly={!selectedLocation || !!selectedSavedAddress}
                    placeholder={
                      selectedSavedAddress
                        ? selectedSavedAddress.street_address
                        : useManualSelection
                          ? "Enter your street address"
                          : "Admin Block A"
                    }
                    className={`w-full px-4 py-3 rounded-2xl border text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      selectedSavedAddress
                        ? "border-gray-200 bg-gray-100 text-gray-600 cursor-not-allowed"
                        : useManualSelection
                          ? "border-gray-200 bg-white"
                          : "border-gray-200 bg-gray-50"
                    }`}
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
                  const taxAmount =
                    (tax.rate / 100) * baseSubtotalAfterDiscount;
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
                isLoadingTax ||
                (orderType === "delivery" && !formData.deliveryAddress.trim())
              }
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-full font-bold transition-colors"
            >
              {isSubmitting || checkingHours || isLoadingTax
                ? "Processing..."
                : "Pay Now"}
            </button>

            {orderType === "delivery" && !formData.deliveryAddress.trim() && (
              <p className="text-center text-xs text-gray-400 mt-3">
                Enter a delivery address to continue
              </p>
            )}

            {!isLoadingTax && isExclusiveTax && taxList.length === 0 && (
              <p className="text-center text-xs text-green-600 mt-3">
                No taxes for this order
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
