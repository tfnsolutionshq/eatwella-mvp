import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useNotification } from '../../context/NotificationContext'
import { memoAPI } from '../../services/api'

function Archived() {
  const navigate = useNavigate()
  const { token } = useAuth()
  const { showNotification } = useNotification()
  const [selectedEmail, setSelectedEmail] = useState(null)
  const [showActions, setShowActions] = useState(null)
  const [emails, setEmails] = useState([])
  const [loading, setLoading] = useState(false)
  const [usersMap, setUsersMap] = useState({})

  const fetchUsers = async () => {
    try {
      const base = (import.meta.env.VITE_IDENTITY_BASE_URL || 'http://identity.smt.tfnsolutions.us/api/v1').replace(/\/$/, '')
      const response = await axios.get(`${base}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data.status && response.data.data?.data) {
        const map = {}
        response.data.data.data.forEach(user => {
          map[user.id] = user
        })
        setUsersMap(map)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }
  
  const fetchArchived = async () => {
    if (!token) return
    
    setLoading(true)
    try {
      const response = await memoAPI.getArchived(token)
      if (response.status && response.data?.data) {
        setEmails(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching archived memos:', error)
      showNotification('Failed to fetch archived memos', 'error')
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    if (token) {
      fetchUsers()
      fetchArchived()
    }
  }, [token])
  
  const getTagColor = (tag) => {
    const colors = {
      'archived': 'bg-green-100 text-green-800',
      'Normal': 'bg-gray-100 text-gray-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'High': 'bg-orange-100 text-orange-800',
      'Critical': 'bg-red-100 text-red-800'
    }
    return colors[tag] || 'bg-gray-100 text-gray-800'
  }
  
  const handleViewMemo = (memo) => {
    localStorage.setItem('selectedMail', JSON.stringify({...memo, isFromArchived: true}))
    navigate(`/mail-content/${memo.id}`)
  }
  
  return (
    <div className="flex-1 flex flex-col" onClick={() => setShowActions(null)}>
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg md:text-xl font-bold">Archived</h1>
          <span className="text-xs md:text-sm text-gray-500 border rounded-md p-1">{emails.length} memo{emails.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
      
      {selectedEmail && (
        <div className="border-b border-gray-200 bg-blue-50 p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-medium text-gray-900">Selected: {selectedEmail.subject}</h2>
            <button
              onClick={() => setSelectedEmail(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>{selectedEmail.sender}</span>
            <span>•</span>
            <span>{selectedEmail.department}</span>
            {selectedEmail.date && (
              <>
                <span>•</span>
                <span>{selectedEmail.date}</span>
              </>
            )}
          </div>
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : emails.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-lg font-medium mb-2">No archived memos found</p>
            <p className="text-sm">Your archived memos will appear here</p>
          </div>
        ) : emails.map((email) => (
          <div
            key={email.id}
            className={`border-b border-gray-200 p-4 hover:bg-gray-50 cursor-pointer ${
              selectedEmail?.id === email.id ? 'bg-blue-100' : ''
            }`}
            onClick={() => handleViewMemo(email)}
          >
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-300 rounded-full flex items-center justify-center text-xs md:text-sm font-medium overflow-hidden">
                {(() => {
                  const user = email.sender?.id ? usersMap[email.sender.id] : null
                  if (user?.avatar) {
                    return <img src={`https://identity.smt.tfnsolutions.us/storage/${user.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
                  }
                  return email.sender?.name ? email.sender.name.substring(0, 2).toUpperCase() : 'AR'
                })()}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-1 md:space-x-2">
                    <span className="font-medium text-gray-900 text-sm md:text-base truncate">{email.sender?.name || 'Archived'}</span>
                    <span className="text-xs md:text-sm text-gray-500 hidden sm:inline">{email.workflow?.category_name || 'No category'}</span>
                  </div>
                  <div className="flex items-center space-x-1 md:space-x-2">
                    <svg className="w-3 h-3 md:w-4 md:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.586-6.586a2 2 0 00-2.828-2.828z" />
                    </svg>
                    <span className="text-xs md:text-sm text-gray-500">
                      {email.created_at ? new Date(email.created_at).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      }) : 'No date'}
                    </span>
                  </div>
                </div>
                
                <h3 className="font-medium text-gray-900 mb-1 text-sm md:text-base">{email.subject || 'No subject'}</h3>
                <p className="text-xs md:text-sm text-gray-600 mb-2 line-clamp-2">
                  {email.body ? email.body.replace(/<[^>]*>/g, '').substring(0, 100) + '...' : 'No content'}
                </p>
                
                <div className="flex flex-wrap gap-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTagColor('archived')}`}>
                    archived
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTagColor(email.priority)}`}>
                    {email.priority?.toLowerCase() || 'normal'}
                  </span>
                  {email.workflow?.name && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {email.workflow.name}
                    </span>
                  )}
                  {email.is_starred && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      starred
                    </span>
                  )}
                </div>
              </div>
              
              <div className="relative">
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowActions(showActions === email.id ? null : email.id)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
                
                {showActions === email.id && (
                  <div className="absolute right-0 top-8 w-36 md:w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10 py-1">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        handleViewMemo(email)
                        setShowActions(null)
                      }}
                      className="flex items-center w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                    >
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </button>
                    <button className="flex items-center w-full text-left px-3 py-2 text-sm hover:bg-gray-50">
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
                      </svg>
                      Unarchive
                    </button>
                    <button className="flex items-center w-full text-left px-3 py-2 text-sm hover:bg-gray-50 text-red-600">
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Archived