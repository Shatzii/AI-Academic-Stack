import { z } from "zod";

// Avatar Schema
export const avatarSchema = z.object({
  id: z.number(),
  userId: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  name: z.string(),
  skinTone: z.string(),
  hairColor: z.string(),
  eyeColor: z.string(),
  superpower: z.string().nullable(),
  accessories: z.any(),
  costume: z.any(),
  neurotypeStrengths: z.any(),
  savedAt: z.date().nullable(),
  sharedPublic: z.boolean().nullable()
});

export const insertAvatarSchema = avatarSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export type Avatar = z.infer<typeof avatarSchema>;
export type NewAvatar = z.infer<typeof insertAvatarSchema>;

// World Schema
export const worldSchema = z.object({
  id: z.number(),
  userId: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  name: z.string(),
  sharedPublic: z.boolean().nullable(),
  description: z.string().nullable(),
  environment: z.string(),
  objects: z.any(),
  terrain: z.any(),
  lighting: z.any(),
  weather: z.string(),
  interactiveElements: z.any(),
  educationalContent: z.any(),
  parentalRating: z.string().nullable(),
  contentRestrictions: z.any()
});

export const insertWorldSchema = worldSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export type World = z.infer<typeof worldSchema>;
export type NewWorld = z.infer<typeof insertWorldSchema>;

// Motion Tracking Session Schema
export const motionTrackingSessionSchema = z.object({
  id: z.number(),
  userId: z.number(),
  createdAt: z.date(),
  endedAt: z.date().nullable(),
  qualityLevel: z.string().nullable(),
  duration: z.number().nullable(),
  activityType: z.string().nullable(),
  performanceData: z.any(),
  keypoints: z.any(),
  avatarId: z.number().nullable(),
  worldId: z.number().nullable()
});

export const insertMotionTrackingSessionSchema = motionTrackingSessionSchema.omit({ 
  id: true, 
  createdAt: true 
});

export type MotionTrackingSession = z.infer<typeof motionTrackingSessionSchema>;
export type NewMotionTrackingSession = z.infer<typeof insertMotionTrackingSessionSchema>;

// Parental Control Schema
export const parentalControlSchema = z.object({
  id: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  parentId: z.number(),
  childId: z.number(),
  contentRating: z.string().nullable(),
  timeLimit: z.number().nullable(),
  restrictedFeatures: z.any(),
  restrictedTimes: z.any(),
  requireApproval: z.boolean().nullable(),
  approvalCategories: z.any(),
  notifyOnLogin: z.boolean().nullable(),
  notifyOnCreation: z.boolean().nullable()
});

export const insertParentalControlSchema = parentalControlSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export type ParentalControl = z.infer<typeof parentalControlSchema>;
export type NewParentalControl = z.infer<typeof insertParentalControlSchema>;

// Starworld Metric Schema
export const starworldMetricSchema = z.object({
  id: z.number(),
  userId: z.number(),
  createdAt: z.date(),
  duration: z.number().nullable(),
  avatarId: z.number().nullable(),
  worldId: z.number().nullable(),
  sessionId: z.string(),
  metricType: z.string(),
  metricData: z.any(),
  interactionCount: z.number().nullable()
});

export const insertStarworldMetricSchema = starworldMetricSchema.omit({ 
  id: true, 
  createdAt: true 
});

export type StarworldMetric = z.infer<typeof starworldMetricSchema>;
export type NewStarworldMetric = z.infer<typeof insertStarworldMetricSchema>;