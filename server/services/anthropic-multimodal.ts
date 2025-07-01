import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs/promises';
import { getTextFromResponse } from './ai-helper';

// Create Anthropic client instance
// The newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Analyzes an educational image and provides detailed explanations
 * 
 * @param imagePath Path to the image file
 * @param prompt Custom prompt to guide the image analysis
 * @param subject Academic subject context
 * @param gradeLevel Student grade level
 * @returns Analysis of the image with educational context
 */
export async function analyzeEducationalImage(
  imagePath: string,
  prompt: string,
  subject: string,
  gradeLevel: string
): Promise<string> {
  try {
    // Read the image file as base64
    const imageBuffer = await fs.readFile(imagePath);
    const base64Image = imageBuffer.toString('base64');

    // Construct prompt based on educational context
    const contextualPrompt = `You are an expert ${subject} educator for ${gradeLevel} students. 
    ${prompt}
    
    Provide an explanation that is appropriate for ${gradeLevel} students.
    Include key concepts, learning objectives, and suggested activities based on this image.`;

    // Call Anthropic API with the image
    const response = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: [
          {
            type: "text",
            text: contextualPrompt
          },
          {
            type: "image",
            source: {
              type: "base64",
              media_type: determineMediaType(imagePath),
              data: base64Image
            }
          }
        ]
      }]
    });

    return getTextFromResponse(response);
  } catch (error) {
    console.error("Error analyzing educational image:", error);
    throw new Error(`Failed to analyze educational image: ${error.message}`);
  }
}

/**
 * Analyzes a student's drawing or artwork and provides developmental feedback
 * 
 * @param imagePath Path to the image file
 * @param studentAge Age of the student
 * @param neurotype Student's neurotype (if applicable)
 * @param artPrompt Original art prompt given to the student
 * @returns Encouraging feedback and developmental assessment
 */
export async function analyzeStudentArtwork(
  imagePath: string,
  studentAge: number,
  neurotype: string | null,
  artPrompt: string
): Promise<string> {
  try {
    // Read the image file as base64
    const imageBuffer = await fs.readFile(imagePath);
    const base64Image = imageBuffer.toString('base64');

    // Construct prompt with developmental context
    let contextualPrompt = `You are a supportive art educator analyzing a student's artwork. 
    This artwork was created by a ${studentAge}-year-old student`;
    
    if (neurotype) {
      contextualPrompt += ` with ${neurotype}`;
    }
    
    contextualPrompt += `.
    The student was responding to this prompt: "${artPrompt}"
    
    Please provide:
    1. Positive, encouraging feedback
    2. Observations about developmental stage
    3. Suggestions for next steps in their artistic development
    4. If applicable, how this artwork reflects their ${neurotype || "typical"} development
    
    Use a warm, supportive tone appropriate for educators and parents.`;

    // Call Anthropic API with the image
    const response = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: [
          {
            type: "text",
            text: contextualPrompt
          },
          {
            type: "image",
            source: {
              type: "base64",
              media_type: determineMediaType(imagePath),
              data: base64Image
            }
          }
        ]
      }]
    });

    return getTextFromResponse(response);
  } catch (error) {
    console.error("Error analyzing student artwork:", error);
    throw new Error(`Failed to analyze student artwork: ${error.message}`);
  }
}

/**
 * Determines the MIME type based on file extension
 * 
 * @param filePath Path to the image file
 * @returns Appropriate MIME type for the file
 */
function determineMediaType(filePath: string): string {
  const extension = filePath.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'webp':
      return 'image/webp';
    default:
      return 'image/jpeg'; // Default fallback
  }
}

/**
 * Creates a visual learning assessment based on a diagram or chart
 * 
 * @param imagePath Path to the diagram or chart image
 * @param subject Academic subject
 * @param conceptName Name of the concept being assessed
 * @param gradeLevel Student grade level
 * @returns Assessment questions and answer key based on the visual
 */
export async function createVisualAssessment(
  imagePath: string,
  subject: string,
  conceptName: string,
  gradeLevel: string
): Promise<string> {
  try {
    // Read the image file as base64
    const imageBuffer = await fs.readFile(imagePath);
    const base64Image = imageBuffer.toString('base64');

    // Construct prompt for assessment creation
    const contextualPrompt = `You are an educational assessment designer for ${subject} at the ${gradeLevel} level.
    
    Looking at this diagram/chart related to ${conceptName}, create:
    1. 5 assessment questions of varying difficulty that test understanding of the visual
    2. A mixture of question types (multiple choice, short answer, etc.)
    3. An answer key with explanations
    4. Extension questions for advanced students
    
    Format the output in a structured way that could be directly used by an educator.`;

    // Call Anthropic API with the image
    const response = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 1500,
      messages: [{
        role: "user",
        content: [
          {
            type: "text",
            text: contextualPrompt
          },
          {
            type: "image",
            source: {
              type: "base64",
              media_type: determineMediaType(imagePath),
              data: base64Image
            }
          }
        ]
      }]
    });

    return getTextFromResponse(response);
  } catch (error) {
    console.error("Error creating visual assessment:", error);
    throw new Error(`Failed to create visual assessment: ${error.message}`);
  }
}