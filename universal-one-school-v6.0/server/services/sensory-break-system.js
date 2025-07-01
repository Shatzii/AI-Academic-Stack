/**
 * Sensory Break System
 * 
 * This service provides personalized sensory breaks and calming interventions
 * based on the learner's profile, neurodivergent type, and estimated cognitive load.
 */

class SensoryBreakSystem {
  constructor(options = {}) {
    this.options = {
      defaultBreakDuration: 3, // minutes
      minTimeBetweenBreaks: 15, // minutes
      maxTimeBetweenBreaks: 45, // minutes
      breakIntensityLevels: ['light', 'moderate', 'deep'],
      cognitiveLoadThresholds: {
        low: 0.3, // 30% cognitive load
        medium: 0.6, // 60% cognitive load
        high: 0.8 // 80% cognitive load
      },
      ...options
    };
    
    // Initialize break activity library
    this.breakActivities = this.initializeBreakActivities();
    
    // Initialize user break history
    this.userBreakHistory = new Map();
  }
  
  /**
   * Initialize the library of break activities
   * @returns {Object} Categorized break activities
   */
  initializeBreakActivities() {
    return {
      // Physical activities to release energy or stimulate
      physical: {
        light: [
          { 
            id: 'stretch_routine',
            name: 'Desk Stretches',
            description: 'Gentle stretches you can do at your desk',
            duration: 2,
            benefits: ['Reduces muscle tension', 'Improves circulation'],
            contraindications: [],
            resources: {
              visualGuide: '/resources/breaks/stretches.svg',
              audioGuide: '/resources/breaks/stretches.mp3'
            }
          },
          { 
            id: 'finger_exercises',
            name: 'Hand and Finger Exercises',
            description: 'Gentle exercises for hands and fingers',
            duration: 1,
            benefits: ['Reduces typing strain', 'Improves dexterity'],
            contraindications: ['Acute hand injury'],
            resources: {
              visualGuide: '/resources/breaks/hand_exercises.svg'
            }
          }
        ],
        moderate: [
          { 
            id: 'chair_yoga',
            name: 'Chair Yoga',
            description: 'Simple yoga poses adapted for a chair',
            duration: 3,
            benefits: ['Improves flexibility', 'Reduces tension', 'Promotes focus'],
            contraindications: [],
            resources: {
              visualGuide: '/resources/breaks/chair_yoga.svg',
              videoGuide: '/resources/breaks/chair_yoga.mp4'
            }
          },
          { 
            id: 'standing_routine',
            name: 'Standing Movement Routine',
            description: 'A sequence of gentle movements done while standing',
            duration: 4,
            benefits: ['Increases energy', 'Improves circulation', 'Resets focus'],
            contraindications: ['Mobility issues'],
            resources: {
              visualGuide: '/resources/breaks/standing_routine.svg',
              audioGuide: '/resources/breaks/standing_routine.mp3'
            }
          }
        ],
        deep: [
          { 
            id: 'energy_release',
            name: 'Energy Release Exercises',
            description: 'More intensive movements to release excess energy',
            duration: 5,
            benefits: ['Reduces hyperactivity', 'Releases tension', 'Improves mood'],
            contraindications: ['Cardiovascular issues'],
            resources: {
              visualGuide: '/resources/breaks/energy_release.svg',
              videoGuide: '/resources/breaks/energy_release.mp4'
            }
          },
          { 
            id: 'coordination_sequence',
            name: 'Coordination Exercise Sequence',
            description: 'Series of movements that enhance coordination',
            duration: 5,
            benefits: ['Improves brain-body connection', 'Enhances focus', 'Develops coordination'],
            contraindications: [],
            resources: {
              visualGuide: '/resources/breaks/coordination.svg',
              videoGuide: '/resources/breaks/coordination.mp4'
            }
          }
        ]
      },
      
      // Visual activities for visual relaxation or stimulation
      visual: {
        light: [
          { 
            id: 'visual_rest',
            name: '20-20-20 Eye Rest',
            description: 'Look at something 20 feet away for 20 seconds every 20 minutes',
            duration: 1,
            benefits: ['Reduces eye strain', 'Prevents focusing fatigue'],
            contraindications: [],
            resources: {
              visualGuide: '/resources/breaks/eye_rest.svg',
              timer: true
            }
          },
          { 
            id: 'color_breathing',
            name: 'Color Breathing Visualization',
            description: 'Visualize breathing in and out with calming colors',
            duration: 2,
            benefits: ['Promotes calm', 'Visual relaxation', 'Mindful focus'],
            contraindications: [],
            resources: {
              visualGuide: '/resources/breaks/color_breathing.svg',
              animation: '/resources/breaks/color_breathing.webp'
            }
          }
        ],
        moderate: [
          { 
            id: 'visual_tracking',
            name: 'Visual Tracking Exercise',
            description: 'Follow moving patterns with your eyes',
            duration: 3,
            benefits: ['Improves visual tracking', 'Enhances focus', 'Provides sensory input'],
            contraindications: ['Photosensitive epilepsy'],
            resources: {
              animation: '/resources/breaks/visual_tracking.webp',
              audioGuide: '/resources/breaks/visual_tracking.mp3'
            }
          },
          { 
            id: 'nature_immersion',
            name: 'Nature Scene Immersion',
            description: 'Detailed visual exploration of nature scenes',
            duration: 4,
            benefits: ['Reduces stress', 'Restores attention', 'Promotes calm'],
            contraindications: [],
            resources: {
              images: [
                '/resources/breaks/nature1.jpg',
                '/resources/breaks/nature2.jpg',
                '/resources/breaks/nature3.jpg'
              ],
              audioGuide: '/resources/breaks/nature_sounds.mp3'
            }
          }
        ],
        deep: [
          { 
            id: 'visual_journey',
            name: 'Guided Visual Journey',
            description: 'An immersive visual story with guided narration',
            duration: 5,
            benefits: ['Deep relaxation', 'Stress reduction', 'Mental reset'],
            contraindications: [],
            resources: {
              videoGuide: '/resources/breaks/visual_journey.mp4',
              audioGuide: '/resources/breaks/visual_journey.mp3'
            }
          },
          { 
            id: 'mandala_coloring',
            name: 'Digital Mandala Coloring',
            description: 'Interactive coloring of geometric patterns',
            duration: 6,
            benefits: ['Promotes focus', 'Reduces anxiety', 'Encourages creativity'],
            contraindications: [],
            resources: {
              interactive: '/resources/breaks/mandala_coloring.html',
              printable: '/resources/breaks/mandala_printable.pdf'
            }
          }
        ]
      },
      
      // Auditory activities for auditory relaxation or stimulation
      auditory: {
        light: [
          { 
            id: 'ambient_sounds',
            name: 'Ambient Nature Sounds',
            description: 'Listen to gentle nature sounds',
            duration: 2,
            benefits: ['Creates auditory privacy', 'Reduces distractions', 'Promotes calm'],
            contraindications: ['Auditory hypersensitivity'],
            resources: {
              audioGuide: '/resources/breaks/ambient_nature.mp3',
              visualGuide: '/resources/breaks/nature_visual.svg'
            }
          },
          { 
            id: 'guided_breathing',
            name: 'Guided Breathing Audio',
            description: 'Follow along with guided breathing instructions',
            duration: 2,
            benefits: ['Reduces anxiety', 'Improves breathing pattern', 'Promotes focus'],
            contraindications: [],
            resources: {
              audioGuide: '/resources/breaks/guided_breathing.mp3',
              visualGuide: '/resources/breaks/breathing_visual.svg'
            }
          }
        ],
        moderate: [
          { 
            id: 'rhythmic_patterns',
            name: 'Rhythmic Sound Patterns',
            description: 'Listen and optionally tap along to rhythmic patterns',
            duration: 3,
            benefits: ['Improves auditory processing', 'Enhances focus', 'Provides sensory input'],
            contraindications: [],
            resources: {
              audioGuide: '/resources/breaks/rhythmic_patterns.mp3',
              visualGuide: '/resources/breaks/rhythm_visual.svg'
            }
          },
          { 
            id: 'sound_meditation',
            name: 'Sound Bath Meditation',
            description: 'Immersive listening experience with harmonic sounds',
            duration: 4,
            benefits: ['Deep relaxation', 'Auditory stimulation', 'Stress reduction'],
            contraindications: ['Auditory hypersensitivity'],
            resources: {
              audioGuide: '/resources/breaks/sound_bath.mp3',
              visualGuide: '/resources/breaks/sound_waves.svg'
            }
          }
        ],
        deep: [
          { 
            id: 'guided_relaxation',
            name: 'Guided Audio Relaxation',
            description: 'Fully narrated relaxation session',
            duration: 5,
            benefits: ['Deep relaxation', 'Stress reduction', 'Mental reset'],
            contraindications: [],
            resources: {
              audioGuide: '/resources/breaks/guided_relaxation.mp3',
              visualGuide: '/resources/breaks/relaxation_visual.svg'
            }
          },
          { 
            id: 'binaural_beats',
            name: 'Binaural Beat Session',
            description: 'Specialized audio that promotes specific brain states',
            duration: 7,
            benefits: ['Alters brain wave activity', 'Deep focus', 'Relaxation'],
            contraindications: ['Seizure disorders', 'Hearing issues'],
            resources: {
              audioGuide: '/resources/breaks/binaural_focus.mp3',
              visualGuide: '/resources/breaks/brain_waves.svg',
              note: 'Headphones required for effectiveness'
            }
          }
        ]
      },
      
      // Tactile activities for tactile input
      tactile: {
        light: [
          { 
            id: 'hand_massage',
            name: 'Self Hand Massage',
            description: 'Simple massage techniques for hands and fingers',
            duration: 2,
            benefits: ['Reduces tension', 'Improves circulation', 'Provides tactile input'],
            contraindications: ['Acute hand injury'],
            resources: {
              visualGuide: '/resources/breaks/hand_massage.svg',
              videoGuide: '/resources/breaks/hand_massage.mp4'
            }
          },
          { 
            id: 'texture_exploration',
            name: 'Texture Exploration',
            description: 'Engage with different textures (can use items at desk)',
            duration: 2,
            benefits: ['Sensory grounding', 'Tactile awareness', 'Present moment focus'],
            contraindications: [],
            resources: {
              visualGuide: '/resources/breaks/textures.svg',
              textGuide: '/resources/breaks/texture_guide.txt'
            }
          }
        ],
        moderate: [
          { 
            id: 'stress_ball',
            name: 'Stress Ball Sequence',
            description: 'A sequence of exercises using a stress ball or similar object',
            duration: 3,
            benefits: ['Releases tension', 'Improves grip strength', 'Provides tactile input'],
            contraindications: ['Acute hand injury'],
            resources: {
              visualGuide: '/resources/breaks/stress_ball.svg',
              videoGuide: '/resources/breaks/stress_ball.mp4'
            }
          },
          { 
            id: 'face_massage',
            name: 'Face and Scalp Self-Massage',
            description: 'Gentle massage techniques for face, jaw, and scalp',
            duration: 4,
            benefits: ['Reduces facial tension', 'Relieves eye strain', 'Promotes relaxation'],
            contraindications: ['Facial injury or infection'],
            resources: {
              visualGuide: '/resources/breaks/face_massage.svg',
              videoGuide: '/resources/breaks/face_massage.mp4'
            }
          }
        ],
        deep: [
          { 
            id: 'deep_pressure',
            name: 'Deep Pressure Techniques',
            description: 'Self-applied deep pressure for calming',
            duration: 5,
            benefits: ['Reduces anxiety', 'Provides proprioceptive input', 'Promotes calm'],
            contraindications: [],
            resources: {
              visualGuide: '/resources/breaks/deep_pressure.svg',
              videoGuide: '/resources/breaks/deep_pressure.mp4'
            }
          },
          { 
            id: 'full_body_routine',
            name: 'Full Body Sensory Routine',
            description: 'Comprehensive sequence addressing multiple body areas',
            duration: 7,
            benefits: ['Full body awareness', 'Complete sensory reset', 'Deep relaxation'],
            contraindications: ['Mobility issues'],
            resources: {
              visualGuide: '/resources/breaks/full_body.svg',
              videoGuide: '/resources/breaks/full_body.mp4',
              audioGuide: '/resources/breaks/full_body.mp3'
            }
          }
        ]
      },
      
      // Cognitive activities for mental refreshing
      cognitive: {
        light: [
          { 
            id: 'mindful_minute',
            name: 'One Minute Mindfulness',
            description: 'Brief mindful awareness exercise',
            duration: 1,
            benefits: ['Resets attention', 'Reduces mind wandering', 'Improves focus'],
            contraindications: [],
            resources: {
              audioGuide: '/resources/breaks/mindful_minute.mp3',
              visualGuide: '/resources/breaks/mindfulness.svg'
            }
          },
          { 
            id: 'mental_imagery',
            name: 'Positive Mental Imagery',
            description: 'Visualize a positive, calming scene',
            duration: 2,
            benefits: ['Reduces stress', 'Improves mood', 'Mental refreshment'],
            contraindications: [],
            resources: {
              audioGuide: '/resources/breaks/positive_imagery.mp3',
              textGuide: '/resources/breaks/imagery_guide.txt'
            }
          }
        ],
        moderate: [
          { 
            id: 'gratitude_practice',
            name: 'Gratitude Practice',
            description: 'Brief reflection on things you're grateful for',
            duration: 3,
            benefits: ['Improves mood', 'Reduces stress', 'Shifts perspective'],
            contraindications: [],
            resources: {
              visualGuide: '/resources/breaks/gratitude.svg',
              textGuide: '/resources/breaks/gratitude_prompts.txt'
            }
          },
          { 
            id: 'brain_game',
            name: 'Quick Brain Game',
            description: 'Brief puzzles or brain teasers',
            duration: 4,
            benefits: ['Cognitive shift', 'Mental stimulation', 'Fun break from work'],
            contraindications: [],
            resources: {
              interactive: '/resources/breaks/brain_games.html',
              printable: '/resources/breaks/brain_games.pdf'
            }
          }
        ],
        deep: [
          { 
            id: 'guided_meditation',
            name: 'Guided Meditation Session',
            description: 'Full guided meditation practice',
            duration: 5,
            benefits: ['Deep relaxation', 'Stress reduction', 'Improved focus'],
            contraindications: [],
            resources: {
              audioGuide: '/resources/breaks/guided_meditation.mp3',
              visualGuide: '/resources/breaks/meditation_visual.svg'
            }
          },
          { 
            id: 'creative_expression',
            name: 'Quick Creative Expression',
            description: 'Brief creative writing or drawing exercise',
            duration: 7,
            benefits: ['Cognitive refreshment', 'Creative thinking', 'Emotional processing'],
            contraindications: [],
            resources: {
              visualGuide: '/resources/breaks/creative_prompts.svg',
              textGuide: '/resources/breaks/creative_prompts.txt',
              interactive: '/resources/breaks/creative_canvas.html'
            }
          }
        ]
      }
    };
  }
  
  /**
   * Generate recommended break schedule based on user profile
   * @param {Object} userProfile - User learning profile
   * @returns {Object} Personalized break schedule
   */
  generateBreakSchedule(userProfile) {
    if (!userProfile) {
      return this.getDefaultBreakSchedule();
    }
    
    const {
      neurodivergentType = 'other',
      sensoryPreferences = {},
      sensoryAversions = [],
      attentionSpan = 'medium',
      energyPattern = 'balanced',
      previousBreaks = []
    } = userProfile;
    
    // Determine break frequency based on profile
    let baseBreakInterval = 30; // minutes between breaks
    
    if (neurodivergentType === 'adhd') {
      baseBreakInterval = 20; // More frequent breaks
    } else if (attentionSpan === 'short') {
      baseBreakInterval = 25;
    } else if (attentionSpan === 'long') {
      baseBreakInterval = 40;
    }
    
    // Adjust break duration based on profile
    let baseBreakDuration = this.options.defaultBreakDuration;
    
    if (neurodivergentType === 'adhd' && energyPattern === 'high') {
      baseBreakDuration = 4; // Longer breaks for high energy ADHD
    } else if (neurodivergentType === 'autism_spectrum' && sensoryPreferences.intensity === 'low') {
      baseBreakDuration = 5; // Longer, gentler breaks
    }
    
    // Build break schedule
    const breakSchedule = {
      userId: userProfile.id,
      baseBreakInterval,
      baseBreakDuration,
      scheduledBreaks: [],
      adaptiveRecommendations: true,
      generateDate: new Date()
    };
    
    // Determine preferred sensory channels
    const sensoryCategoryPreferences = this.determineSensoryPreferences(userProfile);
    
    // Create 3 scheduled breaks (would be more in real implementation)
    for (let i = 0; i < 3; i++) {
      // Vary break timing slightly
      const variationFactor = 0.85 + (Math.random() * 0.3); // 0.85-1.15
      const intervalMinutes = Math.round(baseBreakInterval * variationFactor);
      
      // Build the break
      const breakTime = new Date();
      breakTime.setMinutes(breakTime.getMinutes() + (i + 1) * intervalMinutes);
      
      breakSchedule.scheduledBreaks.push({
        scheduledTime: breakTime,
        estimatedDuration: baseBreakDuration,
        breakType: this.selectBreakType(i, userProfile, sensoryCategoryPreferences),
        intensityLevel: this.selectIntensityLevel(i, userProfile),
        adaptable: true,
        completed: false
      });
    }
    
    return breakSchedule;
  }
  
