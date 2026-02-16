"use client"

import { FiGrid, FiShoppingCart, FiCalendar, FiCreditCard, FiPercent, FiSettings, FiX, FiMenu } from "react-icons/fi"
import { MdRestaurant, MdQrCodeScanner } from "react-icons/md"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

export default function Sidebar({ isOpen, onToggle }) {
  const navigate = useNavigate()
  const [activeItem, setActiveItem] = useState("dashboard")
  const [isCollapsed, setIsCollapsed] = useState(false)

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: FiGrid, path: "/admin/dashboard" },
    { id: "orders", label: "Orders", icon: FiShoppingCart, path: "/admin/orders" },
    { id: "menu", label: "Menu Management", icon: MdRestaurant, path: "/admin/menu" },
    { id: "meal-plans", label: "Meal Plans", icon: FiCalendar, path: "/admin/meal-plans" },
    { id: "voucher", label: "Voucher Redemption", icon: MdQrCodeScanner, path: "/admin/voucher-redemption" },
    { id: "payments", label: "Payments", icon: FiCreditCard, path: "/admin/payments" },
    { id: "discounts", label: "Discounts", icon: FiPercent, path: "/admin/discounts" },
    { id: "settings", label: "Settings", icon: FiSettings, path: "/admin/settings" },
  ]

  const handleNavigation = (item) => {
    setActiveItem(item.id)
    navigate(item.path)
  }

  return (
    <>
      <aside
        className={`${
          isCollapsed ? "w-20" : "w-64"
        } bg-white border-r border-gray-100 transition-all duration-300 flex flex-col h-full fixed lg:relative z-30 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo Section */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 text-white">
              <MdRestaurant className="w-6 h-6" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col flex-1">
              <span className="text-xl font-bold text-gray-900 leading-tight">Eatwella</span>
              <span className="text-xs text-gray-500">Admin Portal</span>
            </div>
          )}
          <button
            onClick={onToggle}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-600"
          >
            <FiX className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:block p-2 hover:bg-gray-100 rounded-lg text-gray-600"
          >
            <FiMenu className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeItem === item.id

            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-medium ${
                  isActive 
                    ? "bg-orange-50 text-orange-500" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
                title={item.label}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-orange-500" : "text-gray-500"}`} />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            )
          })}
        </nav>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm lg:hidden z-20"
          onClick={onToggle}
        />
      )}
    </>
  )
}
