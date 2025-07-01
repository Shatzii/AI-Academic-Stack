import { NextRequest, NextResponse } from 'next/server'

interface PerformanceData {
  userId: string
  subject: string
  accuracy: number
  timeSpent: number
  completionRate: number
  streak: number
  difficultyLevel: number
  neurotype?: string
}

interface AdaptationRecommendation {
  action: 'increase' | 'decrease' | 'maintain'
  newDifficulty: number
  reasoning: string
  accommodations: string[]
  nextSteps: string[]
}

// AI-powered difficulty analysis engine
function analyzePerformance(data: PerformanceData): AdaptationRecommendation {
  const { accuracy, timeSpent, completionRate, streak, difficultyLevel, neurotype } = data
  
  // Calculate performance score (weighted average)
  const performanceScore = (accuracy * 0.4) + (completionRate * 0.3) + (Math.min(streak, 10) * 2 * 0.3)
  
  // Base difficulty adjustment logic
  let action: 'increase' | 'decrease' | 'maintain' = 'maintain'
  let newDifficulty = difficultyLevel
  let reasoning = ''
  let accommodations: string[] = []
  let nextSteps: string[] = []

  // Performance-based adjustments
  if (performanceScore >= 85 && accuracy >= 80 && completionRate >= 75) {
    action = 'increase'
    newDifficulty = Math.min(5, difficultyLevel + 0.5)
    reasoning = 'Strong performance indicates readiness for increased challenge'
    nextSteps = [
      'Introduce more complex problem types',
      'Add multi-step reasoning tasks',
      'Reduce scaffolding and hints'
    ]
  } else if (performanceScore < 60 || accuracy < 65) {
    action = 'decrease'
    newDifficulty = Math.max(1, difficultyLevel - 0.5)
    reasoning = 'Performance indicates need for additional support and practice'
    nextSteps = [
      'Provide more guided practice',
      'Break down complex concepts',
      'Add visual aids and examples'
    ]
  } else {
    reasoning = 'Performance is within optimal range for current difficulty'
    nextSteps = [
      'Continue current level with varied practice',
      'Monitor for consistency',
      'Prepare for next level advancement'
    ]
  }

  // Neurotype-specific accommodations
  if (neurotype) {
    switch (neurotype.toLowerCase()) {
      case 'adhd':
        accommodations = [
          'Shorter learning segments (10-15 minutes)',
          'Interactive and hands-on activities',
          'Clear visual organization',
          'Frequent breaks and movement'
        ]
        break
      case 'dyslexia':
        accommodations = [
          'Dyslexia-friendly fonts and spacing',
          'Audio support for text content',
          'Visual representations of concepts',
          'Extended time for reading tasks'
        ]
        break
      case 'autism':
        accommodations = [
          'Predictable routine and structure',
          'Clear instructions and expectations',
          'Sensory-friendly interface options',
          'Special interests integration'
        ]
        break
      case 'processing':
        accommodations = [
          'Extended processing time',
          'Simplified language and instructions',
          'Step-by-step breakdowns',
          'Multiple format options'
        ]
        break
      default:
        accommodations = [
          'Standard accessibility features',
          'Multiple learning modalities',
          'Flexible pacing options'
        ]
    }
  }

  // Time-based adjustments
  if (timeSpent > 60) {
    accommodations.push('Consider shorter sessions to maintain focus')
    if (action === 'increase') {
      reasoning += '. However, extended time suggests need for pacing adjustments.'
    }
  } else if (timeSpent < 20 && accuracy > 90) {
    accommodations.push('Content may be too easy - consider acceleration')
  }

  return {
    action,
    newDifficulty,
    reasoning,
    accommodations,
    nextSteps
  }
}