  /**
   * Get default break schedule
   * @returns {Object} Default break schedule
   */
  getDefaultBreakSchedule() {
    const breakSchedule = {
      baseBreakInterval: 30,
      baseBreakDuration: this.options.defaultBreakDuration,
      scheduledBreaks: [],
      adaptiveRecommendations: false,
      generateDate: new Date()
    };
    
    // Create default scheduled breaks
    for (let i = 0; i < 3; i++) {
      const breakTime = new Date();
      breakTime.setMinutes(breakTime.getMinutes() + (i + 1) * 30);
      
      const breakTypes = ['visual', 'physical', 'cognitive'];
      const intensityLevels = ['light', 'light', 'moderate'];
      
      breakSchedule.scheduledBreaks.push({
        scheduledTime: breakTime,
        estimatedDuration: this.options.defaultBreakDuration,
        breakType: breakTypes[i],
        intensityLevel: intensityLevels[i],
        adaptable: true,
        completed: false
      });
    }
    
    return breakSchedule;
  }
  
  /**
   * Determine sensory preferences from user profile
   * @param {Object} userProfile - User learning profile
   * @returns {Array} Sorted array of sensory categories by preference
   */
  determineSensoryPreferences(userProfile) {
    const sensoryRankings = {
      physical: 1,
      visual: 1,
      auditory: 1,
      tactile: 1,
      cognitive: 1
    };
    
    // Adjust based on neurodivergent type
    if (userProfile.neurodivergentType === 'adhd') {
      sensoryRankings.physical += 2;
      sensoryRankings.tactile += 1;
    } else if (userProfile.neurodivergentType === 'dyslexia') {
      sensoryRankings.auditory += 1;
      sensoryRankings.visual += 1;
    } else if (userProfile.neurodivergentType === 'autism_spectrum') {
      // Depends on sensory profile
      if (userProfile.sensoryPreferences && userProfile.sensoryPreferences.visual) {
        sensoryRankings.visual += 2;
      }
      if (userProfile.sensoryPreferences && userProfile.sensoryPreferences.auditory) {
        sensoryRankings.auditory += 2;
      }
    }
    
    // Adjust based on explicit preferences
    if (userProfile.sensoryPreferences) {
      if (userProfile.sensoryPreferences.movement === 'high') sensoryRankings.physical += 2;
      if (userProfile.sensoryPreferences.visual === 'high') sensoryRankings.visual += 2;
      if (userProfile.sensoryPreferences.auditory === 'high') sensoryRankings.auditory += 2;
      if (userProfile.sensoryPreferences.touch === 'high') sensoryRankings.tactile += 2;
      if (userProfile.sensoryPreferences.cognitive === 'high') sensoryRankings.cognitive += 2;
    }
    
    // Lower rankings for aversions
    if (userProfile.sensoryAversions) {
      if (userProfile.sensoryAversions.includes('movement')) sensoryRankings.physical -= 3;
      if (userProfile.sensoryAversions.includes('visual')) sensoryRankings.visual -= 3;
      if (userProfile.sensoryAversions.includes('auditory')) sensoryRankings.auditory -= 3;
      if (userProfile.sensoryAversions.includes('touch')) sensoryRankings.tactile -= 3;
    }
    
    // Create sorted array of categories
    return Object.entries(sensoryRankings)
      .sort((a, b) => b[1] - a[1]) // Sort by ranking value descending
      .map(entry => entry[0]);      // Return just the category names
  }
  
