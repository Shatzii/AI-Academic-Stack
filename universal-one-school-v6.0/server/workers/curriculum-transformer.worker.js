/**
 * Curriculum Transformer Worker
 * 
 * This worker thread handles the CPU-intensive task of transforming standard
 * curriculum content for different neurodivergent learning styles.
 */
const { parentPort, workerData } = require('worker_threads');

// Types of neurodivergent learning profiles supported
const SUPPORTED_TYPES = ['dyslexia', 'adhd', 'autism_spectrum', 'combined', 'other'];

// Types of adaptations provided
const ADAPTATION_TYPES = {
  TEXT_SIMPLIFICATION: 'text_simplification',
  VISUAL_SUPPORTS: 'visual_supports',
  CHUNKING: 'chunking',
  EMPHASIS: 'emphasis',
  EXECUTIVE_FUNCTION: 'executive_function',
  SENSORY: 'sensory',
  SEQUENCING: 'sequencing'
};

/**
 * Transform curriculum content for a specific neurodivergent profile
 * @param {Object} data - Input data containing content and transformation parameters
 * @param {string} data.content - Original curriculum content to transform
 * @param {string} data.learningDifference - Type of neurodivergent learning difference
 * @param {string} data.gradeLevel - Target grade level (K-12)
 * @param {Object} data.userProfile - Optional detailed user profile for personalization
 * @returns {Object} Transformed content with adaptations
 */
function transformCurriculum(data) {
  const { content, learningDifference, gradeLevel, userProfile } = data;
  
  // Validate input
  if (!content || !learningDifference || !gradeLevel) {
    return {
      error: 'Missing required parameters',
      originalContent: content
    };
  }
  
  // Check if learning difference is supported
  if (!SUPPORTED_TYPES.includes(learningDifference)) {
    return {
      error: `Unsupported learning difference: ${learningDifference}`,
      originalContent: content,
      supportedTypes: SUPPORTED_TYPES
    };
  }
  
  // Extract content information
  const contentInfo = analyzeContent(content);
  
  // Apply transformations based on the learning difference
  let transformedContent = content;
  const adaptations = [];
  
  // Apply adaptations based on learning difference
  switch (learningDifference) {
    case 'dyslexia':
      transformedContent = applyDyslexiaAdaptations(content, gradeLevel, userProfile);
      adaptations.push(
        { type: ADAPTATION_TYPES.TEXT_SIMPLIFICATION, applied: true },
        { type: ADAPTATION_TYPES.VISUAL_SUPPORTS, applied: true },
        { type: ADAPTATION_TYPES.CHUNKING, applied: true }
      );
      break;
    
    case 'adhd':
      transformedContent = applyADHDAdaptations(content, gradeLevel, userProfile);
      adaptations.push(
        { type: ADAPTATION_TYPES.CHUNKING, applied: true },
        { type: ADAPTATION_TYPES.EMPHASIS, applied: true },
        { type: ADAPTATION_TYPES.EXECUTIVE_FUNCTION, applied: true }
      );
      break;
    
    case 'autism_spectrum':
      transformedContent = applyAutismSpectrumAdaptations(content, gradeLevel, userProfile);
      adaptations.push(
        { type: ADAPTATION_TYPES.VISUAL_SUPPORTS, applied: true },
        { type: ADAPTATION_TYPES.SENSORY, applied: true },
        { type: ADAPTATION_TYPES.SEQUENCING, applied: true }
      );
      break;
    
    case 'combined':
      transformedContent = applyCombinedAdaptations(content, gradeLevel, userProfile);
      adaptations.push(
        { type: ADAPTATION_TYPES.TEXT_SIMPLIFICATION, applied: true },
        { type: ADAPTATION_TYPES.VISUAL_SUPPORTS, applied: true },
        { type: ADAPTATION_TYPES.CHUNKING, applied: true },
        { type: ADAPTATION_TYPES.EMPHASIS, applied: true },
        { type: ADAPTATION_TYPES.EXECUTIVE_FUNCTION, applied: true }
      );
      break;
    
    default:
      // Apply general adaptations
      transformedContent = applyGeneralAdaptations(content, gradeLevel);
      adaptations.push(
        { type: ADAPTATION_TYPES.TEXT_SIMPLIFICATION, applied: true },
        { type: ADAPTATION_TYPES.CHUNKING, applied: true }
      );
  }
  
  // Create result object
  const result = {
    title: contentInfo.title || 'Transformed Curriculum',
    original: content,
    transformed: transformedContent,
    adaptations: adaptations,
    learningDifference: learningDifference,
    gradeLevel: gradeLevel,
    metadata: {
      wordCount: contentInfo.wordCount,
      readingLevel: contentInfo.readingLevel,
      complexityScore: contentInfo.complexityScore,
      transformationDate: new Date().toISOString()
    }
  };
  
  return result;
}

/**
 * Extract basic information from content
 * @param {string} content - Content to analyze
 * @returns {Object} Basic content information
 */
