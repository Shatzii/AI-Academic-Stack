'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function StaffManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('all')

  // Sample staff data - would come from API
  const staff = [
    {
      id: '1',
      employeeId: 'EMP-001',
      firstName: 'Sarah',
      lastName: 'Johnson',
      position: 'Principal',
      department: 'Administration',
      email: 'sarah.johnson@school.com',
      phone: '(555) 123-4567',
      hireDate: '2020-08-15',
      certifications: ['Educational Leadership', 'Special Education'],
      isActive: true,
      schedule: { type: 'full-time', hours: '7:30 AM - 4:30 PM' }
    },
    {
      id: '2',
      employeeId: 'EMP-002',
      firstName: 'Michael',
      lastName: 'Chen',
      position: 'Math Teacher',
      department: 'Academic',
      email: 'michael.chen@school.com',
      phone: '(555) 234-5678',
      hireDate: '2021-08-01',
      certifications: ['Mathematics 4-8', 'ESL'],
      isActive: true,
      schedule: { type: 'full-time', hours: '8:00 AM - 4:00 PM' }
    },
    {
      id: '3',
      employeeId: 'EMP-003',
      firstName: 'Jessica',
      lastName: 'Martinez',
      position: 'School Nurse',
      department: 'Health Services',
      email: 'jessica.martinez@school.com',
      phone: '(555) 345-6789',
      hireDate: '2019-07-15',
      certifications: ['Registered Nurse', 'School Health'],
      isActive: true,
      schedule: { type: 'full-time', hours: '7:45 AM - 3:45 PM' }
    },
    {
      id: '4',
      employeeId: 'EMP-004',
      firstName: 'David',
      lastName: 'Wilson',
      position: 'Special Education Teacher',
      department: 'Special Education',
      email: 'david.wilson@school.com',
      phone: '(555) 456-7890',
      hireDate: '2022-01-10',
      certifications: ['Special Education EC-12', 'Autism Certification'],
      isActive: true,
      schedule: { type: 'full-time', hours: '8:00 AM - 4:00 PM' }
    }
  ]

  const departments = ['Administration', 'Academic', 'Special Education', 'Health Services', 'Support Services']

  const filteredStaff = staff.filter(member => {
    const matchesSearch = `${member.firstName} ${member.lastName} ${member.employeeId} ${member.position}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === 'all' || member.department === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/admin/dashboard" className="text-indigo-600 font-semibold text-lg hover:text-indigo-500">
              ← Admin Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              + Add New Staff
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Staff</p>
                <p className="text-2xl font-bold text-gray-900">{staff.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Staff</p>
                <p className="text-2xl font-bold text-gray-900">{staff.filter(s => s.isActive).length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">📚</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Teachers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {staff.filter(s => s.position.toLowerCase().includes('teacher')).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">🏢</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Departments</p>
                <p className="text-2xl font-bold text-gray-900">{departments.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Staff</label>
                <input
                  type="text"
                  placeholder="Name, ID, or Position..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-end">
                <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Staff Table */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Staff Directory</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Staff Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStaff.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-indigo-600">
                              {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {member.firstName} {member.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            Hire Date: {member.hireDate}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {member.employeeId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {member.position}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {member.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div>{member.email}</div>
                        <div className="text-gray-500">{member.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        member.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {member.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-indigo-600 hover:text-indigo-900">
                          View
                        </button>
                        <button className="text-indigo-600 hover:text-indigo-900">
                          Edit
                        </button>
                        <button className="text-indigo-600 hover:text-indigo-900">
                          Schedule
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Management Tools */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">HR Management</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                📋 Performance Reviews
              </button>
              <button className="w-full text-left p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                🎓 Professional Development
              </button>
              <button className="w-full text-left p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
                📜 Certification Tracking
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Scheduling</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors">
                📅 Create Schedule
              </button>
              <button className="w-full text-left p-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors">
                🔄 Substitute Management
              </button>
              <button className="w-full text-left p-3 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors">
                ⏰ Time & Attendance
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reports</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                📊 Staff Directory
              </button>
              <button className="w-full text-left p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                💰 Payroll Summary
              </button>
              <button className="w-full text-left p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                📈 Department Analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}