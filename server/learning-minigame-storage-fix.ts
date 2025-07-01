/**
 * Learning Mini-Game Storage Fix
 * 
 * This module adds learning mini-game methods to the main MemStorage class
 * for handling interactive learning progress mini-games.
 */

import { MemStorage } from './storage';
import { LearningMiniGameMemStorage } from './storage/learning-minigame-storage';
import type { 
  ILearningMiniGameStorage, 
  InsertLearningMiniGame, 
  InsertMiniGameContent, 
  InsertUserMiniGameActivity, 
  InsertUserMiniGameProgress, 
  LearningMiniGame, 
  MiniGameContent, 
  MiniGameRecommendation, 
  MiniGameStats, 
  UserMiniGameActivity, 
  UserMiniGameProgress 
} from './storage/learning-minigame-storage';

let learningMiniGameStorage: LearningMiniGameMemStorage | null = null;

/**
 * Applies the learning mini-game methods to the MemStorage instance
 * This function should be called once during server initialization
 */
export function applyMissingLearningMiniGameMethods() {
  console.log('Applying missing learning mini-game methods to MemStorage...');
  
  // Initialize the learning mini-game storage if not already done
  if (!learningMiniGameStorage) {
    learningMiniGameStorage = new LearningMiniGameMemStorage();
  }
  
  const prototype = Object.getPrototypeOf(MemStorage.prototype);
  
  // Add learning mini-game methods to MemStorage
  prototype.getMiniGames = async function(): Promise<LearningMiniGame[]> {
    return learningMiniGameStorage!.getMiniGames();
  };
  
  prototype.getMiniGame = async function(id: number): Promise<LearningMiniGame | undefined> {
    return learningMiniGameStorage!.getMiniGame(id);
  };
  
  prototype.getMiniGamesByType = async function(gameType: string): Promise<LearningMiniGame[]> {
    return learningMiniGameStorage!.getMiniGamesByType(gameType);
  };
  
  prototype.getMiniGamesBySubject = async function(subject: string): Promise<LearningMiniGame[]> {
    return learningMiniGameStorage!.getMiniGamesBySubject(subject);
  };
  
  prototype.getMiniGamesByGradeLevel = async function(gradeLevel: string): Promise<LearningMiniGame[]> {
    return learningMiniGameStorage!.getMiniGamesByGradeLevel(gradeLevel);
  };
  
  prototype.getMiniGamesByDifficulty = async function(difficulty: number): Promise<LearningMiniGame[]> {
    return learningMiniGameStorage!.getMiniGamesByDifficulty(difficulty);
  };
  
  prototype.createMiniGame = async function(game: InsertLearningMiniGame): Promise<LearningMiniGame> {
    return learningMiniGameStorage!.createMiniGame(game);
  };
  
  prototype.updateMiniGame = async function(id: number, game: Partial<InsertLearningMiniGame>): Promise<LearningMiniGame | undefined> {
    return learningMiniGameStorage!.updateMiniGame(id, game);
  };
  
  prototype.deleteMiniGame = async function(id: number): Promise<boolean> {
    return learningMiniGameStorage!.deleteMiniGame(id);
  };
  
  // Game content operations
  prototype.getMiniGameContents = async function(gameId: number): Promise<MiniGameContent[]> {
    return learningMiniGameStorage!.getMiniGameContents(gameId);
  };
  
  prototype.getMiniGameContent = async function(id: number): Promise<MiniGameContent | undefined> {
    return learningMiniGameStorage!.getMiniGameContent(id);
  };
  
  prototype.createMiniGameContent = async function(content: InsertMiniGameContent): Promise<MiniGameContent> {
    return learningMiniGameStorage!.createMiniGameContent(content);
  };
  
  prototype.updateMiniGameContent = async function(id: number, content: Partial<InsertMiniGameContent>): Promise<MiniGameContent | undefined> {
    return learningMiniGameStorage!.updateMiniGameContent(id, content);
  };
  
  prototype.deleteMiniGameContent = async function(id: number): Promise<boolean> {
    return learningMiniGameStorage!.deleteMiniGameContent(id);
  };
  
  // User progress operations
  prototype.getUserMiniGameProgress = async function(userId: number): Promise<UserMiniGameProgress[]> {
    return learningMiniGameStorage!.getUserMiniGameProgress(userId);
  };
  
  prototype.getUserMiniGameProgressByGame = async function(userId: number, gameId: number): Promise<UserMiniGameProgress | undefined> {
    return learningMiniGameStorage!.getUserMiniGameProgressByGame(userId, gameId);
  };
  
  prototype.createUserMiniGameProgress = async function(progress: InsertUserMiniGameProgress): Promise<UserMiniGameProgress> {
    return learningMiniGameStorage!.createUserMiniGameProgress(progress);
  };
  
  prototype.updateUserMiniGameProgress = async function(id: number, progress: Partial<InsertUserMiniGameProgress>): Promise<UserMiniGameProgress | undefined> {
    return learningMiniGameStorage!.updateUserMiniGameProgress(id, progress);
  };
  
  prototype.completeMiniGame = async function(userId: number, gameId: number, score: number, timeSpent: number): Promise<UserMiniGameProgress> {
    return learningMiniGameStorage!.completeMiniGame(userId, gameId, score, timeSpent);
  };
  
  // Activity tracking
  prototype.recordUserMiniGameActivity = async function(activity: InsertUserMiniGameActivity): Promise<UserMiniGameActivity> {
    return learningMiniGameStorage!.recordUserMiniGameActivity(activity);
  };
  
  prototype.getUserMiniGameActivities = async function(userId: number, gameId: number): Promise<UserMiniGameActivity[]> {
    return learningMiniGameStorage!.getUserMiniGameActivities(userId, gameId);
  };
  
  // Analytics
  prototype.getMiniGameStats = async function(userId: number): Promise<MiniGameStats> {
    return learningMiniGameStorage!.getMiniGameStats(userId);
  };
  
  prototype.getTopPerformingMiniGames = async function(limit?: number): Promise<{gameId: number, title: string, averageScore: number, timesPlayed: number}[]> {
    return learningMiniGameStorage!.getTopPerformingMiniGames(limit);
  };
  
  prototype.getMiniGameRecommendations = async function(userId: number): Promise<MiniGameRecommendation[]> {
    return learningMiniGameStorage!.getMiniGameRecommendations(userId);
  };
  
  console.log('Learning mini-game methods applied to MemStorage');
}