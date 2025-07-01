import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { eq } from 'drizzle-orm';
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { randomBytes } from 'crypto';

import { 
  users,
  apiKeys,
  learningStyleResults,
  neurotypeResults,
  learningProfiles,
  parentChildRelationships,
  generatedContent,
  type User,
  type InsertUser,
  type ApiKey,
  type InsertApiKey,
  type LearningStyleResult,
  type InsertLearningStyleResult,
  type NeurotypeResult,
  type InsertNeurotypeResult,
  type LearningProfile,
  type InsertLearningProfile,
  type ParentChildRelationship,
  type InsertParentChildRelationship,
  type GeneratedContent,
  type InsertGeneratedContent
} from "@shared/schema";

import { pool, db } from './db';

// Session store for PostgreSQL
const PostgresSessionStore = connectPgSimple(session);

// Storage interface
export interface IStorage {
  // Session store
  sessionStore: session.SessionStore;
  
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(userId: number, userData: Partial<InsertUser>): Promise<User | undefined>;
  
  // API Key operations
  getApiKeys(): Promise<ApiKey[]>;
  getApiKey(id: number): Promise<ApiKey | undefined>;
  getApiKeyByName(name: string): Promise<ApiKey | undefined>;
  createApiKey(apiKey: InsertApiKey): Promise<ApiKey>;
  updateApiKey(id: number, apiKey: Partial<InsertApiKey>): Promise<ApiKey | undefined>;
  deleteApiKey(id: number): Promise<boolean>;
  
  // Learning style assessment operations
  getLearningStyleResults(userId: number): Promise<LearningStyleResult[]>;
  getLearningStyleResult(id: number): Promise<LearningStyleResult | undefined>;
  createLearningStyleResult(result: InsertLearningStyleResult): Promise<LearningStyleResult>;
  updateLearningStyleResult(id: number, result: Partial<InsertLearningStyleResult>): Promise<LearningStyleResult | undefined>;
  
  // Neurotype assessment operations
  getNeurotypeResults(userId: number): Promise<NeurotypeResult[]>;
  getNeurotypeResult(id: number): Promise<NeurotypeResult | undefined>;
  createNeurotypeResult(result: InsertNeurotypeResult): Promise<NeurotypeResult>;
  updateNeurotypeResult(id: number, result: Partial<InsertNeurotypeResult>): Promise<NeurotypeResult | undefined>;
  
  // Learning profile operations
  getLearningProfiles(userId: number): Promise<LearningProfile[]>;
  getLearningProfile(id: number): Promise<LearningProfile | undefined>;
  createLearningProfile(profile: InsertLearningProfile): Promise<LearningProfile>;
  updateLearningProfile(id: number, profile: Partial<InsertLearningProfile>): Promise<LearningProfile | undefined>;
  
  // Parent-child relationship operations
  getChildUsers(parentUserId: number): Promise<User[]>;
  getParentUsers(childUserId: number): Promise<User[]>;
  createParentChildRelationship(relationship: InsertParentChildRelationship): Promise<ParentChildRelationship>;
  
