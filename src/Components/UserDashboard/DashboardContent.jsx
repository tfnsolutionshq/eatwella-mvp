import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiPackage, FiTrendingUp, FiStar, FiAward, FiChevronRight, FiShoppingBag, FiGift, FiMail, FiPhone, FiCalendar, FiMapPin, FiEdit2, FiTrash2 } from 'react-icons/fi'

function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const storedUser = (() => { try { return JSON.parse(localStorage.getItem('customer_user') || 'null') } catch { return null } })()
  const orders = [
    { id: '#ORD-123456', status: 'completed', date: 'February 8, 2026', items: 3, total: '₦45.99', type: 'Delivery' },
    { id: '#ORD-123455', status: 'completed', date: 'February 5, 2026', items: 2, total: '₦28.50', type: 'Pickup' },
    { id: '#ORD-123454', status: 'completed', date: 'February 1, 2026', items: 4, total: '₦67.25', type: 'Dine-in' },
  ]
  const personal = {
    email: storedUser?.email || 'skilldormafrica@gmail.com',
    phone: storedUser?.phone || '+234 801 234 5678',
    birthday: storedUser?.birthday ? new Date(storedUser.birthday).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'January 15, 1990',
    street_address: storedUser?.street_address || '123 Main Street, Apt 4B',
    state: storedUser?.state || 'Lagos',
    closest_landmark: storedUser?.closest_landmark || 'Behind Transform',
    postal_code: storedUser?.postal_code || '100001'
  }
  const [editingAddress, setEditingAddress] = useState(false)
  const [address, setAddress] = useState({
    street_address: personal.street_address,
    state: personal.state,
    closest_landmark: personal.closest_landmark,
    postal_code: personal.postal_code
  })
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
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl ${activeTab === 'addresses' ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <span className="w-5 h-5 rounded-md bg-gray-100 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-gray-400" />
                  </span>
                  <span>Addresses</span>
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
                        <h3 className="text-xl font-bold">3</h3>
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
                        <h3 className="text-xl font-bold">₦141.74</h3>
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
                        <h3 className="text-xl font-bold">0</h3>
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
                        <h3 className="text-xl font-bold">Null</h3>
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
                    <Link to="/track-order" className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
                      <span>View All</span>
                      <FiChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                  <div className="px-6 pb-6 space-y-3">
                    {orders.map((o) => (
                      <div key={o.id} className="rounded-2xl border border-gray-100 p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold">{o.id}</span>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">{o.status}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{o.date}</p>
                            <p className="text-xs text-gray-500 mt-2">{o.items} items</p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-orange-500">{o.total}</div>
                            <div className="text-xs text-gray-500">{o.type}</div>
                            <div className="mt-3 flex justify-end gap-2">
                              <Link to="/receipt" className="px-3 py-1.5 rounded-full border border-gray-200 text-gray-700 text-xs">View Details</Link>
                              <Link to="/menu" className="px-3 py-1.5 rounded-full bg-orange-500 text-white text-xs">Reorder</Link>
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
                            <span className="text-sm font-semibold">{o.id}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">{o.status}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{o.date}</p>
                          <p className="text-xs text-gray-500 mt-2">{o.items} items</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-orange-500">{o.total}</div>
                          <div className="text-xs text-gray-500">{o.type}</div>
                          <div className="mt-3 flex justify-end gap-2">
                            <Link to="/receipt" className="px-3 py-1.5 rounded-full border border-gray-200 text-gray-700 text-xs">View Details</Link>
                            <Link to="/menu" className="px-3 py-1.5 rounded-full bg-orange-500 text-white text-xs">Reorder</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
                <div className="p-6 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Personal Information</h2>
                  <button className="px-3 py-1.5 rounded-full border border-gray-200 text-gray-700 text-xs">Edit</button>
                </div>
                <div className="px-6 pb-6 space-y-4">
                  <div className="bg-gray-100 rounded-xl p-4 flex items-center gap-3">
                    <FiMail className="w-5 h-5 text-gray-600" />
                    <div>
                      <div className="text-xs text-gray-500">Email</div>
                      <div className="text-sm text-gray-900">{personal.email}</div>
                    </div>
                  </div>
                  <div className="bg-gray-100 rounded-xl p-4 flex items-center gap-3">
                    <FiPhone className="w-5 h-5 text-gray-600" />
                    <div>
                      <div className="text-xs text-gray-500">Phone</div>
                      <div className="text-sm text-gray-900">{personal.phone}</div>
                    </div>
                  </div>
                  <div className="bg-gray-100 rounded-xl p-4 flex items-center gap-3">
                    <FiCalendar className="w-5 h-5 text-gray-600" />
                    <div>
                      <div className="text-xs text-gray-500">Birthday</div>
                      <div className="text-sm text-gray-900">{personal.birthday}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'addresses' && !editingAddress && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
                <div className="p-6 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Saved Addresses</h2>
                  <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500 text-white text-xs">
                    <FiMapPin className="w-4 h-4" />
                    <span>Add New</span>
                  </button>
                </div>
                <div className="px-6 pb-6">
                  <div className="rounded-2xl border border-gray-100 p-5 relative">
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-semibold">Home</div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-600 text-white">Default</span>
                    </div>
                    <button
                      onClick={() => setEditingAddress(true)}
                      className="absolute top-5 right-5 text-gray-600 hover:text-gray-900"
                      aria-label="Edit"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <div className="mt-4 text-sm text-gray-700 leading-6">
                      <div>{address.street_address}</div>
                      <div>{address.state}</div>
                      <div>{address.postal_code}</div>
                    </div>
                    <div className="mt-4">
                      <button className="text-xs text-red-600 bg-red-50 border border-red-100 px-3 py-1 rounded-lg inline-flex items-center gap-2">
                        <FiTrash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'addresses' && editingAddress && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
                <div className="p-6">
                  <h2 className="text-lg font-semibold">Address</h2>
                </div>
                <div className="px-6 pb-6 space-y-6">
                  <div>
                    <div className="text-sm text-gray-600">Street Address</div>
                    <input
                      className="mt-2 w-full bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 text-sm"
                      value={address.street_address}
                      onChange={(e) => setAddress({ ...address, street_address: e.target.value })}
                    />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">State</div>
                    <input
                      className="mt-2 w-full bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 text-sm"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Closest Landmark</div>
                    <input
                      className="mt-2 w-full bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 text-sm"
                      value={address.closest_landmark}
                      onChange={(e) => setAddress({ ...address, closest_landmark: e.target.value })}
                    />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Postal code</div>
                    <input
                      className="mt-2 w-full bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 text-sm"
                      value={address.postal_code}
                      onChange={(e) => setAddress({ ...address, postal_code: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        const merged = { ...(storedUser || {}), street_address: address.street_address, state: address.state, closest_landmark: address.closest_landmark, postal_code: address.postal_code }
                        localStorage.setItem('customer_user', JSON.stringify(merged))
                        setEditingAddress(false)
                      }}
                      className="px-4 py-2 rounded-lg bg-orange-500 text-white text-sm font-semibold"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => {
                        setAddress({
                          street_address: personal.street_address,
                          state: personal.state,
                          closest_landmark: personal.closest_landmark,
                          postal_code: personal.postal_code
                        })
                        setEditingAddress(false)
                      }}
                      className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
                <div className="p-6">
                  <h2 className="text-lg font-semibold">Account Settings</h2>
                </div>
                <div className="px-6 pb-6 space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Notifications</h3>
                    <div className="space-y-3">
                      <div className="bg-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800">Order updates via email</div>
                      <div className="bg-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800">Promotional emails</div>
                      <div className="bg-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800">SMS notifications</div>
                    </div>
                  </div>
                  <div className="border-t border-gray-100 pt-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Privacy</h3>
                    <div className="space-y-3">
                      <button className="w-full bg-gray-100 rounded-xl px-4 py-3 text-sm text-gray-900">Change Password</button>
                      <button className="w-full bg-gray-100 rounded-xl px-4 py-3 text-sm text-red-600">Delete Account</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
