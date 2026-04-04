import { useState } from "react";
import DashboardLayout from "../../DashboardLayout/DashboardLayout";
import { FiClock, FiSave, FiInfo } from "react-icons/fi";

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

const defaultDayConfig = () => ({
  enabled: false,
  open: { hour: "09", minute: "00", period: "AM" },
  close: { hour: "09", minute: "00", period: "PM" },
});

const initialSchedule = () =>
  Object.fromEntries(DAYS.map((day) => [day, defaultDayConfig()]));

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
      {/* Hour */}
      <select
        disabled={disabled}
        value={value.hour}
        onChange={(e) => handleChange("hour", e.target.value)}
        className={selectClass}
      >
        {HOURS.map(({ label, value: v }) => (
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

      {/* Minute */}
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

      {/* AM/PM */}
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
  const [schedule, setSchedule] = useState(initialSchedule());
  const [saving, setSaving] = useState(false);

  const updateDay = (day, patch) =>
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], ...patch },
    }));

  const updateTime = (day, type, val) =>
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], [type]: val },
    }));

  const handleSubmit = (e) => {
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
      })),
    };

    console.log(
      "Availability Hours Payload:",
      JSON.stringify(payload, null, 2),
    );

    // Simulate async save
    setTimeout(() => setSaving(false), 800);
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

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Schedule Form */}
        <div className="lg:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
          >
            {/* Column Labels — hidden on mobile, shown on sm+ */}
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

            {/* Scrollable days list */}
            <div className="divide-y divide-gray-100 overflow-y-auto max-h-[420px]">
              {DAYS.map((day) => {
                const config = schedule[day];
                return (
                  <div
                    key={day}
                    className={`transition-colors px-4 sm:px-6 py-4 ${
                      config.enabled ? "bg-white" : "bg-gray-50/60"
                    }`}
                  >
                    {/* Mobile: stacked layout. sm+: three-column grid */}
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
                          <div className="w-10 h-5 bg-gray-200 peer-checked:bg-orange-500 rounded-full transition-colors"></div>
                          <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5"></div>
                        </div>
                        <span
                          className={`text-sm font-semibold transition-colors ${
                            config.enabled ? "text-gray-800" : "text-gray-400"
                          }`}
                        >
                          {day}
                        </span>
                      </label>

                      {/* Time selectors — indented on mobile when disabled for visual clarity */}
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
                <FiSave className="w-4 h-4" />
                {saving ? "Saving..." : "Save Availability Hours"}
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
                        {open.hour}:{open.minute} {open.period} – {close.hour}:
                        {close.minute} {close.period}
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

        {/*
          ──────────────────────────────────────────────────────
          Future settings sections go here, each preceded by a
          divider + label block like the one above, e.g.:

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex items-center">
              <span className="bg-gray-50 pr-3 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                Payments
              </span>
            </div>
          </div>

          <PaymentSettings />
          ──────────────────────────────────────────────────────
        */}
      </div>
    </DashboardLayout>
  );
};

export default Settings;
