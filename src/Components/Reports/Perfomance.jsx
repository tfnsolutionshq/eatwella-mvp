import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from 'recharts'

function Performance() {
  const processingTimeData = [
    { department: 'IT', time: 1.1 },
    { department: 'HR', time: 2.9 },
    { department: 'Academic Affairs', time: 5.8 },
    { department: 'Finance', time: 4.1 },
    { department: 'Computer Science', time: 3.2 }
  ]
  
  const successRateData = [
    { department: 'Computer Science', rate: 94 },
    { department: 'Finance', rate: 92 },
    { department: 'Academic Affairs', rate: 88 },
    { department: 'HR', rate: 96 },
    { department: 'IT', rate: 98 }
  ]
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Processing Time Analysis */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Processing Time Analysis</h3>
        <p className="text-sm text-gray-600 mb-4">Average processing times by department</p>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={processingTimeData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="department" axisLine={false} tickLine={false} width={100} />
              <Bar dataKey="time" fill="#10B981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Success Rate Comparison */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Success Rate Comparison</h3>
        <p className="text-sm text-gray-600 mb-4">Department success rates over time</p>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={successRateData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="department" axisLine={false} tickLine={false} />
              <YAxis domain={[80, 100]} axisLine={false} tickLine={false} />
              <Area 
                type="monotone" 
                dataKey="rate" 
                stroke="#10B981" 
                fill="#10B981" 
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm">
            <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
            <span className="text-gray-700">Dr. Sarah Johnson (Admin)</span>
          </div>
          <div className="flex items-center text-sm">
            <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
            <span className="text-gray-700">Dr. Emily Chen (Dean)</span>
          </div>
          <div className="flex items-center text-sm">
            <div className="w-3 h-3 bg-purple-500 rounded mr-2"></div>
            <span className="text-gray-700">Prof. Michael Brown (Department Head)</span>
          </div>
          <div className="flex items-center text-sm">
            <div className="w-3 h-3 bg-orange-500 rounded mr-2"></div>
            <span className="text-gray-700">Dr. Lisa Anderson (Faculty)</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Performance