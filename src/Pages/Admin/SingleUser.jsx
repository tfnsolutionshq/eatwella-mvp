import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../DashboardLayout/DashboardLayout'
import { FiArrowLeft, FiMail, FiPhone, FiMapPin, FiCalendar, FiUser, FiShoppingBag } from 'react-icons/fi'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../utils/api'

const SingleUser = () => {
  const navigate = useNavigate()
  const { userId } = useParams()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUser()
  }, [userId])

  const fetchUser = async () => {
    try {
      setLoading(true)
      const { data } = await api.get(`/admin/users/${userId}`)
      setUser(data)
    } catch (err) {
      console.error('Failed to fetch user:', err)
      alert('Failed to load user details')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-orange-100 text-orange-600',
      processing: 'bg-purple-100 text-purple-600',
      confirmed: 'bg-green-100 text-green-600',
      completed: 'bg-green-100 text-green-600'
    }
    return colors[status] || 'bg-gray-100 text-gray-600'
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 text-center text-gray-500">Loading user details...</div>
      </DashboardLayout>
    )
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="p-6 text-center text-gray-500">User not found</div>
      </DashboardLayout>
    )
  }

  const getRoleBadge = (role) => {
    return role === 'admin' 
      ? 'bg-purple-100 text-purple-600' 
      : 'bg-blue-100 text-blue-600'
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 bg-gray-50/50 min-h-full">
        <button 
          onClick={() => navigate('/admin/users')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Users</span>
        </button>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-white">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{user.name}</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadge(user.role)}`}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <FiMail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Email</p>
                    <p className="text-sm font-medium text-gray-900">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <FiPhone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Phone</p>
                    <p className="text-sm font-medium text-gray-900">{user.phone || 'Not provided'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <FiCalendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Birthday</p>
                    <p className="text-sm font-medium text-gray-900">
                      {user.birthday ? new Date(user.birthday).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Not provided'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <FiUser className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Member Since</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {(user.street_address || user.state || user.postal_code) && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Primary Address</h2>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-start gap-3">
                    <FiMapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      {user.street_address && <p className="text-sm text-gray-900 mb-1">{user.street_address}</p>}
                      {user.closest_landmark && <p className="text-sm text-gray-600 mb-1">Near {user.closest_landmark}</p>}
                      <p className="text-sm text-gray-600">
                        {[user.state, user.postal_code].filter(Boolean).join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {user.addresses && user.addresses.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Saved Addresses ({user.addresses.length})</h2>
                <div className="space-y-3">
                  {user.addresses.map((address) => (
                    <div key={address.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-start gap-3">
                        <FiMapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-900 mb-1">{address.street_address}</p>
                          {address.closest_landmark && (
                            <p className="text-sm text-gray-600 mb-1">Near {address.closest_landmark}</p>
                          )}
                          <p className="text-sm text-gray-600">
                            {[address.state, address.postal_code].filter(Boolean).join(', ')}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            Added {new Date(address.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {user.orders && user.orders.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Order History ({user.orders.length})</h2>
                <div className="space-y-4">
                  {user.orders.map((order) => (
                    <div key={order.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <FiShoppingBag className="w-4 h-4 text-gray-400" />
                          <span className="font-bold text-gray-900">#{order.order_number}</span>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <div className="space-y-2 mb-3">
                        {order.order_items?.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              <span className="text-gray-400 mr-2">{item.quantity}x</span>
                              {item.menu?.name}
                            </span>
                            <span className="font-medium text-gray-900">${item.subtotal}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                        <div className="text-xs text-gray-500">
                          {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} • {order.order_type}
                        </div>
                        <span className="text-lg font-bold text-orange-500">${order.final_amount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {user.orders && user.orders.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
            <FiShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No orders yet</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default SingleUser
