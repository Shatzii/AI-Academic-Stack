/**
 * ShatziiOS Database Optimizer
 * 
 * This module provides database optimization functions to ensure efficient
 * operation with PostgreSQL within constrained resources.
 */

const { Pool } = require('pg');

/**
 * Default optimizer configuration
 */
const defaultConfig = {
  // Connection Pool Configuration
  maxPoolSize: 10,
  minPoolSize: 2,
  idleTimeoutMillis: 30000, // 30 seconds
  connectionTimeoutMillis: 5000, // 5 seconds
  
  // Query Optimizations
  statementTimeout: 30000, // 30 seconds
  queryLogEnabled: false,
  
  // Performance Monitoring
  connectionPruningInterval: 60000, // 1 minute
  
  // Table Optimization
  vacuumThreshold: 1000, // Auto-vacuum after this many writes
  reindexInterval: 24 * 60 * 60 * 1000 // 24 hours
};

// Performance stats tracking
let dbStats = {
  totalQueries: 0,
  activeConnections: 0,
  slowQueries: 0,
  errors: 0,
  lastVacuumTime: null,
  lastReindexTime: null,
  queryCounts: {},
  tablesModified: {}
};

// Query execution counts for identifying frequent queries
const queryRegister = new Map();

/**
 * Create an optimized database connection pool
 * @param {Object} connectionConfig - Database connection configuration
 * @param {Object} optimizerConfig - Optimizer configuration (optional)
 * @returns {Object} Optimized database pool
 */
function createOptimizedPool(connectionConfig, optimizerConfig = {}) {
  // Merge provided config with defaults
  const mergedConfig = { ...defaultConfig, ...optimizerConfig };
  
  // Set up optimized connection pool
  const pool = new Pool({
    ...connectionConfig,
    max: mergedConfig.maxPoolSize,
    min: mergedConfig.minPoolSize,
    idleTimeoutMillis: mergedConfig.idleTimeoutMillis,
    connectionTimeoutMillis: mergedConfig.connectionTimeoutMillis
  });
  
  // Set up connection management
  pool.on('connect', client => {
    // Set statement timeout
    client.query(`SET statement_timeout TO ${mergedConfig.statementTimeout}`);
    
    // Track active connections
    dbStats.activeConnections++;
    
    // Set client-specific query interceptor if enabled
    if (mergedConfig.queryLogEnabled) {
      const originalQuery = client.query;
      client.query = function(text, params, callback) {
        const start = Date.now();
        
        // Register query
        registerQuery(text);
        
        // Increment query count
        dbStats.totalQueries++;
        
        // Call original query function
        return originalQuery.call(this, text, params, (err, result) => {
          // Calculate query duration
          const duration = Date.now() - start;
          
          // Track slow queries
          if (duration > 1000) {
            dbStats.slowQueries++;
            console.warn(`Slow query (${duration}ms): ${text.substring(0, 100)}...`);
          }
          
          // Track errors
          if (err) {
            dbStats.errors++;
          }
          
          // Track modifications
          if (isModificationQuery(text)) {
            trackModification(text);
          }
          
          // Call original callback
          if (callback) {
            callback(err, result);
          }
        });
      };
    }
  });
  
  // Handle pool errors
  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    dbStats.errors++;
  });
  
  // Connection release management
  pool.on('release', client => {
    dbStats.activeConnections = Math.max(0, dbStats.activeConnections - 1);
  });
  
  // Set up periodic connection pruning
  if (mergedConfig.connectionPruningInterval > 0) {
    setInterval(() => {
      pool.query('SELECT 1');
    }, mergedConfig.connectionPruningInterval);
  }
  
  // Set up periodic table maintenance
  if (mergedConfig.reindexInterval > 0) {
    setInterval(() => {
      performTableMaintenance(pool, mergedConfig);
    }, mergedConfig.reindexInterval);
  }
  
  // Return enhanced pool with optimization utilities
  return {
    pool,
    
    // Wrap query method to provide optimization features
    query: async (text, params) => {
      // Register query
      registerQuery(text);
      
      try {
        const result = await pool.query(text, params);
        
        // Track modifications
        if (isModificationQuery(text)) {
          trackModification(text);
          
          // Check if vacuum needed
          checkVacuumNeeded(pool, mergedConfig);
        }
        
        return result;
      } catch (error) {
        dbStats.errors++;
        throw error;
      }
    },
    
    // Add optimizer metrics and utilities
    getStats: () => ({ ...dbStats }),
    
    // Manually trigger maintenance
    performMaintenance: async () => {
      return await performTableMaintenance(pool, mergedConfig);
    },
    
    // Get optimization recommendations
    getOptimizationRecommendations: async () => {
      return await generateOptimizationRecommendations(pool);
    },
    
    // Get the underlying pool for direct access
    getPool: () => pool
  };
}