// Generate detailed AI recommendations
function generateAIRecommendations(data: PerformanceData, adaptation: AdaptationRecommendation) {
  const recommendations = []

  // Content recommendations
  if (adaptation.action === 'increase') {
    recommendations.push({
      category: 'Content Complexity',
      suggestion: `Introduce Level ${adaptation.newDifficulty} concepts gradually`,
      implementation: 'Add 20% more complex problems while maintaining current mastery topics',
      timeline: 'Next 3-5 sessions'
    })
  } else if (adaptation.action === 'decrease') {
    recommendations.push({
      category: 'Remediation Support',
      suggestion: `Strengthen foundational skills at Level ${adaptation.newDifficulty}`,
      implementation: 'Increase practice opportunities and provide additional examples',
      timeline: 'Next 5-7 sessions'
    })
  }

  // Engagement recommendations
  if (data.streak < 3) {
    recommendations.push({
      category: 'Engagement',
      suggestion: 'Implement gamification elements to increase motivation',
      implementation: 'Add achievement badges, progress celebrations, and choice in topics',
      timeline: 'Immediate implementation'
    })
  }

  // Learning style recommendations
  recommendations.push({
    category: 'Learning Modality',
    suggestion: 'Incorporate multiple learning modalities',
    implementation: 'Balance visual, auditory, and kinesthetic learning opportunities',
    timeline: 'Ongoing adjustment'
  })

  return recommendations
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { performanceData, requestType = 'analysis' } = body

    if (!performanceData) {
      return NextResponse.json(
        { error: 'Performance data is required' },
        { status: 400 }
      )
    }

    // Analyze performance and get recommendations
    const adaptation = analyzePerformance(performanceData)
    const aiRecommendations = generateAIRecommendations(performanceData, adaptation)

    // Generate response based on request type
    if (requestType === 'full_analysis') {
      return NextResponse.json({
        analysis: {
          currentPerformance: {
            score: (performanceData.accuracy * 0.4) + (performanceData.completionRate * 0.3) + (Math.min(performanceData.streak, 10) * 2 * 0.3),
            level: performanceData.difficultyLevel,
            status: adaptation.action === 'increase' ? 'exceeding' : adaptation.action === 'decrease' ? 'struggling' : 'on-track'
          },
          adaptation,
          recommendations: aiRecommendations,
          neurodivergentSupport: adaptation.accommodations,
          nextSession: {
            recommendedDifficulty: adaptation.newDifficulty,
            focusAreas: adaptation.nextSteps,
            estimatedDuration: performanceData.timeSpent > 45 ? '30-35 minutes' : '40-45 minutes'
          }
        },
        timestamp: new Date().toISOString()
      })
    }

    // Quick adaptation response
    return NextResponse.json({
      adaptation: {
        action: adaptation.action,
        newDifficulty: adaptation.newDifficulty,
        reasoning: adaptation.reasoning,
        accommodations: adaptation.accommodations.slice(0, 3), // Top 3 accommodations
        confidence: 85 // AI confidence score
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Adaptive learning analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze performance data' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const subject = searchParams.get('subject')

    // Simulate fetching user's adaptive learning data
    const mockData = {
      userId: userId || 'demo-user',
      subjects: [
        {
          subject: 'Mathematics',
          currentDifficulty: 3.5,
          recentPerformance: {
            accuracy: 87,
            completionRate: 78,
            timeSpent: 42,
            streak: 8
          },
          adaptations: [
            { date: '2025-01-29', action: 'increase', reason: 'Strong consistent performance' },
            { date: '2025-01-28', action: 'maintain', reason: 'Consolidating new concepts' },
            { date: '2025-01-27', action: 'increase', reason: 'Exceeded expectations' }
          ]
        },
        {
          subject: 'Reading',
          currentDifficulty: 2.5,
          recentPerformance: {
            accuracy: 72,
            completionRate: 68,
            timeSpent: 38,
            streak: 5
          },
          adaptations: [
            { date: '2025-01-29', action: 'maintain', reason: 'Building confidence' },
            { date: '2025-01-28', action: 'decrease', reason: 'Struggled with comprehension' },
            { date: '2025-01-27', action: 'maintain', reason: 'Steady progress' }
          ]
        }
      ],
      neurodivergentProfile: {
        primaryType: 'ADHD',
        accommodations: ['shorter-sessions', 'visual-cues', 'movement-breaks'],
        effectiveness: 'high'
      }
    }

    if (subject) {
      const subjectData = mockData.subjects.find(s => s.subject.toLowerCase() === subject.toLowerCase())
      return NextResponse.json(subjectData || { error: 'Subject not found' })
    }

    return NextResponse.json(mockData)

  } catch (error) {
    console.error('Failed to fetch adaptive learning data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch adaptive learning data' },
      { status: 500 }
    )
  }
}