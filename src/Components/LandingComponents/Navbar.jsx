import React, { useState } from 'react'
import { FiMenu, FiX, FiUser, FiLogOut, FiChevronDown } from 'react-icons/fi'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import logo from '../../assets/eatwellalogo.png'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const handleLogout = async () => {
    try {
      await api.post('/customer/logout')
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      logout()
      navigate('/')
    }
  }

  return (
    <nav className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between relative z-50">
      <Link to="/" className="flex items-center gap-2">
        <img src={logo} alt="Eatwella Logo" className=" h-9" />
      </Link>
      
      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-4">
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
        <NavLink
          to="/track-order"
          className={({ isActive }) =>
            `text-white font-medium transition-colors hover:text-green-100 inline-flex px-3 py-1 rounded-full ${isActive ? 'ring-2 ring-white' : ''}`
          }
        >
          Track Order
        </NavLink>
        {user && (
          <NavLink
            to="/account/dashboard"
            className={({ isActive }) =>
              `text-white font-medium transition-colors hover:text-green-100 inline-flex px-3 py-1 rounded-full ${isActive ? 'ring-2 ring-white' : ''}`
            }
          >
            Dashboard
          </NavLink>
        )}
        {!user && (
          <Link to="/account/login" className="text-white font-semibold bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition-colors border border-white/30">
            Login
          </Link>
        )}
        {user && (
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-full transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm">
                {user.email?.charAt(0).toUpperCase()}
              </div>
              <span className="text-white text-sm font-medium">{user.email}</span>
              <FiChevronDown className="text-white w-4 h-4" />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                <Link
                  to="/account/dashboard"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <FiUser className="w-4 h-4" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={() => { setIsDropdownOpen(false); handleLogout(); }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                >
                  <FiLogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center gap-4">
        {user && (
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm"
            >
              {user.email?.charAt(0).toUpperCase()}
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                <Link
                  to="/account/dashboard"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <FiUser className="w-4 h-4" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={() => { setIsDropdownOpen(false); handleLogout(); }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                >
                  <FiLogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        )}
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
            {user && (
              <NavLink 
                to="/account/dashboard" 
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `text-gray-800 hover:text-orange-500 font-medium text-lg transition-colors inline-flex px-3 py-1 rounded-full ${isActive ? 'ring-2 ring-white' : ''}`
                }
              >
                Dashboard
              </NavLink>
            )}
            {!user && (
              <Link 
                to="/login" 
                onClick={() => setIsMenuOpen(false)}
                className="text-orange-500 hover:text-orange-600 font-bold text-lg transition-colors bg-orange-50 hover:bg-orange-100 px-4 py-2 rounded-full border-2 border-orange-200"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
