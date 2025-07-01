/**
 * AI Content Generation Service
 * 
 * This service handles the generation of personalized educational content
 * based on learning profiles and content rules. It implements tiered 
 * content generation capabilities based on the user's subscription level.
 */

import Anthropic from '@anthropic-ai/sdk';
import { 
  ContentRules, 
  ContentFormat, 
  ContentComplexity, 
  ContentPace,
  PresentationStyle
} from './content-rules-service';
import { 
  LearningProfile, 
  LearningStyle, 
  Neurotype, 
  AdaptationLevel 
} from './learning-profile-service';

// Initialize Anthropic client
// the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Content generation tier limits
 */
export const TIER_LIMITS = {
  basic: {
    maxTokens: 2000,
    maxRequests: 50,
    allowDeepResearch: false,
    allowMultimodal: false,
    allowComplexContent: false
  },
  standard: {
    maxTokens: 4000,
    maxRequests: 500,
    allowDeepResearch: false,
    allowMultimodal: true,
    allowComplexContent: true
  },
  premium: {
    maxTokens: 10000,
    maxRequests: 10000, // Effectively unlimited
    allowDeepResearch: true,
    allowMultimodal: true,
    allowComplexContent: true
  }
};

/**
 * Subject area curriculum standards
 */
export interface CurriculumStandards {
  subject: string;
  gradeLevel: string;
  standards: {
    id: string;
    description: string;
    objectives: string[];
  }[];
}

/**
 * Generated content interface
 */
export interface GeneratedContent {
  contentId: string;
  userId: number;
  title: string;
  subject: string;
  gradeLevel: string;
  contentType: string;
  primaryFormat: ContentFormat;
  sections: {
    title: string;
    content: string;
    format: ContentFormat;
    adaptations: string[];
  }[];
  adaptations: string[];
  metadata: {
    generatedAt: Date;
    tier: string;
    targetNeurotype: Neurotype;
    primaryLearningStyle: LearningStyle;
    curriculumStandards: string[];
  };
  deepResearchSources?: {
    title: string;
    url: string;
    relevance: string;
  }[];
}

/**
 * Generate personalized content for a user
 * @param userId User ID
 * @param profile Learning profile
 * @param contentRules Content rules
 * @param contentRequest Content request parameters
 * @returns Promise with generated content
 */
export async function generateContent(
  userId: number,
  profile: LearningProfile,
  contentRules: ContentRules,
  contentRequest: {
    subject: string;
    gradeLevel: string;
    contentType: string;
    topic: string;
    learningObjectives: string[];
    tier: string;
  }
): Promise<GeneratedContent> {
  try {
    // Retrieve curriculum standards for the subject and grade level
    const curriculumStandards = await getCurriculumStandards(
      contentRequest.subject,
      contentRequest.gradeLevel
    );
    
    // Apply tier limits
    const tierKey = contentRequest.tier.toLowerCase() as keyof typeof TIER_LIMITS;
    const tierLimits = TIER_LIMITS[tierKey] || TIER_LIMITS.basic;
    
    // Generate the content prompt based on profile, rules, and request
    const { prompt, systemPrompt } = generateContentPrompt(
      profile,
      contentRules,
      contentRequest,
      curriculumStandards,
      tierLimits
    );
    
    // Generate content using AI
    const content = await generateAIContent(
      prompt,
      systemPrompt,
      tierLimits
    );
    
    // Process and structure the generated content
    const structuredContent = processGeneratedContent(
      content,
      contentRequest,
      profile,
      contentRules,
      tierLimits
    );
    
    // If deep research is allowed and requested, add research sources
    if (tierLimits.allowDeepResearch && contentRequest.tier === 'premium') {
      structuredContent.deepResearchSources = await performDeepResearch(
        contentRequest.topic,
        contentRequest.subject
      );
    }
    
    return structuredContent;
  } catch (error) {
    console.error('Error generating content:', error);
    throw error;
  }
}

/**
 * Get curriculum standards for subject and grade level
 * @param subject Subject area
 * @param gradeLevel Grade level
 * @returns Promise with curriculum standards
 */
