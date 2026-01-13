import React, { useState } from 'react'
import { FiArrowLeft, FiChevronRight, FiCheck, FiHome } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

export default function RecordExternalAssignment() {
  const navigate = useNavigate()
  const [department, setDepartment] = useState('Academic Affairs')
  const [officer, setOfficer] = useState('')
  const [remarks, setRemarks] = useState('')

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
              <span className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center">3</span>
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
          <div className="bg-black h-1 rounded-full" style={{ width: '75%' }}></div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-5 mt-6">
        <div>
          <p className="text-sm font-semibold text-gray-900">Assignment</p>
          <p className="text-xs text-gray-600">Department & officer</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="md:col-span-2">
            <label className="text-sm text-gray-700">Assign to Department <span className="text-red-500">*</span></label>
            <div className="mt-1 flex items-center gap-2">
              <span className="w-8 h-10 rounded-lg bg-[#F3F3F5] border border-gray-300 flex items-center justify-center"><FiHome className="w-4 h-4 text-gray-600" /></span>
              <select value={department} onChange={(e) => setDepartment(e.target.value)} className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-[#F3F3F5]">
                <option>Academic Affairs</option>
                <option>Finance</option>
                <option>Human Resources</option>
                <option>Registrar Office</option>
              </select>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm text-gray-700">Assign to Officer <span className="text-red-500">*</span></label>
            <select value={officer} onChange={(e) => setOfficer(e.target.value)} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-[#F3F3F5]">
              <option value="">Select officer</option>
              <option>Dr. Emily Cher</option>
              <option>Prof. Michael Brown</option>
              <option>Sarah Johnson</option>
              <option>Dr. Lisa Anderson</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm text-gray-700">Assignment Remarks (Optional)</label>
            <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Add any special instructions or notes for the assigned officer" className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm h-24 bg-[#F3F3F5]" />
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <button className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 text-gray-700 rounded-lg" onClick={() => navigate('/record-external-attachments')}>Previous</button>
          <button className="px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded-lg flex items-center gap-2" onClick={() => navigate('/record-external-review')}>
            Next
            <FiChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
