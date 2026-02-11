import React from 'react'
import { FiDollarSign, FiShoppingBag, FiUsers, FiTrendingUp, FiCalendar, FiZap } from 'react-icons/fi'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import DashboardLayout from '../../DashboardLayout/DashboardLayout'

const Dashboard = () => {
  const stats = [
    { label: "Total Revenue", value: "$12,458", change: "+12.5%", isPositive: true, icon: FiDollarSign, color: "bg-green-500" },
    { label: "Orders Today", value: "43", change: "+8.2%", isPositive: true, icon: FiShoppingBag, color: "bg-blue-500" },
    { label: "Active Customers", value: "287", change: "+15.3%", isPositive: true, icon: FiUsers, color: "bg-purple-500" },
    { label: "Avg Order Value", value: "$28.95", change: "+5.8%", isPositive: true, icon: FiTrendingUp, color: "bg-orange-500" },
  ]

  const data = [
    { name: 'Feb 3', orders: 28, transactions: 32 },
    { name: 'Feb 4', orders: 35, transactions: 41 },
    { name: 'Feb 5', orders: 42, transactions: 48 },
    { name: 'Feb 6', orders: 38, transactions: 43 },
    { name: 'Feb 7', orders: 45, transactions: 52 },
    { name: 'Feb 8', orders: 51, transactions: 58 },
    { name: 'Feb 9', orders: 43, transactions: 50 },
  ]

  const topSellingItems = [
    { rank: 1, name: "Grilled Salmon Bowl", orders: 34, growth: "+12%", price: "$509.66" },
    { rank: 2, name: "Mediterranean Chicken Salad", orders: 28, growth: "+8%", price: "$363.72" },
    { rank: 3, name: "Prime Ribeye Steak", orders: 22, growth: "+15%", price: "$549.78" },
    { rank: 4, name: "Penne Arrabbiata", orders: 19, growth: "-3%", price: "$227.81", isNegative: true },
    { rank: 5, name: "Caesar Salad", orders: 15, growth: "+5%", price: "$134.85" },
  ]

  const recentOrders = [
    { id: "#ORD-1234", customer: "Sarah Johnson", type: "Delivery", time: "2m ago", amount: "$45.98", status: "Preparing", statusColor: "bg-yellow-100 text-yellow-700" },
    { id: "#ORD-1233", customer: "Mike Chen", type: "Dine-in", time: "5m ago", amount: "$32.50", status: "Ready", statusColor: "bg-emerald-100 text-emerald-700" },
    { id: "#ORD-1232", customer: "Emma Wilson", type: "Delivery", time: "12m ago", amount: "$28.75", status: "Delivered", statusColor: "bg-blue-100 text-blue-700" },
    { id: "#ORD-1231", customer: "James Brown", type: "Dine-in", time: "25m ago", amount: "$67.20", status: "Completed", statusColor: "bg-emerald-100 text-emerald-700" },
  ]

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 bg-gray-50/50 min-h-full">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <FiCalendar className="w-4 h-4" />
            Last 7 days
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors shadow-sm shadow-orange-200">
            <FiZap className="w-4 h-4" />
            Quick Actions
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-xl ${stat.color} text-white`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                stat.isPositive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
              }`}>
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trends Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Trends</h2>
              <p className="text-sm text-gray-500">Daily order and transaction volume</p>
            </div>
            <div className="flex bg-gray-100 p-1 rounded-lg">
                <button className="px-3 py-1 bg-white text-orange-500 text-sm font-medium rounded-md shadow-sm">Orders</button>
                <button className="px-3 py-1 text-gray-600 text-sm font-medium rounded-md hover:bg-gray-200">Revenue</button>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="transactions" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="orders" stroke="#f97316" strokeWidth={3} dot={{ r: 4, fill: '#f97316', strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                  <span className="text-sm text-gray-600">Orders</span>
              </div>
              <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  <span className="text-sm text-gray-600">Transactions</span>
              </div>
          </div>
        </div>

        {/* Top Selling Items */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Top Selling Items</h2>
          <div className="space-y-6">
            {topSellingItems.map((item) => (
              <div key={item.rank} className="flex items-center gap-4">
                <span className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold ${
                    item.rank <= 3 ? "bg-orange-50 text-orange-600" : "bg-gray-50 text-gray-600"
                }`}>
                  {item.rank}
                </span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">{item.orders} orders</span>
                    <span className={`text-xs font-medium ${item.isNegative ? "text-red-500" : "text-green-500"}`}>
                      {item.growth}
                    </span>
                  </div>
                </div>
                <span className="text-sm font-bold text-orange-500">{item.price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
          <button className="text-sm font-medium text-gray-500 hover:text-gray-900">View All</button>
        </div>
        <div className="space-y-4">
          {recentOrders.map((order, index) => (
            <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <span className="text-sm font-bold text-gray-900">{order.id}</span>
                <span className="hidden sm:block text-gray-300">•</span>
                <span className="text-sm text-gray-600">
                  <span className="font-medium text-gray-900">{order.customer}</span>
                  <span className="text-gray-400 mx-1">•</span>
                  {order.type}
                </span>
              </div>
              
              <div className="flex items-center justify-between sm:justify-end gap-6 flex-1">
                <span className="text-sm text-gray-500">{order.time}</span>
                <span className="text-sm font-bold text-gray-900 w-20 text-right">{order.amount}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium w-24 text-center ${order.statusColor}`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </DashboardLayout>
  )
}

export default Dashboard
