import React from 'react'
import { FaCheckCircle } from 'react-icons/fa'

function Feeling() {
  const options = [
    {
      title: 'DINE IN',
      description: 'Sit back, relax, and enjoy',
      bgColor: 'bg-green-600',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400'
    },
    {
      title: 'PICK-UP',
      description: 'Skip the wait, pick it up fast',
      bgColor: 'bg-amber-800',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400'
    },
    {
      title: 'DELIVERY',
      description: 'Your favorites, at your doorstep',
      bgColor: 'bg-gray-800',
      image: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=400'
    }
  ]

  return (
    <div className="py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-black mb-12 font-bolota">
          HOW ARE WE FEEDING<br />YOU TODAY?
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          {options.map((option, index) => (
            <div key={index} className={`${option.bgColor} rounded-3xl overflow-hidden relative h-80 group cursor-pointer transition-transform hover:scale-105`}>
              <img 
                src={option.image} 
                alt={option.title}
                className="w-full h-full object-cover opacity-40"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <FaCheckCircle className="text-yellow-400 text-2xl" />
                  <h3 className="text-3xl font-black font-bolota">{option.title}</h3>
                </div>
                <p className="text-lg">{option.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Feeling
