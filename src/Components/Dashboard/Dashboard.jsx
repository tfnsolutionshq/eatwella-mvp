"use client"

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
  FiUser
} from "react-icons/fi"

export default function Dashboard() {
  return (
    <div className="p-4 sm:p-4 lg:p-5 w-full mx-auto">
      {/* Header Section */}
      <div className="mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome back, Dr.!</h1>
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
            <button className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
              <FiCalendar className="w-4 h-4" />
              Schedule
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={FiUsers}
          label="Total Users"
          value="247"
          subtext="+12 this month"
          color="purple"
        />
        <StatCard
          icon={FiGitBranch}
          label="Active Workflows"
          value="18"
          subtext="3 new this week"
          color="blue"
        />
        <StatCard
          icon={FiClock}
          label="Pending Approvals"
          value="34"
          subtext="Across all departments"
          color="yellow"
        />
        <StatCard
          icon={FiCheckCircle}
          label="Active Departments"
          value="8"
          subtext="100% operational"
          color="green"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1 bg-white rounded-lg border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <p className="text-sm text-gray-600 mb-4">Administrative shortcuts</p>
          <div className="space-y-3">
            <ActionButton icon={FiEdit3} label="New Memo" />
            <ActionButton icon={FiMail} label="Check Inbox (8)" />
            <ActionButton icon={FiUser} label="Manage Users" />
            <ActionButton icon={FiGitBranch} label="Configure Workflows" />
            <ActionButton icon={FiBarChart2} label="View Reports" />
            <ActionButton icon={FiSettings} label="System Settings" />
          </div>
        </div>

        {/* Pending Approvals & Upcoming Deadlines */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pending Approvals */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Pending Approvals</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                View all pending <FiArrowRight className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">Items requiring your attention</p>
            <div className="space-y-3">
              <ApprovalItem
                title="Q4 Budget Allocation Review"
                department="Finance Department"
                priority="high"
              />
              <ApprovalItem
                title="System-Wide User Access Audit"
                department="Security Team"
                priority="critical"
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
            <p className="text-sm text-gray-600 mb-4">Don't miss these important dates</p>
            <div className="space-y-3">
              <DeadlineItem
                title="Q4 System Audit Report"
                department="Security"
                date="Tomorrow"
                priority="critical"
              />
              <DeadlineItem
                title="Annual Budget Approval"
                department="Finance"
                date="Dec 28"
                priority="critical"
              />
              <DeadlineItem
                title="User Access Review"
                department="Administration"
                date="Dec 30"
                priority="high"
              />
            </div>
          </div>
        </div>
      </div>

      {/* System-Wide Activity */}
      <div className="mb-6 bg-white rounded-lg border border-gray-200 p-5 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">System-Wide Activity</h2>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
            View all memos <FiArrowRight className="w-4 h-4" />
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-4">Latest activity across all departments</p>
        <div className="space-y-3">
          <ActivityItem
            title="Q4 Budget Allocation Review"
            department="Finance Department"
            status="pending approval"
            priority="high"
            time="2 hours ago"
          />
          <ActivityItem
            title="New Academic Calendar Updates"
            department="Dr. Emily Johnson"
            status="approved"
            priority="medium"
            time="4 hours ago"
          />
          <ActivityItem
            title="IT Security Policy Changes"
            department="IT Department"
            status="in review"
            priority="high"
            time="1 day ago"
          />
          <ActivityItem
            title="System-Wide User Access Audit"
            department="Security Team"
            status="pending approval"
            priority="critical"
            time="1 day ago"
          />
        </div>
      </div>

      {/* Department Health & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Department Health */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Department Health</h2>
          <p className="text-sm text-gray-600 mb-4">System-wide departmental metrics</p>
          <div className="space-y-4">
            <DepartmentMetric department="Computer Science" percentage={92} />
            <DepartmentMetric department="Mathematics" percentage={88} />
            <DepartmentMetric department="Physics" percentage={94} />
            <DepartmentMetric department="Chemistry" percentage={85} />
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">System Health</h2>
          <p className="text-sm text-gray-600 mb-4">Platform performance metrics</p>
          <div className="space-y-4">
            <SystemMetric label="System Uptime" value="99.97%" color="green" />
            <SystemMetric label="Active Users" value="247 online" color="blue" />
            <SystemMetric label="Pending Tasks" value="34 items" color="yellow" />
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

function ApprovalItem({ title, department, priority }) {
  const priorityColors = {
    high: "bg-orange-100 text-orange-800",
    critical: "bg-red-100 text-red-800",
  }

  return (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
      <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-600">{department}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <span className={`inline-block px-2 py-1 ${priorityColors[priority]} text-xs font-medium rounded`}>
          {priority}
        </span>
      </div>
    </div>
  )
}

function DeadlineItem({ title, department, date, priority }) {
  const priorityColors = {
    high: "text-orange-600",
    critical: "text-red-600",
  }

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3">
        <FiCalendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-gray-900">{title}</p>
          <p className="text-xs text-gray-600">{department}</p>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <p className={`text-sm font-medium ${priorityColors[priority]}`}>{date}</p>
        <p className={`text-xs ${priorityColors[priority]}`}>{priority}</p>
      </div>
    </div>
  )
}

function ActivityItem({ title, department, status, priority, time }) {
  const statusColors = {
    "pending approval": "bg-yellow-100 text-yellow-800",
    "approved": "bg-green-100 text-green-800",
    "in review": "bg-blue-100 text-blue-800",
  }

  const priorityColors = {
    high: "text-orange-600",
    medium: "text-gray-600",
    critical: "text-red-600",
  }

  return (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
      <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-600">From {department}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
          <span className={`inline-block px-2 py-1 ${statusColors[status]} text-xs font-medium rounded`}>
            {status}
          </span>
          <span className={`text-xs ${priorityColors[priority]}`}>{priority}</span>
        </div>
        <p className="text-xs text-gray-600 mt-1">{time}</p>
      </div>
    </div>
  )
}

function DepartmentMetric({ department, percentage }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-900">{department}</span>
        <span className="text-sm text-gray-600">{percentage}% Active</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-gray-900 h-2 rounded-full transition-all duration-300" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  )
}

function SystemMetric({ label, value, color }) {
  const colorClasses = {
    green: "text-green-600",
    blue: "text-blue-600",
    yellow: "text-yellow-600",
  }

  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-gray-600">{label}</span>
      <span className={`text-sm font-medium ${colorClasses[color]}`}>{value}</span>
    </div>
  )
}