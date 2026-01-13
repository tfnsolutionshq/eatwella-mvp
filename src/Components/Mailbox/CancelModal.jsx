import React, { useState } from 'react'
import { FiX, FiAlertTriangle } from 'react-icons/fi'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import { useNotification } from '../../context/NotificationContext'

function CancelModal({ mail, onClose, onSuccess }) {
  const { token } = useAuth()
  const { showNotification } = useNotification()
  const [loading, setLoading] = useState(false)

  const handleCancel = async () => {
    setLoading(true)
    try {
      await axios.post(`/memo-api/memos/${mail.id}/cancel`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      showNotification('Memo cancelled successfully', 'success')
      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Error cancelling memo:', error)
      showNotification('Failed to cancel memo', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-3 border-b">
          <h2 className="text-base font-semibold text-gray-900">Cancel Memo</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <FiAlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Are you sure?</h3>
            <p className="text-sm text-gray-500">
                Are you sure you want to cancel this memo? This action cannot be undone.
            </p>
        </div>

        <div className="flex justify-end gap-2 p-3 border-t bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm text-gray-700 bg-white border rounded hover:bg-gray-50"
          >
            Close
          </button>
          <button
            onClick={handleCancel}
            disabled={loading}
            className="px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 flex items-center gap-1.5"
          >
            {loading ? 'Cancelling...' : 'Confirm Cancel'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CancelModal
