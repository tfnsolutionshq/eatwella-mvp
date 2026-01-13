"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import {
  FiUsers,
  FiGitBranch,
  FiClock,
  FiCheckCircle,
  FiEdit3,
  FiMail,
  FiSettings,
  FiBarChart2,
  FiCalendar,
  FiArrowRight,
  FiUser,
  FiActivity
} from "react-icons/fi"

export default function Dashboard() {
  const { user, token } = useAuth()
  const [dashboardData, setDashboardData] = useState(null)
  const [activityLogs, setActivityLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardRes = await fetch('https://memo.smt.tfnsolutions.us/api/v1/dashboard/user?per_page=5', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const dashboardData = await dashboardRes.json()
        if (dashboardData.status) {
          setDashboardData(dashboardData.data)
        }

        try {
          const logsRes = await fetch('https://setting.smt.tfnsolutions.us/api/v1/logs/me', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
          const logsData = await logsRes.json()
          if (logsData.success) {
            setActivityLogs(logsData.data.slice(0, 5))
          }
        } catch (logsError) {
          console.warn('Activity logs unavailable:', logsError)
        }
      } catch (error) {
        console.error('Error fetching dashboard:', error)
      } finally {
        setLoading(false)
      }
    }
    if (token) fetchData()
  }, [token])

  return (
    <div className="p-4 sm:p-4 lg:p-5 w-full mx-auto">
      {/* Header Section */}
      <div className="mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome back, {user?.first_name}!</h1>
            <p className="text-gray-600 text-sm mt-1">Here's your dashboard overview.</p>
          </div>
          <div className="flex gap-2">
            <Link to="/activity-logs" className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              <FiActivity className="w-4 h-4" />
              Activity Logs
            </Link>
            <button className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
              <FiEdit3 className="w-4 h-4" />
              Compose Memo
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={FiMail}
          label="Memos Sent"
          value={loading ? "..." : dashboardData?.total_memos_sent?.toString() || "0"}
          subtext="Total sent"
          color="purple"
        />
        <StatCard
          icon={FiGitBranch}
          label="Workflows Used"
          value={loading ? "..." : dashboardData?.workflows?.total_used?.toString() || "0"}
          subtext={`${dashboardData?.workflows?.active_count || 0} active`}
          color="blue"
        />
        <StatCard
          icon={FiClock}
          label="Pending For You"
          value={loading ? "..." : dashboardData?.pending_approvals_for_user?.total?.toString() || "0"}
          subtext="Awaiting your action"
          color="yellow"
        />
        <StatCard
          icon={FiCheckCircle}
          label="Your Memo Approvals"
          value={loading ? "..." : dashboardData?.pending_approvals_of_user_memos?.total?.toString() || "0"}
          subtext="Pending approvals"
          color="green"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1 bg-white rounded-lg border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <p className="text-sm text-gray-600 mb-4">Shortcuts</p>
          <div className="space-y-3">
            <ActionButton icon={FiEdit3} label="New Memo" />
            <ActionButton icon={FiMail} label={`Inbox (${dashboardData?.total_inbox || 0})`} />
            <ActionButton icon={FiEdit3} label={`Drafts (${dashboardData?.total_drafts || 0})`} />
            <ActionButton icon={FiGitBranch} label="View Workflows" />
            <ActionButton icon={FiSettings} label="Settings" />
          </div>
        </div>

        {/* Pending Approvals & Upcoming Deadlines */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pending Approvals of Your Memos */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Your Memos - Pending Approvals</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                View all <FiArrowRight className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">Memos you sent awaiting approval</p>
            <div className="space-y-3">
              {loading ? (
                <p className="text-sm text-gray-500">Loading...</p>
              ) : dashboardData?.pending_approvals_of_user_memos?.list?.length > 0 ? (
                dashboardData.pending_approvals_of_user_memos.list.map(memo => (
                  <MemoItem key={memo.id} memo={memo} />
                ))
              ) : (
                <p className="text-sm text-gray-500">No pending approvals</p>
              )}
            </div>
          </div>

          {/* Approval Rates */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Approval Rates</h2>
            <p className="text-sm text-gray-600 mb-4">Your approval statistics</p>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Approvals by you</span>
                <span className="text-lg font-semibold text-gray-900">{dashboardData?.approval_rates?.by_user || 0}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">On your memos</span>
                <span className="text-lg font-semibold text-gray-900">{dashboardData?.approval_rates?.on_user_memos || 0}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completion rate</span>
                <span className="text-lg font-semibold text-gray-900">{dashboardData?.completion_rate || 0}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          <Link to="/activity-logs" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
            View all <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <p className="text-sm text-gray-600 mb-4">Your recent actions</p>
        <div className="space-y-3">
          {loading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : activityLogs.length > 0 ? (
            activityLogs.map(log => (
              <ActivityLogItem key={log.id} log={log} />
            ))
          ) : (
            <p className="text-sm text-gray-500">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, subtext, color }) {
  const colorClasses = {
    purple: "bg-purple-50 text-purple-600",
    blue: "bg-blue-50 text-blue-600",
    yellow: "bg-yellow-50 text-yellow-600",
    green: "bg-green-50 text-green-600",
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-gray-600 text-xs font-medium mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-xs text-gray-500">{subtext}</p>
    </div>
  )
}

function ActionButton({ icon: Icon, label }) {
  return (
    <button className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-sm font-medium border border-gray-200">
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span>{label}</span>
    </button>
  )
}

function MemoItem({ memo }) {
  const priorityColors = {
    High: "bg-orange-100 text-orange-800",
    Medium: "bg-blue-100 text-blue-800",
    Low: "bg-gray-100 text-gray-800",
  }

  return (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{memo.subject}</p>
        <p className="text-xs text-gray-600">Workflow: {memo.workflow?.name}</p>
        <p className="text-xs text-gray-500 mt-1">{new Date(memo.created_at).toLocaleDateString()}</p>
      </div>
      <span className={`inline-block px-2 py-1 ${priorityColors[memo.priority]} text-xs font-medium rounded flex-shrink-0`}>
        {memo.priority}
      </span>
    </div>
  )
}

function ActivityLogItem({ log }) {
  const actionColors = {
    login: "bg-green-100 text-green-800",
    logout: "bg-red-100 text-red-800",
    memo_created: "bg-blue-100 text-blue-800",
    memo_updated: "bg-orange-100 text-orange-800",
    memo_deleted: "bg-red-100 text-red-800",
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  const formatDescription = (desc) => {
    return desc.replace(/User/gi, 'You')
  }

  return (
    <div className="flex items-start justify-between gap-3 p-3 bg-gray-50 rounded-lg">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`inline-block px-2 py-1 ${actionColors[log.action] || 'bg-gray-100 text-gray-800'} text-xs font-medium rounded`}>
            {log.action}
          </span>
        </div>
        <p className="text-sm text-gray-900">{formatDescription(log.description)}</p>
      </div>
      <div className="text-xs text-gray-500 flex-shrink-0">
        {formatDate(log.created_at)}
      </div>
    </div>
  )
}