import { z } from 'zod';
import { pgTable, serial, text, integer, jsonb, boolean, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';

// Learning Mini-game schema
export const learningMiniGames = pgTable('learning_mini_games', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  gameType: text('game_type').notNull(), // flashcard, quiz, puzzle, memory, etc.
  difficulty: integer('difficulty').notNull(), // 1-5 scale
  subject: text('subject').notNull(), // math, language, science, etc.
  gradeLevel: text('grade_level').notNull(), // K-12, college, etc.
  timeLimit: integer('time_limit'), // in seconds, optional
  instructions: text('instructions').notNull(),
  rewardXp: integer('reward_xp').notNull().default(10),
  active: boolean('active').notNull().default(true),
  metadata: jsonb('metadata'), // Additional game-specific configuration
  createdAt: timestamp('created_at').defaultNow(),
});

export const insertLearningMiniGameSchema = createInsertSchema(learningMiniGames).pick({
  title: true,
  description: true,
  gameType: true,
  difficulty: true,
  subject: true,
  gradeLevel: true,
  timeLimit: true,
  instructions: true,
  rewardXp: true,
  active: true,
  metadata: true,
});

// Game content schema (questions, flashcards, puzzle pieces, etc.)
export const miniGameContents = pgTable('mini_game_contents', {
  id: serial('id').primaryKey(),
  gameId: integer('game_id').notNull(),
  contentType: text('content_type').notNull(), // question, flashcard, puzzle_piece, etc.
  contentData: jsonb('content_data').notNull(), // The actual content (question text, options, etc.)
  order: integer('order').notNull().default(0), // For ordering content within a game
  difficulty: integer('difficulty'), // Optional specific difficulty for this content
  metadata: jsonb('metadata'), // Additional content-specific data
});

export const insertMiniGameContentSchema = createInsertSchema(miniGameContents).pick({
  gameId: true,
  contentType: true,
  contentData: true,
  order: true,
  difficulty: true,
  metadata: true,
});

// User Game Progress schema
export const userMiniGameProgress = pgTable('user_mini_game_progress', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  gameId: integer('game_id').notNull(),
  completed: boolean('completed').notNull().default(false),
  score: integer('score').default(0),
  timeSpent: integer('time_spent'), // in seconds
  attempts: integer('attempts').notNull().default(1),
  lastPlayed: timestamp('last_played').defaultNow(),
  completedAt: timestamp('completed_at'),
  gameData: jsonb('game_data'), // Game-specific progress data
});

export const insertUserMiniGameProgressSchema = createInsertSchema(userMiniGameProgress).pick({
  userId: true,
  gameId: true,
  completed: true,
  score: true,
  timeSpent: true,
  attempts: true,
  gameData: true,
});

// User Game Activity schema (detailed tracking of each game session)
export const userMiniGameActivities = pgTable('user_mini_game_activities', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  gameId: integer('game_id').notNull(),
  contentId: integer('content_id'), // Optional reference to specific content
  activityType: text('activity_type').notNull(), // start, answer, complete, etc.
  data: jsonb('data'), // Activity-specific data (answers, time taken, etc.)
  timestamp: timestamp('timestamp').defaultNow(),
});

export const insertUserMiniGameActivitySchema = createInsertSchema(userMiniGameActivities).pick({
  userId: true,
  gameId: true,
  contentId: true,
  activityType: true,
  data: true,
});

// Types
export type LearningMiniGame = typeof learningMiniGames.$inferSelect;
export type InsertLearningMiniGame = z.infer<typeof insertLearningMiniGameSchema>;

export type MiniGameContent = typeof miniGameContents.$inferSelect;
export type InsertMiniGameContent = z.infer<typeof insertMiniGameContentSchema>;

export type UserMiniGameProgress = typeof userMiniGameProgress.$inferSelect;
export type InsertUserMiniGameProgress = z.infer<typeof insertUserMiniGameProgressSchema>;

export type UserMiniGameActivity = typeof userMiniGameActivities.$inferSelect;
export type InsertUserMiniGameActivity = z.infer<typeof insertUserMiniGameActivitySchema>;

// Predefined game types with associated metadata
export const miniGameTypes = [
  { 
    type: 'flashcard', 
    name: 'Flashcards Challenge', 
    description: 'Test your knowledge with interactive flashcards',
    icon: '🎴',
    defaultTimeLimit: 120,
  },
  { 
    type: 'quiz', 
    name: 'Quick Quiz', 
    description: 'Answer multiple-choice questions to test your knowledge',
    icon: '❓',
    defaultTimeLimit: 180,
  },
  { 
    type: 'matching', 
    name: 'Matching Game', 
    description: 'Match related items to build connections',
    icon: '🔄',
    defaultTimeLimit: 120,
  },
  { 
    type: 'memory', 
    name: 'Memory Challenge', 
    description: 'Find matching pairs to test your memory',
    icon: '🧠',
    defaultTimeLimit: 180,
  },
  { 
    type: 'puzzle', 
    name: 'Learning Puzzle', 
    description: 'Solve puzzles related to what you\'ve learned',
    icon: '🧩',
    defaultTimeLimit: 300,
  },
  { 
    type: 'sorting', 
    name: 'Sorting Challenge', 
    description: 'Sort items into their correct categories',
    icon: '📊',
    defaultTimeLimit: 120,
  },
  { 
    type: 'wordsearch', 
    name: 'Word Search', 
    description: 'Find hidden words related to your learning topic',
    icon: '🔍',
    defaultTimeLimit: 240,
  },
  { 
    type: 'crossword', 
    name: 'Learning Crossword', 
    description: 'Complete a crossword puzzle using what you\'ve learned',
    icon: '📝',
    defaultTimeLimit: 300,
  }
];

// Interface for game analytics and stats
export interface MiniGameStats {
  gamesPlayed: number;
  gamesCompleted: number;
  totalScore: number;
  averageScore: number;
  totalTimeSpent: number; // in seconds
  gameTypeBreakdown: {
    gameType: string;
    count: number;
    averageScore: number;
  }[];
  subjectBreakdown: {
    subject: string;
    count: number;
    averageScore: number;
  }[];
  recentGames: UserMiniGameProgress[];
}

// Interface for game recommendations
export interface MiniGameRecommendation {
  gameId: number;
  title: string;
  gameType: string;
  description: string;
  difficulty: number;
  subject: string;
  reasonForRecommendation: string;
}