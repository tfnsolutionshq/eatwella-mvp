import React, { useState } from 'react'
import { FiMonitor, FiLayout, FiChevronDown } from 'react-icons/fi'

function Appearance() {
  const [appearanceSettings, setAppearanceSettings] = useState({
    colorTheme: 'Light',
    fontSize: 'Medium',
    interfaceDensity: 'Comfortable',
    collapsedSidebar: false
  })

  const handleToggle = (setting) => {
    setAppearanceSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }))
  }

  const handleSelectChange = (setting, value) => {
    setAppearanceSettings(prev => ({
      ...prev,
      [setting]: value
    }))
  }

  const ToggleSwitch = ({ checked, onChange }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
        checked ? 'bg-black' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-1'
        }`}
      />
    </button>
  )

  return (
    <div className="p-6 space-y-8">
      {/* Theme and Layout Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Theme */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <FiMonitor className="w-5 h-5 text-gray-600" />
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Theme</h3>
              <p className="text-xs text-gray-600">Choose your preferred color scheme</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-900 mb-2">Color Theme</div>
              <div className="relative">
                <select 
                  value={appearanceSettings.colorTheme}
                  onChange={(e) => handleSelectChange('colorTheme', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option>Light</option>
                  <option>Dark</option>
                  <option>Auto</option>
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-900 mb-2">Font Size</div>
              <div className="relative">
                <select 
                  value={appearanceSettings.fontSize}
                  onChange={(e) => handleSelectChange('fontSize', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option>Small</option>
                  <option>Medium</option>
                  <option>Large</option>
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-900 mb-2">Interface Density</div>
              <div className="relative">
                <select 
                  value={appearanceSettings.interfaceDensity}
                  onChange={(e) => handleSelectChange('interfaceDensity', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option>Compact</option>
                  <option>Comfortable</option>
                  <option>Spacious</option>
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Layout */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <FiLayout className="w-5 h-5 text-gray-600" />
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Layout</h3>
              <p className="text-xs text-gray-600">Customize your workspace layout</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-900">Collapsed Sidebar</div>
                <div className="text-xs text-gray-600">Start with sidebar collapsed</div>
              </div>
              <ToggleSwitch 
                checked={appearanceSettings.collapsedSidebar}
                onChange={() => handleToggle('collapsedSidebar')}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Appearance