import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiArrowUpRight,
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
  FiFileText,
  FiHome,
  FiUser,
  FiCalendar
} from 'react-icons/fi'

export default function RecordMemo() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('All Types')
  const [statusFilter, setStatusFilter] = useState('All Statuses')
  const [deptFilter, setDeptFilter] = useState('All Departments')

  const memos = useMemo(
    () => [
      {
        id: 'EXT-2024-001',
        type: 'External',
        ref: 'MOE/ADM/2024/0125',
        subject: 'Curriculum Review Guidelines',
        origin: 'Ministry of Education',
        department: 'Academic Affairs',
        officer: 'Dr. Emily Cher',
        received: 'Dec 9, 2024, 09:30 AM'
      },
      {
        id: 'INT-2024-042',
        type: 'Internal',
        ref: 'INT/CS/2024/042',
        subject: 'Budget Allocation for Research',
        origin: 'Computer Science Dep',
        department: 'Finance',
        officer: 'Prof. Michael Brown',
        received: 'Dec 8, 2024, 03:15 PM'
      },
      {
        id: 'EXT-2024-002',
        type: 'External',
        ref: 'GOV/HR/2024/0089',
        subject: 'New Employment Regulations',
        origin: 'Government HR Office',
        department: 'Human Resources',
        officer: 'Sarah Johnson',
        received: 'Dec 7, 2024, 11:20 AM'
      },
      {
        id: 'INT-2024-043',
        type: 'Internal',
        ref: 'INT/REG/2024/043',
        subject: 'Student Registration Update',
        origin: 'Registrar Office',
        department: 'Academic Affairs',
        officer: 'Dr. Lisa Anderson',
        received: 'Dec 6, 2024, 05:45 PM'
      },
      {
        id: 'EXT-2024-003',
        type: 'External',
        ref: 'AUDIT/FIN/2024/0034',
        subject: 'Annual Financial Audit Report',
        origin: 'External Auditors',
        department: 'Finance',
        officer: 'Dr. Sarah Johnson',
        received: 'Dec 5, 2024, 10:00 AM'
      }
    ],
    []
  )

  const filtered = useMemo(() => {
    return memos.filter((m) => {
      const q = query.trim().toLowerCase()
      const matchesQuery =
        !q ||
        m.id.toLowerCase().includes(q) ||
        m.ref.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q) ||
        m.origin.toLowerCase().includes(q)

      const matchesType =
        typeFilter === 'All Types' || m.type.toLowerCase() === typeFilter.toLowerCase()

      const matchesStatus = statusFilter === 'All Statuses'

      const matchesDept =
        deptFilter === 'All Departments' || m.department.toLowerCase() === deptFilter.toLowerCase()

      return matchesQuery && matchesType && matchesStatus && matchesDept
    })
  }, [memos, query, typeFilter, statusFilter, deptFilter])

  return (
    <div className="p-4 sm:p-4 lg:p-6 w-full mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Record Memo</h1>
        <p className="text-gray-600 text-sm mt-1">Record and track external and internal memos</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-5 cursor-pointer" onClick={() => navigate('/record-external-memo')}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <FiFileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Record External Memo</h2>
                <p className="text-sm text-gray-600">Record incoming memos from external organizations</p>
              </div>
            </div>
            <button className="text-blue-600 hover:text-blue-700" onClick={(e) => { e.stopPropagation(); navigate('/record-external-memo') }}>
              <FiArrowUpRight className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <FiCheckCircle className="w-4 h-4 text-gray-500" />
              <span>Capture sender organization details</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <FiCheckCircle className="w-4 h-4 text-gray-500" />
              <span>Assign to department and officer</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <FiCheckCircle className="w-4 h-4 text-gray-500" />
              <span>Track movement timeline</span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">Recent External</p>
            <span className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-1 rounded-lg">3</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5 cursor-pointer" onClick={() => navigate('/compose-memo')}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <FiFileText className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Record Internal Memo</h2>
                <p className="text-sm text-gray-600">Record memos created within the organization</p>
              </div>
            </div>
            <button className="text-green-600 hover:text-green-700" onClick={(e) => { e.stopPropagation(); navigate('/compose-memo') }}>
              <FiArrowUpRight className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <FiCheckCircle className="w-4 h-4 text-gray-500" />
              <span>Link to workflow templates</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <FiCheckCircle className="w-4 h-4 text-gray-500" />
              <span>Automated approval routing</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <FiCheckCircle className="w-4 h-4 text-gray-500" />
              <span>Department-level tracking</span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">Recent Internal</p>
            <span className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-1 rounded-lg">2</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Recorded</p>
              <p className="text-2xl font-bold text-gray-900">5</p>
              <p className="text-sm text-green-600">+12% this month</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <FiTrendingUp className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Processing</p>
              <p className="text-2xl font-bold text-gray-900">2</p>
              <p className="text-sm text-gray-600">Active memos</p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <FiClock className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">2</p>
              <p className="text-sm text-green-600">Successfully closed</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FiCheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Processing</p>
              <p className="text-2xl font-bold text-gray-900">3.2d</p>
              <p className="text-sm text-gray-600">Average time</p>
            </div>
            <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
              <FiClock className="w-5 h-5 text-pink-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Recent Memos</h2>
            <p className="text-sm text-gray-600">View and manage recorded memos</p>
          </div>
          <button className="px-2.5 py-1.5 text-xs font-medium bg-gray-900 text-white rounded-lg">Export</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
          <div className="md:col-span-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search memos..."
              className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-gray-300 bg-[#F3F3F5]"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs bg-[#F3F3F5]"
          >
            <option>All Types</option>
            <option>External</option>
            <option>Internal</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs bg-[#F3F3F5]"
          >
            <option>All Statuses</option>
            <option>Processing</option>
            <option>Completed</option>
          </select>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs bg-[#F3F3F5]"
          >
            <option>All Departments</option>
            <option>Academic Affairs</option>
            <option>Finance</option>
            <option>Human Resources</option>
          </select>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="min-w-[1100px]">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 font-medium text-gray-900 text-xs whitespace-nowrap">Tracking ID</th>
                <th className="text-left py-2 px-3 font-medium text-gray-900 text-xs whitespace-nowrap">Type</th>
                <th className="text-left py-2 px-3 font-medium text-gray-900 hidden md:table-cell text-xs whitespace-nowrap">Reference Number</th>
                <th className="text-left py-2 px-3 font-medium text-gray-900 text-xs whitespace-nowrap">Subject</th>
                <th className="text-left py-2 px-3 font-medium text-gray-900 hidden lg:table-cell text-xs whitespace-nowrap">Sender/Origin</th>
                <th className="text-left py-2 px-3 font-medium text-gray-900 hidden xl:table-cell text-xs whitespace-nowrap">Department</th>
                <th className="text-left py-2 px-3 font-medium text-gray-900 hidden xl:table-cell text-xs whitespace-nowrap">Officer</th>
                <th className="text-left py-2 px-3 font-medium text-gray-900 hidden md:table-cell text-xs whitespace-nowrap">Date Received</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-3 text-xs text-gray-900 whitespace-nowrap">{m.id}</td>
                  <td className="py-2 px-3 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-lg ${
                      m.type === 'External'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      <FiFileText className="w-3 h-3" /> {m.type}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-xs text-gray-700 hidden md:table-cell whitespace-nowrap">{m.ref}</td>
                  <td className="py-2 px-3 text-xs text-gray-900 whitespace-nowrap">{m.subject}</td>
                  <td className="py-2 px-3 text-xs text-gray-700 hidden lg:table-cell whitespace-nowrap">
                    <span className="inline-flex items-center gap-1"><FiHome className="w-3.5 h-3.5 text-gray-500" />{m.origin}</span>
                  </td>
                  <td className="py-2 px-3 text-xs text-gray-700 hidden xl:table-cell whitespace-nowrap">{m.department}</td>
                  <td className="py-2 px-3 text-xs text-gray-700 hidden xl:table-cell whitespace-nowrap">
                    <span className="inline-flex items-center gap-1"><FiUser className="w-3.5 h-3.5 text-gray-500" />{m.officer}</span>
                  </td>
                  <td className="py-2 px-3 text-xs text-gray-700 hidden md:table-cell whitespace-nowrap">
                    <span className="inline-flex items-center gap-1"><FiCalendar className="w-3.5 h-3.5 text-gray-500" />{m.received}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
