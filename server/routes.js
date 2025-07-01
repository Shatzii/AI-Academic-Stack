/**
 * ShatziiOS Platform API Routes
 * 
 * This file defines the API routes for the ShatziiOS platform.
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const { createSchoolZip, createFullPlatformZip } = require('../package_files/create-school-zip');
const adaptiveService = require('./adaptation-service');

// Create downloadable packages directory if it doesn't exist
const downloadsDir = path.join(__dirname, '../package_files/downloads');
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true });
}

function registerRoutes(app) {
  // API Routes
  const apiRouter = express.Router();
  
  // School package download API
  apiRouter.get('/download-school/:id', (req, res) => {
    const schoolId = req.params.id;
    const validSchools = ['primary-school', 'secondary-school', 'law-school', 'language-school'];
    
    if (!validSchools.includes(schoolId)) {
      return res.status(400).json({ error: 'Invalid school ID' });
    }
    
    // Check if ZIP already exists
    const zipPath = path.join(downloadsDir, `${schoolId}-package.zip`);
    if (!fs.existsSync(zipPath)) {
      // Create the ZIP file
      try {
        const school = {
          id: schoolId,
          name: getSchoolName(schoolId)
        };
        createSchoolZip(school);
      } catch (err) {
        console.error(`Error creating ZIP for school ${schoolId}:`, err);
        return res.status(500).json({ error: 'Failed to create school package' });
      }
    }
    
    // Send the file
    res.download(zipPath, `${getSchoolName(schoolId)}.zip`, (err) => {
      if (err) {
        console.error('Download error:', err);
        res.status(500).end();
      }
    });
  });
  
  // Download specific component for a school
  apiRouter.get('/download-component/:schoolId/:component', (req, res) => {
    const { schoolId, component } = req.params;
    const validSchools = ['primary-school', 'secondary-school', 'law-school', 'language-school'];
    const validComponents = ['reading-materials', 'math-worksheets', 'visual-aids', 'entire-package'];
    
    if (!validSchools.includes(schoolId) || !validComponents.includes(component)) {
      return res.status(400).json({ error: 'Invalid school ID or component' });
    }
    
    // Check if ZIP already exists
    const zipPath = path.join(downloadsDir, `${schoolId}-${component}.zip`);
    if (!fs.existsSync(zipPath)) {
      // Create the ZIP file
      try {
        const school = {
          id: schoolId,
          name: getSchoolName(schoolId)
        };
        createSchoolZip(school); // This will create all component ZIPs as well
      } catch (err) {
        console.error(`Error creating ZIP for component ${component}:`, err);
        return res.status(500).json({ error: 'Failed to create component package' });
      }
    }
    
    // Send the file
    res.download(zipPath, `${getSchoolName(schoolId)} - ${formatComponentName(component)}.zip`, (err) => {
      if (err) {
        console.error('Download error:', err);
        res.status(500).end();
      }
    });
  });
  
  // Download full platform package
  apiRouter.get('/download-platform', (req, res) => {
    const zipPath = path.join(downloadsDir, 'shatzios-full-platform.zip');
    
    if (!fs.existsSync(zipPath)) {
      try {
        createFullPlatformZip();
      } catch (err) {
        console.error('Error creating full platform ZIP:', err);
        return res.status(500).json({ error: 'Failed to create platform package' });
      }
    }
    
    res.download(zipPath, 'ShatziiOS Educational Platform.zip', (err) => {
      if (err) {
        console.error('Download error:', err);
        res.status(500).end();
      }
    });
  });
  
  // Adaptive Learning API
  apiRouter.post('/adaptive/update-settings', (req, res) => {
    const { userId, settings } = req.body;
    
    if (!userId || !settings) {
      return res.status(400).json({ error: 'User ID and settings are required' });
    }
    
    const success = adaptiveService.updateUserSettings(userId, settings);
    
    if (success) {
      res.json({ success: true, message: 'Settings updated successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Failed to update settings' });
    }
  });
  
  apiRouter.get('/adaptive/get-settings/:userId', (req, res) => {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    const settings = adaptiveService.getUserSettings(userId);
    res.json({
      success: true,
      settings
    });
  });
  
  apiRouter.post('/adaptive/apply-profile', (req, res) => {
    const { userId, profileName } = req.body;
    
    if (!userId || !profileName) {
      return res.status(400).json({ error: 'User ID and profile name are required' });
    }
    
    const success = adaptiveService.applyProfile(userId, profileName);
    
    if (success) {
      res.json({ 
        success: true, 
        message: 'Profile applied successfully',
        settings: adaptiveService.getUserSettings(userId)
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid profile name' });
    }
  });
  
  apiRouter.post('/adaptive/reset/:userId', (req, res) => {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    const settings = adaptiveService.resetToRecommended(userId);
    res.json({
      success: true, 
      message: 'Settings reset to recommended values',
      settings
    });
  });
  
  apiRouter.post('/adaptive/record-performance', (req, res) => {
    const { userId, contentType, performance } = req.body;
    
    if (!userId || !contentType || !performance) {
      return res.status(400).json({ error: 'User ID, content type, and performance data are required' });
    }
    
    adaptiveService.recordPerformance(userId, contentType, performance);
    res.json({ success: true, message: 'Performance recorded successfully' });
  });
  
  apiRouter.get('/adaptive/content/:userId/:contentType', (req, res) => {
    const { userId, contentType } = req.params;
    const { contentId } = req.query;
    
    if (!userId || !contentType || !contentId) {
      return res.status(400).json({ error: 'User ID, content type, and content ID are required' });
    }
    
    // Simulate getting original content (would come from a database)
    const originalContent = {
      id: contentId,
      title: `Sample ${contentType} content`,
      description: `This is a sample ${contentType} content for testing adaptation`,
      // Content would be different based on type in a real implementation
    };
    
    // Adapt content based on user settings
    const adaptedContent = adaptiveService.adaptContent(userId, contentType, originalContent);
    
    res.json({
      success: true,
      content: adaptedContent
    });
  });
  
  // School management API endpoints would be added here
  
  // Mount the API router
  app.use('/api', apiRouter);
}

// Helper functions
function getSchoolName(schoolId) {
  const schoolNames = {
    'primary-school': 'K-6 Primary School',
    'secondary-school': '7-12 Secondary School',
    'law-school': 'The Lawyer Makers',
    'language-school': 'Language Learning School'
  };
  
  return schoolNames[schoolId] || 'Unknown School';
}

function formatComponentName(component) {
  const componentNames = {
    'reading-materials': 'Reading Materials',
    'math-worksheets': 'Math Worksheets',
    'visual-aids': 'Visual Learning Aids',
    'entire-package': 'Complete Package'
  };
  
  return componentNames[component] || component;
}

module.exports = registerRoutes;