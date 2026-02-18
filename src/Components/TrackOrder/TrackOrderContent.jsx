import React, { useState, useEffect } from 'react'
import { 
  Search, 
  ChevronLeft, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Mail, 
  Phone, 
  Calendar, 
  Package,
  CreditCard,
  User
} from 'lucide-react'
import api from '../../utils/api'

function TrackOrderContent() {
  const [step, setStep] = useState('search') // search, details
  const [formData, setFormData] = useState({
    orderId: ''
  })
  const [orderData, setOrderData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [remainingSeconds, setRemainingSeconds] = useState(null)
  const [derivedStatus, setDerivedStatus] = useState(null)

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleTrackOrder = async (e) => {
    e.preventDefault()
    if (!formData.orderId) {
      setError('Please enter your order ID')
      return
    }

    setLoading(true)
    setError('')

    try {
      // The API endpoint provided: /orders/track/{order_id}
      // Note: We might need to handle the ID format if the user enters just the number part, 
      // but let's assume they enter the full ID as per placeholder.
      const response = await api.get(`/orders/track/${formData.orderId}`)
      
      const order = response.data
      
      setOrderData(order)
      setStep('details')
    } catch (err) {
      console.error('Track order error:', err)
      setError(err.response?.data?.message || 'Order not found. Please check your details and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setStep('search')
    setFormData({ orderId: '' })
    setOrderData(null)
    setError('')
  }

  // Format currency
  const formatPrice = (price) => {
    return `₦${Number(price).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCountdown = (seconds) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  useEffect(() => {
    if (!orderData) {
      setRemainingSeconds(null)
      setDerivedStatus(null)
      return
    }

    const baseStatus = (orderData.status || 'pending').toLowerCase()
    setDerivedStatus(baseStatus)

    const createdAt = orderData.created_at
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
  }, [orderData])

  // Determine timeline status
  const getTimelineStatus = (currentStatus) => {
    const statuses = ['pending', 'confirmed', 'preparing', 'pickup', 'delivery', 'completed']
    const currentIndex = statuses.indexOf(currentStatus)
    // Map API status to UI steps
    // UI Steps: Order Placed -> Confirmed -> Preparing -> Out for Delivery/Ready
    
    // Logic: if current status index >= step index, it's active/completed
    return {
      placed: true, // Always true if order exists
      confirmed: currentIndex >= 1, // 'confirmed' is index 1
      preparing: currentIndex >= 2, // 'preparing' is index 2
      out: currentIndex >= 3 // 'pickup'/'delivery' is index 3+
    }
  }

  if (step === 'search') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50 px-4 py-12">
        <div className="bg-white w-full max-w-lg p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-orange-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Find Your Order</h1>
            <p className="text-gray-500 text-center">Enter your order ID to track your order</p>
          </div>

          <form onSubmit={handleTrackOrder} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Order ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="orderId"
                value={formData.orderId}
                onChange={handleInputChange}
                placeholder="ORD-123456 or 123456"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
              <p className="text-xs text-gray-400 mt-1">Found in your order confirmation email</p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white font-bold py-4 rounded-full hover:bg-orange-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Track Order
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // Details View
  const timeline = getTimelineStatus(orderData.status)
  const isDelivery = orderData.order_type === 'delivery'
  const statusValue = (derivedStatus || orderData.status || 'pending').toLowerCase()

  const statusLabel = (() => {
    if (statusValue === 'expired') return 'Expired'
    if (!statusValue) return 'Pending'
    return statusValue.replace('_', ' ').charAt(0).toUpperCase() + statusValue.replace('_', ' ').slice(1)
  })()
  
  // Helper to calculate total from items if not provided (fallback)
  const items = orderData.order_items || []
  const subtotal = items.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0)
  // Use API values or fallback
  const finalTotal = orderData.total_amount || orderData.final_amount || subtotal
  const discount = orderData.discount_amount || 0
  // Infer delivery fee if not explicit in top-level, but usually it is. 
  // If not, we can calc: total - subtotal + discount. 
  // But for now, let's just assume if it's delivery, there might be a fee.
  // The provided JSON example doesn't explicitly show delivery_fee field at root, 
  // but let's assume standard calculation: Total = Subtotal - Discount + Delivery
  // So Delivery = Total - Subtotal + Discount
  const deliveryFee = orderData.order_type === 'delivery' 
    ? (Number(finalTotal) - subtotal + Number(discount)) 
    : 0

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
      {/* Back Button */}
      <button 
        onClick={() => setStep('search')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ChevronLeft className="w-5 h-5 mr-1" />
        Back
      </button>

      {/* Status Banner */}
      <div className="bg-orange-50 rounded-2xl p-6 mb-8 border border-orange-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
            <Truck className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h2 className={`text-xl font-extrabold capitalize ${
              statusValue === 'completed'
                ? 'text-green-700'
                : statusValue === 'cancelled' || statusValue === 'expired'
                  ? 'text-red-600'
                  : 'text-orange-600'
            }`}>
              {statusLabel}
            </h2>
          </div>
        </div>
        <div className="flex flex-col items-start md:items-end gap-2">
          <div className="bg-white/80 px-4 py-2 rounded-lg text-sm font-mono font-medium text-gray-600 border border-orange-100">
            #{orderData.order_number || orderData.id}
          </div>
          {remainingSeconds !== null &&
            remainingSeconds > 0 &&
            !['completed', 'cancelled'].includes(statusValue) && (
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>
                  Expires in{' '}
                  <span className="text-orange-500 font-bold">
                    {formatCountdown(remainingSeconds)}
                  </span>
                </span>
              </div>
            )}
          {statusValue === 'expired' && (
            <div className="flex items-center gap-2 text-xs font-semibold text-red-600">
              <Clock className="w-4 h-4" />
              <span>Order has expired</span>
            </div>
          )}
        </div>
      </div>

      {/* Timeline Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
        <h3 className="font-bold text-lg mb-6">Order Timeline</h3>
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-100"></div>

          {/* Steps */}
          <div className="space-y-8">
            {/* Step 1: Placed */}
            <div className="relative flex gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${timeline.placed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                <CheckCircle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className={`font-semibold ${timeline.placed ? 'text-gray-900' : 'text-gray-500'}`}>Order Placed</h4>
                    <p className="text-sm text-gray-500">Your order has been received</p>
                  </div>
                  <span className="text-sm text-gray-400">{formatDate(orderData.created_at).split(',')[1]}</span>
                </div>
              </div>
            </div>

            {/* Step 2: Confirmed */}
            <div className="relative flex gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${timeline.confirmed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                <CheckCircle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className={`font-semibold ${timeline.confirmed ? 'text-gray-900' : 'text-gray-500'}`}>Confirmed</h4>
                    <p className="text-sm text-gray-500">Restaurant confirmed your order</p>
                  </div>
                  {timeline.confirmed && <span className="text-sm text-gray-400">{formatDate(orderData.updated_at).split(',')[1]}</span>}
                </div>
              </div>
            </div>

            {/* Step 3: Preparing */}
            {/* <div className="relative flex gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${timeline.preparing ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                <CheckCircle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className={`font-semibold ${timeline.preparing ? 'text-gray-900' : 'text-gray-500'}`}>Preparing</h4>
                    <p className="text-sm text-gray-500">Chef is preparing your meal</p>
                  </div>
                </div>
              </div>
            </div> */}

            {/* Step 4: Out for Delivery / Ready */}
            {/* <div className="relative flex gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${timeline.out ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                {isDelivery ? <Truck className="w-5 h-5" /> : <Package className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className={`font-semibold ${timeline.out ? 'text-gray-900' : 'text-gray-500'}`}>
                      {isDelivery ? 'Out for Delivery' : 'Ready for Pickup'}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {isDelivery ? 'Driver is on the way to your location' : 'Your order is ready for pickup'}
                    </p>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Customer Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h3 className="font-bold text-lg mb-6">Customer Information</h3>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <Package className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Order Type</p>
                <p className="font-medium capitalize">{orderData.order_type}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Mail className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{orderData.customer_email}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{orderData.customer_phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Calendar className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Order Date</p>
                <p className="font-medium">{formatDate(orderData.created_at)}</p>
              </div>
            </div>
            {isDelivery && (
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Delivery Address</p>
                  <p className="font-medium">{orderData.delivery_address}</p>
                  <p className="text-sm text-gray-500">{orderData.delivery_city}, {orderData.delivery_zip}</p>
                </div>
              </div>
            )}
            {!isDelivery && orderData.table_number && (
              <div className="flex items-start gap-4">
                <User className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Table Number</p>
                  <p className="font-medium">{orderData.table_number}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h3 className="font-bold text-lg mb-6">Order Summary</h3>
          <div className="space-y-4 mb-6">
            {items.map((item, index) => (
              <div key={index} className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900">{item.quantity}x {item.menu?.name || 'Item'}</p>
                  {item.menu?.description && <p className="text-xs text-gray-500 truncate max-w-[200px]">{item.menu.description}</p>}
                </div>
                <p className="font-medium text-gray-900">{formatPrice(Number(item.price) * item.quantity)}</p>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-100 pt-4 space-y-2">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {Number(discount) > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}
            {isDelivery && (
              <div className="flex justify-between text-gray-500">
                <span>Delivery Fee</span>
                <span>{formatPrice(deliveryFee)}</span>
              </div>
            )}
            <div className="flex justify-between text-xl font-bold text-orange-600 pt-2 border-t border-gray-100 mt-2">
              <span>Total Paid</span>
              <span>{formatPrice(finalTotal)}</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
            <span className="text-gray-500">Payment Method</span>
            <span className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-xs font-medium text-gray-700 capitalize">
              {orderData.invoice?.payment_method || orderData.payment_type || 'Unknown'}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <button 
          onClick={handleReset}
          className="flex-1 bg-white border border-gray-200 text-gray-700 font-bold py-4 rounded-full hover:bg-gray-50 transition-colors"
        >
          Track Another Order
        </button>
        <button 
          className="flex-1 bg-orange-500 text-white font-bold py-4 rounded-full hover:bg-orange-600 transition-colors"
        >
          Contact Support
        </button>
      </div>
    </div>
  )
}

export default TrackOrderContent
