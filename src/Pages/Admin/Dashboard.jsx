import React, { useState, useEffect } from 'react'
import { FiDollarSign, FiShoppingBag, FiUsers, FiTrendingUp } from 'react-icons/fi'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import DashboardLayout from '../../DashboardLayout/DashboardLayout'
import api from '../../utils/api'

const Dashboard = () => {
  const [summary, setSummary] = useState(null)
  const [topMenus, setTopMenus] = useState([])
  const [dailySales, setDailySales] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [summaryRes, topMenusRes, dailySalesRes] = await Promise.all([
        api.get('/admin/analytics/summary'),
        api.get('/admin/analytics/top-menus'),
        api.get('/admin/analytics/daily-sales')
      ])
      setSummary(summaryRes.data)
      setTopMenus(topMenusRes.data)
      setDailySales(dailySalesRes.data)
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err)
    }
  }

  const stats = [
    { label: "Total Revenue", value: `$${summary?.total_revenue?.toFixed(2) || '0.00'}`, icon: FiDollarSign, color: "bg-green-500" },
    { label: "Total Orders", value: summary?.total_orders || '0', icon: FiShoppingBag, color: "bg-blue-500" },
    { label: "Avg Order Value", value: `$${summary?.average_order_value?.toFixed(2) || '0.00'}`, icon: FiTrendingUp, color: "bg-orange-500" },
  ]

  const chartData = dailySales.map(day => ({
    name: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    revenue: parseFloat(day.revenue),
    orders: day.orders_count
  }))

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 bg-gray-50/50 min-h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-xl ${stat.color} text-white`}>
                <stat.icon className="w-6 h-6" />
              </div>
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
              <h2 className="text-lg font-bold text-gray-900">Daily Sales</h2>
              <p className="text-sm text-gray-500">Revenue and orders over time</p>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }} activeDot={{ r: 6 }} />
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
                  <span className="text-sm text-gray-600">Revenue</span>
              </div>
          </div>
        </div>

        {/* Top Selling Items */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Top Selling Items</h2>
          <div className="space-y-6">
            {topMenus.map((item, index) => (
              <div key={item.menu_id} className="flex items-center gap-4">
                <span className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold ${index < 3 ? "bg-orange-50 text-orange-600" : "bg-gray-50 text-gray-600"}`}>
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">{item.menu?.name}</h4>
                  <span className="text-xs text-gray-500">{item.total_sold} sold</span>
                </div>
                <span className="text-sm font-bold text-orange-500">${item.total_revenue}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
  )
}

export default Dashboard
