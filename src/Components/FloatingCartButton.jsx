import React from 'react'
import { FiShoppingCart } from 'react-icons/fi'
import { useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function FloatingCartButton() {
  const navigate = useNavigate()
  const location = useLocation()
  const { cartItemCount } = useCart()

  // Pages where the floating cart should NOT appear
  const excludedPaths = ['/payment', '/order-type', '/receipt']
  
  // Also exclude admin pages
  const isExcluded = excludedPaths.includes(location.pathname) || location.pathname.startsWith('/receipt') || location.pathname.startsWith('/admin')

  if (isExcluded) {
    return null
  }

  return (
    <button
      onClick={() => navigate('/cart')}
      className="fixed right-0 top-1/2 transform -translate-y-1/2 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-l-xl shadow-lg z-50 transition-colors"
      aria-label="View Cart"
    >
      <div className="flex flex-col items-center gap-1 animate-bounce-stay">
        <div className="relative">
          <FiShoppingCart className="w-6 h-6" />
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-white text-orange-500 text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-orange-500">
              {cartItemCount}
            </span>
          )}
        </div>
        <span className="text-xs font-medium writing-mode-vertical text-orientation-upright hidden md:block">Cart</span>
      </div>
    </button>
  )
}

export default FloatingCartButton
