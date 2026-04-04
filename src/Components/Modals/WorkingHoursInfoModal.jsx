import { FiX, FiClock } from "react-icons/fi";

const WorkingHoursClosedModal = ({
  isOpen,
  onClose,
  message,
  schedule = [],
}) => {
  if (!isOpen) return null;

  const operatingDays = schedule.filter((d) => d.enabled);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
              <FiClock className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">We're Closed</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Orders unavailable right now
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 hover:bg-gray-100 p-2 rounded-lg transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <p className="text-sm text-gray-600 leading-relaxed">{message}</p>

          {operatingDays.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                Operating Hours
              </p>
              <div className="rounded-xl border border-gray-100 overflow-hidden divide-y divide-gray-100">
                {operatingDays.map((day) => (
                  <div
                    key={day.day}
                    className="flex items-center justify-between px-4 py-2.5 bg-gray-50/60"
                  >
                    <span className="text-sm font-medium text-gray-700">
                      {day.day}
                    </span>
                    <span className="text-sm text-orange-500 font-semibold">
                      {day.open} – {day.close}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 transition-colors shadow-sm shadow-orange-200"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkingHoursClosedModal;
