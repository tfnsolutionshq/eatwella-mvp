import React, { useState, useEffect } from 'react'
import { FiX } from 'react-icons/fi'

function EditStep({ isOpen, onClose, step, onUpdateStep }) {
  const [stepName, setStepName] = useState('')
  const [description, setDescription] = useState('')
  const [assignedRole, setAssignedRole] = useState('')
  const [timeLimit, setTimeLimit] = useState('')
  const [stepType, setStepType] = useState('')

  useEffect(() => {
    if (step) {
      setStepName(step.name || '')
      setDescription(step.description || '')
      setAssignedRole(step.assignedRole || '')
      setTimeLimit(step.timeLimit || '')
      setStepType(step.type || '')
    }
  }, [step])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (stepName && step) {
      onUpdateStep({
        ...step,
        name: stepName,
        description,
        assignedRole,
        timeLimit
      })
      onClose()
    }
  }

  if (!isOpen || !step) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Edit Step</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <p className="text-sm text-gray-600">Configure the step properties and approval requirements</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Step Name</label>
              <input
                type="text"
                value={stepName}
                onChange={(e) => setStepName(e.target.value)}
                placeholder="New Step"
                className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Step Type</label>
              <select
                value={stepType}
                onChange={(e) => setStepType(e.target.value)}
                className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                disabled
              >
                <option value="approval">Approval</option>
                <option value="review">Review</option>
                <option value="notification">Notification</option>
                <option value="condition">Condition</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this step does"
              rows={3}
              className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Assigned Role</label>
              <select
                value={assignedRole}
                onChange={(e) => setAssignedRole(e.target.value)}
                className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
              >
                <option value="">Select role</option>
                <option value="department-head">Department Head</option>
                <option value="finance-director">Finance Director</option>
                <option value="dean">Dean</option>
                <option value="hr-manager">HR Manager</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Various</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Time Limit (hours)</label>
              <input
                type="number"
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
                placeholder="48"
                className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
              />
            </div>
          </div>

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
              className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 text-sm"
            >
              Save Step
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditStep