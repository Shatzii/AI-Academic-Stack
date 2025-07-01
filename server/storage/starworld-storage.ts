import { IStorage } from '../storage';
import { 
  Avatar, NewAvatar, 
  World, NewWorld,
  MotionTrackingSession, NewMotionTrackingSession,
  ParentalControl, NewParentalControl,
  StarworldMetric, NewStarworldMetric
} from '@shared/starworld-schema';

/**
 * Extends the storage interface with Starworld-specific methods
 */
export interface StarworldStorage {
  // Avatar methods
  getStarworldAvatars(userId: number): Promise<Avatar[]>;
  getStarworldAvatar(id: number): Promise<Avatar | undefined>;
  createStarworldAvatar(data: NewAvatar): Promise<Avatar>;
  updateStarworldAvatar(id: number, data: Partial<Avatar>): Promise<Avatar | undefined>;
  deleteStarworldAvatar(id: number): Promise<boolean>;
  
  // World methods
  getStarworldWorlds(userId: number): Promise<World[]>;
  getStarworldWorld(id: number): Promise<World | undefined>;
  createStarworldWorld(data: NewWorld): Promise<World>;
  updateStarworldWorld(id: number, data: Partial<World>): Promise<World | undefined>;
  deleteStarworldWorld(id: number): Promise<boolean>;
  
  // Motion tracking methods
  getStarworldMotionSessions(userId: number): Promise<MotionTrackingSession[]>;
  getStarworldMotionSession(id: number): Promise<MotionTrackingSession | undefined>;
  createStarworldMotionSession(data: NewMotionTrackingSession): Promise<MotionTrackingSession>;
  
  // Parental control methods
  getStarworldParentalControls(parentId: number, childId: number): Promise<ParentalControl | undefined>;
  createStarworldParentalControls(data: NewParentalControl): Promise<ParentalControl>;
  updateStarworldParentalControls(id: number, data: Partial<ParentalControl>): Promise<ParentalControl | undefined>;
  
  // Metrics methods
  getStarworldMetrics(userId: number): Promise<StarworldMetric[]>;
  createStarworldMetrics(data: NewStarworldMetric): Promise<StarworldMetric>;
}

/**
 * Add Starworld methods to storage implementation
 */
