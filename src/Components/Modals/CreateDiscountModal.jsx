import React, { useState, useEffect } from 'react'
import { FiX } from 'react-icons/fi'
import api from '../../utils/api'

const CreateDiscountModal = ({ isOpen, onClose, discount = null, onSuccess }) => {
  const [formData, setFormData] = useState({ name: '', type: 'percentage', value: '', start_date: '', end_date: '', is_indefinite: false, is_active: true })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (discount) {
      setFormData({
        name: discount.name,
        type: discount.type,
        value: discount.value,
        start_date: discount.start_date?.split('T')[0] || '',
        end_date: discount.end_date?.split('T')[0] || '',
        is_indefinite: discount.is_indefinite,
        is_active: discount.is_active
      })
    }
  }, [discount])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const payload = { ...formData, value: parseFloat(formData.value) }
      if (formData.is_indefinite) delete payload.end_date
      
      if (discount) {
        await api.put(`/admin/discounts/${discount.id}`, payload)
      } else {
        await api.post('/admin/discounts', payload)
      }
      setFormData({ name: '', type: 'percentage', value: '', start_date: '', end_date: '', is_indefinite: false, is_active: true })
      onSuccess?.()
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save discount')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b border-gray-100 flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{discount ? 'Edit Discount' : 'Create New Discount'}</h2>
              <p className="text-sm text-gray-500 mt-1">{discount ? 'Update discount details' : 'Set up a new discount'}</p>
            </div>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-500 hover:bg-gray-100 p-2 rounded-lg transition-colors">
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-5 overflow-y-auto">
            {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">{error}</div>}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Discount Name *</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g., Summer Sale" required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all" />
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all bg-white">
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount ($)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Value *</label>
                <input type="number" step="0.01" value={formData.value} onChange={(e) => setFormData({...formData, value: e.target.value})} placeholder="10" required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
              <input type="date" value={formData.start_date} onChange={(e) => setFormData({...formData, start_date: e.target.value})} required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="indefinite" checked={formData.is_indefinite} onChange={(e) => setFormData({...formData, is_indefinite: e.target.checked})} className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500" />
              <label htmlFor="indefinite" className="text-sm font-medium text-gray-700">Indefinite (No end date)</label>
            </div>
            {!formData.is_indefinite && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input type="date" value={formData.end_date} onChange={(e) => setFormData({...formData, end_date: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all" />
              </div>
            )}
          </div>

          <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/50">
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-white hover:text-gray-900 border border-transparent hover:border-gray-200 transition-all">Cancel</button>
            <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 shadow-sm shadow-orange-200 transition-all disabled:opacity-50">{loading ? 'Saving...' : (discount ? 'Update' : 'Create')}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateDiscountModal
