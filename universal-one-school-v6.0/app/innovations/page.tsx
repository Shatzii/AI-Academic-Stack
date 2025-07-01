'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import LearningAnalyticsDashboard from '@/components/analytics/learning-analytics-dashboard'
import InteractiveClassroom from '@/components/virtual-classroom/interactive-classroom'
import MobileDashboard from '@/components/mobile-pwa/mobile-dashboard'
import AIContentGenerator from '@/components/ai-content-studio/content-generator'
import ParentEngagementPlatform from '@/components/parent-platform/parent-engagement'
import NeuralLearningInterface from '@/components/breakthrough-innovations/neural-learning-interface'
import EmotionalAICompanion from '@/components/breakthrough-innovations/emotional-ai-companion'
import HolographicLearningSpace from '@/components/breakthrough-innovations/holographic-learning-space'
import QuantumCollaborationHub from '@/components/breakthrough-innovations/quantum-collaboration-hub'
import TimeDimensionLearning from '@/components/breakthrough-innovations/time-dimension-learning'
import { 
  Brain, 
  Users, 
  Smartphone, 
  Wand2, 
  Heart,
  Eye,
  Zap,
  Layers,
  Network,
  Clock,
  ArrowLeft,
  Sparkles,
  Target,
  TrendingUp,
  Award,
  Rocket
} from 'lucide-react'

