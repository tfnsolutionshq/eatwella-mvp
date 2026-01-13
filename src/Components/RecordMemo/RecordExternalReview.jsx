import React from 'react'
import { FiArrowLeft, FiChevronRight, FiCheck, FiPaperclip } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

export default function RecordExternalReview() {
  const navigate = useNavigate()

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-4 lg:py-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-4">
        <FiArrowLeft className="w-4 h-4" />
        Back
      </button>

      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Record External Memo</h1>
      <p className="text-gray-600 text-sm mt-1">Record incoming memo from external organization</p>

      <div className="bg-white rounded-lg border border-gray-200 p-4 mt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center sm:flex-nowrap flex-wrap gap-4 sm:gap-6 overflow-x-auto">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-green-600 text-white text-xs flex items-center justify-center"><FiCheck className="w-3.5 h-3.5" /></span>
              <div>
                <p className="text-sm font-semibold text-gray-900">Metadata</p>
                <p className="text-xs text-gray-600">Basic information</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-green-600">
              <span className="w-8 h-px bg-green-600"></span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-green-600 text-white text-xs flex items-center justify-center"><FiCheck className="w-3.5 h-3.5" /></span>
              <div>
                <p className="text-sm font-semibold text-gray-900">Attachments</p>
                <p className="text-xs text-gray-600">Upload files (optional)</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-green-600">
              <span className="w-8 h-px bg-green-600"></span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-green-600 text-white text-xs flex items-center justify-center"><FiCheck className="w-3.5 h-3.5" /></span>
              <div>
                <p className="text-sm font-semibold text-gray-900">Assignment</p>
                <p className="text-xs text-gray-600">Department & officer</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-gray-400">
              <span className="w-8 h-px bg-gray-200"></span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center">4</span>
              <div>
                <p className="text-sm font-semibold text-gray-900">Review</p>
                <p className="text-xs text-gray-600">Confirm details</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-3 w-full bg-gray-200 h-1 rounded-full">
          <div className="bg-black h-1 rounded-full" style={{ width: '100%' }}></div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-5 mt-6">
        <div>
          <p className="text-sm font-semibold text-gray-900">Review</p>
          <p className="text-xs text-gray-600">Confirm details</p>
        </div>

        <div className="mt-4">
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                <FiPaperclip className="w-3.5 h-3.5 text-gray-700" />
              </span>
              <p className="text-sm font-medium text-gray-900">Memo Details</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-[#F3F3F5] border border-gray-300 rounded-lg px-3 py-2">
                <p className="text-xs text-gray-600">Reference Number</p>
                <p className="text-sm font-medium text-gray-900">MOE/ADM/123</p>
              </div>
              <div className="bg-[#F3F3F5] border border-gray-300 rounded-lg px-3 py-2">
                <p className="text-xs text-gray-600">Date Received</p>
                <p className="text-sm font-medium text-gray-900">12/11/2025</p>
              </div>
              <div className="md:col-span-2 bg-[#F3F3F5] border border-gray-300 rounded-lg px-3 py-2">
                <p className="text-xs text-gray-600">Subject</p>
                <p className="text-sm font-medium text-gray-900">External Test</p>
              </div>
              <div className="bg-[#F3F3F5] border border-gray-300 rounded-lg px-3 py-2">
                <p className="text-xs text-gray-600">Sender Organization</p>
                <p className="text-sm font-medium text-gray-900">TFN</p>
              </div>
              <div className="bg-[#F3F3F5] border border-gray-300 rounded-lg px-3 py-2">
                <p className="text-xs text-gray-600">Priority</p>
                <span className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-gray-800 text-xs font-medium">Medium</span>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4 mt-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                <FiPaperclip className="w-3.5 h-3.5 text-gray-700" />
              </span>
              <p className="text-sm font-medium text-gray-900">Attachments (1)</p>
            </div>
            <div className="bg-[#F3F3F5] border border-gray-300 rounded-lg px-3 py-2 flex items-center gap-2">
              <FiPaperclip className="w-3.5 h-3.5 text-gray-600" />
              <span className="text-sm text-gray-900 flex-1 truncate">Ordi Roadmap.docx</span>
              <span className="text-xs text-gray-600">651.88 KB</span>
            </div>
          </div>

          <div className="border rounded-lg p-4 mt-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                <FiPaperclip className="w-3.5 h-3.5 text-gray-700" />
              </span>
              <p className="text-sm font-medium text-gray-900">Assignment</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-[#F3F3F5] border border-gray-300 rounded-lg px-3 py-2">
                <p className="text-xs text-gray-600">Department</p>
                <p className="text-sm font-medium text-gray-900">Academic Affairs</p>
              </div>
              <div className="bg-[#F3F3F5] border border-gray-300 rounded-lg px-3 py-2">
                <p className="text-xs text-gray-600">Officer</p>
                <p className="text-sm font-medium text-gray-900">Dr. Emily Chen</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <button className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 text-gray-700 rounded-lg" onClick={() => navigate('/record-external-assignment')}>Previous</button>
          <button className="px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded-lg" onClick={() => navigate('/record-external-success')}>Submit</button>
        </div>
      </div>
    </div>
  )
}
