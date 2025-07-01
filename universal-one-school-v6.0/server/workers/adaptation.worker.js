/**
 * Adaptation Worker
 * 
 * This worker thread handles CPU-intensive content adaptation operations 
 * for different neurodivergent learning profiles.
 */
const { parentPort } = require('worker_threads');

// Types of adaptations
const ADAPTATION_TYPES = {
  CONTENT: 'content',
  PRESENTATION: 'presentation',
  PACING: 'pacing',
  SUPPORT: 'support'
};

/**
 * Process content adaptation requests
 * @param {Object} data - Message data from main thread
 */
function processAdaptationRequest(data) {
  try {
    if (data.type === 'adapt_content') {
      const adaptedContent = adaptContent(data.content, data.userProfile);
      
      // Send the result back to the main thread
      parentPort.postMessage({
        type: 'adaptation_complete',
        id: data.id,
        success: true,
        data: adaptedContent
      });
    } else {
      throw new Error(`Unknown adaptation request type: ${data.type}`);
    }
  } catch (error) {
    parentPort.postMessage({
      type: 'adaptation_error',
      id: data.id,
      success: false,
      error: error.message
    });
  }
}

/**
 * Adapt content based on user profile
 * @param {Object} content - Original content to adapt
 * @param {Object} userProfile - User learning profile
 * @returns {Object} Adapted content
 */
function adaptContent(content, userProfile) {
  // Deep clone the content object
  const adaptedContent = JSON.parse(JSON.stringify(content));
  
  // Neurodivergent type is the most important factor
  const neurodivergentType = userProfile.neurodivergentType || 'other';
  
  // Track adaptations applied
  const adaptationsApplied = [];
  
  // Apply base adaptations for this neurodivergent type
  applyBaseAdaptations(adaptedContent, neurodivergentType, adaptationsApplied);
  
  // Apply custom adaptations based on specific user characteristics
  applyCustomAdaptations(adaptedContent, userProfile, adaptationsApplied);
  
  // Apply learning preferences
  applyPreferences(adaptedContent, userProfile.preferences || {}, adaptationsApplied);
  
  // Record adaptations in the result
  adaptedContent.adaptations = {
    applied: adaptationsApplied,
    timestamp: new Date().toISOString(),
    profileVersion: userProfile.version || '1.0',
    neurodivergentType
  };
  
  return adaptedContent;
}

/**
 * Apply base adaptations for neurodivergent type
 * @param {Object} content - Content to adapt
 * @param {string} neurodivergentType - Neurodivergent type
 * @param {Array} adaptationsApplied - Track adaptations applied
 */
function applyBaseAdaptations(content, neurodivergentType, adaptationsApplied) {
  // Apply different adaptations based on neurodivergent type
  switch (neurodivergentType) {
    case 'dyslexia':
      applyDyslexiaAdaptations(content, adaptationsApplied);
      break;
      
    case 'adhd':
      applyADHDAdaptations(content, adaptationsApplied);
      break;
      
    case 'autism_spectrum':
      applyAutismSpectrumAdaptations(content, adaptationsApplied);
      break;
      
    case 'combined':
      // For combined, apply a mix of adaptations
      applyDyslexiaAdaptations(content, adaptationsApplied);
      applyADHDAdaptations(content, adaptationsApplied);
      applyAutismSpectrumAdaptations(content, adaptationsApplied);
      break;
      
    default:
      // For 'other' or unknown types, apply minimal adaptations
      applyGeneralAdaptations(content, adaptationsApplied);
  }
}

/**
 * Apply dyslexia-specific adaptations
 * @param {Object} content - Content to adapt
 * @param {Array} adaptationsApplied - Track adaptations applied
 */
function applyDyslexiaAdaptations(content, adaptationsApplied) {
  // Apply text simplification
  if (content.text) {
    content.text = simplifyText(content.text);
    adaptationsApplied.push({ type: ADAPTATION_TYPES.CONTENT, name: 'text_simplification' });
  }
  
  // Apply reading supports
  if (!content.supportTools) content.supportTools = [];
  content.supportTools.push(
    { type: 'text_to_speech', enabled: true },
    { type: 'reading_ruler', enabled: true },
    { type: 'syllable_highlighting', enabled: true }
  );
  adaptationsApplied.push({ type: ADAPTATION_TYPES.SUPPORT, name: 'reading_supports' });
  
  // Apply visual presentation adaptations
  content.presentationSettings = {
    ...(content.presentationSettings || {}),
    fontFamily: 'OpenDyslexic, Comic Sans MS, sans-serif',
    fontSize: 'large',
    lineSpacing: 1.5,
    letterSpacing: 0.12,
    paragraphSpacing: 2.0,
    textAlignment: 'left',
    colorBackground: '#FFFDF0',
    colorText: '#333333'
  };
  adaptationsApplied.push({ type: ADAPTATION_TYPES.PRESENTATION, name: 'dyslexia_typography' });
  
  // Apply pacing adaptations
  content.pacingSettings = {
    ...(content.pacingSettings || {}),
    extendedTime: true,
    allowRepeatedReading: true,
    chunkedContent: true
  };
  adaptationsApplied.push({ type: ADAPTATION_TYPES.PACING, name: 'extended_time' });
}

