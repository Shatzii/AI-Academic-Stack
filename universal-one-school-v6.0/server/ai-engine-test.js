/**
 * Academic AI Engine Integration Test
 * 
 * This script provides a simple test of the academic AI engine integration.
 * It allows you to verify that the ShatziiOS platform can properly communicate
 * with your local academic AI engine.
 */

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Configuration
const LOCAL_AI_ENGINE_URL = process.env.LOCAL_AI_ENGINE_URL || 'http://localhost:8000';
const TEST_PROMPT = 'Explain the concept of dyslexia in simple terms suitable for a 10-year-old child.';

// Test models
const TEST_MODELS = [
  'academic-llama-7b-chat',
  'academic-mixtral-8x7b',
  'academic-llama-7b-instruct'
];

/**
 * Check if the academic AI engine is running
 */
async function checkEngineStatus() {
  console.log(`Checking academic AI engine status at ${LOCAL_AI_ENGINE_URL}...`);
  
  try {
    const response = await fetch(`${LOCAL_AI_ENGINE_URL}/api/status`);
    
    if (!response.ok) {
      throw new Error(`Status check failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ Academic AI engine is running');
    console.log(`- Status: ${data.status}`);
    console.log(`- Models loaded: ${data.models_loaded?.join(', ') || 'Unknown'}`);
    console.log(`- Uptime: ${data.uptime ? formatTime(data.uptime) : 'Unknown'}`);
    
    return true;
  } catch (error) {
    console.error(`❌ Academic AI engine check failed: ${error.message}`);
    console.error('Make sure your academic AI engine is running and properly configured.');
    return false;
  }
}

/**
 * Test generation with the academic AI engine
 */
async function testGeneration(model) {
  console.log(`\nTesting generation with model: ${model}`);
  
  try {
    const startTime = Date.now();
    const response = await fetch(`${LOCAL_AI_ENGINE_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: TEST_PROMPT }],
        model: model,
        temperature: 0.7,
        max_tokens: 500
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Generation failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    const elapsedTime = (Date.now() - startTime) / 1000;
    
    console.log(`✅ Generation successful in ${elapsedTime.toFixed(2)}s`);
    console.log(`\nPrompt: "${TEST_PROMPT}"\n`);
    console.log(`Response: "${data.generated_text}"`);
    console.log(`\nModel used: ${data.model_used || model}`);
    
    return true;
  } catch (error) {
    console.error(`❌ Generation test failed: ${error.message}`);
    return false;
  }
}

/**
 * Format seconds as hours, minutes, and seconds
 */
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  return `${hours}h ${minutes}m ${secs}s`;
}

/**
 * Save successful test results
 */
function saveTestResults(results) {
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const filePath = path.join(__dirname, `../logs/ai-engine-test-${timestamp}.json`);
  
  // Ensure logs directory exists
  const logsDir = path.join(__dirname, '../logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
  
  fs.writeFileSync(filePath, JSON.stringify(results, null, 2));
  console.log(`\nTest results saved to ${filePath}`);
}

/**
 * Main test function
 */
async function runTests() {
  console.log('=== Academic AI Engine Integration Test ===\n');
  
  // Check if the engine is running
  const isRunning = await checkEngineStatus();
  if (!isRunning) {
    return;
  }
  
  // Test each model
  const results = {
    timestamp: new Date().toISOString(),
    engine_url: LOCAL_AI_ENGINE_URL,
    tests: {}
  };
  
  let allSuccessful = true;
  
  for (const model of TEST_MODELS) {
    const success = await testGeneration(model);
    results.tests[model] = { success };
    
    if (!success) {
      allSuccessful = false;
    }
  }
  
  // Save results
  saveTestResults(results);
  
  // Summary
  console.log('\n=== Test Summary ===');
  console.log(`Academic AI engine: ${LOCAL_AI_ENGINE_URL}`);
  console.log(`Status: ${allSuccessful ? '✅ All tests passed' : '❌ Some tests failed'}`);
  
  // Instructions
  if (allSuccessful) {
    console.log('\n✨ Your academic AI engine is properly configured for ShatziiOS! ✨');
    console.log('\nTo use it with ShatziiOS:');
    console.log('1. Set USE_LOCAL_AI_ENGINE=true in your .env file');
    console.log('2. Set LOCAL_AI_ENGINE_URL in your .env file (if different from default)');
    console.log('3. Restart the ShatziiOS server');
  } else {
    console.log('\n⚠️ Please fix the issues with your academic AI engine before proceeding.');
    console.log('Refer to server/services/academic-ai-setup.md for detailed configuration instructions.');
  }
}

// Run the tests
runTests().catch(error => {
  console.error(`Test error: ${error}`);
});