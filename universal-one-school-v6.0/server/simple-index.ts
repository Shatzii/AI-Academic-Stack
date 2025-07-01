import express from "express";
import path from "path";
import { createServer } from "http";

const PORT = process.env.PORT || 5000;
const app = express();

// Serve static files from the public directory with correct MIME types
app.use(express.static(path.join(process.cwd(), 'public'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

// Parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Contact form endpoint
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  console.log('Contact form submission:', { name, email, subject, message });
  res.json({ success: true, message: 'Thank you for your message! We will get back to you soon.' });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'The Universal One School platform is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// School information endpoint
app.get('/api/schools', (req, res) => {
  const schools = [
    {
      id: 'primary',
      name: 'Primary School',
      url: 'https://superhero.shatzii.com',
      theme: 'superhero',
      description: 'Superhero-themed K-6 education tailored for young neurodivergent minds.',
      features: ['Interactive Stories', 'Visual Learning', 'Adaptive Pace']
    },
    {
      id: 'secondary',
      name: 'Secondary School',
      url: 'https://secondary.shatzii.com',
      theme: 'mature',
      description: 'Grades 7-12 with mature themes designed for adolescent learners.',
      features: ['Project-Based', 'Self-Paced', 'Career Focused']
    },
    {
      id: 'law',
      name: 'Law School',
      url: 'https://law.shatzii.com',
      theme: 'professional',
      description: 'College-level legal education designed for neurodivergent students.',
      features: ['Case Studies', 'Simulations', 'Legal Writing']
    },
    {
      id: 'language',
      name: 'Language School',
      url: 'https://language.shatzii.com',
      theme: 'global',
      description: 'Multilingual education in English, German, and Spanish.',
      features: ['Conversation', 'Cultural Context', 'Practical Usage']
    }
  ];
  res.json(schools);
});

// Demo credentials endpoint
app.get('/api/demo-credentials', (req, res) => {
  const credentials = {
    admin: {
      username: 'admin',
      password: 'admin123',
      note: 'Use these credentials for admin access to all schools'
    },
    student: {
      username: 'student',
      password: 'student123',
      note: 'Use these credentials for student demo access to all schools'
    }
  };
  res.json(credentials);
});

// Serve the main index.html for the root path
app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

// Fallback route - serve the main index.html for any other routes
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

// Start the server
const httpServer = createServer(app);
httpServer.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`The Universal One School platform running on port ${PORT}`);
  console.log(`Main landing page: http://localhost:${PORT}`);
  console.log('School subdomains will be available at their respective URLs');
});

export default app;