  /**
   * Select break type for a scheduled break
   * @param {number} breakIndex - Index of the break in the schedule
   * @param {Object} userProfile - User profile
   * @param {Array} sensoryCategoryPreferences - Sorted sensory preferences
   * @returns {string} Selected break type
   */
  selectBreakType(breakIndex, userProfile, sensoryCategoryPreferences) {
    // First break uses highest preference, etc.
    // But we also want some variation
    
    if (breakIndex === 0) {
      // First break - use top preference
      return sensoryCategoryPreferences[0];
    } else if (breakIndex === 1) {
      // Second break - use second preference
      return sensoryCategoryPreferences[1] || sensoryCategoryPreferences[0];
    } else {
      // Later breaks - use varied approach
      // Alternate between top preferences with some randomness
      const randomIndex = Math.floor(Math.random() * 3); // 0, 1, or 2
      return sensoryCategoryPreferences[randomIndex] || sensoryCategoryPreferences[0];
    }
  }
  
  /**
   * Select intensity level for a break
   * @param {number} breakIndex - Index of the break in the schedule
   * @param {Object} userProfile - User profile
   * @returns {string} Selected intensity level
   */
  selectIntensityLevel(breakIndex, userProfile) {
    // Default pattern: start lighter, then increase
    const defaultPattern = ['light', 'moderate', 'moderate'];
    
    // Adjust based on user profile
    if (userProfile.neurodivergentType === 'adhd' && userProfile.energyPattern === 'high') {
      // Higher intensity for high energy ADHD
      return ['moderate', 'deep', 'deep'][breakIndex] || 'moderate';
    } else if (userProfile.sensoryPreferences && userProfile.sensoryPreferences.intensity === 'low') {
      // Always light intensity for those who prefer it
      return 'light';
    } else if (userProfile.sensoryPreferences && userProfile.sensoryPreferences.intensity === 'high') {
      // Higher intensity for those who prefer it
      return ['moderate', 'deep', 'deep'][breakIndex] || 'moderate';
    }
    
    return defaultPattern[breakIndex] || 'moderate';
  }
  
