import React, { useState, useEffect } from 'react'
import api from '../../utils/api'
import { FiUpload, FiCheck, FiAlertCircle, FiMapPin, FiClock, FiBriefcase, FiX } from 'react-icons/fi'

function VacancyItems() {
  const [openings, setOpenings] = useState([])
  const [selectedOpening, setSelectedOpening] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    opening_id: ''
  })
  const [cv, setCv] = useState(null)
  const [coverLetter, setCoverLetter] = useState(null)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    fetchOpenings()
  }, [])

  const fetchOpenings = async () => {
    try {
      const { data } = await api.get('/careers/openings')
      console.log('Openings response:', data)
      const allOpenings = Array.isArray(data) ? data : (data.data || [])
      setOpenings(allOpenings.filter(o => o.is_active))
    } catch (err) {
      console.error('Failed to fetch openings:', err)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e, setFile) => {
    if (e.target.files?.[0]) setFile(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })

    if (!cv && !coverLetter) {
      setMessage({ type: 'error', text: 'Please upload either a CV or a Cover Letter.' })
      return
    }

    setLoading(true)
    const data = new FormData()
    data.append('full_name', formData.full_name)
    data.append('email', formData.email)
    data.append('phone', formData.phone)
    data.append('opening_id', formData.opening_id)
    if (cv) data.append('cv', cv)
    if (coverLetter) data.append('cover_letter', coverLetter)

    try {
      const response = await api.post('/careers/apply', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setMessage({ type: 'success', text: response.data.message || 'Application submitted successfully!' })
      setFormData({ full_name: '', email: '', phone: '', opening_id: '' })
      setCv(null)
      setCoverLetter(null)
      setSelectedOpening(null)
      document.getElementById('cv-upload').value = ''
      document.getElementById('cover-letter-upload').value = ''
    } catch (err) {
      let errorMsg = 'Failed to submit application.'
      if (err.response?.data?.errors) {
        errorMsg = Object.values(err.response.data.errors).flat().join(' ')
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message
      }
      setMessage({ type: 'error', text: errorMsg })
    } finally {
      setLoading(false)
    }
  }

  const openApplicationModal = (opening) => {
    setSelectedOpening(opening)
    setFormData({ ...formData, opening_id: opening.id })
    setMessage({ type: '', text: '' })
  }

  return (
    <div className="bg-gray-50/50 py-16 px-4 md:px-8 min-h-screen font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16 relative">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-orange-100 rounded-full blur-3xl -z-10"></div>
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-gray-900 font-bolota tracking-tight">Current Openings</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">Join our passionate team and help us deliver happiness, one meal at a time.</p>
        </div>

        {openings.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[2.5rem] shadow-sm border border-gray-100">
            <div className="bg-orange-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiBriefcase className="w-10 h-10 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Openings Available</h3>
            <p className="text-gray-500">We don't have any vacancies right now, but check back soon!</p>
          </div>
        ) : (
          <div className="grid gap-8 mb-12">
            {openings.map((opening) => (
              <div key={opening.id} className="group bg-white rounded-[2rem] shadow-sm hover:shadow-xl border border-gray-100/50 overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col md:flex-row">
                {opening.image_path && (
                  <div className="md:w-72 h-56 md:h-auto relative overflow-hidden">
                    <img 
                        src={`https://eatwella.tfnsolutions.us/storage/${opening.image_path}`} 
                        alt={opening.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                )}
                <div className="p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                            <FiBriefcase className="w-3.5 h-3.5" /> {opening.role}
                        </span>
                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                            <FiClock className="w-3.5 h-3.5" /> {opening.employment_type}
                        </span>
                         <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                            <FiMapPin className="w-3.5 h-3.5" /> {opening.location}
                        </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">{opening.title}</h3>
                    <p className="text-gray-500 leading-relaxed mb-6 line-clamp-2">{opening.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-100">
                    <span className="text-sm font-medium text-gray-400">Posted recently</span>
                    <button
                        onClick={() => openApplicationModal(opening)}
                        className="px-8 py-3 rounded-full bg-gray-900 text-white font-bold hover:bg-orange-500 transition-all duration-300 shadow-lg hover:shadow-orange-500/30 transform active:scale-95"
                    >
                        Apply Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedOpening && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full my-8 transform transition-all animate-in fade-in zoom-in duration-300">
            <div className="relative bg-orange-500 p-8 rounded-t-[2.5rem] overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                
                <div className="relative z-10 flex justify-between items-start">
                    <div className="text-white">
                        <h2 className="text-3xl font-bold font-bolota mb-2">Apply Now</h2>
                        <p className="text-orange-100 font-medium text-lg">{selectedOpening.title}</p>
                    </div>
                    <button 
                        onClick={() => setSelectedOpening(null)} 
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
                    >
                        <FiX className="w-6 h-6" />
                    </button>
                </div>
            </div>

            <div className="p-8">
              {message.text ? (
                <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 ${
                  message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                }`}>
                  <div className={`p-2 rounded-full ${message.type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
                    {message.type === 'success' ? <FiCheck className="w-5 h-5" /> : <FiAlertCircle className="w-5 h-5" />}
                  </div>
                  <p className="font-medium">{message.text}</p>
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      required
                      placeholder="e.g. John Doe"
                      className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="e.g. john@example.com"
                      className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="e.g. +234 800 000 0000"
                    className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">CV / Resume <span className="text-red-500">*</span></label>
                    <div className="relative group">
                      <input
                        type="file"
                        id="cv-upload"
                        onChange={(e) => handleFileChange(e, setCv)}
                        accept=".pdf,.doc,.docx"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className={`w-full px-4 py-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center transition-all duration-300 ${
                        cv ? 'border-green-500 bg-green-50/50' : 'border-gray-200 bg-gray-50 group-hover:border-orange-400 group-hover:bg-orange-50'
                      }`}>
                        {cv ? (
                          <>
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2 text-green-600">
                                <FiCheck className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-bold text-green-700 truncate max-w-full px-2">{cv.name}</span>
                          </>
                        ) : (
                          <>
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2 text-gray-400 group-hover:bg-orange-100 group-hover:text-orange-500 transition-colors">
                                <FiUpload className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-medium text-gray-500 group-hover:text-orange-600">Upload CV</span>
                            <span className="text-xs text-gray-400 mt-1">PDF or DOC</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Cover Letter <span className="text-gray-400 font-normal">(Optional)</span></label>
                    <div className="relative group">
                      <input
                        type="file"
                        id="cover-letter-upload"
                        onChange={(e) => handleFileChange(e, setCoverLetter)}
                        accept=".pdf,.doc,.docx"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className={`w-full px-4 py-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center transition-all duration-300 ${
                        coverLetter ? 'border-green-500 bg-green-50/50' : 'border-gray-200 bg-gray-50 group-hover:border-orange-400 group-hover:bg-orange-50'
                      }`}>
                        {coverLetter ? (
                          <>
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2 text-green-600">
                                <FiCheck className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-bold text-green-700 truncate max-w-full px-2">{coverLetter.name}</span>
                          </>
                        ) : (
                          <>
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2 text-gray-400 group-hover:bg-orange-100 group-hover:text-orange-500 transition-colors">
                                <FiUpload className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-medium text-gray-500 group-hover:text-orange-600">Upload Letter</span>
                            <span className="text-xs text-gray-400 mt-1">PDF or DOC</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg shadow-lg hover:shadow-orange-500/40 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all transform active:scale-[0.98]"
                  >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Submitting...
                        </span>
                    ) : 'Submit Application'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedOpening(null)}
                    className="w-full py-3 mt-3 text-gray-500 font-bold hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VacancyItems
