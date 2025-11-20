import React from 'react'
import { FiX } from 'react-icons/fi'

function PreviewModal({ isOpen, onClose, template }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Content */}
        <div className="p-4 space-y-4 relative">
          <div className='font-semibold'>Budget Approval Workflow</div>
          <button 
            onClick={onClose}
            className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded"
          >
            <FiX className="w-4 h-4" />
          </button>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
              {template?.category?.toLowerCase()}
            </span>
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
              {template?.level?.toLowerCase()}
            </span>
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded flex items-center gap-1">
              <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {template?.duration}
            </span>
            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded flex items-center gap-1">
              <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {template?.usage} popularity
            </span>
          </div>

          {/* Complete Workflow Steps */}
          <div>
            <h5 className="text-xs font-semibold text-gray-900 mb-2">Complete Workflow Steps</h5>
            <div className="space-y-2">
              {template?.steps?.filter(step => !step.includes('+')).map((step, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <span className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-xs font-semibold">
                    {index + 1}
                  </span>
                  <span className="text-xs text-gray-900">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Features & Capabilities */}
          <div>
            <h5 className="text-xs font-semibold text-gray-900 mb-2">Features & Capabilities</h5>
            <div className="grid grid-cols-2 gap-2">
              {template?.features?.filter(feature => !feature.includes('+')).map((feature, index) => (
                <div key={index} className="flex items-center gap-1 text-xs text-gray-700">
                  <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Common Use Cases */}
          <div>
            <h5 className="text-xs font-semibold text-gray-900 mb-2">Common Use Cases</h5>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-gray-700">
                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                Department budget requests
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-700">
                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                Capital expenditure approvals
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-700">
                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                Project funding requests
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-700">
                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                Emergency spending approvals
              </div>
            </div>
          </div>
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