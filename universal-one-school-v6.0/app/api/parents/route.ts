import { NextRequest, NextResponse } from 'next/server'
import { storage } from '../../../server/storage'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const parentId = searchParams.get('parentId')
    const type = searchParams.get('type') || 'dashboard'
    
    if (!parentId) {
      return NextResponse.json({ error: 'Parent ID required' }, { status: 400 })
    }

    switch (type) {
      case 'dashboard':
        const dashboard = await generateParentDashboard(parentId)
        return NextResponse.json(dashboard)
        
      case 'children':
        const children = await getParentChildren(parentId)
        return NextResponse.json(children)
        
      case 'communications':
        const communications = await getSchoolCommunications(parentId)
        return NextResponse.json(communications)
        
      case 'reports':
        const reports = await generateProgressReports(parentId)
        return NextResponse.json(reports)
        
      default:
        return NextResponse.json({ error: 'Invalid parent portal type' }, { status: 400 })
    }
  } catch (error) {
    console.error('Parent portal error:', error)
    return NextResponse.json({ error: 'Failed to fetch parent data' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, parentId, ...data } = body
    
    switch (action) {
      case 'update_preferences':
        const preferences = await updateParentPreferences(parentId, data)
        return NextResponse.json(preferences)
        
      case 'request_conference':
        const conference = await requestTeacherConference(parentId, data)
        return NextResponse.json(conference)
        
      case 'submit_feedback':
        const feedback = await submitSchoolFeedback(parentId, data)
        return NextResponse.json(feedback)
        
      default:
        return NextResponse.json({ error: 'Invalid parent action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Parent action error:', error)
    return NextResponse.json({ error: 'Failed to execute parent action' }, { status: 500 })
  }
}

async function generateParentDashboard(parentId: string) {
  const parent = await storage.getUser(parentId)
  const children = await getParentChildren(parentId)
  
  return {
    parent: {
      id: parentId,
      name: `${parent?.firstName || ''} ${parent?.lastName || ''}`.trim() || parent?.username,
      email: parent?.email,
      preferredLanguage: parent?.learningPreferences?.language || 'English'
    },
    children: children,
    overview: {
      totalChildren: children.length,
      activeEnrollments: children.filter(c => c.status === 'active').length,
      upcomingEvents: 3,
      pendingApprovals: 1,
      unreadMessages: 2
    },
    quickActions: [
      'View Progress Reports',
      'Schedule Conference',
      'Update Contact Info',
      'Review Assignments',
      'Access Resources'
    ],
    recentActivity: [
      {
        type: 'progress',
        message: 'Emma completed Math Adventure Quest',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        child: 'Emma'
      },
      {
        type: 'achievement',
        message: 'Lucas earned Reading Hero badge',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        child: 'Lucas'
      },
      {
        type: 'communication',
        message: 'New message from Ms. Johnson',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        child: 'Emma'
      }
    ]
  }
}

async function getParentChildren(parentId: string) {
  return [
    {
      id: 'child1',
      name: 'Emma Rodriguez',
      grade: '10',
      school: 'secondary-school',
      schoolName: 'Stage Prep School',
      neurotype: 'ADHD',
      enrollmentType: 'onsite',
      status: 'active',
      currentGPA: 3.7,
      attendance: 96.2,
      recentProgress: {
        lessonsCompleted: 15,
        averageScore: 89,
        streak: 12,
        lastActivity: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
      }
    },
    {
      id: 'child2',
      name: 'Lucas Rodriguez',
      grade: '3',
      school: 'primary-school',
      schoolName: 'SuperHero School',
      neurotype: 'neurotypical',
      enrollmentType: 'hybrid',
      status: 'active',
      currentGPA: 'Exceeds Expectations',
      attendance: 98.5,
      recentProgress: {
        lessonsCompleted: 22,
        averageScore: 94,
        streak: 8,
        lastActivity: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
      }
    }
  ]
}

async function getSchoolCommunications(parentId: string) {
  return {
    messages: [
      {
        id: 'msg1',
        from: 'Ms. Johnson',
        fromRole: 'Theater Arts Teacher',
        subject: 'Emma\'s Outstanding Performance',
        content: 'I wanted to share how impressed I am with Emma\'s dedication to her theater studies.',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        read: false,
        childName: 'Emma'
      }
    ],
    announcements: [
      {
        id: 'ann1',
        title: 'Spring Theater Production Auditions',
        content: 'Auditions for our spring production will be held next Tuesday.',
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        school: 'secondary-school'
      }
    ]
  }
}

async function generateProgressReports(parentId: string) {
  const children = await getParentChildren(parentId)
  
  return children.map(child => ({
    childId: child.id,
    childName: child.name,
    reportPeriod: 'Fall 2025 - Quarter 1',
    generatedDate: new Date().toISOString(),
    academicPerformance: {
      overallGrade: child.currentGPA,
      subjects: [
        { name: 'Mathematics', grade: 'A-', points: 450, improvement: '+12%' },
        { name: 'English/Literature', grade: 'A', points: 480, improvement: '+8%' },
        { name: 'Theater Arts', grade: 'A+', points: 500, improvement: '+20%' }
      ]
    }
  }))
}

async function updateParentPreferences(parentId: string, preferences: any) {
  return {
    parentId,
    preferences: {
      communicationMethod: preferences.communicationMethod || 'email',
      language: preferences.language || 'English',
      notifications: preferences.notifications || {
        grades: true,
        attendance: true,
        events: true
      }
    },
    updatedAt: new Date().toISOString()
  }
}

async function requestTeacherConference(parentId: string, data: any) {
  return {
    conferenceId: `CONF_${Date.now()}`,
    parentId,
    teacherId: data.teacherId,
    childId: data.childId,
    topic: data.topic || 'General progress discussion',
    status: 'requested',
    requestedAt: new Date().toISOString()
  }
}

async function submitSchoolFeedback(parentId: string, data: any) {
  return {
    feedbackId: `FB_${Date.now()}`,
    parentId,
    subject: data.subject,
    message: data.message,
    submittedAt: new Date().toISOString(),
    status: 'submitted'
  }
}