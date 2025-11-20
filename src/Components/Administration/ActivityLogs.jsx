import React, { useState } from 'react'
import { FiFilter, FiDownload } from 'react-icons/fi'

function ActivityLogs() {
  const [filterType, setFilterType] = useState('All')
  const [filterUser, setFilterUser] = useState('All Users')

  const activities = [
    {
      id: 1,
      user: 'Dr. Sarah Johnson',
      action: 'Created memo',
      details: 'Budget Request for Q1 2025',
      type: 'memo',
      timestamp: 'Dec 26, 11:30 AM',
      avatar: 'D'
    },
    {
      id: 2,
      user: 'Sarah Wilson',
      action: 'User login',
      details: 'Successful login from 192.168.1.100',
      type: 'auth',
      timestamp: 'Dec 26, 09:15 AM',
      avatar: 'S'
    },
    {
      id: 3,
      user: 'Emily Chen',
      action: 'Approved memo',
      details: 'Policy Update - Academic Calendar',
      type: 'approval',
      timestamp: 'Dec 25, 12:20 PM',
      avatar: 'E'
    },
    {
      id: 4,
      user: 'System',
      action: 'Backup completed',
      details: 'Daily database backup successful',
      type: 'system',
      timestamp: 'Dec 26, 03:00 AM',
      avatar: 'SYS'
    }
  ]

  const getTypeColor = (type) => {
    const colors = {
      'memo': 'bg-blue-100 text-blue-800',
      'auth': 'bg-green-100 text-green-800',
      'approval': 'bg-orange-100 text-orange-800',
      'system': 'bg-purple-100 text-purple-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  const getTypeLabel = (type) => {
    const labels = {
      'memo': 'memo',
      'auth': 'auth',
      'approval': 'approval',
      'system': 'system'
    }
    return labels[type] || type
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-base font-semibold text-gray-900 mb-1">System Activity Logs</h2>
        <p className="text-xs text-gray-600">Monitor user activities and system events</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex gap-2">
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-xs"
          >
            <option>All Types</option>
            <option>Memo</option>
            <option>Auth</option>
            <option>Approval</option>
            <option>System</option>
          </select>
          <select 
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-xs"
          >
            <option>All Users</option>
            <option>Dr. Sarah Johnson</option>
            <option>Sarah Wilson</option>
            <option>Emily Chen</option>
            <option>System</option>
          </select>
        </div>
        <div className="flex gap-2 ml-auto">
          <button className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs hover:bg-gray-50 flex items-center gap-2">
            <FiFilter className="w-3 h-3" />
            Filter
          </button>
          <button className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs hover:bg-gray-50 flex items-center gap-2">
            <FiDownload className="w-3 h-3" />
            Export
          </button>
        </div>
      </div>

      {/* Activity List */}
      <div className="bg-white rounded-lg border">
        <div className="divide-y divide-gray-200">
          {activities.map((activity) => (
            <div key={activity.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">
                  {activity.avatar === 'SYS' ? (
                    <div className="w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-medium">
                      SYS
                    </div>
                  ) : (
                    activity.avatar
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-gray-900">{activity.user}</span>
                    <span className="text-xs text-gray-600">{activity.action}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(activity.type)}`}>
                      {getTypeLabel(activity.type)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">{activity.details}</p>
                </div>
                <div className="text-xs text-gray-500 flex-shrink-0">
                  {activity.timestamp}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ActivityLogs