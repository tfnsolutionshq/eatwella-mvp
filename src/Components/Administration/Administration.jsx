import React, { useState } from 'react'
import { FiSearch, FiDownload, FiPlus, FiMoreVertical, FiEdit, FiEye, FiKey, FiPower, FiTrash2 } from 'react-icons/fi'
import RoleManagment from './RoleManagment'
import Departments from './Departments'
import MemoCategories from './MemoCategories'
import ActivityLogs from './ActivityLogs'
import SystemSettings from './SystemSettings'
import AddUser from './AddUser'
import ViewActivity from './ViewActivity'
import AddRole from './AddRole'
import AddDepartment from './AddDepartment'
import AddCategory from './AddCategory'

function Administrations() {
  const [activeTab, setActiveTab] = useState('Users')
  const [selectedUsers, setSelectedUsers] = useState([])
  const [showUserMenu, setShowUserMenu] = useState(null)
  const [showAddUser, setShowAddUser] = useState(false)
  const [showViewActivity, setShowViewActivity] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [showAddRole, setShowAddRole] = useState(false)
  const [showAddDepartment, setShowAddDepartment] = useState(false)
  const [showAddCategory, setShowAddCategory] = useState(false)

  const tabs = ['Users', 'Roles & Permissions', 'Departments', 'Memo Categories', 'Activity Logs', 'System Settings']

  const users = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@university.edu',
      role: 'Department Head',
      department: 'Computer Science',
      status: 'active',
      lastLogin: 'Dec 26, 10:30 AM',
      memos: 45,
      approvalRate: 94,
      avatar: 'D'
    },
    {
      id: 2,
      name: 'Prof. Michael Brown',
      email: 'michael.brown@university.edu',
      role: 'Faculty',
      department: 'Computer Science',
      status: 'active',
      lastLogin: 'Dec 25, 05:45 PM',
      memos: 28,
      approvalRate: 88,
      avatar: 'M'
    },
    {
      id: 3,
      name: 'Sarah Wilson',
      email: 'sarah.wilson@university.edu',
      role: 'Administrator',
      department: 'Administration',
      status: 'active',
      lastLogin: 'Dec 26, 09:15 AM',
      memos: 67,
      approvalRate: 96,
      avatar: 'S'
    },
    {
      id: 4,
      name: 'James Davis',
      email: 'james.davis@university.edu',
      role: 'Staff',
      department: 'Finance',
      status: 'inactive',
      lastLogin: 'Dec 20, 03:22 PM',
      memos: 12,
      approvalRate: 0,
      avatar: 'J'
    },
    {
      id: 5,
      name: 'Emily Chen',
      email: 'emily.chen@university.edu',
      role: 'Dean',
      department: 'Academic Affairs',
      status: 'active',
      lastLogin: 'Dec 26, 12:20 PM',
      memos: 89,
      approvalRate: 0,
      avatar: 'E'
    }
  ]

  const getRoleColor = (role) => {
    const colors = {
      'Department Head': 'bg-green-100 text-green-800',
      'Faculty': 'bg-orange-100 text-orange-800',
      'Administrator': 'bg-purple-100 text-purple-800',
      'Staff': 'bg-gray-100 text-gray-800',
      'Dean': 'bg-blue-100 text-blue-800'
    }
    return colors[role] || 'bg-gray-100 text-gray-800'
  }

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedUsers(users.map(user => user.id))
    } else {
      setSelectedUsers([])
    }
  }

  const handleUserSelect = (userId, checked) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId])
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId))
    }
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
          <p className="text-gray-600 text-sm">Manage users, roles, and system configuration</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2">
            <FiDownload className="w-4 h-4" />
            Export Data
          </button>
          <button 
            onClick={() => {
              if (activeTab === 'Users') setShowAddUser(true)
              else if (activeTab === 'Roles & Permissions') setShowAddRole(true)
              else if (activeTab === 'Departments') setShowAddDepartment(true)
              else if (activeTab === 'Memo Categories') setShowAddCategory(true)
            }}
            className="px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800 flex items-center gap-2"
          >
            <FiPlus className="w-4 h-4" />
            {activeTab === 'Users' && 'Add User'}
            {activeTab === 'Roles & Permissions' && 'Add Role'}
            {activeTab === 'Departments' && 'Add Department'}
            {activeTab === 'Memo Categories' && 'Add Category'}
            {activeTab === 'System Settings' && 'Save Settings'}
            {!['Users', 'Roles & Permissions', 'Departments', 'Memo Categories', 'System Settings'].includes(activeTab) && 'Add Item'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">5</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">4</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Administrators</p>
              <p className="text-2xl font-bold text-gray-900">1</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Memos</p>
              <p className="text-2xl font-bold text-gray-900">241</p>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="bg-gray-100 rounded-t-lg">
          <nav className="flex">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-1 px-4 text-center rounded-full font-medium text-sm ${
                  activeTab === tab
                    ? 'bg-white m-1 rounded-full text-gray-900 border-b-2 border-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Users Tab Content */}
        {activeTab === 'Users' && (
          <div className="p-4 sm:p-6">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                <select className="px-3 py-2 border border-gray-300 rounded-lg text-xs">
                  <option>All Departments</option>
                  <option>Computer Science</option>
                  <option>Administration</option>
                  <option>Finance</option>
                  <option>Academic Affairs</option>
                </select>
                <select className="px-3 py-2 border border-gray-300 rounded-lg text-xs">
                  <option>All Roles</option>
                  <option>Department Head</option>
                  <option>Faculty</option>
                  <option>Administrator</option>
                  <option>Staff</option>
                  <option>Dean</option>
                </select>
                <select className="px-3 py-2 border border-gray-300 rounded-lg text-xs">
                  <option>All Statuses</option>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
            </div>

            {/* User Directory Header */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-900">User Directory</h3>
              <p className="text-xs text-gray-600">Manage user accounts, roles, and permissions</p>
              <div className="mt-2 flex items-center justify-between">
                <label className="flex items-center text-xs">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === users.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="mr-2"
                  />
                  Select all
                </label>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 text-left">
                    <th className="pb-3 text-xs font-medium text-gray-900">User</th>
                    <th className="pb-3 text-xs font-medium text-gray-900">Role</th>
                    <th className="pb-3 text-xs font-medium text-gray-900">Department</th>
                    <th className="pb-3 text-xs font-medium text-gray-900">Status</th>
                    <th className="pb-3 text-xs font-medium text-gray-900">Last Login</th>
                    <th className="pb-3 text-xs font-medium text-gray-900">Memos</th>
                    <th className="pb-3 text-xs font-medium text-gray-900">Approval Rate</th>
                    <th className="pb-3 text-xs font-medium text-gray-900"></th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={(e) => handleUserSelect(user.id, e.target.checked)}
                            className="mr-2"
                          />
                          <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium">
                            {user.avatar}
                          </div>
                          <div>
                            <div className="text-xs font-medium text-gray-900">{user.name}</div>
                            <div className="text-xs text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4 text-xs text-gray-900">{user.department}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-4 text-xs text-gray-600">{user.lastLogin}</td>
                      <td className="py-4 text-xs text-gray-900">{user.memos}</td>
                      <td className="py-4">
                        {user.approvalRate > 0 ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-900">{user.approvalRate}%</span>
                            <div className="w-16 h-2 bg-gray-200 rounded-full">
                              <div 
                                className="h-2 bg-black rounded-full" 
                                style={{ width: `${user.approvalRate}%` }}
                              ></div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-4">
                        <div className="relative">
                          <button
                            onClick={() => setShowUserMenu(showUserMenu === user.id ? null : user.id)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <FiMoreVertical className="w-4 h-4 text-gray-400" />
                          </button>
                          {showUserMenu === user.id && (
                            <div className="absolute right-0 top-8 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1">
                              <button className="flex items-center w-full text-left px-3 py-2 text-xs hover:bg-gray-50">
                                <FiEdit className="w-3 h-3 mr-2" />
                                Edit User
                              </button>
                              <button 
                                onClick={() => {
                                  setSelectedUser(user)
                                  setShowViewActivity(true)
                                  setShowUserMenu(null)
                                }}
                                className="flex items-center w-full text-left px-3 py-2 text-xs hover:bg-gray-50"
                              >
                                <FiEye className="w-3 h-3 mr-2" />
                                View Activity
                              </button>
                              <button className="flex items-center w-full text-left px-3 py-2 text-xs hover:bg-gray-50">
                                <FiKey className="w-3 h-3 mr-2" />
                                Reset Password
                              </button>
                              <button className="flex items-center w-full text-left px-3 py-2 text-xs hover:bg-gray-50">
                                <FiPower className="w-3 h-3 mr-2" />
                                Deactivate
                              </button>
                              <hr className="my-1" />
                              <button className="flex items-center w-full text-left px-3 py-2 text-xs hover:bg-gray-50 text-red-600">
                                <FiTrash2 className="w-3 h-3 mr-2" />
                                Delete User
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Roles & Permissions Tab Content */}
        {activeTab === 'Roles & Permissions' && <RoleManagment />}

        {/* Departments Tab Content */}
        {activeTab === 'Departments' && <Departments />}

        {/* Memo Categories Tab Content */}
        {activeTab === 'Memo Categories' && <MemoCategories />}

        {/* Activity Logs Tab Content */}
        {activeTab === 'Activity Logs' && <ActivityLogs />}

        {/* System Settings Tab Content */}
        {activeTab === 'System Settings' && <SystemSettings />}

        {/* Other tabs placeholder */}
        {!['Users', 'Roles & Permissions', 'Departments', 'Memo Categories', 'Activity Logs', 'System Settings'].includes(activeTab) && (
          <div className="p-6 text-center">
            <p className="text-gray-500">Content for {activeTab} tab will be implemented here.</p>
          </div>
        )}
      </div>

      {/* Popups */}
      {showAddUser && <AddUser onClose={() => setShowAddUser(false)} />}
      {showAddRole && <AddRole onClose={() => setShowAddRole(false)} />}
      {showAddDepartment && <AddDepartment onClose={() => setShowAddDepartment(false)} />}
      {showAddCategory && <AddCategory onClose={() => setShowAddCategory(false)} />}
      {showViewActivity && selectedUser && (
        <ViewActivity 
          user={selectedUser} 
          onClose={() => {
            setShowViewActivity(false)
            setSelectedUser(null)
          }} 
        />
      )}
    </div>
  )
}

export default Administrations