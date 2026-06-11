import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../../utils/api";

function CreateAccountContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialEmail = location.state?.email || "";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [closestLandmark, setClosestLandmark] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ── Address selection state ────────────────────────────────────────────────
  const [selectedLocation, setSelectedLocation] = useState(null);

  // ── State → City → Zone hierarchy for manual selection ───────────────────────
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [zones, setZones] = useState([]);
  const [isCitiesLoading, setIsCitiesLoading] = useState(false);
  const [isZonesLoading, setIsZonesLoading] = useState(false);
  const [manualAddressForm, setManualAddressForm] = useState({
    state_id: null,
    city_id: null,
    zone_id: null,
    street_address: "",
  });

  useEffect(() => {
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
  }, []);

  // ── API functions ────────────────────────────────────────────────────────────
  const fetchCities = async (stateId) => {
    setIsCitiesLoading(true);
    setCities([]);
    setZones([]);
    try {
      const cityRes = await api.get(`/cities?state_id=${stateId}`);
      setCities(cityRes.data);
    } finally {
      setIsCitiesLoading(false);
    }
  };

  const fetchZones = async (cityId) => {
    setIsZonesLoading(true);
    setZones([]);
    try {
      const zoneRes = await api.get(`/zones?city_id=${cityId}`);
      const activeZones = zoneRes.data.filter((zone) => zone.is_active);
      setZones(activeZones);
    } finally {
      setIsZonesLoading(false);
    }
  };

  // ── Handlers ──────────────────────────────────────────────────────────────
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
      await fetchCities(e.target.value);
    }

    if (key === "city") {
      setManualAddressForm({
        ...manualAddressForm,
        [`${key}_id`]: e.target.value,
      });
      await fetchZones(e.target.value);
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
      setDeliveryAddress(e.target.value);
    }
  };

  // Check if all required address fields are populated
  const hasCompleteAddressFields = () => {
    return (
      manualAddressForm.state_id &&
      manualAddressForm.city_id &&
      manualAddressForm.zone_id &&
      deliveryAddress.trim() &&
      closestLandmark.trim()
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if all required fields are filled
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !phone ||
      !hasCompleteAddressFields()
    ) {
      setError(
        "Please fill in all required fields, including delivery address",
      );
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        phone,
        zone_id: Number(manualAddressForm.zone_id),
        street_address: deliveryAddress,
        closest_landmark: closestLandmark,
      };

      const response = await api.post("/customer/register", payload);
      const data = response.data;
      if (data?.token) {
        localStorage.setItem("customer_token", data.token);
        try {
          axios.defaults.headers.common["Authorization"] =
            `Bearer ${data.token}`;
        } catch {}
      }
      if (data?.user) {
        localStorage.setItem("customer_user", JSON.stringify(data.user));
      }
      localStorage.setItem("customerAuth", JSON.stringify(data));
      navigate("/account/login", { replace: true, state: { email } });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to create account";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 py-12 px-4 md:px-6 min-h-[60vh]">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 px-8 py-10 flex flex-col items-stretch text-center">
          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="08012345678"
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* ── Address Selection Section ── */}
            <div>
              <div className="space-y-4">
                {/* State Selection */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                    State
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
                    City
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
                    Zone
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

                {/* Street Address */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => {
                      setDeliveryAddress(e.target.value);
                      handleLocationChange(e, "street_address");
                    }}
                    placeholder="Block 4, Science Village"
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                {/* Closest Landmark */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                    Closest Landmark
                  </label>
                  <input
                    type="text"
                    value={closestLandmark}
                    onChange={(e) => setClosestLandmark(e.target.value)}
                    placeholder="Behind the faculty building"
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                Create Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-4 py-3 pr-14 rounded-2xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-xs text-gray-500"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                At least 6 characters.
              </p>
            </div>

            {error && (
              <div className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-2xl px-3 py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={
                loading ||
                !firstName.trim() ||
                !lastName.trim() ||
                !email.trim() ||
                !phone.trim() ||
                !password ||
                !hasCompleteAddressFields()
              }
              className="w-full py-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm tracking-wide disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => navigate("/account/login")}
            className="mt-4 text-sm text-gray-500 hover:text-gray-700"
          >
            Have an account? <span className="text-orange-700">Login</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateAccountContent;
