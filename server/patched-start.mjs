/**
 * Patched Server Starter (ESM version)
 * 
 * This script sets environment variables before starting the main server
 * to work around the Vite environment variable issue.
 */

// Set a default NODE_ENV
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Set a basic VITE_APP_NAME to avoid undefined errors
process.env.VITE_APP_NAME = 'ShotziOS';

// Create an empty .env file to avoid file not found errors
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// Ensure .env file exists
if (!fs.existsSync(path.join(rootDir, '.env'))) {
  console.log('Creating empty .env file to avoid errors...');
  fs.writeFileSync(path.join(rootDir, '.env'), '# ShotziOS environment\nVITE_APP_NAME=ShotziOS\n');
}

// Run the API-only server since Vite is causing issues
console.log('🚀 Starting API-only server...');
console.log('Note: Full application with frontend is not available due to Vite environment issues');
console.log('API functionality will be accessible, but frontend will not be rendered');

const serverProcess = spawn('npx', ['tsx', 'server/test-only-server.ts'], {
  stdio: 'inherit',
  cwd: rootDir
});

serverProcess.on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

// Keep the process running
process.on('SIGINT', () => {
  console.log('Stopping server...');
  serverProcess.kill();
  process.exit(0);
});