import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { FiX, FiAlertTriangle } from 'react-icons/fi'

function EditCategory({ category, onClose }) {
  const [formData, setFormData] = useState({
    categoryLabel: category?.name || '',
    internalValue: category?.value || '',
    description: category?.description || '',
    colorTheme: category?.color || 'Green',
    status: category?.status || 'Active'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Updating category:', formData)
    onClose()
  }

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg p-4 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Edit Category</h2>
            <p className="text-xs text-gray-600">Update category details and settings</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Category Label <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.categoryLabel}
                onChange={(e) => setFormData({...formData, categoryLabel: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Internal Value <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.internalValue}
                onChange={(e) => setFormData({...formData, internalValue: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              rows="3"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Color Theme</label>
              <select
                value={formData.colorTheme}
                onChange={(e) => setFormData({...formData, colorTheme: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              >
                <option value="Blue">Blue</option>
                <option value="Green">Green</option>
                <option value="Purple">Purple</option>
                <option value="Orange">Orange</option>
                <option value="Red">Red</option>
                <option value="Yellow">Yellow</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Usage Warning */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <FiAlertTriangle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-blue-900">This category is currently in use</p>
                <p className="text-xs text-blue-700">234 memos are using this category. Changes will affect existing memos.</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 text-xs text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 text-xs text-white bg-black rounded-lg hover:bg-gray-800"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}

export default EditCategory