import React, { useState, useEffect } from 'react'
import { FiChevronLeft, FiChevronRight, FiStar } from 'react-icons/fi'
import { FaQuoteLeft } from 'react-icons/fa'

const testimonials = [
  {
    id: 1,
    name: 'Sarah Adebayo',
    role: 'Food Enthusiast',
    quote: "The jollof rice is out of this world! It genuinely reminds me of my grandmother's cooking. Highly recommended!",
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 2,
    name: 'Michael Okonkwo',
    role: 'Software Engineer',
    quote: "Best meal prep service in Lagos. Saves me so much time during my busy work week. The packaging is top-notch.",
    rating: 5,
    image: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 3,
    name: 'Chioma Nwosu',
    role: 'Fitness Coach',
    quote: "Finally, healthy options that actually taste good. The meal plans have helped me stay on track with my fitness goals.",
    rating: 5,
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 4,
    name: 'David Ibrahim',
    role: 'Banker',
    quote: "Delivery is always on time and the food is hot. Customer service is also very responsive and helpful.",
    rating: 5,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 5,
    name: 'Amina Yusuf',
    role: 'Student',
    quote: "Great value for money. The portion sizes are generous and the student discount is a lifesaver.",
    rating: 4,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 6,
    name: 'Tunde Bakare',
    role: 'Entrepreneur',
    quote: "I love the variety on the menu. It never gets boring, and I can customize my orders to fit my diet.",
    rating: 5,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  }
]

function TestimonialSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(1)

  // Handle responsive items per page
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerPage(3)
      } else if (window.innerWidth >= 768) {
        setItemsPerPage(2)
      } else {
        setItemsPerPage(1)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)
    return () => clearInterval(interval)
  }, [activeIndex, itemsPerPage])

  const nextSlide = () => {
    setActiveIndex((prev) => {
      const maxIndex = testimonials.length - itemsPerPage
      if (prev >= maxIndex) return 0
      return prev + 1
    })
  }

  const prevSlide = () => {
    setActiveIndex((prev) => {
      const maxIndex = testimonials.length - itemsPerPage
      if (prev <= 0) return maxIndex
      return prev - 1
    })
  }

  // Reset index if it goes out of bounds on resize
  useEffect(() => {
    const maxIndex = testimonials.length - itemsPerPage
    if (activeIndex > maxIndex) {
      setActiveIndex(maxIndex > 0 ? maxIndex : 0)
    }
  }, [itemsPerPage])

  // Calculate transform logic
  // We want to show 'itemsPerPage' items.
  // Each item width is 100% / itemsPerPage.
  // We shift by activeIndex * (100% / itemsPerPage).
  // Note: This simple logic loops weirdly if we don't clone items, but for simplicity:
  // We will just let it slide. If it reaches the end, we might see empty space if we don't limit activeIndex.
  // To fix "empty space" at the end of the list when sliding 1 by 1:
  // We can treat it as a circular buffer or just limit the max index.
  // For infinite loop effect without cloning, usually we reset.
  // Let's stick to a simple slider where it cycles back to start.
  
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <h2 className="text-4xl md:text-6xl font-black mb-16 font-bolota text-center uppercase">
          What Our Customers Say
        </h2>

        {/* Carousel Container */}
        <div className="relative">
          {/* Track */}
          <div className="overflow-hidden px-2">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * (100 / itemsPerPage)}%)` }}
            >
              {testimonials.map((item) => (
                <div 
                  key={item.id} 
                  className="flex-shrink-0 px-4"
                  style={{ width: `${100 / itemsPerPage}%` }}
                >
                  <div className="bg-gray-50 p-8 rounded-[32px] hover:shadow-xl transition-shadow h-full flex flex-col border border-gray-100">
                    <div className="flex gap-1 text-orange-500 mb-6 text-lg">
                      {[...Array(5)].map((_, i) => (
                        <FiStar key={i} className={i < item.rating ? "fill-current" : "text-gray-300"} />
                      ))}
                    </div>
                    
                    <p className="text-gray-700 italic mb-8 flex-grow text-lg leading-relaxed font-medium">"{item.quote}"</p>
                    
                    <div className="flex items-center gap-4 mt-auto">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-14 h-14 rounded-full object-cover ring-4 ring-white shadow-sm"
                      />
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">{item.name}</h4>
                        <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">{item.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <button 
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-black hover:bg-orange-500 hover:text-white transition-all z-20 border border-gray-100"
            aria-label="Previous testimonial"
          >
            <FiChevronLeft size={28} />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-black hover:bg-orange-500 hover:text-white transition-all z-20 border border-gray-100"
            aria-label="Next testimonial"
          >
            <FiChevronRight size={28} />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-3 mt-12">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  idx === activeIndex ? 'bg-orange-500 w-10' : 'bg-gray-200 hover:bg-orange-200'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default TestimonialSection
