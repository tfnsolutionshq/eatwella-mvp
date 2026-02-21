import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiPackage, FiTrendingUp, FiStar, FiAward, FiChevronRight, FiShoppingBag, FiGift, FiMail, FiPhone, FiCalendar, FiMapPin, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'

function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [overview, setOverview] = useState(null)
  const [orders, setOrders] = useState([])
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [passwordData, setPasswordData] = useState({ current_password: '', new_password: '' })
  const [deletePassword, setDeletePassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/customer/profile')
        setProfile(data)
      } catch (err) {
        console.error('Failed to fetch profile:', err)
      }
    }
    const fetchOverview = async () => {
      try {
        const { data } = await api.get('/customer/overview')
        setOverview(data)
      } catch (err) {
        console.error('Failed to fetch overview:', err)
      }
    }
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/customer/orders')
        setOrders(data.data || [])
      } catch (err) {
        console.error('Failed to fetch orders:', err)
      }
    }
    fetchProfile()
    fetchOverview()
    fetchOrders()
  }, [])

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const { data } = await api.get('/customer/addresses')
        setAddresses(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Failed to fetch addresses:', err)
      }
    }
    if (activeTab === 'profile') {
      fetchAddresses()
    }
  }, [activeTab])
  const personal = {
    email: profile?.email || user?.email || '',
    phone: profile?.phone || '',
    birthday: profile?.birthday ? new Date(profile.birthday).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''
  }
  const [addresses, setAddresses] = useState([])
  const [editingAddress, setEditingAddress] = useState(null)
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [addressForm, setAddressForm] = useState({
    street_address: '',
    state: '',
    closest_landmark: '',
    postal_code: ''
  })
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.put('/customer/change-password', passwordData)
      setShowPasswordModal(false)
      setPasswordData({ current_password: '', new_password: '' })
      alert('Password changed successfully')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async (e) => {
    e.preventDefault()
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) return
    setError('')
    setLoading(true)
    try {
      await api.put('/customer/delete-account', { password: deletePassword })
      logout()
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete account')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveAddress = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (editingAddress) {
        await api.put(`/customer/addresses/${editingAddress.id}`, addressForm)
      } else {
        await api.post('/customer/addresses', addressForm)
      }
      const { data } = await api.get('/customer/addresses')
      setAddresses(Array.isArray(data) ? data : [])
      setShowAddressModal(false)
      setEditingAddress(null)
      setAddressForm({ street_address: '', state: '', closest_landmark: '', postal_code: '' })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save address')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAddress = async (id) => {
    if (!confirm('Are you sure you want to delete this address?')) return
    try {
      await api.delete(`/customer/addresses/${id}`)
      const { data } = await api.get('/customer/addresses')
      setAddresses(Array.isArray(data) ? data : [])
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete address')
    }
  }
  return (
    <div className="bg-gray-50">
      <main className="px-4 md:px-6 py-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          <aside className="lg:col-span-3">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-3 md:p-4">
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl ${activeTab === 'overview' ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <span className="w-5 h-5 rounded-md bg-orange-100 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                  </span>
                  <span>Overview</span>
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl ${activeTab === 'orders' ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <span className="w-5 h-5 rounded-md bg-gray-100 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-gray-400" />
                  </span>
                  <span>Orders</span>
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl ${activeTab === 'profile' ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <span className="w-5 h-5 rounded-md bg-gray-100 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-gray-400" />
                  </span>
                  <span>Profile & Address</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-700 hover:bg-gray-50">
                  <span className="w-5 h-5 rounded-md bg-gray-100 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-gray-400" />
                  </span>
                  <span>Loyalty & Rewards</span>
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl ${activeTab === 'settings' ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <span className="w-5 h-5 rounded-md bg-gray-100 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-gray-400" />
                  </span>
                  <span>Settings</span>
                </button>
              </nav>
            </div>
          </aside>
          <section className="lg:col-span-9 space-y-6">
            {activeTab === 'overview' && (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-orange-50 text-orange-600">
                        <FiPackage className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{overview?.total_orders || 0}</h3>
                        <p className="text-xs text-gray-500">Total Orders</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
                        <FiTrendingUp className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">₦{overview?.total_spent || '0.00'}</h3>
                        <p className="text-xs text-gray-500">Total Spent</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-gray-50 text-gray-600">
                        <FiStar className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{overview?.loyalty_points || 0}</h3>
                        <p className="text-xs text-gray-500">Loyalty Points</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
                        <FiAward className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{overview?.member_tier || 'None'}</h3>
                        <p className="text-xs text-gray-500">Member Tier</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
                  <div className="p-6 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold">Recent Orders</h2>
                    </div>
                    <button onClick={() => setActiveTab('orders')} className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
                      <span>View All</span>
                      <FiChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="px-6 pb-6 space-y-3">
                    {orders.slice(0, 3).map((o) => (
                      <div key={o.id} className="rounded-2xl border border-gray-100 p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold">{o.order_number}</span>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">{o.status}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{new Date(o.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                            <p className="text-xs text-gray-500 mt-2">{o.order_items?.length || 0} items</p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-orange-500">₦{o.final_amount}</div>
                            <div className="text-xs text-gray-500">{o.order_type}</div>
                            <div className="mt-3 flex justify-end gap-2">
                              <button onClick={() => { setSelectedOrder(o); setShowOrderModal(true); }} className="px-3 py-1.5 rounded-full border border-gray-200 text-gray-700 text-xs">View Details</button>
                              <Link to="/menu" className="px-3 py-1.5 rounded-full bg-orange-500 text-white text-xs">Order Again</Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
                  <div className="p-6">
                    <h2 className="text-lg font-semibold">Quick Actions</h2>
                  </div>
                  <div className="px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link to="/menu" className="flex items-center gap-3 rounded-2xl border border-gray-100 p-4 hover:bg-gray-50">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-700 flex items-center justify-center">
                        <FiShoppingBag className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">Order Again</div>
                        <div className="text-xs text-gray-500">Browse our menu</div>
                      </div>
                    </Link>
                    <Link to="/loyalty-board" className="flex items-center gap-3 rounded-2xl border border-gray-100 p-4 hover:bg-gray-50">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-700 flex items-center justify-center">
                        <FiGift className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">Rewards</div>
                        <div className="text-xs text-gray-500">View your points</div>
                      </div>
                    </Link>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
                <div className="p-6 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Order History</h2>
                </div>
                <div className="px-6 pb-6 space-y-4">
                  {orders.map((o) => (
                    <div key={o.id} className="rounded-2xl border border-gray-100 p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold">{o.order_number}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">{o.status}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{new Date(o.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                          <p className="text-xs text-gray-500 mt-2">{o.order_items?.length || 0} items</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-orange-500">₦{o.final_amount}</div>
                          <div className="text-xs text-gray-500">{o.order_type}</div>
                          <div className="mt-3 flex justify-end gap-2">
                            <button onClick={() => { setSelectedOrder(o); setShowOrderModal(true); }} className="px-3 py-1.5 rounded-full border border-gray-200 text-gray-700 text-xs">View Details</button>
                            <Link to="/menu" className="px-3 py-1.5 rounded-full bg-orange-500 text-white text-xs">Order Again</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <>
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
                  <div className="p-6 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Personal Information</h2>
                    <button onClick={() => navigate('/account/edit-profile')} className="px-3 py-1.5 rounded-full border border-gray-200 text-gray-700 text-xs hover:bg-gray-50">Edit</button>
                  </div>
                  <div className="px-6 pb-6 space-y-4">
                    <div className="bg-gray-100 rounded-xl p-4 flex items-center gap-3">
                      <FiMail className="w-5 h-5 text-gray-600" />
                      <div>
                        <div className="text-xs text-gray-500">Email</div>
                        <div className="text-sm text-gray-900">{personal.email || 'Not provided'}</div>
                      </div>
                    </div>
                    <div className="bg-gray-100 rounded-xl p-4 flex items-center gap-3">
                      <FiPhone className="w-5 h-5 text-gray-600" />
                      <div>
                        <div className="text-xs text-gray-500">Phone</div>
                        <div className="text-sm text-gray-900">{personal.phone || 'Not provided'}</div>
                      </div>
                    </div>
                    <div className="bg-gray-100 rounded-xl p-4 flex items-center gap-3">
                      <FiCalendar className="w-5 h-5 text-gray-600" />
                      <div>
                        <div className="text-xs text-gray-500">Birthday</div>
                        <div className="text-sm text-gray-900">{personal.birthday || 'Not provided'}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
                  <div className="p-6 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Saved Addresses</h2>
                    <button onClick={() => { setShowAddressModal(true); setEditingAddress(null); setAddressForm({ street_address: '', state: '', closest_landmark: '', postal_code: '' }); }} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500 text-white text-xs hover:bg-orange-600">
                      <FiMapPin className="w-4 h-4" />
                      <span>Add New</span>
                    </button>
                  </div>
                  <div className="px-6 pb-6 space-y-3">
                    {addresses.length === 0 && <p className="text-sm text-gray-500">No addresses saved yet.</p>}
                    {addresses.map((addr) => (
                      <div key={addr.id} className="rounded-2xl border border-gray-100 p-5 relative">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="text-sm font-semibold">Address</div>
                        </div>
                        <div className="flex gap-2 absolute top-5 right-5">
                          <button onClick={() => { setEditingAddress(addr); setAddressForm(addr); setShowAddressModal(true); }} className="text-gray-600 hover:text-gray-900">
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteAddress(addr.id)} className="text-red-600 hover:text-red-700">
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-sm text-gray-700 leading-6">
                          <div>{addr.street_address}</div>
                          <div>{addr.state}</div>
                          <div>{addr.closest_landmark}</div>
                          <div>{addr.postal_code}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
                <div className="p-6">
                  <h2 className="text-lg font-semibold">Account Settings</h2>
                </div>
                <div className="px-6 pb-6 space-y-6">
                  {/* <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Notifications</h3>
                    <div className="space-y-3">
                      <div className="bg-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800">Order updates via email</div>
                      <div className="bg-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800">Promotional emails</div>
                      <div className="bg-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800">SMS notifications</div>
                    </div>
                  </div> */}
                  <div className="">
                    {/* <h3 className="text-sm font-semibold text-gray-900 mb-3">Privacy</h3> */}
                    <div className="space-y-3">
                      <button onClick={() => setShowPasswordModal(true)} className="w-full bg-gray-100 hover:bg-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 transition-colors">Change Password</button>
                      <button onClick={() => setShowDeleteModal(true)} className="w-full bg-red-50 hover:bg-red-100 rounded-xl px-4 py-3 text-sm text-red-600 transition-colors">Delete Account</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-xl">
            <form onSubmit={handleChangePassword}>
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-bold">Change Password</h3>
              </div>
              <div className="p-6 space-y-4">
                {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-xl text-sm">{error}</div>}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <input type="password" value={passwordData.current_password} onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <input type="password" value={passwordData.new_password} onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
              </div>
              <div className="p-6 border-t border-gray-100 flex gap-3">
                <button type="button" onClick={() => { setShowPasswordModal(false); setError(''); setPasswordData({ current_password: '', new_password: '' }); }} className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 py-3 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 disabled:opacity-50">{loading ? 'Changing...' : 'Change Password'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-xl">
            <form onSubmit={handleDeleteAccount}>
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-red-600">Delete Account</h3>
                <p className="text-sm text-gray-600 mt-2">This action cannot be undone. Please enter your password to confirm.</p>
              </div>
              <div className="p-6 space-y-4">
                {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-xl text-sm">{error}</div>}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input type="password" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
              </div>
              <div className="p-6 border-t border-gray-100 flex gap-3">
                <button type="button" onClick={() => { setShowDeleteModal(false); setError(''); setDeletePassword(''); }} className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-50">{loading ? 'Deleting...' : 'Delete Account'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-xl">
            <form onSubmit={handleSaveAddress}>
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-bold">{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>
              </div>
              <div className="p-6 space-y-4">
                {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-xl text-sm">{error}</div>}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                  <input type="text" value={addressForm.street_address} onChange={(e) => setAddressForm({...addressForm, street_address: e.target.value})} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <input type="text" value={addressForm.state} onChange={(e) => setAddressForm({...addressForm, state: e.target.value})} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Closest Landmark</label>
                  <input type="text" value={addressForm.closest_landmark} onChange={(e) => setAddressForm({...addressForm, closest_landmark: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                  <input type="text" value={addressForm.postal_code} onChange={(e) => setAddressForm({...addressForm, postal_code: e.target.value})} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
              </div>
              <div className="p-6 border-t border-gray-100 flex gap-3">
                <button type="button" onClick={() => { setShowAddressModal(false); setError(''); setEditingAddress(null); setAddressForm({ street_address: '', state: '', closest_landmark: '', postal_code: '' }); }} className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 py-3 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 disabled:opacity-50">{loading ? 'Saving...' : 'Save Address'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Order Details</h3>
                <button onClick={() => { setShowOrderModal(false); setSelectedOrder(null); }} className="text-gray-400 hover:text-gray-600">
                  <FiChevronRight className="w-5 h-5 transform rotate-90" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Order Number</p>
                  <p className="font-semibold">{selectedOrder.order_number}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">{selectedOrder.status}</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Order Type</p>
                  <p className="font-semibold capitalize">{selectedOrder.order_type}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Payment Type</p>
                  <p className="font-semibold capitalize">{selectedOrder.payment_type}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Date</p>
                  <p className="font-semibold">{new Date(selectedOrder.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
                {selectedOrder.table_number && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Table Number</p>
                    <p className="font-semibold">{selectedOrder.table_number}</p>
                  </div>
                )}
              </div>

              {selectedOrder.delivery_address && (
                <div>
                  <p className="text-xs text-gray-500 mb-2">Delivery Address</p>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm">{selectedOrder.delivery_address}</p>
                    <p className="text-sm">{selectedOrder.delivery_city}, {selectedOrder.delivery_zip}</p>
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm font-semibold mb-3">Order Items</p>
                <div className="space-y-3">
                  {selectedOrder.order_items?.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                      <img src={item.menu?.images?.[0] || 'https://via.placeholder.com/80'} alt={item.menu?.name} className="w-16 h-16 rounded-lg object-cover" />
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{item.menu?.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity} × ₦{item.price}</p>
                      </div>
                      <p className="font-bold text-orange-500">₦{item.subtotal}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Amount</span>
                  <span className="font-semibold">₦{selectedOrder.total_amount}</span>
                </div>
                {Number(selectedOrder.discount_amount) > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span className="font-semibold">-₦{selectedOrder.discount_amount}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Final Amount</span>
                  <span className="text-orange-500">₦{selectedOrder.final_amount}</span>
                </div>
              </div>

              {selectedOrder.invoice && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-2">Invoice Details</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Invoice #:</span>
                      <span className="font-semibold ml-2">{selectedOrder.invoice.invoice_number}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Payment Status:</span>
                      <span className="font-semibold ml-2 capitalize">{selectedOrder.invoice.payment_status}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
