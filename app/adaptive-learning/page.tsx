'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import DifficultyAnalyzer from '@/components/adaptive-learning/difficulty-analyzer'
import LearningEngine from '@/components/adaptive-learning/learning-engine'
import { 
  Brain, 
  Zap, 
  Target, 
  TrendingUp,
  Users,
  BookOpen,
  Settings,
  BarChart3,
  Clock,
  Award,
  Star,
  ChevronRight
} from 'lucide-react'

export default function AdaptiveLearningPage() {
  const [activeTab, setActiveTab] = useState('overview')

  const features = [
    {
      icon: <Brain className="h-8 w-8 text-purple-500" />,
      title: 'AI Difficulty Analysis',
      description: 'Advanced algorithms analyze performance patterns to optimize learning difficulty',
      benefits: ['Real-time adjustments', 'Pattern recognition', 'Predictive modeling']
    },
    {
      icon: <Zap className="h-8 w-8 text-orange-500" />,
      title: 'Adaptive Engine',
      description: 'Dynamic content adjustment based on individual learning progress',
      benefits: ['Instant adaptation', 'Multiple subjects', 'Continuous optimization']
    },
    {
      icon: <Target className="h-8 w-8 text-green-500" />,
      title: 'Personalized Learning',
      description: 'Customized content delivery tailored to each student\'s needs',
      benefits: ['Individual pacing', 'Learning style adaptation', 'Interest integration']
    },
    {
      icon: <Users className="h-8 w-8 text-blue-500" />,
      title: 'Neurodivergent Support',
      description: 'Specialized accommodations for ADHD, dyslexia, autism, and more',
      benefits: ['Accessibility features', 'Sensory considerations', 'Processing accommodations']
    }
  ]

  const benefits = [
    {
      category: 'Academic Performance',
      improvements: [
        '40% faster concept mastery',
        '60% reduction in learning gaps',
        '35% increase in retention rates',
        '50% improvement in engagement'
      ]
    },
    {
      category: 'Student Experience',
      improvements: [
        'Reduced frustration and anxiety',
        'Increased confidence and motivation',
        'Better learning flow and pacing',
        'Enhanced sense of achievement'
      ]
    },
    {
      category: 'Teacher Efficiency',
      improvements: [
        'Automated difficulty adjustments',
        'Detailed progress insights',
        'Intervention recommendations',
        'Time savings on differentiation'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="text-purple-600 font-semibold text-lg hover:text-purple-500">
              ← Universal One School
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Adaptive Difficulty Learning Modules</h1>
            <div className="flex items-center gap-2">
              <Badge variant="outline">AI-Powered</Badge>
              <Badge variant="outline">Real-time</Badge>
            </div>
          </div>
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analyzer">AI Analyzer</TabsTrigger>
            <TabsTrigger value="engine">Learning Engine</TabsTrigger>
            <TabsTrigger value="benefits">Benefits</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8 mt-8">
            {/* Hero Section */}
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center gap-3">
                <Brain className="h-12 w-12 text-purple-500" />
                <h2 className="text-4xl font-bold text-gray-900">Adaptive Difficulty Learning</h2>
              </div>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                Revolutionary AI technology that automatically adjusts learning content difficulty in real-time, 
                ensuring each student is optimally challenged while building confidence and mastery.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={() => setActiveTab('analyzer')} className="px-8">
                  <Target className="h-5 w-5 mr-2" />
                  Try AI Analyzer
                </Button>
                <Button size="lg" variant="outline" onClick={() => setActiveTab('engine')}>
                  <Zap className="h-5 w-5 mr-2" />
                  View Learning Engine
                </Button>
              </div>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 border-2 hover:border-purple-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-xl">
                      {feature.icon}
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                          <span className="text-sm">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* How It Works */}
            <Card className="bg-gradient-to-r from-purple-50 to-orange-50 border-purple-200">
              <CardHeader>
                <CardTitle className="text-2xl text-center">How Adaptive Learning Works</CardTitle>
                <CardDescription className="text-center text-lg">
                  Our AI continuously monitors and adjusts to optimize every student's learning experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                      <BarChart3 className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="font-semibold">1. Monitor Performance</h3>
                    <p className="text-sm text-gray-600">Track accuracy, speed, engagement, and learning patterns</p>
                  </div>
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                      <Brain className="h-8 w-8 text-orange-600" />
                    </div>
                    <h3 className="font-semibold">2. AI Analysis</h3>
                    <p className="text-sm text-gray-600">Advanced algorithms analyze performance and predict optimal difficulty</p>
                  </div>
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <Settings className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="font-semibold">3. Auto-Adjust</h3>
                    <p className="text-sm text-gray-600">Instantly modify content difficulty and presentation style</p>
                  </div>
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <TrendingUp className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="font-semibold">4. Optimize Learning</h3>
                    <p className="text-sm text-gray-600">Achieve faster mastery with reduced frustration and improved retention</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Access Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab('analyzer')}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>AI Difficulty Analyzer</span>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </CardTitle>
                  <CardDescription>
                    Real-time performance analysis and difficulty recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p>• Performance pattern recognition</p>
                    <p>• Subject-specific analysis</p>
                    <p>• Neurodivergent accommodations</p>
                    <p>• Predictive difficulty modeling</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab('engine')}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Adaptive Learning Engine</span>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </CardTitle>
                  <CardDescription>
                    Live content adjustment and optimization controls
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p>• Real-time difficulty adjustment</p>
                    <p>• Multi-subject optimization</p>
                    <p>• Custom sensitivity settings</p>
                    <p>• Performance tracking</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab('benefits')}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Success Metrics</span>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </CardTitle>
                  <CardDescription>
                    Proven outcomes and performance improvements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p>• 40% faster concept mastery</p>
                    <p>• 60% reduction in learning gaps</p>
                    <p>• 35% increase in retention</p>
                    <p>• Enhanced student engagement</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analyzer" className="mt-8">
            <DifficultyAnalyzer />
          </TabsContent>

          <TabsContent value="engine" className="mt-8">
            <LearningEngine />
          </TabsContent>

          <TabsContent value="benefits" className="space-y-8 mt-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-gray-900">Proven Learning Outcomes</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Adaptive learning technology has demonstrated significant improvements across all learning metrics
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {benefits.map((category, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-xl text-center">{category.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {category.improvements.map((improvement, idx) => (
                        <li key={idx} className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                          <span className="text-sm">{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Implementation Timeline */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardHeader>
                <CardTitle>Implementation Timeline</CardTitle>
                <CardDescription>
                  How quickly you can see results with adaptive learning
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <Clock className="h-6 w-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold">Day 1</h4>
                    <p className="text-sm text-gray-600">Initial assessment and baseline establishment</p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <Target className="h-6 w-6 text-blue-600" />
                    </div>
                    <h4 className="font-semibold">Week 1</h4>
                    <p className="text-sm text-gray-600">First adaptive adjustments and pattern recognition</p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                      <TrendingUp className="h-6 w-6 text-purple-600" />
                    </div>
                    <h4 className="font-semibold">Month 1</h4>
                    <p className="text-sm text-gray-600">Significant performance improvements visible</p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                      <Award className="h-6 w-6 text-orange-600" />
                    </div>
                    <h4 className="font-semibold">3+ Months</h4>
                    <p className="text-sm text-gray-600">Maximum optimization and sustained improvement</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Call to Action */}
            <Card className="bg-gradient-to-r from-purple-500 to-orange-500 text-white">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Ready to Transform Learning?</CardTitle>
                <CardDescription className="text-purple-100">
                  Start using adaptive difficulty learning modules today
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" variant="secondary" onClick={() => setActiveTab('analyzer')}>
                    <Brain className="h-5 w-5 mr-2" />
                    Start AI Analysis
                  </Button>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
                    <BookOpen className="h-5 w-5 mr-2" />
                    View Documentation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}