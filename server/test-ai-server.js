/**
 * Test AI Integration Server
 * 
 * A minimal Express server to test AI routes
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import testAiRoutes from './api/test-ai-routes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 5002;

// Middleware
app.use(cors());
app.use(express.json());

// Register routes
app.use('/api/ai', testAiRoutes);

// Simple test endpoint
app.get('/test', (req, res) => {
  res.json({ status: 'success', message: 'Main API is working!' });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Test AI server is running on http://0.0.0.0:${PORT}`);
  console.log(`Test the AI endpoint at http://0.0.0.0:${PORT}/api/ai/status`);
});