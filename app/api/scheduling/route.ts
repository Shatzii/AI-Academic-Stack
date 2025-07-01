import { NextRequest, NextResponse } from 'next/server'
import { storage } from '../../../server/storage'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get('schoolId')
    const gradeLevel = searchParams.get('gradeLevel')
    const type = searchParams.get('type') || 'schedule'
    
    switch (type) {
      case 'schedule':
        const schedule = await generateBlockSchedule(schoolId, gradeLevel)
        return NextResponse.json(schedule)
        
      case 'courses':
        const courses = await getAvailableCourses(schoolId, gradeLevel)
        return NextResponse.json(courses)
        
      case 'graduation':
        const graduation = await getGraduationRequirements(schoolId, gradeLevel)
        return NextResponse.json(graduation)
        
      default:
        return NextResponse.json({ error: 'Invalid scheduling type' }, { status: 400 })
    }
  } catch (error) {
    console.error('Scheduling error:', error)
    return NextResponse.json({ error: 'Failed to fetch scheduling data' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, userId, schoolId, ...data } = body
    
    switch (action) {
      case 'enroll_course':
        const enrollment = await enrollInCourse(userId, data.courseId, schoolId)
        return NextResponse.json(enrollment)
        
      case 'create_schedule':
        const schedule = await createCustomSchedule(userId, schoolId, data)
        return NextResponse.json(schedule)
        
      case 'track_graduation':
        const tracking = await updateGraduationTracking(userId, data)
        return NextResponse.json(tracking)
        
      default:
        return NextResponse.json({ error: 'Invalid scheduling action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Scheduling action error:', error)
    return NextResponse.json({ error: 'Failed to execute scheduling action' }, { status: 500 })
  }
}

async function generateBlockSchedule(schoolId: string | null, gradeLevel: string | null) {
  const scheduleTemplates = {
    'primary-school': {
      name: 'SuperHero Adventure Schedule',
      type: 'flexible',
      blocks: [
        { time: '8:00-9:30', period: 1, subject: 'Math Adventures', credits: 1 },
        { time: '9:45-11:15', period: 2, subject: 'Reading Heroes', credits: 1 },
        { time: '11:30-12:30', period: 'Lunch', subject: 'Hero Fuel Time', credits: 0 },
        { time: '12:30-2:00', period: 3, subject: 'Science Exploration', credits: 1 },
        { time: '2:15-3:45', period: 4, subject: 'Creative Arts', credits: 1 }
      ]
    },
    'secondary-school': {
      name: 'Stage Prep 4×4 Block Schedule',
      type: 'block',
      blocks: [
        { time: '8:00-9:30', period: 1, subject: 'Theater Arts I', credits: 1 },
        { time: '9:45-11:15', period: 2, subject: 'English IV', credits: 1 },
        { time: '11:30-12:30', period: 'Lunch', subject: 'Lunch Break', credits: 0 },
        { time: '12:30-2:00', period: 3, subject: 'Math Analysis', credits: 1 },
        { time: '2:15-3:45', period: 4, subject: 'Technical Theater', credits: 1 }
      ]
    }
  }

  const schedule = scheduleTemplates[schoolId as keyof typeof scheduleTemplates] || scheduleTemplates['primary-school']
  
  return {
    ...schedule,
    schoolId,
    gradeLevel,
    semester: 'Fall 2025',
    totalCredits: schedule.blocks.reduce((sum, block) => sum + block.credits, 0),
    requirements: {
      totalCreditsNeeded: schoolId === 'secondary-school' ? 26 : 'grade-appropriate',
      currentProgress: 12,
      onTrack: true
    },
    accommodations: {
      ADHD: ['Shortened periods', 'Movement breaks', 'Visual schedules'],
      dyslexia: ['Audio support', 'Extended time', 'Alternative formats'],
      autism: ['Predictable routines', 'Sensory breaks', 'Clear transitions']
    }
  }
}

async function getAvailableCourses(schoolId: string | null, gradeLevel: string | null) {
  const courseLibrary = {
    'primary-school': {
      K: ['Math Foundations', 'Reading Readiness', 'Science Discovery', 'Art Expression'],
      '1': ['Math Adventures', 'Reading Heroes', 'Nature Explorers', 'Creative Arts'],
      '2': ['Number Superheroes', 'Story Champions', 'Science Investigators', 'Music Magic'],
      '3': ['Math Masters', 'Reading Legends', 'Science Detectives', 'Drama Fun'],
      '4': ['Advanced Math', 'Literature Heroes', 'Earth Science', 'Digital Arts'],
      '5': ['Pre-Algebra', 'Classic Literature', 'Physical Science', 'Theater Arts'],
      '6': ['Algebra Prep', 'Advanced Reading', 'Life Science', 'Performance Arts']
    },
    'secondary-school': {
      '7': ['Algebra I', 'English I', 'Biology', 'Theater Foundations', 'World Geography'],
      '8': ['Geometry', 'English II', 'Chemistry', 'Acting I', 'World History'],
      '9': ['Algebra II', 'English III', 'Physics', 'Technical Theater', 'US History'],
      '10': ['Pre-Calculus', 'English IV', 'Environmental Science', 'Advanced Acting', 'Government'],
      '11': ['Calculus', 'AP Literature', 'AP Biology', 'Directing', 'Economics'],
      '12': ['Statistics', 'Dual Credit English', 'AP Chemistry', 'Theater Capstone', 'Psychology']
    }
  }

  const courses = courseLibrary[schoolId as keyof typeof courseLibrary]?.[gradeLevel as keyof any] || []
  
  return courses.map(courseName => ({
    id: `${schoolId}_${gradeLevel}_${courseName.replace(/\s+/g, '_').toLowerCase()}`,
    name: courseName,
    credits: 1,
    duration: '1 semester',
    prerequisites: [],
    description: `Comprehensive ${courseName} course designed for ${schoolId} students`,
    accommodations: {
      ADHD: 'Movement breaks, chunked content, visual organizers',
      dyslexia: 'Audio support, dyslexia-friendly materials, alternative assessments',
      autism: 'Structured routines, clear expectations, sensory considerations'
    }
  }))
}

async function getGraduationRequirements(schoolId: string | null, gradeLevel: string | null) {
  if (schoolId !== 'secondary-school') {
    return { message: 'Graduation tracking available for secondary school only' }
  }

  return {
    foundationProgram: {
      totalCredits: 26,
      breakdown: {
        english: { required: 4, completed: 2, remaining: 2 },
        mathematics: { required: 4, completed: 3, remaining: 1 },
        science: { required: 4, completed: 2, remaining: 2 },
        socialStudies: { required: 3, completed: 2, remaining: 1 },
        languages: { required: 2, completed: 1, remaining: 1 },
        healthPE: { required: 1.5, completed: 1, remaining: 0.5 },
        fineArts: { required: 1, completed: 1, remaining: 0 },
        careerTech: { required: 1, completed: 0.5, remaining: 0.5 },
        electives: { required: 5.5, completed: 3, remaining: 2.5 }
      }
    },
    artsEndorsement: {
      theatreArts: { required: 4, completed: 2, remaining: 2 },
      performance: { required: 2, completed: 1, remaining: 1 },
      technical: { required: 2, completed: 1, remaining: 1 }
    },
    staarRequirements: {
      algebra1: { required: true, completed: true, score: 'Masters' },
      biology: { required: true, completed: false, scheduled: 'Spring 2025' },
      englishI: { required: true, completed: true, score: 'Meets' },
      englishII: { required: true, completed: false, scheduled: 'Spring 2025' },
      usHistory: { required: true, completed: false, scheduled: 'Spring 2026' }
    },
    ccmrReadiness: {
      tsi: { completed: false, scheduled: 'Fall 2025' },
      apExams: { completed: 0, planned: 2 },
      dualCredit: { completed: 0, planned: 4 },
      industryCredential: { completed: false, planned: true }
    },
    timeline: {
      currentGrade: gradeLevel || '9',
      graduationDate: 'June 2027',
      onTrack: true,
      creditsPerSemester: 4,
      totalSemesters: 8
    }
  }
}

async function enrollInCourse(userId: string, courseId: string, schoolId: string) {
  return {
    enrollmentId: `ENR_${Date.now()}`,
    userId,
    courseId,
    schoolId,
    enrolledAt: new Date().toISOString(),
    status: 'enrolled',
    semester: 'Fall 2025',
    credits: 1
  }
}

async function createCustomSchedule(userId: string, schoolId: string, data: any) {
  const { courses, preferences } = data
  
  return {
    scheduleId: `SCH_${Date.now()}`,
    userId,
    schoolId,
    courses: courses || [],
    preferences: preferences || {},
    createdAt: new Date().toISOString(),
    status: 'active',
    semester: 'Fall 2025'
  }
}

async function updateGraduationTracking(userId: string, data: any) {
  const { creditsEarned, coursesCompleted, assessmentsPassed } = data
  
  return {
    userId,
    totalCredits: creditsEarned || 0,
    coursesCompleted: coursesCompleted || [],
    assessmentsPassed: assessmentsPassed || [],
    graduationEligible: false,
    estimatedGraduation: 'June 2027',
    updatedAt: new Date().toISOString()
  }
}