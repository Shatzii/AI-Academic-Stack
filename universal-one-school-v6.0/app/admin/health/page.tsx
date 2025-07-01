'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function HealthServices() {
  const [activeTab, setActiveTab] = useState('records')

  // Sample health data
  const healthRecords = [
    {
      id: '1',
      studentName: 'Emma Johnson',
      studentId: 'STU-2025-001',
      visitDate: '2025-01-23',
      time: '10:30 AM',
      reason: 'Headache',
      symptoms: 'Mild headache, fatigue',
      treatment: 'Rest in nurse office, water',
      disposition: 'Returned to class',
      medicationGiven: false,
      parentNotified: false
    },
    {
      id: '2',
      studentName: 'Marcus Williams',
      studentId: 'STU-2025-002',
      visitDate: '2025-01-23',
      time: '2:15 PM',
      reason: 'Medication Administration',
      symptoms: 'ADHD medication time',
      treatment: 'Administered prescribed medication',
      disposition: 'Returned to class',
      medicationGiven: true,
      parentNotified: false
    }
  ]

  const immunizationAlerts = [
    { studentName: 'Sophia Rodriguez', grade: '9', vaccine: 'Meningitis', dueDate: '2025-02-15' },
    { studentName: 'James Chen', grade: '5', vaccine: 'Tdap Booster', dueDate: '2025-02-28' }
  ]

  const medications = [
    {
      studentName: 'Marcus Williams',
      medication: 'Ritalin 10mg',
      times: ['8:00 AM', '12:00 PM'],
      prescribingDoctor: 'Dr. Smith',
      expiration: '2025-06-15'
    },
    {
      studentName: 'Lily Zhang',
      medication: 'EpiPen',
      times: ['As needed'],
      prescribingDoctor: 'Dr. Johnson',
      expiration: '2025-12-01'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/admin/dashboard" className="text-indigo-600 font-semibold text-lg hover:text-indigo-500">
              ← Admin Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Health Services Management</h1>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              + New Health Record
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
                <span className="text-2xl">🏥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today's Visits</p>
                <p className="text-2xl font-bold text-gray-900">{healthRecords.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <span className="text-2xl">💊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Daily Medications</p>
                <p className="text-2xl font-bold text-gray-900">{medications.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">⚠️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Immunization Alerts</p>
                <p className="text-2xl font-bold text-gray-900">{immunizationAlerts.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">📋</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Health Plans</p>
                <p className="text-2xl font-bold text-gray-900">15</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'records', name: 'Health Records', icon: '📋' },
                { id: 'medications', name: 'Medications', icon: '💊' },
                { id: 'immunizations', name: 'Immunizations', icon: '💉' },
                { id: 'emergencies', name: 'Emergency Info', icon: '🚨' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.icon} {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'records' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Today's Health Records</h3>
                  <div className="flex space-x-2">
                    <input
                      type="date"
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                      defaultValue="2025-01-23"
                    />
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                      Filter
                    </button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Treatment</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Disposition</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {healthRecords.map((record) => (
                        <tr key={record.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-medium text-gray-900">{record.studentName}</div>
                              <div className="text-sm text-gray-500">{record.studentId}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">{record.time}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{record.reason}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{record.treatment}</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              {record.disposition}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <button className="text-indigo-600 hover:text-indigo-900 mr-3">View</button>
                            <button className="text-indigo-600 hover:text-indigo-900">Edit</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'medications' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Daily Medication Schedule</h3>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    + Add Medication
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {medications.map((med, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{med.studentName}</h4>
                          <p className="text-lg text-indigo-600 font-medium">{med.medication}</p>
                        </div>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          Active
                        </span>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p><strong>Schedule:</strong> {med.times.join(', ')}</p>
                        <p><strong>Prescribing Doctor:</strong> {med.prescribingDoctor}</p>
                        <p><strong>Expires:</strong> {med.expiration}</p>
                      </div>
                      <div className="mt-4 flex space-x-2">
                        <button className="text-green-600 hover:text-green-800">✓ Give Medication</button>
                        <button className="text-indigo-600 hover:text-indigo-800">Edit</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'immunizations' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Immunization Tracking</h3>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    Run Compliance Report
                  </button>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-yellow-800 mb-2">Upcoming Immunizations Due</h4>
                  <div className="space-y-2">
                    {immunizationAlerts.map((alert, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span>{alert.studentName} (Grade {alert.grade}) - {alert.vaccine}</span>
                        <span className="text-yellow-700 font-medium">Due: {alert.dueDate}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-green-50 p-6 rounded-lg text-center">
                    <div className="text-3xl text-green-600 mb-2">98%</div>
                    <div className="text-sm text-green-700">Compliance Rate</div>
                  </div>
                  <div className="bg-blue-50 p-6 rounded-lg text-center">
                    <div className="text-3xl text-blue-600 mb-2">1,203</div>
                    <div className="text-sm text-blue-700">Students Up to Date</div>
                  </div>
                  <div className="bg-red-50 p-6 rounded-lg text-center">
                    <div className="text-3xl text-red-600 mb-2">24</div>
                    <div className="text-sm text-red-700">Overdue Immunizations</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'emergencies' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Emergency Information</h3>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                    🚨 Emergency Protocol
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border-2 border-red-200 rounded-lg p-6">
                    <h4 className="font-semibold text-red-800 mb-4">High Priority Medical Alerts</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-red-50 rounded border">
                        <div className="font-medium">Lily Zhang - Severe Peanut Allergy</div>
                        <div className="text-sm text-gray-600">EpiPen in nurse office and classroom</div>
                      </div>
                      <div className="p-3 bg-red-50 rounded border">
                        <div className="font-medium">Alex Rodriguez - Type 1 Diabetes</div>
                        <div className="text-sm text-gray-600">Glucagon kit available, check BG regularly</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border rounded-lg p-6">
                    <h4 className="font-semibold text-gray-800 mb-4">Emergency Contacts</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>911 Emergency</span>
                        <span className="font-medium">911</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Poison Control</span>
                        <span className="font-medium">1-800-222-1222</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Local Hospital</span>
                        <span className="font-medium">(555) 123-4567</span>
                      </div>
                      <div className="flex justify-between">
                        <span>School District Nurse</span>
                        <span className="font-medium">(555) 234-5678</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Tasks</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                💊 Medication Administration
              </button>
              <button className="w-full text-left p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                📋 Health Screening
              </button>
              <button className="w-full text-left p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
                📞 Parent Communication
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reports</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors">
                📊 Health Summary Report
              </button>
              <button className="w-full text-left p-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors">
                💉 Immunization Report
              </button>
              <button className="w-full text-left p-3 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors">
                📈 Incident Trends
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resources</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                📚 Health Education Materials
              </button>
              <button className="w-full text-left p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                🩺 Medical Forms Library
              </button>
              <button className="w-full text-left p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                📋 Emergency Protocols
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}