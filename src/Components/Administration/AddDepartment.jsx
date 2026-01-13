import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { FiX } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { useNotification } from '../../context/NotificationContext'
import { departmentAPI, userAPI } from '../../services/api'

function AddDepartment({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    departmentName: '',
    departmentCode: '',
    departmentHead: '',
    description: ''
  })
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const { token } = useAuth()
  const { showNotification } = useNotification()

  const fetchUsers = async () => {
    try {
      const response = await userAPI.getUsers({}, token)
      if (response.status && response.data) {
        setUsers(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const departmentData = {
        name: formData.departmentName,
        department_code: formData.departmentCode,
        head_id: formData.departmentHead,
        description: formData.description
      }
      
      const response = await departmentAPI.createDepartment(departmentData, token)
      if (response.status) {
        showNotification('Department created successfully', 'success')
        onSuccess?.()
        onClose()
      }
    } catch (error) {
      console.error('Error creating department:', error)
      showNotification('Failed to create department', 'error')
    } finally {
      setLoading(false)
    }
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
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.first_name} {user.middle_name ? user.middle_name + ' ' : ''}{user.last_name}
                </option>
              ))}
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
              disabled={loading}
              className="px-3 py-1 text-xs text-white bg-black rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Add Department'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}

export default AddDepartment