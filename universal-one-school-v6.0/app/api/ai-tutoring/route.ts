import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const DEFAULT_MODEL_STR = "claude-sonnet-4-20250514"

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface TutoringSession {
  sessionId: string
  userId: string
  agentId: string
  messages: ChatMessage[]
  subject?: string
  gradeLevel?: string
  neurotype?: string
  createdAt: Date
  lastActivity: Date
}

// In-memory session storage (in production, use database)
const activeSessions = new Map<string, TutoringSession>()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, sessionId, userId, agentId, message, context } = body

    switch (action) {
      case 'start_session':
        const session = await startTutoringSession(userId, agentId, context)
        return NextResponse.json(session)

      case 'send_message':
        const response = await processMessage(sessionId, message, context)
        return NextResponse.json(response)

      case 'end_session':
        await endTutoringSession(sessionId)
        return NextResponse.json({ success: true, message: 'Session ended' })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('AI Tutoring error:', error)
    return NextResponse.json({ error: 'Failed to process tutoring request' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')
    const userId = searchParams.get('userId')

    if (sessionId) {
      const session = activeSessions.get(sessionId)
      if (!session) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 })
      }
      return NextResponse.json(session)
    }

    if (userId) {
      const userSessions = Array.from(activeSessions.values())
        .filter(session => session.userId === userId)
      return NextResponse.json(userSessions)
    }

    return NextResponse.json({ error: 'SessionId or userId required' }, { status: 400 })
  } catch (error) {
    console.error('Get tutoring session error:', error)
    return NextResponse.json({ error: 'Failed to retrieve session' }, { status: 500 })
  }
}

async function startTutoringSession(userId: string, agentId: string, context: any): Promise<TutoringSession> {
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  const welcomeMessage = await generateWelcomeMessage(agentId, context)
  
  const session: TutoringSession = {
    sessionId,
    userId,
    agentId,
    messages: [
      {
        role: 'assistant',
        content: welcomeMessage
      }
    ],
    subject: context?.subject,
    gradeLevel: context?.gradeLevel,
    neurotype: context?.neurotype,
    createdAt: new Date(),
    lastActivity: new Date()
  }

  activeSessions.set(sessionId, session)
  return session
}

async function processMessage(sessionId: string, userMessage: string, context: any) {
  const session = activeSessions.get(sessionId)
  if (!session) {
    throw new Error('Session not found')
  }

  // Add user message to session
  session.messages.push({
    role: 'user',
    content: userMessage
  })

  // Generate AI response
  const aiResponse = await generateAIResponse(session, userMessage, context)

  // Add AI response to session
  session.messages.push({
    role: 'assistant',
    content: aiResponse
  })

  session.lastActivity = new Date()
  activeSessions.set(sessionId, session)

  return {
    sessionId,
    message: aiResponse,
    timestamp: new Date().toISOString()
  }
}

async function generateWelcomeMessage(agentId: string, context: any): Promise<string> {
  const agentPersonalities = {
    dean_wonder: {
      name: 'Dean Wonder',
      persona: 'enthusiastic superhero-themed tutor for K-6 students',
      greeting: "🦸‍♂️ Hey there, future superhero! I'm Dean Wonder, and I'm here to help you discover your learning superpowers!"
    },
    dean_sterling: {
      name: 'Dean Sterling',
      persona: 'dramatic theater arts tutor for 7-12 students',
      greeting: "🎭 Welcome to the stage of learning! I'm Dean Sterling, your theatrical learning companion."
    },
    professor_babel: {
      name: 'Professor Babel',
      persona: 'multilingual language learning tutor',
      greeting: "🌍 Hola! Bonjour! Hello! I'm Professor Babel, ready to explore languages with you!"
    },
    professor_barrett: {
      name: 'Professor Barrett',
      persona: 'analytical legal studies tutor',
      greeting: "⚖️ Welcome to the halls of justice and learning! I'm Professor Barrett."
    }
  }

  const agent = agentPersonalities[agentId as keyof typeof agentPersonalities]
  if (!agent) {
    return "Hello! I'm your AI tutor, ready to help you learn and grow. What would you like to explore today?"
  }

  let contextualGreeting = agent.greeting
  
  if (context?.subject) {
    contextualGreeting += ` I see you're interested in ${context.subject}. `
  }
  
  if (context?.neurotype && context.neurotype !== 'neurotypical') {
    contextualGreeting += `I'm specially trained to support ${context.neurotype} learners with personalized approaches. `
  }

  contextualGreeting += "What learning adventure should we go on today?"
  
  return contextualGreeting
}

