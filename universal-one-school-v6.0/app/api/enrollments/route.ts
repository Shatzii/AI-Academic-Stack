import { NextRequest, NextResponse } from 'next/server'
import { storage } from '../../../server/storage'
import { insertEnrollmentSchema } from '../../../shared/schema'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }
    
    const enrollments = await storage.getEnrollments(userId)
    return NextResponse.json(enrollments)
  } catch (error) {
    console.error('Error fetching enrollments:', error)
    return NextResponse.json({ error: 'Failed to fetch enrollments' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = insertEnrollmentSchema.parse(body)
    
    const enrollment = await storage.createEnrollment(validatedData)
    return NextResponse.json(enrollment, { status: 201 })
  } catch (error) {
    console.error('Error creating enrollment:', error)
    return NextResponse.json({ error: 'Failed to create enrollment' }, { status: 500 })
  }
}