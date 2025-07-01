/**
 * Adaptive Learning Path Service
 * 
 * This service dynamically adjusts content difficulty and presentation
 * based on learning profiles, performance data, and engagement metrics.
 */

// Required dependencies
const { Worker } = require('worker_threads');
const path = require('path');

class AdaptiveLearningPathService {
  constructor(options = {}) {
    this.options = {
      enableRealTimeAdjustment: true,
      performanceThreshold: 0.7, // 70% success threshold for progression
      difficultyLevels: ['beginner', 'elementary', 'intermediate', 'advanced', 'expert'],
      maxSkipForward: 2, // Maximum levels to skip forward
      maxRegressBack: 1, // Maximum levels to move back
      assessmentFrequency: 5, // Number of content items before re-assessment
      adaptationTypes: ['content', 'presentation', 'pacing', 'support'],
      ...options
    };
    
    this.neurodivergentProfiles = {
      'dyslexia': {
        contentAdaptations: ['simplified_text', 'phonological_focus', 'vocabulary_support'],
        presentationAdaptations: ['font_optimization', 'color_contrast', 'spacing_adjustments'],
        pacingAdaptations: ['extended_time', 'chunked_content', 'spaced_repetition'],
        supportAdaptations: ['text_to_speech', 'reading_guides', 'spelling_support']
      },
      'adhd': {
        contentAdaptations: ['high_interest', 'clear_goals', 'immediate_relevance'],
        presentationAdaptations: ['reduced_distractions', 'visual_cues', 'progress_indicators'],
        pacingAdaptations: ['shorter_sessions', 'frequent_breaks', 'varied_activities'],
        supportAdaptations: ['executive_function_tools', 'reminders', 'self_monitoring']
      },
      'autism_spectrum': {
        contentAdaptations: ['explicit_instructions', 'literal_language', 'special_interest_integration'],
        presentationAdaptations: ['sensory_considerations', 'predictable_structure', 'visual_supports'],
        pacingAdaptations: ['consistent_routines', 'transition_support', 'self_paced'],
        supportAdaptations: ['social_scripts', 'emotional_regulation', 'literal_explanations']
      },
      'combined': {
        contentAdaptations: ['multimodal_content', 'scaffolded_complexity', 'flexible_objectives'],
        presentationAdaptations: ['customizable_interface', 'multi_sensory', 'preference_based'],
        pacingAdaptations: ['personalized_schedule', 'adaptive_timing', 'break_reminders'],
        supportAdaptations: ['combination_tools', 'strategy_switching', 'comprehensive_support']
      },
      'other': {
        contentAdaptations: ['standard_with_options', 'clarity_focused', 'additional_examples'],
        presentationAdaptations: ['clean_interface', 'consistent_navigation', 'theme_options'],
        pacingAdaptations: ['user_controlled', 'recommended_schedule', 'flexible_deadlines'],
        supportAdaptations: ['help_system', 'learning_strategies', 'progress_tracking']
      }
    };
    
    // Initialize learning strategies store
    this.learningStrategies = new Map();
    
    this.initializeWorker();
  }
  
  /**
   * Initialize worker for intensive processing
   */
  initializeWorker() {
    try {
      this.adaptationWorker = new Worker(path.join(__dirname, '../workers/adaptation.worker.js'));
      this.adaptationWorker.on('message', (message) => {
        if (message.type === 'adaptation_complete') {
          // Handle worker responses
          const callback = this.pendingAdaptations.get(message.id);
          if (callback) {
            callback(null, message.data);
            this.pendingAdaptations.delete(message.id);
          }
        }
      });
      
      this.adaptationWorker.on('error', (error) => {
        console.error('Adaptation worker error:', error);
      });
      
      this.pendingAdaptations = new Map();
    } catch (error) {
      console.error('Failed to initialize adaptation worker:', error);
      // Fallback to synchronous processing if worker fails
      this.adaptationWorker = null;
    }
  }
  
