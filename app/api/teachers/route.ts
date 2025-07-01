import { NextRequest, NextResponse } from 'next/server'
import { storage } from '../../../server/storage'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get('schoolId')
    const subject = searchParams.get('subject')
    
    const teachers = await storage.getTeachers(schoolId || undefined, subject || undefined)
    return NextResponse.json(teachers)
  } catch (error) {
    console.error('Error fetching teachers:', error)
    return NextResponse.json({ error: 'Failed to fetch teachers' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, schoolId, subjects, qualifications, experience, specializations } = body
    
    if (!userId || !schoolId) {
      return NextResponse.json({ error: 'User ID and School ID required' }, { status: 400 })
    }

    const teacherProfile = await storage.createTeacherProfile({
      userId,
      schoolId,
      subjects: subjects || [],
      qualifications: qualifications || [],
      yearsExperience: experience || 0,
      specializations: specializations || [],
      isActive: true,
      hireDate: new Date(),
      certifications: [],
      performanceRating: 0
    })

    return NextResponse.json(teacherProfile, { status: 201 })
  } catch (error) {
    console.error('Error creating teacher profile:', error)
    return NextResponse.json({ error: 'Failed to create teacher profile' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body
    
    if (!id) {
      return NextResponse.json({ error: 'Teacher ID required' }, { status: 400 })
    }
    
    const teacher = await storage.updateTeacherProfile(id, updates)
    if (!teacher) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 })
    }
    
    return NextResponse.json(teacher)
  } catch (error) {
    console.error('Error updating teacher:', error)
    return NextResponse.json({ error: 'Failed to update teacher' }, { status: 500 })
  }
}