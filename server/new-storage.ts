import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { eq } from 'drizzle-orm';
import session from "express-session";
import connectPgSimple from "connect-pg-simple";

import { 
  users,
  apiKeys,
  type User,
  type InsertUser,
  type ApiKey,
  type InsertApiKey
} from "@shared/schema";

import { pool, db } from './db';

// Session store for PostgreSQL
const PostgresSessionStore = connectPgSimple(session);

// Storage interface for authentication
export interface IAuthStorage {
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
}

// Database storage implementation
export class AuthStorage implements IAuthStorage {
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
}

// Create and export the storage instance
export const authStorage = new AuthStorage();