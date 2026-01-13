import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { userAPI } from "../../services/api"
import { useAuth } from "../../context/AuthContext"
import { useNotification } from "../../context/NotificationContext"
import { FiArrowLeft } from "react-icons/fi"

export default function UserMemos() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()
  const { showNotification } = useNotification()
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState("inbox")
  const [memos, setMemos] = useState({ inbox: [], sent: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserAndMemos()
  }, [userId, token])

  const fetchUserAndMemos = async () => {
    try {
      const [userRes, inboxRes, sentRes] = await Promise.all([
        userAPI.getUserById(userId, token),
        axios.get(`http://memo.smt.tfnsolutions.us/api/v1/admin/users/${userId}/memos/inbox`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`http://memo.smt.tfnsolutions.us/api/v1/admin/users/${userId}/memos/sent`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])
      
      const foundUser = userRes?.data || userRes?.data?.data
      setUser(foundUser)
      setMemos({
        inbox: inboxRes.data?.data?.data || [],
        sent: sentRes.data?.data?.data || []
      })
    } catch (e) {
      showNotification?.("Failed to load user memos", "error")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="p-5 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate("/users")}
          className="flex items-center gap-2 text-gray-600 text-sm hover:text-gray-900 mb-6 font-medium"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to Users
        </button>

        <div className="mb-8">
          <div className="flex items-center gap-4">
            {user?.avatar ? (
              <img
                src={`https://identity.smt.tfnsolutions.us/storage/${user.avatar}`}
                alt={user.first_name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold text-lg">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </div>
            )}
            <div>
              <h1 className="text-2xl sm:text-2xl font-bold text-gray-900">
                {user?.first_name} {user?.last_name}'s Memos
              </h1>
              <p className="text-gray-600 text-sm mt-1">{user?.email}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex gap-4 px-6">
              <button
                onClick={() => setActiveTab("inbox")}
                className={`px-4 py-4 font-semibold text-sm transition-colors border-b-2 ${
                  activeTab === "inbox"
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                Inbox ({memos.inbox.length})
              </button>
              <button
                onClick={() => setActiveTab("sent")}
                className={`px-4 py-4 font-semibold text-sm transition-colors border-b-2 ${
                  activeTab === "sent"
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                Sent ({memos.sent.length})
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-3">
              {(activeTab === "inbox" ? memos.inbox : memos.sent).length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No memos found in {activeTab}
                </div>
              ) : (
                (activeTab === "inbox" ? memos.inbox : memos.sent).map((memo) => (
                  <div
                    key={memo.id}
                    className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow bg-white cursor-pointer"
                    onClick={() => navigate(`/admin/mail-content/${memo.id}`)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-gray-900 text-lg">{memo.subject}</h3>
                          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700">
                            {memo.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{memo.body?.split(/\r?\n/)[0]}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t border-gray-200">
                      <div className="flex items-center gap-4">
                        <span className="font-semibold">Ref: {memo.reference_id}</span>
                        <span>Category: {memo.category?.name}</span>
                        {activeTab === "inbox" && memo.sender && (
                          <span>From: {memo.sender.name}</span>
                        )}
                        {activeTab === "sent" && memo.recipients?.length > 0 && (
                          <span>To: {memo.recipients.length} recipient(s)</span>
                        )}
                      </div>
                      <span className="font-medium">{new Date(memo.created_at).toLocaleString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true
                      })}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
