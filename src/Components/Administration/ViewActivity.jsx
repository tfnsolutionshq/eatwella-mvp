import React from 'react'
import { createPortal } from 'react-dom'
import { FiX, FiFileText } from 'react-icons/fi'

function ViewActivity({ user, onClose }) {
  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg p-4 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">User Activity Log</h2>
            <p className="text-xs text-gray-600">View detailed activity history for {user.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX className="w-4 h-4" />
          </button>
        </div>
        
        {/* User Info */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium">
              {user.avatar}
            </div>
            <div className="flex-1">
              <h3 className="text-xs font-medium text-gray-900">{user.name}</h3>
              <p className="text-xs text-gray-600">{user.email}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Last Login</p>
              <p className="text-xs font-medium">{user.lastLogin}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <p className="text-lg font-bold text-gray-900">{user.memos}</p>
            <p className="text-xs text-gray-600">Memos Created</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <p className="text-lg font-bold text-gray-900">{user.approvalRate}%</p>
            <p className="text-xs text-gray-600">Approval Rate</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <p className="text-lg font-bold text-gray-900">3/15/2023</p>
            <p className="text-xs text-gray-600">Member Since</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mb-4">
          <h4 className="text-xs font-medium text-gray-900 mb-2">Recent Activity</h4>
          <div className="space-y-2">
            <div className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg">
              <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                <FiFileText className="w-3 h-3 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-900">Created memo</p>
                <p className="text-xs text-gray-600">Budget Request for Q1 2025</p>
              </div>
              <span className="text-xs text-gray-500">Dec 26, 11:30 AM</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-3 py-1 text-xs text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default ViewActivity