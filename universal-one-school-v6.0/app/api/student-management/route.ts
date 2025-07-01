import { NextRequest, NextResponse } from 'next/server'
import { storage } from '../../../server/storage'

// Integrated with main storage system
const getStudentData = async () => {
  const students = await storage.getEnrollmentStudents()
  const stats = {
    totalStudents: students.length,
    paidStudents: students.filter(s => s.tuitionPaid).length,
    freeUsers: students.filter(s => !s.tuitionPaid).length,
    onsiteStudents: students.filter(s => s.enrollmentType === 'onsite').length,
    onlineStudents: students.filter(s => s.enrollmentType === 'online_premium' || s.enrollmentType === 'online_free').length,
    hybridStudents: students.filter(s => s.enrollmentType === 'hybrid').length,
    monthlyRevenue: students.filter(s => s.tuitionPaid).length * 1800, // Estimated
    activeSubscriptions: students.filter(s => s.subscriptionStatus === 'active').length
  }
  return { students, stats }
}

const mockStudentData = {
  students: [
    {
      id: '1',
      firstName: 'Emma',
      lastName: 'Johnson',
      email: 'emma.j@email.com',
      gradeLevel: '7',
      enrollmentType: 'onsite',
      accessLevel: 'full',
      subscriptionStatus: 'active',
      tuitionPaid: true,
      paymentMethod: 'annual',
      schoolId: 'secondary',
      lastLogin: new Date('2025-01-22'),
      monthlyUsage: { aiTutorSessions: 15, virtualClassrooms: 8, liveAttendance: 20 }
    },
    {
      id: '2',
      firstName: 'Marcus',
      lastName: 'Chen',
      email: 'marcus.chen@email.com',
      gradeLevel: '5',
      enrollmentType: 'online_premium',
      accessLevel: 'premium',
      subscriptionStatus: 'active',
      tuitionPaid: true,
      paymentMethod: 'monthly',
      schoolId: 'primary',
      lastLogin: new Date('2025-01-23'),
      monthlyUsage: { aiTutorSessions: 32, virtualClassrooms: 12, liveAttendance: 15 }
    },
    {
      id: '3',
      firstName: 'Sarah',
      lastName: 'Williams',
      email: 'sarah.w@email.com',
      gradeLevel: 'Adult',
      enrollmentType: 'online_free',
      accessLevel: 'basic',
      subscriptionStatus: 'inactive',
      tuitionPaid: false,
      schoolId: 'law',
      lastLogin: new Date('2025-01-20'),
      monthlyUsage: { aiTutorSessions: 3, virtualClassrooms: 1, liveAttendance: 0 }
    },
    {
      id: '4',
      firstName: 'David',
      lastName: 'Rodriguez',
      email: 'david.r@email.com',
      gradeLevel: '10',
      enrollmentType: 'hybrid',
      accessLevel: 'full',
      subscriptionStatus: 'active',
      tuitionPaid: true,
      paymentMethod: 'semester',
      schoolId: 'secondary',
      lastLogin: new Date('2025-01-23'),
      monthlyUsage: { aiTutorSessions: 18, virtualClassrooms: 6, liveAttendance: 25 }
    },
    {
      id: '5',
      firstName: 'Aisha',
      lastName: 'Patel',
      email: 'aisha.p@email.com',
      gradeLevel: '3',
      enrollmentType: 'online_free',
      accessLevel: 'trial',
      subscriptionStatus: 'trial',
      tuitionPaid: false,
      schoolId: 'primary',
      lastLogin: new Date('2025-01-21'),
      monthlyUsage: { aiTutorSessions: 2, virtualClassrooms: 1, liveAttendance: 0 }
    }
  ],
  stats: {
    totalStudents: 247,
    paidStudents: 189,
    freeUsers: 58,
    onsiteStudents: 82,
    onlineStudents: 134,
    hybridStudents: 31,
    monthlyRevenue: 47850,
    activeSubscriptions: 189
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filter = searchParams.get('filter')
    const school = searchParams.get('school')
    
    // Use integrated storage system
    const { students, stats } = await getStudentData()
    let filteredStudents = students
    
    if (filter && filter !== 'all') {
      filteredStudents = filteredStudents.filter(student => {
        switch (filter) {
          case 'paid':
            return student.tuitionPaid
          case 'free':
            return !student.tuitionPaid
          case 'onsite':
            return student.enrollmentType === 'onsite'
          case 'online':
            return student.enrollmentType === 'online_premium' || student.enrollmentType === 'online_free'
          default:
            return true
        }
      })
    }
    
    if (school && school !== 'all') {
      filteredStudents = filteredStudents.filter(student => student.schoolId === school)
    }

    return NextResponse.json({
      students: filteredStudents,
      stats
    })
  } catch (error) {
    console.error('Student Management API Error:', error)
    return NextResponse.json({ error: 'Failed to fetch student data' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, studentId, ...data } = await request.json()
    
    switch (action) {
      case 'updateAccess':
        return updateStudentAccess(studentId, data)
      case 'trackUsage':
        return trackFeatureUsage(studentId, data)
      case 'updatePayment':
        return updatePaymentStatus(studentId, data)
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Student Management POST Error:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}

async function updateStudentAccess(studentId: string, accessData: any) {
  // In production, update database
  return NextResponse.json({ 
    success: true,
    message: 'Student access updated successfully'
  })
}

async function trackFeatureUsage(studentId: string, usageData: any) {
  // In production, log usage to database
  return NextResponse.json({
    success: true,
    message: 'Usage tracked successfully'
  })
}

async function updatePaymentStatus(studentId: string, paymentData: any) {
  // In production, update payment status
  return NextResponse.json({
    success: true,
    message: 'Payment status updated'
  })
}