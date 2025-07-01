/**
 * API Debug Middleware
 * 
 * This middleware provides detailed logging and handles redirecting API requests
 * to the appropriate integrated AI routes.
 */

/**
 * API Debug Middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export async function apiProxyMiddleware(req, res, next) {
  // Add timestamp for debugging
  const timestamp = new Date().toLocaleTimeString();
  
  // Debug all API requests
  if (req.path.startsWith('/api/')) {
    console.log(`[${timestamp}] API Request: ${req.method} ${req.path}`);
    
    // For POST requests, also log the request body
    if (req.method === 'POST' && req.body) {
      console.log(`[${timestamp}] Request Body:`, JSON.stringify(req.body, null, 2));
    }
  }
  
  // We're only interested in direct calls to /api/ai/ not coming from our integrated routes
  if (req.path.startsWith('/api/ai/') && !req.path.includes('/integration/')) {
    // Direct calls to /api/ai/ should be redirected to /api/ai/integration/
    const newPath = req.path.replace('/api/ai/', '/api/ai/integration/');
    
    console.log(`[${timestamp}] AI API redirect: ${req.path} -> ${newPath}`);
    
    // Update the URL and path
    req.url = newPath;
    req.path = newPath;
    
    // Also update originalUrl if it exists
    if (req.originalUrl) {
      req.originalUrl = req.originalUrl.replace('/api/ai/', '/api/ai/integration/');
    }
  }
  
  // Wrap responses to add more debugging
  const originalSend = res.send;
  res.send = function(body) {
    // Only log API responses
    if (req.path.startsWith('/api/')) {
      // Check if it's JSON
      if (res.get('Content-Type')?.includes('application/json')) {
        console.log(`[${timestamp}] API Response (${req.path}): Status ${res.statusCode}`);
        
        // Try to parse and log JSON
        try {
          if (typeof body === 'string') {
            const parsed = JSON.parse(body);
            console.log(`[${timestamp}] Response Body: ${JSON.stringify(parsed, null, 2).substring(0, 500)}...`);
          } else if (typeof body === 'object') {
            console.log(`[${timestamp}] Response Body: ${JSON.stringify(body, null, 2).substring(0, 500)}...`);
          }
        } catch (error) {
          // Non-JSON response
          console.log(`[${timestamp}] Response is not valid JSON or cannot be logged (length: ${body?.length || 0})`);
        }
      } else {
        // Non-JSON response
        console.log(`[${timestamp}] Non-JSON Response: Content-Type ${res.get('Content-Type')}, Status ${res.statusCode}`);
      }
    }
    
    return originalSend.call(this, body);
  };
  
  // Continue to the next middleware
  next();
}

export default apiProxyMiddleware;