async function generateAIResponse(session: TutoringSession, userMessage: string, context: any): Promise<string> {
  const agentPrompts = {
    dean_wonder: `You are Dean Wonder, an enthusiastic superhero-themed AI tutor for elementary students (K-6). 
    - Use superhero metaphors and exciting language
    - Break down complex concepts into simple, fun explanations
    - Encourage students and celebrate their efforts
    - Include emojis and engaging language
    - Focus on building confidence and curiosity
    - Adapt for ADHD learners with short, engaging responses`,

    dean_sterling: `You are Dean Sterling, a dramatic theater arts AI tutor for middle and high school students (7-12).
    - Use theatrical language and dramatic flair
    - Connect learning to storytelling and performance
    - Encourage creative expression and critical thinking
    - Reference literature, history, and arts
    - Help with academic rigor while maintaining inspiration
    - Support neurodivergent learners with clear structure`,

    professor_babel: `You are Professor Babel, a multilingual AI tutor specializing in language learning and cultural education.
    - Support multiple languages and cultural contexts
    - Use immersive language learning techniques
    - Encourage cultural understanding and global awareness
    - Adapt to different language proficiency levels
    - Include cultural context in language lessons
    - Support ESL learners with patience and encouragement`,

    professor_barrett: `You are Professor Barrett, an analytical AI tutor for legal studies and critical thinking.
    - Use precise, academic language appropriate for law students
    - Employ Socratic method questioning
    - Break down complex legal concepts systematically
    - Encourage analytical and critical thinking
    - Reference case law and legal principles when relevant
    - Support pre-law and legal studies students`
  }

  const agentPrompt = agentPrompts[session.agentId as keyof typeof agentPrompts] || 
    "You are a helpful AI tutor. Provide clear, educational responses."

  const systemPrompt = `${agentPrompt}

Student context:
- Grade level: ${session.gradeLevel || 'not specified'}
- Subject focus: ${session.subject || 'general'}
- Learning profile: ${session.neurotype || 'not specified'}
- Session history: ${session.messages.length} previous exchanges

Always:
1. Be encouraging and supportive
2. Adapt your explanation style to the student's needs
3. Check for understanding
4. Provide examples when helpful
5. Keep responses appropriate for the grade level
6. If the student seems frustrated, offer different approaches
7. Celebrate progress and effort`

  try {
    const response = await anthropic.messages.create({
      model: DEFAULT_MODEL_STR,
      max_tokens: 1000,
      system: systemPrompt,
      messages: [
        // Include recent conversation history
        ...session.messages.slice(-6), // Last 6 messages for context
        {
          role: 'user',
          content: userMessage
        }
      ]
    })

    const aiMessage = response.content[0]
    if (aiMessage.type === 'text') {
      return aiMessage.text
    } else {
      throw new Error('Unexpected response format from AI')
    }
  } catch (error) {
    console.error('Error generating AI response:', error)
    
    // Fallback response based on agent
    const fallbackResponses = {
      dean_wonder: "🦸‍♂️ Oops! Even superheroes need a moment to recharge! Can you try asking that again? I'm here to help you learn!",
      dean_sterling: "🎭 Ah, a momentary intermission in our learning performance! Please, ask your question again so we can continue this educational masterpiece!",
      professor_babel: "🌍 Pardón! There seems to be a small communication interruption. Could you please repeat your question?",
      professor_barrett: "⚖️ I apologize, but I need a moment to properly consider your inquiry. Could you please restate your question?"
    }
    
    return fallbackResponses[session.agentId as keyof typeof fallbackResponses] || 
      "I apologize, but I'm having trouble processing that right now. Could you please try asking again?"
  }
}

async function endTutoringSession(sessionId: string): Promise<void> {
  const session = activeSessions.get(sessionId)
  if (session) {
    // In production, save session to database here
    console.log(`Ending tutoring session ${sessionId} for user ${session.userId}`)
    activeSessions.delete(sessionId)
  }
}

// Cleanup function to remove old sessions (call periodically)
export function cleanupOldSessions() {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
  
  for (const [sessionId, session] of activeSessions.entries()) {
    if (session.lastActivity < oneHourAgo) {
      activeSessions.delete(sessionId)
    }
  }
}

// Run cleanup every 30 minutes
setInterval(cleanupOldSessions, 30 * 60 * 1000)