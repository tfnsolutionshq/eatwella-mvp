import React from 'react'

function Compliance() {
  const complianceMetrics = [
    {
      title: 'On-time Approvals',
      current: 87,
      target: 90,
      status: 'warning',
      description: 'Current: 87% | Target: 90%'
    },
    {
      title: 'Policy Compliance',
      current: 94,
      target: 95,
      status: 'good',
      description: 'Current: 94% | Target: 95%'
    },
    {
      title: 'Audit Trail Coverage',
      current: 98,
      target: 100,
      status: 'good',
      description: 'Current: 98% | Target: 100%'
    },
    {
      title: 'Security Reviews',
      current: 76,
      target: 85,
      status: 'poor',
      description: 'Current: 76% | Target: 85%'
    }
  ]
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'good': return 'text-green-600'
      case 'warning': return 'text-yellow-600'
      case 'poor': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }
  
  const getProgressBarColor = (status) => {
    switch (status) {
      case 'good': return 'bg-green-500'
      case 'warning': return 'bg-yellow-500'
      case 'poor': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {complianceMetrics.map((metric, index) => (
        <div key={index} className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{metric.title}</h3>
            <span className={`text-sm font-medium ${getStatusColor(metric.status)}`}>
              {metric.status}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">{metric.description}</p>
          
          <div className="mb-2">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress to Target</span>
              <span>{metric.current}% / {metric.target}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${getProgressBarColor(metric.status)}`}
                style={{ width: `${(metric.current / metric.target) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Compliance