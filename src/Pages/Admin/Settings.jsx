import { useState, useEffect } from "react";
import DashboardLayout from "../../DashboardLayout/DashboardLayout";
import { FiClock, FiSave, FiInfo } from "react-icons/fi";
import { Utensils, Package, Truck, ShoppingCart } from "lucide-react";
import api from "../../utils/api";
import { useToast } from "../../context/ToastContext";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const HOURS = Array.from({ length: 12 }, (_, i) => {
  const h = i + 1;
  return { label: h < 10 ? `0${h}` : `${h}`, value: h };
});

const MINUTES = ["00", "15", "30", "45"];
const PERIODS = ["AM", "PM"];

// Parse a time string like "09:00 AM" into { hour, minute, period }
const parseTimeString = (timeStr) => {
  if (!timeStr) return { hour: "09", minute: "00", period: "AM" };
  const [timePart, period] = timeStr.split(" ");
  const [hour, minute] = timePart.split(":");
  return { hour, minute, period };
};

const defaultDayConfig = () => ({
  enabled: false,
  open: { hour: "09", minute: "00", period: "AM" },
  close: { hour: "09", minute: "00", period: "PM" },
  order_types: { dine: true, pickup: true, delivery: true },
});

// Build schedule from API response
const buildScheduleFromApi = (apiData) => {
  const data = Array.isArray(apiData)
    ? apiData
    : apiData?.availability_hours || [];

  const schedule = Object.fromEntries(
    DAYS.map((day) => [day, defaultDayConfig()]),
  );

  data.forEach(({ day, enabled, open, close, order_types }) => {
    if (schedule[day] !== undefined) {
      schedule[day] = {
        enabled: !!enabled,
        open: parseTimeString(open),
        close: parseTimeString(close),
        order_types: order_types || { dine: true, pickup: true, delivery: true },
      };
    }
  });

  return schedule;
};

