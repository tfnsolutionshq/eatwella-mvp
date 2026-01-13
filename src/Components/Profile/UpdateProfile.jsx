import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import { useNotification } from '../../context/NotificationContext'
import { FiCamera } from 'react-icons/fi'

function UpdateProfile() {
  const { token, user } = useAuth()
  const { showNotification } = useNotification()
  const [userData, setUserData] = useState(null)
  const [avatarFile, setAvatarFile] = useState(null)
  const [signatureFile, setSignatureFile] = useState(null)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('')
  const [bio, setBio] = useState('')
  const [timezone, setTimezone] = useState('')
  const [language, setLanguage] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    if (token && user?.id) {
      fetchUserData()
    }
  }, [token, user?.id])

  const fetchUserData = async () => {
    setFetching(true)
    try {
      const base = (import.meta.env.VITE_IDENTITY_BASE_URL || 'http://identity.smt.tfnsolutions.us/api/v1').replace(/\/$/, '')
      const response = await axios.get(`${base}/users/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data.status && response.data.data) {
        const data = response.data.data
        setUserData(data)
        setFullName(`${data.first_name || ''} ${data.middle_name || ''} ${data.last_name || ''}`.trim())
        setEmail(data.email || '')
        setJobTitle(data.role?.name || '')
        setPhone(data.phone || '')
        setLocation(data.location || '')
        setBio(data.bio || '')
        setTimezone(data.timezone || '')
        setLanguage(data.language || '')
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
      showNotification('Failed to load user data', 'error')
    } finally {
      setFetching(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!token) {
      showNotification('Missing auth token', 'error')
      return
    }
    const formData = new FormData()
    if (location) formData.append('location', location)
    if (bio) formData.append('bio', bio)
    if (timezone) formData.append('timezone', timezone)
    if (language) formData.append('language', language)
    if (phone) formData.append('phone', phone)
    if (avatarFile) formData.append('avatar', avatarFile)
    if (signatureFile) formData.append('signature', signatureFile)
    setLoading(true)
    try {
      const base = (import.meta.env.VITE_IDENTITY_BASE_URL || 'http://identity.smt.tfnsolutions.us/api/v1').replace(/\/$/, '')
      const url = `${base}/profile`
      const resp = await axios.post(url, formData, {
        headers: { Authorization: `Bearer ${token}` },
        maxBodyLength: Infinity
      })
      showNotification('Profile updated successfully', 'success')
      fetchUserData()
    } catch (error) {
      showNotification(error.response?.data?.message || 'Failed to update profile', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-5">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Settings</h1>
        <p className="text-sm text-gray-600">Manage your profile information and preferences</p>
      </div>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Photo Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-1">Profile Photo</h2>
            <p className="text-sm text-gray-600 mb-6">Update your profile picture</p>
            
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-4xl font-medium text-gray-600">
                  {avatarFile ? (
                    <img src={URL.createObjectURL(avatarFile)} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                  ) : userData?.avatar ? (
                    <img src={`https://identity.smt.tfnsolutions.us/storage/${userData.avatar}`} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    (userData?.first_name?.[0] || 'U').toUpperCase()
                  )}
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <label className="px-4 py-2 bg-black text-white rounded text-sm cursor-pointer hover:bg-gray-800 flex items-center gap-2">
                  <FiCamera className="w-4 h-4" />
                  Change Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </label>
                {(avatarFile || userData?.avatar) && (
                  <button
                    type="button"
                    onClick={() => setAvatarFile(null)}
                    className="px-4 py-2 text-gray-700 border rounded text-sm hover:bg-gray-50"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            {/* Signature Upload */}
            <div className="mt-8 pt-6 border-t">
              <label className="block text-sm font-medium text-gray-700 mb-2">Signature</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSignatureFile(e.target.files?.[0] || null)}
                className="w-full text-sm"
              />
              {(signatureFile || userData?.signature) && (
                <div className="mt-3">
                  <img 
                    src={signatureFile ? URL.createObjectURL(signatureFile) : `https://identity.smt.tfnsolutions.us/storage/${userData.signature}`} 
                    alt="Signature" 
                    className="h-20 object-contain border rounded" 
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Basic Information Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-1">Basic Information</h2>
            <p className="text-sm text-gray-600 mb-6">Update your personal information</p>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-gray-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                  <input
                    type="text"
                    value={jobTitle}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  placeholder="State University, Main Campus"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  placeholder="Experienced educator and researcher with 15+ years in computer science academia."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  >
                    <option value="">Select timezone</option>
                    <option value="Eastern Time">Eastern Time</option>
                    <option value="Central Time">Central Time</option>
                    <option value="Mountain Time">Mountain Time</option>
                    <option value="Pacific Time">Pacific Time</option>
                    <option value="Africa/Lagos">Africa/Lagos</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  >
                    <option value="">Select language</option>
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  className="px-4 py-2 text-gray-700 border rounded text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-black text-white rounded text-sm hover:bg-gray-800 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default UpdateProfile
