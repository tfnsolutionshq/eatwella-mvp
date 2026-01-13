import React, { useState, useEffect } from 'react'
import { FiX, FiSend, FiBold, FiItalic, FiUnderline } from 'react-icons/fi'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import { useNotification } from '../../context/NotificationContext'
import { userAPI, memoAPI } from '../../services/api'

function EditDraftModal({ mail, onClose, onSuccess }) {
  const { token } = useAuth()
  const { showNotification } = useNotification()
  const [subject, setSubject] = useState(mail?.subject || '')
  const [body, setBody] = useState(mail?.body || '')
  const [priority, setPriority] = useState(mail?.priority || 'Normal')
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState([])
  const [recipientSearch, setRecipientSearch] = useState('')
  const [selectedRecipients, setSelectedRecipients] = useState([])
  const [attachments, setAttachments] = useState([])

  useEffect(() => {
    if (token) {
      fetchUsers()
    }
    if (mail?.recipients) {
      setSelectedRecipients(mail.recipients.map(r => ({
        recipient_id: r.recipient_id || r.id,
        recipient_type: r.recipient_type,
        recipient_role: r.recipient_role || r.role_id,
        email: r.recipient_email || r.email,
        name: r.recipient_name || `${r.first_name || ''} ${r.last_name || ''}`.trim()
      })))
    }
  }, [token, mail])

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

  const handleSaveDraft = async () => {
    if (!subject.trim()) {
      showNotification('Please enter a subject', 'error')
      return
    }
    if (!body.trim()) {
      showNotification('Please enter content', 'error')
      return
    }
    if (selectedRecipients.length === 0) {
      showNotification('Please add at least one recipient', 'error')
      return
    }

    setLoading(true)
    try {
      await memoAPI.updateMemo(mail.id, {
        subject,
        body,
        priority,
        status: 'draft',
        workflow_id: mail.workflow?.id || null,
        category_id: String(mail.category?.id || ''),
        is_public: !mail.workflow?.id,
        recipients: selectedRecipients.map(r => ({
          recipient_id: r.recipient_id,
          recipient_type: r.recipient_type,
          recipient_role: r.recipient_role
        })),
        attachments
      }, token)

      showNotification('Draft saved successfully!', 'success')
      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Error saving draft:', error)
      showNotification('Failed to save draft', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSend = async () => {
    if (!subject.trim()) {
      showNotification('Please enter a subject', 'error')
      return
    }
    if (!body.trim()) {
      showNotification('Please enter content', 'error')
      return
    }
    if (selectedRecipients.length === 0) {
      showNotification('Please add at least one recipient', 'error')
      return
    }

    setLoading(true)
    try {
      await memoAPI.updateMemo(mail.id, {
        subject,
        body,
        priority,
        status: 'sent',
        workflow_id: mail.workflow?.id || null,
        category_id: String(mail.category?.id || ''),
        is_public: !mail.workflow?.id,
        recipients: selectedRecipients.map(r => ({
          recipient_id: r.recipient_id,
          recipient_type: r.recipient_type,
          recipient_role: r.recipient_role
        })),
        attachments
      }, token)

      showNotification('Memo sent successfully!', 'success')
      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Error sending memo:', error)
      showNotification('Failed to send memo', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xl max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between p-3 border-b sticky top-0 bg-white">
          <h2 className="text-base font-semibold text-gray-900">Edit Draft</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Recipients *</label>
            <input
              type="text"
              value={recipientSearch}
              onChange={(e) => setRecipientSearch(e.target.value)}
              placeholder="Search users by name or email..."
              className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs"
            />
            {recipientSearch && (
              <div className="mt-1 max-h-32 overflow-y-auto border border-gray-200 rounded">
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
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                        >
                          To
                        </button>
                        <button
                          onClick={() => addRecipient(user, 'cc')}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
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
            <label className="block text-xs font-medium text-gray-700 mb-1">Subject *</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter subject..."
              className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs"
            >
              <option value="Low">Low</option>
              <option value="Normal">Normal</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Content *</label>
            <div className="flex items-center gap-1 p-1 bg-gray-50 rounded mb-2">
              <button type="button" onClick={() => document.execCommand('bold')} className="p-1.5 hover:bg-gray-200 rounded">
                <FiBold className="w-3.5 h-3.5 text-gray-600" />
              </button>
              <button type="button" onClick={() => document.execCommand('italic')} className="p-1.5 hover:bg-gray-200 rounded">
                <FiItalic className="w-3.5 h-3.5 text-gray-600" />
              </button>
              <button type="button" onClick={() => document.execCommand('underline')} className="p-1.5 hover:bg-gray-200 rounded">
                <FiUnderline className="w-3.5 h-3.5 text-gray-600" />
              </button>
            </div>
            <div
              ref={(el) => {
                if (el && body && !el.textContent) {
                  el.innerHTML = body
                }
              }}
              contentEditable
              className="w-full min-h-[160px] px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent overflow-auto"
              style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}
              onInput={(e) => setBody(e.currentTarget.innerHTML)}
              data-placeholder="Enter your memo content here..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Attachments</label>
            <div
              className="border-2 border-dashed border-gray-300 rounded p-3 text-center"
              onDragOver={(e) => { e.preventDefault() }}
              onDrop={(e) => {
                e.preventDefault()
                const files = Array.from(e.dataTransfer.files || [])
                if (files.length) setAttachments(prev => [...prev, ...files])
              }}
            >
              <input
                id="edit-draft-attachments"
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files || [])
                  if (files.length) setAttachments(prev => [...prev, ...files])
                  e.target.value = ''
                }}
              />
              <button
                type="button"
                onClick={() => document.getElementById('edit-draft-attachments')?.click()}
                className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                Choose Files
              </button>
            </div>
            {attachments.length > 0 && (
              <div className="mt-2 space-y-1">
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <div className="text-xs text-gray-700 truncate max-w-[70%]">{file.name}</div>
                    <button
                      type="button"
                      onClick={() => setAttachments(prev => prev.filter((_, i) => i !== index))}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 p-3 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm text-gray-700 bg-white border rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveDraft}
            disabled={loading}
            className="px-3 py-1.5 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            onClick={handleSend}
            disabled={loading}
            className="px-3 py-1.5 text-sm bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <FiSend className="w-4 h-4" />
            )}
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditDraftModal
