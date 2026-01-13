import React from 'react'
import { FiX, FiAlertTriangle } from 'react-icons/fi'

function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", confirmColor = "red", loading = false }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${confirmColor === 'red' ? 'bg-red-100' : 'bg-yellow-100'}`}>
              <FiAlertTriangle className={`w-5 h-5 ${confirmColor === 'red' ? 'text-red-600' : 'text-yellow-600'}`} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-gray-600">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 p-4 border-t">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-white rounded hover:opacity-90 disabled:opacity-50 ${
              confirmColor === 'red' ? 'bg-red-600' : 'bg-yellow-600'
            }`}
          >
            {loading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal