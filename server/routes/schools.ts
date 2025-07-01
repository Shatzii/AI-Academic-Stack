/**
 * School Routes
 * 
 * These routes handle redirects to the different school applications
 * and provide access to the downloadable packages.
 */
import express from 'express';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Map of school paths to their respective directories or files
const schoolMap: Record<string, string> = {
  'primary-school': '/public/schools/primary-school/index.html',
  'secondary-school': '/public/schools/secondary-school/index.html',
  'lawyer-makers': '/public/schools/lawyer-makers/index.html',
  'language-school': '/public/schools/language-school/index.html',
  'ceo-dashboard': '/public/ceo-dashboard/index.html',
  'sentinel': '/public/sentinel/dashboard.html',
};

// Map of downloadable packages
const packageMap: Record<string, string> = {
  'primary-school.zip': 'Unavailable',
  'secondary-school.zip': 'Unavailable',
  'ShatziiOS_Law_School_Complete.zip': path.join(__dirname, '../../ShatziiOS_Law_School_Complete.zip'),
  'language-school.zip': 'Unavailable',
  'ShatziiOS_CEO_Dashboard.zip': path.join(__dirname, '../../ShatziiOS_CEO_Dashboard.zip'),
  'Sentinel_4.5_Security_System.tar.gz': path.join(__dirname, '../../Sentinel_4.5_Security_System.tar.gz'),
};

// School redirects
router.get('/:school', (req, res) => {
  const school = req.params.school;
  
  if (school in schoolMap) {
    // For schools that are direct files/folders, serve the file
    res.sendFile(path.join(__dirname, '../..', schoolMap[school]));
  } else {
    // For unknown schools, redirect to landing page
    res.redirect('/');
  }
});

// Handle direct root access to specific school pages
router.get('/law-school', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/schools/lawyer-makers/index.html'));
});

router.get('/ceo-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/ceo-dashboard/index.html'));
});

router.get('/sentinel/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/sentinel/dashboard.html'));
});

// Set up download routes
router.get('/api/downloads/:package', (req, res) => {
  const packageName = req.params.package;
  
  if (packageName in packageMap) {
    const packagePath = packageMap[packageName];
    
    if (packagePath === 'Unavailable') {
      res.status(404).send('Package not available yet');
    } else if (fs.existsSync(packagePath)) {
      res.download(packagePath);
    } else {
      res.status(404).send('Package file not found on server');
    }
  } else {
    res.status(404).send('Package not found');
  }
});

export default router;