"use client"

import { useState, useEffect } from "react"
import {
  FiFileText,
  FiUsers,
  FiClock,

  FiEye,
  FiSave,
  FiSend,
  FiPaperclip,
  FiUpload,
  FiSliders,
  FiX,
  FiPlus,
  FiBold,
  FiItalic,
  FiUnderline,
  FiList,
  FiLink,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
  FiType,
  FiGitBranch,
} from "react-icons/fi"
import { useAuth } from '../../context/AuthContext'
import { useNotification } from '../../context/NotificationContext'
import { workflowAPI, categoryAPI, userAPI, memoAPI } from '../../services/api'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import './RichTextEditor.css'
import { generateMemoContent as aiGenerateMemoContent } from '../../services/ai'

export default function ComposeMemo() {
  const { token } = useAuth()
  const { showNotification } = useNotification()
  const [searchParams] = useSearchParams()
  
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [workflowMode, setWorkflowMode] = useState("template")
  const [category, setCategory] = useState("")
  const [priority, setPriority] = useState("High")
  const [subject, setSubject] = useState("")
  const [content, setContent] = useState("")
  const [useCustomReferenceId, setUseCustomReferenceId] = useState(false)
  const [referenceId, setReferenceId] = useState("")
  // const [recipients, setRecipients] = useState({ to: "", cc: "" })
  
  
  // Data from API
  const [workflows, setWorkflows] = useState([])
  const [categories, setCategories] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  
  // Recipient management
  const [activeTab, setActiveTab] = useState("to")
  const [recipientSearch, setRecipientSearch] = useState("")
  const [selectedRecipients, setSelectedRecipients] = useState([])
  
  // Scheduling
  const [scheduledFor, setScheduledFor] = useState("")
  const [isScheduled, setIsScheduled] = useState(false)

  // AI Text Generation
  const [isGenerating, setIsGenerating] = useState(false)
  const [showAIModal, setShowAIModal] = useState(false)
  const [aiContext, setAIContext] = useState("")
  const [attachments, setAttachments] = useState([])
  
  useEffect(() => {
    if (token) {
      fetchData()
    }
    
    const templateId = searchParams.get('template')
    if (templateId) {
      setSelectedTemplate(templateId)
      setWorkflowMode('template')
    }
  }, [token, searchParams])
  
  const fetchData = async () => {
    try {
      const [workflowResponse, categoryResponse, userResponse] = await Promise.all([
        workflowAPI.getActiveWorkflows(token),
        categoryAPI.getCategories(token),
        userAPI.getUsers({}, token)
      ])
      
      if (workflowResponse.status) setWorkflows(workflowResponse.data)
      if (categoryResponse.status) setCategories(categoryResponse.data.data)
      if (userResponse.status) setUsers(userResponse.data.data)
    } catch (error) {
      console.error('Error fetching data:', error)
      showNotification('Failed to load data', 'error')
    }
  }
  
  
  const addRecipient = (user, type) => {
    const newRecipient = {
      recipient_id: user.id,
      recipient_type: type,
      recipient_role: user.role_id,
      email: user.email,
      name: `${user.first_name} ${user.last_name}`.trim()
    }
    
    // Check if user already added
    const exists = selectedRecipients.some(r => r.recipient_id === user.id)
    if (!exists) {
      setSelectedRecipients(prev => [...prev, newRecipient])
    }
  }
  
  const removeRecipient = (index) => {
    setSelectedRecipients(prev => prev.filter((_, i) => i !== index))
  }
  
  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(recipientSearch.toLowerCase()) ||
    `${user.first_name} ${user.last_name}`.toLowerCase().includes(recipientSearch.toLowerCase())
  )
  
  const handleSendMemo = async (isDraft = false) => {
    if (!isDraft && (!subject.trim() || !content.trim())) {
      showNotification('Please fill in all required fields', 'error')
      return
    }

    if (!isDraft && workflowMode === 'template' && !selectedTemplate) {
      showNotification('Please select a workflow template', 'error')
      return
    }
    
    // Validate scheduling time is in the future and normalize format
    if (!isDraft && isScheduled && scheduledFor) {
      const scheduledDate = new Date(scheduledFor)
      const now = new Date()
      if (Number.isNaN(scheduledDate.getTime())) {
        showNotification('Invalid schedule time format', 'error')
        return
      }
      if (scheduledDate <= now) {
        showNotification('Schedule time must be in the future', 'error')
        return
      }
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('subject', subject)
      formData.append('body', content)
      formData.append('workflow_id', selectedTemplate === "no-workflow" ? '' : selectedTemplate || '')
      formData.append('status', isDraft ? "draft" : (isScheduled && scheduledFor ? "scheduled" : "sent"))
      formData.append('category_id', category)
      formData.append('priority', priority)
      formData.append('is_public', selectedTemplate === "no-workflow" ? '1' : '0')
      
      if (useCustomReferenceId && referenceId.trim()) {
        formData.append('reference_id', referenceId.trim())
      }
      
      selectedRecipients.forEach((r, i) => {
        formData.append(`recipients[${i}][recipient_id]`, r.recipient_id)
        formData.append(`recipients[${i}][recipient_type]`, r.recipient_type)
        formData.append(`recipients[${i}][recipient_role]`, r.recipient_role)
      })
      
      attachments.forEach(file => {
        formData.append('attachments[]', file)
      })
      
      if (isScheduled && scheduledFor) {
        formData.append('scheduled_for', new Date(scheduledFor).toISOString())
      }
      
      const response = await axios.post('http://memo.smt.tfnsolutions.us/api/v1/memos', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      
      if (response?.data?.status === true) {
        const message = isDraft ? 'Draft saved successfully!' : 
                        isScheduled ? 'Memo scheduled successfully!' : 'Memo sent successfully!'
        showNotification(message, 'success')
        // Reset form
        setSubject("")
        setContent("")
        setSelectedRecipients([])
        setCategory("")
        setSelectedTemplate("")
        setWorkflowMode("template")
        setUseCustomReferenceId(false)
        setReferenceId("")
        setScheduledFor("")
        setIsScheduled(false)
        setAttachments([])
      } else {
        const msg = response?.message || response?.data?.message || 'Failed to send memo'
        const errorsObj = response?.errors || response?.data?.errors
        let details = ''
        if (errorsObj && typeof errorsObj === 'object') {
          const parts = []
          for (const key of Object.keys(errorsObj)) {
            const arr = Array.isArray(errorsObj[key]) ? errorsObj[key] : [String(errorsObj[key])]
            parts.push(`${key}: ${arr.join('; ')}`)
          }
          details = parts.join(' | ')
        }
        showNotification(details ? `${msg} — ${details}` : msg, 'error')
      }
    } catch (error) {
      const status = error?.response?.status
      const data = error?.response?.data
      const msg = data?.message || error?.message || 'Failed to send memo'
      const errorsObj = data?.errors
      let details = ''
      if (errorsObj && typeof errorsObj === 'object') {
        const parts = []
        for (const key of Object.keys(errorsObj)) {
          const arr = Array.isArray(errorsObj[key]) ? errorsObj[key] : [String(errorsObj[key])]
          parts.push(`${key}: ${arr.join('; ')}`)
        }
        details = parts.join(' | ')
      }
      showNotification(details ? `${msg} — ${details}` : msg, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = async (files) => {
    const validFiles = Array.from(files).filter(file => {
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        showNotification(`${file.name} exceeds 10MB limit`, 'error')
        return false
      }
      return true
    })
    setAttachments(prev => [...prev, ...validFiles])
  }

  const generateAIContent = async () => {
    // Do not open modal if subject is empty
    if (!subject.trim()) {
      showNotification('Please enter a subject first', 'error')
      return
    }
    setShowAIModal(true)
  }

  const handleGenerateFromTemplate = async () => {
    if (!subject.trim()) {
      showNotification('Please enter a subject first', 'error')
      return
    }
    setIsGenerating(true)
    try {
      const html = await aiGenerateMemoContent(subject, { context: aiContext.trim() })
      setContent(html)
      setShowAIModal(false)
      showNotification('Content generated successfully!', 'success')
      
      // Focus editor and move cursor to end after content is set
      setTimeout(() => {
        const editor = document.querySelector('[contenteditable]')
        if (editor) {
          editor.focus()
          const range = document.createRange()
          const sel = window.getSelection()
          range.selectNodeContents(editor)
          range.collapse(false)
          sel.removeAllRanges()
          sel.addRange(range)
        }
      }, 100)
    } catch (error) {
      console.error('AI generation error:', error)
      const em = String(error?.message || '')
      const msg = em.includes('OpenAI unauthorized')
        ? 'OpenAI key missing or invalid. Set OPENAI_API_KEY in .env and restart.'
        : em.includes('Failed to reach AI proxy')
          ? 'AI service unreachable. Ensure dev server proxy is running.'
          : 'Failed to generate content'
      showNotification(msg, 'error')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="p-4 sm:p-5 lg:p-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Compose Memo</h1>
              <p className="text-gray-600 text-sm mt-1">Create and send memos with workflow automation</p>
            </div>
            <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => handleSendMemo(true)}
              disabled={loading}
              className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <FiSave className="w-4 h-4" />
              Save Draft
            </button>
            </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Workflow Options */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <FiGitBranch className="w-5 h-5 text-gray-600" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Workflow Options</h2>
                <p className="text-sm text-gray-500">Choose how you want to send this memo</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {/* With Workflow Template Card */}
              <div 
                onClick={() => {
                  setWorkflowMode('template')
                  if (selectedTemplate === 'no-workflow') setSelectedTemplate('')
                }}
                className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${
                  workflowMode === 'template' 
                    ? 'border-gray-900 bg-gray-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <FiGitBranch className={`w-5 h-5 ${workflowMode === 'template' ? 'text-gray-900' : 'text-gray-500'}`} />
                  <h3 className="font-semibold text-gray-900">With Workflow Template</h3>
                </div>
                <p className="text-sm text-gray-500">Use predefined approval workflow with configured steps</p>
              </div>

              {/* Without Workflow Template Card */}
              <div 
                onClick={() => {
                  setWorkflowMode('direct')
                  setSelectedTemplate('no-workflow')
                }}
                className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${
                  workflowMode === 'direct' 
                    ? 'border-gray-900 bg-gray-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <FiUsers className={`w-5 h-5 ${workflowMode === 'direct' ? 'text-gray-900' : 'text-gray-500'}`} />
                  <h3 className="font-semibold text-gray-900">Without Workflow Template</h3>
                </div>
                <p className="text-sm text-gray-500">Directly select recipients without predefined workflow</p>
              </div>
            </div>

            {/* Template Selector - Only show if 'template' mode is selected */}
            {workflowMode === 'template' && (
              <div className="mt-4 animate-fadeIn">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Workflow Template</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-600"
                  value={selectedTemplate === 'no-workflow' ? '' : selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                >
                  <option value="">Choose a workflow template...</option>
                  {workflows.map(workflow => (
                    <option key={workflow.id} value={workflow.id}>
                      {workflow.name} - {workflow.category_name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Memo Details */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Memo Details</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority Level</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-700"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="Low">Low</option>
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
              <input
                type="text"
                placeholder="Enter memo subject..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Memo Reference ID</label>
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="checkbox"
                  id="useCustomReferenceId"
                  className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                  checked={useCustomReferenceId}
                  onChange={(e) => setUseCustomReferenceId(e.target.checked)}
                />
                <label htmlFor="useCustomReferenceId" className="text-sm text-gray-700 select-none cursor-pointer">
                  Use custom reference ID
                </label>
              </div>
              
              {useCustomReferenceId ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Custom Reference ID</label>
                  <input
                    type="text"
                    placeholder="Enter custom reference ID..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
                    value={referenceId}
                    onChange={(e) => setReferenceId(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter your own reference ID or leave blank to use system-generated ID</p>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-gray-600">System Generated ID:</span>
                    {/* <span className="bg-gray-200 text-gray-700 text-xs font-mono px-2 py-1 rounded">MEM/2025/12/Y7OWRA</span> */}
                  </div>
                  <p className="text-xs text-gray-500">A reference ID will be automatically assigned when the memo is sent</p>
                </div>
              )}
            </div>
            

          </div>

          {/* Content */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Content</h2>
            <p className="text-sm text-gray-600 mb-4">Use the toolbar to format your memo content</p>
            
            {/* Rich Text Toolbar */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1 p-2 bg-gray-50 rounded-lg flex-wrap">
                {/* Text Formatting */}
                <button
                  type="button"
                  onClick={() => document.execCommand('bold')}
                  className="p-2 hover:bg-gray-200 rounded transition-colors"
                >
                  <FiBold className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  type="button"
                  onClick={() => document.execCommand('italic')}
                  className="p-2 hover:bg-gray-200 rounded transition-colors"
                >
                  <FiItalic className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  type="button"
                  onClick={() => document.execCommand('underline')}
                  className="p-2 hover:bg-gray-200 rounded transition-colors"
                >
                  <FiUnderline className="w-4 h-4 text-gray-600" />
                </button>
                
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                
                {/* Text Color */}
                <input
                  type="color"
                  onChange={(e) => document.execCommand('foreColor', false, e.target.value)}
                  className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                  title="Text Color"
                />
                
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                
                {/* Alignment */}
                <button
                  type="button"
                  onClick={() => document.execCommand('justifyLeft')}
                  className="p-2 hover:bg-gray-200 rounded transition-colors"
                >
                  <FiAlignLeft className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  type="button"
                  onClick={() => document.execCommand('justifyCenter')}
                  className="p-2 hover:bg-gray-200 rounded transition-colors"
                >
                  <FiAlignCenter className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  type="button"
                  onClick={() => document.execCommand('justifyRight')}
                  className="p-2 hover:bg-gray-200 rounded transition-colors"
                >
                  <FiAlignRight className="w-4 h-4 text-gray-600" />
                </button>
                
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                
                {/* Lists */}
                <button
                  type="button"
                  onClick={() => document.execCommand('insertUnorderedList')}
                  className="p-2 hover:bg-gray-200 rounded transition-colors"
                >
                  <FiList className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  type="button"
                  onClick={() => document.execCommand('insertOrderedList')}
                  className="p-2 hover:bg-gray-200 rounded transition-colors"
                  title="Numbered List"
                >
                  <FiType className="w-4 h-4 text-gray-600" />
                </button>
                
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                
                {/* Links */}
                <button
                  type="button"
                  onClick={() => {
                    const url = prompt('Enter URL:')
                    if (url) document.execCommand('createLink', false, url)
                  }}
                  className="p-2 hover:bg-gray-200 rounded transition-colors"
                >
                  <FiLink className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              
              <button
                type="button"
                onClick={generateAIContent}
                disabled={isGenerating}
                className="flex items-center gap-2 px-3 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {isGenerating ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <FiSliders className="w-4 h-4" />
                )}
                {isGenerating ? 'Generating...' : 'Generate with AI'}
              </button>
            </div>

            <div
              ref={(el) => {
                if (el && content && !el.textContent) {
                  el.innerHTML = content
                  // Move cursor to end
                  const range = document.createRange()
                  const sel = window.getSelection()
                  range.selectNodeContents(el)
                  range.collapse(false)
                  sel.removeAllRanges()
                  sel.addRange(range)
                }
              }}
              contentEditable
              className="w-full min-h-[200px] p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent overflow-auto"
              style={{ 
                whiteSpace: 'pre-wrap',
                lineHeight: '1.6'
              }}
              onInput={(e) => setContent(e.target.innerHTML)}
              onKeyDown={(e) => {
                if (e.key === 'Tab') {
                  e.preventDefault()
                  document.execCommand('insertHTML', false, '&nbsp;&nbsp;&nbsp;&nbsp;')
                }
              }}
              data-placeholder="Enter your memo content here..."
            />
          </div>

          {/* Attachments */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <FiPaperclip className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Attachments</h2>
            </div>
            
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
              onDragOver={(e) => { e.preventDefault() }}
              onDrop={(e) => {
                e.preventDefault()
                const files = e.dataTransfer.files
                if (files.length) handleFileSelect(files)
              }}
            >
              <FiUpload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-600 mb-4">Drag and drop files here, or click to select</p>
              <input
                id="memo-attachments"
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                  const files = e.target.files
                  if (files.length) handleFileSelect(files)
                  e.target.value = ''
                }}
              />
              <button
                type="button"
                onClick={() => document.getElementById('memo-attachments')?.click()}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Choose Files
              </button>
            </div>
            {attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-700 truncate">{file.name}</div>
                      <div className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAttachments(prev => prev.filter((_, i) => i !== index))}
                      className="text-red-600 hover:text-red-800 ml-2"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Recipients or Workflow Steps based on mode */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            {workflowMode === 'direct' ? (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <FiUsers className="w-5 h-5 text-gray-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Recipients</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex bg-gray-100 rounded-lg p-1 mb-3">
                      <button 
                        onClick={() => setActiveTab("to")}
                        className={`flex-1 px-3 py-2 rounded-md text-sm font-medium ${
                          activeTab === "to" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"
                        }`}
                      >
                        To
                      </button>
                      <button 
                        onClick={() => setActiveTab("cc")}
                        className={`flex-1 px-3 py-2 rounded-md text-sm font-medium ${
                          activeTab === "cc" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"
                        }`}
                      >
                        CC
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search users..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        value={recipientSearch}
                        onChange={(e) => setRecipientSearch(e.target.value)}
                      />
                    </div>
                    
                    {/* User Search Results */}
                    {recipientSearch && (
                      <div className="mt-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
                        {filteredUsers.map(user => (
                          <div
                            key={user.id}
                            onClick={() => {
                              addRecipient(user, activeTab)
                              setRecipientSearch("")
                            }}
                            className="p-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          >
                            <div className="font-medium text-sm">{user.first_name} {user.last_name}</div>
                            <div className="text-xs text-gray-600">{user.email}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Selected Recipients Display */}
                  {selectedRecipients.length > 0 && (
                    <div className="space-y-2">
                      {selectedRecipients.map((recipient, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-1 text-xs rounded ${
                              recipient.recipient_type === 'to' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {recipient.recipient_type.toUpperCase()}
                            </span>
                            <div>
                              <div className="font-medium text-sm">{recipient.name}</div>
                              <div className="text-xs text-gray-600">{recipient.email}</div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeRecipient(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <FiGitBranch className="w-5 h-5 text-gray-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Workflow Steps</h2>
                </div>
                
                {selectedTemplate ? (
                  <div className="space-y-4">
                    {(() => {
                      const currentWorkflow = workflows.find(w => w.id === selectedTemplate)
                      const steps = currentWorkflow?.steps || []
                      
                      if (steps.length === 0) {
                        return (
                          <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                            <p className="text-sm text-gray-500">No steps defined for this workflow</p>
                          </div>
                        )
                      }

                      const sortedSteps = steps.sort((a, b) => a.order - b.order)
                      const visibleSteps = sortedSteps.slice(0, 3)
                      const remainingCount = sortedSteps.length - 3

                      return (
                        <>
                          {visibleSteps.map((step, index) => (
                            <div key={step.id} className="relative flex gap-3">
                              {/* Connector Line */}
                              {(index !== visibleSteps.length - 1 || remainingCount > 0) && (
                                <div className="absolute left-[15px] top-8 bottom-[-16px] w-0.5 bg-gray-200"></div>
                              )}
                              
                              {/* Step Number/Icon */}
                              <div className="relative z-10 flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-xs font-medium text-blue-700">
                                {step.order}
                              </div>
                              
                              {/* Step Details */}
                              <div className="flex-1 pb-1">
                                <div className="flex justify-between items-start">
                                  <h3 className="text-sm font-medium text-gray-900">{step.name}</h3>
                                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                                    step.type === 'Approval' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'
                                  }`}>
                                    {step.type}
                                  </span>
                                </div>
                                
                                <div className="mt-1 space-y-1">
                                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                    <FiUsers className="w-3 h-3" />
                                    <span>Role: {step.required_role_name}</span>
                                  </div>
                                  {step.time_limit > 0 && (
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                      <FiClock className="w-3 h-3" />
                                      <span>{step.time_limit} hours</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          {remainingCount > 0 && (
                            <div className="relative flex gap-3">
                              {/* Step Number/Icon */}
                              <div className="relative z-10 flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                                <FiPlus className="w-3 h-3" />
                              </div>
                              
                              {/* Step Details */}
                              <div className="flex-1 pt-1.5">
                                <h3 className="text-sm font-medium text-gray-500">+{remainingCount} other steps</h3>
                              </div>
                            </div>
                          )}
                        </>
                      )
                    })()}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <FiGitBranch className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Select a workflow template to view approval steps</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Schedule Section */}
          {isScheduled && (
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-4">
                <FiClock className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Schedule</h2>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Schedule Send Time</label>
                <input
                  type="datetime-local"
                  value={scheduledFor}
                  onChange={(e) => setScheduledFor(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
          )}

          {/* Send Options */}
          <div className="bg-white ">
            <div className="space-y-3">
              <button 
                onClick={() => handleSendMemo(false)}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <FiSend className="w-4 h-4" />
                )}
                {loading ? 'Sending...' : 'Send'}
              </button>
              
              <button 
                onClick={() => {
                  if (isScheduled) {
                    setIsScheduled(false)
                    setScheduledFor("")
                  } else {
                    setIsScheduled(true)
                  }
                }}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {isScheduled ? <FiX className="w-4 h-4" /> : <FiClock className="w-4 h-4" />}
                {isScheduled ? 'Remove Schedule' : 'Schedule for Later'}
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* AI Context Modal */}
      {showAIModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-gray-900">Add more context</h3>
              <button onClick={() => setShowAIModal(false)} className="text-gray-500 hover:text-gray-700">
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Add more context</label>
              <textarea
                value={aiContext}
                onChange={(e) => setAIContext(e.target.value)}
                placeholder="Add more context for better ai generated result"
                className="w-full px-3 py-2 border rounded-lg text-sm"
                rows={4}
              />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={()=>setShowAIModal(false)} className="px-3 py-2 bg-white border rounded-lg text-sm hover:bg-gray-50">Cancel</button>
              <button type="button" onClick={handleGenerateFromTemplate} disabled={isGenerating} className="px-3 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800 disabled:opacity-50">{isGenerating? 'Generating...' : 'Generate'}</button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
