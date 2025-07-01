'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  TrendingUp, 
  Brain, 
  Target, 
  Clock, 
  Zap, 
  Eye, 
  Heart,
  MessageSquare,
  BookOpen,
  Users,
  Award,
  AlertTriangle
} from 'lucide-react'

interface LearningMetrics {
  studentId: string
  attentionSpan: number
  learningSpeed: number
  preferredModality: string
  stressLevel: number
  engagementScore: number
  predictions: {
    nextBreakNeeded: number
    difficultyRecommendation: string
    interventionAlert: boolean
  }
}

export default function LearningAnalyticsDashboard() {
  const [metrics, setMetrics] = useState<LearningMetrics>({
    studentId: 'student-001',
    attentionSpan: 24,
    learningSpeed: 87,
    preferredModality: 'Visual-Kinesthetic',
    stressLevel: 15,
    engagementScore: 92,
    predictions: {
      nextBreakNeeded: 8,
      difficultyRecommendation: 'Increase by 12%',
      interventionAlert: false
    }
  })

  const [realTimeData, setRealTimeData] = useState({
    currentFocus: 89,
    sessionProgress: 67,
    neurodivergentSupport: {
      dyslexiaFont: true,
      adhdBreaks: 3,
      autismSensory: 'Low stimulation'
    }
  })

  useEffect(() => {
    // Simulate real-time analytics updates
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        ...prev,
        currentFocus: Math.max(20, Math.min(100, prev.currentFocus + (Math.random() - 0.5) * 10)),
        sessionProgress: Math.min(100, prev.sessionProgress + 0.5)
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Learning Analytics</h1>
          <p className="text-gray-600">Real-time insights powered by educational AI</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">Live Analysis Active</span>
        </div>
      </div>

      {/* Real-Time Monitoring Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Eye className="w-4 h-4 mr-2 text-green-600" />
              Current Focus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {realTimeData.currentFocus.toFixed(0)}%
            </div>
            <Progress value={realTimeData.currentFocus} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Brain className="w-4 h-4 mr-2 text-blue-600" />
              Learning Speed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{metrics.learningSpeed}%</div>
            <div className="text-xs text-gray-500 mt-1">Above grade level</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Heart className="w-4 h-4 mr-2 text-purple-600" />
              Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{metrics.engagementScore}%</div>
            <Badge variant="secondary" className="mt-1 text-xs">Excellent</Badge>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="w-4 h-4 mr-2 text-orange-600" />
              Next Break
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{metrics.predictions.nextBreakNeeded} min</div>
            <div className="text-xs text-gray-500 mt-1">Sensory break recommended</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="neurodivergent" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="neurodivergent">Neurodivergent Support</TabsTrigger>
          <TabsTrigger value="predictions">AI Predictions</TabsTrigger>
          <TabsTrigger value="interventions">Interventions</TabsTrigger>
          <TabsTrigger value="progress">Learning Paths</TabsTrigger>
        </TabsList>

        <TabsContent value="neurodivergent" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-yellow-600" />
                  ADHD Support Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Attention Span</span>
                  <span className="font-bold">{metrics.attentionSpan} minutes</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Movement Breaks Taken</span>
                  <span className="font-bold">{realTimeData.neurodivergentSupport.adhdBreaks}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Hyperactivity Level</span>
                  <Badge variant="outline" className="text-green-600">Low</Badge>
                </div>
                <Button size="sm" className="w-full bg-yellow-600 hover:bg-yellow-700">
                  Suggest Movement Break
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-purple-600" />
                  Dyslexia Adaptations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Reading Speed</span>
                  <span className="font-bold">142 WPM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Font Adaptation</span>
                  <Badge variant="secondary">OpenDyslexic Active</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Comprehension Rate</span>
                  <span className="font-bold text-green-600">94%</span>
                </div>
                <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700">
                  Audio Support Mode
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                AI Performance Predictions
              </CardTitle>
              <CardDescription>
                Machine learning insights based on learning patterns
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">96%</div>
                  <div className="text-sm text-gray-600">Predicted Test Score</div>
                  <div className="text-xs text-green-600 mt-1">↗ +4% from last week</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">3.2 hrs</div>
                  <div className="text-sm text-gray-600">Optimal Study Time</div>
                  <div className="text-xs text-blue-600 mt-1">Based on attention patterns</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">85%</div>
                  <div className="text-sm text-gray-600">Concept Mastery</div>
                  <div className="text-xs text-purple-600 mt-1">Ready for advancement</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold">AI Recommendations</h4>
                <div className="space-y-2">
                  <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                    <Target className="w-4 h-4 text-yellow-600 mr-3" />
                    <span className="text-sm">Increase math difficulty by 12% - student showing mastery signs</span>
                  </div>
                  <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                    <MessageSquare className="w-4 h-4 text-blue-600 mr-3" />
                    <span className="text-sm">Schedule parent conference - exceptional progress in reading</span>
                  </div>
                  <div className="flex items-center p-3 bg-green-50 rounded-lg">
                    <Award className="w-4 h-4 text-green-600 mr-3" />
                    <span className="text-sm">Consider gifted program assessment - consistent high performance</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interventions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
                Smart Interventions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-orange-500 pl-4 py-2">
                  <h4 className="font-semibold text-orange-700">Attention Alert</h4>
                  <p className="text-sm text-gray-600">Focus level dropping. Recommend 5-minute movement break.</p>
                  <Button size="sm" className="mt-2 bg-orange-600 hover:bg-orange-700">
                    Activate Break Timer
                  </Button>
                </div>
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <h4 className="font-semibold text-blue-700">Learning Mode Switch</h4>
                  <p className="text-sm text-gray-600">Visual learner struggling with text. Switch to diagram mode.</p>
                  <Button size="sm" className="mt-2 bg-blue-600 hover:bg-blue-700">
                    Enable Visual Mode
                  </Button>
                </div>
                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <h4 className="font-semibold text-green-700">Positive Reinforcement</h4>
                  <p className="text-sm text-gray-600">Student achieved 20-minute focus milestone. Celebrate success!</p>
                  <Button size="sm" className="mt-2 bg-green-600 hover:bg-green-700">
                    Send Encouragement
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-indigo-600" />
                Adaptive Learning Paths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Current Path: Visual-Kinesthetic Learner</h4>
                  <Progress value={realTimeData.sessionProgress} className="mb-2" />
                  <div className="text-sm text-gray-600">{realTimeData.sessionProgress}% complete</div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h5 className="font-medium">Strengths Identified</h5>
                    <div className="space-y-1">
                      <Badge className="mr-1">Visual Processing</Badge>
                      <Badge className="mr-1">Pattern Recognition</Badge>
                      <Badge className="mr-1">Creative Problem Solving</Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-medium">Growth Areas</h5>
                    <div className="space-y-1">
                      <Badge variant="outline" className="mr-1">Auditory Processing</Badge>
                      <Badge variant="outline" className="mr-1">Sequential Memory</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}