  /**
   * Generate personalized learning path based on profile
   * @param {Object} userProfile - User's learning profile
   * @param {string} contentDomain - Subject or content domain
   * @param {string} schoolId - School identifier
   * @returns {Promise<Object>} Personalized learning path
   */
  async generateLearningPath(userProfile, contentDomain, schoolId) {
    // Validate inputs
    if (!userProfile || !contentDomain) {
      throw new Error('User profile and content domain are required');
    }
    
    // Extract key profile elements
    const {
      neurodivergentType = 'other',
      currentLevel = 'beginner',
      learningSpeed = 'standard',
      strengths = [],
      challenges = [],
      preferences = {},
      performanceHistory = []
    } = userProfile;
    
    // Determine starting difficulty
    let startingLevel = currentLevel;
    if (performanceHistory && performanceHistory.length > 0) {
      // Calculate average performance
      const recentPerformance = performanceHistory.slice(-5);
      const averageScore = recentPerformance.reduce((sum, item) => sum + item.score, 0) / recentPerformance.length;
      
      // Adjust starting level based on performance
      if (averageScore > 0.9 && currentLevel !== this.options.difficultyLevels[this.options.difficultyLevels.length - 1]) {
        // Excel at current level, move up
        const currentIndex = this.options.difficultyLevels.indexOf(currentLevel);
        startingLevel = this.options.difficultyLevels[currentIndex + 1];
      } else if (averageScore < 0.4 && currentLevel !== this.options.difficultyLevels[0]) {
        // Struggling at current level, move down
        const currentIndex = this.options.difficultyLevels.indexOf(currentLevel);
        startingLevel = this.options.difficultyLevels[currentIndex - 1];
      }
    }
    
    // Create base learning path structure
    const learningPath = {
      userId: userProfile.userId,
      contentDomain,
      schoolId,
      startingLevel,
      generatedDate: new Date(),
      expectedCompletionDate: this.calculateExpectedCompletionDate(userProfile, contentDomain),
      adaptations: this.getRecommendedAdaptations(neurodivergentType),
      contentSequence: await this.generateContentSequence(userProfile, contentDomain, schoolId, startingLevel),
      reviewPoints: this.calculateReviewPoints(userProfile, contentDomain),
      supportStrategies: this.getSupportStrategies(neurodivergentType, challenges),
      milestones: this.generateMilestones(contentDomain, startingLevel)
    };
    
    return learningPath;
  }
  
  /**
   * Get recommended adaptations based on neurodivergent type
   * @param {string} neurodivergentType - Type of neurodivergence
   * @returns {Object} Set of recommended adaptations
   */
  getRecommendedAdaptations(neurodivergentType) {
    // Get the profile for this neurodivergent type, or default to 'other'
    const profile = this.neurodivergentProfiles[neurodivergentType] || this.neurodivergentProfiles.other;
    
    return {
      content: profile.contentAdaptations || [],
      presentation: profile.presentationAdaptations || [],
      pacing: profile.pacingAdaptations || [],
      support: profile.supportAdaptations || []
    };
  }
  
  /**
   * Generate appropriate content sequence
   * @param {Object} userProfile - User's learning profile
   * @param {string} contentDomain - Subject or content domain
   * @param {string} schoolId - School identifier
   * @param {string} startingLevel - Starting difficulty level
   * @returns {Promise<Array>} Sequence of content items
   */
  async generateContentSequence(userProfile, contentDomain, schoolId, startingLevel) {
    // This would typically fetch content from a database based on the parameters
    // For now, we'll create a simulated sequence
    
    const simulatedSequence = [];
    const contentTypes = ['lesson', 'exercise', 'assessment', 'project', 'game'];
    const totalItems = 15; // Typical path length
    
    for (let i = 0; i < totalItems; i++) {
      // Every 5th item is an assessment
      const contentType = (i + 1) % 5 === 0 ? 'assessment' : contentTypes[Math.floor(Math.random() * 4)];
      
      // Simulate a content item
      simulatedSequence.push({
        id: `${contentDomain}_${startingLevel}_${i + 1}`,
        title: `${this.capitalizeFirstLetter(contentDomain)} ${this.capitalizeFirstLetter(contentType)} ${i + 1}`,
        type: contentType,
        level: startingLevel,
        estimatedDuration: contentType === 'project' ? 45 : contentType === 'assessment' ? 20 : 15,
        adaptations: this.getRecommendedAdaptations(userProfile.neurodivergentType),
        prerequisites: i > 0 ? [`${contentDomain}_${startingLevel}_${i}`] : [],
        adaptivityRules: {
          onSuccess: i < totalItems - 1 ? { nextItem: `${contentDomain}_${startingLevel}_${i + 2}` } : { completePath: true },
          onStruggle: { provideSupportType: 'adaptive_help', maxAttempts: 3 },
          onFailure: { reviewItem: `${contentDomain}_${startingLevel}_${Math.max(1, i - 1)}` }
        }
      });
    }
    
    return simulatedSequence;
  }
  
  /**
   * Calculate review points in the learning path
   * @param {Object} userProfile - User's learning profile
   * @param {string} contentDomain - Content domain
   * @returns {Array} Review points
   */
  calculateReviewPoints(userProfile, contentDomain) {
    const reviewPoints = [];
    
    // Determine review frequency based on learning profile
    let reviewFrequency = 5; // Default: every 5 items
    
    if (userProfile.neurodivergentType === 'dyslexia') {
      reviewFrequency = 3; // More frequent reviews for dyslexia
    } else if (userProfile.learningSpeed === 'accelerated') {
      reviewFrequency = 7; // Less frequent for accelerated learners
    }
    
    // Add review points
    for (let i = reviewFrequency; i <= 15; i += reviewFrequency) {
      reviewPoints.push({
        afterItem: i,
        type: i % (reviewFrequency * 2) === 0 ? 'comprehensive' : 'quick',
        focusAreas: this.getReviewFocusAreas(userProfile, contentDomain)
      });
    }
    
    return reviewPoints;
  }
  
  /**
   * Determine focus areas for review
   * @param {Object} userProfile - User's learning profile
   * @param {string} contentDomain - Content domain
   * @returns {Array} Focus areas
   */
  getReviewFocusAreas(userProfile, contentDomain) {
    // This would typically be determined by analysis of performance data
    // For now, return focus areas based on challenges
    
    const focusAreas = [];
    
    if (userProfile.challenges && userProfile.challenges.length > 0) {
      // Convert challenges to focus areas
      userProfile.challenges.forEach(challenge => {
        if (challenge === 'reading_speed') focusAreas.push('fluency');
        if (challenge === 'comprehension') focusAreas.push('understanding');
        if (challenge === 'attention') focusAreas.push('focus_techniques');
        if (challenge === 'memory') focusAreas.push('retention_strategies');
        if (challenge === 'organization') focusAreas.push('structure_methods');
      });
    }
    
    // Add domain-specific focus areas
    if (contentDomain === 'math') focusAreas.push('calculation_accuracy');
    if (contentDomain === 'language') focusAreas.push('grammar_application');
    if (contentDomain === 'science') focusAreas.push('concept_relations');
    
    return focusAreas.length > 0 ? focusAreas : ['key_concepts'];
  }
  
