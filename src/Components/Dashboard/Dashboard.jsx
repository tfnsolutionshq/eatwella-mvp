"use client"

import {
  FiCheckCircle,
  FiClock,
  FiUsers,
  FiPlus,
  FiArrowRight,
  FiCalendar,
  FiTag,
  FiGitBranch,
  FiFileText,
} from "react-icons/fi"

export default function DashboardContent() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome back, Dr!</h1>
        <p className="text-gray-600 text-sm mt-1">Here's what's happening in your organization today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={FiClock} label="Pending Approvals" value="12" subtext="3 due yesterday" color="yellow" />
        <StatCard
          icon={FiCheckCircle}
          label="Completed This Week"
          value="28"
          subtext="14% from last week"
          color="green"
        />
        <StatCard
          icon={FiGitBranch}
          label="Active Workflows"
          value="7"
          subtext="2 new this week"
          color="blue"
          iconName="FiGitBranch"
        />
        <StatCard icon={FiUsers} label="Team Members" value="47" subtext="2 new members" color="purple" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1 bg-white rounded-lg border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <ActionButton icon={FiPlus} label="New Memo" />
            <ActionButton icon={FiCheckCircle} label="Check Status (12)" />
            <ActionButton icon={FiFileText} label="Review Memos" />
            <ActionButton icon={FiUsers} label="User Templates" />
          </div>
        </div>

        {/* Pending Approvals & Upcoming Deadlines */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pending Approvals */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Pending Approvals</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                View all <FiArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <ApprovalItem
                title="Q4 Budget Allocation Review"
                department="Finance Department"
                status="pending"
                dueDate="Tomorrow"
              />
              <ApprovalItem
                title="Policy Update Response"
                department="HR Department"
                status="pending"
                dueDate="Dec 28"
              />
              <ApprovalItem
                title="Course Approval Process"
                department="Academic Affairs"
                status="pending"
                dueDate="Dec 30"
              />
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                View calendar <FiArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <DeadlineItem title="Budget Release Memo" date="Tomorrow" priority="high" />
              <DeadlineItem title="Policy Update Response" date="Dec 28" priority="medium" />
              <DeadlineItem title="Course Approval Process" date="Dec 30" priority="medium" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Memos */}
      <div className="mt-6 bg-white rounded-lg border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Memos</h2>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
            View all memos <FiArrowRight className="w-4 h-4" />
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-4">Latest memo activity in your organization</p>
        <div className="space-y-3">
          <MemoItem
            title="Q4 Budget Allocation Review"
            department="Finance Department"
            status="pending-approval"
            time="3 hours ago"
          />
          <MemoItem
            title="New Academic Calendar Updates"
            department="Academic Affairs"
            status="approved"
            time="4 hours ago"
          />
          <MemoItem title="IT Security Policy Changes" department="IT Department" status="in-review" time="1 day ago" />
          <MemoItem
            title="Student Registration Guidelines"
            department="Registrar's Office"
            status="draft"
            time="2 days ago"
          />
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, subtext, color, iconName }) {
  const colorClasses = {
    yellow: "bg-yellow-50 text-yellow-600",
    green: "bg-green-50 text-green-600",
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
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

function ApprovalItem({ title, department, status, dueDate }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
      <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-600">{department}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
          {status}
        </span>
        <p className="text-xs text-gray-600 mt-1">{dueDate}</p>
      </div>
    </div>
  )
}

function DeadlineItem({ title, date, priority }) {
  const priorityColor = priority === "high" ? "text-red-600" : "text-gray-600"

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3">
        <FiCalendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-gray-900">{title}</p>
          <p className={`text-xs font-medium ${priorityColor}`}>{date}</p>
        </div>
      </div>
      <FiTag className={`w-4 h-4 flex-shrink-0 ${priorityColor}`} />
    </div>
  )
}

function MemoItem({ title, department, status, time }) {
  const statusConfig = {
    "pending-approval": { bg: "bg-yellow-100", text: "text-yellow-800", label: "pending-approval" },
    approved: { bg: "bg-green-100", text: "text-green-800", label: "approved" },
    "in-review": { bg: "bg-blue-100", text: "text-blue-800", label: "in-review" },
    draft: { bg: "bg-gray-100", text: "text-gray-800", label: "draft" },
  }

  const config = statusConfig[status]

  return (
    <div className="flex items-start gap-3 p-3 border-b border-gray-200 last:border-b-0">
      <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-600">From {department}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <span className={`inline-block px-2 py-1 ${config.bg} ${config.text} text-xs font-medium rounded`}>
          {config.label}
        </span>
        <p className="text-xs text-gray-600 mt-1">{time}</p>
      </div>
    </div>
  )
}
