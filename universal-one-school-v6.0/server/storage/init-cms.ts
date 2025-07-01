/**
 * CMS Initialization
 * 
 * This file contains logic to initialize and apply CMS methods to the storage system.
 */

import { IStorage } from '../storage';
import { applyCMSMethods } from './cms-storage';
import { db } from '../db';
import { 
  schools, 
  neurodivergentSchools, 
  lawSchools, 
  languageSchools, 
  pages, 
  aiTeachers, 
  resources 
} from '../../shared/cms-schema';

/**
 * Initialize CMS functionality
 * @param storage The storage instance to enhance with CMS methods
 */
export async function initializeCMS(storage: IStorage): Promise<IStorage> {
  console.log('🏫 Initializing CMS features...');
  
  try {
    // Apply the CMS methods to the storage object
    const enhancedStorage = applyCMSMethods(storage);
    console.log('✅ CMS methods applied to storage');
    
    // If using a database, ensure the tables exist
    if (process.env.DATABASE_URL && process.env.USE_MEMORY_STORAGE !== 'true') {
      try {
        // Check if we need to create tables
        const hasSchoolsTable = await checkTableExists('cms_schools');
        
        if (!hasSchoolsTable) {
          console.log('⚠️ CMS tables not found in database, migrations needed');
          
          try {
            // Create the tables using drizzle. In a production environment,
            // you would use drizzle-kit migrations instead of direct schema push.
            
            // Create the tables in order to respect foreign key constraints
            await db.execute(`CREATE TABLE IF NOT EXISTS cms_schools (
              id SERIAL PRIMARY KEY,
              name VARCHAR(100) NOT NULL,
              slug VARCHAR(100) NOT NULL UNIQUE,
              description TEXT NOT NULL,
              type VARCHAR(50) NOT NULL,
              grade_range VARCHAR(100) NOT NULL,
              logo_url VARCHAR(255),
              header_color VARCHAR(50) DEFAULT '#4a4a4a',
              website VARCHAR(255),
              location VARCHAR(255),
              specialties JSON,
              student_count INTEGER,
              academic_year INTEGER,
              student_satisfaction INTEGER,
              completion_rate INTEGER,
              knowledge_retention INTEGER,
              created_at TIMESTAMP NOT NULL DEFAULT NOW(),
              updated_at TIMESTAMP NOT NULL DEFAULT NOW()
            )`);
            
            await db.execute(`CREATE TABLE IF NOT EXISTS cms_neurodivergent_schools (
              id SERIAL PRIMARY KEY,
              school_id INTEGER NOT NULL REFERENCES cms_schools(id) ON DELETE CASCADE,
              supported_neurotypes JSON NOT NULL,
              accommodations JSON NOT NULL,
              specialized_programs JSON,
              assistive_technologies JSON,
              inclusion_level INTEGER,
              parent_support_resources BOOLEAN DEFAULT FALSE,
              individualized_plans BOOLEAN DEFAULT TRUE,
              created_at TIMESTAMP NOT NULL DEFAULT NOW(),
              updated_at TIMESTAMP NOT NULL DEFAULT NOW()
            )`);
            
            await db.execute(`CREATE TABLE IF NOT EXISTS cms_law_schools (
              id SERIAL PRIMARY KEY,
              school_id INTEGER NOT NULL REFERENCES cms_schools(id) ON DELETE CASCADE,
              bar_pass_rate INTEGER,
              jurisdiction VARCHAR(100),
              specializations JSON,
              clinics JSON,
              moots JSON,
              faculty_size INTEGER,
              is_accredited BOOLEAN DEFAULT TRUE,
              has_bar_prep BOOLEAN DEFAULT TRUE,
              created_at TIMESTAMP NOT NULL DEFAULT NOW(),
              updated_at TIMESTAMP NOT NULL DEFAULT NOW()
            )`);
            
            await db.execute(`CREATE TABLE IF NOT EXISTS cms_language_schools (
              id SERIAL PRIMARY KEY,
              school_id INTEGER NOT NULL REFERENCES cms_schools(id) ON DELETE CASCADE,
              languages JSON NOT NULL,
              proficiency_levels JSON,
              teaching_methodologies JSON,
              cultural_programs JSON,
              certifications JSON,
              conversation_practice BOOLEAN DEFAULT TRUE,
              immersion_experiences BOOLEAN DEFAULT FALSE,
              created_at TIMESTAMP NOT NULL DEFAULT NOW(),
              updated_at TIMESTAMP NOT NULL DEFAULT NOW()
            )`);
            
            await db.execute(`CREATE TABLE IF NOT EXISTS cms_pages (
              id SERIAL PRIMARY KEY,
              title VARCHAR(255) NOT NULL,
              slug VARCHAR(255) NOT NULL,
              content TEXT NOT NULL,
              school_id INTEGER REFERENCES cms_schools(id) ON DELETE CASCADE,
              type VARCHAR(50) NOT NULL,
              is_published BOOLEAN DEFAULT TRUE,
              published_at TIMESTAMP,
              featured_image VARCHAR(255),
              meta_description TEXT,
              meta_keywords TEXT,
              author_id INTEGER,
              layout VARCHAR(50) DEFAULT 'default',
              "order" INTEGER DEFAULT 0,
              created_at TIMESTAMP NOT NULL DEFAULT NOW(),
              updated_at TIMESTAMP NOT NULL DEFAULT NOW()
            )`);
            
            await db.execute(`CREATE TABLE IF NOT EXISTS cms_ai_teachers (
              id SERIAL PRIMARY KEY,
              name VARCHAR(100) NOT NULL,
              subject VARCHAR(100) NOT NULL,
              description TEXT,
              avatar_url VARCHAR(255),
              teaching_style TEXT,
              specialties TEXT,
              neurotype_tailoring TEXT,
              grade_level VARCHAR(50),
              school_id INTEGER NOT NULL REFERENCES cms_schools(id) ON DELETE CASCADE,
              ai_model VARCHAR(50) DEFAULT 'claude-3-sonnet-20240229',
              system_prompt TEXT,
              personality_prompt TEXT,
              active BOOLEAN DEFAULT TRUE,
              created_at TIMESTAMP NOT NULL DEFAULT NOW(),
              updated_at TIMESTAMP NOT NULL DEFAULT NOW()
            )`);
            
            await db.execute(`CREATE TABLE IF NOT EXISTS cms_resources (
              id SERIAL PRIMARY KEY,
              title VARCHAR(255) NOT NULL,
              description TEXT NOT NULL,
              type VARCHAR(50) NOT NULL,
              url VARCHAR(255),
              school_type VARCHAR(50),
              subject VARCHAR(100),
              grade_level VARCHAR(50),
              format VARCHAR(50),
              author VARCHAR(100),
              published_at TIMESTAMP,
              school_id INTEGER REFERENCES cms_schools(id) ON DELETE CASCADE,
              created_at TIMESTAMP NOT NULL DEFAULT NOW(),
              updated_at TIMESTAMP NOT NULL DEFAULT NOW()
            )`);
            
            // Log success
            console.log('✅ CMS database schema initialized (tables created)');
          } catch (schemaError) {
            console.error('❌ Failed to create CMS schema in database:', schemaError);
            console.log('⚠️ Using memory storage for CMS as fallback');
          }
        } else {
          console.log('✅ CMS database tables already exist');
        }
      } catch (dbError) {
        console.error('❌ Error while checking database schema:', dbError);
        console.log('⚠️ Using memory storage for CMS as fallback');
      }
    } else {
      console.log('📝 Using memory storage for CMS data');
    }
    
    return enhancedStorage;
  } catch (error) {
    console.error('❌ Failed to initialize CMS:', error);
    console.log('⚠️ Returning storage without CMS features');
    return storage;
  }
}

/**
 * Check if a table exists in the database
 */
async function checkTableExists(tableName: string): Promise<boolean> {
  try {
    if (!process.env.DATABASE_URL) return false;
    
    // Use a more compatible query approach for PostgreSQL
    const result = await db.execute(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = '${tableName}'
      )
    `);
    
    return result.rows[0]?.exists === true;
  } catch (error) {
    console.error(`Error checking if table ${tableName} exists:`, error);
    return false;
  }
}