'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Theater, GraduationCap, Star, Trophy, Users, Calendar, Award, BookOpen } from 'lucide-react'

export default function SecondarySchoolPage() {
  const [selectedGrade, setSelectedGrade] = useState('9')

  const gradePrograms = {
    '7': {
      name: 'Seventh Grade Apprentices',
      description: 'Introduction to theater arts and academic foundations',
      courses: ['Theater Basics', 'English I', 'Algebra I', 'World Geography', 'Life Science']
    },
    '8': {
      name: 'Eighth Grade Performers',
      description: 'Building performance skills and academic rigor',
      courses: ['Acting I', 'English II', 'Geometry', 'World History', 'Physical Science']
    },
    '9': {
      name: 'Freshman Actors',
      description: 'High school foundation with theater specialization',
      courses: ['Theater Arts I', 'English III', 'Algebra II', 'Biology', 'US History']
    },
    '10': {
      name: 'Sophomore Directors',
      description: 'Advanced theater techniques and college prep',
      courses: ['Technical Theater', 'English IV', 'Pre-Calculus', 'Chemistry', 'Government']
    },
    '11': {
      name: 'Junior Producers',
      description: 'Leadership roles and advanced academics',
      courses: ['Advanced Acting', 'AP Literature', 'Statistics', 'Physics', 'Economics']
    },
    '12': {
      name: 'Senior Artists',
      description: 'Capstone experiences and college/career preparation',
      courses: ['Theater Capstone', 'Dual Credit English', 'Calculus', 'Environmental Science', 'Psychology']
    }
  }

  const theatricalPathways = [
    {
      name: 'Performance Track',
      icon: <Theater className="h-6 w-6" />,
      description: 'Acting, singing, dancing, and stage presence',
      skills: ['Method Acting', 'Voice Projection', 'Movement & Dance', 'Character Development']
    },
    {
      name: 'Technical Track',
      icon: <Star className="h-6 w-6" />,
      description: 'Behind-the-scenes theater production',
      skills: ['Set Design', 'Lighting & Sound', 'Costume Design', 'Stage Management']
    },
    {
      name: 'Creative Track',
      icon: <BookOpen className="h-6 w-6" />,
      description: 'Writing, directing, and creative leadership',
      skills: ['Playwriting', 'Directing', 'Creative Writing', 'Production Management']
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-red-50 to-gold-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-800 via-red-700 to-gold-600 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-red-900/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-4 mb-6">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center overflow-hidden">
                <img 
                  src="/logo-main.jpeg" 
                  alt="Universal One School Logo" 
                  className="w-16 h-16 object-contain"
                />
              </div>
              <Theater className="h-16 w-16 text-gold-300" />
              <Star className="h-12 w-12 text-purple-300" />
              <Trophy className="h-14 w-14 text-red-300" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Stage Prep School
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Grades 7-12 • Where Theater Arts Meets Academic Excellence
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <Users className="h-4 w-4 mr-2" />
                189 Student Artists
              </Badge>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <GraduationCap className="h-4 w-4 mr-2" />
                College & Career Ready
              </Badge>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <Award className="h-4 w-4 mr-2" />
                State Theater Champions
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        {/* Grade Level Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Select Your Performance Level</CardTitle>
            <CardDescription className="text-center">
              Progressive theater arts education from middle school through graduation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {Object.entries(gradePrograms).map(([grade, program]) => (
                <Button
                  key={grade}
                  variant={selectedGrade === grade ? 'default' : 'outline'}
                  onClick={() => setSelectedGrade(grade)}
                  className="h-20 flex flex-col"
                >
                  <span className="font-bold text-lg">{grade}</span>
                  <span className="text-xs">Grade</span>
                  <span className="text-xs font-normal">
                    {grade === '7' || grade === '8' ? 'Middle' : 'High'}
                  </span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Selected Grade Program */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Theater className="h-6 w-6 text-purple-600" />
              <span>{gradePrograms[selectedGrade as keyof typeof gradePrograms].name}</span>
            </CardTitle>
            <CardDescription>
              {gradePrograms[selectedGrade as keyof typeof gradePrograms].description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
              {gradePrograms[selectedGrade as keyof typeof gradePrograms].courses.map((course, index) => (
                <Card key={course} className="border-2 border-dashed border-gray-200 hover:border-purple-400 transition-colors">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-red-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-sm">{course}</h3>
                    <Progress value={80 + index * 3} className="mt-2 h-2" />
                    <p className="text-xs text-gray-600 mt-1">
                      {index < 2 ? 'Core Theater' : 'Academic'}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Theater Pathways */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-6 w-6 text-gold-600" />
              <span>Theatrical Career Pathways</span>
            </CardTitle>
            <CardDescription>
              Specialized tracks preparing students for college and professional theater careers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {theatricalPathways.map((pathway) => (
                <Card key={pathway.name} className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center space-x-2 text-lg">
                      {pathway.icon}
                      <span>{pathway.name}</span>
                    </CardTitle>
                    <CardDescription>{pathway.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {pathway.skills.map((skill) => (
                        <li key={skill} className="flex items-center space-x-2 text-sm">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span>{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Features Tabs */}
        <Tabs defaultValue="academics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="academics">Academics</TabsTrigger>
            <TabsTrigger value="theater">Theater Program</TabsTrigger>
            <TabsTrigger value="college">College Prep</TabsTrigger>
            <TabsTrigger value="productions">Productions</TabsTrigger>
          </TabsList>

          <TabsContent value="academics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Rigorous Academic Foundation</CardTitle>
                <CardDescription>
                  Texas-aligned curriculum meeting all graduation requirements while integrating arts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Core Academics</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• 4×4 Block Scheduling for depth</li>
                      <li>• Texas Essential Knowledge & Skills (TEKS)</li>
                      <li>• Advanced Placement (AP) courses</li>
                      <li>• Dual Credit partnerships</li>
                      <li>• STAAR preparation integrated</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Arts Integration</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Literature through dramatic interpretation</li>
                      <li>• History via historical theater</li>
                      <li>• Math through technical theater</li>
                      <li>• Science in stage technology</li>
                      <li>• Language arts in script analysis</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="theater" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Professional Theater Training</CardTitle>
                <CardDescription>
                  Comprehensive theater arts education from fundamentals to professional techniques
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Performance Skills</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Voice and diction training</li>
                        <li>• Movement and stage combat</li>
                        <li>• Character development</li>
                        <li>• Improvisation techniques</li>
                        <li>• Musical theater basics</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Technical Theater</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Set design and construction</li>
                        <li>• Lighting design and operation</li>
                        <li>• Sound engineering</li>
                        <li>• Costume design and creation</li>
                        <li>• Stage management</li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">State-of-the-Art Facilities</h4>
                    <p className="text-sm text-gray-700">
                      Professional 400-seat theater, black box studio, scene shop, costume studio, 
                      digital lighting and sound boards, and rehearsal spaces.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="college" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>College & Career Preparation</CardTitle>
                <CardDescription>
                  Comprehensive preparation for higher education and professional theater careers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Academic Preparation</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Texas Foundation Graduation Plan + Arts Endorsement</li>
                      <li>• 26+ graduation credits required</li>
                      <li>• College-level coursework opportunities</li>
                      <li>• SAT/ACT preparation</li>
                      <li>• College application guidance</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Theater Career Prep</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Professional portfolio development</li>
                      <li>• College audition preparation</li>
                      <li>• Industry internship opportunities</li>
                      <li>• Guest artist masterclasses</li>
                      <li>• Theater festival participation</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-gold-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Success Metrics</h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-purple-600">98%</div>
                      <div className="text-sm">Graduation Rate</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-600">85%</div>
                      <div className="text-sm">College Enrollment</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gold-600">92%</div>
                      <div className="text-sm">Arts Program Continuation</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="productions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Annual Productions & Performances</CardTitle>
                <CardDescription>
                  Multiple performance opportunities throughout the year showcasing student talent
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="border-l-4 border-l-purple-600">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Fall Drama</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-2">Classic and contemporary plays</p>
                        <Badge variant="outline">October Performance</Badge>
                      </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-red-600">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Spring Musical</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-2">Full-scale musical productions</p>
                        <Badge variant="outline">March Performance</Badge>
                      </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-gold-600">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">One-Act Competition</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-2">UIL state competition preparation</p>
                        <Badge variant="outline">January-April</Badge>
                      </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-green-600">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Student Showcases</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-2">Monthly performance opportunities</p>
                        <Badge variant="outline">Year-Round</Badge>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="bg-gradient-to-r from-purple-100 to-red-100 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Recent Achievements</h4>
                    <ul className="text-sm space-y-1">
                      <li>• UIL State One-Act Play Finalists (2024)</li>
                      <li>• Texas Theater Education Association Excellence Award</li>
                      <li>• Multiple students accepted to top BFA programs</li>
                      <li>• Regional theater festival champions</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Student Access Portal */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Student Performance Portal</CardTitle>
            <CardDescription className="text-center">
              Access your theatrical and academic learning dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="border-2 border-purple-400 hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Student Dashboard</h3>
                  <p className="text-sm text-gray-600 mb-4">Track courses, grades, and theater productions</p>
                  <Button className="w-full" onClick={() => window.location.href = '/dashboard'}>
                    Enter Dashboard
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-red-400 hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">AI Drama Coach</h3>
                  <p className="text-sm text-gray-600 mb-4">Get guidance from Dean Sterling, your AI theater tutor</p>
                  <Button className="w-full border-2 border-purple-400 text-slate-900 hover:bg-purple-50" variant="outline" onClick={() => window.location.href = '/dashboard'}>
                    🎭 Chat with Dean Sterling
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-amber-400 hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-amber-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <GraduationCap className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Graduation Tracker</h3>
                  <p className="text-sm text-gray-600 mb-4">Monitor your path to graduation and college readiness</p>
                  <Button className="w-full border-2 border-amber-400 text-slate-900 hover:bg-yellow-50" variant="outline" onClick={() => window.location.href = '/dashboard'}>
                    🎓 Check Progress
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Quick Academic Tools */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-purple-600" />
              <span>Academic & Theater Tools</span>
            </CardTitle>
            <CardDescription>Direct access to your learning and performance resources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex flex-col border-2 border-purple-300 text-slate-900 hover:bg-purple-50" onClick={() => window.location.href = '/dashboard'}>
                <BookOpen className="h-6 w-6 mb-2 text-purple-600" />
                <span className="text-sm">📚 My Classes</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col border-2 border-red-300 text-slate-900 hover:bg-red-50" onClick={() => window.location.href = '/dashboard'}>
                <Calendar className="h-6 w-6 mb-2 text-red-600" />
                <span className="text-sm">🎭 Rehearsal Schedule</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col" onClick={() => window.location.href = '/portfolio'}>
                <Award className="h-6 w-6 mb-2 text-amber-600" />
                <span className="text-sm">Performance Portfolio</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col" onClick={() => window.location.href = '/college-prep'}>
                <GraduationCap className="h-6 w-6 mb-2 text-blue-600" />
                <span className="text-sm">College Prep</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Enrollment CTA */}
        <Card className="bg-gradient-to-r from-purple-800 to-red-700 text-white">
          <CardContent className="text-center py-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Take Center Stage?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join Stage Prep School where academic excellence meets theatrical passion
            </p>
            <div className="space-x-4">
              <Button size="lg" variant="secondary" onClick={() => window.location.href = '/register'}>
                Schedule Audition
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-purple-800" onClick={() => window.location.href = '/apply'}>
                Apply Today
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}