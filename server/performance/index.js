/**
 * ShatziiOS Performance Optimization Module
 * 
 * This module provides a unified interface to all server-side optimizations,
 * ensuring efficient operation within constrained resources.
 */

const { optimizeServer } = require('./server-optimizer');
const { createOptimizedPool } = require('./database-optimizer');
const { 
  createAssetOptimizerMiddleware, 
  precompressAssets, 
  createCompressionMiddleware 
} = require('./asset-optimizer');

/**
 * Initialize all performance optimizations
 * @param {Object} app - Express application
 * @param {Object} config - Optimization configuration
 * @param {Object} db - Database connection (optional)
 * @returns {Object} Performance optimization utilities
 */
function initializeOptimizations(app, config = {}, db = null) {
  // Default configuration sections
  const defaultConfig = {
    server: {},
    database: {},
    assets: {}
  };
  
  // Merge provided config with defaults
  const mergedConfig = {
    server: { ...defaultConfig.server, ...(config.server || {}) },
    database: { ...defaultConfig.database, ...(config.database || {}) },
    assets: { ...defaultConfig.assets, ...(config.assets || {}) }
  };
  
  // Apply server optimizations
  const serverOptimizer = optimizeServer(app, mergedConfig.server);
  
  // Apply database optimizations if database is provided
  let dbOptimizer = null;
  if (db && typeof db === 'object') {
    if (typeof db.query === 'function') {
      // Assume this is a pg pool
      dbOptimizer = {
        pool: db,
        ...createOptimizedPool(db.options || {}, mergedConfig.database)
      };
    } else if (typeof db.sequelize === 'object') {
      // Assume this is a Sequelize instance
      dbOptimizer = {
        sequelize: db.sequelize,
        ...createOptimizedPool(db.sequelize.config, mergedConfig.database)
      };
    }
  }
  
  // Apply asset optimizations
  const assetOptimizerMiddleware = createAssetOptimizerMiddleware(mergedConfig.assets);
  const compressionMiddleware = createCompressionMiddleware(mergedConfig.assets);
  
  // Apply middleware
  app.use(compressionMiddleware);
  app.use(assetOptimizerMiddleware);
  
  // Return optimization API
  return {
    // Server optimization utilities
    server: serverOptimizer,
    
    // Database optimization utilities
    database: dbOptimizer,
    
    // Asset optimization utilities
    assets: {
      precompress: (staticDir) => precompressAssets(staticDir, mergedConfig.assets)
    },
    
    // Health check and monitor
    getHealthStatus: () => ({
      server: serverOptimizer.getStats(),
      database: dbOptimizer ? dbOptimizer.getStats() : null,
      timestamp: Date.now()
    }),
    
    // Configuration management
    getConfig: () => ({ ...mergedConfig }),
    updateConfig: (newConfig) => {
      // Update server config
      if (newConfig.server) {
        serverOptimizer.updateConfig(newConfig.server);
        mergedConfig.server = { ...mergedConfig.server, ...newConfig.server };
      }
      
      // Update database config
      if (newConfig.database && dbOptimizer) {
        dbOptimizer.updateConfig(newConfig.database);
        mergedConfig.database = { ...mergedConfig.database, ...newConfig.database };
      }
      
      // Update asset config
      if (newConfig.assets) {
        mergedConfig.assets = { ...mergedConfig.assets, ...newConfig.assets };
      }
      
      return { ...mergedConfig };
    }
  };
}

// Export optimization functions
module.exports = {
  initializeOptimizations,
  serverOptimizer: { optimizeServer },
  databaseOptimizer: { createOptimizedPool },
  assetOptimizer: {
    createAssetOptimizerMiddleware,
    precompressAssets,
    createCompressionMiddleware
  }
};