/**
 * Apply ADHD-specific adaptations
 * @param {Object} content - Content to adapt
 * @param {Array} adaptationsApplied - Track adaptations applied
 */
function applyADHDAdaptations(content, adaptationsApplied) {
  // Restructure content
  if (content.sections) {
    content.sections = restructureForADHD(content.sections);
    adaptationsApplied.push({ type: ADAPTATION_TYPES.CONTENT, name: 'adhd_content_structure' });
  }
  
  // Add focus tools
  if (!content.supportTools) content.supportTools = [];
  content.supportTools.push(
    { type: 'focus_mode', enabled: true },
    { type: 'progress_tracker', enabled: true },
    { type: 'break_timer', enabled: true }
  );
  adaptationsApplied.push({ type: ADAPTATION_TYPES.SUPPORT, name: 'focus_tools' });
  
  // Apply visual presentation adaptations
  content.presentationSettings = {
    ...(content.presentationSettings || {}),
    reduceVisualClutter: true,
    highlightCurrentSection: true,
    animationReduced: true,
    colorBackground: '#FFFFFF',
    colorText: '#333333',
    colorAccent: '#4CAF50'
  };
  adaptationsApplied.push({ type: ADAPTATION_TYPES.PRESENTATION, name: 'reduced_distraction' });
  
  // Apply pacing adaptations
  content.pacingSettings = {
    ...(content.pacingSettings || {}),
    shortSessions: true,
    frequentBreaks: true,
    gamifiedProgress: true
  };
  adaptationsApplied.push({ type: ADAPTATION_TYPES.PACING, name: 'adhd_pacing' });
}

/**
 * Apply autism spectrum-specific adaptations
 * @param {Object} content - Content to adapt
 * @param {Array} adaptationsApplied - Track adaptations applied
 */
function applyAutismSpectrumAdaptations(content, adaptationsApplied) {
  // Apply explicit instructions
  if (content.instructions) {
    content.instructions = makeExplicitInstructions(content.instructions);
    adaptationsApplied.push({ type: ADAPTATION_TYPES.CONTENT, name: 'explicit_instructions' });
  }
  
  // Add structure and predictability
  if (content.sections) {
    content.predictableStructure = true;
    content.visualSchedule = generateVisualSchedule(content.sections);
    adaptationsApplied.push({ type: ADAPTATION_TYPES.CONTENT, name: 'predictable_structure' });
  }
  
  // Add support tools
  if (!content.supportTools) content.supportTools = [];
  content.supportTools.push(
    { type: 'visual_schedule', enabled: true },
    { type: 'sensory_settings', enabled: true },
    { type: 'concrete_examples', enabled: true }
  );
  adaptationsApplied.push({ type: ADAPTATION_TYPES.SUPPORT, name: 'autism_supports' });
  
  // Apply visual presentation adaptations
  content.presentationSettings = {
    ...(content.presentationSettings || {}),
    reduceSensoryOverload: true,
    consistentLayout: true,
    literalLanguage: true,
    colorBackground: '#F5F5F5',
    colorText: '#333333',
    highPredictability: true
  };
  adaptationsApplied.push({ type: ADAPTATION_TYPES.PRESENTATION, name: 'sensory_considerate' });
  
  // Apply pacing adaptations
  content.pacingSettings = {
    ...(content.pacingSettings || {}),
    selfPaced: true,
    transitionAlerts: true,
    routineConsistency: true
  };
  adaptationsApplied.push({ type: ADAPTATION_TYPES.PACING, name: 'predictable_pacing' });
}

/**
 * Apply general adaptations for general accessibility
 * @param {Object} content - Content to adapt
 * @param {Array} adaptationsApplied - Track adaptations applied
 */
function applyGeneralAdaptations(content, adaptationsApplied) {
  // Basic content structure
  if (content.text && content.text.length > 1000) {
    content.text = addSummaryPoints(content.text);
    adaptationsApplied.push({ type: ADAPTATION_TYPES.CONTENT, name: 'summary_points' });
  }
  
  // Add basic support tools
  if (!content.supportTools) content.supportTools = [];
  content.supportTools.push(
    { type: 'definitions', enabled: true },
    { type: 'progress_tracking', enabled: true }
  );
  adaptationsApplied.push({ type: ADAPTATION_TYPES.SUPPORT, name: 'basic_supports' });
  
  // Apply standard presentation settings
  content.presentationSettings = {
    ...(content.presentationSettings || {}),
    fontFamily: 'sans-serif',
    fontSize: 'medium',
    lineSpacing: 1.2,
    cleanLayout: true
  };
  adaptationsApplied.push({ type: ADAPTATION_TYPES.PRESENTATION, name: 'clean_presentation' });
}

/**
 * Apply custom adaptations based on user characteristics
 * @param {Object} content - Content to adapt
 * @param {Object} userProfile - User profile
 * @param {Array} adaptationsApplied - Track adaptations applied
 */
function applyCustomAdaptations(content, userProfile, adaptationsApplied) {
  // Apply adaptations based on specific challenges
  if (userProfile.challenges) {
    if (userProfile.challenges.includes('reading_comprehension')) {
      enhanceReadingComprehension(content);
      adaptationsApplied.push({ type: ADAPTATION_TYPES.CONTENT, name: 'comprehension_supports' });
    }
    
    if (userProfile.challenges.includes('working_memory')) {
      enhanceMemorySupports(content);
      adaptationsApplied.push({ type: ADAPTATION_TYPES.SUPPORT, name: 'memory_supports' });
    }
    
    if (userProfile.challenges.includes('anxiety')) {
      addAnxietySupports(content);
      adaptationsApplied.push({ type: ADAPTATION_TYPES.SUPPORT, name: 'anxiety_supports' });
    }
  }
  
  // Apply adaptations based on strengths
  if (userProfile.strengths) {
    if (userProfile.strengths.includes('visual_processing')) {
      enhanceVisualElements(content);
      adaptationsApplied.push({ type: ADAPTATION_TYPES.PRESENTATION, name: 'visual_enhancement' });
    }
    
    if (userProfile.strengths.includes('auditory_processing')) {
      enhanceAuditoryElements(content);
      adaptationsApplied.push({ type: ADAPTATION_TYPES.CONTENT, name: 'auditory_enhancement' });
    }
  }
  
  // Apply adaptations based on learning speed
  if (userProfile.learningSpeed) {
    if (userProfile.learningSpeed === 'accelerated') {
      addExtensionContent(content);
      adaptationsApplied.push({ type: ADAPTATION_TYPES.CONTENT, name: 'extension_content' });
    } else if (userProfile.learningSpeed === 'gradual') {
      addScaffoldingSupport(content);
      adaptationsApplied.push({ type: ADAPTATION_TYPES.SUPPORT, name: 'additional_scaffolding' });
    }
  }
}

/**
 * Apply user preferences to content
 * @param {Object} content - Content to adapt
 * @param {Object} preferences - User preferences
 * @param {Array} adaptationsApplied - Track adaptations applied
 */
function applyPreferences(content, preferences, adaptationsApplied) {
  // Apply visual preferences
  if (preferences.theme) {
    content.presentationSettings = {
      ...(content.presentationSettings || {}),
      theme: preferences.theme
    };
    adaptationsApplied.push({ type: ADAPTATION_TYPES.PRESENTATION, name: 'preferred_theme' });
  }
  
  if (preferences.fontSize) {
    content.presentationSettings = {
      ...(content.presentationSettings || {}),
      fontSize: preferences.fontSize
    };
    adaptationsApplied.push({ type: ADAPTATION_TYPES.PRESENTATION, name: 'preferred_font_size' });
  }
  
  if (preferences.highContrast) {
    content.presentationSettings = {
      ...(content.presentationSettings || {}),
      highContrast: true,
      colorBackground: preferences.darkMode ? '#000000' : '#FFFFFF',
      colorText: preferences.darkMode ? '#FFFFFF' : '#000000'
    };
    adaptationsApplied.push({ type: ADAPTATION_TYPES.PRESENTATION, name: 'high_contrast' });
  }
  
  // Apply support preferences
  if (preferences.textToSpeech) {
    if (!content.supportTools) content.supportTools = [];
    if (!content.supportTools.find(tool => tool.type === 'text_to_speech')) {
      content.supportTools.push({ type: 'text_to_speech', enabled: true });
      adaptationsApplied.push({ type: ADAPTATION_TYPES.SUPPORT, name: 'text_to_speech' });
    }
  }
  
  if (preferences.contentFormat) {
    content.preferredFormat = preferences.contentFormat;
    adaptationsApplied.push({ type: ADAPTATION_TYPES.CONTENT, name: 'preferred_format' });
  }
}

