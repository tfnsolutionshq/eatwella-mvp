import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import { useNotification } from '../../context/NotificationContext'
import { FiFilter, FiDownload } from 'react-icons/fi'

function ActivityLogs() {
  const { token } = useAuth()
  const { showNotification } = useNotification()
  const [filterType, setFilterType] = useState('All')
  const [filterUser, setFilterUser] = useState('All Users')
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalLogs, setTotalLogs] = useState(0)
  const [perPage] = useState(20)

  useEffect(() => {
    fetchActivityLogs()
  }, [currentPage])

  const fetchActivityLogs = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`/settings-api/logs?per_page=${perPage}&page=${currentPage}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.data.success) {
        setActivities(response.data.data.data)
        setCurrentPage(response.data.data.current_page)
        setTotalPages(response.data.data.last_page)
        setTotalLogs(response.data.data.total)
      }
    } catch (error) {
      console.error('Error fetching activity logs:', error)
      showNotification('Failed to fetch activity logs', 'error')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'N/A'
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const getUserName = (activity) => {
    return activity.properties?.name || 'Unknown User'
  }

  const getUserAvatar = (activity) => {
    const name = getUserName(activity)
    if (name === 'Unknown User') return 'U'
    return name.charAt(0).toUpperCase()
  }

  const getTypeColor = (action) => {
    const colors = {
      'login': 'bg-green-100 text-green-800',
      'logout': 'bg-red-100 text-red-800',
      'create': 'bg-blue-100 text-blue-800',
      'update': 'bg-orange-100 text-orange-800',
      'delete': 'bg-red-100 text-red-800',
      'approve': 'bg-purple-100 text-purple-800'
    }
    return colors[action] || 'bg-gray-100 text-gray-800'
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
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No activity logs found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {activities.map((activity) => (
              <div key={activity.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">
                    {activity.service_source === 'system' ? (
                      <div className="w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-medium">
                        SYS
                      </div>
                    ) : (
                      getUserAvatar(activity)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-gray-900">{getUserName(activity)}</span>
                      <span className="text-xs text-gray-600">{activity.action}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(activity.action)}`}>
                        {activity.service_source}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">{activity.description}</p>
                  </div>
                  <div className="text-xs text-gray-500 flex-shrink-0">
                    {formatDate(activity.created_at)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700">
            Showing {((currentPage - 1) * perPage) + 1} to {Math.min(currentPage * perPage, totalLogs)} of {totalLogs} logs
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ActivityLogs