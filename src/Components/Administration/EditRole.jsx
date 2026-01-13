import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import { useNotification } from '../../context/NotificationContext'
import { roleAPI } from '../../services/api'
import { FiX, FiCheck } from 'react-icons/fi'

function EditRole({ role, onClose, onSuccess }) {
  const { token } = useAuth()
  const { showNotification } = useNotification()
  const [step, setStep] = useState(1) // 1: Edit Role, 2: Update Permissions
  const [loading, setLoading] = useState(false)
  const [availablePermissions, setAvailablePermissions] = useState([])
  const [selectedPermissions, setSelectedPermissions] = useState([])
  const [formData, setFormData] = useState({
    name: role?.name || '',
    description: role?.description || ''
  })

  useEffect(() => {
    if (step === 2) {
      fetchPermissions()
      // Initialize selected permissions with current role permissions
      const currentPermissionIds = role?.permissions?.map(p => p.id) || []
      setSelectedPermissions(currentPermissionIds)
    }
  }, [step, role])

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

  const handleUpdateRole = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await axios.put(`/api/v1/roles/${role.id}?name=${encodeURIComponent(formData.name)}&description=${encodeURIComponent(formData.description)}`, null, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.data.status) {
        showNotification('Role updated successfully', 'success')
        setStep(2)
      }
    } catch (error) {
      console.error('Error updating role:', error)
      showNotification('Failed to update role', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePermissions = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await axios.put(`/api/v1/roles/${role.id}/permissions/sync`, {
        permission_ids: selectedPermissions
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.data.success) {
        showNotification('Permissions updated successfully', 'success')
        onSuccess && onSuccess()
        onClose()
      }
    } catch (error) {
      console.error('Error updating permissions:', error)
      showNotification('Failed to update permissions', 'error')
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
              {step === 1 ? 'Edit Role' : 'Update Permissions'}
            </h2>
            <p className="text-xs text-gray-600">
              {step === 1 ? 'Modify role details' : `Update permissions for ${role?.name}`}
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

        {/* Current Permissions Display */}
        {step === 1 && role?.permissions && role.permissions.length > 0 && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="text-xs font-medium text-gray-700 mb-2">Current Permissions:</h4>
            <div className="flex flex-wrap gap-1">
              {role.permissions.map((permission) => (
                <span key={permission.id} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  {permission.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleUpdateRole} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Role Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
              <textarea
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
                {loading ? 'Updating...' : 'Next: Permissions'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleUpdatePermissions} className="space-y-3">
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
                {loading ? 'Updating...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  )
}

export default EditRole