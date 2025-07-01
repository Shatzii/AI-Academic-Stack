/**
 * CMS API Routes
 * 
 * These routes handle all CMS-related requests, allowing for a modular,
 * content-driven approach to the platform.
 */
import { Router } from 'express';
import { z } from 'zod';
import { storage } from '../storage';

const router = Router();

/**
 * Parse query parameters for CMS requests
 */
function parseCMSQueryParams(query: any) {
  const params: any = {};
  
  // Parse filters
  if (query.filters) {
    try {
      params.filters = JSON.parse(query.filters);
    } catch (error) {
      // If parsing fails, use the raw value
      params.filters = query.filters;
    }
  }
  
  // Parse pagination
  if (query.pagination) {
    try {
      params.pagination = JSON.parse(query.pagination);
    } catch (error) {
      // If parsing fails, use default pagination
      params.pagination = { page: 1, pageSize: 25 };
    }
  } else {
    // Default pagination
    params.pagination = { page: 1, pageSize: 25 };
  }
  
  // Parse sort
  if (query.sort) {
    params.sort = query.sort.split(',');
  }
  
  // Parse populate
  if (query.populate) {
    params.populate = query.populate.split(',');
  }
  
  return params;
}

/**
 * Format the CMS response
 */
function formatCMSResponse(data: any, meta = {}) {
  return {
    data,
    meta
  };
}

// Generic handler for CMS content types
function createCMSHandlers(contentType: string) {
  // Get all items
  router.get(`/${contentType}`, async (req, res) => {
    try {
      const params = parseCMSQueryParams(req.query);
      const method = `get${contentType.charAt(0).toUpperCase() + contentType.slice(1)}` as keyof typeof storage;
      
      if (typeof storage[method] !== 'function') {
        return res.status(404).json({ 
          error: `Content type '${contentType}' not supported` 
        });
      }
      
      const data = await (storage[method] as Function)(params);
      const meta = {
        contentType,
        params
      };
      
      return res.json(formatCMSResponse(data, meta));
    } catch (error) {
      console.error(`Error fetching ${contentType}:`, error);
      return res.status(500).json({ 
        error: `Failed to fetch ${contentType}`,
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  
  // Get a single item
  router.get(`/${contentType}/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      const params = parseCMSQueryParams(req.query);
      const method = `get${contentType.charAt(0).toUpperCase() + contentType.slice(1)}ById` as keyof typeof storage;
      
      if (typeof storage[method] !== 'function') {
        return res.status(404).json({ 
          error: `Content type '${contentType}' not supported` 
        });
      }
      
      const data = await (storage[method] as Function)(id, params);
      
      if (!data) {
        return res.status(404).json({ 
          error: `${contentType} with id '${id}' not found` 
        });
      }
      
      return res.json(formatCMSResponse(data));
    } catch (error) {
      console.error(`Error fetching ${contentType}:`, error);
      return res.status(500).json({ 
        error: `Failed to fetch ${contentType}`,
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  
  // Create a new item
  router.post(`/${contentType}`, async (req, res) => {
    try {
      const { data } = req.body;
      
      if (!data) {
        return res.status(400).json({ error: 'Missing data in request body' });
      }
      
      const method = `create${contentType.charAt(0).toUpperCase() + contentType.slice(1)}` as keyof typeof storage;
      
      if (typeof storage[method] !== 'function') {
        return res.status(404).json({ 
          error: `Content type '${contentType}' not supported` 
        });
      }
      
      const createdData = await (storage[method] as Function)(data);
      return res.status(201).json(formatCMSResponse(createdData));
    } catch (error) {
      console.error(`Error creating ${contentType}:`, error);
      return res.status(500).json({ 
        error: `Failed to create ${contentType}`,
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  
  // Update an item
  router.put(`/${contentType}/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      const { data } = req.body;
      
      if (!data) {
        return res.status(400).json({ error: 'Missing data in request body' });
      }
      
      const method = `update${contentType.charAt(0).toUpperCase() + contentType.slice(1)}` as keyof typeof storage;
      
      if (typeof storage[method] !== 'function') {
        return res.status(404).json({ 
          error: `Content type '${contentType}' not supported` 
        });
      }
      
      const updatedData = await (storage[method] as Function)(id, data);
      
      if (!updatedData) {
        return res.status(404).json({ 
          error: `${contentType} with id '${id}' not found` 
        });
      }
      
      return res.json(formatCMSResponse(updatedData));
    } catch (error) {
      console.error(`Error updating ${contentType}:`, error);
      return res.status(500).json({ 
        error: `Failed to update ${contentType}`,
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  
  // Delete an item
  router.delete(`/${contentType}/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      const method = `delete${contentType.charAt(0).toUpperCase() + contentType.slice(1)}` as keyof typeof storage;
      
      if (typeof storage[method] !== 'function') {
        return res.status(404).json({ 
          error: `Content type '${contentType}' not supported` 
        });
      }
      
      const deleted = await (storage[method] as Function)(id);
      
      if (!deleted) {
        return res.status(404).json({ 
          error: `${contentType} with id '${id}' not found` 
        });
      }
      
      return res.json(formatCMSResponse({ id, deleted: true }));
    } catch (error) {
      console.error(`Error deleting ${contentType}:`, error);
      return res.status(500).json({ 
        error: `Failed to delete ${contentType}`,
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
}

// Register CMS content type handlers
const contentTypes = [
  'pages',
  'schools',
  'languages',
  'lawSchool',
  'ndash',
  'aiTeachers'
];

contentTypes.forEach(contentType => {
  createCMSHandlers(contentType);
});

// Additional routes for specific content types

// Get school by slug
router.get('/schools/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const params = parseCMSQueryParams(req.query);
    
    if (!storage.getSchoolBySlug) {
      return res.status(404).json({ error: 'School by slug lookup not supported' });
    }
    
    const data = await storage.getSchoolBySlug(slug, params);
    
    if (!data) {
      return res.status(404).json({ error: `School with slug '${slug}' not found` });
    }
    
    return res.json(formatCMSResponse(data));
  } catch (error) {
    console.error('Error fetching school by slug:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch school',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// Get page by slug
router.get('/pages/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const params = parseCMSQueryParams(req.query);
    
    if (!storage.getPageBySlug) {
      return res.status(404).json({ error: 'Page by slug lookup not supported' });
    }
    
    const data = await storage.getPageBySlug(slug, params);
    
    if (!data) {
      return res.status(404).json({ error: `Page with slug '${slug}' not found` });
    }
    
    return res.json(formatCMSResponse(data));
  } catch (error) {
    console.error('Error fetching page by slug:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch page',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// Get language by code
router.get('/languages/code/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const params = parseCMSQueryParams(req.query);
    
    if (!storage.getLanguageByCode) {
      return res.status(404).json({ error: 'Language by code lookup not supported' });
    }
    
    const data = await storage.getLanguageByCode(code, params);
    
    if (!data) {
      return res.status(404).json({ error: `Language with code '${code}' not found` });
    }
    
    return res.json(formatCMSResponse(data));
  } catch (error) {
    console.error('Error fetching language by code:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch language',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

export default router;