import React from 'react'
import { FiX } from 'react-icons/fi'

const OrderDetailsModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null

  console.log('Order data:', order)
  console.log('Order items:', order.order_items)
  order.order_items?.forEach(item => {
    console.log('Item menu:', item.menu)
    console.log('Item images:', item.menu?.images)
  })

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-orange-100 text-orange-600',
      processing: 'bg-purple-100 text-purple-600',
      completed: 'bg-green-100 text-green-600'
    }
    return colors[status] || 'bg-gray-100 text-gray-600'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
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

        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Order Info */}
          <div className="grid grid-cols-2 gap-6 pb-6 border-b border-gray-100">
            <div>
              <p className="text-sm text-gray-500 mb-1">Order Number</p>
              <p className="text-base font-medium text-gray-900">#{order.order_number}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Status</p>
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Customer Email</p>
              <p className="text-base font-medium text-gray-900">{order.customer_email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Created At</p>
              <p className="text-base font-medium text-gray-900">{new Date(order.created_at).toLocaleString()}</p>
            </div>
          </div>

          <div className="pb-6 border-b border-gray-100">
            <h3 className="text-base font-medium text-gray-900 mb-4">Payment Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Invoice Number:</span>
                <span className="text-sm font-medium text-gray-900">{order.invoice?.invoice_number || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Payment Method:</span>
                <span className="text-sm font-medium text-gray-900">{order.invoice?.payment_method?.toUpperCase() || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Payment Status:</span>
                <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${order.invoice?.payment_status === 'paid' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                  {order.invoice?.payment_status?.toUpperCase() || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-base font-medium text-gray-900 mb-4">Order Items</h3>
            <div className="space-y-4 mb-4">
              {order.order_items?.map((item) => {
                const imageUrl = item.menu?.images && item.menu.images.length > 0 ? item.menu.images[0] : null
                console.log('Rendering item:', item.menu?.name, 'Image URL:', imageUrl)
                return (
                  <div key={item.id} className="flex gap-3">
                    {imageUrl && (
                      <img 
                        src={imageUrl} 
                        alt={item.menu?.name || 'Menu item'} 
                        className="w-16 h-16 rounded-lg object-cover border border-gray-200" 
                        onError={(e) => { 
                          console.log('Image failed to load:', imageUrl)
                          e.target.src = 'https://via.placeholder.com/64'
                        }} 
                      />
                    )}
                    <div className="flex-1 flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.menu?.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-medium text-gray-900">${item.subtotal}</span>
                    </div>
                  </div>
                )
              })}
            </div>
            
            <div className="space-y-2 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Subtotal</span>
                <span className="text-sm font-medium text-gray-900">${order.total_amount}</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Discount</span>
                  <span className="text-sm font-medium text-green-600">-${order.discount_amount}</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-lg font-bold text-gray-900">Total Amount</span>
                <span className="text-xl font-bold text-orange-500">${order.final_amount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailsModal
