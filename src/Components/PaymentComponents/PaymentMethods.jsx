import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Wallet, CreditCard } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import api from '../../utils/api'

function PaymentMethods() {
  const navigate = useNavigate()
  const location = useLocation()
  const { cart, fetchCart, clearCart } = useCart() 
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState(null)

  const orderData = location.state?.orderData
  
  // Redirect back if no order data
  if (!orderData) {
    navigate('/cart')
    return null
  }

  const cartItems = cart?.items || []
  const subtotal = cart?.subtotal ? Number(cart.subtotal) : cartItems.reduce((sum, item) => sum + (Number(item.menu.price) * item.quantity), 0)
  const deliveryFee = orderData.order_type === 'delivery' ? 3.99 : 0
  const discountAmount = Number(cart?.discount_amount || 0)
  const originalTotal = subtotal + deliveryFee
  const total = originalTotal - discountAmount

  const handlePayment = async () => {
    if (!selectedMethod) return

    setIsProcessing(true)
    try {
      const payload = {
        ...orderData,
        payment_type: selectedMethod === 'online' ? 'gateway' : 'cash',
        callback_url: `${window.location.origin}/receipt`
      }

      console.log('Placing order with payload:', payload)
      const response = await api.post('/checkout', payload)
      console.log('Order success:', response.data)

      if (selectedMethod === 'online') {
        if (response.data.payment?.authorization_url) {
          window.location.href = response.data.payment.authorization_url
        } else {
          alert('Failed to initialize payment gateway')
        }
      } else {
        const createdOrder = response.data.order
        const id = createdOrder?.order_number || createdOrder?.id
        if (clearCart) {
          clearCart()
        }
        navigate(id ? `/receipt/${id}` : '/receipt', { state: { order: createdOrder } })
      }
      
    } catch (error) {
      console.error('Payment error:', error)
      alert(error.response?.data?.message || 'Failed to process payment')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Payment Methods */}
        <div>
          <h2 className="text-lg font-normal mb-6">How would you like to pay?</h2>
          
          <div className="space-y-3">
            <button
              onClick={() => setSelectedMethod('cash')}
              disabled={isProcessing}
              className={`w-full p-4 bg-white border rounded-lg text-left transition disabled:opacity-50 disabled:cursor-not-allowed ${
                selectedMethod === 'cash' ? 'border-orange-500 ring-1 ring-orange-500' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center mb-1">
                <Wallet className={`w-5 h-5 mr-2 ${selectedMethod === 'cash' ? 'text-orange-500' : 'text-gray-400'}`} />
                <span className="font-semibold text-gray-900">Cash</span>
              </div>
              <p className="text-sm text-gray-500">Pay with cash at the restaurant</p>
            </button>

            <button
              onClick={() => setSelectedMethod('online')}
              disabled={isProcessing}
              className={`w-full p-4 bg-white border rounded-lg text-left transition disabled:opacity-50 disabled:cursor-not-allowed ${
                selectedMethod === 'online' ? 'border-orange-500 ring-1 ring-orange-500' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center mb-1">
                <CreditCard className={`w-5 h-5 mr-2 ${selectedMethod === 'online' ? 'text-orange-500' : 'text-gray-400'}`} />
                <span className="font-semibold text-gray-900">Online Payment</span>
              </div>
              <p className="text-sm text-gray-500">Pay online using a credit/debit card</p>
            </button>
          </div>
          {isProcessing && <p className="mt-4 text-center text-orange-500">Processing payment...</p>}
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 h-fit">
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900">₦{subtotal.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount</span>
                <span>-₦{discountAmount.toFixed(2)}</span>
              </div>
            )}
            {deliveryFee > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="text-gray-900">₦{deliveryFee.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t pt-4 flex justify-between">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="font-bold text-orange-500">₦{total.toFixed(2)}</span>
            </div>

            <button
              onClick={handlePayment}
              disabled={!selectedMethod || isProcessing}
              className="w-full mt-6 py-3 rounded-lg bg-orange-500 text-white font-bold hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
              {isProcessing 
                ? 'Processing...' 
                : selectedMethod === 'online' 
                  ? 'Pay Now' 
                  : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentMethods
