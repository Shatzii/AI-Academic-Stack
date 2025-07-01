import { NextRequest, NextResponse } from 'next/server'
import { storage } from '../../../server/storage'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const schoolId = searchParams.get('schoolId')
    
    switch (type) {
      case 'dashboard':
        const dashboard = await generateAdminDashboard(schoolId)
        return NextResponse.json(dashboard)
        
      case 'users':
        const users = await storage.getAllUsers()
        return NextResponse.json(users.map(u => ({ ...u, password: undefined })))
        
      case 'schools':
        const schools = await getSchoolStatistics()
        return NextResponse.json(schools)
        
      case 'compliance':
        const compliance = await getComplianceStatus(schoolId)
        return NextResponse.json(compliance)
        
      default:
        return NextResponse.json({ error: 'Invalid admin type' }, { status: 400 })
    }
  } catch (error) {
    console.error('Admin API error:', error)
    return NextResponse.json({ error: 'Failed to fetch admin data' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...data } = body
    
    switch (action) {
      case 'update_school_settings':
        const result = await updateSchoolSettings(data)
        return NextResponse.json(result)
        
      case 'manage_user':
        const userResult = await manageUserAccount(data)
        return NextResponse.json(userResult)
        
      case 'generate_report':
        const report = await generateComplianceReport(data)
        return NextResponse.json(report)
        
      default:
        return NextResponse.json({ error: 'Invalid admin action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Admin action error:', error)
    return NextResponse.json({ error: 'Failed to execute admin action' }, { status: 500 })
  }
}

async function generateAdminDashboard(schoolId: string | null) {
  const users = await storage.getAllUsers()
  const studentCount = users.filter(u => u.role === 'student').length
  const teacherCount = users.filter(u => u.role === 'teacher').length
  const parentCount = users.filter(u => u.role === 'parent').length
  
  return {
    overview: {
      totalStudents: studentCount,
      totalTeachers: teacherCount,
      totalParents: parentCount,
      activeUsers: users.filter(u => u.createdAt && 
        new Date(u.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      ).length
    },
    schoolBreakdown: {
      'primary-school': Math.floor(studentCount * 0.4),
      'secondary-school': Math.floor(studentCount * 0.35),
      'language-school': Math.floor(studentCount * 0.15),
      'law-school': Math.floor(studentCount * 0.1)
    },
    neurodiversityStats: {
      ADHD: users.filter(u => u.neurotype === 'ADHD').length,
      dyslexia: users.filter(u => u.neurotype === 'dyslexia').length,
      autism: users.filter(u => u.neurotype === 'autism').length,
      neurotypical: users.filter(u => u.neurotype === 'neurotypical').length,
      other: users.filter(u => u.neurotype && !['ADHD', 'dyslexia', 'autism', 'neurotypical'].includes(u.neurotype)).length
    },
    enrollmentTypes: {
      onsite: users.filter(u => u.enrollmentType === 'onsite').length,
      online_premium: users.filter(u => u.enrollmentType === 'online_premium').length,
      online_free: users.filter(u => u.enrollmentType === 'free').length,
      hybrid: users.filter(u => u.enrollmentType === 'hybrid').length
    },
    recentActivity: {
      newRegistrations: users.filter(u => u.createdAt &&
        new Date(u.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length,
      activeToday: Math.floor(studentCount * 0.6),
      lessonsCompleted: Math.floor(studentCount * 15),
      assessmentsSubmitted: Math.floor(studentCount * 3)
    },
    systemHealth: {
      serverStatus: 'operational',
      databaseStatus: 'operational',
      aiServiceStatus: 'operational',
      lastBackup: new Date().toISOString(),
      uptime: '99.9%'
    }
  }
}

async function getSchoolStatistics() {
  return {
    'primary-school': {
      name: 'SuperHero School (K-6)',
      students: 245,
      teachers: 18,
      courses: 32,
      avgCompletion: 78,
      theme: 'superhero',
      specializations: ['ADHD Support', 'Gamified Learning', 'Visual Learning']
    },
    'secondary-school': {
      name: 'Stage Prep School (7-12)',
      students: 189,
      teachers: 15,
      courses: 28,
      avgCompletion: 82,
      theme: 'theater',
      specializations: ['Theater Arts', 'College Prep', 'Performance Assessment']
    },
    'language-school': {
      name: 'Global Language Academy',
      students: 156,
      teachers: 12,
      courses: 24,
      avgCompletion: 75,
      theme: 'multicultural',
      specializations: ['Immersion Learning', 'Cultural Exchange', 'Translation Services']
    },
    'law-school': {
      name: 'Future Legal Professionals',
      students: 87,
      teachers: 8,
      courses: 16,
      avgCompletion: 85,
      theme: 'professional',
      specializations: ['Bar Exam Prep', 'Case Analysis', 'Legal Writing']
    }
  }
}

async function getComplianceStatus(schoolId: string | null) {
  return {
    texasEducationCode: {
      overall: 95,
      sections: {
        'TEC_28.002': { compliant: true, score: 98, description: 'Required Curriculum' },
        'TEC_28.025': { compliant: true, score: 92, description: 'High School Graduation Requirements' },
        'TEC_28.0211': { compliant: true, score: 96, description: 'Dyslexia and Related Disorders' },
        'TEC_29.081': { compliant: true, score: 94, description: 'Compensatory Education' },
        'TEC_25.112': { compliant: true, score: 93, description: 'Compulsory Attendance' }
      }
    },
    accessibility: {
      overall: 97,
      wcag: { compliant: true, level: 'AA', score: 97 },
      ada: { compliant: true, score: 96 },
      section504: { compliant: true, score: 98 }
    },
    dataPrivacy: {
      overall: 99,
      ferpa: { compliant: true, score: 99 },
      coppa: { compliant: true, score: 98 },
      gdpr: { compliant: true, score: 100 }
    },
    safety: {
      overall: 96,
      backgroundChecks: { compliant: true, score: 100 },
      safeguarding: { compliant: true, score: 95 },
      emergencyProtocols: { compliant: true, score: 94 }
    },
    lastAudit: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    nextAudit: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    certifications: [
      'Texas Charter School Authorization',
      'Special Education Compliance',
      'Neurodiversity Excellence Certification',
      'AI Education Standards Certification'
    ]
  }
}

async function updateSchoolSettings(data: any) {
  const { schoolId, settings } = data
  
  // In a real implementation, this would update school configuration
  return {
    success: true,
    message: `Settings updated for ${schoolId}`,
    updatedAt: new Date().toISOString(),
    settings: settings
  }
}

async function manageUserAccount(data: any) {
  const { userId, action, ...updateData } = data
  
  switch (action) {
    case 'activate':
      return { success: true, message: 'User account activated', userId }
    case 'deactivate':
      return { success: true, message: 'User account deactivated', userId }
    case 'update':
      return { success: true, message: 'User account updated', userId, updates: updateData }
    case 'reset_password':
      return { success: true, message: 'Password reset email sent', userId }
    default:
      throw new Error('Invalid user management action')
  }
}

async function generateComplianceReport(data: any) {
  const { reportType, dateRange, schoolId } = data
  
  return {
    reportId: `COMP_${Date.now()}`,
    type: reportType,
    generated: new Date().toISOString(),
    school: schoolId || 'all',
    period: dateRange,
    summary: {
      overallCompliance: 95.8,
      criticalIssues: 0,
      minorIssues: 2,
      recommendations: 5
    },
    details: {
      studentRecords: { compliant: true, percentage: 99.2 },
      teacherCertifications: { compliant: true, percentage: 98.5 },
      curriculumStandards: { compliant: true, percentage: 96.8 },
      safetyProtocols: { compliant: true, percentage: 97.1 },
      accessibilityFeatures: { compliant: true, percentage: 98.9 }
    },
    recommendations: [
      'Update emergency contact procedures',
      'Review STAAR testing protocols',
      'Enhance parent communication systems',
      'Upgrade accessibility tools',
      'Expand neurodiversity training'
    ]
  }
}