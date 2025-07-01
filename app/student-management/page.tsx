'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

interface StudentRecord {
  id: string
  firstName: string
  lastName: string
  email: string
  gradeLevel: string
  enrollmentType: 'onsite' | 'online_premium' | 'online_free' | 'hybrid'
  accessLevel: 'full' | 'premium' | 'basic' | 'trial'
  subscriptionStatus: 'active' | 'inactive' | 'trial' | 'cancelled'
  tuitionPaid: boolean
  paymentMethod?: string
  schoolId: string
  lastLogin?: Date
  monthlyUsage: {
    aiTutorSessions: number
    virtualClassrooms: number
    liveAttendance: number
  }
}

interface DashboardStats {
  totalStudents: number
  paidStudents: number
  freeUsers: number
  onsiteStudents: number
  onlineStudents: number
  hybridStudents: number
  monthlyRevenue: number
  activeSubscriptions: number
}

export default function StudentManagementPage() {
  const [students, setStudents] = useState<StudentRecord[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSchool, setSelectedSchool] = useState('all')

  const enrollmentTypeLabels = {
    onsite: 'On-Site Student',
    online_premium: 'Online Premium',
    online_free: 'Online Basic',
    hybrid: 'Hybrid Learning'
  }

  const accessLevelColors = {
    full: 'bg-green-500/20 text-green-300',
    premium: 'bg-blue-500/20 text-blue-300',
    basic: 'bg-yellow-500/20 text-yellow-300',
    trial: 'bg-gray-500/20 text-gray-300'
  }

  const schools = [
    { id: 'all', name: 'All Schools' },
    { id: 'primary', name: 'SuperHero School (K-6)' },
    { id: 'secondary', name: 'S.T.A.G.E Prep (7-12)' },
    { id: 'law', name: 'Law School' },
    { id: 'language', name: 'Language School' }
  ]

  useEffect(() => {
    fetchStudentData()
  }, [])

  const fetchStudentData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/student-management')
      const data = await response.json()
      setStudents(data.students || mockStudents)
      setStats(data.stats || mockStats)
    } catch (error) {
      console.error('Failed to fetch student data:', error)
      setStudents(mockStudents)
      setStats(mockStats)
    } finally {
      setIsLoading(false)
    }
  }

  const mockStats: DashboardStats = {
    totalStudents: 247,
    paidStudents: 189,
    freeUsers: 58,
    onsiteStudents: 82,
    onlineStudents: 134,
    hybridStudents: 31,
    monthlyRevenue: 47850,
    activeSubscriptions: 189
  }

  const mockStudents: StudentRecord[] = [
    {
      id: '1',
      firstName: 'Emma',
      lastName: 'Johnson',
      email: 'emma.j@email.com',
      gradeLevel: '7',
      enrollmentType: 'onsite',
      accessLevel: 'full',
      subscriptionStatus: 'active',
      tuitionPaid: true,
      paymentMethod: 'annual',
      schoolId: 'secondary',
      lastLogin: new Date('2025-01-22'),
      monthlyUsage: { aiTutorSessions: 15, virtualClassrooms: 8, liveAttendance: 20 }
    },
    {
      id: '2',
      firstName: 'Marcus',
      lastName: 'Chen',
      email: 'marcus.chen@email.com',
      gradeLevel: '5',
      enrollmentType: 'online_premium',
      accessLevel: 'premium',
      subscriptionStatus: 'active',
      tuitionPaid: true,
      paymentMethod: 'monthly',
      schoolId: 'primary',
      lastLogin: new Date('2025-01-23'),
      monthlyUsage: { aiTutorSessions: 32, virtualClassrooms: 12, liveAttendance: 15 }
    },
    {
      id: '3',
      firstName: 'Sarah',
      lastName: 'Williams',
      email: 'sarah.w@email.com',
      gradeLevel: 'Adult',
      enrollmentType: 'online_free',
      accessLevel: 'basic',
      subscriptionStatus: 'inactive',
      tuitionPaid: false,
      schoolId: 'law',
      lastLogin: new Date('2025-01-20'),
      monthlyUsage: { aiTutorSessions: 3, virtualClassrooms: 1, liveAttendance: 0 }
    },
    {
      id: '4',
      firstName: 'David',
      lastName: 'Rodriguez',
      email: 'david.r@email.com',
      gradeLevel: '10',
      enrollmentType: 'hybrid',
      accessLevel: 'full',
      subscriptionStatus: 'active',
      tuitionPaid: true,
      paymentMethod: 'semester',
      schoolId: 'secondary',
      lastLogin: new Date('2025-01-23'),
      monthlyUsage: { aiTutorSessions: 18, virtualClassrooms: 6, liveAttendance: 25 }
    }
  ]

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'paid' && student.tuitionPaid) ||
                         (selectedFilter === 'free' && !student.tuitionPaid) ||
                         (selectedFilter === 'onsite' && student.enrollmentType === 'onsite') ||
                         (selectedFilter === 'online' && (student.enrollmentType === 'online_premium' || student.enrollmentType === 'online_free'))

    const matchesSchool = selectedSchool === 'all' || student.schoolId === selectedSchool

    return matchesSearch && matchesFilter && matchesSchool
  })

  const exportData = () => {
    const csvData = filteredStudents.map(student => ({
      Name: `${student.firstName} ${student.lastName}`,
      Email: student.email,
      Grade: student.gradeLevel,
      'Enrollment Type': enrollmentTypeLabels[student.enrollmentType],
      'Access Level': student.accessLevel,
      'Payment Status': student.tuitionPaid ? 'Paid' : 'Free',
      School: student.schoolId,
      'AI Sessions': student.monthlyUsage.aiTutorSessions,
      'Virtual Classes': student.monthlyUsage.virtualClassrooms,
      'Live Attendance': student.monthlyUsage.liveAttendance
    }))
    
    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `student-data-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full"></div>
        <span className="text-white ml-3">Loading student data...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex justify-between items-center">
            <Link href="/" className="text-white font-bold text-xl hover:text-blue-300 transition-colors">
              ← The Universal One School
            </Link>
            <div className="text-white font-bold text-xl">
              Student Management System
            </div>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Student Enrollment & Access Management</h1>
          <p className="text-gray-300">Track and manage different student types, payments, and feature usage</p>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-2xl font-bold text-blue-300">{stats?.totalStudents}</div>
            <div className="text-white/70 text-sm">Total Students</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-2xl font-bold text-green-300">{stats?.paidStudents}</div>
            <div className="text-white/70 text-sm">Paid Students</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-2xl font-bold text-yellow-300">{stats?.freeUsers}</div>
            <div className="text-white/70 text-sm">Free Users</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-2xl font-bold text-purple-300">{stats?.onsiteStudents}</div>
            <div className="text-white/70 text-sm">On-Site</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-2xl font-bold text-cyan-300">{stats?.onlineStudents}</div>
            <div className="text-white/70 text-sm">Online</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-2xl font-bold text-pink-300">{stats?.hybridStudents}</div>
            <div className="text-white/70 text-sm">Hybrid</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-2xl font-bold text-emerald-300">${stats?.monthlyRevenue.toLocaleString()}</div>
            <div className="text-white/70 text-sm">Monthly Revenue</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-2xl font-bold text-orange-300">{stats?.activeSubscriptions}</div>
            <div className="text-white/70 text-sm">Active Subs</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-white/80 mb-2 text-sm font-medium">Search Students</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Name or email..."
                className="w-full p-2 rounded-lg bg-black/30 text-white border border-white/30 focus:border-blue-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-white/80 mb-2 text-sm font-medium">Filter by Type</label>
              <select 
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="w-full p-2 rounded-lg bg-black/30 text-white border border-white/30 focus:border-blue-400"
              >
                <option value="all">All Students</option>
                <option value="paid">Paid Students</option>
                <option value="free">Free Users</option>
                <option value="onsite">On-Site</option>
                <option value="online">Online</option>
              </select>
            </div>
            <div>
              <label className="block text-white/80 mb-2 text-sm font-medium">School</label>
              <select 
                value={selectedSchool}
                onChange={(e) => setSelectedSchool(e.target.value)}
                className="w-full p-2 rounded-lg bg-black/30 text-white border border-white/30 focus:border-blue-400"
              >
                {schools.map(school => (
                  <option key={school.id} value={school.id}>{school.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={exportData}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Student List */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black/20">
                <tr>
                  <th className="text-left p-4 text-white font-medium">Student</th>
                  <th className="text-left p-4 text-white font-medium">Grade</th>
                  <th className="text-left p-4 text-white font-medium">Enrollment</th>
                  <th className="text-left p-4 text-white font-medium">Access</th>
                  <th className="text-left p-4 text-white font-medium">Payment</th>
                  <th className="text-left p-4 text-white font-medium">AI Usage</th>
                  <th className="text-left p-4 text-white font-medium">Live Attendance</th>
                  <th className="text-left p-4 text-white font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="border-t border-white/10 hover:bg-white/5">
                    <td className="p-4">
                      <div>
                        <div className="text-white font-medium">{student.firstName} {student.lastName}</div>
                        <div className="text-white/60 text-sm">{student.email}</div>
                      </div>
                    </td>
                    <td className="p-4 text-white/80">{student.gradeLevel}</td>
                    <td className="p-4">
                      <span className="text-white/80">{enrollmentTypeLabels[student.enrollmentType]}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs ${accessLevelColors[student.accessLevel]}`}>
                        {student.accessLevel}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        {student.tuitionPaid ? (
                          <span className="text-green-300">✓ Paid</span>
                        ) : (
                          <span className="text-yellow-300">Free</span>
                        )}
                        {student.paymentMethod && (
                          <span className="text-white/60 text-xs">({student.paymentMethod})</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-white/80 text-sm">
                        <div>Tutor: {student.monthlyUsage.aiTutorSessions}</div>
                        <div>Virtual: {student.monthlyUsage.virtualClassrooms}</div>
                      </div>
                    </td>
                    <td className="p-4 text-white/80">{student.monthlyUsage.liveAttendance} hrs</td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <button className="text-blue-300 hover:text-blue-400 text-sm">Edit</button>
                        <button className="text-green-300 hover:text-green-400 text-sm">Usage</button>
                        <button className="text-purple-300 hover:text-purple-400 text-sm">Billing</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12 text-white/60">
            No students found matching your criteria.
          </div>
        )}
      </div>
    </div>
  )
}