import React from 'react'
import { FiX } from 'react-icons/fi'

const OrderDetailsModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
            <p className="text-sm text-gray-500 mt-1">Complete information about this order</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 hover:bg-gray-100 p-2 rounded-lg transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-2 gap-6 pb-6 border-b border-gray-100">
            <div>
              <p className="text-sm text-gray-500 mb-1">Order ID</p>
              <p className="text-base font-medium text-gray-900">{order.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Status</p>
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${order.statusColor}`}>
                {order.status}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Order Type</p>
              <p className="text-base font-medium text-gray-900">{order.type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Created At</p>
              <p className="text-base font-medium text-gray-900">{order.time}</p>
            </div>
          </div>

          {/* Customer Info */}
          <div className="pb-6 border-b border-gray-100">
            <h3 className="text-base font-medium text-gray-900 mb-4">Customer Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Name:</span>
                <span className="text-sm font-medium text-gray-900">{order.customer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Phone:</span>
                <span className="text-sm font-medium text-gray-900">+1 234 567 8900</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Email:</span>
                <span className="text-sm font-medium text-gray-900">{order.customer.toLowerCase().replace(' ', '')}@email.com</span>
              </div>
              {order.type === 'Delivery' && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Delivery Address:</span>
                  <span className="text-sm font-medium text-gray-900">123 Main St, Apt 4B</span>
                </div>
              )}
              {order.type === 'Dine-in' && order.table && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Table Number:</span>
                  <span className="text-sm font-medium text-gray-900">{order.table.replace('Table #', '#')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-base font-medium text-gray-900 mb-4">Order Items</h3>
            <div className="space-y-3 mb-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start">
                  <span className="text-sm text-gray-600">
                    <span className="text-gray-900 font-medium">{item.quantity}x</span> {item.name}
                  </span>
                  <span className="text-sm font-medium text-gray-900">${item.price}</span>
                </div>
              ))}
            </div>
            
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-lg font-bold text-gray-900">Total Amount</span>
              <span className="text-xl font-bold text-orange-500">${order.total}</span>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <span className="text-sm text-gray-500">Payment Status</span>
              <span className="px-2.5 py-1 bg-green-600 text-white text-xs font-medium rounded-full">
                Paid
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailsModal
