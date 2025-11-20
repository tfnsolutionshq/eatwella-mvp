import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { FiX } from 'react-icons/fi'

function AddUser({ onClose }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: '',
    department: '',
    status: 'Active'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log('Creating user:', formData)
    onClose()
  }

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Add New User</h2>
            <p className="text-sm text-gray-600">Create a new user account</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Enter full name"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select role</option>
                <option value="Department Head">Department Head</option>
                <option value="Faculty">Faculty</option>
                <option value="Administrator">Administrator</option>
                <option value="Staff">Staff</option>
                <option value="Dean">Dean</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select department</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Administration">Administration</option>
                <option value="Finance">Finance</option>
                <option value="Academic Affairs">Academic Affairs</option>
                <option value="Human Resources">Human Resources</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="Active"
                  checked={formData.status === 'Active'}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="mr-2"
                />
                <span className="text-sm">Active</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="Inactive"
                  checked={formData.status === 'Inactive'}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="mr-2"
                />
                <span className="text-sm">Inactive</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white bg-black rounded-lg hover:bg-gray-800"
            >
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}

export default AddUser