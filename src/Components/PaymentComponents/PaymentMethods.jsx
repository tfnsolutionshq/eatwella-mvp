import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Wallet, CreditCard } from 'lucide-react'

function PaymentMethods() {
  const navigate = useNavigate()
  const [selectedMethod, setSelectedMethod] = useState(null)
  const subtotal = 27.98
  const total = 27.98

  const handlePaymentSelect = (method) => {
    setSelectedMethod(method)
    navigate('/receipt')
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Payment Methods */}
        <div>
          <h2 className="text-lg font-normal mb-6">How would you like to pay?</h2>
          
          <div className="space-y-3">
            <button
              onClick={() => handlePaymentSelect('cash')}
              className="w-full p-4 bg-white border border-gray-200 rounded-lg text-left hover:border-gray-300 transition"
            >
              <div className="flex items-center mb-1">
                <Wallet className="w-5 h-5 text-orange-500 mr-2" />
                <span className="font-semibold text-gray-900">Cash</span>
              </div>
              <p className="text-sm text-gray-500">Pay with cash at the restaurant</p>
            </button>

            <button
              onClick={() => handlePaymentSelect('online')}
              className="w-full p-4 bg-white border border-gray-200 rounded-lg text-left hover:border-gray-300 transition"
            >
              <div className="flex items-center mb-1">
                <CreditCard className="w-5 h-5 text-orange-500 mr-2" />
                <span className="font-semibold text-gray-900">Online Payment</span>
              </div>
              <p className="text-sm text-gray-500">Pay online using a credit/debit card</p>
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 h-fit">
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900">₦{subtotal.toFixed(2)}</span>
            </div>
            <div className="border-t pt-4 flex justify-between">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="font-bold text-orange-500">₦{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentMethods
