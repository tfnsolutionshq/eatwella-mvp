"use client"

import { FiGrid, FiMail, FiGitBranch, FiBarChart2, FiSettings, FiEdit3, FiUsers, FiX, FiFileText } from "react-icons/fi"
import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import logo from "../assets/SMTLogoBLCK.png"

export default function Sidebar({ isOpen, onToggle }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { role, user } = useAuth()
  
  // Get active item from current pathname
  const getActiveItem = () => {
    const path = location.pathname
    if (path === '/dashboard') return 'dashboard'
    if (path === '/compose-memo') return 'compose'
    if (path === '/record-memo') return 'recordmemo'
    if (path === '/mailbox') return 'mailbox'
    if (path === '/workflows') return 'workflows'
    if (path === '/reports') return 'reports'
    if (path.startsWith('/users')) return 'users'
    if (path === '/administration') return 'administration'
    if (path === '/settings') return 'settings'
    return 'dashboard'
  }
  
  const activeItem = getActiveItem()
  
  const isAdmin = role === 'admin'
  
  const formatRole = (role) => {
    const roleMap = {
      'admin': 'Admin',
      'department_head': 'Head of Department',
      'dean': 'Dean',
      'academic_dean': 'Academic Dean',
      'provost': 'Provost'
    }
    return roleMap[role] || 'User'
  }
  
  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
  }

  const mainMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: FiGrid, path: "/dashboard" },
    { id: "compose", label: "Compose Memo", icon: FiEdit3, path: "/compose-memo" },
    { id: "recordmemo", label: "Record Memo", icon: FiFileText, path: "/record-memo" },
    { id: "mailbox", label: "Mailbox", icon: FiMail, count: 12, path: "/mailbox" },
    { id: "workflows", label: "Workflows", icon: FiGitBranch, count: 5, path: "/workflows" },
  ]

  const handleNavigation = (item) => {
    navigate(item.path)
  }

  const systemMenuItems = [
    { id: "reports", label: "Reports", icon: FiBarChart2, path: "/reports" },
    { id: "users", label: "Users", icon: FiUsers, path: "/users" },
    { id: "administration", label: "Administration", icon: FiSettings, path: "/administration" },
    { id: "settings", label: "Settings", icon: FiSettings, path: "/settings" },
  ]
  
  // Filter system menu items based on role
  const filteredSystemMenuItems = isAdmin ? systemMenuItems : []

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? "w-60" : "w-18"
        } bg-gray-50 border-r border-gray-200 transition-all duration-300 flex flex-col overflow-hidden lg:relative fixed lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } h-full z-30`}
      >
        {/* Logo Section */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className={`flex items-center gap-3 ${!isOpen && "justify-center w-full"}`}>
            <img src={logo} alt="SmartMailTrack" className="h-10 flex-shrink-0" />
          </div>
          {isOpen && (
            <button 
              onClick={onToggle}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
              aria-label="Close sidebar"
            >
              <FiX className="w-4 h-4 text-gray-600" />
            </button>
          )}
        </div>

        {/* User Profile Section */}
        {isOpen && (
          <div className="">
            {/* <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0 flex items-center justify-center">
                <span className="text-black text-sm font-semibold">{getInitials(user?.first_name, user?.last_name)}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 truncate">{user?.first_name} {user?.last_name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            <div className="mt-3">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                {formatRole(user?.role)}
              </span>
            </div>
             */}
            {/* Completion Rate Section */}
            <div className="mt-4 bg-blue-50 rounded-lg p-3">
              <p className="text-xs font-semibold text-gray-700 mb-2">Completion Rate</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-black h-2 rounded-full" style={{ width: "74%" }}></div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-900">8</span>
                  <span className="text-xs text-gray-600">Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-900">5</span>
                  <span className="text-xs text-gray-600">Pending</span>
                </div>
              </div>
              <p className="text-lg font-bold text-gray-900 mt-2">94%</p>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
          {mainMenuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeItem === item.id

            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                  isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"
                }`}
                title={!isOpen ? item.label : ""}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isOpen && (
                  <div className="flex items-center justify-between w-full">
                    <span>{item.label}</span>
                    {item.count && (
                      <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                        {item.count}
                      </span>
                    )}
                  </div>
                )}
              </button>
            )
          })}

          {/* System Section - Only show for admin */}
          {isOpen && isAdmin && (
            <div className="pt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
                SYSTEM
              </p>
              {filteredSystemMenuItems.map((item) => {
                const Icon = item.icon
                const isActive = activeItem === item.id

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                      isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"
                    }`}
                    title={!isOpen ? item.label : ""}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </div>
          )}
        </nav>

        {/* Bottom Section */}
        {isOpen && (
          <div className="p-4 border-t border-gray-200 space-y-3">
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">System Status</span>
                <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Notifications</span>
                <div className="flex items-center gap-1">
                  <span className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">!</span>
                  </span>
                  <span className="font-medium text-gray-900">5</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-20 animate-in fade-in duration-300" onClick={onToggle}></div>}
    </>
  )
}
