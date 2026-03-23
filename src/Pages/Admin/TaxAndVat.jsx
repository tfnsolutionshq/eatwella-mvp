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
    priority: "",
    is_inclusive: false,
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
          is_inclusive: initialData.is_inclusive || false,
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
          priority: "",
          is_inclusive: false,
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
        is_inclusive: formData.is_inclusive,
        is_active: formData.is_active,
        category_ids: formData.category_ids,
        // branches: formData.branches // Excluded as per payload structure
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
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">
                  Priority (Order)
                </label>
                <input
                  type="number"
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }
                  placeholder="1"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 block">
                Tax Calculation Method
              </label>
              <div className="flex bg-gray-100 p-1 rounded-lg w-fit">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, is_inclusive: false })
                  }
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${!formData.is_inclusive ? "bg-orange-500 text-white shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
                >
                  Exclusive
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, is_inclusive: true })
                  }
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${formData.is_inclusive ? "bg-orange-500 text-white shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
                >
                  Inclusive
                </button>
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

  useEffect(() => {
    fetchData();
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

  const handleToggleStatus = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to toggle the status of this tax rule?",
      )
    )
      return;

    try {
      await api.patch(`/admin/taxes/${id}/toggle`);
      // Optimistic update or refetch
      setTaxes((prev) =>
        prev.map((rule) =>
          rule.id === id ? { ...rule, is_active: !rule.is_active } : rule,
        ),
      );
      // Or just refetch to be safe
      // fetchData()
    } catch (error) {
      console.error("Failed to toggle status:", error);
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tax rule?"))
      return;

    try {
      await api.delete(`/admin/taxes/${id}`);
      setTaxes((prev) => prev.filter((rule) => rule.id !== id));
    } catch (error) {
      console.error("Failed to delete tax rule:", error);
      alert("Failed to delete tax rule");
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

        {/* Preview Card - Static Example for now */}
        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Tax Calculation Preview
              </h3>
              <p className="text-gray-500 mt-1">Example order: ₦10000.00</p>
            </div>
            <span className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
              Live Preview
            </span>
          </div>

          <div className="space-y-4 max-w-2xl ml-auto">
            <div className="flex justify-between text-gray-500 font-medium">
              <span>Subtotal</span>
              <span className="text-gray-900 font-bold">₦10000.00</span>
            </div>
            {/* We could make this dynamic based on the first active tax rule if desired */}
            <div className="flex justify-between text-gray-500 font-medium">
              <span>VAT (Standard) (7.5%)</span>
              <span className="text-green-600 font-bold">+₦750.00</span>
            </div>
            <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-2xl font-black text-orange-500">
                ₦10750.00
              </span>
            </div>
          </div>
        </div>

        {/* Tax Rules List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12 text-gray-500">
              Loading tax rules...
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
                          {!rule.is_inclusive && (
                            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full border border-blue-200">
                              Exclusive
                            </span>
                          )}
                        </div>
                        <p className="text-gray-500">{rule.description}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 self-start">
                        <button
                          onClick={() => handleToggleStatus(rule.id)}
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
                          onClick={() => handleDelete(rule.id)}
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
    </DashboardLayout>
  );
}

export default TaxAndVat;
