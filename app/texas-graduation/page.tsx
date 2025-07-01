'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle, Clock, AlertTriangle, Award, BookOpen, Users, Star, GraduationCap, FileText, Home } from 'lucide-react'
import Link from 'next/link'

export default function TexasGraduationTracker() {
  const [selectedStudent, setSelectedStudent] = useState('student1')

  // Texas graduation requirements (26 credits minimum)
  const texasRequirements = {
    totalCredits: 26,
    categories: {
      english: { 
        required: 4, 
        earned: 3.5, 
        courses: [
          { name: 'English I', credits: 1, completed: true, staar: true, grade: 'A' },
          { name: 'English II', credits: 1, completed: true, staar: true, grade: 'A-' },
          { name: 'English III', credits: 1, completed: true, grade: 'B+' },
          { name: 'Speech & Drama', credits: 0.5, completed: true, grade: 'A', stagePrep: true },
          { name: 'English IV', credits: 1, completed: false, planned: 'Spring 2025' }
        ]
      },
      mathematics: { 
        required: 4, 
        earned: 4, 
        courses: [
          { name: 'Algebra I', credits: 1, completed: true, staar: true, grade: 'B+' },
          { name: 'Geometry', credits: 1, completed: true, grade: 'A-' },
          { name: 'Algebra II', credits: 1, completed: true, grade: 'B' },
          { name: 'Pre-Calculus', credits: 1, completed: true, grade: 'B+' }
        ]
      },
      science: { 
        required: 4, 
        earned: 3.5, 
        courses: [
          { name: 'Biology', credits: 1, completed: true, staar: true, grade: 'A' },
          { name: 'Chemistry', credits: 1, completed: true, grade: 'B+' },
          { name: 'Physics', credits: 1, completed: true, grade: 'A-' },
          { name: 'Environmental Science', credits: 0.5, completed: true, grade: 'A' },
          { name: 'Advanced Science Elective', credits: 0.5, completed: false, planned: 'Spring 2025' }
        ]
      },
      socialStudies: { 
        required: 4, 
        earned: 3.5, 
        courses: [
          { name: 'World Geography', credits: 1, completed: true, grade: 'A-' },
          { name: 'World History', credits: 1, completed: true, grade: 'B+' },
          { name: 'US History', credits: 1, completed: true, staar: true, grade: 'A' },
          { name: 'Government', credits: 0.5, completed: true, grade: 'A' },
          { name: 'Economics', credits: 0.5, completed: false, planned: 'Spring 2025' }
        ]
      },
      worldLanguages: { 
        required: 2, 
        earned: 2, 
        courses: [
          { name: 'Spanish I', credits: 1, completed: true, grade: 'A-' },
          { name: 'Spanish II', credits: 1, completed: true, grade: 'B+' }
        ]
      },
      fineArts: { 
        required: 1, 
        earned: 3, 
        courses: [
          { name: 'Theater Arts I', credits: 1, completed: true, grade: 'A', stagePrep: true },
          { name: 'Advanced Theater Performance', credits: 1, completed: true, grade: 'A', stagePrep: true },
          { name: 'Stage Management', credits: 1, completed: true, grade: 'A-', stagePrep: true }
        ]
      },
      physicalEducation: { 
        required: 1.5, 
        earned: 1.5, 
        courses: [
          { name: 'PE/Health', credits: 1, completed: true, grade: 'A' },
          { name: 'Athletic Training', credits: 0.5, completed: true, grade: 'A-' }
        ]
      },
      technology: { 
        required: 1, 
        earned: 1, 
        courses: [
          { name: 'Digital Media Arts', credits: 1, completed: true, grade: 'A', stagePrep: true }
        ]
      },
      careerPrep: { 
        required: 1, 
        earned: 1, 
        courses: [
          { name: 'Career Investigation', credits: 1, completed: true, grade: 'A-' }
        ]
      },
      electives: { 
        required: 3.5, 
        earned: 4.5, 
        courses: [
          { name: 'Creative Writing', credits: 1, completed: true, grade: 'A', stagePrep: true },
          { name: 'Psychology', credits: 1, completed: true, grade: 'B+' },
          { name: 'Voice & Diction', credits: 0.5, completed: true, grade: 'A', stagePrep: true },
          { name: 'Character Development', credits: 0.5, completed: true, grade: 'A-', stagePrep: true },
          { name: 'Portfolio Development', credits: 1, completed: true, grade: 'A', stagePrep: true },
          { name: 'Advanced Elective', credits: 0.5, completed: false, planned: 'Spring 2025' }
        ]
      }
    }
  }

  // STAAR Testing Requirements
  const staarRequirements = {
    required: ['English I', 'English II', 'Algebra I', 'Biology', 'US History'],
    completed: ['English I', 'English II', 'Algebra I', 'Biology'],
    scores: {
      'English I': { score: 'Meets Grade Level', scaled: 4015, level: 3 },
      'English II': { score: 'Masters Grade Level', scaled: 4237, level: 4 },
      'Algebra I': { score: 'Meets Grade Level', scaled: 3801, level: 3 },
      'Biology': { score: 'Masters Grade Level', scaled: 4156, level: 4 },
      'US History': { score: 'Pending', scaled: null, level: null }
    }
  }

  // CCMR (College, Career, Military Readiness) Indicators
  const ccmrIndicators = {
    required: 1,
    achieved: [
      'AP Theater Arts - Score: 4',
      'Industry Certification: Stage Management Professional'
    ],
    available: [
      'SAT score of 1210+ (Evidence-Based Reading/Writing: 480+, Math: 530+)',
      'ACT score of 23+ (English: 19+, Math: 22+)',
      'AP exam score of 3 or higher',
      'Dual enrollment credit (3+ hours)',
      'Industry certification',
      'Military readiness indicator'
    ]
  }

  // Stage Prep Graduation Plan Templates
  const graduationPlans = {
    performance: {
      name: 'Performance Track',
      description: 'Acting, voice, and stage performance specialization',
      fourYearPlan: {
        grade9: [
          'English I (STAAR)',
          'Algebra I (STAAR)', 
          'Biology (STAAR)',
          'World Geography',
          'Theater Arts I',
          'Spanish I',
          'PE/Health'
        ],
        grade10: [
          'English II (STAAR)',
          'Geometry',
          'Chemistry', 
          'World History',
          'Advanced Theater Performance',
          'Spanish II',
          'Voice & Diction'
        ],
        grade11: [
          'English III',
          'Algebra II',
          'Physics',
          'US History (STAAR)',
          'Stage Management',
          'Character Development',
          'Digital Media Arts'
        ],
        grade12: [
          'Speech & Drama',
          'Pre-Calculus',
          'Environmental Science',
          'Government/Economics',
          'Theater Capstone Project',
          'Career Investigation',
          'Portfolio Development'
        ]
      }
    },
    technical: {
      name: 'Technical Theater Track',
      description: 'Behind-the-scenes production and design focus',
      fourYearPlan: {
        grade9: [
          'English I (STAAR)',
          'Algebra I (STAAR)',
          'Biology (STAAR)', 
          'World Geography',
          'Theater Arts I',
          'Spanish I',
          'PE/Health'
        ],
        grade10: [
          'English II (STAAR)',
          'Geometry',
          'Chemistry',
          'World History', 
          'Stage Craft',
          'Spanish II',
          'Digital Media Arts'
        ],
        grade11: [
          'English III',
          'Algebra II',
          'Physics',
          'US History (STAAR)',
          'Lighting & Sound Design',
          'Set Construction',
          'Career Investigation'
        ],
        grade12: [
          'Speech & Drama',
          'Pre-Calculus',
          'Environmental Science',
          'Government/Economics',
          'Production Management',
          'Technical Portfolio',
          'Industry Certification Prep'
        ]
      }
    },
    writing: {
      name: 'Dramatic Writing Track', 
      description: 'Playwriting and theatrical storytelling emphasis',
      fourYearPlan: {
        grade9: [
          'English I (STAAR)',
          'Algebra I (STAAR)',
          'Biology (STAAR)',
          'World Geography',
          'Theater Arts I',
          'Spanish I',
          'PE/Health'
        ],
        grade10: [
          'English II (STAAR)',
          'Geometry',
          'Chemistry',
          'World History',
          'Creative Writing',
          'Spanish II', 
          'Digital Media Arts'
        ],
        grade11: [
          'English III',
          'Algebra II',
          'Physics',
          'US History (STAAR)',
          'Playwriting I',
          'Dramatic Literature',
          'Career Investigation'
        ],
        grade12: [
          'Speech & Drama',
          'Pre-Calculus',
          'Environmental Science',
          'Government/Economics',
          'Advanced Playwriting',
          'Script Analysis',
          'Writing Portfolio'
        ]
      }
    }
  }

  const mockStudents = [
    {
      id: 'student1',
      name: 'Maya Rodriguez',
      grade: 11,
      studentId: 'SR2025-001',
      pathway: 'performance',
      gpa: 3.7,
      classRank: 15,
      classSize: 120,
      creditsEarned: 24.5,
      graduationStatus: 'On Track',
      graduationDate: 'May 24, 2026',
      endorsement: 'Arts & Humanities'
    },
    {
      id: 'student2', 
      name: 'Jordan Kim',
      grade: 10,
      studentId: 'SR2026-045',
      pathway: 'technical',
      gpa: 3.9,
      classRank: 8,
      classSize: 115,
      creditsEarned: 13.5,
      graduationStatus: 'On Track',
      graduationDate: 'May 22, 2027',
      endorsement: 'Arts & Humanities'
    },
    {
      id: 'student3',
      name: 'Alex Thompson',
      grade: 12,
      studentId: 'SR2024-023', 
      pathway: 'writing',
      gpa: 3.8,
      classRank: 12,
      classSize: 108,
      creditsEarned: 25.5,
      graduationStatus: 'Ready to Graduate',
      graduationDate: 'May 25, 2025',
      endorsement: 'Arts & Humanities'
    }
  ]

  const selectedStudentData = mockStudents.find(s => s.id === selectedStudent) || mockStudents[0]
  const totalEarned = Object.values(texasRequirements.categories).reduce((sum, cat) => sum + cat.earned, 0)
  const progressPercentage = (totalEarned / texasRequirements.totalCredits) * 100
  const staarComplete = staarRequirements.completed.length === staarRequirements.required.length
  const stageCredits = Object.values(texasRequirements.categories)
    .flatMap(cat => cat.courses)
    .filter(course => course.stagePrep && course.completed).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Link href="/schools/secondary-school">
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Home className="h-4 w-4 mr-2" />
                Back to Secondary School
              </Button>
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Texas Stage Prep Graduation Tracker
          </h1>
          <p className="text-blue-200 text-lg">
            Foundation High School Program + Arts & Humanities Endorsement
          </p>
          <p className="text-purple-200 text-md font-medium">
            Block Schedule: 4 Year-Long Courses per Semester | 8 Classes Annually
          </p>
          <div className="mt-4 flex justify-center gap-4 flex-wrap">
            <Badge className="bg-yellow-600/20 text-yellow-300 px-4 py-2">
              TEA Compliant
            </Badge>
            <Badge className="bg-green-600/20 text-green-300 px-4 py-2">
              26 Credit Program
            </Badge>
            <Badge className="bg-orange-600/20 text-orange-300 px-4 py-2">
              Block Schedule: 4×4
            </Badge>
            <Badge className="bg-purple-600/20 text-purple-300 px-4 py-2">
              Distinguished Achievement
            </Badge>
            <Badge className="bg-blue-600/20 text-blue-300 px-4 py-2">
              CCMR Ready
            </Badge>
          </div>
        </div>

        {/* Student Selector */}
        <div className="flex gap-4 mb-6 justify-center flex-wrap">
          {mockStudents.map(student => (
            <Button
              key={student.id}
              variant={selectedStudent === student.id ? "default" : "outline"}
              onClick={() => setSelectedStudent(student.id)}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              {student.name} - Grade {student.grade}
            </Button>
          ))}
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white/10 border-white/20">
            <TabsTrigger value="overview" className="text-white">Overview</TabsTrigger>
            <TabsTrigger value="credits" className="text-white">Credits</TabsTrigger>
            <TabsTrigger value="testing" className="text-white">STAAR</TabsTrigger>
            <TabsTrigger value="ccmr" className="text-white">CCMR</TabsTrigger>
            <TabsTrigger value="pathways" className="text-white">Stage Paths</TabsTrigger>
            <TabsTrigger value="planning" className="text-white">4-Year Plans</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Student Profile */}
              <Card className="bg-white/10 border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Student Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Name:</span>
                    <span className="font-medium">{selectedStudentData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Student ID:</span>
                    <span>{selectedStudentData.studentId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Grade:</span>
                    <span>{selectedStudentData.grade}th</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Stage Track:</span>
                    <span className="text-purple-300">{graduationPlans[selectedStudentData.pathway].name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GPA:</span>
                    <Badge className="bg-green-600/20 text-green-300">{selectedStudentData.gpa}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Class Rank:</span>
                    <span>{selectedStudentData.classRank} of {selectedStudentData.classSize}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Credit Progress */}
              <Card className="bg-white/10 border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Credit Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400">
                      {totalEarned} / 26
                    </div>
                    <p className="text-sm text-blue-200">Credits Earned</p>
                  </div>
                  <Progress value={progressPercentage} className="h-3" />
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Progress:</span>
                      <span>{Math.round(progressPercentage)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Stage Credits:</span>
                      <span className="text-purple-300">{stageCredits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Remaining:</span>
                      <span>{Math.max(0, texasRequirements.totalCredits - totalEarned)} credits</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Texas Requirements */}
              <Card className="bg-white/10 border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Texas Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span>Foundation Program:</span>
                    <Badge className="bg-green-600/20 text-green-300">Complete</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>STAAR Tests:</span>
                    <Badge className={staarComplete ? "bg-green-600/20 text-green-300" : "bg-yellow-600/20 text-yellow-300"}>
                      {staarRequirements.completed.length}/5
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>CCMR Indicator:</span>
                    <Badge className="bg-green-600/20 text-green-300">Met (2)</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Endorsement:</span>
                    <Badge className="bg-purple-600/20 text-purple-300">Arts & Humanities</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Distinguished:</span>
                    <Badge className="bg-blue-600/20 text-blue-300">Eligible</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Graduation Status */}
              <Card className="bg-white/10 border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Graduation Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="text-center">
                    <Badge className="bg-green-600/20 text-green-300 text-lg px-4 py-2">
                      {selectedStudentData.graduationStatus}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Expected Graduation:</span>
                      <span className="font-medium">{selectedStudentData.graduationDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Diploma Type:</span>
                      <span className="text-yellow-300">Distinguished</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Endorsement:</span>
                      <span className="text-purple-300">Arts & Humanities</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Credits Tab */}
          <TabsContent value="credits" className="space-y-6">
            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle>Texas Foundation High School Program - Credit Requirements</CardTitle>
                <CardDescription className="text-blue-200">
                  Minimum 26 credits required for graduation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {Object.entries(texasRequirements.categories).map(([category, data]) => {
                    const isComplete = data.earned >= data.required
                    const progressPerc = (data.earned / data.required) * 100

                    return (
                      <Card key={category} className="bg-white/5 border-white/10">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-sm capitalize text-white">
                              {category.replace(/([A-Z])/g, ' $1').trim()}
                            </CardTitle>
                            <Badge 
                              className={isComplete ? "bg-green-600/20 text-green-300" : "bg-orange-600/20 text-orange-300"}
                            >
                              {data.earned} / {data.required} credits
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <Progress value={Math.min(progressPerc, 100)} className="h-2 mb-3" />
                          <div className="space-y-1">
                            {data.courses.map((course, idx) => (
                              <div key={idx} className="flex items-center justify-between p-2 bg-white/5 rounded text-xs">
                                <div className="flex items-center gap-2">
                                  {course.completed ? (
                                    <CheckCircle className="h-3 w-3 text-green-400" />
                                  ) : (
                                    <Clock className="h-3 w-3 text-yellow-400" />
                                  )}
                                  <span className={`${course.completed ? "text-white" : "text-blue-300"} ${course.stagePrep ? "font-medium text-purple-300" : ""}`}>
                                    {course.name}
                                    {course.staar && " (STAAR)"}
                                    {course.stagePrep && " (Stage)"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-blue-200">{course.credits} cr</span>
                                  {course.completed && (
                                    <Badge variant="secondary" className="bg-green-600/20 text-green-300 text-xs">
                                      {course.grade}
                                    </Badge>
                                  )}
                                  {!course.completed && course.planned && (
                                    <span className="text-yellow-300 text-xs">{course.planned}</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* STAAR Testing Tab */}
          <TabsContent value="testing" className="space-y-6">
            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle>STAAR End-of-Course (EOC) Assessments</CardTitle>
                <CardDescription className="text-blue-200">
                  Required for Texas high school graduation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {staarRequirements.required.map(test => {
                  const completed = staarRequirements.completed.includes(test)
                  const score = staarRequirements.scores[test]
                  
                  return (
                    <div key={test} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        {completed ? (
                          <CheckCircle className="h-6 w-6 text-green-400" />
                        ) : (
                          <Clock className="h-6 w-6 text-yellow-400" />
                        )}
                        <div>
                          <div className="font-medium">{test} STAAR EOC</div>
                          {completed && (
                            <div className="text-sm text-blue-200">
                              Scale Score: {score.scaled} | Performance Level: {score.level}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        {completed ? (
                          <Badge className={`${
                            score.level >= 3 ? 'bg-green-600/20 text-green-300' : 'bg-yellow-600/20 text-yellow-300'
                          }`}>
                            {score.score}
                          </Badge>
                        ) : (
                          <Badge className="bg-orange-600/20 text-orange-300">
                            Scheduled Spring 2025
                          </Badge>
                        )}
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </TabsContent>

          {/* CCMR Tab */}
          <TabsContent value="ccmr" className="space-y-6">
            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle>College, Career, and Military Readiness (CCMR)</CardTitle>
                <CardDescription className="text-blue-200">
                  Must demonstrate readiness in at least one indicator
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-green-300 mb-4">Achieved Indicators</h4>
                    <div className="space-y-3">
                      {ccmrIndicators.achieved.map((indicator, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-green-600/10 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-400" />
                          <span className="text-green-300">{indicator}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-300 mb-4">Available Indicators</h4>
                    <div className="space-y-2">
                      {ccmrIndicators.available.map((option, idx) => (
                        <div key={idx} className="text-sm text-blue-200 flex items-center gap-2 p-2 bg-white/5 rounded">
                          <Star className="h-3 w-3 text-blue-400" />
                          {option}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stage Pathways Tab */}
          <TabsContent value="pathways" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(graduationPlans).map(([key, plan]) => (
                <Card key={key} className="bg-white/10 border-white/20 text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      {plan.name}
                    </CardTitle>
                    <CardDescription className="text-blue-200">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-yellow-300">Sample Senior Year:</h4>
                      <div className="space-y-1">
                        {plan.fourYearPlan.grade12.map((course, idx) => (
                          <div key={idx} className="text-sm flex items-center gap-1 p-2 bg-white/5 rounded">
                            <BookOpen className="h-3 w-3 text-blue-400" />
                            <span className="text-blue-200">
                              {course}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 4-Year Planning Tab */}
          <TabsContent value="planning" className="space-y-6">
            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle>Four-Year Stage Prep Academic Plan - {graduationPlans[selectedStudentData.pathway].name}</CardTitle>
                <CardDescription className="text-blue-200">
                  Block Schedule: 4 Year-Long Courses per Semester | Texas-compliant sequence with theater specialization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Grade 9 */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-yellow-300">Grade 9 (8 classes)</h3>
                    <div className="space-y-3">
                      <div className="bg-blue-600/10 p-3 rounded-lg">
                        <h4 className="font-semibold text-blue-300 mb-2">Fall Semester (4 courses)</h4>
                        <div className="space-y-1">
                          {graduationPlans[selectedStudentData.pathway].fourYearPlan.grade9.slice(0, 4).map((course, idx) => (
                            <div key={idx} className="p-2 bg-white/5 rounded text-sm">
                              {course}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-purple-600/10 p-3 rounded-lg">
                        <h4 className="font-semibold text-purple-300 mb-2">Spring Semester (4 courses)</h4>
                        <div className="space-y-1">
                          {graduationPlans[selectedStudentData.pathway].fourYearPlan.grade9.slice(4).map((course, idx) => (
                            <div key={idx} className="p-2 bg-white/5 rounded text-sm">
                              {course}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Grade 10 */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-yellow-300">Grade 10 (8 classes)</h3>
                    <div className="space-y-3">
                      <div className="bg-blue-600/10 p-3 rounded-lg">
                        <h4 className="font-semibold text-blue-300 mb-2">Fall Semester (4 courses)</h4>
                        <div className="space-y-1">
                          {graduationPlans[selectedStudentData.pathway].fourYearPlan.grade10.slice(0, 4).map((course, idx) => (
                            <div key={idx} className="p-2 bg-white/5 rounded text-sm">
                              {course}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-purple-600/10 p-3 rounded-lg">
                        <h4 className="font-semibold text-purple-300 mb-2">Spring Semester (4 courses)</h4>
                        <div className="space-y-1">
                          {graduationPlans[selectedStudentData.pathway].fourYearPlan.grade10.slice(4).map((course, idx) => (
                            <div key={idx} className="p-2 bg-white/5 rounded text-sm">
                              {course}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Grade 11 */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-yellow-300">Grade 11 (8 classes)</h3>
                    <div className="space-y-3">
                      <div className="bg-blue-600/10 p-3 rounded-lg">
                        <h4 className="font-semibold text-blue-300 mb-2">Fall Semester (4 courses)</h4>
                        <div className="space-y-1">
                          {graduationPlans[selectedStudentData.pathway].fourYearPlan.grade11.slice(0, 4).map((course, idx) => (
                            <div key={idx} className="p-2 bg-white/5 rounded text-sm">
                              {course}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-purple-600/10 p-3 rounded-lg">
                        <h4 className="font-semibold text-purple-300 mb-2">Spring Semester (4 courses)</h4>
                        <div className="space-y-1">
                          {graduationPlans[selectedStudentData.pathway].fourYearPlan.grade11.slice(4).map((course, idx) => (
                            <div key={idx} className="p-2 bg-white/5 rounded text-sm">
                              {course}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Grade 12 */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-yellow-300">Grade 12 (8 classes)</h3>
                    <div className="space-y-3">
                      <div className="bg-blue-600/10 p-3 rounded-lg">
                        <h4 className="font-semibold text-blue-300 mb-2">Fall Semester (4 courses)</h4>
                        <div className="space-y-1">
                          {graduationPlans[selectedStudentData.pathway].fourYearPlan.grade12.slice(0, 4).map((course, idx) => (
                            <div key={idx} className="p-2 bg-white/5 rounded text-sm">
                              {course}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-purple-600/10 p-3 rounded-lg">
                        <h4 className="font-semibold text-purple-300 mb-2">Spring Semester (4 courses)</h4>
                        <div className="space-y-1">
                          {graduationPlans[selectedStudentData.pathway].fourYearPlan.grade12.slice(4).map((course, idx) => (
                            <div key={idx} className="p-2 bg-white/5 rounded text-sm">
                              {course}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-6">
                  {/* Block Schedule Explanation */}
                  <div className="p-4 bg-orange-600/10 rounded-lg border border-orange-600/20">
                    <h4 className="font-bold text-orange-300 mb-4 text-center">Block Schedule System</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                      <div className="space-y-2">
                        <h5 className="font-semibold text-blue-300">Schedule Structure:</h5>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-blue-400" />
                            <span>4 courses per semester</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-blue-400" />
                            <span>Each course is year-long</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4 text-blue-400" />
                            <span>8 total classes per year</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-blue-400" />
                            <span>32 total courses in 4 years</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h5 className="font-semibold text-purple-300">Benefits:</h5>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <span>Deeper learning in fewer subjects</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <span>Better for neurodivergent students</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <span>Extended project time</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <span>Reduced daily transitions</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Texas Requirements Summary */}
                  <div className="p-4 bg-green-600/10 rounded-lg border border-green-600/20">
                    <h4 className="font-bold text-green-300 mb-4 text-center">Texas Graduation Requirements Summary</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                      <div className="space-y-2">
                        <h5 className="font-semibold text-yellow-300">Foundation Requirements:</h5>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <span>26 credits minimum</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <span>5 STAAR EOC exams</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <span>CCMR indicator met</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h5 className="font-semibold text-purple-300">Endorsement Requirements:</h5>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <span>Arts & Humanities pathway</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <span>4+ specialized credits</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <span>Theater portfolio</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h5 className="font-semibold text-blue-300">Distinguished Achievement:</h5>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <span>Algebra II completed</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <span>4+ advanced measures</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <span>CCMR performance standard</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}