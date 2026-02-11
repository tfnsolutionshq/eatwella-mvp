import React from 'react'
import { FiX, FiUploadCloud } from 'react-icons/fi'

const AddMenuItemModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 my-8">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Add New Menu Item</h2>
            <p className="text-sm text-gray-500 mt-1">Add a new item to your menu</p>
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
          {/* Item Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Item Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Grilled Salmon"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              rows="3"
              placeholder="Describe your dish..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all resize-none"
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-5">
            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price * ($)
              </label>
              <input
                type="number"
                placeholder="0.00"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select defaultValue="" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all bg-white">
                <option value="" disabled>Select category</option>
                <option value="mains">Mains</option>
                <option value="salads">Salads</option>
                <option value="pasta">Pasta</option>
                <option value="desserts">Desserts</option>
              </select>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image Upload
            </label>
            <div className="relative">
                <input
                    type="text"
                    placeholder="https://..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all"
                />
            </div>
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
            Add Item
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddMenuItemModal
