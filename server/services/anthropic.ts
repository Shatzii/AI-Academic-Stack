import Anthropic from '@anthropic-ai/sdk';

// the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Helper function to extract text from response content
export function getTextFromResponse(content: any[]): string {
  if (content && content.length > 0 && content[0].type === 'text' && 'text' in content[0]) {
    return content[0].text;
  }
  return 'No text response available';
}

/**
 * Generates a response from Claude for a conversation
 * @param messages Array of message objects with role and content
 * @param systemPrompt Optional system prompt to guide Claude's behavior
 * @returns The AI response text
 */
export async function generateChatResponse(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  systemPrompt?: string
): Promise<string> {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-7-sonnet-20250219',
      max_tokens: 1500,
      messages: messages,
      system: systemPrompt || "You are an educational AI assistant specialized in helping neurodivergent learners. Be clear, patient, and adapt your teaching style to the student's needs.",
    });

    return getTextFromResponse(response.content);
  } catch (error) {
    console.error('Error generating chat response:', error);
    throw new Error('Failed to generate response from AI assistant');
  }
}

/**
 * Analyzes a student's learning progress and provides insights
 * @param studentText The student's work or responses to analyze
 * @param subject The academic subject being studied
 * @param gradeLevel The student's grade level
 * @param learningObjectives The specific learning objectives to assess
 * @returns Analysis with proficiency level and feedback
 */
