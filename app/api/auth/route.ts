import { NextRequest, NextResponse } from 'next/server'
import { storage } from '../../../server/storage'
import { insertUserSchema } from '../../../shared/schema'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, username, password, email, firstName, lastName, role, neurotype } = body

    if (action === 'login') {
      if (!username || !password) {
        return NextResponse.json({ error: 'Username and password required' }, { status: 400 })
      }

      const user = await storage.getUserByUsername(username)
      if (!user) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }

      // For demo purposes, check if it's a demo user with simple password
      let isValidPassword = false
      if ((username === 'demo_student' || username === 'demo_teacher' || username === 'demo_parent') && password === 'password') {
        isValidPassword = true
      } else if (user.password === 'password') {
        // Direct password check for demo users
        isValidPassword = password === 'password'
      } else {
        // Use bcrypt for other users
        isValidPassword = await bcrypt.compare(password, user.password)
      }
      
      if (!isValidPassword) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }

      // Return user without password
      const { password: _, ...userWithoutPassword } = user
      return NextResponse.json(userWithoutPassword)
    }

    if (action === 'register') {
      if (!username || !password) {
        return NextResponse.json({ error: 'Username and password required' }, { status: 400 })
      }

      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username)
      if (existingUser) {
        return NextResponse.json({ error: 'Username already exists' }, { status: 409 })
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12)

      // Create user
      const userData = {
        username,
        password: hashedPassword,
        email: email || null,
        firstName: firstName || null,
        lastName: lastName || null,
        role: role || 'student',
        neurotype: neurotype || null,
        profileImageUrl: null,
        enrollmentType: 'free',
        learningPreferences: {}
      }

      const user = await storage.createUser(userData)

      // Return user without password
      const { password: _, ...userWithoutPassword } = user
      return NextResponse.json(userWithoutPassword, { status: 201 })
    }



    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}