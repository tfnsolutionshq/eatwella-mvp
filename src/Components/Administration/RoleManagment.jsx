import React, { useState } from 'react'
import { FiEdit, FiPlus } from 'react-icons/fi'
import EditRole from './EditRole'

function RoleManagment() {
  const [selectedPermission, setSelectedPermission] = useState('Manage Department')
  const [showEditRole, setShowEditRole] = useState(false)
  const [selectedRole, setSelectedRole] = useState(null)

  const roles = [
    {
      name: 'Administrator',
      users: 1,
      permissions: ['Create Memos', 'Approve Memos', 'View Reports', 'Manage Users', 'System Administration']
    },
    {
      name: 'Dean',
      users: 1,
      permissions: ['Create Memos', 'Approve Memos', 'View Reports', 'Manage Department']
    },
    {
      name: 'Department Head',
      users: 1,
      permissions: ['Create Memos', 'Approve Memos', 'View Reports']
    },
    {
      name: 'Faculty',
      users: 1,
      permissions: ['Create Memos', 'View Reports']
    },
    {
      name: 'Staff',
      users: 1,
      permissions: ['Create Memos']
    }
  ]

  const availablePermissions = [
    {
      name: 'Create Memos',
      description: 'Can create and send memos',
      roles: 5
    },
    {
      name: 'Approve Memos',
      description: 'Can approve memos in workflows',
      roles: 3
    },
    {
      name: 'View Reports',
      description: 'Can access reporting and analytics',
      roles: 4
    },
    {
      name: 'Manage Users',
      description: 'Can add, edit, and remove users',
      roles: 1
    },
    {
      name: 'Manage Department',
      description: 'Can manage department settings',
      roles: 1
    },
    {
      name: 'System Administration',
      description: 'Full system administration access',
      roles: 1
    }
  ]

  return (
    <div className="p-4 sm:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Role Management */}
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-1">Role Management</h2>
            <p className="text-xs text-gray-600">Configure user roles and their permissions</p>
          </div>

          <div className="space-y-3">
            {roles.map((role, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{role.name}</h3>
                    <p className="text-xs text-gray-500">{role.users} users assigned</p>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedRole(role)
                      setShowEditRole(true)
                    }}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <FiEdit className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {role.permissions.map((permission, permIndex) => (
                    <span
                      key={permIndex}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                    >
                      {permission}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Available Permissions */}
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-1">Available Permissions</h2>
            <p className="text-xs text-gray-600">Complete list of system permissions</p>
          </div>

          <div className="space-y-3">
            {availablePermissions.map((permission, index) => (
              <div 
                key={index} 
                className={`bg-white border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedPermission === permission.name 
                    ? 'border-blue-200 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedPermission(permission.name)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-900">{permission.name}</h3>
                  <span className="text-xs text-gray-500">{permission.roles} roles</span>
                </div>
                <p className="text-xs text-gray-600">{permission.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Role Modal */}
      {showEditRole && selectedRole && (
        <EditRole 
          role={selectedRole} 
          onClose={() => {
            setShowEditRole(false)
            setSelectedRole(null)
          }} 
        />
      )}
    </div>
  )
}

export default RoleManagment
