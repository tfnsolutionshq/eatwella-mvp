import React, { useState } from 'react'

function Menu() {
  const [activeTab, setActiveTab] = useState('All')
  
  const tabs = ['All', 'Soups', 'Salads', 'Pasta', 'Pizzas']
  
  const menuItems = [
    { id: 1, name: 'Ofe Egwusi', price: 'N390.0', description: 'Fresh soup Fresh soup Fresh soup Fresh soup Fresh soup Fresh soup Fresh soup Fresh soup', category: 'Soups', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400' },
    { id: 2, name: 'Ofe Egwusi', price: 'N390.0', description: 'Fresh soup Fresh soup Fresh soup Fresh soup Fresh soup Fresh soup Fresh soup Fresh soup', category: 'Soups', image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400' },
    { id: 3, name: 'Ofe Egwusi', price: 'N390.0', description: 'Fresh soup Fresh soup Fresh soup Fresh soup Fresh soup Fresh soup Fresh soup Fresh soup', category: 'Soups', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400' },
  ]

  const filteredItems = activeTab === 'All' ? menuItems : menuItems.filter(item => item.category === activeTab)

  return (
    <div className="bg-black text-white py-16 px-6 relative">
      <div className="max-w-5xl mx-auto relative z-10">
        <h2 className="text-4xl md:text-5xl font-black mb-8">
          MENU WEY SIZE YOUR<br />POCKET
        </h2>
        
        <div className="flex gap-3 mb-12 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full font-bold transition-colors ${
                activeTab === tab 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-white text-black hover:bg-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-3xl overflow-hidden text-black">
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

        <div className="text-center mb-8">
          <button className="border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-black transition-colors">
            Satisfy Your Cravings →
          </button>
        </div>
      </div>
      
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
