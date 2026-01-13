import React, { useState, useEffect, useRef } from 'react'
import { FiX, FiSend, FiPaperclip, FiUpload } from 'react-icons/fi'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import { useNotification } from '../../context/NotificationContext'
import { userAPI, memoAPI } from '../../services/api'

function ForwardModal({ mail, onClose, onSuccess }) {
  const { token } = useAuth()
  const { showNotification } = useNotification()
  const [priority, setPriority] = useState(mail?.priority || 'High')
  const [message, setMessage] = useState('')
  const [toSearch, setToSearch] = useState('')
  const [ccSearch, setCcSearch] = useState('')
  const [users, setUsers] = useState([])
  const [toRecipients, setToRecipients] = useState([])
  const [ccRecipients, setCcRecipients] = useState([])
  const [loading, setLoading] = useState(false)
  const [recipientSearch, setRecipientSearch] = useState('')
  const [selectedRecipients, setSelectedRecipients] = useState([])
  const [userAttachments, setUserAttachments] = useState([])
  const [showUploader, setShowUploader] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (token) {
      fetchUsers()
    }
  }, [token])

  

  const fetchUsers = async () => {
    try {
      const response = await userAPI.getUsers({}, token)
      if (response.status) setUsers(response.data.data)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const filteredUsers = users.filter(user =>
    recipientSearch && (user.email.toLowerCase().includes(recipientSearch.toLowerCase()) ||
    `${user.first_name} ${user.last_name}`.toLowerCase().includes(recipientSearch.toLowerCase()))
  )

  const addRecipient = (user, type) => {
    if (!selectedRecipients.some(r => r.recipient_id === user.id)) {
      setSelectedRecipients(prev => [...prev, {
        recipient_id: user.id,
        recipient_type: type,
        recipient_role: user.role_id,
        email: user.email,
        name: `${user.first_name} ${user.last_name}`.trim()
      }])
      setRecipientSearch('')
    }
  }

  const removeRecipient = (index) => {
    setSelectedRecipients(prev => prev.filter((_, i) => i !== index))
  }

  const handleFileSelect = (files) => {
    const maxSize = 10 * 1024 * 1024
    const valid = Array.from(files).filter((f) => {
      if (f.size > maxSize) {
        showNotification(`${f.name} exceeds 10MB limit`, 'error')
        return false
      }
      return true
    })
    if (valid.length) setUserAttachments(prev => [...prev, ...valid])
  }

  const handleAddFiles = (e) => {
    const files = e.target.files || []
    if (files.length) handleFileSelect(files)
    e.target.value = ''
  }

  const removeUserAttachment = (index) => {
    setUserAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const handleSend = async () => {
    if (selectedRecipients.length === 0) {
      showNotification('Please add at least one recipient', 'error')
      return
    }

    setLoading(true)
    try {
      const allRecipients = selectedRecipients
      const memoData = {
        subject: mail.subject.startsWith('Fwd: ') ? mail.subject : `Fwd: ${mail.subject}`,
        body: message || mail.body,
        workflow_id: mail.workflow?.id || null,
        category_id: String(mail.category?.id),
        priority,
        status: 'sent',
        is_public: !mail.workflow?.id,
        attachments: userAttachments,
        recipients: allRecipients.map(r => ({
          recipient_id: r.recipient_id,
          recipient_type: r.recipient_type,
          recipient_role: r.recipient_role
        }))
      }

      await memoAPI.createMemo(memoData, token)
      showNotification('Memo forwarded successfully!', 'success')
      onSuccess?.()
      onClose()
    } catch (error) {
      const data = error?.response?.data
      const msg = data?.message || error?.message || 'Failed to forward memo'
      const errorsObj = data?.errors
      let details = ''
      if (errorsObj && typeof errorsObj === 'object') {
        const parts = []
        for (const key of Object.keys(errorsObj)) {
          const arr = Array.isArray(errorsObj[key]) ? errorsObj[key] : [String(errorsObj[key])]
          parts.push(`${key}: ${arr.join('; ')}`)
        }
        details = parts.join(' | ')
      }
      showNotification(details ? `${msg} — ${details}` : msg, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between p-3 border-b sticky top-0 bg-white">
          <h2 className="text-base font-semibold text-gray-900">Forward Memo</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To / CC *</label>
            <input
              type="text"
              value={recipientSearch}
              onChange={(e) => setRecipientSearch(e.target.value)}
              placeholder="Search users by name or email..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            {recipientSearch && (
              <div className="mt-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
                {filteredUsers.map(user => (
                  <div key={user.id} className="p-2 hover:bg-gray-50 border-b last:border-b-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">{user.first_name} {user.last_name}</div>
                        <div className="text-xs text-gray-600">{user.email}</div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => addRecipient(user, 'to')}
                          className="px-1.5 py-1 text-[11px] bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                        >
                          To
                        </button>
                        <button
                          onClick={() => addRecipient(user, 'cc')}
                          className="px-1.5 py-1 text-[11px] bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                        >
                          CC
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {selectedRecipients.length > 0 && (
              <div className="mt-3 space-y-2">
                {selectedRecipients.map((recipient, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-xs rounded ${
                        recipient.recipient_type === 'to' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {recipient.recipient_type.toUpperCase()}
                      </span>
                      <span className="text-sm">{recipient.name}</span>
                    </div>
                    <button onClick={() => removeRecipient(index)} className="text-red-600 hover:text-red-800">
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <input
              type="text"
              value={mail?.subject?.startsWith('Fwd: ') ? mail.subject : `Fwd: ${mail.subject}`}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="Low">Low</option>
              <option value="Normal">Normal</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add your message (optional)..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="4"
            />
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              {/* <FiPaperclip className="w-4 h-4" />
              <span>Attachments</span> */}
              <button
                type="button"
                onClick={() => setShowUploader(true)}
                className="ml-auto px-3 py-1.5 text-xs font-medium bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
              >
                Add attachment
              </button>
            </div>
            {showUploader && (
              <div
                className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 bg-[#F7F7F8] text-center"
                onDragOver={(e) => { e.preventDefault() }}
                onDrop={(e) => {
                  e.preventDefault()
                  const files = e.dataTransfer.files
                  if (files?.length) handleFileSelect(files)
                }}
              >
                <FiUpload className="w-6 h-6 text-gray-500 mx-auto mb-2" />
                <p className="text-xs text-gray-700">Drag and drop files here, or</p>
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="mt-2 px-3 py-1.5 text-xs font-medium bg-white border border-gray-300 text-gray-700 rounded"
                >
                  Choose Files
                </button>
                <input ref={inputRef} type="file" multiple className="hidden" onChange={handleAddFiles} />
                <p className="mt-2 text-[11px] text-gray-500">Max 10MB per file</p>
              </div>
            )}
            {userAttachments.length > 0 && (
              <div className="mt-2 space-y-2">
                {userAttachments.map((file, idx) => (
                  <div key={`uatt-${idx}`} className="flex items-center justify-between p-2 border border-gray-200 rounded">
                    <div className="flex items-center gap-2">
                      <FiPaperclip className="w-4 h-4 text-gray-500" />
                      <span className="text-xs text-gray-700 truncate">{file.name}</span>
                    </div>
                    <button onClick={() => removeUserAttachment(idx)} className="text-[11px] px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200">
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-gray-700 bg-white border rounded-lg hover:bg-gray-50 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={loading}
            className="px-3 py-1.5 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2 text-sm"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <FiSend className="w-4 h-4" />
            )}
            {loading ? 'Forwarding...' : 'Forward'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ForwardModal
