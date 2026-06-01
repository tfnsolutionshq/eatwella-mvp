import React, { useState, useEffect } from "react";
import DashboardLayout from "../../DashboardLayout/DashboardLayout";
import api from "../../utils/api";
import {
  FiPlus,
  FiPercent,
  FiEdit2,
  FiTrash2,
  FiAlertCircle,
  FiX,
} from "react-icons/fi";
import { useToast } from "../../context/ToastContext";

const TaxRuleModal = ({
  isOpen,
  onClose,
  onSuccess,
  categories,
  initialData = null,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "VAT",
    description: "",
    rate: "",
    priority: 1,
    is_active: true,
    category_ids: [],
    branches: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Static branches from image
  const availableBranches = [
    "Main Branch - Lagos Island",
    "Victoria Island - Victoria Island",
    "Lekki Branch - Lekki Phase 1",
  ];

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name || "",
          type: initialData.type || "VAT",
          description: initialData.description || "",
          rate: initialData.rate || "",
          priority: initialData.priority || "",
          is_active: initialData.is_active || false,
          category_ids: initialData.categories
            ? initialData.categories.map((c) => c.id)
            : [],
          branches: initialData.branches || [],
        });
      } else {
        setFormData({
          name: "",
          type: "VAT",
          description: "",
          rate: "",
          priority: 1,
          is_active: true,
          category_ids: [],
          branches: [],
        });
      }
    }
    setError("");
  }, [isOpen, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        name: formData.name,
        type: formData.type,
        description: formData.description,
        rate: parseFloat(formData.rate),
        priority: parseInt(formData.priority),
        is_active: formData.is_active,
        category_ids: formData.category_ids,
        // branches: formData.branches
      };

      if (initialData) {
        await api.put(`/admin/taxes/${initialData.id}`, payload);
      } else {
        await api.post("/admin/taxes", payload);
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          `Failed to ${initialData ? "update" : "create"} tax rule`,
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (catId) => {
    setFormData((prev) => ({
      ...prev,
      category_ids: prev.category_ids.includes(catId)
        ? prev.category_ids.filter((id) => id !== catId)
        : [...prev.category_ids, catId],
    }));
  };

  const toggleBranch = (branch) => {
    setFormData((prev) => ({
      ...prev,
      branches: prev.branches.includes(branch)
        ? prev.branches.filter((b) => b !== branch)
        : [...prev.branches, branch],
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl my-8">
        <form onSubmit={handleSubmit} className="flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex items-start justify-between bg-white rounded-t-2xl sticky top-0 z-10">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {initialData ? "Edit Tax Rule" : "Create Tax Rule"}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Configure tax rates and rules for your restaurant
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 hover:bg-gray-100 p-1.5 rounded-lg transition-colors"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-4 overflow-y-auto custom-scrollbar">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                <FiAlertCircle className="flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">
                  Tax Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., VAT"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">
                  Tax Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all bg-white text-sm"
                >
                  <option value="VAT">VAT</option>
                  <option value="Service Charge">Service Charge</option>
                  <option value="Consumption Tax">Consumption Tax</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe this tax rule..."
                rows="2"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all resize-none text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">
                  Tax Rate (%) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.rate}
                  onChange={(e) =>
                    setFormData({ ...formData, rate: e.target.value })
                  }
                  placeholder="7.5"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all text-sm"
                />
              </div>
            </div>


            <div className="flex items-center gap-2 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData({ ...formData, is_active: e.target.checked })
                  }
                  className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                />
                <span className="text-xs font-bold text-gray-900">
                  Activate immediately
                </span>
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-between items-center sticky bottom-0 z-10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 text-sm font-bold hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-orange-500 text-white text-sm font-bold rounded-lg hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                initialData ? (
                  "Updating..."
                ) : (
                  "Creating..."
                )
              ) : (
                <>
                  <FiPlus className="w-4 h-4" />
                  {initialData ? "Update" : "Create"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

function TaxAndVat() {
  const [taxes, setTaxes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, rule: null });
  const [toggleModal, setToggleModal] = useState({ open: false, rule: null });
  const [actionLoading, setActionLoading] = useState(false);
  const [taxMode, setTaxMode] = useState(null); // "inclusive" | "exclusive"
  const [taxModeLoading, setTaxModeLoading] = useState(true);
  const [taxModeUpdating, setTaxModeUpdating] = useState(false);
  const { showToast } = useToast();

  const fetchData = async () => {
    try {
      const [taxesRes, categoriesRes] = await Promise.all([
        api.get("/admin/taxes"),
        api.get("/categories"),
      ]);
      setTaxes(taxesRes.data.data);
      setCategories(categoriesRes.data.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTaxMode = async () => {
    try {
      const res = await api.get("/admin/tax-mode");
      setTaxMode(res.data.data?.tax_mode || res.data.tax_mode || null);
    } catch (error) {
      console.error("Failed to fetch tax mode:", error);
    } finally {
      setTaxModeLoading(false);
    }
  };

  const handleTaxModeToggle = async (newMode) => {
    if (newMode === taxMode || taxModeUpdating) return;
    setTaxModeUpdating(true);
    try {
      await api.put("/admin/tax-mode", { tax_mode: newMode });
      setTaxMode(newMode);
      showToast(
        `Tax mode switched to ${newMode === "inclusive" ? "Inclusive" : "Exclusive"}`,
        "success"
      );
    } catch (error) {
      console.error("Failed to update tax mode:", error);
      showToast("Failed to update tax mode", "error");
    } finally {
      setTaxModeUpdating(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchTaxMode();
  }, []);

  const handleEdit = (rule) => {
    setEditingRule(rule);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingRule(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRule(null);
  };

  const handleToggleStatus = (rule) => {
    setToggleModal({ open: true, rule });
  };

  const closeToggleModal = () => {
    setToggleModal({ open: false, rule: null });
  };

  const confirmToggleStatus = async () => {
    if (!toggleModal.rule) return;

    setActionLoading(true);
    closeToggleModal();

    try {
      await api.patch(`/admin/taxes/${toggleModal.rule.id}/toggle`);
      setTaxes((prev) =>
        prev.map((rule) =>
          rule.id === toggleModal.rule.id ? { ...rule, is_active: !rule.is_active } : rule,
        ),
      );
      showToast(
        `Tax rule ${toggleModal.rule.is_active ? "deactivated" : "activated"} successfully`,
        "success"
      );
    } catch (error) {
      console.error("Failed to toggle status:", error);
      showToast("Failed to update status", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = (rule) => {
    setDeleteModal({ open: true, rule });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ open: false, rule: null });
  };

  const confirmDelete = async () => {
    if (!deleteModal.rule) return;

    setActionLoading(true);
    closeDeleteModal();

    try {
      await api.delete(`/admin/taxes/${deleteModal.rule.id}`);
      setTaxes((prev) => prev.filter((rule) => rule.id !== deleteModal.rule.id));
      showToast("Tax rule deleted successfully", "success");
    } catch (error) {
      console.error("Failed to delete tax rule:", error);
      showToast("Failed to delete tax rule", "error");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Tax & VAT Configuration
            </h1>
            <p className="text-gray-500 mt-1">
              Manage tax rules and rates for your restaurant
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200"
          >
            <FiPlus size={20} />
            Add Tax Rule
          </button>
        </div>

        {/* Tax Mode Toggle */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Tax Calculation Mode
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">
                Choose how taxes are applied across all orders
              </p>
            </div>

            {taxModeLoading ? (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="w-4 h-4 border-2 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
                Loading...
              </div>
            ) : (
              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => handleTaxModeToggle("exclusive")}
                  disabled={taxModeUpdating}
                  className={`relative px-5 py-2.5 rounded-lg text-sm font-bold transition-all disabled:cursor-not-allowed ${
                    taxMode === "exclusive"
                      ? "bg-white text-orange-600 shadow-sm border border-gray-200"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {taxModeUpdating && taxMode !== "exclusive" && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="w-3.5 h-3.5 border-2 border-gray-300 border-t-orange-500 rounded-full animate-spin" />
                    </span>
                  )}
                  <span className={taxModeUpdating && taxMode !== "exclusive" ? "invisible" : ""}>
                    Exclusive
                  </span>
                </button>
                <button
                  onClick={() => handleTaxModeToggle("inclusive")}
                  disabled={taxModeUpdating}
                  className={`relative px-5 py-2.5 rounded-lg text-sm font-bold transition-all disabled:cursor-not-allowed ${
                    taxMode === "inclusive"
                      ? "bg-white text-orange-600 shadow-sm border border-gray-200"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {taxModeUpdating && taxMode !== "inclusive" && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="w-3.5 h-3.5 border-2 border-gray-300 border-t-orange-500 rounded-full animate-spin" />
                    </span>
                  )}
                  <span className={taxModeUpdating && taxMode !== "inclusive" ? "invisible" : ""}>
                    Inclusive
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Mode description */}
          {!taxModeLoading && taxMode && (
            <div className={`mt-4 text-xs rounded-lg px-4 py-3 border ${
              taxMode === "exclusive"
                ? "bg-blue-50 border-blue-200 text-blue-700"
                : "bg-green-50 border-green-200 text-green-700"
            }`}>
              {taxMode === "exclusive"
                ? "Exclusive mode: Tax is calculated on top of the item price. Customers see the base price and tax as separate line items."
                : "Inclusive mode: Tax is already included within the item price. The displayed price is the final price customers pay."}
            </div>
          )}
        </div>

        {/* Preview Card - Static Example for now */}
        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Tax Calculation Preview
              </h3>
              <p className="text-gray-500 mt-1">Example order: ₦10,000</p>
            </div>
            <span className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
              Live Preview
            </span>
          </div>

          <div className="space-y-4 max-w-2xl ml-auto">
            <div className="flex justify-between text-gray-500 font-medium">
              <span>Subtotal</span>
              <span className="text-gray-900 font-bold">₦10,000</span>
            </div>
            {/* We could make this dynamic based on the first active tax rule if desired */}
            <div className="flex justify-between text-gray-500 font-medium">
              <span>VAT (Standard) (7.5%)</span>
              <span className="text-green-600 font-bold">+₦750</span>
            </div>
            <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-2xl font-black text-orange-500">
                ₦10,750
              </span>
            </div>
          </div>
        </div>

        {/* Tax Rules List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
              <p className="text-gray-500 text-sm font-medium tracking-wide">
                Loading Tax Rules...
              </p>
            </div>
          ) : taxes.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiPercent className="text-orange-500 text-2xl" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                No Tax Rules Configured
              </h3>
              <p className="text-gray-500 mt-2">
                Create your first tax rule to start collecting taxes.
              </p>
            </div>
          ) : (
            taxes.map((rule) => (
              <div
                key={rule.id}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Icon */}
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${rule.is_active ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-400"}`}
                  >
                    <FiPercent className="w-8 h-8" />
                  </div>

                  {/* Content */}
                  <div className="flex-grow space-y-4">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">
                            {rule.name}
                          </h3>
                          {rule.is_active ? (
                            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2.5 py-1 rounded-full border border-orange-200">
                              Active
                            </span>
                          ) : (
                            <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2.5 py-1 rounded-full border border-gray-200">
                              Inactive
                            </span>
                          )}
                          <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2.5 py-1 rounded-full border border-gray-200">
                            {rule.type}
                          </span>
                        </div>
                        <p className="text-gray-500">{rule.description}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 self-start">
                        <button
                          onClick={() => handleToggleStatus(rule)}
                          className={`px-4 py-2 text-sm font-bold rounded-lg border transition-colors ${rule.is_active ? "text-red-600 bg-red-50 hover:bg-red-100 border-red-200" : "text-green-600 bg-green-50 hover:bg-green-100 border-green-200"}`}
                        >
                          {rule.is_active ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          onClick={() => handleEdit(rule)}
                          className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <FiEdit2 size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(rule)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <FiTrash2 size={20} />
                        </button>
                      </div>
                    </div>

                    {/* Footer Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4 border-t border-gray-50">
                      <div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                          Rate
                        </span>
                        <span className="text-lg font-bold text-orange-500">
                          {rule.rate}%
                        </span>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                          Priority
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                          {rule.priority}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                          Categories
                        </span>
                        <span className="text-sm font-bold text-gray-900">
                          {rule.categories && rule.categories.length > 0
                            ? rule.categories.map((c) => c.name).join(", ")
                            : "All Categories"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <TaxRuleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={fetchData}
        categories={categories}
        initialData={editingRule}
      />

      {/* Toggle Status Confirmation Modal */}
      {toggleModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeToggleModal}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {toggleModal.rule?.is_active ? "Deactivate Tax Rule" : "Activate Tax Rule"}
                </h2>
                {toggleModal.rule && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    {toggleModal.rule.name}
                  </p>
                )}
              </div>
              <button
                onClick={closeToggleModal}
                className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 py-4">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  toggleModal.rule?.is_active ? "bg-orange-100" : "bg-green-100"
                }`}>
                  {toggleModal.rule?.is_active ? (
                    <FiAlertCircle className="w-5 h-5 text-orange-500" />
                  ) : (
                    <FiPercent className="w-5 h-5 text-green-500" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    Are you sure you want to {toggleModal.rule?.is_active ? "deactivate" : "activate"} this tax rule?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {toggleModal.rule?.is_active 
                      ? "This tax will no longer be applied to new orders." 
                      : "This tax will be applied to new orders according to its rules."}
                  </p>
                </div>
              </div>

              {toggleModal.rule && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tax Rate:</span>
                    <span className="font-bold text-orange-500">
                      {toggleModal.rule.rate}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-600">Type:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {toggleModal.rule.type}
                    </span>
                  </div>
                </div>
              )}

              <div className={`text-xs rounded-lg p-3 ${
                toggleModal.rule?.is_active 
                  ? "text-amber-600 bg-amber-50 border border-amber-200" 
                  : "text-green-600 bg-green-50 border border-green-200"
              }`}>
                <strong>Note:</strong> {toggleModal.rule?.is_active 
                  ? "Deactivating this tax will not affect existing orders."
                  : "Activating this tax will apply it to new orders going forward."}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button
                onClick={closeToggleModal}
                disabled={actionLoading}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={confirmToggleStatus}
                disabled={actionLoading}
                className={`flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                  toggleModal.rule?.is_active 
                    ? "bg-orange-500 hover:bg-orange-600 shadow-orange-200" 
                    : "bg-green-500 hover:bg-green-600 shadow-green-200"
                }`}
              >
                {actionLoading
                  ? (toggleModal.rule?.is_active ? "Deactivating…" : "Activating…")
                  : (toggleModal.rule?.is_active ? "Deactivate" : "Activate")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeDeleteModal}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Delete Tax Rule
                </h2>
                {deleteModal.rule && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    {deleteModal.rule.name}
                  </p>
                )}
              </div>
              <button
                onClick={closeDeleteModal}
                className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 py-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <FiTrash2 className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    Are you sure you want to delete this tax rule?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              {deleteModal.rule && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tax Rate:</span>
                    <span className="font-bold text-orange-500">
                      {deleteModal.rule.rate}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-600">Type:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {deleteModal.rule.type}
                    </span>
                  </div>
                </div>
              )}

              <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                <strong>Warning:</strong> Deleting this tax rule will permanently remove it from the system and cannot be recovered.
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button
                onClick={closeDeleteModal}
                disabled={actionLoading}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Keep Rule
              </button>
              <button
                onClick={confirmDelete}
                disabled={actionLoading}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors shadow-sm shadow-red-200 disabled:bg-red-500/50 disabled:cursor-not-allowed"
              >
                {actionLoading ? "Deleting…" : "Delete Rule"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default TaxAndVat;
