import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useCart } from '../../context/CartContext'
import { useToast } from '../../context/ToastContext'
import { Link } from 'react-router-dom'
import CustomizeMenu from '../CartComponents/CustomizeMenu'

function Menu() {
  const [activeTab, setActiveTab] = useState('all')
  const [categories, setCategories] = useState([])
  const [menuItems, setMenuItems] = useState([])
  const [allMenus, setAllMenus] = useState([])
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const { addToCart, loadingItems } = useCart()
  const { showToast } = useToast()

  useEffect(() => {
    fetchCategories()
    fetchMenuItems()
  }, [])

  useEffect(() => {
    fetchMenuItems(activeTab)
  }, [activeTab])

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get('https://api.eatwella.ng/api/categories', {
        headers: { 'Accept': 'application/json' }
      })
      setCategories(data.data)
    } catch (err) {
      console.error('Failed to fetch categories:', err)
    }
  }

  const fetchMenuItems = async (categoryId = 'all') => {
    try {
      const url = categoryId === 'all'
        ? 'https://api.eatwella.ng/api/menus'
        : `https://api.eatwella.ng/api/menus?category_id=${categoryId}`
      const { data } = await axios.get(url, {
        headers: { 'Accept': 'application/json' }
      })
      setMenuItems(data.data)
      if (categoryId === 'all') {
        setAllMenus(data.data)
      }
    } catch (err) {
      console.error('Failed to fetch menu items:', err)
    }
  }

  const handleAddToCart = async (item) => {
    const result = await addToCart(item.id, 1)
    if (result) {
      showToast(`${item.name} added to cart!`, 'success')
      setSelectedItem(item)
      setIsCustomizeOpen(true)
    } else {
      showToast('Failed to add to cart', 'error')
    }
  }

  const handleAddExtra = async (item) => {
    const result = await addToCart(item.id, 1)
    if (result) {
      showToast(`${item.name} added to cart!`, 'success')
    } else {
      showToast('Failed to add to cart', 'error')
    }
    return result
  }

  return (
    <div className="bg-black text-white py-16 relative">
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <h2 className="text-4xl font-bolota md:text-6xl font-black mb-8">
          MENU WEY SIZE YOUR<br />POCKET
        </h2>

        <div className="flex gap-3 mb-12 flex-wrap">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-1 rounded-full font-medium transition-colors ${activeTab === 'all' ? 'bg-orange-500 text-white' : 'bg-white text-black hover:bg-gray-200'}`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`px-6 py-1 rounded-full font-medium transition-colors ${activeTab === cat.id ? 'bg-orange-500 text-white' : 'bg-white text-black hover:bg-gray-200'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {menuItems.length > 3 ? (
        <div className="relative mb-8 overflow-hidden w-full">
          <div className="flex gap-6 animate-marquee">
              {[...menuItems, ...menuItems].map((item, idx) => (
                <div key={`${item.id}-${idx}`} className="bg-white rounded-3xl overflow-hidden text-black min-w-[260px] md:min-w-[320px] hover-zoom">
                  <img
                    src={item.images?.[0] || 'https://via.placeholder.com/400x300'}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-xl font-semibold">{item.name}</h3>
                      <span className="text-orange-500 font-black text-xl">₦{item.price}</span>
                    </div>
                    <p className="text-gray-600 mb-4">{item.description}</p>
                    <button onClick={() => handleAddToCart(item)} disabled={loadingItems[item.id]} className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-full font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                      {loadingItems[item.id] ? <span className="spinner" /> : null}
                      {loadingItems[item.id] ? 'Adding...' : 'Add To Cart'}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {menuItems.map((item) => (
              <div key={item.id} className="bg-white rounded-3xl overflow-hidden text-black hover-zoom">
                <img
                  src={item.images?.[0] || 'https://via.placeholder.com/400x300'}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-semibold">{item.name}</h3>
                    <span className="text-orange-500 font-black text-xl">₦{item.price}</span>
                  </div>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <button onClick={() => handleAddToCart(item)} disabled={loadingItems[item.id]} className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-full font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                    {loadingItems[item.id] ? <span className="spinner" /> : null}
                    {loadingItems[item.id] ? 'Adding...' : 'Add To Cart'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-8">
          <Link to="/menu" className="block">
            <button className="border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-black transition-colors">
              Satisfy Your Cravings →
            </button>
          </Link>
        </div>
      </div>

      <CustomizeMenu
        isOpen={isCustomizeOpen}
        onClose={() => setIsCustomizeOpen(false)}
        baseItem={selectedItem}
        allMenus={allMenus.length ? allMenus : menuItems}
        onAddExtra={handleAddExtra}
      />

      {/* Repeating Background Pattern */}
      <div className="absolute bottom-0 left-0 right-0 h-8 flex overflow-hidden opacity-50">
        {[...Array(20)].map((_, i) => (
          <img
            key={i}
            src="/src/assets/Frame 24.png"
            alt=""
            className="h-full w-auto flex-shrink-0"
          />
        ))}
      </div>
    </div>
  )
}

export default Menu
