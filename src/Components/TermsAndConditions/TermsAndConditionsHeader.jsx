import React from 'react'
import Navbar from '../../Components/LandingComponents/Navbar'

function TermsAndConditionsHeader() {
  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-br from-green-600 to-green-700 pb-8">
        <div className="max-w-6xl mx-auto mt-20 px-6">
          <h1 className="text-6xl md:text-7xl font-bolota font-black text-white mb-4">
            TERMS & CONDITIONS
          </h1>
          <p className="text-xl text-white">Please read these terms carefully before using our services</p>
        </div>
      </div>
    </>
  )
}

export default TermsAndConditionsHeader
