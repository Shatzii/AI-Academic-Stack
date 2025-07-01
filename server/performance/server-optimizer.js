/**
 * ShatziiOS Server Optimizer
 * 
 * This module implements server-side optimizations to ensure efficient operation
 * within constrained resources (4 CPU, 16GB RAM, 160GB storage).
 */

const os = require('os');
const cluster = require('cluster');
const compression = require('compression');
const { cpus } = require('os');
const { v4: uuidv4 } = require('uuid');

// Default configuration
const defaultConfig = {
  // CPU & Worker Configuration
  numWorkers: Math.max(1, Math.min(os.cpus().length - 1, 3)), // Leave 1 CPU for system, max 3 workers
  workerRestartThreshold: 100 * 1024 * 1024, // Restart workers after 100MB memory usage
  
  // Memory Configuration
  memoryLimitMB: 12 * 1024, // 12GB max application memory
  memoryMonitorInterval: 60 * 1000, // 1 minute
  
  // Database Connection Configuration
  dbPoolMin: 2,
  dbPoolMax: 10,
  dbPoolIdle: 10000, // 10 seconds idle timeout
  dbPoolAcquireTimeout: 30000, // 30 seconds acquire timeout
  
  // Static Asset Configuration
  staticCacheMaxAge: 24 * 60 * 60 * 1000, // 24 hours
  
  // Request Optimization
  requestTimeoutMS: 30000, // 30 second request timeout
  
  // Resource Throttling
  maxRequestsPerMinute: 300,
  maxConcurrentUploads: 5,
  maxUploadSizeMB: 10,
  
  // Logging
  logLevel: 'info',
  logRotationSizeMB: 10,
  maxLogFiles: 5
};

// Track server stats
let serverStats = {
  startTime: Date.now(),
  totalRequests: 0,
  activeRequests: 0,
  completedRequests: 0,
  failedRequests: 0,
  avgResponseTime: 0,
  peakMemoryUsageMB: 0,
  currentMemoryUsageMB: 0,
  totalWorkerRestarts: 0,
  lastStatsReset: Date.now()
};

// Request queue for limiting concurrent operations
const requestQueue = [];
let activeRequests = 0;

// Worker registry for cluster mode
const workers = new Map();

/**
 * Apply optimizations to Express app
 * @param {Express} app - Express application
 * @param {Object} config - Optimizer configuration (optional)
 */
function optimizeServer(app, config = {}) {
  // Merge provided config with defaults
  const mergedConfig = { ...defaultConfig, ...config };
  
  // Apply optimizations
  applyCompressionMiddleware(app);
  applyRequestTracking(app);
  applyTimeoutMiddleware(app, mergedConfig.requestTimeoutMS);
  applyMemoryMonitoring(mergedConfig.memoryMonitorInterval);
  applyStaticAssetOptimizations(app, mergedConfig.staticCacheMaxAge);
  applyRequestRateLimiting(app, mergedConfig.maxRequestsPerMinute);
  
  // If running in cluster primary, set up worker management
  if (cluster.isPrimary) {
    setupCluster(mergedConfig);
  }
  
  // Return optimizer API
  return {
    getStats: () => ({ ...serverStats }),
    resetStats: () => resetStats(),
    getConfig: () => ({ ...mergedConfig }),
    updateConfig: (newConfig) => updateConfig(newConfig, mergedConfig),
    optimizeDbPool: (pool) => optimizeDbPool(pool, mergedConfig)
  };
}

/**
 * Apply compression middleware
 * @param {Express} app - Express application
 */
function applyCompressionMiddleware(app) {
  // Configure compression middleware
  const compressionOptions = {
    level: 6, // Balance between compression ratio and CPU usage
    threshold: 1024, // Only compress responses larger than 1KB
    filter: (req, res) => {
      // Don't compress responses for low-powered devices
      if (req.headers['save-data']) {
        return false;
      }
      // Use compression filter conditions
      return compression.filter(req, res);
    }
  };
  
  // Apply compression middleware
  app.use(compression(compressionOptions));
}

/**
 * Apply request tracking middleware
 * @param {Express} app - Express application
 */
