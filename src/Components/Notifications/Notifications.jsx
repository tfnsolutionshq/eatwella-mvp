"use client"

import { FiCheck, FiClock, FiSettings, FiAlertTriangle, FiMessageCircle, FiMoreHorizontal, FiChevronDown } from "react-icons/fi"
import { useState } from "react"
import { useAuth } from "../../context/AuthContext"
import NotificationSettings from "./NotificationSettings"

export default function Notifications({ onClose }) {
  const { role } = useAuth()
  const [activeTab, setActiveTab] = useState("all")
  const [showSettings, setShowSettings] = useState(false)
  
  const isAdmin = role === 'admin'

  const notifications = [
    {
      id: 1,
      type: "approval",
      title: "Approval Required",
      message: "Budget Request Q1 2025 requires your approval",
      sender: "Dr. Sarah Johnson",
      time: "2h ago",
      priority: "high",
      unread: true,
      icon: FiClock
    },
    {
      id: 2,
      type: "memo",
      title: "Memo Approved",
      message: "Your policy update memo has been approved",
      sender: "Emily Chen",
      time: "2h ago",
      priority: "medium",
      unread: false,
      icon: FiCheck
    },
    {
      id: 3,
      type: "maintenance",
      title: "Scheduled Maintenance",
      message: "System maintenance scheduled for tomorrow 2:00 AM - 4:00 AM",
      sender: "System Administrator",
      time: "2h ago",
      priority: "low",
      unread: false,
      icon: FiSettings
    },
    {
      id: 4,
      type: "deadline",
      title: "Deadline Approaching",
      message: "IT Security Review deadline is in 2 hours",
      sender: "Workflow System",
      time: "2h ago",
      priority: "high",
      unread: false,
      icon: FiAlertTriangle
    },
    {
      id: 5,
      type: "comment",
      title: "New Comment",
      message: "Prof. Michael Brown added a comment to your memo",
      sender: "Prof. Michael Brown",
      time: "2h ago",
      priority: "low",
      unread: false,
      icon: FiMessageCircle
    },
    {
      id: 6,
      type: "workflow",
      title: "Workflow Completed",
      message: "Budget Approval workflow has been completed successfully",
      sender: "Workflow System",
      time: "2h ago",
      priority: "medium",
      unread: false,
      icon: FiCheck
    }
  ]

  const unreadCount = notifications.filter(n => n.unread).length
  const filteredNotifications = activeTab === "unread" ? notifications.filter(n => n.unread) : notifications

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "low": return "bg-gray-100 text-gray-600"
      default: return "bg-gray-100 text-gray-600"
    }
  }

  const getIconColor = (type) => {
    switch (type) {
      case "approval": return "text-orange-500"
      case "memo": return "text-green-500"
      case "maintenance": return "text-blue-500"
      case "deadline": return "text-red-500"
      case "comment": return "text-blue-500"
      case "workflow": return "text-green-500"
      default: return "text-gray-500"
    }
  }

  return (
    <>
      {/* Overlay to detect clicks outside */}
      <div className="fixed inset-0 z-30" onClick={onClose}></div>
      
      <div className="relative z-40 w-72 sm:w-80 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 sm:max-h-[32rem] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <h3 className="text-base font-semibold text-gray-900">Notifications</h3>
        <div className="flex items-center gap-2">
          <button className="text-xs hover:text-gray-700 font-medium">
            Mark all read
          </button>
          {isAdmin && (
            <button 
              onClick={() => setShowSettings(true)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <FiSettings className="w-4 h-4 text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Section */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <div className="relative">
          <select 
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="appearance-none bg-gray-100 text-gray-700 px-3 py-2 pr-8 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All</option>
            <option value="unread">Unread</option>
          </select>
          <FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" />
        </div>
        <span className="text-xs text-gray-600 font-medium">{unreadCount} unread</span>
      </div>

      {/* Notifications List */}
      <div className="overflow-y-auto max-h-80 sm:max-h-96">
        {filteredNotifications.map((notification) => {
          const Icon = notification.icon
          return (
            <div
              key={notification.id}
              className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                notification.unread ? "bg-blue-50" : ""
              }`}
            >
              <div className="flex items-start gap-2">
                <div className={`p-1.5 rounded-full bg-gray-100 ${getIconColor(notification.type)}`}>
                  <Icon className="w-3 h-3" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <div className="flex-1">
                      <div className="flex items-center gap-1 mb-1">
                        <p className="text-xs font-medium text-gray-900 truncate">{notification.title}</p>
                        <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${getPriorityColor(notification.priority)} hidden sm:inline`}>
                          {notification.priority}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-1 line-clamp-2">{notification.message}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <div className="w-4 h-4 bg-gray-300 rounded-full flex-shrink-0"></div>
                          <span className="text-xs text-gray-500 truncate">{notification.sender}</span>
                        </div>
                        <span className="text-xs text-gray-500">{notification.time}</span>
                      </div>
                    </div>
                    <button className="p-0.5 hover:bg-gray-200 rounded ml-1">
                      <FiMoreHorizontal className="w-3 h-3 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Notification Settings */}
      {showSettings && (
        <NotificationSettings onClose={() => setShowSettings(false)} />
      )}
      </div>
    </>
  )
}