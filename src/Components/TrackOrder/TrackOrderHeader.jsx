import React from 'react'
import Navbar from '../../Components/LandingComponents/Navbar'

function TrackOrderHeader() {
  return (
    <div className="bg-gradient-to-br from-green-600 to-green-700 pb-8">
      <Navbar />

      {/* Hero Text */}
      <div className="max-w-6xl mx-auto mt-20 px-6">
        <h1 className="text-6xl md:text-7xl font-bolota font-black text-white mb-4">
          TRACK YOUR ORDER
        </h1>
        <p className="text-xl text-white">View and manage your order status</p>
      </div>
    </div>
  )
}

export default TrackOrderHeader
