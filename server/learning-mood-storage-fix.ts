/**
 * Learning Mood Storage Fix
 * 
 * This module adds learning mood tracking methods to the main MemStorage class
 * for handling emoji-based mood tracking in learning experiences.
 */

import { IStorage, storage } from './storage';
import { LearningMoodMemStorage } from './storage/learning-mood-storage';
import { 
  LearningMood, 
  InsertLearningMood, 
  LearningMoodStats,
  LearningMoodFeedback
} from '../shared/learning-mood-types';

// Create a function to apply learning mood methods to the main storage
export function applyMissingLearningMoodMethods() {
  console.log('✅ Applying missing learning mood methods to MemStorage');
  
  // Create a new instance of our LearningMoodMemStorage
  const learningMoodStorage = new LearningMoodMemStorage();
  
  // Add Learning Mood tracking methods to the storage interface
  
  // Basic CRUD operations
  (storage as any).getLearningMoods = learningMoodStorage.getLearningMoods.bind(learningMoodStorage);
  (storage as any).getLearningMoodsByCategory = learningMoodStorage.getLearningMoodsByCategory.bind(learningMoodStorage);
  (storage as any).getLearningMoodsBySession = learningMoodStorage.getLearningMoodsBySession.bind(learningMoodStorage);
  (storage as any).getLearningMood = learningMoodStorage.getLearningMood.bind(learningMoodStorage);
  (storage as any).createLearningMood = learningMoodStorage.createLearningMood.bind(learningMoodStorage);
  (storage as any).deleteLearningMood = learningMoodStorage.deleteLearningMood.bind(learningMoodStorage);
  
  // Analytics and statistics
  (storage as any).getStudentMoodStats = learningMoodStorage.getStudentMoodStats.bind(learningMoodStorage);
  (storage as any).getMoodTrendsOverTime = learningMoodStorage.getMoodTrendsOverTime.bind(learningMoodStorage);
  
  // Feedback and suggestions
  (storage as any).generateMoodFeedback = learningMoodStorage.generateMoodFeedback.bind(learningMoodStorage);
  
  // Counter methods
  (storage as any).incrementMoodCounter = learningMoodStorage.incrementMoodCounter.bind(learningMoodStorage);
  (storage as any).getMoodCounts = learningMoodStorage.getMoodCounts.bind(learningMoodStorage);
  
  return storage;
}