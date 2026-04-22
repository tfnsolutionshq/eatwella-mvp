import { useState, useEffect, useRef } from "react";
import DashboardLayout from "../../DashboardLayout/DashboardLayout";
import {
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiX,
  FiUpload,
  FiCalendar,
  FiLink,
  FiImage,
  FiAlignLeft,
  FiFilter,
  FiMoreVertical,
  FiSend,
  FiArchive,
  FiAlertCircle,
  FiChevronDown,
} from "react-icons/fi";
import api from "../../utils/api";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-NG", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

const today = () => new Date().toISOString().split("T")[0];

const EMPTY_FORM = {
  title: "",
  details: "",
  start_date: "",
  end_date: "",
  status: "draft",
  type: "banner",
  url: "",
  image: null,
  imagePreview: null,
};

// ─── Skeleton Components ──────────────────────────────────────────────────────
function SkeletonStatCard() {
  return (
    <div className="rounded-2xl border border-gray-100 px-4 py-3 bg-gray-50 animate-pulse">
      <div className="h-3 w-16 bg-gray-200 rounded mb-2" />
      <div className="h-8 w-10 bg-gray-200 rounded" />
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-50">
      <td className="px-5 py-4 pl-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-200 animate-pulse flex-shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-3.5 w-40 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-56 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      </td>
      <td className="px-5 py-4">
        <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse" />
      </td>
      <td className="px-5 py-4">
        <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse" />
      </td>
      <td className="px-5 py-4">
        <div className="space-y-1.5">
          <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 w-20 bg-gray-100 rounded animate-pulse" />
        </div>
      </td>
      <td className="px-5 py-4 pr-6">
        <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
      </td>
    </tr>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const styles =
    status === "published"
      ? "bg-green-100 text-green-700 border border-green-200"
      : "bg-amber-100 text-amber-700 border border-amber-200";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${status === "published" ? "bg-green-500" : "bg-amber-500"}`}
      />
      {status === "published" ? "Published" : "Draft"}
    </span>
  );
}

function TypeBadge({ type }) {
  return type === "modal" ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200">
      <FiImage className="w-3 h-3" /> Modal
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
      <FiAlignLeft className="w-3 h-3" /> Banner
    </span>
  );
}

function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel,
  confirmClass,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <FiAlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">{message}</p>
          </div>
        </div>
        <div className="flex gap-3 justify-end pt-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-semibold text-white rounded-xl transition-colors ${confirmClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function PreviewModal({ campaign, onClose }) {
  if (!campaign) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-black text-gray-900">Campaign Preview</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {campaign.type === "modal" && campaign.image_url && (
            <img
              src={campaign.image_url}
              alt={campaign.title}
              className="w-full h-48 object-cover rounded-2xl"
            />
          )}
          {campaign.type === "banner" && (
            <div className="bg-orange-500 text-white px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
              <span className="text-base">📢</span>
              <span>
                {campaign.title}: {campaign.details}
              </span>
            </div>
          )}
          {campaign.type === "modal" && (
            <div>
              <h4 className="text-lg font-black text-gray-900">
                {campaign.title}
              </h4>
              <p className="text-sm text-gray-600 mt-1">{campaign.details}</p>
              {campaign.url && (
                <a
                  href={campaign.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 mt-3 text-sm text-orange-500 font-semibold hover:underline"
                >
                  <FiLink className="w-3.5 h-3.5" /> Learn More
                </a>
              )}
            </div>
          )}
          <div className="grid grid-cols-2 gap-3 text-xs text-gray-500 pt-2 border-t border-gray-100">
            <div>
              <span className="font-semibold text-gray-700">Start:</span>{" "}
              {formatDate(campaign.start_date)}
            </div>
            <div>
              <span className="font-semibold text-gray-700">End:</span>{" "}
              {formatDate(campaign.end_date)}
            </div>
            <div className="flex items-center gap-1.5">
              <StatusBadge status={campaign.status} />
            </div>
            <div className="flex items-center gap-1.5">
              <TypeBadge type={campaign.type} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Campaign Form Modal ──────────────────────────────────────────────────────
function CampaignFormModal({ mode, initialData, onClose, onSave }) {
  const [form, setForm] = useState(
    mode === "edit" && initialData
      ? {
          ...EMPTY_FORM,
          ...initialData,
          // Map API field names to form field names
          type: initialData.type || "banner",
          start_date: initialData.start_date
            ? initialData.start_date.split("T")[0]
            : "",
          end_date: initialData.end_date
            ? initialData.end_date.split("T")[0]
            : "",
          imagePreview: initialData.image_url || null,
          image: null, // don't pre-fill file input; imagePreview shows existing
        }
      : { ...EMPTY_FORM },
  );
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const fileRef = useRef();

  const set = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => set("imagePreview", reader.result);
    reader.readAsDataURL(file);
    set("image", file);
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.details.trim()) errs.details = "Campaign details are required";
    if (!form.start_date) errs.start_date = "Start date is required";
    if (!form.end_date) errs.end_date = "End date is required";
    if (form.start_date && form.end_date && form.end_date < form.start_date)
      errs.end_date = "End date must be after start date";
    // Only require image for NEW modal campaigns; existing ones already have image_url
    if (form.type === "modal" && !form.image && !form.imagePreview)
      errs.image = "Modal campaigns require an image";
    return errs;
  };

  const handleSubmit = async (statusOverride) => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setIsSaving(true);
    const payload = { ...form, status: statusOverride || form.status };
    delete payload.imagePreview;
    console.log("The payload: ", payload);
    await onSave(payload, mode);
    setIsSaving(false);
  };

  const isModal = form.type === "modal";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="font-black text-gray-900 text-lg">
              {mode === "edit" ? "Edit Campaign" : "New Campaign"}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Fill in the details below
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-5">
          {/* Campaign Type */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
              Campaign Type *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  value: "banner",
                  label: "Banner (Text Only)",
                  icon: FiAlignLeft,
                  desc: "Scrolling text shown site-wide",
                },
                {
                  value: "modal",
                  label: "Modal (With Image)",
                  icon: FiImage,
                  desc: "Pop-up for first-time visitors",
                },
              ].map(({ value, label, icon: Icon, desc }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => set("type", value)}
                  className={`text-left px-4 py-3 rounded-2xl border-2 transition-all ${
                    form.type === value
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon
                      className={`w-4 h-4 ${form.type === value ? "text-orange-500" : "text-gray-400"}`}
                    />
                    <span
                      className={`text-sm font-bold ${form.type === value ? "text-orange-600" : "text-gray-700"}`}
                    >
                      {label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Image (modal only) */}
          {isModal && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                Campaign Image{" "}
                {mode === "create" && (
                  <span className="text-orange-500">*</span>
                )}
              </label>
              <div
                onClick={() => fileRef.current?.click()}
                className={`relative rounded-2xl border-2 border-dashed cursor-pointer overflow-hidden transition-colors ${
                  errors.image
                    ? "border-red-400 bg-red-50"
                    : "border-gray-200 hover:border-orange-300 hover:bg-orange-50/50"
                }`}
              >
                {form.imagePreview ? (
                  <div className="relative h-40">
                    <img
                      src={form.imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-white text-sm font-semibold flex items-center gap-2">
                        <FiUpload /> Change Image
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="h-40 flex flex-col items-center justify-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                      <FiUpload className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-400">
                      Click to upload image
                    </p>
                    <p className="text-xs text-gray-300">
                      PNG, JPG, WEBP — max 5MB
                    </p>
                  </div>
                )}
              </div>
              {errors.image && (
                <p className="text-xs text-red-500 mt-1">{errors.image}</p>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleImageChange}
              />
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
              Campaign Title *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Eid Special Feast"
              className={`w-full px-4 py-3 rounded-2xl border bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                errors.title ? "border-red-400 bg-red-50" : "border-gray-200"
              }`}
            />
            {errors.title && (
              <p className="text-xs text-red-500 mt-1">{errors.title}</p>
            )}
          </div>

          {/* Details */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
              Campaign Details *
            </label>
            <textarea
              value={form.details}
              onChange={(e) => set("details", e.target.value)}
              placeholder="Describe what this campaign is about…"
              rows={3}
              className={`w-full px-4 py-3 rounded-2xl border bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none ${
                errors.details ? "border-red-400 bg-red-50" : "border-gray-200"
              }`}
            />
            {errors.details && (
              <p className="text-xs text-red-500 mt-1">{errors.details}</p>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                Start Date *
              </label>
              <div className="relative">
                <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={form.start_date}
                  onChange={(e) => set("start_date", e.target.value)}
                  className={`w-full pl-9 pr-4 py-3 rounded-2xl border bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                    errors.start_date
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200"
                  }`}
                />
              </div>
              {errors.start_date && (
                <p className="text-xs text-red-500 mt-1">{errors.start_date}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                End Date *
              </label>
              <div className="relative">
                <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={form.end_date}
                  min={form.start_date || today()}
                  onChange={(e) => set("end_date", e.target.value)}
                  className={`w-full pl-9 pr-4 py-3 rounded-2xl border bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                    errors.end_date
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200"
                  }`}
                />
              </div>
              {errors.end_date && (
                <p className="text-xs text-red-500 mt-1">{errors.end_date}</p>
              )}
            </div>
          </div>

          {/* URL */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
              External URL{" "}
              <span className="text-gray-300 font-normal normal-case">
                (optional)
              </span>
            </label>
            <div className="relative">
              <FiLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="url"
                value={form.url}
                onChange={(e) => set("url", e.target.value)}
                placeholder="https://example.com/promo"
                className="w-full pl-9 pr-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex-shrink-0 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-colors"
          >
            Cancel
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSubmit("drafted")}
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiArchive className="w-4 h-4" />
              Save as Draft
            </button>
            <button
              onClick={() => handleSubmit("published")}
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <FiSend className="w-4 h-4" />
              )}
              {isSaving ? "Saving…" : "Publish"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Row action menu ──────────────────────────────────────────────────────────
function ActionMenu({ campaign, onEdit, onDelete, onPreview, onToggleStatus }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const actions = [
    {
      label: "Preview",
      icon: FiEye,
      onClick: () => {
        onPreview(campaign);
        setOpen(false);
      },
    },
    {
      label: "Edit",
      icon: FiEdit2,
      onClick: () => {
        onEdit(campaign);
        setOpen(false);
      },
    },
    {
      label: campaign.status === "published" ? "Move to Draft" : "Publish",
      icon: campaign.status === "published" ? FiArchive : FiSend,
      onClick: () => {
        onToggleStatus(campaign);
        setOpen(false);
      },
    },
    {
      label: "Delete",
      icon: FiTrash2,
      onClick: () => {
        onDelete(campaign);
        setOpen(false);
      },
      danger: true,
    },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
      >
        <FiMoreVertical className="w-4 h-4 text-gray-500" />
      </button>
      {open && (
        <div className="absolute right-0 top-10 z-20 bg-white border border-gray-100 rounded-2xl shadow-xl py-1 w-44 overflow-hidden">
          {actions.map(({ label, icon: Icon, onClick, danger }) => (
            <button
              key={label}
              onClick={onClick}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-colors ${
                danger
                  ? "text-red-600 hover:bg-red-50"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const [formModal, setFormModal] = useState({
    open: false,
    mode: "create",
    data: null,
  });
  const [previewCampaign, setPreviewCampaign] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    campaign: null,
    action: null,
  });
  const [actionLoading, setActionLoading] = useState(null);

  // ── Load campaigns ──────────────────────────────────────────────────────────
  const fetchCampaigns = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get("/admin/campaigns");
      const list = Array.isArray(data) ? data : (data.data ?? []);
      setCampaigns(list);
    } catch (err) {
      console.error("Failed to load campaigns:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  // ── Save (create / edit) ────────────────────────────────────────────────────
  const handleSave = async (payload, mode) => {
    try {
      // Always use FormData — the API may receive a file
      const formData = new FormData();
      formData.append("title", payload.title);
      formData.append("details", payload.details);
      formData.append("start_date", payload.start_date);
      formData.append("end_date", payload.end_date);
      formData.append("status", payload.status);
      formData.append("type", payload.type);
      if (payload.url) formData.append("url", payload.url);
      // Only append image if a new file was selected
      if (payload.image instanceof File) {
        formData.append("image", payload.image);
      }

      if (mode === "edit") {
        await api.post(`/admin/campaigns/${payload.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/admin/campaigns", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      await fetchCampaigns();
      setFormModal({ open: false, mode: "create", data: null });
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
    }
  };

  // ── Delete ──────────────────────────────────────────────────────────────────
  const handleDelete = async (campaign) => {
    setActionLoading(campaign.id);
    try {
      await api.delete(`/admin/campaigns/${campaign.id}`);
      await fetchCampaigns();
    } catch (err) {
      console.error("Failed to delete:", err);
    } finally {
      setActionLoading(null);
      setConfirmDialog({ open: false, campaign: null, action: null });
    }
  };

  // ── Toggle status ───────────────────────────────────────────────────────────
  const handleToggleStatus = async (campaign) => {
    const newStatus = campaign.status === "published" ? "drafted" : "published";
    setActionLoading(campaign.id);
    try {
      // Reuse the update endpoint with just the status field changed
      const formData = new FormData();
      formData.append("title", campaign.title);
      formData.append("details", campaign.details);
      formData.append("start_date", campaign.start_date.split("T")[0]);
      formData.append("end_date", campaign.end_date.split("T")[0]);
      formData.append("status", newStatus);
      formData.append("type", campaign.type);
      if (campaign.url) formData.append("url", campaign.url);

      await api.post(`/admin/campaigns/${campaign.id}`, formData);
      await fetchCampaigns();
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setActionLoading(null);
      setConfirmDialog({ open: false, campaign: null, action: null });
    }
  };

  // ── Filtering ───────────────────────────────────────────────────────────────
  const filtered = campaigns.filter((c) => {
    const matchesSearch =
      !searchQuery ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || c.status === filterStatus;
    const matchesType = filterType === "all" || c.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: campaigns.length,
    published: campaigns.filter((c) => c.status === "published").length,
    draft: campaigns.filter((c) => c.status === "drafted").length,
    modal: campaigns.filter((c) => c.type === "modal").length,
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
        {/* Page header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Campaigns</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Manage banners and modal announcements shown to users
            </p>
          </div>
          <button
            onClick={() =>
              setFormModal({ open: true, mode: "create", data: null })
            }
            className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-2xl transition-colors shadow-sm shadow-orange-200 flex-shrink-0"
          >
            <FiPlus className="w-4 h-4" />
            New Campaign
          </button>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <SkeletonStatCard key={i} />
              ))
            : [
                {
                  label: "Total",
                  value: stats.total,
                  color: "text-gray-800",
                  bg: "bg-gray-50 border-gray-100",
                },
                {
                  label: "Published",
                  value: stats.published,
                  color: "text-green-700",
                  bg: "bg-green-50 border-green-100",
                },
                {
                  label: "Drafts",
                  value: stats.draft,
                  color: "text-amber-700",
                  bg: "bg-amber-50 border-amber-100",
                },
              ].map(({ label, value, color, bg }) => (
                <div
                  key={label}
                  className={`rounded-2xl border px-4 py-3 ${bg}`}
                >
                  <p className="text-xs text-gray-500 font-medium">{label}</p>
                  <p className={`text-2xl font-black mt-0.5 ${color}`}>
                    {value}
                  </p>
                </div>
              ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search campaigns…"
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2.5 text-sm bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="drafted">Draft</option>
            </select>
            <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2.5 text-sm bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="banner">Banner</option>
              <option value="modal">Modal</option>
            </select>
            <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Table header always visible so skeletons align under correct columns */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Campaign", "Type", "Status", "Period", ""].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider first:pl-6 last:pr-6"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonRow key={i} />
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                          <FiFilter className="w-6 h-6 text-gray-300" />
                        </div>
                        <p className="text-gray-400 font-medium text-sm">
                          {campaigns.length === 0
                            ? "No campaigns yet. Create your first one!"
                            : "No campaigns match your filters."}
                        </p>
                        {campaigns.length === 0 && (
                          <button
                            onClick={() =>
                              setFormModal({
                                open: true,
                                mode: "create",
                                data: null,
                              })
                            }
                            className="mt-1 flex items-center gap-2 px-4 py-2 text-sm font-semibold text-orange-500 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors"
                          >
                            <FiPlus className="w-4 h-4" /> Create Campaign
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((campaign) => (
                    <tr
                      key={campaign.id}
                      className={`hover:bg-gray-50/70 transition-colors ${actionLoading === campaign.id ? "opacity-50" : ""}`}
                    >
                      {/* Campaign info */}
                      <td className="px-5 py-4 pl-6">
                        <div className="flex items-center gap-3">
                          {campaign.type === "modal" && campaign.image_url ? (
                            <img
                              src={campaign.image_url}
                              alt=""
                              className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                              <FiAlignLeft className="w-4 h-4 text-orange-500" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate max-w-xs">
                              {campaign.title}
                            </p>
                            <p className="text-xs text-gray-400 truncate max-w-xs mt-0.5">
                              {campaign.details}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <TypeBadge type={campaign.type} />
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={campaign.status} />
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-xs text-gray-600 font-medium">
                          {formatDate(campaign.start_date)}
                        </p>
                        <p className="text-xs text-gray-400">
                          → {formatDate(campaign.end_date)}
                        </p>
                      </td>
                      <td className="px-5 py-4 pr-6">
                        {actionLoading === campaign.id ? (
                          <div className="w-8 h-8 flex items-center justify-center">
                            <span className="w-4 h-4 border-2 border-gray-300 border-t-orange-500 rounded-full animate-spin" />
                          </div>
                        ) : (
                          <ActionMenu
                            campaign={campaign}
                            onEdit={(c) =>
                              setFormModal({
                                open: true,
                                mode: "edit",
                                data: c,
                              })
                            }
                            onDelete={(c) =>
                              setConfirmDialog({
                                open: true,
                                campaign: c,
                                action: "delete",
                              })
                            }
                            onPreview={setPreviewCampaign}
                            onToggleStatus={(c) =>
                              setConfirmDialog({
                                open: true,
                                campaign: c,
                                action: "toggle",
                              })
                            }
                          />
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Result count */}
        {!isLoading && filtered.length > 0 && (
          <p className="text-xs text-gray-400 text-center">
            Showing {filtered.length} of {campaigns.length} campaign
            {campaigns.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* Modals */}
      {formModal.open && (
        <CampaignFormModal
          mode={formModal.mode}
          initialData={formModal.data}
          onClose={() =>
            setFormModal({ open: false, mode: "create", data: null })
          }
          onSave={handleSave}
        />
      )}

      {previewCampaign && (
        <PreviewModal
          campaign={previewCampaign}
          onClose={() => setPreviewCampaign(null)}
        />
      )}

      <ConfirmDialog
        isOpen={confirmDialog.open}
        title={
          confirmDialog.action === "delete"
            ? "Delete Campaign?"
            : confirmDialog.campaign?.status === "published"
              ? "Move to Draft?"
              : "Publish Campaign?"
        }
        message={
          confirmDialog.action === "delete"
            ? `"${confirmDialog.campaign?.title}" will be permanently removed.`
            : confirmDialog.campaign?.status === "published"
              ? `"${confirmDialog.campaign?.title}" will be hidden from users.`
              : `"${confirmDialog.campaign?.title}" will go live for users.`
        }
        confirmLabel={
          confirmDialog.action === "delete"
            ? "Delete"
            : confirmDialog.campaign?.status === "published"
              ? "Move to Draft"
              : "Publish"
        }
        confirmClass={
          confirmDialog.action === "delete"
            ? "bg-red-500 hover:bg-red-600"
            : "bg-orange-500 hover:bg-orange-600"
        }
        onConfirm={() => {
          if (confirmDialog.action === "delete")
            handleDelete(confirmDialog.campaign);
          else handleToggleStatus(confirmDialog.campaign);
        }}
        onCancel={() =>
          setConfirmDialog({ open: false, campaign: null, action: null })
        }
      />
    </DashboardLayout>
  );
};

export default Campaigns;
