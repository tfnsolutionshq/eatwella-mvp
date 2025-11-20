import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { FiX } from 'react-icons/fi'

function AddDepartment({ onClose }) {
  const [formData, setFormData] = useState({
    departmentName: '',
    departmentCode: '',
    departmentHead: '',
    description: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Creating department:', formData)
    onClose()
  }

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg p-4 w-full max-w-sm mx-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Add New Department</h2>
            <p className="text-xs text-gray-600">Create a new department</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Department Name</label>
            <input
              type="text"
              placeholder="e.g., Information Technology"
              value={formData.departmentName}
              onChange={(e) => setFormData({...formData, departmentName: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Department Code</label>
            <input
              type="text"
              placeholder="e.g., IT"
              value={formData.departmentCode}
              onChange={(e) => setFormData({...formData, departmentCode: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Department Head</label>
            <select
              value={formData.departmentHead}
              onChange={(e) => setFormData({...formData, departmentHead: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
            >
              <option value="">Select department head</option>
              <option value="Dr. Sarah Johnson">Dr. Sarah Johnson</option>
              <option value="Prof. Michael Brown">Prof. Michael Brown</option>
              <option value="Sarah Wilson">Sarah Wilson</option>
              <option value="Emily Chen">Emily Chen</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
            <textarea
              placeholder="Department overview and responsibilities..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              rows="3"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 text-xs text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 text-xs text-white bg-black rounded-lg hover:bg-gray-800"
            >
              Add Department
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}

export default AddDepartment