import { z } from 'zod';
import { pgTable, serial, text, boolean, integer, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';

// Compliance standards table
export const complianceStandards = pgTable('compliance_standards', {
  id: serial('id').primaryKey(),
  standardName: text('standard_name').notNull(),
  standardType: text('standard_type').notNull(), // Federal, State, District, etc.
  description: text('description').notNull(),
  gradeLevel: text('grade_level').notNull(), // K, 1, 2, ..., 12
  subject: text('subject').notNull(),
  requirements: jsonb('requirements').notNull(), // JSON array of requirements
  active: boolean('active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const insertComplianceStandardSchema = createInsertSchema(complianceStandards).pick({
  standardName: true,
  standardType: true,
  description: true,
  gradeLevel: true,
  subject: true,
  requirements: true,
  active: true,
});

export type ComplianceStandard = typeof complianceStandards.$inferSelect;
export type InsertComplianceStandard = z.infer<typeof insertComplianceStandardSchema>;

// IEP/504 accommodations table
export const accommodations = pgTable('accommodations', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(), // Visual, Auditory, Executive Function, etc.
  description: text('description').notNull(),
  applicableGradeLevels: jsonb('applicable_grade_levels').notNull(), // JSON array of grade levels
  implementationDetails: text('implementation_details').notNull(),
  active: boolean('active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const insertAccommodationSchema = createInsertSchema(accommodations).pick({
  name: true,
  category: true,
  description: true,
  applicableGradeLevels: true,
  implementationDetails: true,
  active: true,
});

export type Accommodation = typeof accommodations.$inferSelect;
export type InsertAccommodation = z.infer<typeof insertAccommodationSchema>;

// Assessment requirements table
export const assessmentRequirements = pgTable('assessment_requirements', {
  id: serial('id').primaryKey(),
  assessmentName: text('assessment_name').notNull(),
  gradeLevel: text('grade_level').notNull(), // K, 1, 2, ..., 12
  subject: text('subject').notNull(),
  frequency: text('frequency').notNull(), // Annual, Quarterly, etc.
  standardsLink: text('standards_link').notNull(), // Reference to standards covered
  accommodationsAllowed: boolean('accommodations_allowed').default(true),
  accommodationTypes: jsonb('accommodation_types'), // JSON array of accommodation types allowed
  stateRequired: boolean('state_required').default(false),
  federalRequired: boolean('federal_required').default(false),
  active: boolean('active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const insertAssessmentRequirementSchema = createInsertSchema(assessmentRequirements).pick({
  assessmentName: true,
  gradeLevel: true,
  subject: true,
  frequency: true,
  standardsLink: true,
  accommodationsAllowed: true,
  accommodationTypes: true,
  stateRequired: true,
  federalRequired: true,
  active: true,
});

export type AssessmentRequirement = typeof assessmentRequirements.$inferSelect;
export type InsertAssessmentRequirement = z.infer<typeof insertAssessmentRequirementSchema>;

// Curriculum compliance audit logs
export const complianceAudits = pgTable('compliance_audits', {
  id: serial('id').primaryKey(),
  curriculumPlanId: integer('curriculum_plan_id').notNull(),
  auditDate: timestamp('audit_date').defaultNow(),
  auditedBy: integer('audited_by').notNull(), // User ID
  complianceScore: integer('compliance_score').notNull(), // 0-100 score
  findings: jsonb('findings').notNull(), // JSON array of compliance findings
  recommendations: jsonb('recommendations').notNull(), // JSON array of recommendations
  status: text('status').notNull(), // Pending, Pass, Fail, Needs Revision
  active: boolean('active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const insertComplianceAuditSchema = createInsertSchema(complianceAudits).pick({
  curriculumPlanId: true,
  auditedBy: true,
  complianceScore: true,
  findings: true,
  recommendations: true,
  status: true,
  active: true,
});

export type ComplianceAudit = typeof complianceAudits.$inferSelect;
export type InsertComplianceAudit = z.infer<typeof insertComplianceAuditSchema>;

// Student compliance plan (connects students to accommodations and requirements)
export const studentCompliancePlans = pgTable('student_compliance_plans', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').notNull(),
  planType: text('plan_type').notNull(), // IEP, 504, etc.
  startDate: timestamp('start_date').notNull(),
  reviewDate: timestamp('review_date').notNull(),
  endDate: timestamp('end_date'),
  accommodations: jsonb('accommodations').notNull(), // JSON array of accommodation IDs
  goals: jsonb('goals').notNull(), // JSON array of goals
  progress: jsonb('progress'), // JSON tracking of goal progress
  notes: text('notes'),
  active: boolean('active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const insertStudentCompliancePlanSchema = createInsertSchema(studentCompliancePlans).pick({
  studentId: true,
  planType: true,
  startDate: true,
  reviewDate: true,
  endDate: true,
  accommodations: true,
  goals: true,
  progress: true,
  notes: true,
  active: true,
});

export type StudentCompliancePlan = typeof studentCompliancePlans.$inferSelect;
export type InsertStudentCompliancePlan = z.infer<typeof insertStudentCompliancePlanSchema>;

// Compliance report templates
export const complianceReportTemplates = pgTable('compliance_report_templates', {
  id: serial('id').primaryKey(),
  templateName: text('template_name').notNull(),
  description: text('description').notNull(),
  reportType: text('report_type').notNull(), // IEP, 504, Curriculum, Assessment
  sections: jsonb('sections').notNull(), // JSON structure of report sections
  requiredFields: jsonb('required_fields').notNull(), // JSON array of required fields
  active: boolean('active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const insertComplianceReportTemplateSchema = createInsertSchema(complianceReportTemplates).pick({
  templateName: true,
  description: true,
  reportType: true,
  sections: true,
  requiredFields: true,
  active: true,
});

export type ComplianceReportTemplate = typeof complianceReportTemplates.$inferSelect;
export type InsertComplianceReportTemplate = z.infer<typeof insertComplianceReportTemplateSchema>;