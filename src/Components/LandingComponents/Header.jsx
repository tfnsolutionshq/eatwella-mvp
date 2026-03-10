import React from 'react'
import Navbar from './Navbar'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import headergroup from '../../assets/headergroup.png'

function Header() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    }
  }

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 15,
        delay: 0.6
      }
    }
  }

  const floatingAnimation = {
    y: [0, -15, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }

  return (
    <div className="bg-gradient-to-br from-green-600 to-green-700 min-h-screen relative overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-12 lg:py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            <motion.h1 
              variants={itemVariants}
              className="text-[40px] md:text-[60px] lg:text-[70px] font-bolota text-white mb-6 leading-tight"
            >
              TRY DEY EATWELLA, NO LOOSE GUARD
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl text-white mb-8"
            >
              Eat on the Go. Good food. Great Taste.
            </motion.p>
            <motion.div 
              variants={itemVariants}
              className="flex gap-4 justify-center lg:justify-start"
            >
              <Link to="/menu" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-bold transition-colors shadow-lg hover:shadow-orange-500/30 transform hover:-translate-y-1">
                Eat Now
              </Link>
              <Link to="/contact" className="bg-green-800 hover:bg-green-900 text-white px-8 py-3 rounded-full font-bold transition-colors shadow-lg hover:shadow-green-900/30 transform hover:-translate-y-1">
                Call Us
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Content - Hero Image */}
          <motion.div 
            variants={imageVariants}
            initial="hidden"
            animate="visible"
            className="flex items-center justify-center mt-8 lg:mt-0"
          >
            <motion.img
              animate={floatingAnimation}
              src={headergroup}
              alt="EatWella Group Meal"
              className="w-full max-w-[350px] md:max-w-[450px] lg:max-w-[600px] object-contain drop-shadow-2xl"
            />
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.2, 0.3],
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity,
          ease: "easeInOut" 
        }}
        className="absolute top-20 right-10 w-20 h-20 bg-orange-400 rounded-full opacity-30 blur-xl"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.1, 0.2],
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute bottom-40 left-10 w-32 h-32 bg-orange-500 rounded-full opacity-20 blur-2xl"
      />
      <motion.div 
        animate={{ 
          y: [0, -20, 0],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity,
          ease: "easeInOut" 
        }}
        className="absolute top-1/2 right-1/4 w-16 h-16 bg-white rounded-full opacity-10 blur-lg"
      />
    </div>
  )
}

export default Header
