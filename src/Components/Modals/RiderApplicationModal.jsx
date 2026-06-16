import { useState, useRef, useEffect } from "react";
import { FiX, FiUser, FiMail, FiPhone, FiMapPin, FiUpload, FiChevronDown } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import api from "../../utils/api";

const VEHICLE_TYPES = ["Bicycle", "Tricycle", "Motorcycle", "Car"];

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  vehicleType: "",
  profilePhoto: null,
};

const RiderApplicationModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState(initialForm);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoError, setPhotoError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Location state
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [zones, setZones] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedZone, setSelectedZone] = useState("");
  const [isCitiesLoading, setIsCitiesLoading] = useState(false);
  const [isZonesLoading, setIsZonesLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchStates();
    }
  }, [isOpen]);

  const fetchStates = async () => {
    try {
      const { data } = await api.get("/states");
      setStates(data);
    } catch (err) {
      console.error("Failed to fetch states:", err);
    }
  };

  const handleStateChange = async (stateId) => {
    setSelectedState(stateId);
    setSelectedCity("");
    setSelectedZone("");
    setCities([]);
    setZones([]);

    if (stateId) {
      setIsCitiesLoading(true);
      try {
        const { data } = await api.get(`/cities?state_id=${stateId}`);
        setCities(data);
      } catch (err) {
        console.error("Failed to fetch cities:", err);
      } finally {
        setIsCitiesLoading(false);
      }
    }
  };

  const handleCityChange = async (cityId) => {
    setSelectedCity(cityId);
    setSelectedZone("");
    setZones([]);

    if (cityId) {
      setIsZonesLoading(true);
      try {
        const { data } = await api.get(`/zones?city_id=${cityId}`);
        const activeZones = data.filter((zone) => zone.is_active);
        setZones(activeZones);
      } catch (err) {
        console.error("Failed to fetch zones:", err);
      } finally {
        setIsZonesLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhotoError("");

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      setPhotoError("Only JPG/PNG files are allowed.");
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxSize) {
      setPhotoError("File size must be under 5MB.");
      return;
    }

    setFormData((prev) => ({ ...prev, profilePhoto: file }));
    setPhotoPreview(URL.createObjectURL(file));
  };

  const isFormComplete =
    formData.firstName.trim() &&
    formData.lastName.trim() &&
    formData.email.trim() &&
    formData.phone.trim() &&
    formData.address.trim() &&
    formData.vehicleType &&
    selectedState &&
    selectedCity &&
    selectedZone &&
    formData.profilePhoto;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.profilePhoto) {
      setPhotoError("Please upload a profile photo.");
      return;
    }
    setIsLoading(true);

    try{
      const res = await api.post("/rider/apply", {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        vehicle_type: formData.vehicleType,
        state_id: selectedState,
        city_id: selectedCity,
        zone_id: selectedZone,
        profilePhoto: formData.profilePhoto,
      });
  
      console.log("this is it: ", res);
    } catch (error) {
      if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Data:", error.response.data);
        console.log("Validation errors:", error.response.data.errors);
      } else if (error.request) {
        console.log("No response received:", error.request);
      } else {
        console.log("Error setting up request:", error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData(initialForm);
    setPhotoPreview(null);
    setPhotoError("");
    setSelectedState("");
    setSelectedCity("");
    setSelectedZone("");
    setCities([]);
    setZones([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <AnimatePresence>
        <motion.div
          key="rider-modal"
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-2xl">
            <div>
              <h2 className="text-xl font-black text-gray-900 font-bolota">
                Join the Team
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Fill in your details to apply as a delivery agent.
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-xl text-gray-500 transition-colors"
              aria-label="Close modal"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
            {/* First Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                First Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-green-100 focus:border-green-500 outline-none transition"
                />
              </div>
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Last Name (i.e. Surname) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-green-100 focus:border-green-500 outline-none transition"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-green-100 focus:border-green-500 outline-none transition"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Activation code will be sent here if approved.
              </p>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+234 800 000 0000"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-green-100 focus:border-green-500 outline-none transition"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">WhatsApp preferred.</p>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Residential / Office Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FiMapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street, City, State"
                  required
                  rows={3}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-green-100 focus:border-green-500 outline-none transition resize-none"
                />
              </div>
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                State <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={selectedState}
                  onChange={(e) => handleStateChange(e.target.value)}
                  required
                  className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-4 pr-10 text-sm text-gray-900 focus:ring-2 focus:ring-green-100 focus:border-green-500 outline-none transition"
                >
                  <option value="">-- Select state --</option>
                  {states.map((state) => (
                    <option key={state.id} value={state.id}>
                      {state.name}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                City <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={selectedCity}
                  onChange={(e) => handleCityChange(e.target.value)}
                  required
                  disabled={!selectedState || isCitiesLoading}
                  className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-4 pr-10 text-sm text-gray-900 focus:ring-2 focus:ring-green-100 focus:border-green-500 outline-none transition disabled:opacity-50"
                >
                  <option value="">
                    {isCitiesLoading ? "Loading cities..." : "-- Select city --"}
                  </option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Zone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Zone <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  required
                  disabled={!selectedCity || isZonesLoading}
                  className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-4 pr-10 text-sm text-gray-900 focus:ring-2 focus:ring-green-100 focus:border-green-500 outline-none transition disabled:opacity-50"
                >
                  <option value="">
                    {isZonesLoading ? "Loading zones..." : "-- Select zone --"}
                  </option>
                  {zones.map((zone) => (
                    <option key={zone.id} value={zone.id}>
                      {zone.name}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Vehicle Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Vehicle Type <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  required
                  className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-4 pr-10 text-sm text-gray-900 focus:ring-2 focus:ring-green-100 focus:border-green-500 outline-none transition"
                >
                  <option value="">-- Select vehicle type --</option>
                  {VEHICLE_TYPES.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Profile Photo */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Profile Photo <span className="text-red-500">*</span>
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-xl p-5 cursor-pointer hover:border-green-400 hover:bg-green-50/40 transition-colors flex flex-col items-center gap-3"
              >
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Profile preview"
                    className="w-24 h-24 rounded-full object-cover border-4 border-green-100 shadow"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                    <FiUpload className="w-6 h-6 text-gray-400" />
                  </div>
                )}
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-700">
                    {photoPreview ? "Click to change photo" : "Click to upload photo"}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Clear headshot · JPG or PNG · Max 5MB
                  </p>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handlePhotoChange}
                className="hidden"
              />
              {photoError && (
                <p className="text-xs text-red-500 mt-1.5">{photoError}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || !isFormComplete}
              >
                {isLoading ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default RiderApplicationModal;