  /**
   * Get support strategies based on neurodivergent profile and challenges
   * @param {string} neurodivergentType - Type of neurodivergence
   * @param {Array} challenges - Specific learning challenges
   * @returns {Array} Support strategies
   */
  getSupportStrategies(neurodivergentType, challenges = []) {
    // Base strategies for neurodivergent type
    let strategies = [];
    
    // Add type-specific strategies
    if (neurodivergentType === 'dyslexia') {
      strategies = [
        { type: 'text_to_speech', automatic: true, description: 'Convert text to spoken audio' },
        { type: 'reading_guide', automatic: false, description: 'Visual guide to track text while reading' },
        { type: 'phonological_support', automatic: false, description: 'Sound-based reading assistance' }
      ];
    } else if (neurodivergentType === 'adhd') {
      strategies = [
        { type: 'focus_mode', automatic: true, description: 'Reduce visual distractions in content' },
        { type: 'timer_prompts', automatic: true, description: 'Regular prompts to maintain focus' },
        { type: 'chunking', automatic: true, description: 'Break content into manageable chunks' }
      ];
    } else if (neurodivergentType === 'autism_spectrum') {
      strategies = [
        { type: 'visual_schedule', automatic: true, description: 'Visual representation of learning sequence' },
        { type: 'sensory_controls', automatic: false, description: 'Adjust visual and audio elements' },
        { type: 'concrete_examples', automatic: true, description: 'Provide explicit, concrete examples' }
      ];
    } else {
      strategies = [
        { type: 'learning_tips', automatic: false, description: 'Context-specific learning strategies' },
        { type: 'progress_tracking', automatic: true, description: 'Visual tracking of progress' }
      ];
    }
    
    // Add challenge-specific strategies
    if (challenges.includes('reading_speed')) {
      strategies.push({ type: 'paced_reading', automatic: false, description: 'Guided reading pace tool' });
    }
    
    if (challenges.includes('writing')) {
      strategies.push({ type: 'word_prediction', automatic: true, description: 'Predictive text for writing' });
    }
    
    if (challenges.includes('organization')) {
      strategies.push({ type: 'visual_organizer', automatic: true, description: 'Visual organization of concepts' });
    }
    
    if (challenges.includes('memory')) {
      strategies.push({ type: 'spaced_repetition', automatic: true, description: 'Optimized memory review schedule' });
    }
    
    if (challenges.includes('anxiety')) {
      strategies.push({ type: 'calming_tools', automatic: false, description: 'Anxiety reduction techniques' });
    }
    
    return strategies;
  }
  
  /**
   * Generate milestones for learning path
   * @param {string} contentDomain - Content domain
   * @param {string} level - Difficulty level
   * @returns {Array} Milestones
   */
  generateMilestones(contentDomain, level) {
    // Create domain and level appropriate milestones
    const milestones = [];
    
    // Basic milestones
    milestones.push({
      id: `${contentDomain}_${level}_milestone_1`,
      title: 'Getting Started',
      description: `Complete your first ${contentDomain} ${level} lesson`,
      position: 1,
      reward: 'unlock_basic_tools'
    });
    
    milestones.push({
      id: `${contentDomain}_${level}_milestone_2`,
      title: 'Building Skills',
      description: `Successfully apply ${contentDomain} concepts in practice exercises`,
      position: 5,
      reward: 'skill_badge'
    });
    
    milestones.push({
      id: `${contentDomain}_${level}_milestone_3`,
      title: 'Demonstrating Mastery',
      description: `Complete ${level} assessment with 80% or higher score`,
      position: 10,
      reward: 'level_certification'
    });
    
    milestones.push({
      id: `${contentDomain}_${level}_milestone_4`,
      title: 'Path Completion',
      description: `Complete the entire ${contentDomain} ${level} learning path`,
      position: 15,
      reward: 'unlock_next_level'
    });
    
    return milestones;
  }
  
  /**
   * Calculate expected completion date
   * @param {Object} userProfile - User learning profile
   * @param {string} contentDomain - Content domain
   * @returns {Date} Expected completion date
   */
  calculateExpectedCompletionDate(userProfile, contentDomain) {
    const now = new Date();
    let daysToComplete = 30; // Default: 1 month
    
    // Adjust based on learning speed
    if (userProfile.learningSpeed === 'accelerated') {
      daysToComplete = 21; // 3 weeks
    } else if (userProfile.learningSpeed === 'gradual') {
      daysToComplete = 45; // 1.5 months
    }
    
    // Adjust based on available time
    if (userProfile.availableTimePerWeek) {
      // Less time = longer duration
      if (userProfile.availableTimePerWeek < 3) {
        daysToComplete *= 1.5;
      } else if (userProfile.availableTimePerWeek > 10) {
        daysToComplete *= 0.7;
      }
    }
    
    // Create expected date
    const expectedDate = new Date(now);
    expectedDate.setDate(now.getDate() + Math.round(daysToComplete));
    
    return expectedDate;
  }
  
