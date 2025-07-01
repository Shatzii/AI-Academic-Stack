import { NextRequest, NextResponse } from 'next/server'
import { storage } from '../../../server/storage'
import { insertStudentProgressSchema } from '../../../shared/schema'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const schoolId = searchParams.get('schoolId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }
    
    const progress = await storage.getStudentProgress(userId, schoolId || undefined)
    return NextResponse.json(progress)
  } catch (error) {
    console.error('Error fetching progress:', error)
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = insertStudentProgressSchema.parse(body)
    
    const progress = await storage.createStudentProgress(validatedData)
    return NextResponse.json(progress, { status: 201 })
  } catch (error) {
    console.error('Error creating progress:', error)
    return NextResponse.json({ error: 'Failed to create progress' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body
    
    if (!id) {
      return NextResponse.json({ error: 'Progress ID required' }, { status: 400 })
    }
    
    const progress = await storage.updateStudentProgress(id, updates)
    if (!progress) {
      return NextResponse.json({ error: 'Progress not found' }, { status: 404 })
    }
    
    return NextResponse.json(progress)
  } catch (error) {
    console.error('Error updating progress:', error)
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 })
  }
}