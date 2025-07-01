import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Return demo user for development
    const user = {
      id: 'demo_student',
      username: 'demo_student',
      email: 'student@example.com',
      firstName: 'Demo',
      lastName: 'Student',
      role: 'student',
      enrollmentType: 'premium',
      neurotype: 'neurotypical'
    };
    
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}