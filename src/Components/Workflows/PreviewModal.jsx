import React from 'react'
import { FiX } from 'react-icons/fi'

function PreviewModal({ isOpen, onClose, template }) {
  if (!isOpen || !template) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Content */}
        <div className="p-4 space-y-4 relative">
          <div className='font-semibold'>{template.name || template.title}</div>
          <button 
            onClick={onClose}
            className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded"
          >
            <FiX className="w-4 h-4" />
          </button>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
              {template?.category_name || template?.category}
            </span>
            {template?.level && (
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                {template.level.toLowerCase()}
              </span>
            )}
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded flex items-center gap-1">
              <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {template?.estimated_completion_time || template?.duration}h
            </span>
            <span className={`px-2 py-1 text-xs rounded ${
              template?.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
            }`}>
              {template?.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>

          {/* Complete Workflow Steps */}
          <div>
            <h5 className="text-xs font-semibold text-gray-900 mb-2">Complete Workflow Steps</h5>
            <div className="space-y-2">
              {template?.steps?.map((step, index) => (
                <div key={step.id || index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <span className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-xs font-semibold">
                    {step.order || index + 1}
                  </span>
                  <span className="text-xs text-gray-900">{step.name || step}</span>
                  {step.type && (
                    <span className={`px-1 py-0.5 text-xs rounded ${
                      step.type === 'Approval' ? 'bg-green-100 text-green-700' :
                      step.type === 'Review' ? 'bg-blue-100 text-blue-700' :
                      step.type === 'Notification' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {step.type}
                    </span>
                  )}
                </div>
              )) || []}
            </div>
          </div>

          {/* Features & Capabilities */}
          <div>
            <h5 className="text-xs font-semibold text-gray-900 mb-2">Features & Capabilities</h5>
            <div className="grid grid-cols-2 gap-2">
              {(template?.key_features || template?.features || []).map((feature, index) => (
                <div key={index} className="flex items-center gap-1 text-xs text-gray-700">
                  <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Workflow Description */}
          {template?.description && (
            <div>
              <h5 className="text-xs font-semibold text-gray-900 mb-2">Description</h5>
              <p className="text-xs text-gray-700">{template.description}</p>
            </div>
          )}

          {/* Metrics */}
          {(template?.total_active_memos !== undefined || template?.total_completed_memos !== undefined) && (
            <div>
              <h5 className="text-xs font-semibold text-gray-900 mb-2">Workflow Metrics</h5>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-sm font-bold text-gray-900">{template.total_active_memos || 0}</div>
                  <div className="text-xs text-gray-600">Active</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-sm font-bold text-green-600">{template.total_completed_memos || 0}</div>
                  <div className="text-xs text-gray-600">Completed</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-sm font-bold text-purple-600">{template.success_rate || 0}%</div>
                  <div className="text-xs text-gray-600">Success</div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t">
          <button 
            onClick={onClose}
            className="px-3 py-2 text-xs text-gray-600 hover:text-gray-800"
          >
            Close
          </button>
          <button className="px-3 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 text-xs">
            Use This Template
          </button>
        </div>
      </div>
    </div>
  )
}

export default PreviewModal