import React, { useState } from 'react'
import DashboardLayout from '../../DashboardLayout/DashboardLayout'
import OrderDetailsModal from '../../Components/Modals/OrderDetailsModal'
import { FiFilter, FiEye, FiClock, FiCheck, FiTruck, FiUsers } from 'react-icons/fi'

const OrderManagement = () => {
  const [activeTab, setActiveTab] = useState('All Orders')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const tabs = [
    { name: 'All Orders', count: 6 },
    { name: 'Pick Up', count: 2 },
    { name: 'Dine-in', count: 2 },
    { name: 'Delivery', count: 2 },
  ]

  // Mock Data based on images
  const orders = [
    {
      id: "#ORD-1236",
      customer: "Alex Morgan",
      time: "11:00 AM",
      type: "Pick Up",
      status: "Ready",
      statusColor: "bg-green-100 text-green-600",
      items: [
        { name: "Chocolate Lava Cake", quantity: 2, price: 17.98 },
        { name: "Cappuccino", quantity: 2, price: 9.00 }
      ],
      total: "26.98",
      actions: ["Details", "Mark as Completed"]
    },
    {
      id: "#ORD-1235",
      customer: "Lisa Wang",
      time: "10:55 AM",
      type: "Pick Up",
      status: "Preparing",
      statusColor: "bg-purple-100 text-purple-600",
      items: [
        { name: "Classic Caesar Salad", quantity: 1, price: 10.99 }
      ],
      total: "10.99",
      actions: ["Details", "Mark as Ready"]
    },
    {
      id: "#ORD-1234",
      customer: "Sarah Johnson",
      time: "10:45 AM",
      type: "Delivery",
      status: "Preparing",
      statusColor: "bg-purple-100 text-purple-600",
      items: [
        { name: "Grilled Salmon Bowl", quantity: 2, price: 29.98 },
        { name: "Caesar Salad", quantity: 1, price: 8.99 }
      ],
      total: "42.96",
      actions: ["Details", "Mark as Ready"]
    },
    {
      id: "#ORD-1233",
      customer: "Mike Chen",
      time: "10:30 AM",
      type: "Dine-in",
      status: "Ready",
      statusColor: "bg-green-100 text-green-600",
      items: [
        { name: "Prime Ribeye Steak", quantity: 1, price: 24.99 },
        { name: "Penne Arrabbiata", quantity: 1, price: 11.99 }
      ],
      total: "39.97",
      table: "Table #12",
      actions: ["Details", "Mark as Completed"]
    },
    {
      id: "#ORD-1232",
      customer: "Emma Wilson",
      time: "10:15 AM",
      type: "Delivery",
      status: "Confirmed",
      statusColor: "bg-blue-100 text-blue-600",
      items: [
        { name: "Mediterranean Chicken Salad", quantity: 1, price: 12.99 }
      ],
      total: "16.98",
      actions: ["Details", "Mark as Preparing"]
    },
    {
      id: "#ORD-1231",
      customer: "James Brown",
      time: "10:00 AM",
      type: "Dine-in",
      status: "Pending",
      statusColor: "bg-orange-100 text-orange-600",
      items: [
        { name: "Grilled Salmon Bowl", quantity: 3, price: 44.97 },
        { name: "Penne Arrabbiata", quantity: 2, price: 23.98 }
      ],
      total: "72.95",
      table: "Table #8",
      actions: ["Details", "Mark as Confirmed", "Cancel"]
    }
  ]

  const filteredOrders = activeTab === 'All Orders'
    ? orders
    : orders.filter(order => order.type === activeTab)

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

          {/* Tabs */}
          <div className="bg-white p-2 rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
            <div className="flex items-center gap-2 min-w-max">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.name
                      ? "bg-gray-200 text-gray-900 shadow-sm font-semibold"
                      : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  {tab.name} ({tab.count})
                </button>
              ))}
            </div>
          </div>

          {/* Orders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                {/* Card Header */}
                <div className="p-5 border-b border-gray-50 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-900 text-lg">{order.id}</span>
                      <span className="px-2 py-0.5 rounded border border-gray-200 text-xs font-medium text-gray-600 bg-gray-50 flex items-center gap-1">
                        {order.type === 'Delivery' ? <FiTruck className="w-3 h-3" /> : <FiUsers className="w-3 h-3" />}
                        {order.type}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">{order.customer}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{order.time}</div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${order.statusColor}`}>
                    {order.status === 'Ready' && <FiCheck className="w-3 h-3" />}
                    {order.status === 'Pending' && <FiClock className="w-3 h-3" />}
                    {order.status}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1">
                  <div className="space-y-3 mb-6">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          <span className="text-gray-400 mr-2">{item.quantity}x</span>
                          {item.name}
                        </span>
                        <span className="font-medium text-gray-900">${item.price}</span>
                      </div>
                    ))}
                    {/* Extra items overflow could be handled here */}
                  </div>

                  <div className="pt-4 border-t border-dashed border-gray-200 flex items-end justify-between">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-orange-500">${order.total}</span>
                  </div>

                  {order.table && (
                    <div className="mt-4 text-sm text-gray-500">
                      {order.table}
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center gap-3">
                  <button 
                    onClick={() => {
                      setSelectedOrder(order)
                      setIsDetailsOpen(true)
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors shadow-sm"
                  >
                    <FiEye className="w-4 h-4" />
                    Details
                  </button>
                  {order.actions.includes("Mark as Ready") && (
                    <button className="flex-1 px-4 py-2.5 bg-orange-500 rounded-xl text-sm font-medium text-white hover:bg-orange-600 transition-colors shadow-sm shadow-orange-200">
                      Mark as Ready
                    </button>
                  )}
                  {order.actions.includes("Mark as Completed") && (
                    <button className="flex-1 px-4 py-2.5 bg-orange-500 rounded-xl text-sm font-medium text-white hover:bg-orange-600 transition-colors shadow-sm shadow-orange-200">
                      Mark as Completed
                    </button>
                  )}
                  {order.actions.includes("Mark as Preparing") && (
                    <button className="flex-1 px-4 py-2.5 bg-orange-500 rounded-xl text-sm font-medium text-white hover:bg-orange-600 transition-colors shadow-sm shadow-orange-200">
                      Mark as Preparing
                    </button>
                  )}
                  {order.actions.includes("Mark as Confirmed") && (
                    <button className="flex-1 px-4 py-2.5 bg-orange-500 rounded-xl text-sm font-medium text-white hover:bg-orange-600 transition-colors shadow-sm shadow-orange-200">
                      Mark as Confirmed
                    </button>
                  )}
                  {order.actions.includes("Cancel") && (
                    <button className="px-4 py-2.5 bg-red-600 rounded-xl text-sm font-medium text-white hover:bg-red-700 transition-colors shadow-sm shadow-red-200">
                      Cancel
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
