import { pgTable, text, varchar, timestamp, boolean, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// AI Engine Licensing and Control System
export const aiEngineLicenses = pgTable("ai_engine_licenses", {
  id: varchar("id").primaryKey().notNull(),
  studentId: varchar("student_id").notNull(),
  licenseKey: varchar("license_key").unique().notNull(),
  licenseType: varchar("license_type").notNull(), // 'semester', 'annual', 'lifetime'
  engineVersion: varchar("engine_version").notNull(),
  purchaseDate: timestamp("purchase_date").defaultNow(),
  activationDate: timestamp("activation_date"),
  expirationDate: timestamp("expiration_date").notNull(),
  isActive: boolean("is_active").default(true),
  maxActivations: integer("max_activations").default(1),
  currentActivations: integer("current_activations").default(0),
  allowedFeatures: jsonb("allowed_features").$type<string[]>().default([]),
  restrictedAfterExpiry: boolean("restricted_after_expiry").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Remote Control and Monitoring
export const engineActivations = pgTable("engine_activations", {
  id: varchar("id").primaryKey().notNull(),
  licenseId: varchar("license_id").notNull(),
  deviceId: varchar("device_id").notNull(), // Hardware fingerprint
  macAddress: varchar("mac_address"),
  ipAddress: varchar("ip_address"),
  computerName: varchar("computer_name"),
  osInfo: varchar("os_info"),
  activationDate: timestamp("activation_date").defaultNow(),
  lastHeartbeat: timestamp("last_heartbeat"),
  isOnline: boolean("is_online").default(false),
  usageStats: jsonb("usage_stats").$type<{
    totalSessions: number;
    totalMinutes: number;
    featuresUsed: string[];
    lastActivity: string;
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
});

// License Violations and Enforcement
export const licenseViolations = pgTable("license_violations", {
  id: varchar("id").primaryKey().notNull(),
  licenseId: varchar("license_id").notNull(),
  violationType: varchar("violation_type").notNull(), // 'expired', 'multiple_devices', 'unauthorized_modification'
  description: text("description"),
  detectedAt: timestamp("detected_at").defaultNow(),
  severity: varchar("severity").notNull(), // 'warning', 'suspension', 'termination'
  actionTaken: varchar("action_taken"), // 'warning_sent', 'license_suspended', 'features_disabled'
  resolved: boolean("resolved").default(false),
  resolvedAt: timestamp("resolved_at"),
});

// Remote Feature Control
export const remoteFeatureControl = pgTable("remote_feature_control", {
  id: varchar("id").primaryKey().notNull(),
  licenseId: varchar("license_id").notNull(),
  featureName: varchar("feature_name").notNull(),
  isEnabled: boolean("is_enabled").default(true),
  expiresAt: timestamp("expires_at"),
  controlReason: varchar("control_reason"), // 'license_expired', 'violation', 'manual_override'
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Licensing Revenue and Tracking
export const licenseRevenue = pgTable("license_revenue", {
  id: varchar("id").primaryKey().notNull(),
  licenseId: varchar("license_id").notNull(),
  amount: integer("amount").notNull(), // in cents
  currency: varchar("currency").default("USD"),
  paymentMethod: varchar("payment_method"),
  stripePaymentId: varchar("stripe_payment_id"),
  refundAmount: integer("refund_amount").default(0),
  netRevenue: integer("net_revenue"),
  paidAt: timestamp("paid_at").defaultNow(),
});

// Zod schemas for validation
export const insertAiEngineLicenseSchema = createInsertSchema(aiEngineLicenses).extend({
  licenseType: z.enum(['semester', 'annual', 'lifetime']),
  engineVersion: z.string(),
  maxActivations: z.number().min(1).max(5),
});

export const insertEngineActivationSchema = createInsertSchema(engineActivations);
export const insertLicenseViolationSchema = createInsertSchema(licenseViolations);
export const insertRemoteFeatureControlSchema = createInsertSchema(remoteFeatureControl);

// Types
export type AiEngineLicense = typeof aiEngineLicenses.$inferSelect;
export type InsertAiEngineLicense = z.infer<typeof insertAiEngineLicenseSchema>;
export type EngineActivation = typeof engineActivations.$inferSelect;
export type LicenseViolation = typeof licenseViolations.$inferSelect;
export type RemoteFeatureControl = typeof remoteFeatureControl.$inferSelect;
export type LicenseRevenue = typeof licenseRevenue.$inferSelect;

// License Types and Control Levels
export const LICENSE_TYPES = {
  semester: {
    label: 'Semester License',
    duration: 6, // months
    price: 299,
    features: ['basic_ai', 'content_generation', 'tutoring'],
    postExpiryAccess: 'limited' // 10% of original functionality
  },
  annual: {
    label: 'Annual License',
    duration: 12, // months
    price: 499,
    features: ['full_ai', 'content_generation', 'tutoring', 'analytics'],
    postExpiryAccess: 'basic' // 25% of original functionality
  },
  lifetime: {
    label: 'Lifetime License',
    duration: -1, // unlimited
    price: 1299,
    features: ['full_ai', 'content_generation', 'tutoring', 'analytics', 'updates'],
    postExpiryAccess: 'full' // No restrictions
  }
} as const;

// Feature Control After Expiry
export const POST_EXPIRY_FEATURES = {
  limited: {
    'basic_ai': { enabled: true, dailyLimit: 3 },
    'content_generation': { enabled: false },
    'tutoring': { enabled: true, dailyLimit: 1 },
    'analytics': { enabled: false },
    'advanced_features': { enabled: false }
  },
  basic: {
    'basic_ai': { enabled: true, dailyLimit: 10 },
    'content_generation': { enabled: true, dailyLimit: 2 },
    'tutoring': { enabled: true, dailyLimit: 5 },
    'analytics': { enabled: true, features: ['basic'] },
    'advanced_features': { enabled: false }
  },
  full: {
    'basic_ai': { enabled: true, dailyLimit: -1 },
    'content_generation': { enabled: true, dailyLimit: -1 },
    'tutoring': { enabled: true, dailyLimit: -1 },
    'analytics': { enabled: true, features: ['full'] },
    'advanced_features': { enabled: true }
  }
} as const;

// Control Mechanisms
export const CONTROL_MECHANISMS = {
  heartbeat: {
    interval: 24, // hours
    graceperiod: 72, // hours before enforcement
    offlineMode: 7 // days allowed offline
  },
  licensing: {
    keyValidation: 'required',
    onlineVerification: 'weekly',
    hardwareBinding: true,
    maxDevices: 1
  },
  enforcement: {
    warningPeriod: 7, // days
    gracePeriod: 14, // days
    hardShutdown: 30 // days after expiry
  }
} as const;