/**
 * Enhanced Language Learning AI Service
 * 
 * This service integrates Anthropic Claude for advanced language learning capabilities
 * within the ShotziOS platform. It provides specialized functions for vocabulary generation,
 * grammar exercises, dialogue creation, and pronunciation feedback.
 */

import Anthropic from '@anthropic-ai/sdk';
import { getTextFromResponse } from './anthropic';

// Initialize Anthropic client
// the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODEL = 'claude-3-7-sonnet-20250219';

/**
 * Generate a vocabulary list for language learning
 * @param language Target language (e.g., Spanish, French, German)
 * @param topic Topic for vocabulary (e.g., Food, Travel, Business)
 * @param level Proficiency level (Beginner, Intermediate, Advanced)
 * @param count Number of vocabulary items to generate (default 15)
 * @param includeContext Whether to include cultural context (default true)
 * @returns Structured vocabulary list with examples and context
 */
export async function generateVocabularyList(
  language: string,
  topic: string,
  level: string,
  count: number = 15,
  includeContext: boolean = true
): Promise<{
  language: string;
  topic: string;
  level: string;
  vocabulary: Array<{
    term: string;
    partOfSpeech: string;
    pronunciation?: string;
    translation: string;
    exampleSentence: string;
    exampleTranslation: string;
    culturalContext?: string;
    difficultyRating: number;
  }>;
}> {
  try {
    const systemPrompt = `
      You are a language education specialist fluent in ${language}.
      Create a vocabulary list for ${level} level students learning ${language} on the topic of "${topic}".
      
      Format your response as valid JSON with this structure:
      {
        "language": "${language}",
        "topic": "${topic}",
        "level": "${level}",
        "vocabulary": [
          {
            "term": "Word or phrase in ${language}",
            "partOfSpeech": "noun/verb/adjective/etc.",
            "pronunciation": "Simple pronunciation guide",
            "translation": "English translation",
            "exampleSentence": "Example sentence in ${language}",
            "exampleTranslation": "Translation of example sentence",
            "culturalContext": "Brief cultural usage note or context",
            "difficultyRating": 1-5 number rating difficulty for this level
          }
        ]
      }
      
      Include exactly ${count} vocabulary items.
      ${includeContext ? 'Include cultural context for each term.' : 'Omit cultural context.'}
      For beginner levels, use simpler vocabulary focused on everyday usage.
      For intermediate levels, include more nuanced vocabulary with idioms.
      For advanced levels, include specialized vocabulary and colloquial expressions.
    `;

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 3000,
      messages: [
        { 
          role: 'user', 
          content: `Generate a vocabulary list for ${level} ${language} students on the topic of "${topic}".`
        }
      ],
      system: systemPrompt,
    });

    // Parse the JSON response
    const responseText = getTextFromResponse(response.content);
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse JSON from AI response');
    }
    
    const vocabularyData = JSON.parse(jsonMatch[0]);

    // Validate required fields
    if (!vocabularyData.language || !vocabularyData.topic || !vocabularyData.level || !Array.isArray(vocabularyData.vocabulary)) {
      throw new Error('AI response missing required vocabulary fields');
    }

    return vocabularyData;
  } catch (error) {
    console.error('Error generating vocabulary list:', error);
    throw new Error('Failed to generate vocabulary list');
  }
}

/**
 * Generate a dialogue for language practice
 * @param language Target language
 * @param topic Conversation topic
 * @param level Proficiency level
 * @param context Situational context
 * @param characterCount Number of speakers (default 2)
 * @returns Structured dialogue with translations and notes
 */
export async function generateLanguageDialogue(
  language: string,
  topic: string,
  level: string,
  context: string,
  characterCount: number = 2
): Promise<{
  language: string;
  topic: string;
  level: string;
  context: string;
  dialogue: Array<{
    speaker: string;
    text: string;
    translation: string;
    notes?: string;
  }>;
  keyPhrases: Array<{
    phrase: string;
    translation: string;
    usage: string;
  }>;
}> {
  try {
    const systemPrompt = `
      You are a dialogue writer for language education, specialized in ${language}.
      Create a natural, culturally appropriate dialogue in ${language} for ${level} level students about "${topic}" set in the context: "${context}".
      
      Format your response as valid JSON with this structure:
      {
        "language": "${language}",
        "topic": "${topic}",
        "level": "${level}",
        "context": "${context}",
        "dialogue": [
          {
            "speaker": "Character name",
            "text": "Text in ${language}",
            "translation": "English translation",
            "notes": "Optional grammatical or cultural note"
          }
        ],
        "keyPhrases": [
          {
            "phrase": "Important phrase or idiom from the dialogue",
            "translation": "English translation",
            "usage": "Brief explanation of when/how to use this phrase"
          }
        ]
      }
      
      The dialogue should include ${characterCount} speakers and be 15-20 exchanges long.
      Include 5-7 key phrases that highlight important vocabulary or grammar from the dialogue.
      Match the language complexity to the ${level} level while being natural and culturally authentic.
    `;

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 3500,
      messages: [
        { 
          role: 'user', 
          content: `Create a ${level} level ${language} dialogue about "${topic}" set in this context: "${context}" with ${characterCount} speakers.`
        }
      ],
      system: systemPrompt,
    });

    // Parse the JSON response
    const responseText = getTextFromResponse(response.content);
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse JSON from AI response');
    }
    
    const dialogueData = JSON.parse(jsonMatch[0]);

    // Validate required fields
    if (!dialogueData.dialogue || !Array.isArray(dialogueData.dialogue) || !dialogueData.keyPhrases) {
      throw new Error('AI response missing required dialogue fields');
    }

    return dialogueData;
  } catch (error) {
    console.error('Error generating language dialogue:', error);
    throw new Error('Failed to generate language dialogue');
  }
}

/**
 * Generate grammar exercises for language practice
 * @param language Target language
 * @param grammarConcept The grammar concept to focus on
 * @param level Proficiency level
 * @param exerciseCount Number of exercises to generate
 * @returns Structured grammar exercises with explanations
 */
export async function generateGrammarExercises(
  language: string,
  grammarConcept: string,
  level: string,
  exerciseCount: number = 10
): Promise<{
  language: string;
  grammarConcept: string;
  level: string;
  explanation: string;
  examples: Array<{
    example: string;
    translation: string;
  }>;
  exercises: Array<{
    prompt: string;
    correctAnswer: string;
    alternatives?: string[];
    explanation: string;
  }>;
}> {
  try {
    const systemPrompt = `
      You are a grammar education specialist fluent in ${language}.
      Create a comprehensive set of grammar exercises focusing on ${grammarConcept} for ${level} level students learning ${language}.
      
      Format your response as valid JSON with this structure:
      {
        "language": "${language}",
        "grammarConcept": "${grammarConcept}",
        "level": "${level}",
        "explanation": "Clear explanation of the grammar concept",
        "examples": [
          {
            "example": "Example sentence using the grammar concept",
            "translation": "English translation"
          }
        ],
        "exercises": [
          {
            "prompt": "Exercise prompt (fill-in-blank, transformation, etc.)",
            "correctAnswer": "The correct answer",
            "alternatives": ["Other acceptable answer 1", "Other acceptable answer 2"],
            "explanation": "Explanation of why this answer is correct"
          }
        ]
      }
      
      Include:
      - A clear explanation of the grammar concept (3-5 sentences)
      - 3-5 example sentences demonstrating correct usage
      - ${exerciseCount} practice exercises with varying formats
      - Explanations for each exercise answer
      
      Match the complexity to the ${level} level while being comprehensive.
    `;

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 3500,
      messages: [
        { 
          role: 'user', 
          content: `Create ${level} level ${language} grammar exercises on ${grammarConcept} with ${exerciseCount} practice questions.`
        }
      ],
      system: systemPrompt,
    });

    // Parse the JSON response
    const responseText = getTextFromResponse(response.content);
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse JSON from AI response');
    }
    
    const grammarData = JSON.parse(jsonMatch[0]);

    // Validate required fields
    if (!grammarData.explanation || !Array.isArray(grammarData.examples) || !Array.isArray(grammarData.exercises)) {
      throw new Error('AI response missing required grammar exercise fields');
    }

    return grammarData;
  } catch (error) {
    console.error('Error generating grammar exercises:', error);
    throw new Error('Failed to generate grammar exercises');
  }
}

/**
 * Generate a cultural lesson about the target language
 * @param language Target language
 * @param culturalTopic Cultural topic to explore
 * @param level Proficiency level
 * @returns Structured cultural lesson with vocabulary and questions
 */
export async function generateCulturalLesson(
  language: string,
  culturalTopic: string,
  level: string
): Promise<{
  language: string;
  culturalTopic: string;
  level: string;
  introduction: string;
  mainContent: string[];
  keyVocabulary: Array<{
    term: string;
    translation: string;
    usage: string;
  }>;
  discussionQuestions: string[];
  relatedTopics: string[];
}> {
  try {
    const systemPrompt = `
      You are a cultural education specialist fluent in ${language} and deeply familiar with cultures where ${language} is spoken.
      Create a comprehensive cultural lesson about "${culturalTopic}" for ${level} level students learning ${language}.
      
      Format your response as valid JSON with this structure:
      {
        "language": "${language}",
        "culturalTopic": "${culturalTopic}",
        "level": "${level}",
        "introduction": "Brief introduction to the cultural topic",
        "mainContent": [
          "Paragraph 1 of cultural content",
          "Paragraph 2 of cultural content",
          "..."
        ],
        "keyVocabulary": [
          {
            "term": "Cultural term in ${language}",
            "translation": "English translation",
            "usage": "Context or explanation of cultural significance"
          }
        ],
        "discussionQuestions": [
          "Question 1 for class discussion",
          "Question 2 for class discussion",
          "..."
        ],
        "relatedTopics": [
          "Related cultural topic 1",
          "Related cultural topic 2",
          "..."
        ]
      }
      
      Include:
      - A brief introduction (2-3 sentences)
      - Main content divided into 4-6 paragraphs
      - 8-10 key vocabulary terms related to the cultural topic
      - 5-7 discussion questions
      - 3-5 related cultural topics for further exploration
      
      Match the language complexity to the ${level} level while being culturally authentic and educational.
    `;

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 4000,
      messages: [
        { 
          role: 'user', 
          content: `Create a ${level} level cultural lesson about "${culturalTopic}" for ${language} language students.`
        }
      ],
      system: systemPrompt,
    });

    // Parse the JSON response
    const responseText = getTextFromResponse(response.content);
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse JSON from AI response');
    }
    
    const lessonData = JSON.parse(jsonMatch[0]);

    // Validate required fields
    if (!lessonData.introduction || !Array.isArray(lessonData.mainContent) || 
        !Array.isArray(lessonData.keyVocabulary) || !Array.isArray(lessonData.discussionQuestions)) {
      throw new Error('AI response missing required cultural lesson fields');
    }

    return lessonData;
  } catch (error) {
    console.error('Error generating cultural lesson:', error);
    throw new Error('Failed to generate cultural lesson');
  }
}

/**
 * Analyze and give feedback on language pronunciation using audio
 * @param base64Audio Audio recording in base64 format
 * @param language Target language
 * @param targetPhrase The phrase the student was trying to pronounce
 * @param level Proficiency level
 * @returns Structured pronunciation feedback
 */
export async function analyzePronunciation(
  base64Audio: string,
  language: string,
  targetPhrase: string,
  level: string
): Promise<{
  overallRating: number;
  feedback: string;
  detailedFeedback: Array<{
    segment: string;
    pronunciation: string;
    correction: string;
    tip: string;
  }>;
  practiceExercises: string[];
}> {
  try {
    // This is a placeholder - currently Claude doesn't have audio input capabilities
    // In a real implementation, this would use an audio analysis service or future Claude capabilities
    
    // For now, we'll simulate a pronunciation feedback using the target phrase
    const systemPrompt = `
      You are a language pronunciation specialist for ${language}.
      Imagine you've heard a student attempting to pronounce: "${targetPhrase}"
      
      Create detailed pronunciation feedback as if you had analyzed their pronunciation.
      
      Format your response as valid JSON with this structure:
      {
        "overallRating": 3,  // 1-5 rating
        "feedback": "General feedback about their pronunciation",
        "detailedFeedback": [
          {
            "segment": "Part of the phrase",
            "pronunciation": "How they pronounced it",
            "correction": "Correct pronunciation",
            "tip": "Specific tip to improve"
          }
        ],
        "practiceExercises": [
          "Exercise 1 to improve pronunciation",
          "Exercise 2 to improve pronunciation"
        ]
      }
      
      Since this is a simulation (no actual audio analysis), create plausible feedback for a ${level} student
      who is making typical pronunciation mistakes for their native English speakers learning ${language}.
      Focus on 3-4 key pronunciation challenges specific to ${language}.
    `;

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 2000,
      messages: [
        { 
          role: 'user', 
          content: `Analyze the pronunciation of this ${level} level student trying to say "${targetPhrase}" in ${language}.`
        }
      ],
      system: systemPrompt,
    });

    // Parse the JSON response
    const responseText = getTextFromResponse(response.content);
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse JSON from AI response');
    }
    
    const feedbackData = JSON.parse(jsonMatch[0]);

    // Validate required fields
    if (feedbackData.overallRating === undefined || !feedbackData.feedback || 
        !Array.isArray(feedbackData.detailedFeedback) || !Array.isArray(feedbackData.practiceExercises)) {
      throw new Error('AI response missing required pronunciation feedback fields');
    }

    return feedbackData;
  } catch (error) {
    console.error('Error generating pronunciation feedback:', error);
    throw new Error('Failed to generate pronunciation feedback');
  }
}

/**
 * Create a language learning assessment
 * @param language Target language
 * @param level Proficiency level
 * @param skills Skills to assess (reading, writing, listening, speaking, grammar, vocabulary)
 * @param questionCount Number of questions to include
 * @returns Structured language assessment
 */
export async function createLanguageAssessment(
  language: string,
  level: string,
  skills: string[],
  questionCount: number = 20
): Promise<{
  language: string;
  level: string;
  skills: string[];
  instructions: string;
  sections: Array<{
    skill: string;
    questions: Array<{
      type: string;
      question: string;
      options?: string[];
      answer: string;
    }>;
  }>;
  scoringGuide: string;
}> {
  try {
    const systemPrompt = `
      You are a language assessment specialist for ${language}.
      Create a comprehensive language assessment for ${level} level students learning ${language}.
      
      Format your response as valid JSON with this structure:
      {
        "language": "${language}",
        "level": "${level}",
        "skills": ${JSON.stringify(skills)},
        "instructions": "General instructions for the assessment",
        "sections": [
          {
            "skill": "One of the skills being tested",
            "questions": [
              {
                "type": "Question type (multiple-choice, fill-blank, short-answer, etc.)",
                "question": "The question text or prompt",
                "options": ["Option A", "Option B", "Option C", "Option D"],  // Include for multiple choice
                "answer": "The correct answer"
              }
            ]
          }
        ],
        "scoringGuide": "Guide for scoring the assessment"
      }
      
      Include:
      - Clear instructions for the entire assessment
      - ${skills.length} sections, one for each skill: ${skills.join(', ')}
      - Total of ${questionCount} questions distributed across sections
      - A mix of question types appropriate for each skill
      - A comprehensive scoring guide
      
      Match the difficulty to ${level} level according to CEFR standards where applicable.
    `;

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 4000,
      messages: [
        { 
          role: 'user', 
          content: `Create a ${level} level ${language} assessment testing these skills: ${skills.join(', ')}`
        }
      ],
      system: systemPrompt,
    });

    // Parse the JSON response
    const responseText = getTextFromResponse(response.content);
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse JSON from AI response');
    }
    
    const assessmentData = JSON.parse(jsonMatch[0]);

    // Validate required fields
    if (!assessmentData.instructions || !Array.isArray(assessmentData.sections) || !assessmentData.scoringGuide) {
      throw new Error('AI response missing required assessment fields');
    }

    return assessmentData;
  } catch (error) {
    console.error('Error creating language assessment:', error);
    throw new Error('Failed to create language assessment');
  }
}

/**
 * Generate a personalized language learning curriculum
 * @param language Target language
 * @param level Proficiency level
 * @param goals Learning goals
 * @param duration Duration of curriculum in weeks
 * @param learningStyle Preferred learning style
 * @returns Structured curriculum plan
 */
export async function generateLanguageCurriculum(
  language: string,
  level: string,
  goals: string[],
  duration: number,
  learningStyle: string
): Promise<{
  language: string;
  level: string;
  goals: string[];
  overview: string;
  weeklyPlans: Array<{
    week: number;
    theme: string;
    grammarFocus: string;
    vocabularyFocus: string;
    activities: Array<{
      type: string;
      description: string;
      materials: string[];
    }>;
    assessments: string[];
  }>;
  resources: Array<{
    type: string;
    name: string;
    description: string;
  }>;
}> {
  try {
    const systemPrompt = `
      You are a language curriculum designer specialized in ${language}.
      Create a comprehensive ${duration}-week curriculum for ${level} level students learning ${language}
      with these goals: ${goals.join(', ')}. Adapt the curriculum for a ${learningStyle} learning style.
      
      Format your response as valid JSON with this structure:
      {
        "language": "${language}",
        "level": "${level}",
        "goals": ${JSON.stringify(goals)},
        "overview": "Summary of the curriculum approach",
        "weeklyPlans": [
          {
            "week": 1,
            "theme": "Weekly theme",
            "grammarFocus": "Grammar concept for the week",
            "vocabularyFocus": "Vocabulary focus for the week",
            "activities": [
              {
                "type": "Activity type (reading, writing, listening, speaking, etc.)",
                "description": "Detailed description of the activity",
                "materials": ["Required material 1", "Required material 2"]
              }
            ],
            "assessments": ["Assessment 1 description", "Assessment 2 description"]
          }
        ],
        "resources": [
          {
            "type": "Resource type (textbook, app, website, etc.)",
            "name": "Resource name",
            "description": "Description of how to use the resource"
          }
        ]
      }
      
      Include:
      - A concise overview of the curriculum approach
      - ${duration} weekly plans with cohesive themes
      - 3-5 activities per week that match the ${learningStyle} learning style
      - 1-2 assessments per week to track progress
      - 5-8 recommended resources specific to ${language} learning
      
      Ensure the curriculum progresses logically and builds toward the stated goals.
    `;

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 4000,
      messages: [
        { 
          role: 'user', 
          content: `Create a ${duration}-week ${level} level ${language} curriculum with these goals: ${goals.join(', ')} for a student with ${learningStyle} learning style.`
        }
      ],
      system: systemPrompt,
    });

    // Parse the JSON response
    const responseText = getTextFromResponse(response.content);
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse JSON from AI response');
    }
    
    const curriculumData = JSON.parse(jsonMatch[0]);

    // Validate required fields
    if (!curriculumData.overview || !Array.isArray(curriculumData.weeklyPlans) || 
        !Array.isArray(curriculumData.resources)) {
      throw new Error('AI response missing required curriculum fields');
    }

    return curriculumData;
  } catch (error) {
    console.error('Error generating language curriculum:', error);
    throw new Error('Failed to generate language curriculum');
  }
}

export default {
  generateVocabularyList,
  generateLanguageDialogue,
  generateGrammarExercises,
  generateCulturalLesson,
  analyzePronunciation,
  createLanguageAssessment,
  generateLanguageCurriculum
};