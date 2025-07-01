import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { storage } from '../../../../server/storage'
import { insertUserSchema } from '../../../../shared/schema'
import { z } from 'zod'

const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(8),
  neurodivergentSupport: z.array(z.string()).optional(),
  learningPreferences: z.array(z.string()).optional(),
  parentLanguage: z.string().optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = registerSchema.parse(body)
    
    // Check if user already exists
    const existingUser = await storage.getUserByEmail(validatedData.email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    const existingUsername = await storage.getUserByUsername(validatedData.username)
    if (existingUsername) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12)

    // Create user
    const user = await storage.createUser({
      email: validatedData.email,
      username: validatedData.username,
      password: hashedPassword,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      role: validatedData.role || 'student',
      gradeLevel: validatedData.gradeLevel,
      schoolProgram: validatedData.schoolProgram,
      neurodivergentSupport: validatedData.neurodivergentSupport || [],
      learningPreferences: validatedData.learningPreferences || [],
      accommodations: [],
      parentLanguage: validatedData.parentLanguage || 'en',
      isActive: true
    })

    // Create student profile if student
    if (user.role === 'student') {
      await storage.createStudentProfile({
        userId: user.id,
        assessmentData: {},
        learningGoals: [],
        strengthsIdentified: [],
        challengeAreas: [],
        preferredActivities: [],
        sensoryNeeds: {},
        motivationFactors: []
      })
    }

    // Remove password from response
    const { password, ...userResponse } = user

    return NextResponse.json({
      success: true,
      user: userResponse,
      message: 'Account created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Registration error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    )
  }
}