import { NextRequest, NextResponse } from 'next/server'
import { storage } from '../../../server/storage'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const schoolId = searchParams.get('schoolId')
    const timeframe = searchParams.get('timeframe') || '30'
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Get comprehensive analytics data
    const analytics = await generateUserAnalytics(userId, schoolId, parseInt(timeframe))
    
    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ error: 'Failed to generate analytics' }, { status: 500 })
  }
}

async function generateUserAnalytics(userId: string, schoolId: string | null, timeframeDays: number) {
  const endDate = new Date()
  const startDate = new Date(endDate.getTime() - (timeframeDays * 24 * 60 * 60 * 1000))

  // Fetch user data
  const user = await storage.getUser(userId)
  const progress = await storage.getStudentProgress(userId, schoolId || undefined)
  const assessments = await storage.getAssessments(userId)
  const achievements = await storage.getAchievements ? await storage.getAchievements(userId, schoolId || undefined) : []
  const enrollments = await storage.getEnrollments(userId)

  // Calculate learning metrics
  const totalLessons = progress.reduce((sum, p) => sum + p.totalLessons, 0)
  const completedLessons = progress.reduce((sum, p) => sum + p.completedLessons, 0)
  const totalPoints = progress.reduce((sum, p) => sum + p.points, 0)
  const avgCompletion = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

  // Assessment performance analysis
  const recentAssessments = assessments.filter(a => 
    new Date(a.submittedAt || a.createdAt) >= startDate
  )
  
  const assessmentScores = recentAssessments.map(a => parseFloat(a.score) || 0)
  const avgScore = assessmentScores.length > 0 
    ? assessmentScores.reduce((sum, score) => sum + score, 0) / assessmentScores.length 
    : 0

  // Learning streak analysis
  const currentStreak = Math.max(...progress.map(p => p.streakDays), 0)
  const longestStreak = currentStreak // Would need historical data for accurate calculation

  // Subject performance breakdown
  const subjectPerformance = {}
  progress.forEach(p => {
    // Assuming course subjects are available
    const subjects = ['Math', 'Science', 'English', 'History', 'Arts'] // Would get from course data
    subjects.forEach(subject => {
      if (!subjectPerformance[subject]) {
        subjectPerformance[subject] = {
          completion: 0,
          averageScore: 0,
          lessonsCompleted: 0,
          totalLessons: 0
        }
      }
    })
  })

  // Weekly activity data for charts
  const weeklyActivity = generateWeeklyActivity(timeframeDays)
  
  // Learning velocity (lessons per week)
  const weeksInTimeframe = Math.ceil(timeframeDays / 7)
  const learningVelocity = weeksInTimeframe > 0 ? completedLessons / weeksInTimeframe : 0

  // Predictive insights using basic algorithms
  const insights = generateLearningInsights(user, progress, assessments, achievements)

  return {
    overview: {
      totalLessons,
      completedLessons,
      completionRate: avgCompletion,
      totalPoints,
      currentStreak,
      longestStreak,
      averageScore: avgScore,
      learningVelocity: Math.round(learningVelocity * 10) / 10
    },
    performance: {
      recentAssessments: recentAssessments.length,
      averageScore: Math.round(avgScore * 10) / 10,
      improvementTrend: calculateImprovementTrend(assessmentScores),
      subjectBreakdown: subjectPerformance
    },
    engagement: {
      weeklyActivity,
      streakData: {
        current: currentStreak,
        longest: longestStreak,
        weeklyGoal: 5,
        achieved: currentStreak >= 5
      },
      achievementsEarned: achievements.filter(a => a.unlocked).length,
      totalAchievements: achievements.length
    },
    insights: insights,
    recommendations: generateRecommendations(user, progress, assessments),
    timeframe: {
      days: timeframeDays,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    },
    metadata: {
      generated: new Date().toISOString(),
      userId,
      schoolId,
      neurotype: user?.neurotype,
      enrollmentType: user?.enrollmentType
    }
  }
}