  /**
   * Update learning path based on performance
   * @param {Object} learningPath - Current learning path
   * @param {Object} performanceData - Recent performance data
   * @returns {Promise<Object>} Updated learning path
   */
  async updateLearningPath(learningPath, performanceData) {
    if (!learningPath || !performanceData) {
      throw new Error('Learning path and performance data are required');
    }
    
    // Clone the learning path to avoid modifying the original
    const updatedPath = JSON.parse(JSON.stringify(learningPath));
    
    // Process performance data
    const {
      contentId,
      score,
      completionTime,
      attemptCount,
      engagementMetrics,
      strugglePoints
    } = performanceData;
    
    // Find the content item in the sequence
    const contentIndex = updatedPath.contentSequence.findIndex(item => item.id === contentId);
    if (contentIndex === -1) {
      throw new Error(`Content item ${contentId} not found in learning path`);
    }
    
    // Mark content as completed
    updatedPath.contentSequence[contentIndex].completed = true;
    updatedPath.contentSequence[contentIndex].performance = {
      score,
      completionTime,
      attemptCount,
      timestamp: new Date()
    };
    
    // Determine if we need to adapt the path
    if (score < this.options.performanceThreshold) {
      // User is struggling, add support content
      const supportItem = {
        id: `${contentId}_support`,
        title: `Additional Support for ${updatedPath.contentSequence[contentIndex].title}`,
        type: 'support',
        level: updatedPath.contentSequence[contentIndex].level,
        estimatedDuration: 10,
        targetAreas: strugglePoints || ['general_understanding'],
        prerequisites: [contentId],
        isAdaptiveAddition: true
      };
      
      // Insert support item after the current item
      updatedPath.contentSequence.splice(contentIndex + 1, 0, supportItem);
      
      // Adjust subsequent items' references if needed
      for (let i = contentIndex + 2; i < updatedPath.contentSequence.length; i++) {
        if (updatedPath.contentSequence[i].prerequisites.includes(contentId)) {
          updatedPath.contentSequence[i].prerequisites.push(`${contentId}_support`);
        }
      }
    } else if (score > 0.9 && engagementMetrics && engagementMetrics.confidenceLevel > 0.8) {
      // User is excelling, consider skipping ahead
      // Find next assessment
      for (let i = contentIndex + 1; i < updatedPath.contentSequence.length; i++) {
        if (updatedPath.contentSequence[i].type === 'assessment') {
          // Make this the next target, skipping some content
          updatedPath.skipForward = {
            fromIndex: contentIndex,
            toIndex: i,
            reason: 'high_performance',
            suggested: true
          };
          break;
        }
      }
    }
    
    // Check if we've reached a review point
    const reviewPoint = updatedPath.reviewPoints.find(rp => rp.afterItem === contentIndex + 1);
    if (reviewPoint) {
      reviewPoint.activated = true;
      reviewPoint.scheduledDate = new Date();
    }
    
    // Update any relevant milestones
    for (const milestone of updatedPath.milestones) {
      if (milestone.position === contentIndex + 1) {
        milestone.achieved = true;
        milestone.achievedDate = new Date();
      }
    }
    
    return updatedPath;
  }
  
