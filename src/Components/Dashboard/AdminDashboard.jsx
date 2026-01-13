import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useAuth } from "../../context/AuthContext"
import { useNotification } from "../../context/NotificationContext"
import {
  FiUsers,
  FiGitBranch,
  FiClock,
  FiCheckCircle,
  FiEdit3,
  FiMail,
  FiSettings,
  FiBarChart2,
  FiUser
} from "react-icons/fi"

export default function AdminDashboard() {
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const { showNotification } = useNotification()
  const [stats, setStats] = useState({
    total_users: 0,
    active_users: 0,
    total_active_workflows: 0,
    total_pending_approvals: 0,
    total_departments: 0
  })
  const [dashboard, setDashboard] = useState(null)
  const [mailbox, setMailbox] = useState({
    inbox_count: 0,
    sent_count: 0,
    drafts_count: 0,
    archived_count: 0,
    starred_count: 0,
    pinned_count: 0
  })
  const [pendingApprovals, setPendingApprovals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    async function fetchStats() {
      try {
        const [statsRes, mailboxRes, pendingRes] = await Promise.all([
          axios.get(
            "http://memo.smt.tfnsolutions.us/api/v1/dashboard/statistics",
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          axios.get(
            "http://memo.smt.tfnsolutions.us/api/v1/dashboard/mailbox-statistics",
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          axios.get(
            "http://memo.smt.tfnsolutions.us/api/v1/dashboard/pending-approvals",
            { headers: { Authorization: `Bearer ${token}` } }
          )
        ])
        const data = statsRes.data?.data
        const mailboxData = mailboxRes.data?.data
        const pendingData = pendingRes.data?.data?.data

        if (!isMounted) return
        if (data) {
          setDashboard(data)
          setStats({
            total_users: data.identity?.total_users ?? 0,
            active_users: data.identity?.active_users ?? 0,
            total_active_workflows: data.overview?.total_active_workflows ?? 0,
            total_pending_approvals: data.overview?.total_pending_approvals ?? 0,
            total_departments: data.identity?.total_departments ?? 0
          })
        }
        if (mailboxData) {
          setMailbox({
            inbox_count: mailboxData.inbox_count ?? 0,
            sent_count: mailboxData.sent_count ?? 0,
            drafts_count: mailboxData.drafts_count ?? 0,
            archived_count: mailboxData.archived_count ?? 0,
            starred_count: mailboxData.starred_count ?? 0,
            pinned_count: mailboxData.pinned_count ?? 0
          })
        }
        if (pendingData) {
          setPendingApprovals(pendingData.slice(0, 5))
        }
      } catch (e) {
        showNotification?.("Failed to load dashboard data", "error")
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchStats()
    return () => {
      isMounted = false
    }
  }, [token])

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome back, {user?.first_name}!</h1>
            <p className="text-gray-600 text-sm mt-1">Here's your system overview and administrative insights.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
              <FiEdit3 className="w-4 h-4" />
              Compose Memo
            </button>
            <button className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
              <FiUser className="w-4 h-4" />
              Manage Users
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        <StatCard
          icon={FiUsers}
          label="Total Users"
          value={loading ? "..." : stats.total_users.toString()}
          subtext={loading ? "Loading..." : `${stats.active_users || 0} active`}
          color="purple"
        />
        <StatCard
          icon={FiGitBranch}
          label="Active Workflows"
          value={loading ? "..." : stats.total_active_workflows.toString()}
          subtext={loading ? "Loading..." : "Across departments"}
          color="blue"
        />
        <StatCard
          icon={FiClock}
          label="Pending Approvals"
          value={loading ? "..." : stats.total_pending_approvals.toString()}
          subtext={loading ? "Loading..." : "Awaiting action"}
          color="yellow"
        />
        <StatCard
          icon={FiCheckCircle}
          label="Active Departments"
          value={loading ? "..." : stats.total_departments.toString()}
          subtext={loading ? "Loading..." : "100% operational"}
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-lg border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <OverviewItem label="Pending Approvals" value={dashboard?.overview?.total_pending_approvals} />
            <OverviewItem label="Pending Reviews" value={dashboard?.overview?.pending_reviews} />
            <OverviewItem label="Replies" value={dashboard?.overview?.total_replies} />
            <OverviewItem label="Forwards" value={dashboard?.overview?.total_forwards} />
            <OverviewItem label="Overdue" value={dashboard?.approvals?.overdue_count} />
            <OverviewItem label="Upcoming Deadlines" value={dashboard?.approvals?.upcoming_deadlines_count} />
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-gray-900">Workflow Health</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
              <OverviewItem label="Avg Completion (hrs)" value={dashboard?.workflow_health?.average_completion_time_hours} />
              <OverviewItem label="Failure Rate" value={dashboard?.workflow_health?.failure_rate} />
              <OverviewItem label="Disabled Workflows" value={dashboard?.workflow_health?.disabled_workflows} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-gray-900">Scheduled Memos</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
              <OverviewItem label="Total" value={dashboard?.scheduled_memos?.total_scheduled} />
              <OverviewItem label="Next 7 days" value={dashboard?.scheduled_memos?.next_7_days} />
              <OverviewItem label="Next 30 days" value={dashboard?.scheduled_memos?.next_30_days} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <p className="text-sm text-gray-600 mb-4">Administrative shortcuts</p>
          <div className="space-y-3">
            <ActionButton icon={FiEdit3} label="New Memo" />
            <ActionButton icon={FiMail} label="Check Inbox" />
            <ActionButton icon={FiUser} label="Manage Users" />
            <ActionButton icon={FiGitBranch} label="Configure Workflows" />
            <ActionButton icon={FiBarChart2} label="View Reports" />
            <ActionButton icon={FiSettings} label="System Settings" />
          </div>
        </div>
      </div>
      
      <div className="mt-6 bg-white rounded-lg border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Pending Approvals</h2>
          <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">{pendingApprovals.length} pending</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sender</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Step</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingApprovals.length > 0 ? (
                pendingApprovals.map((memo) => (
                  <tr 
                    key={memo.id} 
                    onClick={() => navigate(`/admin/mail-content/${memo.id}`)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{memo.subject}</div>
                      <div className="text-xs text-gray-500">{memo.reference_id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">{memo.sender?.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(memo.created_at).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        memo.priority === 'High' ? 'bg-red-100 text-red-800' : 
                        memo.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-green-100 text-green-800'
                      }`}>
                        {memo.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {memo.workflow?.steps?.find(s => s.status === 'current' || s.status === 'pending')?.name || 'Processing'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    No pending approvals found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Memo Distribution</h2>
          <div className="grid grid-cols-2 gap-4">
            <OverviewItem label="With Workflow" value={dashboard?.memo_distribution?.with_workflow} />
            <OverviewItem label="Without Workflow" value={dashboard?.memo_distribution?.without_workflow} />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Workflows</h2>
          <div className="space-y-2">
            {(dashboard?.top_performers?.workflows ?? []).map((w) => (
              <div key={w.id} className="flex items-center justify-between px-3 py-2 rounded-lg border border-gray-200 bg-white">
                <div>
                  <div className="text-sm font-medium text-gray-900">{w.name}</div>
                </div>
                <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">{w.memos_count} memos</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Categories & Priorities</h2>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Categories</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {(dashboard?.top_performers?.categories ?? []).map((c) => (
                <span key={`cat-${c.id}`} className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-xs text-gray-900">
                  {c.name}
                  <span className="px-1.5 py-0.5 rounded bg-gray-200 text-gray-700 text-[10px]">{c.count}</span>
                </span>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-gray-900">Priorities</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {(dashboard?.top_performers?.priorities ?? []).map((p, idx) => (
                <span key={`prio-${idx}`} className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-xs text-gray-900">
                  {p.priority ?? "Unspecified"}
                  <span className="px-1.5 py-0.5 rounded bg-gray-200 text-gray-700 text-[10px]">{p.count}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
        <div className="bg-white rounded-lg border border-gray-200 p-5 xl:col-span-3">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Mailbox</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <OverviewItem label="Inbox" value={mailbox.inbox_count} />
            <OverviewItem label="Sent" value={mailbox.sent_count} />
            <OverviewItem label="Drafts" value={mailbox.drafts_count} />
            <OverviewItem label="Archived" value={mailbox.archived_count} />
            <OverviewItem label="Starred" value={mailbox.starred_count} />
            <OverviewItem label="Pinned" value={mailbox.pinned_count} />
          </div>
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

function OverviewItem({ label, value }) {
  return (
    <div className="rounded-lg border border-gray-200 p-3">
      <p className="text-xs text-gray-600">{label}</p>
      <p className="text-lg font-semibold text-gray-900">{value ?? 0}</p>
    </div>
  )
}
