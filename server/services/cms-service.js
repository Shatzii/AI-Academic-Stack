/**
 * Content Management System Service
 * 
 * Complete CMS for managing landing pages, content, and media
 * Allows schools to customize their platform appearance and messaging
 */

const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');

class CMSService {
  constructor() {
    this.contentTypes = {
      'landing-page': {
        fields: ['title', 'subtitle', 'heroImage', 'description', 'features', 'testimonials', 'callToAction'],
        template: 'landing-page'
      },
      'school-info': {
        fields: ['schoolName', 'districtName', 'address', 'phone', 'email', 'logo', 'colors', 'mission'],
        template: 'school-info'
      },
      'pricing': {
        fields: ['plans', 'features', 'discounts', 'promotions'],
        template: 'pricing'
      },
      'about': {
        fields: ['story', 'team', 'values', 'timeline', 'achievements'],
        template: 'about'
      },
      'features': {
        fields: ['aiTeachers', 'capabilities', 'benefits', 'screenshots', 'videos'],
        template: 'features'
      }
    };
    
    this.mediaStorage = this.initializeMediaStorage();
    this.contentCache = new Map();
  }

  /**
   * Get all content for a specific page type
   */
  async getPageContent(pageType, schoolId = 'default') {
    try {
      const cacheKey = `${pageType}_${schoolId}`;
      
      // Check cache first
      if (this.contentCache.has(cacheKey)) {
        return this.contentCache.get(cacheKey);
      }

      // Load from storage
      const content = await this.loadContentFromStorage(pageType, schoolId);
      
      // Cache the content
      this.contentCache.set(cacheKey, content);
      
      return content;
    } catch (error) {
      console.error(`Error getting page content for ${pageType}:`, error);
      return this.getDefaultContent(pageType);
    }
  }

  /**
   * Update page content
   */
  async updatePageContent(pageType, schoolId, updates) {
    try {
      // Validate content type
      if (!this.contentTypes[pageType]) {
        throw new Error(`Invalid content type: ${pageType}`);
      }

      // Get current content
      const currentContent = await this.getPageContent(pageType, schoolId);
      
      // Merge updates with current content
      const updatedContent = {
        ...currentContent,
        ...updates,
        lastModified: new Date().toISOString(),
        modifiedBy: updates.modifiedBy || 'system'
      };

      // Validate required fields
      this.validateContent(pageType, updatedContent);

      // Save to storage
      await this.saveContentToStorage(pageType, schoolId, updatedContent);
      
      // Update cache
      const cacheKey = `${pageType}_${schoolId}`;
      this.contentCache.set(cacheKey, updatedContent);
      
      // Generate static files if needed
      await this.generateStaticFiles(pageType, schoolId, updatedContent);

      return {
        success: true,
        content: updatedContent,
        message: `${pageType} content updated successfully`
      };
    } catch (error) {
      console.error(`Error updating page content:`, error);
      throw error;
    }
  }

  /**
   * Upload and manage media files
   */
  async uploadMedia(file, schoolId = 'default', category = 'general') {
    try {
      // Validate file type and size
      this.validateMediaFile(file);

      // Generate unique filename
      const fileName = this.generateUniqueFileName(file.originalname);
      const relativePath = `${schoolId}/${category}/${fileName}`;
      const fullPath = path.join(this.mediaStorage.basePath, relativePath);

      // Ensure directory exists
      await this.ensureDirectoryExists(path.dirname(fullPath));

      // Save file
      await fs.writeFile(fullPath, file.buffer);

      // Create media record
      const mediaRecord = {
        id: this.generateMediaId(),
        fileName,
        originalName: file.originalname,
        path: relativePath,
        url: `/media/${relativePath}`,
        size: file.size,
        mimeType: file.mimetype,
        category,
        schoolId,
        uploadedAt: new Date().toISOString(),
        uploadedBy: 'admin' // Would come from auth context
      };

      // Save media metadata
      await this.saveMediaRecord(mediaRecord);

      return mediaRecord;
    } catch (error) {
      console.error('Error uploading media:', error);
      throw error;
    }
  }

