"use client"

import { FiSearch, FiUser, FiMenu } from "react-icons/fi"

export default function Header({ onMenuClick }) {
  return (
    <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between gap-4">
      {/* Mobile Menu Button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-600"
      >
        <FiMenu className="w-6 h-6" />
      </button>

      {/* Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <div className="relative w-full hidden sm:block">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders, customers, items..."
            className="w-full bg-gray-50 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-orange-100 outline-none"
          />
        </div>
        {/* Mobile Search Icon */}
        <button className="sm:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-600">
           <FiSearch className="w-6 h-6" />
        </button>
      </div>

      {/* Right Section - User Profile */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-900 leading-none">John Doe</p>
            <p className="text-xs text-gray-500 mt-1">Attendant</p>
          </div>
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 text-orange-600">
            <FiUser className="w-5 h-5" />
          </div>
        </div>
      </div>
    </header>
  )
}
