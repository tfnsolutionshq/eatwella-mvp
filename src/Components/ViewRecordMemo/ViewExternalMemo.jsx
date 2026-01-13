import React from 'react'
import { FiArrowLeft, FiCopy, FiShare2, FiCheckCircle, FiArrowUpRight, FiDownload, FiEye, FiPaperclip, FiClock, FiHome, FiUser, FiFileText } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useNotification } from '../../context/NotificationContext'

export default function ViewExternalMemo() {
  const navigate = useNavigate()
  const { showNotification } = useNotification()
  const trackingId = 'EXT-2024-002'

  const copyTracking = async () => {
    try {
      await navigator.clipboard.writeText(trackingId)
      showNotification('Tracking ID copied', 'success')
    } catch {}
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
          <FiArrowLeft className="w-4 h-4" />
          Back to List
        </button>
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm flex items-center gap-2">
            <FiShare2 className="w-4 h-4" />
            Share
          </button>
          <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm flex items-center gap-2">
            <FiCheckCircle className="w-4 h-4" />
            Acknowledge
          </button>
          <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm flex items-center gap-2">
            <FiArrowUpRight className="w-4 h-4" />
            Forward
          </button>
          <button className="px-3 py-2 bg-gray-900 text-white rounded-lg text-sm">Mark Complete</button>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">External Memo Details</h1>
          <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-xs font-medium">processing</span>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-3 text-sm text-gray-700">
        <span className="font-medium">{trackingId}</span>
        <button onClick={copyTracking} className="p-1 rounded hover:bg-gray-100"><FiCopy className="w-4 h-4" /></button>
        <span className="text-gray-500">Received: Dec 7, 2024, 11:20 AM</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">New Employment Regulations</h2>
                <p className="text-xs text-gray-600">GOV/HR/2024/0089</p>
              </div>
              <span className="px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-medium">critical priority</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <div className="text-xs text-gray-600">Sender Organization</div>
                <div className="mt-1 inline-flex items-center gap-1 text-sm text-gray-900"><FiHome className="w-3.5 h-3.5 text-gray-600" />Government HR Office</div>
              </div>
              <div>
                <div className="text-xs text-gray-600">Sender Contact</div>
                <div className="mt-1 text-sm text-gray-900">regulations@gov-hr.gov</div>
              </div>
              <div>
                <div className="text-xs text-gray-600">Category</div>
                <span className="mt-1 inline-flex px-2 py-1 rounded bg-gray-100 text-gray-800 text-xs font-medium">Regulation</span>
              </div>
              <div>
                <div className="text-xs text-gray-600">Date Received</div>
                <div className="mt-1 text-sm font-medium text-gray-900">Dec 7, 2024, 11:20 AM</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-xs text-gray-600">Description</div>
              <div className="mt-1 text-sm text-gray-900">Updated employment regulations effective January 1, 2025. All HR policies must be aligned.</div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-3">
                <div>
                  <div className="text-sm font-medium text-gray-900">Public Tracking</div>
                  <div className="text-xs text-gray-600">Allow external parties to track this memo using the tracking ID</div>
                </div>
                <div className="relative inline-flex h-5 w-9 items-center rounded-full bg-gray-300">
                  <span className="inline-block h-3 w-3 transform rounded-full bg-white translate-x-1" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-3 text-gray-900">
              <FiPaperclip className="w-4 h-4" />
              <span className="text-sm font-semibold">Attachments (1)</span>
            </div>
            <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
              <div className="text-sm text-gray-900">Employment_Regulations_2025.pdf</div>
              <div className="flex items-center gap-3">
                <button className="text-gray-700 hover:text-gray-900 flex items-center gap-1"><FiEye className="w-4 h-4" />View</button>
                <button className="text-gray-700 hover:text-gray-900 flex items-center gap-1"><FiDownload className="w-4 h-4" />Download</button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-2 text-gray-900">
              <FiClock className="w-4 h-4" />
              <span className="text-sm font-semibold">Movement Timeline</span>
            </div>
            <div className="text-xs text-gray-600">Track memo movement and processing history</div>
            <div className="mt-3 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900">Received</div>
                  <div className="text-xs text-gray-600">By: Registry</div>
                  <div className="mt-1 bg-gray-100 rounded px-3 py-2 text-sm text-gray-900">Critical regulation update received</div>
                </div>
                <div className="text-xs text-gray-600 whitespace-nowrap">Dec 7, 2024, 11:20 AM</div>
              </div>
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900">Assigned</div>
                  <div className="text-xs text-gray-600 inline-flex gap-1 flex-wrap"><span className="px-2 py-1 rounded bg-gray-100 text-gray-800">Registry Office → Human Resources - Sarah Johnson</span></div>
                  <div className="mt-1 bg-gray-100 rounded px-3 py-2 text-sm text-gray-900">Urgent - requires immediate attention</div>
                </div>
                <div className="text-xs text-gray-600 whitespace-nowrap">Dec 7, 2024, 11:45 AM</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="text-sm font-semibold text-gray-900">Comments & Discussion</div>
            <div className="text-xs text-gray-600">Add notes and collaborate on this memo</div>
            <div className="mt-3 space-y-3">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">D</div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Dr. Sarah Johnson</div>
                      <div className="text-xs text-gray-600">Testing Comment</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600">Dec 11, 2025, 05:20 PM</div>
                </div>
              </div>
              <div className="flex items-end gap-2">
                <input className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-[#F3F3F5]" placeholder="Add a comment or note..." />
                <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm">Add Comment</button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="text-sm font-semibold text-gray-900">Assignment</div>
            <div className="mt-3">
              <div className="text-xs text-gray-600">Department</div>
              <div className="mt-1 inline-flex items-center gap-1 text-sm text-gray-900"><FiHome className="w-3.5 h-3.5 text-gray-600" />Human Resources</div>
            </div>
            <div className="mt-3">
              <div className="text-xs text-gray-600">Assigned Officer</div>
              <div className="mt-1 inline-flex items-center gap-2 text-sm text-gray-900"><div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">S</div><span>Sarah Johnson</span><span className="text-xs text-gray-600">sarah.johnson@university.edu</span></div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="text-sm font-semibold text-gray-900">Processing Stats</div>
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between"><span className="text-sm text-gray-700">Time in System</span><span className="text-sm font-medium text-gray-900">3 days</span></div>
              <div className="flex items-center justify-between"><span className="text-sm text-gray-700">Total Movements</span><span className="text-sm font-medium text-gray-900">2</span></div>
              <div className="flex items-center justify-between"><span className="text-sm text-gray-700">Comments</span><span className="text-sm font-medium text-gray-900">2</span></div>
              <div className="flex items-center justify-between"><span className="text-sm text-gray-700">Attachments</span><span className="text-sm font-medium text-gray-900">1</span></div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="text-sm font-semibold text-gray-900">Quick Actions</div>
            <div className="mt-3 space-y-2">
              <button className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm flex items-center gap-2"><FiDownload className="w-4 h-4" />Download All Attachments</button>
              <button className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm flex items-center gap-2"><FiFileText className="w-4 h-4" />Generate Report</button>
              <button onClick={copyTracking} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm flex items-center gap-2"><FiCopy className="w-4 h-4" />Copy Tracking URL</button>
              <button className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm flex items-center gap-2"><FiShare2 className="w-4 h-4" />Share Memo</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