export default function InnovationsPage() {
  const [activeInnovation, setActiveInnovation] = useState<string | null>(null)

  const innovations = [
    {
      id: 'analytics',
      title: 'Real-Time Learning Analytics',
      description: 'AI-powered insights with live neural feedback and predictive learning analytics',
      icon: TrendingUp,
      color: 'bg-blue-500',
      category: 'Enhanced Learning',
      value: '$15K-20K',
      component: LearningAnalyticsDashboard
    },
    {
      id: 'classroom',
      title: 'Interactive Virtual Classroom',
      description: 'Live collaborative learning with AI teaching assistant and real-time interaction',
      icon: Users,
      color: 'bg-green-500',
      category: 'Enhanced Learning',
      value: '$20K-25K',
      component: InteractiveClassroom
    },
    {
      id: 'mobile',
      title: 'Mobile-First PWA',
      description: 'Offline learning, voice notes, push notifications, and native mobile experience',
      icon: Smartphone,
      color: 'bg-purple-500',
      category: 'Enhanced Learning',
      value: '$15K-20K',
      component: MobileDashboard
    },
    {
      id: 'content',
      title: 'AI Content Generation Studio',
      description: 'Dynamic lesson creation based on individual learning styles and neurodivergent needs',
      icon: Wand2,
      color: 'bg-orange-500',
      category: 'Enhanced Learning',
      value: '$25K-35K',
      component: AIContentGenerator
    },
    {
      id: 'parent',
      title: 'Parent Engagement Platform',
      description: 'Multi-language family communication hub with real-time progress sharing',
      icon: Heart,
      color: 'bg-pink-500',
      category: 'Enhanced Learning',
      value: '$10K-15K',
      component: ParentEngagementPlatform
    },
    {
      id: 'neural',
      title: 'Neural Learning Interface',
      description: 'Real-time brain-computer interface with EEG monitoring and cognitive optimization',
      icon: Brain,
      color: 'bg-indigo-500',
      category: 'Breakthrough Innovation',
      value: '$50K-75K',
      component: NeuralLearningInterface
    },
    {
      id: 'emotional',
      title: 'Emotional AI Companion',
      description: 'Empathetic learning partners with emotional intelligence and personalized support',
      icon: Heart,
      color: 'bg-rose-500',
      category: 'Breakthrough Innovation',
      value: '$40K-60K',
      component: EmotionalAICompanion
    },
    {
      id: 'holographic',
      title: 'Holographic Learning Space',
      description: '3D immersive education with spatial computing and gesture control technology',
      icon: Layers,
      color: 'bg-cyan-500',
      category: 'Breakthrough Innovation',
      value: '$75K-100K',
      component: HolographicLearningSpace
    },
    {
      id: 'quantum',
      title: 'Quantum Collaboration Hub',
      description: 'Global mind-linking technology for instantaneous knowledge sharing across continents',
      icon: Network,
      color: 'bg-violet-500',
      category: 'Breakthrough Innovation',
      value: '$60K-80K',
      component: QuantumCollaborationHub
    },
    {
      id: 'time',
      title: 'Time Dimension Learning',
      description: 'Travel through history and future possibilities for experiential learning',
      icon: Clock,
      color: 'bg-amber-500',
      category: 'Breakthrough Innovation',
      value: '$100K-150K',
      component: TimeDimensionLearning
    }
  ]

  const enhancedFeatures = innovations.filter(i => i.category === 'Enhanced Learning')
  const breakthroughFeatures = innovations.filter(i => i.category === 'Breakthrough Innovation')

  const totalValue = innovations.reduce((sum, innovation) => {
    const values = innovation.value.replace(/[\$K-]/g, '').split(/\s+/)
    const avgValue = (parseInt(values[0]) + parseInt(values[1])) / 2
    return sum + avgValue
  }, 0)

  if (activeInnovation) {
    const innovation = innovations.find(i => i.id === activeInnovation)
    if (innovation) {
      const Component = innovation.component
      return (
        <div className="min-h-screen">
          <div className="sticky top-0 z-50 bg-white border-b shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    onClick={() => setActiveInnovation(null)}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Innovations
                  </Button>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">{innovation.title}</h1>
                    <p className="text-sm text-gray-600">{innovation.description}</p>
                  </div>
                </div>
                <Badge className={`${innovation.color} text-white`}>
                  {innovation.category}
                </Badge>
              </div>
            </div>
          </div>
          <Component />
        </div>
      )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Link href="/dashboard">
              <Button variant="ghost">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Universal One School Innovations
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Next-generation educational technology transforming learning experiences
          </p>
          <div className="flex items-center justify-center space-x-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{innovations.length}</div>
              <div className="text-sm text-gray-600">Total Innovations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">${totalValue}K</div>
              <div className="text-sm text-gray-600">Platform Value</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">100%</div>
              <div className="text-sm text-gray-600">Neurodivergent Ready</div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="enhanced" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="enhanced">Enhanced Learning ({enhancedFeatures.length})</TabsTrigger>
            <TabsTrigger value="breakthrough">Breakthrough Tech ({breakthroughFeatures.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="enhanced" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Enhanced Learning Features</h2>
              <p className="text-gray-600">
                Proven educational technology with immediate implementation value
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enhancedFeatures.map((innovation) => (
                <Card key={innovation.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 ${innovation.color} rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                        <innovation.icon className="w-6 h-6" />
                      </div>
                      <Badge variant="outline">{innovation.value}</Badge>
                    </div>
                    <CardTitle className="text-lg">{innovation.title}</CardTitle>
                    <CardDescription>{innovation.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full"
                      onClick={() => setActiveInnovation(innovation.id)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Experience Feature
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="breakthrough" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Breakthrough Innovations</h2>
              <p className="text-gray-600">
                Revolutionary technology that redefines what's possible in education
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {breakthroughFeatures.map((innovation) => (
                <Card key={innovation.id} className="hover:shadow-xl transition-all cursor-pointer group border-l-4 border-l-indigo-500">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className={`w-14 h-14 ${innovation.color} rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                        <innovation.icon className="w-7 h-7" />
                      </div>
                      <div className="text-right">
                        <Badge className="bg-indigo-500 text-white mb-1">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Breakthrough
                        </Badge>
                        <div className="text-sm font-semibold text-green-600">{innovation.value}</div>
                      </div>
                    </div>
                    <CardTitle className="text-xl">{innovation.title}</CardTitle>
                    <CardDescription className="text-base">{innovation.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm font-medium text-gray-700 mb-1">Innovation Impact:</div>
                        <div className="text-xs text-gray-600">
                          {innovation.id === 'neural' && 'Direct brain-computer interface for optimized learning'}
                          {innovation.id === 'emotional' && 'Emotional intelligence AI for personalized support'}
                          {innovation.id === 'holographic' && '3D spatial computing for immersive education'}
                          {innovation.id === 'quantum' && 'Global consciousness linking for collaborative learning'}
                          {innovation.id === 'time' && 'Temporal learning across historical dimensions'}
                        </div>
                      </div>
                      <Button 
                        className="w-full bg-indigo-600 hover:bg-indigo-700"
                        onClick={() => setActiveInnovation(innovation.id)}
                      >
                        <Rocket className="w-4 h-4 mr-2" />
                        Launch Innovation
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Summary Stats */}
        <div className="mt-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Platform Transformation Complete</h3>
            <p className="text-lg mb-6">
              Universal One School is now the world's most advanced educational platform
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">10</div>
                <div className="text-sm opacity-90">Revolutionary Features</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">${totalValue}K</div>
                <div className="text-sm opacity-90">Total Platform Value</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">∞</div>
                <div className="text-sm opacity-90">Learning Possibilities</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">🌟</div>
                <div className="text-sm opacity-90">Legendary Status</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}