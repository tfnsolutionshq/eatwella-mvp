import React, { useState, useEffect } from 'react'
import { CheckCircle, Download, User } from 'lucide-react'

function ReceiptDetails() {
  const [timer, setTimer] = useState(1383)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => prev > 0 ? prev - 1 : 0)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

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

        {/* Order ID Box */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6 text-center">
          <p className="text-xs text-gray-500 mb-1">Order ID</p>
          <p className="text-xl font-bold mb-3">#ORD-161662</p>
          <p className="text-xs text-gray-500 mb-1">Expires In</p>
          <p className="text-2xl font-bold text-orange-500">{formatTime(timer)}</p>
        </div>

        {/* Order Details */}
        <div className="mb-6">
          <h3 className="font-semibold mb-4">Order Details</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Order Type</span>
              <span className="text-gray-900">Dine-In</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Customer</span>
              <span className="text-gray-900">John</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Email:</span>
              <span className="text-gray-900">admin@eatw.gov</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Phone:</span>
              <span className="text-gray-900">09023323</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Table:</span>
              <span className="text-gray-900">#12</span>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="border-t pt-4 mb-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-700">1x Mediterranean Chicken Salad</span>
              <span className="text-gray-900">₦12.99</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">1x Chicken Shawarma</span>
              <span className="text-gray-900">₦11.99</span>
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="border-t pt-4 mb-4">
          <div className="flex justify-between font-semibold mb-2">
            <span>Total Payment:</span>
            <span className="text-orange-500">₦24.98</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Mode of Payment:</span>
            <span className="text-orange-500">Cash</span>
          </div>
        </div>

        {/* Download Button */}
        <button className="w-full flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 mb-6">
          <Download className="w-4 h-4" />
          Download Receipt
        </button>

        {/* Account Prompt */}
        <div className="text-center mb-4">
          <p className="text-sm text-gray-600 mb-3">Would you like to create an account to track your orders?</p>
          <button className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 flex items-center justify-center gap-2">
            <User className="w-4 h-4" />
            Create Account
          </button>
        </div>

        {/* Place Another Order */}
        <button className="w-full text-center text-sm font-medium text-gray-700 hover:text-gray-900">
          Place Another Order
        </button>
      </div>
    </div>
  )
}

export default ReceiptDetails
