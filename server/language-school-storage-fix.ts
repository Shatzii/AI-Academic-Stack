import { eq } from 'drizzle-orm';
import { db } from './db';
import * as schema from '../shared/schema';
import { MemStorage } from './storage';
import crypto from 'crypto';

// Make sure maps exist in MemStorage
function ensureMapsExist(memStorage: any) {
  if (!memStorage.languageCourses) {
    memStorage.languageCourses = new Map();
  }
  if (!memStorage.languageModules) {
    memStorage.languageModules = new Map();
  }
  if (!memStorage.languageMissions) {
    memStorage.languageMissions = new Map();
  }
  if (!memStorage.vocabularyLists) {
    memStorage.vocabularyLists = new Map();
  }
  if (!memStorage.vocabularyWords) {
    memStorage.vocabularyWords = new Map();
  }
  if (!memStorage.userLanguageProgress) {
    memStorage.userLanguageProgress = new Map();
  }
  if (!memStorage.userVocabularyProgress) {
    memStorage.userVocabularyProgress = new Map();
  }
}

// Define the missing Language School methods to add to MemStorage prototype
const methodsToAdd: Record<string, Function> = {
  // Language Course Methods
  async getLanguageCourses(): Promise<LanguageCourse[]> {
    try {
      // First try to get courses from the database
      const dbCourses = await db.query.languageCourses.findMany();
      
      if (dbCourses && dbCourses.length > 0) {
        // Update in-memory storage
        for (const course of dbCourses) {
          this.languageCourses.set(course.id, course);
        }
        return dbCourses;
      }
      
      // Fallback to in-memory if database has no data
      return [...this.languageCourses.values()];
    } catch (error) {
      console.error('Error fetching language courses:', error);
      return [...this.languageCourses.values()];
    }
  },

  async getLanguageCourseById(id: string): Promise<LanguageCourse | undefined> {
    try {
      // First try to get from the database
      const dbCourse = await db.query.languageCourses.findFirst({
        where: eq(schema.languageCourses.id, id)
      });
      
      if (dbCourse) {
        // Update in-memory storage
        this.languageCourses.set(dbCourse.id, dbCourse);
        return dbCourse;
      }
      
      // Fallback to in-memory if not found in database
      return this.languageCourses.get(id);
    } catch (error) {
      console.error(`Error fetching language course with id ${id}:`, error);
      return this.languageCourses.get(id);
    }
  },

  async getLanguageCoursesByLanguage(language: string): Promise<LanguageCourse[]> {
    try {
      // First try to get from the database
      const dbCourses = await db.query.languageCourses.findMany({
        where: eq(schema.languageCourses.language, language)
      });
      
      if (dbCourses && dbCourses.length > 0) {
        // Update in-memory storage
        for (const course of dbCourses) {
          this.languageCourses.set(course.id, course);
        }
        return dbCourses;
      }
      
      // Fallback to in-memory if database has no data
      return [...this.languageCourses.values()].filter(
        course => course.language === language
      );
    } catch (error) {
      console.error(`Error fetching language courses for language ${language}:`, error);
      return [...this.languageCourses.values()].filter(
        course => course.language === language
      );
    }
  },

  async getLanguageCoursesByProficiency(proficiencyLevel: string): Promise<LanguageCourse[]> {
    try {
      // First try to get from the database
      const dbCourses = await db.query.languageCourses.findMany({
        where: eq(schema.languageCourses.proficiencyLevel, proficiencyLevel)
      });
      
      if (dbCourses && dbCourses.length > 0) {
        // Update in-memory storage
        for (const course of dbCourses) {
          this.languageCourses.set(course.id, course);
        }
        return dbCourses;
      }
      
      // Fallback to in-memory if database has no data
      return [...this.languageCourses.values()].filter(
        course => course.proficiencyLevel === proficiencyLevel
      );
    } catch (error) {
      console.error(`Error fetching language courses for proficiency ${proficiencyLevel}:`, error);
      return [...this.languageCourses.values()].filter(
        course => course.proficiencyLevel === proficiencyLevel
      );
    }
  },

  async createLanguageCourse(course: any): Promise<LanguageCourse> {
    try {
      // First try to insert into the database
      const newCourse = await db.insert(schema.languageCourses)
        .values(course)
        .returning();
      
      if (newCourse && newCourse.length > 0) {
        // Update in-memory storage
        this.languageCourses.set(newCourse[0].id, newCourse[0]);
        return newCourse[0];
      }
      
      // Fallback to in-memory if database insert fails
      const newId = crypto.randomUUID();
      const newLanguageCourse = {
        ...course,
        id: newId,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.languageCourses.set(newId, newLanguageCourse);
      return newLanguageCourse;
    } catch (error) {
      console.error('Error creating language course:', error);
      
      // Fallback to in-memory storage
      const newId = crypto.randomUUID();
      const newLanguageCourse = {
        ...course,
        id: newId,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.languageCourses.set(newId, newLanguageCourse);
      return newLanguageCourse;
    }
  },

  async updateLanguageCourse(id: string, course: any): Promise<LanguageCourse | undefined> {
    try {
      // First try to update in the database
      const updatedCourse = await db.update(schema.languageCourses)
        .set({ ...course, updatedAt: new Date() })
        .where(eq(schema.languageCourses.id, id))
        .returning();
      
      if (updatedCourse && updatedCourse.length > 0) {
        // Update in-memory storage
        this.languageCourses.set(id, updatedCourse[0]);
        return updatedCourse[0];
      }
      
      // Fallback to in-memory if database update fails
      const existingCourse = this.languageCourses.get(id);
      if (!existingCourse) {
        return undefined;
      }
      
      const updatedLanguageCourse = {
        ...existingCourse,
        ...course,
        updatedAt: new Date()
      };
      this.languageCourses.set(id, updatedLanguageCourse);
      return updatedLanguageCourse;
    } catch (error) {
      console.error(`Error updating language course with id ${id}:`, error);
      
      // Fallback to in-memory storage
      const existingCourse = this.languageCourses.get(id);
      if (!existingCourse) {
        return undefined;
      }
      
      const updatedLanguageCourse = {
        ...existingCourse,
        ...course,
        updatedAt: new Date()
      };
      this.languageCourses.set(id, updatedLanguageCourse);
      return updatedLanguageCourse;
    }
  },

  async deleteLanguageCourse(id: string): Promise<boolean> {
    try {
      // First try to delete from the database
      const deletedCourse = await db.delete(schema.languageCourses)
        .where(eq(schema.languageCourses.id, id))
        .returning();
      
      // Delete from in-memory storage
      const deleted = this.languageCourses.delete(id);
      
      return deleted || (deletedCourse && deletedCourse.length > 0);
    } catch (error) {
      console.error(`Error deleting language course with id ${id}:`, error);
      
      // Fallback to in-memory storage
      return this.languageCourses.delete(id);
    }
  },

  // Language Mission Methods
  async getLanguageMissions(moduleId: string): Promise<LanguageMission[]> {
    try {
      // First try to get missions from the database
      const dbMissions = await db.query.languageMissions.findMany({
        where: eq(schema.languageMissions.moduleId, moduleId)
      });
      
      if (dbMissions && dbMissions.length > 0) {
        // Update in-memory storage
        for (const mission of dbMissions) {
          this.languageMissions.set(mission.id, mission);
        }
        return dbMissions;
      }
      
      // Fallback to in-memory if database has no data
      return [...this.languageMissions.values()].filter(
        mission => mission.moduleId === moduleId
      );
    } catch (error) {
      console.error(`Error fetching language missions for module ${moduleId}:`, error);
      return [...this.languageMissions.values()].filter(
        mission => mission.moduleId === moduleId
      );
    }
  },

  async getLanguageMissionById(id: string): Promise<LanguageMission | undefined> {
    try {
      // First try to get from the database
      const dbMission = await db.query.languageMissions.findFirst({
        where: eq(schema.languageMissions.id, id)
      });
      
      if (dbMission) {
        // Update in-memory storage
        this.languageMissions.set(dbMission.id, dbMission);
        return dbMission;
      }
      
      // Fallback to in-memory if not found in database
      return this.languageMissions.get(id);
    } catch (error) {
      console.error(`Error fetching language mission with id ${id}:`, error);
      return this.languageMissions.get(id);
    }
  },

  async createLanguageMission(mission: any): Promise<LanguageMission> {
    try {
      // First try to insert into the database
      const newMission = await db.insert(schema.languageMissions)
        .values(mission)
        .returning();
      
      if (newMission && newMission.length > 0) {
        // Update in-memory storage
        this.languageMissions.set(newMission[0].id, newMission[0]);
        return newMission[0];
      }
      
      // Fallback to in-memory if database insert fails
      const newId = crypto.randomUUID();
      const newLanguageMission = {
        ...mission,
        id: newId,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.languageMissions.set(newId, newLanguageMission);
      return newLanguageMission;
    } catch (error) {
      console.error('Error creating language mission:', error);
      
      // Fallback to in-memory storage
      const newId = crypto.randomUUID();
      const newLanguageMission = {
        ...mission,
        id: newId,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.languageMissions.set(newId, newLanguageMission);
      return newLanguageMission;
    }
  },

  // Vocabulary List Methods
  async getVocabularyLists(): Promise<VocabularyList[]> {
    try {
      // Use the DatabaseStorage implementation
      if (this.constructor.name === 'DatabaseStorage') {
        return await db.select().from(schema.vocabularyLists);
      }
      
      // First try to get lists from the database
      const dbLists = await db.select().from(schema.vocabularyLists);
      
      if (dbLists && dbLists.length > 0) {
        // Update in-memory storage
        for (const list of dbLists) {
          this.vocabularyLists.set(list.id, list);
        }
        return dbLists;
      }
      
      // Fallback to in-memory if database has no data
      return [...this.vocabularyLists.values()];
    } catch (error) {
      console.error('Error fetching vocabulary lists:', error);
      return [...this.vocabularyLists.values()];
    }
  },

  async getVocabularyListById(id: string): Promise<VocabularyList | undefined> {
    try {
      // First try to get from the database
      const dbList = await db.query.vocabularyLists.findFirst({
        where: eq(schema.vocabularyLists.id, id)
      });
      
      if (dbList) {
        // Update in-memory storage
        this.vocabularyLists.set(dbList.id, dbList);
        return dbList;
      }
      
      // Fallback to in-memory if not found in database
      return this.vocabularyLists.get(id);
    } catch (error) {
      console.error(`Error fetching vocabulary list with id ${id}:`, error);
      return this.vocabularyLists.get(id);
    }
  },

  async getVocabularyWords(listId: string): Promise<VocabularyWord[]> {
    try {
      // First try to get words from the database
      const dbWords = await db.query.vocabularyWords.findMany({
        where: eq(schema.vocabularyWords.listId, listId)
      });
      
      if (dbWords && dbWords.length > 0) {
        // Update in-memory storage
        for (const word of dbWords) {
          this.vocabularyWords.set(word.id, word);
        }
        return dbWords;
      }
      
      // Fallback to in-memory if database has no data
      return [...this.vocabularyWords.values()].filter(
        word => word.listId === listId
      );
    } catch (error) {
      console.error(`Error fetching vocabulary words for list ${listId}:`, error);
      return [...this.vocabularyWords.values()].filter(
        word => word.listId === listId
      );
    }
  },

  // User Progress Methods
  async getUserLanguageProgress(userId: string): Promise<UserLanguageProgress[]> {
    try {
      // First try to get progress from the database
      const dbProgress = await db.query.userLanguageProgress.findMany({
        where: eq(schema.userLanguageProgress.userId, userId)
      });
      
      if (dbProgress && dbProgress.length > 0) {
        // Update in-memory storage
        for (const progress of dbProgress) {
          const key = `${userId}-${progress.courseId}-${progress.moduleId}`;
          this.userLanguageProgress.set(key, progress);
        }
        return dbProgress;
      }
      
      // Fallback to in-memory if database has no data
      return [...this.userLanguageProgress.values()].filter(
        progress => progress.userId === userId
      );
    } catch (error) {
      console.error(`Error fetching language progress for user ${userId}:`, error);
      return [...this.userLanguageProgress.values()].filter(
        progress => progress.userId === userId
      );
    }
  },

  async getUserVocabularyProgress(userId: string): Promise<UserVocabularyProgress[]> {
    try {
      // First try to get progress from the database
      const dbProgress = await db.query.userVocabularyProgress.findMany({
        where: eq(schema.userVocabularyProgress.userId, userId)
      });
      
      if (dbProgress && dbProgress.length > 0) {
        // Update in-memory storage
        for (const progress of dbProgress) {
          const key = `${userId}-${progress.wordId}`;
          this.userVocabularyProgress.set(key, progress);
        }
        return dbProgress;
      }
      
      // Fallback to in-memory if database has no data
      return [...this.userVocabularyProgress.values()].filter(
        progress => progress.userId === userId
      );
    } catch (error) {
      console.error(`Error fetching vocabulary progress for user ${userId}:`, error);
      return [...this.userVocabularyProgress.values()].filter(
        progress => progress.userId === userId
      );
    }
  },
  async getLanguageModules(): Promise<any[]> {
    try {
      // Use the DatabaseStorage implementation
      if (this.constructor.name === 'DatabaseStorage') {
        return await db.select().from(schema.languageModules);
      }
      
      // First try to get modules from the database
      const dbModules = await db.select().from(schema.languageModules);
      
      if (dbModules && dbModules.length > 0) {
        // Update in-memory storage
        for (const module of dbModules) {
          this.languageModules.set(module.id, module);
        }
        return dbModules;
      }
      
      // Fallback to in-memory if database has no data
      return [...this.languageModules.values()];
    } catch (error) {
      console.error('Error fetching language modules:', error);
      return [...this.languageModules.values()];
    }
  },

  async getLanguageModule(id: number): Promise<any | undefined> {
    try {
      // First try to get from the database
      const dbModule = await db.query.languageModules.findFirst({
        where: eq(schema.languageModules.id, id)
      });
      
      if (dbModule) {
        // Update in-memory storage
        this.languageModules.set(dbModule.id, dbModule);
        return dbModule;
      }
      
      // Fallback to in-memory if not found in database
      return this.languageModules.get(id);
    } catch (error) {
      console.error(`Error fetching language module with id ${id}:`, error);
      return this.languageModules.get(id);
    }
  },

  async getLanguageModulesByCourse(courseId: number): Promise<any[]> {
    try {
      // First try to get from the database
      const dbModules = await db.query.languageModules.findMany({
        where: eq(schema.languageModules.courseId, courseId)
      });
      
      if (dbModules && dbModules.length > 0) {
        // Update in-memory storage
        for (const module of dbModules) {
          this.languageModules.set(module.id, module);
        }
        return dbModules;
      }
      
      // Fallback to in-memory if database has no data
      return [...this.languageModules.values()].filter(
        module => module.courseId === courseId
      );
    } catch (error) {
      console.error(`Error fetching language modules for course ${courseId}:`, error);
      return [...this.languageModules.values()].filter(
        module => module.courseId === courseId
      );
    }
  },

  async getLanguageModulesByType(moduleType: string): Promise<any[]> {
    try {
      // First try to get from the database
      const dbModules = await db.query.languageModules.findMany({
        where: eq(schema.languageModules.type, moduleType)
      });
      
      if (dbModules && dbModules.length > 0) {
        // Update in-memory storage
        for (const module of dbModules) {
          this.languageModules.set(module.id, module);
        }
        return dbModules;
      }
      
      // Fallback to in-memory if database has no data
      return [...this.languageModules.values()].filter(
        module => module.type === moduleType
      );
    } catch (error) {
      console.error(`Error fetching language modules of type ${moduleType}:`, error);
      return [...this.languageModules.values()].filter(
        module => module.type === moduleType
      );
    }
  },

  async getLanguageModulesByDifficulty(difficulty: string): Promise<any[]> {
    try {
      // First try to get from the database
      const dbModules = await db.query.languageModules.findMany({
        where: eq(schema.languageModules.difficulty, difficulty)
      });
      
      if (dbModules && dbModules.length > 0) {
        // Update in-memory storage
        for (const module of dbModules) {
          this.languageModules.set(module.id, module);
        }
        return dbModules;
      }
      
      // Fallback to in-memory if database has no data
      return [...this.languageModules.values()].filter(
        module => module.difficulty === difficulty
      );
    } catch (error) {
      console.error(`Error fetching language modules with difficulty ${difficulty}:`, error);
      return [...this.languageModules.values()].filter(
        module => module.difficulty === difficulty
      );
    }
  },

  async createLanguageModule(module: any): Promise<any> {
    try {
      // First try to insert into the database
      const newModule = await db.insert(schema.languageModules)
        .values(module)
        .returning();
      
      if (newModule && newModule.length > 0) {
        // Update in-memory storage
        this.languageModules.set(newModule[0].id, newModule[0]);
        return newModule[0];
      }
      
      // Fallback to in-memory if database insert fails
      const newId = Math.max(0, ...[...this.languageModules.keys()]) + 1;
      const newLanguageModule = {
        ...module,
        id: newId,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.languageModules.set(newId, newLanguageModule);
      return newLanguageModule;
    } catch (error) {
      console.error('Error creating language module:', error);
      
      // Fallback to in-memory storage
      const newId = Math.max(0, ...[...this.languageModules.keys()]) + 1;
      const newLanguageModule = {
        ...module,
        id: newId,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.languageModules.set(newId, newLanguageModule);
      return newLanguageModule;
    }
  },

  async updateLanguageModule(id: number, module: any): Promise<any | undefined> {
    try {
      // First try to update in the database
      const updatedModule = await db.update(schema.languageModules)
        .set({ ...module, updatedAt: new Date() })
        .where(eq(schema.languageModules.id, id))
        .returning();
      
      if (updatedModule && updatedModule.length > 0) {
        // Update in-memory storage
        this.languageModules.set(id, updatedModule[0]);
        return updatedModule[0];
      }
      
      // Fallback to in-memory if database update fails
      const existingModule = this.languageModules.get(id);
      if (!existingModule) {
        return undefined;
      }
      
      const updatedLanguageModule = {
        ...existingModule,
        ...module,
        updatedAt: new Date()
      };
      this.languageModules.set(id, updatedLanguageModule);
      return updatedLanguageModule;
    } catch (error) {
      console.error(`Error updating language module with id ${id}:`, error);
      
      // Fallback to in-memory storage
      const existingModule = this.languageModules.get(id);
      if (!existingModule) {
        return undefined;
      }
      
      const updatedLanguageModule = {
        ...existingModule,
        ...module,
        updatedAt: new Date()
      };
      this.languageModules.set(id, updatedLanguageModule);
      return updatedLanguageModule;
    }
  },

  async deleteLanguageModule(id: number): Promise<boolean> {
    try {
      // First try to delete from the database
      const deletedModule = await db.delete(schema.languageModules)
        .where(eq(schema.languageModules.id, id))
        .returning();
      
      // Delete from in-memory storage
      const deleted = this.languageModules.delete(id);
      
      return deleted || (deletedModule && deletedModule.length > 0);
    } catch (error) {
      console.error(`Error deleting language module with id ${id}:`, error);
      
      // Fallback to in-memory storage
      return this.languageModules.delete(id);
    }
  }
};

// Apply the missing methods to MemStorage prototype
export function applyMissingLanguageSchoolMethods() {
  // First ensure the maps exist
  const memStorage = MemStorage.prototype as any;
  
  // Initialize maps if they don't exist
  if (!memStorage.languageCourses) {
    memStorage.languageCourses = new Map();
  }
  if (!memStorage.languageModules) {
    memStorage.languageModules = new Map();
  }
  if (!memStorage.languageMissions) {
    memStorage.languageMissions = new Map();
  }
  if (!memStorage.vocabularyLists) {
    memStorage.vocabularyLists = new Map();
  }
  if (!memStorage.vocabularyWords) {
    memStorage.vocabularyWords = new Map();
  }
  if (!memStorage.userLanguageProgress) {
    memStorage.userLanguageProgress = new Map();
  }
  if (!memStorage.userVocabularyProgress) {
    memStorage.userVocabularyProgress = new Map();
  }
  
  // Apply methods
  for (const [methodName, methodFunction] of Object.entries(methodsToAdd)) {
    memStorage[methodName] = methodFunction;
  }
  
  console.log('✅ Applied missing language school methods to MemStorage');
}