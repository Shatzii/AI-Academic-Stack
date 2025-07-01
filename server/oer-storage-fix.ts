import { eq } from 'drizzle-orm';
import { db } from './db';
import * as schema from '../shared/schema';
import { MemStorage } from './storage';
import { OpenEducationalResource, InsertOpenEducationalResource, OerIntegration, InsertOerIntegration } from '../shared/schema';

// Define the missing OER methods to add to MemStorage prototype
const methodsToAdd: Record<string, Function> = {
  // OER Resource methods
  async getOERResources(): Promise<OpenEducationalResource[]> {
    // Initialize if needed
    this.initOERMaps();
    return Array.from(this.openEducationalResources.values());
  },

  async getOERResource(id: number): Promise<OpenEducationalResource | undefined> {
    // Initialize if needed
    this.initOERMaps();
    return this.openEducationalResources.get(id);
  },

  async getFilteredOERResources(filters: {
    schoolType?: string;
    subject?: string;
    gradeLevel?: string;
    resourceType?: string;
    neurotypeFocus?: string;
  }): Promise<OpenEducationalResource[]> {
    // Initialize if needed
    this.initOERMaps();
    
    const resources = Array.from(this.openEducationalResources.values());
    
    return resources.filter(resource => {
      let match = true;
      
      if (filters.schoolType && resource.schoolType !== filters.schoolType) match = false;
      if (filters.subject && resource.subject !== filters.subject) match = false;
      if (filters.gradeLevel && resource.gradeLevel !== filters.gradeLevel) match = false;
      if (filters.resourceType && resource.resourceType !== filters.resourceType) match = false;
      if (filters.neurotypeFocus && resource.neurotypeFocus !== filters.neurotypeFocus) match = false;
      
      return match;
    });
  },

  async getOERResourcesBySchool(schoolType: string): Promise<OpenEducationalResource[]> {
    // Initialize if needed
    this.initOERMaps();
    
    return Array.from(this.openEducationalResources.values())
      .filter(resource => resource.schoolType === schoolType);
  },

  async getOERResourcesBySubject(subject: string): Promise<OpenEducationalResource[]> {
    // Initialize if needed
    this.initOERMaps();
    
    return Array.from(this.openEducationalResources.values())
      .filter(resource => resource.subject === subject);
  },

  async getOERResourcesByGradeLevel(gradeLevel: string): Promise<OpenEducationalResource[]> {
    // Initialize if needed
    this.initOERMaps();
    
    return Array.from(this.openEducationalResources.values())
      .filter(resource => resource.gradeLevel === gradeLevel);
  },

  async getOERResourcesByType(resourceType: string): Promise<OpenEducationalResource[]> {
    // Initialize if needed
    this.initOERMaps();
    
    return Array.from(this.openEducationalResources.values())
      .filter(resource => resource.resourceType === resourceType);
  },

  async getOERResourcesByNeurotype(neurotypeFocus: string): Promise<OpenEducationalResource[]> {
    // Initialize if needed
    this.initOERMaps();
    
    return Array.from(this.openEducationalResources.values())
      .filter(resource => resource.neurotypeFocus === neurotypeFocus);
  },

  async createOERResource(resource: InsertOpenEducationalResource): Promise<OpenEducationalResource> {
    try {
      // Initialize if needed
      this.initOERMaps();
      
      // First try to insert into the database
      const newResources = await db.insert(schema.openEducationalResources)
        .values(resource)
        .returning();
      
      if (newResources && newResources.length > 0) {
        // Update in-memory storage
        const newResource = newResources[0];
        this.openEducationalResources.set(newResource.id, newResource);
        return newResource;
      }
      
      // Fallback to in-memory if database insert fails
      const newId = this.oerResourceCurrentId ? this.oerResourceCurrentId++ : 1;
      if (!this.oerResourceCurrentId) {
        this.oerResourceCurrentId = 2; // Initialize if it doesn't exist
      }
      
      const newOERResource = {
        ...resource,
        id: newId,
        createdAt: new Date(),
        updatedAt: new Date(),
        verified: resource.verified || false,
        active: true
      };
      
      this.openEducationalResources.set(newId, newOERResource);
      return newOERResource;
    } catch (error) {
      console.error('Error creating OER resource:', error);
      
      // Fallback to in-memory storage
      const newId = this.oerResourceCurrentId ? this.oerResourceCurrentId++ : 1;
      if (!this.oerResourceCurrentId) {
        this.oerResourceCurrentId = 2; // Initialize if it doesn't exist
      }
      
      const newOERResource = {
        ...resource,
        id: newId,
        createdAt: new Date(),
        updatedAt: new Date(),
        verified: resource.verified || false,
        active: true
      };
      
      this.openEducationalResources.set(newId, newOERResource);
      return newOERResource;
    }
  },

  async updateOERResource(id: number, resource: Partial<InsertOpenEducationalResource>): Promise<OpenEducationalResource | undefined> {
    // Initialize if needed
    this.initOERMaps();
    
    const existingResource = this.openEducationalResources.get(id);
    if (!existingResource) return undefined;
    
    const updatedResource = {
      ...existingResource,
      ...resource,
      updatedAt: new Date()
    };
    
    this.openEducationalResources.set(id, updatedResource);
    return updatedResource;
  },

  async deleteOERResource(id: number): Promise<boolean> {
    // Initialize if needed
    this.initOERMaps();
    
    const existingResource = this.openEducationalResources.get(id);
    if (!existingResource) return false;
    
    // Soft delete - set active to false
    const updatedResource = {
      ...existingResource,
      active: false,
      updatedAt: new Date()
    };
    
    this.openEducationalResources.set(id, updatedResource);
    return true;
  },

  async verifyOERResource(id: number): Promise<OpenEducationalResource | undefined> {
    // Initialize if needed
    this.initOERMaps();
    
    const existingResource = this.openEducationalResources.get(id);
    if (!existingResource) return undefined;
    
    const verifiedResource = {
      ...existingResource,
      verified: true,
      updatedAt: new Date()
    };
    
    this.openEducationalResources.set(id, verifiedResource);
    return verifiedResource;
  },

  // OER Integration methods
  async getOERIntegrations(): Promise<OerIntegration[]> {
    // Initialize if needed
    this.initOERMaps();
    
    return Array.from(this.oerIntegrations.values());
  },

  async getOERIntegration(id: number): Promise<OerIntegration | undefined> {
    // Initialize if needed
    this.initOERMaps();
    
    return this.oerIntegrations.get(id);
  },

  async getFilteredOERIntegrations(filters: {
    schoolType?: string;
    moduleType?: string;
    moduleId?: number;
  }): Promise<OerIntegration[]> {
    // Initialize if needed
    this.initOERMaps();
    
    const integrations = Array.from(this.oerIntegrations.values());
    
    return integrations.filter(integration => {
      let match = true;
      
      if (filters.schoolType && integration.schoolType !== filters.schoolType) match = false;
      if (filters.moduleType && integration.moduleType !== filters.moduleType) match = false;
      if (filters.moduleId && integration.moduleId !== filters.moduleId) match = false;
      
      return match;
    });
  },

  async getOERIntegrationsByResource(resourceId: number): Promise<OerIntegration[]> {
    // Initialize if needed
    this.initOERMaps();
    
    return Array.from(this.oerIntegrations.values())
      .filter(integration => integration.resourceId === resourceId);
  },

  async getOERIntegrationsBySchool(schoolType: string): Promise<OerIntegration[]> {
    // Initialize if needed
    this.initOERMaps();
    
    return Array.from(this.oerIntegrations.values())
      .filter(integration => integration.schoolType === schoolType);
  },

  async getOERIntegrationsByModule(moduleType: string, moduleId: number): Promise<OerIntegration[]> {
    // Initialize if needed
    this.initOERMaps();
    
    return Array.from(this.oerIntegrations.values())
      .filter(integration => integration.moduleType === moduleType && integration.moduleId === moduleId);
  },

  async createOERIntegration(integration: InsertOerIntegration): Promise<OerIntegration> {
    try {
      // Initialize if needed
      this.initOERMaps();
      
      // First try to insert into the database
      const newIntegrations = await db.insert(schema.oerIntegrations)
        .values(integration)
        .returning();
      
      if (newIntegrations && newIntegrations.length > 0) {
        // Update in-memory storage
        const newIntegration = newIntegrations[0];
        this.oerIntegrations.set(newIntegration.id, newIntegration);
        return newIntegration;
      }
      
      // Fallback to in-memory if database insert fails
      const newId = this.oerIntegrationCurrentId ? this.oerIntegrationCurrentId++ : 1;
      if (!this.oerIntegrationCurrentId) {
        this.oerIntegrationCurrentId = 2; // Initialize if it doesn't exist
      }
      
      const newOERIntegration = {
        ...integration,
        id: newId,
        createdAt: new Date(),
        updatedAt: new Date(),
        active: true
      };
      
      this.oerIntegrations.set(newId, newOERIntegration);
      return newOERIntegration;
    } catch (error) {
      console.error('Error creating OER integration:', error);
      
      // Fallback to in-memory storage
      const newId = this.oerIntegrationCurrentId ? this.oerIntegrationCurrentId++ : 1;
      if (!this.oerIntegrationCurrentId) {
        this.oerIntegrationCurrentId = 2; // Initialize if it doesn't exist
      }
      
      const newOERIntegration = {
        ...integration,
        id: newId,
        createdAt: new Date(),
        updatedAt: new Date(),
        active: true
      };
      
      this.oerIntegrations.set(newId, newOERIntegration);
      return newOERIntegration;
    }
  },

  async updateOERIntegration(id: number, integration: Partial<InsertOerIntegration>): Promise<OerIntegration | undefined> {
    // Initialize if needed
    this.initOERMaps();
    
    const existingIntegration = this.oerIntegrations.get(id);
    if (!existingIntegration) return undefined;
    
    const updatedIntegration = {
      ...existingIntegration,
      ...integration,
      updatedAt: new Date()
    };
    
    this.oerIntegrations.set(id, updatedIntegration);
    return updatedIntegration;
  },

  async deleteOERIntegration(id: number): Promise<boolean> {
    // Initialize if needed
    this.initOERMaps();
    
    const existingIntegration = this.oerIntegrations.get(id);
    if (!existingIntegration) return false;
    
    // Soft delete - set active to false
    const updatedIntegration = {
      ...existingIntegration,
      active: false,
      updatedAt: new Date()
    };
    
    this.oerIntegrations.set(id, updatedIntegration);
    return true;
  },
  
  // Initialize maps if they don't exist
  initOERMaps() {
    if (!this.openEducationalResources) {
      this.openEducationalResources = new Map();
    }
    if (!this.oerIntegrations) {
      this.oerIntegrations = new Map();
    }
    if (!this.oerResourceCurrentId) {
      this.oerResourceCurrentId = 1;
    }
    if (!this.oerIntegrationCurrentId) {
      this.oerIntegrationCurrentId = 1;
    }
  }
};

// Apply the missing methods to MemStorage prototype
export function applyMissingOERMethods() {
  for (const [methodName, methodFunction] of Object.entries(methodsToAdd)) {
    (MemStorage.prototype as any)[methodName] = methodFunction;
  }
  
  // Add properties to prototype if they don't exist
  if (!(MemStorage.prototype as any).openEducationalResources) {
    (MemStorage.prototype as any).openEducationalResources = new Map();
  }
  
  if (!(MemStorage.prototype as any).oerIntegrations) {
    (MemStorage.prototype as any).oerIntegrations = new Map();
  }
  
  if (!(MemStorage.prototype as any).oerResourceCurrentId) {
    (MemStorage.prototype as any).oerResourceCurrentId = 1;
  }
  
  if (!(MemStorage.prototype as any).oerIntegrationCurrentId) {
    (MemStorage.prototype as any).oerIntegrationCurrentId = 1;
  }
  
  console.log('✅ Applied missing OER methods to MemStorage');
}