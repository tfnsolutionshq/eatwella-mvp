import React, { useEffect, useState } from 'react'
import { FaArrowUp } from 'react-icons/fa'

function ScrollToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const curr = window.scrollY
      const dirDown = curr > last
      if (dirDown && curr > 200) setVisible(true)
      if (!dirDown || curr < 100) setVisible(false)
      last = curr
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!visible) return null

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 left-6 w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center shadow-lg hover:bg-orange-600 transition-colors z-50 animate-bounce-stay"
      aria-label="Scroll to top"
    >
      <FaArrowUp className="text-white text-xl" />
    </button>
  )
}

export default ScrollToTopButton
