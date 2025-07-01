/**
 * ShatziiOS Dynamic Module Loader
 * 
 * This utility provides dynamic loading of modules to improve startup time
 * by loading services and routes only when they're needed.
 */

// Cache for loaded modules to prevent repeated imports
const moduleCache = new Map<string, any>();

/**
 * Dynamically load a module and cache the result
 * @param modulePath - Path to the module relative to the server directory
 * @returns The loaded module
 */
export async function loadModule(modulePath: string) {
  if (!moduleCache.has(modulePath)) {
    console.log(`🔄 Dynamic loading: ${modulePath}`);
    try {
      // Convert relative paths to absolute
      const fullPath = modulePath.startsWith('./') || modulePath.startsWith('../') 
        ? require.resolve(modulePath, { paths: [__dirname] })
        : modulePath;
        
      const module = await import(fullPath);
      moduleCache.set(modulePath, module);
      console.log(`✅ Successfully loaded: ${modulePath}`);
    } catch (error) {
      console.error(`❌ Failed to load module ${modulePath}:`, error);
      throw error;
    }
  }
  return moduleCache.get(modulePath);
}

/**
 * Preload a list of critical modules for faster access
 * @param modulePaths - Array of module paths to preload
 */
export async function preloadModules(modulePaths: string[]) {
  console.log(`🔄 Preloading ${modulePaths.length} modules...`);
  
  const promises = modulePaths.map(path => 
    loadModule(path).catch(err => {
      console.warn(`⚠️ Non-fatal error preloading ${path}:`, err.message);
      return null;
    })
  );
  
  await Promise.allSettled(promises);
  console.log(`✅ Preloading complete. ${moduleCache.size} modules in cache.`);
}

/**
 * Clear the module cache (useful for testing or forced reloads)
 */
export function clearModuleCache() {
  moduleCache.clear();
  console.log('🧹 Module cache cleared');
}