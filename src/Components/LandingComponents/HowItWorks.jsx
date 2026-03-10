import React from 'react'

const steps = [
  {
    id: 1,
    title: 'Browse Menu',
    description: 'Explore our diverse menu of delicious, healthy meals.',
  },
  {
    id: 2,
    title: 'Add to Cart',
    description: 'Select your favorite meals and add them to your cart.',
  },
  {
    id: 3,
    title: 'Enter Discount',
    description: 'Apply any promo codes you have for great savings.',
  },
  {
    id: 4,
    title: 'Choose Order Type',
    description: 'Select delivery or pickup to suit your schedule.',
  },
  {
    id: 5,
    title: 'Make Payment',
    description: 'Securely checkout and pay for your order.',
  },
]

function HowItWorks() {
  return (
    <section className="py-24 bg-gray-50 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-black mb-24 font-bolota text-center text-gray-900">
          HOW IT WORKS
        </h2>

        <div className="relative">
          {/* Horizontal Line (Desktop) */}
          <div className="hidden md:block absolute top-10 left-0 w-full h-0.5 bg-gray-200 z-0">
            {/* Animated Progress Line */}
            <div 
              className="h-full bg-orange-500 origin-left"
              style={{ animation: 'slideLine 1.5s ease-out forwards' }}
            ></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <div 
                key={step.id} 
                className="relative flex flex-col items-center text-center group cursor-default"
                style={{ animation: `slideInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards ${index * 0.2}s`, opacity: 0 }}
              >
                {/* Circle Number */}
                <div className="w-20 h-20 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center text-2xl font-bold text-gray-400 mb-8 relative z-10 transition-all duration-300 group-hover:border-orange-500 group-hover:text-orange-500 group-hover:shadow-xl group-hover:scale-110">
                  0{step.id}
                  {/* Active Dot (Top Right) */}
                  <div className="absolute top-0 right-0 w-3 h-3 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-1 -translate-y-1 ring-2 ring-white"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 px-2 transition-transform duration-300 group-hover:-translate-y-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-orange-500 transition-colors duration-300 uppercase tracking-wide">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed font-medium">
                    {step.description}
                  </p>
                </div>

                {/* Vertical Line (Mobile) */}
                {index !== steps.length - 1 && (
                  <div className="md:hidden absolute top-20 bottom-[-32px] left-1/2 w-0.5 bg-gray-200 -translate-x-1/2 z-0"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideLine {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </section>
  )
}

export default HowItWorks
