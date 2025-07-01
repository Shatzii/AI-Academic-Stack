import { randomBytes, scrypt, timingSafeEqual } from 'crypto'
import { promisify } from 'util'
import {
  users,
  studentProgress,
  courses,
  lessons,
  assessments,
  schoolEnrollments,
  graduationTracking,
  type User,
  type InsertUser,
  type StudentProgress,
  type InsertStudentProgress,
  type Course,
  type InsertCourse,
  type Lesson,
  type InsertLesson,
  type Assessment,
  type InsertAssessment,
  type SchoolEnrollment,
  type InsertEnrollment,
  type GraduationTracking,
} from '../shared/schema'

const scryptAsync = promisify(scrypt)

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>
  getUserByEmail(email: string): Promise<User | undefined>
  getUserByUsername(username: string): Promise<User | undefined>
  createUser(user: InsertUser): Promise<User>
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>
  deleteUser(id: string): Promise<boolean>
  getAllUsers(): Promise<User[]>
  
  // Authentication
  hashPassword(password: string): Promise<string>
  verifyPassword(password: string, hash: string): Promise<boolean>
  
  // Student progress tracking
  getStudentProgress(userId: string, schoolId?: string): Promise<StudentProgress[]>
  createStudentProgress(progress: InsertStudentProgress): Promise<StudentProgress>
  updateStudentProgress(id: string, updates: Partial<StudentProgress>): Promise<StudentProgress | undefined>
  
  // Courses and curriculum
  getCourses(schoolId?: string): Promise<Course[]>
  getCourse(id: string): Promise<Course | undefined>
  createCourse(course: InsertCourse): Promise<Course>
  updateCourse(id: string, updates: Partial<Course>): Promise<Course | undefined>
  getCurricula(schoolId?: string, gradeLevel?: string): Promise<any[]>
  
  // Lessons
  getLessons(courseId: string): Promise<Lesson[]>
  getLesson(id: string): Promise<Lesson | undefined>
  createLesson(lesson: InsertLesson): Promise<Lesson>
  
  // Assessments
  getAssessments(userId?: string, courseId?: string): Promise<Assessment[]>
  createAssessment(assessment: InsertAssessment): Promise<Assessment>
  
  // School enrollments
  getEnrollments(userId: string): Promise<SchoolEnrollment[]>
  createEnrollment(enrollment: InsertEnrollment): Promise<SchoolEnrollment>
  
  // Graduation tracking
  getGraduationTracking(userId: string): Promise<GraduationTracking | undefined>
  updateGraduationTracking(userId: string, updates: Partial<GraduationTracking>): Promise<GraduationTracking | undefined>
  
  // Additional methods for API compatibility
  getAchievements(userId?: string): Promise<any[]>
  getTeachers(schoolId?: string, subject?: string): Promise<any[]>
  createTeacherProfile(profile: any): Promise<any>
  updateTeacherProfile(id: string, updates: any): Promise<any>
  
  // Cybersecurity and social media monitoring
  getSocialMediaAccounts(userId?: string): Promise<any[]>
  createSocialMediaAccount(account: any): Promise<any>
  updateSocialMediaAccount(id: string, updates: any): Promise<any>
  deleteSocialMediaAccount(id: string): Promise<boolean>
  getSecurityAlerts(userId?: string, severity?: string): Promise<any[]>
  createSecurityAlert(alert: any): Promise<any>
  updateSecurityAlert(id: string, updates: any): Promise<any>
  getThreatAnalysis(activityId?: string): Promise<any[]>
  createThreatAnalysis(analysis: any): Promise<any>
  getSocialMediaActivity(accountId?: string, limit?: number): Promise<any[]>
  createSocialMediaActivity(activity: any): Promise<any>
  getParentalControls(userId: string): Promise<any>
  updateParentalControls(userId: string, controls: any): Promise<any>
  getNotificationSettings(userId: string): Promise<any>
  updateNotificationSettings(userId: string, settings: any): Promise<any>
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map()
  private studentProgress: Map<string, StudentProgress> = new Map()
  private courses: Map<string, Course> = new Map()
  private lessons: Map<string, Lesson> = new Map()
  private assessments: Map<string, Assessment> = new Map()
  private enrollments: Map<string, SchoolEnrollment> = new Map()
  private graduationTracking: Map<string, GraduationTracking> = new Map()

  constructor() {
    // Initialize synchronously with simple demo data first
    this.initializeDemoUser()
    // Then do async seeding
    this.seedData().catch(console.error)
  }

  private initializeDemoUser() {
    // Add demo users immediately with simple password for testing
    const demoUsers: User[] = [
      {
        id: 'demo_student',
        username: 'demo_student',
        email: 'demo@example.com',
        password: 'password',
        firstName: 'Demo',
        lastName: 'Student',
        role: 'student',
        enrollmentType: 'premium',
        neurotype: 'neurotypical',
        learningPreferences: {},
        profileImageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'demo_teacher',
        username: 'demo_teacher',
        email: 'teacher@example.com',
        password: 'password',
        firstName: 'Demo',
        lastName: 'Teacher',
        role: 'teacher',
        enrollmentType: 'staff',
        neurotype: 'neurotypical',
        learningPreferences: {},
        profileImageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'demo_parent',
        username: 'demo_parent',
        email: 'parent@example.com',
        password: 'password',
        firstName: 'Demo',
        lastName: 'Parent',
        role: 'parent',
        enrollmentType: 'family',
        neurotype: 'neurotypical',
        learningPreferences: {},
        profileImageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]
    
    demoUsers.forEach(user => this.users.set(user.id, user))
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9)
  }

  async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString('hex')
    const buf = (await scryptAsync(password, salt, 64)) as Buffer
    return `${buf.toString('hex')}.${salt}`
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    const [hashed, salt] = hash.split('.')
    const hashedBuf = Buffer.from(hashed, 'hex')
    const suppliedBuf = (await scryptAsync(password, salt, 64)) as Buffer
    return timingSafeEqual(hashedBuf, suppliedBuf)
  }

  // User management
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id)
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email)
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username)
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.generateId()
    const newUser: User = {
      id,
      username: user.username,
      email: user.email || null,
      password: user.password,
      firstName: user.firstName || null,
      lastName: user.lastName || null,
      profileImageUrl: user.profileImageUrl || null,
      role: user.role || null,
      enrollmentType: user.enrollmentType || null,
      neurotype: user.neurotype || null,
      learningPreferences: user.learningPreferences || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.users.set(id, newUser)
    return newUser
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id)
    if (!user) return undefined
    
    const updatedUser = { ...user, ...updates, updatedAt: new Date() }
    this.users.set(id, updatedUser)
    return updatedUser
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.users.delete(id)
  }

  // Student progress
  async getStudentProgress(userId: string, schoolId?: string): Promise<StudentProgress[]> {
    const progress = Array.from(this.studentProgress.values()).filter(p => 
      p.userId === userId && (!schoolId || p.schoolId === schoolId)
    )
    return progress
  }

  async createStudentProgress(progress: InsertStudentProgress): Promise<StudentProgress> {
    const id = this.generateId()
    const newProgress: StudentProgress = {
      id,
      userId: progress.userId,
      schoolId: progress.schoolId,
      courseId: progress.courseId || null,
      completedLessons: progress.completedLessons || null,
      totalLessons: progress.totalLessons || null,
      currentLevel: progress.currentLevel || null,
      points: progress.points || null,
      streakDays: progress.streakDays || null,
      lastActivity: progress.lastActivity || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.studentProgress.set(id, newProgress)
    return newProgress
  }

  async updateStudentProgress(id: string, updates: Partial<StudentProgress>): Promise<StudentProgress | undefined> {
    const progress = this.studentProgress.get(id)
    if (!progress) return undefined
    
    const updatedProgress = { ...progress, ...updates, updatedAt: new Date() }
    this.studentProgress.set(id, updatedProgress)
    return updatedProgress
  }

  // Courses
  async getCourses(schoolId?: string): Promise<Course[]> {
    const allCourses = Array.from(this.courses.values())
    return schoolId ? allCourses.filter(c => c.schoolId === schoolId) : allCourses
  }

  async getCourse(id: string): Promise<Course | undefined> {
    return this.courses.get(id)
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const id = this.generateId()
    const newCourse: Course = {
      id,
      title: course.title,
      description: course.description || null,
      schoolId: course.schoolId,
      gradeLevel: course.gradeLevel || null,
      subject: course.subject || null,
      difficulty: course.difficulty || null,
      estimatedHours: course.estimatedHours || null,
      neurodivergentAdaptations: course.neurodivergentAdaptations || null,
      isActive: course.isActive !== undefined ? course.isActive : true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.courses.set(id, newCourse)
    return newCourse
  }

  async updateCourse(id: string, updates: Partial<Course>): Promise<Course | undefined> {
    const course = this.courses.get(id)
    if (!course) return undefined
    
    const updatedCourse = { ...course, ...updates, updatedAt: new Date() }
    this.courses.set(id, updatedCourse)
    return updatedCourse
  }

  // Lessons
  async getLessons(courseId: string): Promise<Lesson[]> {
    return Array.from(this.lessons.values()).filter(l => l.courseId === courseId)
  }

  async getLesson(id: string): Promise<Lesson | undefined> {
    return this.lessons.get(id)
  }

  async createLesson(lesson: InsertLesson): Promise<Lesson> {
    const id = this.generateId()
    const newLesson: Lesson = {
      id,
      courseId: lesson.courseId,
      title: lesson.title,
      content: lesson.content || null,
      order: lesson.order,
      type: lesson.type || null,
      duration: lesson.duration || null,
      objectives: lesson.objectives || null,
      resources: lesson.resources || null,
      isActive: lesson.isActive !== undefined ? lesson.isActive : true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.lessons.set(id, newLesson)
    return newLesson
  }

  // Assessments
  async getAssessments(userId?: string, courseId?: string): Promise<Assessment[]> {
    const allAssessments = Array.from(this.assessments.values())
    return allAssessments.filter(a => 
      (!userId || a.userId === userId) && 
      (!courseId || a.courseId === courseId)
    )
  }

  async createAssessment(assessment: InsertAssessment): Promise<Assessment> {
    const id = this.generateId()
    const newAssessment: Assessment = {
      id,
      userId: assessment.userId,
      courseId: assessment.courseId,
      lessonId: assessment.lessonId || null,
      type: assessment.type,
      title: assessment.title,
      score: assessment.score || null,
      maxScore: assessment.maxScore || null,
      feedback: assessment.feedback || null,
      submittedAt: assessment.submittedAt || null,
      gradedAt: assessment.gradedAt || null,
      createdAt: new Date(),
    }
    this.assessments.set(id, newAssessment)
    return newAssessment
  }

  // School enrollments
  async getEnrollments(userId: string): Promise<SchoolEnrollment[]> {
    return Array.from(this.enrollments.values()).filter(e => e.userId === userId)
  }

  async createEnrollment(enrollment: InsertEnrollment): Promise<SchoolEnrollment> {
    const id = this.generateId()
    const newEnrollment: SchoolEnrollment = {
      id,
      userId: enrollment.userId,
      schoolId: enrollment.schoolId,
      enrollmentType: enrollment.enrollmentType,
      status: enrollment.status || null,
      startDate: enrollment.startDate,
      endDate: enrollment.endDate || null,
      tuitionPaid: enrollment.tuitionPaid || null,
      specialAccommodations: enrollment.specialAccommodations || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.enrollments.set(id, newEnrollment)
    return newEnrollment
  }

  // Graduation tracking
  async getGraduationTracking(userId: string): Promise<GraduationTracking | undefined> {
    return Array.from(this.graduationTracking.values()).find(g => g.userId === userId)
  }

  async updateGraduationTracking(userId: string, updates: Partial<GraduationTracking>): Promise<GraduationTracking | undefined> {
    const tracking = Array.from(this.graduationTracking.values()).find(g => g.userId === userId)
    if (!tracking) return undefined
    
    const updatedTracking = { ...tracking, ...updates, updatedAt: new Date() }
    this.graduationTracking.set(tracking.id, updatedTracking)
    return updatedTracking
  }

  // Missing methods for API compatibility
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values())
  }

  async getCurricula(schoolId?: string, gradeLevel?: string): Promise<any[]> {
    const curricula = [
      {
        id: 'curr1',
        schoolId: 'primary-school',
        name: 'SuperHero Math Adventures',
        gradeLevel: 'K-6',
        subject: 'Mathematics',
        description: 'Math curriculum with superhero themes and neurodivergent adaptations'
      },
      {
        id: 'curr2',
        schoolId: 'secondary-school',
        name: 'Theater Arts Integration',
        gradeLevel: '7-12',
        subject: 'Theater Arts',
        description: 'Comprehensive theater arts curriculum meeting Texas standards'
      },
      {
        id: 'curr3',
        schoolId: 'language-school',
        name: 'Global Language Immersion',
        gradeLevel: 'All',
        subject: 'World Languages',
        description: 'Multilingual curriculum with cultural immersion'
      },
      {
        id: 'curr4',
        schoolId: 'law-school',
        name: 'Legal Foundations',
        gradeLevel: 'Post-Secondary',
        subject: 'Law',
        description: 'Pre-law and legal studies curriculum'
      }
    ]
    
    return curricula.filter(c => 
      (!schoolId || c.schoolId === schoolId) && 
      (!gradeLevel || c.gradeLevel.includes(gradeLevel))
    )
  }

  async getAchievements(userId?: string): Promise<any[]> {
    const achievements = [
      {
        id: 'ach1',
        userId: userId || 'user1',
        type: 'academic',
        title: 'Math Hero',
        description: 'Completed 10 math lessons',
        badgeUrl: '/badges/math-hero.svg',
        earnedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        points: 100
      },
      {
        id: 'ach2',
        userId: userId || 'user1',
        type: 'social',
        title: 'Team Player',
        description: 'Helped 5 classmates',
        badgeUrl: '/badges/team-player.svg',
        earnedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        points: 50
      },
      {
        id: 'ach3',
        userId: userId || 'user1',
        type: 'creative',
        title: 'Theater Star',
        description: 'Performed in school production',
        badgeUrl: '/badges/theater-star.svg',
        earnedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        points: 200
      }
    ]
    
    return userId ? achievements.filter(a => a.userId === userId) : achievements
  }

  async getTeachers(schoolId?: string, subject?: string): Promise<any[]> {
    const teachers = [
      {
        id: 'teacher1',
        userId: 'user2',
        name: 'Ms. Johnson',
        schoolId: 'secondary-school',
        subjects: ['Theater Arts', 'English'],
        qualifications: ['M.A. Theater Arts', 'B.A. English Literature'],
        yearsExperience: 8,
        specializations: ['Neurodivergent Support', 'Performance Arts'],
        isActive: true
      },
      {
        id: 'teacher2',
        userId: 'user3',
        name: 'Mr. Davis',
        schoolId: 'primary-school',
        subjects: ['Mathematics', 'Science'],
        qualifications: ['M.Ed. Elementary Education', 'B.S. Mathematics'],
        yearsExperience: 12,
        specializations: ['ADHD Support', 'Visual Learning'],
        isActive: true
      },
      {
        id: 'teacher3',
        userId: 'user4',
        name: 'Dr. Martinez',
        schoolId: 'language-school',
        subjects: ['Spanish', 'French', 'ESL'],
        qualifications: ['Ph.D. Linguistics', 'M.A. Applied Linguistics'],
        yearsExperience: 15,
        specializations: ['Multilingual Education', 'Cultural Immersion'],
        isActive: true
      }
    ]
    
    return teachers.filter(t => 
      (!schoolId || t.schoolId === schoolId) && 
      (!subject || t.subjects.includes(subject))
    )
  }

  async createTeacherProfile(profile: any): Promise<any> {
    const id = this.generateId()
    const newProfile = {
      id,
      ...profile,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    return newProfile
  }

  async updateTeacherProfile(id: string, updates: any): Promise<any> {
    return {
      id,
      ...updates,
      updatedAt: new Date()
    }
  }

  private async seedData() {
    // Hash the demo password properly
    const demoPassword = await this.hashPassword('password')
    
    // Seed demo users
    const demoUsers = [
      {
        id: 'user1',
        username: 'demo_student',
        email: 'student@demo.com',
        password: demoPassword,
        firstName: 'Demo',
        lastName: 'Student',
        role: 'student',
        enrollmentType: 'online_premium',
        neurotype: 'ADHD',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'user2',
        username: 'demo_teacher',
        email: 'teacher@demo.com',
        password: demoPassword,
        firstName: 'Demo',
        lastName: 'Teacher',
        role: 'teacher',
        enrollmentType: 'staff',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]

    demoUsers.forEach(user => this.users.set(user.id, user as User))

    // Seed demo courses
    const demoCourses = [
      {
        id: 'course1',
        title: 'Superhero Math Adventures',
        description: 'Math for K-6 with superhero themes',
        schoolId: 'primary-school',
        gradeLevel: 'K-6',
        subject: 'Mathematics',
        difficulty: 'beginner',
        estimatedHours: 40,
        neurodivergentAdaptations: { dyslexia: true, adhd: true, autism: true },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'course2',
        title: 'Stage Performance Fundamentals',
        description: 'Introduction to theatrical performance',
        schoolId: 'secondary-school',
        gradeLevel: '7-12',
        subject: 'Theater Arts',
        difficulty: 'intermediate',
        estimatedHours: 60,
        neurodivergentAdaptations: { sensory: true, executive_function: true },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]

    demoCourses.forEach(course => this.courses.set(course.id, course as Course))

    // Seed cybersecurity demo data
    this.seedCybersecurityData()
  }

  private seedCybersecurityData() {
    // Demo social media accounts
    const demoAccounts = [
      {
        id: 'sm_account_1',
        userId: 'demo_student',
        platform: 'instagram',
        username: 'student_demo',
        displayName: 'Demo Student',
        isMonitored: true,
        riskLevel: 'low',
        parentalConsentGiven: true,
        lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'sm_account_2',
        userId: 'demo_student',
        platform: 'tiktok',
        username: 'demo_creative',
        displayName: 'Creative Demo',
        isMonitored: true,
        riskLevel: 'medium',
        parentalConsentGiven: true,
        lastActivity: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'sm_account_3',
        userId: 'demo_student',
        platform: 'discord',
        username: 'gamer_demo',
        displayName: 'Gaming Demo',
        isMonitored: false,
        riskLevel: 'high',
        parentalConsentGiven: false,
        lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    // Demo security alerts
    const demoAlerts = [
      {
        id: 'alert_1',
        userId: 'demo_student',
        schoolId: 'primary-school',
        alertType: 'inappropriate_content',
        severity: 'medium',
        title: 'Age-Inappropriate Content Detected',
        description: 'Content shared on Instagram may not be suitable for student age group. Parental review recommended.',
        evidence: {
          platform: 'instagram',
          content: 'Mature themed video shared',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000)
        },
        riskScore: 65,
        status: 'active',
        parentNotified: true,
        lawEnforcementNotified: false,
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000)
      },
      {
        id: 'alert_2',
        userId: 'demo_student',
        schoolId: 'primary-school',
        alertType: 'cyberbullying',
        severity: 'high',
        title: 'Potential Cyberbullying Activity',
        description: 'Repeated negative interactions detected on TikTok. Intervention may be needed.',
        evidence: {
          platform: 'tiktok',
          content: 'Multiple negative comments received',
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000)
        },
        riskScore: 78,
        status: 'active',
        parentNotified: true,
        lawEnforcementNotified: false,
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 8 * 60 * 60 * 1000)
      }
    ]

    // Demo social media activities
    const demoActivities = [
      {
        id: 'activity_1',
        accountId: 'sm_account_1',
        activityType: 'post',
        content: 'Had a great day at school! Working on my superhero math project 🦸‍♂️📚',
        riskScore: 15,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: 'activity_2',
        accountId: 'sm_account_2',
        activityType: 'comment',
        content: 'This dance is so cool! I want to try it too',
        riskScore: 25,
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
      },
      {
        id: 'activity_3',
        accountId: 'sm_account_1',
        activityType: 'message',
        content: 'Thanks for the homework help yesterday!',
        riskScore: 10,
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
      },
      {
        id: 'activity_4',
        accountId: 'sm_account_3',
        activityType: 'voice_chat',
        content: 'Gaming session with friends - discussing strategy',
        riskScore: 45,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
      }
    ]

    // Set demo data
    demoAccounts.forEach(account => this.socialMediaAccounts.set(account.id, account))
    demoAlerts.forEach(alert => this.securityAlerts.set(alert.id, alert))
    demoActivities.forEach(activity => this.socialMediaActivity.set(activity.id, activity))

    // Set default parental controls for demo student
    this.parentalControls.set('demo_student', {
      userId: 'demo_student',
      monitoringEnabled: true,
      alertLevel: 'medium',
      allowedPlatforms: ['instagram', 'youtube', 'tiktok'],
      timeRestrictions: true,
      lastReviewDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date()
    })

    // Set default notification settings for demo student
    this.notificationSettings.set('demo_student', {
      userId: 'demo_student',
      emailAlerts: true,
      smsAlerts: false,
      pushNotifications: true,
      alertLevel: 'medium',
      quietHours: {
        enabled: true,
        start: '22:00',
        end: '07:00'
      },
      emergencyContacts: [
        {
          name: 'Demo Parent',
          relationship: 'Parent',
          phone: '+1-555-0123',
          email: 'parent@example.com'
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    })
  }

  // Cybersecurity and Social Media Monitoring Implementation
  private socialMediaAccounts: Map<string, any> = new Map()
  private securityAlerts: Map<string, any> = new Map()
  private threatAnalysis: Map<string, any> = new Map()
  private socialMediaActivity: Map<string, any> = new Map()
  private parentalControls: Map<string, any> = new Map()
  private notificationSettings: Map<string, any> = new Map()

  async getSocialMediaAccounts(userId?: string): Promise<any[]> {
    const accounts = Array.from(this.socialMediaAccounts.values())
    if (userId) {
      return accounts.filter(account => account.userId === userId)
    }
    return accounts
  }

  async createSocialMediaAccount(account: any): Promise<any> {
    const id = account.id || `account_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const newAccount = {
      ...account,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    this.socialMediaAccounts.set(id, newAccount)
    return newAccount
  }

  async updateSocialMediaAccount(id: string, updates: any): Promise<any> {
    const account = this.socialMediaAccounts.get(id)
    if (!account) return undefined
    
    const updatedAccount = {
      ...account,
      ...updates,
      updatedAt: new Date()
    }
    this.socialMediaAccounts.set(id, updatedAccount)
    return updatedAccount
  }

  async deleteSocialMediaAccount(id: string): Promise<boolean> {
    return this.socialMediaAccounts.delete(id)
  }

  async getSecurityAlerts(userId?: string, severity?: string): Promise<any[]> {
    const alerts = Array.from(this.securityAlerts.values())
    let filtered = alerts
    
    if (userId) {
      filtered = filtered.filter(alert => alert.userId === userId)
    }
    
    if (severity) {
      filtered = filtered.filter(alert => alert.severity === severity)
    }
    
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  async createSecurityAlert(alert: any): Promise<any> {
    const id = alert.id || `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const newAlert = {
      ...alert,
      id,
      status: alert.status || 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    this.securityAlerts.set(id, newAlert)
    return newAlert
  }

  async updateSecurityAlert(id: string, updates: any): Promise<any> {
    const alert = this.securityAlerts.get(id)
    if (!alert) return undefined
    
    const updatedAlert = {
      ...alert,
      ...updates,
      updatedAt: new Date()
    }
    this.securityAlerts.set(id, updatedAlert)
    return updatedAlert
  }

  async getThreatAnalysis(activityId?: string): Promise<any[]> {
    const analyses = Array.from(this.threatAnalysis.values())
    if (activityId) {
      return analyses.filter(analysis => analysis.activityId === activityId)
    }
    return analyses
  }

  async createThreatAnalysis(analysis: any): Promise<any> {
    const id = analysis.id || `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const newAnalysis = {
      ...analysis,
      id,
      createdAt: new Date()
    }
    this.threatAnalysis.set(id, newAnalysis)
    return newAnalysis
  }

  async getSocialMediaActivity(accountId?: string, limit?: number): Promise<any[]> {
    const activities = Array.from(this.socialMediaActivity.values())
    let filtered = activities
    
    if (accountId) {
      filtered = filtered.filter(activity => activity.accountId === accountId)
    }
    
    // Sort by timestamp (newest first)
    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    
    if (limit) {
      filtered = filtered.slice(0, limit)
    }
    
    return filtered
  }

  async createSocialMediaActivity(activity: any): Promise<any> {
    const id = activity.id || `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const newActivity = {
      ...activity,
      id,
      timestamp: activity.timestamp || new Date(),
      createdAt: new Date()
    }
    this.socialMediaActivity.set(id, newActivity)
    return newActivity
  }

  async getParentalControls(userId: string): Promise<any> {
    return this.parentalControls.get(userId) || {
      userId,
      monitoringEnabled: true,
      alertLevel: 'medium',
      allowedPlatforms: ['instagram', 'youtube'],
      timeRestrictions: false,
      lastReviewDate: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  async updateParentalControls(userId: string, controls: any): Promise<any> {
    const existing = this.parentalControls.get(userId)
    const updated = {
      ...existing,
      ...controls,
      userId,
      updatedAt: new Date()
    }
    this.parentalControls.set(userId, updated)
    return updated
  }

  async getNotificationSettings(userId: string): Promise<any> {
    return this.notificationSettings.get(userId) || {
      userId,
      emailAlerts: true,
      smsAlerts: false,
      pushNotifications: true,
      alertLevel: 'medium',
      quietHours: {
        enabled: true,
        start: '22:00',
        end: '07:00'
      },
      emergencyContacts: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  async updateNotificationSettings(userId: string, settings: any): Promise<any> {
    const existing = this.notificationSettings.get(userId)
    const updated = {
      ...existing,
      ...settings,
      userId,
      updatedAt: new Date()
    }
    this.notificationSettings.set(userId, updated)
    return updated
  }
}

export const storage = new MemStorage()