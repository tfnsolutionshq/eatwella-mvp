import React, { useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import api from '../../utils/api'

function OrderTypeForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const { cart } = useCart()
  const orderType = location.state?.orderType || 'pickup'
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    tableNumber: '',
    deliveryAddress: '',
    city: '',
    zipCode: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const cartItems = cart?.items || []

  const subtotal = cart?.subtotal ? Number(cart.subtotal) : cartItems.reduce((sum, item) => sum + (Number(item.menu.price) * item.quantity), 0)
  const deliveryFee = orderType === 'delivery' ? 3.99 : 0
  const discountAmount = Number(cart?.discount_amount || 0)
  const originalTotal = subtotal + deliveryFee
  const total = originalTotal - discountAmount

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = () => {
    // Validate form data
    if (!formData.fullName || !formData.email || !formData.phone) {
      alert('Please fill in all required fields')
      return
    }

    if (orderType === 'dine-in' && !formData.tableNumber) {
      alert('Please enter your table number')
      return
    }

    if (orderType === 'delivery' && (!formData.deliveryAddress || !formData.city || !formData.zipCode)) {
      alert('Please fill in delivery details')
      return
    }

    // Construct payload for next step
    const orderData = {
      order_type: orderType === 'dine-in' ? 'dine' : orderType,
      customer_name: formData.fullName,
      customer_email: formData.email,
      customer_phone: formData.phone,
      items: cartItems.map(item => ({
        menu_id: item.menu.id,
        quantity: item.quantity
      }))
    }

    if (orderType === 'dine-in') {
      orderData.table_number = formData.tableNumber
    } else if (orderType === 'delivery') {
      orderData.delivery_address = formData.deliveryAddress
      orderData.delivery_city = formData.city
      orderData.delivery_zip = formData.zipCode
    }

    navigate('/payment', { state: { orderData } })
  }

  return (
    <div className="bg-gray-50 py-12 px-4 md:px-6 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <button 
          onClick={() => navigate('/cart')}
          className="flex items-center gap-2 text-gray-600 mb-8 hover:text-gray-800"
        >
          <FaArrowLeft />
          <span>Back</span>
        </button>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-start">
          {/* Form Section */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-6">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 234 567 8900"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Dine-in specific field */}
            {orderType === 'dine-in' && (
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Table Number *</label>
                <input
                  type="text"
                  name="tableNumber"
                  value={formData.tableNumber}
                  onChange={handleChange}
                  placeholder="e.g., 12"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            )}

            {/* Delivery specific fields */}
            {orderType === 'delivery' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Delivery Address *</label>
                  <input
                    type="text"
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleChange}
                    placeholder="Street address, apt/suite"
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="City"
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">ZIP Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      placeholder="12345"
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-3xl p-6 md:p-8 h-fit border border-gray-100 shadow-sm">
            <h3 className="font-black text-xl mb-6">Order Summary</h3>
            
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span className="text-gray-700">{item.quantity}x {item.menu?.name}</span>
                  <span className="font-bold">₦{Number(item.menu?.price).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 mb-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-bold">₦{subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount:</span>
                  <span className="font-bold">-₦{discountAmount.toFixed(2)}</span>
                </div>
              )}
              {orderType === 'delivery' && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee:</span>
                  <span className="font-bold">₦{deliveryFee.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200 mb-6">
              <span className="font-black text-xl">Total Paid:</span>
              <span className="font-black text-2xl text-orange-500">₦{total.toFixed(2)}</span>
            </div>

            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white py-4 rounded-full font-bold transition-colors"
            >
              {isSubmitting ? 'Processing...' : 'Proceed to Checkout'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderTypeForm
