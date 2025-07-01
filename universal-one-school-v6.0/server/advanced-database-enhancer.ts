/**
 * Advanced Database Storage Enhancer
 * 
 * This module provides a more comprehensive enhancement to the database storage
 * system, focusing on efficiently transitioning from memory storage to full
 * database persistence for the ShatziiOS platform.
 */

import { db, pool } from './db';
import { eq, and, sql } from 'drizzle-orm';
import { createTables } from './initialize-database-tables';
import * as schema from '../shared/schema';
import session from 'express-session';
import connectPg from 'connect-pg-simple';
import { storage, DatabaseStorage, MemStorage } from './storage';

// Create PostgreSQL session store
const PostgresSessionStore = connectPg(session);

// Track methods that have been enhanced
const enhancedMethods: Set<string> = new Set();

// List of methods that should be enhanced with database operations
const methodsToEnhance = [
  // User related
  'getUser',
  'getUserByUsername',
  'createUser',
  'updateUser',
  'updateUserXp',
  'updateUserAvatar',
  'updateUserMood',
  
  // Badge related
  'getBadges',
  'getUserBadges',
  'awardBadge',
  
  // Mission related
  'getMissions',
  'getMission',
  'createMission',
  'getUserMissions',
  'completeUserMission',
  
  // Vocabulary related
  'getVocabularyLists',
  'getVocabularyList',
  'createVocabularyList',
  'updateVocabularyList',
  'deleteVocabularyList',
  'getVocabularyItems',
  'getVocabularyItemsByList',
  'getVocabularyItem',
  'createVocabularyItem',
  'updateVocabularyItem',
  'deleteVocabularyItem',
  
  // Language related
  'getLanguageModules',
  'getLanguageModulesByCourse',
  'getLanguageModule',
  'createLanguageModule',
  'updateLanguageModule',
  'deleteLanguageModule',
  'getLanguageCourses',
  'getLanguageCourseById',
  'createLanguageCourse',
  'updateLanguageCourse',
  'getLanguageMissions',
  'getLanguageMissionById',
  'createLanguageMission',
  'getUserLanguageProgress',
  'getUserVocabularyProgress',
  
  // Neurodivergent School related
  'getSuperheroCurricula',
  'getSuperheroCurriculum',
  'createSuperheroCurriculum',
  'updateSuperheroCurriculum',
  'getSuperheroModules',
  'getSuperheroModule',
  'createSuperheroModule',
  'updateSuperheroModule',
  'getSuperheroMissions',
  'getSuperheroMission',
  'createSuperheroMission',
  'updateSuperheroMission',
  'getSuperheroMissionProgress',
  'updateSuperheroMissionProgress',
  'getLearningStyleResults',
  'getLearningStyleResult',
  'createLearningStyleResult',
  'getLearningPersonas',
  'getLearningPersona',
  'createLearningPersona',
  'getMoodEntries',
  'createMoodEntry',
  
  // Law School related
  'getBarExams',
  'getBarExam',
  'createBarExam',
  'updateBarExam',
  'getBarExamStudyPlans',
  'getBarExamStudyPlan',
  'createBarExamStudyPlan',
  'updateBarExamStudyPlan',
  'getBarExamMemoryAids',
  'getBarExamMemoryAid',
  'createBarExamMemoryAid',
  'updateBarExamMemoryAid'
];

/**
 * Apply advanced database enhancements to storage
 */
export function enhanceWithAdvancedDatabase() {
  console.log('🔄 Applying advanced database enhancements to storage...');
  
  // Initialize session store if needed
  if (storage instanceof MemStorage) {
    const memStorage = storage as any;
    if (!memStorage.sessionStore) {
      memStorage.sessionStore = new PostgresSessionStore({
        pool,
        createTableIfMissing: true
      });
      console.log('✅ Added PostgreSQL session store to MemStorage');
    }
  }
  
  // Add schema reference to storage
  const anyStorage = storage as any;
  anyStorage.schema = schema;

  // Create proxy for method calls to first try database and then fall back to memory
  const methodProxy = new Proxy(storage, {
    get(target, prop, receiver) {
      // Get the original method
      const originalMethod = Reflect.get(target, prop, receiver);
      
      // Only proxy function methods that should be enhanced
      if (typeof originalMethod === 'function' && 
          methodsToEnhance.includes(prop.toString()) && 
          !enhancedMethods.has(prop.toString())) {
        
        // Create an enhanced version of the method
        const enhancedMethod = async (...args: any[]) => {
          console.log(`🔄 Attempting database operation: ${prop.toString()}`);
          
          try {
            // Try to get a DatabaseStorage instance
            const dbStorage = new DatabaseStorage();
            const dbMethod = (dbStorage as any)[prop.toString()];
            
            if (typeof dbMethod === 'function') {
              // Try to execute the method with DatabaseStorage
              console.log(`✅ Using database for ${prop.toString()}`);
              return await dbMethod.apply(dbStorage, args);
            }
          } catch (error) {
            console.error(`❌ Error in database operation ${prop.toString()}:`, error);
          }
          
          // Fall back to original method
          console.log(`ℹ️ Falling back to MemStorage for ${prop.toString()}`);
          return originalMethod.apply(target, args);
        };
        
        // Mark this method as enhanced to avoid double-enhancement
        enhancedMethods.add(prop.toString());
        
        // Return the enhanced method
        return enhancedMethod;
      }
      
      // Return the original method for methods that shouldn't be enhanced
      return originalMethod;
    }
  });
  
  // Replace the global storage object with our proxied version
  for (const key of Object.getOwnPropertyNames(global)) {
    const value = (global as any)[key];
    if (value === storage) {
      (global as any)[key] = methodProxy;
      console.log(`✅ Replaced global storage reference: ${key}`);
    }
  }
  
  console.log('✅ Advanced database enhancements applied successfully');
  
  return methodProxy;
}

/**
 * Initialize missing database tables if needed
 */
export async function initializeDatabaseTables() {
  console.log('🔄 Checking database tables...');
  
  try {
    // === Check Language School Tables ===
    
    // Check if vocabulary lists table exists
    await db.select().from(schema.vocabularyLists).limit(1);
    console.log('✅ Vocabulary lists table exists');
  } catch (error) {
    console.error('❌ Vocabulary lists table does not exist:', error);
    console.log('🔄 Attempting to create missing tables via direct SQL...');
    await createTables();
  }
  
  try {
    // Check if language modules table exists
    await db.select().from(schema.languageModules).limit(1);
    console.log('✅ Language modules table exists');
  } catch (error) {
    console.error('❌ Language modules table does not exist:', error);
    console.log('🔄 Attempting to create missing tables via direct SQL...');
    await createTables();
  }
  
  try {
    // === Check Neurodivergent School Tables ===
    
    // Check if superhero curricula table exists
    await db.select().from(schema.superheroCurricula).limit(1);
    console.log('✅ Superhero curricula table exists');
  } catch (error) {
    console.error('❌ Superhero curricula table does not exist:', error);
    console.log('🔄 Attempting to create missing tables via direct SQL...');
    await createTables();
  }
  
  try {
    // Check if learning style results table exists
    await db.select().from(schema.learningStyleResults).limit(1);
    console.log('✅ Learning style results table exists');
  } catch (error) {
    console.error('❌ Learning style results table does not exist:', error);
    console.log('🔄 Attempting to create missing tables via direct SQL...');
    await createTables();
  }
  
  try {
    // === Check Law School Tables ===
    
    // Check if bar exams table exists
    await db.select().from(schema.barExams).limit(1);
    console.log('✅ Bar exams table exists');
  } catch (error) {
    console.error('❌ Bar exams table does not exist:', error);
    console.log('🔄 Attempting to create missing tables via direct SQL...');
    await createTables();
  }
  
  console.log('🔄 Database table check complete');
}

