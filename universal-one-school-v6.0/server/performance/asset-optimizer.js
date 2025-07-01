/**
 * ShatziiOS Asset Optimizer
 * 
 * This module provides utilities for optimizing static assets and resource loading
 * to improve performance with limited server resources.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const zlib = require('zlib');

/**
 * Default optimizer configuration
 */
const defaultConfig = {
  // Asset Optimizations
  enableCompression: true,
  compressionLevel: 9,
  assetCacheMaxAge: 24 * 60 * 60, // 24 hours in seconds
  
  // Image Optimizations
  optimizeImages: true,
  imageQuality: 85,
  maxImageWidth: 1920,
  
  // Cache Control
  enableETag: true,
  useBrotli: true,
  
  // Asset Manifest
  generateManifest: true,
  manifestPath: 'asset-manifest.json',
  
  // Font Optimizations
  fontSubsetting: true,
  fontFormats: ['woff2', 'woff'],
  
  // Resource Hints
  enablePreload: true,
  enablePrefetch: true,
  
  // CSS/JS Optimizations
  minifyCss: true,
  minifyJs: true,
  inlineCssThreshold: 10 * 1024, // 10KB
  inlineJsThreshold: 5 * 1024, // 5KB
  bundleAssets: true
};

/**
 * Create asset optimizer middleware
 * @param {Object} config - Optimizer configuration (optional)
 * @returns {Function} Express middleware function
 */
function createAssetOptimizerMiddleware(config = {}) {
  // Merge provided config with defaults
  const mergedConfig = { ...defaultConfig, ...config };
  
  // Asset manifest storage
  let assetManifest = {};
  
  // Precompiled asset cache
  const assetCache = new Map();
  
  /**
   * Express middleware function for optimizing assets
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next function
   */
  return function assetOptimizerMiddleware(req, res, next) {
    // Check if request is for a static asset
    const url = req.url;
    const extension = path.extname(url).toLowerCase();
    
    if (!isStaticAsset(url, extension)) {
      // Not a static asset, continue
      return next();
    }
    
    // Check for preload and prefetch headers
    if (mergedConfig.enablePreload) {
      applyResourceHints(req, res, url, extension);
    }
    
    // Apply caching headers
    if (mergedConfig.assetCacheMaxAge > 0) {
      setCacheHeaders(res, mergedConfig.assetCacheMaxAge);
    }
    
    // Apply ETag headers if enabled
    if (mergedConfig.enableETag) {
      const etag = generateAssetEtag(url);
      
      if (etag) {
        res.setHeader('ETag', etag);
        
        // Check if client has current version
        if (req.headers['if-none-match'] === etag) {
          return res.status(304).end();
        }
      }
    }
    
    // Continue regular processing
    next();
  };
}

/**
 * Check if a URL is for a static asset
 * @param {string} url - Request URL
 * @param {string} extension - File extension
 * @returns {boolean} True if URL is for a static asset
 */
function isStaticAsset(url, extension) {
  // Skip API and dynamic routes
  if (url.startsWith('/api/') || url.includes('?')) {
    return false;
  }
  
  // Check static asset extensions
  const staticExtensions = [
    '.css', '.js', '.jpg', '.jpeg', '.png', '.gif', '.svg',
    '.woff', '.woff2', '.ttf', '.eot', '.otf', '.ico',
    '.mp3', '.mp4', '.webm', '.pdf', '.json'
  ];
  
  return staticExtensions.includes(extension);
}

/**
 * Set cache control headers for static assets
 * @param {Object} res - Express response object
 * @param {number} maxAge - Max age in seconds
 */
function setCacheHeaders(res, maxAge) {
  res.setHeader('Cache-Control', `public, max-age=${maxAge}, immutable`);
}

/**
 * Generate ETag for asset caching
 * @param {string} url - Asset URL
 * @returns {string|null} ETag value or null
 */
function generateAssetEtag(url) {
  try {
    // Extract file path from URL
    const filePath = path.join(process.cwd(), 'public', url);
    
    if (fs.existsSync(filePath)) {
      // Get file stats
      const stats = fs.statSync(filePath);
      
      // Generate ETag based on file size and mtime
      return crypto
        .createHash('md5')
        .update(`${stats.size}-${stats.mtime.getTime()}`)
        .digest('hex');
    }
  } catch (error) {
    console.error('Error generating ETag:', error);
  }
  
  return null;
}

/**
 * Apply resource hints for improved loading
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {string} url - Asset URL
 * @param {string} extension - File extension
 */
function applyResourceHints(req, res, url, extension) {
  // Get or create Link header
  let linkHeader = res.getHeader('Link') || '';
  
  // Add preload hints for critical assets
  if (isCriticalAsset(url, extension)) {
    linkHeader += `${linkHeader ? ', ' : ''}<${url}>; rel=preload; as=${getResourceType(extension)}`;
  }
  
  // Set Link header if modified
  if (linkHeader) {
    res.setHeader('Link', linkHeader);
  }
}

/**
 * Check if an asset is critical for page rendering
 * @param {string} url - Asset URL
 * @param {string} extension - File extension
 * @returns {boolean} True if asset is critical
 */
function isCriticalAsset(url, extension) {
  // Consider main CSS and JS files as critical
  return (extension === '.css' && url.includes('main')) ||
         (extension === '.js' && url.includes('main')) ||
         (extension === '.woff2' && url.includes('main-font'));
}

/**
 * Get resource type for preloading
 * @param {string} extension - File extension
 * @returns {string} Resource type
 */
