import React from 'react'
import Navbar from './Navbar'
import { Link } from 'react-router-dom'
import headerimg1 from '../../assets/headerimg1.png'
import headerimg2 from '../../assets/headerimg2.png'

function Header() {
  return (
    <div className="bg-gradient-to-br from-green-600 to-green-700 min-h-screen relative overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-[48px] md:text-[60px] lg:text-[70px] font-bolota text-white mb-6 leading-tight">
              TRY DEY EATWELLA, NO LOOSE GUARD
            </h1>
            <p className="text-xl text-white mb-8">Eat on the Go. Good food. Great Taste.</p>
            <div className="flex gap-4">
              <Link to="/menu" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-bold transition-colors">
                Eat Now
              </Link>
              <Link to="/contact" className="bg-green-800 hover:bg-green-900 text-white px-8 py-3 rounded-full font-bold transition-colors">
                Call Us
              </Link>
            </div>
          </div>

          {/* <div className="relative h-[360px] md:h-[420px] lg:h-[480px] flex items-center justify-center">
            <img 
              src={headerimg1} 
              alt="Enjoying EatWella meals" 
              className="w-56 md:w-96 lg:w-64 rounded-3xl absolute rotate-[-6deg] right-0 bottom-72 md:"
            />
            <img 
              src={headerimg2} 
              alt="Delicious chicken" 
              className="w-48 md:w-72 lg:w-96 rounded-3xl absolute right-32 top-0 rotate-[6deg] md:right-10"
            />
          </div> */}
          <div className="relative h-[300px] sm:h-[360px] md:h-[420px] lg:h-[480px] hidden lg:flex items-center justify-center">

            {/* Image 1 */}
            <img
              src={headerimg1}
              alt="Enjoying EatWella meals"
              className="
                absolute 
                w-40 sm:w-52 md:w-72 lg:w-64 
                rounded-3xl 
                rotate-[-6deg] 
                right-4 sm:right-6 md:right-0 
                bottom-20 sm:bottom-24 md:bottom-40 lg:bottom-72
              "
            />

            {/* Image 2 */}
            <img
              src={headerimg2}
              alt="Delicious chicken"
              className="
                absolute 
                w-36 sm:w-48 md:w-64 lg:w-96 
                rounded-3xl 
                rotate-[6deg] 
                right-10 sm:right-16 md:right-10 
                top-0 sm:top-4 md:top-0
              "
            />
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-20 h-20 bg-orange-400 rounded-full opacity-30"></div>
      <div className="absolute bottom-40 left-10 w-32 h-32 bg-orange-500 rounded-full opacity-20"></div>
      <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white rounded-full opacity-10"></div>
    </div>
  )
}

export default Header
