'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

interface LicenseRecord {
  id: string
  studentName: string
  licenseKey: string
  licenseType: 'semester' | 'annual' | 'lifetime'
  engineVersion: string
  purchaseDate: Date
  expirationDate: Date
  isActive: boolean
  currentActivations: number
  maxActivations: number
  deviceInfo: {
    deviceId: string
    computerName: string
    lastHeartbeat: Date
    isOnline: boolean
  }[]
  postExpiryAccess: 'limited' | 'basic' | 'full'
  violationCount: number
}

interface ControlStats {
  totalLicenses: number
  activeLicenses: number
  expiredLicenses: number
  violatingLicenses: number
  onlineDevices: number
  monthlyRevenue: number
}

export default function LicenseControlPage() {
  const [licenses, setLicenses] = useState<LicenseRecord[]>([])
  const [stats, setStats] = useState<ControlStats | null>(null)
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const licenseTypeLabels = {
    semester: 'Semester (6mo)',
    annual: 'Annual (12mo)', 
    lifetime: 'Lifetime'
  }

  const licenseTypeColors = {
    semester: 'bg-blue-500/20 text-blue-300',
    annual: 'bg-green-500/20 text-green-300',
    lifetime: 'bg-purple-500/20 text-purple-300'
  }

  const postExpiryColors = {
    limited: 'bg-red-500/20 text-red-300',
    basic: 'bg-yellow-500/20 text-yellow-300',
    full: 'bg-green-500/20 text-green-300'
  }

  useEffect(() => {
    fetchLicenseData()
  }, [])

  const fetchLicenseData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/license-control')
      const data = await response.json()
      setLicenses(data.licenses || mockLicenses)
      setStats(data.stats || mockStats)
    } catch (error) {
      console.error('Failed to fetch license data:', error)
      setLicenses(mockLicenses)
      setStats(mockStats)
    } finally {
      setIsLoading(false)
    }
  }

  const mockStats: ControlStats = {
    totalLicenses: 156,
    activeLicenses: 134,
    expiredLicenses: 22,
    violatingLicenses: 8,
    onlineDevices: 98,
    monthlyRevenue: 23450
  }

  const mockLicenses: LicenseRecord[] = [
    {
      id: '1',
      studentName: 'Emma Johnson',
      licenseKey: 'SEM-2025-EMMA-9X7K',
      licenseType: 'semester',
      engineVersion: '2.4.1',
      purchaseDate: new Date('2025-01-15'),
      expirationDate: new Date('2025-07-15'),
      isActive: true,
      currentActivations: 1,
      maxActivations: 1,
      deviceInfo: [{
        deviceId: 'WIN-EMMA-LAPTOP-001',
        computerName: 'Emma-Surface-Pro',
        lastHeartbeat: new Date('2025-01-23T10:30:00'),
        isOnline: true
      }],
      postExpiryAccess: 'limited',
      violationCount: 0
    },
    {
      id: '2',
      studentName: 'Marcus Chen',
      licenseKey: 'ANN-2024-MARC-4H8L',
      licenseType: 'annual',
      engineVersion: '2.4.1',
      purchaseDate: new Date('2024-08-01'),
      expirationDate: new Date('2025-08-01'),
      isActive: true,
      currentActivations: 1,
      maxActivations: 2,
      deviceInfo: [{
        deviceId: 'MAC-MARC-MBPRO-001',
        computerName: 'Marcus-MacBook-Pro',
        lastHeartbeat: new Date('2025-01-23T09:15:00'),
        isOnline: true
      }],
      postExpiryAccess: 'basic',
      violationCount: 0
    },
    {
      id: '3',
      studentName: 'Sarah Williams',
      licenseKey: 'LIF-2024-SARA-2M9N',
      licenseType: 'lifetime',
      engineVersion: '2.3.8',
      purchaseDate: new Date('2024-11-20'),
      expirationDate: new Date('2099-12-31'),
      isActive: true,
      currentActivations: 2,
      maxActivations: 3,
      deviceInfo: [
        {
          deviceId: 'WIN-SARA-DESKTOP-001',
          computerName: 'Sarah-Gaming-PC',
          lastHeartbeat: new Date('2025-01-23T11:45:00'),
          isOnline: true
        },
        {
          deviceId: 'WIN-SARA-LAPTOP-002',
          computerName: 'Sarah-Dell-Laptop',
          lastHeartbeat: new Date('2025-01-22T16:20:00'),
          isOnline: false
        }
      ],
      postExpiryAccess: 'full',
      violationCount: 0
    },
    {
      id: '4',
      studentName: 'David Rodriguez',
      licenseKey: 'SEM-2024-DAVI-3K7P',
      licenseType: 'semester',
      engineVersion: '2.4.0',
      purchaseDate: new Date('2024-09-01'),
      expirationDate: new Date('2025-03-01'),
      isActive: false,
      currentActivations: 1,
      maxActivations: 1,
      deviceInfo: [{
        deviceId: 'WIN-DAVI-LAPTOP-001',
        computerName: 'David-ThinkPad',
        lastHeartbeat: new Date('2025-01-20T14:30:00'),
        isOnline: false
      }],
      postExpiryAccess: 'limited',
      violationCount: 2
    }
  ]

  const filteredLicenses = licenses.filter(license => {
    const matchesSearch = license.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         license.licenseKey.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'active' && license.isActive) ||
                         (selectedFilter === 'expired' && !license.isActive) ||
                         (selectedFilter === 'violations' && license.violationCount > 0) ||
                         (selectedFilter === 'offline' && license.deviceInfo.every(d => !d.isOnline))

    return matchesSearch && matchesFilter
  })

  const handleRemoteAction = async (licenseId: string, action: string) => {
    try {
      const response = await fetch('/api/license-control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, licenseId })
      })

      if (response.ok) {
        await fetchLicenseData()
        alert(`Remote action "${action}" executed successfully`)
      } else {
        throw new Error('Failed to execute remote action')
      }
    } catch (error) {
      alert('Error executing remote action. Please try again.')
    }
  }

  const isExpiringSoon = (expirationDate: Date) => {
    const daysUntilExpiry = Math.ceil((expirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0
  }

  const isExpired = (expirationDate: Date) => {
    return expirationDate.getTime() < Date.now()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-red-400 border-t-transparent rounded-full"></div>
        <span className="text-white ml-3">Loading license control system...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex justify-between items-center">
            <Link href="/" className="text-white font-bold text-xl hover:text-red-300 transition-colors">
              ← The Universal One School
            </Link>
            <div className="text-white font-bold text-xl">
              AI Engine License Control System
            </div>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">AI Engine Licensing & Remote Control</h1>
          <p className="text-gray-300">Monitor and control self-hosted AI engines after student purchases</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-2xl font-bold text-blue-300">{stats?.totalLicenses}</div>
            <div className="text-white/70 text-sm">Total Licenses</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-2xl font-bold text-green-300">{stats?.activeLicenses}</div>
            <div className="text-white/70 text-sm">Active</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-2xl font-bold text-red-300">{stats?.expiredLicenses}</div>
            <div className="text-white/70 text-sm">Expired</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-2xl font-bold text-orange-300">{stats?.violatingLicenses}</div>
            <div className="text-white/70 text-sm">Violations</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-2xl font-bold text-cyan-300">{stats?.onlineDevices}</div>
            <div className="text-white/70 text-sm">Online Devices</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-2xl font-bold text-emerald-300">${stats?.monthlyRevenue.toLocaleString()}</div>
            <div className="text-white/70 text-sm">Monthly Revenue</div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-6">
          <h3 className="text-white font-bold text-lg mb-4">Remote Control Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <button className="bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors">
              Disable All Expired
            </button>
            <button className="bg-orange-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-orange-700 transition-colors">
              Send Expiry Warnings
            </button>
            <button className="bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Force Heartbeat Check
            </button>
            <button className="bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors">
              Update All Engines
            </button>
            <button className="bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors">
              Export License Report
            </button>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-white/80 mb-2 text-sm font-medium">Search Licenses</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Student name or license key..."
                className="w-full p-2 rounded-lg bg-black/30 text-white border border-white/30 focus:border-red-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-white/80 mb-2 text-sm font-medium">Filter by Status</label>
              <select 
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="w-full p-2 rounded-lg bg-black/30 text-white border border-white/30 focus:border-red-400"
              >
                <option value="all">All Licenses</option>
                <option value="active">Active Only</option>
                <option value="expired">Expired Only</option>
                <option value="violations">With Violations</option>
                <option value="offline">Offline Devices</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => fetchLicenseData()}
                className="w-full bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Refresh Data
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black/20">
                <tr>
                  <th className="text-left p-4 text-white font-medium">Student & License</th>
                  <th className="text-left p-4 text-white font-medium">Type & Expiry</th>
                  <th className="text-left p-4 text-white font-medium">Device Status</th>
                  <th className="text-left p-4 text-white font-medium">Post-Expiry Access</th>
                  <th className="text-left p-4 text-white font-medium">Violations</th>
                  <th className="text-left p-4 text-white font-medium">Remote Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLicenses.map((license) => (
                  <tr key={license.id} className="border-t border-white/10 hover:bg-white/5">
                    <td className="p-4">
                      <div>
                        <div className="text-white font-medium">{license.studentName}</div>
                        <div className="text-white/60 text-sm font-mono">{license.licenseKey}</div>
                        <div className="text-white/50 text-xs">v{license.engineVersion}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <span className={`px-2 py-1 rounded text-xs ${licenseTypeColors[license.licenseType]}`}>
                          {licenseTypeLabels[license.licenseType]}
                        </span>
                        <div className={`text-sm ${
                          isExpired(license.expirationDate) ? 'text-red-300' :
                          isExpiringSoon(license.expirationDate) ? 'text-yellow-300' :
                          'text-white/70'
                        }`}>
                          {license.expirationDate.toLocaleDateString()}
                        </div>
                        {isExpiringSoon(license.expirationDate) && !isExpired(license.expirationDate) && (
                          <div className="text-yellow-300 text-xs">Expires soon!</div>
                        )}
                        {isExpired(license.expirationDate) && (
                          <div className="text-red-300 text-xs">EXPIRED</div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="text-white/80 text-sm">
                          {license.currentActivations}/{license.maxActivations} devices
                        </div>
                        {license.deviceInfo.map((device, idx) => (
                          <div key={idx} className="text-xs">
                            <div className={`flex items-center space-x-2 ${device.isOnline ? 'text-green-300' : 'text-red-300'}`}>
                              <div className={`w-2 h-2 rounded-full ${device.isOnline ? 'bg-green-400' : 'bg-red-400'}`}></div>
                              <span>{device.computerName}</span>
                            </div>
                            <div className="text-white/50 text-xs ml-4">
                              Last: {device.lastHeartbeat.toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs ${postExpiryColors[license.postExpiryAccess]}`}>
                        {license.postExpiryAccess.toUpperCase()}
                      </span>
                      <div className="text-white/60 text-xs mt-1">
                        {license.postExpiryAccess === 'limited' ? '10% functionality' :
                         license.postExpiryAccess === 'basic' ? '25% functionality' :
                         'Full access'}
                      </div>
                    </td>
                    <td className="p-4">
                      {license.violationCount > 0 ? (
                        <span className="bg-red-500/20 text-red-300 px-2 py-1 rounded text-xs">
                          {license.violationCount} violations
                        </span>
                      ) : (
                        <span className="text-green-300 text-xs">Clean</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col space-y-1">
                        <button 
                          onClick={() => handleRemoteAction(license.id, 'disable')}
                          className="text-red-300 hover:text-red-400 text-xs"
                        >
                          Disable
                        </button>
                        <button 
                          onClick={() => handleRemoteAction(license.id, 'limit_features')}
                          className="text-yellow-300 hover:text-yellow-400 text-xs"
                        >
                          Limit Features
                        </button>
                        <button 
                          onClick={() => handleRemoteAction(license.id, 'force_update')}
                          className="text-blue-300 hover:text-blue-400 text-xs"
                        >
                          Force Update
                        </button>
                        <button 
                          onClick={() => handleRemoteAction(license.id, 'deactivate_device')}
                          className="text-purple-300 hover:text-purple-400 text-xs"
                        >
                          Deactivate Device
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredLicenses.length === 0 && (
          <div className="text-center py-12 text-white/60">
            No licenses found matching your criteria.
          </div>
        )}
      </div>
    </div>
  )
}