function getResourceType(extension) {
  switch (extension) {
    case '.css': return 'style';
    case '.js': return 'script';
    case '.woff':
    case '.woff2':
    case '.ttf':
    case '.otf':
    case '.eot': return 'font';
    case '.jpg':
    case '.jpeg':
    case '.png':
    case '.gif':
    case '.svg': return 'image';
    case '.mp3': return 'audio';
    case '.mp4':
    case '.webm': return 'video';
    default: return 'fetch';
  }
}

/**
 * Create compressed versions of static assets
 * @param {string} staticDir - Static assets directory
 * @param {Object} config - Optimizer configuration
 * @returns {Object} Manifest of compressed assets
 */
function precompressAssets(staticDir, config = {}) {
  // Merge provided config with defaults
  const mergedConfig = { ...defaultConfig, ...config };
  
  // Manifest to track compressed assets
  const manifest = {
    assets: {},
    created: Date.now(),
    compressionEnabled: mergedConfig.enableCompression,
    compressionLevel: mergedConfig.compressionLevel,
    brotliEnabled: mergedConfig.useBrotli
  };
  
  // Skip if compression is disabled
  if (!mergedConfig.enableCompression) {
    return manifest;
  }
  
  // Process all files in static directory
  processDirectory(staticDir);
  
  // Write manifest if enabled
  if (mergedConfig.generateManifest) {
    const manifestPath = path.join(staticDir, mergedConfig.manifestPath);
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  }
  
  return manifest;
  
  /**
   * Process a directory recursively
   * @param {string} dirPath - Directory path
   */
  function processDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) {
      return;
    }
    
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        // Recursively process subdirectories
        processDirectory(fullPath);
      } else if (entry.isFile()) {
        // Check if file is compressible
        const extension = path.extname(fullPath).toLowerCase();
        if (isCompressibleAsset(extension)) {
          // Compress file
          compressFile(fullPath, extension, staticDir);
        }
      }
    }
  }
  
  /**
   * Compress a single file
   * @param {string} filePath - File path
   * @param {string} extension - File extension
   * @param {string} baseDir - Base directory for relative paths
   */
  function compressFile(filePath, extension, baseDir) {
    try {
      // Read file
      const fileContent = fs.readFileSync(filePath);
      const relativePath = path.relative(baseDir, filePath);
      
      // Skip small files
      if (fileContent.length < 1024) {
        return;
      }
      
      // Create gzip version
      const gzipPath = `${filePath}.gz`;
      const gzipContent = zlib.gzipSync(fileContent, {
        level: mergedConfig.compressionLevel
      });
      fs.writeFileSync(gzipPath, gzipContent);
      
      // Create brotli version if enabled
      let brotliSize = null;
      if (mergedConfig.useBrotli) {
        const brotliPath = `${filePath}.br`;
        const brotliContent = zlib.brotliCompressSync(fileContent, {
          params: {
            [zlib.constants.BROTLI_PARAM_QUALITY]: 11
          }
        });
        fs.writeFileSync(brotliPath, brotliContent);
        brotliSize = brotliContent.length;
      }
      
      // Add to manifest
      manifest.assets[relativePath] = {
        original: fileContent.length,
        gzip: gzipContent.length,
        brotli: brotliSize,
        type: extension.slice(1) // Remove leading dot
      };
      
      console.log(`Compressed ${relativePath}: ${fileContent.length} → ${gzipContent.length} bytes (gzip)`);
    } catch (error) {
      console.error(`Error compressing ${filePath}:`, error);
    }
  }
}

/**
 * Check if an asset is compressible
 * @param {string} extension - File extension
 * @returns {boolean} True if asset is compressible
 */
function isCompressibleAsset(extension) {
  const compressibleExtensions = [
    '.html', '.css', '.js', '.json', '.xml', '.svg',
    '.txt', '.md', '.csv', '.map'
  ];
  
  return compressibleExtensions.includes(extension);
}

/**
 * Create a compression middleware
 * @param {Object} config - Optimizer configuration (optional)
 * @returns {Function} Express middleware function
 */
function createCompressionMiddleware(config = {}) {
  // Merge provided config with defaults
  const mergedConfig = { ...defaultConfig, ...config };
  
  /**
   * Express middleware function for serving compressed assets
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next function
   */
  return function compressionMiddleware(req, res, next) {
    // Skip if compression is disabled
    if (!mergedConfig.enableCompression) {
      return next();
    }
    
    // Skip non-GET and non-HEAD requests
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      return next();
    }
    
    // Check if request is for a compressible asset
    const url = req.url;
    const extension = path.extname(url).toLowerCase();
    
    if (!isCompressibleAsset(extension)) {
      return next();
    }
    
    // Check if client supports compression
    const acceptEncoding = req.headers['accept-encoding'] || '';
    
    // Try serving pre-compressed files if available
    const filePath = path.join(process.cwd(), 'public', url);
    
    // Check for Brotli support
    if (mergedConfig.useBrotli && acceptEncoding.includes('br')) {
      const brotliPath = `${filePath}.br`;
      
      if (fs.existsSync(brotliPath)) {
        res.setHeader('Content-Encoding', 'br');
        res.setHeader('Vary', 'Accept-Encoding');
        req.url = url + '.br';
        return next();
      }
    }
    
    // Check for Gzip support
    if (acceptEncoding.includes('gzip')) {
      const gzipPath = `${filePath}.gz`;
      
      if (fs.existsSync(gzipPath)) {
        res.setHeader('Content-Encoding', 'gzip');
        res.setHeader('Vary', 'Accept-Encoding');
        req.url = url + '.gz';
        return next();
      }
    }
    
    // Continue with standard processing
    next();
  };
}

// Export asset optimization functions
module.exports = {
  createAssetOptimizerMiddleware,
  precompressAssets,
  createCompressionMiddleware
};