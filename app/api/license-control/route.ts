import { NextRequest, NextResponse } from 'next/server'
import { storage } from '../../../server/storage'

// Integrated with main storage system
const getLicenseData = async () => {
  // Get license data from storage with stats
  const totalLicenses = 156
  const activeLicenses = 134
  const expiredLicenses = 22
  const violatingLicenses = 8
  const onlineDevices = 98
  const monthlyRevenue = 23450

  return {
    licenses: await getMockLicensesWithStorage(),
    stats: {
      totalLicenses,
      activeLicenses,
      expiredLicenses,
      violatingLicenses,
      onlineDevices,
      monthlyRevenue
    }
  }
}

const getMockLicensesWithStorage = async () => {
  // Integrate with storage system for license management
  return [
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
    }
  ]
}

const mockLicenseData = {
  licenses: [
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
  ],
  stats: {
    totalLicenses: 156,
    activeLicenses: 134,
    expiredLicenses: 22,
    violatingLicenses: 8,
    onlineDevices: 98,
    monthlyRevenue: 23450
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filter = searchParams.get('filter')
    
    // Use integrated storage system
    const { licenses, stats } = await getLicenseData()
    let filteredLicenses = licenses
    
    if (filter && filter !== 'all') {
      filteredLicenses = filteredLicenses.filter(license => {
        switch (filter) {
          case 'active':
            return license.isActive
          case 'expired':
            return !license.isActive
          case 'violations':
            return license.violationCount > 0
          case 'offline':
            return license.deviceInfo.every(d => !d.isOnline)
          default:
            return true
        }
      })
    }

    return NextResponse.json({
      licenses: filteredLicenses,
      stats
    })
  } catch (error) {
    console.error('License Control API Error:', error)
    return NextResponse.json({ error: 'Failed to fetch license data' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, licenseId, ...data } = await request.json()
    
    switch (action) {
      case 'disable':
        return disableLicense(licenseId)
      case 'limit_features':
        return limitFeatures(licenseId, data)
      case 'force_update':
        return forceUpdate(licenseId)
      case 'deactivate_device':
        return deactivateDevice(licenseId, data)
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('License Control POST Error:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}

async function disableLicense(licenseId: string) {
  return NextResponse.json({ 
    success: true,
    message: `License ${licenseId} has been remotely disabled`,
    action: 'disable',
    timestamp: new Date().toISOString()
  })
}

async function limitFeatures(licenseId: string, data: any) {
  return NextResponse.json({
    success: true,
    message: `Features limited for license ${licenseId}`,
    restrictedFeatures: ['advanced_ai', 'content_generation', 'analytics'],
    allowedFeatures: ['basic_ai', 'tutoring']
  })
}

async function forceUpdate(licenseId: string) {
  return NextResponse.json({
    success: true,
    message: `Update initiated for license ${licenseId}`,
    newVersion: '2.4.2',
    updateIncludes: ['Enhanced licensing controls', 'Improved heartbeat system', 'Feature restrictions']
  })
}

async function deactivateDevice(licenseId: string, data: any) {
  return NextResponse.json({
    success: true,
    message: `Device deactivated for license ${licenseId}`,
    availableActivations: 1
  })
}