const TimeSelect = ({ value, onChange, disabled }) => {
  const handleChange = (field, val) => onChange({ ...value, [field]: val });

  const selectClass = `
    bg-white border rounded-lg px-2 py-1.5 text-sm text-gray-800
    focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none
    transition-all cursor-pointer
    ${disabled ? "opacity-40 cursor-not-allowed bg-gray-50 border-gray-100 text-gray-400" : "border-gray-200 hover:border-gray-300"}
  `;

  return (
    <div className="flex items-center gap-1">
      <select
        disabled={disabled}
        value={value.hour}
        onChange={(e) => handleChange("hour", e.target.value)}
        className={selectClass}
      >
        {HOURS.map(({ label }) => (
          <option key={label} value={label}>
            {label}
          </option>
        ))}
      </select>

      <span
        className={`text-sm font-semibold ${disabled ? "text-gray-300" : "text-gray-500"}`}
      >
        :
      </span>

      <select
        disabled={disabled}
        value={value.minute}
        onChange={(e) => handleChange("minute", e.target.value)}
        className={selectClass}
      >
        {MINUTES.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      <select
        disabled={disabled}
        value={value.period}
        onChange={(e) => handleChange("period", e.target.value)}
        className={selectClass}
      >
        {PERIODS.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
    </div>
  );
};

const AvailabilityHours = () => {
  const [schedule, setSchedule] = useState(
    Object.fromEntries(DAYS.map((day) => [day, defaultDayConfig()])),
  );
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    const fetchAvailability = async () => {
      setIsLoading(true);
      try {
        const res = await api.get("/availability-hours");
        const apiHours = res.data?.availability_hours || [];
        setSchedule(buildScheduleFromApi(apiHours));
      } catch (err) {
        console.error("Failed to fetch availability hours:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailability();
  }, []);

  const updateDay = (day, patch) =>
    setSchedule((prev) => ({ ...prev, [day]: { ...prev[day], ...patch } }));

  const updateTime = (day, type, val) =>
    setSchedule((prev) => ({ ...prev, [day]: { ...prev[day], [type]: val } }));

  const updateOrderType = (day, orderType, enabled) =>
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        order_types: {
          ...prev[day].order_types,
          [orderType]: enabled,
        },
      },
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      availability_hours: Object.entries(schedule).map(([day, config]) => ({
        day,
        enabled: config.enabled,
        open: config.enabled
          ? `${config.open.hour}:${config.open.minute} ${config.open.period}`
          : null,
        close: config.enabled
          ? `${config.close.hour}:${config.close.minute} ${config.close.period}`
          : null,
        order_types: config.order_types,
      })),
    };

    try {
      const res = await api.put("/admin/availability-hours", payload);
      showToast("Settings saved successfully!", "success");
    } catch (err) {
      console.error("Failed to save availability hours:", err);
    } finally {
      setSaving(false);
    }
  };

  const enabledCount = Object.values(schedule).filter((d) => d.enabled).length;

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
          <FiClock className="w-4 h-4 text-orange-500" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            Availability Hours
          </h2>
          <p className="text-xs text-gray-500">
            Set your operating days and hours for delivery orders
          </p>
        </div>
      </div>

      {isLoading ? (
        /* ── Skeleton loader ── */
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Column labels skeleton */}
            <div className="hidden sm:grid sm:grid-cols-[160px_1fr_1fr] gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-3 w-20 bg-gray-200 rounded animate-pulse"
                />
              ))}
            </div>
            <div className="divide-y divide-gray-100">
              {DAYS.map((day) => (
                <div key={day} className="px-4 sm:px-6 py-4 bg-gray-50/60">
                  <div className="flex flex-col gap-3 sm:grid sm:grid-cols-[160px_1fr_1fr] sm:items-center sm:gap-4">
                    {/* Toggle + label skeleton */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-5 bg-gray-200 rounded-full animate-pulse" />
                      <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                    </div>
                    {/* Time picker skeleton ×2 */}
                    {[...Array(2)].map((__, j) => (
                      <div key={j} className="flex items-center gap-1">
                        {[...Array(3)].map((___, k) => (
                          <div
                            key={k}
                            className="h-8 w-14 bg-gray-200 rounded-lg animate-pulse"
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {/* Save button skeleton */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
              <div className="h-11 w-full bg-gray-200 rounded-xl animate-pulse" />
            </div>
          </div>

          {/* Side panel skeleton */}
          <div className="space-y-5">
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 space-y-3">
              <div className="h-4 w-32 bg-orange-200 rounded animate-pulse" />
              <div className="h-3 w-full bg-orange-100 rounded animate-pulse" />
              <div className="h-3 w-3/4 bg-orange-100 rounded animate-pulse" />
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 space-y-3">
              <div className="h-4 w-28 bg-blue-200 rounded animate-pulse" />
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-3 w-full bg-blue-100 rounded animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* ── Loaded content ── */
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Schedule Form */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              {/* Column Labels */}
              <div className="hidden sm:grid sm:grid-cols-[160px_1fr_1fr] gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                  Day
                </span>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                  Opening Time
                </span>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                  Closing Time
                </span>
              </div>

              <div className="divide-y divide-gray-100 overflow-y-auto max-h-[420px]">
                {DAYS.map((day) => {
                  const config = schedule[day];
                  return (
                    <div
                      key={day}
                      className={`transition-colors px-4 sm:px-6 py-4 ${config.enabled ? "bg-white" : "bg-gray-50/60"}`}
                    >
                      <div className="flex flex-col gap-3 sm:grid sm:grid-cols-[160px_1fr_1fr] sm:items-center sm:gap-4">
                        {/* Day Toggle */}
                        <label className="flex items-center gap-3 cursor-pointer select-none">
                          <div className="relative shrink-0">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={config.enabled}
                              onChange={(e) =>
                                updateDay(day, { enabled: e.target.checked })
                              }
                            />
                            <div className="w-10 h-5 bg-gray-200 peer-checked:bg-orange-500 rounded-full transition-colors" />
                            <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
                          </div>
                          <span
                            className={`text-sm font-semibold transition-colors ${config.enabled ? "text-gray-800" : "text-gray-400"}`}
                          >
                            {day}
                          </span>
                        </label>

                        {/* Time Selectors */}
                        <div
                          className={`flex flex-col gap-2 sm:contents ${!config.enabled ? "opacity-40 pointer-events-none" : ""}`}
                        >
                          <div className="flex items-center gap-2 sm:block">
                            <span className="text-xs text-gray-400 w-16 sm:hidden shrink-0">
                              Opens
                            </span>
                            <TimeSelect
                              value={config.open}
                              onChange={(val) => updateTime(day, "open", val)}
                              disabled={!config.enabled}
                            />
                          </div>
                          <div className="flex items-center gap-2 sm:block">
                            <span className="text-xs text-gray-400 w-16 sm:hidden shrink-0">
                              Closes
                            </span>
                            <TimeSelect
                              value={config.close}
                              onChange={(val) => updateTime(day, "close", val)}
                              disabled={!config.enabled}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Submit */}
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave className="w-4 h-4" />
                      Save Availability Hours
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Info Panel */}
          <div className="space-y-5">
            {/* Live Summary */}
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5">
              <h3 className="font-bold text-gray-900 mb-3">Current Schedule</h3>
              {enabledCount === 0 ? (
                <p className="text-sm text-gray-400 italic">
                  No operating days selected.
                </p>
              ) : (
                <ul className="space-y-2">
                  {DAYS.filter((d) => schedule[d].enabled).map((day) => {
                    const { open, close } = schedule[day];
                    return (
                      <li
                        key={day}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="text-gray-600 font-medium">
                          {day.slice(0, 3)}
                        </span>
                        <span className="text-orange-600 font-semibold">
                          {open.hour}:{open.minute} {open.period} – {close.hour}
                          :{close.minute} {close.period}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* How It Works */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
                  <FiInfo className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-gray-900">How It Works</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Toggle a day to mark it as an operating day</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Set opening and closing times for each active day</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>
                    Customers can only place delivery orders within these hours
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Days left off will be treated as closed</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

const OrderTypesManagement = () => {
  const [schedule, setSchedule] = useState(
    Object.fromEntries(DAYS.map((day) => [day, defaultDayConfig()])),
  );
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    const fetchAvailability = async () => {
      setIsLoading(true);
      try {
        const res = await api.get("/availability-hours");
        const apiHours = res.data?.availability_hours || [];
        setSchedule(buildScheduleFromApi(apiHours));
      } catch (err) {
        console.error("Failed to fetch availability hours:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailability();
  }, []);

  const updateOrderType = (day, orderType, enabled) =>
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        order_types: {
          ...prev[day].order_types,
          [orderType]: enabled,
        },
      },
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      availability_hours: Object.entries(schedule).map(([day, config]) => ({
        day,
        enabled: config.enabled,
        open: config.enabled
          ? `${config.open.hour}:${config.open.minute} ${config.open.period}`
          : null,
        close: config.enabled
          ? `${config.close.hour}:${config.close.minute} ${config.close.period}`
          : null,
        order_types: config.order_types,
      })),
    };

    try {
      const res = await api.put("/admin/availability-hours", payload);
      showToast("Settings saved successfully!", "success");
    } catch (err) {
      console.error("Failed to save order types:", err);
    } finally {
      setSaving(false);
    }
  };

  const ORDER_TYPES = [
    { key: "dine", label: "Dine-in", icon: Utensils },
    { key: "pickup", label: "Pickup", icon: Package },
    { key: "delivery", label: "Delivery", icon: Truck },
  ];

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <ShoppingCart className="w-4 h-4 text-blue-500" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            Order Type Management
          </h2>
          <p className="text-xs text-gray-500">
            Enable/disable order types for each day of the week
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-100">
            {DAYS.map((day) => (
              <div key={day} className="px-6 py-4 bg-gray-50/60">
                <div className="space-y-3">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  <div className="flex gap-4">
                    {ORDER_TYPES.map((_, i) => (
                      <div key={i} className="h-8 w-16 bg-gray-200 rounded-lg animate-pulse" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Column Labels */}
          <div className="hidden sm:grid sm:grid-cols-[160px_1fr_1fr_1fr] gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Day
            </span>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Dine-in
            </span>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Pickup
            </span>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Delivery
            </span>
          </div>

          <div className="divide-y divide-gray-100 overflow-y-auto max-h-[420px]">
            {DAYS.map((day) => {
              const config = schedule[day];
              return (
                <div
                  key={day}
                  className={`transition-colors px-4 sm:px-6 py-4 ${config.enabled ? "bg-white" : "bg-gray-50/60"}`}
                >
                  <div className="flex flex-col gap-3 sm:grid sm:grid-cols-[160px_1fr_1fr_1fr] sm:items-center sm:gap-4">
                    {/* Day Label */}
                    <span
                      className={`text-sm font-semibold transition-colors ${config.enabled ? "text-gray-800" : "text-gray-400"}`}
                    >
                      {day}
                    </span>

                    {/* Order Type Toggles */}
                    <div className="flex gap-3 sm:contents">
                      {ORDER_TYPES.map(({ key, label, icon }) => (
                        <label key={key} className="flex items-center gap-2 cursor-pointer select-none">
                          <div className="relative shrink-0">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={config.order_types[key]}
                              onChange={(e) => updateOrderType(day, key, e.target.checked)}
                            />
                            <div className="w-9 h-5 bg-gray-200 peer-checked:bg-orange-500 rounded-full transition-colors" />
                            <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
                          </div>
                          <span className="text-sm text-gray-700 flex items-center gap-2">
                            <icon className="w-4 h-4" />
                            {label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submit */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving Order Types...
                </>
              ) : (
                <>
                  <FiSave className="w-4 h-4" />
                  Save Order Types
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </section>
  );
};

const Settings = () => {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-8 bg-gray-50/50 min-h-full">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your restaurant's configuration and preferences
          </p>
        </div>

        {/* Divider with section label */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex items-center">
            <span className="bg-gray-50 pr-3 text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Operations
            </span>
          </div>
        </div>

        <AvailabilityHours />
        <OrderTypesManagement />
      </div>
    </DashboardLayout>
  );
};

export default Settings;
