/**
 * CMS Routes
 * 
 * API routes for Content Management System
 * Handles page content, media management, and site customization
 */

const express = require('express');
const multer = require('multer');
const { CMSService } = require('../services/cms-service');

const router = express.Router();
const cmsService = new CMSService();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});

// ================================
// CONTENT MANAGEMENT ROUTES
// ================================

// Get page content
router.get('/content/:pageType', async (req, res) => {
  try {
    const { pageType } = req.params;
    const { schoolId = 'default' } = req.query;
    
    const content = await cmsService.getPageContent(pageType, schoolId);
    res.json({ success: true, content });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update page content
router.put('/content/:pageType', async (req, res) => {
  try {
    const { pageType } = req.params;
    const { schoolId = 'default' } = req.query;
    const updates = req.body;
    
    const result = await cmsService.updatePageContent(pageType, schoolId, updates);
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Preview page changes
router.post('/content/:pageType/preview', async (req, res) => {
  try {
    const { pageType } = req.params;
    const { schoolId = 'default' } = req.query;
    const changes = req.body;
    
    const preview = await cmsService.previewPageChanges(pageType, schoolId, changes);
    res.json({ success: true, preview });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Publish changes
router.post('/publish', async (req, res) => {
  try {
    const { schoolId, changeSet } = req.body;
    
    const result = await cmsService.publishChanges(schoolId, changeSet);
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// ================================
// MEDIA MANAGEMENT ROUTES
// ================================

// Get media library
router.get('/media', async (req, res) => {
  try {
    const { schoolId = 'default', category } = req.query;
    
    const mediaLibrary = await cmsService.getMediaLibrary(schoolId, category);
    res.json({ success: true, ...mediaLibrary });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Upload media file
router.post('/media/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file provided' });
    }
    
    const { schoolId = 'default', category = 'general' } = req.body;
    
    const mediaRecord = await cmsService.uploadMedia(req.file, schoolId, category);
    res.json({ success: true, media: mediaRecord });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Upload multiple media files
router.post('/media/upload-multiple', upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, error: 'No files provided' });
    }
    
    const { schoolId = 'default', category = 'general' } = req.body;
    const uploadResults = [];
    
    for (const file of req.files) {
      try {
        const mediaRecord = await cmsService.uploadMedia(file, schoolId, category);
        uploadResults.push({ success: true, media: mediaRecord });
      } catch (error) {
        uploadResults.push({ success: false, error: error.message, fileName: file.originalname });
      }
    }
    
    res.json({ success: true, results: uploadResults });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Delete media file
router.delete('/media/:mediaId', async (req, res) => {
  try {
    const { mediaId } = req.params;
    const { schoolId } = req.query;
    
    const result = await cmsService.deleteMedia(mediaId, schoolId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// ================================
// BRANDING AND THEME ROUTES
// ================================

// Get school branding
router.get('/branding/:schoolId', async (req, res) => {
  try {
    const { schoolId } = req.params;
    
    const branding = await cmsService.getSchoolBranding(schoolId);
    res.json({ success: true, branding });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update school branding
router.put('/branding/:schoolId', async (req, res) => {
  try {
    const { schoolId } = req.params;
    const branding = req.body;
    
    const result = await cmsService.updateSchoolBranding(schoolId, branding);
    res.json({ success: true, branding: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Upload logo
router.post('/branding/:schoolId/logo', upload.single('logo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No logo file provided' });
    }
    
    const { schoolId } = req.params;
    
    // Upload logo as media
    const logoRecord = await cmsService.uploadMedia(req.file, schoolId, 'logos');
    
    // Update branding with new logo
    await cmsService.updateSchoolBranding(schoolId, { logo: logoRecord.url });
    
    res.json({ success: true, logo: logoRecord });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// ================================
// TEMPLATE MANAGEMENT ROUTES
// ================================

// Create custom template
router.post('/templates', async (req, res) => {
  try {
    const template = await cmsService.createCustomTemplate(req.body);
    res.json({ success: true, template });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Generate landing page
router.get('/generate/:schoolId', async (req, res) => {
  try {
    const { schoolId } = req.params;
    const { templateId = 'default' } = req.query;
    
    const landingPage = await cmsService.generateLandingPage(schoolId, templateId);
    res.json({ success: true, landingPage });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Generate and serve landing page HTML
router.get('/render/:schoolId', async (req, res) => {
  try {
    const { schoolId } = req.params;
    const { templateId = 'default' } = req.query;
    
    const landingPage = await cmsService.generateLandingPage(schoolId, templateId);
    res.setHeader('Content-Type', 'text/html');
    res.send(landingPage.html);
  } catch (error) {
    res.status(500).send(`<h1>Error generating page</h1><p>${error.message}</p>`);
  }
});

// ================================
// CMS DASHBOARD ROUTES
// ================================

// Get CMS dashboard data
router.get('/dashboard/:schoolId', async (req, res) => {
  try {
    const { schoolId } = req.params;
    
    const [
      landingPageContent,
      schoolInfoContent,
      mediaLibrary,
      branding
    ] = await Promise.all([
      cmsService.getPageContent('landing-page', schoolId),
      cmsService.getPageContent('school-info', schoolId),
      cmsService.getMediaLibrary(schoolId),
      cmsService.getSchoolBranding(schoolId)
    ]);
    
    const dashboard = {
      content: {
        'landing-page': landingPageContent,
        'school-info': schoolInfoContent
      },
      media: {
        totalFiles: mediaLibrary.count,
        totalSize: mediaLibrary.totalSize,
        categories: mediaLibrary.categories,
        recentUploads: mediaLibrary.media.slice(0, 5)
      },
      branding,
      lastUpdated: new Date().toISOString()
    };
    
    res.json({ success: true, dashboard });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get content types and their schemas
router.get('/content-types', (req, res) => {
  try {
    const contentTypes = Object.keys(cmsService.contentTypes).map(type => ({
      type,
      fields: cmsService.contentTypes[type].fields,
      template: cmsService.contentTypes[type].template
    }));
    
    res.json({ success: true, contentTypes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Bulk content operations
router.post('/bulk-update', async (req, res) => {
  try {
    const { schoolId, operations } = req.body;
    const results = [];
    
    for (const operation of operations) {
      try {
        const result = await cmsService.updatePageContent(
          operation.pageType,
          schoolId,
          operation.content
        );
        results.push({ ...operation, success: true, result });
      } catch (error) {
        results.push({ ...operation, success: false, error: error.message });
      }
    }
    
    res.json({ success: true, results });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Export content as JSON
router.get('/export/:schoolId', async (req, res) => {
  try {
    const { schoolId } = req.params;
    const { format = 'json' } = req.query;
    
    const exportData = {
      schoolId,
      exportDate: new Date().toISOString(),
      content: {},
      branding: await cmsService.getSchoolBranding(schoolId),
      media: await cmsService.getMediaLibrary(schoolId)
    };
    
    // Export all content types
    for (const contentType of Object.keys(cmsService.contentTypes)) {
      exportData.content[contentType] = await cmsService.getPageContent(contentType, schoolId);
    }
    
    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="cms-export-${schoolId}.json"`);
      res.json(exportData);
    } else {
      res.status(400).json({ success: false, error: 'Invalid export format' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Import content from JSON
router.post('/import/:schoolId', async (req, res) => {
  try {
    const { schoolId } = req.params;
    const importData = req.body;
    
    const results = [];
    
    // Import content
    if (importData.content) {
      for (const [contentType, content] of Object.entries(importData.content)) {
        try {
          await cmsService.updatePageContent(contentType, schoolId, content);
          results.push({ type: 'content', contentType, success: true });
        } catch (error) {
          results.push({ type: 'content', contentType, success: false, error: error.message });
        }
      }
    }
    
    // Import branding
    if (importData.branding) {
      try {
        await cmsService.updateSchoolBranding(schoolId, importData.branding);
        results.push({ type: 'branding', success: true });
      } catch (error) {
        results.push({ type: 'branding', success: false, error: error.message });
      }
    }
    
    res.json({ success: true, results });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// ================================
// ANALYTICS AND INSIGHTS
// ================================

// Get content analytics
router.get('/analytics/:schoolId', async (req, res) => {
  try {
    const { schoolId } = req.params;
    
    // In production, this would gather real analytics
    const analytics = {
      pageViews: {
        'landing-page': Math.floor(Math.random() * 1000),
        'about': Math.floor(Math.random() * 500),
        'pricing': Math.floor(Math.random() * 750)
      },
      engagement: {
        averageTimeOnPage: '2:45',
        bounceRate: '32%',
        conversionRate: '8.5%'
      },
      contentPerformance: {
        topPerforming: ['landing-page', 'pricing'],
        needsImprovement: ['about']
      },
      lastUpdated: new Date().toISOString()
    };
    
    res.json({ success: true, analytics });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Error handling middleware
router.use((error, req, res, next) => {
  console.error('CMS Route Error:', error);
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ success: false, error: 'File too large' });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ success: false, error: 'Too many files' });
    }
  }
  
  res.status(500).json({ success: false, error: 'Internal server error' });
});

module.exports = router;