import React, { useState, useEffect } from 'react'
import { FiMoreVertical, FiEdit, FiUserPlus, FiPower, FiTrash2 } from 'react-icons/fi'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import { useNotification } from '../../context/NotificationContext'
import { departmentAPI, userAPI } from '../../services/api'
import EditDepartment from './EditDepartment'

function Departments() {
  const [showDeptMenu, setShowDeptMenu] = useState(null)
  const [showEditDepartment, setShowEditDepartment] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [departmentToDelete, setDepartmentToDelete] = useState(null)
  const [departments, setDepartments] = useState([])
  const [stats, setStats] = useState({ total_departments: 0, active_departments: 0 })
  const [totalUsers, setTotalUsers] = useState(0)
  const [loading, setLoading] = useState(false)
  const { token } = useAuth()
  const { showNotification } = useNotification()

  const fetchData = async () => {
    setLoading(true)
    try {
      const [deptResponse, statsResponse, usersResponse] = await Promise.all([
        departmentAPI.getDepartments(token),
        departmentAPI.getDepartmentStats(token),
        userAPI.getUsers({}, token)
      ])
      
      if (deptResponse.status && deptResponse.data) {
        setDepartments(deptResponse.data.data)
      }
      
      if (statsResponse.status && statsResponse.data) {
        setStats(statsResponse.data)
      }
      
      if (usersResponse.status && usersResponse.data) {
        setTotalUsers(usersResponse.data.total)
      }
    } catch (error) {
      console.error('Error fetching departments:', error)
      showNotification('Failed to fetch departments', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDeleteDepartment = async () => {
    try {
      const response = await axios.delete(`/api/v1/departments/${departmentToDelete.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      showNotification('Department deleted successfully', 'success')
      fetchData()
    } catch (error) {
      console.error('Error deleting department:', error)
      const errorMessage = error.response?.data?.message || 'Failed to delete department'
      showNotification(errorMessage, 'error')
    } finally {
      setShowDeleteConfirm(false)
      setDepartmentToDelete(null)
    }
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Total Departments</p>
              <p className="text-xl font-bold text-gray-900">{stats.total_departments}</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Active Departments</p>
              <p className="text-xl font-bold text-gray-900">{stats.active_departments}</p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Total Users</p>
              <p className="text-xl font-bold text-gray-900">{totalUsers}</p>
            </div>
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Department Management Header */}
      <div className="mb-6">
        <h2 className="text-base font-semibold text-gray-900 mb-1">Department Management</h2>
        <p className="text-xs text-gray-600">Organize users by departments and manage hierarchies</p>
      </div>

      {/* Departments Grid */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept) => (
            <div key={dept.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-gray-900">{dept.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    dept.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {dept.is_active ? 'active' : 'inactive'}
                  </span>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setShowDeptMenu(showDeptMenu === dept.id ? null : dept.id)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <FiMoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                  {showDeptMenu === dept.id && (
                    <div className="absolute right-0 top-8 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1">
                      <button 
                        onClick={() => {
                          setSelectedDepartment(dept)
                          setShowEditDepartment(true)
                          setShowDeptMenu(null)
                        }}
                        className="flex items-center w-full text-left px-3 py-2 text-xs hover:bg-gray-50"
                      >
                        <FiEdit className="w-3 h-3 mr-2" />
                        Edit Department
                      </button>
                      {/* <button className="flex items-center w-full text-left px-3 py-2 text-xs hover:bg-gray-50">
                        <FiUserPlus className="w-3 h-3 mr-2" />
                        Add User
                      </button> */}
                      {/* <button className="flex items-center w-full text-left px-3 py-2 text-xs hover:bg-gray-50">
                        <FiPower className="w-3 h-3 mr-2" />
                        Deactivate
                      </button> */}
                      <hr className="my-1" />
                      <button 
                        onClick={() => {
                          setDepartmentToDelete(dept)
                          setShowDeleteConfirm(true)
                          setShowDeptMenu(null)
                        }}
                        className="flex items-center w-full text-left px-3 py-2 text-xs hover:bg-gray-50 text-red-600"
                      >
                        <FiTrash2 className="w-3 h-3 mr-2" />
                        Delete Department
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mb-3">
                <p className="text-xs text-gray-600">
                  {dept.department_code} • {dept.description}
                </p>
              </div>

              {/* <div className="text-center py-4">
                <p className="text-xs text-gray-400">Department details</p>
              </div> */}
            </div>
          ))}
        </div>
      )}

      {/* Edit Department Modal */}
      {showEditDepartment && selectedDepartment && (
        <EditDepartment 
          department={selectedDepartment} 
          onClose={() => {
            setShowEditDepartment(false)
            setSelectedDepartment(null)
          }}
          onSuccess={fetchData}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && departmentToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Department</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete "{departmentToDelete.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setDepartmentToDelete(null)
                }}
                className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteDepartment}
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

export default Departments