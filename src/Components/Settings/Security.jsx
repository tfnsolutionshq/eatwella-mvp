import React, { useState } from 'react'
import { FiShield, FiKey, FiActivity, FiDownload, FiChevronDown } from 'react-icons/fi'

function Security() {
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: '30 minutes',
    loginAlerts: true,
    passwordExpiry: '90 days'
  })

  const [securityActivity] = useState([
    {
      id: 1,
      type: 'success',
      action: 'Successful login',
      location: 'New York, NY',
      time: '2 hours ago',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      id: 2,
      type: 'info',
      action: 'Password changed',
      location: 'New York, NY',
      time: '3 days ago',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      id: 3,
      type: 'warning',
      action: 'Failed login attempt',
      location: 'Unknown',
      time: '1 week ago',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ])

  const handleToggle = (setting) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }))
  }

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
      {/* Authentication and Password Security Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Authentication */}
        <div className="border border-gray-300 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <FiShield className="w-5 h-5 text-gray-600" />
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Authentication</h3>
              <p className="text-xs text-gray-600">Secure your account with additional protection</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-900">Two-Factor Authentication</div>
                <div className="text-xs text-gray-600">Add an extra layer of security</div>
              </div>
              <ToggleSwitch 
                checked={securitySettings.twoFactorAuth}
                onChange={() => handleToggle('twoFactorAuth')}
              />
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-900 mb-2">Session Timeout (minutes)</div>
              <div className="relative">
                <select 
                  value={securitySettings.sessionTimeout}
                  onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option>15 minutes</option>
                  <option>30 minutes</option>
                  <option>1 hour</option>
                  <option>2 hours</option>
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-900">Login Alerts</div>
                <div className="text-xs text-gray-600">Get notified of new logins</div>
              </div>
              <ToggleSwitch 
                checked={securitySettings.loginAlerts}
                onChange={() => handleToggle('loginAlerts')}
              />
            </div>
          </div>
        </div>

        {/* Password Security */}
        <div className="border border-gray-300 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <FiKey className="w-5 h-5 text-gray-600" />
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Password Security</h3>
              <p className="text-xs text-gray-600">Manage your password and security policies</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-900 mb-2">Password Expiry (days)</div>
              <div className="relative">
                <select 
                  value={securitySettings.passwordExpiry}
                  onChange={(e) => setSecuritySettings(prev => ({ ...prev, passwordExpiry: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option>30 days</option>
                  <option>60 days</option>
                  <option>90 days</option>
                  <option>Never</option>
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            
            <button className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm hover:  flex items-center justify-center gap-2">
              <FiKey className="w-4 h-4" />
              Change Password
            </button>
            
            <button className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm hover:  flex items-center justify-center gap-2">
              <FiDownload className="w-4 h-4" />
              Download Recovery Codes
            </button>
          </div>
        </div>
      </div>

      {/* Recent Security Activity - Full Width */}
      <div className="border border-gray-300 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <FiActivity className="w-5 h-5 text-gray-600" />
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Recent Security Activity</h3>
            <p className="text-xs text-gray-600">Monitor recent logins and security events</p>
          </div>
        </div>
        
        <div className="space-y-3">
          {securityActivity.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${activity.bgColor}`}></div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{activity.action}</div>
                  <div className="text-xs text-gray-600">{activity.location}</div>
                </div>
              </div>
              <div className="text-xs text-gray-500">{activity.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Security