export async function analyzeLearningProgress(
  studentText: string,
  subject: string,
  gradeLevel: string,
  learningObjectives: string
): Promise<{
  proficiencyLevel: number;
  strengthAreas: string[];
  improvementAreas: string[];
  feedback: string;
}> {
  try {
    const systemPrompt = `
      You are an educational assessment AI specialized in analyzing student learning.
      Evaluate the student's work and provide:
      1. A proficiency level from 1-5 (1=beginner, 5=expert)
      2. Areas of strength (3-5 bullet points)
      3. Areas needing improvement (3-5 bullet points)
      4. Constructive feedback that's encouraging and specific
      
      Format your response as valid JSON with these exact keys:
      {
        "proficiencyLevel": number,
        "strengthAreas": string[],
        "improvementAreas": string[],
        "feedback": string
      }
      
      Base your assessment on grade level "${gradeLevel}" for subject "${subject}" with these learning objectives: ${learningObjectives}
    `;

    const response = await anthropic.messages.create({
      model: 'claude-3-7-sonnet-20250219',
      max_tokens: 1500,
      messages: [
        { 
          role: 'user', 
          content: `Here is my work for analysis:\n\n${studentText}`
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
    
    const analysisData = JSON.parse(jsonMatch[0]);

    // Ensure we have all required fields
    if (!analysisData.proficiencyLevel || 
        !analysisData.strengthAreas || 
        !analysisData.improvementAreas || 
        !analysisData.feedback) {
      throw new Error('AI response missing required assessment fields');
    }

    return {
      proficiencyLevel: Math.min(5, Math.max(1, analysisData.proficiencyLevel)), // Ensure between 1-5
      strengthAreas: analysisData.strengthAreas,
      improvementAreas: analysisData.improvementAreas,
      feedback: analysisData.feedback
    };
  } catch (error) {
    console.error('Error analyzing learning progress:', error);
    throw new Error('Failed to analyze learning progress');
  }
}

/**
 * Generates a personalized learning plan based on student profile
 * @param studentProfile Information about the student
 * @param learningStyle The student's preferred learning style
 * @param neurotype The student's neurotype, if applicable
 * @param currentKnowledge Current knowledge level
 * @param learningGoals Learning goals to achieve
 * @returns Structured learning plan
 */
export async function generateLearningPlan(
  studentProfile: {
    gradeLevel: string;
    subject: string;
    interests: string[];
  },
  learningStyle: string,
  neurotype: string,
  currentKnowledge: string,
  learningGoals: string
): Promise<{
  recommendedActivities: string[];
  suggestedResources: string[];
  milestones: string[];
  adaptations: string[];
}> {
  try {
    const systemPrompt = `
      You are an educational planning specialist with expertise in personalized learning and neurodiversity.
      Create a personalized learning plan based on the student profile, learning style, neurotype, current knowledge, and learning goals.
      
      Format your response as valid JSON with these exact keys:
      {
        "recommendedActivities": string[],  // 5-7 activities appropriate for this student
        "suggestedResources": string[],     // 3-5 specific resources that match their needs
        "milestones": string[],             // 3-4 achievable milestones to track progress
        "adaptations": string[]             // 3-5 specific adaptations based on neurotype and learning style
      }
    `;

    const content = `
      Please create a personalized learning plan with the following details:
      
      STUDENT PROFILE:
      - Grade Level: ${studentProfile.gradeLevel}
      - Subject: ${studentProfile.subject}
      - Interests: ${studentProfile.interests.join(', ')}
      
      LEARNING PREFERENCES:
      - Learning Style: ${learningStyle}
      - Neurotype: ${neurotype}
      
      CURRENT & GOAL:
      - Current Knowledge: ${currentKnowledge}
      - Learning Goals: ${learningGoals}
    `;

    const response = await anthropic.messages.create({
      model: 'claude-3-7-sonnet-20250219',
      max_tokens: 2000,
      messages: [{ role: 'user', content }],
      system: systemPrompt,
    });

    // Parse the JSON response
    const responseText = getTextFromResponse(response.content);
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse JSON from AI response');
    }
    
    const planData = JSON.parse(jsonMatch[0]);

    // Ensure we have all required fields
    if (!planData.recommendedActivities || 
        !planData.suggestedResources || 
        !planData.milestones || 
        !planData.adaptations) {
      throw new Error('AI response missing required learning plan fields');
    }

    return {
      recommendedActivities: planData.recommendedActivities,
      suggestedResources: planData.suggestedResources,
      milestones: planData.milestones,
      adaptations: planData.adaptations
    };
  } catch (error) {
    console.error('Error generating learning plan:', error);
    throw new Error('Failed to generate personalized learning plan');
  }
}

/**
 * Analyze an image and provide educational content based on it
 * @param base64Image The image in base64 format
 * @param instructions Instructions for the analysis
 * @returns Educational content based on the image
 */
export async function analyzeImageForEducation(
  base64Image: string,
  instructions: string
): Promise<string> {
  try {
    const response = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 1500,
      messages: [{
        role: "user",
        content: [
          {
            type: "text",
            text: instructions || "Analyze this image and provide educational content suitable for students."
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
      }]
    });

    return getTextFromResponse(response.content);
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw new Error('Failed to analyze image for educational content');
  }
}

/**
 * Generates a quiz based on a topic and difficulty level
 * @param topic The topic to generate a quiz for
 * @param difficulty The difficulty level (1-5)
 * @param questionCount Number of questions to generate
 * @returns A structured quiz with questions and answers
 */
export async function generateQuiz(
  topic: string,
  difficulty: number,
  questionCount: number = 5
): Promise<{
  questions: Array<{
    question: string;
    options?: string[];
    answer: string;
    explanation: string;
  }>
}> {
  try {
    const difficultyLevel = Math.min(5, Math.max(1, difficulty));
    const count = Math.min(10, Math.max(1, questionCount));
    
    const systemPrompt = `
      You are a specialized educational quiz creator.
      Generate a quiz on the topic "${topic}" with a difficulty level of ${difficultyLevel}/5 and ${count} questions.
      
      Format your response as valid JSON with this structure:
      {
        "questions": [
          {
            "question": "The question text",
            "options": ["Option A", "Option B", "Option C", "Option D"],  // Include for multiple choice, omit for open-ended
            "answer": "The correct answer or 'Option A'", 
            "explanation": "Explanation of why this is correct"
          }
        ]
      }
      
      Mix multiple choice and open-ended questions as appropriate for the topic.
      For difficulty levels 1-2, create simpler questions.
      For difficulty levels 4-5, create more challenging questions.
    `;

    const response = await anthropic.messages.create({
      model: 'claude-3-7-sonnet-20250219',
      max_tokens: 2500,
      messages: [
        { 
          role: 'user', 
          content: `Please create a quiz on "${topic}" with ${count} questions at difficulty level ${difficultyLevel}/5.`
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
    
    const quizData = JSON.parse(jsonMatch[0]);

    // Validate quiz structure
    if (!quizData.questions || !Array.isArray(quizData.questions) || quizData.questions.length === 0) {
      throw new Error('AI response missing valid questions array');
    }

    return quizData;
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw new Error('Failed to generate quiz');
  }
}

export default {
  generateChatResponse,
  analyzeLearningProgress,
  generateLearningPlan,
  analyzeImageForEducation,
  generateQuiz
};