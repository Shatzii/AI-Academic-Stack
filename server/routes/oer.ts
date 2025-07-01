import { Router } from 'express';
import { storage } from '../storage';
import { z } from 'zod';
import { insertOpenEducationalResourceSchema, insertOerIntegrationSchema } from '../../shared/schema';

export const router = Router();

// Get all OER resources
router.get('/resources', async (req, res) => {
  try {
    const filters = req.query;
    let resources;

    if (Object.keys(filters).length > 0) {
      const schoolType = filters.schoolType as string;
      const subject = filters.subject as string;
      const gradeLevel = filters.gradeLevel as string;
      const resourceType = filters.resourceType as string;
      const neurotypeFocus = filters.neurotypeFocus as string;

      resources = await storage.getFilteredOERResources({
        schoolType,
        subject,
        gradeLevel,
        resourceType,
        neurotypeFocus
      });
    } else {
      resources = await storage.getOERResources();
    }

    res.json(resources);
  } catch (error) {
    console.error('Error fetching OER resources:', error);
    res.status(500).json({ message: 'Failed to fetch educational resources' });
  }
});

// Get OER resource by ID
router.get('/resources/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const resource = await storage.getOERResource(id);

    if (!resource) {
      return res.status(404).json({ message: 'Educational resource not found' });
    }

    res.json(resource);
  } catch (error) {
    console.error('Error fetching OER resource:', error);
    res.status(500).json({ message: 'Failed to fetch educational resource' });
  }
});

// Create new OER resource
router.post('/resources', async (req, res) => {
  try {
    const parseResult = insertOpenEducationalResourceSchema.safeParse(req.body);
    
    if (!parseResult.success) {
      return res.status(400).json({ 
        message: 'Invalid resource data', 
        errors: parseResult.error.format() 
      });
    }
    
    const newResource = await storage.createOERResource(parseResult.data);
    res.status(201).json(newResource);
  } catch (error) {
    console.error('Error creating OER resource:', error);
    res.status(500).json({ message: 'Failed to create educational resource' });
  }
});

// Update OER resource
router.put('/resources/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const resource = await storage.getOERResource(id);

    if (!resource) {
      return res.status(404).json({ message: 'Educational resource not found' });
    }
    
    const updatedResource = await storage.updateOERResource(id, req.body);
    res.json(updatedResource);
  } catch (error) {
    console.error('Error updating OER resource:', error);
    res.status(500).json({ message: 'Failed to update educational resource' });
  }
});

// Delete OER resource (set inactive)
router.delete('/resources/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const success = await storage.deleteOERResource(id);

    if (!success) {
      return res.status(404).json({ message: 'Educational resource not found' });
    }

    res.status(200).json({ message: 'Educational resource deactivated successfully' });
  } catch (error) {
    console.error('Error deactivating OER resource:', error);
    res.status(500).json({ message: 'Failed to deactivate educational resource' });
  }
});

// Get OER integrations
router.get('/integrations', async (req, res) => {
  try {
    const filters = req.query;
    let integrations;

    if (Object.keys(filters).length > 0) {
      const schoolType = filters.schoolType as string;
      const moduleType = filters.moduleType as string;
      const moduleId = filters.moduleId ? parseInt(filters.moduleId as string) : undefined;

      integrations = await storage.getFilteredOERIntegrations({
        schoolType,
        moduleType,
        moduleId
      });
    } else {
      integrations = await storage.getOERIntegrations();
    }

    res.json(integrations);
  } catch (error) {
    console.error('Error fetching OER integrations:', error);
    res.status(500).json({ message: 'Failed to fetch educational resource integrations' });
  }
});

// Get OER integration by ID
router.get('/integrations/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const integration = await storage.getOERIntegration(id);

    if (!integration) {
      return res.status(404).json({ message: 'Educational resource integration not found' });
    }

    res.json(integration);
  } catch (error) {
    console.error('Error fetching OER integration:', error);
    res.status(500).json({ message: 'Failed to fetch educational resource integration' });
  }
});

// Create new OER integration
router.post('/integrations', async (req, res) => {
  try {
    const parseResult = insertOerIntegrationSchema.safeParse(req.body);
    
    if (!parseResult.success) {
      return res.status(400).json({ 
        message: 'Invalid integration data', 
        errors: parseResult.error.format() 
      });
    }
    
    const newIntegration = await storage.createOERIntegration(parseResult.data);
    res.status(201).json(newIntegration);
  } catch (error) {
    console.error('Error creating OER integration:', error);
    res.status(500).json({ message: 'Failed to create educational resource integration' });
  }
});

// Update OER integration
router.put('/integrations/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const integration = await storage.getOERIntegration(id);

    if (!integration) {
      return res.status(404).json({ message: 'Educational resource integration not found' });
    }
    
    const updatedIntegration = await storage.updateOERIntegration(id, req.body);
    res.json(updatedIntegration);
  } catch (error) {
    console.error('Error updating OER integration:', error);
    res.status(500).json({ message: 'Failed to update educational resource integration' });
  }
});

// Delete OER integration (set inactive)
router.delete('/integrations/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const success = await storage.deleteOERIntegration(id);

    if (!success) {
      return res.status(404).json({ message: 'Educational resource integration not found' });
    }

    res.status(200).json({ message: 'Educational resource integration deactivated successfully' });
  } catch (error) {
    console.error('Error deactivating OER integration:', error);
    res.status(500).json({ message: 'Failed to deactivate educational resource integration' });
  }
});

export default router;