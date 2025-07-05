// Global type definitions for Universal One School

export interface School {
  id: string;
  name: string;
  description: string;
  grades: string;
  theme: string;
  features: string[];
  enrollment: number;
  aiModel: string;
  status: 'active' | 'inactive';
  campus: string;
  tuition: number;
  language: string;
}

export interface AIHealth {
  status: 'healthy' | 'unhealthy';
  models: string[];
  responseTime: number;
  timestamp: string;
  version: string;
}

export interface AIModel {
  name: string;
  description: string;
  school: string;
  status: 'active' | 'inactive';
  responseTime: number;
}

export interface EnrollmentData {
  studentName: string;
  parentName: string;
  email: string;
  phone: string;
  schoolId: string;
  grade: string;
  tier: 'free' | 'online' | 'hybrid' | 'onsite';
  specialNeeds: string[];
  parentLanguage: string;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'parent' | 'teacher' | 'admin';
  schoolId?: string;
  createdAt: Date;
}

export interface StudentProgress {
  studentId: string;
  schoolId: string;
  grade: string;
  completedLessons: number;
  totalLessons: number;
  averageScore: number;
  learningStreak: number;
  lastActivity: Date;
}

export interface AIGenerationRequest {
  query: string;
  school: string;
  grade?: string;
  specialNeeds?: string[];
  language?: string;
}

export interface AIGenerationResponse {
  content: string;
  model: string;
  responseTime: number;
  timestamp: string;
  school: string;
}

// Express.js augmentation
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}