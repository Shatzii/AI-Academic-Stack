/**
 * Soundtrack Generator Service
 * 
 * This service generates personalized learning soundtracks based on
 * student profiles, learning activities, and mood states.
 * It uses the Anthropic API to create tailored audio environment
 * recommendations for neurodivergent learners.
 */

import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a personalized learning soundtrack
 * @param {Object} studentProfile - The student's profile including neurotype
 * @param {string} activity - The learning activity description
 * @param {number} duration - Duration in minutes
 * @param {Object} anthropicClient - Initialized Anthropic client
 * @param {Object} options - Additional options (mood, isStudySession, etc.)
 * @returns {Object} Generated soundtrack
 */
async function generateSoundtrack(
  studentProfile,
  activity,
  duration = 25,
  anthropicClient,
  options = {}
) {
  try {
    const neurotype = studentProfile?.neurotype || 'default';
    const useAI = studentProfile?.aiPersonalization || false;
    
    // If we don't have access to the Anthropic client, return a mock soundtrack
    if (!anthropicClient) {
      console.warn('Warning: Anthropic client not available. Returning sample soundtrack.');
      return generateSampleSoundtrack(neurotype, activity, duration);
    }
    
    // Build the prompt for Claude
    const prompt = buildSoundtrackPrompt(neurotype, activity, duration, options);
    
    // Use Anthropic to generate the soundtrack
    const response = await anthropicClient.messages.create({
      model: "claude-3-7-sonnet-20250219", // the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });
    
    // Parse the response
    const soundtrackData = JSON.parse(response.content[0].text);
    
    // Format and return the soundtrack
    return {
      id: uuidv4(),
      name: soundtrackData.name,
      type: soundtrackData.type,
      activity: activity,
      neurotype: neurotype,
      duration: duration,
      segments: soundtrackData.segments,
      description: soundtrackData.description,
      createdAt: new Date().toISOString(),
      specialConsiderations: soundtrackData.specialConsiderations,
      aiGenerated: true,
      ...(soundtrackData.moodRecommendation && { 
        moodRecommendation: soundtrackData.moodRecommendation 
      })
    };
  } catch (error) {
    console.error('Error generating soundtrack:', error);
    
    // Fall back to sample soundtrack if AI generation fails
    return generateSampleSoundtrack(neurotype, activity, duration);
  }
}

/**
 * Build a prompt for Anthropic to generate a soundtrack
 */
function buildSoundtrackPrompt(neurotype, activity, duration, options) {
  const { isMoodBased, mood, isStudySession, activities } = options;
  
  let basePrompt = `
You are an expert in designing therapeutic sound environments for neurodivergent learners.
I need you to create a personalized learning soundtrack for a student with the following details:

- Neurotype: ${neurotype}
- Activity: ${activity}
- Duration: ${duration} minutes
${isMoodBased ? '- Current mood: ' + mood : ''}
${isStudySession ? '- Study session activities: ' + activities.join(', ') : ''}

Please generate a detailed soundtrack design in JSON format with the following structure:
{
  "name": "A descriptive name for the soundtrack",
  "type": "The primary type of soundtrack (focus, calm, energize, etc.)",
  "description": "A brief description of what this soundtrack does",
  "segments": [
    {
      "type": "The type of this segment (focus, break, transition, etc.)",
      "elements": ["sound element 1", "sound element 2", "etc."],
      "duration": minutes this segment should last,
      "description": "What this segment accomplishes"
    }
  ],
  "specialConsiderations": "Any specific considerations based on the neurotype"
}`;

  // Add mood-specific request if it's a mood-based soundtrack
  if (isMoodBased) {
    basePrompt += `
Please also include mood recommendations in this format:
{
  "moodRecommendation": {
    "recommendedSoundtrackType": "The best type of soundtrack for this mood",
    "recommendedDuration": recommended duration in minutes,
    "reasonForRecommendation": "Why this type and duration is recommended for the current mood"
  }
}`;
  }

  // Add neurotype-specific guidance
  switch (neurotype) {
    case 'adhd':
      basePrompt += `\n\nFor ADHD, consider:
- Rhythmic, predictable sound patterns to support focus
- Strategic use of white/pink noise to mask distractions
- Short segments (5-15 min) with clear transitions
- Gradually increasing tempo/intensity for motivation
- Avoid sudden changes that might be distracting`;
      break;
    case 'autism':
      basePrompt += `\n\nFor autism, consider:
- Consistent, predictable sound environments
- Gentle transitions between segments
- Avoid sounds in frequency ranges that may cause sensory overload
- Include calming natural sounds
- Maintain consistent volume levels`;
      break;
    case 'dyslexia':
      basePrompt += `\n\nFor dyslexia, consider:
- Rhythmic patterns that match reading cadence
- Sounds that help with sequential processing
- Minimize linguistic elements that might interfere with reading
- Include sound elements that enhance focus on visual tasks`;
      break;
    case 'anxiety':
      basePrompt += `\n\nFor anxiety, consider:
- Grounding sounds that regulate nervous system activation
- Binaural beats for calming (alpha/theta waves)
- Predictable patterns that create safety
- Progressive relaxation sound elements
- Nature sounds known to reduce cortisol levels`;
      break;
  }

  basePrompt += `\n\nBe creative and specific about the sound elements, considering how they support the neurotype, activity, and duration.
Make sure your response is valid JSON that strictly follows the format outlined above.`;

  return basePrompt;
}

/**
 * Generate a sample soundtrack when AI is unavailable
 */
function generateSampleSoundtrack(neurotype, activity, duration) {
  // Base segment length calculations
  const focusSegmentLength = Math.floor(duration * 0.6);
  const breakSegmentLength = Math.floor(duration * 0.2);
  const energizeSegmentLength = duration - focusSegmentLength - breakSegmentLength;

  // Neurotype-specific considerations
  let specialConsiderations = '';
  let elements = [];
  
  switch (neurotype) {
    case 'adhd':
      elements = ['white noise', 'low frequency beats', 'gentle pulses'];
      specialConsiderations = 'Includes rhythmic patterns to aid working memory and reduce distraction sensitivity';
      break;
    case 'autism':
      elements = ['consistent ambient tones', 'gentle nature sounds', 'predictable patterns'];
      specialConsiderations = 'Maintains consistent sound profile with minimal unexpected changes to prevent sensory overload';
      break;
    case 'dyslexia':
      elements = ['rhythmic beats', 'spatial audio cues', 'melodic patterns'];
      specialConsiderations = 'Incorporates rhythmic elements that support sequential processing and visual focus';
      break;
    case 'anxiety':
      elements = ['binaural beats', 'deep breathing pacing', 'nature sounds'];
      specialConsiderations = 'Designed to regulate nervous system activation and reduce cortisol levels';
      break;
    default:
      elements = ['ambient sounds', 'focus beats', 'light background tones'];
      specialConsiderations = 'General focus support soundtrack with minimal distraction';
  }

  return {
    id: uuidv4(),
    name: `${neurotype === 'default' ? 'Focus' : neurotype.charAt(0).toUpperCase() + neurotype.slice(1)} Support for ${activity.charAt(0).toUpperCase() + activity.slice(1)}`,
    type: 'focus',
    activity: activity,
    neurotype: neurotype,
    duration: duration,
    segments: [
      {
        type: 'focus',
        elements: elements,
        duration: focusSegmentLength,
        description: 'Steady focus sounds to enhance concentration'
      },
      {
        type: 'break',
        elements: ['nature sounds', 'birds', 'light wind'],
        duration: breakSegmentLength,
        description: 'Brief relaxation interlude to prevent mental fatigue'
      },
      {
        type: 'energize',
        elements: ['upbeat rhythms', 'motivational pace'],
        duration: energizeSegmentLength,
        description: 'Energizing sounds to maintain momentum in final stretch'
      }
    ],
    description: `Optimized for ${neurotype} needs during ${activity}`,
    createdAt: new Date().toISOString(),
    specialConsiderations: specialConsiderations,
    aiGenerated: false
  };
}

export default generateSoundtrack;