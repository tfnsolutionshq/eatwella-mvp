"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useAuth } from "../../context/AuthContext"
import { useNotification } from "../../context/NotificationContext"
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle } from "react-icons/fi"
import { FcGoogle } from "react-icons/fc"
import { SiApple } from "react-icons/si"
import authImage from "../../assets/Authentication/Auth.jpg"

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { showNotification } = useNotification()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSignIn = async (e) => {
    e.preventDefault()
    
    if (!email || !password) {
      setError(true)
      return
    }
    
    setError(false)
    setLoading(true)
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/login`, {
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.data.status) {
        login(response.data.data.token, response.data.data.user)
        showNotification(response.data.message, 'success')
        navigate('/dashboard')
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.'
      showNotification(message, 'error')
    } finally {
      setLoading(false)
    }
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

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1 text-center">Welcome Back</h2>
          <p className="text-center text-gray-600 text-xs mb-4">Sign in to access your workspace</p>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
              <FiAlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-700">
                Please enter both email and password.
              </p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSignIn} className="space-y-3">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (error) setError(false)
                  }}
                  placeholder="smith.johnson@innovate.edu"
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-sm"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-gray-700">Password</label>
                <button 
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <FiLock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (error) setError(false)
                  }}
                  placeholder="demo123"
                  className="w-full pl-9 pr-9 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition-colors duration-200 mt-4 text-sm"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-2 my-4">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-xs text-gray-500 font-medium">OR CONTINUE WITH</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-2">
            <button className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 rounded-lg transition-colors duration-200 text-sm">
              <FcGoogle className="w-4 h-4" />
              Continue with Google
            </button>
            <button className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 rounded-lg transition-colors duration-200 text-sm">
              <SiApple className="w-4 h-4" />
              Continue with Apple
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
