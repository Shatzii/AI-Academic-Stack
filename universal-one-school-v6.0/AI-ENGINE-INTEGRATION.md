# ShatziiOS Academic AI Engine Integration Guide

This guide explains how to replace the external AI APIs (OpenAI, Anthropic, and Perplexity) with your local academic AI engine in the ShatziiOS platform.

## Overview

The ShatziiOS platform has been designed with a modular AI service architecture that makes it straightforward to swap out external API services with your local academic AI engine. This guide covers the necessary modifications.

## Integration Steps

### 1. Configure Environment Variables

Add the following to your `.env` file:

```
LOCAL_AI_ENGINE_URL=http://localhost:8000
USE_LOCAL_AI_ENGINE=true
```

Adjust the URL to match your academic AI engine's address.

### 2. Modify AI Service (`server/services/ai-service.ts`)

The main AI service file needs to be modified to use your academic AI engine. Here's how to update it:

1. Import the academic AI adapter at the top of the file:
   ```typescript
   import academicAI, { AcademicAIAdapter } from './academic-ai-adapter';
   ```

2. Add a conditional import for the external APIs:
   ```typescript
   // Only import these if using external APIs
   let anthropic, openai;
   if (process.env.USE_LOCAL_AI_ENGINE !== 'true') {
     import Anthropic from '@anthropic-ai/sdk';
     import { OpenAI } from 'openai';
     
     // Initialize AI clients
     anthropic = new Anthropic({
       apiKey: process.env.ANTHROPIC_API_KEY || '',
     });
     
     openai = new OpenAI({
       apiKey: process.env.OPENAI_API_KEY || '',
     });
   }
   ```

3. Modify the `getAIResponse` function to use the academic AI engine:
   ```typescript
   export async function getAIResponse(messages: AIMessageContent[], model: AIModel = DEFAULT_AI_MODEL): Promise<string> {
     try {
       if (process.env.USE_LOCAL_AI_ENGINE === 'true') {
         // Use academic AI engine
         const prompt = messages.map(m => m.content).join('\n');
         let response;
         
         if (model.provider === 'anthropic') {
           response = await academicAI.getAnthropicCompletion(prompt, model.model);
           return response.content[0].text;
         } else {
           response = await academicAI.getOpenAICompletion(prompt, model.model);
           return response.choices[0].message.content;
         }
       } else {
         // Use external APIs
         if (model.provider === 'anthropic') {
           // Original Anthropic code...
         } else {
           // Original OpenAI code...
         }
       }
     } catch (error) {
       console.error('AI response error:', error);
       throw new Error(`Failed to get AI response: ${error.message}`);
     }
   }
   ```

4. Update the `checkAIConnections` function:
   ```typescript
   export async function checkAIConnections(): Promise<{
     anthropic: boolean;
     openai: boolean;
     message: string;
   }> {
     const results = {
       anthropic: false,
       openai: false,
       message: ''
     };
     
     if (process.env.USE_LOCAL_AI_ENGINE === 'true') {
       // Check academic AI engine
       try {
         const isRunning = await academicAI.checkStatus();
         
         if (isRunning) {
           results.anthropic = true;
           results.openai = true;
           results.message = "Academic AI engine is running and operational.";
         } else {
           results.message = "Academic AI engine is not responding.";
         }
       } catch (error) {
         results.message = `Academic AI engine error: ${error.message}`;
       }
     } else {
       // Original code for checking external APIs...
     }
     
     return results;
   }
   ```

### 3. Update Perplexity Service (`services/perplexity-service.js`)

The Perplexity service needs similar modifications:

1. At the beginning of the file, add:
   ```javascript
   // Import academic AI adapter if using local engine
   let academicAI;
   if (process.env.USE_LOCAL_AI_ENGINE === 'true') {
     academicAI = require('../server/services/academic-ai-adapter').default;
   }
   ```

2. In the `makeRequest` method of the `PerplexityService` class, modify:
   ```javascript
   async makeRequest(endpoint, data) {
     if (process.env.USE_LOCAL_AI_ENGINE === 'true') {
       try {
         const result = await academicAI.getPerplexityCompletion(
           data.messages[0].content,
           data.model
         );
         return result;
       } catch (error) {
         throw new Error(`Academic AI request failed: ${error.message}`);
       }
     } else {
       // Original code for Perplexity API...
     }
   }
   ```

### 4. Update Anthropic Service (`server/services/anthropic-service.js`)

Follow a similar pattern for the Anthropic service:

1. Import and conditionally use the academic AI adapter
2. Modify methods to use the adapter when `USE_LOCAL_AI_ENGINE` is true

## Testing the Integration

To test if your academic AI engine is properly integrated:

1. Make sure your academic AI engine is running at the configured URL
2. Start the ShatziiOS server with `USE_LOCAL_AI_ENGINE=true` 
3. Navigate to the AI status page at `/api/ai/status`
4. Try generating content using the curriculum transformer or language school features

## Troubleshooting

- **Adapter Issues**: If you encounter format mismatches, adjust the formatters in `academic-ai-adapter.ts`
- **Connection Problems**: Verify your academic AI engine is running and accepting requests
- **Response Format**: Ensure your engine returns JSON responses in a compatible format

## Advanced Configuration

For more precise control, you can implement model-specific routing in the adapter to use different local models for different tasks.