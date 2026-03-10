import React from 'react'
import Navbar from '../../Components/LandingComponents/Navbar'

function VacancyHeader() {
  return (
    <div className="bg-gradient-to-br from-green-600 to-green-700 pb-8">
      <Navbar />

      {/* Hero Text */}
      <div className="max-w-6xl mx-auto mt-20 px-6">
        <h1 className="text-6xl md:text-7xl font-bolota font-black text-white mb-4">
          VACANCIES
        </h1>
        <p className="text-xl text-white">Apply for our available job positions. Get hired and start your career.</p>
      </div>
    </div>
  )
}

export default VacancyHeader
