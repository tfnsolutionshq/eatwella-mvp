import React, { useState } from 'react'
import { FiMail, FiSmartphone, FiMonitor } from 'react-icons/fi'

function Notifications() {
  const [notifications, setNotifications] = useState({
    email: {
      newMemos: true,
      approvalRequests: true,
      deadlineReminders: true,
      commentsReplies: false
    },
    push: {
      newMemos: true,
      approvalRequests: true,
      deadlineReminders: true,
      commentsReplies: true
    },
    desktop: {
      enabled: true,
      sound: false,
      quietHours: true
    }
  })

  const handleToggle = (category, setting) => {
    setNotifications(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
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
      {/* Email and Push Notifications Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Email Notifications */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <FiMail className="w-5 h-5 text-gray-600" />
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Email Notifications</h3>
              <p className="text-xs text-gray-600">Configure when you receive email notifications</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-900">New Memos</div>
                <div className="text-xs text-gray-600">When new memos are created</div>
              </div>
              <ToggleSwitch 
                checked={notifications.email.newMemos}
                onChange={() => handleToggle('email', 'newMemos')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-900">Approval Requests</div>
                <div className="text-xs text-gray-600">When your approval is needed</div>
              </div>
              <ToggleSwitch 
                checked={notifications.email.approvalRequests}
                onChange={() => handleToggle('email', 'approvalRequests')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-900">Deadline Reminders</div>
                <div className="text-xs text-gray-600">Upcoming deadline alerts</div>
              </div>
              <ToggleSwitch 
                checked={notifications.email.deadlineReminders}
                onChange={() => handleToggle('email', 'deadlineReminders')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-900">Comments & Replies</div>
                <div className="text-xs text-gray-600">When someone comments</div>
              </div>
              <ToggleSwitch 
                checked={notifications.email.commentsReplies}
                onChange={() => handleToggle('email', 'commentsReplies')}
              />
            </div>
          </div>
        </div>

        {/* Push Notifications */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <FiSmartphone className="w-5 h-5 text-gray-600" />
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Push Notifications</h3>
              <p className="text-xs text-gray-600">Real-time notifications on your devices</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-900">New Memos</div>
                <div className="text-xs text-gray-600">Instant notifications</div>
              </div>
              <ToggleSwitch 
                checked={notifications.push.newMemos}
                onChange={() => handleToggle('push', 'newMemos')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-900">Approval Requests</div>
                <div className="text-xs text-gray-600">High priority alerts</div>
              </div>
              <ToggleSwitch 
                checked={notifications.push.approvalRequests}
                onChange={() => handleToggle('push', 'approvalRequests')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-900">Deadline Reminders</div>
                <div className="text-xs text-gray-600">Time-sensitive alerts</div>
              </div>
              <ToggleSwitch 
                checked={notifications.push.deadlineReminders}
                onChange={() => handleToggle('push', 'deadlineReminders')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-900">Comments & Replies</div>
                <div className="text-xs text-gray-600">Conversation updates</div>
              </div>
              <ToggleSwitch 
                checked={notifications.push.commentsReplies}
                onChange={() => handleToggle('push', 'commentsReplies')}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Notifications */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <FiMonitor className="w-5 h-5 text-gray-600" />
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Desktop Notifications</h3>
            <p className="text-xs text-gray-600">Browser and desktop notification settings</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-900">Enable Desktop Notifications</div>
              <div className="text-xs text-gray-600">Show notifications in your browser</div>
            </div>
            <ToggleSwitch 
              checked={notifications.desktop.enabled}
              onChange={() => handleToggle('desktop', 'enabled')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-900">Notification Sound</div>
              <div className="text-xs text-gray-600">Play sound with notifications</div>
            </div>
            <ToggleSwitch 
              checked={notifications.desktop.sound}
              onChange={() => handleToggle('desktop', 'sound')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-900">Quiet Hours</div>
              <div className="text-xs text-gray-600">Reduce notifications during off hours</div>
            </div>
            <ToggleSwitch 
              checked={notifications.desktop.quietHours}
              onChange={() => handleToggle('desktop', 'quietHours')}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Notifications