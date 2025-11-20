import React, { useState } from 'react'

function MailboxSidebar({ isCollapsed, onToggleCollapse, activeView, onViewChange }) {
  const [showFilters, setShowFilters] = useState(false)
  
  return (
    <div className={`${isCollapsed ? 'w-16 md:w-16' : 'w-full md:w-60'} bg-gray-50 border-r border-gray-200 h-screen flex flex-col transition-all duration-300 ease-in-out`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onToggleCollapse}
            className="p-1 hover:bg-gray-200 rounded transition-colors duration-200"
          >
            <svg className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${isCollapsed ? 'rotate-0' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          {!isCollapsed && <div className="flex-1"></div>}
        </div>
        
        {!isCollapsed && (
          <>
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search memos..."
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md text-sm"
              />
              <svg className="w-4 h-4 absolute left-2.5 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center text-sm border border-gray-300 rounded-md px-3 py-2 w-full bg-white text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            
            {showFilters && (
              <div className="mb-4 p-3 bg-white rounded-md border border-gray-200 space-y-3 animate-fadeIn">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Department</label>
                  <div className="relative">
                    <select className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer hover:border-gray-300 transition-colors">
                      <option>All Departments</option>
                      <option>Finance</option>
                      <option>IT</option>
                      <option>Computer Science</option>
                    </select>
                    <svg className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Category</label>
                  <div className="relative">
                    <select className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer hover:border-gray-300 transition-colors">
                      <option>All Categories</option>
                      <option>High Priority</option>
                      <option>Normal</option>
                      <option>Low Priority</option>
                    </select>
                    <svg className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Priority</label>
                  <div className="relative">
                    <select className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer hover:border-gray-300 transition-colors">
                      <option>All Priorities</option>
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                    <svg className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Status</label>
                  <div className="relative">
                    <select className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer hover:border-gray-300 transition-colors">
                      <option>All Statuses</option>
                      <option>Pending</option>
                      <option>In Review</option>
                      <option>Completed</option>
                    </select>
                    <svg className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <button className="w-full text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 py-2 px-3 rounded-lg transition-colors">
                  Clear Filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
      
      <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
        <div className="px-4 py-2">
          <button 
            onClick={() => onViewChange('inbox')}
            className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} py-2 px-2 rounded text-sm font-medium w-full transition-colors ${
              activeView === 'inbox' ? 'bg-gray-200' : 'hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2" />
              </svg>
              {!isCollapsed && 'Inbox'}
            </div>
            {!isCollapsed && <span className="bg-white px-2 py-0.5 rounded text-xs">3</span>}
          </button>
          
          <button 
            onClick={() => onViewChange('sent')}
            className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} py-2 px-2 text-sm rounded transition-colors duration-200 w-full ${
              activeView === 'sent' ? 'bg-gray-200 font-medium' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              {!isCollapsed && 'Sent'}
            </div>
            {!isCollapsed && <span className="text-xs">1</span>}
          </button>
          
          <button 
            onClick={() => onViewChange('drafts')}
            className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} py-2 px-2 text-sm rounded transition-colors duration-200 w-full ${
              activeView === 'drafts' ? 'bg-gray-200 font-medium' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {!isCollapsed && 'Drafts'}
            </div>
            {!isCollapsed && <span className="text-xs">1</span>}
          </button>
          
          <button 
            onClick={() => onViewChange('archived')}
            className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} py-2 px-2 text-sm rounded transition-colors duration-200 w-full ${
              activeView === 'archived' ? 'bg-gray-200 font-medium' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8l6 6 6-6" />
              </svg>
              {!isCollapsed && 'Archived'}
            </div>
            {!isCollapsed && <span className="text-xs">0</span>}
          </button>
          
          <button 
            onClick={() => onViewChange('starred')}
            className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} py-2 px-2 text-sm rounded transition-colors duration-200 w-full ${
              activeView === 'starred' ? 'bg-gray-200 font-medium' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              {!isCollapsed && 'Starred'}
            </div>
            {!isCollapsed && <span className="text-xs">2</span>}
          </button>
        </div>
        
        {!isCollapsed && (
          <div className="px-4 py-2 mt-4">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Pinned</h3>
            <div className="text-sm text-gray-600 py-1">
              <div className="truncate">Q4 Budget Allocation Review - Re...</div>
              <div className="text-xs text-gray-400">Finance Department</div>
            </div>
          </div>
        )}
      </nav>
    </div>
  )
}

export default MailboxSidebar