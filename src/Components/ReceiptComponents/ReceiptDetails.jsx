import React, { useState, useEffect } from 'react'
import { CheckCircle, Download, User, Clock } from 'lucide-react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import api from '../../utils/api'

function ReceiptDetails() {
  const location = useLocation()
  const navigate = useNavigate()
  const { fetchCart, clearCart } = useCart()
  const { orderId } = useParams()
  const [order, setOrder] = useState(location.state?.order || null)
  const [remainingSeconds, setRemainingSeconds] = useState(null)
  const [derivedStatus, setDerivedStatus] = useState(null)

  useEffect(() => {
    clearCart()
    fetchCart()
  }, [fetchCart, clearCart])

  useEffect(() => {
    if (!order && orderId) {
      ;(async () => {
        try {
          const res = await api.get(`/orders/track/${orderId}`)
          setOrder(res.data)
        } catch (e) {
        }
      })()
    }
  }, [order, orderId])

  useEffect(() => {
    if (!order) {
      setRemainingSeconds(null)
      setDerivedStatus(null)
      return
    }

    const baseStatus = (order.status || 'pending').toLowerCase()
    setDerivedStatus(baseStatus)

    const createdAt = order.created_at || order.invoice?.created_at
    if (!createdAt) {
      setRemainingSeconds(null)
      return
    }

    const expiryTime = new Date(createdAt).getTime() + 45 * 60 * 1000

    const updateRemaining = () => {
      const diffMs = expiryTime - Date.now()
      const diffSeconds = Math.floor(diffMs / 1000)
      if (diffSeconds <= 0) {
        setRemainingSeconds(0)
        if (!['completed', 'cancelled'].includes(baseStatus)) {
          setDerivedStatus('expired')
        }
      } else {
        setRemainingSeconds(diffSeconds)
      }
    }

    updateRemaining()
    const intervalId = setInterval(updateRemaining, 1000)
    return () => clearInterval(intervalId)
  }, [order])

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const statusValue = (derivedStatus || order?.status || 'pending').toLowerCase()

  const statusLabel = (() => {
    if (statusValue === 'expired') return 'Expired'
    if (!statusValue) return 'Pending'
    return statusValue.charAt(0).toUpperCase() + statusValue.slice(1)
  })()

  const statusClasses = (() => {
    if (statusValue === 'completed') {
      return 'bg-green-100 text-green-700'
    }
    if (statusValue === 'cancelled' || statusValue === 'expired') {
      return 'bg-red-100 text-red-700'
    }
    return 'bg-yellow-100 text-yellow-700'
  })()

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">No Order Found</h2>
        <button 
          onClick={() => navigate('/menu')}
          className="bg-orange-500 text-white px-6 py-3 rounded-full font-bold"
        >
          Return to Menu
        </button>
      </div>
    )
  }

  // Helper to get items safely (handle both structure if needed, assuming response matches standard order object)
  const items = order.items || order.order_items || []
  
  // Calculate total if not explicit (though backend usually returns it)
  // Assuming order.total or order.invoice.amount exists
  const totalAmount = order.total_amount || order.invoice?.amount || items.reduce((sum, item) => sum + (Number(item.menu?.price || item.price || 0) * item.quantity), 0)

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-white" strokeWidth={3} />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-2">Order Confirmed!</h2>
        <p className="text-center text-gray-500 text-sm mb-6">Thank you for your order</p>

        {/* Order ID, Status, and Expiry */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-xs text-gray-500 mb-1">Order ID</p>
              <p className="text-xl font-bold mb-1">
                #{order.order_number || order.id || 'PENDING'}
              </p>
            </div>
            <div className="flex flex-col items-center md:items-end gap-2">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${statusClasses}`}
              >
                {statusLabel}
              </span>
              {remainingSeconds !== null &&
                remainingSeconds > 0 &&
                !['completed', 'cancelled'].includes(statusValue) && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-gray-700">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span>
                      Expires in{' '}
                      <span className="text-orange-500 font-bold">
                        {formatTime(remainingSeconds)}
                      </span>
                    </span>
                  </span>
                )}
              {statusValue === 'expired' && (
                <span className="flex items-center gap-1 text-xs font-semibold text-red-600">
                  <Clock className="w-4 h-4" />
                  <span>Order has expired</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="mb-6">
          <h3 className="font-semibold mb-4">Order Details</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Order Type</span>
              <span className="text-gray-900 capitalize">{order.order_type || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Customer</span>
              <span className="text-gray-900">{order.customer_name || 'Guest'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Email:</span>
              <span className="text-gray-900">{order.customer_email || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Phone:</span>
              <span className="text-gray-900">{order.customer_phone || 'N/A'}</span>
            </div>
            {order.table_number && (
              <div className="flex justify-between">
                <span className="text-gray-500">Table:</span>
                <span className="text-gray-900">#{order.table_number}</span>
              </div>
            )}
            {order.delivery_address && (
              <div className="flex justify-between">
                <span className="text-gray-500">Address:</span>
                <span className="text-gray-900 text-right">{order.delivery_address}, {order.delivery_city}</span>
              </div>
            )}
          </div>
        </div>

        {/* Items */}
        <div className="border-t pt-4 mb-4">
          <div className="space-y-2 text-sm">
            {items.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-gray-700">{item.quantity}x {item.menu?.name || item.name || 'Item'}</span>
                <span className="text-gray-900">₦{Number(item.menu?.price || item.price || 0).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="border-t pt-4 mb-4">
          <div className="flex justify-between font-semibold mb-2">
            <span>Total Payment:</span>
            <span className="text-orange-500">₦{Number(totalAmount).toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Mode of Payment:</span>
            <span className="text-orange-500 capitalize">{order.payment_type || order.invoice?.payment_method || 'N/A'}</span>
          </div>
        </div>

        {/* Download Button */}
        {/* <button className="w-full flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 mb-6">
          <Download className="w-4 h-4" />
          Download Receipt
        </button> */}

        {/* Account Prompt */}
        <div className="text-center mb-4">
          <p className="text-sm text-gray-600 mb-3">Would you like to create an account to track your orders?</p>
          <button className="w-full bg-orange-500 text-white py-3 rounded-full font-medium hover:bg-orange-600 flex items-center justify-center gap-2">
            <User className="w-4 h-4" />
            Create Account
          </button>
        </div>

        {/* Place Another Order */}
        <button 
          onClick={() => navigate('/menu')}
          className="w-full text-black py-3 rounded-lg font-medium flex items-center justify-center gap-2"
        >
          Place Another Order
        </button>
      </div>
    </div>
  )
}

export default ReceiptDetails
