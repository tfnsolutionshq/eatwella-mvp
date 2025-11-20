import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DashboardLayout from '../../DashboardLayout/DashboardLayout'
import {
  FiArrowLeft,
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
  const [mail, setMail] = useState(null)

  useEffect(() => {
    const selectedMail = localStorage.getItem('selectedMail')
    if (selectedMail) {
      setMail(JSON.parse(selectedMail))
    } else {
      // Default mail data for demo
      setMail({
        id: 1,
        sender: 'Finance Department',
        department: 'Finance',
        subject: 'Q4 Budget Allocation Review - Requires Immediate Attention',
        preview: 'Please review the attached Q4 budget allocation proposal...',
        date: 'Dec 26, 2024',
        tags: ['pending approval', 'high', 'financial'],
        starred: true,
        avatar: 'F'
      })
    }
  }, [id])

  if (!mail) {
    return (
      <DashboardLayout>
        <div className="p-4">Loading...</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      {/* Mobile Back Button */}
      <div className="sm:hidden p-3 border-b">
        <button
          onClick={() => navigate('/mailbox')}
          className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Mailbox</span>
        </button>
      </div>
      
      <div className='w-full flex flex-col sm:flex-row p-3 sm:p-5 border-b justify-between items-start sm:items-center gap-3 sm:gap-0'>
          <div className='flex items-center gap-2'>
            <button
              onClick={() => navigate('/mailbox')}
              className="hidden sm:inline-flex items-center gap-2 text-gray-700 hover:text-gray-900"
            >
              <FiArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to Mailbox</span>
            </button>
            <div className='flex flex-wrap items-center gap-2 sm:ml-4'>
              <p className='text-xs bg-yellow-100 text-yellow-800 px-2 rounded-full'>pending approval</p>
              <p className='text-xs bg-red-100 text-red-800 px-2 rounded-full'>High priority</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button className="px-3 py-1.5 bg-white border rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2">
              <FiCornerUpLeft className="w-4 h-4" /> Reply
            </button>
            <button className="px-3 py-1.5 bg-white border rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2">
              <FiCornerUpRight className="w-4 h-4" /> Forward
            </button>
            <button className="px-3 py-1.5 bg-white border rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2">
              <FiStar className="w-4 h-4" /> Unstar
            </button>
            <button className="px-3 py-1.5 bg-white border rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2">
              <FiBookmark className="w-4 h-4" /> Unpin
            </button>
            <button className="px-3 py-1.5 bg-white border rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2">
              <FiArchive className="w-4 h-4" /> Archive
            </button>
            <button className="px-3 py-1.5 bg-white border rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2">
              <FiTrash className="w-4 h-4" /> Delete
            </button>
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
                <span className="text-sm text-gray-600">{mail.datee || 'December 26, 2024 at 11:30 AM'}</span>
              </div>
              <span className="inline-flex items-center gap-1 text-blue-600 text-sm">
                <FiBookmark className="w-4 h-4" />
                Pinned
              </span>
            </div>

            {/* Top badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3 pr-32 sm:pr-40">
              {(mail.tags || []).includes('pending approval') && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">pending approval</span>
              )}
              {(mail.tags || []).includes('high') && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">high priority</span>
              )}
            </div>

            {/* Subject */}
            <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 pr-32 sm:pr-40">{mail.subject}</h1>

            {/* Meta row */}
            <div className="mt-2 flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Category:</span>
                <span className="font-medium capitalize">{mail.category || 'Financial'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium">{mail.avatar || 'FD'}</div>
                <div>
                  <div className="font-medium">{mail.sender || 'Finance Department'}</div>
                  <div className="text-gray-500 text-xs">{mail.department || 'Finance'}</div>
                </div>
              </div>
            </div>

            {/* Recipients */}
            <div className="mt-4 space-y-1 text-sm text-gray-700">
              <div className="flex items-start gap-2">
                <FiMail className="w-4 h-4 mt-0.5 text-gray-500" />
                <div>
                  <span className="font-medium">To:</span>
                  <span className="ml-2">{(mail.to && mail.to.join(', ')) || 'sarah.johnson@university.edu, dean@university.edu'}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <FiMail className="w-4 h-4 mt-0.5 text-gray-500" />
                <div>
                  <span className="font-medium">CC:</span>
                  <span className="ml-2">{(mail.cc && mail.cc.join(', ')) || 'fin@university.edu'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Workflow Progress */}
        <div className="mt-6 bg-white rounded-2xl border">
          <div className="p-5">
            <h2 className="text-sm font-semibold text-gray-800 mb-1">Workflow Progress</h2>
            <p className="text-xs text-gray-500 mb-4">Track the approval process and current status</p>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FiCheckCircle className="w-4 h-4 text-green-600" />
                <div>
                  <div className="text-sm font-medium text-green-700">Created</div>
                  <div className="text-xs text-green-600">Completed</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FiCircle className="w-4 h-4 text-blue-600" />
                <div>
                  <div className="text-sm font-medium text-blue-700">Department Head Approval</div>
                  <div className="text-xs text-gray-500">Current step</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FiCircle className="w-4 h-4" />
                <div className="text-sm">Dean Approval</div>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FiCircle className="w-4 h-4" />
                <div className="text-sm">Finance Review</div>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FiCircle className="w-4 h-4" />
                <div className="text-sm">Approved</div>
              </div>
            </div>
          </div>
        </div>

        {/* Attachments */}
        <div className="mt-6 bg-white rounded-2xl border">
          <div className="p-5">
            <h2 className="text-sm font-semibold text-gray-800 mb-1">Attachments</h2>
            <p className="text-xs text-gray-500 mb-4">(2)</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <FiPaperclip className="w-4 h-4 text-gray-500" />
                  <div>
                    <div className="text-sm font-medium">Q4_Budget_Proposal.pdf</div>
                    <div className="text-xs text-gray-500">1.95 MB</div>
                  </div>
                </div>
                <button className="px-3 py-1.5 bg-white border rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2">
                  <FiDownload className="w-4 h-4" /> Download
                </button>
              </div>
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <FiPaperclip className="w-4 h-4 text-gray-500" />
                  <div>
                    <div className="text-sm font-medium">Financial_Analysis.xlsx</div>
                    <div className="text-xs text-gray-500">1000 KB</div>
                  </div>
                </div>
                <button className="px-3 py-1.5 bg-white border rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2">
                  <FiDownload className="w-4 h-4" /> Download
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Memo Content */}
        <div className="mt-6 bg-white rounded-2xl border">
          <div className="p-5">
            <h2 className="text-sm font-semibold text-gray-800 mb-3">Memo Content</h2>
            <div className="rounded-xl border border-gray-200 p-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                {mail.preview || 'Please review the attached Q4 budget allocation proposal...'}
              </p>
            </div>
          </div>
        </div>

        {/* Activity & Comments */}
        <div className="mt-6 bg-white rounded-2xl border">
          <div className="p-5">
            <h2 className="text-sm font-semibold text-gray-800 mb-1 flex items-center gap-2">
              {/* Icon to mirror screenshot */}
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-gray-300 text-gray-600">
                {/* simple speech bubble */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8z" /></svg>
              </span>
              Activity & Comments
            </h2>
            <p className="text-xs text-gray-500 mb-4">Track all activity and conversations related to this memo</p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs">{mail.avatar || 'FD'}</div>
                <div className="text-sm text-gray-700">
                  <span className="font-medium">Finance Department</span>
                  <span className="ml-1">created this memo</span>
                  <span className="ml-2 text-gray-500">{mail.date || 'December 26, 2024 at 11:30 AM'}</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs">SYS</div>
                <div className="text-sm text-gray-700">
                  <span>System sent memo to recipients.</span>
                  <span className="ml-2 text-gray-500">{mail.date || 'December 26, 2024 at 11:30 AM'}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center text-gray-400 text-sm mt-6">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 text-gray-300 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4.5 h-4.5"><path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8z" /></svg>
              </span>
              <span>No additional comments or activity yet</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default MailContent
