import { NextRequest, NextResponse } from 'next/server'
import { storage } from '../../../server/storage'

export async function POST(request: NextRequest) {
  try {
    const enrollmentData = await request.json()
    
    // Create student record in the integrated system
    const newStudent = await storage.createEnrollmentStudent({
      id: `student_${Date.now()}`,
      firstName: enrollmentData.firstName,
      lastName: enrollmentData.lastName,
      email: enrollmentData.email,
      parentEmail: enrollmentData.parentEmail,
      gradeLevel: enrollmentData.gradeLevel,
      enrollmentType: enrollmentData.studentType,
      accessLevel: getAccessLevelForEnrollmentType(enrollmentData.studentType),
      subscriptionStatus: enrollmentData.studentType === 'online_free' ? 'inactive' : 'active',
      tuitionPaid: enrollmentData.studentType !== 'online_free',
      paymentMethod: enrollmentData.paymentPlan,
      schoolId: enrollmentData.schoolId,
      neurodivergentSupport: enrollmentData.neurodivergentSupport || [],
      enrollmentDate: new Date(),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    // Create access permissions based on enrollment type
    await createAccessPermissions(newStudent.id, enrollmentData.studentType)

    // For paid students, create AI license if applicable
    if (enrollmentData.studentType !== 'online_free') {
      await createAILicenseForStudent(newStudent.id, enrollmentData)
    }

    // Send enrollment confirmation (in production, this would send an email)
    console.log(`Enrollment confirmation sent to ${enrollmentData.email}`)

    return NextResponse.json({
      success: true,
      message: 'Enrollment submitted successfully',
      studentId: newStudent.id,
      enrollmentType: enrollmentData.studentType,
      accessLevel: newStudent.accessLevel,
      nextSteps: getNextStepsForEnrollmentType(enrollmentData.studentType)
    })

  } catch (error) {
    console.error('Enrollment API Error:', error)
    return NextResponse.json({ 
      error: 'Failed to process enrollment',
      details: error.message 
    }, { status: 500 })
  }
}

function getAccessLevelForEnrollmentType(enrollmentType: string): string {
  switch (enrollmentType) {
    case 'onsite':
      return 'full'
    case 'online_premium':
      return 'premium'
    case 'hybrid':
      return 'full'
    case 'online_free':
    default:
      return 'basic'
  }
}

async function createAccessPermissions(studentId: string, enrollmentType: string) {
  const permissions = {
    'onsite': {
      'ai_tutor': { accessLevel: 'full', usageLimit: -1 },
      'virtual_classroom': { accessLevel: 'full', usageLimit: -1 },
      'content_creator': { accessLevel: 'full', usageLimit: -1 },
      'study_buddy': { accessLevel: 'full', usageLimit: -1 },
      'analytics': { accessLevel: 'full', usageLimit: -1 },
      'teacher_access': { accessLevel: 'full', usageLimit: -1 }
    },
    'online_premium': {
      'ai_tutor': { accessLevel: 'full', usageLimit: 50 },
      'virtual_classroom': { accessLevel: 'full', usageLimit: 20 },
      'content_creator': { accessLevel: 'full', usageLimit: 10 },
      'study_buddy': { accessLevel: 'full', usageLimit: -1 },
      'analytics': { accessLevel: 'full', usageLimit: -1 },
      'teacher_access': { accessLevel: 'full', usageLimit: -1 }
    },
    'hybrid': {
      'ai_tutor': { accessLevel: 'full', usageLimit: -1 },
      'virtual_classroom': { accessLevel: 'full', usageLimit: -1 },
      'content_creator': { accessLevel: 'full', usageLimit: -1 },
      'study_buddy': { accessLevel: 'full', usageLimit: -1 },
      'analytics': { accessLevel: 'full', usageLimit: -1 },
      'teacher_access': { accessLevel: 'full', usageLimit: -1 }
    },
    'online_free': {
      'ai_tutor': { accessLevel: 'limited', usageLimit: 5 },
      'virtual_classroom': { accessLevel: 'limited', usageLimit: 3 },
      'content_creator': { accessLevel: 'none', usageLimit: 0 },
      'study_buddy': { accessLevel: 'limited', usageLimit: 5 },
      'analytics': { accessLevel: 'basic', usageLimit: -1 },
      'teacher_access': { accessLevel: 'none', usageLimit: 0 }
    }
  }

  const studentPermissions = permissions[enrollmentType] || permissions['online_free']
  
  // In production, create permission records in database
  for (const [feature, permission] of Object.entries(studentPermissions)) {
    console.log(`Creating permission for ${studentId}: ${feature} - ${permission.accessLevel}`)
  }
}

async function createAILicenseForStudent(studentId: string, enrollmentData: any) {
  const licenseType = getLicenseTypeForEnrollment(enrollmentData.studentType, enrollmentData.paymentPlan)
  
  const licenseData = {
    studentId,
    licenseType,
    engineVersion: '2.4.1',
    purchaseDate: new Date(),
    expirationDate: calculateExpirationDate(licenseType),
    isActive: true,
    maxActivations: getMaxActivationsForType(enrollmentData.studentType),
    allowedFeatures: getFeaturesForEnrollmentType(enrollmentData.studentType),
    restrictedAfterExpiry: licenseType !== 'lifetime'
  }

  const license = await storage.createAILicense(licenseData)
  console.log(`AI License created for student ${studentId}: ${license.licenseKey}`)
  
  return license
}

function getLicenseTypeForEnrollment(enrollmentType: string, paymentPlan: string): string {
  if (enrollmentType === 'online_free') return 'trial'
  
  switch (paymentPlan) {
    case 'annual':
      return 'annual'
    case 'semester':
      return 'semester'
    default:
      return 'semester'
  }
}

function calculateExpirationDate(licenseType: string): Date {
  const now = new Date()
  switch (licenseType) {
    case 'semester':
      return new Date(now.getTime() + (6 * 30 * 24 * 60 * 60 * 1000)) // 6 months
    case 'annual':
      return new Date(now.getTime() + (365 * 24 * 60 * 60 * 1000)) // 1 year
    case 'lifetime':
      return new Date('2099-12-31')
    case 'trial':
    default:
      return new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000)) // 30 days
  }
}

