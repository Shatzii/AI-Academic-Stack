'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  BookOpen, 
  Video, 
  Image, 
  Music, 
  Gamepad2, 
  Brain, 
  Eye, 
  Headphones,
  Play,
  Download,
  Share,
  Star,
  Clock,
  Users,
  Target,
  Lightbulb,
  Palette,
  Search,
  Filter,
  Plus,
  Save,
  Wand2,
  Heart
} from 'lucide-react'

interface CurriculumModule {
  id: string
  title: string
  subject: string
  gradeLevel: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: number
  objectives: string[]
  resources: ResourceItem[]
  adaptations: NeurodivergentAdaptation[]
  assessments: Assessment[]
  createdBy: string
  rating: number
  downloads: number
}

interface ResourceItem {
  id: string
  type: 'video' | 'interactive' | 'article' | 'game' | 'simulation' | 'worksheet' | 'quiz'
  title: string
  description: string
  url: string
  thumbnail: string
  duration?: number
  difficulty: string
  tags: string[]
}

interface NeurodivergentAdaptation {
  type: 'dyslexia' | 'adhd' | 'autism' | 'visual' | 'auditory' | 'kinesthetic'
  description: string
  features: string[]
}

interface Assessment {
  type: 'formative' | 'summative' | 'peer' | 'self'
  title: string
  description: string
  rubric: string[]
}

export default function EnhancedCurriculumGenerator() {
  const [selectedSubject, setSelectedSubject] = useState('Mathematics')
  const [selectedGrade, setSelectedGrade] = useState('3rd Grade')
  const [selectedDifficulty, setSelectedDifficulty] = useState('intermediate')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'generator' | 'library' | 'builder' | 'preview'>('generator')
  const [generatedCurriculum, setGeneratedCurriculum] = useState<CurriculumModule | null>(null)

  const subjects = [
    'Mathematics', 'Science', 'English Language Arts', 'Social Studies', 
    'Art', 'Music', 'Physical Education', 'Computer Science', 'Theater',
    'World Languages', 'Health', 'Life Skills'
  ]

  const learningStyles = [
    { id: 'visual', name: 'Visual Learners', icon: <Eye className="h-4 w-4" />, color: 'bg-blue-500' },
    { id: 'auditory', name: 'Auditory Learners', icon: <Headphones className="h-4 w-4" />, color: 'bg-green-500' },
    { id: 'kinesthetic', name: 'Kinesthetic Learners', icon: <Users className="h-4 w-4" />, color: 'bg-orange-500' },
    { id: 'reading', name: 'Reading/Writing', icon: <BookOpen className="h-4 w-4" />, color: 'bg-purple-500' }
  ]

  const neurodivergentSupports = [
    {
      type: 'dyslexia',
      name: 'Dyslexia Support',
      features: ['Text-to-Speech', 'Dyslexia-friendly fonts', 'Color overlays', 'Audio narration', 'Visual word mapping']
    },
    {
      type: 'adhd',
      name: 'ADHD Support',
      features: ['Break timers', 'Focus mode', 'Progress tracking', 'Gamification', 'Sensory breaks']
    },
    {
      type: 'autism',
      name: 'Autism Support',
      features: ['Predictable structure', 'Visual schedules', 'Social stories', 'Sensory accommodations', 'Clear expectations']
    },
    {
      type: 'visual',
      name: 'Visual Processing',
      features: ['High contrast', 'Large text', 'Screen reader', 'Magnification', 'Audio descriptions']
    }
  ]

  const sampleResources: ResourceItem[] = [
    {
      id: '1',
      type: 'video',
      title: 'Khan Academy Math Lessons',
      description: 'Interactive video series covering core math concepts with visual aids and practice problems',
      url: 'https://khanacademy.org',
      thumbnail: 'khan-academy-thumbnail',
      duration: 15,
      difficulty: 'intermediate',
      tags: ['mathematics', 'visual', 'interactive', 'practice']
    },
    {
      id: '2',
      type: 'interactive',
      title: 'Prodigy Math Game',
      description: 'Adaptive learning game that adjusts to student skill level with curriculum alignment',
      url: 'https://prodigygame.com',
      thumbnail: 'prodigy-thumbnail',
      duration: 30,
      difficulty: 'beginner',
      tags: ['games', 'adaptive', 'engaging', 'curriculum-aligned']
    },
    {
      id: '3',
      type: 'simulation',
      title: 'PhET Interactive Simulations',
      description: 'Science and math simulations from University of Colorado Boulder',
      url: 'https://phet.colorado.edu',
      thumbnail: 'phet-thumbnail',
      duration: 20,
      difficulty: 'advanced',
      tags: ['simulation', 'science', 'hands-on', 'university-created']
    },
    {
      id: '4',
      type: 'article',
      title: 'National Geographic Education',
      description: 'Educational content with high-quality photography, videos, and interactive maps',
      url: 'https://education.nationalgeographic.org',
      thumbnail: 'natgeo-thumbnail',
      difficulty: 'intermediate',
      tags: ['reading', 'visual', 'exploration', 'real-world']
    },
    {
      id: '5',
      type: 'game',
      title: 'Scratch Programming Platform',
      description: 'Visual programming language for creating interactive stories, games, and animations',
      url: 'https://scratch.mit.edu',
      thumbnail: 'scratch-thumbnail',
      duration: 45,
      difficulty: 'beginner',
      tags: ['coding', 'creativity', 'problem-solving', 'MIT-developed']
    },
    {
      id: '6',
      type: 'video',
      title: 'TED-Ed Educational Videos',
      description: 'Animated educational videos covering diverse topics with lesson plans',
      url: 'https://ed.ted.com',
      thumbnail: 'ted-ed-thumbnail',
      duration: 10,
      difficulty: 'intermediate',
      tags: ['animation', 'diverse-topics', 'lesson-plans', 'engaging']
    }
  ]

  const generateCurriculum = () => {
    const newCurriculum: CurriculumModule = {
      id: `curriculum-${Date.now()}`,
      title: `${selectedSubject} Mastery Program - ${selectedGrade}`,
      subject: selectedSubject,
      gradeLevel: selectedGrade,
      difficulty: selectedDifficulty as any,
      duration: 120,
      objectives: [
        `Master fundamental ${selectedSubject.toLowerCase()} concepts appropriate for ${selectedGrade}`,
        'Develop critical thinking and analytical problem-solving skills',
        'Apply knowledge through hands-on activities and real-world applications',
        'Demonstrate understanding through multiple assessment modalities',
        'Build confidence and sustained engagement in learning',
        'Connect concepts to cross-curricular applications'
      ],
      resources: sampleResources.slice(0, 4),
      adaptations: [
        {
          type: 'dyslexia',
          description: 'Comprehensive dyslexia support with multiple accommodation options',
          features: ['Text-to-speech narration', 'OpenDyslexic font option', 'Color overlay tools', 'Visual word mapping', 'Audio content']
        },
        {
          type: 'adhd',
          description: 'ADHD-friendly learning environment with focus support',
          features: ['Built-in break timers', 'Focus enhancement tools', 'Progress gamification', 'Sensory break activities', 'Clear structure']
        },
        {
          type: 'autism',
          description: 'Autism spectrum support with predictable structure',
          features: ['Predictable lesson flow', 'Visual learning schedules', 'Social interaction guides', 'Sensory accommodations', 'Clear expectations']
        }
      ],
      assessments: [
        {
          type: 'formative',
          title: 'Daily Learning Check-ins',
          description: 'Brief assessments integrated into lessons to gauge understanding',
          rubric: ['Demonstrates clear understanding', 'Shows good progress with minor gaps', 'Needs additional support and practice']
        },
        {
          type: 'summative',
          title: 'Unit Learning Portfolio',
          description: 'Comprehensive collection showcasing learning journey and mastery',
          rubric: ['Exceeds grade-level expectations', 'Meets all grade-level standards', 'Approaching grade-level standards', 'Needs continued support']
        },
        {
          type: 'peer',
          title: 'Collaborative Learning Assessment',
          description: 'Students work together to solve problems and assess each other\'s contributions',
          rubric: ['Excellent collaboration and problem-solving', 'Good teamwork with solid contributions', 'Basic participation with guidance needed']
        }
      ],
      createdBy: 'Universal One School AI Engine',
      rating: 4.8,
      downloads: 1247
    }
    setGeneratedCurriculum(newCurriculum)
    setViewMode('preview')
  }

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-5 w-5" />
      case 'interactive': return <Gamepad2 className="h-5 w-5" />
      case 'article': return <BookOpen className="h-5 w-5" />
      case 'game': return <Gamepad2 className="h-5 w-5" />
      case 'simulation': return <Brain className="h-5 w-5" />
      default: return <BookOpen className="h-5 w-5" />
    }
  }

  const getResourceColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-red-500'
      case 'interactive': return 'bg-blue-500'
      case 'article': return 'bg-green-500'
      case 'game': return 'bg-purple-500'
      case 'simulation': return 'bg-orange-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Dynamic Curriculum Generator
          </h1>
          <p className="text-gray-600 text-lg">
            Create personalized, multimedia-rich learning experiences with neurodivergent adaptations
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl shadow-lg p-1 flex">
            {[
              { id: 'generator', label: 'AI Generator', icon: Wand2 },
              { id: 'library', label: 'Resource Library', icon: BookOpen },
              { id: 'builder', label: 'Custom Builder', icon: Plus },
              { id: 'preview', label: 'Preview', icon: Eye }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setViewMode(id as any)}
                className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-all font-semibold ${
                  viewMode === id 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* AI Generator View */}
        {viewMode === 'generator' && (
          <div className="space-y-6">
            <Card className="shadow-xl border-0 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Wand2 className="h-6 w-6" />
                  AI-Powered Curriculum Generator
                </CardTitle>
                <CardDescription className="text-indigo-100">
                  Generate comprehensive curriculum with multimedia resources and neurodivergent adaptations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <Label className="text-white font-semibold">Subject Area</Label>
                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map(subject => (
                          <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-white font-semibold">Grade Level</Label>
                    <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {['K', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'].map(grade => (
                          <SelectItem key={grade} value={`${grade} Grade`}>{grade} Grade</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-white font-semibold">Difficulty Level</Label>
                    <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button 
                  onClick={generateCurriculum}
                  className="w-full mt-6 bg-white text-indigo-600 hover:bg-indigo-50 font-bold py-3"
                >
                  Generate Dynamic Curriculum
                </Button>
              </CardContent>
            </Card>

            {/* Learning Styles Support */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Multi-Modal Learning Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  {learningStyles.map(style => (
                    <div key={style.id} className="flex items-center gap-3 p-4 rounded-lg bg-gray-50">
                      <div className={`p-2 rounded-full ${style.color} text-white`}>
                        {style.icon}
                      </div>
                      <span className="font-medium text-gray-700">{style.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Neurodivergent Support */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Neurodivergent Learning Adaptations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {neurodivergentSupports.map((support, index) => (
                    <div key={index} className="p-4 rounded-lg border-2 border-purple-200 bg-purple-50">
                      <h4 className="font-semibold text-purple-800 mb-2">{support.name}</h4>
                      <div className="flex flex-wrap gap-2">
                        {support.features.map((feature, i) => (
                          <Badge key={i} className="bg-purple-600 text-white">{feature}</Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Resource Library View */}
        {viewMode === 'library' && (
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Multimedia Resource Library
                </CardTitle>
                <div className="flex gap-4 mt-4">
                  <div className="flex-1">
                    <Input 
                      placeholder="Search educational resources..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sampleResources.map(resource => (
                    <Card key={resource.id} className="shadow-md hover:shadow-lg transition-shadow">
                      <div className="relative">
                        <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-t-lg flex items-center justify-center">
                          <div className={`p-4 rounded-full ${getResourceColor(resource.type)} text-white`}>
                            {getResourceIcon(resource.type)}
                          </div>
                        </div>
                        <Badge className={`absolute top-2 right-2 ${getResourceColor(resource.type)} text-white`}>
                          {resource.type.toUpperCase()}
                        </Badge>
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{resource.title}</CardTitle>
                        <CardDescription>{resource.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {resource.tags.map((tag, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
                          ))}
                        </div>
                        <div className="flex justify-between items-center">
                          {resource.duration && (
                            <span className="text-sm text-gray-500 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {resource.duration} min
                            </span>
                          )}
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Preview View */}
        {viewMode === 'preview' && generatedCurriculum && (
          <div className="space-y-6">
            <Card className="shadow-xl">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="text-2xl">{generatedCurriculum.title}</CardTitle>
                <CardDescription className="text-indigo-100">
                  Duration: {generatedCurriculum.duration} minutes • {generatedCurriculum.difficulty} level
                </CardDescription>
                <div className="flex gap-4 mt-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-300" />
                    <span>{generatedCurriculum.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    <span>{generatedCurriculum.downloads} downloads</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <Tabs defaultValue="objectives">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="objectives">Learning Objectives</TabsTrigger>
                    <TabsTrigger value="resources">Resources</TabsTrigger>
                    <TabsTrigger value="adaptations">Adaptations</TabsTrigger>
                    <TabsTrigger value="assessments">Assessments</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="objectives" className="space-y-4">
                    <div className="grid gap-3">
                      {generatedCurriculum.objectives.map((objective, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-blue-50">
                          <Target className="h-5 w-5 text-blue-600 mt-0.5" />
                          <span className="text-gray-700">{objective}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="resources" className="space-y-4">
                    <div className="grid gap-4">
                      {generatedCurriculum.resources.map(resource => (
                        <Card key={resource.id} className="border-l-4 border-indigo-500">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-lg ${getResourceColor(resource.type)} text-white`}>
                                  {getResourceIcon(resource.type)}
                                </div>
                                <div>
                                  <h4 className="font-semibold">{resource.title}</h4>
                                  <p className="text-gray-600 text-sm">{resource.description}</p>
                                  <div className="flex gap-2 mt-2">
                                    {resource.tags.map((tag, i) => (
                                      <Badge key={i} variant="outline">{tag}</Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <Button size="sm">
                                <Play className="h-4 w-4 mr-1" />
                                Access
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="adaptations" className="space-y-4">
                    <div className="grid gap-4">
                      {generatedCurriculum.adaptations.map((adaptation, index) => (
                        <Card key={index} className="border-l-4 border-purple-500">
                          <CardContent className="p-4">
                            <h4 className="font-semibold text-purple-800 mb-2 capitalize">
                              {adaptation.type} Support
                            </h4>
                            <p className="text-gray-600 mb-3">{adaptation.description}</p>
                            <div className="flex flex-wrap gap-2">
                              {adaptation.features.map((feature, i) => (
                                <Badge key={i} className="bg-purple-100 text-purple-800">{feature}</Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="assessments" className="space-y-4">
                    <div className="grid gap-4">
                      {generatedCurriculum.assessments.map((assessment, index) => (
                        <Card key={index} className="border-l-4 border-green-500">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-semibold">{assessment.title}</h4>
                              <Badge className="bg-green-100 text-green-800">{assessment.type}</Badge>
                            </div>
                            <p className="text-gray-600 mb-3">{assessment.description}</p>
                            <div className="space-y-1">
                              {assessment.rubric.map((criteria, i) => (
                                <div key={i} className="text-sm text-gray-500">• {criteria}</div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="flex gap-4 mt-6 pt-6 border-t">
                  <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700">
                    <Save className="h-4 w-4 mr-2" />
                    Save Curriculum
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Share className="h-4 w-4 mr-2" />
                    Share with Team
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}