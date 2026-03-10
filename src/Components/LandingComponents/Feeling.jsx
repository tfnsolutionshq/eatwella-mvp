import React from 'react'
import dineInImg from '../../assets/feeling/dine_in.png'
import pickupImg from '../../assets/feeling/pickupp.png'
import deliveryImg from '../../assets/feeling/deliveryyy.png'

function Feeling() {
  const sections = [
    { 
      id: 1,
      image: dineInImg, 
      title: 'Dine In',
      description: 'Experience the ambiance and taste of our restaurant.',
      align: 'left'
    },
    { 
      id: 2,
      image: pickupImg, 
      title: 'Pick Up',
      description: 'Order ahead and skip the line.',
      align: 'right'
    },
    { 
      id: 3,
      image: deliveryImg, 
      title: 'Delivery',
      description: 'Your favorite meals delivered to your doorstep.',
      align: 'left'
    }
  ]

  return (
    <div className="w-full">
      {sections.map((section) => (
        <div 
          key={section.id}
          className="relative w-full h-[80vh] bg-fixed bg-center bg-cover flex items-center"
          style={{ backgroundImage: `url(${section.image})` }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40"></div>
          
          {/* Content */}
          <div className={`relative z-10 container mx-auto px-6 md:px-12 flex ${section.align === 'right' ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-xl text-white">
              <h2 className="text-5xl md:text-7xl font-black font-bolota mb-4 tracking-tight drop-shadow-lg">
                {section.title}
              </h2>
              <p className="text-xl md:text-2xl font-medium text-gray-100 drop-shadow-md">
                {section.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Feeling
