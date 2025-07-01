/**
 * Remote Proxy Routes
 * 
 * This file defines Express routes that proxy requests to the remote ShatziiOS server.
 */

import { Router } from 'express';
import { RemoteServerService } from '../services/remote-server-service';
import { SERVER_CONFIG } from '../config/server-config';

export const router = Router();
const remoteServerService = new RemoteServerService();

// Log at initialization time to confirm this file is loaded
console.log('✅ Remote proxy routes initialized - Ready to connect to: ' + SERVER_CONFIG.REMOTE_SERVER_URL);

// General proxy middleware that forwards requests to the remote server
router.use('/:pathParam*', async (req, res) => {
  try {
    // Construct the endpoint path from the request
    const fullPath = req.originalUrl.replace('/remote/', '');
    
    // Forward the request to the remote server
    const response = await remoteServerService.forwardRequest(fullPath, req);
    
    // Return the response from the remote server
    res.status(200).json(response);
  } catch (error: any) {
    console.error('Error proxying request to remote server:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to connect to remote server',
      error: error.message || 'Unknown error'
    });
  }
});