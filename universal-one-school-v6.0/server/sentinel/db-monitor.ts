/**
 * Sentinel 4.5 Database Query Monitoring System
 * 
 * This module provides real-time monitoring of database queries to detect
 * and block potential SQL injection attempts or unusually heavy data extraction.
 */

import { sendAlert, AlertSeverity, AlertType } from './alert-system';
import { logSecurityEvent, logAuditEvent } from './audit-log';
import { Pool } from 'pg';
import * as schema from '@shared/schema';

// Configuration
const MAX_QUERY_EXECUTION_TIME_MS = 5000; // Alert threshold for slow queries
const MAX_ROWS_FETCHED = 10000; // Alert threshold for large result sets
const MAX_JOINS = 5; // Alert threshold for complex queries
const MAX_QUERY_LENGTH = 8000; // Alert threshold for large queries

// SQL injection patterns to detect
const SQL_INJECTION_PATTERNS = [
  /UNION\s+SELECT/i,
  /OR\s+1=1/i,
  /OR\s+'1'='1'/i,
  /;\s*DELETE\s+FROM/i,
  /;\s*DROP\s+TABLE/i,
  /SLEEP\s*\(/i,
  /BENCHMARK\s*\(/i,
  /INFORMATION_SCHEMA/i,
  /\/\*.*\*\//i, // SQL comment patterns often used in injections
  /EXECUTE\s*\(/i,
  /EXEC\s*\(/i,
  /DECLARE\s+@/i
];

// Database entities with sensitivity levels (1-5)
const ENTITY_SENSITIVITY: Record<string, number> = {
  'users': 5,
  'user_sessions': 4,
  'api_keys': 5,
  'security_logs': 3,
  'audit_logs': 4,
  'courses': 2,
  'lessons': 2,
  'missions': 2,
  'rewards': 2,
  'products': 3,
  'orders': 4,
  'payments': 5,
  'settings': 3
};

// Track ongoing queries
interface ActiveQuery {
  id: string;
  query: string;
  params: any[];
  user: string;
  startTime: number;
  clientIP: string;
  sourceFunction?: string;
  blocked: boolean;
  blockReason?: string;
}

// Track user query stats
interface UserQueryStats {
  totalQueries: number;
  totalExecutionTime: number;
  totalRowsFetched: number;
  queries: {
    read: number;
    write: number;
    delete: number;
  };
  lastActivity: number;
}

// Maintain active queries and user stats
const activeQueries: Map<string, ActiveQuery> = new Map();
const userQueryStats: Map<string, UserQueryStats> = new Map();

// Original query function placeholder for wrapping
let originalQuery: any;

/**
 * Initialize database monitoring on a pool
 */
export function initDatabaseMonitoring(pool: Pool): void {
  // Save original query function
  originalQuery = pool.query;
  
  // Override the query function
  pool.query = async function(...args: any[]): Promise<any> {
    const queryId = `query-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const user = global.currentUser?.username || 'system';
    const clientIP = global.currentIP || 'unknown';
    
    // Prepare query info
    let query = '';
    let params: any[] = [];
    
    // Parse arguments (different overloads possible)
    if (typeof args[0] === 'string') {
      // Simple query string
      query = args[0];
      params = args[1] || [];
    } else if (typeof args[0] === 'object') {
      // Config object
      query = args[0].text;
      params = args[0].values || [];
    }
    
    // Get stack trace to identify source function
    const stackTrace = new Error().stack || '';
    const stackLines = stackTrace.split('\n').slice(2); // Skip constructor and this function
    const sourceFunction = stackLines[0]?.trim();
    
    // Record query start
    const startTime = Date.now();
    
    // Create active query record
    const activeQuery: ActiveQuery = {
      id: queryId,
      query,
      params,
      user,
      startTime,
      clientIP,
      sourceFunction,
      blocked: false
    };
    
    // Security check the query before executing
    const securityCheck = checkQuerySecurity(activeQuery);
    
    // Track the query
    activeQueries.set(queryId, activeQuery);
    
    // Update user stats
    updateUserQueryStats(user, query);
    
    // If query is blocked, don't execute
    if (securityCheck.blocked) {
      activeQuery.blocked = true;
      activeQuery.blockReason = securityCheck.reason;
      
      // Log blocked query
      logSecurityEvent(
        user,
        'Database query blocked',
        {
          query,
          params,
          reason: securityCheck.reason
        },
        clientIP
      );
      
      // Send alert
      sendAlert(
        AlertSeverity.HIGH,
        AlertType.INJECTION,
        'Potentially malicious database query blocked',
        {
          query,
          reason: securityCheck.reason,
          user,
          clientIP,
          sourceFunction
        },
        user,
        clientIP
      );
      
      // Remove from active queries
      activeQueries.delete(queryId);
      
      // Throw error
      throw new Error(`Query blocked for security reasons: ${securityCheck.reason}`);
    }
    
    // Execute the query and measure performance
    try {
      const result = await originalQuery.apply(pool, args);
      
      // Calculate execution time
      const executionTime = Date.now() - startTime;
      
      // Remove from active queries
      activeQueries.delete(queryId);
      
      // Check for slow queries
      if (executionTime > MAX_QUERY_EXECUTION_TIME_MS) {
        logSecurityEvent(
          user,
          'Slow database query detected',
          {
            query,
            params,
            executionTime,
            threshold: MAX_QUERY_EXECUTION_TIME_MS
          },
          clientIP
        );
        
        // Alert on very slow queries
        if (executionTime > MAX_QUERY_EXECUTION_TIME_MS * 2) {
          sendAlert(
            AlertSeverity.MEDIUM,
            AlertType.SYSTEM,
            'Extremely slow database query detected',
            {
              query,
              executionTime,
              user,
              clientIP,
              rowCount: result.rowCount
            }
          );
        }
      }
      
      // Check for large result sets
      if (result.rows && result.rows.length > MAX_ROWS_FETCHED) {
        logSecurityEvent(
          user,
          'Large result set fetched',
          {
            query,
            rowCount: result.rows.length,
            threshold: MAX_ROWS_FETCHED
          },
          clientIP
        );
        
        // Alert on very large result sets
        sendAlert(
          AlertSeverity.MEDIUM,
          AlertType.SYSTEM,
          'Unusually large database result set fetched',
          {
            query,
            rowCount: result.rows.length,
            user,
            clientIP
          }
        );
      }
      
      // Update user stats with results
      updateUserQueryStatsWithResult(user, result, executionTime);
      
      // For sensitive data access, log audit
      if (isSensitiveDataQuery(query)) {
        logAuditEvent(
          user,
          'Sensitive data accessed',
          {
            query,
            rowCount: result.rowCount,
            tables: extractTablesFromQuery(query)
          },
          clientIP
        );
      }
      
      return result;
    } catch (error) {
      // Remove from active queries
      activeQueries.delete(queryId);
      
      // Log query errors
      logSecurityEvent(
        user,
        'Database query error',
        {
          query,
          params,
          error: error.message
        },
        clientIP
      );
      
      // Rethrow the error
      throw error;
    }
  };
  
  console.log('Database query monitoring initialized');
}

/**
 * Check if a query contains SQL injection patterns or is otherwise suspicious
 */
function checkQuerySecurity(activeQuery: ActiveQuery): { blocked: boolean; reason?: string } {
  const { query, user, clientIP } = activeQuery;
  
  // Skip empty queries
  if (!query.trim()) {
    return { blocked: true, reason: 'Empty query' };
  }
  
  // Check for maximum query length
  if (query.length > MAX_QUERY_LENGTH) {
    return { blocked: true, reason: `Query exceeds maximum length of ${MAX_QUERY_LENGTH} characters` };
  }
  
  // Check for SQL injection patterns
  for (const pattern of SQL_INJECTION_PATTERNS) {
    if (pattern.test(query)) {
      return { blocked: true, reason: `Query contains suspicious pattern: ${pattern}` };
    }
  }
  
  // Check for excessive JOINs
  const joinMatches = query.match(/JOIN/gi);
  if (joinMatches && joinMatches.length > MAX_JOINS) {
    return { blocked: true, reason: `Query contains excessive JOINs (${joinMatches.length})` };
  }
  
  // Check for unauthorized schema modifications
  if (
    /CREATE\s+TABLE/i.test(query) ||
    /ALTER\s+TABLE/i.test(query) ||
    /DROP\s+TABLE/i.test(query) ||
    /TRUNCATE\s+TABLE/i.test(query)
  ) {
    // Allow schema changes from system user or in development
    if (user !== 'system' && process.env.NODE_ENV === 'production') {
      return { blocked: true, reason: 'Unauthorized schema modification' };
    }
  }
  
  // Check for unauthorized data deletion
  if (/DELETE\s+FROM/i.test(query) && !query.includes('WHERE')) {
    return { blocked: true, reason: 'Unqualified DELETE statement (missing WHERE clause)' };
  }
  
  // Check for unauthorized data updates
  if (/UPDATE\s+.+\s+SET/i.test(query) && !query.includes('WHERE')) {
    return { blocked: true, reason: 'Unqualified UPDATE statement (missing WHERE clause)' };
  }
  
  // Check for SQL comments which might be used to hide malicious code
  if (query.includes('--') || query.includes('/*')) {
    logSecurityEvent(
      user,
      'Query contains SQL comments',
      { query },
      clientIP
    );
    // We don't block here, just log for review
  }
  
  // Query passes security checks
  return { blocked: false };
}

/**
 * Update user query statistics
 */
function updateUserQueryStats(user: string, query: string): void {
  // Initialize stats if needed
  if (!userQueryStats.has(user)) {
    userQueryStats.set(user, {
      totalQueries: 0,
      totalExecutionTime: 0,
      totalRowsFetched: 0,
      queries: {
        read: 0,
        write: 0,
        delete: 0
      },
      lastActivity: Date.now()
    });
  }
  
  const stats = userQueryStats.get(user)!;
  
  // Update query count
  stats.totalQueries++;
  stats.lastActivity = Date.now();
  
  // Update query type counts
  if (query.trim().toUpperCase().startsWith('SELECT')) {
    stats.queries.read++;
  } else if (
    query.trim().toUpperCase().startsWith('INSERT') ||
    query.trim().toUpperCase().startsWith('UPDATE')
  ) {
    stats.queries.write++;
  } else if (query.trim().toUpperCase().startsWith('DELETE')) {
    stats.queries.delete++;
  }
  
  // Update the stats
  userQueryStats.set(user, stats);
}

/**
 * Update user query statistics with query results
 */
function updateUserQueryStatsWithResult(
  user: string,
  result: any,
  executionTime: number
): void {
  if (!userQueryStats.has(user)) return;
  
  const stats = userQueryStats.get(user)!;
  
  // Update execution time
  stats.totalExecutionTime += executionTime;
  
  // Update rows fetched if applicable
  if (result.rows) {
    stats.totalRowsFetched += result.rows.length;
  }
  
  // Update the stats
  userQueryStats.set(user, stats);
}

/**
 * Check if a query accesses sensitive data
 */
function isSensitiveDataQuery(query: string): boolean {
  // Extract tables from query
  const tables = extractTablesFromQuery(query);
  
  // Check if any table is sensitive
  for (const table of tables) {
    const sensitivity = ENTITY_SENSITIVITY[table] || 0;
    if (sensitivity >= 4) {
      return true;
    }
  }
  
  // Check for sensitive columns
  const sensitiveColumns = [
    'password', 'credit_card', 'ssn', 'social_security',
    'address', 'phone', 'email', 'dob', 'birth', 'secret'
  ];
  
  for (const column of sensitiveColumns) {
    if (query.toLowerCase().includes(column)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Extract table names from a SQL query
 */
function extractTablesFromQuery(query: string): string[] {
  const tables: string[] = [];
  
  // Match tables in FROM clauses
  const fromMatches = query.match(/FROM\s+([a-zA-Z0-9_]+)/gi);
  if (fromMatches) {
    for (const match of fromMatches) {
      const table = match.replace(/FROM\s+/i, '').trim();
      tables.push(table);
    }
  }
  
  // Match tables in JOIN clauses
  const joinMatches = query.match(/JOIN\s+([a-zA-Z0-9_]+)/gi);
  if (joinMatches) {
    for (const match of joinMatches) {
      const table = match.replace(/JOIN\s+/i, '').trim();
      tables.push(table);
    }
  }
  
  // Match tables in UPDATE clauses
  const updateMatches = query.match(/UPDATE\s+([a-zA-Z0-9_]+)/gi);
  if (updateMatches) {
    for (const match of updateMatches) {
      const table = match.replace(/UPDATE\s+/i, '').trim();
      tables.push(table);
    }
  }
  
  // Match tables in INSERT clauses
  const insertMatches = query.match(/INSERT\s+INTO\s+([a-zA-Z0-9_]+)/gi);
  if (insertMatches) {
    for (const match of insertMatches) {
      const table = match.replace(/INSERT\s+INTO\s+/i, '').trim();
      tables.push(table);
    }
  }
  
  // Match tables in DELETE clauses
  const deleteMatches = query.match(/DELETE\s+FROM\s+([a-zA-Z0-9_]+)/gi);
  if (deleteMatches) {
    for (const match of deleteMatches) {
      const table = match.replace(/DELETE\s+FROM\s+/i, '').trim();
      tables.push(table);
    }
  }
  
  return tables;
}

/**
 * Get currently active database queries
 */
export function getActiveQueries(): ActiveQuery[] {
  return Array.from(activeQueries.values());
}

/**
 * Get user query statistics
 */
export function getUserQueryStatistics(): Array<{
  user: string;
  stats: UserQueryStats;
}> {
  return Array.from(userQueryStats.entries()).map(([user, stats]) => ({
    user,
    stats
  }));
}

/**
 * Reset monitoring statistics
 */
export function resetMonitoringStatistics(): void {
  userQueryStats.clear();
  
  logAuditEvent(
    'system',
    'Database monitoring statistics reset',
    {},
    'system'
  );
}

/**
 * Kill a running query by ID
 */
export async function killQuery(queryId: string, killedBy: string): Promise<boolean> {
  const query = activeQueries.get(queryId);
  if (!query) return false;
  
  // In a real implementation, this would use pg_terminate_backend
  // Here we just mark it as blocked
  query.blocked = true;
  query.blockReason = 'Manually killed by administrator';
  
  // Log the action
  logAuditEvent(
    killedBy,
    'Database query killed',
    {
      queryId,
      query: query.query,
      user: query.user,
      clientIP: query.clientIP
    },
    'system'
  );
  
  // Send alert
  sendAlert(
    AlertSeverity.MEDIUM,
    AlertType.SYSTEM,
    'Database query manually terminated',
    {
      queryId,
      query: query.query,
      user: query.user,
      killedBy
    }
  );
  
  return true;
}