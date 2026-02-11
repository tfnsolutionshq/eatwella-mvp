import React, { useState } from 'react'
import DashboardLayout from '../../DashboardLayout/DashboardLayout'
import CreateStaffModal from '../../Components/Modals/CreateStaffModal'
import { FiPlus, FiUser, FiUsers, FiUserX, FiPhone, FiMail, FiEdit2, FiBriefcase, FiClock, FiCheckCircle, FiSlash, FiTrash2 } from 'react-icons/fi'

const StaffManagement = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState(null)

  const stats = [
    { label: 'Total Staff', value: '24', icon: FiUsers, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'On Duty', value: '12', icon: FiCheckCircle, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'On Leave', value: '2', icon: FiClock, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Suspended', value: '1', icon: FiUserX, color: 'text-red-500', bg: 'bg-red-50' },
  ]

  const activeStaff = [
    {
      id: 1,
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: 'Manager',
      email: 'sarah.j@eatwella.com',
      phone: '(555) 123-4567',
      joinDate: '2023-05-15',
      status: 'Active',
      hourlyRate: '25.00',
      address: '123 Maple Ave, Cityville'
    },
    {
      id: 2,
      firstName: 'Michael',
      lastName: 'Chen',
      role: 'Head Chef',
      email: 'michael.c@eatwella.com',
      phone: '(555) 987-6543',
      joinDate: '2023-06-01',
      status: 'Active',
      hourlyRate: '30.00',
      address: '456 Oak St, Townsville'
    },
    {
      id: 3,
      firstName: 'Emily',
      lastName: 'Davis',
      role: 'Server',
      email: 'emily.d@eatwella.com',
      phone: '(555) 456-7890',
      joinDate: '2024-01-10',
      status: 'On Duty',
      hourlyRate: '15.00',
      address: '789 Pine Rd, Villageton'
    },
    {
      id: 4,
      firstName: 'David',
      lastName: 'Wilson',
      role: 'Bartender',
      email: 'david.w@eatwella.com',
      phone: '(555) 234-5678',
      joinDate: '2024-02-15',
      status: 'Active',
      hourlyRate: '18.00',
      address: '321 Elm St, Hamletville'
    },
    {
      id: 5,
      firstName: 'Jessica',
      lastName: 'Brown',
      role: 'Server',
      email: 'jessica.b@eatwella.com',
      phone: '(555) 876-5432',
      joinDate: '2024-03-01',
      status: 'On Leave',
      hourlyRate: '15.00',
      address: '654 Birch Ln, Boroughburg'
    }
  ]

  const suspendedStaff = [
    {
      id: 6,
      firstName: 'Robert',
      lastName: 'Taylor',
      role: 'Driver',
      email: 'robert.t@eatwella.com',
      phone: '(555) 345-6789',
      joinDate: '2023-11-20',
      status: 'Suspended',
      hourlyRate: '16.00',
      address: '987 Cedar Dr, Metropoli'
    }
  ]

  const handleEdit = (staff) => {
    setEditingStaff(staff)
    setIsEditModalOpen(true)
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'Manager': return 'bg-purple-100 text-purple-700'
      case 'Chef': 
      case 'Head Chef': return 'bg-orange-100 text-orange-700'
      case 'Server': return 'bg-blue-100 text-blue-700'
      case 'Bartender': return 'bg-pink-100 text-pink-700'
      case 'Driver': return 'bg-yellow-100 text-yellow-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <>
      <CreateStaffModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
      
      <CreateStaffModal 
        isOpen={isEditModalOpen} 
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingStaff(null)
        }}
        initialData={editingStaff}
        isEditing={true}
      />

      <DashboardLayout>
        <div className="p-6 space-y-8 bg-gray-50/50 min-h-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
              <p className="text-sm text-gray-500 mt-1">Manage your team, schedules, and roles</p>
            </div>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors shadow-sm shadow-orange-200"
            >
              <FiPlus className="w-4 h-4" />
              Add Staff Member
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              )
            })}
          </div>

          {/* Active Staff */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Active Staff</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {activeStaff.map((staff) => (
                <div key={staff.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg">
                        {staff.firstName[0]}{staff.lastName[0]}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{staff.firstName} {staff.lastName}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium mt-1 inline-block ${getRoleColor(staff.role)}`}>
                          {staff.role}
                        </span>
                      </div>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${staff.status === 'On Duty' ? 'bg-green-500' : staff.status === 'On Leave' ? 'bg-orange-500' : 'bg-gray-300'}`} title={staff.status}></div>
                  </div>

                  <div className="space-y-3 mb-6 flex-1">
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <FiMail className="w-4 h-4" />
                      <span>{staff.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <FiPhone className="w-4 h-4" />
                      <span>{staff.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <FiBriefcase className="w-4 h-4" />
                      <span>Joined {new Date(staff.joinDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                    <button className="flex-1 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                      <FiSlash className="w-4 h-4" />
                      Suspend
                    </button>
                    <button 
                      onClick={() => handleEdit(staff)}
                      className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-blue-600 transition-colors border border-transparent hover:border-gray-200"
                      title="Edit Staff"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Suspended Staff */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Suspended Staff</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {suspendedStaff.map((staff) => (
                <div key={staff.id} className="bg-gray-50 rounded-2xl border border-gray-200 p-6 flex flex-col opacity-75 grayscale-[50%] hover:grayscale-0 hover:opacity-100 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 font-bold text-lg">
                        {staff.firstName[0]}{staff.lastName[0]}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{staff.firstName} {staff.lastName}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium mt-1 inline-block ${getRoleColor(staff.role)}`}>
                          {staff.role}
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs font-bold uppercase">
                      Suspended
                    </span>
                  </div>

                  <div className="space-y-3 mb-6 flex-1">
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <FiMail className="w-4 h-4" />
                      <span>{staff.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <FiPhone className="w-4 h-4" />
                      <span>{staff.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <FiBriefcase className="w-4 h-4" />
                      <span>Joined {new Date(staff.joinDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                    <button className="flex-1 px-4 py-2 bg-white hover:bg-green-50 text-gray-700 hover:text-green-700 border border-gray-200 hover:border-green-200 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                      <FiCheckCircle className="w-4 h-4" />
                      Reactivate
                    </button>
                    <button className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors border border-transparent hover:border-red-100">
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  )
}

export default StaffManagement
