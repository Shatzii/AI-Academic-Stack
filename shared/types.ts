// Centralized type definitions for copilot and IDE consistency
export * from './schema';

// Additional component-specific types
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => void;
  loginMutation: any; // Will be properly typed in the auth hook
  logoutMutation: any; // Will be properly typed in the auth hook
}

// Import the User type from schema
import type { User } from './schema';

// Re-export for convenience
export type { User };

// Badge component props (fixing quantum-collaboration-hub issue)
export interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

// Missing icon types - providing fallbacks
export interface IconProps {
  className?: string;
  size?: string | number;
}

// Virtual classroom types
export interface ClassroomSession {
  id: string;
  title: string;
  participants: number;
  startTime: Date;
  endTime: Date;
  status: 'active' | 'scheduled' | 'completed';
}

// Holographic learning types
export interface HolographicSpace {
  id: string;
  name: string;
  type: '3d_model' | 'virtual_lab' | 'historical_site';
  active: boolean;
}

// Time dimension learning types
export interface LearningTimeline {
  id: string;
  period: string;
  events: TimelineEvent[];
}

export interface TimelineEvent {
  id: string;
  title: string;
  date: Date;
  description: string;
  achievements?: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: Date;
}