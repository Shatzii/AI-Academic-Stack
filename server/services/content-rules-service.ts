/**
 * Content Rules Service
 * 
 * This service generates content selection and adaptation rules based on learning profiles.
 * These rules are used to guide the AI content generation system in creating
 * personalized curriculum content for students.
 */

import { 
  LearningProfile, 
  LearningStyle, 
  Neurotype, 
  AdaptationLevel,
  AdaptationCategory,
  getContentAdaptationRecommendations
} from './learning-profile-service';

/**
 * Content rule type definitions
 */
export enum ContentFormat {
  TEXT = 'text',
  VISUAL = 'visual',
  AUDIO = 'audio',
  VIDEO = 'video',
  INTERACTIVE = 'interactive'
}

export enum ContentComplexity {
  FOUNDATIONAL = 'foundational',
  STANDARD = 'standard',
  ADVANCED = 'advanced',
  CHALLENGE = 'challenge'
}

export enum ContentPace {
  DELIBERATE = 'deliberate',
  STANDARD = 'standard',
  ACCELERATED = 'accelerated'
}

export enum PresentationStyle {
  DIRECT = 'direct',                // Clear, straightforward presentation
  NARRATIVE = 'narrative',          // Story-based presentation
  EXPLORATORY = 'exploratory',      // Discovery-based presentation
  SEQUENTIAL = 'sequential',        // Step-by-step presentation
  CONCEPTUAL = 'conceptual'         // Big picture, concept-focused presentation
}

/**
 * Content selection rules interface
 */
export interface ContentRules {
  userId: number;
  primaryFormat: ContentFormat;
  supportFormats: ContentFormat[];
  complexity: ContentComplexity;
  pace: ContentPace;
  presentationStyle: PresentationStyle;
  textAdaptations: {
    font: string;
    fontSize: string;
    lineSpacing: string;
    paragraphSpacing: string;
    alignment: string;
    color: boolean;
    highlighting: boolean;
    useReadingGuides: boolean;
  };
  visualAdaptations: {
    useDiagrams: boolean;
    useCharts: boolean;
    useInfographics: boolean;
    colorCoding: boolean;
    reducedComplexity: boolean;
    visualSchedules: boolean;
  };
  audioAdaptations: {
    provideAudioVersions: boolean;
    speechRate: string;
    useBackgroundMusic: boolean;
    emphasizeKeyInformation: boolean;
  };
  interactiveAdaptations: {
    requireHandsOn: boolean;
    includeGameElements: boolean;
    allowExploratoryLearning: boolean;
    provideSimulations: boolean;
  };
  organizationalAdaptations: {
    chunkInformation: boolean;
    provideOutlines: boolean;
    useCheckpoints: boolean;
    breakComplexTasks: boolean;
  };
  focusAdaptations: {
    minimizeDistractingElements: boolean;
    useTimers: boolean;
    provideBreakReminders: boolean;
    emphasizeImportantContent: boolean;
  };
  tier: string; // Free, Standard, Premium
  lastUpdated: Date;
}

/**
 * Generate content selection rules based on a user's learning profile
 * @param userId User ID
 * @param profile Learning profile
 * @param contentType Type of content (e.g., lesson, assessment, practice)
 * @param subject Subject area
 * @param gradeLevel Grade level
 * @param tier Subscription tier (Basic, Standard, Premium)
 * @returns Content selection rules
 */
