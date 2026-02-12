import React, { useState } from 'react'
import { FaArrowLeft, FaTimes } from 'react-icons/fa'
import { MdHome, MdRestaurant, MdDeliveryDining } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

function CartItems() {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Grilled Salmon Bowl', price: 14.99, quantity: 1, image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400' },
    { id: 2, name: 'Grilled Salmon Bowl', price: 14.99, quantity: 1, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400' },
    { id: 3, name: 'Grilled Salmon Bowl', price: 14.99, quantity: 1, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400' },
    { id: 4, name: 'Grilled Salmon Bowl', price: 14.99, quantity: 1, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400' },
  ])

  const [selectedOrderType, setSelectedOrderType] = useState('dine-in')
  const [discountCode, setDiscountCode] = useState('')

  const updateQuantity = (id, change) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
    ))
  }

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const deliveryFee = selectedOrderType === 'delivery' ? 3.99 : 0
  const total = subtotal + deliveryFee

  return (
    <div className="bg-gray-50 py-12 px-6 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <button className="flex items-center gap-2 text-gray-600 mb-8 hover:text-gray-800">
          <FaArrowLeft />
          <span>Back</span>
        </button>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Cart Items */}
          <div className="bg-white rounded-3xl p-6 h-fit">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200 last:border-0">
                <img src={item.image} alt={item.name} className="w-20 h-20 rounded-2xl object-cover" />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                  <p className="text-gray-500 text-sm mb-2">₦{item.price.toFixed(2)} each</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 bg-gray-200 rounded-full px-3 py-1">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-6 h-6 flex items-center justify-center hover:text-orange-500 font-bold"
                      >
                        −
                      </button>
                      <span className="font-bold px-2">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-6 h-6 flex items-center justify-center hover:text-orange-500 font-bold"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-orange-500 font-black">₦{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
                <button 
                  onClick={() => removeItem(item.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <FaTimes />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-3xl p-6 mb-6">
              <h3 className="font-black text-xl mb-6">Select Order Type</h3>
              
              <div 
                onClick={() => setSelectedOrderType('dine-in')}
                className={`p-4 rounded-2xl mb-4 cursor-pointer border-2 transition-colors ${
                  selectedOrderType === 'dine-in' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <MdHome className="text-orange-500 text-2xl" />
                  <div>
                    <h4 className="font-bold">Dine-in</h4>
                    <p className="text-sm text-gray-600">Enjoy your meal at our restaurant</p>
                  </div>
                </div>
              </div>

              <div 
                onClick={() => setSelectedOrderType('pickup')}
                className={`p-4 rounded-2xl mb-4 cursor-pointer border-2 transition-colors ${
                  selectedOrderType === 'pickup' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <MdRestaurant className="text-orange-500 text-2xl" />
                  <div>
                    <h4 className="font-bold">Pickup</h4>
                    <p className="text-sm text-gray-600">Pickup your order from the restaurant</p>
                  </div>
                </div>
              </div>

              <div 
                onClick={() => setSelectedOrderType('delivery')}
                className={`p-4 rounded-2xl mb-4 cursor-pointer border-2 transition-colors ${
                  selectedOrderType === 'delivery' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <MdDeliveryDining className="text-orange-500 text-2xl" />
                  <div>
                    <h4 className="font-bold">Delivery</h4>
                    <p className="text-sm text-gray-600">We'll deliver to your address</p>
                    {selectedOrderType === 'delivery' && (
                      <p className="text-sm text-orange-500 mt-1">Delivery fee: ₦{deliveryFee.toFixed(2)}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6">
              <h3 className="font-black text-xl mb-4">Discount Code</h3>
              <div className="flex gap-2 mb-6">
                <input 
                  type="text"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  placeholder="23AD"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-orange-500"
                />
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-bold transition-colors">
                  Apply
                </button>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-bold">₦{subtotal.toFixed(2)}</span>
                </div>
                {selectedOrderType === 'delivery' && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-bold">₦{deliveryFee.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-200 mb-6">
                <span className="font-black text-xl">Total</span>
                <span className="font-black text-2xl text-orange-500">₦{total.toFixed(2)}</span>
              </div>

              <button 
                onClick={() => navigate('/order-type', { state: { orderType: selectedOrderType } })}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-full font-bold transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartItems
