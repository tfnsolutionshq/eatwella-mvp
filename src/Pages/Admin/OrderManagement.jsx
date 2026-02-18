import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../DashboardLayout/DashboardLayout'
import OrderDetailsModal from '../../Components/Modals/OrderDetailsModal'
import { FiFilter, FiEye, FiClock, FiCheck, FiTruck, FiUsers } from 'react-icons/fi'
import api from '../../utils/api'

const OrderManagement = () => {
  const [activeTab, setActiveTab] = useState('all')
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/admin/orders')
      setOrders(data.data)
    } catch (err) {
      console.error('Failed to fetch orders:', err)
    }
  }

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await api.put(`/admin/orders/${orderId}`, { status })
      fetchOrders()
      if (selectedOrder?.id === orderId) {
        const { data } = await api.get(`/admin/orders/${orderId}`)
        setSelectedOrder(data)
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order')
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-orange-100 text-orange-600',
      processing: 'bg-purple-100 text-purple-600',
      completed: 'bg-green-100 text-green-600'
    }
    return colors[status] || 'bg-gray-100 text-gray-600'
  }

  const filteredOrders = activeTab === 'all' ? orders : orders.filter(o => o.status === activeTab)

  return (
    <>
      <OrderDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false)
          setSelectedOrder(null)
        }}
        order={selectedOrder}
      />
      <DashboardLayout>
        <div className="p-6 space-y-6 bg-gray-50/50 min-h-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
              <p className="text-sm text-gray-500 mt-1">Monitor and manage all orders</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
              <FiFilter className="w-4 h-4" />
              Filter
            </button>
          </div>

          <div className="bg-white p-2 rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
            <div className="flex items-center gap-2 min-w-max">
              {['all', 'pending', 'processing', 'completed'].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab ? "bg-gray-200 text-gray-900 shadow-sm font-semibold" : "text-gray-600 hover:bg-gray-100"}`}>
                  {tab === 'all' ? 'All Orders' : tab.charAt(0).toUpperCase() + tab.slice(1)} ({tab === 'all' ? orders.length : orders.filter(o => o.status === tab).length})
                </button>
              ))}
            </div>
          </div>

          {/* Orders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                <div className="p-5 border-b border-gray-50 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-900 text-lg">#{order.order_number}</span>
                    </div>
                    <div className="text-sm text-gray-500">{order.customer_email}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{new Date(order.created_at).toLocaleString()}</div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(order.status)}`}>
                    {order.status === 'completed' && <FiCheck className="w-3 h-3" />}
                    {order.status === 'pending' && <FiClock className="w-3 h-3" />}
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>

                <div className="p-5 flex-1">
                  <div className="space-y-3 mb-6">
                    {order.order_items?.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          <span className="text-gray-400 mr-2">{item.quantity}x</span>
                          {item.menu?.name}
                        </span>
                        <span className="font-medium text-gray-900">${item.subtotal}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-dashed border-gray-200 flex items-end justify-between">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-orange-500">${order.final_amount}</span>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center gap-3">
                  <button onClick={async () => { 
                    const { data } = await api.get(`/admin/orders/${order.id}`)
                    setSelectedOrder(data)
                    setIsDetailsOpen(true)
                  }} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors shadow-sm">
                    <FiEye className="w-4 h-4" />
                    Details
                  </button>
                  {order.status === 'pending' && (
                    <button onClick={() => handleStatusUpdate(order.id, 'processing')} className="flex-1 px-4 py-2.5 bg-orange-500 rounded-xl text-sm font-medium text-white hover:bg-orange-600 transition-colors shadow-sm shadow-orange-200">
                      Start Processing
                    </button>
                  )}
                  {order.status === 'processing' && (
                    <button onClick={() => handleStatusUpdate(order.id, 'completed')} className="flex-1 px-4 py-2.5 bg-orange-500 rounded-xl text-sm font-medium text-white hover:bg-orange-600 transition-colors shadow-sm shadow-orange-200">
                      Mark Completed
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    </>
  )
}

export default OrderManagement
