import { NextRequest, NextResponse } from 'next/server'
import { storage } from '../../../server/storage'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }
    
    const tracking = await storage.getGraduationTracking(userId)
    if (!tracking) {
      return NextResponse.json({ error: 'Graduation tracking not found' }, { status: 404 })
    }
    
    return NextResponse.json(tracking)
  } catch (error) {
    console.error('Error fetching graduation tracking:', error)
    return NextResponse.json({ error: 'Failed to fetch graduation tracking' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, ...updates } = body
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }
    
    const tracking = await storage.updateGraduationTracking(userId, updates)
    if (!tracking) {
      return NextResponse.json({ error: 'Graduation tracking not found' }, { status: 404 })
    }
    
    return NextResponse.json(tracking)
  } catch (error) {
    console.error('Error updating graduation tracking:', error)
    return NextResponse.json({ error: 'Failed to update graduation tracking' }, { status: 500 })
  }
}