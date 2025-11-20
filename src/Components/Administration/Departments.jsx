import React, { useState } from 'react'
import { FiMoreVertical, FiEdit, FiUserPlus, FiPower, FiTrash2 } from 'react-icons/fi'
import EditDepartment from './EditDepartment'

function Departments() {
  const [showDeptMenu, setShowDeptMenu] = useState(null)
  const [showEditDepartment, setShowEditDepartment] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState(null)

  const departments = [
    {
      name: 'Computer Science',
      status: 'active',
      userCount: 2,
      users: [
        { name: 'Dr. Sarah Johnson', role: 'Department Head', avatar: 'D' },
        { name: 'Prof. Michael Brown', role: 'Faculty', avatar: 'M' }
      ]
    },
    {
      name: 'Administration',
      status: 'active',
      userCount: 1,
      users: [
        { name: 'Sarah Wilson', role: 'Administrator', avatar: 'S' }
      ]
    },
    {
      name: 'Finance',
      status: 'active',
      userCount: 1,
      users: [
        { name: 'James Davis', role: 'Staff', avatar: 'J', status: 'inactive' }
      ]
    },
    {
      name: 'Academic Affairs',
      status: 'active',
      userCount: 1,
      users: [
        { name: 'Emily Chen', role: 'Dean', avatar: 'E' }
      ]
    },
    {
      name: 'Human Resources',
      status: 'active',
      userCount: 0,
      users: []
    },
    {
      name: 'Information Technology',
      status: 'inactive',
      userCount: 0,
      users: []
    }
  ]

  return (
    <div className="p-4 sm:p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Total Departments</p>
              <p className="text-xl font-bold text-gray-900">6</p>
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
              <p className="text-xl font-bold text-gray-900">5</p>
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
              <p className="text-xl font-bold text-gray-900">5</p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-gray-900">{dept.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  dept.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {dept.status}
                </span>
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowDeptMenu(showDeptMenu === index ? null : index)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <FiMoreVertical className="w-4 h-4 text-gray-400" />
                </button>
                {showDeptMenu === index && (
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
                    <button className="flex items-center w-full text-left px-3 py-2 text-xs hover:bg-gray-50">
                      <FiUserPlus className="w-3 h-3 mr-2" />
                      Add User
                    </button>
                    <button className="flex items-center w-full text-left px-3 py-2 text-xs hover:bg-gray-50">
                      <FiPower className="w-3 h-3 mr-2" />
                      Deactivate
                    </button>
                    <hr className="my-1" />
                    <button className="flex items-center w-full text-left px-3 py-2 text-xs hover:bg-gray-50 text-red-600">
                      <FiTrash2 className="w-3 h-3 mr-2" />
                      Delete Department
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mb-3">
              <p className="text-xs text-gray-600">
                {dept.userCount} {dept.userCount === 1 ? 'user' : 'users'}
              </p>
            </div>

            {dept.users.length > 0 ? (
              <div className="space-y-2">
                {dept.users.map((user, userIndex) => (
                  <div key={userIndex} className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium">
                      {user.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-900">{user.name}</span>
                        {user.status === 'inactive' && (
                          <span className="px-1 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                            inactive
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{user.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-xs text-gray-400">No users assigned</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Edit Department Modal */}
      {showEditDepartment && selectedDepartment && (
        <EditDepartment 
          department={selectedDepartment} 
          onClose={() => {
            setShowEditDepartment(false)
            setSelectedDepartment(null)
          }} 
        />
      )}
    </div>
  )
}

export default Departments