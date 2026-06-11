import React from 'react'
import Navbar from '../LandingComponents/Navbar'

function RidersHeader() {
  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-br from-green-600 to-green-700 pb-8">
      {/* Hero Text */}
      <div className="max-w-6xl mx-auto mt-20 px-6">
        <h1 className="text-6xl md:text-7xl font-bolota font-black text-white mb-4">
          RIDER TUTORIAL
        </h1>
        <p className="text-xl text-white">
          Learn how to efficiently manage and deliver orders using the Eatwella rider app
        </p>
      </div>
    </div>
    </>
  )
}

export default RidersHeader