function applyRequestTracking(app) {
  app.use((req, res, next) => {
    // Assign request ID
    req.id = uuidv4();
    
    // Track request metrics
    const startTime = Date.now();
    serverStats.totalRequests++;
    serverStats.activeRequests++;
    
    // Track response metrics
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      serverStats.activeRequests--;
      
      if (res.statusCode >= 200 && res.statusCode < 400) {
        serverStats.completedRequests++;
      } else {
        serverStats.failedRequests++;
      }
      
      // Update average response time
      serverStats.avgResponseTime = calculateNewAverage(
        serverStats.avgResponseTime,
        duration,
        serverStats.completedRequests + serverStats.failedRequests
      );
    });
    
    // Continue processing request
    next();
  });
}

/**
 * Apply timeout middleware
 * @param {Express} app - Express application
 * @param {number} timeoutMS - Timeout in milliseconds
 */
function applyTimeoutMiddleware(app, timeoutMS) {
  app.use((req, res, next) => {
    const timeout = setTimeout(() => {
      if (!res.headersSent) {
        serverStats.failedRequests++;
        serverStats.activeRequests--;
        res.status(503).send('Request timeout');
      }
    }, timeoutMS);
    
    // Clear timeout when response is sent
    res.on('finish', () => {
      clearTimeout(timeout);
    });
    
    next();
  });
}

/**
 * Apply memory monitoring
 * @param {number} intervalMS - Monitoring interval in milliseconds
 */
function applyMemoryMonitoring(intervalMS) {
  const monitorMemory = () => {
    const memoryUsage = process.memoryUsage();
    const currentMemoryMB = Math.round(memoryUsage.rss / (1024 * 1024));
    
    serverStats.currentMemoryUsageMB = currentMemoryMB;
    serverStats.peakMemoryUsageMB = Math.max(serverStats.peakMemoryUsageMB, currentMemoryMB);
    
    // Log high memory usage
    if (currentMemoryMB > defaultConfig.memoryLimitMB * 0.8) {
      console.warn(`High memory usage: ${currentMemoryMB}MB (${Math.round(currentMemoryMB / defaultConfig.memoryLimitMB * 100)}% of limit)`);
    }
  };
  
  // Monitor memory usage periodically
  setInterval(monitorMemory, intervalMS);
  
  // Initial memory check
  monitorMemory();
}

/**
 * Apply static asset optimizations
 * @param {Express} app - Express application
 * @param {number} maxAge - Cache max age in milliseconds
 */
function applyStaticAssetOptimizations(app, maxAge) {
  // Apply caching headers to static assets
  app.use('/static', (req, res, next) => {
    res.set('Cache-Control', `public, max-age=${Math.floor(maxAge / 1000)}`);
    next();
  });
  
  // Apply caching headers to assets by extension
  app.use((req, res, next) => {
    const url = req.url.toLowerCase();
    const staticExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.css', '.js', '.woff', '.woff2', '.ttf'];
    
    if (staticExtensions.some(ext => url.endsWith(ext))) {
      res.set('Cache-Control', `public, max-age=${Math.floor(maxAge / 1000)}`);
    }
    
    next();
  });
}

/**
 * Apply request rate limiting
 * @param {Express} app - Express application
 * @param {number} maxRequestsPerMinute - Max requests per minute
 */
function applyRequestRateLimiting(app, maxRequestsPerMinute) {
  const requestsTimestamps = [];
  const windowMs = 60 * 1000; // 1 minute
  
  app.use((req, res, next) => {
    const now = Date.now();
    
    // Clean old entries
    while (requestsTimestamps.length > 0 && requestsTimestamps[0] < now - windowMs) {
      requestsTimestamps.shift();
    }
    
    // Check if rate limit is exceeded
    if (requestsTimestamps.length >= maxRequestsPerMinute) {
      serverStats.failedRequests++;
      return res.status(429).send('Too many requests, please try again later.');
    }
    
    // Add current request timestamp
    requestsTimestamps.push(now);
    
    next();
  });
}

/**
 * Set up cluster for multi-process operation
 * @param {Object} config - Server configuration
 */
