/**
 * ShatziiOS Curriculum Transformer
 * 
 * This module provides the core transformation engine for adapting standard 
 * educational content into neurodivergent-friendly formats across all schools.
 */

const fs = require('fs');
const path = require('path');
const { Worker } = require('worker_threads');
const { v4: uuidv4 } = require('uuid');

// Transformation types
const TransformationTypes = {
  VISUAL: 'visual',
  PATTERN: 'pattern',
  MULTISENSORY: 'multisensory',
  EXECUTIVE: 'executive',
  SOCIAL: 'social'
};

// Neurodivergent profiles
const NeurodivergentProfiles = {
  DYSLEXIA: 'dyslexia',
  ADHD: 'adhd',
  AUTISM: 'autism',
  MIXED: 'mixed',
  GENERAL: 'general'
};

// Supported file formats
const SupportedFormats = {
  PDF: 'pdf',
  DOCX: 'docx',
  PPTX: 'pptx',
  HTML: 'html',
  TEXT: 'txt',
  MARKDOWN: 'md'
};

// Supported output formats
const OutputFormats = {
  HTML: 'html',
  PDF: 'pdf',
  INTERACTIVE: 'interactive'
};

// Transformation status
const TransformationStatus = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed'
};

// Temporary storage for transformations
const transformations = new Map();

/**
 * Start a new transformation job
 * @param {Object} options - Transformation options
 * @param {Buffer|string} options.content - Content to transform
 * @param {string} options.inputFormat - Input format of the content
 * @param {string} options.outputFormat - Desired output format
 * @param {string[]} options.transformationTypes - Types of transformations to apply
 * @param {string} options.neurodivergentProfile - Target neurodivergent profile
 * @param {Object} options.customOptions - Custom transformation options
 * @returns {string} Job ID for tracking the transformation
 */
function startTransformation(options) {
  // Validate options
  if (!options.content) {
    throw new Error('Content is required');
  }
  
  if (!Object.values(SupportedFormats).includes(options.inputFormat)) {
    throw new Error(`Unsupported input format: ${options.inputFormat}`);
  }
  
  if (!Object.values(OutputFormats).includes(options.outputFormat)) {
    throw new Error(`Unsupported output format: ${options.outputFormat}`);
  }
  
  // Create job ID
  const jobId = uuidv4();
  
  // Create transformation job
  const job = {
    id: jobId,
    status: TransformationStatus.PENDING,
    options,
    result: null,
    error: null,
    startTime: Date.now(),
    endTime: null
  };
  
  // Store job
  transformations.set(jobId, job);
  
  // Start worker thread for processing
  const worker = new Worker(path.join(__dirname, 'transformation-worker.js'), {
    workerData: {
      jobId,
      options
    }
  });
  
  // Update job status
  job.status = TransformationStatus.PROCESSING;
  
  // Handle worker messages
  worker.on('message', (message) => {
    if (message.type === 'progress') {
      // Update progress
      job.progress = message.progress;
    } else if (message.type === 'complete') {
      // Update job with result
      job.status = TransformationStatus.COMPLETED;
      job.result = message.result;
      job.endTime = Date.now();
    }
  });
  
  // Handle worker errors
  worker.on('error', (error) => {
    job.status = TransformationStatus.FAILED;
    job.error = error.message;
    job.endTime = Date.now();
  });
  
  // Handle worker exit
  worker.on('exit', (code) => {
    if (code !== 0 && job.status !== TransformationStatus.FAILED) {
      job.status = TransformationStatus.FAILED;
      job.error = `Worker stopped with exit code ${code}`;
      job.endTime = Date.now();
    }
  });
  
  return jobId;
}

/**
 * Get transformation status
 * @param {string} jobId - Transformation job ID
 * @returns {Object} Job status and details
 */
function getTransformationStatus(jobId) {
  const job = transformations.get(jobId);
  
  if (!job) {
    throw new Error(`Transformation job not found: ${jobId}`);
  }
  
  return {
    id: job.id,
    status: job.status,
    progress: job.progress,
    startTime: job.startTime,
    endTime: job.endTime,
    error: job.error
  };
}

/**
 * Get transformation result
 * @param {string} jobId - Transformation job ID
 * @returns {Object} Transformation result
 */
function getTransformationResult(jobId) {
  const job = transformations.get(jobId);
  
  if (!job) {
    throw new Error(`Transformation job not found: ${jobId}`);
  }
  
  if (job.status !== TransformationStatus.COMPLETED) {
    throw new Error(`Transformation is not complete: ${jobId}`);
  }
  
  return job.result;
}

/**
 * Cancel transformation job
 * @param {string} jobId - Transformation job ID
 * @returns {boolean} Whether the job was successfully canceled
 */
function cancelTransformation(jobId) {
  const job = transformations.get(jobId);
  
  if (!job) {
    throw new Error(`Transformation job not found: ${jobId}`);
  }
  
  if (job.status === TransformationStatus.COMPLETED || job.status === TransformationStatus.FAILED) {
    return false;
  }
  
  job.status = TransformationStatus.FAILED;
  job.error = 'Canceled by user';
  job.endTime = Date.now();
  
  return true;
}

/**
 * Transform content synchronously (for small content only)
 * @param {Object} options - Transformation options
 * @returns {Object} Transformed content
 */
function transformSync(options) {
  // Only allow synchronous transformation for small content
  const contentSize = typeof options.content === 'string' 
    ? Buffer.byteLength(options.content, 'utf8') 
    : options.content.length;
  
  if (contentSize > 1024 * 50) { // 50 KB limit
    throw new Error('Content too large for synchronous transformation');
  }
  
  // Perform transformation
  return require('./transformers/transformer-utils').transform(options);
}

// Export transformation functions
module.exports = {
  startTransformation,
  getTransformationStatus,
  getTransformationResult,
  cancelTransformation,
  transformSync,
  TransformationTypes,
  NeurodivergentProfiles,
  SupportedFormats,
  OutputFormats,
  TransformationStatus
};