export async function generateContentRules(
  userId: number,
  profile: LearningProfile,
  contentType: string,
  subject: string,
  gradeLevel: string,
  tier: string
): Promise<ContentRules> {
  try {
    // Get content-specific adaptation recommendations
    const adaptations = await getContentAdaptationRecommendations(
      userId,
      contentType,
      subject
    );

    // Determine primary format based on learning style
    const primaryFormat = determineContentFormat(profile.primaryStyle);
    
    // Determine supporting formats
    const supportFormats = determineSupportFormats(
      profile.primaryStyle, 
      profile.secondaryStyle,
      profile.contentPreferences
    );
    
    // Determine content complexity based on grade level and adaptation level
    const complexity = determineContentComplexity(gradeLevel, profile.adaptationLevel);
    
    // Determine content pace based on neurotype and adaptation level
    const pace = determineContentPace(profile.neurotype, profile.adaptationLevel);
    
    // Determine presentation style based on learning style and neurotype
    const presentationStyle = determinePresentationStyle(
      profile.primaryStyle, 
      profile.neurotype
    );
    
    // Create text adaptations based on profile and adaptation recommendations
    const textAdaptations = createTextAdaptations(
      profile,
      adaptations
    );
    
    // Create visual adaptations
    const visualAdaptations = createVisualAdaptations(
      profile,
      adaptations
    );
    
    // Create audio adaptations
    const audioAdaptations = createAudioAdaptations(
      profile,
      adaptations
    );
    
    // Create interactive adaptations
    const interactiveAdaptations = createInteractiveAdaptations(
      profile,
      adaptations
    );
    
    // Create organizational adaptations
    const organizationalAdaptations = createOrganizationalAdaptations(
      profile,
      adaptations
    );
    
    // Create focus adaptations
    const focusAdaptations = createFocusAdaptations(
      profile,
      adaptations
    );
    
    // Compile the complete content rules
    const contentRules: ContentRules = {
      userId,
      primaryFormat,
      supportFormats,
      complexity,
      pace,
      presentationStyle,
      textAdaptations,
      visualAdaptations,
      audioAdaptations,
      interactiveAdaptations,
      organizationalAdaptations,
      focusAdaptations,
      tier,
      lastUpdated: new Date()
    };
    
    return contentRules;
  } catch (error) {
    console.error('Error generating content rules:', error);
    throw error;
  }
}

/**
 * Determine the primary content format based on learning style
 * @param learningStyle Primary learning style
 * @returns Primary content format
 */
function determineContentFormat(learningStyle: LearningStyle): ContentFormat {
  switch (learningStyle) {
    case LearningStyle.VISUAL:
      return ContentFormat.VISUAL;
    case LearningStyle.AUDITORY:
      return ContentFormat.AUDIO;
    case LearningStyle.KINESTHETIC:
      return ContentFormat.INTERACTIVE;
    case LearningStyle.READING_WRITING:
      return ContentFormat.TEXT;
    default:
      return ContentFormat.TEXT;
  }
}

/**
 * Determine supporting content formats
 * @param primaryStyle Primary learning style
 * @param secondaryStyle Secondary learning style
 * @param contentPreferences Content preferences
 * @returns Array of supporting content formats
 */
function determineSupportFormats(
  primaryStyle: LearningStyle,
  secondaryStyle: LearningStyle | null,
  contentPreferences: LearningProfile['contentPreferences']
): ContentFormat[] {
  const supportFormats: ContentFormat[] = [];
  const threshold = 5; // Minimum preference score to include a format
  
  // Add format based on secondary learning style
  if (secondaryStyle) {
    supportFormats.push(determineContentFormat(secondaryStyle));
  }
  
  // Add formats based on content preferences
  if (contentPreferences.visualElements >= threshold && 
      primaryStyle !== LearningStyle.VISUAL) {
    supportFormats.push(ContentFormat.VISUAL);
  }
  
  if (contentPreferences.audioElements >= threshold && 
      primaryStyle !== LearningStyle.AUDITORY) {
    supportFormats.push(ContentFormat.AUDIO);
  }
  
  if (contentPreferences.textElements >= threshold && 
      primaryStyle !== LearningStyle.READING_WRITING) {
    supportFormats.push(ContentFormat.TEXT);
  }
  
  if (contentPreferences.interactiveElements >= threshold && 
      primaryStyle !== LearningStyle.KINESTHETIC) {
    supportFormats.push(ContentFormat.INTERACTIVE);
  }
  
  // Always include video as a support format if visual or auditory is primary
  // and the other is not already included
  if ((primaryStyle === LearningStyle.VISUAL || primaryStyle === LearningStyle.AUDITORY) &&
      !supportFormats.includes(ContentFormat.VIDEO)) {
    supportFormats.push(ContentFormat.VIDEO);
  }
  
  // Remove duplicates
  return [...new Set(supportFormats)];
}

