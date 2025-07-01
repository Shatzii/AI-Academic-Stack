'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import AICurriculumGenerator from '@/components/curriculum/ai-curriculum-generator'
import { 
  Brain, 
  Calendar, 
  BookOpen, 
  Users, 
  GraduationCap,
  Clock,
  MapPin,
  Zap,
  Star,
  ArrowRight,
  CheckCircle,
  Globe,
  School,
  Home,
  UserCheck
} from 'lucide-react'

export default function CurriculumPlanningPage() {
  const [activeTab, setActiveTab] = useState('overview')

  const features = [
    {
      icon: <Brain className="h-8 w-8 text-blue-500" />,
      title: 'AI-Powered Generation',
      description: 'Advanced AI creates personalized curricula based on learning styles, accommodations, and state requirements',
      benefits: ['Instant generation', 'Personalized content', 'Continuously updated']
    },
    {
      icon: <MapPin className="h-8 w-8 text-green-500" />,
      title: 'State Compliance',
      description: 'Automatically aligned with all 50 state standards and requirements',
      benefits: ['Legal compliance', 'Standards alignment', 'Assessment integration']
    },
    {
      icon: <Users className="h-8 w-8 text-purple-500" />,
      title: 'Neurodivergent Support',
      description: 'Built-in accommodations for ADHD, dyslexia, autism, and other learning differences',
      benefits: ['Inclusive design', 'Adaptive content', 'Multiple modalities']
    },
    {
      icon: <Calendar className="h-8 w-8 text-orange-500" />,
      title: 'Flexible Scheduling',
      description: 'Create semester, yearly, or custom timeframes with automatic scheduling',
      benefits: ['Time management', 'Pacing guides', 'Milestone tracking']
    }
  ]

  const userTypes = [
    {
      type: 'Students',
      icon: <GraduationCap className="h-6 w-6" />,
      description: 'Create your own learning path',
      features: [
        'Personalized study schedules',
        'Interest-based learning tracks',
        'Self-paced progression',
        'Achievement tracking',
        'Peer collaboration tools'
      ],
      color: 'bg-blue-50 border-blue-200'
    },
    {
      type: 'Parents',
      icon: <Home className="h-6 w-6" />,
      description: 'Design curriculum for your children',
      features: [
        'Homeschool curriculum planning',
        'State requirement tracking',
        'Progress monitoring tools',
        'Family learning schedules',
        'Educational resource library'
      ],
      color: 'bg-green-50 border-green-200'
    },
    {
      type: 'Teachers',
      icon: <UserCheck className="h-6 w-6" />,
      description: 'Professional curriculum development',
      features: [
        'Classroom curriculum creation',
        'Standards alignment verification',
        'Assessment integration',
        'Lesson plan generation',
        'Student accommodation tools'
      ],
      color: 'bg-purple-50 border-purple-200'
    }
  ]

  const stateHighlights = [
    'Texas TEA Requirements',
    'California Common Core',
    'Florida Standards',
    'New York State Learning Standards',
    'All 50 States Supported'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="text-blue-600 font-semibold text-lg hover:text-blue-500">
              ← Universal One School
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Curriculum Planning Center</h1>
            <div className="flex items-center gap-2">
              <Badge variant="outline">AI-Powered</Badge>
              <Badge variant="outline">State Compliant</Badge>
            </div>
          </div>
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="generator">Generator</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8 mt-8">
            {/* Hero Section */}
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center gap-3">
                <Brain className="h-12 w-12 text-blue-500" />
                <h2 className="text-4xl font-bold text-gray-900">AI Curriculum Planning</h2>
              </div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Create personalized, state-compliant curricula in minutes with our advanced AI technology. 
                Perfect for students, parents, and teachers seeking comprehensive educational planning.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={() => setActiveTab('generator')} className="px-8">
                  <Zap className="h-5 w-5 mr-2" />
                  Start Creating Curriculum
                </Button>
                <Button size="lg" variant="outline" onClick={() => setActiveTab('features')}>
                  Learn More
                </Button>
              </div>
            </div>

            {/* User Types */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {userTypes.map((userType, index) => (
                <Card key={index} className={`${userType.color} hover:shadow-lg transition-shadow`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {userType.icon}
                      {userType.type}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {userType.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {userType.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full mt-4" 
                      variant="outline"
                      onClick={() => setActiveTab('generator')}
                    >
                      Get Started
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* State Compliance */}
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-6 w-6 text-green-500" />
                  Complete State Compliance
                </CardTitle>
                <CardDescription>
                  Automatically aligned with educational standards across all 50 states
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {stateHighlights.map((state, index) => (
                    <Badge key={index} variant="outline" className="justify-center">
                      {state}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  Our AI automatically ensures your curriculum meets local requirements, 
                  including graduation credits, assessment schedules, and special education compliance.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-8 mt-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-gray-900">Powerful Features</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Everything you need to create comprehensive, compliant, and personalized curricula
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
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
                          <Star className="h-4 w-4 text-yellow-500" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="generator" className="mt-8">
            <AICurriculumGenerator />
          </TabsContent>

          <TabsContent value="resources" className="space-y-8 mt-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-gray-900">Educational Resources</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Additional tools and resources to support your curriculum planning
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>State Standards Database</CardTitle>
                  <CardDescription>
                    Comprehensive database of educational standards for all 50 states
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    <Globe className="h-4 w-4 mr-2" />
                    Browse Standards
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>Accommodation Library</CardTitle>
                  <CardDescription>
                    Evidence-based strategies for supporting neurodivergent learners
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    <Users className="h-4 w-4 mr-2" />
                    View Accommodations
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>Assessment Tools</CardTitle>
                  <CardDescription>
                    Ready-to-use assessment templates and rubrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Download Tools
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}