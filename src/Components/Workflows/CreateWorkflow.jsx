import React, { useState, useEffect } from 'react'
import { FiArrowLeft, FiPlay, FiSave, FiPlus, FiCheck, FiEye, FiClock, FiBell, FiGitBranch, FiEdit, FiTrash2 } from 'react-icons/fi'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useNotification } from '../../context/NotificationContext'
import { categoryAPI, roleAPI, workflowAPI } from '../../services/api'
import AddStep from './AddStep'
import EditStep from './EditStep'

function CreateWorkflow() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { token } = useAuth()
  const { showNotification } = useNotification()
  const isEditing = !!id
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [workflowName, setWorkflowName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [keyFeatures, setKeyFeatures] = useState([''])
  const [categories, setCategories] = useState([])
  const [showAddStep, setShowAddStep] = useState(false)
  const [showEditStep, setShowEditStep] = useState(false)
  const [editingStep, setEditingStep] = useState(null)
  const [workflowSteps, setWorkflowSteps] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(false)

  const getRoleName = (roleId) => {
    if (!Array.isArray(roles) || !roleId) return 'Unknown Role'
    const role = roles.find(r => r.id === roleId)
    return role ? role.name : 'Unknown Role'
  }

  const stepTypes = [
    {
      id: 'approval',
      name: 'Approval',
      description: 'Requires approval from assigned role',
      icon: FiCheck
    },
    {
      id: 'review',
      name: 'Review',
      description: 'Review and comment, no approval required',
      icon: FiEye
    },
    {
      id: 'notification',
      name: 'Notification',
      description: 'Send notification to specified roles',
      icon: FiBell
    },
    {
      id: 'condition',
      name: 'Condition',
      description: 'Conditional branching based on criteria',
      icon: FiGitBranch
    }
  ]

  const handleAddStep = (step) => {
    setWorkflowSteps([...workflowSteps, step])
  }

  const handleEditStep = (step) => {
    setEditingStep(step)
    setShowEditStep(true)
  }

  const handleUpdateStep = (updatedStep) => {
    setWorkflowSteps(workflowSteps.map(step => 
      step.id === updatedStep.id ? updatedStep : step
    ))
  }

  const handleDeleteStep = (stepId) => {
    setWorkflowSteps(workflowSteps.filter(step => step.id !== stepId))
  }

  const fetchData = async () => {
    try {
      const promises = [
        categoryAPI.getCategories(token),
        roleAPI.getRoles(token)
      ]
      
      if (isEditing) {
        promises.push(workflowAPI.getWorkflow(id, token))
      }
      
      const responses = await Promise.all(promises)
      const [categoryResponse, roleResponse, workflowResponse] = responses
      
      if (categoryResponse.status && categoryResponse.data) {
        setCategories(categoryResponse.data.data)
      }
      
      if (roleResponse.status && roleResponse.data) {
        setRoles(roleResponse.data.data)
      }
      
      if (isEditing && workflowResponse?.status && workflowResponse.data) {
        const workflow = workflowResponse.data
        setWorkflowName(workflow.name)
        setDescription(workflow.description)
        setCategory(workflow.category_id.toString())
        setKeyFeatures(workflow.key_features || [''])
        
        const steps = workflow.steps.map((step, index) => ({
          id: step.id || `step-${index}`,
          name: step.name,
          assignedRole: step.required_role,
          timeLimit: step.time_limit.toString(),
          description: step.description,
          type: step.type.toLowerCase()
        }))
        setWorkflowSteps(steps)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      showNotification('Failed to fetch data', 'error')
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const addFeature = () => {
    setKeyFeatures([...keyFeatures, ''])
  }

  const updateFeature = (index, value) => {
    const updated = [...keyFeatures]
    updated[index] = value
    setKeyFeatures(updated)
  }

  const removeFeature = (index) => {
    setKeyFeatures(keyFeatures.filter((_, i) => i !== index))
  }

  const handleSaveWorkflow = async () => {
    if (!workflowName || !description || !category || workflowSteps.length === 0) {
      showNotification('Please fill all required fields and add at least one step', 'error')
      return
    }

    setLoading(true)
    try {
      const workflowData = {
        name: workflowName,
        description,
        key_features: keyFeatures.filter(f => f.trim()),
        category_id: parseInt(category),
        is_active: true,
        steps: workflowSteps.map((step, index) => ({
          name: step.name,
          required_role: step.assignedRole,
          order: index + 1,
          time_limit: parseInt(step.timeLimit) || 48,
          description: step.description || '',
          type: step.type.charAt(0).toUpperCase() + step.type.slice(1),
          is_final: index === workflowSteps.length - 1
        }))
      }

      const response = isEditing 
        ? await workflowAPI.updateWorkflow(id, workflowData, token)
        : await workflowAPI.createWorkflow(workflowData, token)
        
      if (response.status) {
        showNotification(`Workflow ${isEditing ? 'updated' : 'created'} successfully`, 'success')
        navigate('/workflows')
      }
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} workflow:`, error)
      showNotification(`Failed to ${isEditing ? 'update' : 'create'} workflow`, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-2 sm:px-3 py-2 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <button 
              className="p-1.5 text-gray-600 hover:text-gray-900 flex-shrink-0"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button 
              onClick={() => navigate('/workflows')}
              className="hidden sm:flex items-center gap-1.5 text-gray-600 hover:text-gray-900 text-xs flex-shrink-0"
            >
              <FiArrowLeft className="w-3 h-3" />
              <span className="hidden md:inline">Back to Workflows</span>
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{isEditing ? 'Edit Workflow' : 'Create New Workflow'}</h1>
              <p className="hidden sm:block text-xs text-gray-600 truncate">Design your approval workflow with drag-and-drop steps</p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <button className="hidden sm:flex items-center gap-1.5 px-2 py-1.5 text-gray-700 border border-gray-300 rounded hover:bg-gray-50 text-xs">
              <FiPlay className="w-3 h-3" />
              <span className="hidden md:inline">Test</span>
            </button>
            <button 
              onClick={handleSaveWorkflow}
              disabled={loading}
              className="flex items-center gap-1 sm:gap-1.5 px-2 py-1.5 bg-gray-900 text-white rounded hover:bg-gray-800 text-xs disabled:opacity-50"
            >
              <FiSave className="w-3 h-3" />
              <span className="hidden sm:inline">{loading ? 'Saving...' : (isEditing ? 'Update' : 'Save')}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-80' : 'w-0'} lg:${sidebarOpen ? 'w-80' : 'w-0'} bg-gray-50 border-r border-gray-200 transition-all duration-300 ease-in-out overflow-hidden lg:relative fixed lg:static inset-y-0 left-0 z-50`}>
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="p-3 border-b border-gray-200">
            <h3 className="text-base font-semibold text-gray-900">Workflow Properties</h3>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {/* Workflow Name */}
            <div>
              <label className="block text-xs font-medium text-gray-900 mb-1">Workflow Name</label>
              <input
                type="text"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                placeholder="Enter workflow name"
                className="w-full px-2 py-1.5 bg-gray-100 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-medium text-gray-900 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the workflow purpose"
                rows={2}
                className="w-full px-2 py-1.5 bg-gray-100 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-medium text-gray-900 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-2 py-1.5 bg-gray-100 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-gray-900 focus:border-transparent"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Key Features */}
            <div>
              <label className="block text-xs font-medium text-gray-900 mb-1">Key Features</label>
              <div className="space-y-2">
                {keyFeatures.map((feature, index) => (
                  <div key={index} className="flex gap-1">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      placeholder="Enter feature"
                      className="flex-1 px-2 py-1.5 bg-gray-100 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-gray-900 focus:border-transparent"
                    />
                    {keyFeatures.length > 1 && (
                      <button
                        onClick={() => removeFeature(index)}
                        className="px-2 py-1.5 text-red-600 hover:bg-red-50 rounded text-xs"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addFeature}
                  className="w-full px-2 py-1.5 border border-dashed border-gray-300 rounded text-xs text-gray-600 hover:bg-gray-50"
                >
                  + Add Feature
                </button>
              </div>
            </div>

            {/* Step Types */}
            <div>
              <h4 className="text-xs font-medium text-gray-900 mb-2">Step Types</h4>
              <div className="space-y-2">
                {stepTypes.map((step) => {
                  const Icon = step.icon
                  return (
                    <div key={step.id} className="flex items-start gap-2 p-2 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">
                      <div className="p-1 bg-gray-100 rounded">
                        <Icon className="w-3 h-3 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <h5 className="text-xs font-medium text-gray-900">{step.name}</h5>
                        <p className="text-xs text-gray-600 mt-0.5">{step.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Key Features Preview */}
            {keyFeatures.some(f => f.trim()) && (
              <div>
                <h4 className="text-xs font-medium text-gray-900 mb-2">Key Features</h4>
                <div className="flex flex-wrap gap-1">
                  {keyFeatures.filter(f => f.trim()).slice(0, 3).map((feature, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {feature}
                    </span>
                  ))}
                  {keyFeatures.filter(f => f.trim()).length > 3 && (
                    <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded">
                      +{keyFeatures.filter(f => f.trim()).length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Workflow Stats */}
            <div>
              <h4 className="text-xs font-medium text-gray-900 mb-2">Workflow Stats</h4>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Total Steps</span>
                  <span className="font-medium">{workflowSteps.length}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Est. Duration</span>
                  <span className="font-medium">{workflowSteps.reduce((sum, step) => sum + (parseInt(step.timeLimit) || 48), 0)}h</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Approval Steps</span>
                  <span className="font-medium">{workflowSteps.filter(step => step.type === 'approval').length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Canvas Area */}
          <div className="flex-1 p-4">
            <div className="bg-white rounded-lg border border-gray-200 h-full">
              <div className="flex bg-gray-50 items-center justify-between p-3 border-b border-gray-200">
                <h2 className="text-sm font-medium text-gray-900">Workflow Canvas</h2>
                <button 
                  onClick={() => setShowAddStep(true)}
                  className="flex items-center gap-1.5 px-2 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-xs"
                >
                  <FiPlus className="w-3 h-3" />
                  Add Step
                </button>
              </div>
              
              {/* Canvas Content */}
              <div className="flex-1 p-4">
                {workflowSteps.length === 0 ? (
                  /* Empty State */
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <FiPlus className="w-6 h-6 text-gray-400" />
                      </div>
                      <h3 className="text-base font-medium text-gray-900 mb-2">No workflow steps yet</h3>
                      <p className="text-sm text-gray-600 mb-3">Add your first step to start building your workflow</p>
                      <button 
                        onClick={() => setShowAddStep(true)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 mx-auto text-xs"
                      >
                        <FiPlus className="w-3 h-3" />
                        Add First Step
                      </button>
                    </div>
                  </div> 
                ) : (
                  /* Workflow Steps */
                  <div className="w-full sm:w-[30%] space-y-4">
                    {/* Start Node */}
                    <div className="flex items-center gap-4">
                      <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                        START
                      </div>
                      <div className="flex-1 h-px bg-gray-300"></div>
                      <FiArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
                    </div>

                    {/* Workflow Steps */}
                    {workflowSteps.map((step, index) => {
                      const Icon = step.icon
                      return (
                        <div key={step.id} className="space-y-4">
                          <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                                  {index + 1}
                                </div>
                                <div className="flex-1">
                                  <h4 className="text-sm font-medium text-gray-900">{step.name}</h4>
                                  <p className="text-xs text-gray-600 mt-1">{getRoleName(step.assignedRole) || 'Department Head'}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <button 
                                  onClick={() => handleEditStep(step)}
                                  className="p-1 text-gray-400 hover:text-gray-600"
                                >
                                  <FiEdit className="w-3 h-3" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteStep(step.id)}
                                  className="p-1 text-gray-400 hover:text-red-600"
                                >
                                  <FiTrash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>Type: {step.type}</span>
                              <span>Time Limit: {step.timeLimit || '48'}h</span>
                            </div>
                          </div>
                          
                          {/* Arrow to next step */}
                          {index < workflowSteps.length - 1 && (
                            <div className="flex justify-center">
                              <FiArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
                            </div>
                          )}
                        </div>
                      )
                    })}

                    {/* End Node */}
                    <div className="flex items-center gap-4">
                      <FiArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
                      <div className="flex-1 h-px bg-gray-300"></div>
                      <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium">
                        END
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddStep 
        isOpen={showAddStep}
        onClose={() => setShowAddStep(false)}
        onAddStep={handleAddStep}
      />
      
      <EditStep 
        isOpen={showEditStep}
        onClose={() => setShowEditStep(false)}
        step={editingStep}
        onUpdateStep={handleUpdateStep}
      />
    </div>
  )
}

export default CreateWorkflow