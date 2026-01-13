import React, { useState, useEffect } from 'react'
import { FiSearch, FiCopy, FiDollarSign, FiFileText, FiUsers, FiShield, FiClock } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { useNotification } from '../../context/NotificationContext'
import { workflowAPI, roleAPI } from '../../services/api'
import { useNavigate } from 'react-router-dom'

function OtherUsersScreen() {
  const navigate = useNavigate()
  const { token } = useAuth()
  const { showNotification } = useNotification()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [workflows, setWorkflows] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchWorkflows = async () => {
    if (!token) {
      return
    }
    
    setLoading(true)
    try {
      const workflowResponse = await workflowAPI.getActiveWorkflows(token)
      
      if (workflowResponse.status && workflowResponse.data) {
        setWorkflows(workflowResponse.data)
      }
      
      // Only fetch roles if workflows are successfully loaded
      try {
        const roleResponse = await roleAPI.getRoles(token)
        if (roleResponse.status && roleResponse.data) {
          setRoles(roleResponse.data.data)
        }
      } catch (roleError) {
        console.warn('Could not fetch roles:', roleError)
        // Continue without roles - workflow display will work without role names
      }
    } catch (error) {
      console.error('Error fetching workflows:', error)
      if (error.response?.status === 401) {
        showNotification('Session expired. Please login again.', 'error')
      } else {
        showNotification('Failed to fetch workflows', 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      fetchWorkflows()
    }
  }, [token])

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All Categories' || workflow.category_name === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className='p-4 sm:p-4 lg:p-5 w-full mx-auto'>
      {/* Header */}
      <div className="mb-6">
        <div className="mb-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">Available Workflows</h2>
          <p className="text-gray-600 text-sm mt-1">View available workflow templates</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search templates..."
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
            <ViewOnlyWorkflowCard 
              key={workflow.id} 
              workflow={workflow}
              roles={roles}
              onUseTemplate={() => navigate(`/create-workflow?template=${workflow.id}`)}
            />
          ))}
        </div>
      )}

    </div>
  )
}

function ViewOnlyWorkflowCard({ workflow, roles, onUseTemplate }) {
  const navigate = useNavigate()
  const getRoleName = (roleId) => {
    if (!Array.isArray(roles) || !roleId) return 'Unknown Role'
    const role = roles.find(r => r.id === roleId)
    return role ? role.name : 'Unknown Role'
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer" onClick={() => navigate(`/workflow/${workflow.id}`)}>
      {/* Header */}
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
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded flex items-center gap-1">
              <FiClock className="w-3 h-3" />
              {workflow.estimated_completion_time}h est.
            </span>
          </div>
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
      {/* <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900 mb-1">{workflow.total_active_memos}</div>
          <div className="text-xs text-gray-600">Active</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-green-600 mb-1">{workflow.total_completed_memos}</div>
          <div className="text-xs text-gray-600">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-purple-600 mb-1">{workflow.success_rate}%</div>
          <div className="text-xs text-gray-600">Success</div>
        </div>
      </div> */}

      {/* Actions - Use Template */}
      {/* <div className="flex gap-2">
        <button 
          onClick={(e) => { e.stopPropagation(); onUseTemplate() }}
          className="flex items-center gap-2 bg-gray-900 text-white px-3 py-2 rounded text-sm hover:bg-gray-800 transition-colors"
        >
          <FiCopy className="w-4 h-4" />
          Use Template
        </button>
      </div> */}
    </div>
  )
}

export default OtherUsersScreen