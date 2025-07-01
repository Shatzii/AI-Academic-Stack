'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function StudentManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGrade, setSelectedGrade] = useState('all')
  const [selectedSchool, setSelectedSchool] = useState('all')

  // Sample student data - would come from API
  const students = [
    {
      id: '1',
      studentId: 'STU-2025-001',
      firstName: 'Emma',
      lastName: 'Johnson',
      grade: 'K',
      school: 'primary-school',
      status: 'active',
      iepStatus: true,
      attendanceRate: 96.2,
      parentEmail: 'parent@example.com',
      enrollmentDate: '2024-08-15'
    },
    {
      id: '2',
      studentId: 'STU-2025-002',
      firstName: 'Marcus',
      lastName: 'Williams',
      grade: '3',
      school: 'primary-school',
      status: 'active',
      iepStatus: false,
      attendanceRate: 98.5,
      parentEmail: 'parent2@example.com',
      enrollmentDate: '2024-08-15'
    },
    {
      id: '3',
      studentId: 'STU-2025-003',
      firstName: 'Sophia',
      lastName: 'Rodriguez',
      grade: '9',
      school: 'secondary-school',
      status: 'active',
      iepStatus: true,
      attendanceRate: 94.8,
      parentEmail: 'parent3@example.com',
      enrollmentDate: '2024-08-15'
    }
  ]

  const filteredStudents = students.filter(student => {
    const matchesSearch = `${student.firstName} ${student.lastName} ${student.studentId}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesGrade = selectedGrade === 'all' || student.grade === selectedGrade
    const matchesSchool = selectedSchool === 'all' || student.school === selectedSchool
    return matchesSearch && matchesGrade && matchesSchool
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
            <h1 className="text-2xl font-bold text-gray-900">Student Information System</h1>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              + Add New Student
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
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{students.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Students</p>
                <p className="text-2xl font-bold text-gray-900">{students.filter(s => s.status === 'active').length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">🎯</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">IEP Students</p>
                <p className="text-2xl font-bold text-gray-900">{students.filter(s => s.iepStatus).length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Attendance</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(students.reduce((acc, s) => acc + s.attendanceRate, 0) / students.length).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Students</label>
                <input
                  type="text"
                  placeholder="Name or Student ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level</label>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">All Grades</option>
                  <option value="K">Kindergarten</option>
                  <option value="1">1st Grade</option>
                  <option value="2">2nd Grade</option>
                  <option value="3">3rd Grade</option>
                  <option value="4">4th Grade</option>
                  <option value="5">5th Grade</option>
                  <option value="6">6th Grade</option>
                  <option value="7">7th Grade</option>
                  <option value="8">8th Grade</option>
                  <option value="9">9th Grade</option>
                  <option value="10">10th Grade</option>
                  <option value="11">11th Grade</option>
                  <option value="12">12th Grade</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">School</label>
                <select
                  value={selectedSchool}
                  onChange={(e) => setSelectedSchool(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">All Schools</option>
                  <option value="primary-school">SuperHero School (K-6)</option>
                  <option value="secondary-school">Stage Prep Academy (7-12)</option>
                  <option value="law-school">The Lawyer Makers</option>
                  <option value="language-school">Language Learning School</option>
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

        {/* Student Table */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Student Records</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    School
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attendance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-indigo-600">
                              {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {student.firstName} {student.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {student.parentEmail}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.studentId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.grade}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.school.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          student.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {student.status}
                        </span>
                        {student.iepStatus && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                            IEP
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${student.attendanceRate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm">{student.attendanceRate}%</span>
                      </div>
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
                          Records
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bulk Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                📧 Send Parent Notifications
              </button>
              <button className="w-full text-left p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                📊 Generate Progress Reports
              </button>
              <button className="w-full text-left p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
                🎯 Update IEP Goals
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reports</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors">
                📋 Enrollment Report
              </button>
              <button className="w-full text-left p-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors">
                ⚠️ Attendance Alerts
              </button>
              <button className="w-full text-left p-3 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors">
                📈 Academic Performance
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
            <div className="space-y-3">
              <Link href="/admin/enrollment" className="block w-full text-left p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                ✏️ New Enrollment
              </Link>
              <Link href="/admin/attendance" className="block w-full text-left p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                📅 Take Attendance
              </Link>
              <Link href="/admin/gradebook" className="block w-full text-left p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                📚 View Gradebook
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}