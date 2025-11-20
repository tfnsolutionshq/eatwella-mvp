import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { FiX } from 'react-icons/fi'

function AddRole({ onClose }) {
  const [formData, setFormData] = useState({
    roleName: '',
    description: '',
    permissions: []
  })

  const availablePermissions = [
    { id: 'create_memos', name: 'Create Memos', description: 'Can create and send memos' },
    { id: 'approve_memos', name: 'Approve Memos', description: 'Can approve memos in workflows' },
    { id: 'view_reports', name: 'View Reports', description: 'Can access reporting and analytics' },
    { id: 'manage_users', name: 'Manage Users', description: 'Can add, edit, and remove users' },
    { id: 'manage_department', name: 'Manage Department', description: 'Can manage department settings' },
    { id: 'system_admin', name: 'System Administration', description: 'Full system administration access' }
  ]

  const handlePermissionChange = (permissionId, checked) => {
    if (checked) {
      setFormData({...formData, permissions: [...formData.permissions, permissionId]})
    } else {
      setFormData({...formData, permissions: formData.permissions.filter(id => id !== permissionId)})
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Creating role:', formData)
    onClose()
  }

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg p-4 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Create New Role</h2>
            <p className="text-xs text-gray-600">Define a new role with specific permissions</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Role Name</label>
            <input
              type="text"
              placeholder="e.g., Department Coordinator"
              value={formData.roleName}
              onChange={(e) => setFormData({...formData, roleName: e.target.value})}
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

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Permissions</label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {availablePermissions.map((permission) => (
                <label key={permission.id} className="flex items-start gap-2 p-2 hover:bg-gray-50 rounded">
                  <input
                    type="checkbox"
                    checked={formData.permissions.includes(permission.id)}
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
              onClick={onClose}
              className="px-3 py-1 text-xs text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 text-xs text-white bg-black rounded-lg hover:bg-gray-800"
            >
              Create Role
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}

export default AddRole