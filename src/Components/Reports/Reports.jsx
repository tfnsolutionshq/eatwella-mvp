import React, { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import Workflows from './Workflows'
import Performance from './Perfomance'
import Compliance from './Compliance'
import UserAnalytics from './UserAnalytics'

function Reports() {
  const [activeTab, setActiveTab] = useState('Overview')
  
  const volumeData = [
    { month: 'Jan', value: 45 },
    { month: 'Feb', value: 52 },
    { month: 'Mar', value: 38 },
    { month: 'Apr', value: 61 },
    { month: 'May', value: 45 },
    { month: 'Jun', value: 55 },
    { month: 'Jul', value: 68 },
    { month: 'Aug', value: 42 },
    { month: 'Sep', value: 58 },
    { month: 'Oct', value: 72 },
    { month: 'Nov', value: 48 },
    { month: 'Dec', value: 55 }
  ]
  
  const categoryData = [
    { name: 'Financial', value: 35, color: '#3B82F6' },
    { name: 'Academic', value: 28, color: '#10B981' },
    { name: 'Administrative', value: 20, color: '#F59E0B' },
    { name: 'HR', value: 12, color: '#8B5CF6' },
    { name: 'Security', value: 5, color: '#EF4444' }
  ]
  
  const departmentData = [
    { department: 'Computer Science', totalMemos: 145, avgProcessing: '3.2 days', successRate: '94%', performance: 'Good' },
    { department: 'Finance', totalMemos: 89, avgProcessing: '4.1 days', successRate: '92%', performance: 'Good' },
    { department: 'Academic Affairs', totalMemos: 67, avgProcessing: '5.8 days', successRate: '88%', performance: 'Needs Improvement' },
    { department: 'HR', totalMemos: 34, avgProcessing: '2.9 days', successRate: '96%', performance: 'Excellent' },
    { department: 'IT', totalMemos: 56, avgProcessing: '1.8 days', successRate: '98%', performance: 'Excellent' }
  ]
  
  const tabs = ['Overview', 'Performance', 'Workflows', 'Compliance', 'User Analytics']
  
  const getPerformanceColor = (performance) => {
    switch (performance) {
      case 'Excellent': return 'bg-green-100 text-green-800'
      case 'Good': return 'bg-blue-100 text-blue-800'
      case 'Needs Improvement': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
  
  return (
    <div className="p-5 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 text-sm">Comprehensive insights into system performance and user activity</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
          <button className="flex items-center px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export
          </button>
          <button className="px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800">
            Configure
          </button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Memos</p>
              <p className="text-2xl font-bold text-gray-900">642</p>
              <p className="text-sm text-green-600">+12% from last period</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approval Rate</p>
              <p className="text-2xl font-bold text-gray-900">89%</p>
              <p className="text-sm text-green-600">+3% improvement</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Processing Time</p>
              <p className="text-2xl font-bold text-gray-900">3.6d</p>
              <p className="text-sm text-green-600">-18% faster</p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">247</p>
              <p className="text-sm text-green-600">+8% growth</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Date Range:</span>
            <select className="border border-gray-300 rounded px-3 py-1 text-sm">
              <option>Jan 01 - Oct 14, 2025</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Departments:</span>
            <select className="border border-gray-300 rounded px-3 py-1 text-sm">
              <option>All Departments</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Categories:</span>
            <select className="border border-gray-300 rounded px-3 py-1 text-sm">
              <option>All Categories</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="bg-gray-100 rounded-t-lg">
          <nav className="flex">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-1 px-4 text-center rounded-full font-medium text-sm ${
                  activeTab === tab
                    ? 'bg-white m-1 rounded-full text-gray-900 border-b-2 border-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
        
        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'Overview' && (
            <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Memo Volume Trends */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Memo Volume Trends</h3>
                <p className="text-sm text-gray-600 mb-4">Monthly memo creation and approval trends</p>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={volumeData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Category Distribution */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Category Distribution</h3>
                <p className="text-sm text-gray-600 mb-4">Breakdown of memos by category</p>
                <div className="h-80 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name} ${value}%`}
                        labelLine={false}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            {/* Department Performance Summary - Only for Overview */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Department Performance Summary</h3>
                <p className="text-sm text-gray-600 mb-6">Key metrics by department for the selected period</p>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Department</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Total Memos</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Avg. Processing Time</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Success Rate</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Performance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {departmentData.map((dept, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-3 px-4 text-gray-900">{dept.department}</td>
                          <td className="py-3 px-4 text-gray-600">{dept.totalMemos}</td>
                          <td className="py-3 px-4 text-gray-600">{dept.avgProcessing}</td>
                          <td className="py-3 px-4 text-gray-600">{dept.successRate}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPerformanceColor(dept.performance)}`}>
                              {dept.performance}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'Performance' && <Performance />}
          {activeTab === 'Workflows' && <Workflows />}
          {activeTab === 'Compliance' && <Compliance />}
          {activeTab === 'User Analytics' && <UserAnalytics />}
          
          {!['Overview', 'Performance', 'Workflows', 'Compliance', 'User Analytics'].includes(activeTab) && (
            <div className="text-center py-12">
              <p className="text-gray-500">Content for {activeTab} tab will be implemented here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Reports