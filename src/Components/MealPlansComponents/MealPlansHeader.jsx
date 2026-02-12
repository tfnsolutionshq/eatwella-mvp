import React from 'react'
import Navbar from '../LandingComponents/Navbar'

function MealPlansHeader() {
  return (
    <div className="bg-gradient-to-br from-green-600 to-green-700 pb-8 px-6">
      <Navbar />
      <div className="max-w-5xl mx-auto mt-12">
        <h1 className="text-6xl md:text-7xl font-black text-white mb-4">
          MEAL PLANS
        </h1>
        <p className="text-xl text-white">Healthy meals, delivered to you</p>
      </div>
    </div>
  )
}

export default MealPlansHeader
