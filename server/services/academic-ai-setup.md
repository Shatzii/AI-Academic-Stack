# Academic AI Engine Setup for ShatziiOS

This document provides detailed setup instructions for configuring your academic AI engine to work with ShatziiOS.

## Required API Endpoints

Your academic AI engine should expose the following API endpoints to be compatible with ShatziiOS:

### 1. `/api/generate` (POST)

This is the main text generation endpoint that will handle all AI requests.

**Request Format:**
```json
{
  "messages": [
    {"role": "system", "content": "Optional system instruction"},
    {"role": "user", "content": "The user prompt goes here"}
  ],
  "model": "academic-llama-7b-chat",
  "temperature": 0.7,
  "max_tokens": 1000,
  "response_format": {"type": "json_object"}
}
```

**Expected Response Format:**
```json
{
  "generated_text": "The AI-generated response text",
  "model_used": "academic-llama-7b-chat",
  "processing_time": 1.2
}
```

### 2. `/api/status` (GET)

A simple endpoint to check if the AI engine is running.

**Expected Response Format:**
```json
{
  "status": "ok",
  "models_loaded": ["academic-llama-7b-chat", "academic-mixtral-8x7b"],
  "uptime": 3600
}
```

## Model Mapping

ShatziiOS is configured to map external API models to your academic models as follows:

| External API Model | Academic Model |
|-------------------|---------------|
| claude-3-7-sonnet-20250219 | academic-llama-7b-chat |
| claude-3-7-opus-20250219 | academic-llama-13b-chat |
| gpt-4o | academic-mixtral-8x7b |
| gpt-4o-mini | academic-llama-7b-instruct |
| llama-3-sonar-small-32k-online | academic-llama-7b-chat |

You can customize these mappings in `server/services/ai-configuration.js`.

## Server-Side Processing

Your academic AI engine should handle:

1. **Text Generation**: Processing prompts and generating responses
2. **JSON Formatting**: Properly formatting responses as JSON when requested
3. **Error Handling**: Providing clear error messages when issues occur

## System Requirements

For optimal performance with the ShatziiOS platform, your academic AI engine should:

1. **Response Time**: Aim for <2 second response times for typical requests
2. **Concurrent Requests**: Handle up to 10 concurrent requests
3. **Memory Management**: Automatically unload unused models to conserve memory

## Example Express Implementation

Here's a minimal example of how you might implement the API endpoints with Express:

```javascript
const express = require('express');
const app = express();
app.use(express.json());

// Load your local AI models
const models = {
  'academic-llama-7b-chat': loadModel('llama-7b-chat'),
  'academic-mixtral-8x7b': loadModel('mixtral-8x7b')
};

// Generate endpoint
app.post('/api/generate', async (req, res) => {
  try {
    const { messages, model, temperature, max_tokens } = req.body;
    
    // Get the requested model or default
    const modelName = model || 'academic-llama-7b-chat';
    const aiModel = models[modelName];
    
    if (!aiModel) {
      return res.status(400).json({
        error: `Model ${modelName} not available`
      });
    }
    
    // Process the input and generate a response
    const startTime = Date.now();
    const prompt = formatPrompt(messages);
    const output = await aiModel.generate(prompt, {
      temperature: temperature || 0.7,
      max_tokens: max_tokens || 1000
    });
    
    // Send the response
    res.json({
      generated_text: output,
      model_used: modelName,
      processing_time: (Date.now() - startTime) / 1000
    });
  } catch (error) {
    res.status(500).json({
      error: `Generation failed: ${error.message}`
    });
  }
});

// Status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    models_loaded: Object.keys(models),
    uptime: process.uptime()
  });
});

// Start the server
app.listen(8000, () => {
  console.log('Academic AI engine running on port 8000');
});
```

## Environment Variables

Add these to your academic AI engine's environment:

```
PORT=8000
MODELS_DIR=/path/to/your/models
MAX_CONCURRENT_REQUESTS=10
DEFAULT_MODEL=academic-llama-7b-chat
```

## Testing Your Implementation

After setting up your academic AI engine, you can test it with:

```bash
curl -X POST http://localhost:8000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Hello, world!"}],
    "model": "academic-llama-7b-chat"
  }'
```

You should receive a properly formatted response if everything is working correctly.