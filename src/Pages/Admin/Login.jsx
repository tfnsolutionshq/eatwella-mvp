import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdRestaurant } from 'react-icons/md'
import { FiMail, FiLock } from 'react-icons/fi'

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white mb-4">
              <MdRestaurant className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Eatwella</h1>
            <p className="text-sm text-gray-500 mt-1">Admin Portal</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-3 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors shadow-sm shadow-orange-200 mt-6"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
