/**
 * Direct Database Table Initialization
 * 
 * This script manually creates the necessary database tables for the ShatziiOS platform
 * as an alternative to using drizzle-kit when it's having issues.
 */

import { db, pool } from './db';
import { sql } from 'drizzle-orm';

async function createTables() {
  console.log('🔄 Directly creating database tables...');
  
  try {
    // === Language School Tables ===
    
    // Create vocabularyLists table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "vocabularyLists" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "language" TEXT NOT NULL,
        "level" TEXT,
        "category" TEXT,
        "createdAt" TEXT,
        "active" BOOLEAN DEFAULT true
      );
    `);
    console.log('✅ Created vocabularyLists table');
    
    // Create vocabularyItems table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "vocabularyItems" (
        "id" SERIAL PRIMARY KEY,
        "term" TEXT NOT NULL,
        "translation" TEXT NOT NULL,
        "pronunciation" TEXT,
        "example" TEXT,
        "notes" TEXT,
        "partOfSpeech" TEXT,
        "difficulty" TEXT,
        "listId" INTEGER NOT NULL REFERENCES "vocabularyLists"("id"),
        "createdAt" TEXT,
        "active" BOOLEAN DEFAULT true
      );
    `);
    console.log('✅ Created vocabularyItems table');
    
    // Create userVocabularyProgress table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "userVocabularyProgress" (
        "id" SERIAL PRIMARY KEY,
        "userId" INTEGER NOT NULL,
        "vocabularyItemId" INTEGER NOT NULL REFERENCES "vocabularyItems"("id"),
        "proficiencyLevel" INTEGER DEFAULT 0,
        "lastReviewedAt" TEXT,
        "reviewCount" INTEGER DEFAULT 0,
        "correctAnswers" INTEGER DEFAULT 0,
        "createdAt" TEXT,
        "updatedAt" TEXT,
        UNIQUE("userId", "vocabularyItemId")
      );
    `);
    console.log('✅ Created userVocabularyProgress table');
    
    // Create languageCourses table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "languageCourses" (
        "id" SERIAL PRIMARY KEY,
        "title" TEXT NOT NULL,
        "description" TEXT,
        "language" TEXT NOT NULL,
        "level" TEXT NOT NULL,
        "imageUrl" TEXT,
        "createdAt" TEXT,
        "active" BOOLEAN DEFAULT true
      );
    `);
    console.log('✅ Created languageCourses table');
    
    // Create languageModules table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "languageModules" (
        "id" SERIAL PRIMARY KEY,
        "title" TEXT NOT NULL,
        "description" TEXT,
        "courseId" INTEGER NOT NULL REFERENCES "languageCourses"("id"),
        "order" INTEGER,
        "objectives" TEXT,
        "createdAt" TEXT,
        "active" BOOLEAN DEFAULT true
      );
    `);
    console.log('✅ Created languageModules table');
    
    // Create languageMissions table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "languageMissions" (
        "id" SERIAL PRIMARY KEY,
        "title" TEXT NOT NULL,
        "description" TEXT,
        "moduleId" INTEGER NOT NULL REFERENCES "languageModules"("id"),
        "type" TEXT,
        "content" TEXT,
        "difficulty" TEXT,
        "xpReward" INTEGER DEFAULT 10,
        "createdAt" TEXT,
        "active" BOOLEAN DEFAULT true
      );
    `);
    console.log('✅ Created languageMissions table');
    
    // Create userLanguageProgress table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "userLanguageProgress" (
        "id" SERIAL PRIMARY KEY,
        "userId" INTEGER NOT NULL,
        "courseId" INTEGER NOT NULL REFERENCES "languageCourses"("id"),
        "currentModuleId" INTEGER REFERENCES "languageModules"("id"),
        "progress" INTEGER DEFAULT 0,
        "lastActiveAt" TEXT,
        "createdAt" TEXT,
        "updatedAt" TEXT,
        UNIQUE("userId", "courseId")
      );
    `);
    console.log('✅ Created userLanguageProgress table');
    
    // Create userLanguageMissions table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "userLanguageMissions" (
        "id" SERIAL PRIMARY KEY,
        "userId" INTEGER NOT NULL,
        "missionId" INTEGER NOT NULL REFERENCES "languageMissions"("id"),
        "completed" BOOLEAN DEFAULT false,
        "score" INTEGER,
        "attempts" INTEGER DEFAULT 0,
        "completedAt" TEXT,
        "createdAt" TEXT,
        "updatedAt" TEXT,
        UNIQUE("userId", "missionId")
      );
    `);
    console.log('✅ Created userLanguageMissions table');
    
    console.log('✅ All language school tables created successfully');
    
    // === Neurodivergent School (Superhero School) Tables ===
    
    // Create superheroCurricula table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "superheroCurricula" (
        "id" SERIAL PRIMARY KEY,
        "title" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "gradeLevel" TEXT NOT NULL,
        "neurotype" TEXT NOT NULL,
        "learningOutcomes" TEXT NOT NULL,
        "active" BOOLEAN DEFAULT true,
        "createdAt" TEXT,
        "updatedAt" TEXT
      );
    `);
    console.log('✅ Created superheroCurricula table');
    
    // Create superheroModules table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "superheroModules" (
        "id" SERIAL PRIMARY KEY,
        "curriculumId" INTEGER REFERENCES "superheroCurricula"("id"),
        "title" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "content" TEXT NOT NULL,
        "gradeLevel" TEXT NOT NULL,
        "neurotype" TEXT NOT NULL,
        "difficulty" TEXT NOT NULL,
        "superpower" TEXT NOT NULL,
        "learningStyle" TEXT NOT NULL,
        "active" BOOLEAN DEFAULT true,
        "createdAt" TEXT,
        "updatedAt" TEXT
      );
    `);
    console.log('✅ Created superheroModules table');
    
    // Create superheroMissions table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "superheroMissions" (
        "id" SERIAL PRIMARY KEY,
        "curriculumId" INTEGER REFERENCES "superheroCurricula"("id"),
        "moduleId" INTEGER REFERENCES "superheroModules"("id"),
        "title" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "instructions" TEXT NOT NULL,
        "objectives" TEXT NOT NULL,
        "difficultyLevel" TEXT NOT NULL,
        "rewardPoints" INTEGER DEFAULT 10,
        "timeLimit" INTEGER DEFAULT 30,
        "active" BOOLEAN DEFAULT true,
        "createdAt" TEXT,
        "updatedAt" TEXT
      );
    `);
    console.log('✅ Created superheroMissions table');
    
    // Create superheroMissionProgress table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "superheroMissionProgress" (
        "id" SERIAL PRIMARY KEY,
        "studentId" INTEGER NOT NULL,
        "missionId" INTEGER NOT NULL REFERENCES "superheroMissions"("id"),
        "completed" BOOLEAN DEFAULT false,
        "completedAt" TEXT,
        "score" INTEGER,
        "feedback" TEXT,
        "status" TEXT NOT NULL,
        "startedAt" TEXT,
        "currentStep" INTEGER DEFAULT 1,
        "totalSteps" INTEGER DEFAULT 1,
        "createdAt" TEXT,
        "updatedAt" TEXT
      );
    `);
    console.log('✅ Created superheroMissionProgress table');
    
    // Create learningStyleResults table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "learning_style_results" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER NOT NULL,
        "results" JSONB NOT NULL,
        "primary_style" TEXT NOT NULL,
        "secondary_style" TEXT NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP,
        "additional_info" TEXT,
        "neurotype" TEXT,
        "age" INTEGER,
        "grade_level" TEXT,
        "persona_generated" BOOLEAN DEFAULT false,
        "persona" JSONB
      );
    `);
    console.log('✅ Created learningStyleResults table');
    
    // Create learningPersona table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "learning_personas" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER NOT NULL,
        "result_id" INTEGER,
        "name" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "strengths" JSONB NOT NULL,
        "strategies" JSONB NOT NULL,
        "environments" JSONB NOT NULL,
        "challenges" JSONB,
        "superpower" TEXT,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "active" BOOLEAN DEFAULT true
      );
    `);
    console.log('✅ Created learningPersonas table');
    
    // Create moodEntries table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "mood_entries" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER NOT NULL,
        "mood_id" TEXT NOT NULL,
        "timestamp" TIMESTAMP NOT NULL DEFAULT NOW(),
        "notes" TEXT,
        "activity_type" TEXT,
        "subject_id" INTEGER,
        "intensity" INTEGER NOT NULL DEFAULT 3
      );
    `);
    console.log('✅ Created moodEntries table');
    
    console.log('✅ All neurodivergent school tables created successfully');
    
    // === Law School Tables ===
    
    // Create barExams table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "bar_exams" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "jurisdiction" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "passing_score" INTEGER NOT NULL,
        "date" TEXT NOT NULL,
        "duration_minutes" INTEGER NOT NULL,
        "active" BOOLEAN DEFAULT true
      );
    `);
    console.log('✅ Created barExams table');
    
    // Create barExamStudyPlans table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "bar_exam_study_plans" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER NOT NULL,
        "bar_exam_id" INTEGER NOT NULL,
        "name" TEXT NOT NULL,
        "start_date" TEXT NOT NULL,
        "end_date" TEXT NOT NULL,
        "weekly_hours" INTEGER NOT NULL,
        "focus_areas" TEXT NOT NULL,
        "active" BOOLEAN DEFAULT true
      );
    `);
    console.log('✅ Created barExamStudyPlans table');
    
    // Create barExamMemoryAids table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "bar_exam_memory_aids" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER NOT NULL,
        "legal_topic" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "content" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "mnemonic_key" TEXT,
        "active" BOOLEAN DEFAULT true
      );
    `);
    console.log('✅ Created barExamMemoryAids table');
    
    console.log('✅ All law school tables created successfully');
    
    return true;
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    return false;
  }
}

// Run this script directly
// ESM doesn't have require.main, so we'll just run it immediately
createTables()
  .then(() => {
    console.log('Database initialization complete');
    process.exit(0);
  })
  .catch(error => {
    console.error('Error initializing database:', error);
    process.exit(1);
  });

export { createTables };