import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  schoolAccess: string[];
  learningProfile?: {
    type: 'dyslexia' | 'adhd' | 'autism' | 'typical';
    adaptations: string[];
  };
  createdAt: Date;
  lastLoginAt?: Date;
}

interface AuthTokenPayload {
  userId: string;
  username: string;
  role: string;
  schoolAccess: string[];
  iat: number;
  exp: number;
}

export class UnifiedAuthService {
  private jwtSecret: string;
  private refreshSecret: string;
  private tokenExpiry: string;
  private refreshExpiry: string;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'universal-one-school-secret';
    this.refreshSecret = process.env.REFRESH_SECRET || 'universal-one-school-refresh';
    this.tokenExpiry = process.env.TOKEN_EXPIRY || '1h';
    this.refreshExpiry = process.env.REFRESH_EXPIRY || '7d';
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  generateAccessToken(user: User): string {
    const payload: Omit<AuthTokenPayload, 'iat' | 'exp'> = {
      userId: user.id,
      username: user.username,
      role: user.role,
      schoolAccess: user.schoolAccess
    };

    return jwt.sign(payload, this.jwtSecret, { 
      expiresIn: this.tokenExpiry,
      issuer: 'universal-one-school',
      audience: 'school-platform'
    });
  }

  generateRefreshToken(userId: string): string {
    return jwt.sign(
      { userId, type: 'refresh' },
      this.refreshSecret,
      { 
        expiresIn: this.refreshExpiry,
        issuer: 'universal-one-school'
      }
    );
  }

  verifyAccessToken(token: string): AuthTokenPayload | null {
    try {
      return jwt.verify(token, this.jwtSecret) as AuthTokenPayload;
    } catch (error) {
      return null;
    }
  }

  verifyRefreshToken(token: string): { userId: string } | null {
    try {
      const payload = jwt.verify(token, this.refreshSecret) as any;
      if (payload.type === 'refresh') {
        return { userId: payload.userId };
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  requireAuth = (allowedRoles?: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No valid authorization token provided' });
      }

      const token = authHeader.substring(7);
      const payload = this.verifyAccessToken(token);

      if (!payload) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }

      if (allowedRoles && !allowedRoles.includes(payload.role)) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      req.user = {
        id: payload.userId,
        username: payload.username,
        role: payload.role,
        schoolAccess: payload.schoolAccess
      };

      next();
    };
  };

  requireSchoolAccess = (schoolId: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const user = req.user;
      
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      if (user.role === 'admin') {
        return next();
      }

      if (!user.schoolAccess.includes(schoolId) && !user.schoolAccess.includes('all')) {
        return res.status(403).json({ error: `Access denied to ${schoolId}` });
      }

      next();
    };
  };

  generateSessionTokens(user: User): { accessToken: string; refreshToken: string } {
    return {
      accessToken: this.generateAccessToken(user),
      refreshToken: this.generateRefreshToken(user.id)
    };
  }

  hasPermission(user: any, action: string, resource?: string): boolean {
    if (user.role === 'admin') return true;

    const permissions: Record<string, string[]> = {
      'teacher': [
        'view_student_progress',
        'create_assignments',
        'grade_assignments',
        'manage_curriculum'
      ],
      'student': [
        'view_own_progress',
        'submit_assignments',
        'access_curriculum'
      ]
    };

    const userPermissions = permissions[user.role] || [];
    return userPermissions.includes(action);
  }

  extractUser(req: Request): any | null {
    return req.user || null;
  }
}

export const authService = new UnifiedAuthService();

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username: string;
        role: string;
        schoolAccess: string[];
      };
    }
  }
}