import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiMail,
  FiPhone,
  FiCalendar,
  FiMapPin,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { ModalWrapper, ErrorBanner } from "../../Components/UserDashboard/shared";
import api from "../../utils/api";

function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [profile, setProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddressesLoading, setIsAddressesLoading] = useState(false);
  
  // Address modal states
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showDeleteAddressModal, setShowDeleteAddressModal] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [deletingAddress, setDeletingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Location data
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [zones, setZones] = useState([]);
  const [isCitiesLoading, setIsCitiesLoading] = useState(false);
  const [isZonesLoading, setIsZonesLoading] = useState(false);
  
  const [addressForm, setAddressForm] = useState({
    state_id: null,
    city_id: null,
    zone_id: null,
    street_address: "",
    closest_landmark: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [profileRes, addressesRes, statesRes] = await Promise.all([
          api.get("/customer/profile"),
          api.get("/customer/addresses"),
          api.get("/states"),
        ]);
        setProfile(profileRes.data);
        setAddresses(Array.isArray(addressesRes.data) ? addressesRes.data : []);
        setStates(statesRes.data);
      } catch (err) {
        console.error("Failed to fetch profile data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const personal = {
    email: profile?.email || user?.email || "",
    phone: profile?.phone || "",
    birthday: profile?.birthday
      ? new Date(profile.birthday).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : "",
  };

  const handleLocationChange = async (e, key) => {
    if (e.target.value === "") {
      if (key === "state") {
        setCities([]);
        setZones([]);
        setAddressForm({ ...addressForm, [`${key}_id`]: e.target.value });
      } else if (key === "city") {
        setZones([]);
        setAddressForm({ ...addressForm, [`${key}_id`]: e.target.value });
      }
      return;
    }

    if (key === "state") {
      setAddressForm({ ...addressForm, [`${key}_id`]: e.target.value });
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
      setAddressForm({ ...addressForm, [`${key}_id`]: e.target.value });
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
      setAddressForm({ ...addressForm, [`${key}_id`]: e.target.value });
    }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();

    if (addressForm.city_id || addressForm.state_id || addressForm.zone_id) {
      if (!addressForm.state_id) {
        setError("Please select a state");
        return;
      }
      if (!addressForm.city_id) {
        setError("Please select a city");
        return;
      }
      if (!addressForm.zone_id) {
        setError("Please select a zone");
        return;
      }
    }

    setError("");
    setLoading(true);
    setIsAddressesLoading(true);
    try {
      if (editingAddress) {
        await api.put(`/customer/addresses/${editingAddress.id}`, addressForm);
      } else {
        const res = await api.post("/customer/addresses", addressForm);
        if (res.status === 201) {
          showToast(res.data.message, "success");
        }
      }
      const { data } = await api.get("/customer/addresses");
      setAddresses(Array.isArray(data) ? data : []);
      setShowAddressModal(false);
      setEditingAddress(null);
      setAddressForm({
        state_id: null,
        city_id: null,
        zone_id: null,
        street_address: "",
        closest_landmark: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save address");
    } finally {
      setLoading(false);
      setIsAddressesLoading(false);
    }
  };

  const handleDeleteAddress = (id) => {
    setAddressToDelete(id);
    setShowDeleteAddressModal(true);
  };

  const confirmDeleteAddress = async () => {
    setDeletingAddress(true);
    setIsAddressesLoading(true);
    try {
      await api.delete(`/customer/addresses/${addressToDelete}`);
      const { data } = await api.get("/customer/addresses");
      setAddresses(Array.isArray(data) ? data : []);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete address");
    } finally {
      setShowDeleteAddressModal(false);
      setAddressToDelete(null);
      setDeletingAddress(false);
      setIsAddressesLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
        <p className="text-gray-500 text-sm font-medium tracking-wide">
          Loading Profile...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
        <div className="p-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Personal Information</h2>
          <button
            onClick={() => navigate("/account/edit-profile")}
            className="px-3 py-1.5 rounded-full border border-gray-200 text-gray-700 text-xs hover:bg-gray-50"
          >
            Edit
          </button>
        </div>
        <div className="px-6 pb-6 space-y-4">
          {[
            {
              icon: FiMail,
              label: "Email",
              value: personal.email,
            },
            {
              icon: FiPhone,
              label: "Phone",
              value: personal.phone,
            },
            {
              icon: FiCalendar,
              label: "Birthday",
              value: personal.birthday,
            },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="bg-gray-100 rounded-xl p-4 flex items-center gap-3"
            >
              <Icon className="w-5 h-5 text-gray-600" />
              <div>
                <div className="text-xs text-gray-500">{label}</div>
                <div className="text-sm text-gray-900">
                  {value || "Not provided"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
        <div className="p-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Saved Addresses</h2>
          <button
            onClick={() => {
              setShowAddressModal(true);
              setEditingAddress(null);
              setAddressForm({
                state_id: null,
                city_id: null,
                zone_id: null,
                street_address: "",
                closest_landmark: "",
              });
            }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500 text-white text-xs hover:bg-orange-600"
          >
            <FiMapPin className="w-4 h-4" />
            <span>Add New</span>
          </button>
        </div>
        <div className="px-6 pb-6 space-y-3">
          {isAddressesLoading ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
              <p className="text-gray-400 text-xs font-medium tracking-wide">
                Loading Addresses...
              </p>
            </div>
          ) : addresses.length === 0 ? (
            <p className="text-sm text-gray-500">No addresses saved yet.</p>
          ) : (
            addresses.map((addr) => (
              <div
                key={addr.id}
                className="rounded-2xl border border-gray-100 p-5 relative"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-sm font-semibold">Address</div>
                </div>
                <div className="flex gap-2 absolute top-5 right-5">
                  <button
                    onClick={() => {
                      setEditingAddress(addr);
                      setAddressForm({
                        zone_id: addr.zone_id,
                        city_id: addr.zone.city_id,
                        state_id: addr.zone.city.state_id,
                        street_address: addr.street_address,
                        closest_landmark: addr.closest_landmark,
                      });
                      setShowAddressModal(true);
                    }}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <FiEdit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-sm text-gray-700 leading-6">
                  <div>
                    {addr.zone.city.name}, {addr.zone.name}
                  </div>
                  <div>
                    <span className="font-bold">Street Address:</span>{" "}
                    {addr.street_address}
                  </div>
                  <div>
                    <span className="font-bold">Closest Landmark:</span>{" "}
                    {addr.closest_landmark}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <ModalWrapper
          onClose={() => {
            setShowAddressModal(false);
            setError("");
            setEditingAddress(null);
            setAddressForm({
              state_id: null,
              city_id: null,
              zone_id: null,
              street_address: "",
              closest_landmark: "",
            });
          }}
        >
          <form onSubmit={handleSaveAddress}>
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold">
                {editingAddress ? "Edit Address" : "Add New Address"}
              </h3>
            </div>
            <div className="p-6 space-y-4">
              {error && <ErrorBanner message={error} />}
              {[
                {
                  label: "State",
                  key: "state",
                  required: true,
                  inputType: "dropdown",
                },
                {
                  label: "City",
                  key: "city",
                  required: true,
                  inputType: "dropdown",
                },
                {
                  label: "Zone",
                  key: "zone",
                  required: true,
                  inputType: "dropdown",
                },
                {
                  label: "Street Address",
                  key: "street_address",
                  required: true,
                  inputType: "text",
                },
                {
                  label: "Closest Landmark",
                  key: "closest_landmark",
                  required: false,
                  inputType: "text",
                },
              ].map(({ label, key, required, inputType }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                  </label>
                  {inputType === "dropdown" ? (
                    (() => {
                      const isLoadingField =
                        (key === "city" && isCitiesLoading) ||
                        (key === "zone" && isZonesLoading);

                      if (isLoadingField) {
                        return (
                          <div className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 flex items-center gap-3">
                            <div className="w-4 h-4 border-2 border-gray-300 border-t-orange-500 rounded-full animate-spin flex-shrink-0" />
                            <span className="text-sm text-gray-400">
                              Loading...
                            </span>
                          </div>
                        );
                      }

                      const isDisabled =
                        (key === "city" && !addressForm.state_id) ||
                        (key === "zone" && !addressForm.city_id);

                      return (
                        <select
                          disabled={isDisabled}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                          onChange={(e) => handleLocationChange(e, key)}
                        >
                          <option value="">Select {label.toLowerCase()}</option>
                          {key === "state" &&
                            states.map((state, index) => (
                              <option key={index} value={state.id}>
                                {state.name}
                              </option>
                            ))}
                          {key === "city" &&
                            cities.map((city, index) => (
                              <option key={index} value={city.id}>
                                {city.name}
                              </option>
                            ))}
                          {key === "zone" &&
                            zones.map((zone, index) => (
                              <option key={index} value={zone.id}>
                                {zone.name}
                              </option>
                            ))}
                        </select>
                      );
                    })()
                  ) : (
                    <input
                      type="text"
                      value={addressForm[key]}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          [key]: e.target.value,
                        })
                      }
                      required={required}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowAddressModal(false);
                  setError("");
                  setEditingAddress(null);
                  setAddressForm({
                    state_id: null,
                    city_id: null,
                    zone_id: null,
                    street_address: "",
                    closest_landmark: "",
                  });
                }}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Address"}
              </button>
            </div>
          </form>
        </ModalWrapper>
      )}

      {/* Delete Address Modal */}
      {showDeleteAddressModal && (
        <ModalWrapper
          onClose={() => {
            setShowDeleteAddressModal(false);
            setAddressToDelete(null);
          }}
        >
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-bold text-red-600">Delete Address</h3>
            <p className="text-sm text-gray-600 mt-2">
              Are you sure you want to delete this address? This action cannot
              be undone.
            </p>
          </div>
          <div className="p-6 border-t border-gray-100 flex gap-3">
            <button
              type="button"
              onClick={() => {
                setShowDeleteAddressModal(false);
                setAddressToDelete(null);
              }}
              className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmDeleteAddress}
              className="flex-1 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700"
              disabled={deletingAddress}
            >
              {deletingAddress ? "Deleting" : "Delete Address"}
            </button>
          </div>
        </ModalWrapper>
      )}
    </div>
  );
}

export default ProfilePage;
