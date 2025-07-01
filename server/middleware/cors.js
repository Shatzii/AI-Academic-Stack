/**
 * CORS Middleware for AI Education Platform
 * 
 * Handles Cross-Origin Resource Sharing for secure API access
 */

const cors = require('cors');

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests from the same origin (Next.js dev server)
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5000',
      'https://schools.shatzii.com',
      'https://www.schools.shatzii.com'
    ];
    
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies to be sent
  optionsSuccessStatus: 200 // Support legacy browsers
};

module.exports = cors(corsOptions);