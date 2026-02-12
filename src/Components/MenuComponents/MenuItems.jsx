import React, { useState } from 'react'

function MenuItems() {
  const [activeTab, setActiveTab] = useState('All')
  
  const tabs = ['All', 'Soups', 'Salads', 'Pasta', 'Pizzas']
  
  const menuItems = [
    { id: 1, name: 'Ofe Egwusi', price: 'N390.0', description: 'Fresh soup Fresh soup Fresh soup Fresh soup Fresh soup Fresh soup Fresh soup Fresh soup', category: 'Soups', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400' },
    { id: 2, name: 'Ofe Egwusi', price: 'N390.0', description: 'Fresh soup Fresh soup Fresh soup Fresh soup Fresh soup Fresh soup Fresh soup Fresh soup', category: 'Soups', image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400' },
    { id: 3, name: 'Ofe Egwusi', price: 'N390.0', description: 'Fresh soup Fresh soup Fresh soup Fresh soup Fresh soup Fresh soup Fresh soup Fresh soup', category: 'Soups', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400' },
    { id: 4, name: 'Ofe Egwusi', price: 'N390.0', description: 'Fresh soup Fresh soup Fresh soup Fresh soup Fresh soup Fresh soup Fresh soup Fresh soup', category: 'Soups', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400' },
    { id: 5, name: 'Ofe Egwusi', price: 'N390.0', description: 'Fresh soup Fresh soup Fresh soup Fresh soup Fresh soup Fresh soup Fresh soup Fresh soup', category: 'Soups', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400' },
    { id: 6, name: 'Ofe Egwusi', price: 'N390.0', description: 'Fresh soup Fresh soup Fresh soup Fresh soup Fresh soup Fresh soup Fresh soup Fresh soup', category: 'Soups', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400' },
  ]

  const filteredItems = activeTab === 'All' ? menuItems : menuItems.filter(item => item.category === activeTab)

  return (
    <div className="bg-white py-16 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Tabs */}
        <div className="flex gap-3 mb-12 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full font-bold transition-colors ${
                activeTab === tab 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-gray-200 text-black hover:bg-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-200">
              <img 
                src={item.image} 
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xl font-black">{item.name}</h3>
                  <span className="text-orange-500 font-black text-xl">{item.price}</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-full font-bold transition-colors">
                  Add To Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MenuItems
