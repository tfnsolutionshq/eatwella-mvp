import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import DashboardLayout from '../../DashboardLayout/DashboardLayout'
import { FiFilter, FiDownload, FiCalendar, FiUser, FiMail, FiPhone, FiBriefcase, FiFileText, FiClock } from 'react-icons/fi'
import api from '../../utils/api'

const Vacancies = () => {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    page: 1,
    per_page: 15,
    role: '',
    date: '',
  })
  const [pagination, setPagination] = useState({
    total: 0,
    last_page: 1,
    current_page: 1,
    from: 0,
    to: 0
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
    fetchApplications()
  }, [filters.page, filters.role, filters.date, user, authLoading, navigate])

  const fetchApplications = async () => {
    setLoading(true)
    try {
      const params = {
        page: filters.page,
        per_page: filters.per_page,
      }
      if (filters.role) params.role = filters.role
      if (filters.date) params.date = filters.date

      const { data } = await api.get('/admin/careers/applications', { params })
      
      setApplications(data.data || [])
      setPagination({
        total: data.total || 0,
        last_page: data.last_page || 1,
        current_page: data.current_page || 1,
        from: data.from || 0,
        to: data.to || 0
      })
    } catch (err) {
      console.error('Failed to fetch applications:', err)
    } finally {
      setLoading(false)
    }
  }

  const getFileUrl = (path) => {
    if (!path) return null
    if (path.startsWith('http')) return path
    // Assuming storage/public convention for Laravel
    return `https://eatwella.tfnsolutions.us/storage/${path}`
  }

  const handleDownload = (path) => {
    const url = getFileUrl(path)
    if (url) window.open(url, '_blank')
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'submitted': return 'bg-blue-50 text-blue-600 border-blue-100'
      case 'reviewed': return 'bg-yellow-50 text-yellow-600 border-yellow-100'
      case 'accepted': return 'bg-green-50 text-green-600 border-green-100'
      case 'rejected': return 'bg-red-50 text-red-600 border-red-100'
      default: return 'bg-gray-50 text-gray-600 border-gray-100'
    }
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 bg-gray-50/50 min-h-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Career Applications</h1>
            <p className="text-sm text-gray-500 mt-1">Manage job applications and candidates</p>
          </div>
          <div className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
            Total Applications: <span className="font-semibold text-gray-900">{pagination.total}</span>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
             <div className="relative">
               <FiBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
               <input
                type="text"
                placeholder="Filter by Role (e.g. Chef)"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={filters.role}
                onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value, page: 1 }))}
              />
             </div>
          </div>
          <div className="sm:w-48">
            <div className="relative">
              <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-600"
                value={filters.date}
                onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value, page: 1 }))}
              />
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
              <p className="text-gray-500">Loading applications...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-2xl border border-gray-100 border-dashed">
              <div className="bg-gray-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiUser className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-900 font-medium">No applications found</p>
              <p className="text-gray-500 text-sm mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            applications.map((app) => (
              <div key={app.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-gray-900">{app.full_name}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium capitalize ${getStatusColor(app.status)}`}>
                            {app.status || 'Submitted'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-orange-600 font-medium mt-1">
                          <FiBriefcase className="w-4 h-4" />
                          {app.role}
                        </div>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-y-2 gap-x-8 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <FiMail className="w-4 h-4 text-gray-400" />
                        <a href={`mailto:${app.email}`} className="hover:text-orange-600 transition-colors">{app.email}</a>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiPhone className="w-4 h-4 text-gray-400" />
                        <a href={`tel:${app.phone}`} className="hover:text-orange-600 transition-colors">{app.phone}</a>
                      </div>
                      <div className="flex items-center gap-2 sm:col-span-2">
                        <FiClock className="w-4 h-4 text-gray-400" />
                        <span>Submitted: {formatDate(app.submitted_at || app.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col justify-center gap-3 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 min-w-[200px]">
                    {app.cv_path ? (
                      <button 
                        onClick={() => handleDownload(app.cv_path)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-lg text-sm font-medium hover:bg-orange-100 transition-colors"
                      >
                        <FiFileText className="w-4 h-4" />
                        Download CV
                      </button>
                    ) : (
                      <button disabled className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 text-gray-400 rounded-lg text-sm font-medium cursor-not-allowed">
                        <FiFileText className="w-4 h-4" />
                        No CV
                      </button>
                    )}
                    
                    {app.cover_letter_path ? (
                      <button 
                        onClick={() => handleDownload(app.cover_letter_path)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                      >
                        <FiFileText className="w-4 h-4" />
                        Cover Letter
                      </button>
                    ) : (
                      <button disabled className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 text-gray-400 rounded-lg text-sm font-medium cursor-not-allowed">
                        <FiFileText className="w-4 h-4" />
                        No Cover Letter
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {pagination.last_page > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 border-t border-gray-200 pt-6">
            <div className="text-sm text-gray-500">
              Showing {pagination.from} to {pagination.to} of {pagination.total} results
            </div>
            <div className="flex gap-2">
              <button
                disabled={filters.page === 1}
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 text-sm font-medium disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                disabled={filters.page === pagination.last_page}
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 text-sm font-medium disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default Vacancies
