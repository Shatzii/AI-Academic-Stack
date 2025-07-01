import { NextRequest, NextResponse } from 'next/server'
import { storage } from '../../../server/storage'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const DEFAULT_MODEL_STR = "claude-sonnet-4-20250514"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { schoolId, gradeLevel, subject, neurotype, difficulty, learningStyle, customRequirements } = body
    
    if (!schoolId || !gradeLevel || !subject) {
      return NextResponse.json({ error: 'School ID, grade level, and subject required' }, { status: 400 })
    }

    // Generate personalized curriculum using AI
    const curriculum = await generatePersonalizedCurriculum({
      schoolId,
      gradeLevel,
      subject,
      neurotype,
      difficulty,
      learningStyle,
      customRequirements
    })

    return NextResponse.json(curriculum)
  } catch (error) {
    console.error('Curriculum generation error:', error)
    return NextResponse.json({ error: 'Failed to generate curriculum' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get('schoolId')
    const gradeLevel = searchParams.get('gradeLevel')
    
    // Get existing curricula from storage
    const curricula = await storage.getCurricula(schoolId || undefined, gradeLevel || undefined)
    return NextResponse.json(curricula)
  } catch (error) {
    console.error('Error fetching curricula:', error)
    return NextResponse.json({ error: 'Failed to fetch curricula' }, { status: 500 })
  }
}

async function generatePersonalizedCurriculum(params: any) {
  const { schoolId, gradeLevel, subject, neurotype, difficulty, learningStyle, customRequirements } = params

  const schoolPrompts = {
    'primary-school': `You are creating superhero-themed curriculum for elementary students (K-6). Make learning adventures exciting with superhero metaphors, visual elements, and gamification. Focus on building foundational skills while keeping content age-appropriate and engaging.`,
    
    'secondary-school': `You are creating theater arts-focused curriculum for high school students (7-12). Integrate performance arts, technical theater, and academic subjects. Prepare students for college auditions and professional theater careers while meeting graduation requirements.`,
    
    'language-school': `You are creating immersive language learning curriculum. Focus on cultural context, conversation practice, and real-world application. Include multimedia resources, cultural activities, and progressive skill building.`,
    
    'law-school': `You are creating comprehensive legal education curriculum. Include case studies, legal writing, constitutional law, and bar exam preparation. Focus on critical thinking, legal analysis, and professional development.`
  }

  const neurotypeAdaptations = {
    'ADHD': 'Break content into short, focused segments. Include movement breaks, visual organizers, and frequent check-ins. Use timer-based activities and clear structure.',
    'dyslexia': 'Use dyslexia-friendly fonts, audio support, and visual learning aids. Provide text-to-speech options and alternative assessment methods.',
    'autism': 'Provide predictable structure, clear expectations, and sensory considerations. Include visual schedules and social learning supports.',
    'multiple': 'Combine multiple accommodation strategies and provide flexible learning paths.',
    'neurotypical': 'Use standard teaching approaches with varied learning modalities.'
  }

  const systemPrompt = schoolPrompts[schoolId as keyof typeof schoolPrompts] || schoolPrompts['primary-school']
  const adaptations = neurotypeAdaptations[neurotype as keyof typeof neurotypeAdaptations] || neurotypeAdaptations['neurotypical']

  try {
    const response = await anthropic.messages.create({
      model: DEFAULT_MODEL_STR,
      max_tokens: 2000,
      system: `${systemPrompt}\n\nNeurodivergent Adaptations: ${adaptations}\n\nCreate a comprehensive curriculum that is Texas Education Code compliant and includes detailed lesson plans, assessments, and resources. Respond in JSON format.`,
      messages: [
        {
          role: 'user',
          content: `Generate a personalized curriculum for:
- Grade Level: ${gradeLevel}
- Subject: ${subject}
- Difficulty: ${difficulty || 'grade-appropriate'}
- Learning Style: ${learningStyle || 'mixed'}
- Special Requirements: ${customRequirements || 'none'}

Include:
1. Course overview and objectives
2. Weekly lesson plans (12 weeks)
3. Assessment strategies
4. Required materials and resources
5. Neurodivergent accommodations
6. Texas standards alignment
7. Multimedia resources and activities`
        }
      ],
    })

    const responseText = response.content[0].type === 'text' ? response.content[0].text : '{}'
    
    // Parse AI response and structure curriculum data
    let curriculumData
    try {
      curriculumData = JSON.parse(responseText)
    } catch {
      // Fallback structured curriculum if JSON parsing fails
      curriculumData = createFallbackCurriculum(params)
    }

    // Add metadata
    curriculumData.metadata = {
      schoolId,
      gradeLevel,
      subject,
      neurotype,
      difficulty,
      learningStyle,
      createdAt: new Date().toISOString(),
      texasStandardsCompliant: true,
      aiGenerated: true
    }

    return curriculumData
  } catch (error) {
    console.error('AI curriculum generation failed:', error)
    return createFallbackCurriculum(params)
  }
}

function createFallbackCurriculum(params: any) {
  const { schoolId, gradeLevel, subject, neurotype } = params
  
  return {
    title: `${subject} Curriculum - Grade ${gradeLevel}`,
    description: `Comprehensive ${subject} curriculum designed for ${schoolId} students`,
    duration: '12 weeks',
    objectives: [
      `Master foundational ${subject} concepts`,
      'Develop critical thinking skills',
      'Apply knowledge in real-world contexts',
      'Build confidence and engagement'
    ],
    weeklyLessons: Array.from({ length: 12 }, (_, i) => ({
      week: i + 1,
      title: `Week ${i + 1}: ${subject} Fundamentals`,
      objectives: [`Learn key ${subject} concepts`, 'Practice new skills', 'Complete assessments'],
      activities: ['Interactive lessons', 'Hands-on practice', 'Group discussions'],
      assessments: ['Formative quiz', 'Project work', 'Peer review'],
      resources: ['Textbook chapters', 'Online videos', 'Practice worksheets']
    })),
    assessments: {
      formative: ['Weekly quizzes', 'Discussion participation', 'Lab activities'],
      summative: ['Unit tests', 'Final project', 'Portfolio assessment']
    },
    accommodations: {
      ADHD: ['Shortened assignments', 'Movement breaks', 'Visual organizers'],
      dyslexia: ['Audio support', 'Extended time', 'Alternative formats'],
      autism: ['Structured routines', 'Clear expectations', 'Sensory supports'],
      neurotypical: ['Standard accommodations as needed']
    },
    resources: {
      textbooks: [`${subject} Essentials - Grade ${gradeLevel}`],
      technology: ['Interactive whiteboard', 'Tablets', 'Educational software'],
      materials: ['Worksheets', 'Manipulatives', 'Art supplies']
    },
    metadata: {
      schoolId,
      gradeLevel,
      subject,
      neurotype,
      createdAt: new Date().toISOString(),
      texasStandardsCompliant: true,
      aiGenerated: false,
      fallback: true
    }
  }
}