'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  BarChart3,
  Zap,
  Star,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react'

interface DifficultyLevel {
  id: string
  name: string
  description: string
  color: string
  icon: React.ReactNode
}

interface PerformanceData {
  subject: string
  currentLevel: number
  accuracy: number
  timeSpent: number
  streak: number
  recommendations: string[]
  nextAdjustment: 'increase' | 'decrease' | 'maintain'
}

const difficultyLevels: DifficultyLevel[] = [
  {
    id: 'foundational',
    name: 'Foundational',
    description: 'Building core concepts and basic understanding',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: <Target className="h-4 w-4" />
  },
  {
    id: 'developing',
    name: 'Developing',
    description: 'Applying concepts with guided practice',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: <TrendingUp className="h-4 w-4" />
  },
  {
    id: 'proficient',
    name: 'Proficient',
    description: 'Independent application of skills',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: <CheckCircle className="h-4 w-4" />
  },
  {
    id: 'advanced',
    name: 'Advanced',
    description: 'Complex problem-solving and analysis',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    icon: <Brain className="h-4 w-4" />
  },
  {
    id: 'mastery',
    name: 'Mastery',
    description: 'Teaching others and creative application',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: <Star className="h-4 w-4" />
  }
]

export default function DifficultyAnalyzer() {
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([
    {
      subject: 'Mathematics',
      currentLevel: 3,
      accuracy: 87,
      timeSpent: 45,
      streak: 12,
      recommendations: [
        'Increase problem complexity',
        'Add multi-step word problems',
        'Introduce advanced concepts'
      ],
      nextAdjustment: 'increase'
    },
    {
      subject: 'Reading Comprehension',
      currentLevel: 2,
      accuracy: 72,
      timeSpent: 38,
      streak: 6,
      recommendations: [
        'Provide more practice at current level',
        'Focus on vocabulary building',
        'Add graphic organizers'
      ],
      nextAdjustment: 'maintain'
    },
    {
      subject: 'Science',
      currentLevel: 4,
      accuracy: 65,
      timeSpent: 52,
      streak: 3,
      recommendations: [
        'Simplify complex concepts',
        'Add more visual aids',
        'Provide additional examples'
      ],
      nextAdjustment: 'decrease'
    }
  ])

  const [activeTab, setActiveTab] = useState('overview')

  const getAdjustmentIcon = (adjustment: string) => {
    switch (adjustment) {
      case 'increase':
        return <ArrowUp className="h-4 w-4 text-green-600" />
      case 'decrease':
        return <ArrowDown className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 85) return 'text-green-600'
    if (accuracy >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3">
          <Brain className="h-8 w-8 text-purple-600" />
          Adaptive Difficulty Learning
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          AI-powered difficulty adjustment that adapts in real-time to optimize learning outcomes for each student
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subjects">Subject Analysis</TabsTrigger>
          <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Current Performance Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Overall Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-800 mb-2">78%</div>
                <p className="text-sm text-blue-600">Average accuracy across subjects</p>
                <Progress value={78} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5 text-green-600" />
                  Adaptive Adjustments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-800 mb-2">24</div>
                <p className="text-sm text-green-600">Auto-adjustments this week</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    Real-time optimization
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-600" />
                  Learning Efficiency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-800 mb-2">+32%</div>
                <p className="text-sm text-purple-600">Improvement with adaptive learning</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-4 w-4 text-purple-500" />
                  <span className="text-xs text-purple-600">Trending up</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Difficulty Level Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Current Difficulty Distribution</CardTitle>
              <CardDescription>
                How your learning content is distributed across difficulty levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {difficultyLevels.map((level, index) => (
                  <div key={level.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Badge className={level.color}>
                        {level.icon}
                        {level.name}
                      </Badge>
                      <span className="text-sm text-gray-600">{level.description}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={(index + 1) * 20} className="w-24" />
                      <span className="text-sm font-medium">{(index + 1) * 20}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Adaptations */}
          <Card>
            <CardHeader>
              <CardTitle>Recent AI Adaptations</CardTitle>
              <CardDescription>
                Latest automatic difficulty adjustments made by the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-3">
                    <ArrowUp className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Mathematics - Increased Difficulty</p>
                      <p className="text-sm text-gray-600">Added algebraic word problems</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-green-700">
                    2 hours ago
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3">
                    <Minus className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Reading - Maintained Level</p>
                      <p className="text-sm text-gray-600">Consistent performance detected</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-blue-700">
                    4 hours ago
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-3">
                    <ArrowDown className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="font-medium">Science - Decreased Difficulty</p>
                      <p className="text-sm text-gray-600">Added visual aids and simplified concepts</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-orange-700">
                    Yesterday
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subjects" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {performanceData.map((subject, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{subject.subject}</CardTitle>
                    <div className="flex items-center gap-2">
                      {getAdjustmentIcon(subject.nextAdjustment)}
                      <Badge className={difficultyLevels[subject.currentLevel - 1]?.color}>
                        Level {subject.currentLevel}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription>
                    Current difficulty: {difficultyLevels[subject.currentLevel - 1]?.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${getAccuracyColor(subject.accuracy)}`}>
                        {subject.accuracy}%
                      </div>
                      <p className="text-xs text-gray-600">Accuracy</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {subject.timeSpent}m
                      </div>
                      <p className="text-xs text-gray-600">Avg Time</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {subject.streak}
                      </div>
                      <p className="text-xs text-gray-600">Day Streak</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Next Adjustment:</h4>
                    <div className="flex items-center gap-2">
                      {getAdjustmentIcon(subject.nextAdjustment)}
                      <span className="text-sm">
                        {subject.nextAdjustment === 'increase' && 'Increase difficulty based on strong performance'}
                        {subject.nextAdjustment === 'decrease' && 'Decrease difficulty to build confidence'}
                        {subject.nextAdjustment === 'maintain' && 'Maintain current level for consolidation'}
                      </span>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    View Detailed Analysis
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          {performanceData.map((subject, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  {subject.subject} - AI Recommendations
                </CardTitle>
                <CardDescription>
                  Personalized suggestions based on learning patterns and performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {subject.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm">{rec}</p>
                      </div>
                      <Button size="sm" variant="outline">
                        Apply
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Adaptive Learning Settings</CardTitle>
              <CardDescription>
                Customize how the AI adjusts difficulty for optimal learning
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Auto-Difficulty Adjustment</h4>
                    <p className="text-sm text-gray-600">Allow AI to automatically adjust content difficulty</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Enabled
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Sensitivity Level</h4>
                    <p className="text-sm text-gray-600">How quickly the system responds to performance changes</p>
                  </div>
                  <Badge variant="outline">
                    Moderate
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Neurodivergent Accommodations</h4>
                    <p className="text-sm text-gray-600">Specialized adaptations for learning differences</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Active
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Performance Notifications</h4>
                    <p className="text-sm text-gray-600">Get notified of significant difficulty changes</p>
                  </div>
                  <Button variant="outline" size="sm">
                    On
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button className="w-full">
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}