  /**
   * Get a specific break activity recommendation
   * @param {Object} userProfile - User profile
   * @param {Object} currentState - Current user state including estimated cognitive load
   * @returns {Object} Recommended break activity
   */
  getBreakRecommendation(userProfile, currentState = {}) {
    if (!userProfile) {
      return this.getDefaultBreakActivity();
    }
    
    // Get user properties
    const {
      neurodivergentType = 'other',
      sensoryPreferences = {},
      sensoryAversions = [],
      attentionSpan = 'medium',
      energyPattern = 'balanced',
      id: userId
    } = userProfile;
    
    // Determine cognitive load level
    const cognitiveLoad = currentState.cognitiveLoad || 0.5; // default to medium
    let loadLevel;
    
    if (cognitiveLoad >= this.options.cognitiveLoadThresholds.high) {
      loadLevel = 'high';
    } else if (cognitiveLoad >= this.options.cognitiveLoadThresholds.medium) {
      loadLevel = 'medium';
    } else {
      loadLevel = 'low';
    }
    
    // Determine if user needs energizing or calming
    let needsEnergizing = false;
    
    if (currentState.energyLevel && currentState.energyLevel < 0.4) {
      needsEnergizing = true;
    } else if (energyPattern === 'low') {
      needsEnergizing = true;
    }
    
    // Determine sensory preferences
    const sensoryCategoryPreferences = this.determineSensoryPreferences(userProfile);
    
    // Determine break category based on load and needs
    let breakCategory;
    let intensityLevel;
    
    if (loadLevel === 'high') {
      // High cognitive load - needs significant reset
      if (needsEnergizing) {
        // Physical break to re-energize
        breakCategory = 'physical';
        intensityLevel = 'moderate';
      } else {
        // Significant calming break
        breakCategory = sensoryCategoryPreferences[0]; // Use preferred sense
        intensityLevel = 'deep';
      }
    } else if (loadLevel === 'medium') {
      // Medium load - needs moderate break
      if (needsEnergizing) {
        // Moderate physical or preferred sensory
        breakCategory = Math.random() > 0.5 ? 'physical' : sensoryCategoryPreferences[0];
        intensityLevel = 'moderate';
      } else {
        // Moderate calming
        breakCategory = sensoryCategoryPreferences[0];
        intensityLevel = 'moderate';
      }
    } else {
      // Low load - lighter break
      breakCategory = sensoryCategoryPreferences[0];
      intensityLevel = 'light';
    }
    
    // Check for aversions
    if (sensoryAversions && sensoryAversions.includes(breakCategory)) {
      // Use second preference if first is an aversion
      breakCategory = sensoryCategoryPreferences[1] || 'cognitive';
    }
    
    // Get activities for the selected category and intensity
    const categoryActivities = this.breakActivities[breakCategory][intensityLevel];
    
    // If user has break history, avoid repeating recent breaks
    const userHistory = this.userBreakHistory.get(userId);
    let filteredActivities = categoryActivities;
    
    if (userHistory && userHistory.length > 0) {
      const recentBreakIds = userHistory.slice(0, 3).map(record => record.activityId);
      filteredActivities = categoryActivities.filter(activity => !recentBreakIds.includes(activity.id));
      
      // If filtering removes all options, use original list
      if (filteredActivities.length === 0) {
        filteredActivities = categoryActivities;
      }
    }
    
    // Select a random activity from the filtered list
    const selectedActivity = filteredActivities[Math.floor(Math.random() * filteredActivities.length)];
    
    // Create break recommendation
    const breakRecommendation = {
      activity: selectedActivity,
      recommendedTime: new Date(),
      basedOn: {
        cognitiveLoad: loadLevel,
        needsEnergizing,
        preferredSensoryChannel: breakCategory,
        neurodivergentType
      },
      estimatedBenefits: selectedActivity.benefits,
      alternatives: this.getAlternativeActivities(selectedActivity, breakCategory, intensityLevel)
    };
    
    // Record in user history
    this.recordBreakActivity(userId, selectedActivity.id, breakCategory, intensityLevel);
    
    return breakRecommendation;
  }
  