/**
 * Migrate specific data from memory to database
 */
export async function migrateDataToDatabase() {
  console.log('🔄 Starting migration of data to database...');
  
  // Only run if we're using a memory storage
  if (!(storage instanceof MemStorage)) {
    console.log('ℹ️ Not using MemStorage, skipping migration');
    return;
  }
  
  const memStorage = storage as any;
  
  // Migrate vocabulary lists
  try {
    if (memStorage.vocabularyLists && memStorage.vocabularyLists.size > 0) {
      console.log(`🔄 Migrating ${memStorage.vocabularyLists.size} vocabulary lists to database...`);
      
      for (const [id, list] of memStorage.vocabularyLists.entries()) {
        try {
          // Check if this list already exists in the database
          const [existingList] = await db.select()
            .from(schema.vocabularyLists)
            .where(eq(schema.vocabularyLists.id, id));
          
          if (!existingList) {
            // Insert the list into the database
            await db.insert(schema.vocabularyLists)
              .values({
                ...list,
                id: Number(id)
              });
              
            console.log(`✅ Migrated vocabulary list: ${list.name}`);
          } else {
            console.log(`ℹ️ Vocabulary list already exists in database: ${list.name}`);
          }
        } catch (error) {
          console.error(`❌ Error migrating vocabulary list ${id}:`, error);
        }
      }
    }
  } catch (error) {
    console.error('❌ Error migrating vocabulary lists:', error);
  }
  
  // Migrate vocabulary items
  try {
    if (memStorage.vocabularyItems && memStorage.vocabularyItems.size > 0) {
      console.log(`🔄 Migrating ${memStorage.vocabularyItems.size} vocabulary items to database...`);
      
      for (const [id, item] of memStorage.vocabularyItems.entries()) {
        try {
          // Check if this item already exists in the database
          const [existingItem] = await db.select()
            .from(schema.vocabularyItems)
            .where(eq(schema.vocabularyItems.id, id));
          
          if (!existingItem) {
            // Insert the item into the database
            await db.insert(schema.vocabularyItems)
              .values({
                ...item,
                id: Number(id)
              });
              
            console.log(`✅ Migrated vocabulary item: ${item.term}`);
          } else {
            console.log(`ℹ️ Vocabulary item already exists in database: ${item.term}`);
          }
        } catch (error) {
          console.error(`❌ Error migrating vocabulary item ${id}:`, error);
        }
      }
    }
  } catch (error) {
    console.error('❌ Error migrating vocabulary items:', error);
  }
  
  // Migrate language modules
  try {
    if (memStorage.languageModules && memStorage.languageModules.size > 0) {
      console.log(`🔄 Migrating ${memStorage.languageModules.size} language modules to database...`);
      
      for (const [id, module] of memStorage.languageModules.entries()) {
        try {
          // Check if this module already exists in the database
          const [existingModule] = await db.select()
            .from(schema.languageModules)
            .where(eq(schema.languageModules.id, id));
          
          if (!existingModule) {
            // Insert the module into the database
            await db.insert(schema.languageModules)
              .values({
                ...module,
                id: Number(id)
              });
              
            console.log(`✅ Migrated language module: ${module.title}`);
          } else {
            console.log(`ℹ️ Language module already exists in database: ${module.title}`);
          }
        } catch (error) {
          console.error(`❌ Error migrating language module ${id}:`, error);
        }
      }
    }
  } catch (error) {
    console.error('❌ Error migrating language modules:', error);
  }
  
  // === Migrate Neurodivergent School Data ===
  
  // Migrate superhero curricula
  try {
    if (memStorage.superheroCurricula && memStorage.superheroCurricula.size > 0) {
      console.log(`🔄 Migrating ${memStorage.superheroCurricula.size} superhero curricula to database...`);
      
      for (const [id, curriculum] of memStorage.superheroCurricula.entries()) {
        try {
          // Check if this curriculum already exists in the database
          const [existingCurriculum] = await db.select()
            .from(schema.superheroCurricula)
            .where(eq(schema.superheroCurricula.id, id));
          
          if (!existingCurriculum) {
            // Insert the curriculum into the database
            await db.insert(schema.superheroCurricula)
              .values({
                ...curriculum,
                id: Number(id)
              });
              
            console.log(`✅ Migrated superhero curriculum: ${curriculum.title}`);
          } else {
            console.log(`ℹ️ Superhero curriculum already exists in database: ${curriculum.title}`);
          }
        } catch (error) {
          console.error(`❌ Error migrating superhero curriculum ${id}:`, error);
        }
      }
    }
  } catch (error) {
    console.error('❌ Error migrating superhero curricula:', error);
  }
  
  // Migrate superhero modules
  try {
    if (memStorage.superheroModules && memStorage.superheroModules.size > 0) {
      console.log(`🔄 Migrating ${memStorage.superheroModules.size} superhero modules to database...`);
      
      for (const [id, module] of memStorage.superheroModules.entries()) {
        try {
          // Check if this module already exists in the database
          const [existingModule] = await db.select()
            .from(schema.superheroModules)
            .where(eq(schema.superheroModules.id, id));
          
          if (!existingModule) {
            // Insert the module into the database
            await db.insert(schema.superheroModules)
              .values({
                ...module,
                id: Number(id)
              });
              
            console.log(`✅ Migrated superhero module: ${module.title}`);
          } else {
            console.log(`ℹ️ Superhero module already exists in database: ${module.title}`);
          }
        } catch (error) {
          console.error(`❌ Error migrating superhero module ${id}:`, error);
        }
      }
    }
  } catch (error) {
    console.error('❌ Error migrating superhero modules:', error);
  }
  
  // Migrate learning style results
  try {
    if (memStorage.learningStyleResults && memStorage.learningStyleResults.size > 0) {
      console.log(`🔄 Migrating ${memStorage.learningStyleResults.size} learning style results to database...`);
      
      for (const [id, result] of memStorage.learningStyleResults.entries()) {
        try {
          // Check if this result already exists in the database
          const [existingResult] = await db.select()
            .from(schema.learningStyleResults)
            .where(eq(schema.learningStyleResults.id, id));
          
          if (!existingResult) {
            // Insert the result into the database
            await db.insert(schema.learningStyleResults)
              .values({
                ...result,
                id: Number(id)
              });
              
            console.log(`✅ Migrated learning style result for user: ${result.user_id}`);
          } else {
            console.log(`ℹ️ Learning style result already exists in database for user: ${result.user_id}`);
          }
        } catch (error) {
          console.error(`❌ Error migrating learning style result ${id}:`, error);
        }
      }
    }
  } catch (error) {
    console.error('❌ Error migrating learning style results:', error);
  }
  
  // === Migrate Law School Data ===
  
  // Migrate bar exams
  try {
    if (memStorage.barExams && memStorage.barExams.size > 0) {
      console.log(`🔄 Migrating ${memStorage.barExams.size} bar exams to database...`);
      
      for (const [id, exam] of memStorage.barExams.entries()) {
        try {
          // Check if this exam already exists in the database
          const [existingExam] = await db.select()
            .from(schema.barExams)
            .where(eq(schema.barExams.id, id));
          
          if (!existingExam) {
            // Insert the exam into the database
            await db.insert(schema.barExams)
              .values({
                ...exam,
                id: Number(id)
              });
              
            console.log(`✅ Migrated bar exam: ${exam.name}`);
          } else {
            console.log(`ℹ️ Bar exam already exists in database: ${exam.name}`);
          }
        } catch (error) {
          console.error(`❌ Error migrating bar exam ${id}:`, error);
        }
      }
    }
  } catch (error) {
    console.error('❌ Error migrating bar exams:', error);
  }
  
  console.log('✅ Data migration complete');
}