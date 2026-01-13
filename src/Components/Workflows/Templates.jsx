import React, { useState } from 'react'
import { FiSearch, FiDownload, FiEye, FiDollarSign, FiFileText, FiUsers, FiShield } from 'react-icons/fi'
import PreviewModal from './PreviewModal'
import { useNavigate } from 'react-router-dom'

function Templates({ workflows = [] }) {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [showPreview, setShowPreview] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)

  const getIcon = (categoryName) => {
    const icons = {
      'Internal memo': FiFileText,
      'External communication': FiUsers,
      'Policy update': FiShield,
      'Urgent notice': FiUsers,
      'Confidential': FiShield
    }
    return icons[categoryName] || FiFileText
  }

  const getIconColors = (categoryName) => {
    const colors = {
      'Internal memo': { iconColor: 'text-blue-600', iconBg: 'bg-blue-100' },
      'External communication': { iconColor: 'text-green-600', iconBg: 'bg-green-100' },
      'Policy update': { iconColor: 'text-purple-600', iconBg: 'bg-purple-100' },
      'Urgent notice': { iconColor: 'text-orange-600', iconBg: 'bg-orange-100' },
      'Confidential': { iconColor: 'text-red-600', iconBg: 'bg-red-100' }
    }
    return colors[categoryName] || { iconColor: 'text-gray-600', iconBg: 'bg-gray-100' }
  }

  const templates = workflows.map(workflow => {
    const colors = getIconColors(workflow.category_name)
    return {
      id: workflow.id,
      title: workflow.name,
      description: workflow.description,
      category: workflow.category_name,
      duration: `${workflow.estimated_completion_time}h`,
      icon: getIcon(workflow.category_name),
      iconColor: colors.iconColor,
      iconBg: colors.iconBg,
      steps: workflow.steps.map(step => step.name),
      features: ['Multi-step approval', 'Time tracking', 'Role-based access'],
      usage: workflow.success_rate || 0,
      workflow: workflow
    }
  })

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All Categories' || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Workflow Templates</h2>
            <p className="text-gray-600 text-sm mt-1">Get started quickly with pre-built workflow templates</p>
          </div>
          <button className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
            <FiDownload className="w-4 h-4" />
            Import Template
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          >
            <option>All Categories</option>
            <option>Financial</option>
            <option>Policy</option>
            <option>HR</option>
            <option>Security</option>
          </select>

        </div>
      </div>

      {/* Template Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTemplates.map((template) => (
          <TemplateCard 
            key={template.id} 
            template={template} 
            onPreview={() => {
              setSelectedTemplate(template)
              setShowPreview(true)
            }}
            onNavigate={() => navigate(`/workflow-admin/${template.id}`)}
          />
        ))}
      </div>
      
      <PreviewModal 
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        template={selectedTemplate}
      />
    </div>
  )
}

function TemplateCard({ template, onPreview, onNavigate }) {
  const Icon = template.icon

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer" onClick={onNavigate}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded ${template.iconBg}`}>
            <Icon className={`w-4 h-4 ${template.iconColor}`} />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-900 mb-1">{template.title}</h3>
            <p className="text-sm text-gray-600 mb-3">{template.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-sm font-medium text-gray-900">{template.usage}</span>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">
          {template.category}
        </span>
        <span className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-700 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {template.duration}
        </span>
      </div>

      {/* Workflow Steps */}
      {/* <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Workflow Steps</h4>
        <div className="space-y-2">
          {template.steps.slice(0, 3).map((step, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
              <span className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-700">{index + 1}</span>
              <span>{step}</span>
            </div>
          ))}
          {template.steps.length > 3 && (
            <div className="text-xs text-gray-500">+{template.steps.length - 3} more steps</div>
          )}
        </div>
      </div> */}

      {/* Key Features */}
      {/* <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Key Features</h4>
        <div className="flex flex-wrap gap-2">
          {template.features.map((feature, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              {feature}
            </span>
          ))}
        </div>
      </div> */}

      {/* Actions */}
      {/* <div className="flex gap-2">
        <button 
          onClick={(e) => { e.stopPropagation(); onPreview() }}
          className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-50 transition-colors"
        >
          <FiEye className="w-4 h-4" />
          Preview
        </button>
        <button className="flex items-center gap-2 bg-gray-900 text-white px-3 py-2 rounded text-sm hover:bg-gray-800 transition-colors" onClick={(e) => e.stopPropagation()}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Use Template
        </button>
      </div> */}
    </div>
  )
}

export default Templates