function setupCluster(config) {
  console.log(`Setting up server cluster with ${config.numWorkers} workers`);
  
  // Fork workers
  for (let i = 0; i < config.numWorkers; i++) {
    forkWorker();
  }
  
  // Listen for worker exit
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.id} died with code ${code} and signal ${signal}`);
    workers.delete(worker.id);
    
    // Replace dead worker
    setTimeout(() => {
      forkWorker();
    }, 1000);
  });
  
  // Monitor workers
  setInterval(() => {
    for (const [id, worker] of workers.entries()) {
      worker.send({ cmd: 'MEMORY_USAGE' });
    }
  }, config.memoryMonitorInterval);
  
  // Handle messages from workers
  cluster.on('message', (worker, message) => {
    if (message.cmd === 'MEMORY_USAGE_REPORT') {
      const workerInfo = workers.get(worker.id);
      
      if (workerInfo) {
        workerInfo.memoryUsage = message.memoryUsage;
        
        // Restart worker if memory usage exceeds threshold
        if (message.memoryUsage.rss > config.workerRestartThreshold) {
          console.log(`Restarting worker ${worker.id} due to high memory usage: ${Math.round(message.memoryUsage.rss / (1024 * 1024))}MB`);
          
          // Fork new worker
          forkWorker();
          
          // Gracefully terminate old worker
          setTimeout(() => {
            worker.disconnect();
            serverStats.totalWorkerRestarts++;
            
            // Force kill if still alive
            setTimeout(() => {
              if (!worker.isDead()) {
                worker.kill();
              }
            }, 5000);
          }, 5000);
        }
      }
    }
  });
}

/**
 * Fork a new worker
 */
function forkWorker() {
  const worker = cluster.fork();
  
  // Store worker info
  workers.set(worker.id, {
    id: worker.id,
    startTime: Date.now(),
    memoryUsage: null
  });
  
  console.log(`Worker ${worker.id} started`);
}

/**
 * Optimize database connection pool
 * @param {Object} pool - Database connection pool
 * @param {Object} config - Server configuration
 */
function optimizeDbPool(pool, config) {
  // Apply database connection pool optimizations
  if (pool && typeof pool.options === 'object') {
    // Apply connection pool limits
    if (pool.options.pool) {
      pool.options.pool.min = config.dbPoolMin;
      pool.options.pool.max = config.dbPoolMax;
      pool.options.pool.idle = config.dbPoolIdle;
      pool.options.pool.acquire = config.dbPoolAcquireTimeout;
    }
    
    // Apply query timeout
    if (typeof pool.options.query === 'object') {
      pool.options.query.timeout = config.requestTimeoutMS;
    }
    
    console.log(`Database connection pool optimized: min=${config.dbPoolMin}, max=${config.dbPoolMax}`);
  }
  
  return pool;
}

/**
 * Calculate new running average
 * @param {number} currentAvg - Current average value
 * @param {number} newValue - New value to include in average
 * @param {number} count - Number of values in average
 * @returns {number} New average value
 */
function calculateNewAverage(currentAvg, newValue, count) {
  return (currentAvg * (count - 1) + newValue) / count;
}

/**
 * Reset server statistics
 */
function resetStats() {
  serverStats = {
    startTime: serverStats.startTime,
    totalRequests: 0,
    activeRequests: 0,
    completedRequests: 0,
    failedRequests: 0,
    avgResponseTime: 0,
    peakMemoryUsageMB: serverStats.currentMemoryUsageMB,
    currentMemoryUsageMB: serverStats.currentMemoryUsageMB,
    totalWorkerRestarts: serverStats.totalWorkerRestarts,
    lastStatsReset: Date.now()
  };
}

/**
 * Update server configuration
 * @param {Object} newConfig - New configuration values
 * @param {Object} currentConfig - Current configuration object to update
 */
function updateConfig(newConfig, currentConfig) {
  // Update configuration with new values
  Object.assign(currentConfig, newConfig);
  
  // Apply changes that require immediate effect
  if (newConfig.logLevel) {
    // Update log level
    console.log(`Log level changed to: ${newConfig.logLevel}`);
  }
  
  // Return updated config
  return { ...currentConfig };
}

// Handle worker messages for cluster worker
if (cluster.isWorker) {
  process.on('message', (message) => {
    if (message.cmd === 'MEMORY_USAGE') {
      process.send({
        cmd: 'MEMORY_USAGE_REPORT',
        memoryUsage: process.memoryUsage()
      });
    }
  });
}

// Export optimization functions
module.exports = {
  optimizeServer
};