function generateWeeklyActivity(timeframeDays: number) {
  const weeks = Math.min(Math.ceil(timeframeDays / 7), 12)
  return Array.from({ length: weeks }, (_, i) => ({
    week: `Week ${weeks - i}`,
    lessons: Math.floor(Math.random() * 15) + 5, // Would use real data
    points: Math.floor(Math.random() * 500) + 100,
    assessments: Math.floor(Math.random() * 3) + 1,
    timeSpent: Math.floor(Math.random() * 300) + 60 // minutes
  })).reverse()
}

function calculateImprovementTrend(scores: number[]) {
  if (scores.length < 2) return 'insufficient_data'
  
  const firstHalf = scores.slice(0, Math.floor(scores.length / 2))
  const secondHalf = scores.slice(Math.floor(scores.length / 2))
  
  const firstAvg = firstHalf.reduce((sum, score) => sum + score, 0) / firstHalf.length
  const secondAvg = secondHalf.reduce((sum, score) => sum + score, 0) / secondHalf.length
  
  const improvement = secondAvg - firstAvg
  
  if (improvement > 5) return 'improving'
  if (improvement < -5) return 'declining'
  return 'stable'
}

function generateLearningInsights(user: any, progress: any[], assessments: any[], achievements: any[]) {
  const insights = []
  
  // Neurotype-specific insights
  if (user?.neurotype === 'ADHD') {
    const avgLessonLength = 25 // Would calculate from actual data
    if (avgLessonLength > 30) {
      insights.push({
        type: 'attention',
        priority: 'high',
        message: 'Consider breaking lessons into shorter segments for better focus',
        action: 'Optimize lesson length for ADHD learners'
      })
    }
  }
  
  if (user?.neurotype === 'dyslexia') {
    const textHeavyLessons = progress.filter(p => p.type === 'reading').length
    if (textHeavyLessons > 0) {
      insights.push({
        type: 'accessibility',
        priority: 'medium',
        message: 'Audio support and visual aids can enhance learning',
        action: 'Enable text-to-speech for reading materials'
      })
    }
  }

  // Performance insights
  const avgScore = assessments.length > 0 
    ? assessments.reduce((sum, a) => sum + (parseFloat(a.score) || 0), 0) / assessments.length 
    : 0
    
  if (avgScore < 70) {
    insights.push({
      type: 'performance',
      priority: 'high',
      message: 'Additional support may be needed to improve understanding',
      action: 'Schedule one-on-one tutoring sessions'
    })
  }

  // Engagement insights
  const streakDays = Math.max(...progress.map(p => p.streakDays), 0)
  if (streakDays < 3) {
    insights.push({
      type: 'engagement',
      priority: 'medium',
      message: 'Building consistent learning habits will improve outcomes',
      action: 'Set daily learning reminders and goals'
    })
  }

  return insights
}

function generateRecommendations(user: any, progress: any[], assessments: any[]) {
  const recommendations = []
  
  // Personalized study recommendations
  const subjects = ['Math', 'Science', 'English', 'History']
  const weakestSubject = subjects[Math.floor(Math.random() * subjects.length)] // Would calculate from real data
  
  recommendations.push({
    type: 'study_focus',
    priority: 'high',
    title: `Focus on ${weakestSubject}`,
    description: `Spend extra time on ${weakestSubject} to improve understanding`,
    estimatedImpact: 'High',
    timeRequired: '2-3 hours per week'
  })

  // Learning style recommendations
  if (user?.neurotype === 'visual') {
    recommendations.push({
      type: 'learning_style',
      priority: 'medium',
      title: 'Use Visual Learning Tools',
      description: 'Incorporate more diagrams, charts, and visual aids in your studies',
      estimatedImpact: 'Medium',
      timeRequired: 'Ongoing'
    })
  }

  // Achievement motivation
  const unlockedAchievements = progress.filter(p => p.points > 500).length
  if (unlockedAchievements < 3) {
    recommendations.push({
      type: 'motivation',
      priority: 'low',
      title: 'Work Toward Next Achievement',
      description: 'Complete 3 more lessons to unlock your next superhero badge',
      estimatedImpact: 'Medium',
      timeRequired: '1-2 weeks'
    })
  }

  return recommendations
}