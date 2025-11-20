import React, { useState } from 'react'

function Sentbox() {
  const [selectedEmail, setSelectedEmail] = useState(null)
  const [showActions, setShowActions] = useState(null)
  const [checkedEmails, setCheckedEmails] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  
  const emails = [
    {
      id: 1,
      sender: 'Prof. Michael Brown',
      department: 'Computer Science',
      subject: 'Faculty Meeting Minutes - December 2024',
      preview: 'Attached are the minutes from our December faculty meeting...',
      date: 'Dec 23, 2024',
      tags: ['sent', 'normal', 'meeting'],
      starred: false,
      avatar: 'M'
    }
  ]
  
  const getTagColor = (tag) => {
    const colors = {
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
          <h1 className="text-lg md:text-xl font-bold">Sent</h1>
          <span className="text-xs md:text-sm text-gray-500 border rounded-md p-1">1 memo</span>
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
            onClick={() => setSelectedEmail(email)}
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
                    <span className="text-xs md:text-sm text-gray-500 hidden sm:inline">{email.department}</span>
                  </div>
                  <div className="flex items-center space-x-1 md:space-x-2">
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

export default Sentbox