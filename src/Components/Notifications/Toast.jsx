import { useState, useEffect } from 'react'
import { FiCheckCircle, FiXCircle, FiX } from 'react-icons/fi'

export default function Toast({ message, type, onClose }) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300)
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg min-w-80 ${
        type === 'success' 
          ? 'bg-green-50 border border-green-200 text-green-800' 
          : 'bg-red-50 border border-red-200 text-red-800'
      }`}>
        {type === 'success' ? (
          <FiCheckCircle className="w-5 h-5 text-green-600" />
        ) : (
          <FiXCircle className="w-5 h-5 text-red-600" />
        )}
        <span className="text-sm font-medium flex-1">{message}</span>
        <button
          onClick={handleClose}
          className={`p-1 rounded-full hover:bg-opacity-20 ${
            type === 'success' ? 'hover:bg-green-600' : 'hover:bg-red-600'
          }`}
        >
          <FiX className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}