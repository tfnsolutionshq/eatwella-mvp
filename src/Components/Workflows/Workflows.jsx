import React, { useState, useEffect } from 'react'
import { FiSearch, FiDownload, FiPlus, FiMoreHorizontal, FiEdit, FiCopy, FiPause, FiClock, FiTrendingUp, FiPercent, FiPlay } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useNotification } from '../../context/NotificationContext'
import { workflowAPI, roleAPI } from '../../services/api'
import Templates from './Templates'
import ConfirmationModal from './ConfirmationModal'

function Workflows() {
  const navigate = useNavigate()
  const { token } = useAuth()
  const { showNotification } = useNotification()
  const [activeTab, setActiveTab] = useState('Overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedStatus, setSelectedStatus] = useState('All Statuses')
  const [workflows, setWorkflows] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(false)

  const tabs = ['Overview', 'Templates', 'Analytics', 'Settings']

  const fetchWorkflows = async () => {
    setLoading(true)
    try {
      const [workflowResponse, roleResponse] = await Promise.all([
        workflowAPI.getWorkflows(token),
        roleAPI.getRoles(token)
      ])
      
      if (workflowResponse.status && workflowResponse.data) {
        setWorkflows(workflowResponse.data)
      }
      
      if (roleResponse.status && roleResponse.data) {
        setRoles(roleResponse.data.data)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      showNotification('Failed to fetch workflows', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWorkflows()
  }, [])

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All Categories' || workflow.category_name === selectedCategory
    const matchesStatus = selectedStatus === 'All Statuses' || (workflow.is_active ? 'Active' : 'Inactive') === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const activeWorkflows = workflows.filter(w => w.is_active).length
  const totalPending = workflows.reduce((sum, w) => sum + w.total_active_memos, 0)
  const avgCompletionTime = workflows.length > 0 ? 
    Math.round(workflows.reduce((sum, w) => sum + w.average_completion_time, 0) / workflows.length) : 0
  const successRate = workflows.length > 0 ? 
    Math.round(workflows.reduce((sum, w) => sum + w.success_rate, 0) / workflows.length) : 0

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
            value={activeWorkflows.toString()}
            color="green"
          />
          <StatCard
            icon={FiClock}
            label="Pending Approvals"
            value={totalPending.toString()}
            color="yellow"
          />
          <StatCard
            icon={FiClock}
            label="Avg. Completion Time"
            value={`${avgCompletionTime}h`}
            color="blue"
          />
          <StatCard
            icon={FiPercent}
            label="Success Rate"
            value={`${successRate}%`}
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
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredWorkflows.map((workflow) => (
                    <WorkflowCard key={workflow.id} workflow={workflow} roles={roles} onWorkflowUpdate={fetchWorkflows} />
                  ))}
                </div>
              )}
            </>
          )}
          
          {activeTab === 'Templates' && <Templates workflows={workflows} />}
          
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

