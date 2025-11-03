import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiMail, FiArrowLeft, FiCheck } from 'react-icons/fi'
import authImage from "../../assets/Authentication/Auth.jpg"

function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email) return
    
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setEmailSent(true)
    }, 1500)
  }

  const handleBackToLogin = () => {
    navigate('/login')
  }

  if (emailSent) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(1, 24, 35, 0.98), rgba(1, 24, 35, 0.95)), url(${authImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="relative z-10 w-full max-w-sm">
          {/* Check Email Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-6">
            {/* Success Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <FiCheck className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 mb-1 text-center">Check Your Email</h2>
            <p className="text-center text-gray-600 text-xs mb-4">
              We've sent password reset instructions to:
            </p>
            
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="text-sm font-semibold text-gray-900 text-center">{email}</p>
            </div>
            
            {/* Next Steps */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Next steps:</h3>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Check your email inbox (and spam folder)</li>
                <li>• Click the reset password link</li>
                <li>• Create a new password</li>
                <li>• Sign in with your new credentials</li>
              </ul>
            </div>
            
            {/* Resend Option */}
            <div className="text-center mb-4">
              <button 
                onClick={() => setEmailSent(false)}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Didn't receive the email? Click here to resend
              </button>
            </div>
            
            {/* Back to Login */}
            <button
              onClick={handleBackToLogin}
              className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 rounded-lg transition-colors duration-200 text-sm"
            >
              <FiArrowLeft className="w-4 h-4" />
              Back to Login
            </button>
          </div>
          
          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-xs text-gray-400">POWERED BY TFN SOLUTIONS</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(1, 24, 35, 0.98), rgba(1, 24, 35, 0.95)), url(${authImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="relative z-10 w-full max-w-sm">
        {/* Logo and Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-white rounded-lg mb-3">
            <FiMail className="w-5 h-5 text-blue-600" />
          </div>
          <h1 className="text-xl font-bold text-white mb-1">SmartMailTrack</h1>
          <p className="text-xs text-gray-300">Enterprise Memo Management Platform</p>
        </div>

        {/* Reset Password Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-6">
          {/* Back to Login */}
          <button
            onClick={handleBackToLogin}
            className="flex items-center gap-2 text-sm text-gray-900 font-medium mb-12 hover:text-gray-800 mb-4"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Login
          </button>
          
          <h2 className="text-xl font-bold text-gray-900 mb-1 text-center">Reset Your Password</h2>
          <p className="text-center text-gray-600 text-xs mb-4">
            Enter your email address and we'll send you instructions to reset your password.
          </p>

          {/* Reset Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@university.edu"
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-sm"
                  required
                />
              </div>
            </div>

            {/* Send Reset Button */}
            <button
              type="submit"
              disabled={loading || !email}
              className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition-colors duration-200 mt-4 text-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending...
                </>
              ) : (
                <>
                  <FiMail className="w-4 h-4" />
                  Send Reset Instructions
                </>
              )}
            </button>
          </form>

          {/* Remember Password */}
          <div className="text-center mt-4">
            <button 
              onClick={handleBackToLogin}
              className="text-xs text-gray-600 hover:text-gray-800"
            >
              Remember your password? <span className="text-blue-600 font-medium">Sign in instead</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-400">POWERED BY TFN SOLUTIONS</p>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
