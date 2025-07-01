import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  boolean,
  integer,
  decimal,
  date,
  uuid,
  serial
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enhanced User Management
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).unique(),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  role: varchar("role", { length: 50 }).notNull().default("student"), // student, teacher, parent, admin, nurse, counselor
  profileImageUrl: varchar("profile_image_url", { length: 500 }),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  emergencyContact: jsonb("emergency_contact"),
  preferences: jsonb("preferences"),
  isActive: boolean("is_active").default(true),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Student Information System
export const students = pgTable("students", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  studentId: varchar("student_id", { length: 20 }).unique().notNull(),
  dateOfBirth: date("date_of_birth"),
  grade: varchar("grade", { length: 10 }),
  school: varchar("school", { length: 50 }),
  enrollmentDate: date("enrollment_date"),
  graduationDate: date("graduation_date"),
  status: varchar("status", { length: 20 }).default("active"), // active, inactive, graduated, transferred
  medicalAlerts: jsonb("medical_alerts"),
  allergies: jsonb("allergies"),
  medications: jsonb("medications"),
  iepStatus: boolean("iep_status").default(false),
  section504Status: boolean("section_504_status").default(false),
  transportationNeeds: varchar("transportation_needs", { length: 100 }),
  lunchProgram: varchar("lunch_program", { length: 50 }),
  emergencyContacts: jsonb("emergency_contacts"),
  parentGuardians: jsonb("parent_guardians"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Staff Management
export const staff = pgTable("staff", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  employeeId: varchar("employee_id", { length: 20 }).unique().notNull(),
  department: varchar("department", { length: 100 }),
  position: varchar("position", { length: 100 }),
  hireDate: date("hire_date"),
  salary: decimal("salary", { precision: 10, scale: 2 }),
  certifications: jsonb("certifications"),
  qualifications: jsonb("qualifications"),
  schedule: jsonb("schedule"),
  isSubstituteEligible: boolean("is_substitute_eligible").default(false),
  emergencyContact: jsonb("emergency_contact"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Course Management
export const courses = pgTable("courses", {
  id: uuid("id").primaryKey().defaultRandom(),
  courseCode: varchar("course_code", { length: 20 }).unique().notNull(),
  courseName: varchar("course_name", { length: 200 }).notNull(),
  description: text("description"),
  grade: varchar("grade", { length: 10 }),
  subject: varchar("subject", { length: 100 }),
  credits: decimal("credits", { precision: 3, scale: 2 }),
  prerequisites: jsonb("prerequisites"),
  standards: jsonb("standards"), // Common Core, State Standards alignment
  neurodivergentAdaptations: jsonb("neurodivergent_adaptations"),
  accommodations: jsonb("accommodations"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Class Management
export const classes = pgTable("classes", {
  id: uuid("id").primaryKey().defaultRandom(),
  courseId: uuid("course_id").references(() => courses.id).notNull(),
  teacherId: uuid("teacher_id").references(() => users.id).notNull(),
  className: varchar("class_name", { length: 200 }).notNull(),
  semester: varchar("semester", { length: 20 }),
  academicYear: varchar("academic_year", { length: 10 }),
  schedule: jsonb("schedule"), // days, times, room
  maxStudents: integer("max_students"),
  currentEnrollment: integer("current_enrollment").default(0),
  room: varchar("room", { length: 50 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Student Enrollment
export const enrollments = pgTable("enrollments", {
  id: uuid("id").primaryKey().defaultRandom(),
  studentId: uuid("student_id").references(() => students.id).notNull(),
  classId: uuid("class_id").references(() => classes.id).notNull(),
  enrollmentDate: date("enrollment_date").defaultNow(),
  dropDate: date("drop_date"),
  grade: varchar("grade", { length: 5 }),
  status: varchar("status", { length: 20 }).default("active"),
  accommodations: jsonb("accommodations"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Assignment Management
export const assignments = pgTable("assignments", {
  id: uuid("id").primaryKey().defaultRandom(),
  classId: uuid("class_id").references(() => classes.id).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  type: varchar("type", { length: 50 }), // homework, quiz, test, project, etc.
  points: integer("points"),
  dueDate: timestamp("due_date"),
  assignedDate: timestamp("assigned_date").defaultNow(),
  instructions: text("instructions"),
  rubric: jsonb("rubric"),
  attachments: jsonb("attachments"),
  neurodivergentAdaptations: jsonb("neurodivergent_adaptations"),
  accommodations: jsonb("accommodations"),
  isPublished: boolean("is_published").default(false),
  allowLateSubmission: boolean("allow_late_submission").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Assignment Submissions
export const submissions = pgTable("submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  assignmentId: uuid("assignment_id").references(() => assignments.id).notNull(),
  studentId: uuid("student_id").references(() => students.id).notNull(),
  content: text("content"),
  attachments: jsonb("attachments"),
  submittedAt: timestamp("submitted_at").defaultNow(),
  isLate: boolean("is_late").default(false),
  status: varchar("status", { length: 20 }).default("submitted"), // submitted, graded, returned
  feedback: text("feedback"),
  grade: decimal("grade", { precision: 5, scale: 2 }),
  rubricScores: jsonb("rubric_scores"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Gradebook
export const gradebook = pgTable("gradebook", {
  id: uuid("id").primaryKey().defaultRandom(),
  studentId: uuid("student_id").references(() => students.id).notNull(),
  classId: uuid("class_id").references(() => classes.id).notNull(),
  assignmentId: uuid("assignment_id").references(() => assignments.id),
  category: varchar("category", { length: 50 }), // homework, quiz, test, participation
  points: decimal("points", { precision: 5, scale: 2 }),
  maxPoints: decimal("max_points", { precision: 5, scale: 2 }),
  percentage: decimal("percentage", { precision: 5, scale: 2 }),
  letterGrade: varchar("letter_grade", { length: 5 }),
  gradedDate: timestamp("graded_date"),
  gradedBy: uuid("graded_by").references(() => users.id),
  notes: text("notes"),
  excused: boolean("excused").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Attendance Management
export const attendance = pgTable("attendance", {
  id: uuid("id").primaryKey().defaultRandom(),
  studentId: uuid("student_id").references(() => students.id).notNull(),
  classId: uuid("class_id").references(() => classes.id),
  date: date("date").notNull(),
  status: varchar("status", { length: 20 }).notNull(), // present, absent, tardy, excused
  timeIn: timestamp("time_in"),
  timeOut: timestamp("time_out"),
  notes: text("notes"),
  recordedBy: uuid("recorded_by").references(() => users.id),
  parentNotified: boolean("parent_notified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Communication System
export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  senderId: uuid("sender_id").references(() => users.id).notNull(),
  recipientId: uuid("recipient_id").references(() => users.id),
  recipientGroup: varchar("recipient_group", { length: 50 }), // class, grade, all_parents, etc.
  subject: varchar("subject", { length: 200 }),
  content: text("content"),
  type: varchar("type", { length: 50 }).default("message"), // message, announcement, alert
  priority: varchar("priority", { length: 20 }).default("normal"), // low, normal, high, urgent
  attachments: jsonb("attachments"),
  isRead: boolean("is_read").default(false),
  readAt: timestamp("read_at"),
  language: varchar("language", { length: 10 }).default("en"),
  translation: jsonb("translation"),
  sentAt: timestamp("sent_at").defaultNow(),
  scheduledFor: timestamp("scheduled_for"),
  createdAt: timestamp("created_at").defaultNow()
});

// IEP Management
export const ieps = pgTable("ieps", {
  id: uuid("id").primaryKey().defaultRandom(),
  studentId: uuid("student_id").references(() => students.id).notNull(),
  status: varchar("status", { length: 20 }).default("active"), // active, inactive, review
  category: varchar("category", { length: 100 }), // autism, intellectual disability, etc.
  startDate: date("start_date"),
  endDate: date("end_date"),
  annualReviewDate: date("annual_review_date"),
  goals: jsonb("goals"),
  accommodations: jsonb("accommodations"),
  modifications: jsonb("modifications"),
  services: jsonb("services"), // speech therapy, occupational therapy, etc.
  serviceMinutes: jsonb("service_minutes"),
  transitionPlan: jsonb("transition_plan"),
  behaviorPlan: jsonb("behavior_plan"),
  team: jsonb("team"), // case manager, teachers, parents, specialists
  evaluations: jsonb("evaluations"),
  meetingNotes: jsonb("meeting_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Behavior Tracking
export const behaviorIncidents = pgTable("behavior_incidents", {
  id: uuid("id").primaryKey().defaultRandom(),
  studentId: uuid("student_id").references(() => students.id).notNull(),
  reportedBy: uuid("reported_by").references(() => users.id).notNull(),
  incidentDate: timestamp("incident_date"),
  location: varchar("location", { length: 100 }),
  type: varchar("type", { length: 50 }), // disruption, aggression, self-harm, etc.
  severity: varchar("severity", { length: 20 }), // minor, major, severe
  description: text("description"),
  antecedent: text("antecedent"), // what happened before
  consequence: text("consequence"), // what happened after
  intervention: text("intervention"),
  followUp: text("follow_up"),
  parentNotified: boolean("parent_notified").default(false),
  adminNotified: boolean("admin_notified").default(false),
  resolved: boolean("resolved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Health Records
export const healthRecords = pgTable("health_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  studentId: uuid("student_id").references(() => students.id).notNull(),
  visitDate: timestamp("visit_date").defaultNow(),
  reason: varchar("reason", { length: 200 }),
  symptoms: text("symptoms"),
  treatment: text("treatment"),
  medication: varchar("medication", { length: 200 }),
  disposition: varchar("disposition", { length: 100 }), // returned to class, sent home, etc.
  followUp: text("follow_up"),
  parentNotified: boolean("parent_notified").default(false),
  recordedBy: uuid("recorded_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Financial Management
export const financialAccounts = pgTable("financial_accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  studentId: uuid("student_id").references(() => students.id).notNull(),
  accountType: varchar("account_type", { length: 50 }), // tuition, lunch, transportation
  balance: decimal("balance", { precision: 10, scale: 2 }).default("0.00"),
  creditLimit: decimal("credit_limit", { precision: 10, scale: 2 }),
  paymentPlan: jsonb("payment_plan"),
  autoPayEnabled: boolean("auto_pay_enabled").default(false),
  billingContact: jsonb("billing_contact"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Payment Transactions
export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  accountId: uuid("account_id").references(() => financialAccounts.id).notNull(),
  type: varchar("type", { length: 20 }), // charge, payment, refund, adjustment
  amount: decimal("amount", { precision: 10, scale: 2 }),
  description: varchar("description", { length: 200 }),
  paymentMethod: varchar("payment_method", { length: 50 }),
  transactionId: varchar("transaction_id", { length: 100 }),
  status: varchar("status", { length: 20 }).default("pending"), // pending, completed, failed
  processedBy: uuid("processed_by").references(() => users.id),
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").defaultNow()
});

// Device Management
export const devices = pgTable("devices", {
  id: uuid("id").primaryKey().defaultRandom(),
  deviceId: varchar("device_id", { length: 100 }).unique().notNull(),
  type: varchar("type", { length: 50 }), // laptop, tablet, chromebook
  brand: varchar("brand", { length: 50 }),
  model: varchar("model", { length: 100 }),
  serialNumber: varchar("serial_number", { length: 100 }),
  assignedTo: uuid("assigned_to").references(() => users.id),
  status: varchar("status", { length: 20 }).default("available"), // available, assigned, maintenance, retired
  purchaseDate: date("purchase_date"),
  warrantyExpiry: date("warranty_expiry"),
  lastMaintenance: date("last_maintenance"),
  condition: varchar("condition", { length: 20 }), // excellent, good, fair, poor
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Event Calendar
export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  type: varchar("type", { length: 50 }), // academic, social, administrative, parent
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  location: varchar("location", { length: 200 }),
  organizer: uuid("organizer").references(() => users.id),
  attendees: jsonb("attendees"),
  rsvpRequired: boolean("rsvp_required").default(false),
  maxAttendees: integer("max_attendees"),
  isPublic: boolean("is_public").default(true),
  reminders: jsonb("reminders"),
  attachments: jsonb("attachments"),
  recurringPattern: jsonb("recurring_pattern"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Visitor Management
export const visitors = pgTable("visitors", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  organization: varchar("organization", { length: 200 }),
  purpose: varchar("purpose", { length: 200 }),
  hostId: uuid("host_id").references(() => users.id),
  checkInTime: timestamp("check_in_time"),
  checkOutTime: timestamp("check_out_time"),
  badgeNumber: varchar("badge_number", { length: 20 }),
  backgroundCheck: boolean("background_check").default(false),
  approvedBy: uuid("approved_by").references(() => users.id),
  status: varchar("status", { length: 20 }).default("pending"), // pending, approved, denied, checked_in, checked_out
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Define all relations
export const usersRelations = relations(users, ({ many, one }) => ({
  student: one(students, {
    fields: [users.id],
    references: [students.userId]
  }),
  staff: one(staff, {
    fields: [users.id],
    references: [staff.userId]
  }),
  sentMessages: many(messages),
  receivedMessages: many(messages),
  classes: many(classes),
  enrollments: many(enrollments),
  assignments: many(assignments),
  submissions: many(submissions),
  attendance: many(attendance),
  devices: many(devices),
  events: many(events),
  visitors: many(visitors)
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  user: one(users, {
    fields: [students.userId],
    references: [users.id]
  }),
  enrollments: many(enrollments),
  submissions: many(submissions),
  gradebook: many(gradebook),
  attendance: many(attendance),
  ieps: many(ieps),
  behaviorIncidents: many(behaviorIncidents),
  healthRecords: many(healthRecords),
  financialAccounts: many(financialAccounts)
}));

export const classesRelations = relations(classes, ({ one, many }) => ({
  course: one(courses, {
    fields: [classes.courseId],
    references: [courses.id]
  }),
  teacher: one(users, {
    fields: [classes.teacherId],
    references: [users.id]
  }),
  enrollments: many(enrollments),
  assignments: many(assignments),
  attendance: many(attendance),
  gradebook: many(gradebook)
}));

// Insert schemas for forms
export const insertUserSchema = createInsertSchema(users);
export const insertStudentSchema = createInsertSchema(students);
export const insertStaffSchema = createInsertSchema(staff);
export const insertCourseSchema = createInsertSchema(courses);
export const insertClassSchema = createInsertSchema(classes);
export const insertEnrollmentSchema = createInsertSchema(enrollments);
export const insertAssignmentSchema = createInsertSchema(assignments);
export const insertSubmissionSchema = createInsertSchema(submissions);
export const insertGradebookSchema = createInsertSchema(gradebook);
export const insertAttendanceSchema = createInsertSchema(attendance);
export const insertMessageSchema = createInsertSchema(messages);
export const insertIepSchema = createInsertSchema(ieps);
export const insertBehaviorIncidentSchema = createInsertSchema(behaviorIncidents);
export const insertHealthRecordSchema = createInsertSchema(healthRecords);
export const insertFinancialAccountSchema = createInsertSchema(financialAccounts);
export const insertTransactionSchema = createInsertSchema(transactions);
export const insertDeviceSchema = createInsertSchema(devices);
export const insertEventSchema = createInsertSchema(events);
export const insertVisitorSchema = createInsertSchema(visitors);

// Types
export type User = typeof users.$inferSelect;
export type Student = typeof students.$inferSelect;
export type Staff = typeof staff.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type Class = typeof classes.$inferSelect;
export type Enrollment = typeof enrollments.$inferSelect;
export type Assignment = typeof assignments.$inferSelect;
export type Submission = typeof submissions.$inferSelect;
export type GradebookEntry = typeof gradebook.$inferSelect;
export type AttendanceRecord = typeof attendance.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type IEP = typeof ieps.$inferSelect;
export type BehaviorIncident = typeof behaviorIncidents.$inferSelect;
export type HealthRecord = typeof healthRecords.$inferSelect;
export type FinancialAccount = typeof financialAccounts.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type Device = typeof devices.$inferSelect;
export type Event = typeof events.$inferSelect;
export type Visitor = typeof visitors.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type InsertStaff = z.infer<typeof insertStaffSchema>;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type InsertClass = z.infer<typeof insertClassSchema>;
export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;
export type InsertAssignment = z.infer<typeof insertAssignmentSchema>;
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type InsertGradebookEntry = z.infer<typeof insertGradebookSchema>;
export type InsertAttendanceRecord = z.infer<typeof insertAttendanceSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type InsertIEP = z.infer<typeof insertIepSchema>;
export type InsertBehaviorIncident = z.infer<typeof insertBehaviorIncidentSchema>;
export type InsertHealthRecord = z.infer<typeof insertHealthRecordSchema>;
export type InsertFinancialAccount = z.infer<typeof insertFinancialAccountSchema>;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type InsertDevice = z.infer<typeof insertDeviceSchema>;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type InsertVisitor = z.infer<typeof insertVisitorSchema>;