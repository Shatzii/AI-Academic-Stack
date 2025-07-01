/**
 * Authentication Routes
 * 
 * Provides secure authentication endpoints for the AI Education Platform:
 * - User login with JWT tokens
 * - Token refresh
 * - User logout
 * - Password reset
 * - User registration for different roles
 */

const express = require('express');
const rateLimit = require('express-rate-limit');
const AuthenticationService = require('../services/auth-service');

const router = express.Router();
const authService = new AuthenticationService();

// Rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs for auth endpoints
  message: {
    success: false,
    error: 'Too many authentication attempts. Please try again later.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs for general endpoints
  standardHeaders: true,
  legacyHeaders: false,
});

// Mock database functions - replace with actual database calls
const mockUsers = new Map([
  ['admin@demo-school.com', {
    id: 'user_001',
    email: 'admin@demo-school.com',
    passwordHash: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewqyA1m7FJ3ESdru', // 'password123'
    firstName: 'Jane',
    lastName: 'Administrator',
    role: 'school_admin',
    schoolId: 'demo-school',
    permissions: ['all']
  }],
  ['teacher@demo-school.com', {
    id: 'user_002',
    email: 'teacher@demo-school.com',
    passwordHash: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewqyA1m7FJ3ESdru', // 'password123'
    firstName: 'John',
    lastName: 'Teacher',
    role: 'teacher',
    schoolId: 'demo-school',
    permissions: ['view_students', 'create_content', 'view_analytics']
  }],
  ['student@demo-school.com', {
    id: 'user_003',
    email: 'student@demo-school.com',
    passwordHash: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewqyA1m7FJ3ESdru', // 'password123'
    firstName: 'Alice',
    lastName: 'Student',
    role: 'student',
    schoolId: 'demo-school',
    permissions: ['view_courses', 'submit_assignments', 'access_ai_tutors']
  }]
]);

// Mock database functions
async function getUserByEmail(email) {
  return mockUsers.get(email) || null;
}

async function getUserById(id) {
  for (const user of mockUsers.values()) {
    if (user.id === id) {
      return user;
    }
  }
  return null;
}

async function createUser(userData) {
  const userId = `user_${Date.now()}`;
  const hashedPassword = await authService.hashPassword(userData.password);
  
  const newUser = {
    id: userId,
    email: userData.email,
    passwordHash: hashedPassword,
    firstName: userData.firstName,
    lastName: userData.lastName,
    role: userData.role || 'student',
    schoolId: userData.schoolId,
    permissions: userData.permissions || [],
    createdAt: new Date().toISOString()
  };
  
  mockUsers.set(userData.email, newUser);
  return newUser;
}

/**
 * POST /api/auth/login
 * Authenticate user and return JWT tokens
 */
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required.',
        code: 'MISSING_CREDENTIALS'
      });
    }

    // Authenticate user
    const result = await authService.authenticateUser(email, password, getUserByEmail);

    if (!result.success) {
      return res.status(401).json(result);
    }

    // Set refresh token as HTTP-only cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Return access token and user info
    res.json({
      success: true,
      user: result.user,
      accessToken: result.accessToken,
      expiresIn: result.expiresIn
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error.',
      code: 'SERVER_ERROR'
    });
  }
});

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 */
router.post('/refresh', generalLimiter, async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: 'Refresh token required.',
        code: 'NO_REFRESH_TOKEN'
      });
    }

    const result = await authService.refreshAccessToken(refreshToken, getUserById);

    if (!result.success) {
      // Clear invalid refresh token cookie
      res.clearCookie('refreshToken');
      return res.status(401).json(result);
    }

    res.json({
      success: true,
      accessToken: result.accessToken,
      expiresIn: result.expiresIn
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error.',
      code: 'SERVER_ERROR'
    });
  }
});

/**
 * POST /api/auth/logout
 * Logout user and invalidate refresh token
 */
router.post('/logout', (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    
    if (refreshToken) {
      authService.logout(refreshToken);
    }

    res.clearCookie('refreshToken');
    
    res.json({
      success: true,
      message: 'Logged out successfully.'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error.',
      code: 'SERVER_ERROR'
    });
  }
});

/**
 * POST /api/auth/register
 * Register new user (restricted to admins)
 */
router.post('/register', authService.requireAuth(['school_admin', 'super_admin']), async (req, res) => {
  try {
    const { email, password, firstName, lastName, role, schoolId } = req.body;

    // Validate input
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required.',
        code: 'MISSING_FIELDS'
      });
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'User with this email already exists.',
        code: 'USER_EXISTS'
      });
    }

    // Validate role
    const validRoles = ['student', 'teacher', 'parent', 'school_admin'];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid role specified.',
        code: 'INVALID_ROLE'
      });
    }

    // Create user
    const newUser = await createUser({
      email,
      password,
      firstName,
      lastName,
      role: role || 'student',
      schoolId: schoolId || req.user.schoolId
    });

    // Remove password hash from response
    const { passwordHash, ...userResponse } = newUser;

    res.status(201).json({
      success: true,
      user: userResponse,
      message: 'User created successfully.'
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error.',
      code: 'SERVER_ERROR'
    });
  }
});

/**
 * GET /api/auth/me
 * Get current user information
 */
router.get('/me', authService.requireAuth(), async (req, res) => {
  try {
    const user = await getUserById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found.',
        code: 'USER_NOT_FOUND'
      });
    }

    // Remove password hash from response
    const { passwordHash, ...userResponse } = user;

    res.json({
      success: true,
      user: userResponse
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error.',
      code: 'SERVER_ERROR'
    });
  }
});

/**
 * GET /api/auth/security-events
 * Get recent security events (admin only)
 */
router.get('/security-events', authService.requireAuth(['school_admin', 'super_admin']), (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const events = authService.getRecentSecurityEvents(limit);

    res.json({
      success: true,
      events
    });

  } catch (error) {
    console.error('Security events error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error.',
      code: 'SERVER_ERROR'
    });
  }
});

/**
 * POST /api/auth/change-password
 * Change user password
 */
router.post('/change-password', authService.requireAuth(), async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Current password and new password are required.',
        code: 'MISSING_PASSWORDS'
      });
    }

    const user = await getUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found.',
        code: 'USER_NOT_FOUND'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await authService.verifyPassword(currentPassword, user.passwordHash);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Current password is incorrect.',
        code: 'INVALID_CURRENT_PASSWORD'
      });
    }

    // Hash new password
    const newPasswordHash = await authService.hashPassword(newPassword);
    
    // Update user password (in real implementation, update database)
    user.passwordHash = newPasswordHash;
    mockUsers.set(user.email, user);

    authService.logSecurityEvent('PASSWORD_CHANGED', { userId: user.id });

    res.json({
      success: true,
      message: 'Password changed successfully.'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error.',
      code: 'SERVER_ERROR'
    });
  }
});

module.exports = router;