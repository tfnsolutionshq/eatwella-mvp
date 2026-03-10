import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import DashboardLayout from '../../DashboardLayout/DashboardLayout'
import { FiPlus, FiEdit2, FiTrash2, FiMapPin, FiClock, FiBriefcase, FiX } from 'react-icons/fi'
import api from '../../utils/api'

const CareerOpenings = () => {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [openings, setOpenings] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingOpening, setEditingOpening] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    role: '',
    location: '',
    employment_type: 'Full-time',
    description: '',
    requirements: '',
    closes_at: '',
    is_active: true,
    image: null
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
    fetchOpenings()
  }, [user, authLoading, navigate])

  const fetchOpenings = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/careers/openings')
      console.log('Openings response:', data)
      setOpenings(Array.isArray(data) ? data : (data.data || []))
    } catch (err) {
      console.error('Failed to fetch openings:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = new FormData()
    form.append('title', formData.title)
    form.append('role', formData.role)
    form.append('location', formData.location)
    form.append('employment_type', formData.employment_type)
    form.append('description', formData.description)
    form.append('requirements', formData.requirements)
    form.append('closes_at', formData.closes_at)
    form.append('is_active', formData.is_active ? '1' : '0')
    if (formData.image) form.append('image', formData.image)

    try {
      if (editingOpening) {
        await api.post(`/admin/careers/openings/${editingOpening.id}`, form, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        showToast('Opening updated successfully!')
      } else {
        await api.post('/admin/careers/openings', form, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        showToast('Opening created successfully!')
      }
      fetchOpenings()
      closeModal()
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save opening', 'error')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this opening?')) return
    try {
      await api.delete(`/admin/careers/openings/${id}`)
      showToast('Opening deleted successfully!')
      fetchOpenings()
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete opening', 'error')
    }
  }

  const openModal = (opening = null) => {
    if (opening) {
      setEditingOpening(opening)
      setFormData({
        title: opening.title,
        role: opening.role,
        location: opening.location,
        employment_type: opening.employment_type,
        description: opening.description,
        requirements: opening.requirements,
        closes_at: opening.closes_at?.split('T')[0] || '',
        is_active: opening.is_active,
        image: null
      })
    } else {
      setEditingOpening(null)
      setFormData({
        title: '',
        role: '',
        location: '',
        employment_type: 'Full-time',
        description: '',
        requirements: '',
        closes_at: '',
        is_active: true,
        image: null
      })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingOpening(null)
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 bg-gray-50/50 min-h-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Career Openings</h1>
            <p className="text-sm text-gray-500 mt-1">Manage job postings</p>
          </div>
          <button onClick={() => openModal()} className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors shadow-sm">
            <FiPlus className="w-4 h-4" />
            Add Opening
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
              <p className="text-gray-500">Loading openings...</p>
            </div>
          ) : openings.length === 0 ? (
            <div className="col-span-full text-center py-10 bg-white rounded-2xl border border-gray-100 border-dashed">
              <p className="text-gray-900 font-medium">No openings found</p>
            </div>
          ) : (
            openings.map((opening) => (
              <div key={opening.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {opening.image_path && (
                  <img src={`https://eatwella.tfnsolutions.us/storage/${opening.image_path}`} alt={opening.title} className="w-full h-40 object-cover" />
                )}
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-bold text-gray-900">{opening.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${opening.is_active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                      {opening.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <FiBriefcase className="w-4 h-4 text-gray-400" />
                      {opening.role}
                    </div>
                    <div className="flex items-center gap-2">
                      <FiMapPin className="w-4 h-4 text-gray-400" />
                      {opening.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <FiClock className="w-4 h-4 text-gray-400" />
                      {opening.employment_type}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2">{opening.description}</p>
                  <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <button onClick={() => openModal(opening)} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                      <FiEdit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button onClick={() => handleDelete(opening.id)} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors">
                      <FiTrash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">{editingOpening ? 'Edit Opening' : 'Create Opening'}</h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <input type="text" required value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input type="text" required value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Employment Type</label>
                  <select value={formData.employment_type} onChange={(e) => setFormData({ ...formData, employment_type: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none">
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Closes At</label>
                  <input type="date" required value={formData.closes_at} onChange={(e) => setFormData({ ...formData, closes_at: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows="4" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
                <textarea required value={formData.requirements} onChange={(e) => setFormData({ ...formData, requirements: e.target.value })} rows="4" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                <input type="file" accept="image/*" onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="is_active" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500" />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Active</label>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors">
                  {editingOpening ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default CareerOpenings
