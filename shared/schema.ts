import {
  pgTable,
  text,
  varchar,
  timestamp,
  integer,
  boolean,
  jsonb,
  decimal,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  username: varchar("username").unique().notNull(),
  password: varchar("password").notNull(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("student"),
  enrollmentType: varchar("enrollment_type").default("free"),
  neurotype: varchar("neurotype"),
  learningPreferences: jsonb("learning_preferences"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Student progress tracking
export const studentProgress = pgTable("student_progress", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").notNull(),
  schoolId: varchar("school_id").notNull(),
  courseId: varchar("course_id"),
  completedLessons: integer("completed_lessons").default(0),
  totalLessons: integer("total_lessons").default(0),
  currentLevel: integer("current_level").default(1),
  points: integer("points").default(0),
  streakDays: integer("streak_days").default(0),
  lastActivity: timestamp("last_activity"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Courses and curriculum
export const courses = pgTable("courses", {
  id: varchar("id").primaryKey().notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  schoolId: varchar("school_id").notNull(),
  gradeLevel: varchar("grade_level"),
  subject: varchar("subject"),
  difficulty: varchar("difficulty").default("beginner"),
  estimatedHours: integer("estimated_hours"),
  neurodivergentAdaptations: jsonb("neurodivergent_adaptations"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Lessons within courses
export const lessons = pgTable("lessons", {
  id: varchar("id").primaryKey().notNull(),
  courseId: varchar("course_id").notNull(),
  title: varchar("title").notNull(),
  content: text("content"),
  order: integer("order").notNull(),
  type: varchar("type").default("text"), // text, video, interactive, assessment
  duration: integer("duration"), // in minutes
  objectives: jsonb("objectives"),
  resources: jsonb("resources"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Student assessments and grades
export const assessments = pgTable("assessments", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").notNull(),
  courseId: varchar("course_id").notNull(),
  lessonId: varchar("lesson_id"),
  type: varchar("type").notNull(), // quiz, assignment, project, exam
  title: varchar("title").notNull(),
  score: decimal("score", { precision: 5, scale: 2 }),
  maxScore: decimal("max_score", { precision: 5, scale: 2 }),
  feedback: text("feedback"),
  submittedAt: timestamp("submitted_at"),
  gradedAt: timestamp("graded_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Social Media Accounts for monitoring
export const socialMediaAccounts = pgTable("social_media_accounts", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").notNull(),
  platform: varchar("platform").notNull(), // instagram, tiktok, snapchat, discord, etc.
  platformUserId: varchar("platform_user_id").notNull(),
  username: varchar("username").notNull(),
  displayName: varchar("display_name"),
  profileUrl: varchar("profile_url"),
  isMonitored: boolean("is_monitored").default(true),
  parentalConsentGiven: boolean("parental_consent_given").default(false),
  riskLevel: varchar("risk_level").default("low"), // low, medium, high, critical
  lastActivity: timestamp("last_activity"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Social Media Activity monitoring
export const socialMediaActivity = pgTable("social_media_activity", {
  id: varchar("id").primaryKey().notNull(),
  accountId: varchar("account_id").notNull(),
  activityType: varchar("activity_type").notNull(), // post, comment, message, interaction
  content: text("content"),
  contentHash: varchar("content_hash"), // For privacy-preserving storage
  riskScore: integer("risk_score").default(0), // 0-100
  threatCategories: jsonb("threat_categories"), // array of detected threats
  involvedUsers: jsonb("involved_users"), // other users in the interaction
  metadata: jsonb("metadata"), // platform-specific data
  analyzed: boolean("analyzed").default(false),
  flaggedForReview: boolean("flagged_for_review").default(false),
  timestamp: timestamp("timestamp").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Security Alerts and Incidents
export const securityAlerts = pgTable("security_alerts", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").notNull(),
  schoolId: varchar("school_id").notNull(),
  alertType: varchar("alert_type").notNull(), // cyberbullying, predator_risk, inappropriate_content, etc.
  severity: varchar("severity").notNull(), // low, medium, high, critical
  title: varchar("title").notNull(),
  description: text("description"),
  evidence: jsonb("evidence"), // screenshots, messages, metadata
  riskScore: integer("risk_score").notNull(),
  status: varchar("status").default("active"), // active, investigating, resolved, false_positive
  assignedTo: varchar("assigned_to"), // counselor, administrator, etc.
  parentNotified: boolean("parent_notified").default(false),
  lawEnforcementNotified: boolean("law_enforcement_notified").default(false),
  autoResolved: boolean("auto_resolved").default(false),
  resolutionNotes: text("resolution_notes"),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Threat Analysis Results
export const threatAnalysis = pgTable("threat_analysis", {
  id: varchar("id").primaryKey().notNull(),
  activityId: varchar("activity_id").notNull(),
  analysisType: varchar("analysis_type").notNull(), // content, behavioral, pattern
  aiModel: varchar("ai_model").notNull(), // claude-4, gpt-4o, etc.
  threatTypes: jsonb("threat_types"), // array of detected threat types
  confidence: decimal("confidence", { precision: 5, scale: 4 }), // 0.0000-1.0000
  details: jsonb("details"), // detailed analysis results
  recommendations: jsonb("recommendations"), // suggested actions
  reviewRequired: boolean("review_required").default(false),
  reviewedBy: varchar("reviewed_by"),
  reviewNotes: text("review_notes"),
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Parental Controls and Settings
export const parentalControls = pgTable("parental_controls", {
  id: varchar("id").primaryKey().notNull(),
  studentId: varchar("student_id").notNull(),
  parentId: varchar("parent_id").notNull(),
  monitoringEnabled: boolean("monitoring_enabled").default(true),
  alertLevel: varchar("alert_level").default("medium"), // low, medium, high, immediate
  allowedPlatforms: jsonb("allowed_platforms"), // array of permitted platforms
  timeRestrictions: jsonb("time_restrictions"), // usage time limits
  contentFilters: jsonb("content_filters"), // content filtering settings
  emergencyContacts: jsonb("emergency_contacts"), // emergency notification list
  lastReviewDate: timestamp("last_review_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Predictive Analytics Data
export const predictiveAnalytics = pgTable("predictive_analytics", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").notNull(),
  predictionType: varchar("prediction_type").notNull(), // cyberbullying, self_harm, academic_crisis, etc.
  timeframe: varchar("timeframe").notNull(), // 24h, 48h, 72h
  probability: decimal("probability", { precision: 5, scale: 4 }), // 0.0000-1.0000
  riskFactors: jsonb("risk_factors"), // contributing factors
  indicators: jsonb("indicators"), // behavioral indicators
  preventiveActions: jsonb("preventive_actions"), // recommended interventions
  interventionTriggered: boolean("intervention_triggered").default(false),
  interventionType: varchar("intervention_type"), // counseling, parent_contact, etc.
  outcome: varchar("outcome"), // prevented, occurred, monitoring
  accuracy: decimal("accuracy", { precision: 5, scale: 4 }), // post-prediction accuracy score
  modelVersion: varchar("model_version").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Compliance Tracking
export const complianceEvents = pgTable("compliance_events", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id"),
  schoolId: varchar("school_id").notNull(),
  eventType: varchar("event_type").notNull(), // coppa_consent, ferpa_access, gdpr_request, etc.
  regulation: varchar("regulation").notNull(), // COPPA, FERPA, GDPR, etc.
  description: text("description"),
  metadata: jsonb("metadata"), // regulation-specific data
  status: varchar("status").default("pending"), // pending, completed, failed
  evidenceStored: boolean("evidence_stored").default(false),
  auditTrail: jsonb("audit_trail"), // compliance audit information
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// AI interactions and chat history
export const aiInteractions = pgTable("ai_interactions", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").notNull(),
  agentType: varchar("agent_type").notNull(), // dean_wonder, dean_sterling, professor_barrett, etc.
  messageType: varchar("message_type").default("chat"), // chat, tutoring, assessment
  userMessage: text("user_message"),
  aiResponse: text("ai_response"),
  context: jsonb("context"),
  sessionId: varchar("session_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// School enrollment and management
export const schoolEnrollments = pgTable("school_enrollments", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").notNull(),
  schoolId: varchar("school_id").notNull(),
  enrollmentType: varchar("enrollment_type").notNull(), // onsite, online_premium, online_free, hybrid
  status: varchar("status").default("active"), // active, inactive, graduated, withdrawn
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  tuitionPaid: decimal("tuition_paid", { precision: 10, scale: 2 }),
  specialAccommodations: jsonb("special_accommodations"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Texas graduation tracking
export const graduationTracking = pgTable("graduation_tracking", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").notNull(),
  graduationYear: integer("graduation_year"),
  creditsEarned: decimal("credits_earned", { precision: 4, scale: 2 }).default("0"),
  creditsRequired: decimal("credits_required", { precision: 4, scale: 2 }).default("26"),
  endorsementType: varchar("endorsement_type"), // arts_humanities, business_industry, etc.
  ccmrIndicators: jsonb("ccmr_indicators"),
  staarScores: jsonb("staar_scores"),
  onTrackForGraduation: boolean("on_track_for_graduation").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Parent/guardian relationships
export const parentGuardians = pgTable("parent_guardians", {
  id: varchar("id").primaryKey().notNull(),
  parentUserId: varchar("parent_user_id").notNull(),
  studentUserId: varchar("student_user_id").notNull(),
  relationship: varchar("relationship").notNull(), // parent, guardian, mentor
  permissions: jsonb("permissions"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Content library for educational resources
export const contentLibrary = pgTable("content_library", {
  id: varchar("id").primaryKey().notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  type: varchar("type").notNull(), // video, article, interactive, game
  subject: varchar("subject"),
  gradeLevel: varchar("grade_level"),
  difficulty: varchar("difficulty").default("beginner"),
  url: varchar("url"),
  thumbnailUrl: varchar("thumbnail_url"),
  duration: integer("duration"), // in minutes
  tags: jsonb("tags"),
  neurodivergentAdaptations: jsonb("neurodivergent_adaptations"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Create insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertStudentProgressSchema = createInsertSchema(studentProgress).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLessonSchema = createInsertSchema(lessons).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAssessmentSchema = createInsertSchema(assessments).omit({
  id: true,
  createdAt: true,
});

export const insertEnrollmentSchema = createInsertSchema(schoolEnrollments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContentLibrarySchema = createInsertSchema(contentLibrary).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Cybersecurity Insert Schemas
export const insertSocialMediaAccountSchema = createInsertSchema(socialMediaAccounts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSocialMediaActivitySchema = createInsertSchema(socialMediaActivity).omit({
  id: true,
  createdAt: true,
});

export const insertSecurityAlertSchema = createInsertSchema(securityAlerts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertThreatAnalysisSchema = createInsertSchema(threatAnalysis).omit({
  id: true,
  createdAt: true,
});

export const insertParentalControlsSchema = createInsertSchema(parentalControls).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPredictiveAnalyticsSchema = createInsertSchema(predictiveAnalytics).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertComplianceEventSchema = createInsertSchema(complianceEvents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type StudentProgress = typeof studentProgress.$inferSelect;
export type InsertStudentProgress = z.infer<typeof insertStudentProgressSchema>;
export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type Assessment = typeof assessments.$inferSelect;
export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type SchoolEnrollment = typeof schoolEnrollments.$inferSelect;
export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;
export type GraduationTracking = typeof graduationTracking.$inferSelect;
export type ParentGuardian = typeof parentGuardians.$inferSelect;
export type ContentLibrary = typeof contentLibrary.$inferSelect;
export type InsertContentLibrary = z.infer<typeof insertContentLibrarySchema>;

// Cybersecurity Types
export type SocialMediaAccount = typeof socialMediaAccounts.$inferSelect;
export type InsertSocialMediaAccount = z.infer<typeof insertSocialMediaAccountSchema>;
export type SocialMediaActivity = typeof socialMediaActivity.$inferSelect;
export type InsertSocialMediaActivity = z.infer<typeof insertSocialMediaActivitySchema>;
export type SecurityAlert = typeof securityAlerts.$inferSelect;
export type InsertSecurityAlert = z.infer<typeof insertSecurityAlertSchema>;
export type ThreatAnalysis = typeof threatAnalysis.$inferSelect;
export type InsertThreatAnalysis = z.infer<typeof insertThreatAnalysisSchema>;
export type ParentalControls = typeof parentalControls.$inferSelect;
export type InsertParentalControls = z.infer<typeof insertParentalControlsSchema>;
export type PredictiveAnalytics = typeof predictiveAnalytics.$inferSelect;
export type InsertPredictiveAnalytics = z.infer<typeof insertPredictiveAnalyticsSchema>;
export type ComplianceEvent = typeof complianceEvents.$inferSelect;
export type InsertComplianceEvent = z.infer<typeof insertComplianceEventSchema>;