  /**
   * Adapt content presentation based on user profile
   * @param {Object} content - Original content
   * @param {Object} userProfile - User learning profile
   * @returns {Promise<Object>} Adapted content
   */
  async adaptContentPresentation(content, userProfile) {
    if (!content) {
      throw new Error('Content is required for adaptation');
    }
    
    if (!userProfile) {
      // No profile, return original content
      return content;
    }
    
    // Generate a unique ID for this adaptation request
    const adaptationId = `adapt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    
    // Use worker thread if available
    if (this.adaptationWorker) {
      return new Promise((resolve, reject) => {
        // Store callback in pending adaptations map
        this.pendingAdaptations.set(adaptationId, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
        
        // Send to worker
        this.adaptationWorker.postMessage({
          type: 'adapt_content',
          id: adaptationId,
          content,
          userProfile
        });
      });
    } else {
      // Fallback: perform adaptations synchronously
      return this.performContentAdaptations(content, userProfile);
    }
  }
  
  /**
   * Perform content adaptations directly (without worker)
   * @param {Object} content - Original content
   * @param {Object} userProfile - User learning profile
   * @returns {Object} Adapted content
   */
  performContentAdaptations(content, userProfile) {
    // Clone content to avoid modifying original
    const adaptedContent = JSON.parse(JSON.stringify(content));
    
    // Apply neurodivergent-specific adaptations
    if (userProfile.neurodivergentType) {
      const adaptations = this.getRecommendedAdaptations(userProfile.neurodivergentType);
      
      // Apply content adaptations
      if (adaptations.content && adaptations.content.length > 0) {
        adaptedContent.adaptedContent = true;
        
        // Apply specific content adaptations based on type
        if (userProfile.neurodivergentType === 'dyslexia') {
          // Simplify text, focus on key concepts
          if (adaptedContent.text) {
            adaptedContent.text = this.simplifyTextForDyslexia(adaptedContent.text);
          }
        } else if (userProfile.neurodivergentType === 'adhd') {
          // Add clear structure, break into smaller chunks
          if (adaptedContent.sections) {
            adaptedContent.sections = this.restructureForADHD(adaptedContent.sections);
          }
        } else if (userProfile.neurodivergentType === 'autism_spectrum') {
          // Add literal explanations, visual supports
          if (adaptedContent.instructions) {
            adaptedContent.instructions = this.clarifyForAutismSpectrum(adaptedContent.instructions);
          }
        }
      }
      
      // Apply presentation adaptations
      if (adaptations.presentation && adaptations.presentation.length > 0) {
        adaptedContent.presentationSettings = {
          fontFamily: userProfile.neurodivergentType === 'dyslexia' ? 'Open Dyslexic, Comic Sans MS, sans-serif' : 'inherit',
          fontSize: userProfile.preferences.fontSize || 'medium',
          lineSpacing: userProfile.neurodivergentType === 'dyslexia' ? 1.5 : 1.2,
          colorScheme: userProfile.preferences.highContrast ? 'high_contrast' : 'standard',
          animations: userProfile.neurodivergentType === 'adhd' ? 'reduced' : 'standard',
          layout: userProfile.neurodivergentType === 'autism_spectrum' ? 'structured' : 'adaptive'
        };
      }
      
      // Apply pacing adaptations
      if (adaptations.pacing && adaptations.pacing.length > 0) {
        adaptedContent.pacingSettings = {
          estimatedTime: this.adjustTimeEstimate(content.estimatedDuration, userProfile),
          breakFrequency: userProfile.neurodivergentType === 'adhd' ? 'high' : 'standard',
          allowSkipping: userProfile.neurodivergentType === 'adhd' ? true : false,
          selfPaced: true
        };
      }
      
      // Apply support adaptations
      if (adaptations.support && adaptations.support.length > 0) {
        adaptedContent.supportTools = [];
        
        if (userProfile.neurodivergentType === 'dyslexia') {
          adaptedContent.supportTools.push(
            { type: 'text_to_speech', enabled: true },
            { type: 'word_highlighting', enabled: true },
            { type: 'dictionary', enabled: true }
          );
        } else if (userProfile.neurodivergentType === 'adhd') {
          adaptedContent.supportTools.push(
            { type: 'focus_timer', enabled: true },
            { type: 'progress_tracker', enabled: true },
            { type: 'distraction_blocker', enabled: true }
          );
        } else if (userProfile.neurodivergentType === 'autism_spectrum') {
          adaptedContent.supportTools.push(
            { type: 'visual_schedule', enabled: true },
            { type: 'sensory_break_timer', enabled: true },
            { type: 'literal_explanation', enabled: true }
          );
        }
      }
    }
    
    // Add user-specific preferences
    if (userProfile.preferences) {
      adaptedContent.userPreferences = userProfile.preferences;
    }
    
    return adaptedContent;
  }
  
  /**
   * Simplify text for dyslexia
   * @param {string} text - Original text
   * @returns {string} Simplified text
   */
  simplifyTextForDyslexia(text) {
    // Basic simplification - in a real implementation this would be more sophisticated
    let simplified = text;
    
    // Break text into shorter paragraphs
    simplified = simplified.replace(/(\. )/g, '.\n\n');
    
    // Highlight key terms (simulated)
    simplified = simplified.replace(/\b(important|key|critical|essential|significant)\b/gi, '**$1**');
    
    return simplified;
  }
  
  /**
   * Restructure content for ADHD
   * @param {Array} sections - Content sections
   * @returns {Array} Restructured sections
   */
  restructureForADHD(sections) {
    // Break content into smaller chunks with clear headings
    return sections.map(section => {
      // Clone the section
      const newSection = { ...section };
      
      // Break content into smaller parts
      if (newSection.content && typeof newSection.content === 'string') {
        const paragraphs = newSection.content.split('\n').filter(p => p.trim().length > 0);
        
        if (paragraphs.length > 2) {
          // Convert into subsections
          newSection.subsections = paragraphs.map((paragraph, i) => ({
            id: `${newSection.id}_sub_${i}`,
            title: `Step ${i + 1}`,
            content: paragraph
          }));
          delete newSection.content;
        }
      }
      
      return newSection;
    });
  }
  
  /**
   * Clarify instructions for autism spectrum
   * @param {string} instructions - Original instructions
   * @returns {string} Clarified instructions
   */
  clarifyForAutismSpectrum(instructions) {
    // Add numbered steps, concrete language
    let clarified = instructions;
    
    // Format as numbered steps if not already
    if (!clarified.match(/^\d+\.\s/m)) {
      const steps = clarified.split(/\.\s+/);
      clarified = steps.map((step, i) => `${i + 1}. ${step}`).join('\n\n');
    }
    
    // Clarify potentially ambiguous language
    clarified = clarified.replace(/\b(may|might|could|should)\b/g, 'will');
    clarified = clarified.replace(/\b(try to|attempt to)\b/g, '');
    
    return clarified;
  }
  
  /**
   * Adjust time estimate based on user profile
   * @param {number} originalEstimate - Original time estimate in minutes
   * @param {Object} userProfile - User profile
   * @returns {number} Adjusted time estimate
   */
  adjustTimeEstimate(originalEstimate, userProfile) {
    if (!originalEstimate) return 15; // Default 15 minutes
    
    let multiplier = 1.0;
    
    // Adjust based on learning speed preference
    if (userProfile.learningSpeed === 'accelerated') {
      multiplier *= 0.8;
    } else if (userProfile.learningSpeed === 'gradual') {
      multiplier *= 1.3;
    }
    
    // Adjust based on neurodivergent type
    if (userProfile.neurodivergentType === 'dyslexia') {
      multiplier *= 1.25; // Generally need more time for reading
    } else if (userProfile.neurodivergentType === 'adhd') {
      multiplier *= 1.1; // Slightly more time for focus shifts
    }
    
    // If user has completed similar content before, reduce time
    if (userProfile.completedContent && userProfile.completedContent.length > 10) {
      multiplier *= 0.9; // Experienced learner
    }
    
    return Math.round(originalEstimate * multiplier);
  }
  
  /**
   * Helper to capitalize the first letter of a string
   * @param {string} string - Input string
   * @returns {string} Capitalized string
   */
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
  /**
   * Clean up resources
   */
  cleanup() {
    if (this.adaptationWorker) {
      this.adaptationWorker.terminate();
    }
  }
}

module.exports = AdaptiveLearningPathService;