  // Generated content operations
  getGeneratedContents(userId: number): Promise<GeneratedContent[]>;
  getGeneratedContent(id: number): Promise<GeneratedContent | undefined>;
  createGeneratedContent(content: InsertGeneratedContent): Promise<GeneratedContent>;
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  // Session Store
  sessionStore = new PostgresSessionStore({
    pool,
    createTableIfMissing: true
  });
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user;
    } catch (error) {
      console.error('Error in getUser:', error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.username, username));
      return user;
    } catch (error) {
      console.error('Error in getUserByUsername:', error);
      return undefined;
    }
  }

  async createUser(userData: InsertUser): Promise<User> {
    try {
      const [user] = await db.insert(users).values(userData).returning();
      return user;
    } catch (error) {
      console.error('Error in createUser:', error);
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  async updateUser(userId: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    try {
      const [user] = await db
        .update(users)
        .set(userData)
        .where(eq(users.id, userId))
        .returning();
      return user;
    } catch (error) {
      console.error('Error in updateUser:', error);
      return undefined;
    }
  }
  
  // API Key operations
  async getApiKeys(): Promise<ApiKey[]> {
    try {
      return await db.select().from(apiKeys);
    } catch (error) {
      console.error('Error in getApiKeys:', error);
      return [];
    }
  }
  
  async getApiKey(id: number): Promise<ApiKey | undefined> {
    try {
      const [apiKey] = await db.select().from(apiKeys).where(eq(apiKeys.id, id));
      return apiKey;
    } catch (error) {
      console.error('Error in getApiKey:', error);
      return undefined;
    }
  }
  
  async getApiKeyByName(name: string): Promise<ApiKey | undefined> {
    try {
      const [apiKey] = await db.select().from(apiKeys).where(eq(apiKeys.name, name));
      return apiKey;
    } catch (error) {
      console.error('Error in getApiKeyByName:', error);
      return undefined;
    }
  }
  
  async createApiKey(apiKeyData: InsertApiKey): Promise<ApiKey> {
    try {
      // Generate a random API key if one is not provided
      if (!apiKeyData.key) {
        apiKeyData.key = randomBytes(32).toString('hex');
      }
      
      const [apiKey] = await db.insert(apiKeys).values(apiKeyData).returning();
      return apiKey;
    } catch (error) {
      console.error('Error in createApiKey:', error);
      throw new Error(`Failed to create API key: ${error.message}`);
    }
  }
  
  async updateApiKey(id: number, apiKeyData: Partial<InsertApiKey>): Promise<ApiKey | undefined> {
    try {
      const [apiKey] = await db
        .update(apiKeys)
        .set(apiKeyData)
        .where(eq(apiKeys.id, id))
        .returning();
      return apiKey;
    } catch (error) {
      console.error('Error in updateApiKey:', error);
      return undefined;
    }
  }
  
  async deleteApiKey(id: number): Promise<boolean> {
    try {
      await db.delete(apiKeys).where(eq(apiKeys.id, id));
      return true;
    } catch (error) {
      console.error('Error in deleteApiKey:', error);
      return false;
    }
  }
  
  // Learning style assessment operations
  async getLearningStyleResults(userId: number): Promise<LearningStyleResult[]> {
    try {
      return await db
        .select()
        .from(learningStyleResults)
        .where(eq(learningStyleResults.userId, userId));
    } catch (error) {
      console.error('Error in getLearningStyleResults:', error);
      return [];
    }
  }
  
  async getLearningStyleResult(id: number): Promise<LearningStyleResult | undefined> {
    try {
      const [result] = await db
        .select()
        .from(learningStyleResults)
        .where(eq(learningStyleResults.id, id));
      return result;
    } catch (error) {
      console.error('Error in getLearningStyleResult:', error);
      return undefined;
    }
  }
  
  async createLearningStyleResult(resultData: InsertLearningStyleResult): Promise<LearningStyleResult> {
    try {
      const [result] = await db
        .insert(learningStyleResults)
        .values(resultData)
        .returning();
      return result;
    } catch (error) {
      console.error('Error in createLearningStyleResult:', error);
      throw new Error(`Failed to create learning style result: ${error.message}`);
    }
  }
  
  async updateLearningStyleResult(id: number, resultData: Partial<InsertLearningStyleResult>): Promise<LearningStyleResult | undefined> {
    try {
      const [result] = await db
        .update(learningStyleResults)
        .set(resultData)
        .where(eq(learningStyleResults.id, id))
        .returning();
      return result;
    } catch (error) {
      console.error('Error in updateLearningStyleResult:', error);
      return undefined;
    }
  }
  
  // Neurotype assessment operations
  async getNeurotypeResults(userId: number): Promise<NeurotypeResult[]> {
    try {
      return await db
        .select()
        .from(neurotypeResults)
        .where(eq(neurotypeResults.userId, userId));
    } catch (error) {
      console.error('Error in getNeurotypeResults:', error);
      return [];
    }
  }
  
  async getNeurotypeResult(id: number): Promise<NeurotypeResult | undefined> {
    try {
      const [result] = await db
        .select()
        .from(neurotypeResults)
        .where(eq(neurotypeResults.id, id));
      return result;
    } catch (error) {
      console.error('Error in getNeurotypeResult:', error);
      return undefined;
    }
  }
  
  async createNeurotypeResult(resultData: InsertNeurotypeResult): Promise<NeurotypeResult> {
    try {
      const [result] = await db
        .insert(neurotypeResults)
        .values(resultData)
        .returning();
      return result;
    } catch (error) {
      console.error('Error in createNeurotypeResult:', error);
      throw new Error(`Failed to create neurotype result: ${error.message}`);
    }
  }
  
  async updateNeurotypeResult(id: number, resultData: Partial<InsertNeurotypeResult>): Promise<NeurotypeResult | undefined> {
    try {
      const [result] = await db
        .update(neurotypeResults)
        .set(resultData)
        .where(eq(neurotypeResults.id, id))
        .returning();
      return result;
    } catch (error) {
      console.error('Error in updateNeurotypeResult:', error);
      return undefined;
    }
  }
  
  // Learning profile operations
  async getLearningProfiles(userId: number): Promise<LearningProfile[]> {
    try {
      return await db
        .select()
        .from(learningProfiles)
        .where(eq(learningProfiles.userId, userId));
    } catch (error) {
      console.error('Error in getLearningProfiles:', error);
      return [];
    }
  }
  
  async getLearningProfile(id: number): Promise<LearningProfile | undefined> {
    try {
      const [profile] = await db
        .select()
        .from(learningProfiles)
        .where(eq(learningProfiles.id, id));
      return profile;
    } catch (error) {
      console.error('Error in getLearningProfile:', error);
      return undefined;
    }
  }
  
  async createLearningProfile(profileData: InsertLearningProfile): Promise<LearningProfile> {
    try {
      const [profile] = await db
        .insert(learningProfiles)
        .values(profileData)
        .returning();
      return profile;
    } catch (error) {
      console.error('Error in createLearningProfile:', error);
      throw new Error(`Failed to create learning profile: ${error.message}`);
    }
  }
  
  async updateLearningProfile(id: number, profileData: Partial<InsertLearningProfile>): Promise<LearningProfile | undefined> {
    try {
      const [profile] = await db
        .update(learningProfiles)
        .set(profileData)
        .where(eq(learningProfiles.id, id))
        .returning();
      return profile;
    } catch (error) {
      console.error('Error in updateLearningProfile:', error);
      return undefined;
    }
  }
  
  // Parent-child relationship operations
  async getChildUsers(parentUserId: number): Promise<User[]> {
    try {
      const relationships = await db
        .select()
        .from(parentChildRelationships)
        .where(eq(parentChildRelationships.parentId, parentUserId));
      
      if (relationships.length === 0) return [];
      
      const childIds = relationships.map(rel => rel.childId);
      
      return await db
        .select()
        .from(users)
        .where(
          childIds.length > 0 
            ? eq(users.id, childIds[0]) 
            : eq(users.id, -1)
        );
    } catch (error) {
      console.error('Error in getChildUsers:', error);
      return [];
    }
  }
  
  async getParentUsers(childUserId: number): Promise<User[]> {
    try {
      const relationships = await db
        .select()
        .from(parentChildRelationships)
        .where(eq(parentChildRelationships.childId, childUserId));
      
      if (relationships.length === 0) return [];
      
      const parentIds = relationships.map(rel => rel.parentId);
      
      return await db
        .select()
        .from(users)
        .where(
          parentIds.length > 0 
            ? eq(users.id, parentIds[0]) 
            : eq(users.id, -1)
        );
    } catch (error) {
      console.error('Error in getParentUsers:', error);
      return [];
    }
  }
  
  async createParentChildRelationship(relationshipData: InsertParentChildRelationship): Promise<ParentChildRelationship> {
    try {
      const [relationship] = await db
        .insert(parentChildRelationships)
        .values(relationshipData)
        .returning();
      return relationship;
    } catch (error) {
      console.error('Error in createParentChildRelationship:', error);
      throw new Error(`Failed to create parent-child relationship: ${error.message}`);
    }
  }
  
  // Generated content operations
  async getGeneratedContents(userId: number): Promise<GeneratedContent[]> {
    try {
      return await db
        .select()
        .from(generatedContent)
        .where(eq(generatedContent.userId, userId));
    } catch (error) {
      console.error('Error in getGeneratedContents:', error);
      return [];
    }
  }
  
  async getGeneratedContent(id: number): Promise<GeneratedContent | undefined> {
    try {
      const [content] = await db
        .select()
        .from(generatedContent)
        .where(eq(generatedContent.id, id));
      return content;
    } catch (error) {
      console.error('Error in getGeneratedContent:', error);
      return undefined;
    }
  }
  
  async createGeneratedContent(contentData: InsertGeneratedContent): Promise<GeneratedContent> {
    try {
      const [content] = await db
        .insert(generatedContent)
        .values(contentData)
        .returning();
      return content;
    } catch (error) {
      console.error('Error in createGeneratedContent:', error);
      throw new Error(`Failed to create generated content: ${error.message}`);
    }
  }
}

// Create and export the storage instance
export const storage = new DatabaseStorage();