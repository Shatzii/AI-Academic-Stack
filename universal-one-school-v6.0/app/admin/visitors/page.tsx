'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function VisitorManagement() {
  const [activeTab, setActiveTab] = useState('checkin')
  const [showCheckInForm, setShowCheckInForm] = useState(false)

  // Sample visitor data
  const activeVisitors = [
    {
      id: '1',
      firstName: 'Jennifer',
      lastName: 'Martinez',
      organization: 'Smith & Associates Law Firm',
      purpose: 'IEP Meeting',
      host: 'Sarah Johnson (Principal)',
      checkInTime: '2025-01-23 10:30 AM',
      badgeNumber: 'V-001',
      backgroundCheck: true,
      expectedDuration: '1 hour',
      location: 'Conference Room A'
    },
    {
      id: '2',
      firstName: 'David',
      lastName: 'Chen',
      organization: 'Tech Solutions Inc',
      purpose: 'IT Equipment Delivery',
      host: 'Michael Rodriguez (IT Director)',
      checkInTime: '2025-01-23 02:15 PM',
      badgeNumber: 'V-002',
      backgroundCheck: false,
      expectedDuration: '30 minutes',
      location: 'IT Department'
    }
  ]

  const recentVisitors = [
    {
      id: '3',
      firstName: 'Lisa',
      lastName: 'Thompson',
      organization: 'Parent',
      purpose: 'Volunteer - Reading Program',
      host: 'Emma Wilson (Teacher)',
      checkInTime: '2025-01-23 09:00 AM',
      checkOutTime: '2025-01-23 11:30 AM',
      duration: '2.5 hours',
      badgeNumber: 'V-003',
      notes: 'Regular volunteer, cleared background check on file'
    },
    {
      id: '4',
      firstName: 'Robert',
      lastName: 'Johnson',
      organization: 'Johnson Maintenance Co',
      purpose: 'HVAC Maintenance',
      host: 'Facilities Management',
      checkInTime: '2025-01-22 08:00 AM',
      checkOutTime: '2025-01-22 03:30 PM',
      duration: '7.5 hours',
      badgeNumber: 'V-004',
      notes: 'Annual HVAC inspection and maintenance completed'
    }
  ]

  const scheduledVisits = [
    {
      id: '5',
      firstName: 'Dr. Amanda',
      lastName: 'Rodriguez',
      organization: 'Educational Consulting Services',
      purpose: 'Special Education Evaluation',
      host: 'David Wilson (Special Ed Coordinator)',
      scheduledDate: '2025-01-24',
      scheduledTime: '10:00 AM',
      expectedDuration: '3 hours',
      backgroundCheckStatus: 'completed',
      preApproved: true
    },
    {
      id: '6',
      firstName: 'Mark',
      lastName: 'Stevens',
      organization: 'Fire Safety Systems',
      purpose: 'Fire Alarm Inspection',
      host: 'Facilities Management',
      scheduledDate: '2025-01-25',
      scheduledTime: '07:30 AM',
      expectedDuration: '4 hours',
      backgroundCheckStatus: 'pending',
      preApproved: false
    }
  ]

  const emergencyContacts = [
    { name: 'School Resource Officer', phone: '(555) 911-1234', extension: '101' },
    { name: 'Principal Office', phone: '(555) 123-4567', extension: '100' },
    { name: 'Local Police', phone: '911', extension: '' },
    { name: 'Facilities Emergency', phone: '(555) 234-5678', extension: '200' }
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
            <h1 className="text-2xl font-bold text-gray-900">Visitor Management</h1>
            <button 
              onClick={() => setShowCheckInForm(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              🏃‍♂️ Quick Check-in
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Visitors</p>
                <p className="text-2xl font-bold text-gray-900">{activeVisitors.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today's Visits</p>
                <p className="text-2xl font-bold text-gray-900">{recentVisitors.length + activeVisitors.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">📋</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Scheduled Visits</p>
                <p className="text-2xl font-bold text-gray-900">{scheduledVisits.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Background Checks</p>
                <p className="text-2xl font-bold text-gray-900">
                  {[...activeVisitors, ...scheduledVisits].filter(v => v.backgroundCheck || v.backgroundCheckStatus === 'completed').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'checkin', name: 'Active Visitors', icon: '🏃‍♂️' },
                { id: 'recent', name: 'Recent Visits', icon: '📋' },
                { id: 'scheduled', name: 'Scheduled', icon: '📅' },
                { id: 'security', name: 'Security', icon: '🔒' }
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
            {activeTab === 'checkin' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Currently On Campus</h3>
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                      🚨 Emergency Evacuation
                    </button>
                  </div>
                </div>
                
                {activeVisitors.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <span className="text-4xl mb-4 block">👋</span>
                    <p>No visitors currently on campus</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeVisitors.map((visitor) => (
                      <div key={visitor.id} className="border rounded-lg p-6 bg-green-50">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="text-lg font-semibold text-gray-900">
                                {visitor.firstName} {visitor.lastName}
                              </h4>
                              <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                                Badge: {visitor.badgeNumber}
                              </span>
                              {visitor.backgroundCheck && (
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                  ✓ Background Checked
                                </span>
                              )}
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">Organization:</span>
                                <div className="font-medium">{visitor.organization}</div>
                              </div>
                              <div>
                                <span className="text-gray-600">Purpose:</span>
                                <div className="font-medium">{visitor.purpose}</div>
                              </div>
                              <div>
                                <span className="text-gray-600">Host:</span>
                                <div className="font-medium">{visitor.host}</div>
                              </div>
                              <div>
                                <span className="text-gray-600">Check-in Time:</span>
                                <div className="font-medium">{visitor.checkInTime}</div>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                              Extend Visit
                            </button>
                            <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                              Check Out
                            </button>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          <span>Expected Duration: {visitor.expectedDuration} | Current Location: {visitor.location}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'recent' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Visitor History</h3>
                  <div className="flex space-x-2">
                    <input
                      type="date"
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                      defaultValue="2025-01-23"
                    />
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                      Export Report
                    </button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Visitor</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Organization</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Purpose</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Host</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recentVisitors.map((visitor) => (
                        <tr key={visitor.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-medium text-gray-900">{visitor.firstName} {visitor.lastName}</div>
                              <div className="text-sm text-gray-500">Badge: {visitor.badgeNumber}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">{visitor.organization}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{visitor.purpose}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{visitor.duration}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{visitor.host}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{visitor.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'scheduled' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Upcoming Scheduled Visits</h3>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    + Schedule New Visit
                  </button>
                </div>
                
                <div className="space-y-4">
                  {scheduledVisits.map((visit) => (
                    <div key={visit.id} className="border rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-lg font-semibold text-gray-900">
                              {visit.firstName} {visit.lastName}
                            </h4>
                            {visit.preApproved && (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                Pre-approved
                              </span>
                            )}
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              visit.backgroundCheckStatus === 'completed' ? 'bg-blue-100 text-blue-800' :
                              visit.backgroundCheckStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              Background Check: {visit.backgroundCheckStatus}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Organization:</span>
                              <div className="font-medium">{visit.organization}</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Purpose:</span>
                              <div className="font-medium">{visit.purpose}</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Date & Time:</span>
                              <div className="font-medium">{visit.scheduledDate} at {visit.scheduledTime}</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Duration:</span>
                              <div className="font-medium">{visit.expectedDuration}</div>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                            Approve
                          </button>
                          <button className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            Edit
                          </button>
                          <button className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                            Cancel
                          </button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        Host: {visit.host}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Security & Emergency Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Emergency Contacts</h4>
                    <div className="space-y-3">
                      {emergencyContacts.map((contact, index) => (
                        <div key={index} className="p-4 border rounded-lg bg-red-50">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">{contact.name}</div>
                              <div className="text-sm text-gray-600">
                                {contact.phone} {contact.extension && `Ext. ${contact.extension}`}
                              </div>
                            </div>
                            <button className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">
                              Call
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Security Protocols</h4>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <h5 className="font-medium mb-2">Visitor Badge System</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• All visitors must wear identification badges</li>
                          <li>• Badges must be returned upon departure</li>
                          <li>• Lost badges must be reported immediately</li>
                        </ul>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <h5 className="font-medium mb-2">Background Check Requirements</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Required for recurring visitors</li>
                          <li>• Valid for 2 years from completion date</li>
                          <li>• Volunteer visitors need annual renewal</li>
                        </ul>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <h5 className="font-medium mb-2">Emergency Procedures</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• All visitors must follow staff evacuation instructions</li>
                          <li>• Report to designated assembly point</li>
                          <li>• Remain with assigned host or staff member</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Check-in Modal */}
        {showCheckInForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Visitor Check-in</h3>
                <button 
                  onClick={() => setShowCheckInForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input 
                      type="tel" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Purpose of Visit</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option>Parent Meeting</option>
                    <option>Volunteer Activity</option>
                    <option>Delivery/Service</option>
                    <option>Official Business</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Host/Contact Person</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Staff member to meet with"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expected Duration</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option>30 minutes</option>
                      <option>1 hour</option>
                      <option>2 hours</option>
                      <option>Half day</option>
                      <option>Full day</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Background check on file
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Photo ID verified
                  </label>
                </div>
                <div className="flex justify-end space-x-3">
                  <button 
                    type="button"
                    onClick={() => setShowCheckInForm(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Check In & Print Badge
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}