"use client"

import { FiMenu, FiSearch, FiBell, FiSettings, FiUser, FiChevronDown, FiSun, FiHelpCircle } from "react-icons/fi"
import { useState } from "react"
import Notifications from "../Components/Notifications/Notifications"

export default function Header({ onMenuClick }) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 px-3 py-2.5 flex items-center justify-between gap-2 h-16">
      {/* Left Section */}
      <div className="flex items-center gap-2 flex-1">
        <button
          onClick={onMenuClick}
          className="p-1.5 hover:bg-gray-100 hover:scale-105 rounded-lg transition-all duration-200"
          aria-label="Toggle sidebar"
        >
          <FiMenu className="w-4 h-4 text-gray-600 transition-transform" />
        </button>

        {/* Search Bar */}
        <div className="hidden sm:flex items-center gap-2 bg-gray-50 rounded-lg px-2 py-1.5 flex-1 max-w-md">
          <FiSearch className="w-3 h-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search memos, workflows, users..."
            className="bg-transparent outline-none text-xs w-full placeholder-gray-500"
          />
        </div>
        
        {/* Mobile Search Button */}
        <button className="sm:hidden p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
          <FiSearch className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Center Section - State University */}
      {/* <div className="hidden lg:flex items-center justify-center flex-1">
        <span className="text-sm font-medium text-gray-700">State University</span>
      </div> */}

      {/* Right Section */}
      <div className="flex items-center gap-1 sm:gap-2 flex-1 justify-end">
        {/* Admin Badge */}
        <span className="hidden md:inline text-xs border border-gray-300 px-2 py-1 rounded-full font-medium text-gray-700">State University</span>
        <span className="hidden sm:inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          Admin
        </span>

        {/* Theme Toggle */}
        <button className="hidden sm:block p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
          <FiSun className="w-4 h-4 text-gray-600" />
        </button>

        {/* Help */}
        <button className="hidden sm:block p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
          <FiHelpCircle className="w-4 h-4 text-gray-600" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-1.5 rounded-lg transition-colors ${
              showNotifications ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100 text-gray-600"
            }`}
          >
            <FiBell className={`w-4 h-4 ${showNotifications ? "text-blue-600" : "text-gray-600"}`} />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-xs font-bold text-white">1</span>
            </span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 z-50 animate-in slide-in-from-top-2 fade-in duration-200">
              <Notifications onClose={() => setShowNotifications(false)} />
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-xs font-semibold text-white">DSJ</span>
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-sm font-medium text-gray-700">Dr. Sarah Johnson</div>
              <div className="text-xs text-gray-500">Admin</div>
            </div>
            <FiChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 hidden sm:block" />
          </button>

          {/* User Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-in slide-in-from-top-2 fade-in duration-200">
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">Profile</button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">Settings</button>
              <hr className="my-2" />
              <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">Sign out</button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
