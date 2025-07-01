import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // In a real implementation, you would:
    // 1. Invalidate the refresh token
    // 2. Add the access token to a blacklist
    // 3. Clear authentication cookies

    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully.'
    });

    // Clear the refresh token cookie
    response.cookies.set('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0, // Expire immediately
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error.',
        code: 'SERVER_ERROR'
      },
      { status: 500 }
    );
  }
}