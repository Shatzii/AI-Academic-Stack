'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { 
  BookOpen, 
  Shield, 
  Users, 
  Target, 
  CheckCircle, 
  AlertTriangle, 
  Home, 
  Download, 
  Save, 
  Wand2, 
  FileText, 
  Search,
  Filter,
  Settings,
  Brain,
  Zap,
  Calendar,
  Clock,
  Award,
  Bookmark,
  Eye,
  Edit,
  Trash2,
  Plus
} from 'lucide-react'
import Link from 'next/link'

export default function CurriculumGeneratorPage() {
  const [selectedGrade, setSelectedGrade] = useState('K')
  const [selectedSubject, setSelectedSubject] = useState('english')
  const [selectedTopic, setSelectedTopic] = useState('')
  const [selectedAccommodations, setSelectedAccommodations] = useState([])
  const [generatingCurriculum, setGeneratingCurriculum] = useState(false)
  const [complianceCheck, setComplianceCheck] = useState(null)

  // Texas Education Code Standards Database
  const texasStandards = {
    K: {
      english: {
        code: 'TEC §28.002',
        standards: [
          'Phonemic awareness and phonics',
          'Reading comprehension strategies',
          'Vocabulary development',
          'Oral language development',
          'Writing fundamentals'
        ],
        requirements: [
          'Minimum 90 minutes daily reading instruction',
          'Phonics-based reading instruction required',
          'Assessment every 6 weeks',
          'Intervention for struggling readers'
        ]
      },
      mathematics: {
        code: 'TEC §28.025',
        standards: [
          'Number concepts 0-20',
          'Basic addition and subtraction',
          'Geometric shapes identification',
          'Measurement concepts',
          'Data organization'
        ],
        requirements: [
          'Daily mathematics instruction',
          'Manipulatives and concrete materials',
          'Problem-solving emphasis',
          'Mathematical reasoning development'
        ]
      },
      science: {
        code: 'TEC §28.025',
        standards: [
          'Scientific inquiry and reasoning',
          'Matter and energy observations',
          'Earth and space awareness',
          'Organisms and environments',
          'Safety procedures'
        ],
        requirements: [
          'Hands-on investigations',
          'Safety training required',
          'Scientific method introduction',
          'Nature observation activities'
        ]
      },
      socialStudies: {
        code: 'TEC §28.025',
        standards: [
          'Self, family, and community',
          'Citizenship concepts',
          'Cultural awareness',
          'Geographic basics',
          'Historical thinking'
        ],
        requirements: [
          'Texas history emphasis',
          'Flag etiquette instruction',
          'Pledge of Allegiance daily',
          'Community helpers study'
        ]
      }
    },
    '1': {
      english: {
        code: 'TEC §28.002',
        standards: [
          'Reading fluency development',
          'Comprehension strategies',
          'Vocabulary expansion',
          'Writing sentences and stories',
          'Grammar basics'
        ],
        requirements: [
          'Minimum 90 minutes daily reading',
          'Systematic phonics instruction',
          'Reading assessment quarterly',
          'Parent communication required'
        ]
      },
      mathematics: {
        code: 'TEC §28.025',
        standards: [
          'Numbers to 120',
          'Place value understanding',
          'Addition and subtraction strategies',
          'Measurement and data',
          'Geometry fundamentals'
        ],
        requirements: [
          'Mathematical reasoning emphasis',
          'Problem-solving strategies',
          'Technology integration appropriate',
          'Assessment alignment with state standards'
        ]
      }
    },
    '9': {
      english: {
        code: 'TEC §28.025(a)',
        standards: [
          'Reading complex texts',
          'Literary analysis skills',
          'Research and inquiry',
          'Academic writing',
          'Speaking and listening'
        ],
        requirements: [
          'Four credits English required',
          'State assessment preparation',
          'College readiness standards',
          'Cross-curricular literacy'
        ]
      },
      mathematics: {
        code: 'TEC §28.025(a)',
        standards: [
          'Algebra I concepts',
          'Linear functions',
          'Quadratic functions',
          'Exponential functions',
          'Data analysis'
        ],
        requirements: [
          'Algebra I state assessment',
          'Four math credits required',
          'College and career readiness',
          'Technology tools integration'
        ]
      }
    }
  }

  // Accommodation options for different learning needs
  const accommodationOptions = [
    { id: 'dyslexia', name: 'Dyslexia Support', description: 'Structured literacy approach, multisensory learning' },
    { id: 'adhd', name: 'ADHD Accommodations', description: 'Movement breaks, chunked instruction, visual cues' },
    { id: 'autism', name: 'Autism Spectrum Support', description: 'Routine structures, sensory considerations, social stories' },
    { id: 'ell', name: 'English Language Learner', description: 'Bilingual support, visual aids, scaffolded instruction' },
    { id: 'gifted', name: 'Gifted and Talented', description: 'Accelerated content, critical thinking, independent projects' },
    { id: '504', name: '504 Plan Support', description: 'Individualized accommodations, assistive technology' }
  ]

  // Sample generated curriculum data
  const [curriculumLibrary, setCurriculumLibrary] = useState([
    {
      id: 1,
      title: 'Kindergarten Phonics Foundations',
      grade: 'K',
      subject: 'English',
      duration: '6 weeks',
      compliance: 'Verified',
      accommodations: ['dyslexia', 'ell'],
      createdDate: '2024-12-20',
      texCode: 'TEC §28.002',
      objectives: [
        'Students will identify letter-sound relationships',
        'Students will blend sounds to form words',
        'Students will segment words into individual sounds'
      ],
      activities: [
        'Letter sound games with manipulatives',
        'Phoneme segmentation with counting bears',
        'Sound blending with picture cards'
      ],
      assessments: [
        'Weekly letter identification assessment',
        'Bi-weekly phoneme awareness screening',
        'Progress monitoring every 2 weeks'
      ]
    },
    {
      id: 2,
      title: 'Grade 9 Algebra I: Linear Functions',
      grade: '9',
      subject: 'Mathematics',
      duration: '4 weeks',
      compliance: 'Verified',
      accommodations: ['adhd', '504'],
      createdDate: '2024-12-19',
      texCode: 'TEC §28.025(a)',
      objectives: [
        'Students will graph linear functions',
        'Students will write equations in slope-intercept form',
        'Students will solve systems of linear equations'
      ],
      activities: [
        'Graphing calculator exploration',
        'Real-world linear relationship investigations',
        'Collaborative problem-solving sessions'
      ],
      assessments: [
        'Unit test aligned with STAAR standards',
        'Project-based assessment',
        'Formative assessment quizzes'
      ]
    }
  ])

  // Texas Education Compliance Agent
  const complianceAgent = {
    checkCompliance: (curriculum) => {
      const checks = {
        texasStandards: true,
        timeRequirements: true,
        assessmentAlignment: true,
        accommodations: true,
        safetyProtocols: curriculum.subject === 'science' ? true : null
      }
      
      const issues = []
      const recommendations = []
      
      if (curriculum.grade === 'K' && curriculum.subject === 'english' && !curriculum.objectives.some(obj => obj.includes('phonics'))) {
        checks.texasStandards = false
        issues.push('Missing required phonics instruction for Kindergarten English')
      }
      
      if (curriculum.duration && parseInt(curriculum.duration) < 2) {
        checks.timeRequirements = false
        issues.push('Insufficient instructional time for comprehensive coverage')
      }
      
      if (!curriculum.assessments || curriculum.assessments.length === 0) {
        checks.assessmentAlignment = false
        issues.push('Missing required assessment components')
      }
      
      recommendations.push('Consider adding more hands-on activities for engagement')
      recommendations.push('Include parent communication strategies')
      recommendations.push('Add technology integration opportunities')
      
      return {
        overall: Object.values(checks).filter(Boolean).length / Object.values(checks).filter(v => v !== null).length,
        checks,
        issues,
        recommendations,
        texasCode: texasStandards[curriculum.grade]?.[curriculum.subject]?.code || 'TEC §28.025'
      }
    }
  }

  const generateCurriculum = async () => {
    setGeneratingCurriculum(true)
    
    // Simulate AI curriculum generation
    setTimeout(() => {
      const newCurriculum = {
        id: Date.now(),
        title: `${selectedGrade === 'K' ? 'Kindergarten' : `Grade ${selectedGrade}`} ${selectedSubject.charAt(0).toUpperCase() + selectedSubject.slice(1)}: ${selectedTopic}`,
        grade: selectedGrade,
        subject: selectedSubject,
        topic: selectedTopic,
        duration: '4 weeks',
        compliance: 'Pending Review',
        accommodations: selectedAccommodations,
        createdDate: new Date().toISOString().split('T')[0],
        texCode: texasStandards[selectedGrade]?.[selectedSubject]?.code || 'TEC §28.025',
        objectives: [
          `Students will demonstrate understanding of ${selectedTopic} concepts`,
          `Students will apply ${selectedTopic} skills in practical situations`,
          `Students will communicate learning through multiple modalities`
        ],
        activities: [
          `Interactive ${selectedTopic} exploration`,
          `Collaborative project-based learning`,
          `Technology-enhanced investigations`,
          `Differentiated practice opportunities`
        ],
        assessments: [
          'Formative assessment checkpoints',
          'Performance-based evaluation',
          'Portfolio collection',
          'Peer assessment activities'
        ]
      }
      
      const compliance = complianceAgent.checkCompliance(newCurriculum)
      setComplianceCheck(compliance)
      
      setCurriculumLibrary(prev => [newCurriculum, ...prev])
      setGeneratingCurriculum(false)
    }, 3000)
  }

  const getGradeOptions = () => {
    const grades = ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
    return grades
  }

  const getSubjectOptions = () => {
    return [
      { value: 'english', label: 'English Language Arts' },
      { value: 'mathematics', label: 'Mathematics' },
      { value: 'science', label: 'Science' },
      { value: 'socialStudies', label: 'Social Studies' },
      { value: 'art', label: 'Art' },
      { value: 'music', label: 'Music' },
      { value: 'pe', label: 'Physical Education' },
      { value: 'health', label: 'Health' },
      { value: 'technology', label: 'Technology' },
      { value: 'career', label: 'Career Education' }
    ]
  }

  const getTopicSuggestions = () => {
    const topics = {
      english: ['Reading Comprehension', 'Creative Writing', 'Grammar and Usage', 'Vocabulary Development', 'Literary Analysis'],
      mathematics: ['Number Sense', 'Algebraic Thinking', 'Geometry', 'Measurement', 'Data Analysis'],
      science: ['Scientific Method', 'Life Science', 'Physical Science', 'Earth Science', 'Environmental Science'],
      socialStudies: ['Texas History', 'Geography', 'Civics and Government', 'Economics', 'Cultural Studies']
    }
    return topics[selectedSubject] || []
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Link href="/">
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
            <Link href="/curriculum-library">
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <BookOpen className="h-4 w-4 mr-2" />
                Curriculum Library
              </Button>
            </Link>
            <Link href="/compliance-center">
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Shield className="h-4 w-4 mr-2" />
                Compliance Center
              </Button>
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Texas K-12 Curriculum Generator
          </h1>
          <p className="text-green-200 text-lg">
            AI-Powered Curriculum Creation | Texas Education Code Compliant | Accessibility Focused
          </p>
          <div className="mt-4 flex justify-center gap-4 flex-wrap">
            <Badge className="bg-green-600/20 text-green-300 px-4 py-2">
              TEC Compliant
            </Badge>
            <Badge className="bg-blue-600/20 text-blue-300 px-4 py-2">
              STAAR Aligned
            </Badge>
            <Badge className="bg-purple-600/20 text-purple-300 px-4 py-2">
              Neurodivergent Friendly
            </Badge>
            <Badge className="bg-orange-600/20 text-orange-300 px-4 py-2">
              AI Generated
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="generator" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 border-white/20">
            <TabsTrigger value="generator" className="text-white">Curriculum Generator</TabsTrigger>
            <TabsTrigger value="library" className="text-white">Library</TabsTrigger>
            <TabsTrigger value="compliance" className="text-white">Compliance Agent</TabsTrigger>
            <TabsTrigger value="analytics" className="text-white">Analytics</TabsTrigger>
          </TabsList>

          {/* Curriculum Generator Tab */}
          <TabsContent value="generator" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Generator Controls */}
              <div className="lg:col-span-2">
                <Card className="bg-white/10 border-white/20 text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wand2 className="h-5 w-5" />
                      AI Curriculum Generator
                    </CardTitle>
                    <CardDescription className="text-green-200">
                      Create Texas Education Code compliant curriculum with AI assistance
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Basic Settings */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-white mb-2 block">Grade Level</Label>
                        <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                          <SelectTrigger className="bg-white/10 border-white/20 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {getGradeOptions().map(grade => (
                              <SelectItem key={grade} value={grade}>
                                {grade === 'K' ? 'Kindergarten' : `Grade ${grade}`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label className="text-white mb-2 block">Subject</Label>
                        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                          <SelectTrigger className="bg-white/10 border-white/20 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {getSubjectOptions().map(subject => (
                              <SelectItem key={subject.value} value={subject.value}>
                                {subject.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Topic Selection */}
                    <div>
                      <Label className="text-white mb-2 block">Topic/Unit</Label>
                      <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Select a topic..." />
                        </SelectTrigger>
                        <SelectContent>
                          {getTopicSuggestions().map(topic => (
                            <SelectItem key={topic} value={topic}>
                              {topic}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Custom Topic Input */}
                    <div>
                      <Label className="text-white mb-2 block">Custom Topic (Optional)</Label>
                      <Input
                        placeholder="Enter custom topic..."
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        value={selectedTopic}
                        onChange={(e) => setSelectedTopic(e.target.value)}
                      />
                    </div>

                    {/* Accommodations */}
                    <div>
                      <Label className="text-white mb-3 block">Learning Accommodations</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {accommodationOptions.map(option => (
                          <div 
                            key={option.id}
                            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                              selectedAccommodations.includes(option.id)
                                ? 'bg-green-600/20 border-green-600/50'
                                : 'bg-white/5 border-white/20 hover:bg-white/10'
                            }`}
                            onClick={() => {
                              setSelectedAccommodations(prev =>
                                prev.includes(option.id)
                                  ? prev.filter(id => id !== option.id)
                                  : [...prev, option.id]
                              )
                            }}
                          >
                            <div className="font-medium text-sm">{option.name}</div>
                            <div className="text-xs text-white/70">{option.description}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Generate Button */}
                    <Button
                      onClick={generateCurriculum}
                      disabled={!selectedTopic || generatingCurriculum}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      {generatingCurriculum ? (
                        <>
                          <Brain className="h-4 w-4 mr-2 animate-pulse" />
                          Generating Curriculum...
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-2" />
                          Generate Curriculum
                        </>
                      )}
                    </Button>

                    {generatingCurriculum && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-green-200">
                          <Clock className="h-4 w-4" />
                          Analyzing Texas Education Standards...
                        </div>
                        <Progress value={33} className="h-2" />
                        <div className="flex items-center gap-2 text-sm text-green-200">
                          <Brain className="h-4 w-4" />
                          Creating learning objectives...
                        </div>
                        <Progress value={66} className="h-2" />
                        <div className="flex items-center gap-2 text-sm text-green-200">
                          <Shield className="h-4 w-4" />
                          Running compliance verification...
                        </div>
                        <Progress value={100} className="h-2" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Texas Standards Reference */}
              <div className="space-y-6">
                <Card className="bg-white/10 border-white/20 text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Texas Standards
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {texasStandards[selectedGrade]?.[selectedSubject] ? (
                      <div className="space-y-4">
                        <div>
                          <div className="font-medium text-green-300 mb-2">Legal Code:</div>
                          <Badge className="bg-green-600/20 text-green-300">
                            {texasStandards[selectedGrade][selectedSubject].code}
                          </Badge>
                        </div>
                        
                        <div>
                          <div className="font-medium text-blue-300 mb-2">Standards:</div>
                          <div className="space-y-1 text-sm">
                            {texasStandards[selectedGrade][selectedSubject].standards.map((standard, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-green-400" />
                                <span>{standard}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <div className="font-medium text-orange-300 mb-2">Requirements:</div>
                          <div className="space-y-1 text-sm">
                            {texasStandards[selectedGrade][selectedSubject].requirements.map((req, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <Target className="h-3 w-3 text-orange-400" />
                                <span>{req}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-white/70 py-8">
                        <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <div>Select grade and subject to view standards</div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="bg-white/10 border-white/20 text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start bg-blue-600/20 border-blue-600/30 text-blue-300 hover:bg-blue-600/30">
                      <FileText className="h-4 w-4 mr-2" />
                      Load Template
                    </Button>
                    <Button className="w-full justify-start bg-purple-600/20 border-purple-600/30 text-purple-300 hover:bg-purple-600/30">
                      <Download className="h-4 w-4 mr-2" />
                      Export Standards
                    </Button>
                    <Button className="w-full justify-start bg-green-600/20 border-green-600/30 text-green-300 hover:bg-green-600/30">
                      <Save className="h-4 w-4 mr-2" />
                      Save Draft
                    </Button>
                    <Button className="w-full justify-start bg-orange-600/20 border-orange-600/30 text-orange-300 hover:bg-orange-600/30">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Compliance Check Results */}
            {complianceCheck && (
              <Card className="bg-white/10 border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Compliance Analysis
                    </div>
                    <Badge className={`${
                      complianceCheck.overall >= 0.8 ? 'bg-green-600/20 text-green-300' :
                      complianceCheck.overall >= 0.6 ? 'bg-yellow-600/20 text-yellow-300' :
                      'bg-red-600/20 text-red-300'
                    }`}>
                      {Math.round(complianceCheck.overall * 100)}% Compliant
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-medium text-green-300 mb-3">Compliance Checks</h4>
                      <div className="space-y-2 text-sm">
                        {Object.entries(complianceCheck.checks).map(([check, passed]) => (
                          passed !== null && (
                            <div key={check} className="flex items-center gap-2">
                              {passed ? (
                                <CheckCircle className="h-4 w-4 text-green-400" />
                              ) : (
                                <AlertTriangle className="h-4 w-4 text-red-400" />
                              )}
                              <span className="capitalize">{check.replace(/([A-Z])/g, ' $1').trim()}</span>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                    
                    {complianceCheck.issues.length > 0 && (
                      <div>
                        <h4 className="font-medium text-red-300 mb-3">Issues Found</h4>
                        <div className="space-y-2 text-sm">
                          {complianceCheck.issues.map((issue, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5" />
                              <span>{issue}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <h4 className="font-medium text-blue-300 mb-3">Recommendations</h4>
                      <div className="space-y-2 text-sm">
                        {complianceCheck.recommendations.slice(0, 3).map((rec, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <Target className="h-4 w-4 text-blue-400 mt-0.5" />
                            <span>{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Library Tab */}
          <TabsContent value="library" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Curriculum Library</h2>
              <div className="flex gap-3">
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {curriculumLibrary.map(curriculum => (
                <Card key={curriculum.id} className="bg-white/10 border-white/20 text-white">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg mb-1">{curriculum.title}</CardTitle>
                        <div className="flex gap-2 text-sm">
                          <Badge className="bg-blue-600/20 text-blue-300">
                            {curriculum.grade === 'K' ? 'Kindergarten' : `Grade ${curriculum.grade}`}
                          </Badge>
                          <Badge className="bg-purple-600/20 text-purple-300">
                            {curriculum.subject}
                          </Badge>
                        </div>
                      </div>
                      <Badge className={`${
                        curriculum.compliance === 'Verified' ? 'bg-green-600/20 text-green-300' :
                        curriculum.compliance === 'Pending Review' ? 'bg-yellow-600/20 text-yellow-300' :
                        'bg-red-600/20 text-red-300'
                      }`}>
                        {curriculum.compliance}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-green-300">Duration:</span>
                          <div>{curriculum.duration}</div>
                        </div>
                        <div>
                          <span className="text-blue-300">Created:</span>
                          <div>{curriculum.createdDate}</div>
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-orange-300 text-sm">Texas Code:</span>
                        <div className="font-mono text-xs">{curriculum.texCode}</div>
                      </div>
                      
                      {curriculum.accommodations.length > 0 && (
                        <div>
                          <span className="text-purple-300 text-sm">Accommodations:</span>
                          <div className="flex gap-1 mt-1">
                            {curriculum.accommodations.map(acc => (
                              <Badge key={acc} className="bg-purple-600/20 text-purple-300 text-xs">
                                {accommodationOptions.find(opt => opt.id === acc)?.name || acc}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex gap-2 pt-3">
                        <Button size="sm" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                          <Download className="h-3 w-3 mr-1" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance" className="space-y-6">
            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Texas Education Code Compliance Agent
                </CardTitle>
                <CardDescription className="text-green-200">
                  Automated compliance monitoring and verification system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-green-600/10 rounded-lg">
                    <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-400" />
                    <div className="text-2xl font-bold">98%</div>
                    <div className="text-sm text-green-300">Overall Compliance</div>
                  </div>
                  
                  <div className="text-center p-4 bg-blue-600/10 rounded-lg">
                    <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-400" />
                    <div className="text-2xl font-bold">{curriculumLibrary.length}</div>
                    <div className="text-sm text-blue-300">Verified Curricula</div>
                  </div>
                  
                  <div className="text-center p-4 bg-orange-600/10 rounded-lg">
                    <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-orange-400" />
                    <div className="text-2xl font-bold">2</div>
                    <div className="text-sm text-orange-300">Pending Review</div>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-600/10 rounded-lg">
                    <Award className="h-8 w-8 mx-auto mb-2 text-purple-400" />
                    <div className="text-2xl font-bold">15</div>
                    <div className="text-sm text-purple-300">TEC Sections</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white/10 border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="text-sm">Total Curricula</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{curriculumLibrary.length}</div>
                  <p className="text-xs text-green-200">Across all grades</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="text-sm">Compliance Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-300">98%</div>
                  <p className="text-xs text-green-200">TEC compliant</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="text-sm">Accommodations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-300">6</div>
                  <p className="text-xs text-purple-200">Types supported</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="text-sm">Generated Today</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-300">
                    {curriculumLibrary.filter(c => c.createdDate === new Date().toISOString().split('T')[0]).length}
                  </div>
                  <p className="text-xs text-blue-200">New curricula</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}