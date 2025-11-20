import React, { useState, useEffect } from 'react'
import MailboxSidebar from './MailboxSidebar'
import Inbox from './Inbox'
import Sentbox from './Sentbox'
import Drafts from './Drafts'
import Starred from './Starred'
import Archived from './Archived'

function MailboxLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const [activeView, setActiveView] = useState('inbox')
  
  // Auto-collapse sidebar on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true)
      }
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  return (
    <div className="h-screen flex bg-white relative">
      {/* Mobile overlay */}
      {!sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'hidden md:flex' : 'fixed md:relative'} z-20 md:z-auto`}>
        <MailboxSidebar 
          isCollapsed={sidebarCollapsed} 
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          activeView={activeView}
          onViewChange={setActiveView}
        />
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header with menu button */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <button
            onClick={() => setSidebarCollapsed(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Mailbox</h1>
          <div className="w-10"></div>
        </div>
        
        {activeView === 'inbox' && <Inbox />}
        {activeView === 'sent' && <Sentbox />}
        {activeView === 'drafts' && <Drafts />}
        {activeView === 'starred' && <Starred />}
        {activeView === 'archived' && <Archived />}
      </div>
    </div>
  )
}

export default MailboxLayout