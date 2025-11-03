"use client"

import { FiMenu, FiSearch, FiBell, FiSettings, FiUser, FiChevronDown, FiSun, FiHelpCircle } from "react-icons/fi"
import { useState } from "react"

export default function Header({ onMenuClick }) {
  const [showUserMenu, setShowUserMenu] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between gap-4 h-16">
      {/* Left Section */}
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Toggle sidebar"
        >
          <FiMenu className="w-5 h-5 text-gray-600" />
        </button>

        {/* Search Bar */}
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 flex-1 max-w-md">
          <FiSearch className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search memos, workflows, users..."
            className="bg-transparent outline-none text-sm w-full placeholder-gray-500"
          />
        </div>
      </div>

      {/* Center Section - State University */}
      {/* <div className="hidden lg:flex items-center justify-center flex-1">
        <span className="text-sm font-medium text-gray-700">State University</span>
      </div> */}

      {/* Right Section */}
      <div className="flex items-center gap-2 sm:gap-4 flex-1 justify-end">
        {/* Admin Badge */}
        <span className="text-sm border border-gray-300 px-2 py-1 rounded-full font-medium text-gray-700">State University</span>
        <span className="hidden sm:inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          Admin
        </span>

        {/* Theme Toggle */}
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <FiSun className="w-5 h-5 text-gray-600" />
        </button>

        {/* Help */}
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <FiHelpCircle className="w-5 h-5 text-gray-600" />
        </button>

        {/* Notifications */}
        <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <FiBell className="w-5 h-5 text-gray-600" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">1</span>
          </span>
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-xs font-semibold text-white">DSJ</span>
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-sm font-medium text-gray-700">Dr. Sarah Johnson</div>
              <div className="text-xs text-gray-500">Admin</div>
            </div>
            <FiChevronDown className="w-4 h-4 text-gray-600 hidden sm:block" />
          </button>

          {/* User Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</button>
              <hr className="my-2" />
              <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Sign out</button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
