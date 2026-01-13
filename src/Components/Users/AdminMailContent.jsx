import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import { useNotification } from '../../context/NotificationContext'
import DashboardLayout from '../../DashboardLayout/DashboardLayout'
import { FiArrowLeft, FiPaperclip, FiDownload, FiCircle } from 'react-icons/fi'

export default function AdminMailContent() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()
  const { showNotification } = useNotification()
  const [mail, setMail] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchMemoDetails = async () => {
    if (!token || !id) return
    setLoading(true)
    try {
      let detail = null
      
      // Try admin endpoint first
      try {
        const adminRes = await axios.get(`/memo-api/admin/memos/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (adminRes.data?.status && adminRes.data?.data) {
          detail = adminRes.data.data
        }
      } catch (err) {
        // Fallback silently if admin endpoint fails
      }

      if (!detail) {
        const r = await axios.get(`/memo-api/mailbox/${id}`, { headers: { Authorization: `Bearer ${token}` } })
        const ok = r?.data?.status === true && r?.data?.data
        if (!ok) {
          showNotification('Memo not found', 'error')
          return
        }
        detail = r.data.data
      }

      setMail(detail)
    } catch (error) {
      showNotification('Failed to load memo details', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMemoDetails()
  }, [id, token])

  const handleDownload = (url, filename) => {
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Derive workflow step info
  const steps = mail?.workflow?.steps || []
  const completedSet = new Set(['completed','approved','rejected','reviewed','done','finished'])
  const currentStep = steps.find(s => (s.status || '').toLowerCase() === 'current')
    || steps.find(s => (s.status || '').toLowerCase() === 'pending')
    || steps.find(s => !completedSet.has((s.status || '').toLowerCase()))

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
      <div className="sm:hidden p-3 border-b">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900">
          <FiArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>
      </div>

      <div className="p-5">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{mail.subject}</h1>
              <div className="text-sm text-gray-600 mt-1">
                {mail.created_at ? new Date(mail.created_at).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }) : ''}
              </div>
            </div>
          </div>

          {/* Workflow Progress */}
          {mail.workflow && (
            <div className="mt-6 bg-white rounded-2xl border">
              <div className="p-5">
                <h2 className="text-sm font-semibold text-gray-800 mb-1">Workflow: {mail.workflow.name}</h2>
                <p className="text-xs text-gray-500 mb-4">{mail.workflow.description}</p>
                
                {/* Workflow Steps Progress */}
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

          <div className="mt-6 bg-white rounded-2xl border">
            <div className="p-5">
              <h2 className="text-sm font-semibold text-gray-800 mb-3">Memo Content</h2>
              <div className="text-sm text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: mail.body || '' }} />

              {mail.sender?.signature && (
                <div className="mt-6 flex justify-end">
                  <img src={`https://identity.smt.tfnsolutions.us/storage/${mail.sender.signature}`} alt="Signature" className="max-w-[200px] h-auto" />
                </div>
              )}

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
                          <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{attachment.filename}</p>
                          <p className="text-xs text-gray-500">{(attachment.size / 1024).toFixed(2)} KB</p>
                        </div>
                        <FiDownload className="w-5 h-5 text-gray-400" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Replies Thread */}
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
        </div>
      </div>
    </DashboardLayout>
  )
}
