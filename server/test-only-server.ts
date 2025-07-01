
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import session from 'express-session';
import fileUpload from 'express-fileupload';
import { registerRoutes } from './routes';
import { JWT_SECRET } from './sentinel/config';
import { initializeLanguageSchoolData } from './data/init-language-school-data';
import { storage } from './storage';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Serve static files from public directory
app.use(express.static('public'));
app.use(express.static('client/public'));

// Serve the login page for both / and /login
app.get(['/login', '/'], (req, res) => {
  res.sendFile('test-login.html', { root: './public' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Default route redirects to login
app.get('/', (req, res) => {
  res.redirect('/login');
});

// Basic middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload({
  limits: { fileSize: 10 * 1024 * 1024 },
  useTempFiles: true,
  tempFileDir: './tmp/',
  abortOnLimit: true,
  safeFileNames: true,
  preserveExtension: true
}));

app.use(session({
  secret: JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true }
}));

// Set up server
const startServer = async () => {
  try {
    const server = await registerRoutes(app);
    const port = process.env.PORT || 5000;
    
    server.listen(port, '0.0.0.0', async () => {
      console.log(`API server running on http://0.0.0.0:${port}`);
      try {
        await initializeLanguageSchoolData(storage);
        console.log('Language School data initialization complete');
      } catch (error) {
        console.error('Warning: Language School data initialization failed:', error.message);
        console.log('Server continuing to run with limited functionality');
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
