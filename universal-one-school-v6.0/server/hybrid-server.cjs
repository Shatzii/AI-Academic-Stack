/**
 * Replit-Optimized Hybrid Server for ShatziiOS
 * 
 * This script is specifically designed for Replit workflow detection:
 * 1. Creates a simple HTTP server that responds instantly on port 5000
 * 2. Provides a loading page for users while the main app starts
 * 3. Keeps a background monitor process to restart the main app if it fails
 * 
 * NOTE: This version eliminates the TCP socket step to make Replit detection more reliable
 */

const http = require('http');
const { spawn } = require('child_process');
const PORT = 5000;

console.log('ShatziiOS Replit-Optimized Server starting...');

// REPLIT NOTICE: Immediately print a message indicating port binding
// This helps Replit's log parser detect that the port is about to be bound
console.log(`Preparing to bind port ${PORT} for Replit workflow detection...`);

// IMMEDIATELY create the HTTP server for fastest possible port binding
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>ShatziiOS - Starting</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #f5f5f5; }
          .container { text-align: center; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); max-width: 90%; }
          h1 { color: #444; margin-bottom: 30px; }
          .loader { border: 8px solid #f3f3f3; border-top: 8px solid #3498db; border-radius: 50%; width: 60px; height: 60px; animation: spin 2s linear infinite; margin: 0 auto 30px; }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          p { color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>ShatziiOS is Starting</h1>
          <div class="loader"></div>
          <p>Please wait while the educational platform initializes...</p>
          <p>Server time: ${new Date().toISOString()}</p>
          <p><small>Powered by Shatzii Educational Technologies</small></p>
        </div>
      </body>
    </html>
  `);
});

// Immediately listen on the port - this is critical for Replit detection
server.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ HTTP server running on port ${PORT} at ${new Date().toISOString()}`);
  
  // Start the main application after a slight delay
  setTimeout(() => {
    startMainApp();
  }, 1000); // 1 second delay to ensure Replit detects the port
});

server.on('error', (err) => {
  console.error('HTTP server error:', err);
  
  // If the port is in use, try again with a different port
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is already in use, trying port ${PORT+1}...`);
    server.listen(PORT+1, '0.0.0.0');
  }
});

function startMainApp() {
  console.log(`Starting main ShatziiOS application at ${new Date().toISOString()}`);
  
  // Start the main application
  const mainApp = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    env: process.env
  });
  
  // Handle application exit events
  mainApp.on('exit', (code, signal) => {
    console.log(`Main application exited with code ${code} and signal ${signal}`);
    
    if (code !== 0) {
      console.log('Main application crashed, restarting in 5 seconds...');
      setTimeout(() => {
        startMainApp();
      }, 5000);
    }
  });
  
  mainApp.on('error', (err) => {
    console.error('Failed to start main application:', err);
    console.log('Will retry in 5 seconds...');
    setTimeout(() => {
      startMainApp();
    }, 5000);
  });
}