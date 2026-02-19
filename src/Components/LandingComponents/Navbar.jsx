import React, { useState } from 'react'
import { FiMenu, FiX } from 'react-icons/fi'
import { Link, NavLink } from 'react-router-dom'
import logo from '../../assets/eatwellalogo.png'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <nav className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between relative z-50">
      <Link to="/" className="flex items-center gap-2">
        <img src={logo} alt="Eatwella Logo" className=" h-9" />
      </Link>
      
      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-8">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `text-white font-medium transition-colors hover:text-green-100 inline-flex px-3 py-1 rounded-full ${isActive ? 'ring-2 ring-white' : ''}`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/menu"
          className={({ isActive }) =>
            `text-white font-medium transition-colors hover:text-green-100 inline-flex px-3 py-1 rounded-full ${isActive ? 'ring-2 ring-white' : ''}`
          }
        >
          Menu
        </NavLink>
        <NavLink
          to="/meal-plans"
          className={({ isActive }) =>
            `text-white font-medium transition-colors hover:text-green-100 inline-flex px-3 py-1 rounded-full ${isActive ? 'ring-2 ring-white' : ''}`
          }
        >
          Meal Plans
        </NavLink>
        {/* <Link to="/loyalty-board" className="text-white hover:text-green-100 font-medium transition-colors">Loyalty Board</Link> */}
        <NavLink
          to="/track-order"
          className={({ isActive }) =>
            `text-white font-medium transition-colors hover:text-green-100 inline-flex px-3 py-1 rounded-full ${isActive ? 'ring-2 ring-white' : ''}`
          }
        >
          Track Order
        </NavLink>
        <Link to="#contact" className="text-white hover:text-green-100 font-medium transition-colors">Contact Us</Link>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center gap-4">
        <button onClick={toggleMenu} className="text-white p-2">
          {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div className={`fixed top-0 right-0 h-full w-64 bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full p-6">
          <div className="flex justify-between items-center mb-8">
            <img src={logo} alt="Eatwella Logo" className="h-8" />
            <button onClick={() => setIsMenuOpen(false)} className="text-gray-500 hover:text-gray-700">
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-col gap-6">
            <NavLink 
              to="/" 
              end
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `text-gray-800 hover:text-orange-500 font-medium text-lg transition-colors inline-flex px-3 py-1 rounded-full ${isActive ? 'ring-2 ring-white' : ''}`
              }
            >
              Home
            </NavLink>
            <NavLink 
              to="/menu" 
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `text-gray-800 hover:text-orange-500 font-medium text-lg transition-colors inline-flex px-3 py-1 rounded-full ${isActive ? 'ring-2 ring-white' : ''}`
              }
            >
              Menu
            </NavLink>
            <NavLink 
              to="/meal-plans" 
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `text-gray-800 hover:text-orange-500 font-medium text-lg transition-colors inline-flex px-3 py-1 rounded-full ${isActive ? 'ring-2 ring-white' : ''}`
              }
            >
              Meal Plans
            </NavLink>
            {/* <Link 
              to="/loyalty-board" 
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-800 hover:text-orange-500 font-medium text-lg transition-colors"
            >
              Loyalty Board
            </Link> */}
            <NavLink 
              to="/track-order" 
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `text-gray-800 hover:text-orange-500 font-medium text-lg transition-colors inline-flex px-3 py-1 rounded-full ${isActive ? 'ring-2 ring-white' : ''}`
              }
            >
              Track Order
            </NavLink>
            <Link 
              to="#contact" 
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-800 hover:text-orange-500 font-medium text-lg transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
