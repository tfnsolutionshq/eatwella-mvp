import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import DashboardLayout from '../../DashboardLayout/DashboardLayout'
import { FiSave, FiAward, FiGift } from 'react-icons/fi'
import api from '../../utils/api'

const LoyaltySettings = () => {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    loyalty_points_per_order: '',
    loyalty_min_points_redemption: ''
  })

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      navigate('/admin/login')
      return
    }
    if (user.role !== 'admin') {
      navigate('/admin/dashboard')
      return
    }
    fetchSettings()
  }, [user, authLoading, navigate])

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/admin/settings')
      const settingsObj = {}
      if (Array.isArray(data)) {
        data.forEach(setting => {
          settingsObj[setting.key] = setting.value
        })
      }
      setSettings({
        loyalty_points_per_order: settingsObj.loyalty_points_per_order || '',
        loyalty_min_points_redemption: settingsObj.loyalty_min_points_redemption || ''
      })
    } catch (err) {
      console.error('Failed to fetch settings:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        settings: [
          { key: 'loyalty_points_per_order', value: settings.loyalty_points_per_order },
          { key: 'loyalty_min_points_redemption', value: settings.loyalty_min_points_redemption }
        ]
      }
      await api.put('/admin/settings', payload)
      showToast('Loyalty settings updated successfully!')
      fetchSettings()
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update settings', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 bg-gray-50/50 min-h-full">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Loyalty Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Configure loyalty points and rewards</p>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
            <p className="text-gray-500">Loading settings...</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <FiAward className="w-4 h-4 text-orange-500" />
                    Points Per Order
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={settings.loyalty_points_per_order}
                    onChange={(e) => setSettings({ ...settings, loyalty_points_per_order: e.target.value })}
                    placeholder="e.g. 20"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">Number of loyalty points customers earn per order</p>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <FiGift className="w-4 h-4 text-orange-500" />
                    Minimum Points for Redemption
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={settings.loyalty_min_points_redemption}
                    onChange={(e) => setSettings({ ...settings, loyalty_min_points_redemption: e.target.value })}
                    placeholder="e.g. 200"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum points required before customers can redeem rewards</p>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiSave className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Settings'}
                </button>
              </form>
            </div>

            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <FiAward className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900">How It Works</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Customers earn points with every order they place</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Points accumulate in their account automatically</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Once they reach the minimum threshold, they can redeem points for rewards</span>
                  </li>
                </ul>
              </div>

              <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6">
                <h3 className="font-bold text-gray-900 mb-3">Current Settings</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Points per order:</span>
                    <span className="text-lg font-bold text-orange-500">{settings.loyalty_points_per_order || '0'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Min. redemption:</span>
                    <span className="text-lg font-bold text-orange-500">{settings.loyalty_min_points_redemption || '0'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default LoyaltySettings
