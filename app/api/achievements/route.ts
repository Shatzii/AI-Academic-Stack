import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || 'demo_student'

    // Mock achievements data for demo
    const mockAchievements = [
      {
        id: 'math_hero',
        title: 'Math Hero',
        description: 'Completed 10 consecutive math lessons without mistakes',
        category: 'academic',
        tier: 'gold',
        points: 100,
        badgeUrl: '/badges/math-hero.svg',
        earnedAt: '2025-01-20T10:00:00Z',
        progress: 100,
        requirements: 'Complete 10 math lessons in a row',
        unlocked: true
      },
      {
        id: 'reading_champion',
        title: 'Reading Champion',
        description: 'Read 5 books this month',
        category: 'literacy',
        tier: 'silver',
        points: 75,
        badgeUrl: '/badges/reading-champion.svg',
        earnedAt: '2025-01-18T14:30:00Z',
        progress: 100,
        requirements: 'Read 5 complete books',
        unlocked: true
      },
      {
        id: 'focus_master',
        title: 'Focus Master',
        description: 'Maintained focus for 45 minutes straight',
        category: 'neurodivergent',
        tier: 'gold',
        points: 120,
        badgeUrl: '/badges/focus-master.svg',
        earnedAt: '2025-01-19T16:15:00Z',
        progress: 100,
        requirements: 'Sustain focus for 45+ minutes',
        unlocked: true
      },
      {
        id: 'streak_warrior',
        title: 'Streak Warrior',
        description: 'Learning streak of 12 days and counting!',
        category: 'consistency',
        tier: 'platinum',
        points: 150,
        badgeUrl: '/badges/streak-warrior.svg',
        earnedAt: '2025-01-20T09:00:00Z',
        progress: 100,
        requirements: 'Maintain 10+ day learning streak',
        unlocked: true
      },
      {
        id: 'science_explorer',
        title: 'Science Explorer',
        description: 'Complete 15 science experiments',
        category: 'academic',
        tier: 'silver',
        points: 80,
        badgeUrl: '/badges/science-explorer.svg',
        earnedAt: null,
        progress: 73,
        requirements: 'Complete 15 hands-on experiments',
        unlocked: false
      },
      {
        id: 'super_helper',
        title: 'Super Helper',
        description: 'Help 10 classmates with their work',
        category: 'social',
        tier: 'gold',
        points: 110,
        badgeUrl: '/badges/super-helper.svg',
        earnedAt: null,
        progress: 60,
        requirements: 'Assist 10 different classmates',
        unlocked: false
      },
      {
        id: 'creativity_king',
        title: 'Creativity King',
        description: 'Create 5 original art projects',
        category: 'creative',
        tier: 'gold',
        points: 100,
        badgeUrl: '/badges/creativity-king.svg',
        earnedAt: null,
        progress: 40,
        requirements: 'Submit 5 original creative works',
        unlocked: false
      },
      {
        id: 'brain_champion',
        title: 'Brain Champion',
        description: 'Achieve optimal neural patterns for 7 days',
        category: 'neurodivergent',
        tier: 'platinum',
        points: 200,
        badgeUrl: '/badges/brain-champion.svg',
        earnedAt: null,
        progress: 86,
        requirements: 'Maintain optimal brainwave patterns',
        unlocked: false
      }
    ]

    // Separate earned and unearned achievements
    const earnedAchievements = mockAchievements.filter(a => a.unlocked)
    const availableAchievements = mockAchievements.filter(a => !a.unlocked)

    const response = {
      userId,
      totalPoints: earnedAchievements.reduce((sum, a) => sum + a.points, 0),
      totalAchievements: earnedAchievements.length,
      earnedAchievements,
      availableAchievements,
      recentAchievements: earnedAchievements
        .sort((a, b) => new Date(b.earnedAt!).getTime() - new Date(a.earnedAt!).getTime())
        .slice(0, 3),
      achievementsByCategory: {
        academic: mockAchievements.filter(a => a.category === 'academic'),
        social: mockAchievements.filter(a => a.category === 'social'),
        creative: mockAchievements.filter(a => a.category === 'creative'),
        neurodivergent: mockAchievements.filter(a => a.category === 'neurodivergent'),
        consistency: mockAchievements.filter(a => a.category === 'consistency'),
        literacy: mockAchievements.filter(a => a.category === 'literacy')
      },
      nextMilestones: availableAchievements
        .sort((a, b) => b.progress - a.progress)
        .slice(0, 3)
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching achievements:', error)
    return NextResponse.json({ error: 'Failed to fetch achievements' }, { status: 500 })
  }
}