/**
 * Determine content complexity based on grade level and adaptation level
 * @param gradeLevel Grade level
 * @param adaptationLevel Adaptation level
 * @returns Content complexity
 */
function determineContentComplexity(
  gradeLevel: string,
  adaptationLevel: AdaptationLevel
): ContentComplexity {
  // Parse grade level
  const gradeNumber = parseInt(gradeLevel.replace(/\D/g, ''));
  
  // Base complexity on grade level
  let baseComplexity: ContentComplexity;
  if (gradeNumber <= 2) {
    baseComplexity = ContentComplexity.FOUNDATIONAL;
  } else if (gradeNumber <= 5) {
    baseComplexity = ContentComplexity.STANDARD;
  } else if (gradeNumber <= 8) {
    baseComplexity = ContentComplexity.ADVANCED;
  } else {
    baseComplexity = ContentComplexity.CHALLENGE;
  }
  
  // Adjust based on adaptation level
  if (adaptationLevel === AdaptationLevel.SIGNIFICANT) {
    // Step down complexity for significant adaptations
    switch (baseComplexity) {
      case ContentComplexity.CHALLENGE:
        return ContentComplexity.ADVANCED;
      case ContentComplexity.ADVANCED:
        return ContentComplexity.STANDARD;
      case ContentComplexity.STANDARD:
        return ContentComplexity.FOUNDATIONAL;
      default:
        return ContentComplexity.FOUNDATIONAL;
    }
  } else if (adaptationLevel === AdaptationLevel.MODERATE) {
    // Minor adjustment for moderate adaptations
    return baseComplexity;
  } else {
    // No adjustment for minimal adaptations
    return baseComplexity;
  }
}

/**
 * Determine content pace based on neurotype and adaptation level
 * @param neurotype Neurotype
 * @param adaptationLevel Adaptation level
 * @returns Content pace
 */
function determineContentPace(
  neurotype: Neurotype,
  adaptationLevel: AdaptationLevel
): ContentPace {
  if (adaptationLevel === AdaptationLevel.SIGNIFICANT) {
    return ContentPace.DELIBERATE;
  }
  
  switch (neurotype) {
    case Neurotype.DYSLEXIA:
      return adaptationLevel === AdaptationLevel.MODERATE ? 
        ContentPace.DELIBERATE : ContentPace.STANDARD;
      
    case Neurotype.AUTISM_SPECTRUM:
      // Some students with autism may prefer a deliberate pace
      return adaptationLevel === AdaptationLevel.MODERATE ? 
        ContentPace.DELIBERATE : ContentPace.STANDARD;
      
    case Neurotype.ADHD:
      // Some students with ADHD may benefit from accelerated pace
      // to maintain engagement, unless adaptations are moderate
      return adaptationLevel === AdaptationLevel.MODERATE ? 
        ContentPace.STANDARD : ContentPace.ACCELERATED;
      
    case Neurotype.NEUROTYPICAL:
      return ContentPace.STANDARD;
      
    default:
      return ContentPace.STANDARD;
  }
}

/**
 * Determine presentation style based on learning style and neurotype
 * @param learningStyle Learning style
 * @param neurotype Neurotype
 * @returns Presentation style
 */