  /**
   * Get default break activity
   * @returns {Object} Default break activity
   */
  getDefaultBreakActivity() {
    // Simple activity that works for most users
    const defaultActivity = this.breakActivities.cognitive.light[0];
    
    return {
      activity: defaultActivity,
      recommendedTime: new Date(),
      basedOn: {
        cognitiveLoad: 'medium',
        needsEnergizing: false,
        preferredSensoryChannel: 'cognitive',
        neurodivergentType: 'other'
      },
      estimatedBenefits: defaultActivity.benefits,
      alternatives: this.getAlternativeActivities(defaultActivity, 'cognitive', 'light')
    };
  }
  
  /**
   * Get alternative activities
   * @param {Object} selectedActivity - Currently selected activity
   * @param {string} category - Break category
   * @param {string} intensity - Intensity level
   * @returns {Array} Alternative activities
   */
  getAlternativeActivities(selectedActivity, category, intensity) {
    const alternatives = [];
    
    // Add another from same category but different intensity
    const alternateIntensity = intensity === 'light' ? 'moderate' : 'light';
    const sameTypeActivity = this.breakActivities[category][alternateIntensity][0];
    if (sameTypeActivity && sameTypeActivity.id !== selectedActivity.id) {
      alternatives.push(sameTypeActivity);
    }
    
    // Add one from a different category
    const alternateCategory = category === 'physical' ? 'cognitive' : 'physical';
    const differentTypeActivity = this.breakActivities[alternateCategory][intensity][0];
    if (differentTypeActivity) {
      alternatives.push(differentTypeActivity);
    }
    
    return alternatives;
  }
  
