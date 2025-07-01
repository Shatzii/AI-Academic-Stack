/**
 * API Connection Checker
 * 
 * This script verifies that the API server is running and accessible.
 */

const fetch = require('node-fetch');

const API_HOST = 'localhost';
const API_PORT = 5001;
const API_URL = `http://${API_HOST}:${API_PORT}/api/ai/status`;

async function checkAPIConnection() {
  console.log('Checking API server connection...');
  console.log(`Testing: ${API_URL}`);
  
  try {
    // Add a delay to ensure the server has time to start
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Try to connect to the API
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      console.error(`❌ API server is not responding correctly. Status: ${response.status}`);
      return false;
    }
    
    const data = await response.json();
    console.log('✅ API server is running!');
    console.log('API Status:', JSON.stringify(data, null, 2));
    
    // Check if Anthropic is available
    if (data.anthropic && data.anthropic.available) {
      console.log('✅ Anthropic integration is available');
      console.log(`   Model: ${data.anthropic.model}`);
    } else {
      console.warn('⚠️ Anthropic integration is NOT available');
      console.warn('   Make sure ANTHROPIC_API_KEY is set in your .env file');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Failed to connect to API server:', error.message);
    console.log('   Make sure the API server is running on port 5001');
    return false;
  }
}

// If running directly (not imported)
if (require.main === module) {
  checkAPIConnection().then(isConnected => {
    if (!isConnected) {
      console.log('\nTroubleshooting tips:');
      console.log('1. Make sure the API server is running: node server/api-server.js');
      console.log('2. Check that port 5001 is not being used by another application');
      console.log('3. Verify that the .env file includes the required API keys');
      console.log('4. Try using node start-all-servers.js to start both the main and API servers');
    }
  });
}

module.exports = { checkAPIConnection };