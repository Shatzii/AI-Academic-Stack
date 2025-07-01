/**
 * Simple API Test Server
 * 
 * This script creates a minimal Express server to test API endpoints
 */

import express from 'express';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 5001;

// Enable JSON parsing
app.use(express.json());

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ status: 'success', message: 'API is working!' });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Test API server is running on http://0.0.0.0:${PORT}`);
});