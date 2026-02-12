import React from 'react'
import Navbar from './Navbar'

function Header() {
  return (
    <div className="bg-gradient-to-br from-green-600 to-green-700 min-h-screen relative overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-6 py-32 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
              TRY DEY<br />
              EATWELLA,<br />
              NO LOOSE GUARD
            </h1>
            <p className="text-xl text-white mb-8">Eat on the Go. Good food. Great Taste.</p>
            <div className="flex gap-4">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-bold transition-colors">
                Eat Now
              </button>
              <button className="bg-green-800 hover:bg-green-900 text-white px-8 py-3 rounded-full font-bold transition-colors">
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