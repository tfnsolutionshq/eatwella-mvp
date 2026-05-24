import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import DashboardLayout from "../../DashboardLayout/DashboardLayout";
import {
  FiSave,
  FiAward,
  FiGift,
  FiPlus,
  FiTrash2,
  FiInfo,
} from "react-icons/fi";
import api from "../../utils/api";

const LoyaltySettings = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    tiers: [{ min: 0, max: null, points: 0 }],
    point_value: "",
    min_redemption: "",
  });

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/admin/login");
      return;
    }
    if (user.role !== "admin") {
      navigate("/admin/dashboard");
      return;
    }
    fetchSettings();
  }, [user, authLoading, navigate]);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/loyalty");
      setSettings({
        tiers: data.tiers || [{ min: 0, max: null, points: 0 }],
        point_value: data.point_value || "",
        min_redemption: data.min_redemption || "",
      });
    } catch (err) {
      console.error("Failed to fetch settings:", err);
      showToast("Failed to load loyalty settings", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTier = () => {
    setSettings({
      ...settings,
      tiers: [...settings.tiers, { min: 0, max: null, points: 0 }],
    });
  };

  const handleRemoveTier = (index) => {
    const newTiers = settings.tiers.filter((_, i) => i !== index);
    setSettings({ ...settings, tiers: newTiers });
  };

  const handleTierChange = (index, field, value) => {
    const newTiers = [...settings.tiers];
    newTiers[index] = {
      ...newTiers[index],
      [field]: value === "" ? (field === "max" ? null : "") : Number(value),
    };
    setSettings({ ...settings, tiers: newTiers });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        tiers: settings.tiers.map((tier) => ({
          min: Number(tier.min),
          max: tier.max === null ? null : Number(tier.max),
          points: Number(tier.points),
        })),
        point_value: Number(settings.point_value),
        min_redemption: Number(settings.min_redemption),
      };

      await api.put("/admin/loyalty", payload);
      showToast("Loyalty settings updated successfully!");
      fetchSettings();
    } catch (error) {
      if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Data:", error.response.data);
        console.log("Validation errors:", error.response.data.errors);
        showToast(
          error.response.data?.message || "Failed to create menu item",
          "error",
        );
      } else if (error.request) {
        console.log("No response received:", error.request);
        showToast("Network error. Please try again.", "error");
      } else {
        console.log("Error setting up request:", error.message);
        showToast("An unexpected error occurred", "error");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 bg-gray-50/50 min-h-full">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Loyalty Settings</h1>
          <p className="text-sm text-gray-500 mt-1">
            Configure loyalty tiers, point values, and redemption rules
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
            <p className="text-gray-500 text-sm font-medium tracking-wide">
              Loading Loyalty Settings...
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Tiers Section */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <FiAward className="text-orange-500" />
                      Loyalty Tiers
                    </h2>
                    <button
                      type="button"
                      onClick={handleAddTier}
                      className="flex items-center gap-2 text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors"
                    >
                      <FiPlus /> Add Tier
                    </button>
                  </div>

                  <div className="space-y-4">
                    {settings.tiers.map((tier, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl relative group"
                      >
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Min Amount (₦)
                          </label>
                          <input
                            type="number"
                            required
                            min="0"
                            value={tier.min}
                            onChange={(e) =>
                              handleTierChange(index, "min", e.target.value)
                            }
                            className="w-full bg-white border border-gray-200 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Max Amount (₦)
                          </label>
                          <input
                            type="number"
                            placeholder="Infinity"
                            value={tier.max === null ? "" : tier.max}
                            onChange={(e) =>
                              handleTierChange(index, "max", e.target.value)
                            }
                            className="w-full bg-white border border-gray-200 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Points Earned
                          </label>
                          <input
                            type="number"
                            required
                            min="0"
                            value={tier.points}
                            onChange={(e) =>
                              handleTierChange(index, "points", e.target.value)
                            }
                            className="w-full bg-white border border-gray-200 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none"
                          />
                        </div>
                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={() => handleRemoveTier(index)}
                            className="w-full md:w-auto p-2 text-gray-400 hover:text-red-500 transition-colors"
                            title="Remove Tier"
                          >
                            <FiTrash2 className="w-5 h-5 mx-auto" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-xs text-gray-500 flex items-center gap-1">
                    <FiInfo className="w-3 h-3" />
                    Leave 'Max Amount' empty for the highest tier.
                  </p>
                </div>

                {/* Redemption Section */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <FiInfo className="w-4 h-4 text-orange-500" />
                      Point Value (₦)
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={settings.point_value}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          point_value: e.target.value,
                        })
                      }
                      placeholder="e.g. 5"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      The monetary value of a single loyalty point
                    </p>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <FiGift className="w-4 h-4 text-orange-500" />
                      Min. Redemption Points
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={settings.min_redemption}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          min_redemption: e.target.value,
                        })
                      }
                      placeholder="e.g. 1000"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Minimum points required to use for payment
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiSave className="w-4 h-4" />
                  {saving ? "Saving..." : "Save All Settings"}
                </button>
              </form>
            </div>

            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <FiAward className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900">Tier System</h3>
                </div>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>
                      Define price ranges for orders to reward customers with
                      different point amounts.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>
                      Example: ₦1,000 - ₦1,999 = 1 point; ₦2,000+ = 2 points.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>
                      Points are automatically calculated based on the order
                      total.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiInfo className="text-orange-500" />
                  Redemption Summary
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Point Value:</span>
                    <span className="text-lg font-bold text-orange-500">
                      ₦{settings.point_value || "0"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Min. Points:</span>
                    <span className="text-lg font-bold text-orange-500">
                      {settings.min_redemption || "0"}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-orange-100">
                    <p className="text-xs text-orange-700 italic">
                      A customer with {settings.min_redemption || "1000"} points
                      can redeem them for ₦
                      {(Number(settings.min_redemption) || 0) *
                        (Number(settings.point_value) || 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default LoyaltySettings;
