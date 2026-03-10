import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../DashboardLayout/DashboardLayout'
import { FiArrowLeft, FiPlus, FiMinus, FiTrash2, FiShoppingCart } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import api from '../../utils/api'
import { useToast } from '../../context/ToastContext'

const CreateOrder = () => {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [menus, setMenus] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [cart, setCart] = useState([])
  const [orderType, setOrderType] = useState('pickup')
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    tableNumber: '',
    deliveryAddress: '',
    deliveryCity: '',
    deliveryZip: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchMenus()
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories')
      setCategories(data.data)
    } catch (err) {
      console.error('Failed to fetch categories:', err)
    }
  }

  const fetchMenus = async () => {
    try {
      const { data } = await api.get('/menus')
      setMenus(data.data)
    } catch (err) {
      console.error('Failed to fetch menus:', err)
    }
  }

  const filteredMenus = selectedCategory === 'all' 
    ? menus 
    : menus.filter(menu => menu.category_id === selectedCategory)

  const addToCart = (menu) => {
    const existing = cart.find(item => item.menu.id === menu.id)
    if (existing) {
      setCart(cart.map(item => 
        item.menu.id === menu.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCart([...cart, { menu, quantity: 1 }])
    }
  }

  const updateQuantity = (menuId, quantity) => {
    if (quantity <= 0) {
      setCart(cart.filter(item => item.menu.id !== menuId))
    } else {
      setCart(cart.map(item => 
        item.menu.id === menuId ? { ...item, quantity } : item
      ))
    }
  }

  const removeFromCart = (menuId) => {
    setCart(cart.filter(item => item.menu.id !== menuId))
  }

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (parseFloat(item.menu.price) * item.quantity), 0).toFixed(2)
  }

  const handleCheckout = async () => {
    if (!formData.customerName || !formData.customerEmail) {
      showToast('Please fill in customer details', 'error')
      return
    }

    if (orderType === 'dine' && !formData.tableNumber) {
      showToast('Please enter table number', 'error')
      return
    }

    if (orderType === 'delivery' && (!formData.customerPhone || !formData.deliveryAddress || !formData.deliveryCity)) {
      showToast('Please fill in delivery details', 'error')
      return
    }

    if (cart.length === 0) {
      showToast('Cart is empty', 'error')
      return
    }

    setLoading(true)
    try {
      const orderData = {
        order_type: orderType,
        payment_type: 'cash',
        customer_name: formData.customerName,
        customer_email: formData.customerEmail,
        items: cart.map(item => ({
          menu_id: item.menu.id,
          quantity: item.quantity
        }))
      }

      if (orderType === 'dine') {
        orderData.table_number = formData.tableNumber
      } else if (orderType === 'delivery') {
        orderData.customer_phone = formData.customerPhone
        orderData.delivery_address = formData.deliveryAddress
        orderData.delivery_city = formData.deliveryCity
        orderData.delivery_zip = formData.deliveryZip
      }

      await api.post('/checkout', orderData)
      showToast('Order created successfully!')
      navigate('/admin/orders')
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create order', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 bg-gray-50/50 min-h-full">
        <button 
          onClick={() => navigate('/admin/orders')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <FiArrowLeft />
          <span>Back to Orders</span>
        </button>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Order</h1>
          <p className="text-sm text-gray-500 mt-1">Add items and customer details</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Menu Items</h2>
              
              <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === 'all' 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === category.id 
                        ? 'bg-orange-500 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredMenus.map((menu) => (
                  <div key={menu.id} className="border border-gray-200 rounded-xl hover:border-orange-500 transition-colors">
                    <div className="flex gap-3 p-3">
                      {menu.images && menu.images.length > 0 && (
                        <img
                          src={menu.images[0]}
                          alt={menu.name}
                          className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/80x80' }}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <h3 className="font-bold text-gray-900 text-sm">{menu.name}</h3>
                          <span className="text-sm font-bold text-orange-500 whitespace-nowrap">₦{menu.price}</span>
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2 mb-2">{menu.description}</p>
                        <button
                          onClick={() => addToCart(menu)}
                          className="w-full px-3 py-1.5 bg-orange-500 text-white rounded-lg text-xs font-medium hover:bg-orange-600 transition-colors"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiShoppingCart />
                Cart ({cart.length})
              </h2>
              {cart.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">Cart is empty</p>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.menu.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{item.menu.name}</p>
                        <p className="text-xs text-gray-500">₦{item.menu.price}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.menu.id, item.quantity - 1)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <FiMinus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.menu.id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <FiPlus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.menu.id)}
                          className="p-1 hover:bg-red-50 text-red-500 rounded ml-2"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-900">Total</span>
                      <span className="text-xl font-bold text-orange-500">₦{calculateTotal()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Order Type</label>
                  <select
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none"
                  >
                    <option value="dine">Dine-in</option>
                    <option value="pickup">Pickup</option>
                    <option value="delivery">Delivery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none"
                  />
                </div>

                {orderType === 'delivery' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none"
                    />
                  </div>
                )}

                {orderType === 'dine' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Table Number</label>
                    <input
                      type="text"
                      value={formData.tableNumber}
                      onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none"
                    />
                  </div>
                )}

                {orderType === 'delivery' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address</label>
                      <input
                        type="text"
                        value={formData.deliveryAddress}
                        onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        value={formData.deliveryCity}
                        onChange={(e) => setFormData({ ...formData, deliveryCity: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none"
                      />
                    </div>
                  </>
                )}

                <button
                  onClick={handleCheckout}
                  disabled={loading || cart.length === 0}
                  className="w-full px-4 py-3 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating Order...' : 'Create Order'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default CreateOrder
