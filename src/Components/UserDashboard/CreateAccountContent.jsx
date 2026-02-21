import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'

function CreateAccountContent() {
  const location = useLocation()
  const navigate = useNavigate()
  const initialEmail = location.state?.email || ''

  const [email, setEmail] = useState(initialEmail)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Please enter email and password')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    try {
      setLoading(true)
      const response = await axios.post(
        'https://eatwella.tfnsolutions.us/api/customer/register',
        { email, password },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      )
      const data = response.data
      if (data?.token) {
        localStorage.setItem('customer_token', data.token)
        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
        } catch {}
      }
      if (data?.user) {
        localStorage.setItem('customer_user', JSON.stringify(data.user))
      }
      localStorage.setItem('customerAuth', JSON.stringify(data))
      navigate('/account/login', { replace: true, state: { email } })
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to create account'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-50 py-12 px-4 md:px-6 min-h-[60vh]">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 px-8 py-10 flex flex-col items-stretch text-center">
          <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-4">
            <span className="w-7 h-7 rounded-full border-2 border-orange-500 flex items-center justify-center text-orange-500 text-lg">
              U
            </span>
          </div>
          <h2 className="text-2xl font-bold mb-1">Create Your Account</h2>
          <p className="text-sm text-gray-500 mb-8">
            One last step to track your orders and earn rewards.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-400 mt-1">
                Click to change email if needed.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                Create Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-4 py-3 pr-14 rounded-2xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-xs text-gray-500"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">At least 6 characters.</p>
            </div>

            {error && (
              <div className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-2xl px-3 py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm tracking-wide disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <button
            type="button"
            onClick={() => navigate('/account/login')}
            className="mt-4 text-sm text-gray-500 hover:text-gray-700"
          >
            Have an account? <span className='text-orange-700'>Login</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateAccountContent
