import React, { useState } from 'react'
import { FiDatabase, FiInfo, FiHelpCircle, FiDownload, FiUpload, FiBook, FiMail, FiAlertTriangle, FiRefreshCw, FiFileText } from 'react-icons/fi'

function SystemSettings() {
  const [systemInfo] = useState({
    version: '2.4.1',
    lastUpdated: 'Dec 26, 2024',
    environment: 'Production',
    dataCenter: 'US-East'
  })

  const ToggleSwitch = ({ checked, onChange }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
        checked ? 'bg-black' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-1'
        }`}
      />
    </button>
  )

  return (
    <div className="p-6 space-y-8">
      {/* Admin Notice */}
      <div className="border rounded-lg p-4 flex items-start gap-3">
        <FiInfo className="w-5 h-5 mt-0.5" />
        <p className="text-sm">
          As System Administrator, you have access to organization-wide system settings and data.
        </p>
      </div>

      {/* Data Management and System Information Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Data Management */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <FiDatabase className="w-5 h-5 text-gray-600" />
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Data Management</h3>
              <p className="text-xs text-gray-600">Export and manage organization data</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <button className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-3 text-left">
              <FiDownload className="w-4 h-4 text-gray-600" />
              <span className="text-gray-900">Export Organization Data</span>
            </button>
            
            <button className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-3 text-left">
              <FiUpload className="w-4 h-4 text-gray-600" />
              <span className="text-gray-900">Import Data</span>
            </button>
            
            <div className="mt-4 p-3 rounded-lg">
              <div className="flex items-start gap-2">
                <FiInfo className="w-4 h-4 mt-0.5" />
                <p className="text-xs">
                  Data exports include all system data, user activity, and organizational records.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <FiInfo className="w-5 h-5 text-gray-600" />
            <div>
              <h3 className="text-sm font-semibold text-gray-900">System Information</h3>
              <p className="text-xs text-gray-600">Version and system details</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-700">Version</span>
              <span className="text-sm font-medium text-gray-900">{systemInfo.version}</span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-700">Last Updated</span>
              <span className="text-sm font-medium text-gray-900">{systemInfo.lastUpdated}</span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-700">Environment</span>
              <span className="text-sm font-medium text-gray-900">{systemInfo.environment}</span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-700">Data Center</span>
              <span className="text-sm font-medium text-gray-900">{systemInfo.dataCenter}</span>
            </div>
            
            <div className="mt-4 space-y-2">
              <button className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center justify-center gap-2">
                <FiRefreshCw className="w-4 h-4" />
                Check for Updates
              </button>
              
              <button className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center justify-center gap-2">
                <FiFileText className="w-4 h-4" />
                Product Requirements Doc
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Support & Help - Full Width */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <FiHelpCircle className="w-5 h-5 text-gray-600" />
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Support & Help</h3>
            <p className="text-xs text-gray-600">Get help and support resources</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="px-4 py-3 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-3 text-left">
            <FiBook className="w-4 h-4 text-gray-600" />
            <span className="text-gray-900">Documentation</span>
          </button>
          
          <button className="px-4 py-3 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-3 text-left">
            <FiMail className="w-4 h-4 text-gray-600" />
            <span className="text-gray-900">Contact Support</span>
          </button>
          
          <button className="px-4 py-3 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-3 text-left">
            <FiAlertTriangle className="w-4 h-4 text-gray-600" />
            <span className="text-gray-900">Report Issue</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default SystemSettings