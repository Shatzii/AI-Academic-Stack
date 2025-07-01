'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/use-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useQuery } from '@tanstack/react-query'
import { BookOpen, Trophy, Target, Brain, Star, Calendar, MessageCircle, GraduationCap, Clock, Map, Zap, TrendingUp, BarChart3 } from 'lucide-react'

interface Achievement {
  id: string
  title: string
  description: string
  tier?: string
  level?: string
  points?: number
  icon?: string
  unlocked: boolean
  category: string
  unlockedAt?: Date
}

interface StudentProgress {
  id: string
  userId: string
  courseId: string
  completedLessons: number
  totalLessons: number
  points: number
  streakDays: number
  lastActivity: Date
}

interface Course {
  id: string
  title: string
  description: string
  schoolId: string
  difficulty: string
  subjects: string[]
}

export default function StudentDashboard() {
  const { user, isAuthenticated } = useAuth()
  const [selectedSchool, setSelectedSchool] = useState('primary-school')
  const [isAdmin, setIsAdmin] = useState(false)
  
  useEffect(() => {
    // Check admin status to allow full access
    const adminMode = localStorage.getItem('admin_mode') === 'true'
    const masterAdmin = localStorage.getItem('master_admin') === 'true'
    const userRole = localStorage.getItem('user_role')
    setIsAdmin(adminMode || masterAdmin || userRole === 'admin')
  }, [])

  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ['courses', selectedSchool],
    queryFn: async () => {
      const response = await fetch(`/api/courses?schoolId=${selectedSchool}`)
      if (!response.ok) throw new Error('Failed to fetch courses')
      return response.json()
    },
    enabled: !!user || isAdmin,
  })

  const { data: progress, isLoading: progressLoading } = useQuery({
    queryKey: ['progress', user?.id || 'admin', selectedSchool],
    queryFn: async () => {
      const userId = user?.id || 'demo-admin'
      const response = await fetch(`/api/progress?userId=${userId}&schoolId=${selectedSchool}`)
      if (!response.ok) throw new Error('Failed to fetch progress')
      return response.json()
    },
    enabled: !!user || isAdmin,
  })

  const { data: achievements, isLoading: achievementsLoading } = useQuery({
    queryKey: ['achievements', user?.id || 'admin', selectedSchool],
    queryFn: async () => {
      const userId = user?.id || 'demo-admin'
      const response = await fetch(`/api/achievements?userId=${userId}&schoolId=${selectedSchool}`)
      if (!response.ok) throw new Error('Failed to fetch achievements')
      return response.json()
    },
    enabled: !!user || isAdmin,
  })

  const { data: enrollments } = useQuery({
    queryKey: ['enrollments', user?.id || 'admin'],
    queryFn: async () => {
      const userId = user?.id || 'demo-admin'
      const response = await fetch(`/api/enrollments?userId=${userId}`)
      if (!response.ok) throw new Error('Failed to fetch enrollments')
      return response.json()
    },
    enabled: !!user || isAdmin,
  })

  if (!isAuthenticated && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600">Please sign in to access your dashboard</p>
            <Button className="mt-4" onClick={() => window.location.href = '/auth'}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const totalProgress = progress?.reduce((sum: number, p: StudentProgress) => sum + (p.completedLessons / p.totalLessons * 100), 0) / (progress?.length || 1) || 0
  const totalPoints = progress?.reduce((sum: number, p: StudentProgress) => sum + p.points, 0) || 0
  const currentStreak = Math.max(...(progress?.map((p: StudentProgress) => p.streakDays) || [0]))

  const schoolOptions = [
    { id: 'primary-school', name: 'SuperHero School (K-6)', theme: 'blue', icon: '🦸‍♂️' },
    { id: 'secondary-school', name: 'Stage Prep School (7-12)', theme: 'purple', icon: '🎭' },
    { id: 'language-school', name: 'Language School', theme: 'green', icon: '🌍' },
    { id: 'law-school', name: 'Law School', theme: 'amber', icon: '⚖️' },
  ]

  const getSchoolTheme = (schoolId: string) => {
    const school = schoolOptions.find(s => s.id === schoolId)
    return school?.theme || 'blue'
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.firstName || user?.username}!
            </h1>
            <p className="text-gray-600">Ready to continue your learning adventure?</p>
          </div>
          
          <div className="flex gap-2">
            {schoolOptions.map((school) => (
              <Button
                key={school.id}
                variant={selectedSchool === school.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedSchool(school.id)}
                className={`${selectedSchool === school.id ? `bg-${school.theme}-600` : ''}`}
              >
                {school.icon} {school.name.split(' ')[0]}
              </Button>
            ))}
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Overall Progress</p>
                  <p className="text-2xl font-bold text-blue-600">{Math.round(totalProgress)}%</p>
                </div>
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <Progress value={totalProgress} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Points</p>
                  <p className="text-2xl font-bold text-green-600">{totalPoints.toLocaleString()}</p>
                </div>
                <Star className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Learning Streak</p>
                  <p className="text-2xl font-bold text-orange-600">{currentStreak} days</p>
                </div>
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Achievements</p>
                  <p className="text-2xl font-bold text-purple-600">{achievements?.length || 0}</p>
                </div>
                <Trophy className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="adaptive">Adaptive Learning</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="ai-tutor">AI Tutor</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coursesLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="pt-6">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                courses?.map((course: Course) => {
                  const courseProgress = progress?.find((p: StudentProgress) => p.courseId === course.id)
                  const progressPercent = courseProgress 
                    ? (courseProgress.completedLessons / courseProgress.totalLessons * 100)
                    : 0

                  return (
                    <Card key={course.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-semibold text-lg">{course.title}</h3>
                            <p className="text-sm text-gray-600">{course.description}</p>
                          </div>
                          
                          <div className="flex flex-wrap gap-1">
                            {course.subjects?.slice(0, 3).map((subject) => (
                              <Badge key={subject} variant="secondary" className="text-xs">
                                {subject}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{Math.round(progressPercent)}%</span>
                            </div>
                            <Progress value={progressPercent} />
                          </div>
                          
                          <Button className="w-full">Continue Learning</Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>
          </TabsContent>

          <TabsContent value="curriculum" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* AI Curriculum Generator */}
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-6 w-6 text-blue-600" />
                    AI Curriculum Generator
                  </CardTitle>
                  <CardDescription>
                    Create personalized learning plans with AI-powered curriculum generation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Map className="h-4 w-4 text-green-500" />
                      <span>State Compliant</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-purple-500" />
                      <span>Personalized</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-orange-500" />
                      <span>Flexible Schedule</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-blue-500" />
                      <span>All Subjects</span>
                    </div>
                  </div>
                  <Button className="w-full" asChild>
                    <a href="/curriculum-planning" target="_blank" rel="noopener noreferrer">
                      Start Creating Curriculum
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* Schedule Builder */}
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-6 w-6 text-green-600" />
                    Schedule Builder
                  </CardTitle>
                  <CardDescription>
                    Create semester and year-long schedules with automatic time management
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Semester Planning</span>
                      <Badge variant="outline">18 weeks</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Year Planning</span>
                      <Badge variant="outline">36 weeks</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Custom Timeframes</span>
                      <Badge variant="outline">Flexible</Badge>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <a href="/curriculum-planning?tab=generator" target="_blank" rel="noopener noreferrer">
                      Build Schedule
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* Teacher Tools */}
              <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-6 w-6 text-purple-600" />
                    Independent Teacher Tools
                  </CardTitle>
                  <CardDescription>
                    Access professional curriculum development tools for educators
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <p>• Lesson plan templates</p>
                    <p>• Assessment rubrics</p>
                    <p>• State standards alignment</p>
                    <p>• Accommodation strategies</p>
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <a href="/curriculum-planning?userType=teacher" target="_blank" rel="noopener noreferrer">
                      Teacher Dashboard
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* State Requirements */}
              <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Map className="h-6 w-6 text-orange-600" />
                    State Requirements
                  </CardTitle>
                  <CardDescription>
                    Ensure compliance with your state's educational standards
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <p>• All 50 states supported</p>
                    <p>• Automatic compliance checking</p>
                    <p>• Graduation requirements</p>
                    <p>• Assessment schedules</p>
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <a href="/curriculum-planning?tab=features" target="_blank" rel="noopener noreferrer">
                      View Requirements
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common curriculum planning tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" size="sm" asChild>
                    <a href="/curriculum-planning?subjects=Mathematics&grade=9th" target="_blank">
                      Math Curriculum
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href="/curriculum-planning?subjects=English&grade=9th" target="_blank">
                      English Curriculum
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href="/curriculum-planning?subjects=Science&grade=9th" target="_blank">
                      Science Curriculum
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href="/curriculum-planning?accommodations=ADHD,Dyslexia" target="_blank">
                      Special Needs
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="adaptive" className="space-y-6">
            <div className="space-y-6">
              {/* Adaptive Learning Header */}
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-3">
                  <Zap className="h-8 w-8 text-orange-500" />
                  Adaptive Difficulty Learning
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  AI-powered learning that adjusts content difficulty in real-time based on your performance and learning patterns
                </p>
              </div>

              {/* Current Performance Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600">Overall Progress</p>
                        <p className="text-2xl font-bold text-blue-800">78%</p>
                      </div>
                      <BarChart3 className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-600">Auto-Adjustments</p>
                        <p className="text-2xl font-bold text-green-800">24</p>
                      </div>
                      <Zap className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-600">Learning Efficiency</p>
                        <p className="text-2xl font-bold text-purple-800">+32%</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-orange-600">Current Streak</p>
                        <p className="text-2xl font-bold text-orange-800">8 days</p>
                      </div>
                      <Star className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Subject Performance */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Mathematics</span>
                      <Badge className="bg-green-100 text-green-800">Level 3.5</Badge>
                    </CardTitle>
                    <CardDescription>
                      Strong performance - difficulty increasing
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div className="text-center">
                        <div className="text-xl font-bold text-green-600">87%</div>
                        <div className="text-gray-600">Accuracy</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-blue-600">42m</div>
                        <div className="text-gray-600">Avg Time</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-purple-600">12</div>
                        <div className="text-gray-600">Streak</div>
                      </div>
                    </div>
                    <Progress value={87} className="h-2" />
                    <div className="text-xs text-gray-600 bg-green-50 p-2 rounded">
                      • Added algebraic word problems
                      • Introduced multi-step equations
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Reading Comprehension</span>
                      <Badge className="bg-blue-100 text-blue-800">Level 2.5</Badge>
                    </CardTitle>
                    <CardDescription>
                      Steady progress - maintaining current level
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div className="text-center">
                        <div className="text-xl font-bold text-yellow-600">72%</div>
                        <div className="text-gray-600">Accuracy</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-blue-600">38m</div>
                        <div className="text-gray-600">Avg Time</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-purple-600">6</div>
                        <div className="text-gray-600">Streak</div>
                      </div>
                    </div>
                    <Progress value={72} className="h-2" />
                    <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded">
                      • Added vocabulary support
                      • Provided graphic organizers
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-6 w-6 text-orange-600" />
                      Full Adaptive Analysis
                    </CardTitle>
                    <CardDescription>
                      Detailed performance analysis and AI recommendations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" asChild>
                      <a href="/adaptive-learning" target="_blank" rel="noopener noreferrer">
                        View Complete Analysis
                      </a>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-6 w-6 text-purple-600" />
                      Learning Engine Settings
                    </CardTitle>
                    <CardDescription>
                      Customize how AI adjusts your learning difficulty
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full" asChild>
                      <a href="/adaptive-learning?tab=engine" target="_blank" rel="noopener noreferrer">
                        Configure Settings
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Adaptations */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent AI Adaptations</CardTitle>
                  <CardDescription>
                    Latest automatic adjustments made to your learning content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium">Mathematics - Increased Difficulty</p>
                          <p className="text-sm text-gray-600">Added algebraic word problems due to strong performance</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-green-700">
                        2 hours ago
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-3">
                        <Zap className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">Reading - Enhanced Support</p>
                          <p className="text-sm text-gray-600">Added vocabulary aids and visual organizers</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-blue-700">
                        4 hours ago
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="flex items-center gap-3">
                        <Brain className="h-5 w-5 text-purple-600" />
                        <div>
                          <p className="font-medium">Science - Optimized Pacing</p>
                          <p className="text-sm text-gray-600">Adjusted lesson timing based on attention patterns</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-purple-700">
                        Yesterday
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievementsLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="pt-6">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                achievements?.earnedAchievements?.concat(achievements?.availableAchievements || [])?.map((achievement: Achievement) => (
                  <Card key={achievement.id} className={`${achievement.unlocked ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl">{achievement.icon || '🏆'}</span>
                          <Badge variant={achievement.unlocked ? 'default' : 'secondary'}>
                            {achievement.tier || achievement.level || 'Achievement'}
                          </Badge>
                        </div>
                        
                        <div>
                          <h3 className={`font-semibold ${achievement.unlocked ? 'text-green-800' : 'text-gray-600'}`}>
                            {achievement.title}
                          </h3>
                          <p className={`text-sm ${achievement.unlocked ? 'text-green-600' : 'text-gray-500'}`}>
                            {achievement.description}
                          </p>
                        </div>
                        
                        {achievement.points && (
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-medium">{achievement.points} points</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="ai-tutor" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Learning Assistant
                </CardTitle>
                <CardDescription>
                  Get personalized help from your school's AI assistant
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <MessageCircle className="h-6 w-6" />
                      <span>Ask a Question</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <BookOpen className="h-6 w-6" />
                      <span>Get Study Help</span>
                    </Button>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Quick Suggestions</h4>
                    <div className="space-y-2">
                      <Button variant="ghost" size="sm" className="justify-start h-auto p-2 text-blue-700">
                        "Show me my learning progress"
                      </Button>
                      <Button variant="ghost" size="sm" className="justify-start h-auto p-2 text-blue-700">
                        "What should I study next?"
                      </Button>
                      <Button variant="ghost" size="sm" className="justify-start h-auto p-2 text-blue-700">
                        "Help me with my assignments"
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {progress?.map((p: StudentProgress) => {
                      const course = courses?.find((c: Course) => c.id === p.courseId)
                      const progressPercent = (p.completedLessons / p.totalLessons) * 100
                      
                      return (
                        <div key={p.id} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="font-medium">{course?.title || 'Course'}</span>
                            <span className="text-sm text-gray-600">
                              {p.completedLessons}/{p.totalLessons} lessons
                            </span>
                          </div>
                          <Progress value={progressPercent} />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>{p.points} points earned</span>
                            <span>{p.streakDays} day streak</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {progress?.slice(0, 5).map((p: StudentProgress) => {
                      const course = courses?.find((c: Course) => c.id === p.courseId)
                      
                      return (
                        <div key={p.id} className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{course?.title}</p>
                            <p className="text-xs text-gray-500">
                              Last activity: {new Date(p.lastActivity).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant="secondary">+{p.points}pts</Badge>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}