import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import { useNotification } from '../../context/NotificationContext'
import { roleAPI } from '../../services/api'
import { FiX, FiCheck } from 'react-icons/fi'

function AddRole({ onClose, onSuccess }) {
  const { token } = useAuth()
  const { showNotification } = useNotification()
  const [step, setStep] = useState(1) // 1: Create Role, 2: Assign Permissions
  const [loading, setLoading] = useState(false)
  const [createdRole, setCreatedRole] = useState(null)
  const [availablePermissions, setAvailablePermissions] = useState([])
  const [selectedPermissions, setSelectedPermissions] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })

  useEffect(() => {
    if (step === 2) {
      fetchPermissions()
    }
  }, [step])

  const fetchPermissions = async () => {
    try {
      const response = await roleAPI.getAvailablePermissions(token)
      if (response.success && response.permissions) {
        setAvailablePermissions(response.permissions)
      }
    } catch (error) {
      console.error('Error fetching permissions:', error)
      showNotification('Failed to fetch permissions', 'error')
    }
  }

  const handlePermissionChange = (permissionId, checked) => {
    if (checked) {
      setSelectedPermissions([...selectedPermissions, permissionId])
    } else {
      setSelectedPermissions(selectedPermissions.filter(id => id !== permissionId))
    }
  }

  const handleCreateRole = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formDataObj = new FormData()
      formDataObj.append('name', formData.name)
      formDataObj.append('description', formData.description)

      const response = await axios.post('/api/v1/roles', formDataObj, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.data.status) {
        setCreatedRole(response.data.data)
        showNotification('Role created successfully', 'success')
        setStep(2)
      }
    } catch (error) {
      console.error('Error creating role:', error)
      showNotification('Failed to create role', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleAssignPermissions = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await axios.put(`/api/v1/roles/${createdRole.id}/permissions/sync`, {
        permission_ids: selectedPermissions
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.data.success) {
        showNotification('Permissions assigned successfully', 'success')
        onSuccess && onSuccess()
        onClose()
      }
    } catch (error) {
      console.error('Error assigning permissions:', error)
      showNotification('Failed to assign permissions', 'error')
    } finally {
      setLoading(false)
    }
  }

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg p-4 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              {step === 1 ? 'Create New Role' : 'Assign Permissions'}
            </h2>
            <p className="text-xs text-gray-600">
              {step === 1 ? 'Define a new role' : `Assign permissions to ${createdRole?.name}`}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX className="w-4 h-4" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center mb-4">
          <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
            step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            {step > 1 ? <FiCheck className="w-3 h-3" /> : '1'}
          </div>
          <div className={`flex-1 h-0.5 mx-2 ${
            step > 1 ? 'bg-blue-600' : 'bg-gray-200'
          }`}></div>
          <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
            step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            2
          </div>
        </div>

        {step === 1 ? (
          <form onSubmit={handleCreateRole} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Role Name</label>
              <input
                type="text"
                placeholder="e.g., Department Coordinator"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
              <textarea
                placeholder="Describe the role and its responsibilities..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="2"
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
                {loading ? 'Creating...' : 'Create Role'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleAssignPermissions} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Available Permissions</label>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {availablePermissions.map((permission) => (
                  <label key={permission.id} className="flex items-start gap-2 p-2 hover:bg-gray-50 rounded">
                    <input
                      type="checkbox"
                      checked={selectedPermissions.includes(permission.id)}
                      onChange={(e) => handlePermissionChange(permission.id, e.target.checked)}
                      className="mt-0.5"
                    />
                    <div>
                      <div className="text-xs font-medium text-gray-900">{permission.name}</div>
                      <div className="text-xs text-gray-600">{permission.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-3 py-1 text-xs text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-3 py-1 text-xs text-white bg-black rounded-lg hover:bg-gray-800 disabled:opacity-50"
              >
                {loading ? 'Assigning...' : 'Complete'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  )
}

export default AddRole