  /**
   * Record break activity in user history
   * @param {string|number} userId - User identifier
   * @param {string} activityId - Activity identifier
   * @param {string} category - Break category
   * @param {string} intensity - Intensity level
   */
  recordBreakActivity(userId, activityId, category, intensity) {
    if (!userId) return;
    
    // Get or create user history
    if (!this.userBreakHistory.has(userId)) {
      this.userBreakHistory.set(userId, []);
    }
    
    const userHistory = this.userBreakHistory.get(userId);
    
    // Add new activity at beginning of array
    userHistory.unshift({
      activityId,
      category,
      intensity,
      timestamp: new Date()
    });
    
    // Limit history size
    if (userHistory.length > 10) {
      userHistory.pop();
    }
  }
  
  /**
   * Recommend a break schedule adjustment based on performance metrics
   * @param {Object} userProfile - User profile
   * @param {Object} performanceData - Performance data
   * @returns {Object} Break schedule adjustment recommendation
   */
  recommendScheduleAdjustment(userProfile, performanceData) {
    if (!userProfile || !performanceData) {
      return { adjustment: 'none', reason: 'Insufficient data' };
    }
    
    // Extract performance indicators
    const {
      attentionLapses = 0,
      completionTime = 0,
      expectedTime = 0,
      errorRate = 0,
      perceivedEffort = 0
    } = performanceData;
    
    // Calculate performance factors
    const timeRatio = expectedTime > 0 ? completionTime / expectedTime : 1;
    const effortFactor = perceivedEffort / 10; // Normalize to 0-1
    
    // Determine if user needs more frequent breaks
    let needsMoreFrequentBreaks = false;
    let needsShorterWorkPeriods = false;
    
    if (attentionLapses > 3 || timeRatio > 1.25 || errorRate > 0.2 || effortFactor > 0.8) {
      needsMoreFrequentBreaks = true;
    }
    
    if (attentionLapses > 5 || timeRatio > 1.5 || errorRate > 0.3) {
      needsShorterWorkPeriods = true;
    }
    
    // Generate recommendation
    let recommendation;
    
    if (needsShorterWorkPeriods) {
      recommendation = {
        adjustment: 'significant_increase',
        breakFrequencyChange: -10, // Reduce time between breaks by 10 minutes
        breakDurationChange: 1,    // Increase break duration by 1 minute
        reason: 'Performance metrics indicate significant fatigue or attention issues'
      };
    } else if (needsMoreFrequentBreaks) {
      recommendation = {
        adjustment: 'moderate_increase',
        breakFrequencyChange: -5,  // Reduce time between breaks by 5 minutes
        breakDurationChange: 0,    // Keep break duration the same
        reason: 'Performance metrics indicate moderate fatigue or attention issues'
      };
    } else if (timeRatio < 0.75 && errorRate < 0.1 && attentionLapses < 2) {
      // Performance is very good
      recommendation = {
        adjustment: 'slight_decrease',
        breakFrequencyChange: 5,   // Increase time between breaks by 5 minutes
        breakDurationChange: 0,    // Keep break duration the same
        reason: 'Performance metrics indicate good focus and efficiency'
      };
    } else {
      // Performance is within acceptable range
      recommendation = {
        adjustment: 'none',
        breakFrequencyChange: 0,
        breakDurationChange: 0,
        reason: 'Performance metrics within expected ranges'
      };
    }
    
    // Add user-specific context
    recommendation.userContext = {
      neurodivergentType: userProfile.neurodivergentType,
      attentionSpan: userProfile.attentionSpan,
      currentBreakInterval: userProfile.breakSchedule ? userProfile.breakSchedule.baseBreakInterval : 30
    };
    
    return recommendation;
  }
  
  /**
   * Track break effectiveness
   * @param {string|number} userId - User identifier
   * @param {string} activityId - Activity identifier
   * @param {Object} feedback - User feedback
   * @returns {boolean} Success status
   */
  trackBreakEffectiveness(userId, activityId, feedback) {
    if (!userId || !activityId || !feedback) {
      return false;
    }
    
    // In a real implementation, this would store the feedback
    // in a database to improve future recommendations
    
    // Update effectiveness in memory for now
    if (!this.breakEffectiveness) {
      this.breakEffectiveness = new Map();
    }
    
    if (!this.breakEffectiveness.has(activityId)) {
      this.breakEffectiveness.set(activityId, []);
    }
    
    const activityFeedback = this.breakEffectiveness.get(activityId);
    
    activityFeedback.push({
      userId,
      rating: feedback.rating,
      refreshed: feedback.refreshed,
      focusImproved: feedback.focusImproved,
      comments: feedback.comments,
      timestamp: new Date()
    });
    
    return true;
  }
}

module.exports = SensoryBreakSystem;