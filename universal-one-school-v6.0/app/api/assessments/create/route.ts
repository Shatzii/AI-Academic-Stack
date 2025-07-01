import { NextRequest, NextResponse } from 'next/server'
import { storage } from '../../../../server/storage'
import { insertAssessmentSchema } from '../../../../shared/schema'
import Anthropic from '@anthropic-ai/sdk'
import { z } from 'zod'

const DEFAULT_MODEL_STR = "claude-sonnet-4-20250514";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const createAssessmentSchema = z.object({
  title: z.string().min(1),
  type: z.enum(['quiz', 'test', 'project', 'portfolio', 'observation']),
  subject: z.string().min(1),
  gradeLevel: z.string().min(1),
  curriculumModuleId: z.string().optional(),
  difficulty: z.string().optional(),
  timeLimit: z.number().optional(),
  passingScore: z.number().min(0).max(100).default(70),
  maxScore: z.number().min(1).default(100),
  neurodivergentSupport: z.array(z.string()).default([]),
  accommodationOptions: z.array(z.string()).default([]),
  creatorId: z.string(),
  aiGenerated: z.boolean().default(true),
  customRequirements: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createAssessmentSchema.parse(body)

    let questions = []
    let rubric = {}

    if (validatedData.aiGenerated) {
      // Generate assessment using AI
      const aiResult = await generateAssessmentWithAI(validatedData)
      questions = aiResult.questions
      rubric = aiResult.rubric
    }

    const assessment = await storage.createAssessment({
      title: validatedData.title,
      type: validatedData.type,
      subject: validatedData.subject,
      gradeLevel: validatedData.gradeLevel,
      curriculumModuleId: validatedData.curriculumModuleId,
      questions,
      rubric,
      accommodationOptions: validatedData.accommodationOptions,
      timeLimit: validatedData.timeLimit,
      passingScore: validatedData.passingScore,
      maxScore: validatedData.maxScore,
      difficulty: validatedData.difficulty,
      tags: [validatedData.subject, validatedData.gradeLevel],
      creatorId: validatedData.creatorId,
      isPublished: false
    })

    return NextResponse.json({
      success: true,
      assessment,
      message: 'Assessment created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Assessment creation error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create assessment' },
      { status: 500 }
    )
  }
}

async function generateAssessmentWithAI(params: any) {
  const systemPrompt = `You are an expert assessment creator specializing in neurodivergent-inclusive evaluation methods. Create comprehensive assessments that accurately measure learning while providing appropriate accommodations.

Assessment types to include:
- Traditional questions (multiple choice, short answer, essay)
- Alternative formats (visual, hands-on, verbal)
- Accommodation options for different needs
- Rubrics that account for diverse expression methods
- Progress indicators beyond test scores

Always maintain academic rigor while ensuring accessibility for students with ADHD, dyslexia, autism, and other learning differences.`

  const userPrompt = `Create a comprehensive ${params.type} assessment for:
- Subject: ${params.subject}
- Grade Level: ${params.gradeLevel}
- Difficulty: ${params.difficulty || 'appropriate'}
- Time Limit: ${params.timeLimit || 'flexible'} minutes
- Neurodivergent Support: ${params.neurodivergentSupport.join(', ')}
- Max Score: ${params.maxScore}
- Passing Score: ${params.passingScore}%

${params.customRequirements ? `Additional Requirements: ${params.customRequirements}` : ''}

Provide the response in JSON format with:
{
  "questions": [
    {
      "id": "unique_id",
      "type": "multiple_choice|short_answer|essay|visual|interactive",
      "question": "question text",
      "options": ["option1", "option2", "option3", "option4"] (for multiple choice),
      "correctAnswer": "correct answer or key points",
      "points": point_value,
      "accommodations": ["extended_time", "text_to_speech", "visual_aids"],
      "explanation": "why this answer is correct"
    }
  ],
  "rubric": {
    "criteria": [
      {
        "name": "criterion name",
        "description": "what this measures",
        "levels": [
          {"level": "Exceeds", "points": 4, "description": "exceptional work"},
          {"level": "Meets", "points": 3, "description": "proficient work"},
          {"level": "Approaching", "points": 2, "description": "developing work"},
          {"level": "Below", "points": 1, "description": "needs support"}
        ]
      }
    ],
    "accommodationNotes": "how to apply accommodations to scoring"
  }
}`

  const response = await anthropic.messages.create({
    model: DEFAULT_MODEL_STR,
    max_tokens: 4000,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }]
  })

  const content = (response.content[0] as any).text || 'Assessment generation failed'
  
  try {
    const parsedContent = JSON.parse(content)
    return {
      questions: parsedContent.questions || [],
      rubric: parsedContent.rubric || {}
    }
  } catch (parseError) {
    console.error('Failed to parse AI response:', parseError)
    return {
      questions: [{
        id: '1',
        type: 'short_answer',
        question: `Sample question for ${params.subject}`,
        correctAnswer: 'Sample answer',
        points: 10,
        accommodations: params.neurodivergentSupport,
        explanation: 'Sample explanation'
      }],
      rubric: {
        criteria: [{
          name: 'Understanding',
          description: 'Demonstrates comprehension of the topic',
          levels: [
            { level: 'Exceeds', points: 4, description: 'Exceptional understanding' },
            { level: 'Meets', points: 3, description: 'Proficient understanding' },
            { level: 'Approaching', points: 2, description: 'Developing understanding' },
            { level: 'Below', points: 1, description: 'Needs support' }
          ]
        }]
      }
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const subject = searchParams.get('subject')
    const gradeLevel = searchParams.get('gradeLevel')
    const type = searchParams.get('type')
    const creatorId = searchParams.get('creatorId')

    const assessments = await storage.getAssessments({
      subject: subject || undefined,
      gradeLevel: gradeLevel || undefined,
      type: type || undefined,
      creatorId: creatorId || undefined
    })

    return NextResponse.json({
      success: true,
      assessments,
      total: assessments.length
    })

  } catch (error) {
    console.error('Assessment fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch assessments' },
      { status: 500 }
    )
  }
}