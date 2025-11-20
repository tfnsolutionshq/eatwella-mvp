import React, { useState } from 'react'
import { FiUser, FiBell, FiShield, FiMonitor, FiSettings, FiHardDrive, FiCamera } from 'react-icons/fi'
import Notifications from './Notifications'
import Security from './Security'
import Appearance from './Appearance'
import Integrations from './Integrations'
import SystemSettings from './SystemSettings'

function Settings() {
  const [activeTab, setActiveTab] = useState('Profile')
  const [profileData, setProfileData] = useState({
    fullName: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@university.edu',
    jobTitle: 'Department Head - Computer Science',
    phoneNumber: '+1 (555) 123-4567',
    location: 'State University, Main Campus',
    bio: 'Experienced educator and researcher with 15+ years in computer science academia.',
    timezone: 'Eastern Time',
    language: 'English'
  })

  const tabs = [
    { id: 'Profile', label: 'Profile', icon: FiUser },
    { id: 'Notifications', label: 'Notifications', icon: FiBell },
    { id: 'Security', label: 'Security', icon: FiShield },
    { id: 'Appearance', label: 'Appearance', icon: FiMonitor },
    { id: 'Integrations', label: 'Integrations', icon: FiSettings },
    { id: 'System', label: 'System', icon: FiHardDrive }
  ]

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 text-sm">Manage your account settings and preferences</p>
        </div>
        <button className="px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800 flex items-center gap-2">
          <FiSettings className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      {/* Settings Container */}
      <div className="bg-white rounded-lg border border-gray-200">
        {/* Tabs */}
        <div className="bg-gray-100 rounded-t-lg">
          <nav className="flex">
            {tabs.map((tab) => {
              const IconComponent = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-1 px-4 text-center rounded-full font-medium text-sm flex items-center justify-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-white m-1 rounded-full text-gray-900 border-b-2 border-white'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Profile Tab Content */}
        {activeTab === 'Profile' && (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Photo Section */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Profile Photo</h3>
                  <p className="text-xs text-gray-600 mb-4">Update your profile picture</p>
                  
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-medium text-gray-600 mb-4">
                      D
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-black text-white rounded text-xs hover:bg-gray-800 flex items-center gap-1">
                        <FiCamera className="w-3 h-3" />
                        Change Photo
                      </button>
                      <button className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-xs hover:bg-gray-50">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Basic Information Section */}
              <div className="lg:col-span-2">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Basic Information</h3>
                  <p className="text-xs text-gray-600 mb-6">Update your personal information</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={profileData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Job Title</label>
                      <input
                        type="text"
                        value={profileData.jobTitle}
                        onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={profileData.phoneNumber}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        value={profileData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Bio</label>
                      <textarea
                        value={profileData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Timezone</label>
                      <select
                        value={profileData.timezone}
                        onChange={(e) => handleInputChange('timezone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option>Eastern Time</option>
                        <option>Central Time</option>
                        <option>Mountain Time</option>
                        <option>Pacific Time</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Language</label>
                      <select
                        value={profileData.language}
                        onChange={(e) => handleInputChange('language', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab Content */}
        {activeTab === 'Notifications' && <Notifications />}

        {/* Security Tab Content */}
        {activeTab === 'Security' && <Security />}

        {/* Appearance Tab Content */}
        {activeTab === 'Appearance' && <Appearance />}

        {/* Integrations Tab Content */}
        {activeTab === 'Integrations' && <Integrations />}

        {/* System Tab Content */}
        {activeTab === 'System' && <SystemSettings />}

        {/* Other Tabs Placeholder */}
        {!['Profile', 'Notifications', 'Security', 'Appearance', 'Integrations', 'System'].includes(activeTab) && (
          <div className="p-6 text-center">
            <div className="flex flex-col items-center justify-center py-12">
              {tabs.find(tab => tab.id === activeTab)?.icon && 
                React.createElement(tabs.find(tab => tab.id === activeTab).icon, { className: "w-12 h-12 text-gray-400 mb-4" })
              }
              <h3 className="text-lg font-medium text-gray-900 mb-2">{activeTab} Settings</h3>
              <p className="text-gray-500">Content for {activeTab} tab will be implemented here.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Settings