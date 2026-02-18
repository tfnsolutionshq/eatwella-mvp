import React from 'react'
import Navbar from '../LandingComponents/Navbar'

function ReceiptHeader() {
  return (
    <div className="bg-gradient-to-br from-green-600 to-green-700 pb-8">
      <Navbar />  
      <div className="max-w-6xl mx-auto mt-12 px-6">
        <h1 className="text-6xl md:text-7xl font-black font-bolota text-white mb-4">
          RECEIPT
        </h1>
        <p className="text-xl text-white">Your order confirmation</p>
      </div>
    </div>
  )
}

export default ReceiptHeader