function WorkflowCard({ workflow, roles, onWorkflowUpdate }) {
  const navigate = useNavigate()
  const { token } = useAuth()
  const { showNotification } = useNotification()
  const [showMenu, setShowMenu] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const handleCardClick = () => {
    navigate(`/workflow-admin/${workflow.id}`)
  }
  
  const getRoleName = (roleId) => {
    if (!Array.isArray(roles) || !roleId) return 'Unknown Role'
    const role = roles.find(r => r.id === roleId)
    return role ? role.name : 'Unknown Role'
  }
  
  const handleEditWorkflow = () => {
    navigate(`/edit-workflow/${workflow.id}`)
    setShowMenu(false)
  }
  
  const handleDeleteWorkflow = async () => {
    setLoading(true)
    try {
      const response = await workflowAPI.deleteWorkflow(workflow.id, token)
      if (response.status) {
        showNotification('Workflow deleted successfully', 'success')
        onWorkflowUpdate()
      }
    } catch (error) {
      console.error('Error deleting workflow:', error)
      showNotification('Failed to delete workflow', 'error')
    } finally {
      setLoading(false)
      setShowDeleteModal(false)
      setShowMenu(false)
    }
  }
  
  const handleToggleStatus = async () => {
    setLoading(true)
    try {
      const response = await workflowAPI.toggleWorkflowStatus(workflow.id, token)
      if (response.status) {
        showNotification(`Workflow ${workflow.is_active ? 'deactivated' : 'activated'} successfully`, 'success')
        onWorkflowUpdate()
      }
    } catch (error) {
      console.error('Error toggling workflow status:', error)
      showNotification('Failed to update workflow status', 'error')
    } finally {
      setLoading(false)
      setShowStatusModal(false)
      setShowMenu(false)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer" onClick={handleCardClick}>
      {/* Card Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-base font-semibold text-gray-900">{workflow.name}</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded ${
              workflow.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {workflow.is_active ? 'active' : 'inactive'}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-3">{workflow.description}</p>
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">{workflow.category_name}</span>
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">{workflow.estimated_completion_time}h est.</span>
          </div>
        </div>
        <div className="relative">
          <button 
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu) }}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiMoreHorizontal className="w-4 h-4" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-2 w-40 z-10">
              <button 
                onClick={(e) => { e.stopPropagation(); handleEditWorkflow() }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <FiEdit className="w-4 h-4" />
                Edit Workflow
              </button>
              {/* <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <FiCopy className="w-4 h-4" />
                Clone Workflow
              </button> */}
              <button 
                onClick={(e) => { e.stopPropagation(); setShowStatusModal(true); setShowMenu(false) }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                {workflow.is_active ? <FiPause className="w-4 h-4" /> : <FiPlay className="w-4 h-4" />}
                {workflow.is_active ? 'Deactivate' : 'Activate'}
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowDeleteModal(true); setShowMenu(false) }}
                className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Workflow Steps (preview first 3, show +remaining) */}
      {/* <div className="mb-4"> 
        <h4 className="text-sm font-medium text-gray-900 mb-3">Workflow Steps ({workflow.steps.length})</h4>
        <div className="space-y-2">
          {workflow.steps.slice(0, 3).map((step) => (
            <div key={step.id} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded text-sm">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium">{step.order}</span>
                <span className="text-gray-900">{step.name}</span>
                <span className={`px-1 py-0.5 text-xs rounded ${
                  step.type === 'Approval' ? 'bg-green-100 text-green-700' :
                  step.type === 'Review' ? 'bg-blue-100 text-blue-700' :
                  step.type === 'Notification' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-purple-100 text-purple-700'
                }`}>
                  {step.type}
                </span>
                {step.required_role && (
                  <span className="px-1 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                    {getRoleName(step.required_role)}
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-500">{step.time_limit}h</span>
            </div>
          ))}
          {workflow.steps.length > 3 && (
            <div className="text-xs text-gray-500">+{workflow.steps.length - 3} more steps</div>
          )}
        </div>
      </div> */}

      {/* Key Features */}
      {/* {workflow.key_features && workflow.key_features.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Key Features</h4>
          <div className="flex flex-wrap gap-2">
            {workflow.key_features.map((feature, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                {feature}
              </span>
            ))}
          </div>
        </div>
      )} */}

      {/* Metrics */}
      {/* <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-xl font-bold text-gray-900 mb-1">{workflow.total_active_memos}</div>
          <div className="text-xs text-gray-600 mb-2">Active</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-green-600 mb-1">{workflow.total_completed_memos}</div>
          <div className="text-xs text-gray-600 mb-2">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-purple-600 mb-1">{workflow.success_rate}%</div>
          <div className="text-xs text-gray-600 mb-2">Success</div>
        </div>
      </div> */}
      
      {/* Progress Bar */}
      {/* <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gray-900 h-2 rounded-full" 
            style={{ width: `${workflow.success_rate}%` }}
          ></div>
        </div>
        <div className="flex justify-end mt-1">
          <span className="text-xs text-gray-500">{workflow.average_completion_time}h avg</span>
        </div>
      </div> */}
      
      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteWorkflow}
        title="Delete Workflow"
        message={`Are you sure you want to delete "${workflow.name}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmColor="red"
        loading={loading}
      />
      
      <ConfirmationModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        onConfirm={handleToggleStatus}
        title={`${workflow.is_active ? 'Deactivate' : 'Activate'} Workflow`}
        message={`Are you sure you want to ${workflow.is_active ? 'deactivate' : 'activate'} "${workflow.name}"?`}
        confirmText={workflow.is_active ? 'Deactivate' : 'Activate'}
        confirmColor={workflow.is_active ? 'yellow' : 'red'}
        loading={loading}
      />
    </div>
  )
}

export default Workflows