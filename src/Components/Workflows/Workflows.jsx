import React, { useState } from 'react'
import { FiSearch, FiDownload, FiPlus, FiMoreHorizontal, FiEdit, FiCopy, FiPause, FiClock, FiTrendingUp, FiPercent } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import Templates from './Templates'

function Workflows() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedStatus, setSelectedStatus] = useState('All Statuses')

  const tabs = ['Overview', 'Templates', 'Analytics', 'Settings']

  const workflowData = [
    {
      id: 1,
      title: 'Budget Request Approval',
      description: 'Standard workflow for budget requests across departments',
      category: 'Financial',
      status: 'active',
      steps: [
        { name: 'Department Head Review', duration: '2.5d', status: 'avg' },
        { name: 'Finance Review', duration: '3.2d', status: 'avg' },
        { name: 'Dean Approval', duration: '1.8d', status: 'avg' },
        { name: 'Delete', duration: '', status: 'delete' },
      ],
      metrics: {
        avgCompletion: 8,
        completed: 45,
        success: 89
      }
    },
    {
      id: 2,
      title: 'Policy Update Review',
      description: 'Workflow for reviewing and approving policy changes',
      category: 'Policy',
      status: 'active',
      steps: [
        { name: 'Legal Review', duration: '4.7d', status: 'avg' },
        { name: 'Department Review', duration: '2.8d', status: 'avg' },
        { name: 'Academic Board', duration: '5.2d', status: 'avg' },
        { name: 'Final Approval', duration: '1.4d', status: 'avg' },
      ],
      metrics: {
        avgCompletion: 3,
        completed: 12,
        success: 92
      }
    },
    {
      id: 3,
      title: 'HR Personnel Request',
      description: 'Workflow for hiring and personnel change requests',
      category: 'HR',
      status: 'draft',
      steps: [
        { name: 'HR Screening', duration: '3.2d', status: 'avg' },
        { name: 'Department Approval', duration: '2.1d', status: 'avg' },
        { name: 'Budget Verification', duration: '1.8d', status: 'avg' },
        { name: 'Final Authorization', duration: '1.2d', status: 'avg' },
      ],
      metrics: {
        avgCompletion: 0,
        completed: 0,
        success: 0
      }
    },
    {
      id: 4,
      title: 'IT Security Approval',
      description: 'Fast track workflow for critical security updates',
      category: 'Security',
      status: 'active',
      steps: [
        { name: 'IT Security Review', duration: '0.5d', status: 'avg' },
        { name: 'IT Director Approval', duration: '0.8d', status: 'avg' },
        { name: 'Emergency Authorization', duration: '0.3d', status: 'avg' },
      ],
      metrics: {
        avgCompletion: 2,
        completed: 28,
        success: 98
      }
    }
  ]

  const filteredWorkflows = workflowData.filter(workflow => {
    const matchesSearch = workflow.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All Categories' || workflow.category === selectedCategory
    const matchesStatus = selectedStatus === 'All Statuses' || workflow.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <div className="p-4 sm:p-6 w-full mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Workflow Management</h1>
            <p className="text-gray-600 text-sm mt-1">Design, manage, and monitor your organization's approval workflows</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
              <FiDownload className="w-4 h-4" />
              Import Template
            </button>
            <button 
              onClick={() => navigate('/create-workflow')}
              className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              Create Workflow
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={FiTrendingUp}
            label="Active Workflows"
            value="3"
            color="green"
          />
          <StatCard
            icon={FiClock}
            label="Pending Approvals"
            value="13"
            color="yellow"
          />
          <StatCard
            icon={FiClock}
            label="Avg. Completion Time"
            value="3.5d"
            color="blue"
          />
          <StatCard
            icon={FiPercent}
            label="Success Rate"
            value="70%"
            color="purple"
          />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
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
        
        <div className="p-6">
          {activeTab === 'Overview' && (
            <>
              {/* Search and Filters */}
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search workflows..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  >
                    <option>All Categories</option>
                    <option>Financial</option>
                    <option>Policy</option>
                    <option>HR</option>
                    <option>Security</option>
                  </select>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  >
                    <option>All Statuses</option>
                    <option>Active</option>
                    <option>Draft</option>
                    <option>Paused</option>
                  </select>
                </div>
              </div>

              {/* Workflow Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredWorkflows.map((workflow) => (
                  <WorkflowCard key={workflow.id} workflow={workflow} />
                ))}
              </div>
            </>
          )}
          
          {activeTab === 'Templates' && <Templates />}
          
          {activeTab === 'Analytics' && (
            <div className="text-center py-12">
              <p className="text-gray-500">Analytics content will be implemented here.</p>
            </div>
          )}
          
          {activeTab === 'Settings' && (
            <div className="text-center py-12">
              <p className="text-gray-500">Settings content will be implemented here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color }) {
  const colorClasses = {
    green: "bg-green-50 text-green-600",
    yellow: "bg-yellow-50 text-yellow-600",
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-gray-600 text-xs font-medium mb-1">{label}</p>
      <p className="text-xl sm:text-2xl font-bold text-gray-900">{value}</p>
    </div>
  )
}

function WorkflowCard({ workflow }) {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      {/* Card Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-base font-semibold text-gray-900">{workflow.title}</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded ${
              workflow.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {workflow.status}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-3">{workflow.description}</p>
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">{workflow.category}</span>
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">{workflow.category === 'HR' ? 'Human Resources' : workflow.category === 'Security' ? 'Information Technology' : 'Finance'}</span>
          </div>
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiMoreHorizontal className="w-4 h-4" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-2 w-40 z-10">
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <FiEdit className="w-4 h-4" />
                Edit Workflow
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <FiCopy className="w-4 h-4" />
                Clone Workflow
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <FiPause className="w-4 h-4" />
                Pause
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Workflow Steps */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Workflow Steps ({workflow.steps.filter(step => step.status !== 'delete').length})</h4>
        <div className="space-y-2">
          {workflow.steps.filter(step => step.status !== 'delete').map((step, index) => (
            <div key={index} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded text-sm">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium">{index + 1}</span>
                <span className="text-gray-900">{step.name}</span>
              </div>
              <span className="text-xs text-gray-500">{step.duration} avg</span>
            </div>
          ))}
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-xl font-bold text-gray-900 mb-1">{workflow.metrics.avgCompletion}</div>
          <div className="text-xs text-gray-600 mb-2">Active</div>
          <div className="text-xs text-gray-500">Avg. Completion Time</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-green-600 mb-1">{workflow.metrics.completed}</div>
          <div className="text-xs text-gray-600 mb-2">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-purple-600 mb-1">{workflow.metrics.success}%</div>
          <div className="text-xs text-gray-600 mb-2">Success</div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gray-900 h-2 rounded-full" 
            style={{ width: `${Math.min(workflow.metrics.avgCompletion * 10, 100)}%` }}
          ></div>
        </div>
        <div className="flex justify-end mt-1">
          <span className="text-xs text-gray-500">{workflow.metrics.avgCompletion > 0 ? `${workflow.metrics.avgCompletion * 0.5}` : '0'} days</span>
        </div>
      </div>
    </div>
  )
}

export default Workflows