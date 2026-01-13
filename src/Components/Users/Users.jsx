import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { userAPI } from "../../services/api"
import { useAuth } from "../../context/AuthContext"
import { useNotification } from "../../context/NotificationContext"
import { FiMail } from "react-icons/fi"

export default function Users() {
  const navigate = useNavigate()
  const { token } = useAuth()
  const { showNotification } = useNotification()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [token])

  const fetchUsers = async () => {
    try {
      const res = await userAPI.getUsers({}, token)
      if (res.status && res.data) {
        setUsers(res.data.data || [])
      } else {
        setUsers([])
      }
    } catch (e) {
      showNotification?.("Failed to load users", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleViewMemos = (userId) => {
    navigate(`/users/${userId}/memos`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-gray-600">Loading user memos</div>
      </div>
    )
  }

  return (
    <div className="p-5 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Users Management
            </h1>
            <p className="text-gray-600 text-base mt-2">Manage and view all system users</p>
          </div>
          <button
            onClick={() => navigate('/admin/all-memos')}
            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors"
          >
            <FiMail className="w-4 h-4" />
            View All Memos
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Name</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Email</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Department</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Role</th>
                  <th className="px-4 py-2 text-right text-sm font-semibold whitespace-nowrap">Memos Sent</th>
                  {/* <th className="px-4 py-2 text-left text-sm font-semibold">Status</th> */}
                  <th className="px-4 py-2 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        {user.avatar ? (
                          <img
                            src={`https://identity.smt.tfnsolutions.us/storage/${user.avatar}`}
                            alt={user.first_name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold text-sm">
                            {user.first_name?.[0]}{user.last_name?.[0]}
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-sm text-gray-900">
                            {user.first_name} {user.last_name}
                          </div>
                          {user.last_login_at && (
                            <div className="text-xs text-gray-500">
                              Last login: {new Date(user.last_login_at).toLocaleString('en-US', {
                                year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">{user.email}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{user.department?.name || "N/A"}</td>
                    <td className="px-4 py-2">
                      <span className="px-3 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-semibold">
                        {user.role?.name || "N/A"}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm font-semibold text-gray-900 text-center whitespace-nowrap tabular-nums">
                      {user.approval_stats?.total_memos_sent || 0}
                    </td>
                    {/* <td className="px-4 py-2">
                      <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700">
                        {user.is_active ? "Active" : "Inactive"}
                      </span>
                    </td> */}
                    <td className="px-4 py-2 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleViewMemos(user.id)}
                        className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-50 transition-all"
                      >
                        <FiMail className="w-4 h-4" />
                        View Memos
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
