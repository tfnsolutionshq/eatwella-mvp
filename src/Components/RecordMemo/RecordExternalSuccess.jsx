import React, { useEffect } from 'react'
import { FiCheck, FiCopy } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useNotification } from '../../context/NotificationContext'

export default function RecordExternalSuccess() {
  const navigate = useNavigate()
  const { showNotification } = useNotification()
  const trackingId = 'EXT-2025-523'

  useEffect(() => {
    showNotification(`Tracking ID: ${trackingId}`, 'success')
  }, [])

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(trackingId)
      showNotification('Tracking ID copied', 'success')
    } catch {}
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-4 lg:py-6">
      <div className="bg-white rounded-lg border border-green-200 p-8 mt-4">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-green-100 border border-green-200 flex items-center justify-center">
            <FiCheck className="w-6 h-6 text-green-600" />
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mt-3">Memo Recorded Successfully!</h2>
          <p className="text-sm text-gray-600">The external memo has been recorded and assigned</p>

          <div className="bg-white border rounded-lg p-4 mt-6 w-full max-w-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Tracking ID</p>
                <p className="text-lg font-bold text-gray-900">{trackingId}</p>
              </div>
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm flex items-center gap-2" onClick={copyId}>
                <FiCopy className="w-4 h-4" />
                Copy
              </button>
            </div>
            <div className="mt-4 flex justify-center">
              <div className="w-24 h-24 rounded-lg border border-gray-300 bg-gray-50"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6 w-full max-w-3xl">
            <div className="bg-[#F3F3F5] border border-gray-300 rounded-lg px-3 py-2">
              <p className="text-xs text-gray-600">Reference Number</p>
              <p className="text-sm font-medium text-gray-900">MOE/ADM/123</p>
            </div>
            <div className="bg-[#F3F3F5] border border-gray-300 rounded-lg px-3 py-2">
              <p className="text-xs text-gray-600">Sender Organization</p>
              <p className="text-sm font-medium text-gray-900">TFN</p>
            </div>
            <div className="bg-[#F3F3F5] border border-gray-300 rounded-lg px-3 py-2">
              <p className="text-xs text-gray-600">Assigned Department</p>
              <p className="text-sm font-medium text-gray-900">Academic Affairs</p>
            </div>
            <div className="bg-[#F3F3F5] border border-gray-300 rounded-lg px-3 py-2">
              <p className="text-xs text-gray-600">Assigned Officer</p>
              <p className="text-sm font-medium text-gray-900">Dr. Emily Chen</p>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6">
            <button className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 text-gray-700 rounded-lg" onClick={() => navigate('/record-external-memo')}>Record Another Memo</button>
            <button className="px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded-lg" onClick={() => navigate('/record-memo')}>Back to Record Memo</button>
          </div>
        </div>
      </div>
    </div>
  )
}
