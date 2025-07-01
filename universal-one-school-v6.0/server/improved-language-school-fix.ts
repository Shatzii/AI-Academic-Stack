/**
 * Improved Language School Database Integration
 * 
 * This module provides enhanced database operations for the language school
 * component of ShatziiOS, ensuring proper persistence of language learning data.
 */

import { storage } from './storage';
import { db } from './db';
import { eq, and } from 'drizzle-orm';
import * as schema from '../shared/schema';

/**
 * Apply improved language school database integration
 */
export function applyImprovedLanguageSchoolMethods() {
  console.log('🔄 Applying improved language school database methods...');
  
  const anyStorage = storage as any;
  
  // Enhanced methods to ensure database operations
  anyStorage.getLanguageCourseById = async (courseId: number) => {
    try {
      const [course] = await db
        .select()
        .from(schema.languageCourses)
        .where(eq(schema.languageCourses.id, courseId));
      
      if (course) {
        console.log(`✅ Retrieved language course ${courseId} from database`);
        return course;
      }
    } catch (error) {
      console.error(`❌ Database error retrieving language course ${courseId}:`, error);
    }
    
    // Fall back to memory storage
    console.log(`ℹ️ Falling back to memory for language course ${courseId}`);
    const memCourse = anyStorage.languageCourses?.get(courseId);
    return memCourse || null;
  };
  
  anyStorage.createLanguageCourse = async (courseData: any) => {
    try {
      // Ensure required fields
      if (!courseData.language || !courseData.level || !courseData.title) {
        throw new Error('Missing required fields for language course');
      }
      
      // Use database for creation
      const [newCourse] = await db
        .insert(schema.languageCourses)
        .values({
          ...courseData,
          id: courseData.id || undefined,
          createdAt: new Date().toISOString(),
          active: true
        })
        .returning();
      
      console.log(`✅ Created language course in database: ${newCourse.title}`);
      
      // Also update memory storage for compatibility
      if (anyStorage.languageCourses && typeof anyStorage.languageCourses.set === 'function') {
        anyStorage.languageCourses.set(newCourse.id, newCourse);
      }
      
      return newCourse;
    } catch (error) {
      console.error('❌ Database error creating language course:', error);
      
      // Fall back to memory storage
      console.log('ℹ️ Falling back to memory for creating language course');
      const nextId = anyStorage.languageCourseCurrentId || 1;
      const newMemCourse = {
        ...courseData,
        id: nextId,
        createdAt: new Date().toISOString(),
        active: true
      };
      
      if (anyStorage.languageCourses && typeof anyStorage.languageCourses.set === 'function') {
        anyStorage.languageCourses.set(nextId, newMemCourse);
        anyStorage.languageCourseCurrentId = nextId + 1;
      }
      
      return newMemCourse;
    }
  };
  
  anyStorage.createVocabularyList = async (listData: any) => {
    try {
      // Ensure required fields
      if (!listData.name || !listData.language) {
        throw new Error('Missing required fields for vocabulary list');
      }
      
      // Use database for creation
      const [newList] = await db
        .insert(schema.vocabularyLists)
        .values({
          ...listData,
          id: listData.id || undefined,
          createdAt: new Date().toISOString(),
          active: true
        })
        .returning();
      
      console.log(`✅ Created vocabulary list in database: ${newList.name}`);
      
      // Also update memory storage for compatibility
      if (anyStorage.vocabularyLists && typeof anyStorage.vocabularyLists.set === 'function') {
        anyStorage.vocabularyLists.set(newList.id, newList);
      }
      
      return newList;
    } catch (error) {
      console.error('❌ Database error creating vocabulary list:', error);
      
      // Fall back to memory storage
      console.log('ℹ️ Falling back to memory for creating vocabulary list');
      const nextId = anyStorage.vocabularyListCurrentId || 1;
      const newMemList = {
        ...listData,
        id: nextId,
        createdAt: new Date().toISOString(),
        active: true
      };
      
      if (anyStorage.vocabularyLists && typeof anyStorage.vocabularyLists.set === 'function') {
        anyStorage.vocabularyLists.set(nextId, newMemList);
        anyStorage.vocabularyListCurrentId = nextId + 1;
      }
      
      return newMemList;
    }
  };
  
  anyStorage.createVocabularyItem = async (itemData: any) => {
    try {
      // Ensure required fields
      if (!itemData.term || !itemData.translation || !itemData.listId) {
        throw new Error('Missing required fields for vocabulary item');
      }
      
      // Use database for creation
      const [newItem] = await db
        .insert(schema.vocabularyItems)
        .values({
          ...itemData,
          id: itemData.id || undefined,
          createdAt: new Date().toISOString(),
          active: true
        })
        .returning();
      
      console.log(`✅ Created vocabulary item in database: ${newItem.term}`);
      
      // Also update memory storage for compatibility
      if (anyStorage.vocabularyItems && typeof anyStorage.vocabularyItems.set === 'function') {
        anyStorage.vocabularyItems.set(newItem.id, newItem);
      }
      
      return newItem;
    } catch (error) {
      console.error('❌ Database error creating vocabulary item:', error);
      
      // Fall back to memory storage
      console.log('ℹ️ Falling back to memory for creating vocabulary item');
      const nextId = anyStorage.vocabularyItemCurrentId || 1;
      const newMemItem = {
        ...itemData,
        id: nextId,
        createdAt: new Date().toISOString(),
        active: true
      };
      
      if (anyStorage.vocabularyItems && typeof anyStorage.vocabularyItems.set === 'function') {
        anyStorage.vocabularyItems.set(nextId, newMemItem);
        anyStorage.vocabularyItemCurrentId = nextId + 1;
      }
      
      return newMemItem;
    }
  };
  
  anyStorage.updateUserVocabularyProgress = async (userId: number, itemId: number, progressData: any) => {
    try {
      // Check if progress record exists
      const [existingProgress] = await db
        .select()
        .from(schema.userVocabularyProgress)
        .where(and(
          eq(schema.userVocabularyProgress.userId, userId),
          eq(schema.userVocabularyProgress.vocabularyItemId, itemId)
        ));
      
      if (existingProgress) {
        // Update existing progress
        const [updatedProgress] = await db
          .update(schema.userVocabularyProgress)
          .set({
            ...progressData,
            updatedAt: new Date().toISOString()
          })
          .where(eq(schema.userVocabularyProgress.id, existingProgress.id))
          .returning();
        
        console.log(`✅ Updated vocabulary progress in database for user ${userId} and item ${itemId}`);
        return updatedProgress;
      } else {
        // Create new progress record
        const [newProgress] = await db
          .insert(schema.userVocabularyProgress)
          .values({
            userId,
            vocabularyItemId: itemId,
            proficiencyLevel: progressData.proficiencyLevel || 0,
            lastReviewedAt: progressData.lastReviewedAt || new Date().toISOString(),
            reviewCount: progressData.reviewCount || 1,
            correctAnswers: progressData.correctAnswers || 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          })
          .returning();
        
        console.log(`✅ Created vocabulary progress in database for user ${userId} and item ${itemId}`);
        return newProgress;
      }
    } catch (error) {
      console.error(`❌ Database error updating vocabulary progress for user ${userId} and item ${itemId}:`, error);
      
      // Fall back to memory storage
      console.log(`ℹ️ Falling back to memory for vocabulary progress for user ${userId} and item ${itemId}`);
      
      // Implement memory fallback logic
      const progressMap = anyStorage.userVocabularyProgress || new Map();
      const key = `${userId}-${itemId}`;
      
      const existingProgress = progressMap.get(key);
      if (existingProgress) {
        const updatedProgress = {
          ...existingProgress,
          ...progressData,
          updatedAt: new Date().toISOString()
        };
        progressMap.set(key, updatedProgress);
        return updatedProgress;
      } else {
        const newProgress = {
          id: anyStorage.userVocabularyProgressCurrentId || 1,
          userId,
          vocabularyItemId: itemId,
          proficiencyLevel: progressData.proficiencyLevel || 0,
          lastReviewedAt: progressData.lastReviewedAt || new Date().toISOString(),
          reviewCount: progressData.reviewCount || 1,
          correctAnswers: progressData.correctAnswers || 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        progressMap.set(key, newProgress);
        anyStorage.userVocabularyProgress = progressMap;
        anyStorage.userVocabularyProgressCurrentId = (anyStorage.userVocabularyProgressCurrentId || 1) + 1;
        
        return newProgress;
      }
    }
  };
  
  console.log('✅ Applied improved language school database methods');
  return storage;
}