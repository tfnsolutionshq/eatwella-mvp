import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import { useNotification } from '../../context/NotificationContext'
import { FiArrowLeft, FiMail } from 'react-icons/fi'

export default function AllMemos() {
  const navigate = useNavigate()
  const { token } = useAuth()
  const { showNotification } = useNotification()
  const [memos, setMemos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAllMemos()
  }, [token])

  const fetchAllMemos = async () => {
    try {
      const response = await axios.get('/memo-api/admin/memos', {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (response.data?.status) {
        setMemos(response.data.data?.data || [])
      } else {
        setMemos([])
      }
    } catch (error) {
      showNotification('Failed to load system memos', 'error')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-gray-600">Loading system memos...</div>
      </div>
    )
  }

  return (
    <div className="p-5 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/users')}
          className="flex items-center gap-2 text-gray-600 text-sm hover:text-gray-900 mb-6 font-medium"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to Users
        </button>

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            All System Memos
          </h1>
          <p className="text-gray-600 text-base mt-2">View all memos across the system</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-6">
            <div className="space-y-3">
              {memos.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No memos found in the system
                </div>
              ) : (
                memos.map((memo) => (
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
                          {memo.category && (
                             <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700">
                               {memo.category.name}
                             </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{memo.body?.split(/\r?\n/)[0]}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t border-gray-200">
                      <div className="flex items-center gap-4 flex-wrap">
                        <span className="font-semibold">Ref: {memo.reference_id}</span>
                        {memo.sender && (
                          <div className="flex items-center gap-2">
                            <span>From:</span>
                            <div className="flex items-center gap-1">
                              {memo.sender.avatar ? (
                                <img 
                                  src={`https://identity.smt.tfnsolutions.us/storage/${memo.sender.avatar}`}
                                  alt={memo.sender.name}
                                  className="w-5 h-5 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold">
                                  {memo.sender.name?.[0]}
                                </div>
                              )}
                              <span className="font-medium text-gray-900">{memo.sender.name}</span>
                            </div>
                          </div>
                        )}
                        {memo.recipients?.length > 0 && (
                          <span>To: {memo.recipients.length} recipient(s)</span>
                        )}
                        <span className={`px-2 py-0.5 rounded text-xs capitalize ${
                          memo.status === 'sent' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {memo.status}
                        </span>
                      </div>
                      <span className="font-medium whitespace-nowrap ml-4">
                        {new Date(memo.created_at).toLocaleString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true
                        })}
                      </span>
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