  /**
   * Get media library for a school
   */
  async getMediaLibrary(schoolId = 'default', category = null) {
    try {
      const mediaRecords = await this.loadMediaRecords(schoolId, category);
      
      return {
        media: mediaRecords,
        categories: await this.getMediaCategories(schoolId),
        totalSize: mediaRecords.reduce((sum, media) => sum + media.size, 0),
        count: mediaRecords.length
      };
    } catch (error) {
      console.error('Error getting media library:', error);
      return { media: [], categories: [], totalSize: 0, count: 0 };
    }
  }

  /**
   * Delete media file
   */
  async deleteMedia(mediaId, schoolId) {
    try {
      const mediaRecord = await this.getMediaRecord(mediaId);
      if (!mediaRecord || mediaRecord.schoolId !== schoolId) {
        throw new Error('Media not found or access denied');
      }

      // Delete physical file
      const fullPath = path.join(this.mediaStorage.basePath, mediaRecord.path);
      await fs.unlink(fullPath);

      // Remove media record
      await this.removeMediaRecord(mediaId);

      return { success: true, message: 'Media deleted successfully' };
    } catch (error) {
      console.error('Error deleting media:', error);
      throw error;
    }
  }

  /**
   * Create custom landing page template
   */
  async createCustomTemplate(templateData) {
    const {
      name,
      description,
      schoolId,
      sections,
      styling,
      layout
    } = templateData;

    const template = {
      id: this.generateTemplateId(),
      name,
      description,
      schoolId,
      sections: sections || this.getDefaultSections(),
      styling: styling || this.getDefaultStyling(),
      layout: layout || this.getDefaultLayout(),
      isCustom: true,
      createdAt: new Date().toISOString(),
      version: '1.0'
    };

    await this.saveTemplate(template);
    return template;
  }

