/**
 * Personalization Pipeline Setup
 * 
 * This module sets up the personalization pipeline components, including:
 * - Creating necessary database tables
 * - Extending storage with personalization methods
 * - Registering personalization routes
 * 
 * This is part of the assessment to curriculum personalization pipeline.
 */

import { Express } from 'express';
import personalizationRoutes from './routes/personalization-routes';
import { createPersonalizationTables, extendStorageWithPersonalization } from './personalization-storage-extension';

/**
 * Set up personalization pipeline components
 * @param app Express application
 */
export async function setupPersonalizationPipeline(app: Express): Promise<void> {
  try {
    // Create personalization database tables
    console.log('🔄 Setting up personalization pipeline...');
    await createPersonalizationTables();
    console.log('✅ Created personalization tables');
    
    // Extend storage with personalization methods
    extendStorageWithPersonalization();
    console.log('✅ Extended storage with personalization methods');
    
    // Register personalization routes
    app.use('/api/personalization', personalizationRoutes);
    console.log('✅ Registered personalization routes');
    
    console.log('✅ Personalization pipeline setup complete');
  } catch (error) {
    console.error('❌ Error setting up personalization pipeline:', error);
  }
}