function determinePresentationStyle(
  learningStyle: LearningStyle,
  neurotype: Neurotype
): PresentationStyle {
  // Base presentation style on learning style
  let baseStyle: PresentationStyle;
  
  switch (learningStyle) {
    case LearningStyle.VISUAL:
      baseStyle = PresentationStyle.CONCEPTUAL; // Visual learners often prefer big picture
      break;
      
    case LearningStyle.AUDITORY:
      baseStyle = PresentationStyle.NARRATIVE; // Auditory learners often prefer story-based
      break;
      
    case LearningStyle.KINESTHETIC:
      baseStyle = PresentationStyle.EXPLORATORY; // Kinesthetic learners often prefer discovery
      break;
      
    case LearningStyle.READING_WRITING:
      baseStyle = PresentationStyle.SEQUENTIAL; // Reading/writing learners often prefer logical steps
      break;
      
    default:
      baseStyle = PresentationStyle.DIRECT;
  }
  
  // Adjust based on neurotype
  switch (neurotype) {
    case Neurotype.DYSLEXIA:
      // Dyslexic students often benefit from sequential, direct presentation
      return PresentationStyle.SEQUENTIAL;
      
    case Neurotype.ADHD:
      // Students with ADHD often benefit from narrative or exploratory styles
      // to maintain engagement, unless base style is already one of these
      return (baseStyle === PresentationStyle.SEQUENTIAL || baseStyle === PresentationStyle.DIRECT) ? 
        PresentationStyle.NARRATIVE : baseStyle;
      
    case Neurotype.AUTISM_SPECTRUM:
      // Students with autism often benefit from direct, sequential presentation
      return PresentationStyle.SEQUENTIAL;
      
    default:
      return baseStyle;
  }
}

/**
 * Create text adaptations based on profile and recommendations
 * @param profile Learning profile
 * @param adaptations Adaptation recommendations
 * @returns Text adaptations
 */
function createTextAdaptations(
  profile: LearningProfile,
  adaptations: any
): ContentRules['textAdaptations'] {
  const textAdaptations: ContentRules['textAdaptations'] = {
    font: 'standard',
    fontSize: 'medium',
    lineSpacing: 'normal',
    paragraphSpacing: 'normal',
    alignment: 'left',
    color: false,
    highlighting: false,
    useReadingGuides: false
  };
  
  // Apply adaptations based on neurotype
  if (profile.neurotype === Neurotype.DYSLEXIA) {
    textAdaptations.font = 'dyslexic-friendly';
    textAdaptations.fontSize = 'large';
    textAdaptations.lineSpacing = 'increased';
    textAdaptations.paragraphSpacing = 'increased';
    textAdaptations.color = true;
    textAdaptations.highlighting = true;
    textAdaptations.useReadingGuides = true;
  }
  
  // Apply adaptations based on learning style
  if (profile.primaryStyle === LearningStyle.VISUAL) {
    textAdaptations.color = true;
    textAdaptations.highlighting = true;
  }
  
  // Check for specific text presentation adaptations in the profile
  const textPresentationAdaptations = 
    profile.adaptations[AdaptationCategory.TEXT_PRESENTATION];
  
  if (textPresentationAdaptations && textPresentationAdaptations.required) {
    // Apply more specific adaptations if required
    textAdaptations.fontSize = 'large';
    textAdaptations.lineSpacing = 'increased';
  }
  
  return textAdaptations;
}

/**
 * Create visual adaptations based on profile and recommendations
 * @param profile Learning profile
 * @param adaptations Adaptation recommendations
 * @returns Visual adaptations
 */
function createVisualAdaptations(
  profile: LearningProfile,
  adaptations: any
): ContentRules['visualAdaptations'] {
  const visualAdaptations: ContentRules['visualAdaptations'] = {
    useDiagrams: false,
    useCharts: false,
    useInfographics: false,
    colorCoding: false,
    reducedComplexity: false,
    visualSchedules: false
  };
  
  // Apply adaptations based on learning style
  if (profile.primaryStyle === LearningStyle.VISUAL) {
    visualAdaptations.useDiagrams = true;
    visualAdaptations.useCharts = true;
    visualAdaptations.useInfographics = true;
    visualAdaptations.colorCoding = true;
  } else if (profile.secondaryStyle === LearningStyle.VISUAL) {
    visualAdaptations.useDiagrams = true;
    visualAdaptations.colorCoding = true;
  }
  
  // Apply adaptations based on neurotype
  if (profile.neurotype === Neurotype.AUTISM_SPECTRUM) {
    visualAdaptations.reducedComplexity = true;
    visualAdaptations.visualSchedules = true;
  } else if (profile.neurotype === Neurotype.ADHD) {
    visualAdaptations.colorCoding = true;
  }
  
  // Consider content preferences
  if (profile.contentPreferences.visualElements >= 7) {
    visualAdaptations.useDiagrams = true;
    visualAdaptations.useCharts = true;
    visualAdaptations.useInfographics = true;
  }
  
  return visualAdaptations;
}

