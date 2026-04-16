import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import {
  FiMapPin,
  FiClock,
  FiBriefcase,
  FiUpload,
  FiCheck,
  FiAlertCircle,
  FiArrowLeft,
  FiX,
  FiCalendar,
  FiList,
  FiAward,
} from "react-icons/fi";

// ── Skeleton ──────────────────────────────────────────────────────────────────
function SkeletonDetails() {
  return (
    <div className="bg-gray-50/50 min-h-screen font-sans animate-pulse">
      {/* Hero */}
      <div className="bg-gray-200 h-72 w-full" />

      <div className="max-w-4xl mx-auto px-4 md:px-8 -mt-16 relative z-10 pb-24">
        {/* Card */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 mb-8">
          {/* Tags */}
          <div className="flex gap-2 mb-5">
            <div className="h-6 w-24 bg-gray-200 rounded-full" />
            <div className="h-6 w-20 bg-gray-200 rounded-full" />
            <div className="h-6 w-28 bg-gray-200 rounded-full" />
          </div>
          {/* Title */}
          <div className="h-8 w-2/3 bg-gray-200 rounded mb-4" />
          {/* Description lines */}
          <div className="space-y-2 mb-6">
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-5/6 bg-gray-200 rounded" />
            <div className="h-4 w-4/6 bg-gray-200 rounded" />
          </div>
          <div className="h-12 w-40 bg-gray-200 rounded-full" />
        </div>

        {/* Responsibilities block */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 mb-8">
          <div className="h-6 w-48 bg-gray-200 rounded mb-5" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-gray-200 mt-0.5 flex-shrink-0" />
                <div
                  className="h-4 bg-gray-200 rounded flex-1"
                  style={{ width: `${70 + (i % 3) * 10}%` }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Requirements block */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
          <div className="h-6 w-40 bg-gray-200 rounded mb-5" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-gray-200 mt-0.5 flex-shrink-0" />
                <div
                  className="h-4 bg-gray-200 rounded flex-1"
                  style={{ width: `${60 + (i % 4) * 10}%` }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Application Modal (same pattern as VacancyItems) ─────────────────────────
function ApplicationModal({ opening, onClose }) {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    opening_id: opening.id,
  });
  const [cv, setCv] = useState(null);
  const [coverLetter, setCoverLetter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e, setFile) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!cv && !coverLetter) {
      setMessage({
        type: "error",
        text: "Please upload either a CV or a Cover Letter.",
      });
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append("full_name", formData.full_name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("opening_id", formData.opening_id);
    if (cv) data.append("cv", cv);
    if (coverLetter) data.append("cover_letter", coverLetter);

    try {
      const response = await api.post("/careers/apply", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage({
        type: "success",
        text: response.data.message || "Application submitted successfully!",
      });
      setFormData({
        full_name: "",
        email: "",
        phone: "",
        opening_id: opening.id,
      });
      setCv(null);
      setCoverLetter(null);
      document.getElementById("modal-cv-upload").value = "";
      document.getElementById("modal-cover-letter-upload").value = "";
    } catch (err) {
      let errorMsg = "Failed to submit application.";
      if (err.response?.data?.errors) {
        errorMsg = Object.values(err.response.data.errors).flat().join(" ");
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full my-8 transform transition-all animate-in fade-in zoom-in duration-300">
        {/* Modal header */}
        <div className="relative bg-orange-500 p-8 rounded-t-[2.5rem] overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10 flex justify-between items-start">
            <div className="text-white">
              <h2 className="text-3xl font-bold mb-2">Apply Now</h2>
              <p className="text-orange-100 font-medium text-lg">
                {opening.title}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-8">
          {message.text && (
            <div
              className={`mb-6 p-4 rounded-2xl flex items-center gap-3 ${
                message.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-100"
                  : "bg-red-50 text-red-700 border border-red-100"
              }`}
            >
              <div
                className={`p-2 rounded-full ${message.type === "success" ? "bg-green-100" : "bg-red-100"}`}
              >
                {message.type === "success" ? (
                  <FiCheck className="w-5 h-5" />
                ) : (
                  <FiAlertCircle className="w-5 h-5" />
                )}
              </div>
              <p className="font-medium">{message.text}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. John Doe"
                  className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="e.g. john@example.com"
                  className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="e.g. +234 800 000 0000"
                className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {/* CV Upload */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">
                  CV / Resume <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <input
                    type="file"
                    id="modal-cv-upload"
                    onChange={(e) => handleFileChange(e, setCv)}
                    accept=".pdf,.doc,.docx"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div
                    className={`w-full px-4 py-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center transition-all duration-300 ${
                      cv
                        ? "border-green-500 bg-green-50/50"
                        : "border-gray-200 bg-gray-50 group-hover:border-orange-400 group-hover:bg-orange-50"
                    }`}
                  >
                    {cv ? (
                      <>
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2 text-green-600">
                          <FiCheck className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-bold text-green-700 truncate max-w-full px-2">
                          {cv.name}
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2 text-gray-400 group-hover:bg-orange-100 group-hover:text-orange-500 transition-colors">
                          <FiUpload className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium text-gray-500 group-hover:text-orange-600">
                          Upload CV
                        </span>
                        <span className="text-xs text-gray-400 mt-1">
                          PDF or DOC
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Cover Letter Upload */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">
                  Cover Letter{" "}
                  <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <div className="relative group">
                  <input
                    type="file"
                    id="modal-cover-letter-upload"
                    onChange={(e) => handleFileChange(e, setCoverLetter)}
                    accept=".pdf,.doc,.docx"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div
                    className={`w-full px-4 py-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center transition-all duration-300 ${
                      coverLetter
                        ? "border-green-500 bg-green-50/50"
                        : "border-gray-200 bg-gray-50 group-hover:border-orange-400 group-hover:bg-orange-50"
                    }`}
                  >
                    {coverLetter ? (
                      <>
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2 text-green-600">
                          <FiCheck className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-bold text-green-700 truncate max-w-full px-2">
                          {coverLetter.name}
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2 text-gray-400 group-hover:bg-orange-100 group-hover:text-orange-500 transition-colors">
                          <FiUpload className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium text-gray-500 group-hover:text-orange-600">
                          Upload Letter
                        </span>
                        <span className="text-xs text-gray-400 mt-1">
                          PDF or DOC
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg shadow-lg hover:shadow-orange-500/40 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all transform active:scale-[0.98]"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  "Submit Application"
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 mt-3 text-gray-500 font-bold hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
function VacancyItemDetails() {
  const { careerId } = useParams();
  const navigate = useNavigate();
  const [opening, setOpening] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchOpening = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await api.get(`/careers/openings/${careerId}`);
        // Handle both direct object and wrapped { data: {...} } responses
        setOpening(data?.data ?? data);
      } catch (err) {
        console.error("Failed to fetch opening:", err);
        setError(err.response?.status === 404 ? "not_found" : "network_error");
      } finally {
        setLoading(false);
      }
    };

    fetchOpening();
  }, [careerId]);

  if (loading) return <SkeletonDetails />;

  // ── Error states ──
  if (error) {
    const isNotFound = error === "not_found";
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center px-4">
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-12 max-w-md w-full text-center">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${isNotFound ? "bg-gray-100" : "bg-red-50"}`}
          >
            <FiBriefcase
              className={`w-10 h-10 ${isNotFound ? "text-gray-400" : "text-red-400"}`}
            />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {isNotFound ? "Opening Not Found" : "Failed to Load"}
          </h3>
          <p className="text-gray-500 mb-8">
            {isNotFound
              ? "This job opening doesn't exist or may have been removed."
              : "We couldn't load this opening. Please check your connection and try again."}
          </p>
          <div className="flex flex-col gap-3">
            {!isNotFound && (
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 rounded-full bg-orange-500 text-white font-bold hover:bg-orange-600 transition-colors"
              >
                Try Again
              </button>
            )}
            <button
              onClick={() => navigate("/careers")}
              className="w-full py-3 rounded-full border-2 border-gray-200 text-gray-700 font-bold hover:border-gray-900 transition-colors"
            >
              Back to Openings
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Parse list fields — API may return arrays or newline-separated strings ──
  const parseList = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val.filter(Boolean);
    return val
      .split(/\n|;/)
      .map((s) => s.trim())
      .filter(Boolean);
  };
  const requirements = parseList(opening.requirements);

  return (
    <div className="bg-gray-50/50 min-h-screen font-sans">
      {/* ── Hero image / banner ── */}
      <div className="relative h-72 md:h-96 bg-gray-900 overflow-hidden">
        {opening.image_path ? (
          <img
            src={`https://eatwella.tfnsolutions.us/storage/${opening.image_path}`}
            alt={opening.title}
            className="w-full h-full object-cover opacity-60"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900" />
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />

        {/* Back button */}
        <button
          onClick={() => navigate("/careers")}
          className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full font-bold transition-all"
        >
          <FiArrowLeft className="w-4 h-4" />
          All Openings
        </button>

        {/* Hero text */}
        <div className="absolute bottom-8 left-6 right-6 md:left-12 text-white">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <FiBriefcase className="w-3.5 h-3.5" /> {opening.role}
            </span>
            <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <FiClock className="w-3.5 h-3.5" /> {opening.employment_type}
            </span>
            <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <FiMapPin className="w-3.5 h-3.5" /> {opening.location}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">
            {opening.title}
          </h1>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-10 pb-24">
        {/* Overview card */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            About This Role
          </h2>
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">
            {opening.description}
          </p>

          {/* Quick meta row */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-100">
            {opening.employment_type && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <FiClock className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Type</p>
                  <p className="text-sm font-bold text-gray-800">
                    {opening.employment_type}
                  </p>
                </div>
              </div>
            )}
            {opening.location && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <FiMapPin className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Location</p>
                  <p className="text-sm font-bold text-gray-800">
                    {opening.location}
                  </p>
                </div>
              </div>
            )}
            {opening.role && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <FiBriefcase className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">
                    Department
                  </p>
                  <p className="text-sm font-bold text-gray-800">
                    {opening.role}
                  </p>
                </div>
              </div>
            )}
            {opening.deadline && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <FiCalendar className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Deadline</p>
                  <p className="text-sm font-bold text-gray-800">
                    {new Date(opening.deadline).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Requirements */}
        {requirements.length > 0 && (
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center">
                <FiAward className="w-5 h-5 text-orange-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Requirements</h2>
            </div>
            <ul className="space-y-3">
              {requirements.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FiCheck className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-gray-600 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Sticky Apply CTA */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 px-4 py-4 z-40">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            <div className="hidden md:block">
              <p className="font-bold text-gray-900">{opening.title}</p>
              <p className="text-sm text-gray-500">
                {opening.location} · {opening.employment_type}
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="w-full md:w-auto px-10 py-4 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg shadow-lg hover:shadow-orange-500/40 transition-all transform active:scale-95"
            >
              Apply for This Role
            </button>
          </div>
        </div>
      </div>

      {/* Application modal */}
      {showModal && (
        <ApplicationModal
          opening={opening}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default VacancyItemDetails;
