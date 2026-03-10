import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../DashboardLayout/DashboardLayout'
import AddCashierModal from '../../Components/Modals/AddCashierModal'
import { FiFilter, FiEye, FiMail, FiPhone, FiMapPin, FiCalendar, FiUserPlus } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import api from '../../utils/api'

const AllUsers = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('all')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAddCashierOpen, setIsAddCashierOpen] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/admin/users?per_page=100')
      setUsers(data.data)
    } catch (err) {
      console.error('Failed to fetch users:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = activeTab === 'all' 
    ? users 
    : users.filter(u => u.role === activeTab)

  const getRoleBadge = (role) => {
    return role === 'admin' 
      ? 'bg-purple-100 text-purple-600' 
      : 'bg-blue-100 text-blue-600'
  }

  return (
    <>
      <AddCashierModal 
        isOpen={isAddCashierOpen} 
        onClose={() => setIsAddCashierOpen(false)} 
        onSuccess={fetchUsers} 
      />
      <DashboardLayout>
      <div className="p-6 space-y-6 bg-gray-50/50 min-h-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-sm text-gray-500 mt-1">View and manage all users</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
              <FiFilter className="w-4 h-4" />
              Filter
            </button>
            <button 
              onClick={() => setIsAddCashierOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors shadow-sm shadow-orange-200"
            >
              <FiUserPlus className="w-4 h-4" />
              Add Cashier
            </button>
          </div>
        </div>

        <div className="bg-white p-2 rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            {['all', 'customer', 'admin'].map((tab) => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)} 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab 
                    ? "bg-gray-200 text-gray-900 shadow-sm font-semibold" 
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab === 'all' ? 'All Users' : tab.charAt(0).toUpperCase() + tab.slice(1)} 
                ({tab === 'all' ? users.length : users.filter(u => u.role === tab).length})
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading users...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <div key={user.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                <div className="p-5 border-b border-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg mb-1">{user.name}</h3>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getRoleBadge(user.role)}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5 flex-1 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiMail className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  
                  {user.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FiPhone className="w-4 h-4 text-gray-400" />
                      <span>{user.phone}</span>
                    </div>
                  )}

                  {user.state && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FiMapPin className="w-4 h-4 text-gray-400" />
                      <span>{user.state}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FiCalendar className="w-4 h-4 text-gray-400" />
                    <span>Joined {new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>

                  {user.addresses && user.addresses.length > 0 && (
                    <div className="pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-500">{user.addresses.length} saved address{user.addresses.length > 1 ? 'es' : ''}</span>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-100">
                  <button 
                    onClick={() => navigate(`/admin/users/${user.id}`)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors shadow-sm"
                  >
                    <FiEye className="w-4 h-4" />
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
    </>
  )
}

export default AllUsers
