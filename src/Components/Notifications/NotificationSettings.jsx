"use client"

import { FiX, FiMail, FiSmartphone, FiChevronDown } from "react-icons/fi"
import { useState } from "react"

export default function NotificationSettings({ onClose }) {
  const [emailSettings, setEmailSettings] = useState({
    approvalRequests: true,
    deadlineWarnings: true,
    commentsReplies: false,
    systemUpdates: true
  })

  const [pushSettings, setPushSettings] = useState({
    approvalRequests: true,
    deadlineWarnings: true,
    commentsReplies: true
  })

  const [quietHours, setQuietHours] = useState({
    start: "10:00 PM",
    end: "7:00 AM"
  })

  const [digestFrequency, setDigestFrequency] = useState("Daily Digest")

  const toggleEmailSetting = (key) => {
    setEmailSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const togglePushSetting = (key) => {
    setPushSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}></div>
      
      {/* Settings Panel */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-3">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Notification Settings</h2>
            <p className="text-xs text-gray-600">Configure how and when you receive notifications</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <div className="p-3 space-y-4">
          {/* Email Notifications */}
          <div className="border p-3 rounded-md border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <FiMail className="w-4 h-4 text-gray-600" />
              <h3 className="text-sm font-semibold text-gray-900">Email Notifications</h3>
            </div>
            <p className="text-xs text-gray-600 mb-3">Receive notifications via email</p>
            
            <div className="space-y-2">
              <ToggleItem 
                label="Approval Requests" 
                checked={emailSettings.approvalRequests}
                onChange={() => toggleEmailSetting('approvalRequests')}
              />
              <ToggleItem 
                label="Deadline Warnings" 
                checked={emailSettings.deadlineWarnings}
                onChange={() => toggleEmailSetting('deadlineWarnings')}
              />
              <ToggleItem 
                label="Comments & Replies" 
                checked={emailSettings.commentsReplies}
                onChange={() => toggleEmailSetting('commentsReplies')}
              />
              <ToggleItem 
                label="System Updates" 
                checked={emailSettings.systemUpdates}
                onChange={() => toggleEmailSetting('systemUpdates')}
              />
            </div>
          </div>

          {/* Push Notifications */}
          <div className="border p-3 rounded-md border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <FiSmartphone className="w-4 h-4 text-gray-600" />
              <h3 className="text-sm font-semibold text-gray-900">Push Notifications</h3>
            </div>
            <p className="text-xs text-gray-600 mb-3">Receive push notifications on your devices</p>
            
            <div className="space-y-2">
              <ToggleItem 
                label="Approval Requests" 
                checked={pushSettings.approvalRequests}
                onChange={() => togglePushSetting('approvalRequests')}
              />
              <ToggleItem 
                label="Deadline Warnings" 
                checked={pushSettings.deadlineWarnings}
                onChange={() => togglePushSetting('deadlineWarnings')}
              />
              <ToggleItem 
                label="Comments & Replies" 
                checked={pushSettings.commentsReplies}
                onChange={() => togglePushSetting('commentsReplies')}
              />
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="border p-3 rounded-md border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Advanced Settings</h3>
            <p className="text-xs text-gray-600 mb-3">Additional notification preferences</p>
            
            <div className="space-y-3">
              {/* Quiet Hours */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Quiet Hours</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    value={quietHours.start}
                    onChange={(e) => setQuietHours(prev => ({ ...prev, start: e.target.value }))}
                    className="px-2 py-1.5 border border-gray-300 rounded-lg text-xs w-20"
                  />
                  <span className="text-xs text-gray-600">to</span>
                  <input 
                    type="text" 
                    value={quietHours.end}
                    onChange={(e) => setQuietHours(prev => ({ ...prev, end: e.target.value }))}
                    className="px-2 py-1.5 border border-gray-300 rounded-lg text-xs w-20"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">No notifications during these hours except critical alerts</p>
              </div>

              {/* Digest Frequency */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Digest Frequency</label>
                <div className="relative">
                  <select 
                    value={digestFrequency}
                    onChange={(e) => setDigestFrequency(e.target.value)}
                    className="appearance-none w-full px-2 py-1.5 pr-6 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Daily Digest</option>
                    <option>Weekly Digest</option>
                    <option>Never</option>
                  </select>
                  <FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function ToggleItem({ label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-xs text-gray-700">{label}</span>
      <button
        onClick={onChange}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
          checked ? 'bg-gray-900' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}