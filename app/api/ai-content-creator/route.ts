import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const DEFAULT_MODEL_STR = "claude-sonnet-4-20250514";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { type, subject, gradeLevel, topic, duration, learningObjectives, neurodivergentSupport, difficulty } = await request.json()

    const systemPrompt = `You are an expert educational content creator specializing in neurodivergent-inclusive learning materials. Create comprehensive, engaging educational content that incorporates specific accommodations and adaptations.

Content Creation Guidelines:
- Design for Universal Learning Design principles
- Include multiple modalities (visual, auditory, kinesthetic)
- Provide clear structure and organization
- Use inclusive language and examples
- Include specific neurodivergent accommodations
- Ensure content is age-appropriate and academically rigorous

For ${type} content:
${getContentTypeGuidelines(type)}

Neurodivergent Support Guidelines:
${neurodivergentSupport.map(support => getSupportGuidelines(support)).join('\n')}

Return content in this JSON format:
{
  "title": "Engaging title for the content",
  "content": "Detailed content with clear structure and activities",
  "materials": ["List of required materials"],
  "assessments": ["Assessment methods with accommodations"],
  "adaptations": ["Specific neurodivergent adaptations included"],
  "timeline": "Suggested timing breakdown"
}`

    const userPrompt = `Create a ${type} for ${subject} at ${gradeLevel} level on the topic "${topic}".

Duration: ${duration} minutes
Difficulty: ${difficulty}
Learning Objectives:
${learningObjectives.map((obj, i) => `${i + 1}. ${obj}`).join('\n')}

Neurodivergent Support Needed: ${neurodivergentSupport.join(', ')}

Create comprehensive, engaging content with practical activities and clear accommodations.`

    const response = await anthropic.messages.create({
      model: DEFAULT_MODEL_STR,
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }]
    })

    const contentText = (response.content[0] as any).text
    
    // Extract JSON from response
    let generatedContent
    try {
      const jsonMatch = contentText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        generatedContent = JSON.parse(jsonMatch[0])
      } else {
        // Fallback if JSON parsing fails
        generatedContent = {
          title: `${subject}: ${topic}`,
          content: contentText,
          materials: ['Basic school supplies', 'Computer or tablet', 'Internet access'],
          assessments: ['Formative assessment', 'Peer discussion', 'Practical application'],
          adaptations: neurodivergentSupport,
          timeline: `${duration} minutes total`
        }
      }
    } catch (parseError) {
      generatedContent = {
        title: `${subject}: ${topic}`,
        content: contentText,
        materials: ['Basic school supplies', 'Computer or tablet'],
        assessments: ['Flexible assessment options'],
        adaptations: neurodivergentSupport,
        timeline: `${duration} minutes`
      }
    }

    return NextResponse.json({ content: generatedContent })
  } catch (error) {
    console.error('AI Content Creator API Error:', error)
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 })
  }
}

function getContentTypeGuidelines(type: string): string {
  const guidelines = {
    lesson: 'Include warm-up, main instruction, guided practice, independent work, and closure. Provide multiple engagement strategies.',
    worksheet: 'Create interactive exercises with clear instructions, varied question types, and visual supports.',
    quiz: 'Design adaptive questions with multiple difficulty levels and accommodation options.',
    presentation: 'Structure with clear headings, visual elements, and interactive components.',
    'study-guide': 'Organize information hierarchically with visual organizers and memory aids.'
  }
  return guidelines[type as keyof typeof guidelines] || 'Create engaging, structured educational content.'
}

function getSupportGuidelines(support: string): string {
  const guidelines = {
    'ADHD Support': '- Break content into small chunks\n- Include movement breaks\n- Use timers and clear transitions\n- Minimize distractions',
    'Dyslexia Support': '- Use clear, simple fonts\n- Provide audio alternatives\n- Include phonetic supports\n- Avoid complex layouts',
    'Autism Support': '- Provide clear structure and routines\n- Use concrete examples\n- Avoid sensory overload\n- Include social cues',
    'Visual Learning': '- Include diagrams and charts\n- Use color coding\n- Provide graphic organizers\n- Add visual instructions',
    'Kinesthetic Learning': '- Include hands-on activities\n- Add movement components\n- Use manipulatives\n- Encourage active participation',
    'Extended Time': '- Allow flexible pacing\n- Provide additional processing time\n- Break tasks into smaller parts\n- Include check-in points',
    'Simplified Language': '- Use clear, concise language\n- Define technical terms\n- Provide context clues\n- Use familiar examples'
  }
  return guidelines[support] || '- Provide appropriate accommodations'
}