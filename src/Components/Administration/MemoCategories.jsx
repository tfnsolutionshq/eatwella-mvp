import React, { useState } from 'react'
import { FiSearch, FiPlus, FiMoreVertical, FiPower, FiEye } from 'react-icons/fi'
import AddCategory from './AddCategory'
import EditCategory from './EditCategory'

function MemoCategories() {
  const [showCategoryMenu, setShowCategoryMenu] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Statuses')
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [showEditCategory, setShowEditCategory] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)

  const categories = [
    {
      id: 1,
      name: 'Internal Memo',
      description: 'Internal communications within departments',
      status: 'active',
      usage: 456,
      created: '1/15/2023',
      icon: '📝',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      id: 2,
      name: 'External Communication',
      description: 'Communications with external stakeholders',
      status: 'active',
      usage: 234,
      created: '1/15/2023',
      icon: '📧',
      color: 'bg-green-100 text-green-800'
    },
    {
      id: 3,
      name: 'Policy Update',
      description: 'Official policy announcements and updates',
      status: 'active',
      usage: 189,
      created: '1/15/2023',
      icon: '📋',
      color: 'bg-purple-100 text-purple-800'
    },
    {
      id: 4,
      name: 'Urgent Notice',
      description: 'Time-sensitive urgent notifications',
      status: 'active',
      usage: 145,
      created: '1/15/2023',
      icon: '⚠️',
      color: 'bg-orange-100 text-orange-800'
    },
    {
      id: 5,
      name: 'Confidential',
      description: 'Confidential and sensitive information',
      status: 'active',
      usage: 98,
      created: '1/15/2023',
      icon: '🔒',
      color: 'bg-red-100 text-red-800'
    },
    {
      id: 6,
      name: 'Academic Affairs',
      description: 'Academic-related announcements and notices',
      status: 'active',
      usage: 267,
      created: '6/20/2023',
      icon: '🎓',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      id: 7,
      name: 'Human Resources',
      description: 'HR announcements and employee-related memos',
      status: 'active',
      usage: 178,
      created: '6/20/2023',
      icon: '👥',
      color: 'bg-purple-100 text-purple-800'
    },
    {
      id: 8,
      name: 'Financial',
      description: 'Budget, finance, and procurement related',
      status: 'active',
      usage: 203,
      created: '6/20/2023',
      icon: '💰',
      color: 'bg-green-100 text-green-800'
    },
    {
      id: 9,
      name: 'Maintenance Notice',
      description: 'Facility and system maintenance notifications',
      status: 'inactive',
      usage: 67,
      created: '6/10/2023',
      icon: '🔧',
      color: 'bg-yellow-100 text-yellow-800'
    }
  ]

  const totalUsage = categories.reduce((sum, cat) => sum + cat.usage, 0)
  const activeCategories = categories.filter(cat => cat.status === 'active').length

  return (
    <div className="p-4 sm:p-6">
      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs"
          />
        </div>
        <div className="flex gap-2">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-xs"
          >
            <option>All Statuses</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
          <button 
            onClick={() => setShowAddCategory(true)}
            className="px-4 py-2 bg-black text-white rounded-lg text-xs hover:bg-gray-800 flex items-center gap-2"
          >
            <FiPlus className="w-3 h-3" />
            Add Category
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Total Categories</p>
              <p className="text-xl font-bold text-gray-900">{categories.length}</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Active Categories</p>
              <p className="text-xl font-bold text-gray-900">{activeCategories}</p>
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
              <p className="text-xs text-gray-600">Total Usage</p>
              <p className="text-xl font-bold text-gray-900">{totalUsage}</p>
            </div>
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Header */}
      <div className="mb-4">
        <h2 className="text-base font-semibold text-gray-900 mb-1">Memo Categories</h2>
        <p className="text-xs text-gray-600">Manage categories for organizing memos ({categories.length} categories)</p>
      </div>

      {/* Categories List */}
      <div className="space-y-3">
        {categories.map((category) => (
          <div key={category.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
                  {category.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-medium text-gray-900">{category.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      category.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {category.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{category.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Used in {category.usage} memos</span>
                    <span>Created {category.created}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {category.status === 'inactive' ? (
                  <button className="px-3 py-1.5 bg-white border rounded-lg text-xs hover:bg-gray-50 flex items-center gap-2">
                    <FiEye className="w-3 h-3" />
                    Activate
                  </button>
                ) : (
                  <button className="px-3 py-1.5 bg-white border rounded-lg text-xs hover:bg-gray-50 flex items-center gap-2">
                    <FiPower className="w-3 h-3" />
                    Deactivate
                  </button>
                )}
                <div className="relative">
                  <button
                    onClick={() => setShowCategoryMenu(showCategoryMenu === category.id ? null : category.id)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <FiMoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                  {showCategoryMenu === category.id && (
                    <div className="absolute right-0 top-8 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1">
                      <button 
                        onClick={() => {
                          setSelectedCategory(category)
                          setShowEditCategory(true)
                          setShowCategoryMenu(null)
                        }}
                        className="flex items-center w-full text-left px-3 py-2 text-xs hover:bg-gray-50"
                      >
                        Edit
                      </button>
                      <button className="flex items-center w-full text-left px-3 py-2 text-xs hover:bg-gray-50 text-red-600">
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      {showAddCategory && <AddCategory onClose={() => setShowAddCategory(false)} />}
      {showEditCategory && selectedCategory && (
        <EditCategory 
          category={selectedCategory} 
          onClose={() => {
            setShowEditCategory(false)
            setSelectedCategory(null)
          }} 
        />
      )}
    </div>
  )
}

export default MemoCategories