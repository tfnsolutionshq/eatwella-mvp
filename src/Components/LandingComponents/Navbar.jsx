import React from 'react'
import { FiShoppingCart } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import logo from '../../assets/eatwellalogo.png'

function Navbar() {
  const navigate = useNavigate()

  return (
    <nav className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between relative z-10">
      <div className="flex items-center gap-2">
        <img src={logo} alt="Eatwella Logo" className=" h-9" />
      </div>
      
      <div className="hidden md:flex items-center gap-8">
        <a href="/" className="text-white hover:text-green-100 transition-colors">Home</a>
        <a href="/menu" className="text-white hover:text-green-100 transition-colors">Menu</a>
        <a href="/meal-plans" className="text-white hover:text-green-100 transition-colors">Meal Plans</a>
        <a href="/loyalty-board" className="text-white hover:text-green-100 transition-colors">Loyalty Board</a>
        <a href="#track" className="text-white hover:text-green-100 transition-colors">Track Order</a>
        <a href="#contact" className="text-white hover:text-green-100 transition-colors">Contact Us</a>
        <button 
          onClick={() => navigate('/cart')}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full flex items-center gap-2 transition-colors"
        >
          <FiShoppingCart className="w-5 h-5" />
          <span>0</span>
        </button>
      </div>
    </nav>
  )
}

export default Navbar
