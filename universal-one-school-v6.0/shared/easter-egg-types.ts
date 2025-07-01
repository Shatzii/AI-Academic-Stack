/**
 * Easter Egg Types
 * 
 * This file defines TypeScript types used across the Easter egg hunt feature.
 */

// Easter egg difficulty levels
export type EasterEggDifficulty = 'easy' | 'medium' | 'hard';

// Easter egg content types
export type EasterEggType = 'quiz' | 'fact' | 'challenge' | 'mini_game' | 'hidden_message' | 'achievement';

// Base content interface
interface BaseEasterEggContent {
  title: string;
}

// Quiz content
export interface QuizEasterEggContent extends BaseEasterEggContent {
  introduction: string;
  questions: {
    question: string;
    options: string[];
    correctIndex: number;
  }[];
}

// Fun fact content
export interface FactEasterEggContent extends BaseEasterEggContent {
  facts: string[];
  source?: string;
  imageUrl?: string;
}

// Challenge content
export interface ChallengeEasterEggContent extends BaseEasterEggContent {
  description: string;
  steps: {
    instruction: string;
    hint?: string;
  }[];
  timeLimit?: number;
}

// Mini-game content
export interface MiniGameEasterEggContent extends BaseEasterEggContent {
  instructions: string;
  gameComponent?: string; // ID of the mini-game component to render
  gameData?: Record<string, any>; // Data to pass to the mini-game component
}

// Hidden message content
export interface HiddenMessageEasterEggContent extends BaseEasterEggContent {
  message: string;
  imageUrl?: string;
}

// Achievement content
export interface AchievementEasterEggContent extends BaseEasterEggContent {
  description: string;
  badgeImageUrl: string;
  unlockedMessage: string;
}

// Union type for all Easter egg content types
export type EasterEggContent =
  | QuizEasterEggContent
  | FactEasterEggContent
  | ChallengeEasterEggContent
  | MiniGameEasterEggContent
  | HiddenMessageEasterEggContent
  | AchievementEasterEggContent;

// Easter egg reward
export interface EasterEggReward {
  xp?: number;
  badge?: {
    name: string;
    imageUrl?: string;
  };
  unlocks?: {
    name: string;
    type: 'feature' | 'content' | 'bonus';
    data?: any;
  };
  specialMessage?: string;
}

// Easter egg model
export interface EasterEgg {
  id: string;
  name: string;
  description: string;
  type: EasterEggType;
  path: string;
  action: string | null;
  difficulty: EasterEggDifficulty;
  content: EasterEggContent;
  reward?: EasterEggReward;
  isHidden?: boolean; // If true, doesn't show up in the stats until discovered
}

// User Easter egg discovery
export interface EasterEggDiscovery {
  id: string;
  userId: string;
  easterEggId: string;
  easterEggName: string;
  discoveredAt: string;
  completed: boolean;
  completedAt?: string;
  earnedReward: boolean;
}

// User Easter egg stats
export interface EasterEggStats {
  userId: string;
  discoveredCount: number;
  completedCount: number;
  totalEasterEggs: number;
  percentageFound: number;
  byDifficulty: {
    easy: number;
    medium: number;
    hard: number;
  };
  byType: {
    quiz: number;
    fact: number;
    challenge: number;
    mini_game: number;
    hidden_message: number;
    achievement: number;
  };
  recentDiscoveries: {
    id: string;
    easterEggName: string;
    discoveredAt: string;
    completed: boolean;
  }[];
}

// API response types
export interface CheckEasterEggResponse {
  success: boolean;
  found: boolean;
  easterEgg?: EasterEgg;
  isNewDiscovery?: boolean;
  error?: string;
}

export interface CompleteEasterEggResponse {
  success: boolean;
  message?: string;
  reward?: EasterEggReward;
  error?: string;
}

export interface GetEasterEggStatsResponse {
  success: boolean;
  data?: EasterEggStats;
  error?: string;
}

// Easter egg storage interface
export interface EasterEggStorage {
  getAllEasterEggs(): Promise<EasterEgg[]>;
  getEasterEggById(id: string): Promise<EasterEgg | null>;
  getEasterEggsByPath(path: string): Promise<EasterEgg[]>;
  checkForEasterEgg(path: string, action: string | null): Promise<EasterEgg | null>;
  createEasterEgg(easterEgg: EasterEgg): Promise<EasterEgg>;
  updateEasterEgg(id: string, easterEgg: Partial<EasterEgg>): Promise<EasterEgg | null>;
  deleteEasterEgg(id: string): Promise<boolean>;
  
  getUserDiscoveries(userId: string): Promise<EasterEggDiscovery[]>;
  addUserDiscovery(discovery: Omit<EasterEggDiscovery, 'id'>): Promise<EasterEggDiscovery>;
  updateUserDiscovery(id: string, discovery: Partial<EasterEggDiscovery>): Promise<EasterEggDiscovery | null>;
  getUserStats(userId: string): Promise<EasterEggStats>;
}