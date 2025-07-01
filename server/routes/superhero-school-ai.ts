import { Router, Request, Response } from 'express';
import { AnthropicService } from '../anthropic-service';

export const router = Router();

/**
 * @route POST /api/superhero-school/ai/generate-learning-plan
 * @desc Generate a personalized learning plan for neurodivergent students
 * @access Private
 */
router.post('/generate-learning-plan', async (req: Request, res: Response) => {
  try {
    const { studentProfile, neurotype, interests, subject } = req.body;
    
    if (!studentProfile || !neurotype || !subject) {
      return res.status(400).json({ 
        success: false, 
        message: 'Student profile, neurotype, and subject are required' 
      });
    }

    // Create system prompt for neurodivergent learning plan
    const systemPrompt = `You are an expert special education teacher specializing in creating 
    personalized learning plans for neurodivergent students. Your plans are evidence-based, 
    supportive, and appropriate for the specific neurotype of each student.`;
    
    // Create the main prompt
    const prompt = `Please create a personalized learning plan for a ${neurotype} student with the following profile:
    
    Student Profile: ${studentProfile}
    Subject: ${subject}
    Interests: ${interests.join(', ')}
    
    Your learning plan should include:
    1. Adaptations and accommodations specific to their neurotype
    2. Strengths-based approach that leverages their interests
    3. Specific strategies for the subject area
    4. Suggested pacing and structure
    5. Assessment recommendations
    
    Format as a JSON object with appropriate sections.`;
    
    const learningPlan = await AnthropicService.generateText(prompt, {
      systemPrompt: systemPrompt,
      maxTokens: 2048,
      temperature: 0.7
    });
    
    res.json({
      success: true,
      learningPlan
    });
  } catch (error: any) {
    console.error('Error generating learning plan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate learning plan',
      error: error.message
    });
  }
});

/**
 * @route POST /api/superhero-school/ai/create-mission
 * @desc Create a superhero-themed educational mission
 * @access Private
 */
router.post('/create-mission', async (req: Request, res: Response) => {
  try {
    const { subject, gradeLevel, neurotype } = req.body;
    
    if (!subject || !gradeLevel || !neurotype) {
      return res.status(400).json({ 
        success: false, 
        message: 'Subject, grade level, and neurotype are required' 
      });
    }

    // Create system prompt for superhero mission
    const systemPrompt = `You are an expert educational content creator specializing in
    creating engaging, superhero-themed educational content for neurodivergent students.
    Your missions are designed to be engaging, inclusive, and tailored to specific 
    learning needs while maintaining academic rigor.`;
    
    // Create the main prompt
    const prompt = `Please create a superhero-themed educational mission for a ${neurotype} student
    in grade ${gradeLevel} studying ${subject}.
    
    Your mission should include:
    1. A creative superhero scenario that incorporates ${subject} concepts
    2. Learning objectives aligned with grade ${gradeLevel} standards
    3. Step-by-step activities with accommodations for ${neurotype} students
    4. "Power-up" hints that students can use if they get stuck
    5. A final "boss challenge" that tests their understanding
    6. Reward system with digital badges or achievements
    
    Format as a JSON object with appropriate sections.`;
    
    const mission = await AnthropicService.generateText(prompt, {
      systemPrompt: systemPrompt,
      maxTokens: 2048,
      temperature: 0.7
    });
    
    res.json({
      success: true,
      mission
    });
  } catch (error: any) {
    console.error('Error creating superhero mission:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create superhero mission',
      error: error.message
    });
  }
});