/**
 * Simplify text for better readability
 * @param {string} text - Original text
 * @returns {string} Simplified text
 */
function simplifyText(text) {
  if (!text) return '';
  
  // In a real implementation, this would use NLP techniques
  // For this example, we'll perform simple transformations
  
  // Add paragraph breaks for readability
  let simplified = text.replace(/(\. )(?=[A-Z])/g, '.\n\n');
  
  // Break long sentences
  simplified = simplified.replace(/(.{50,}?)(,|;|:|\.) /g, '$1$2\n');
  
  // Add bullet points for lists that might be comma separated
  const listPattern = /(.+?): ([^.]+(?:, [^.]+){2,})/g;
  simplified = simplified.replace(listPattern, (match, intro, items) => {
    const listItems = items.split(', ').map(item => `• ${item}`).join('\n');
    return `${intro}:\n${listItems}`;
  });
  
  return simplified;
}

/**
 * Restructure content for ADHD
 * @param {Array} sections - Content sections
 * @returns {Array} Restructured sections
 */
function restructureForADHD(sections) {
  if (!Array.isArray(sections)) return sections;
  
  return sections.map(section => {
    const newSection = { ...section };
    
    // Add clear numbering to headings
    if (newSection.title && !newSection.title.match(/^\d+\./)) {
      newSection.title = `${sections.indexOf(section) + 1}. ${newSection.title}`;
    }
    
    // Break long content into smaller chunks
    if (newSection.content && typeof newSection.content === 'string' && newSection.content.length > 300) {
      // Split into paragraphs
      const paragraphs = newSection.content.split(/\n\s*\n/);
      
      // If there are multiple paragraphs, create subsections
      if (paragraphs.length > 1) {
        newSection.subsections = paragraphs.map((paragraph, index) => ({
          id: `${newSection.id || 'section'}_sub_${index}`,
          title: `Step ${index + 1}`,
          content: paragraph
        }));
        delete newSection.content;
      }
    }
    
    // Add visual cues
    newSection.visualCues = true;
    newSection.highlightKeyPoints = true;
    
    return newSection;
  });
}

/**
 * Make instructions explicit for autism spectrum
 * @param {string} instructions - Original instructions
 * @returns {string} Explicit instructions
 */
function makeExplicitInstructions(instructions) {
  if (!instructions) return '';
  
  // Convert to numbered steps if not already
  if (!instructions.match(/^\d+\./m)) {
    const steps = instructions.split(/\.\s+/);
    return steps.map((step, i) => `${i + 1}. ${step.trim()}`).join('\n\n');
  }
  
  // Replace ambiguous language
  let explicit = instructions;
  
  // Replace ambiguous modal verbs
  explicit = explicit.replace(/\b(may|might|could|should)\b/g, 'will');
  
  // Remove indirect phrases
  explicit = explicit.replace(/\b(try to|attempt to|consider|perhaps)\b/g, '');
  
  // Add clear outcomes
  if (!explicit.includes('When you finish') && !explicit.includes('After completing')) {
    explicit += '\n\nWhen you finish these steps, you will see a "Complete" button to click.';
  }
  
  return explicit;
}

/**
 * Generate visual schedule from sections
 * @param {Array} sections - Content sections
 * @returns {Object} Visual schedule
 */
function generateVisualSchedule(sections) {
  if (!Array.isArray(sections)) return null;
  
  return {
    steps: sections.map((section, index) => ({
      number: index + 1,
      title: section.title || `Step ${index + 1}`,
      estimatedTime: section.estimatedDuration || 5,
      icon: getIconForContentType(section.type || 'content')
    })),
    totalSteps: sections.length,
    currentStep: 1
  };
}

/**
 * Get appropriate icon for content type
 * @param {string} contentType - Content type
 * @returns {string} Icon name
 */
