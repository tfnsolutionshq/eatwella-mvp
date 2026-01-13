import React, { useState } from 'react'
import { FiArrowLeft, FiChevronRight } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

export default function RecordExternalMemo() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    reference: '',
    dateReceived: '',
    subject: '',
    senderOrg: '',
    senderContact: '',
    priority: 'Medium',
    category: '',
    description: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

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
              <span className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center">1</span>
              <div>
                <p className="text-sm font-semibold text-gray-900">Metadata</p>
                <p className="text-xs text-gray-600">Basic information</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-gray-400">
              <span className="w-8 h-px bg-gray-200"></span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-700 text-xs flex items-center justify-center">2</span>
              <div>
                <p className="text-sm font-semibold text-gray-900">Attachments</p>
                <p className="text-xs text-gray-600">Upload files (optional)</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-gray-400">
              <span className="w-8 h-px bg-gray-200"></span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-700 text-xs flex items-center justify-center">3</span>
              <div>
                <p className="text-sm font-semibold text-gray-900">Assignment</p>
                <p className="text-xs text-gray-600">Department & officer</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-gray-400">
              <span className="w-8 h-px bg-gray-200"></span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-700 text-xs flex items-center justify-center">4</span>
              <div>
                <p className="text-sm font-semibold text-gray-900">Review</p>
                <p className="text-xs text-gray-600">Confirm details</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-3 w-full bg-gray-200 h-1 rounded-full">
          <div className="bg-black h-1 rounded-full" style={{ width: '25%' }}></div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-5 mt-6">
        <div>
          <p className="text-sm font-semibold text-gray-900">Metadata</p>
          <p className="text-xs text-gray-600">Basic information</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="text-sm text-gray-700">Reference Number <span className="text-red-500">*</span></label>
            <input name="reference" value={form.reference} onChange={handleChange} placeholder="e.g., MOE/ADM/2024/0125" className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-[#F3F3F5]" />
          </div>
          <div>
            <label className="text-sm text-gray-700">Date Received <span className="text-red-500">*</span></label>
            <input type="date" name="dateReceived" value={form.dateReceived} onChange={handleChange} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-[#F3F3F5]" />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-gray-700">Subject <span className="text-red-500">*</span></label>
            <input name="subject" value={form.subject} onChange={handleChange} placeholder="Enter memo subject" className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-[#F3F3F5]" />
          </div>
          <div>
            <label className="text-sm text-gray-700">Sender Organization <span className="text-red-500">*</span></label>
            <input name="senderOrg" value={form.senderOrg} onChange={handleChange} placeholder="e.g., Ministry of Education" className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-[#F3F3F5]" />
          </div>
          <div>
            <label className="text-sm text-gray-700">Sender Contact (Optional)</label>
            <input name="senderContact" value={form.senderContact} onChange={handleChange} placeholder="Email or phone" className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-[#F3F3F5]" />
          </div>
          <div>
            <label className="text-sm text-gray-700">Priority Level</label>
            <select name="priority" value={form.priority} onChange={handleChange} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-[#F3F3F5]">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-700">Category (Optional)</label>
            <input name="category" value={form.category} onChange={handleChange} placeholder="e.g., Policy, Request, Circular" className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-[#F3F3F5]" />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-gray-700">Description/Summary (Optional)</label>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Brief description of the memo content" className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm h-24 bg-[#F3F3F5]" />
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <button onClick={() => navigate(-1)} className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 text-gray-700 rounded-lg">Cancel</button>
          <button className="px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded-lg flex items-center gap-2" onClick={() => navigate('/record-external-attachments')}>
            Next
            <FiChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