  /**
   * Generate landing page HTML from template and content
   */
  async generateLandingPage(schoolId, templateId = 'default') {
    try {
      // Load template
      const template = await this.getTemplate(templateId);
      
      // Load content for all sections
      const content = {};
      for (const section of template.sections) {
        content[section.type] = await this.getPageContent(section.type, schoolId);
      }

      // Generate HTML
      const html = await this.renderTemplate(template, content, schoolId);
      
      return {
        html,
        template,
        content,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error generating landing page:', error);
      throw error;
    }
  }

  /**
   * Update school branding and theme
   */
  async updateSchoolBranding(schoolId, branding) {
    const {
      logo,
      colors,
      fonts,
      customCSS,
      favicon
    } = branding;

    const brandingConfig = {
      schoolId,
      logo: logo || null,
      colors: {
        primary: colors?.primary || '#2563eb',
        secondary: colors?.secondary || '#64748b',
        accent: colors?.accent || '#0ea5e9',
        background: colors?.background || '#ffffff',
        text: colors?.text || '#1f2937'
      },
      fonts: {
        heading: fonts?.heading || 'Inter',
        body: fonts?.body || 'Inter',
        size: fonts?.size || 'medium'
      },
      customCSS: customCSS || '',
      favicon: favicon || null,
      updatedAt: new Date().toISOString()
    };

    await this.saveBrandingConfig(brandingConfig);
    
    // Generate CSS file
    await this.generateBrandingCSS(schoolId, brandingConfig);
    
    return brandingConfig;
  }

  /**
   * Get school branding configuration
   */
  async getSchoolBranding(schoolId) {
    try {
      return await this.loadBrandingConfig(schoolId);
    } catch (error) {
      return this.getDefaultBranding();
    }
  }

  /**
   * Create preview of page with changes
   */
  async previewPageChanges(pageType, schoolId, changes) {
    // Get current content
    const currentContent = await this.getPageContent(pageType, schoolId);
    
    // Apply temporary changes
    const previewContent = { ...currentContent, ...changes };
    
    // Generate preview HTML
    const previewHtml = await this.renderPagePreview(pageType, schoolId, previewContent);
    
    return {
      html: previewHtml,
      changes,
      previewId: this.generatePreviewId(),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes
    };
  }

  /**
   * Publish changes to live site
   */
  async publishChanges(schoolId, changeSet) {
    try {
      const publishResults = [];

      for (const change of changeSet) {
        const result = await this.updatePageContent(change.pageType, schoolId, change.content);
        publishResults.push({
          pageType: change.pageType,
          success: result.success,
          message: result.message
        });
      }

      // Clear caches
      this.clearSchoolCache(schoolId);
      
      // Generate sitemap
      await this.generateSitemap(schoolId);

      return {
        success: true,
        results: publishResults,
        publishedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error publishing changes:', error);
      throw error;
    }
  }

  // Helper Methods

  initializeMediaStorage() {
    const basePath = path.join(process.cwd(), 'public', 'media');
    return {
      basePath,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'application/pdf']
    };
  }

  validateMediaFile(file) {
    if (file.size > this.mediaStorage.maxFileSize) {
      throw new Error(`File size exceeds limit of ${this.mediaStorage.maxFileSize / 1024 / 1024}MB`);
    }

    if (!this.mediaStorage.allowedTypes.includes(file.mimetype)) {
      throw new Error(`File type ${file.mimetype} not allowed`);
    }
  }

  generateUniqueFileName(originalName) {
    const ext = path.extname(originalName);
    const name = path.basename(originalName, ext);
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `${name}_${timestamp}_${random}${ext}`;
  }

  generateMediaId() {
    return `media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  generateTemplateId() {
    return `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  generatePreviewId() {
    return `preview_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async ensureDirectoryExists(dirPath) {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }
  }

  validateContent(pageType, content) {
    const contentType = this.contentTypes[pageType];
    if (!contentType) return;

    const requiredFields = contentType.fields.filter(field => 
      contentType.required && contentType.required.includes(field)
    );

    for (const field of requiredFields) {
      if (!content[field]) {
        throw new Error(`Required field '${field}' is missing for ${pageType}`);
      }
    }
  }

  getDefaultContent(pageType) {
    const defaults = {
      'landing-page': {
        title: 'AI-Powered Education Platform',
        subtitle: 'Transform learning with personalized AI teachers',
        description: 'Comprehensive educational platform with AI teachers for every subject',
        features: [
          'Personalized Learning Paths',
          'Real-time Progress Tracking', 
          'Neurodivergent Support',
          'Parent Dashboards'
        ],
        callToAction: {
          text: 'Start Free Trial',
          url: '/register'
        }
      },
      'school-info': {
        schoolName: 'Sample School',
        districtName: 'Sample District',
        mission: 'Empowering students through AI-enhanced education'
      },
      'pricing': {
        plans: [
          { name: 'Basic', price: 299, features: ['AI Teachers', 'Progress Tracking'] },
          { name: 'Pro', price: 599, features: ['Everything in Basic', 'Advanced Analytics'] },
          { name: 'Enterprise', price: 1299, features: ['Everything in Pro', 'Custom Integration'] }
        ]
      }
    };

    return defaults[pageType] || {};
  }

  getDefaultBranding() {
    return {
      colors: {
        primary: '#2563eb',
        secondary: '#64748b',
        accent: '#0ea5e9',
        background: '#ffffff',
        text: '#1f2937'
      },
      fonts: {
        heading: 'Inter',
        body: 'Inter',
        size: 'medium'
      },
      customCSS: '',
      logo: null,
      favicon: null
    };
  }

  getDefaultSections() {
    return [
      { type: 'hero', order: 1, enabled: true },
      { type: 'features', order: 2, enabled: true },
      { type: 'pricing', order: 3, enabled: true },
      { type: 'testimonials', order: 4, enabled: true },
      { type: 'contact', order: 5, enabled: true }
    ];
  }

  getDefaultStyling() {
    return {
      layout: 'modern',
      colorScheme: 'blue',
      typography: 'clean',
      spacing: 'comfortable'
    };
  }

  getDefaultLayout() {
    return {
      header: { sticky: true, transparent: false },
      footer: { minimal: false },
      sidebar: { enabled: false },
      maxWidth: '1200px'
    };
  }

  async loadContentFromStorage(pageType, schoolId) {
    // In production, this would load from database
    return this.getDefaultContent(pageType);
  }

  async saveContentToStorage(pageType, schoolId, content) {
    // In production, this would save to database
    console.log(`Saving ${pageType} content for school ${schoolId}`);
    return true;
  }

  async loadMediaRecords(schoolId, category) {
    // In production, this would load from database
    return [];
  }

  async saveMediaRecord(mediaRecord) {
    // In production, this would save to database
    console.log('Saving media record:', mediaRecord.id);
    return true;
  }

  async getMediaRecord(mediaId) {
    // In production, this would load from database
    return null;
  }

  async removeMediaRecord(mediaId) {
    // In production, this would remove from database
    console.log('Removing media record:', mediaId);
    return true;
  }

  async getMediaCategories(schoolId) {
    return ['general', 'logos', 'banners', 'testimonials', 'team'];
  }

  async saveTemplate(template) {
    // In production, this would save to database
    console.log('Saving template:', template.id);
    return true;
  }

  async getTemplate(templateId) {
    // Return default template
    return {
      id: templateId,
      name: 'Default',
      sections: this.getDefaultSections(),
      styling: this.getDefaultStyling(),
      layout: this.getDefaultLayout()
    };
  }

  async saveBrandingConfig(config) {
    // In production, this would save to database
    console.log('Saving branding config for school:', config.schoolId);
    return true;
  }

  async loadBrandingConfig(schoolId) {
    // In production, this would load from database
    return this.getDefaultBranding();
  }

  async renderTemplate(template, content, schoolId) {
    // Simple HTML generation - in production would use proper templating engine
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${content['landing-page']?.title || 'AI Education Platform'}</title>
      <link rel="stylesheet" href="/branding/${schoolId}/custom.css">
    </head>
    <body>
      <header>
        <h1>${content['school-info']?.schoolName || 'School Name'}</h1>
      </header>
      <main>
        <section class="hero">
          <h2>${content['landing-page']?.title}</h2>
          <p>${content['landing-page']?.subtitle}</p>
        </section>
      </main>
    </body>
    </html>
    `;
  }

  async renderPagePreview(pageType, schoolId, content) {
    return this.renderTemplate({ sections: [{ type: pageType }] }, { [pageType]: content }, schoolId);
  }

  async generateStaticFiles(pageType, schoolId, content) {
    // Generate static HTML files for performance
    console.log(`Generating static files for ${pageType} - ${schoolId}`);
    return true;
  }

  async generateBrandingCSS(schoolId, branding) {
    const css = `
    :root {
      --primary-color: ${branding.colors.primary};
      --secondary-color: ${branding.colors.secondary};
      --accent-color: ${branding.colors.accent};
      --background-color: ${branding.colors.background};
      --text-color: ${branding.colors.text};
      --heading-font: ${branding.fonts.heading};
      --body-font: ${branding.fonts.body};
    }
    
    ${branding.customCSS}
    `;

    const cssPath = path.join(process.cwd(), 'public', 'branding', schoolId, 'custom.css');
    await this.ensureDirectoryExists(path.dirname(cssPath));
    await fs.writeFile(cssPath, css);
    
    return true;
  }

  async generateSitemap(schoolId) {
    // Generate XML sitemap
    console.log(`Generating sitemap for school ${schoolId}`);
    return true;
  }

  clearSchoolCache(schoolId) {
    for (const [key] of this.contentCache) {
      if (key.includes(schoolId)) {
        this.contentCache.delete(key);
      }
    }
  }
}

module.exports = { CMSService };