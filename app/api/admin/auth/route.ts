import { NextRequest, NextResponse } from 'next/server';

// SpacePharaoh Admin Credentials (In production, these would be stored securely)
const ADMIN_CREDENTIALS = {
  master_admin: {
    username: 'spacepharaoh',
    password: 'SpacePharaoh_Master_2025!',
    access: 'Full platform control',
    role: 'super_admin',
    permissions: ['platform_management', 'all_schools_access', 'user_management']
  },
  school_admins: {
    superhero_school: {
      username: 'hero_admin',
      password: 'HeroAdmin_2025!',
      access: 'SuperHero School (K-6) management',
      role: 'school_admin',
      school: 'superhero_school'
    },
    stage_prep_school: {
      username: 'stage_admin',
      password: 'StageAdmin_2025!',
      access: 'Stage Prep School (7-12) management',
      role: 'school_admin',
      school: 'stage_prep_school'
    },
    lawyer_makers: {
      username: 'law_admin',
      password: 'LawAdmin_2025!',
      access: 'Law School management',
      role: 'school_admin',
      school: 'lawyer_makers'
    },
    global_language_academy: {
      username: 'language_admin',
      password: 'LinguaAdmin_2025!',
      access: 'Language Academy management',
      role: 'school_admin',
      school: 'global_language_academy'
    }
  }
};

function authenticateAdmin(username: string, password: string) {
  // Check master admin
  if (username === ADMIN_CREDENTIALS.master_admin.username && 
      password === ADMIN_CREDENTIALS.master_admin.password) {
    return {
      success: true,
      user: ADMIN_CREDENTIALS.master_admin,
      message: 'SpacePharaoh master authentication successful'
    };
  }

  // Check school admins
  for (const [schoolKey, admin] of Object.entries(ADMIN_CREDENTIALS.school_admins)) {
    if (username === admin.username && password === admin.password) {
      return {
        success: true,
        user: admin,
        message: `${admin.access} authentication successful`
      };
    }
  }

  return {
    success: false,
    message: 'Invalid credentials'
  };
}

export async function POST(request: NextRequest) {
  try {
    const { username, password, action = 'login' } = await request.json();

    if (action === 'login') {
      const result = authenticateAdmin(username, password);
      
      if (result.success) {
        const response = NextResponse.json({
          success: true,
          user: result.user,
          message: result.message
        });

        // Set secure HTTP-only cookie
        response.cookies.set('admin_token', result.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        return response;
      } else {
        return NextResponse.json({
          success: false,
          message: result.message
        }, { status: 401 });
      }
    }

    if (action === 'verify') {
      const token = request.cookies.get('admin_token')?.value;
      
      if (!token) {
        return NextResponse.json({
          success: false,
          message: 'No authentication token found'
        }, { status: 401 });
      }

      const verification = spacePharaohAuth.verifyToken(token);
      
      if (verification.valid) {
        return NextResponse.json({
          success: true,
          user: verification.payload,
          message: 'Token valid'
        });
      } else {
        return NextResponse.json({
          success: false,
          message: 'Invalid or expired token'
        }, { status: 401 });
      }
    }

    if (action === 'logout') {
      const response = NextResponse.json({
        success: true,
        message: 'Logged out successfully'
      });

      response.cookies.delete('admin_token');
      return response;
    }

    return NextResponse.json({
      success: false,
      message: 'Invalid action'
    }, { status: 400 });

  } catch (error) {
    console.error('Admin auth error:', error);
    return NextResponse.json({
      success: false,
      message: 'Authentication system error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action');

    if (action === 'credentials') {
      return NextResponse.json(ADMIN_CREDENTIALS);
    }

    if (action === 'admins') {
      const adminsList = [
        {
          username: 'spacepharaoh',
          role: 'super_admin',
          school: 'All Schools',
          access: 'Full platform control'
        },
        ...Object.values(ADMIN_CREDENTIALS.school_admins).map(admin => ({
          username: admin.username,
          role: admin.role,
          school: admin.school,
          access: admin.access
        }))
      ];
      return NextResponse.json(adminsList);
    }

    return NextResponse.json({
      message: 'SpacePharaoh Admin Authentication System',
      endpoints: [
        'POST /api/admin/auth - Login, verify, logout',
        'GET /api/admin/auth?action=credentials - Get login credentials',
        'GET /api/admin/auth?action=admins - Get all admin accounts'
      ]
    });

  } catch (error) {
    console.error('Admin auth GET error:', error);
    return NextResponse.json({
      success: false,
      message: 'Error retrieving admin information'
    }, { status: 500 });
  }
}