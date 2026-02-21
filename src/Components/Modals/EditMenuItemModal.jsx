import React, { useState, useEffect } from 'react'
import { FiX } from 'react-icons/fi'
import api from '../../utils/api'

const EditMenuItemModal = ({ isOpen, onClose, item, categories, onSuccess }) => {
  const [formData, setFormData] = useState({ category_id: '', name: '', description: '', price: '', is_available: 1 })
  const [image, setImage] = useState(null)
  const [currentImage, setCurrentImage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (item) {
      setFormData({
        category_id: item.category_id || '',
        name: item.name || '',
        description: item.description || '',
        price: item.price || '',
        is_available: item.is_available ?? 1
      })
      setCurrentImage(item.images?.[0] || '')
      setImage(null)
    }
  }, [item])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = new FormData()
      data.append('category_id', formData.category_id)
      data.append('name', formData.name)
      data.append('description', formData.description)
      data.append('price', formData.price)
      data.append('is_available', formData.is_available)
      if (image) data.append('images[]', image)

      await api.put(`/admin/menus/${item.id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } })
      onSuccess?.()
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update menu item')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col max-h-[90vh]">
          <div className="p-6 border-b border-gray-100 flex items-start justify-between flex-shrink-0">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Edit Menu Item</h2>
              <p className="text-sm text-gray-500 mt-1">Update item details</p>
            </div>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-500 hover:bg-gray-100 p-2 rounded-lg transition-colors">
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-5 overflow-y-auto flex-1">
            {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">{error}</div>}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Item Name <span className="text-red-500">*</span></label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea rows="3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all resize-none"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
              {currentImage && <img src={currentImage} alt="Current" className="mb-2 w-full h-32 object-cover rounded-lg" />}
              <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all" />
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price * ($)</label>
                <input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select value={formData.category_id} onChange={(e) => setFormData({...formData, category_id: e.target.value})} required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all bg-white">
                  <option value="">Select category</option>
                  {categories?.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/50 flex-shrink-0">
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-white hover:text-gray-900 border border-transparent hover:border-gray-200 transition-all">Cancel</button>
            <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 shadow-sm shadow-orange-200 transition-all disabled:opacity-50">{loading ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditMenuItemModal
