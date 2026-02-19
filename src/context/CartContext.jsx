import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const CartContext = createContext(null)

// Helper to get or generate a random Cart ID
const getCartId = () => {
  let cartId = localStorage.getItem('eatwella_cart_id')
  if (!cartId) {
    // Generate a random 40-character string similar to the example
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    cartId = Array.from({ length: 40 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('')
    localStorage.setItem('eatwella_cart_id', cartId)
  }
  return cartId
}

const cartApi = axios.create({
  baseURL: 'https://api.eatwella.ng/api',
  headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
  withCredentials: true
})

// Add interceptor to inject X-Cart-ID header
cartApi.interceptors.request.use((config) => {
  const cartId = getCartId()
  if (cartId) {
    config.headers['X-Cart-ID'] = cartId
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('eatwella_cart')
      return savedCart ? JSON.parse(savedCart) : null
    } catch (err) {
      console.error('Failed to load cart from local storage:', err)
      return null
    }
  })
  const [loadingItems, setLoadingItems] = useState({})

  useEffect(() => {
    if (cart) {
      localStorage.setItem('eatwella_cart', JSON.stringify(cart))
    }
  }, [cart])

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const { data } = await cartApi.get('/cart')
      console.log('✅ Fetched cart:', data)
      if (!data.items || data.items.length === 0) {
        console.log('ℹ️ Server cart empty. Clearing local cart for sync.')
        clearCart()
      } else {
        setCart(data)
      }
    } catch (err) {
      console.error('Failed to fetch cart:', err)
      // If cart endpoint indicates not found/empty, sync local as empty too
      if (err.response && (err.response.status === 404 || err.response.status === 204)) {
        clearCart()
      }
    }
  }

  const addToCart = async (menuId, quantity = 1) => {
    setLoadingItems(prev => ({ ...prev, [menuId]: true }))
    try {
      // Ensure we are sending the request with credentials to maintain the session
      const { data } = await cartApi.post('/cart', { menu_id: menuId, quantity })
      console.log('✅ Added to cart:', data)
      
      // If the API returns the updated cart directly, use it to set state
      // This is crucial if the POST response returns the NEW session's cart state
      if (data && data.items) {
          console.log('🔄 Updating cart from POST response directly')
          setCart(data)
      } else {
          // Fallback to fetching if response structure is different
          await fetchCart()
      }
      
      return true
    } catch (err) {
      console.error('Failed to add to cart:', err)
      return null
    } finally {
      setLoadingItems(prev => ({ ...prev, [menuId]: false }))
    }
  }

  const updateCartItem = async (cartItemId, quantity) => {
    try {
      // Ensure we are sending the request with credentials to maintain the session
      // Using /cart/{id} endpoint with PUT method
      const { data } = await cartApi.put(`/cart/${cartItemId}`, { quantity })
      console.log('✅ Updated cart item:', data)
      
      // Update local state with the returned cart data if it looks valid
      if (data && data.items) {
        setCart(data)
      } else {
        await fetchCart()
      }
      return true
    } catch (err) {
      console.error('Failed to update cart item:', err)
      // If the item or cart is not found (404), or any other error, 
      // refresh the cart to ensure UI is in sync with server
      await fetchCart()
      return false
    }
  }

  const removeFromCart = async (cartItemId) => {
    try {
      // Using /cart/{id} endpoint with DELETE method
      const { data } = await cartApi.delete(`/cart/${cartItemId}`)
      console.log('✅ Removed from cart:', data)
      
      // Update local state with the returned cart data if it looks valid
      if (data && data.items) {
        setCart(data)
      } else {
        await fetchCart()
      }
      return true
    } catch (err) {
      console.error('Failed to remove from cart:', err)
      // Refresh cart on failure to sync state
      await fetchCart()
      return false
    }
  }

  const applyDiscount = async (code) => {
    try {
      const { data } = await cartApi.post('/cart/apply-discount', { code })
      console.log('✅ Discount applied:', data)
      
      // Handle response structure: { message: "...", cart: { ... } }
      if (data && data.cart && data.cart.items) {
        setCart(data.cart)
      } else if (data && data.items) {
        // Fallback for direct cart return
        setCart(data)
      } else {
        // Otherwise fetch the full cart to be safe
        await fetchCart()
      }
      return { success: true, message: data.message || 'Discount applied successfully' }
    } catch (err) {
      console.error('Failed to apply discount:', err)
      const message = err.response?.data?.message || 'Failed to apply discount'
      return { success: false, message }
    }
  }

  const removeDiscount = async () => {
    try {
      const { data } = await cartApi.delete('/cart/remove-discount')
      console.log('✅ Discount removed:', data)
      if (data && data.items) {
        setCart(data)
      } else if (data && data.cart && data.cart.items) {
        setCart(data.cart)
      } else {
        await fetchCart()
      }
      return { success: true }
    } catch (err) {
      console.error('Failed to remove discount:', err)
      await fetchCart()
      return { success: false, message: err.response?.data?.message || 'Failed to remove discount' }
    }
  }

  const cartItemCount = cart?.total_items || cart?.items?.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0) || 0

  const clearCart = () => {
    setCart({ items: [] })
    try {
      localStorage.removeItem('eatwella_cart')
    } catch (err) {
      console.error('Failed to clear cart from local storage:', err)
    }
  }

  console.log('🛍️ Current cart item count:', cartItemCount)

  return (
    <CartContext.Provider value={{ cart, addToCart, updateCartItem, removeFromCart, applyDiscount, removeDiscount, fetchCart, loadingItems, cartItemCount, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
