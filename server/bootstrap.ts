/**
 * ShatziiOS Bootstrap Server
 * 
 * This is a minimal bootstrap server that starts immediately to secure the port,
 * then loads the full application in the background. This solves the Replit
 * workflow timeout issue by opening port 5000 quickly while the main app loads.
 */

import express from "express";
import { createServer } from "http";

// Capture the port and create a reference we'll pass to the main app
const PORT = process.env.PORT || 5000;
const app = express();
const httpServer = createServer(app);

console.log(`🚀 ShatziiOS Bootstrap Server starting on port ${PORT}...`);

// Setup a basic health check endpoint that will respond immediately
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "initializing", 
    timestamp: new Date(),
    message: "ShatziiOS is starting up. Please wait..."
  });
});

// Setup a catch-all route while we're initializing
app.use("*", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>ShatziiOS - Starting Up</title>
      <style>
        body {
          font-family: 'Open Dyslexic', Arial, sans-serif;
          background: #000;
          color: #fff;
          text-align: center;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }
        .container {
          max-width: 800px;
          padding: 2rem;
        }
        h1 {
          color: #4CAF50;
        }
        .spinner {
          border: 5px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top: 5px solid #4CAF50;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
          margin: 20px auto;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .message {
          margin-top: 20px;
          font-size: 1.2rem;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>ShatziiOS Education Platform</h1>
        <div class="spinner"></div>
        <p class="message">The system is currently initializing...</p>
        <p>This may take a few moments as we prepare your personalized learning environment.</p>
        <p>Please refresh in about 10 seconds.</p>
      </div>
      <script>
        // Automatically refresh after 10 seconds
        setTimeout(() => {
          window.location.reload();
        }, 10000);
      </script>
    </body>
    </html>
  `);
});

// Start the server immediately to claim the port
httpServer.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`✅ Bootstrap server running at http://0.0.0.0:${PORT}`);
  
  // Now load the main application in the background
  import("./index.js").catch(error => {
    console.error("Error loading main application:", error);
  });
});

// Handle graceful shutdown
const shutdown = () => {
  console.log("Shutting down bootstrap server...");
  httpServer.close(() => {
    console.log("Bootstrap server closed");
    process.exit(0);
  });
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);