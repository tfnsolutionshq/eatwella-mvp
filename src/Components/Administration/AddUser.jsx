import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import { useNotification } from '../../context/NotificationContext'
import { departmentAPI, roleAPI } from '../../services/api'
import { FiX } from 'react-icons/fi'

function AddUser({ onClose, onSuccess }) {
  const { token } = useAuth()
  const { showNotification } = useNotification()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    roleId: '',
    departmentId: ''
  })
  const [departments, setDepartments] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    fetchDepartmentsAndRoles()
  }, [])
  
  const fetchDepartmentsAndRoles = async () => {
    try {
      const [deptResponse, rolesResponse] = await Promise.all([
        departmentAPI.getDepartments(token),
        roleAPI.getRoles(token)
      ])
      
      if (deptResponse.status && deptResponse.data) {
        setDepartments(deptResponse.data.data)
      }
      
      if (rolesResponse.status && rolesResponse.data) {
        setRoles(rolesResponse.data.data)
      }
    } catch (error) {
      console.error('Error fetching departments and roles:', error)
      showNotification('Failed to load departments and roles', 'error')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    setLoading(true)
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/register`, {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: 'password123',
        password_confirmation: 'password123',
        department_id: formData.departmentId,
        role_id: formData.roleId
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.data.status) {
        showNotification('User created successfully', 'success')
        onSuccess && onSuccess()
        onClose()
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create user'
      showNotification(message, 'error')
    } finally {
      setLoading(false)
    }
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
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
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
          


          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                value={formData.roleId}
                onChange={(e) => setFormData({...formData, roleId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select role</option>
                {roles.map(role => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select
                value={formData.departmentId}
                onChange={(e) => setFormData({...formData, departmentId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select department</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
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
              disabled={loading}
              className="px-4 py-2 text-sm text-white bg-black rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
            >
              {loading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}

export default AddUser