/**
 * Register a query in the query register for analysis
 * @param {string} queryText - Query text
 */
function registerQuery(queryText) {
  // Normalize query by removing literals
  const normalizedQuery = normalizeQuery(queryText);
  
  // Increment query count
  if (queryRegister.has(normalizedQuery)) {
    queryRegister.set(normalizedQuery, queryRegister.get(normalizedQuery) + 1);
  } else {
    queryRegister.set(normalizedQuery, 1);
  }
  
  // Update query counts in stats
  dbStats.queryCounts = Object.fromEntries(
    [...queryRegister.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
  );
}

/**
 * Normalize a query by removing literals for pattern matching
 * @param {string} queryText - Raw query text
 * @returns {string} Normalized query
 */
function normalizeQuery(queryText) {
  return queryText
    .replace(/\s+/g, ' ')                // Normalize whitespace
    .replace(/'[^']*'/g, '?')            // Replace string literals
    .replace(/\d+/g, '?')                // Replace numeric literals
    .replace(/\$\d+/g, '$?')             // Replace parameter placeholders
    .trim();
}

/**
 * Check if a query is a modification query (INSERT, UPDATE, DELETE)
 * @param {string} queryText - Query text
 * @returns {boolean} True if query modifies data
 */
function isModificationQuery(queryText) {
  const normalizedQuery = queryText.trim().toUpperCase();
  return normalizedQuery.startsWith('INSERT') ||
         normalizedQuery.startsWith('UPDATE') ||
         normalizedQuery.startsWith('DELETE');
}

/**
 * Track table modifications for vacuum analysis
 * @param {string} queryText - Query text
 */
function trackModification(queryText) {
  // Extract table name from query
  const normalizedQuery = queryText.trim().toUpperCase();
  let tableName = null;
  
  if (normalizedQuery.startsWith('INSERT')) {
    const match = normalizedQuery.match(/INSERT\s+INTO\s+([^\s(]+)/i);
    if (match) tableName = match[1];
  } else if (normalizedQuery.startsWith('UPDATE')) {
    const match = normalizedQuery.match(/UPDATE\s+([^\s]+)/i);
    if (match) tableName = match[1];
  } else if (normalizedQuery.startsWith('DELETE')) {
    const match = normalizedQuery.match(/DELETE\s+FROM\s+([^\s]+)/i);
    if (match) tableName = match[1];
  }
  
  // Track modification
  if (tableName) {
    if (dbStats.tablesModified[tableName]) {
      dbStats.tablesModified[tableName]++;
    } else {
      dbStats.tablesModified[tableName] = 1;
    }
  }
}

/**
 * Check if any tables need vacuum based on modification counts
 * @param {Object} pool - Database connection pool
 * @param {Object} config - Optimizer configuration
 */
async function checkVacuumNeeded(pool, config) {
  for (const [tableName, count] of Object.entries(dbStats.tablesModified)) {
    if (count >= config.vacuumThreshold) {
      try {
        // Perform vacuum on table
        await pool.query(`VACUUM ANALYZE ${tableName}`);
        
        // Reset modification count
        dbStats.tablesModified[tableName] = 0;
        
        // Update vacuum time
        dbStats.lastVacuumTime = new Date();
        
        console.log(`Performed VACUUM on table ${tableName}`);
      } catch (error) {
        console.error(`Error vacuuming table ${tableName}:`, error);
      }
    }
  }
}

/**
 * Perform database table maintenance
 * @param {Object} pool - Database connection pool
 * @param {Object} config - Optimizer configuration
 */
async function performTableMaintenance(pool, config) {
  try {
    // Get list of tables
    const tablesResult = await pool.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
    `);
    
    // Perform maintenance on each table
    for (const row of tablesResult.rows) {
      const tableName = row.tablename;
      
      // Perform ANALYZE to update statistics
      await pool.query(`ANALYZE ${tableName}`);
      
      // Check if table needs VACUUM
      if (dbStats.tablesModified[tableName] && 
          dbStats.tablesModified[tableName] >= config.vacuumThreshold / 2) {
        await pool.query(`VACUUM ANALYZE ${tableName}`);
        dbStats.tablesModified[tableName] = 0;
      }
    }
    
    // Update maintenance times
    dbStats.lastVacuumTime = new Date();
    dbStats.lastReindexTime = new Date();
    
    return {
      success: true,
      tablesProcessed: tablesResult.rows.length
    };
  } catch (error) {
    console.error('Error performing table maintenance:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Generate optimization recommendations based on database usage
 * @param {Object} pool - Database connection pool
 * @returns {Object} Optimization recommendations
 */
async function generateOptimizationRecommendations(pool) {
  const recommendations = {
    indexRecommendations: [],
    tableRecommendations: [],
    queryRecommendations: []
  };
  
  try {
    // Get missing indexes
    const missingIndexesResult = await pool.query(`
      SELECT 
        schemaname || '.' || relname AS table_name,
        indexrelname AS index_name,
        idx_scan AS index_scans,
        seq_scan AS sequential_scans,
        seq_tup_read AS sequential_tuples_read,
        idx_tup_fetch AS index_tuples_fetched,
        'CREATE INDEX idx_' || relname || '_' || 
          array_to_string(
            (SELECT array_agg(attname) FROM pg_attribute 
             WHERE attrelid = relid AND attnum > 0 AND attnum <= 3), 
            '_'
          ) || ' ON ' || schemaname || '.' || relname || 
          ' (' || 
            (SELECT string_agg(attname, ', ') FROM pg_attribute 
             WHERE attrelid = relid AND attnum > 0 AND attnum <= 3) || 
          ');'
        AS create_index_statement
      FROM pg_stat_user_tables
      WHERE seq_scan > 10 AND seq_scan > idx_scan
      ORDER BY seq_tup_read DESC
      LIMIT 5
    `);
    
    recommendations.indexRecommendations = missingIndexesResult.rows;
    
    // Get bloated tables
    const bloatedTablesResult = await pool.query(`
      SELECT
        schemaname || '.' || relname AS table_name,
        n_live_tup AS row_count,
        n_dead_tup AS dead_tuples,
        CASE 
          WHEN n_live_tup > 0 
          THEN round(n_dead_tup * 100.0 / n_live_tup, 2) 
          ELSE 0 
        END AS dead_tuple_pct,
        CASE 
          WHEN n_dead_tup > n_live_tup * 0.2 
          THEN 'VACUUM ANALYZE ' || schemaname || '.' || relname || ';'
          ELSE NULL 
        END AS recommendation
      FROM pg_stat_user_tables
      WHERE n_dead_tup > 100
      ORDER BY dead_tuple_pct DESC
      LIMIT 5
    `);
    
    recommendations.tableRecommendations = bloatedTablesResult.rows;
    
    // Analyze slow queries
    recommendations.queryRecommendations = Object.entries(dbStats.queryCounts)
      .map(([query, count]) => ({
        query,
        count,
        recommendation: 'Consider adding an index for the WHERE clause or optimizing the query.'
      }))
      .slice(0, 5);
    
    return recommendations;
  } catch (error) {
    console.error('Error generating optimization recommendations:', error);
    return {
      error: error.message,
      recommendations
    };
  }
}

// Export database optimization functions
module.exports = {
  createOptimizedPool
};