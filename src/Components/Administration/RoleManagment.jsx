import React, { useState, useEffect } from 'react'
import { FiEdit, FiPlus, FiTrash2, FiMoreVertical } from 'react-icons/fi'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import { useNotification } from '../../context/NotificationContext'
import { roleAPI } from '../../services/api'
import EditRole from './EditRole'

function RoleManagment() {
  const [selectedPermission, setSelectedPermission] = useState('')
  const [showEditRole, setShowEditRole] = useState(false)
  const [selectedRole, setSelectedRole] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [roleToDelete, setRoleToDelete] = useState(null)
  const [showRoleMenu, setShowRoleMenu] = useState(null)
  const [showDeletePermissionConfirm, setShowDeletePermissionConfirm] = useState(false)
  const [permissionToDelete, setPermissionToDelete] = useState(null)
  const [showPermissionMenu, setShowPermissionMenu] = useState(null)
  const [roles, setRoles] = useState([])
  const [permissions, setPermissions] = useState([])
  const [loading, setLoading] = useState(false)
  const { token } = useAuth()
  const { showNotification } = useNotification()

  const fetchData = async () => {
    setLoading(true)
    try {
      const [rolesResponse, permissionsResponse] = await Promise.all([
        roleAPI.getRoles(token),
        roleAPI.getAvailablePermissions(token)
      ])
      
      if (rolesResponse.status && rolesResponse.data) {
        setRoles(rolesResponse.data.data)
      }
      
      if (permissionsResponse.success && permissionsResponse.permissions) {
        setPermissions(permissionsResponse.permissions)
      }
    } catch (error) {
      console.error('Error fetching roles/permissions:', error)
      showNotification('Failed to fetch roles and permissions', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDeleteRole = async () => {
    try {
      const response = await axios.delete(`/api/v1/roles/${roleToDelete.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      showNotification('Role deleted successfully', 'success')
      fetchData() // Refresh the roles list
    } catch (error) {
      console.error('Error deleting role:', error)
      showNotification('Failed to delete role', 'error')
    } finally {
      setShowDeleteConfirm(false)
      setRoleToDelete(null)
    }
  }

  const handleDeletePermission = async () => {
    try {
      const response = await axios.delete(`/api/v1/permissions/${permissionToDelete.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      showNotification('Permission deleted successfully', 'success')
      fetchData() // Refresh the permissions list
    } catch (error) {
      console.error('Error deleting permission:', error)
      showNotification('Failed to delete permission', 'error')
    } finally {
      setShowDeletePermissionConfirm(false)
      setPermissionToDelete(null)
    }
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Role Management */}
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-1">Role Management</h2>
            <p className="text-xs text-gray-600">Configure user roles and their permissions</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {roles.map((role) => (
                <div key={role.id} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{role.name}</h3>
                      <p className="text-xs text-gray-500">{role.permissions?.length || 0} permissions assigned</p>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setShowRoleMenu(showRoleMenu === role.id ? null : role.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <FiMoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                      {showRoleMenu === role.id && (
                        <div className="absolute right-0 top-8 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1">
                          <button 
                            onClick={() => {
                              setSelectedRole(role)
                              setShowEditRole(true)
                              setShowRoleMenu(null)
                            }}
                            className="flex items-center w-full text-left px-3 py-2 text-xs hover:bg-gray-50"
                          >
                            <FiEdit className="w-3 h-3 mr-2" />
                            Edit Role
                          </button>
                          <button 
                            onClick={() => {
                              setRoleToDelete(role)
                              setShowDeleteConfirm(true)
                              setShowRoleMenu(null)
                            }}
                            className="flex items-center w-full text-left px-3 py-2 text-xs hover:bg-gray-50 text-red-600"
                          >
                            <FiTrash2 className="w-3 h-3 mr-2" />
                            Delete Role
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {role.permissions?.map((permission) => (
                      <span
                        key={permission.id}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                      >
                        {permission.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Available Permissions */}
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-1">Available Permissions</h2>
            <p className="text-xs text-gray-600">Complete list of system permissions</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {permissions.map((permission) => (
                <div 
                  key={permission.id} 
                  className={`bg-white border rounded-lg p-4 transition-colors ${
                    selectedPermission === permission.id 
                      ? 'border-blue-200 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 
                      className="text-sm font-medium text-gray-900 cursor-pointer flex-1"
                      onClick={() => setSelectedPermission(permission.id)}
                    >
                      {permission.name}
                    </h3>
                    <div className="relative">
                      <button
                        onClick={() => setShowPermissionMenu(showPermissionMenu === permission.id ? null : permission.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <FiMoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                      {showPermissionMenu === permission.id && (
                        <div className="absolute right-0 top-8 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1">
                          <button 
                            onClick={() => {
                              setPermissionToDelete(permission)
                              setShowDeletePermissionConfirm(true)
                              setShowPermissionMenu(null)
                            }}
                            className="flex items-center w-full text-left px-3 py-2 text-xs hover:bg-gray-50 text-red-600"
                          >
                            <FiTrash2 className="w-3 h-3 mr-2" />
                            Delete Permission
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <p 
                    className="text-xs text-gray-600 cursor-pointer"
                    onClick={() => setSelectedPermission(permission.id)}
                  >
                    {permission.description}
                  </p>
                </div>
              ))}
            </div>
          )}
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
          onSuccess={fetchData}
        />
      )}

      {/* Delete Role Confirmation Modal */}
      {showDeleteConfirm && roleToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Role</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete the role "{roleToDelete.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setRoleToDelete(null)
                }}
                className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteRole}
                className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Permission Confirmation Modal */}
      {showDeletePermissionConfirm && permissionToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Permission</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete the permission "{permissionToDelete.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeletePermissionConfirm(false)
                  setPermissionToDelete(null)
                }}
                className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePermission}
                className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RoleManagment