async function getCurriculumStandards(
  subject: string,
  gradeLevel: string
): Promise<CurriculumStandards | null> {
  // In a real implementation, this would fetch standards from a database
  // This is a placeholder implementation
  
  return {
    subject,
    gradeLevel,
    standards: [
      {
        id: `${subject}-${gradeLevel}-1`,
        description: `Understanding core concepts in ${subject} at grade ${gradeLevel}`,
        objectives: [
          `Demonstrate understanding of key ${subject} concepts appropriate for grade ${gradeLevel}`,
          `Apply ${subject} knowledge to solve grade-appropriate problems`
        ]
      },
      {
        id: `${subject}-${gradeLevel}-2`,
        description: `Critical thinking in ${subject} at grade ${gradeLevel}`,
        objectives: [
          `Analyze ${subject} scenarios using critical thinking skills`,
          `Evaluate different approaches to solving ${subject} problems`
        ]
      }
    ]
  };
}

/**
 * Generate content prompt for AI
 * @param profile Learning profile
 * @param contentRules Content rules
 * @param contentRequest Content request
 * @param curriculumStandards Curriculum standards
 * @param tierLimits Tier limits
 * @returns Object with prompt and system prompt
 */
function generateContentPrompt(
  profile: LearningProfile,
  contentRules: ContentRules,
  contentRequest: {
    subject: string;
    gradeLevel: string;
    contentType: string;
    topic: string;
    learningObjectives: string[];
    tier: string;
  },
  curriculumStandards: CurriculumStandards | null,
  tierLimits: typeof TIER_LIMITS.basic
): { prompt: string; systemPrompt: string } {
  // System prompt provides guidelines for the AI about how to generate content
  const systemPrompt = `You are an expert educational content creator specializing in creating personalized learning materials for neurodivergent students. 
Your task is to create educational content that is specifically adapted to the student's learning style and neurotype.

Follow these key guidelines:
1. Create content that aligns with the specific learning style and neurotype adaptations requested
2. Maintain educational rigor while making content accessible
3. Structure content clearly with appropriate headings, sections, and organization
4. Incorporate specific adaptations for focus, text presentation, and organization as requested
5. Format content to be engaging and visually appropriate
6. Always address the specified curriculum standards and learning objectives
7. Maintain a supportive, encouraging tone appropriate for the student's grade level
8. Output the content in a format ready for presentation to the student

IMPORTANT: The content you create will be directly used in an educational platform, so ensure it is complete, educationally sound, and properly formatted for the specified learning style and neurotype.`;

  // Create detailed prompt with specific adaptation requirements
  let prompt = `Please create educational content with the following specifications:

SUBJECT: ${contentRequest.subject}
GRADE LEVEL: ${contentRequest.gradeLevel}
CONTENT TYPE: ${contentRequest.contentType}
TOPIC: ${contentRequest.topic}
PRIMARY FORMAT: ${contentRules.primaryFormat}

LEARNING STYLE: ${profile.primaryStyle}
NEUROTYPE: ${profile.neurotype}
ADAPTATION LEVEL: ${profile.adaptationLevel}

LEARNING OBJECTIVES:
${contentRequest.learningObjectives.map(obj => `- ${obj}`).join('\n')}

`;

  // Add curriculum standards if available
  if (curriculumStandards) {
    prompt += `
CURRICULUM STANDARDS:
${curriculumStandards.standards.map(std => 
  `- ${std.id}: ${std.description}
    ${std.objectives.map(obj => `  - ${obj}`).join('\n')}`
).join('\n')}
`;
  }

  // Add content adaptation requirements based on content rules
  prompt += `
CONTENT REQUIREMENTS:
- Primary Format: ${contentRules.primaryFormat}
- Supporting Formats: ${contentRules.supportFormats.join(', ')}
- Content Complexity: ${contentRules.complexity}
- Content Pace: ${contentRules.pace}
- Presentation Style: ${contentRules.presentationStyle}

SPECIFIC ADAPTATIONS:
`;

  // Add text adaptations
  if (contentRules.textAdaptations) {
    prompt += `
Text Presentation:
- Font: ${contentRules.textAdaptations.font}
- Font Size: ${contentRules.textAdaptations.fontSize}
- Line Spacing: ${contentRules.textAdaptations.lineSpacing}
- Paragraph Spacing: ${contentRules.textAdaptations.paragraphSpacing}
- Use Color: ${contentRules.textAdaptations.color ? 'Yes' : 'No'}
- Use Highlighting: ${contentRules.textAdaptations.highlighting ? 'Yes' : 'No'}
- Use Reading Guides: ${contentRules.textAdaptations.useReadingGuides ? 'Yes' : 'No'}
`;
  }

  // Add visual adaptations
  if (contentRules.visualAdaptations) {
    prompt += `
Visual Elements:
- Use Diagrams: ${contentRules.visualAdaptations.useDiagrams ? 'Yes' : 'No'}
- Use Charts: ${contentRules.visualAdaptations.useCharts ? 'Yes' : 'No'}
- Use Infographics: ${contentRules.visualAdaptations.useInfographics ? 'Yes' : 'No'}
- Use Color Coding: ${contentRules.visualAdaptations.colorCoding ? 'Yes' : 'No'}
- Reduce Visual Complexity: ${contentRules.visualAdaptations.reducedComplexity ? 'Yes' : 'No'}
- Use Visual Schedules: ${contentRules.visualAdaptations.visualSchedules ? 'Yes' : 'No'}
`;
  }

  // Add organizational adaptations
  if (contentRules.organizationalAdaptations) {
    prompt += `
Content Organization:
- Chunk Information: ${contentRules.organizationalAdaptations.chunkInformation ? 'Yes' : 'No'}
- Provide Outlines: ${contentRules.organizationalAdaptations.provideOutlines ? 'Yes' : 'No'}
- Use Checkpoints: ${contentRules.organizationalAdaptations.useCheckpoints ? 'Yes' : 'No'}
- Break Down Complex Tasks: ${contentRules.organizationalAdaptations.breakComplexTasks ? 'Yes' : 'No'}
`;
  }

  // Add focus adaptations
  if (contentRules.focusAdaptations) {
    prompt += `
Focus Supports:
- Minimize Distracting Elements: ${contentRules.focusAdaptations.minimizeDistractingElements ? 'Yes' : 'No'}
- Use Timers: ${contentRules.focusAdaptations.useTimers ? 'Yes' : 'No'}
- Provide Break Reminders: ${contentRules.focusAdaptations.provideBreakReminders ? 'Yes' : 'No'}
- Emphasize Important Content: ${contentRules.focusAdaptations.emphasizeImportantContent ? 'Yes' : 'No'}
`;
  }

  // Add neurotype-specific adaptations
  prompt += `
NEUROTYPE-SPECIFIC ADAPTATIONS:
`;

  switch (profile.neurotype) {
    case Neurotype.DYSLEXIA:
      prompt += `
For Dyslexia:
- Use simple, clear language
- Break text into smaller chunks
- Use bullet points and numbering for lists
- Provide visual aids to supplement text
- Use larger font with increased spacing
- Highlight key terms and concepts
- Include audio companions when possible
`;
      break;
      
    case Neurotype.ADHD:
      prompt += `
For ADHD:
- Keep content concise and to the point
- Use color and highlighting to indicate importance
- Break down complex tasks into smaller steps
- Include frequent engagement checkpoints
- Minimize distractions in content layout
- Use visuals to maintain attention
- Include interactive elements when possible
`;
      break;
      
    case Neurotype.AUTISM_SPECTRUM:
      prompt += `
For Autism Spectrum:
- Provide clear, explicit instructions
- Use consistent structure and formatting
- Avoid abstract language and idioms
- Include visual schedules and timelines
- Provide concrete examples
- Minimize sensory overload in visual design
- Use clear transitions between topics
`;
      break;
      
    default:
      prompt += `
Standard Adaptations:
- Maintain clear organization
- Use engaging, appropriate language for grade level
- Include visual supports for complex concepts
- Provide clear learning objectives
`;
  }

  // Add tier-specific instructions
  prompt += `
TIER-SPECIFIC REQUIREMENTS (${contentRequest.tier}):
`;

  switch (contentRequest.tier.toLowerCase()) {
    case 'premium':
      prompt += `
- Create comprehensive, in-depth content
- Include advanced multimedia elements and interactive suggestions
- Provide extension activities and challenging content
- Include connections to real-world applications
- Suggest supplementary resources
- Incorporate deep research insights when appropriate
`;
      break;
      
    case 'standard':
      prompt += `
- Create balanced, well-rounded content
- Include moderate multimedia elements
- Provide some extension activities
- Make content engaging and interactive when possible
`;
      break;
      
    case 'basic':
      prompt += `
- Focus on core educational content
- Keep content straightforward and accessible
- Include essential visual supports
- Prioritize clarity and simplicity
`;
      break;
  }

  // Add final output formatting instructions
  prompt += `
OUTPUT FORMAT:
Please structure your response with:
1. A title for the content
2. An introduction appropriate for the student's learning style and neurotype
3. Main content sections with clear headings
4. A summary or conclusion
5. Suggestions for how to implement any visual, audio, or interactive elements

Format the content to be directly usable in an educational setting, with appropriate adaptations for the specified learning style and neurotype.
`;

  return { prompt, systemPrompt };
}

/**
 * Generate content using AI
 * @param prompt Content prompt
 * @param systemPrompt System prompt
 * @param tierLimits Tier limits
 * @returns Promise with generated content text
 */
async function generateAIContent(
  prompt: string,
  systemPrompt: string,
  tierLimits: typeof TIER_LIMITS.basic
): Promise<string> {
  try {
    // Use different max tokens based on tier
    const maxTokens = tierLimits.maxTokens;
    
    // Generate content using Anthropic Claude
    const response = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [
        { role: "user", content: prompt }
      ]
    });
    
    // Extract the generated content
    const content = response.content[0].text;
    
    return content;
  } catch (error) {
    console.error('Error generating AI content:', error);
    throw error;
  }
}

/**
 * Process and structure the generated content
 * @param content Generated content text
 * @param contentRequest Content request
 * @param profile Learning profile
 * @param contentRules Content rules
 * @param tierLimits Tier limits
 * @returns Structured content
 */
function processGeneratedContent(
  content: string,
  contentRequest: {
    subject: string;
    gradeLevel: string;
    contentType: string;
    topic: string;
    learningObjectives: string[];
    tier: string;
  },
  profile: LearningProfile,
  contentRules: ContentRules,
  tierLimits: typeof TIER_LIMITS.basic
): GeneratedContent {
  // Extract title from content (assuming first line is the title)
  const lines = content.split('\n');
  let title = lines[0].replace(/^#\s*/, '');
  
  if (!title || title.length < 3) {
    title = `${contentRequest.topic} - ${contentRequest.subject} (Grade ${contentRequest.gradeLevel})`;
  }
  
  // Generate content ID
  const contentId = `content-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  
  // Extract sections from content
  // This is a simple implementation - in a real system, this would be more sophisticated
  const sections = extractContentSections(content, contentRules.primaryFormat);
  
  // Compile adaptations applied
  const adaptations = compileAdaptations(contentRules, profile);
  
  // Create the structured content
  const structuredContent: GeneratedContent = {
    contentId,
    userId: profile.userId,
    title,
    subject: contentRequest.subject,
    gradeLevel: contentRequest.gradeLevel,
    contentType: contentRequest.contentType,
    primaryFormat: contentRules.primaryFormat,
    sections,
    adaptations,
    metadata: {
      generatedAt: new Date(),
      tier: contentRequest.tier,
      targetNeurotype: profile.neurotype,
      primaryLearningStyle: profile.primaryStyle,
      curriculumStandards: contentRequest.learningObjectives
    }
  };
  
  return structuredContent;
}

/**
 * Extract content sections from generated text
 * @param content Generated content text
 * @param primaryFormat Primary content format
 * @returns Array of content sections
 */
function extractContentSections(
  content: string,
  primaryFormat: ContentFormat
): GeneratedContent['sections'] {
  const sections: GeneratedContent['sections'] = [];
  
  // Split content by headers (lines starting with #)
  const lines = content.split('\n');
  let currentSection: { title: string; content: string; format: ContentFormat; adaptations: string[] } | null = null;
  
  for (const line of lines) {
    // Check if line is a header (starts with # or ##)
    if (line.match(/^#{1,3}\s+/)) {
      // If we have a current section, add it to the list
      if (currentSection) {
        sections.push(currentSection);
      }
      
      // Create a new section
      const title = line.replace(/^#{1,3}\s+/, '');
      currentSection = {
        title,
        content: '',
        format: primaryFormat,
        adaptations: []
      };
      
      // Determine format based on section title
      if (title.toLowerCase().includes('visual') || 
          title.toLowerCase().includes('diagram') || 
          title.toLowerCase().includes('chart')) {
        currentSection.format = ContentFormat.VISUAL;
      } else if (title.toLowerCase().includes('audio') || 
                 title.toLowerCase().includes('listen')) {
        currentSection.format = ContentFormat.AUDIO;
      } else if (title.toLowerCase().includes('video')) {
        currentSection.format = ContentFormat.VIDEO;
      } else if (title.toLowerCase().includes('activity') || 
                 title.toLowerCase().includes('exercise') || 
                 title.toLowerCase().includes('interactive')) {
        currentSection.format = ContentFormat.INTERACTIVE;
      }
    } 
    // If not a header and we have a current section, add to its content
    else if (currentSection) {
      currentSection.content += line + '\n';
    }
    // If no current section and not a header, create an introduction section
    else if (line.trim() !== '') {
      currentSection = {
        title: 'Introduction',
        content: line + '\n',
        format: primaryFormat,
        adaptations: []
      };
    }
  }
  
  // Add the last section if it exists
  if (currentSection) {
    sections.push(currentSection);
  }
  
  // If no sections were created, create a default section with all content
  if (sections.length === 0) {
    sections.push({
      title: 'Content',
      content,
      format: primaryFormat,
      adaptations: []
    });
  }
  
  return sections;
}

/**
 * Compile a list of adaptations applied to the content
 * @param contentRules Content rules
 * @param profile Learning profile
 * @returns Array of adaptation descriptions
 */
function compileAdaptations(
  contentRules: ContentRules,
  profile: LearningProfile
): string[] {
  const adaptations: string[] = [];
  
  // Text adaptations
  if (contentRules.textAdaptations.font !== 'standard') {
    adaptations.push(`Using ${contentRules.textAdaptations.font} font`);
  }
  if (contentRules.textAdaptations.fontSize !== 'medium') {
    adaptations.push(`Using ${contentRules.textAdaptations.fontSize} font size`);
  }
  if (contentRules.textAdaptations.lineSpacing !== 'normal') {
    adaptations.push(`Using ${contentRules.textAdaptations.lineSpacing} line spacing`);
  }
  if (contentRules.textAdaptations.color) {
    adaptations.push('Using color-enhanced text');
  }
  if (contentRules.textAdaptations.highlighting) {
    adaptations.push('Using text highlighting for important concepts');
  }
  if (contentRules.textAdaptations.useReadingGuides) {
    adaptations.push('Including reading guides');
  }
  
  // Visual adaptations
  if (contentRules.visualAdaptations.useDiagrams) {
    adaptations.push('Including explanatory diagrams');
  }
  if (contentRules.visualAdaptations.useCharts) {
    adaptations.push('Including data charts');
  }
  if (contentRules.visualAdaptations.useInfographics) {
    adaptations.push('Including infographics');
  }
  if (contentRules.visualAdaptations.colorCoding) {
    adaptations.push('Using color coding for organization');
  }
  if (contentRules.visualAdaptations.reducedComplexity) {
    adaptations.push('Using reduced visual complexity');
  }
  if (contentRules.visualAdaptations.visualSchedules) {
    adaptations.push('Including visual schedules');
  }
  
  // Audio adaptations
  if (contentRules.audioAdaptations.provideAudioVersions) {
    adaptations.push('Providing audio versions of content');
  }
  if (contentRules.audioAdaptations.speechRate !== 'normal') {
    adaptations.push(`Using ${contentRules.audioAdaptations.speechRate} speech rate`);
  }
  if (contentRules.audioAdaptations.emphasizeKeyInformation) {
    adaptations.push('Emphasizing key information in audio');
  }
  
  // Interactive adaptations
  if (contentRules.interactiveAdaptations.requireHandsOn) {
    adaptations.push('Including hands-on activities');
  }
  if (contentRules.interactiveAdaptations.includeGameElements) {
    adaptations.push('Including game elements');
  }
  if (contentRules.interactiveAdaptations.allowExploratoryLearning) {
    adaptations.push('Supporting exploratory learning');
  }
  if (contentRules.interactiveAdaptations.provideSimulations) {
    adaptations.push('Including interactive simulations');
  }
  
  // Organizational adaptations
  if (contentRules.organizationalAdaptations.chunkInformation) {
    adaptations.push('Content chunked into manageable sections');
  }
  if (contentRules.organizationalAdaptations.provideOutlines) {
    adaptations.push('Including content outlines');
  }
  if (contentRules.organizationalAdaptations.useCheckpoints) {
    adaptations.push('Including learning checkpoints');
  }
  if (contentRules.organizationalAdaptations.breakComplexTasks) {
    adaptations.push('Complex tasks broken into steps');
  }
  
  // Focus adaptations
  if (contentRules.focusAdaptations.minimizeDistractingElements) {
    adaptations.push('Minimizing distracting elements');
  }
  if (contentRules.focusAdaptations.useTimers) {
    adaptations.push('Including suggested timers');
  }
  if (contentRules.focusAdaptations.provideBreakReminders) {
    adaptations.push('Including break reminders');
  }
  if (contentRules.focusAdaptations.emphasizeImportantContent) {
    adaptations.push('Emphasizing important content');
  }
  
  // Neurotype-specific adaptations
  switch (profile.neurotype) {
    case Neurotype.DYSLEXIA:
      adaptations.push('Dyslexia-friendly text formatting');
      break;
    case Neurotype.ADHD:
      adaptations.push('ADHD-friendly focus supports');
      break;
    case Neurotype.AUTISM_SPECTRUM:
      adaptations.push('Autism-friendly structure and organization');
      break;
  }
  
  // Learning style adaptations
  switch (profile.primaryStyle) {
    case LearningStyle.VISUAL:
      adaptations.push('Visual learning style emphasis');
      break;
    case LearningStyle.AUDITORY:
      adaptations.push('Auditory learning style emphasis');
      break;
    case LearningStyle.KINESTHETIC:
      adaptations.push('Kinesthetic learning style emphasis');
      break;
    case LearningStyle.READING_WRITING:
      adaptations.push('Reading/writing learning style emphasis');
      break;
  }
  
  return adaptations;
}

/**
 * Perform deep research for premium tier content
 * @param topic Content topic
 * @param subject Subject area
 * @returns Promise with research sources
 */
async function performDeepResearch(
  topic: string,
  subject: string
): Promise<GeneratedContent['deepResearchSources']> {
  try {
    // In a premium implementation, this would make API calls to external research sources
    // This is a placeholder implementation
    
    const researchPrompt = `Provide 3-5 high-quality educational resources related to "${topic}" in the subject of "${subject}" that would be valuable for creating comprehensive educational content. For each resource, provide a title, URL, and brief explanation of its relevance.`;
    
    const response = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 1000,
      messages: [
        { role: "user", content: researchPrompt }
      ]
    });
    
    // Extract the research sources from the response
    const sources = extractResearchSources(response.content[0].text);
    
    return sources;
  } catch (error) {
    console.error('Error performing deep research:', error);
    return [];
  }
}

/**
 * Extract research sources from AI response
 * @param responseText AI response text
 * @returns Array of research sources
 */
function extractResearchSources(responseText: string): GeneratedContent['deepResearchSources'] {
  const sources: GeneratedContent['deepResearchSources'] = [];
  
  // Split the response into lines
  const lines = responseText.split('\n');
  
  let currentSource: {
    title: string;
    url: string;
    relevance: string;
  } | null = null;
  
  for (const line of lines) {
    // Look for lines that might contain a title (typically numbered or bullet points)
    const titleMatch = line.match(/^\d+\.\s+(.+)/) || line.match(/^[\*\-]\s+(.+)/);
    
    if (titleMatch) {
      // If we have a current source, add it to the array
      if (currentSource && currentSource.title && currentSource.url) {
        sources.push(currentSource);
      }
      
      // Create a new source with the title
      currentSource = {
        title: titleMatch[1],
        url: '',
        relevance: ''
      };
    } 
    // Look for URLs
    else if (currentSource && line.includes('http')) {
      const urlMatch = line.match(/(https?:\/\/[^\s]+)/);
      if (urlMatch) {
        currentSource.url = urlMatch[1];
      }
    }
    // Look for relevance descriptions
    else if (currentSource && currentSource.url && line.trim() !== '') {
      if (!currentSource.relevance) {
        currentSource.relevance = line.trim();
      } else {
        currentSource.relevance += ' ' + line.trim();
      }
    }
  }
  
  // Add the last source if it exists
  if (currentSource && currentSource.title && currentSource.url) {
    sources.push(currentSource);
  }
  
  return sources;
}

/**
 * Check if a user has reached their content generation limit
 * @param userId User ID
 * @param tier Subscription tier
 * @returns Promise with boolean indicating if limit is reached
 */
export async function hasReachedContentGenerationLimit(
  userId: number,
  tier: string
): Promise<boolean> {
  try {
    // In a real implementation, this would check a database for usage statistics
    // This is a placeholder implementation
    return false;
  } catch (error) {
    console.error('Error checking content generation limit:', error);
    return false;
  }
}