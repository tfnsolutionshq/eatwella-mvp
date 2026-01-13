import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import { useNotification } from '../../context/NotificationContext'
import { memoAPI } from '../../services/api'
import DashboardLayout from '../../DashboardLayout/DashboardLayout'
import ReplyModal from './ReplyModal'
import ForwardModal from './ForwardModal'
import ExportModal from './ExportModal'
import EditDraftModal from './EditDraftModal'
import CancelModal from './CancelModal'
import {
  FiArrowLeft,
  FiX,
  FiCalendar,
  FiPaperclip,
  FiDownload,
  FiShare,
  FiStar,
  FiArchive,
  FiTrash,
  FiMail,
  FiCheckCircle,
  FiCircle,
  FiCornerUpLeft,
  FiCornerUpRight,
  FiBookmark
} from 'react-icons/fi'

function MailContent() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token, user, role } = useAuth()
  const { showNotification } = useNotification()
  const [mail, setMail] = useState(null)
  const [loading, setLoading] = useState(false)
  const [comment, setComment] = useState('')
  const [approvalNote, setApprovalNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [pinning, setPinning] = useState(false)
  const [starring, setStarring] = useState(false)
  const [archiving, setArchiving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showReplyModal, setShowReplyModal] = useState(false)
  const [showForwardModal, setShowForwardModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const notificationPingedRef = useRef(false)

  const fetchMemoDetails = async () => {
    if (!token || !id) return

    setLoading(true)
    // Keep origin flags for back navigation only
    const selectedMail = localStorage.getItem('selectedMail')
    let origin = null
    if (selectedMail) {
      const cached = JSON.parse(selectedMail)
      origin = cached.isFromSentBox ? 'sent' : cached.isFromArchived ? 'archived' : cached.isFromStarred ? 'starred' : 'inbox'
    }

    try {
      const resp = await axios.get(`/memo-api/mailbox/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      const ok = resp?.data?.status === true && resp?.data?.data
      if (!ok) {
        showNotification('Failed to load memo details', 'error')
        return
      }

      const detail = resp.data.data
      const mailData = {
        ...detail,
        isFromSentBox: origin === 'sent',
        isFromArchived: origin === 'archived',
        isFromStarred: origin === 'starred'
      }

      setMail(mailData)
    } catch (error) {
      console.error('Error fetching memo details:', error)
      if (error.response?.status === 404) {
        showNotification('Memo not found', 'error')
      } else if (error.response?.status === 401) {
        showNotification('Session expired. Please log in again.', 'error')
      } else {
        showNotification('Failed to load memo details', 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAddComment = async () => {
    if (!comment.trim()) return
    
    setSubmitting(true)
    try {
      await axios.post(`/memo-api/memos/${id}/comments`, {
        content: comment
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      
      showNotification('Comment added successfully', 'success')
      setComment('')
      fetchMemoDetails()
    } catch (error) {
      console.error('Error adding comment:', error)
      showNotification('Failed to add comment', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleApproval = async (status) => {
    setSubmitting(true)
    try {
      await axios.post(`/memo-api/workflow-approvals/${id}/process`, {
        status: status,
        notes: approvalNote
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      
      showNotification(`Memo ${status} successfully`, 'success')
      setApprovalNote('')
      fetchMemoDetails()
    } catch (error) {
      console.error('Error processing approval:', error)
      showNotification(`Failed to ${status} memo`, 'error')
    } finally {
      setSubmitting(false)
    }
  }
  
  const handlePinMemo = async () => {
    setPinning(true)
    try {
      await memoAPI.pinMemo(id, token)
      showNotification('Memo pinned successfully', 'success')
      fetchMemoDetails()
    } catch (error) {
      console.error('Error pinning memo:', error)
      showNotification('Failed to pin memo', 'error')
    } finally {
      setPinning(false)
    }
  }
  
  const handleStarMemo = async () => {
    setStarring(true)
    try {
      await memoAPI.starMemo(id, token)
      showNotification('Memo starred successfully', 'success')
      fetchMemoDetails()
    } catch (error) {
      console.error('Error starring memo:', error)
      showNotification('Failed to star memo', 'error')
    } finally {
      setStarring(false)
    }
  }
  
  const handleArchiveMemo = async () => {
    setArchiving(true)
    try {
      await memoAPI.archiveMemo(id, token)
      showNotification('Memo archived successfully', 'success')
      fetchMemoDetails()
    } catch (error) {
      console.error('Error archiving memo:', error)
      showNotification('Failed to archive memo', 'error')
    } finally {
      setArchiving(false)
    }
  }
  
  const handleDeleteMemo = async () => {
    setDeleting(true)
    try {
      await memoAPI.deleteMemo(id, token)
      showNotification('Memo deleted successfully', 'success')
      navigate(
        mail?.isFromSentBox
          ? '/mailbox/sent'
          : mail?.isFromArchived
          ? '/mailbox/archived'
          : mail?.isFromStarred
          ? '/mailbox/starred'
          : '/mailbox'
      )
    } catch (error) {
      console.error('Error deleting memo:', error)
      showNotification('Failed to delete memo', 'error')
    } finally {
      setDeleting(false)
      setShowDeleteModal(false)
    }
  }

  const handleDownload = (url, filename) => {
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  useEffect(() => {
    fetchMemoDetails()
  }, [id, token])

  // Derive workflow step info and gate actions BEFORE any conditional returns to keep hooks order stable
  const steps = mail?.workflow?.steps || []
  const completedSet = new Set(['completed','approved','rejected','reviewed','done','finished'])
  const currentStep = steps.find(s => (s.status || '').toLowerCase() === 'current')
    || steps.find(s => (s.status || '').toLowerCase() === 'pending')
    || steps.find(s => !completedSet.has((s.status || '').toLowerCase()))
  const currentStatus = (currentStep?.status || '').toLowerCase()
  const isStepCompleted = completedSet.has(currentStatus) || !!currentStep?.is_completed
  const loggedInRoleId = role?.id || user?.role_id
  const roleMatches = !!(loggedInRoleId && currentStep?.required_role && loggedInRoleId === currentStep.required_role)
  const canActOnCurrentStep = !!(currentStep && roleMatches && !isStepCompleted && !mail?.is_archived && !mail?.isFromSentBox)

  // Hit Notification endpoint when opening a memo with active Notification step
  useEffect(() => {
    const isNotification = (currentStep?.type || '').toLowerCase() === 'notification'
    if (!notificationPingedRef.current && isNotification && token && mail?.id) {
      axios.get(`/memo-api/mailbox/${mail.id}`, { headers: { Authorization: `Bearer ${token}` } })
        .then(() => { notificationPingedRef.current = true })
        .catch((err) => {
          console.warn('Notification step ping failed:', err?.response?.status || err?.message)
        })
    }
  }, [currentStep, mail?.id, token])

  if (loading || !mail) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </DashboardLayout>
    )
  }


  return (
    <DashboardLayout>
      {/* Mobile Back Button */}
      <div className="sm:hidden p-3 border-b">
        <button
          onClick={() => navigate(
            mail?.isFromSentBox
              ? '/mailbox/sent'
              : mail?.isFromArchived
              ? '/mailbox/archived'
              : mail?.isFromStarred
              ? '/mailbox/starred'
              : '/mailbox'
          )}
          className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span className="text-sm">
            {mail?.isFromSentBox
              ? 'Back to Sent'
              : mail?.isFromArchived
              ? 'Back to Archived'
              : mail?.isFromStarred
              ? 'Back to Starred'
              : 'Back to Mailbox'}
          </span>
        </button>
      </div>
      
      <div className='w-full flex flex-col sm:flex-row p-3 sm:p-5 border-b justify-between items-start sm:items-center gap-3 sm:gap-0'>
          <div className='flex items-center gap-2'>
            <button
              onClick={() => navigate(
                mail?.isFromSentBox
                  ? '/mailbox/sent'
                  : mail?.isFromArchived
                  ? '/mailbox/archived'
                  : mail?.isFromStarred
                  ? '/mailbox/starred'
                  : '/mailbox'
              )}
              className="hidden sm:inline-flex items-center gap-2 text-gray-700 hover:text-gray-900"
            >
              <FiArrowLeft className="w-4 h-4" />
              <span className="text-sm">
                {mail?.isFromSentBox
                  ? 'Back to Sent'
                  : mail?.isFromArchived
                  ? 'Back to Archived'
                  : mail?.isFromStarred
                  ? 'Back to Starred'
                  : 'Back to Mailbox'}
              </span>
            </button>
            <div className='flex flex-wrap items-center gap-2 sm:ml-4'>
              {/* <span className={`text-xs px-2 py-1 rounded-full ${
                mail.status === 'sent' ? 'bg-green-100 text-green-800' :
                mail.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {mail.status}
              </span> */}
              <span className={`text-xs px-2 py-1 rounded-full ${
                mail.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                mail.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                mail.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {mail.priority} priority
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {mail.status === 'draft' ? (
              <>
                <button 
                  onClick={() => setShowEditModal(true)}
                  className="px-3 py-1.5 bg-white border rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2"
                >
                  <FiMail className="w-4 h-4" /> Edit
                </button>
                <button 
                  onClick={async () => {
                    setSubmitting(true)
                    try {
                      await axios.post('/memo-api/memos', {
                        subject: mail.subject,
                        body: mail.body,
                        priority: mail.priority,
                        status: 'sent',
                        workflow_id: mail.workflow?.id || null,
                        category_id: String(mail.category?.id || ''),
                        is_public: !mail.workflow?.id,
                        recipients: mail.recipients?.map(r => ({
                          recipient_id: r.recipient_id || r.id,
                          recipient_type: r.recipient_type,
                          recipient_role: r.recipient_role || r.role_id
                        })) || []
                      }, {
                        headers: { 'Authorization': `Bearer ${token}` }
                      })
                      showNotification('Memo sent successfully', 'success')
                      navigate('/mailbox/sent')
                    } catch (error) {
                      showNotification('Failed to send memo', 'error')
                    } finally {
                      setSubmitting(false)
                    }
                  }}
                  disabled={submitting}
                  className="px-3 py-1.5 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 flex items-center gap-2 disabled:opacity-50"
                >
                  <FiCornerUpRight className="w-4 h-4" /> {submitting ? 'Sending...' : 'Send Memo'}
                </button>
                <button 
                  onClick={() => setShowDeleteModal(true)}
                  className="px-3 py-1.5 bg-white border rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                >
                  <FiTrash className="w-4 h-4" /> Delete
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setShowExportModal(true)}
                  className="px-3 py-1.5 bg-white border rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2"
                >
                  <FiDownload className="w-4 h-4" /> Export
                </button>
                <button
                  onClick={() => setShowReplyModal(true)}
                  className="px-3 py-1.5 bg-white border rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2"
                >
                  <FiCornerUpLeft className="w-4 h-4" /> Reply
                </button>
                <button
                  onClick={() => setShowForwardModal(true)}
                  className="px-3 py-1.5 bg-white border rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2"
                >
                  <FiShare className="w-4 h-4" /> Forward
                </button>
                <button 
                  onClick={handleStarMemo}
                  disabled={starring}
                  className="px-3 py-1.5 bg-white border rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
                >
                  <FiStar className={`w-4 h-4 ${mail.is_starred ? 'text-yellow-500 fill-current' : ''}`} /> 
                  {starring ? 'Starring...' : mail.is_starred ? 'Unstar' : 'Star'}
                </button>
                <button 
                  onClick={handlePinMemo}
                  disabled={pinning}
                  className="px-3 py-1.5 bg-white border rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
                >
                  <FiBookmark className={`w-4 h-4 ${mail.is_pinned ? 'text-blue-500 fill-current' : ''}`} /> 
                  {pinning ? 'Pinning...' : mail.is_pinned ? 'Unpin' : 'Pin'}
                </button>
                <button 
                  onClick={handleArchiveMemo}
                  disabled={archiving}
                  className="px-3 py-1.5 bg-white border rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
                >
                  <FiArchive className={`w-4 h-4 ${mail.is_archived ? 'text-green-500' : ''}`} /> 
                  {archiving ? 'Archiving...' : mail.is_archived ? 'Unarchive' : 'Archive'}
                </button>
                {mail.workflow && currentStep && (
                  <button 
                    onClick={() => setShowCancelModal(true)}
                    className="px-3 py-1.5 bg-white border rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                  >
                    <FiX className="w-4 h-4" /> Cancel
                  </button>
                )}
                <button 
                  onClick={() => setShowDeleteModal(true)}
                  className="px-3 py-1.5 bg-white border rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                >
                  <FiTrash className="w-4 h-4" /> Delete
                </button>
              </>
            )}
          </div>
        </div>
      <div className="p-3 sm:p-6 max-w-4xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-lg border">
          <div className="p-3 sm:p-5 relative">
            {/* Date and Pinned - Top Right */}
            <div className="absolute top-3 right-3 sm:top-5 sm:right-5 flex flex-col gap-2 text-right">
              <div className="flex items-center gap-2">
                <FiCalendar className="w-4 h-4" />
                <span className="text-sm text-gray-600">
                  {mail.created_at ? new Date(mail.created_at).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  }) : 'December 26, 2024 at 11:30 AM'}
                </span>
              </div>
              {mail.is_pinned && (
                <span className="inline-flex items-center gap-1 text-blue-600 text-sm">
                  <FiBookmark className="w-4 h-4 fill-current" />
                  Pinned
                </span>
              )}
            </div>

            {/* Top badges */}
            {/* <div className="flex flex-wrap items-center gap-2 mb-3 pr-32 sm:pr-40"> */}
              {/* <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                mail.status === 'sent' ? 'bg-green-100 text-green-800' :
                mail.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {mail.status}
              </span> */}
              {/* <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                mail.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                mail.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                mail.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {mail.priority} priority
              </span>
              {mail.memo_type && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {mail.memo_type}
                </span>
              )} */}
              {/* {mail.workflow?.category_name && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {mail.workflow.category_name}
                </span>
              )} */}
            {/* </div> */}

            {/* Subject */}
            <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 pr-32 sm:pr-40">{mail.subject}</h1>

            {/* Meta row */}
            <div className="mt-2 flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Workflow:</span>
                <span className="font-medium">{mail.workflow?.name || 'No workflow'}</span>
              </div>
              {/* <div className="flex items-center gap-2">
                <span className="text-gray-500">Category:</span>
                <span className="font-medium">{mail.workflow?.category_name || 'Uncategorized'}</span>
              </div> */}
              {!mail.isFromSentBox && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium">
                    {mail.sender?.name ? mail.sender.name.substring(0, 2).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <div className="font-medium">{mail.sender?.name || 'Unknown Sender'}</div>
                    {mail.sender?.email && (
                      <div className="text-gray-500 text-xs">{mail.sender.email}</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Recipients */}
            {!mail.workflow && (
            <div className="mt-4 space-y-1 text-sm text-gray-700">
              <div className="flex items-start gap-2">
                <FiMail className="w-4 h-4 mt-0.5 text-gray-500" />
                <div>
                  <span className="font-medium">To:</span>
                  <span className="ml-2">
                    {mail.recipients?.filter(r => r.recipient_type === 'to').map(r => {
                      const fullName = [r.first_name, r.last_name].filter(Boolean).join(' ').trim()
                      return r.recipient_name || fullName || r.recipient_email || 'Unknown Recipient'
                    }).join(', ') || 'No recipients'}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <FiMail className="w-4 h-4 mt-0.5 text-gray-500" />
                <div>
                  <span className="font-medium">CC:</span>
                  <span className="ml-2">
                    {mail.recipients?.filter(r => r.recipient_type === 'cc').map(r => {
                      const fullName = [r.first_name, r.last_name].filter(Boolean).join(' ').trim()
                      return r.recipient_name || fullName || r.recipient_email || 'Unknown Recipient'
                    }).join(', ') || 'No CC recipients'}
                  </span>
                </div>
              </div>
            </div>
            )}
          </div>
        </div>

        {/* Workflow Progress */}
        {mail.workflow && (
          <div className="mt-6 bg-white rounded-2xl border">
            <div className="p-5">
              <h2 className="text-sm font-semibold text-gray-800 mb-1">Workflow: {mail.workflow.name}</h2>
              <p className="text-xs text-gray-500 mb-4">{mail.workflow.description}</p>
              
              {/* Archived Status */}
              {/* {mail.is_archived && (
                <div className="border border-green-200 bg-green-50 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8l6 6 6-6" />
                    </svg>
                    <div>
                      <div className="text-sm font-medium text-green-900">Archived Status</div>
                      <div className="text-xs text-green-700">This memo has been archived and moved out of your active inbox</div>
                    </div>
                  </div>
                </div>
              )} */}
              
              {/* Workflow Steps Progress - use step status from memo's workflow */}
              {mail.workflow?.steps && mail.workflow.steps.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Progress ({mail.workflow.steps.length} steps)</h4>
                  <div className="space-y-2">
                    {mail.workflow.steps.map((step) => {
                      const status = (step.status || '').toLowerCase()
                      const isCurrentStep = status === 'current'
                      const isCompleted = ['completed', 'approved', 'reviewed', 'done'].includes(status)
                      
                      return (
                        <div key={step.id} className={`flex items-center justify-between px-3 py-2 rounded text-sm ${
                          isCurrentStep ? 'bg-blue-50 border border-blue-200' :
                          isCompleted ? 'bg-green-50 border border-green-200' :
                          'bg-gray-50 border border-gray-200'
                        }`}>
                          <div className="flex items-center gap-2">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                              isCurrentStep ? 'bg-blue-500 text-white' :
                              isCompleted ? 'bg-green-500 text-white' :
                              'bg-gray-300 text-gray-600'
                            }`}>
                              {isCompleted ? '✓' : step.order}
                            </span>
                            <span className={`font-medium ${
                              isCurrentStep ? 'text-blue-900' :
                              isCompleted ? 'text-green-900' :
                              'text-gray-700'
                            }`}>
                              {step.name}
                            </span>
                            <span className={`px-1 py-0.5 text-xs rounded ${
                              step.type === 'Approval' ? 'bg-green-100 text-green-700' :
                              step.type === 'Review' ? 'bg-blue-100 text-blue-700' :
                              step.type === 'Notification' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-purple-100 text-purple-700'
                            }`}>
                              {step.type}
                            </span>
                            {step.required_role_name && (
                              <span className="px-1 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                                {step.required_role_name}
                              </span>
                            )}
                            {isCurrentStep && (
                              <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded font-medium">
                                In Progress
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">{step.time_limit ? `${step.time_limit}h` : ''}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
              
              {currentStep && (
                <div className="border border-gray-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2">
                    <FiCircle className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{currentStep.name}</div>
                      <div className="text-xs text-gray-600">Current step - {currentStep.type}</div>
                      {currentStep.description && (
                        <div className="text-xs text-gray-600 mt-1">{currentStep.description}</div>
                      )}
                      {currentStep.time_limit && (
                        <div className="text-xs text-orange-600 mt-1">Time limit: {currentStep.time_limit} hours</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        

        {/* Memo Content */}
        <div className="mt-6 bg-white rounded-2xl border">
          <div className="p-5">
            <h2 className="text-sm font-semibold text-gray-800 mb-3">Memo Content</h2>
            <div className="">
              <div className="text-sm text-gray-700 leading-relaxed" 
                   dangerouslySetInnerHTML={{ __html: mail.body || 'No content available' }} />
              
              {/* Sender Signature */}
              {mail.sender?.signature && (
                <div className="mt-6 flex justify-end">
                  <img 
                    src={`https://identity.smt.tfnsolutions.us/storage/${mail.sender.signature}`} 
                    alt="Signature" 
                    className="max-w-[200px] h-auto"
                  />
                </div>
              )}
            </div>

            {/* Parent Memo Details (for Forwarded Memos) */}
            {mail.memo_type === 'forward' && mail.parent_memo && (
              <div className="mt-8 pt-4 border-t border-gray-200">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  Forwarded Message
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  {/* Parent Header Info */}
                  <div className="flex flex-col gap-2 mb-4 text-sm border-b border-gray-200 pb-3">
                    <div className="flex gap-2">
                      <span className="font-semibold text-gray-700 w-16">From:</span>
                      <span className="text-gray-900">
                        {mail.parent_memo.sender?.name || 'Unknown'} 
                        {mail.parent_memo.sender?.email && <span className="text-gray-500 ml-1">&lt;{mail.parent_memo.sender.email}&gt;</span>}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-semibold text-gray-700 w-16">Date:</span>
                      <span className="text-gray-900">
                        {mail.parent_memo.created_at ? new Date(mail.parent_memo.created_at).toLocaleString('en-US', {
                          year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true
                        }) : 'Unknown'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-semibold text-gray-700 w-16">Subject:</span>
                      <span className="text-gray-900">{mail.parent_memo.subject}</span>
                    </div>
                  </div>
                  
                  {/* Parent Body */}
                  <div className="text-sm text-gray-600 bg-white p-3 rounded-lg border border-gray-100">
                     <div dangerouslySetInnerHTML={{ __html: mail.parent_memo.body || 'No content' }} />
                  </div>
                </div>
              </div>
            )}

            {/* Attachments */}
            {mail.attachments && mail.attachments.length > 0 && (
              <div className="mt-6 pt-4 border-t">
                <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FiPaperclip className="w-4 h-4" />
                  Attachments ({mail.attachments.length})
                </h3>
                <div className="space-y-2">
                  {mail.attachments.map((attachment) => (
                    <a
                      key={attachment.id}
                      href={attachment.url}
                      download={attachment.filename}
                      onClick={(e) => {
                        e.preventDefault()
                        handleDownload(attachment.url, attachment.filename)
                      }}
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <div className="flex-shrink-0">
                        {attachment.mime_type?.startsWith('image/') ? (
                          <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        ) : (
                          <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{attachment.filename}</p>
                        <p className="text-xs text-gray-500">
                          {(attachment.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                      <FiDownload className="w-5 h-5 text-gray-400" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Replies Thread - Only show if replies_count > 0 */}
        {mail.replies_count > 0 && (
          <div className="mt-6 bg-white rounded-2xl border">
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold text-gray-800">Replies</h2>
                  <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">
                    {mail.replies_count}
                  </span>
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500 mb-2">Showing latest replies</div>
                <div className="relative">
                  <div className="absolute left-3 top-0 bottom-0 w-px bg-gray-200"></div>
                  <div className="space-y-4">
                    {mail.latest_replies.map((reply) => (
                      <div key={reply.id} className="flex items-start gap-3">
                        <div className="relative z-10 flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-medium mt-1">
                          {(reply.sender_name || 'U').substring(0, 1).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-900">{reply.sender_name || 'Unknown Sender'}</span>
                            </div>
                            <span className="text-xs text-gray-500">
                              {reply.created_at ? new Date(reply.created_at).toLocaleString('en-US', {
                                year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true
                              }) : ''}
                            </span>
                          </div>
                          <div className="text-sm text-gray-700 mt-1">{reply.body_preview || ''}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Take Action - Only when user can act and step requires action */}
        {canActOnCurrentStep && (currentStep?.type === 'Review' || currentStep?.type === 'Approval') && (
          <div className="mt-6 bg-white rounded-2xl">
            <div className="">
              <h2 className="text-sm font-semibold text-gray-800 mb-1 flex items-center gap-2">
                {/* <span className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-gray-300 text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8z" /></svg>
                </span> */}
                Take Action
              </h2>
              
              {/* Review Type - Comment Field */}
              {canActOnCurrentStep && currentStep?.type === 'Review' && (
                <div className="border border-gray-200 rounded-lg p-4 mb-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Add Review Comment</h3>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Enter your review comment..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={handleAddComment}
                      disabled={submitting || !comment.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
                    >
                      {submitting ? 'Adding...' : 'Add Comment'}
                    </button>
                  </div>
                </div>
              )}
              
              {/* Approval Type - Approval/Rejection Buttons */}
              {canActOnCurrentStep && currentStep?.type === 'Approval' && (
                <div className="border border-gray-200 rounded-lg p-4 mb-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Approval Decision</h3>
                  <textarea
                    value={approvalNote}
                    onChange={(e) => setApprovalNote(e.target.value)}
                    placeholder="Add notes for your decision..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
                    rows="3"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApproval('approved')}
                      disabled={submitting}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:opacity-50"
                    >
                      {submitting ? 'Processing...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleApproval('rejected')}
                      disabled={submitting}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:opacity-50"
                    >
                      {submitting ? 'Processing...' : 'Reject'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Comments - Only show when there are actual comments */}
        {Array.isArray(mail.comments) && mail.comments.length > 0 && (
          <div className="mt-6 bg-white rounded-2xl border">
            <div className="p-5">
              <h2 className="text-sm font-semibold text-gray-800 mb-1">Comments</h2>
              <div className="space-y-3">
                {mail.comments.map((c) => (
                  <div key={c.id} className="flex items-start gap-3">
                    {/* <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs">
                      {(c.user?.name || 'U').substring(0, 2).toUpperCase()}
                    </div> */}
                    <div className="text-sm text-gray-700 mt-2">
                      <span className="font-medium">{c.user?.name || 'Unknown User'}</span>
                      <span className="ml-2">{c.content}</span>
                      <div className="text-xs text-gray-500">
                        {c.created_at ? new Date(c.created_at).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true
                        }) : ''}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Reply Modal */}
      {showReplyModal && (
        <ReplyModal
          mail={mail}
          onClose={() => setShowReplyModal(false)}
          onSuccess={fetchMemoDetails}
        />
      )}

      {/* Forward Modal */}
      {showForwardModal && (
        <ForwardModal
          mail={mail}
          onClose={() => setShowForwardModal(false)}
          onSuccess={fetchMemoDetails}
        />
      )}

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          mail={mail}
          onClose={() => setShowExportModal(false)}
        />
      )}

      {/* Edit Draft Modal */}
      {showEditModal && (
        <EditDraftModal
          mail={mail}
          onClose={() => setShowEditModal(false)}
          onSuccess={fetchMemoDetails}
        />
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <CancelModal
          mail={mail}
          onClose={() => setShowCancelModal(false)}
          onSuccess={fetchMemoDetails}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Memo</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete "{mail?.subject}"? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteMemo}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default MailContent
