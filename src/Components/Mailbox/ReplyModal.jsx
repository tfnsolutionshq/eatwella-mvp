import React, { useState } from 'react'
import { FiX, FiSend } from 'react-icons/fi'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import { useNotification } from '../../context/NotificationContext'

function ReplyModal({ mail, onClose, onSuccess }) {
  const { token } = useAuth()
  const { showNotification } = useNotification()
  const [priority, setPriority] = useState(mail?.priority || 'High')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!message.trim()) {
      showNotification('Please enter a message', 'error')
      return
    }

    setLoading(true)
    try {
      const replyData = {
        subject: mail.subject.startsWith('Re: ') ? mail.subject : `Re: ${mail.subject}`,
        body: message,
        priority,
        workflow_id: mail.workflow?.id || null,
        category_id: String(mail.category?.id),
        status: 'sent',
        recipients: [{
          recipient_id: mail.sender?.id,
          recipient_type: 'to',
          recipient_role: mail.sender?.role_id || 'user'
        }]
      }

      await axios.post(`/memo-api/memos/${mail.id}/reply`, replyData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      showNotification('Reply sent successfully!', 'success')
      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Error sending reply:', error)
      showNotification('Failed to send reply', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between p-3 border-b sticky top-0 bg-white">
          <h2 className="text-base font-semibold text-gray-900">Reply to Memo</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">To</label>
            <input
              type="text"
              value={mail?.sender?.name || 'Unknown Sender'}
              readOnly
              className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Subject</label>
            <input
              type="text"
              value={mail?.subject?.startsWith('Re: ') ? mail.subject : `Re: ${mail.subject}`}
              readOnly
              className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs bg-gray-50"
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
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Message *</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your reply..."
              className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="6"
            />
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
            onClick={handleSend}
            disabled={loading}
            className="px-3 py-1.5 text-sm bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50 flex items-center gap-1.5"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
            ) : (
              <FiSend className="w-3 h-3" />
            )}
            {loading ? 'Sending...' : 'Send Reply'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReplyModal
