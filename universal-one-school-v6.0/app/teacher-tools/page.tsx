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
  ClipboardList,
  CheckCircle,
  Target,
  FileText,
  TrendingUp,
  Award,
  Clock,
  Star,
  Download,
  Share2,
  Settings
} from 'lucide-react'

export default function TeacherToolsPage() {
  const [activeTab, setActiveTab] = useState('overview')

  const features = [
    {
      icon: <Brain className="h-8 w-8 text-blue-500" />,
      title: 'AI Curriculum Generator',
      description: 'Create comprehensive curricula aligned with state standards',
      benefits: ['Instant generation', 'Standards aligned', 'Customizable']
    },
    {
      icon: <ClipboardList className="h-8 w-8 text-green-500" />,
      title: 'Lesson Plan Builder',
      description: 'Generate detailed lesson plans with activities and assessments',
      benefits: ['Time-saving', 'Professional format', 'Differentiated instruction']
    },
    {
      icon: <Target className="h-8 w-8 text-purple-500" />,
      title: 'Assessment Tools',
      description: 'Create rubrics, quizzes, and performance assessments',
      benefits: ['Aligned objectives', 'Multiple formats', 'Auto-grading options']
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-orange-500" />,
      title: 'Progress Tracking',
      description: 'Monitor student progress and identify learning gaps',
      benefits: ['Data-driven insights', 'Visual dashboards', 'Parent communication']
    }
  ]

  const toolCategories = [
    {
      category: 'Curriculum Development',
      icon: <BookOpen className="h-6 w-6" />,
      tools: [
        'AI Curriculum Generator',
        'Standards Alignment Checker',
        'Scope & Sequence Builder',
        'Cross-curricular Connections',
        'Pacing Guide Creator'
      ],
      color: 'bg-blue-50 border-blue-200'
    },
    {
      category: 'Lesson Planning',
      icon: <ClipboardList className="h-6 w-6" />,
      tools: [
        'Lesson Plan Templates',
        'Activity Generator',
        'Resource Finder',
        'Differentiation Strategies',
        'Technology Integration'
      ],
      color: 'bg-green-50 border-green-200'
    },
    {
      category: 'Assessment & Evaluation',
      icon: <CheckCircle className="h-6 w-6" />,
      tools: [
        'Rubric Generator',
        'Quiz Builder',
        'Performance Tasks',
        'Portfolio Assessment',
        'Formative Assessment Tools'
      ],
      color: 'bg-purple-50 border-purple-200'
    },
    {
      category: 'Classroom Management',
      icon: <Users className="h-6 w-6" />,
      tools: [
        'Behavior Tracking',
        'Seating Chart Creator',
        'Communication Templates',
        'Parent Conference Prep',
        'IEP/504 Plan Tools'
      ],
      color: 'bg-orange-50 border-orange-200'
    }
  ]

  const specializations = [
    'Elementary Education (K-5)',
    'Middle School (6-8)', 
    'High School (9-12)',
    'Special Education',
    'English Language Learners',
    'STEM Education',
    'Arts & Humanities',
    'Career & Technical Education'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="text-blue-600 font-semibold text-lg hover:text-blue-500">
              ← Universal One School
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Independent Teacher Tools</h1>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Professional</Badge>
              <Badge variant="outline">Independent</Badge>
            </div>
          </div>
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
            <TabsTrigger value="generator">AI Generator</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8 mt-8">
            {/* Hero Section */}
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center gap-3">
                <GraduationCap className="h-12 w-12 text-blue-500" />
                <h2 className="text-4xl font-bold text-gray-900">Teacher Independence Suite</h2>
              </div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Comprehensive curriculum development tools for educators. Create, customize, and implement 
                professional-grade educational content independently.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={() => setActiveTab('generator')} className="px-8">
                  <Brain className="h-5 w-5 mr-2" />
                  Start Creating
                </Button>
                <Button size="lg" variant="outline" onClick={() => setActiveTab('tools')}>
                  Browse Tools
                </Button>
              </div>
            </div>

            {/* Key Benefits */}
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

            {/* Professional Features */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-6 w-6 text-blue-500" />
                  Professional Teacher Features
                </CardTitle>
                <CardDescription>
                  Advanced tools designed specifically for educational professionals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-blue-800">Standards Alignment</h4>
                    <ul className="text-sm space-y-1">
                      <li>• All 50 state standards</li>
                      <li>• Common Core integration</li>
                      <li>• NGSS science standards</li>
                      <li>• Custom district standards</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-green-800">Differentiation Support</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Multiple learning styles</li>
                      <li>• IEP/504 accommodations</li>
                      <li>• ELL modifications</li>
                      <li>• Gifted extensions</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-purple-800">Professional Sharing</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Export to multiple formats</li>
                      <li>• Collaborate with colleagues</li>
                      <li>• Share with administrators</li>
                      <li>• Revenue sharing program</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tools" className="space-y-8 mt-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-gray-900">Comprehensive Tool Suite</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Everything you need for independent curriculum development and classroom management
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {toolCategories.map((category, index) => (
                <Card key={index} className={`${category.color} hover:shadow-lg transition-shadow`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {category.icon}
                      {category.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {category.tools.map((tool, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          {tool}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full mt-4" variant="outline" onClick={() => setActiveTab('generator')}>
                      Access Tools
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Specialization Areas */}
            <Card>
              <CardHeader>
                <CardTitle>Specialization Areas</CardTitle>
                <CardDescription>
                  Tools customized for different educational levels and specialties
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {specializations.map((spec, index) => (
                    <Badge key={index} variant="outline" className="justify-center p-2">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="generator" className="mt-8">
            <AICurriculumGenerator />
          </TabsContent>

          <TabsContent value="resources" className="space-y-8 mt-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-gray-900">Professional Resources</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Additional resources and support for independent educators
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>Professional Development</CardTitle>
                  <CardDescription>
                    Ongoing training and certification opportunities
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="text-sm space-y-1">
                    <li>• Curriculum design workshops</li>
                    <li>• Technology integration training</li>
                    <li>• Assessment best practices</li>
                    <li>• Differentiation strategies</li>
                  </ul>
                  <Button variant="outline" className="w-full">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    View Courses
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>Teacher Community</CardTitle>
                  <CardDescription>
                    Connect with educators worldwide
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="text-sm space-y-1">
                    <li>• Subject-specific forums</li>
                    <li>• Resource sharing library</li>
                    <li>• Peer mentorship program</li>
                    <li>• Monthly virtual meetups</li>
                  </ul>
                  <Button variant="outline" className="w-full">
                    <Users className="h-4 w-4 mr-2" />
                    Join Community
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>Revenue Sharing</CardTitle>
                  <CardDescription>
                    Earn from your curriculum creations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="text-sm space-y-1">
                    <li>• 70% revenue share for creators</li>
                    <li>• Global marketplace reach</li>
                    <li>• Automatic royalty tracking</li>
                    <li>• Professional quality control</li>
                  </ul>
                  <Button variant="outline" className="w-full">
                    <Share2 className="h-4 w-4 mr-2" />
                    Start Selling
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Quick Start Guide */}
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardHeader>
                <CardTitle>Quick Start Guide</CardTitle>
                <CardDescription>
                  Get up and running with your first curriculum in minutes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-xl font-bold text-blue-600">1</span>
                    </div>
                    <h4 className="font-semibold">Choose Your Subject</h4>
                    <p className="text-sm text-gray-600">Select grade level and subject area</p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-xl font-bold text-green-600">2</span>
                    </div>
                    <h4 className="font-semibold">Set Parameters</h4>
                    <p className="text-sm text-gray-600">Define standards and accommodations</p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-xl font-bold text-purple-600">3</span>
                    </div>
                    <h4 className="font-semibold">Generate Content</h4>
                    <p className="text-sm text-gray-600">AI creates your curriculum</p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-xl font-bold text-orange-600">4</span>
                    </div>
                    <h4 className="font-semibold">Customize & Export</h4>
                    <p className="text-sm text-gray-600">Refine and share your work</p>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <Button size="lg" onClick={() => setActiveTab('generator')}>
                    Start Your First Curriculum
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