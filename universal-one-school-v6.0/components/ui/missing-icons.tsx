// Fallback components for missing Lucide React icons
import React from 'react';

interface IconProps {
  className?: string;
  size?: string | number;
}

// Screen icon fallback (for virtual-classroom/interactive-classroom.tsx)
export const Screen: React.FC<IconProps> = ({ className, ...props }) => (
  <svg 
    className={className} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24" 
    {...props}
  >
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
    <line x1="8" y1="21" x2="16" y2="21"/>
    <line x1="12" y1="17" x2="12" y2="21"/>
  </svg>
);

// Cube icon fallback (for holographic-learning-space.tsx)
export const Cube: React.FC<IconProps> = ({ className, ...props }) => (
  <svg 
    className={className} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24" 
    {...props}
  >
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);

// Future icon fallback (for time-dimension-learning.tsx)
export const Future: React.FC<IconProps> = ({ className, ...props }) => (
  <svg 
    className={className} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24" 
    {...props}
  >
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12,6 12,12 16,14"/>
    <path d="M16 4l4 4-4 4"/>
  </svg>
);

// Trophy icon fallback (for time-dimension-learning.tsx)
export const Trophy: React.FC<IconProps> = ({ className, ...props }) => (
  <svg 
    className={className} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24" 
    {...props}
  >
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
    <path d="M4 22h16"/>
    <path d="M10 14.66V17c0 .55.47.98.97 1.21C12.15 18.75 14 20 14 20s1.85-1.25 3.03-1.79c.5-.23.97-.66.97-1.21v-2.34"/>
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
  </svg>
);