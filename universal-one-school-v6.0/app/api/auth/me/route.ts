import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // For demo purposes, return a mock authenticated user
    const mockUser = {
      id: 'demo_student',
      username: 'demo_student',
      email: 'demo@example.com',
      firstName: 'Demo',
      lastName: 'Student',
      role: 'student',
      enrollmentType: 'premium',
      neurotype: 'adhd',
      learningPreferences: {
        visualLearning: true,
        auditoryLearning: false,
        kinestheticLearning: true,
        readingWriting: false
      },
      profileImageUrl: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(mockUser)
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
  }
}