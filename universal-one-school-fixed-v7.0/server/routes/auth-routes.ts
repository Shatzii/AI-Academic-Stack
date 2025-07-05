import { Router } from 'express';

const router = Router();

// Mock user for demo purposes
const mockUser = {
  id: '1',
  email: 'student@universalone.school',
  name: 'Demo Student',
  school: 'primary',
  grade: 5,
  neurotype: 'neurotypical',
  accommodations: []
};

// Get current user
router.get('/me', (req, res) => {
  // In production, this would check actual authentication
  res.json({
    success: true,
    user: mockUser,
    timestamp: new Date().toISOString()
  });
});

// Login endpoint
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  // Basic validation
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Email and password are required',
      timestamp: new Date().toISOString()
    });
  }

  // Mock authentication - in production, validate against database
  res.json({
    success: true,
    user: mockUser,
    message: 'Login successful',
    timestamp: new Date().toISOString()
  });
});

// Register endpoint
router.post('/register', (req, res) => {
  const { email, password, name, school, grade } = req.body;
  
  // Basic validation
  if (!email || !password || !name) {
    return res.status(400).json({
      success: false,
      error: 'Email, password, and name are required',
      timestamp: new Date().toISOString()
    });
  }

  // Mock registration - in production, save to database
  const newUser = {
    ...mockUser,
    email,
    name,
    school: school || 'primary',
    grade: grade || 1
  };

  res.status(201).json({
    success: true,
    user: newUser,
    message: 'Registration successful',
    timestamp: new Date().toISOString()
  });
});

// Logout endpoint
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful',
    timestamp: new Date().toISOString()
  });
});

export { router as authRoutes };