function getMaxActivationsForType(enrollmentType: string): number {
  switch (enrollmentType) {
    case 'onsite':
    case 'hybrid':
      return 2
    case 'online_premium':
      return 1
    case 'online_free':
    default:
      return 1
  }
}

function getFeaturesForEnrollmentType(enrollmentType: string): string[] {
  switch (enrollmentType) {
    case 'onsite':
    case 'hybrid':
      return ['full_ai', 'content_generation', 'tutoring', 'analytics', 'teacher_access']
    case 'online_premium':
      return ['full_ai', 'content_generation', 'tutoring', 'analytics']
    case 'online_free':
    default:
      return ['basic_ai', 'limited_tutoring']
  }
}

function getNextStepsForEnrollmentType(enrollmentType: string): string[] {
  switch (enrollmentType) {
    case 'onsite':
      return [
        'Complete health and emergency contact forms',
        'Schedule campus orientation',
        'Receive AI engine installation package',
        'Meet with assigned teachers and support staff'
      ]
    case 'online_premium':
      return [
        'Download and install AI learning engine',
        'Schedule virtual orientation session',
        'Connect with assigned teachers',
        'Access premium learning materials'
      ]
    case 'hybrid':
      return [
        'Choose your on-campus schedule (2-3 days)',
        'Complete health forms for campus access',
        'Install AI learning engine',
        'Schedule hybrid orientation session'
      ]
    case 'online_free':
    default:
      return [
        'Verify email address to activate account',
        'Complete learning style assessment',
        'Access basic AI learning tools',
        'Explore available educational content'
      ]
  }
}