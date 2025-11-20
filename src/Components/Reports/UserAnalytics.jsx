import React from 'react'

function UserAnalytics() {
  const userProductivityData = [
    {
      user: 'Dr. Sarah Johnson',
      memosProcessed: 28,
      approved: 26,
      avgResponseTime: '1.8 days',
      efficiencyScore: 94
    },
    {
      user: 'Prof. Michael Brown',
      memosProcessed: 22,
      approved: 20,
      avgResponseTime: '2.1 days',
      efficiencyScore: 89
    },
    {
      user: 'Emily Chen',
      memosProcessed: 31,
      approved: 30,
      avgResponseTime: '1.2 days',
      efficiencyScore: 96
    },
    {
      user: 'James Davis',
      memosProcessed: 19,
      approved: 16,
      avgResponseTime: '3.2 days',
      efficiencyScore: 82
    }
  ]
  
  const getEfficiencyColor = (score) => {
    if (score >= 90) return 'bg-green-500'
    if (score >= 80) return 'bg-yellow-500'
    return 'bg-red-500'
  }
  
  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">User Productivity Analysis</h3>
        <p className="text-sm text-gray-600">Individual user performance metrics</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Memos Processed</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Approved</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Avg. Response Time</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Efficiency Score</th>
            </tr>
          </thead>
          <tbody>
            {userProductivityData.map((user, index) => (
              <tr key={index} className="border-b border-gray-100">
                <td className="py-3 px-4 text-gray-900">{user.user}</td>
                <td className="py-3 px-4 text-gray-600">{user.memosProcessed}</td>
                <td className="py-3 px-4 text-gray-600">{user.approved}</td>
                <td className="py-3 px-4 text-gray-600">{user.avgResponseTime}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    <span className="text-gray-900 mr-2">{user.efficiencyScore}%</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getEfficiencyColor(user.efficiencyScore)}`}
                        style={{ width: `${user.efficiencyScore}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UserAnalytics