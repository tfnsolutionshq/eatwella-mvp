"use client"

import { useState } from "react"
import Header from "./Header"
import Sidebar from "./Sidebar"

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const handleSidebarToggle = () => {
    if (window.innerWidth >= 1024) {
      // On desktop, toggle collapse state
      setSidebarCollapsed(!sidebarCollapsed)
    } else {
      // On mobile, toggle open/close state
      setSidebarOpen(!sidebarOpen)
    }
  }

  return (
    <div className="flex h-screen">
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        isCollapsed={sidebarCollapsed}
        onCollapseToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={handleSidebarToggle} />
        
        <main className="flex-1 overflow-auto ">
          {children}
        </main>
      </div>
    </div>
  )
}