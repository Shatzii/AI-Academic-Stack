import { z } from 'zod';
import { pgTable, serial, text, timestamp, integer, jsonb } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';

// Learning mood tracking table
export const learningMoods = pgTable('learning_moods', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').notNull(),
  sessionId: integer('session_id'), // Optional link to learning session
  moodEmoji: text('mood_emoji').notNull(), // The emoji representing the mood
  moodCategory: text('mood_category').notNull(), // e.g., "excited", "confused", "bored", etc.
  moodIntensity: integer('mood_intensity').notNull(), // 1-5 scale
  context: text('context'), // What the student was doing
  notes: text('notes'), // Any additional notes
  timestamp: timestamp('timestamp').defaultNow(),
  metadata: jsonb('metadata'), // Additional structured data
});

export const insertLearningMoodSchema = createInsertSchema(learningMoods).pick({
  studentId: true,
  sessionId: true,
  moodEmoji: true,
  moodCategory: true,
  moodIntensity: true,
  context: true,
  notes: true,
  metadata: true,
});

export type LearningMood = typeof learningMoods.$inferSelect;
export type InsertLearningMood = z.infer<typeof insertLearningMoodSchema>;

// Predefined mood categories and their associated emojis
export const moodCategories = [
  { category: 'excited', emoji: '😃', description: 'Enthusiastic and eager to learn' },
  { category: 'happy', emoji: '😊', description: 'Content and pleased with the learning experience' },
  { category: 'calm', emoji: '😌', description: 'Relaxed and focused' },
  { category: 'confused', emoji: '😕', description: 'Having trouble understanding concepts' },
  { category: 'frustrated', emoji: '😤', description: 'Struggling with difficult concepts' },
  { category: 'bored', emoji: '😒', description: 'Uninterested in the current activity' },
  { category: 'tired', emoji: '😴', description: 'Mentally exhausted from learning' },
  { category: 'anxious', emoji: '😰', description: 'Nervous about understanding or performance' },
  { category: 'proud', emoji: '🥳', description: 'Accomplished after completing a task' },
  { category: 'curious', emoji: '🤔', description: 'Interested and wanting to explore more' },
];

// Learning mood statistics and aggregations
export interface LearningMoodStats {
  mostCommonMood: string;
  averageIntensity: number;
  moodTrends: {
    category: string;
    count: number;
    averageIntensity: number;
  }[];
  recentMoods: LearningMood[];
  totalEntries: number;
}

// Learning mood feedback responses
export interface LearningMoodFeedback {
  moodCategory: string;
  suggestions: string[];
  resources: {
    title: string;
    description: string;
    link?: string;
  }[];
}