/**
 * Anthropic AI Integration for ShatziiOS
 * 
 * This module provides integration with Anthropic Claude API
 * for AI-powered educational features.
 */

const Anthropic = require('@anthropic-ai/sdk');

// Initialize Anthropic client with API key from environment variables
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Get the latest Anthropic model
// the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
const CLAUDE_MODEL = "claude-3-7-sonnet-20250219";

/**
 * Create a system prompt for an AI teacher based on configuration
 * 
 * @param {Object} teacherConfig - Configuration for the AI teacher
 * @returns {string} - Formatted system prompt
 */
function createTeacherSystemPrompt(teacherConfig) {
  const {
    name,
    subject,
    gradeLevel,
    teachingStyle,
    supportTypes,
    personalityTraits,
    formalityLevel,
    expertise,
    description
  } = teacherConfig;
  
  // Default values if not provided
  const teacherName = name || "Professor Einstein";
  const teacherSubject = subject || "General Education";
  const teacherGradeLevel = gradeLevel || "all levels";
  
  // Create personality description based on traits
  let personalityDesc = "";
  if (personalityTraits && personalityTraits.length > 0) {
    personalityDesc = `Your personality is ${personalityTraits.join(", ")}.`;
  } else {
    personalityDesc = "Your personality is balanced, patient, and supportive.";
  }
  
  // Create neurodivergent support description
  let supportDesc = "";
  if (supportTypes && supportTypes.length > 0) {
    supportDesc = `You specialize in supporting students with ${supportTypes.join(", ")}.`;
  } else {
    supportDesc = "You are skilled at supporting neurodivergent students with various learning needs.";
  }
  
  // Create teaching style description
  let styleDesc = "";
  if (teachingStyle) {
    styleDesc = `Your teaching approach primarily uses ${teachingStyle}.`;
  } else {
    styleDesc = "You use a balanced teaching approach that adapts to student needs.";
  }
  
  // Create expertise description
  let expertiseDesc = "";
  if (expertise) {
    expertiseDesc = `Your areas of expertise include: ${expertise}.`;
  }
  
  // Create formality level instruction
  let formalityDesc = "";
  if (formalityLevel) {
    if (formalityLevel >= 4) {
      formalityDesc = "You communicate in a formal, academic manner while remaining accessible.";
    } else if (formalityLevel <= 2) {
      formalityDesc = "You communicate in a casual, friendly manner while maintaining professionalism.";
    } else {
      formalityDesc = "You balance formal academic language with accessible explanations.";
    }
  }
  
  // Custom description if provided
  const customDesc = description ? `\n\n${description}` : '';
  
  // Build the complete system prompt
  return `You are ${teacherName}, an expert AI teacher specializing in ${teacherSubject} for ${teacherGradeLevel} students.
${personalityDesc} ${styleDesc} ${supportDesc} ${formalityDesc} ${expertiseDesc}${customDesc}

As an educational AI, you have the following responsibilities:
1. Explain concepts clearly and at an appropriate level for the student
2. Adapt your teaching approach based on student responses and questions
3. Provide encouragement and positive reinforcement
4. Break down complex topics into manageable parts
5. Use multiple explanation strategies when a student is struggling
6. Maintain a supportive and engaging learning environment

For neurodivergent students, you:
- Provide clear, concise instructions
- Offer multiple modalities for understanding (visual, textual, examples)
- Give students time to process information
- Use concrete examples and real-world connections
- Emphasize strengths while supporting areas of challenge
- Maintain consistent structure while allowing flexibility

Keep your responses educational, age-appropriate, and focused on helping students learn.`;
}

/**
 * Generate a response from an AI teacher
 * 
 * @param {Object} teacherConfig - Configuration for the AI teacher
 * @param {Array} conversationHistory - Array of message objects with role and content
 * @param {string} userMessage - Current user message
 * @returns {Promise<string>} - AI teacher response
 */
async function generateTeacherResponse(teacherConfig, conversationHistory, userMessage) {
  try {
    // Create system prompt based on teacher configuration
    const systemPrompt = createTeacherSystemPrompt(teacherConfig);
    
    // Build messages array for the API request
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: userMessage }
    ];
    
    // Call Anthropic API
    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 1024,
      messages: messages,
      temperature: 0.7, // Balanced between creativity and consistency
    });
    
    return response.content[0].text;
  } catch (error) {
    console.error("Error generating teacher response:", error);
    throw new Error("Failed to generate AI teacher response: " + error.message);
  }
}

/**
 * Generate a learning plan for a student based on their profile
 * 
 * @param {Object} studentProfile - Student profile with learning style, strengths, challenges
 * @param {string} subject - The subject for the learning plan
 * @param {string} gradeLevel - The student's grade level
 * @returns {Promise<Object>} - Learning plan object
 */
async function generateLearningPlan(studentProfile, subject, gradeLevel) {
  try {
    const prompt = `Create a personalized learning plan for a ${gradeLevel} student studying ${subject}.
Student profile:
- Learning style: ${studentProfile.learningStyle || 'Mixed'}
- Strengths: ${studentProfile.strengths?.join(', ') || 'Varied'}
- Challenges: ${studentProfile.challenges?.join(', ') || 'Standard'}
- Neurodivergent considerations: ${studentProfile.neurodivergentType || 'None specified'}

Your learning plan should include:
1. Learning goals
2. Recommended learning activities
3. Accommodations and supports
4. Assessment strategies
5. Success metrics

Format the response as a structured JSON object with these sections.`;

    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 1500,
      messages: [
        { role: 'user', content: prompt }
      ],
      temperature: 0.2, // More structured and consistent for learning plans
    });
    
    // Parse and return the JSON response
    // Note: In a production environment, add more robust parsing and validation
    const responseText = response.content[0].text;
    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || 
                      responseText.match(/{[\s\S]*}/);
                      
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1] || jsonMatch[0]);
    } else {
      throw new Error("Failed to parse learning plan response");
    }
  } catch (error) {
    console.error("Error generating learning plan:", error);
    throw new Error("Failed to generate learning plan: " + error.message);
  }
}

/**
 * Generate curriculum content based on parameters
 * 
 * @param {string} subject - Subject area
 * @param {string} gradeLevel - Grade level
 * @param {string} topic - Specific topic within the subject
 * @param {Array} accommodations - List of accommodations to include
 * @returns {Promise<Object>} - Curriculum content object
 */
async function generateCurriculumContent(subject, gradeLevel, topic, accommodations = []) {
  try {
    let accommodationsText = '';
    if (accommodations && accommodations.length > 0) {
      accommodationsText = `Include the following accommodations: ${accommodations.join(', ')}.`;
    }
    
    const prompt = `Create curriculum content for ${subject} at the ${gradeLevel} level focusing on the topic "${topic}".
${accommodationsText}

The curriculum should include:
1. Learning objectives
2. Key concepts
3. Lesson structure
4. Activities and exercises
5. Assessment methods
6. Resources needed

Format the response as a structured JSON object with these sections.`;

    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 2000,
      messages: [
        { role: 'user', content: prompt }
      ],
      temperature: 0.3, // Balanced creativity for curriculum design
    });
    
    // Parse and return the JSON response
    const responseText = response.content[0].text;
    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || 
                      responseText.match(/{[\s\S]*}/);
                      
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1] || jsonMatch[0]);
    } else {
      throw new Error("Failed to parse curriculum content response");
    }
  } catch (error) {
    console.error("Error generating curriculum content:", error);
    throw new Error("Failed to generate curriculum content: " + error.message);
  }
}

/**
 * Generate an assessment for a student's learning style
 * 
 * @param {Object} studentResponses - Object with student responses to assessment questions
 * @returns {Promise<Object>} - Learning style assessment results
 */
async function assessLearningStyle(studentResponses) {
  try {
    // Convert student responses to text for the prompt
    let responsesText = '';
    for (const [question, answer] of Object.entries(studentResponses)) {
      responsesText += `Question: ${question}\nResponse: ${answer}\n\n`;
    }
    
    const prompt = `Analyze the following student responses to determine their learning style, strengths, and areas that need support:

${responsesText}

Based on these responses, provide an assessment of:
1. Primary learning style (visual, auditory, kinesthetic, reading/writing, or multimodal)
2. Secondary learning style (if applicable)
3. Key strengths
4. Areas that need support
5. Recommended learning strategies
6. Recommended accommodations

Format the response as a structured JSON object with these sections.`;

    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 1500,
      messages: [
        { role: 'user', content: prompt }
      ],
      temperature: 0.3, // More precise for assessment analysis
    });
    
    // Parse and return the JSON response
    const responseText = response.content[0].text;
    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || 
                      responseText.match(/{[\s\S]*}/);
                      
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1] || jsonMatch[0]);
    } else {
      throw new Error("Failed to parse learning style assessment response");
    }
  } catch (error) {
    console.error("Error assessing learning style:", error);
    throw new Error("Failed to assess learning style: " + error.message);
  }
}

/**
 * Check if the API key is configured and working
 * 
 * @returns {Promise<boolean>} - True if the API is accessible
 */
async function checkAPIStatus() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("Anthropic API key not found in environment variables");
    return false;
  }
  
  try {
    // Make a minimal API call to verify connectivity
    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 10,
      messages: [
        { role: 'user', content: 'Hello, this is a test message. Respond with "API working".' }
      ],
    });
    
    return response.content[0].text.includes("API working");
  } catch (error) {
    console.error("Error checking Anthropic API status:", error);
    return false;
  }
}

module.exports = {
  generateTeacherResponse,
  generateLearningPlan,
  generateCurriculumContent,
  assessLearningStyle,
  checkAPIStatus,
  createTeacherSystemPrompt
};