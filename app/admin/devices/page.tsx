'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function DeviceManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  // Sample device data
  const devices = [
    {
      id: '1',
      deviceId: 'LAPTOP-001',
      type: 'Laptop',
      brand: 'Dell',
      model: 'Latitude 3520',
      serialNumber: 'DL3520-001-2025',
      assignedTo: 'Emma Johnson',
      studentId: 'STU-2025-001',
      status: 'assigned',
      condition: 'excellent',
      purchaseDate: '2024-08-15',
      warrantyExpiry: '2027-08-15',
      lastMaintenance: '2024-12-01',
      checkoutDate: '2024-08-20',
      location: 'SuperHero School - Grade K'
    },
    {
      id: '2',
      deviceId: 'TABLET-015',
      type: 'Tablet',
      brand: 'Apple',
      model: 'iPad 10th Gen',
      serialNumber: 'IPAD-015-2025',
      assignedTo: null,
      studentId: null,
      status: 'available',
      condition: 'good',
      purchaseDate: '2024-07-10',
      warrantyExpiry: '2026-07-10',
      lastMaintenance: '2024-11-15',
      checkoutDate: null,
      location: 'IT Storage Room'
    },
    {
      id: '3',
      deviceId: 'CHROME-098',
      type: 'Chromebook',
      brand: 'Lenovo',
      model: 'Chromebook 3 11',
      serialNumber: 'LN3-098-2025',
      assignedTo: 'Marcus Williams',
      studentId: 'STU-2025-002',
      status: 'maintenance',
      condition: 'fair',
      purchaseDate: '2024-06-01',
      warrantyExpiry: '2027-06-01',
      lastMaintenance: '2025-01-20',
      checkoutDate: '2024-08-15',
      location: 'IT Repair Center'
    }
  ]

  const deviceTypes = ['Laptop', 'Tablet', 'Chromebook', 'Desktop']
  const statusTypes = ['available', 'assigned', 'maintenance', 'retired']

  const filteredDevices = devices.filter(device => {
    const matchesSearch = `${device.deviceId} ${device.brand} ${device.model} ${device.assignedTo || ''}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || device.status === statusFilter
    const matchesType = typeFilter === 'all' || device.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const stats = {
    total: devices.length,
    assigned: devices.filter(d => d.status === 'assigned').length,
    available: devices.filter(d => d.status === 'available').length,
    maintenance: devices.filter(d => d.status === 'maintenance').length,
    retired: devices.filter(d => d.status === 'retired').length
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/admin/dashboard" className="text-indigo-600 font-semibold text-lg hover:text-indigo-500">
              ← Admin Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Device Management</h1>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              + Add New Device
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">💻</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Devices</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Assigned</p>
                <p className="text-2xl font-bold text-gray-900">{stats.assigned}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">📦</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className="text-2xl font-bold text-gray-900">{stats.available}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">🔧</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Maintenance</p>
                <p className="text-2xl font-bold text-gray-900">{stats.maintenance}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <span className="text-2xl">📴</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Retired</p>
                <p className="text-2xl font-bold text-gray-900">{stats.retired}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Devices</label>
                <input
                  type="text"
                  placeholder="Device ID, Brand, Model, or User..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Device Type</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">All Types</option>
                  {deviceTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">All Status</option>
                  {statusTypes.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-end">
                <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Device Table */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Device Inventory</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Device
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type & Model
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Condition
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDevices.map((device) => (
                  <tr key={device.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{device.deviceId}</div>
                        <div className="text-sm text-gray-500">{device.serialNumber}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{device.type}</div>
                        <div className="text-sm text-gray-500">{device.brand} {device.model}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        {device.assignedTo ? (
                          <>
                            <div className="text-sm font-medium text-gray-900">{device.assignedTo}</div>
                            <div className="text-sm text-gray-500">{device.studentId}</div>
                          </>
                        ) : (
                          <span className="text-sm text-gray-400">Unassigned</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        device.status === 'assigned' ? 'bg-green-100 text-green-800' :
                        device.status === 'available' ? 'bg-blue-100 text-blue-800' :
                        device.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        device.condition === 'excellent' ? 'bg-green-100 text-green-800' :
                        device.condition === 'good' ? 'bg-blue-100 text-blue-800' :
                        device.condition === 'fair' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {device.condition.charAt(0).toUpperCase() + device.condition.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {device.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-indigo-600 hover:text-indigo-900">
                          View
                        </button>
                        <button className="text-indigo-600 hover:text-indigo-900">
                          {device.status === 'assigned' ? 'Return' : 'Assign'}
                        </button>
                        <button className="text-indigo-600 hover:text-indigo-900">
                          Maintenance
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Operations</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                📱 Bulk Assignment
              </button>
              <button className="w-full text-left p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                🔄 Mass Check-in/out
              </button>
              <button className="w-full text-left p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
                🏷️ Print Asset Tags
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Maintenance</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors">
                🔧 Schedule Maintenance
              </button>
              <button className="w-full text-left p-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors">
                ⚠️ Warranty Alerts
              </button>
              <button className="w-full text-left p-3 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors">
                🛠️ Repair Tracking
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reports & Analytics</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                📊 Usage Analytics
              </button>
              <button className="w-full text-left p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                💰 Cost Analysis
              </button>
              <button className="w-full text-left p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                📋 Inventory Report
              </button>
            </div>
          </div>
        </div>

        {/* Warranty and Maintenance Alerts */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Alerts & Notifications</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-yellow-800 mb-3">Warranty Expiring Soon</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <div className="font-medium">TABLET-015 - iPad 10th Gen</div>
                    <div className="text-sm text-gray-600">Expires: July 10, 2026 (5 months)</div>
                  </div>
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <div className="font-medium">CHROME-098 - Chromebook 3 11</div>
                    <div className="text-sm text-gray-600">Expires: June 1, 2027 (16 months)</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-red-800 mb-3">Maintenance Required</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-red-50 border border-red-200 rounded">
                    <div className="font-medium">CHROME-098 - Currently in Maintenance</div>
                    <div className="text-sm text-gray-600">Issue: Screen flickering, keyboard sticky keys</div>
                  </div>
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded">
                    <div className="font-medium">5 devices due for routine maintenance</div>
                    <div className="text-sm text-gray-600">Scheduled cleaning and software updates needed</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}