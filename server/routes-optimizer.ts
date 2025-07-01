import { Express } from 'express';
import path from 'path';
import fs from 'fs';

export function optimizeRouting(app: Express) {
  // Centralized school routing system
  const schoolRoutes = {
    'primary-school': '/schools/primary-school/',
    'secondary-school': '/schools/secondary-school/', 
    'law-school': '/schools/law-school/',
    'language-school': '/schools/language-school/'
  };

  // Legacy route redirects for seamless migration
  const legacyRedirects = {
    '/primary': '/schools/primary-school/',
    '/secondary': '/schools/secondary-school/',
    '/lawyer-makers': '/schools/law-school/',
    '/language': '/schools/language-school/',
    '/schools/lawyer-makers': '/schools/law-school/',
    '/schools/lawyer-makers/': '/schools/law-school/'
  };

  // Apply legacy redirects
  Object.entries(legacyRedirects).forEach(([oldPath, newPath]) => {
    app.get(oldPath, (req, res) => {
      res.redirect(301, newPath);
    });
  });

  // Ensure all school pages exist and serve correctly
  Object.entries(schoolRoutes).forEach(([schoolId, routePath]) => {
    app.get(routePath, (req, res) => {
      const schoolIndexPath = path.join(process.cwd(), 'public', 'schools', schoolId, 'index.html');
      
      if (fs.existsSync(schoolIndexPath)) {
        res.sendFile(schoolIndexPath);
      } else {
        // Fallback to main index with school parameter
        res.redirect(`/?school=${schoolId}`);
      }
    });
  });

  // API endpoint for dynamic school information
  app.get('/api/schools/:schoolId', (req, res) => {
    const { schoolId } = req.params;
    
    const schoolsData = {
      'primary-school': {
        name: 'Primary School Heroes',
        subtitle: 'K-6 Superhero Academy',
        instructor: 'Captain Knowledge',
        theme: 'superhero',
        colors: { primary: '#ff6b6b', secondary: '#ffa726', accent: '#66bb6a' },
        features: ['Interactive Stories', 'Visual Learning', 'Adaptive Pace', 'Superhero Missions']
      },
      'secondary-school': {
        name: 'Secondary School Excellence', 
        subtitle: 'Grades 7-12 Academic Leadership',
        instructor: 'Dr. Mentor',
        theme: 'academic',
        colors: { primary: '#4ecdc4', secondary: '#44a08d', accent: '#f39c12' },
        features: ['Project-Based', 'Self-Paced', 'Career Focused', 'College Prep']
      },
      'law-school': {
        name: 'The Lawyer Makers',
        subtitle: 'Advanced Legal Education',
        instructor: 'Professor Justice',
        theme: 'professional',
        colors: { primary: '#1e40af', secondary: '#3b82f6', accent: '#f59e0b' },
        features: ['Case Studies', 'Simulations', 'Legal Writing', 'Bar Preparation']
      },
      'language-school': {
        name: 'Global Language Academy',
        subtitle: 'Multilingual Education',
        instructor: 'Professor Polyglot', 
        theme: 'cultural',
        colors: { primary: '#96ceb4', secondary: '#85c1e9', accent: '#f7dc6f' },
        features: ['English', 'German', 'Spanish', 'Cultural Immersion']
      }
    };

    const schoolData = schoolsData[schoolId as keyof typeof schoolsData];
    if (schoolData) {
      res.json(schoolData);
    } else {
      res.status(404).json({ error: 'School not found' });
    }
  });

  // Clean up broken links and provide helpful errors
  app.get('/schools/:schoolId/*', (req, res) => {
    const { schoolId } = req.params;
    if (schoolRoutes[schoolId as keyof typeof schoolRoutes]) {
      res.redirect(schoolRoutes[schoolId as keyof typeof schoolRoutes]);
    } else {
      res.status(404).sendFile(path.join(process.cwd(), 'public', '404.html'));
    }
  });
}