function getIconForContentType(contentType) {
  const iconMap = {
    'lesson': 'book',
    'exercise': 'edit',
    'assessment': 'clipboard',
    'project': 'layers',
    'game': 'star',
    'video': 'video',
    'audio': 'headphones',
    'discussion': 'message-circle',
    'reading': 'file-text'
  };
  
  return iconMap[contentType] || 'file';
}

/**
 * Add summary points to text
 * @param {string} text - Original text
 * @returns {string} Text with summary points
 */
function addSummaryPoints(text) {
  if (!text) return '';
  
  // In a real implementation, this would use NLP for extraction
  // For this example, we'll add a simple summary section
  
  return `## Key Points\n\n• This content covers important concepts\n• Remember to focus on main ideas\n• Ask questions if you need clarification\n\n${text}`;
}

/**
 * Enhance reading comprehension supports
 * @param {Object} content - Content to adapt
 */
function enhanceReadingComprehension(content) {
  if (!content) return;
  
  // Add comprehension aids
  content.comprehensionAids = {
    keyTermsHighlighted: true,
    guidingQuestions: [
      "What is the main idea of this content?",
      "How does this connect to what you already know?",
      "What questions do you have about this information?"
    ],
    visualSummary: true,
    comprehensionChecks: [
      { type: 'recall', frequency: 'afterSection' },
      { type: 'apply', frequency: 'afterContent' }
    ]
  };
  
  // Add vocabulary supports
  if (!content.supportTools) content.supportTools = [];
  content.supportTools.push({ type: 'inline_dictionary', enabled: true });
}

/**
 * Enhance memory supports
 * @param {Object} content - Content to adapt
 */
function enhanceMemorySupports(content) {
  if (!content) return;
  
  // Add memory aids
  content.memoryAids = {
    mnemonics: true,
    visualAssociations: true,
    repetitionPrompts: true,
    summaryCards: true
  };
  
  // Add note-taking scaffold
  if (!content.supportTools) content.supportTools = [];
  content.supportTools.push({ type: 'note_taking_tool', enabled: true });
}

/**
 * Add anxiety reduction supports
 * @param {Object} content - Content to adapt
 */
function addAnxietySupports(content) {
  if (!content) return;
  
  // Add anxiety reduction tools
  content.anxietySupports = {
    progressiveDisclosure: true,
    positiveReinforcement: true,
    breakPrompts: true,
    mindfulnessExercises: [
      { name: 'Breathing Exercise', duration: 30, trigger: 'beforeAssessment' },
      { name: 'Grounding Technique', duration: 15, trigger: 'onStruggle' }
    ]
  };
  
  // Add support tools
  if (!content.supportTools) content.supportTools = [];
  content.supportTools.push({ type: 'calming_tools', enabled: true });
}

/**
 * Enhance visual elements for visual learners
 * @param {Object} content - Content to adapt
 */
function enhanceVisualElements(content) {
  if (!content) return;
  
  // Add visual enhancements
  content.visualEnhancements = {
    diagramsEnhanced: true,
    colorCoding: true,
    spatialOrganization: true,
    infographics: true
  };
  
  // Add visual tools
  if (!content.supportTools) content.supportTools = [];
  content.supportTools.push({ type: 'concept_mapping', enabled: true });
}

/**
 * Enhance auditory elements for auditory learners
 * @param {Object} content - Content to adapt
 */
function enhanceAuditoryElements(content) {
  if (!content) return;
  
  // Add auditory enhancements
  content.auditoryEnhancements = {
    narratedExplanations: true,
    rhythmicPatterns: true,
    audioSummaries: true
  };
  
  // Add auditory tools
  if (!content.supportTools) content.supportTools = [];
  content.supportTools.push({ type: 'audio_recording', enabled: true });
}

/**
 * Add extension content for accelerated learners
 * @param {Object} content - Content to adapt
 */
function addExtensionContent(content) {
  if (!content) return;
  
  // Add extension elements
  content.extensionContent = {
    advancedConcepts: true,
    challengeProblems: true,
    researchPrompts: true,
    applicationScenarios: true
  };
}

/**
 * Add scaffolding for gradual learners
 * @param {Object} content - Content to adapt
 */
function addScaffoldingSupport(content) {
  if (!content) return;
  
  // Add scaffolding elements
  content.scaffolding = {
    stepByStepGuides: true,
    workedExamples: true,
    conceptBreakdown: true,
    practiceProgressions: true,
    immediateCorrectiveFeedback: true
  };
}

// Listen for messages from the main thread
parentPort.on('message', processAdaptationRequest);