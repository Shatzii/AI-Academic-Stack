import { NextRequest, NextResponse } from 'next/server'
import { storage } from '../../../server/storage'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const courseId = searchParams.get('courseId')
    const status = searchParams.get('status')
    const type = searchParams.get('type') || 'assignments'

    switch (type) {
      case 'assignments':
        const assignments = await getStudentAssignments(userId, courseId, status)
        return NextResponse.json(assignments)

      case 'submissions':
        const submissions = await getAssignmentSubmissions(courseId, userId)
        return NextResponse.json(submissions)

      case 'grades':
        const grades = await getStudentGrades(userId, courseId)
        return NextResponse.json(grades)

      default:
        return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 })
    }
  } catch (error) {
    console.error('Assignments API error:', error)
    return NextResponse.json({ error: 'Failed to fetch assignments data' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...data } = body

    switch (action) {
      case 'submit_assignment':
        const submission = await submitAssignment(data)
        return NextResponse.json(submission)

      case 'save_draft':
        const draft = await saveDraft(data)
        return NextResponse.json(draft)

      case 'grade_assignment':
        const grade = await gradeAssignment(data)
        return NextResponse.json(grade)

      case 'create_assignment':
        const assignment = await createAssignment(data)
        return NextResponse.json(assignment)

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Assignment action error:', error)
    return NextResponse.json({ error: 'Failed to process assignment action' }, { status: 500 })
  }
}

async function getStudentAssignments(userId: string | null, courseId: string | null, status: string | null) {
  const assignments = [
    {
      id: 'assign_1',
      title: 'Shakespeare Character Analysis',
      description: 'Analyze a character from Romeo and Juliet using theatrical interpretation techniques',
      courseId: 'course_theater_1',
      courseName: 'Theater Arts I',
      teacherId: 'teacher_1',
      teacherName: 'Ms. Johnson',
      assignedDate: '2025-01-20T00:00:00Z',
      dueDate: '2025-01-27T23:59:59Z',
      maxPoints: 100,
      submissionType: 'essay_with_video',
      status: 'assigned',
      priority: 'high',
      instructions: [
        'Choose a character from Romeo and Juliet',
        'Write a 500-word character analysis',
        'Record a 2-minute monologue as that character',
        'Include costume and staging notes'
      ],
      resources: [
        { type: 'video', title: 'Character Development Techniques', url: '/resources/char_dev.mp4' },
        { type: 'pdf', title: 'Romeo and Juliet Text', url: '/resources/romeo_juliet.pdf' }
      ],
      accommodations: {
        extendedTime: true,
        audioInstructions: true,
        alternativeFormat: false
      }
    },
    {
      id: 'assign_2',
      title: 'Superhero Math Quest: Fraction Adventures',
      description: 'Help Captain Calculator save the city by solving fraction problems',
      courseId: 'course_math_1',
      courseName: 'Math Adventures',
      teacherId: 'teacher_2',
      teacherName: 'Mr. Davis',
      assignedDate: '2025-01-22T00:00:00Z',
      dueDate: '2025-01-24T23:59:59Z',
      maxPoints: 50,
      submissionType: 'interactive_game',
      status: 'in_progress',
      priority: 'normal',
      currentProgress: 65,
      instructions: [
        'Complete all 10 fraction challenges',
        'Show your work for each problem',
        'Earn at least 80% to unlock the next level',
        'Use visual fraction tools if needed'
      ],
      resources: [
        { type: 'interactive', title: 'Fraction Visualizer', url: '/tools/fraction_viz' },
        { type: 'video', title: 'Fraction Basics', url: '/resources/fractions_101.mp4' }
      ],
      accommodations: {
        visualSupports: true,
        unlimitedAttempts: true,
        breakReminders: true
      }
    },
    {
      id: 'assign_3',
      title: 'Spanish Conversation Portfolio',
      description: 'Record daily Spanish conversations and cultural reflections',
      courseId: 'course_spanish_1',
      courseName: 'Spanish Immersion',
      teacherId: 'teacher_3',
      teacherName: 'Dr. Martinez',
      assignedDate: '2025-01-15T00:00:00Z',
      dueDate: '2025-01-30T23:59:59Z',
      maxPoints: 75,
      submissionType: 'portfolio',
      status: 'submitted',
      priority: 'normal',
      submittedDate: '2025-01-23T14:30:00Z',
      grade: 88,
      feedback: 'Excellent pronunciation and cultural insights. Great improvement in conversation flow!',
      instructions: [
        'Record 5 conversations (2 minutes each)',
        'Write cultural reflection for each conversation',
        'Use target vocabulary from lessons',
        'Include self-assessment rubric'
      ]
    }
  ]

  return assignments.filter(a => {
    if (userId && !a.teacherId) return false
    if (courseId && a.courseId !== courseId) return false
    if (status && a.status !== status) return false
    return true
  })
}

async function getAssignmentSubmissions(courseId: string | null, userId: string | null) {
  return [
    {
      id: 'sub_1',
      assignmentId: 'assign_1',
      userId: 'student_1',
      studentName: 'Emma Rodriguez',
      submittedDate: '2025-01-26T20:15:00Z',
      submissionType: 'essay_with_video',
      files: [
        { name: 'character_analysis.docx', size: '2.1 MB', type: 'document' },
        { name: 'juliet_monologue.mp4', size: '45.3 MB', type: 'video' }
      ],
      status: 'submitted',
      isLate: false,
      grade: null,
      feedback: null,
      gradedDate: null
    },
    {
      id: 'sub_2',
      assignmentId: 'assign_2',
      userId: 'student_2',
      studentName: 'Lucas Rodriguez',
      submittedDate: '2025-01-24T16:45:00Z',
      submissionType: 'interactive_game',
      gameScore: 92,
      timeSpent: '45 minutes',
      attempts: 3,
      status: 'graded',
      isLate: false,
      grade: 46,
      feedback: 'Excellent work! You showed great understanding of fraction concepts.',
      gradedDate: '2025-01-24T18:30:00Z'
    }
  ]
}

async function getStudentGrades(userId: string | null, courseId: string | null) {
  return {
    overall: {
      currentGrade: 'A-',
      percentage: 89.5,
      totalPoints: 358,
      maxPoints: 400,
      letterGrade: 'A-',
      trend: 'improving'
    },
    assignments: [
      {
        id: 'assign_1',
        title: 'Shakespeare Character Analysis',
        dueDate: '2025-01-27T23:59:59Z',
        maxPoints: 100,
        earnedPoints: 92,
        percentage: 92,
        letterGrade: 'A-',
        isLate: false,
        submittedDate: '2025-01-26T20:15:00Z',
        gradedDate: '2025-01-27T10:30:00Z',
        feedback: 'Excellent character development and strong theatrical interpretation. Your video monologue showed real understanding of Juliet\'s emotional journey.'
      },
      {
        id: 'assign_2',
        title: 'Superhero Math Quest',
        dueDate: '2025-01-24T23:59:59Z',
        maxPoints: 50,
        earnedPoints: 46,
        percentage: 92,
        letterGrade: 'A-',
        isLate: false,
        submittedDate: '2025-01-24T16:45:00Z',
        gradedDate: '2025-01-24T18:30:00Z',
        feedback: 'Great problem-solving skills! You showed excellent work on the visual fraction problems.'
      },
      {
        id: 'assign_3',
        title: 'Spanish Conversation Portfolio',
        dueDate: '2025-01-30T23:59:59Z',
        maxPoints: 75,
        earnedPoints: 66,
        percentage: 88,
        letterGrade: 'B+',
        isLate: false,
        submittedDate: '2025-01-23T14:30:00Z',
        gradedDate: '2025-01-24T09:15:00Z',
        feedback: 'Excellent pronunciation and cultural insights. Your conversation flow has improved tremendously!'
      }
    ],
    categoryBreakdown: {
      homework: { points: 180, maxPoints: 200, percentage: 90 },
      projects: { points: 92, maxPoints: 100, percentage: 92 },
      participation: { points: 86, maxPoints: 100, percentage: 86 }
    },
    recentTrend: [
      { week: 'Week 1', average: 85 },
      { week: 'Week 2', average: 87 },
      { week: 'Week 3', average: 90 },
      { week: 'Week 4', average: 89 }
    ]
  }
}

async function submitAssignment(data: any) {
  const { assignmentId, userId, submissionData, files } = data

  return {
    submissionId: `sub_${Date.now()}`,
    assignmentId,
    userId,
    submittedDate: new Date().toISOString(),
    status: 'submitted',
    files: files || [],
    submissionData,
    confirmationNumber: `CONF${Date.now()}`,
    message: 'Assignment submitted successfully!'
  }
}

async function saveDraft(data: any) {
  const { assignmentId, userId, draftData } = data

  return {
    draftId: `draft_${Date.now()}`,
    assignmentId,
    userId,
    savedDate: new Date().toISOString(),
    draftData,
    message: 'Draft saved successfully!'
  }
}

async function gradeAssignment(data: any) {
  const { submissionId, teacherId, grade, feedback, rubricScores } = data

  return {
    gradeId: `grade_${Date.now()}`,
    submissionId,
    teacherId,
    grade,
    feedback,
    rubricScores: rubricScores || {},
    gradedDate: new Date().toISOString(),
    status: 'graded'
  }
}

async function createAssignment(data: any) {
  const { 
    title, 
    description, 
    courseId, 
    teacherId, 
    dueDate, 
    maxPoints, 
    instructions,
    resources,
    accommodations 
  } = data

  return {
    assignmentId: `assign_${Date.now()}`,
    title,
    description,
    courseId,
    teacherId,
    assignedDate: new Date().toISOString(),
    dueDate,
    maxPoints,
    instructions: instructions || [],
    resources: resources || [],
    accommodations: accommodations || {},
    status: 'published',
    createdDate: new Date().toISOString()
  }
}