import React, { useState, useEffect } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { useNavigate, useLocation } from 'react-router-dom'

function OrderTypeForm() {
  const navigate = useNavigate()
  const location = useLocation()
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

  const orderSummary = [
    { name: '1x Mediterranean Chicken Salad', price: 12.99 },
    { name: '1x Penne Arrabbiata', price: 11.99 }
  ]

  const subtotal = orderSummary.reduce((sum, item) => sum + item.price, 0)
  const deliveryFee = orderType === 'delivery' ? 3.99 : 0
  const vat = 0
  const total = subtotal + deliveryFee + vat

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = () => {
    console.log('Order placed:', formData)
  }

  return (
    <div className="bg-gray-50 py-12 px-6 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <button 
          onClick={() => navigate('/cart')}
          className="flex items-center gap-2 text-gray-600 mb-8 hover:text-gray-800"
        >
          <FaArrowLeft />
          <span>Back</span>
        </button>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Form Section */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold mb-2">Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 234 567 8900"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* Dine-in specific field */}
            {orderType === 'dine-in' && (
              <div>
                <label className="block text-sm font-bold mb-2">Table Number *</label>
                <input
                  type="text"
                  name="tableNumber"
                  value={formData.tableNumber}
                  onChange={handleChange}
                  placeholder="e.g., 12"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>
            )}

            {/* Delivery specific fields */}
            {orderType === 'delivery' && (
              <>
                <div>
                  <label className="block text-sm font-bold mb-2">Delivery Address *</label>
                  <input
                    type="text"
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleChange}
                    placeholder="Street address, apt/suite"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="City"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">ZIP Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      placeholder="12345"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-3xl p-6 h-fit">
            <h3 className="font-black text-xl mb-6">Order Summary</h3>
            
            <div className="space-y-4 mb-6">
              {orderSummary.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-gray-700">{item.name}</span>
                  <span className="font-bold">₦{item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 mb-6 pt-4 border-t border-gray-200">
              {orderType === 'delivery' && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee:</span>
                  <span className="font-bold">₦{deliveryFee.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">VAT:</span>
                <span className="font-bold">₦{vat.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200 mb-6">
              <span className="font-black text-xl">Total Paid:</span>
              <span className="font-black text-2xl text-orange-500">₦{total.toFixed(2)}</span>
            </div>

            <button 
              onClick={handleSubmit}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-full font-bold transition-colors"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderTypeForm
