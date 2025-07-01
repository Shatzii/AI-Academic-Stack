/**
 * Clean URL Middleware
 * 
 * This middleware handles clean URLs without .html extensions
 * by mapping them to their corresponding HTML files.
 */

import { Request, Response, NextFunction } from 'express';
import path from 'path';

// Map of clean URLs to their corresponding HTML files
const urlMapping: Record<string, string> = {
  // School dashboards
  '/ceo-dashboard': 'ceo-dashboard.html',
  '/elementary-dashboard': 'elementary-dashboard.html',
  '/middle-dashboard': 'middle-dashboard.html',
  '/high-dashboard': 'high-dashboard.html',
  '/neurodivergent-college-dashboard': 'neurodivergent-college-dashboard.html',
  '/law-dashboard': 'law-dashboard.html',
  '/language-dashboard': 'language-dashboard.html',
  
  // User dashboards
  '/student-dashboard': 'student-dashboard.html',
  '/parent-dashboard': 'parent-dashboard.html',
  '/teacher-dashboard': 'teacher-dashboard.html',
  
  // School-specific dashboards
  '/neurodivergent-elementary-dashboard': 'neurodivergent-elementary-dashboard.html',
  '/neurodivergent-middle-dashboard': 'neurodivergent-middle-dashboard.html',
  '/neurodivergent-high-dashboard': 'neurodivergent-high-dashboard.html',
  '/bar-exam-dashboard': 'bar-exam-dashboard.html',
  '/language-school-dashboard': 'language-school-dashboard.html',
  '/law-school-dashboard': 'law-school-dashboard.html',
  
  // Management pages
  '/schools-management': 'schools-management.html',
  '/students-management': 'students-management.html',
  '/faculty-management': 'faculty-management.html',
  '/curriculum-management': 'curriculum-management.html',
  '/ai-teachers-management': 'ai-teachers-management.html',
  '/resources-management': 'resources-management.html',
  
  // Other dashboards
  '/analytics-dashboard': 'analytics-dashboard.html',
  '/security-dashboard': 'security-dashboard.html',
  '/alerts-dashboard': 'alerts-dashboard.html',
  '/system-settings': 'system-settings.html',
  
  // Utility pages
  '/sitemap': 'sitemap.html',
  
  // AI Integration pages
  '/ai-tutor-config': 'ai-tutor-config.html',
  '/ai-teacher-creator': 'ai-teacher-creator.html',
  '/curriculum-generator': 'curriculum-generator.html',
  '/learning-style-assessment': 'learning-style-assessment.html',
  '/ai-tutoring-session': 'ai-tutoring-session.html'
};

export function cleanUrlMiddleware(req: Request, res: Response, next: NextFunction) {
  const cleanUrl = req.path;
  
  // Skip API routes completely
  if (cleanUrl.startsWith('/api/')) {
    return next();
  }
  
  // Check if the current URL is in our mapping
  if (urlMapping[cleanUrl]) {
    // Map to the HTML file
    const htmlFile = urlMapping[cleanUrl];
    const publicPath = path.resolve(process.cwd(), 'server', 'public');
    return res.sendFile(path.join(publicPath, htmlFile));
  }
  
  // If not in our mapping, continue to the next middleware
  next();
}