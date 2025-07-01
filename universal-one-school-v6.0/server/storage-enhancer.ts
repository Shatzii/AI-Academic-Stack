// This file enhances the existing storage implementation with database support
// It's imported and applied in index.ts

import { pool } from './db';
import session from 'express-session';
import connectPg from 'connect-pg-simple';
import { eq } from 'drizzle-orm';
import { db } from './db';
import * as schema from '../shared/schema';
import { MemStorage } from './storage';

// Create the PostgreSQL session store
const PostgresSessionStore = connectPg(session);

// Apply enhanced methods to memory storage
export function enhanceStorage() {
  // Patch the memory storage implementation
  const memStorage = MemStorage.prototype as any;
  
  // Add PostgreSQL session store if needed
  if (!memStorage.sessionStore) {
    memStorage.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true
    });
    console.log('✅ Added PostgreSQL session store to storage');
  }
  
  // Enhanced versions of the vocabulary methods that use database first
  const enhancedMethods = {
    async getVocabularyLists() {
      console.log('Using enhanced getVocabularyLists method');
      try {
        // First try to get from database
        const dbLists = await db.select().from(schema.vocabularyLists);
        
        if (dbLists && dbLists.length > 0) {
          // Update in-memory maps for compatibility
          for (const list of dbLists) {
            this.vocabularyLists.set(list.id, list);
          }
          return dbLists;
        }
        
        // Fall back to in-memory if no results
        return Array.from(this.vocabularyLists.values());
      } catch (error) {
        console.error('Error in enhanced getVocabularyLists:', error);
        return Array.from(this.vocabularyLists.values());
      }
    },
    
    async getLanguageModules() {
      console.log('Using enhanced getLanguageModules method');
      try {
        // First try to get from database
        const dbModules = await db.select().from(schema.languageModules);
        
        if (dbModules && dbModules.length > 0) {
          // Update in-memory maps for compatibility
          for (const module of dbModules) {
            this.languageModules.set(module.id, module);
          }
          return dbModules;
        }
        
        // Fall back to in-memory if no results
        return Array.from(this.languageModules.values());
      } catch (error) {
        console.error('Error in enhanced getLanguageModules:', error);
        return Array.from(this.languageModules.values());
      }
    },
    
    async createVocabularyList(list: any) {
      console.log('Using enhanced createVocabularyList method');
      try {
        // First try to insert into database
        const [newList] = await db.insert(schema.vocabularyLists)
          .values(list)
          .returning();
          
        if (newList) {
          // Update in-memory for compatibility
          this.vocabularyLists.set(newList.id, newList);
          // Set current ID to be one more than the highest known ID
          this.vocabularyListCurrentId = Math.max(this.vocabularyListCurrentId, newList.id + 1);
          return newList;
        }
        
        // Fall back to in-memory implementation if database insert fails
        return this._originalCreateVocabularyList(list);
      } catch (error) {
        console.error('Error in enhanced createVocabularyList:', error);
        return this._originalCreateVocabularyList(list);
      }
    },
    
    async createVocabularyItem(item: any) {
      console.log('Using enhanced createVocabularyItem method');
      try {
        // First try to insert into database
        const [newItem] = await db.insert(schema.vocabularyItems)
          .values(item)
          .returning();
          
        if (newItem) {
          // Update in-memory for compatibility
          this.vocabularyItems.set(newItem.id, newItem);
          // Set current ID to be one more than the highest known ID
          this.vocabularyItemCurrentId = Math.max(this.vocabularyItemCurrentId, newItem.id + 1);
          return newItem;
        }
        
        // Fall back to in-memory implementation if database insert fails
        return this._originalCreateVocabularyItem(item);
      } catch (error) {
        console.error('Error in enhanced createVocabularyItem:', error);
        return this._originalCreateVocabularyItem(item);
      }
    }
  };
  
  // Store original methods for fallback
  if (!memStorage._originalCreateVocabularyList) {
    memStorage._originalCreateVocabularyList = memStorage.createVocabularyList;
  }
  
  if (!memStorage._originalCreateVocabularyItem) {
    memStorage._originalCreateVocabularyItem = memStorage.createVocabularyItem;
  }
  
  // Apply enhanced methods
  Object.assign(memStorage, enhancedMethods);
  
  console.log('✅ Enhanced storage implementation with database-first methods');
}