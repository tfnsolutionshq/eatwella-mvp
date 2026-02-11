import React, { useState } from 'react'
import DashboardLayout from '../../DashboardLayout/DashboardLayout'
import CreateDiscountModal from '../../Components/Modals/CreateDiscountModal'
import { FiPlus, FiPercent, FiCheckCircle, FiCalendar, FiDollarSign, FiCopy, FiEdit2, FiTrash2 } from 'react-icons/fi'

const DiscountManagement = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingDiscount, setEditingDiscount] = useState(null)

  const stats = [
    { label: 'Active Discounts', value: '3', icon: FiPercent, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Total Uses', value: '174', icon: FiCheckCircle, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'Expiring Soon', value: '0', icon: FiCalendar, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { label: 'Staff Only', value: '1', icon: FiDollarSign, color: 'text-blue-500', bg: 'bg-blue-50' },
  ]

  const activeDiscounts = [
    {
      id: 1,
      code: 'WELCOME10',
      description: '10% off for new customers',
      discount: '10% off',
      validUntil: '3/31/2026',
      minOrder: '$25.00',
      usage: '34 / 100',
      isStaffOnly: false
    },
    {
      id: 2,
      code: 'LUNCH5',
      description: '$5 off lunch orders',
      discount: '$5.00 off',
      validUntil: '2/28/2026',
      minOrder: '$15.00',
      usage: '124 / 500',
      isStaffOnly: false
    },
    {
      id: 3,
      code: 'STAFF20',
      description: 'Staff discount',
      discount: '20% off',
      validUntil: '12/31/2026',
      minOrder: '-',
      usage: '16 / -',
      isStaffOnly: true
    }
  ]

  const expiredDiscounts = [
    {
      id: 4,
      code: 'NEWYEAR25',
      description: 'New Year Special',
      discount: '25% off',
      validUntil: '1/31/2025',
      minOrder: '$50.00',
      usage: '89 / 100',
      isStaffOnly: false
    }
  ]

  const handleEdit = (discount) => {
    setEditingDiscount({
      code: discount.code,
      type: discount.discount.includes('%') ? 'percentage' : 'fixed',
      value: discount.discount.replace(/[^0-9.]/g, ''),
      description: discount.description,
      startDate: '2025-01-01', // Mock date
      endDate: '2026-12-31', // Mock date
      minOrder: discount.minOrder.replace(/[^0-9.]/g, ''),
      usageLimit: discount.usage.split(' / ')[1] === '-' ? '' : discount.usage.split(' / ')[1],
      isStaffOnly: discount.isStaffOnly
    })
    setIsEditModalOpen(true)
  }

  return (
    <>
      <CreateDiscountModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
      
      <CreateDiscountModal 
        isOpen={isEditModalOpen} 
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingDiscount(null)
        }}
        initialData={editingDiscount}
        isEditing={true}
      />

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

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              )
            })}
          </div>

          {/* Active Discounts */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Active Discounts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {activeDiscounts.map((discount) => (
                <div key={discount.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-gray-100 rounded-md text-sm font-bold text-gray-900 tracking-wide uppercase font-mono">
                        {discount.code}
                      </span>
                      <button className="text-gray-400 hover:text-gray-600">
                        <FiCopy className="w-4 h-4" />
                      </button>
                    </div>
                    {discount.isStaffOnly && (
                      <span className="px-2 py-0.5 rounded-full bg-gray-50 text-xs font-medium text-gray-500 border border-gray-100">
                        Staff Only
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-500 mb-6">{discount.description}</p>

                  <div className="space-y-3 mb-8 flex-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Discount:</span>
                      <span className="font-medium text-orange-500">{discount.discount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Valid Until:</span>
                      <span className="font-medium text-gray-900">{discount.validUntil}</span>
                    </div>
                    {discount.minOrder !== '-' && (
                        <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Min. Order:</span>
                        <span className="font-medium text-gray-900">{discount.minOrder}</span>
                        </div>
                    )}
                     {discount.usage !== '16 / -' && ( // Quick hack to match image logic roughly
                        <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Usage:</span>
                        <span className="font-medium text-gray-900">{discount.usage}</span>
                        </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                    <button className="flex-1 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                      Deactivate
                    </button>
                    <button 
                      onClick={() => handleEdit(discount)}
                      className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-blue-600 transition-colors border border-transparent hover:border-gray-200"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors border border-transparent hover:border-red-100">
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Expired/Inactive Discounts */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Expired & Inactive</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {expiredDiscounts.map((discount) => (
                <div key={discount.id} className="bg-gray-50 rounded-2xl border border-gray-200 p-6 flex flex-col opacity-75 grayscale-[50%] hover:grayscale-0 hover:opacity-100 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-gray-200 rounded-md text-sm font-bold text-gray-600 tracking-wide uppercase font-mono line-through decoration-gray-400">
                        {discount.code}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-red-100 text-xs font-medium text-red-600">
                      Expired
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mb-6">{discount.description}</p>

                  <div className="space-y-3 mb-6 flex-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Discount:</span>
                      <span className="font-medium text-gray-700">{discount.discount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Expired On:</span>
                      <span className="font-medium text-gray-700">{discount.validUntil}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                    <button className="flex-1 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                      Reactivate
                    </button>
                    <button className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors">
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
