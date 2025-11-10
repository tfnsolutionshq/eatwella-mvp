"use client"

import { useState } from "react"
import {
  FiFileText,
  FiUsers,
  FiClock,
  FiCalendar,
  FiEye,
  FiSave,
  FiSend,
  FiBold,
  FiItalic,
  FiUnderline,
  FiList,
  FiAlignLeft,
  FiAlignCenter,
  FiLink,
  FiPaperclip,
  FiUpload,
  FiChevronDown,
  FiSliders
} from "react-icons/fi"

export default function ComposeMemo() {
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [category, setCategory] = useState("")
  const [priority, setPriority] = useState("Normal")
  const [subject, setSubject] = useState("")
  const [content, setContent] = useState("")
  const [recipients, setRecipients] = useState({ to: "", cc: "" })

  // Text Wizard state
  const [showWizard, setShowWizard] = useState(false)
  const [wizard, setWizard] = useState({
    purpose: "",
    audience: "",
    tone: "Formal",
    points: "",
    action: "",
    closing: ""
  })

  const generateFromWizard = () => {
    const parts = []
    if (wizard.purpose) parts.push(`Purpose: ${wizard.purpose}`)
    if (wizard.audience) parts.push(`Audience: ${wizard.audience}`)
    parts.push(`Tone: ${wizard.tone}`)
    if (wizard.points) {
      const formattedPoints = wizard.points
        .split("\n")
        .map(p => p.trim())
        .filter(Boolean)
        .map(p => `- ${p}`)
        .join("\n")
      parts.push(`Key Points:\n${formattedPoints}`)
    }
    if (wizard.action) parts.push(`Requested Action: ${wizard.action}`)
    if (wizard.closing) parts.push(`Closing: ${wizard.closing}`)
    const text = parts.join("\n\n")
    setContent(text)
    setShowWizard(false)
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
            <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              <FiEye className="w-4 h-4" />
              Preview
            </button>
            <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              <FiSave className="w-4 h-4" />
              Save Draft
            </button>
            </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Start from Template */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <FiFileText className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Start from Template</h2>
            </div>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-600"
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
            >
              <option value="">Choose a template or start from scratch</option>
              <option value="budget">Budget Request - Financial</option>
              <option value="policy">Policy Announcement - Administrative</option>
              <option value="academic">Academic Calendar - Academic</option>
              <option value="meeting">Meeting Notice - General</option>
            </select>
          </div>

          {/* Memo Details */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Memo Details</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select category</option>
                  <option value="internal">Internal Memo</option>
                  <option value="external">External Communication</option>
                  <option value="policy">Policy Update</option>
                  <option value="urgent">Urgent Notice</option>
                  <option value="confidential">Confidential</option>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <input
                type="text"
                placeholder="Enter memo subject..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Content</h2>
            <p className="text-sm text-gray-600 mb-4">Use the toolbar to format your memo content</p>
            
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-2 p-2 bg-gray-50 rounded-lg mb-4">
              <button className="p-2 hover:bg-gray-200 rounded transition-colors">
                <FiBold className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-200 rounded transition-colors">
                <FiItalic className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-200 rounded transition-colors">
                <FiUnderline className="w-4 h-4 text-gray-600" />
              </button>
              <div className="w-px h-6 bg-gray-300 mx-1"></div>
              <button className="p-2 hover:bg-gray-200 rounded transition-colors">
                <FiList className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-200 rounded transition-colors">
                <FiAlignLeft className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-200 rounded transition-colors">
                <FiAlignCenter className="w-4 h-4 text-gray-600" />
              </button>
              <div className="w-px h-6 bg-gray-300 mx-1"></div>
              <button className="p-2 hover:bg-gray-200 rounded transition-colors">
                <FiLink className="w-4 h-4 text-gray-600" />
              </button>

              {/* Text Wizard Toggle */}
              <div className="ml-auto">
                <button
                  type="button"
                  onClick={() => setShowWizard(!showWizard)}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  <FiSliders className="w-4 h-4" />
                  Text Wizard
                </button>
              </div>
            </div>

            {/* Text Wizard Panel */}
            {showWizard && (
              <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Purpose</label>
                    <input
                      type="text"
                      placeholder="Why are you sending this memo?"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      value={wizard.purpose}
                      onChange={(e) => setWizard({ ...wizard, purpose: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Audience</label>
                    <input
                      type="text"
                      placeholder="Who will receive this memo?"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      value={wizard.audience}
                      onChange={(e) => setWizard({ ...wizard, audience: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-700"
                      value={wizard.tone}
                      onChange={(e) => setWizard({ ...wizard, tone: e.target.value })}
                    >
                      <option>Formal</option>
                      <option>Neutral</option>
                      <option>Friendly</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Key Points</label>
                    <textarea
                      placeholder="List important points, one per line"
                      className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                      value={wizard.points}
                      onChange={(e) => setWizard({ ...wizard, points: e.target.value })}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Requested Action</label>
                    <input
                      type="text"
                      placeholder="What should recipients do?"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      value={wizard.action}
                      onChange={(e) => setWizard({ ...wizard, action: e.target.value })}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Closing</label>
                    <input
                      type="text"
                      placeholder="Closing line or signature"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      value={wizard.closing}
                      onChange={(e) => setWizard({ ...wizard, closing: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    onClick={generateFromWizard}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                  >
                    Generate Content
                  </button>
                </div>
              </div>
            )}

            {/* Content Area */}
            <textarea
              placeholder="Write your memo content here..."
              className="w-full h-64 px-3 py-3 border border-gray-200 bg-gray-50 rounded-lg text-sm resize-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          {/* Attachments */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <FiPaperclip className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Attachments</h2>
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <FiUpload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-600 mb-4">Drag and drop files here, or click to select</p>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                Choose Files
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Recipients */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <FiUsers className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Recipients</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex bg-gray-100 rounded-lg p-1 mb-3">
                  <button className="flex-1 px-3 py-2 bg-white text-gray-900 rounded-md text-sm font-medium shadow-sm">To</button>
                  <button className="flex-1 px-3 py-2 text-gray-600 rounded-md text-sm font-medium">CC</button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search or Add recipient"
                    className="w-full pl-3 pr-8 py-2 border border-gray-300 bg-gray-50 rounded-lg text-sm"
                    value={recipients.to}
                    onChange={(e) => setRecipients({ ...recipients, to: e.target.value })}
                  />
                  <FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Timing & Deadlines */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <FiClock className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Timing & Deadlines</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Response Deadline</label>
                <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600">
                  <FiCalendar className="w-4 h-4" />
                  <span>Set deadline</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600">
                  <FiCalendar className="w-4 h-4" />
                  <span>Set expiry date</span>
                </div>
              </div>
            </div>
          </div>

          {/* Send Options */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Send Options</h2>
            
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                <FiSend className="w-4 h-4" />
                Send Now
              </button>
              
              <button className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                <FiCalendar className="w-4 h-4" />
                Schedule for Later
              </button>
              
              <button className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                <FiSave className="w-4 h-4" />
                Save as Draft
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}