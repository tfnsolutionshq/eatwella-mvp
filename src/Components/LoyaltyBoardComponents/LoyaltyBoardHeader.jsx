import React from 'react'
import Navbar from '../LandingComponents/Navbar'

function LoyaltyBoardHeader() {
  return (
    <div className="bg-gradient-to-br from-green-600 to-green-700 pb-8 px-6">
      <Navbar />
      <div className="max-w-5xl mx-auto mt-12">
        <h1 className="text-6xl md:text-7xl font-black text-white mb-4">
          LOYALTY BOARD
        </h1>
        <p className="text-xl text-white">Earn rewards with every order</p>
      </div>
    </div>
  )
}

export default LoyaltyBoardHeader
