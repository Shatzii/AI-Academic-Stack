import { NextRequest, NextResponse } from 'next/server'
import { storage } from '../../../server/storage'
import { insertAssessmentSchema } from '../../../shared/schema'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const courseId = searchParams.get('courseId')
    
    const assessments = await storage.getAssessments(userId || undefined, courseId || undefined)
    return NextResponse.json(assessments)
  } catch (error) {
    console.error('Error fetching assessments:', error)
    return NextResponse.json({ error: 'Failed to fetch assessments' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = insertAssessmentSchema.parse(body)
    
    const assessment = await storage.createAssessment(validatedData)
    return NextResponse.json(assessment, { status: 201 })
  } catch (error) {
    console.error('Error creating assessment:', error)
    return NextResponse.json({ error: 'Failed to create assessment' }, { status: 500 })
  }
}