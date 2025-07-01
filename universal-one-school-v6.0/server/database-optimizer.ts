import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import { Performance } from '../lib/performance';

neonConfig.webSocketConstructor = ws;

interface DatabaseConfig {
  maxConnections: number;
  idleTimeout: number;
  connectionTimeout: number;
  queryTimeout: number;
  retryAttempts: number;
}

class DatabaseOptimizer {
  private pool: Pool;
  private db: ReturnType<typeof drizzle>;
  private config: DatabaseConfig;
  private connectionMetrics = {
    activeConnections: 0,
    totalQueries: 0,
    slowQueries: 0,
    errors: 0,
    avgQueryTime: 0
  };

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL must be set");
    }

    // Optimized config for 16GB RAM server
    this.config = {
      maxConnections: 10, // Conservative for educational workload
      idleTimeout: 30000, // 30 seconds
      connectionTimeout: 10000, // 10 seconds
      queryTimeout: 30000, // 30 seconds
      retryAttempts: 3
    };

    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: this.config.maxConnections,
      idleTimeoutMillis: this.config.idleTimeout,
      connectionTimeoutMillis: this.config.connectionTimeout,
      statement_timeout: this.config.queryTimeout,
    });

    this.db = drizzle({ 
      client: this.pool, 
      schema,
      logger: process.env.NODE_ENV === 'development'
    });

    this.setupMonitoring();
    this.setupOptimizations();
  }

  private setupMonitoring() {
    // Monitor connection pool health
    setInterval(() => {
      this.logPoolStatus();
    }, 60000); // Every minute

    // Track query performance
    this.pool.on('connect', () => {
      this.connectionMetrics.activeConnections++;
    });

    this.pool.on('remove', () => {
      this.connectionMetrics.activeConnections--;
    });

    this.pool.on('error', (err) => {
      console.error('Database pool error:', err);
      this.connectionMetrics.errors++;
    });
  }

  private setupOptimizations() {
    // Prepared statement cache
    this.pool.on('connect', (client) => {
      // Set connection-level optimizations
      client.query('SET statement_timeout = 30000'); // 30 second query timeout
      client.query('SET idle_in_transaction_session_timeout = 60000'); // 1 minute idle timeout
      client.query('SET lock_timeout = 10000'); // 10 second lock timeout
    });
  }

  // Optimized query wrapper with performance tracking
  async executeQuery<T>(
    queryName: string,
    queryFn: () => Promise<T>,
    useTransaction = false
  ): Promise<T> {
    Performance.start(`db:${queryName}`);
    this.connectionMetrics.totalQueries++;

    try {
      let result: T;
      
      if (useTransaction) {
        result = await this.db.transaction(async (tx) => {
          return await queryFn();
        });
      } else {
        result = await queryFn();
      }

      const duration = Performance.end(`db:${queryName}`) || 0;
      
      // Track slow queries (>100ms)
      if (duration > 100) {
        this.connectionMetrics.slowQueries++;
        console.warn(`Slow query detected: ${queryName} took ${duration.toFixed(2)}ms`);
      }

      // Update average query time
      this.connectionMetrics.avgQueryTime = 
        (this.connectionMetrics.avgQueryTime * (this.connectionMetrics.totalQueries - 1) + duration) / 
        this.connectionMetrics.totalQueries;

      return result;
    } catch (error) {
      Performance.end(`db:${queryName}`);
      this.connectionMetrics.errors++;
      
      // Retry logic for transient errors
      if (this.isRetryableError(error) && this.config.retryAttempts > 0) {
        console.warn(`Retrying query ${queryName} due to error:`, error);
        await this.sleep(1000); // Wait 1 second before retry
        return this.executeQueryWithRetry(queryName, queryFn, useTransaction, this.config.retryAttempts - 1);
      }
      
      throw error;
    }
  }

  private async executeQueryWithRetry<T>(
    queryName: string,
    queryFn: () => Promise<T>,
    useTransaction: boolean,
    attemptsLeft: number
  ): Promise<T> {
    if (attemptsLeft <= 0) {
      throw new Error(`Query ${queryName} failed after all retry attempts`);
    }

    try {
      return await this.executeQuery(queryName, queryFn, useTransaction);
    } catch (error) {
      if (this.isRetryableError(error) && attemptsLeft > 1) {
        await this.sleep(2000); // Exponential backoff
        return this.executeQueryWithRetry(queryName, queryFn, useTransaction, attemptsLeft - 1);
      }
      throw error;
    }
  }

  private isRetryableError(error: any): boolean {
    if (!error) return false;
    
    const retryableCodes = [
      'ECONNRESET',
      'ECONNREFUSED',
      'ETIMEDOUT',
      'ENOTFOUND',
      'ENETUNREACH'
    ];
    
    return retryableCodes.some(code => 
      error.code === code || 
      error.message?.includes(code) ||
      error.message?.includes('connection') ||
      error.message?.includes('timeout')
    );
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private logPoolStatus() {
    const poolStatus = {
      totalCount: this.pool.totalCount,
      idleCount: this.pool.idleCount,
      waitingCount: this.pool.waitingCount,
      ...this.connectionMetrics
    };

    if (process.env.NODE_ENV === 'development') {
      console.log('Database Pool Status:', poolStatus);
    }

    // Alert on concerning metrics
    if (poolStatus.waitingCount > 5) {
      console.warn('High database connection wait queue:', poolStatus.waitingCount);
    }

    if (this.connectionMetrics.avgQueryTime > 200) {
      console.warn('High average query time:', this.connectionMetrics.avgQueryTime.toFixed(2), 'ms');
    }

    if (this.connectionMetrics.errors > 10) {
      console.error('High database error count:', this.connectionMetrics.errors);
    }
  }

  // Common optimized queries for educational platform
  async getSchoolWithStudents(schoolId: string) {
    return this.executeQuery('getSchoolWithStudents', async () => {
      return await this.db.query.schools.findFirst({
        where: (schools, { eq }) => eq(schools.id, schoolId),
        with: {
          schoolModules: {
            with: {
              module: true
            }
          },
          classrooms: {
            with: {
              studentClassrooms: {
                with: {
                  student: true
                }
              }
            }
          }
        }
      });
    });
  }

  async getStudentProgress(studentId: string, limit = 50) {
    return this.executeQuery('getStudentProgress', async () => {
      return await this.db.query.analytics.findMany({
        where: (analytics, { eq, and }) => and(
          eq(analytics.entityType, 'student'),
          eq(analytics.entityId, studentId)
        ),
        orderBy: (analytics, { desc }) => [desc(analytics.timestamp)],
        limit
      });
    });
  }

  async getCurriculumContent(schoolId: string, gradeLevel: string, subject: string) {
    return this.executeQuery('getCurriculumContent', async () => {
      return await this.db.query.content.findMany({
        where: (content, { eq, and }) => and(
          eq(content.gradeLevel, gradeLevel),
          eq(content.subject, subject),
          eq(content.isPublished, true)
        ),
        limit: 100
      });
    });
  }

  // Bulk operations for better performance
  async bulkInsertAnalytics(analyticsData: any[]) {
    return this.executeQuery('bulkInsertAnalytics', async () => {
      const batchSize = 100;
      const results = [];
      
      for (let i = 0; i < analyticsData.length; i += batchSize) {
        const batch = analyticsData.slice(i, i + batchSize);
        const result = await this.db.insert(schema.analytics).values(batch);
        results.push(result);
      }
      
      return results;
    }, true); // Use transaction for bulk operations
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await this.executeQuery('healthCheck', async () => {
        const result = await this.pool.query('SELECT 1 as health');
        return result.rows[0];
      });
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }

  // Get performance metrics
  getMetrics() {
    return {
      ...this.connectionMetrics,
      poolStatus: {
        totalCount: this.pool.totalCount,
        idleCount: this.pool.idleCount,
        waitingCount: this.pool.waitingCount
      }
    };
  }

  // Graceful shutdown
  async shutdown() {
    console.log('Shutting down database connections...');
    await this.pool.end();
  }

  // Get the optimized database instance
  getDB() {
    return this.db;
  }

  getPool() {
    return this.pool;
  }
}

// Export singleton instance
export const dbOptimizer = new DatabaseOptimizer();
export const db = dbOptimizer.getDB();
export const pool = dbOptimizer.getPool();

// Graceful shutdown handler
process.on('SIGTERM', async () => {
  await dbOptimizer.shutdown();
});

process.on('SIGINT', async () => {
  await dbOptimizer.shutdown();
});

// Export utility functions
export const DatabaseQueries = {
  getSchoolWithStudents: (schoolId: string) => 
    dbOptimizer.getSchoolWithStudents(schoolId),
  
  getStudentProgress: (studentId: string, limit?: number) => 
    dbOptimizer.getStudentProgress(studentId, limit),
  
  getCurriculumContent: (schoolId: string, gradeLevel: string, subject: string) => 
    dbOptimizer.getCurriculumContent(schoolId, gradeLevel, subject),
  
  bulkInsertAnalytics: (data: any[]) => 
    dbOptimizer.bulkInsertAnalytics(data),
  
  healthCheck: () => 
    dbOptimizer.healthCheck(),
  
  getMetrics: () => 
    dbOptimizer.getMetrics()
};