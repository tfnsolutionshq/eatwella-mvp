import React, { useState, useRef, useEffect } from "react";
import { FiX, FiLock } from "react-icons/fi";

const DeliveryPinModal = ({
  isOpen,
  onClose,
  onConfirm,
  isVerifying,
  error,
}) => {
  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (isOpen) {
      setPin(["", "", "", "", "", ""]);
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setPin(newPin);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "Enter" && pin.every((d) => d !== "")) {
      handleSubmit();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (pasted.length === 6) {
      setPin(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = () => {
    const fullPin = pin.join("");
    if (fullPin.length === 6) {
      onConfirm(fullPin);
    }
  };

  const isComplete = pin.every((d) => d !== "");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <FiLock className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Delivery PIN
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Enter the customer's 6-digit PIN
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isVerifying}
            className="text-gray-400 hover:text-gray-500 hover:bg-gray-100 p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-sm text-gray-500 text-center">
            Ask the customer for the PIN sent to them at the time of order
            placement.
          </p>

          {/* PIN inputs */}
          <div className="flex items-center justify-center gap-3">
            {pin.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                disabled={isVerifying}
                className={`w-14 h-14 text-center text-2xl font-bold rounded-xl border-2 outline-none transition-all
                  ${
                    error
                      ? "border-red-400 bg-red-50 text-red-600"
                      : digit
                        ? "border-orange-400 bg-orange-50 text-orange-600"
                        : "border-gray-200 bg-gray-50 text-gray-900 focus:border-orange-400 focus:bg-orange-50"
                  }
                  disabled:opacity-60 disabled:cursor-not-allowed`}
              />
            ))}
          </div>

          {/* Error message */}
          {error && (
            <p className="text-sm text-red-500 text-center font-medium">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isVerifying}
              className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isComplete || isVerifying}
              className="flex-1 px-4 py-2.5 bg-orange-500 rounded-xl text-sm font-medium text-white hover:bg-orange-600 transition-colors shadow-sm shadow-orange-200 disabled:bg-orange-300 disabled:cursor-not-allowed"
            >
              {isVerifying ? "Verifying..." : "Confirm"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryPinModal;
