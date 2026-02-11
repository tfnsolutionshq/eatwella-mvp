import React, { useState } from 'react'
import { FiX } from 'react-icons/fi'

const CreateDiscountModal = ({ isOpen, onClose, initialData = null, isEditing = false }) => {
  if (!isOpen) return null

  const [formData, setFormData] = useState(initialData || {
    code: '',
    type: 'percentage',
    value: '',
    description: '',
    startDate: '',
    endDate: '',
    minOrder: '',
    usageLimit: '',
    isStaffOnly: false
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{isEditing ? 'Edit Discount' : 'Create New Discount'}</h2>
            <p className="text-sm text-gray-500 mt-1">{isEditing ? 'Update discount details' : 'Set up a new discount code'}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 hover:bg-gray-100 p-2 rounded-lg transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Code *
              </label>
              <input
                type="text"
                placeholder="e.g., WELCOME10"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all uppercase"
                defaultValue={formData.code}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Type *
              </label>
              <select className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all bg-white" defaultValue={formData.type}>
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount ($)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discount Value *
            </label>
            <input
              type="number"
              placeholder="e.g., 10"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all"
              defaultValue={formData.value}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <input
              type="text"
              placeholder="Brief description of the discount"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all"
              defaultValue={formData.description}
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all"
                defaultValue={formData.startDate}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date *
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all"
                defaultValue={formData.endDate}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Order Value ($)
              </label>
              <input
                type="number"
                placeholder="Optional"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all"
                defaultValue={formData.minOrder}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usage Limit
              </label>
              <input
                type="number"
                placeholder="Optional"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all"
                defaultValue={formData.usageLimit}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="staffOnly"
              className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
              defaultChecked={formData.isStaffOnly}
            />
            <label htmlFor="staffOnly" className="text-sm font-medium text-gray-700">
              Staff Only Discount (Requires staff approval to apply)
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/50">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-white hover:text-gray-900 border border-transparent hover:border-gray-200 transition-all"
          >
            Cancel
          </button>
          <button
            className="px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 shadow-sm shadow-orange-200 transition-all"
          >
            {isEditing ? 'Update Discount' : 'Create Discount'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateDiscountModal
