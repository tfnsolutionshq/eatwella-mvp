import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { FiDownload } from 'react-icons/fi'

export default function UserActivityLogs() {
  const { token } = useAuth()
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActivityLogs = async () => {
      try {
        const response = await fetch('https://setting.smt.tfnsolutions.us/api/v1/logs/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const result = await response.json()
        if (result.success) {
          setActivities(result.data)
        }
      } catch (error) {
        console.warn('Activity logs unavailable due to CORS:', error)
      } finally {
        setLoading(false)
      }
    }
    if (token) fetchActivityLogs()
  }, [token])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const getActionColor = (action) => {
    const colors = {
      'login': 'bg-green-100 text-green-800',
      'logout': 'bg-red-100 text-red-800',
      'memo_created': 'bg-blue-100 text-blue-800',
      'memo_updated': 'bg-orange-100 text-orange-800',
      'memo_deleted': 'bg-red-100 text-red-800',
    }
    return colors[action] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-1">My Activity Logs</h2>
        <p className="text-sm text-gray-600">View all your recent activities</p>
      </div>

      {/* Export Button */}
      {/* <div className="flex justify-end mb-6">
        <button className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs hover:bg-gray-50 flex items-center gap-2">
          <FiDownload className="w-3 h-3" />
          Export
        </button>
      </div> */}

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
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getActionColor(activity.action)}`}>
                        {activity.action}
                      </span>
                    </div>
                    <p className="text-sm text-gray-900">{activity.description.replace(/User/gi, 'You')}</p>
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

      {/* Stats */}
      {!loading && activities.length > 0 && (
        <div className="mt-6 text-sm text-gray-700">
          Total logs: {activities.length}
        </div>
      )}
    </div>
  )
}
