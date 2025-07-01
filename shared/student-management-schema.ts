import { pgTable, text, varchar, timestamp, boolean, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Student enrollment types and access levels
export const students = pgTable("students", {
  id: varchar("id").primaryKey().notNull(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  email: varchar("email").unique().notNull(),
  parentEmail: varchar("parent_email"),
  gradeLevel: varchar("grade_level").notNull(),
  enrollmentType: varchar("enrollment_type").notNull(), // 'onsite', 'online_premium', 'online_free', 'hybrid'
  accessLevel: varchar("access_level").notNull(), // 'full', 'premium', 'basic', 'trial'
  subscriptionStatus: varchar("subscription_status").notNull(), // 'active', 'inactive', 'trial', 'cancelled'
  tuitionPaid: boolean("tuition_paid").default(false),
  paymentMethod: varchar("payment_method"), // 'monthly', 'semester', 'annual', 'grant', 'scholarship'
  schoolId: varchar("school_id").notNull(), // 'primary', 'secondary', 'law', 'language'
  neurodivergentSupport: jsonb("neurodivergent_support").$type<string[]>().default([]),
  enrollmentDate: timestamp("enrollment_date").defaultNow(),
  lastLogin: timestamp("last_login"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Access permissions and feature availability
export const accessPermissions = pgTable("access_permissions", {
  id: varchar("id").primaryKey().notNull(),
  studentId: varchar("student_id").notNull(),
  featureName: varchar("feature_name").notNull(), // 'ai_tutor', 'virtual_classroom', 'content_creator', etc.
  accessLevel: varchar("access_level").notNull(), // 'full', 'limited', 'none'
  usageLimit: integer("usage_limit"), // daily/monthly limits for free users
  usageCount: integer("usage_count").default(0),
  resetDate: timestamp("reset_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Live session attendance tracking
export const sessionAttendance = pgTable("session_attendance", {
  id: varchar("id").primaryKey().notNull(),
  studentId: varchar("student_id").notNull(),
  sessionId: varchar("session_id").notNull(),
  sessionType: varchar("session_type").notNull(), // 'live_class', 'tutoring', 'virtual_classroom'
  attendanceType: varchar("attendance_type").notNull(), // 'onsite', 'livestream', 'recording'
  joinTime: timestamp("join_time"),
  leaveTime: timestamp("leave_time"),
  duration: integer("duration"), // minutes
  participationScore: integer("participation_score"), // 1-10
  createdAt: timestamp("created_at").defaultNow(),
});

// Payment and billing tracking
export const billingRecords = pgTable("billing_records", {
  id: varchar("id").primaryKey().notNull(),
  studentId: varchar("student_id").notNull(),
  amount: integer("amount").notNull(), // in cents
  currency: varchar("currency").default("USD"),
  paymentType: varchar("payment_type").notNull(), // 'tuition', 'premium_features', 'materials'
  paymentStatus: varchar("payment_status").notNull(), // 'paid', 'pending', 'failed', 'refunded'
  billingPeriod: varchar("billing_period"), // 'monthly', 'semester', 'annual'
  dueDate: timestamp("due_date"),
  paidDate: timestamp("paid_date"),
  paymentMethod: varchar("payment_method"), // 'card', 'bank', 'scholarship', 'grant'
  stripePaymentId: varchar("stripe_payment_id"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Feature usage analytics
export const featureUsage = pgTable("feature_usage", {
  id: varchar("id").primaryKey().notNull(),
  studentId: varchar("student_id").notNull(),
  featureName: varchar("feature_name").notNull(),
  usageType: varchar("usage_type").notNull(), // 'session_start', 'completion', 'time_spent'
  sessionDuration: integer("session_duration"), // minutes
  metadata: jsonb("metadata").$type<Record<string, any>>(),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Teacher assignment and access
export const teacherAssignments = pgTable("teacher_assignments", {
  id: varchar("id").primaryKey().notNull(),
  teacherId: varchar("teacher_id").notNull(),
  studentId: varchar("student_id").notNull(),
  subject: varchar("subject"),
  assignmentType: varchar("assignment_type").notNull(), // 'primary', 'tutoring', 'support'
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Zod schemas for validation
export const insertStudentSchema = createInsertSchema(students).extend({
  email: z.string().email(),
  enrollmentType: z.enum(['onsite', 'online_premium', 'online_free', 'hybrid']),
  accessLevel: z.enum(['full', 'premium', 'basic', 'trial']),
  subscriptionStatus: z.enum(['active', 'inactive', 'trial', 'cancelled']),
  schoolId: z.enum(['primary', 'secondary', 'law', 'language']),
  gradeLevel: z.string(),
});

export const insertAccessPermissionSchema = createInsertSchema(accessPermissions);
export const insertSessionAttendanceSchema = createInsertSchema(sessionAttendance);
export const insertBillingRecordSchema = createInsertSchema(billingRecords);
export const insertFeatureUsageSchema = createInsertSchema(featureUsage);

// Types
export type Student = typeof students.$inferSelect;
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type AccessPermission = typeof accessPermissions.$inferSelect;
export type SessionAttendance = typeof sessionAttendance.$inferSelect;
export type BillingRecord = typeof billingRecords.$inferSelect;
export type FeatureUsage = typeof featureUsage.$inferSelect;
export type TeacherAssignment = typeof teacherAssignments.$inferSelect;

// Enrollment type definitions
export const ENROLLMENT_TYPES = {
  onsite: {
    label: 'On-Site Student',
    description: 'Full access to campus facilities and in-person classes',
    features: ['all_features', 'teacher_access', 'campus_access', 'materials']
  },
  online_premium: {
    label: 'Online Premium Student',
    description: 'Full online access with live teacher interaction',
    features: ['all_ai_features', 'live_sessions', 'teacher_access', 'priority_support']
  },
  online_free: {
    label: 'Online Basic Access',
    description: 'Limited access to AI features and recorded content',
    features: ['limited_ai', 'recorded_sessions', 'basic_support']
  },
  hybrid: {
    label: 'Hybrid Student',
    description: 'Combination of on-site and online learning',
    features: ['all_features', 'teacher_access', 'flexible_attendance']
  }
} as const;

export const ACCESS_LEVELS = {
  full: {
    label: 'Full Access',
    aiTutorSessions: -1, // unlimited
    virtualClassrooms: -1,
    contentCreation: -1,
    teacherSupport: true
  },
  premium: {
    label: 'Premium Access',
    aiTutorSessions: 50, // per month
    virtualClassrooms: 20,
    contentCreation: 10,
    teacherSupport: true
  },
  basic: {
    label: 'Basic Access',
    aiTutorSessions: 5, // per month
    virtualClassrooms: 3,
    contentCreation: 1,
    teacherSupport: false
  },
  trial: {
    label: 'Trial Access',
    aiTutorSessions: 3, // total
    virtualClassrooms: 1,
    contentCreation: 0,
    teacherSupport: false
  }
} as const;