import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const DEFAULT_MODEL_STR = "claude-sonnet-4-20250514";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { message, subject, learningStyle, conversationHistory } = await request.json()

    const systemPrompt = `You are an expert AI tutor specializing in personalized education for neurodivergent learners. You adapt your teaching style based on the student's needs and preferences.

Current student preferences:
- Subject: ${subject}
- Learning Style: ${learningStyle}

Teaching Guidelines:
- For Visual learners: Use diagrams, charts, examples, and step-by-step breakdowns
- For Auditory learners: Use verbal explanations, analogies, and discussion prompts
- For Kinesthetic learners: Suggest hands-on activities and real-world applications
- For Reading/Writing: Provide detailed written explanations and note-taking suggestions
- For ADHD Support: Break information into small chunks, use bullet points, include movement breaks
- For Dyslexia Support: Use simple language, provide phonetic helps, avoid complex layouts
- For Autism Support: Be clear and structured, avoid ambiguity, provide concrete examples

Always be encouraging, patient, and adaptive. Provide practical examples and check understanding.`

    const contextualPrompt = conversationHistory?.length > 1 
      ? `Previous conversation context: ${conversationHistory.slice(-3).map((msg: any) => `${msg.role}: ${msg.content}`).join('\n')}\n\nCurrent question: ${message}`
      : message

    const response = await anthropic.messages.create({
      model: DEFAULT_MODEL_STR,
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{ role: 'user', content: contextualPrompt }]
    })

    const tutorResponse = (response.content[0] as any).text || 'I apologize, but I encountered an error processing your question.'

    return NextResponse.json({ response: tutorResponse })
  } catch (error) {
    console.error('AI Tutor API Error:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}