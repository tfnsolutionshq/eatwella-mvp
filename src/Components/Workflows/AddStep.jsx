import React, { useState } from 'react'
import { FiX, FiCheck, FiEye, FiBell, FiGitBranch, FiPlus } from 'react-icons/fi'

function AddStep({ isOpen, onClose, onAddStep }) {
  const [selectedType, setSelectedType] = useState('')
  const [stepName, setStepName] = useState('')
  const [description, setDescription] = useState('')
  const [assignedRole, setAssignedRole] = useState('')
  const [timeLimit, setTimeLimit] = useState('')

  const stepTypes = [
    {
      id: 'approval',
      name: 'Approval',
      description: 'Requires approval from assigned role',
      icon: FiCheck,
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 'review',
      name: 'Review',
      description: 'Review and comment, no approval required',
      icon: FiEye,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'notification',
      name: 'Notification',
      description: 'Send notification to specified roles',
      icon: FiBell,
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      id: 'condition',
      name: 'Condition',
      description: 'Conditional branching based on criteria',
      icon: FiGitBranch,
      color: 'bg-purple-100 text-purple-600'
    }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (selectedType && stepName) {
      const stepType = stepTypes.find(type => type.id === selectedType)
      onAddStep({
        id: Date.now(),
        type: selectedType,
        name: stepName,
        description,
        assignedRole,
        timeLimit,
        icon: stepType.icon,
        color: stepType.color
      })
      setSelectedType('')
      setStepName('')
      setDescription('')
      setAssignedRole('')
      setTimeLimit('')
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Add New Step</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Step Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Step Type</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {stepTypes.map((type) => {
                const Icon = type.icon
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setSelectedType(type.id)}
                    className={`flex items-start gap-2 p-3 border rounded-lg text-left transition-colors ${
                      selectedType === type.id
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`p-1 rounded ${type.color}`}>
                      <Icon className="w-3 h-3" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{type.name}</h4>
                      <p className="text-xs text-gray-600 mt-1">{type.description}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Step Details */}
          {selectedType && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Step Name</label>
                <input
                  type="text"
                  value={stepName}
                  onChange={(e) => setStepName(e.target.value)}
                  placeholder="Enter step name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what this step does"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">Assigned Role</label>
                  <select
                    value={assignedRole}
                    onChange={(e) => setAssignedRole(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                  >
                    <option value="">Select role</option>
                    <option value="department-head">Department Head</option>
                    <option value="finance-director">Finance Director</option>
                    <option value="dean">Dean</option>
                    <option value="hr-manager">HR Manager</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">Time Limit (hours)</label>
                  <input
                    type="number"
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(e.target.value)}
                    placeholder="48"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                  />
                </div>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedType || !stepName}
              className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Add Step
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddStep