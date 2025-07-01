/**
 * Enhanced Anthropic AI Service
 * 
 * This service provides advanced AI capabilities for ShotziOS using the Anthropic Claude API.
 * It includes support for multimodal content, personalized learning paths, 
 * and neurodivergent-adaptive content generation.
 */

const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs').promises;
const path = require('path');

// Initialize Anthropic client with API key
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
const CLAUDE_MODEL = 'claude-3-7-sonnet-20250219';

/**
 * Basic text prompt to Claude
 * @param {string} prompt - Text prompt to send to Claude
 * @param {object} options - Additional options
 * @returns {Promise<string>} - Claude's response text
 */
async function generateText(prompt, options = {}) {
  try {
    const response = await anthropic.messages.create({
      model: options.model || CLAUDE_MODEL,
      max_tokens: options.maxTokens || 1024,
      temperature: options.temperature || 0.7,
      messages: [{ role: 'user', content: prompt }],
    });

    return response.content[0].text;
  } catch (error) {
    console.error('Error generating text with Anthropic Claude:', error);
    throw new Error(`AI text generation error: ${error.message}`);
  }
}

/**
 * Generate content adapted for a specific neurotype
 * @param {string} subject - The subject of the content (e.g., 'Science', 'Math')
 * @param {string} topic - The specific topic within the subject
 * @param {string} neurotype - The neurotype to adapt for (e.g., 'ADHD', 'Dyslexia')
 * @param {string} level - The education level (e.g., 'elementary', 'middle school')
 * @returns {Promise<Object>} - The adapted content
 */
async function generateAdaptedContent(subject, topic, neurotype, level) {
  const prompt = `
    Generate educational content about ${subject}, specifically on the topic of "${topic}" 
    for a ${level} student with ${neurotype}. 
    
    The content should be optimized for the student's neurotype, taking into account their
    specific learning needs and strengths. Include:
    
    1. A clear, engaging title
    2. An introduction that hooks the student's interest
    3. The main educational content, broken into manageable chunks
    4. Visual descriptions or interactive elements that would help reinforce the material
    5. A brief summary of key points
    6. 2-3 questions for self-assessment
    
    Also include a list of specific adaptations you've made for this neurotype.
    
    Format your response as JSON with the following structure:
    {
      "title": "The title of the content",
      "introduction": "The engaging introduction",
      "mainContent": ["Section 1", "Section 2", "etc."],
      "visualElements": ["Description of visual 1", "etc."],
      "summary": "Brief summary of key points",
      "assessmentQuestions": ["Question 1", "Question 2", "etc."],
      "adaptations": ["Adaptation 1", "Adaptation 2", "etc."]
    }
  `;

  try {
    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 2500,
      temperature: 0.7,
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: "json_object" }
    });

    const adaptedContent = JSON.parse(response.content[0].text);
    return adaptedContent;
  } catch (error) {
    console.error('Error generating adapted content:', error);
    throw new Error(`AI adapted content generation error: ${error.message}`);
  }
}

/**
 * Generate a vocabulary list for language learning
 * @param {string} language - Target language (e.g., 'Spanish', 'German')
 * @param {string} topic - Topic for vocabulary (e.g., 'food', 'travel')
 * @param {string} level - Proficiency level (e.g., 'beginner', 'intermediate')
 * @returns {Promise<Array>} - Array of vocabulary items
 */
async function generateVocabularyList(language, topic, level) {
  const prompt = `
    Generate a vocabulary list for ${level} ${language} learners on the topic of "${topic}".
    
    For each vocabulary word, include:
    1. The word in ${language}
    2. The English translation
    3. Part of speech
    4. A simple example sentence in ${language}
    5. The translation of the example sentence
    
    Format your response as JSON with the following structure:
    [
      {
        "word": "the word in ${language}",
        "translation": "English translation",
        "partOfSpeech": "noun/verb/adjective/etc.",
        "exampleSentence": "A simple sentence using the word",
        "sentenceTranslation": "Translation of the example sentence"
      },
      ...
    ]
    
    Provide 20 vocabulary words relevant to ${topic}.
  `;

  try {
    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 2000,
      temperature: 0.7,
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: "json_object" }
    });

    const vocabularyList = JSON.parse(response.content[0].text);
    return vocabularyList;
  } catch (error) {
    console.error('Error generating vocabulary list:', error);
    throw new Error(`AI vocabulary generation error: ${error.message}`);
  }
}

/**
 * Generate a dialogue script for language practice
 * @param {string} language - Target language (e.g., 'Spanish', 'German')
 * @param {string} situation - Conversation situation (e.g., 'restaurant', 'hotel')
 * @param {string} level - Proficiency level (e.g., 'beginner', 'intermediate')
 * @returns {Promise<Object>} - Dialogue script with translations
 */
async function generateDialogue(language, situation, level) {
  const prompt = `
    Generate a realistic dialogue in ${language} for ${level} learners in a ${situation} setting.
    
    The dialogue should:
    1. Be appropriate for ${level} learners
    2. Include common phrases and vocabulary related to ${situation}
    3. Have 8-12 exchanges between two or more speakers
    
    Format your response as JSON with the following structure:
    {
      "title": "Title of the dialogue",
      "setting": "Brief description of the setting",
      "speakers": ["Speaker 1 name", "Speaker 2 name", ...],
      "dialogue": [
        {
          "speaker": "Speaker name",
          "original": "Text in ${language}",
          "translation": "English translation"
        },
        ...
      ],
      "keyPhrases": [
        {
          "phrase": "Key phrase in ${language}",
          "translation": "English translation",
          "usage": "Brief explanation of when/how to use this phrase"
        },
        ...
      ]
    }
    
    Include 5-7 key phrases from the dialogue that would be particularly useful for learners.
  `;

  try {
    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 2000,
      temperature: 0.7,
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: "json_object" }
    });

    const dialogue = JSON.parse(response.content[0].text);
    return dialogue;
  } catch (error) {
    console.error('Error generating dialogue:', error);
    throw new Error(`AI dialogue generation error: ${error.message}`);
  }
}

/**
 * Generate a legal case analysis
 * @param {string} caseDescription - Description of the legal case
 * @param {string} jurisdiction - Legal jurisdiction (e.g., 'UAE', 'International')
 * @param {string} legalArea - Area of law (e.g., 'Contract Law', 'Criminal Law')
 * @returns {Promise<Object>} - Legal analysis
 */
async function generateLegalAnalysis(caseDescription, jurisdiction, legalArea) {
  const prompt = `
    As a legal expert in ${jurisdiction} ${legalArea}, analyze the following case:
    
    "${caseDescription}"
    
    Provide a comprehensive legal analysis including:
    1. Key legal issues identified
    2. Applicable laws and precedents in ${jurisdiction}
    3. Analysis of potential arguments from both sides
    4. Likely outcome based on ${jurisdiction} legal principles
    5. Key citations and references
    
    Format your response as JSON with the following structure:
    {
      "legalIssues": ["Issue 1", "Issue 2", ...],
      "applicableLaws": [
        {
          "name": "Name of law or precedent",
          "description": "Brief description",
          "relevance": "How it applies to this case"
        },
        ...
      ],
      "plaintiffArguments": ["Argument 1", "Argument 2", ...],
      "defendantArguments": ["Argument 1", "Argument 2", ...],
      "analysis": "Detailed analysis text",
      "likelyOutcome": "Prediction of the likely legal outcome",
      "citations": ["Citation 1", "Citation 2", ...]
    }
  `;

  try {
    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 2500,
      temperature: 0.5,
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: "json_object" }
    });

    const legalAnalysis = JSON.parse(response.content[0].text);
    return legalAnalysis;
  } catch (error) {
    console.error('Error generating legal analysis:', error);
    throw new Error(`AI legal analysis generation error: ${error.message}`);
  }
}

/**
 * Analyze an image for educational content (multimodal capability)
 * @param {string} base64Image - Base64-encoded image data
 * @param {string} instructions - Specific instructions for the analysis
 * @returns {Promise<Object>} - Analysis of the image
 */
async function analyzeEducationalImage(base64Image, instructions) {
  try {
    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 1500,
      temperature: 0.2,
      messages: [{
        role: "user",
        content: [
          {
            type: "text",
            text: `Analyze this educational image and ${instructions}. Format your response as JSON with clear, detailed observations appropriate for educational contexts.`
          },
          {
            type: "image",
            source: {
              type: "base64",
              media_type: "image/jpeg",
              data: base64Image
            }
          }
        ]
      }],
      response_format: { type: "json_object" }
    });

    const analysis = JSON.parse(response.content[0].text);
    return analysis;
  } catch (error) {
    console.error('Error analyzing educational image:', error);
    throw new Error(`AI image analysis error: ${error.message}`);
  }
}

/**
 * Generate personalized learning recommendations
 * @param {Object} studentProfile - Profile containing student learning data
 * @returns {Promise<Object>} - Personalized learning recommendations
 */
async function generateLearningRecommendations(studentProfile) {
  const prompt = `
    Based on the following student profile, generate personalized learning recommendations:
    
    ${JSON.stringify(studentProfile, null, 2)}
    
    Provide recommendations that:
    1. Address the student's learning gaps
    2. Build on their strengths
    3. Align with their interests
    4. Consider their neurotype needs and learning style
    5. Provide a mix of reinforcement and new challenges
    
    Format your response as JSON with the following structure:
    {
      "strengths": ["Identified strength 1", "Identified strength 2", ...],
      "areasForImprovement": ["Area 1", "Area 2", ...],
      "recommendedActivities": [
        {
          "activity": "Name of activity",
          "description": "Brief description",
          "targetArea": "What learning area this targets",
          "difficulty": "easy/medium/challenging",
          "adaptations": "Any specific adaptations for this student"
        },
        ...
      ],
      "suggestedResources": [
        {
          "name": "Resource name",
          "type": "video/reading/exercise/game/etc.",
          "benefit": "How this helps the student"
        },
        ...
      ],
      "nextSteps": ["Recommended next step 1", "Recommended next step 2", ...]
    }
  `;

  try {
    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 2000,
      temperature: 0.7,
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: "json_object" }
    });

    const recommendations = JSON.parse(response.content[0].text);
    return recommendations;
  } catch (error) {
    console.error('Error generating learning recommendations:', error);
    throw new Error(`AI recommendation generation error: ${error.message}`);
  }
}

/**
 * Generate assessment questions
 * @param {string} subject - The subject area
 * @param {string} topic - The specific topic
 * @param {string} difficulty - Difficulty level (e.g., 'easy', 'medium', 'hard')
 * @param {string} questionType - Type of questions (e.g., 'multiple-choice', 'short-answer')
 * @param {number} count - Number of questions to generate
 * @returns {Promise<Array>} - Generated assessment questions
 */
async function generateAssessmentQuestions(subject, topic, difficulty, questionType, count) {
  const prompt = `
    Generate ${count} ${difficulty} ${questionType} questions for assessment on ${subject}, 
    specifically covering the topic of "${topic}".
    
    Format your response as JSON with the following structure:
    [
      {
        "question": "The question text",
        "questionType": "${questionType}",
        "options": ["Option A", "Option B", "Option C", "Option D"], (include only for multiple-choice)
        "correctAnswer": "The correct answer",
        "explanation": "Explanation of why this is the correct answer",
        "difficulty": "${difficulty}",
        "conceptsTested": ["Concept 1", "Concept 2"]
      },
      ...
    ]
    
    Ensure questions are appropriate for ${difficulty} level and test understanding, not just memorization.
  `;

  try {
    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 2500,
      temperature: 0.7,
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: "json_object" }
    });

    const questions = JSON.parse(response.content[0].text);
    return questions;
  } catch (error) {
    console.error('Error generating assessment questions:', error);
    throw new Error(`AI question generation error: ${error.message}`);
  }
}

/**
 * Generate feedback on student work
 * @param {string} studentWork - The student's submitted work
 * @param {string} assignmentContext - Context about the assignment
 * @param {string} learningObjectives - The learning objectives for the assignment
 * @param {string} neurotype - The student's neurotype (optional)
 * @returns {Promise<Object>} - Detailed feedback
 */
async function generateStudentFeedback(studentWork, assignmentContext, learningObjectives, neurotype = '') {
  const neurotypeSensitivePrompt = neurotype 
    ? `This feedback is for a student with ${neurotype}. Tailor your feedback to be supportive and effective for their specific learning style and needs.` 
    : '';

  const prompt = `
    Provide constructive, encouraging feedback on this student's work:
    
    Assignment Context: ${assignmentContext}
    
    Learning Objectives: ${learningObjectives}
    
    ${neurotypeSensitivePrompt}
    
    Student's Work:
    "${studentWork}"
    
    Format your response as JSON with the following structure:
    {
      "strengths": ["Strength 1", "Strength 2", ...],
      "areasForImprovement": ["Area 1", "Area 2", ...],
      "specificFeedback": "Detailed feedback addressing key aspects of the work",
      "suggestedNextSteps": ["Suggestion 1", "Suggestion 2", ...],
      "questions": ["Question to prompt reflection 1", "Question 2", ...],
      "overallAssessment": "Brief overall assessment of how well the work meets the learning objectives"
    }
    
    Ensure your feedback is:
    1. Specific and actionable
    2. Balanced between strengths and areas for improvement
    3. Supportive and encouraging
    4. Aligned with the learning objectives
    5. Includes questions that prompt further reflection
  `;

  try {
    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 2000,
      temperature: 0.7,
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: "json_object" }
    });

    const feedback = JSON.parse(response.content[0].text);
    return feedback;
  } catch (error) {
    console.error('Error generating student feedback:', error);
    throw new Error(`AI feedback generation error: ${error.message}`);
  }
}

module.exports = {
  generateText,
  generateAdaptedContent,
  generateVocabularyList,
  generateDialogue,
  generateLegalAnalysis,
  analyzeEducationalImage,
  generateLearningRecommendations,
  generateAssessmentQuestions,
  generateStudentFeedback
};