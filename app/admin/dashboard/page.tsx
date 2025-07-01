import React from 'react'
import Link from 'next/link'

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="text-indigo-600 font-semibold text-lg hover:text-indigo-500">
              ← The Universal One School
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Administrative Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Admin Portal</span>
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">A</span>
              </div>
            </div>
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
                <p className="text-2xl font-bold text-gray-900">1,247</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">👩‍🏫</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Faculty & Staff</p>
                <p className="text-2xl font-bold text-gray-900">89</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
                <p className="text-2xl font-bold text-gray-900">94.2%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">🎯</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active IEPs</p>
                <p className="text-2xl font-bold text-gray-900">342</p>
              </div>
            </div>
          </div>
        </div>

        {/* Development Tools Section */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Development Tools</h2>
              <p className="text-sm text-gray-600 mt-1">Advanced development and content creation tools</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/admin/ide" className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-300">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                      <span className="text-xl">💻</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Integrated Development Environment</h3>
                      <p className="text-sm text-gray-600">Full-featured IDE with Monaco Editor</p>
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          v3.1.0
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
                
                <Link href="/ai-content-creator" className="p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-all duration-300">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg mr-3">
                      <span className="text-xl">🎨</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">AI Content Creator</h3>
                      <p className="text-sm text-gray-600">AI-powered content generation tool</p>
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          AI Powered
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
                
                <Link href="/marketplace" className="p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-all duration-300">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg mr-3">
                      <span className="text-xl">🛒</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Course Marketplace</h3>
                      <p className="text-sm text-gray-600">Manage marketplace content</p>
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Revenue Share
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Student Information System */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Student Information System</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/admin/students" className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">📚</span>
                      <div>
                        <h3 className="font-medium text-gray-900">Student Records</h3>
                        <p className="text-sm text-gray-500">Manage enrollment, demographics, and academic records</p>
                      </div>
                    </div>
                  </Link>
                  
                  <Link href="/admin/enrollment" className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">✏️</span>
                      <div>
                        <h3 className="font-medium text-gray-900">Enrollment Management</h3>
                        <p className="text-sm text-gray-500">Process new enrollments and transfers</p>
                      </div>
                    </div>
                  </Link>
                  
                  <Link href="/admin/attendance" className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">📅</span>
                      <div>
                        <h3 className="font-medium text-gray-900">Attendance Tracking</h3>
                        <p className="text-sm text-gray-500">Monitor daily attendance and absences</p>
                      </div>
                    </div>
                  </Link>
                  
                  <Link href="/admin/gradebook" className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">📊</span>
                      <div>
                        <h3 className="font-medium text-gray-900">Gradebook System</h3>
                        <p className="text-sm text-gray-500">View grades and academic progress</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-6 space-y-3">
                <Link href="/admin/announcements/new" className="block w-full text-left p-3 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors">
                  📢 Send School Announcement
                </Link>
                <Link href="/admin/visitors/check-in" className="block w-full text-left p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                  🏃‍♂️ Visitor Check-in
                </Link>
                <Link href="/admin/emergency" className="block w-full text-left p-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors">
                  🚨 Emergency Protocols
                </Link>
                <Link href="/admin/reports/generate" className="block w-full text-left p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                  📋 Generate Reports
                </Link>
              </div>
            </div>

            {/* Recent Alerts */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Recent Alerts</h2>
              </div>
              <div className="p-6 space-y-3">
                <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-r">
                  <p className="text-sm text-yellow-700">3 IEP reviews due this week</p>
                </div>
                <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r">
                  <p className="text-sm text-blue-700">New enrollment pending approval</p>
                </div>
                <div className="p-3 bg-green-50 border-l-4 border-green-400 rounded-r">
                  <p className="text-sm text-green-700">Monthly reports ready for review</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Management */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Academic Management</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/admin/curriculum" className="p-6 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="text-center">
                  <span className="text-4xl mb-4 block">📖</span>
                  <h3 className="font-semibold text-gray-900 mb-2">Curriculum Management</h3>
                  <p className="text-sm text-gray-500">Manage courses, standards alignment, and neurodivergent adaptations</p>
                </div>
              </Link>
              
              <Link href="/admin/assessments" className="p-6 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="text-center">
                  <span className="text-4xl mb-4 block">📝</span>
                  <h3 className="font-semibold text-gray-900 mb-2">Assessment Center</h3>
                  <p className="text-sm text-gray-500">Create and manage assessments, including STAAR preparation</p>
                </div>
              </Link>
              
              <Link href="/admin/iep" className="p-6 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="text-center">
                  <span className="text-4xl mb-4 block">🎯</span>
                  <h3 className="font-semibold text-gray-900 mb-2">Special Education</h3>
                  <p className="text-sm text-gray-500">Manage IEPs, 504 plans, and behavioral interventions</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Operations Management */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">School Operations</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Link href="/admin/staff" className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-center">
                <span className="text-3xl block mb-2">👥</span>
                <h3 className="font-medium text-gray-900">Staff Management</h3>
                <p className="text-xs text-gray-500 mt-1">HR, scheduling, substitutes</p>
              </Link>
              
              <Link href="/admin/health" className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-center">
                <span className="text-3xl block mb-2">🏥</span>
                <h3 className="font-medium text-gray-900">Health Services</h3>
                <p className="text-xs text-gray-500 mt-1">Medical records, incidents</p>
              </Link>
              
              <Link href="/admin/transportation" className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-center">
                <span className="text-3xl block mb-2">🚌</span>
                <h3 className="font-medium text-gray-900">Transportation</h3>
                <p className="text-xs text-gray-500 mt-1">Routes, schedules, safety</p>
              </Link>
              
              <Link href="/admin/finance" className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-center">
                <span className="text-3xl block mb-2">💰</span>
                <h3 className="font-medium text-gray-900">Financial Management</h3>
                <p className="text-xs text-gray-500 mt-1">Tuition, payments, budgets</p>
              </Link>
            </div>
          </div>
        </div>

        {/* Technology & Security */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Technology & Security</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/admin/devices" className="p-6 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="text-center">
                  <span className="text-4xl mb-4 block">💻</span>
                  <h3 className="font-semibold text-gray-900 mb-2">Device Management</h3>
                  <p className="text-sm text-gray-500">1:1 device tracking, assignments, and maintenance</p>
                </div>
              </Link>
              
              <Link href="/admin/visitors" className="p-6 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="text-center">
                  <span className="text-4xl mb-4 block">🏛️</span>
                  <h3 className="font-semibold text-gray-900 mb-2">Visitor Management</h3>
                  <p className="text-sm text-gray-500">Check-in/out system and security protocols</p>
                </div>
              </Link>
              
              <Link href="/admin/communications" className="p-6 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="text-center">
                  <span className="text-4xl mb-4 block">📱</span>
                  <h3 className="font-semibold text-gray-900 mb-2">Communications Hub</h3>
                  <p className="text-sm text-gray-500">Multi-language messaging and announcements</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Compliance & Reporting */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Compliance & Reporting</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link href="/texas-reporting" className="p-6 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <span className="text-4xl">🏛️</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Texas Compliance Center</h3>
                    <p className="text-sm text-gray-500">PEIMS reporting, TEA compliance, state assessments</p>
                  </div>
                </div>
              </Link>
              
              <Link href="/admin/analytics" className="p-6 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <span className="text-4xl">📊</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Analytics Dashboard</h3>
                    <p className="text-sm text-gray-500">Performance metrics, predictive analytics, custom reports</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}