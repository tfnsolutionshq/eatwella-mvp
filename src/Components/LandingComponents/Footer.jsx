import React from 'react'
import { FaPhone, FaMapMarkerAlt, FaInstagram, FaTiktok, FaFacebook, FaArrowUp } from 'react-icons/fa'

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-black text-white py-12 px-6 relative">
      <div className="max-w-5xl mx-auto">
        {/* Contact Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-gray-800 rounded-3xl p-8 text-center">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaPhone className="text-white text-xl" />
            </div>
            <h3 className="text-gray-400 text-xl font-bold mb-2">CALL US</h3>
            <p className="text-white text-3xl font-black">0809 9099 0948</p>
          </div>

          <div className="bg-gray-800 rounded-3xl p-8 text-center">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaMapMarkerAlt className="text-white text-xl" />
            </div>
            <h3 className="text-gray-400 text-xl font-bold mb-2">FIND US</h3>
            <p className="text-white text-2xl font-black">INSIDE UNIZIK, AWKA,<br />NIGERIA</p>
          </div>
        </div>

        {/* Scroll to Top Button */}
        <button 
          onClick={scrollToTop}
          className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center mb-12 hover:bg-orange-600 transition-colors"
        >
          <FaArrowUp className="text-white text-xl" />
        </button>

        {/* Navigation Links and Social Media Icons */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div className="flex gap-4 md:gap-8 flex-wrap">
            <a href="#menu" className="text-white hover:text-orange-500 transition-colors">Menu</a>
            <a href="#meal-plans" className="text-white hover:text-orange-500 transition-colors">Meal Plans</a>
            <a href="#contact" className="text-white hover:text-orange-500 transition-colors">Contact Us</a>
            <a href="#privacy" className="text-white hover:text-orange-500 transition-colors">Privacy Policy</a>
          </div>

          <div className="flex gap-4">
            <a href="#" className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors">
              <FaInstagram className="text-white text-xl" />
            </a>
            <a href="#" className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors">
              <FaTiktok className="text-white text-xl" />
            </a>
            <a href="#" className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors">
              <FaFacebook className="text-white text-xl" />
            </a>
          </div>
        </div>

        {/* Large EATWELLA Text */}
        <div className="mb-6 overflow-hidden text-center">
          <h2 className="text-[60px] sm:text-[100px] md:text-[150px] lg:text-[185px] font-black leading-none text-gray-900 w-full">
            EATWELLA
          </h2>
        </div>

        {/* Built by */}
        <div className="text-center relative z-10 mb-8">
          <p className="text-white">
            Built by <a href="#" className="underline hover:text-orange-500 transition-colors">TFN Solutions</a>
          </p>
        </div>
      </div>
      
      {/* Repeating Background Pattern */}
      <div className="absolute bottom-0 left-0 right-0 h-8 flex overflow-hidden opacity-50">
        {[...Array(20)].map((_, i) => (
          <img 
            key={i}
            src="/src/assets/Frame 24.png" 
            alt="" 
            className="h-full w-auto flex-shrink-0"
          />
        ))}
      </div>
    </footer>
  )
}

export default Footer
