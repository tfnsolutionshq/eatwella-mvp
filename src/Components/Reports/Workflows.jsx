import React from 'react'

function Workflows() {
  const workflowData = [
    {
      workflow: 'Budget Approval',
      totalMemos: 45,
      avgCompletionTime: '4.2 days',
      primaryBottleneck: 'Finance Review',
      status: 'Acceptable'
    },
    {
      workflow: 'Policy Review',
      totalMemos: 23,
      avgCompletionTime: '8.7 days',
      primaryBottleneck: 'Legal Review',
      status: 'Needs Attention'
    },
    {
      workflow: 'HR Personnel',
      totalMemos: 34,
      avgCompletionTime: '6.3 days',
      primaryBottleneck: 'Department Head',
      status: 'Needs Attention'
    },
    {
      workflow: 'IT Security',
      totalMemos: 18,
      avgCompletionTime: '1.1 days',
      primaryBottleneck: 'No Bottleneck',
      status: 'Optimal'
    }
  ]
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'Optimal': return 'text-green-600'
      case 'Acceptable': return 'text-yellow-600'
      case 'Needs Attention': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Optimal': return '●'
      case 'Acceptable': return '●'
      case 'Needs Attention': return '●'
      default: return '●'
    }
  }
  
  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Workflow Efficiency Analysis</h3>
        <p className="text-sm text-gray-600">Performance metrics for active workflows</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-900">Workflow</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Total Memos</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Avg. Completion Time</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Primary Bottleneck</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
            </tr>
          </thead>
          <tbody>
            {workflowData.map((workflow, index) => (
              <tr key={index} className="border-b border-gray-100">
                <td className="py-3 px-4 text-gray-900">{workflow.workflow}</td>
                <td className="py-3 px-4 text-gray-600">{workflow.totalMemos}</td>
                <td className="py-3 px-4 text-gray-600">{workflow.avgCompletionTime}</td>
                <td className="py-3 px-4 text-gray-600">{workflow.primaryBottleneck}</td>
                <td className="py-3 px-4">
                  <span className={`flex items-center ${getStatusColor(workflow.status)}`}>
                    <span className="mr-2">{getStatusIcon(workflow.status)}</span>
                    {workflow.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Workflows