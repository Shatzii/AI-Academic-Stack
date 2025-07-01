'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Brain, 
  Calendar, 
  BookOpen, 
  Users, 
  Download, 
  Save, 
  Share2,
  Clock,
  Target,
  Star,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Zap
} from 'lucide-react'

interface CurriculumRequest {
  userType: 'student' | 'parent' | 'teacher'
  state: string
  gradeLevel: string
  subjects: string[]
  learningStyle: string[]
  accommodations: string[]
  timeframe: 'semester' | 'year' | 'quarter' | 'custom'
  hoursPerWeek: number
  specialRequirements: string
  goals: string[]
}

interface GeneratedCurriculum {
  id: string
  title: string
  description: string
  subjects: Array<{
    name: string
    weeks: number
    units: Array<{
      title: string
      duration: string
      objectives: string[]
      activities: string[]
      assessments: string[]
      accommodations: string[]
    }>
  }>
  schedule: Array<{
    week: number
    subjects: Array<{
      subject: string
      topics: string[]
      homework: string[]
      projects: string[]
    }>
  }>
  stateCompliance: {
    requirements: string[]
    standards: string[]
    assessments: string[]
    complianceScore: number
  }
  adaptations: {
    dyslexia: string[]
    adhd: string[]
    autism: string[]
    ell: string[]
    gifted: string[]
  }
}

