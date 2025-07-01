import {
  pgTable,
  uuid,
  varchar,
  jsonb,
  timestamp,
  boolean,
  text,
  integer,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Master Admin - SpacePharaoh's supreme control
export const masterAdmin = pgTable("master_admin", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username", { length: 50 }).unique().notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  permissions: jsonb("permissions").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Network/District Level - School district or organization
export const networks = pgTable("networks", {
  id: uuid("id").primaryKey().defaultRandom(),
  masterAdminId: uuid("master_admin_id").references(() => masterAdmin.id),
  name: varchar("name", { length: 255 }).notNull(),
  domain: varchar("domain", { length: 100 }).unique(),
  billingConfig: jsonb("billing_config"),
  settings: jsonb("settings"),
  branding: jsonb("branding"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Network Admins
export const networkAdmins = pgTable("network_admins", {
  id: uuid("id").primaryKey().defaultRandom(),
  networkId: uuid("network_id").references(() => networks.id),
  userId: uuid("user_id").references(() => users.id),
  permissions: jsonb("permissions").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Individual Schools
export const schools = pgTable("schools", {
  id: uuid("id").primaryKey().defaultRandom(),
  networkId: uuid("network_id").references(() => networks.id),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // 'primary', 'secondary', 'law', 'language'
  subdomain: varchar("subdomain", { length: 100 }).unique(),
  config: jsonb("config"),
  branding: jsonb("branding"),
  features: jsonb("features"),
  enrollment: jsonb("enrollment"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// School Admins (Principals/Directors)
export const schoolAdmins = pgTable("school_admins", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").references(() => schools.id),
  userId: uuid("user_id").references(() => users.id),
  permissions: jsonb("permissions").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Platform Modules (Features that can be enabled/disabled)
export const modules = pgTable("modules", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // 'curriculum', 'feature', 'tool', 'integration'
  description: text("description"),
  config: jsonb("config"),
  dependencies: jsonb("dependencies"),
  version: varchar("version", { length: 20 }),
  isCore: boolean("is_core").default(false), // Core modules cannot be disabled
  pricingTier: varchar("pricing_tier", { length: 50 }), // 'starter', 'district', 'enterprise'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// School-Module Relationships (Which features each school has enabled)
export const schoolModules = pgTable("school_modules", {
  schoolId: uuid("school_id").references(() => schools.id),
  moduleId: uuid("module_id").references(() => modules.id),
  enabled: boolean("enabled").default(true),
  config: jsonb("config"),
  installedAt: timestamp("installed_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  pk: primaryKey({ columns: [table.schoolId, table.moduleId] }),
}));

// Users (Teachers, Students, Parents)
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  username: varchar("username", { length: 100 }),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  role: varchar("role", { length: 50 }).notNull(), // 'teacher', 'student', 'parent'
  profileData: jsonb("profile_data"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Classrooms
export const classrooms = pgTable("classrooms", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").references(() => schools.id),
  teacherId: uuid("teacher_id").references(() => users.id),
  name: varchar("name", { length: 255 }).notNull(),
  grade: varchar("grade", { length: 20 }),
  subject: varchar("subject", { length: 100 }),
  capacity: integer("capacity"),
  config: jsonb("config"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Student-Classroom Relationships
export const studentClassrooms = pgTable("student_classrooms", {
  studentId: uuid("student_id").references(() => users.id),
  classroomId: uuid("classroom_id").references(() => classrooms.id),
  enrolledAt: timestamp("enrolled_at").defaultNow(),
  status: varchar("status", { length: 50 }).default("active"),
}, (table) => ({
  pk: primaryKey({ columns: [table.studentId, table.classroomId] }),
}));

// Content/Curriculum
export const content = pgTable("content", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // 'lesson', 'assessment', 'activity', 'resource'
  gradeLevel: varchar("grade_level", { length: 20 }),
  subject: varchar("subject", { length: 100 }),
  content: jsonb("content"),
  neurodivergentAdaptations: jsonb("neurodivergent_adaptations"),
  multilingual: jsonb("multilingual"),
  tags: jsonb("tags"),
  isPublished: boolean("is_published").default(false),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Analytics Data
export const analytics = pgTable("analytics", {
  id: uuid("id").primaryKey().defaultRandom(),
  entityType: varchar("entity_type", { length: 50 }).notNull(), // 'network', 'school', 'classroom', 'student'
  entityId: uuid("entity_id").notNull(),
  metricType: varchar("metric_type", { length: 100 }).notNull(),
  data: jsonb("data").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Relations
export const masterAdminRelations = relations(masterAdmin, ({ many }) => ({
  networks: many(networks),
}));

export const networksRelations = relations(networks, ({ one, many }) => ({
  masterAdmin: one(masterAdmin, {
    fields: [networks.masterAdminId],
    references: [masterAdmin.id],
  }),
  schools: many(schools),
  networkAdmins: many(networkAdmins),
}));

export const schoolsRelations = relations(schools, ({ one, many }) => ({
  network: one(networks, {
    fields: [schools.networkId],
    references: [networks.id],
  }),
  schoolAdmins: many(schoolAdmins),
  classrooms: many(classrooms),
  schoolModules: many(schoolModules),
}));

export const modulesRelations = relations(modules, ({ many }) => ({
  schoolModules: many(schoolModules),
}));

export const schoolModulesRelations = relations(schoolModules, ({ one }) => ({
  school: one(schools, {
    fields: [schoolModules.schoolId],
    references: [schools.id],
  }),
  module: one(modules, {
    fields: [schoolModules.moduleId],
    references: [modules.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  classrooms: many(classrooms),
  studentClassrooms: many(studentClassrooms),
  content: many(content),
}));

export const classroomsRelations = relations(classrooms, ({ one, many }) => ({
  school: one(schools, {
    fields: [classrooms.schoolId],
    references: [schools.id],
  }),
  teacher: one(users, {
    fields: [classrooms.teacherId],
    references: [users.id],
  }),
  studentClassrooms: many(studentClassrooms),
}));

// TypeScript Types
export type MasterAdmin = typeof masterAdmin.$inferSelect;
export type InsertMasterAdmin = typeof masterAdmin.$inferInsert;

export type Network = typeof networks.$inferSelect;
export type InsertNetwork = typeof networks.$inferInsert;

export type School = typeof schools.$inferSelect;
export type InsertSchool = typeof schools.$inferInsert;

export type Module = typeof modules.$inferSelect;
export type InsertModule = typeof modules.$inferInsert;

export type SchoolModule = typeof schoolModules.$inferSelect;
export type InsertSchoolModule = typeof schoolModules.$inferInsert;

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type Classroom = typeof classrooms.$inferSelect;
export type InsertClassroom = typeof classrooms.$inferInsert;

export type Content = typeof content.$inferSelect;
export type InsertContent = typeof content.$inferInsert;

export type Analytics = typeof analytics.$inferSelect;
export type InsertAnalytics = typeof analytics.$inferInsert;

// Permission Interfaces
export interface MasterAdminPermissions {
  canManageAllNetworks: boolean;
  canConfigurePlatform: boolean;
  canAccessAllAnalytics: boolean;
  canManageBilling: boolean;
  canDeployUpdates: boolean;
  canCreateNetworks: boolean;
  canDeleteNetworks: boolean;
}

export interface NetworkAdminPermissions {
  canManageNetworkSchools: boolean;
  canConfigureNetworkSettings: boolean;
  canAccessNetworkAnalytics: boolean;
  canManageNetworkStaff: boolean;
  canCreateSchools: boolean;
  canDeleteSchools: boolean;
  canManageBilling: boolean;
}

export interface SchoolAdminPermissions {
  canManageSchool: boolean;
  canConfigureSchoolSettings: boolean;
  canAccessSchoolAnalytics: boolean;
  canManageSchoolStaff: boolean;
  canManageStudents: boolean;
  canConfigureModules: boolean;
  canCustomizeBranding: boolean;
}

export interface TeacherPermissions {
  canManageClassroom: boolean;
  canGradeAssignments: boolean;
  canCommunicateWithParents: boolean;
  canAccessStudentData: boolean;
  canCreateContent: boolean;
  canModifyContent: boolean;
}

// School Configuration Interfaces
export interface SchoolConfig {
  schoolType: 'primary' | 'secondary' | 'law' | 'language';
  gradeRange: [number, number];
  maxStudents: number;
  timezone: string;
  academicYear: {
    startDate: string;
    endDate: string;
    terms: Array<{
      name: string;
      startDate: string;
      endDate: string;
    }>;
  };
  curriculum: {
    standards: string; // 'texas', 'common_core', 'international'
    subjects: string[];
    neurodivergentSupport: boolean;
    multilingualSupport: boolean;
  };
}

export interface SchoolBranding {
  name: string;
  logo: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  customCSS?: string;
  favicon: string;
}

export interface SchoolFeatures {
  aiTutoring: boolean;
  virtualClassrooms: boolean;
  parentPortal: boolean;
  studentDashboard: boolean;
  teacherPortal: boolean;
  complianceTracking: boolean;
  advancedAnalytics: boolean;
  customModules: string[];
}