/**
 * Create audio adaptations based on profile and recommendations
 * @param profile Learning profile
 * @param adaptations Adaptation recommendations
 * @returns Audio adaptations
 */
function createAudioAdaptations(
  profile: LearningProfile,
  adaptations: any
): ContentRules['audioAdaptations'] {
  const audioAdaptations: ContentRules['audioAdaptations'] = {
    provideAudioVersions: false,
    speechRate: 'normal',
    useBackgroundMusic: false,
    emphasizeKeyInformation: false
  };
  
  // Apply adaptations based on learning style
  if (profile.primaryStyle === LearningStyle.AUDITORY) {
    audioAdaptations.provideAudioVersions = true;
    audioAdaptations.emphasizeKeyInformation = true;
  } else if (profile.secondaryStyle === LearningStyle.AUDITORY) {
    audioAdaptations.provideAudioVersions = true;
  }
  
  // Apply adaptations based on neurotype
  if (profile.neurotype === Neurotype.DYSLEXIA) {
    audioAdaptations.provideAudioVersions = true;
    audioAdaptations.speechRate = 'slower';
    audioAdaptations.emphasizeKeyInformation = true;
  } else if (profile.neurotype === Neurotype.ADHD) {
    audioAdaptations.emphasizeKeyInformation = true;
  }
  
  // Consider content preferences
  if (profile.contentPreferences.audioElements >= 7) {
    audioAdaptations.provideAudioVersions = true;
  }
  
  return audioAdaptations;
}

/**
 * Create interactive adaptations based on profile and recommendations
 * @param profile Learning profile
 * @param adaptations Adaptation recommendations
 * @returns Interactive adaptations
 */
function createInteractiveAdaptations(
  profile: LearningProfile,
  adaptations: any
): ContentRules['interactiveAdaptations'] {
  const interactiveAdaptations: ContentRules['interactiveAdaptations'] = {
    requireHandsOn: false,
    includeGameElements: false,
    allowExploratoryLearning: false,
    provideSimulations: false
  };
  
  // Apply adaptations based on learning style
  if (profile.primaryStyle === LearningStyle.KINESTHETIC) {
    interactiveAdaptations.requireHandsOn = true;
    interactiveAdaptations.includeGameElements = true;
    interactiveAdaptations.allowExploratoryLearning = true;
    interactiveAdaptations.provideSimulations = true;
  } else if (profile.secondaryStyle === LearningStyle.KINESTHETIC) {
    interactiveAdaptations.includeGameElements = true;
    interactiveAdaptations.provideSimulations = true;
  }
  
  // Apply adaptations based on neurotype
  if (profile.neurotype === Neurotype.ADHD) {
    interactiveAdaptations.includeGameElements = true;
    interactiveAdaptations.allowExploratoryLearning = true;
  }
  
  // Consider content preferences
  if (profile.contentPreferences.interactiveElements >= 7) {
    interactiveAdaptations.requireHandsOn = true;
    interactiveAdaptations.includeGameElements = true;
  }
  
  // Check for specific interactive adaptations in the profile
  const interactiveElementAdaptations = 
    profile.adaptations[AdaptationCategory.INTERACTIVE_ELEMENTS];
  
  if (interactiveElementAdaptations && interactiveElementAdaptations.required) {
    interactiveAdaptations.requireHandsOn = true;
  }
  
  return interactiveAdaptations;
}

/**
 * Create organizational adaptations based on profile and recommendations
 * @param profile Learning profile
 * @param adaptations Adaptation recommendations
 * @returns Organizational adaptations
 */
function createOrganizationalAdaptations(
  profile: LearningProfile,
  adaptations: any
): ContentRules['organizationalAdaptations'] {
  const organizationalAdaptations: ContentRules['organizationalAdaptations'] = {
    chunkInformation: false,
    provideOutlines: false,
    useCheckpoints: false,
    breakComplexTasks: false
  };
  
  // Apply adaptations based on neurotype
  if (profile.neurotype === Neurotype.ADHD) {
    organizationalAdaptations.chunkInformation = true;
    organizationalAdaptations.useCheckpoints = true;
    organizationalAdaptations.breakComplexTasks = true;
  } else if (profile.neurotype === Neurotype.DYSLEXIA) {
    organizationalAdaptations.chunkInformation = true;
    organizationalAdaptations.provideOutlines = true;
  } else if (profile.neurotype === Neurotype.AUTISM_SPECTRUM) {
    organizationalAdaptations.provideOutlines = true;
    organizationalAdaptations.chunkInformation = true;
  }
  
  // Apply adaptations based on adaptation level
  if (profile.adaptationLevel === AdaptationLevel.SIGNIFICANT) {
    organizationalAdaptations.chunkInformation = true;
    organizationalAdaptations.provideOutlines = true;
    organizationalAdaptations.useCheckpoints = true;
    organizationalAdaptations.breakComplexTasks = true;
  } else if (profile.adaptationLevel === AdaptationLevel.MODERATE) {
    organizationalAdaptations.chunkInformation = true;
    organizationalAdaptations.provideOutlines = true;
  }
  
  // Check for specific content organization adaptations in the profile
  const contentOrganizationAdaptations = 
    profile.adaptations[AdaptationCategory.CONTENT_ORGANIZATION];
  
  if (contentOrganizationAdaptations && contentOrganizationAdaptations.required) {
    organizationalAdaptations.chunkInformation = true;
    organizationalAdaptations.provideOutlines = true;
  }
  
  return organizationalAdaptations;
}

/**
 * Create focus adaptations based on profile and recommendations
 * @param profile Learning profile
 * @param adaptations Adaptation recommendations
 * @returns Focus adaptations
 */
function createFocusAdaptations(
  profile: LearningProfile,
  adaptations: any
): ContentRules['focusAdaptations'] {
  const focusAdaptations: ContentRules['focusAdaptations'] = {
    minimizeDistractingElements: false,
    useTimers: false,
    provideBreakReminders: false,
    emphasizeImportantContent: false
  };
  
  // Apply adaptations based on neurotype
  if (profile.neurotype === Neurotype.ADHD) {
    focusAdaptations.minimizeDistractingElements = true;
    focusAdaptations.useTimers = true;
    focusAdaptations.provideBreakReminders = true;
    focusAdaptations.emphasizeImportantContent = true;
  } else if (profile.neurotype === Neurotype.AUTISM_SPECTRUM) {
    focusAdaptations.minimizeDistractingElements = true;
  }
  
  // Apply adaptations based on adaptation level
  if (profile.adaptationLevel === AdaptationLevel.SIGNIFICANT) {
    focusAdaptations.minimizeDistractingElements = true;
    focusAdaptations.emphasizeImportantContent = true;
  }
  
  // Check for specific focus support adaptations in the profile
  const focusSupportsAdaptations = 
    profile.adaptations[AdaptationCategory.FOCUS_SUPPORTS];
  
  if (focusSupportsAdaptations && focusSupportsAdaptations.required) {
    focusAdaptations.minimizeDistractingElements = true;
    focusAdaptations.useTimers = profile.neurotype === Neurotype.ADHD;
    focusAdaptations.provideBreakReminders = profile.neurotype === Neurotype.ADHD;
  }
  
  return focusAdaptations;
}

/**
 * Get content rules for a specific content request
 * @param userId User ID
 * @param contentType Type of content 
 * @param subject Subject area
 * @param gradeLevel Grade level
 * @param tier Subscription tier
 * @returns Promise with content rules
 */
export async function getContentRules(
  userId: number,
  contentType: string,
  subject: string,
  gradeLevel: string,
  tier: string
): Promise<ContentRules | null> {
  try {
    // Placeholder for implementation that would fetch profile and generate rules
    // In a real implementation, this would check for cached rules and regenerate as needed
    
    return null;
  } catch (error) {
    console.error('Error getting content rules:', error);
    return null;
  }
}