import React from 'react'
import { MdRestaurant } from 'react-icons/md'
import { FiShoppingCart } from 'react-icons/fi'

function Header() {
  return (
    <div className="bg-gradient-to-br from-green-600 to-green-700 min-h-screen relative overflow-hidden">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <MdRestaurant className="w-6 h-6 text-green-600" />
          </div>
          <span className="text-2xl font-bold text-white">EATWELLA</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <a href="#home" className="text-white hover:text-green-100 transition-colors">Home</a>
          <a href="#menu" className="text-white hover:text-green-100 transition-colors">Menu</a>
          <a href="#contact" className="text-white hover:text-green-100 transition-colors">Contact Us</a>
          <a href="#meal-plans" className="text-white hover:text-green-100 transition-colors">Meal Plans</a>
          <a href="#track" className="text-white hover:text-green-100 transition-colors">Track Order</a>
          <a href="#loyalty" className="text-white hover:text-green-100 transition-colors">Loyalty Board</a>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full flex items-center gap-2 transition-colors">
            <FiShoppingCart className="w-5 h-5" />
            <span>0</span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
              TRY DEY<br />
              EATWELLA,<br />
              NO LOOSE GUARD
            </h1>
            <p className="text-xl text-white mb-8">Eat on the Go. Good food. Great Taste.</p>
            <div className="flex gap-4">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-medium transition-colors">
                Eat Now
              </button>
              <button className="bg-green-800 hover:bg-green-900 text-white px-8 py-3 rounded-full font-medium transition-colors">
                Call Us
              </button>
            </div>
          </div>

          {/* Right Content - Images */}
          <div className="relative">
            {/* Decorative Blobs */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-400 rounded-full opacity-60 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-orange-500 rounded-full opacity-40 blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white rounded-full opacity-20"></div>
            
            {/* Main Image Container */}
            <div className="relative z-10">
              <img 
                src="/api/placeholder/500/500" 
                alt="Happy couple" 
                className="w-full rounded-3xl shadow-2xl"
              />
              
              {/* Chicken Dish Overlay */}
              <div className="absolute -top-8 -right-8 w-40 h-40 bg-white rounded-full shadow-2xl p-4">
                <img 
                  src="/api/placeholder/150/150" 
                  alt="Roasted chicken" 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-20 h-20 bg-orange-400 rounded-full opacity-30"></div>
      <div className="absolute bottom-40 left-10 w-32 h-32 bg-orange-500 rounded-full opacity-20"></div>
      <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white rounded-full opacity-10"></div>
    </div>
  )
}

export default Header