function analyzeContent(content) {
  // Extract title (first line or first heading)
  const lines = content.split('\n');
  let title = lines[0];
  
  // If the first line has markdown heading markers, clean them
  title = title.replace(/^#+\s+/, '');
  
  // Calculate word count
  const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
  
  // Simple readability assessment
  // Longer words and sentences increase complexity
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgSentenceLength = sentences.length > 0 ? wordCount / sentences.length : 0;
  
  // Count long words (>6 chars)
  const longWords = content.split(/\s+/).filter(word => word.length > 6).length;
  const longWordRatio = longWords / wordCount;
  
  // Simple complexity score (1-10)
  const complexityScore = Math.min(10, Math.round((avgSentenceLength * 0.5 + longWordRatio * 10) * 1.5));
  
  // Map complexity to grade-based reading level
  let readingLevel;
  if (complexityScore <= 3) readingLevel = 'K-2';
  else if (complexityScore <= 5) readingLevel = '3-5';
  else if (complexityScore <= 7) readingLevel = '6-8';
  else readingLevel = '9-12';
  
  return {
    title,
    wordCount,
    sentenceCount: sentences.length,
    avgSentenceLength,
    complexityScore,
    readingLevel
  };
}

/**
 * Apply adaptations optimized for dyslexia
 */
function applyDyslexiaAdaptations(content, gradeLevel, userProfile = {}) {
  // In a real implementation, this would apply specific transformations
  // based on evidence-based strategies for dyslexia
  
  // Simulated transformation for demonstration
  let transformed = content;
  
  // 1. Break text into smaller paragraphs
  transformed = transformed.replace(/([.!?])\s+/g, '$1\n\n');
  
  // 2. Highlight key terms (simulated with markdown **bold**)
  const keyTerms = extractKeyTerms(content);
  keyTerms.forEach(term => {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    transformed = transformed.replace(regex, `**${term}**`);
  });
  
  // 3. Add subheadings to break up content
  if (transformed.length > 500) {
    const sections = splitIntoSections(transformed);
    transformed = sections.join('\n\n### Key Point\n\n');
  }
  
  return transformed;
}

/**
 * Apply adaptations optimized for ADHD
 */
function applyADHDAdaptations(content, gradeLevel, userProfile = {}) {
  // In a real implementation, this would apply specific transformations
  // based on evidence-based strategies for ADHD
  
  // Simulated transformation for demonstration
  let transformed = content;
  
  // 1. Add clear structure with numbered steps
  const paragraphs = transformed.split('\n\n');
  if (paragraphs.length > 2) {
    transformed = paragraphs.map((para, i) => {
      if (i === 0) return para; // Skip introduction
      return `${i}. ${para.trim()}`;
    }).join('\n\n');
  }
  
  // 2. Add visual breaks and emphasis
  transformed = transformed.replace(/([.!?])\s+/g, '$1\n\n');
  
  // 3. Add executive function supports
  transformed = `## Learning Goal\nAfter completing this section, you will be able to understand the main concepts.\n\n## Time Required\nAbout ${Math.ceil(content.length / 500)} minutes\n\n${transformed}\n\n## Check Your Understanding\n- What was the main idea?\n- How does this connect to what you already know?`;
  
  return transformed;
}

/**
 * Apply adaptations optimized for autism spectrum
 */
function applyAutismSpectrumAdaptations(content, gradeLevel, userProfile = {}) {
  // In a real implementation, this would apply specific transformations
  // based on evidence-based strategies for autism spectrum
  
  // Simulated transformation for demonstration
  let transformed = content;
  
  // 1. Add clear concrete language
  transformed = transformed.replace(/may|might|could possibly|perhaps/gi, 'will');
  
  // 2. Add visual structure
  transformed = `## Visual Schedule\n1. Read the content\n2. Look at any images\n3. Answer questions\n\n${transformed}`;
  
  // 3. Add explicit instructions
  transformed += '\n\n## What to do next\nWhen you finish reading, click the "Complete" button at the bottom of the page.';
  
  return transformed;
}

/**
 * Apply combined adaptations for multiple learning differences
 */
function applyCombinedAdaptations(content, gradeLevel, userProfile = {}) {
  // Apply multiple adaptation strategies
  
  // First break content into more manageable chunks (ADHD + dyslexia)
  let transformed = content.replace(/([.!?])\s+/g, '$1\n\n');
  
  // Add clear structure with visuals (autism + ADHD)
  transformed = `## Visual Outline\n- Main idea\n- Supporting details\n- Conclusion\n\n${transformed}`;
  
  // Add executive function supports (ADHD)
  transformed += '\n\n## Remember to:\n- Take breaks as needed\n- Highlight important information\n- Ask questions if something is unclear';
  
  return transformed;
}

/**
 * Apply general adaptations suitable for most learners
 */
function applyGeneralAdaptations(content, gradeLevel) {
  // Apply basic adaptations suitable for most learners
  let transformed = content;
  
  // Add structure
  transformed = `## Main Points\n\n${transformed}\n\n## Summary\nReview the key ideas from this section.`;
  
  return transformed;
}

/**
 * Extract potential key terms from content
 */
function extractKeyTerms(content) {
  // In a real implementation, this would use NLP techniques
  // For this demo, we'll just find capitalized words that aren't at sentence start
  const words = content.split(/\s+/);
  const capitalizedWords = words.filter(word => 
    word.length > 4 && 
    word[0] === word[0].toUpperCase() && 
    word[0] !== word[0].toLowerCase()
  );
  
  // Remove duplicates
  return [...new Set(capitalizedWords)].slice(0, 5);
}

/**
 * Split content into logical sections
 */
function splitIntoSections(content) {
  // For demo purposes, just split by paragraphs
  return content.split('\n\n');
}

// Listen for messages from the main thread
parentPort.on('message', message => {
  try {
    const result = transformCurriculum(message);
    parentPort.postMessage({ success: true, data: result });
  } catch (error) {
    parentPort.postMessage({ success: false, error: error.message });
  }
});

// If initialized with workerData, process it immediately
if (workerData) {
  try {
    const result = transformCurriculum(workerData);
    parentPort.postMessage({ success: true, data: result });
  } catch (error) {
    parentPort.postMessage({ success: false, error: error.message });
  }
}