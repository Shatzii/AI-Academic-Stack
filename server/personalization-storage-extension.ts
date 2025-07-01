/**
 * Personalization Storage Extension
 * 
 * This file extends the storage implementation with methods required
 * for the assessment to curriculum personalization pipeline.
 */

import { storage } from './storage';
import { pool, db } from './db';
import { sql } from 'drizzle-orm';
import { 
  LearningProfile, 
  LearningStyleAssessment, 
  NeurotypeAssessment, 
  LearningStyle, 
  Neurotype, 
  AdaptationLevel,
  AdaptationCategory 
} from './services/learning-profile-service';
import { ContentRules } from './services/content-rules-service';
import { GeneratedContent } from './services/ai-content-service';
import { personalizationStorageMethods } from './routes/personalization-routes';

/**
 * Create database tables for the personalization pipeline
 */
export async function createPersonalizationTables() {
  try {
    // Create learning_style_assessments table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS learning_style_assessments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        visual_score INTEGER NOT NULL,
        auditory_score INTEGER NOT NULL,
        kinesthetic_score INTEGER NOT NULL,
        reading_writing_score INTEGER NOT NULL,
        assessment_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id)
      )
    `);
    
    // Create neurotype_assessments table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS neurotype_assessments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        dyslexia_indicators INTEGER NOT NULL,
        adhd_indicators INTEGER NOT NULL,
        autism_spectrum_indicators INTEGER NOT NULL,
        assessment_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id)
      )
    `);
    
    // Create learning_profiles table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS learning_profiles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        primary_style TEXT NOT NULL,
        secondary_style TEXT,
        neurotype TEXT NOT NULL,
        adaptation_level TEXT NOT NULL,
        adaptations JSONB NOT NULL,
        content_preferences JSONB NOT NULL,
        last_updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        version INTEGER NOT NULL DEFAULT 1,
        UNIQUE(user_id)
      )
    `);
    
    // Create content_rules table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS content_rules (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        content_type TEXT NOT NULL,
        subject TEXT NOT NULL,
        grade_level TEXT NOT NULL,
        primary_format TEXT NOT NULL,
        support_formats JSONB NOT NULL,
        complexity TEXT NOT NULL,
        pace TEXT NOT NULL,
        presentation_style TEXT NOT NULL,
        text_adaptations JSONB NOT NULL,
        visual_adaptations JSONB NOT NULL,
        audio_adaptations JSONB NOT NULL,
        interactive_adaptations JSONB NOT NULL,
        organizational_adaptations JSONB NOT NULL,
        focus_adaptations JSONB NOT NULL,
        tier TEXT NOT NULL,
        last_updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, content_type, subject, grade_level, tier)
      )
    `);
    
    // Create generated_content table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS generated_content (
        id SERIAL PRIMARY KEY,
        content_id TEXT NOT NULL,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        subject TEXT NOT NULL,
        grade_level TEXT NOT NULL,
        content_type TEXT NOT NULL,
        primary_format TEXT NOT NULL,
        sections JSONB NOT NULL,
        adaptations JSONB NOT NULL,
        metadata JSONB NOT NULL,
        deep_research_sources JSONB,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(content_id)
      )
    `);
    
    // Create content_generation_usage table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS content_generation_usage (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        tier TEXT NOT NULL,
        generated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('✅ Created personalization tables');
    return true;
  } catch (error) {
    console.error('Error creating personalization tables:', error);
    return false;
  }
}

/**
 * Extends the storage implementation with personalization methods
 */
export function extendStorageWithPersonalization() {
  // Learning Style Assessment methods
  storage.hasLearningStyleAssessment = async (userId: number): Promise<boolean> => {
    try {
      const result = await db.execute(sql`
        SELECT COUNT(*) as count FROM learning_style_assessments WHERE user_id = ${userId}
      `);
      return parseInt(result.rows[0].count) > 0;
    } catch (error) {
      console.error(`Error checking learning style assessment for user ${userId}:`, error);
      return false;
    }
  };
  
  storage.saveLearningStyleAssessment = async (userId: number, assessmentData: LearningStyleAssessment): Promise<boolean> => {
    try {
      // Check if assessment already exists
      const exists = await storage.hasLearningStyleAssessment(userId);
      
      if (exists) {
        // Update existing assessment
        await db.execute(sql`
          UPDATE learning_style_assessments 
          SET visual_score = ${assessmentData.visualScore},
              auditory_score = ${assessmentData.auditoryScore},
              kinesthetic_score = ${assessmentData.kinestheticScore},
              reading_writing_score = ${assessmentData.readingWritingScore},
              assessment_date = ${assessmentData.assessmentDate}
          WHERE user_id = ${userId}
        `);
      } else {
        // Create new assessment
        await db.execute(sql`
          INSERT INTO learning_style_assessments 
          (user_id, visual_score, auditory_score, kinesthetic_score, reading_writing_score, assessment_date)
          VALUES 
          (${userId}, ${assessmentData.visualScore}, ${assessmentData.auditoryScore}, 
          ${assessmentData.kinestheticScore}, ${assessmentData.readingWritingScore}, ${assessmentData.assessmentDate})
        `);
      }
      
      return true;
    } catch (error) {
      console.error(`Error saving learning style assessment for user ${userId}:`, error);
      return false;
    }
  };
  
  storage.getLearningStyleAssessment = async (userId: number): Promise<LearningStyleAssessment | null> => {
    try {
      const result = await db.execute(sql`
        SELECT * FROM learning_style_assessments WHERE user_id = ${userId}
      `);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const row = result.rows[0];
      return {
        userId: parseInt(row.user_id),
        visualScore: parseInt(row.visual_score),
        auditoryScore: parseInt(row.auditory_score),
        kinestheticScore: parseInt(row.kinesthetic_score),
        readingWritingScore: parseInt(row.reading_writing_score),
        assessmentDate: new Date(row.assessment_date)
      };
    } catch (error) {
      console.error(`Error getting learning style assessment for user ${userId}:`, error);
      return null;
    }
  };
  
  // Neurotype Assessment methods
  storage.hasNeurotypeAssessment = async (userId: number): Promise<boolean> => {
    try {
      const result = await db.execute(sql`
        SELECT COUNT(*) as count FROM neurotype_assessments WHERE user_id = ${userId}
      `);
      return parseInt(result.rows[0].count) > 0;
    } catch (error) {
      console.error(`Error checking neurotype assessment for user ${userId}:`, error);
      return false;
    }
  };
  
  storage.saveNeurotypeAssessment = async (userId: number, assessmentData: NeurotypeAssessment): Promise<boolean> => {
    try {
      // Check if assessment already exists
      const exists = await storage.hasNeurotypeAssessment(userId);
      
      if (exists) {
        // Update existing assessment
        await db.execute(sql`
          UPDATE neurotype_assessments 
          SET dyslexia_indicators = ${assessmentData.dyslexiaIndicators},
              adhd_indicators = ${assessmentData.adhdIndicators},
              autism_spectrum_indicators = ${assessmentData.autismSpectrumIndicators},
              assessment_date = ${assessmentData.assessmentDate}
          WHERE user_id = ${userId}
        `);
      } else {
        // Create new assessment
        await db.execute(sql`
          INSERT INTO neurotype_assessments 
          (user_id, dyslexia_indicators, adhd_indicators, autism_spectrum_indicators, assessment_date)
          VALUES 
          (${userId}, ${assessmentData.dyslexiaIndicators}, ${assessmentData.adhdIndicators}, 
          ${assessmentData.autismSpectrumIndicators}, ${assessmentData.assessmentDate})
        `);
      }
      
      return true;
    } catch (error) {
      console.error(`Error saving neurotype assessment for user ${userId}:`, error);
      return false;
    }
  };
  
  storage.getNeurotypeAssessment = async (userId: number): Promise<NeurotypeAssessment | null> => {
    try {
      const result = await db.execute(sql`
        SELECT * FROM neurotype_assessments WHERE user_id = ${userId}
      `);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const row = result.rows[0];
      return {
        userId: parseInt(row.user_id),
        dyslexiaIndicators: parseInt(row.dyslexia_indicators),
        adhdIndicators: parseInt(row.adhd_indicators),
        autismSpectrumIndicators: parseInt(row.autism_spectrum_indicators),
        assessmentDate: new Date(row.assessment_date)
      };
    } catch (error) {
      console.error(`Error getting neurotype assessment for user ${userId}:`, error);
      return null;
    }
  };
  
  // Learning Profile methods
  storage.hasCompletedAssessments = async (userId: number): Promise<boolean> => {
    try {
      const hasLearningStyle = await storage.hasLearningStyleAssessment(userId);
      const hasNeurotype = await storage.hasNeurotypeAssessment(userId);
      return hasLearningStyle && hasNeurotype;
    } catch (error) {
      console.error(`Error checking completed assessments for user ${userId}:`, error);
      return false;
    }
  };
  
  storage.getLearningProfile = async (userId: number): Promise<LearningProfile | null> => {
    try {
      const result = await db.execute(sql`
        SELECT * FROM learning_profiles WHERE user_id = ${userId}
      `);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const row = result.rows[0];
      return {
        userId: parseInt(row.user_id),
        primaryStyle: row.primary_style as LearningStyle,
        secondaryStyle: row.secondary_style ? (row.secondary_style as LearningStyle) : null,
        neurotype: row.neurotype as Neurotype,
        adaptationLevel: row.adaptation_level as AdaptationLevel,
        adaptations: row.adaptations,
        contentPreferences: row.content_preferences,
        lastUpdated: new Date(row.last_updated),
        version: parseInt(row.version)
      };
    } catch (error) {
      console.error(`Error getting learning profile for user ${userId}:`, error);
      return null;
    }
  };
  
  storage.saveLearningProfile = async (profile: LearningProfile): Promise<boolean> => {
    try {
      // Check if profile already exists
      const existingProfile = await storage.getLearningProfile(profile.userId);
      
      if (existingProfile) {
        // Update existing profile
        await db.execute(sql`
          UPDATE learning_profiles 
          SET primary_style = ${profile.primaryStyle},
              secondary_style = ${profile.secondaryStyle},
              neurotype = ${profile.neurotype},
              adaptation_level = ${profile.adaptationLevel},
              adaptations = ${JSON.stringify(profile.adaptations)},
              content_preferences = ${JSON.stringify(profile.contentPreferences)},
              last_updated = ${profile.lastUpdated},
              version = ${profile.version}
          WHERE user_id = ${profile.userId}
        `);
      } else {
        // Create new profile
        await db.execute(sql`
          INSERT INTO learning_profiles 
          (user_id, primary_style, secondary_style, neurotype, adaptation_level, 
           adaptations, content_preferences, last_updated, version)
          VALUES 
          (${profile.userId}, ${profile.primaryStyle}, ${profile.secondaryStyle}, 
           ${profile.neurotype}, ${profile.adaptationLevel}, 
           ${JSON.stringify(profile.adaptations)}, ${JSON.stringify(profile.contentPreferences)}, 
           ${profile.lastUpdated}, ${profile.version})
        `);
      }
      
      return true;
    } catch (error) {
      console.error(`Error saving learning profile for user ${profile.userId}:`, error);
      return false;
    }
  };
  
  // Content Rules methods
  storage.saveContentRules = async (userId: number, contentRules: ContentRules): Promise<boolean> => {
    try {
      // Check if rules already exist
      const result = await db.execute(sql`
        SELECT id FROM content_rules 
        WHERE user_id = ${userId} 
        AND content_type = ${contentRules.contentType}
        AND subject = ${contentRules.subject}
        AND grade_level = ${contentRules.grade_level}
        AND tier = ${contentRules.tier}
      `);
      
      if (result.rows.length > 0) {
        // Update existing rules
        const ruleId = parseInt(result.rows[0].id);
        await db.execute(sql`
          UPDATE content_rules 
          SET primary_format = ${contentRules.primaryFormat},
              support_formats = ${JSON.stringify(contentRules.supportFormats)},
              complexity = ${contentRules.complexity},
              pace = ${contentRules.pace},
              presentation_style = ${contentRules.presentationStyle},
              text_adaptations = ${JSON.stringify(contentRules.textAdaptations)},
              visual_adaptations = ${JSON.stringify(contentRules.visualAdaptations)},
              audio_adaptations = ${JSON.stringify(contentRules.audioAdaptations)},
              interactive_adaptations = ${JSON.stringify(contentRules.interactiveAdaptations)},
              organizational_adaptations = ${JSON.stringify(contentRules.organizationalAdaptations)},
              focus_adaptations = ${JSON.stringify(contentRules.focusAdaptations)},
              last_updated = ${new Date()}
          WHERE id = ${ruleId}
        `);
      } else {
        // Create new rules
        await db.execute(sql`
          INSERT INTO content_rules 
          (user_id, content_type, subject, grade_level, primary_format, support_formats,
           complexity, pace, presentation_style, text_adaptations, visual_adaptations,
           audio_adaptations, interactive_adaptations, organizational_adaptations,
           focus_adaptations, tier, last_updated)
          VALUES 
          (${userId}, ${contentRules.contentType}, ${contentRules.subject}, 
           ${contentRules.grade_level}, ${contentRules.primaryFormat}, 
           ${JSON.stringify(contentRules.supportFormats)}, ${contentRules.complexity},
           ${contentRules.pace}, ${contentRules.presentationStyle},
           ${JSON.stringify(contentRules.textAdaptations)}, 
           ${JSON.stringify(contentRules.visualAdaptations)},
           ${JSON.stringify(contentRules.audioAdaptations)},
           ${JSON.stringify(contentRules.interactiveAdaptations)},
           ${JSON.stringify(contentRules.organizationalAdaptations)},
           ${JSON.stringify(contentRules.focusAdaptations)},
           ${contentRules.tier}, ${new Date()})
        `);
      }
      
      return true;
    } catch (error) {
      console.error(`Error saving content rules for user ${userId}:`, error);
      return false;
    }
  };
  
  storage.getContentRules = async (
    userId: number, 
    contentType: string, 
    subject: string, 
    gradeLevel: string, 
    tier: string
  ): Promise<ContentRules | null> => {
    try {
      const result = await db.execute(sql`
        SELECT * FROM content_rules 
        WHERE user_id = ${userId} 
        AND content_type = ${contentType}
        AND subject = ${subject}
        AND grade_level = ${gradeLevel}
        AND tier = ${tier}
      `);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const row = result.rows[0];
      return {
        userId: parseInt(row.user_id),
        contentType: row.content_type,
        subject: row.subject,
        grade_level: row.grade_level,
        primaryFormat: row.primary_format,
        supportFormats: row.support_formats,
        complexity: row.complexity,
        pace: row.pace,
        presentationStyle: row.presentation_style,
        textAdaptations: row.text_adaptations,
        visualAdaptations: row.visual_adaptations,
        audioAdaptations: row.audio_adaptations,
        interactiveAdaptations: row.interactive_adaptations,
        organizationalAdaptations: row.organizational_adaptations,
        focusAdaptations: row.focus_adaptations,
        tier: row.tier,
        lastUpdated: new Date(row.last_updated)
      };
    } catch (error) {
      console.error(`Error getting content rules for user ${userId}:`, error);
      return null;
    }
  };
  
  // Generated Content methods
  storage.saveGeneratedContent = async (userId: number, content: GeneratedContent): Promise<boolean> => {
    try {
      await db.execute(sql`
        INSERT INTO generated_content 
        (content_id, user_id, title, subject, grade_level, content_type, 
         primary_format, sections, adaptations, metadata, deep_research_sources)
        VALUES 
        (${content.contentId}, ${userId}, ${content.title}, ${content.subject}, 
         ${content.gradeLevel}, ${content.contentType}, ${content.primaryFormat},
         ${JSON.stringify(content.sections)}, ${JSON.stringify(content.adaptations)},
         ${JSON.stringify(content.metadata)}, ${content.deepResearchSources ? JSON.stringify(content.deepResearchSources) : null})
      `);
      
      return true;
    } catch (error) {
      console.error(`Error saving generated content for user ${userId}:`, error);
      return false;
    }
  };
  
  storage.getGeneratedContent = async (userId: number): Promise<GeneratedContent[]> => {
    try {
      const result = await db.execute(sql`
        SELECT * FROM generated_content 
        WHERE user_id = ${userId}
        ORDER BY created_at DESC
      `);
      
      return result.rows.map(row => ({
        contentId: row.content_id,
        userId: parseInt(row.user_id),
        title: row.title,
        subject: row.subject,
        gradeLevel: row.grade_level,
        contentType: row.content_type,
        primaryFormat: row.primary_format,
        sections: row.sections,
        adaptations: row.adaptations,
        metadata: row.metadata,
        deepResearchSources: row.deep_research_sources
      }));
    } catch (error) {
      console.error(`Error getting generated content for user ${userId}:`, error);
      return [];
    }
  };
  
  storage.getGeneratedContentById = async (userId: number, contentId: string): Promise<GeneratedContent | null> => {
    try {
      const result = await db.execute(sql`
        SELECT * FROM generated_content 
        WHERE user_id = ${userId} AND content_id = ${contentId}
      `);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const row = result.rows[0];
      return {
        contentId: row.content_id,
        userId: parseInt(row.user_id),
        title: row.title,
        subject: row.subject,
        gradeLevel: row.grade_level,
        contentType: row.content_type,
        primaryFormat: row.primary_format,
        sections: row.sections,
        adaptations: row.adaptations,
        metadata: row.metadata,
        deepResearchSources: row.deep_research_sources
      };
    } catch (error) {
      console.error(`Error getting generated content by ID for user ${userId}:`, error);
      return null;
    }
  };
  
  // Content Generation Usage methods
  storage.recordContentGeneration = async (userId: number, tier: string): Promise<boolean> => {
    try {
      await db.execute(sql`
        INSERT INTO content_generation_usage 
        (user_id, tier, generated_at)
        VALUES 
        (${userId}, ${tier}, ${new Date()})
      `);
      
      return true;
    } catch (error) {
      console.error(`Error recording content generation for user ${userId}:`, error);
      return false;
    }
  };
  
  storage.getContentGenerationUsage = async (userId: number, tier: string, period: 'day' | 'month' = 'month'): Promise<number> => {
    try {
      const timeFrame = period === 'day' 
        ? sql`DATE(generated_at) = CURRENT_DATE` 
        : sql`DATE(generated_at) >= DATE_TRUNC('month', CURRENT_DATE)`;
      
      const result = await db.execute(sql`
        SELECT COUNT(*) as count FROM content_generation_usage 
        WHERE user_id = ${userId} 
        AND tier = ${tier}
        AND ${timeFrame}
      `);
      
      return parseInt(result.rows[0].count);
    } catch (error) {
      console.error(`Error getting content generation usage for user ${userId}:`, error);
      return 0;
    }
  };
  
  storage.hasReachedContentGenerationLimit = async (userId: number, tier: string): Promise<boolean> => {
    try {
      const usage = await storage.getContentGenerationUsage(userId, tier);
      
      // Define limits based on tier
      let limit = 0;
      switch (tier.toLowerCase()) {
        case 'premium':
          limit = 10000; // Effectively unlimited
          break;
        case 'standard':
          limit = 500;
          break;
        case 'basic':
        default:
          limit = 50;
          break;
      }
      
      return usage >= limit;
    } catch (error) {
      console.error(`Error checking content generation limit for user ${userId}:`, error);
      return false;
    }
  };
  
  // Add all methods from personalizationStorageMethods to storage
  Object.assign(storage, personalizationStorageMethods);
  
  return storage;
}