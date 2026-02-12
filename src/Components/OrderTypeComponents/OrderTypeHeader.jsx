import React from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from '../../Components/LandingComponents/Navbar'

function Ordertype() {
  const location = useLocation()
  const orderType = location.state?.orderType || 'dine-in'

  const orderTypeLabels = {
    'dine-in': 'Dine-in',
    'pickup': 'Pickup',
    'delivery': 'Delivery'
  }

  return (
    <div className="bg-gradient-to-br from-green-600 to-green-700 pb-8 px-6">
      <Navbar />

      {/* Hero Text */}
      <div className="max-w-5xl mx-auto mt-12">
        <h1 className="text-6xl md:text-7xl font-black text-white mb-4">
          {orderTypeLabels[orderType]}
        </h1>
        <p className="text-xl text-white">Choose your preferred order type</p>
      </div>
    </div>
  )
}

export default Ordertype