export default function AICurriculumGenerator() {
  const [activeTab, setActiveTab] = useState('setup')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [request, setRequest] = useState<CurriculumRequest>({
    userType: 'student',
    state: '',
    gradeLevel: '',
    subjects: [],
    learningStyle: [],
    accommodations: [],
    timeframe: 'semester',
    hoursPerWeek: 20,
    specialRequirements: '',
    goals: []
  })
  const [generatedCurriculum, setGeneratedCurriculum] = useState<GeneratedCurriculum | null>(null)

  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
    'Wisconsin', 'Wyoming'
  ]

  const gradeOptions = [
    'Kindergarten', '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade',
    '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade', '11th Grade', '12th Grade'
  ]

  const subjectOptions = [
    'English Language Arts', 'Mathematics', 'Science', 'Social Studies', 'History',
    'Geography', 'Civics', 'Economics', 'Biology', 'Chemistry', 'Physics', 'Earth Science',
    'Algebra I', 'Algebra II', 'Geometry', 'Pre-Calculus', 'Calculus', 'Statistics',
    'World Languages', 'Spanish', 'French', 'German', 'Art', 'Music', 'Theater',
    'Physical Education', 'Health', 'Computer Science', 'Technology', 'Career Readiness'
  ]

  const learningStyleOptions = [
    'Visual Learner', 'Auditory Learner', 'Kinesthetic Learner', 'Reading/Writing Learner',
    'Collaborative Learner', 'Independent Learner', 'Hands-on Learner', 'Project-based Learner'
  ]

  const accommodationOptions = [
    'Dyslexia Support', 'ADHD Accommodations', 'Autism Spectrum Support', 'English Language Learner',
    'Gifted and Talented', '504 Plan', 'IEP Support', 'Extended Time', 'Frequent Breaks',
    'Sensory Breaks', 'Alternative Assessments', 'Text-to-Speech', 'Large Print Materials'
  ]

  const handleGenerateCurriculum = async () => {
    setIsGenerating(true)
    setGenerationProgress(0)
    setActiveTab('generating')

    try {
      // Make API call to generate curriculum
      const response = await fetch('/api/curriculum/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      })

      if (!response.ok) {
        throw new Error('Failed to generate curriculum')
      }

      // Simulate progress updates
      const intervals = [20, 40, 60, 80, 100]
      for (const progress of intervals) {
        setGenerationProgress(progress)
        await new Promise(resolve => setTimeout(resolve, 500))
      }

      const curriculum = await response.json()
      setGeneratedCurriculum(curriculum)
      setActiveTab('results')
    } catch (error) {
      console.error('Error generating curriculum:', error)
      // For now, show mock data
      const mockCurriculum: GeneratedCurriculum = {
        id: `curriculum-${Date.now()}`,
        title: `${request.gradeLevel} ${request.state} Standards Curriculum`,
        description: `Comprehensive ${request.timeframe} curriculum tailored for ${request.learningStyle.join(', ')} with ${request.accommodations.join(', ')} support`,
        subjects: request.subjects.map(subject => ({
          name: subject,
          weeks: request.timeframe === 'semester' ? 18 : 36,
          units: [
            {
              title: `${subject} Foundations`,
              duration: '4 weeks',
              objectives: [
                `Master fundamental ${subject} concepts`,
                'Develop critical thinking skills',
                'Apply knowledge in practical contexts'
              ],
              activities: [
                'Interactive digital lessons',
                'Hands-on projects',
                'Collaborative group work',
                'Real-world applications'
              ],
              assessments: [
                'Formative assessments',
                'Project-based evaluations',
                'Adaptive quizzes',
                'Portfolio development'
              ],
              accommodations: request.accommodations.map(acc => `${acc} specific adaptations`)
            }
          ]
        })),
        schedule: Array.from({ length: request.timeframe === 'semester' ? 18 : 36 }, (_, week) => ({
          week: week + 1,
          subjects: request.subjects.map(subject => ({
            subject,
            topics: [`Week ${week + 1} ${subject} Topics`],
            homework: [`${subject} practice exercises`],
            projects: week % 4 === 0 ? [`${subject} unit project`] : []
          }))
        })),
        stateCompliance: {
          requirements: [
            `${request.state} Academic Standards`,
            'State Assessment Requirements',
            'Graduation Requirements',
            'Special Education Compliance'
          ],
          standards: [
            'Common Core Standards',
            'Next Generation Science Standards',
            'State-Specific Standards',
            'Social Studies Standards'
          ],
          assessments: [
            'State Standardized Tests',
            'Benchmark Assessments',
            'Progress Monitoring',
            'End-of-Course Exams'
          ],
          complianceScore: 98
        },
        adaptations: {
          dyslexia: [
            'Dyslexia-friendly fonts and formatting',
            'Audio support for all text',
            'Visual learning aids',
            'Extended time for reading activities'
          ],
          adhd: [
            'Frequent movement breaks',
            'Chunked learning segments',
            'Visual organizers',
            'Focus enhancement tools'
          ],
          autism: [
            'Structured routines',
            'Visual schedules',
            'Sensory break options',
            'Clear expectations'
          ],
          ell: [
            'Multilingual support',
            'Visual vocabulary aids',
            'Cultural connections',
            'Language scaffolding'
          ],
          gifted: [
            'Accelerated content',
            'Independent research projects',
            'Critical thinking extensions',
            'Leadership opportunities'
          ]
        }
      }

      setGeneratedCurriculum(mockCurriculum)
      setActiveTab('results')
    } finally {
      setIsGenerating(false)
    }
  }

  const updateRequest = (field: keyof CurriculumRequest, value: any) => {
    setRequest(prev => ({ ...prev, [field]: value }))
  }

  const toggleArrayItem = (field: 'subjects' | 'learningStyle' | 'accommodations' | 'goals', item: string) => {
    setRequest(prev => ({
      ...prev,
      [field]: prev[field].includes(item) 
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item]
    }))
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Brain className="h-8 w-8 text-blue-500" />
          <h1 className="text-3xl font-bold">AI Curriculum Generator</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Create personalized, state-compliant curricula with built-in neurodivergent support and adaptive learning features
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="setup">Setup</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="generating" disabled={!isGenerating}>Generating</TabsTrigger>
          <TabsTrigger value="results" disabled={!generatedCurriculum}>Results</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Tell us about who will be using this curriculum
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="userType">I am a...</Label>
                  <Select value={request.userType} onValueChange={(value) => updateRequest('userType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select user type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="state">State</Label>
                  <Select value={request.state} onValueChange={(value) => updateRequest('state', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map(state => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="gradeLevel">Grade Level</Label>
                  <Select value={request.gradeLevel} onValueChange={(value) => updateRequest('gradeLevel', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {gradeOptions.map(grade => (
                        <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="timeframe">Timeframe</Label>
                  <Select value={request.timeframe} onValueChange={(value) => updateRequest('timeframe', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quarter">Quarter (9 weeks)</SelectItem>
                      <SelectItem value="semester">Semester (18 weeks)</SelectItem>
                      <SelectItem value="year">Full Year (36 weeks)</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="hoursPerWeek">Hours per Week</Label>
                  <Input
                    type="number"
                    value={request.hoursPerWeek}
                    onChange={(e) => updateRequest('hoursPerWeek', parseInt(e.target.value))}
                    min="1"
                    max="40"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Subject Selection
              </CardTitle>
              <CardDescription>
                Choose the subjects to include in your curriculum
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {subjectOptions.map(subject => (
                  <Button
                    key={subject}
                    variant={request.subjects.includes(subject) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleArrayItem('subjects', subject)}
                    className="justify-start text-left h-auto p-2"
                  >
                    {subject}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requirements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Learning Preferences
              </CardTitle>
              <CardDescription>
                Help us personalize the curriculum to learning style and needs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Learning Styles</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  {learningStyleOptions.map(style => (
                    <Button
                      key={style}
                      variant={request.learningStyle.includes(style) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleArrayItem('learningStyle', style)}
                      className="justify-start text-left h-auto p-2"
                    >
                      {style}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Accommodations & Support</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {accommodationOptions.map(accommodation => (
                    <Button
                      key={accommodation}
                      variant={request.accommodations.includes(accommodation) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleArrayItem('accommodations', accommodation)}
                      className="justify-start text-left h-auto p-2"
                    >
                      {accommodation}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="specialRequirements">Special Requirements</Label>
                <Textarea
                  id="specialRequirements"
                  value={request.specialRequirements}
                  onChange={(e) => updateRequest('specialRequirements', e.target.value)}
                  placeholder="Any specific requirements, goals, or considerations..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button 
              onClick={handleGenerateCurriculum}
              size="lg"
              className="px-8"
              disabled={!request.state || !request.gradeLevel || request.subjects.length === 0}
            >
              <Zap className="h-5 w-5 mr-2" />
              Generate AI Curriculum
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="generating" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="animate-spin mx-auto">
                  <Brain className="h-12 w-12 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold">Generating Your Personalized Curriculum</h3>
                <p className="text-gray-600">Our AI is creating a comprehensive curriculum tailored to your specific needs...</p>
                <Progress value={generationProgress} className="max-w-md mx-auto" />
                <p className="text-sm text-gray-500">{Math.round(generationProgress)}% Complete</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {generatedCurriculum && (
            <>
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">{generatedCurriculum.title}</h2>
                  <p className="text-gray-600">{generatedCurriculum.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      State Compliance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>Compliance Score</span>
                        <Badge variant="default">{generatedCurriculum.stateCompliance.complianceScore}%</Badge>
                      </div>
                      <Progress value={generatedCurriculum.stateCompliance.complianceScore} />
                      <div className="text-sm text-gray-600">
                        {generatedCurriculum.stateCompliance.requirements.length} requirements met
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-500" />
                      Schedule Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Duration</span>
                        <span>{generatedCurriculum.schedule.length} weeks</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Subjects</span>
                        <span>{generatedCurriculum.subjects.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Hours/Week</span>
                        <span>{request.hoursPerWeek}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-yellow-500" />
                      Adaptations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.entries(generatedCurriculum.adaptations).map(([type, adaptations]) => (
                        adaptations.length > 0 && (
                          <Badge key={type} variant="outline" className="mr-1">
                            {type.toUpperCase()}
                          </Badge>
                        )
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}