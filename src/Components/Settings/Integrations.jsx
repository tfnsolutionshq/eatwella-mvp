import React, { useState } from 'react'
import { FiCalendar, FiUsers, FiMessageSquare, FiMail } from 'react-icons/fi'

function Integrations() {
  const [integrations, setIntegrations] = useState({
    calendar: false,
    slack: false,
    teams: false,
    email: true
  })

  const handleToggle = (integration) => {
    setIntegrations(prev => ({
      ...prev,
      [integration]: !prev[integration]
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

  const integrationItems = [
    {
      id: 'calendar',
      icon: FiCalendar,
      title: 'Calendar Integration',
      description: 'Sync deadlines with your calendar',
      status: integrations.calendar,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600'
    },
    {
      id: 'slack',
      icon: FiMessageSquare,
      title: 'Slack',
      description: 'Get notifications in Slack channels',
      status: integrations.slack,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      id: 'teams',
      icon: FiUsers,
      title: 'Microsoft Teams',
      description: 'Collaborate through Teams integration',
      status: integrations.teams,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      id: 'email',
      icon: FiMail,
      title: 'Email System',
      description: 'University email integration',
      status: integrations.email,
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-600',
      connected: true
    }
  ]

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrationItems.map((item) => {
          const IconComponent = item.icon
          return (
            <div key={item.id} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${item.iconBg} flex items-center justify-center`}>
                  <IconComponent className={`w-5 h-5 ${item.iconColor}`} />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{item.title}</div>
                  <div className="text-xs text-gray-600">{item.description}</div>
                  {item.connected && (
                    <div className="text-xs text-green-600 font-medium mt-1">Connected</div>
                  )}
                </div>
              </div>
              <ToggleSwitch 
                checked={item.status}
                onChange={() => handleToggle(item.id)}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Integrations