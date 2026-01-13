import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import { useNotification } from '../../context/NotificationContext'
import { memoAPI } from '../../services/api'

function Sentbox() {
  const navigate = useNavigate()
  const { token } = useAuth()
  const { showNotification } = useNotification()
  const [selectedEmail, setSelectedEmail] = useState(null)
  const [showActions, setShowActions] = useState(null)
  const [emails, setEmails] = useState([])
  const [loading, setLoading] = useState(false)
  const [starringMemo, setStarringMemo] = useState(null)
  const [archivingMemo, setArchivingMemo] = useState(null)
  const [deletingMemo, setDeletingMemo] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [memoToDelete, setMemoToDelete] = useState(null)
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

  const fetchSentMemos = async () => {
    if (!token) return
    
    setLoading(true)
    try {
      const response = await axios.get('/memo-api/mailbox/sent', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.data.status && response.data.data) {
        setEmails(response.data.data.data)
      }
    } catch (error) {
      console.error('Error fetching sent memos:', error)
      showNotification('Failed to fetch sent memos', 'error')
    } finally {
      setLoading(false)
    }
  }
  
  const handleStarMemo = async (memoId, e) => {
    e.stopPropagation()
    setStarringMemo(memoId)
    
    try {
      await memoAPI.starMemo(memoId, token)
      showNotification('Memo starred successfully', 'success')
      fetchSentMemos()
    } catch (error) {
      console.error('Error starring memo:', error)
      showNotification('Failed to star memo', 'error')
    } finally {
      setStarringMemo(null)
    }
  }
  
  const handleArchiveMemo = async (memoId, e) => {
    e.stopPropagation()
    setArchivingMemo(memoId)
    
    try {
      await memoAPI.archiveMemo(memoId, token)
      showNotification('Memo archived successfully', 'success')
      fetchSentMemos()
    } catch (error) {
      console.error('Error archiving memo:', error)
      showNotification('Failed to archive memo', 'error')
    } finally {
      setArchivingMemo(null)
    }
  }
  
  const handleDeleteClick = (memo, e) => {
    e.stopPropagation()
    setMemoToDelete(memo)
    setShowDeleteModal(true)
  }
  
  const handleDeleteConfirm = async () => {
    if (!memoToDelete) return
    
    setDeletingMemo(memoToDelete.id)
    try {
      await memoAPI.deleteMemo(memoToDelete.id, token)
      showNotification('Memo deleted successfully', 'success')
      fetchSentMemos()
      setShowDeleteModal(false)
      setMemoToDelete(null)
    } catch (error) {
      console.error('Error deleting memo:', error)
      showNotification('Failed to delete memo', 'error')
    } finally {
      setDeletingMemo(null)
    }
  }
  
  useEffect(() => {
    if (token) {
      fetchUsers()
      fetchSentMemos()
    }
  }, [token])
  
  return (
    <div className="flex-1 flex flex-col" onClick={() => setShowActions(null)}>
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg md:text-xl font-bold">Sent</h1>
          <span className="text-xs md:text-sm text-gray-500 border rounded-md p-1">{emails.length} memos</span>
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-lg font-medium mb-2">No sent memos</p>
            <p className="text-sm">You haven't sent any memos yet</p>
          </div>
        ) : (
          emails.map((email) => (
          <div
            key={email.id}
            className={`border-b border-gray-200 p-4 hover:bg-gray-50 cursor-pointer ${
              selectedEmail?.id === email.id ? 'bg-blue-100' : ''
            }`}
            onClick={() => {
              localStorage.setItem('selectedMail', JSON.stringify({ ...email, isFromSentBox: true }))
              navigate(`/mail-content/${email.id}`)
            }}
          >
            <div className="flex items-start space-x-3">
              <div className="relative">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-300 rounded-full flex items-center justify-center text-xs md:text-sm font-medium overflow-hidden">
                  {(() => {
                    const toRecipient = email.recipients?.find(r => r.recipient_type === 'to')
                    const user = toRecipient?.recipient_id ? usersMap[toRecipient.recipient_id] : null
                    if (user?.avatar) {
                      return <img src={`https://identity.smt.tfnsolutions.us/storage/${user.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
                    }
                    const name = toRecipient?.recipient_name || `${toRecipient?.first_name || ''} ${toRecipient?.last_name || ''}`.trim()
                    return name ? name.substring(0, 2).toUpperCase() : 'U'
                  })()}
                </div>
                {email.is_pinned && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-1 md:space-x-2">
                    <span className="font-medium text-gray-900 text-sm md:text-base truncate">
                      {(() => {
                        const toRecipients = email.recipients?.filter(r => r.recipient_type === 'to') || []
                        if (toRecipients.length === 0) return 'No recipients'
                        const names = toRecipients.map(r => r.recipient_name || `${r.first_name || ''} ${r.last_name || ''}`.trim())
                        return toRecipients.length > 1 ? `${names[0]} +${toRecipients.length - 1}` : names[0]
                      })()}
                    </span>
                    {email.is_starred && (
                      <svg className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex items-center space-x-1 md:space-x-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      email.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                      email.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                      email.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {email.priority || 'Normal'}
                    </span>
                    <span className="text-xs md:text-sm text-gray-500">
                      {new Date(email.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
                
                <h3 className="font-medium text-gray-900 mb-1 text-sm md:text-base">{email.subject}</h3>
                <div className="text-xs md:text-sm text-gray-600 mb-2 line-clamp-2" 
                     dangerouslySetInnerHTML={{ __html: email.body?.substring(0, 150) + '...' || 'No preview available' }} />
                
                <div className="flex flex-wrap gap-1">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {email.status}
                  </span>
                  {email.memo_type && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {email.memo_type}
                    </span>
                  )}
                  {email.workflow?.category_name && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {email.workflow.category_name}
                    </span>
                  )}
                  {email.recipients && email.recipients.length > 0 && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {email.recipients.length} recipient{email.recipients.length > 1 ? 's' : ''}
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
                        localStorage.setItem('selectedMail', JSON.stringify({ ...email, isFromSentBox: true }))
                        setShowActions(null)
                        navigate(`/mail-content/${email.id}`)
                      }}
                      className="flex items-center w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                    >
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      View Details
                    </button>
                    
                    <button 
                      onClick={(e) => handleStarMemo(email.id, e)}
                      disabled={starringMemo === email.id}
                      className="flex items-center w-full text-left px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
                    >
                      <svg className={`w-4 h-4 mr-3 ${email.is_starred ? 'text-yellow-500' : ''}`} fill={email.is_starred ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      {email.is_starred ? 'Unstar' : 'Star'}
                    </button>
                    
                    <button 
                      onClick={(e) => handleArchiveMemo(email.id, e)}
                      disabled={archivingMemo === email.id}
                      className="flex items-center w-full text-left px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
                    >
                      <svg className={`w-4 h-4 mr-3 ${email.is_archived ? 'text-green-500' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8l6 6 6-6" />
                      </svg>
                      {email.is_archived ? 'Unarchive' : 'Archive'}
                    </button>
                    
                    <button 
                      onClick={(e) => handleDeleteClick(email, e)}
                      className="flex items-center w-full text-left px-3 py-2 text-sm hover:bg-gray-50 text-red-600"
                    >
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
        ))
        )}
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Memo</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete "{memoToDelete?.subject}"? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setMemoToDelete(null)
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deletingMemo}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {deletingMemo ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Sentbox