export function addStarworldMethods(storage: IStorage): void {
  console.log('✅ Applying Starworld 3D curriculum methods to storage');
  
  // Initialize in-memory storage if needed
  if (!storage.starworldData) {
    storage.starworldData = {
      avatars: [],
      worlds: [],
      motionSessions: [],
      parentalControls: [],
      metrics: [],
      avatarIdCounter: 1,
      worldIdCounter: 1,
      sessionIdCounter: 1,
      controlIdCounter: 1,
      metricIdCounter: 1
    };
  }
  
  // Avatar methods
  storage.getStarworldAvatars = async function(userId: number): Promise<Avatar[]> {
    return this.starworldData.avatars.filter(avatar => avatar.userId === userId);
  };
  
  storage.getStarworldAvatar = async function(id: number): Promise<Avatar | undefined> {
    return this.starworldData.avatars.find(avatar => avatar.id === id);
  };
  
  storage.createStarworldAvatar = async function(data: NewAvatar): Promise<Avatar> {
    const newAvatar: Avatar = {
      id: this.starworldData.avatarIdCounter++,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
      savedAt: new Date()
    };
    
    this.starworldData.avatars.push(newAvatar);
    return newAvatar;
  };
  
  storage.updateStarworldAvatar = async function(id: number, data: Partial<Avatar>): Promise<Avatar | undefined> {
    const index = this.starworldData.avatars.findIndex(avatar => avatar.id === id);
    if (index === -1) return undefined;
    
    const updatedAvatar = {
      ...this.starworldData.avatars[index],
      ...data,
      updatedAt: new Date(),
      savedAt: new Date()
    };
    
    this.starworldData.avatars[index] = updatedAvatar;
    return updatedAvatar;
  };
  
  storage.deleteStarworldAvatar = async function(id: number): Promise<boolean> {
    const initialLength = this.starworldData.avatars.length;
    this.starworldData.avatars = this.starworldData.avatars.filter(avatar => avatar.id !== id);
    return initialLength > this.starworldData.avatars.length;
  };
  
  // World methods
  storage.getStarworldWorlds = async function(userId: number): Promise<World[]> {
    return this.starworldData.worlds.filter(world => world.userId === userId);
  };
  
  storage.getStarworldWorld = async function(id: number): Promise<World | undefined> {
    return this.starworldData.worlds.find(world => world.id === id);
  };
  
  storage.createStarworldWorld = async function(data: NewWorld): Promise<World> {
    const newWorld: World = {
      id: this.starworldData.worldIdCounter++,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data
    };
    
    this.starworldData.worlds.push(newWorld);
    return newWorld;
  };
  
  storage.updateStarworldWorld = async function(id: number, data: Partial<World>): Promise<World | undefined> {
    const index = this.starworldData.worlds.findIndex(world => world.id === id);
    if (index === -1) return undefined;
    
    const updatedWorld = {
      ...this.starworldData.worlds[index],
      ...data,
      updatedAt: new Date()
    };
    
    this.starworldData.worlds[index] = updatedWorld;
    return updatedWorld;
  };
  
  storage.deleteStarworldWorld = async function(id: number): Promise<boolean> {
    const initialLength = this.starworldData.worlds.length;
    this.starworldData.worlds = this.starworldData.worlds.filter(world => world.id !== id);
    return initialLength > this.starworldData.worlds.length;
  };
  
  // Motion tracking methods
  storage.getStarworldMotionSessions = async function(userId: number): Promise<MotionTrackingSession[]> {
    return this.starworldData.motionSessions.filter(session => session.userId === userId);
  };
  
  storage.getStarworldMotionSession = async function(id: number): Promise<MotionTrackingSession | undefined> {
    return this.starworldData.motionSessions.find(session => session.id === id);
  };
  
  storage.createStarworldMotionSession = async function(data: NewMotionTrackingSession): Promise<MotionTrackingSession> {
    const newSession: MotionTrackingSession = {
      id: this.starworldData.sessionIdCounter++,
      createdAt: new Date(),
      endedAt: new Date(), // Assuming session is completed when recorded
      ...data
    };
    
    this.starworldData.motionSessions.push(newSession);
    return newSession;
  };
  
  // Parental control methods
  storage.getStarworldParentalControls = async function(parentId: number, childId: number): Promise<ParentalControl | undefined> {
    return this.starworldData.parentalControls.find(
      control => control.parentId === parentId && control.childId === childId
    );
  };
  
  storage.createStarworldParentalControls = async function(data: NewParentalControl): Promise<ParentalControl> {
    // Check if controls already exist for this parent-child pair
    const existing = await this.getStarworldParentalControls(data.parentId, data.childId);
    
    if (existing) {
      // Update existing controls instead of creating new ones
      return this.updateStarworldParentalControls(existing.id, data) as Promise<ParentalControl>;
    }
    
    const newControls: ParentalControl = {
      id: this.starworldData.controlIdCounter++,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data
    };
    
    this.starworldData.parentalControls.push(newControls);
    return newControls;
  };
  
  storage.updateStarworldParentalControls = async function(id: number, data: Partial<ParentalControl>): Promise<ParentalControl | undefined> {
    const index = this.starworldData.parentalControls.findIndex(control => control.id === id);
    if (index === -1) return undefined;
    
    const updatedControls = {
      ...this.starworldData.parentalControls[index],
      ...data,
      updatedAt: new Date()
    };
    
    this.starworldData.parentalControls[index] = updatedControls;
    return updatedControls;
  };
  
  // Metrics methods
  storage.getStarworldMetrics = async function(userId: number): Promise<StarworldMetric[]> {
    return this.starworldData.metrics.filter(metric => metric.userId === userId);
  };
  
  storage.createStarworldMetrics = async function(data: NewStarworldMetric): Promise<StarworldMetric> {
    const newMetric: StarworldMetric = {
      id: this.starworldData.metricIdCounter++,
      createdAt: new Date(),
      ...data
    };
    
    this.starworldData.metrics.push(newMetric);
    return newMetric;
  };
}