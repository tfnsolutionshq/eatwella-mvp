import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { useNotification } from '../../context/NotificationContext'
import { FiLock, FiEye, FiEyeOff, FiCheck, FiArrowRight } from 'react-icons/fi'
import authImage from "../../assets/Authentication/Auth.jpg"
import logo from "../../assets/SMTLogowhite.png"

function ResetPassword() {
  const navigate = useNavigate()
  const { showNotification } = useNotification()
  const [searchParams] = useSearchParams()
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordReset, setPasswordReset] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setEmail(searchParams.get('email') || '')
    setToken(searchParams.get('token') || '')
  }, [searchParams])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!newPassword || !confirmPassword) return
    if (newPassword !== confirmPassword) {
      showNotification('Passwords do not match', 'error')
      return
    }
    
    setLoading(true)
    
    try {
      const formData = new FormData()
      formData.append('email', email)
      formData.append('token', token)
      formData.append('password', newPassword)
      formData.append('password_confirmation', confirmPassword)
      
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/reset-password`, formData)
      
      if (response.data.status) {
        setPasswordReset(true)
        showNotification(response.data.message, 'success')
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to reset password. Please try again.'
      showNotification(message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleBackToLogin = () => {
    navigate('/login')
  }

  if (passwordReset) {
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
            <img src={logo} alt="SmartMailTrack" className="h-10 mx-auto mb-3" />
            <p className="text-xs text-gray-300">Enterprise Memo Management Platform</p>
          </div>

          {/* Success Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-6">
            {/* Success Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <FiCheck className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 mb-1 text-center">Password Reset Confirmed</h2>
            <p className="text-center text-gray-600 text-xs mb-6">
              Your account password has been reset successfully
            </p>
            
            {/* Back to Login */}
            <button
              onClick={handleBackToLogin}
              className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 rounded-lg transition-colors duration-200 text-sm"
            >
              <FiArrowRight className="w-4 h-4" />
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
          <img src={logo} alt="SmartMailTrack" className="h-14 mx-auto mb-3" />
          <p className="text-xs text-gray-300">Enterprise Memo Management Platform</p>
        </div>

        {/* Reset Password Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1 text-center">Reset Password</h2>
          <p className="text-center text-gray-600 text-xs mb-4">
            Enter your new password below.
          </p>

          {/* Reset Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Email Field (hidden) */}
            <input type="hidden" value={email} />
            <input type="hidden" value={token} />
            
            {/* New Password Field */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">New Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full pl-9 pr-9 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Confirm New Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full pl-9 pr-9 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Button */}
            <button
              type="submit"
              disabled={loading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
              className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition-colors duration-200 mt-4 text-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Updating...
                </>
              ) : (
                <>
                  <FiArrowRight className="w-4 h-4" />
                  Confirm
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-400">POWERED BY TFN SOLUTIONS</p>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
