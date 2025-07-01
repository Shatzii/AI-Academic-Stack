import { Pool, neonConfig, QueryResult } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { sql } from 'drizzle-orm';
import * as schema from "@shared/schema";

// Enable WebSocket support for Neon database
// @ts-ignore - Import WebSocket without type declarations
import ws from 'ws';
neonConfig.webSocketConstructor = ws;

// Verify database connection string
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set. Did you forget to provision a database?");
}

// Create connection pool
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Create drizzle database instance
export const db = drizzle(pool, { schema });

// Export sql for raw queries
export { sql };

/**
 * Utility function to convert any database query result to an array of records
 * Works with different database drivers and result formats
 */
export function toArray<T = Record<string, any>>(queryResult: any): T[] {
  try {
    // Check if result is already an array
    if (Array.isArray(queryResult)) {
      return queryResult as T[];
    }
    
    // Handle PostgreSQL driver result
    if (queryResult && typeof queryResult === 'object') {
      // Handle standard pg/neon driver format
      if ('rows' in queryResult) {
        return queryResult.rows as T[];
      }
      
      // Handle the case where the result is a single object
      if (!('length' in queryResult) && Object.keys(queryResult).length > 0) {
        return [queryResult as T];
      }
    }
    
    // Try to convert iterable to array
    if (queryResult && typeof queryResult[Symbol.iterator] === 'function') {
      return Array.from(queryResult) as T[];
    }
    
    // Return empty array as fallback
    return [];
  } catch (error) {
    console.error('Error in database result conversion:', error);
    return [];
  }
}

/**
 * Utility function to get the first row from a query result
 * Returns null if no rows found
 */
export function getFirstRow<T = Record<string, any>>(queryResult: any): T | null {
  const rows = toArray<T>(queryResult);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Function to test database connection
 */
export async function testDatabaseConnection() {
  try {
    // Execute a simple query to test connection
    const result = await pool.query('SELECT NOW()');
    console.log("✅ Database connection successful:", result.rows[0].now);
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return false;
  }
}