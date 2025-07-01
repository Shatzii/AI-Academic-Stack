/**
 * Easter Egg Storage Fix
 * 
 * This file adds Easter egg methods to the storage implementation.
 */

import { EasterEgg, EasterEggDiscovery } from "@shared/easter-egg-types";

// In-memory storage for Easter eggs
const easterEggs: EasterEgg[] = [];
const easterEggDiscoveries: EasterEggDiscovery[] = [];

/**
 * Apply Easter egg methods to the storage object
 */
export function applyEasterEggMethods(storage: any) {
  console.log('Applying missing Easter egg methods to storage...');
  
  // For hybrid storage (our new storage proxy), we need to initialize
  // the actual memory storage instance with the correct data structure
  const memStorage = storage.memStorage || storage;
  
  // Initialize collections if they don't exist
  if (!memStorage.data) {
    memStorage.data = {};
  }
  
  if (!memStorage.data.easterEggs) {
    memStorage.data.easterEggs = [];
  }
  
  if (!memStorage.data.easterEggDiscoveries) {
    memStorage.data.easterEggDiscoveries = [];
  }
  
  // Make sure memStorage has data property
  const storageToUse = storage.memStorage || memStorage || storage;
  if (!storageToUse.data) {
    storageToUse.data = { easterEggs: [], easterEggDiscoveries: [] };
  }
  
  // Get all Easter eggs with optional filtering
  storage.getEasterEggs = async (filters = {}) => {
    let eggs = storageToUse.data.easterEggs;
    
    // Apply filters if provided
    if (Object.keys(filters).length > 0) {
      eggs = eggs.filter((egg: any) => {
        for (const [key, value] of Object.entries(filters)) {
          // Special case for school filter which can include 'all'
          if (key === 'school' && Array.isArray(value)) {
            if (!value.includes(egg.school)) {
              return false;
            }
          }
          // Special case for path filter
          else if (key === 'triggerPath') {
            if (egg.triggerPath !== value) {
              return false;
            }
          }
          // For other filters
          else if (egg[key] !== value) {
            return false;
          }
        }
        return true;
      });
    }
    
    return eggs;
  };
  
  // Get a specific Easter egg by ID
  storage.getEasterEggById = async (id: number) => {
    return storage.data.easterEggs.find((egg: any) => egg.id === id);
  };
  
  // Create a new Easter egg
  storage.createEasterEgg = async (easterEgg: EasterEgg) => {
    storage.data.easterEggs.push(easterEgg);
    return easterEgg;
  };
  
  // Update an Easter egg
  storage.updateEasterEgg = async (easterEgg: EasterEgg) => {
    const index = storage.data.easterEggs.findIndex((e: any) => e.id === easterEgg.id);
    if (index !== -1) {
      storage.data.easterEggs[index] = easterEgg;
      return easterEgg;
    }
    return undefined;
  };
  
  // Delete an Easter egg
  storage.deleteEasterEgg = async (id: number) => {
    const index = storage.data.easterEggs.findIndex((e: any) => e.id === id);
    if (index !== -1) {
      storage.data.easterEggs.splice(index, 1);
      return true;
    }
    return false;
  };
  
  // Get a specific Easter egg discovery
  storage.getEasterEggDiscovery = async (userId: number, easterEggId: number) => {
    return storage.data.easterEggDiscoveries.find(
      (d: any) => d.userId === userId && d.easterEggId === easterEggId
    );
  };
  
  // Create a new Easter egg discovery
  storage.createEasterEggDiscovery = async (discovery: EasterEggDiscovery) => {
    storage.data.easterEggDiscoveries.push(discovery);
    return discovery;
  };
  
  // Update an Easter egg discovery
  storage.updateEasterEggDiscovery = async (discovery: EasterEggDiscovery) => {
    const index = storage.data.easterEggDiscoveries.findIndex(
      (d: any) => d.id === discovery.id
    );
    if (index !== -1) {
      storage.data.easterEggDiscoveries[index] = discovery;
      return discovery;
    }
    return undefined;
  };
  
  // Get all Easter egg discoveries for a specific user
  storage.getUserEasterEggDiscoveries = async (userId: number) => {
    return storage.data.easterEggDiscoveries.filter((d: any) => d.userId === userId);
  };
  
  // These are the reward-related methods needed by the Easter egg system
  
  // Update user XP (use existing method if available)
  if (!storage.updateUserXP) {
    storage.updateUserXP = async (userId: number, xpAmount: number) => {
      try {
        // Try to use existing updateUserXp method if available (note the case difference)
        if (storage.updateUserXp) {
          return await storage.updateUserXp(userId, xpAmount);
        }
        
        // Fallback implementation
        const user = await storage.getUser(userId);
        if (user) {
          user.xp = (user.xp || 0) + xpAmount;
          return user;
        }
      } catch (error) {
        console.error('Error updating user XP:', error);
      }
      return undefined;
    };
  }
  
  // Award badge to user
  if (!storage.awardBadgeToUser) {
    storage.awardBadgeToUser = async (userId: number, badgeId: number) => {
      try {
        const user = await storage.getUser(userId);
        const badge = await storage.getBadges().then((badges: any[]) => 
          badges.find((b: any) => b.id === badgeId)
        );
        
        if (user && badge) {
          // Create a new user badge record
          const userBadge = {
            id: Math.floor(Math.random() * 10000) + 1, // Generate a random ID
            userId,
            badgeId,
            earnedAt: new Date().toISOString()
          };
          
          if (!storage.data.userBadges) {
            storage.data.userBadges = [];
          }
          
          storage.data.userBadges.push(userBadge);
          return userBadge;
        }
      } catch (error) {
        console.error('Error awarding badge to user:', error);
      }
      return undefined;
    };
  }
  
  // Unlock avatar for user
  if (!storage.unlockAvatarForUser) {
    storage.unlockAvatarForUser = async (userId: number, avatarId: number) => {
      try {
        const user = await storage.getUser(userId);
        
        if (user) {
          // Create a user_avatars entry or simply modify the user object
          // depending on the storage implementation
          
          // For simplicity, we'll just add a custom field to the user object
          if (!user.unlockedAvatars) {
            user.unlockedAvatars = [];
          }
          
          if (!user.unlockedAvatars.includes(avatarId)) {
            user.unlockedAvatars.push(avatarId);
          }
          
          return true;
        }
      } catch (error) {
        console.error('Error unlocking avatar for user:', error);
      }
      return false;
    };
  }
  
  // Unlock feature for user
  if (!storage.unlockFeatureForUser) {
    storage.unlockFeatureForUser = async (userId: number, featureId: number) => {
      try {
        const user = await storage.getUser(userId);
        
        if (user) {
          if (!user.unlockedFeatures) {
            user.unlockedFeatures = [];
          }
          
          if (!user.unlockedFeatures.includes(featureId)) {
            user.unlockedFeatures.push(featureId);
          }
          
          return true;
        }
      } catch (error) {
        console.error('Error unlocking feature for user:', error);
      }
      return false;
    };
  }
  
  // Unlock content for user
  if (!storage.unlockContentForUser) {
    storage.unlockContentForUser = async (userId: number, contentId: number) => {
      try {
        const user = await storage.getUser(userId);
        
        if (user) {
          if (!user.unlockedContent) {
            user.unlockedContent = [];
          }
          
          if (!user.unlockedContent.includes(contentId)) {
            user.unlockedContent.push(contentId);
          }
          
          return true;
        }
      } catch (error) {
        console.error('Error unlocking content for user:', error);
      }
      return false;
    };
  }
  
  console.log('✅ Easter egg methods applied to MemStorage');
  return storage;
}