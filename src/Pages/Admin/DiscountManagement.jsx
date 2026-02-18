import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../DashboardLayout/DashboardLayout'
import CreateDiscountModal from '../../Components/Modals/CreateDiscountModal'
import { FiPlus, FiPercent, FiEdit2, FiTrash2 } from 'react-icons/fi'
import api from '../../utils/api'

const DiscountManagement = () => {
  const [discounts, setDiscounts] = useState([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingDiscount, setEditingDiscount] = useState(null)

  useEffect(() => {
    fetchDiscounts()
  }, [])

  const fetchDiscounts = async () => {
    try {
      const { data } = await api.get('/admin/discounts')
      setDiscounts(data.data)
    } catch (err) {
      console.error('Failed to fetch discounts:', err)
    }
  }

  const handleToggleActive = async (id, isActive) => {
    try {
      await api.put(`/admin/discounts/${id}`, { is_active: !isActive })
      fetchDiscounts()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update discount')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this discount?')) return
    try {
      await api.delete(`/admin/discounts/${id}`)
      fetchDiscounts()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete discount')
    }
  }

  const activeDiscounts = discounts.filter(d => d.is_active)
  const inactiveDiscounts = discounts.filter(d => !d.is_active)

  return (
    <>
      <CreateDiscountModal isOpen={isCreateModalOpen || !!editingDiscount} onClose={() => { setIsCreateModalOpen(false); setEditingDiscount(null) }} discount={editingDiscount} onSuccess={fetchDiscounts} />

      <DashboardLayout>
        <div className="p-6 space-y-8 bg-gray-50/50 min-h-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Discount Management</h1>
              <p className="text-sm text-gray-500 mt-1">Create and manage discount codes for your restaurant</p>
            </div>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors shadow-sm shadow-orange-200"
            >
              <FiPlus className="w-4 h-4" />
              Create Discount
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center mb-4">
                <FiPercent className="w-5 h-5 text-orange-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{activeDiscounts.length}</div>
              <div className="text-sm text-gray-500">Active Discounts</div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center mb-4">
                <FiPercent className="w-5 h-5 text-gray-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{inactiveDiscounts.length}</div>
              <div className="text-sm text-gray-500">Inactive Discounts</div>
            </div>
          </div>

          {/* Active Discounts */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Active Discounts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {activeDiscounts.map((discount) => (
                <div key={discount.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-2.5 py-1 bg-gray-100 rounded-md text-sm font-bold text-gray-900 tracking-wide uppercase font-mono">
                      {discount.name}
                    </span>
                  </div>

                  <div className="space-y-3 mb-8 flex-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Code:</span>
                      <span className="font-medium text-gray-900 font-mono">{discount.code}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Type:</span>
                      <span className="font-medium text-gray-900">{discount.type}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Value:</span>
                      <span className="font-medium text-orange-500">{discount.type === 'percentage' ? `${discount.value}%` : `$${discount.value}`}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Start Date:</span>
                      <span className="font-medium text-gray-900">{new Date(discount.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    {!discount.is_indefinite && discount.end_date && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">End Date:</span>
                        <span className="font-medium text-gray-900">{new Date(discount.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                    )}
                    {discount.is_indefinite && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Duration:</span>
                        <span className="font-medium text-green-600">Indefinite</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                    <button onClick={() => handleToggleActive(discount.id, discount.is_active)} className="flex-1 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                      Deactivate
                    </button>
                    <button onClick={() => setEditingDiscount(discount)} className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-blue-600 transition-colors border border-transparent hover:border-gray-200">
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(discount.id)} className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors border border-transparent hover:border-red-100">
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Inactive Discounts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {inactiveDiscounts.map((discount) => (
                <div key={discount.id} className="bg-gray-50 rounded-2xl border border-gray-200 p-6 flex flex-col opacity-75">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-2.5 py-1 bg-gray-200 rounded-md text-sm font-bold text-gray-600 tracking-wide uppercase font-mono">
                      {discount.name}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-red-100 text-xs font-medium text-red-600">
                      Inactive
                    </span>
                  </div>

                  <div className="space-y-3 mb-6 flex-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Code:</span>
                      <span className="font-medium text-gray-700 font-mono">{discount.code}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Value:</span>
                      <span className="font-medium text-gray-700">{discount.type === 'percentage' ? `${discount.value}%` : `$${discount.value}`}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                    <button onClick={() => handleToggleActive(discount.id, discount.is_active)} className="flex-1 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                      Reactivate
                    </button>
                    <button onClick={() => handleDelete(discount.id)} className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors">
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  )
}

export default DiscountManagement
