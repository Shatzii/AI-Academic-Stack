import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const DEFAULT_MODEL_STR = "claude-sonnet-4-20250514"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, agentType, context, userId, schoolId } = body
    
    if (!message || !agentType) {
      return NextResponse.json({ error: 'Message and agent type required' }, { status: 400 })
    }

    // Generate AI response based on agent type and school context
    const aiResponse = await generateAIResponse(message, agentType, context, schoolId, userId)
    
    return NextResponse.json(aiResponse)
  } catch (error) {
    console.error('AI processing error:', error)
    return NextResponse.json({ error: 'Failed to process AI request' }, { status: 500 })
  }
}

async function generateAIResponse(message: string, agentType: string, context: any, schoolId: string, userId: string) {
  const systemPrompts = {
    'dean_wonder': `You are Dean Wonder, the AI assistant for the SuperHero School (Primary K-6). You help young students with their learning adventures using superhero themes. Be encouraging, use age-appropriate language, and make learning fun with superhero metaphors. Focus on building confidence and celebrating achievements.`,
    
    'dean_sterling': `You are Dean Sterling, the AI assistant for the Stage Prep School (Secondary 7-12). You help students with theater arts, academic excellence, and college preparation. Be professional yet supportive, focusing on artistic development, academic rigor, and career preparation in the performing arts.`,
    
    'professor_barrett': `You are Professor Barrett, the AI legal expert for The Lawyer Makers law school. You provide guidance on legal studies, case analysis, bar exam preparation, and professional development. Be scholarly, precise, and help students develop critical legal thinking skills.`,
    
    'professor_lingua': `You are Professor Lingua, the AI language expert for the Language Learning School. You help students master multiple languages through immersive cultural experiences. Be multilingual, culturally aware, and adapt your teaching style to different language learning approaches.`
  }

  const systemPrompt = systemPrompts[agentType as keyof typeof systemPrompts] || systemPrompts['dean_wonder']

  try {
    const response = await anthropic.messages.create({
      model: DEFAULT_MODEL_STR,
      max_tokens: 1000,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Context: ${JSON.stringify(context)}\n\nStudent message: ${message}`
        }
      ],
    })

    const responseText = response.content[0].type === 'text' ? response.content[0].text : 'I can help you with your learning!'

    // Generate contextual suggestions based on school and agent
    const suggestions = generateSuggestions(agentType, schoolId)

    return {
      text: responseText,
      suggestions,
      agentType,
      timestamp: new Date().toISOString(),
      context: {
        ...context,
        lastInteraction: new Date().toISOString(),
        messageCount: (context?.messageCount || 0) + 1
      }
    }
  } catch (error) {
    console.error('Anthropic API error:', error)
    
    // Fallback response if AI service fails
    const fallbackResponses = {
      'dean_wonder': 'Hello, young hero! I\'m here to help you with your learning adventures. What superhero skill would you like to work on today?',
      'dean_sterling': 'Welcome to Stage Prep School! I\'m here to help you excel in your theatrical and academic journey. How can I assist you today?',
      'professor_barrett': 'Greetings, future legal professional. I\'m here to guide you through your legal studies. What legal concept can I help clarify?',
      'professor_lingua': 'Hello! I\'m here to help you master new languages and explore different cultures. Which language adventure shall we begin?'
    }

    return {
      text: fallbackResponses[agentType as keyof typeof fallbackResponses] || fallbackResponses['dean_wonder'],
      suggestions: generateSuggestions(agentType, schoolId),
      agentType,
      timestamp: new Date().toISOString(),
      fallback: true
    }
  }
}

function generateSuggestions(agentType: string, schoolId: string) {
  const suggestionsByAgent = {
    'dean_wonder': [
      'Show me my superhero achievements',
      'What learning adventure should I try next?',
      'Help me with my math superpowers',
      'Tell me about my progress',
      'What sensory break activities can I do?'
    ],
    'dean_sterling': [
      'Review my academic performance',
      'Help me prepare for college auditions',
      'Show me graduation requirements',
      'Assist with my theater portfolio',
      'What scholarships are available?'
    ],
    'professor_barrett': [
      'Explain this legal concept',
      'Help me with case analysis',
      'Review bar exam topics',
      'Discuss constitutional law',
      'Help with legal writing'
    ],
    'professor_lingua': [
      'Practice conversation in Spanish',
      'Learn German cultural customs',
      'Help with pronunciation',
      'Translate this text',
      'Plan my language immersion'
    ]
  }

  return suggestionsByAgent[agentType as keyof typeof suggestionsByAgent] || suggestionsByAgent['dean_wonder']
}