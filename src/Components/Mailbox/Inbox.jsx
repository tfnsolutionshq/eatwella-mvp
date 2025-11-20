import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Inbox() {
  const navigate = useNavigate()
  const [selectedEmail, setSelectedEmail] = useState(null)
  const [showActions, setShowActions] = useState(null)
  const [checkedEmails, setCheckedEmails] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  
  const emails = [
    {
      id: 1,
      sender: 'Finance Department',
      department: 'Finance',
      subject: 'Q4 Budget Allocation Review - Requires Immediate Attention',
      preview: 'Please review the attached Q4 budget allocation proposal...',
      date: 'Dec 26, 2024',
      tags: ['pending approval', 'high', 'financial'],
      starred: true,
      avatar: 'F'
    },
    {
      id: 2,
      sender: 'IT Department',
      department: 'Information Technology',
      subject: 'IT Security Policy Changes - Action Required',
      preview: 'Due to recent security incidents, we are implementing new policies...',
      date: 'Dec 25, 2024',
      tags: ['in review', 'high', 'policy'],
      starred: false,
      avatar: 'IT'
    },
    {
      id: 3,
      sender: 'Prof. Michael Brown',
      department: 'Computer Science',
      subject: 'Faculty Meeting Minutes - December 2024',
      preview: 'Attached are the minutes from our December faculty meeting...',
      date: 'Dec 24, 2024',
      tags: ['sent', 'normal', 'meeting'],
      starred: false,
      avatar: 'M'
    }
  ]
  
  const getTagColor = (tag) => {
    const colors = {
      'pending approval': 'bg-yellow-100 text-yellow-800',
      'high': 'bg-red-100 text-red-800',
      'financial': 'bg-blue-100 text-blue-800',
      'in review': 'bg-blue-100 text-blue-800',
      'policy': 'bg-gray-100 text-gray-800',
      'sent': 'bg-purple-100 text-purple-800',
      'normal': 'bg-gray-100 text-gray-800',
      'meeting': 'bg-green-100 text-green-800'
    }
    return colors[tag] || 'bg-gray-100 text-gray-800'
  }
  
  return (
    <div className="flex-1 flex flex-col" onClick={() => setShowActions(null)}>
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg md:text-xl font-bold">Inbox</h1>
          <span className="text-xs md:text-sm text-gray-500 border rounded-md p-1">3 memos</span>
        </div>
        <label className="flex items-center text-sm font-medium text-black hover:text-blue-800 cursor-pointer">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={(e) => {
              setSelectAll(e.target.checked)
              if (e.target.checked) {
                setCheckedEmails(emails.map(email => email.id))
              } else {
                setCheckedEmails([])
              }
            }}
            className="mr-2"
          />
          Select all
        </label>
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
        {emails.map((email) => (
          <div
            key={email.id}
            className={`border-b border-gray-200 p-4 hover:bg-gray-50 cursor-pointer ${
              selectedEmail?.id === email.id ? 'bg-blue-100' : ''
            }`}
            onClick={() => {
              localStorage.setItem('selectedMail', JSON.stringify(email))
              navigate(`/mail-content/${email.id}`)
            }}
          >
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={checkedEmails.includes(email.id)}
                onChange={(e) => {
                  e.stopPropagation()
                  if (e.target.checked) {
                    setCheckedEmails([...checkedEmails, email.id])
                  } else {
                    setCheckedEmails(checkedEmails.filter(id => id !== email.id))
                    setSelectAll(false)
                  }
                }}
                className="mt-1"
              />
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-300 rounded-full flex items-center justify-center text-xs md:text-sm font-medium">
                {email.avatar}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-1 md:space-x-2">
                    <span className="font-medium text-gray-900 text-sm md:text-base truncate">{email.sender}</span>
                    <span className="text-xs border border-gray-300 rounded-md px-1 md:px-2 text-gray-500 hidden sm:inline">{email.department}</span>
                  </div>
                  <div className="flex items-center space-x-1 md:space-x-2">
                    {email.starred && (
                      <svg className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    )}
                    <svg className="w-3 h-3 md:w-4 md:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.586-6.586a2 2 0 00-2.828-2.828z" />
                    </svg>
                    {email.date && <span className="text-xs md:text-sm text-gray-500">{email.date}</span>}
                  </div>
                </div>
                
                <h3 className="font-medium text-gray-900 mb-1 text-sm md:text-base">{email.subject}</h3>
                <p className="text-xs md:text-sm text-gray-600 mb-2 line-clamp-2">{email.preview}</p>
                
                <div className="flex flex-wrap gap-1">
                  {email.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getTagColor(tag)}`}
                    >
                      {tag}
                    </span>
                  ))}
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
                    <button className="flex items-center w-full text-left px-3 py-2 text-sm hover:bg-gray-50">
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      View Details
                    </button>
                    
                    <button className="flex items-center w-full text-left px-3 py-2 text-sm hover:bg-gray-50">
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                      </svg>
                      Reply
                    </button>
                    
                    <button className="flex items-center w-full text-left px-3 py-2 text-sm hover:bg-gray-50">
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                      Forward
                    </button>

                    <hr />
                    
                    <button className="flex items-center w-full text-left px-3 py-2 text-sm hover:bg-gray-50">
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      Unstar
                    </button>
                    
                    <button className="flex items-center w-full text-left px-3 py-2 text-sm hover:bg-gray-50">
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Unpin
                    </button>

                    <hr />
                    
                    <button className="flex items-center w-full text-left px-3 py-2 text-sm hover:bg-gray-50">
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8l6 6 6-6" />
                      </svg>
                      Archive
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

export default Inbox