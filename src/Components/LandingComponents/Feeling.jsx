import React from 'react'
import dineInImg from '../../assets/dinein.png'
import pickupImg from '../../assets/pickup.png'
import deliveryImg from '../../assets/delivery.png'

function Feeling() {
  const images = [
    { src: dineInImg, alt: 'Dine In' },
    { src: deliveryImg, alt: 'Delivery' },
    { src: pickupImg, alt: 'Pick Up' }
  ]

  return (
    <div className="py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-black mb-12 font-bolota">
          HOW ARE WE FEEDING<br />YOU TODAY?
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {images.map((img, index) => (
            <div key={index} className="rounded-3xl overflow-hidden group cursor-pointer transition-transform hover:scale-105">
              <img 
                src={img.src} 
                alt={img.alt}
                className="w-full h-auto object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Feeling
