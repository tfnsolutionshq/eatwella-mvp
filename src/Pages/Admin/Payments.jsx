import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../DashboardLayout/DashboardLayout'
import { 
  FiDollarSign, 
  FiCreditCard, 
  FiLayout, 
  FiSearch, 
  FiFilter, 
  FiDownload,
  FiTrendingUp
} from 'react-icons/fi'
import api from '../../utils/api'

function Payments() {
  const [searchTerm, setSearchTerm] = useState('')
  const [totals, setTotals] = useState(null)
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/admin/payments')
      setTotals(data.totals)
      setPayments(data.payments.data)
    } catch (err) {
      console.error('Failed to fetch payments:', err)
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    { 
      label: 'Total Revenue', 
      value: `₦${totals?.total_revenue?.toFixed(2) || '0.00'}`, 
      icon: FiDollarSign, 
      color: 'bg-green-500', 
      trend: '+12%' 
    },
    { 
      label: 'Pending', 
      value: `₦${totals?.total_pending?.toFixed(2) || '0.00'}`, 
      icon: FiDollarSign, 
      color: 'bg-orange-500',
    },
    { 
      label: 'Completed', 
      value: totals?.total_completed || '0', 
      icon: FiCreditCard, 
      color: 'bg-blue-500',
    },
    { 
      label: 'Transactions', 
      value: totals?.total_transactions || '0', 
      icon: FiLayout, 
      color: 'bg-purple-500',
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700 border-green-200'
      case 'pending': return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'unpaid': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getMethodColor = (method) => {
    switch (method) {
      case 'paystack': return 'bg-blue-50 text-blue-600 border-blue-100'
      case 'cash': return 'bg-green-50 text-green-600 border-green-100'
      default: return 'bg-gray-50 text-gray-600 border-gray-100'
    }
  }

  return (
    <DashboardLayout>
      <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
        <p className="text-gray-500">Track all transactions and payment methods</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.color} text-white shadow-sm`}>
                <stat.icon size={24} />
              </div>
              {stat.trend && (
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  <FiTrendingUp size={12} />
                  {stat.trend}
                </span>
              )}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by order ID, customer, or invoice..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors shadow-sm">
          <FiFilter size={20} />
          <span>Filter</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading payments...</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Invoice</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Method</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">
                      {payment.invoice_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      {payment.order?.order_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                      {payment.order?.customer_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      ₦{payment.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${getMethodColor(payment.payment_method)}`}>
                        {payment.payment_method}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(payment.payment_status)}`}>
                        {payment.payment_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(payment.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      </div>
    </DashboardLayout>
  )
}

export default Payments
