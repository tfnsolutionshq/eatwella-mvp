import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FiClock } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { useNotification } from '../../context/NotificationContext'
import { workflowAPI, roleAPI } from '../../services/api'

function WorkflowDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()
  const { showNotification } = useNotification()

  const [workflow, setWorkflow] = useState(null)
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(false)

  const getRoleName = (roleId) => {
    if (!Array.isArray(roles) || !roleId) return 'Unknown Role'
    const role = roles.find(r => r.id === roleId)
    return role ? role.name : 'Unknown Role'
  }

  const fetchData = async () => {
    if (!token) return
    setLoading(true)
    try {
      const [workflowRes, rolesRes] = await Promise.all([
        workflowAPI.getWorkflow(id, token),
        roleAPI.getRoles(token)
      ])

      if (workflowRes.status && workflowRes.data) {
        setWorkflow(workflowRes.data)
      }
      if (rolesRes.status && rolesRes.data) {
        setRoles(rolesRes.data.data)
      }
    } catch (error) {
      console.error('Error fetching workflow details:', error)
      showNotification('Failed to load workflow details', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [id, token])

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  if (!workflow) {
    return (
      <div className="p-4">
        <button
          onClick={() => navigate(-1)}
          className="px-3 py-2 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50"
        >
          Back
        </button>
        <div className="mt-4 text-gray-600">Workflow not found.</div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Side - Header, Key Features, Metrics */}
        <div className="flex-1 lg:flex-1">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{workflow.name}</h1>
            <p className="text-gray-600 text-sm mt-1">{workflow.description}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">{workflow.category_name}</span>
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded flex items-center gap-1">
                <FiClock className="w-3 h-3" />
                {workflow.total_estimated_time}h est.
              </span>
              <span className={`px-2 py-1 text-xs font-medium rounded ${workflow.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {workflow.is_active ? 'active' : 'inactive'}
              </span>
            </div>
          </div>

          {/* Key Features */}
          {workflow.key_features && workflow.key_features.length > 0 && (
            <div className="mb-6">
              <h2 className="text-base font-semibold text-gray-900 mb-3">Key Features</h2>
              <div className="flex flex-wrap gap-2">
                {workflow.key_features.map((feature, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Metrics */}
          {/* <div className="grid grid-cols-3 gap-4 border border-gray-300 rounded p-4">
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900 mb-1">{workflow.total_active_memos}</div>
              <div className="text-xs text-gray-600">Active</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-600 mb-1">{workflow.total_completed_memos}</div>
              <div className="text-xs text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-purple-600 mb-1">{workflow.success_rate}%</div>
              <div className="text-xs text-gray-600">Success</div>
            </div>
          </div> */}
        </div>

        {/* Right Side - Steps */}
        <div className="flex-1 lg:flex-1">
          <h2 className="text-base font-semibold text-gray-900 mb-3">All Steps ({workflow.steps.length})</h2>
          <div className="space-y-4">
            {workflow.steps.map((step) => (
              <div key={step.id} className="px-3 py-2 bg-gray-50 rounded text-sm">
                <div className="flex items-center justify-between">
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
                {step.description && (
                  <div className="mt-1 text-xs text-gray-600">{step.description}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default WorkflowDetails