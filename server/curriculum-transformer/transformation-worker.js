/**
 * Curriculum Transformation Worker
 * 
 * This worker thread handles the actual content transformation process
 * to avoid blocking the main thread during intensive processing.
 */

const { parentPort, workerData } = require('worker_threads');
const transformerUtils = require('./transformers/transformer-utils');

// Retrieve job information from workerData
const { jobId, options } = workerData;

// Main transformation process
async function runTransformation() {
  try {
    // Report progress periodically
    let progress = 0;
    
    // Report initial progress
    reportProgress(progress);
    
    // Parse content
    const parsedContent = transformerUtils.parseContent(options.content, options.inputFormat);
    progress = 20;
    reportProgress(progress);
    
    // Apply transformations based on transformation types
    let transformedContent = parsedContent;
    const transformSteps = options.transformationTypes.length;
    
    // Apply each transformation type
    for (let i = 0; i < options.transformationTypes.length; i++) {
      const transformationType = options.transformationTypes[i];
      
      switch (transformationType) {
        case 'visual':
          transformedContent = transformerUtils.applyVisualTransformation(
            transformedContent, 
            options.neurodivergentProfile, 
            options.customOptions
          );
          break;
        case 'pattern':
          transformedContent = transformerUtils.applyPatternTransformation(
            transformedContent,
            options.neurodivergentProfile,
            options.customOptions
          );
          break;
        case 'multisensory':
          transformedContent = transformerUtils.applyMultisensoryTransformation(
            transformedContent,
            options.neurodivergentProfile,
            options.customOptions
          );
          break;
        case 'executive':
          transformedContent = transformerUtils.applyExecutiveTransformation(
            transformedContent,
            options.neurodivergentProfile,
            options.customOptions
          );
          break;
        case 'social':
          transformedContent = transformerUtils.applySocialTransformation(
            transformedContent,
            options.neurodivergentProfile,
            options.customOptions
          );
          break;
      }
      
      // Update progress after each transformation
      progress = 20 + Math.floor(60 * ((i + 1) / transformSteps));
      reportProgress(progress);
    }
    
    // Format output
    const result = transformerUtils.formatOutput(
      transformedContent,
      options.outputFormat,
      options.customOptions
    );
    
    // Report completion progress
    progress = 100;
    reportProgress(progress);
    
    // Return final result
    parentPort.postMessage({
      type: 'complete',
      result
    });
  } catch (error) {
    // Report error
    parentPort.postMessage({
      type: 'error',
      error: error.message
    });
  }
}

/**
 * Report progress to parent thread
 * @param {number} progress - Progress percentage (0-100)
 */
function reportProgress(progress) {
  parentPort.postMessage({
    type: 'progress',
    progress
  });
}

// Start transformation process
runTransformation();