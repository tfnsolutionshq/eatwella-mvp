import React, { useState } from 'react'

function SystemSettings() {
  const [autoBackup, setAutoBackup] = useState(true)
  const [userRegistration, setUserRegistration] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [sessionTimeout, setSessionTimeout] = useState(30)
  const [passwordPolicy, setPasswordPolicy] = useState('medium')
  const [twoFactorAuth, setTwoFactorAuth] = useState(false)

  return (
    <div className="p-4 sm:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Configuration */}
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-1">System Configuration</h2>
            <p className="text-xs text-gray-600">Configure global system settings</p>
          </div>

          <div className="space-y-4">
            {/* Auto-backup */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Auto-backup</h3>
                  <p className="text-xs text-gray-600">Automatically backup system data daily</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoBackup}
                    onChange={(e) => setAutoBackup(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                </label>
              </div>
            </div>

            {/* User Registration */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">User Registration</h3>
                  <p className="text-xs text-gray-600">Allow users to self-register accounts</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={userRegistration}
                    onChange={(e) => setUserRegistration(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                </label>
              </div>
            </div>

            {/* Email Notifications */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                  <p className="text-xs text-gray-600">Send email notifications for system events</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-1">Security Settings</h2>
            <p className="text-xs text-gray-600">Configure security and authentication settings</p>
          </div>

          <div className="space-y-4">
            {/* Session Timeout */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Session Timeout (minutes)</h3>
                <input
                  type="number"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="5"
                  max="480"
                />
              </div>
            </div>

            {/* Password Policy */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Password Policy</h3>
                <select
                  value={passwordPolicy}
                  onChange={(e) => setPasswordPolicy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Low - 6 characters minimum</option>
                  <option value="medium">Medium - 8 characters, mixed case</option>
                  <option value="high">High - 12 characters, mixed case, symbols</option>
                </select>
              </div>
            </div>

            {/* Two-Factor Authentication */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
                  <p className="text-xs text-gray-600">Require 2FA for admin users</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={twoFactorAuth}
                    onChange={(e) => setTwoFactorAuth(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SystemSettings