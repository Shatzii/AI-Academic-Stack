import { NextRequest, NextResponse } from 'next/server'
import { storage } from '../../../server/storage'
import { insertCourseSchema } from '../../../shared/schema'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get('schoolId')
    const gradeLevel = searchParams.get('gradeLevel')
    
    const courses = await storage.getCourses(schoolId || undefined)
    
    let filteredCourses = courses
    if (gradeLevel) {
      filteredCourses = courses.filter(course => course.gradeLevel === gradeLevel)
    }
    
    return NextResponse.json(filteredCourses)
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = insertCourseSchema.parse(body)
    
    const course = await storage.createCourse(validatedData)
    return NextResponse.json(course, { status: 201 })
  } catch (error) {
    console.error('Error creating course:', error)
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 })
  }
}