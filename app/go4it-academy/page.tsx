'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  GraduationCap, 
  Users, 
  BarChart3, 
  Shield, 
  Target, 
  Award, 
  BookOpen, 
  ChevronRight,
  Star,
  MapPin,
  Calendar,
  TrendingUp,
  Zap,
  Brain,
  Eye,
  CheckCircle2,
  Building2,
  Bed,
  Stethoscope,
  Waves,
  Globe
} from 'lucide-react';
import Image from 'next/image';

export default function Go4itAcademyPage() {
  const [selectedMarket, setSelectedMarket] = useState<'university' | 'high-school'>('university');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-black">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-800/30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center space-y-8">
            <div className="space-y-6">
              {/* Go4it Logo */}
              <div className="flex justify-center mb-6">
                <div className="relative w-32 h-32 md:w-40 md:h-40">
                  <Image
                    src="/go4it-logo.jpg"
                    alt="Go4it Sports Academy Logo"
                    fill
                    sizes="(max-width: 768px) 128px, 160px"
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
              
              <Badge className="bg-blue-600/30 text-blue-200 border-blue-400/50 px-6 py-2 text-lg">
                Texas Charter School Component
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-300 via-white to-blue-300 bg-clip-text text-transparent">
                Go4it Sports Academy
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
                Revolutionary AI-Powered Educational Platform for Student-Athletes with NCAA Compliance & Multi-Market Integration
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-8 py-3 shadow-lg shadow-blue-500/25"
                onClick={() => document.getElementById('enrollment')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Student Enrollment <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-blue-400 text-blue-200 hover:bg-blue-400/10 bg-white/5 backdrop-blur-sm px-8 py-3"
                onClick={() => document.getElementById('parent-portal')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Parent Portal Access
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10 bg-white/5 backdrop-blur-sm px-8 py-3"
                onClick={() => document.getElementById('schedule')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Smart Schedule & Alerts
              </Button>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-12">
              <div className="text-center space-y-2 p-4 bg-white/10 rounded-lg backdrop-blur-sm border border-blue-400/30">
                <div className="text-3xl font-bold text-blue-300">500+</div>
                <div className="text-sm text-blue-200">Student-Athletes</div>
              </div>
              <div className="text-center space-y-2 p-4 bg-white/10 rounded-lg backdrop-blur-sm border border-blue-400/30">
                <div className="text-3xl font-bold text-white">45+</div>
                <div className="text-sm text-blue-200">Institutions</div>
              </div>
              <div className="text-center space-y-2 p-4 bg-white/10 rounded-lg backdrop-blur-sm border border-blue-400/30">
                <div className="text-3xl font-bold text-blue-300">100%</div>
                <div className="text-sm text-blue-200">NCAA Compliance</div>
              </div>
              <div className="text-center space-y-2 p-4 bg-white/10 rounded-lg backdrop-blur-sm border border-blue-400/30">
                <div className="text-3xl font-bold text-white">97.2%</div>
                <div className="text-sm text-blue-200">AI Accuracy</div>
              </div>
            </div>

            {/* Revolutionary Technology Features */}
            <div className="mt-12 space-y-6">
              <h3 className="text-2xl font-bold text-white mb-6">Revolutionary Technology Features</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 px-6 py-4 h-auto flex-col gap-2"
                  onClick={() => window.location.href = '/holographic-classroom'}
                >
                  <Eye className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-semibold">Holographic Classrooms</div>
                    <div className="text-xs opacity-90">Virtual-Physical Learning Pods</div>
                  </div>
                </Button>
                
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-4 h-auto flex-col gap-2"
                  onClick={() => window.location.href = '/ai-athletic-advisor'}
                >
                  <Brain className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-semibold">AI Athletic Advisor</div>
                    <div className="text-xs opacity-90">Biometric Performance Optimization</div>
                  </div>
                </Button>
                
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 px-6 py-4 h-auto flex-col gap-2"
                  onClick={() => window.location.href = '/sports-science-lab'}
                >
                  <Stethoscope className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-semibold">Sports Science Lab</div>
                    <div className="text-xs opacity-90">STEM Training Integration</div>
                  </div>
                </Button>
                
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 px-6 py-4 h-auto flex-col gap-2"
                  onClick={() => window.location.href = '/alumni-network'}
                >
                  <Users className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-semibold">Alumni Network</div>
                    <div className="text-xs opacity-90">Career Acceleration Program</div>
                  </div>
                </Button>
              </div>
              
              {/* ROI Metrics */}
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 rounded-lg p-6 mt-8">
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-green-400">95%</div>
                    <div className="text-green-300">Students maintain 3.5+ GPA during sports seasons</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-400">100%</div>
                    <div className="text-blue-300">College acceptance rate with 90% athletic scholarships</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-purple-400">200%</div>
                    <div className="text-purple-300">Expected ROI by year 5 implementation</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Access Dashboard */}
            <div className="mt-12">
              <Button 
                size="lg" 
                className="bg-white text-blue-900 hover:bg-blue-50 px-12 py-4 text-lg font-semibold shadow-xl"
                onClick={() => window.location.href = '/dashboard'}
              >
                Access Student-Athlete Dashboard <Trophy className="ml-2 h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Market Selection */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-white">Choose Your Market</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our platform adapts to serve both university/college and high school environments with specialized features for each market.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card 
              className={`cursor-pointer transition-all duration-300 ${
                selectedMarket === 'university' 
                  ? 'bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-blue-500/50 ring-2 ring-blue-400' 
                  : 'bg-slate-800/50 border-slate-700 hover:border-blue-500/30'
              }`}
              onClick={() => setSelectedMarket('university')}
            >
              <CardHeader className="text-center">
                <GraduationCap className="h-12 w-12 mx-auto text-blue-400 mb-4" />
                <CardTitle className="text-xl text-white">Universities & Colleges</CardTitle>
                <CardDescription>Academic advisor replacement & NCAA compliance management</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span className="text-gray-300">Academic advisor replacement</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span className="text-gray-300">NCAA compliance monitoring</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span className="text-gray-300">Student-athlete management</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span className="text-gray-300">Performance analytics</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className={`cursor-pointer transition-all duration-300 ${
                selectedMarket === 'high-school' 
                  ? 'bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-purple-500/50 ring-2 ring-purple-400' 
                  : 'bg-slate-800/50 border-slate-700 hover:border-purple-500/30'
              }`}
              onClick={() => setSelectedMarket('high-school')}
            >
              <CardHeader className="text-center">
                <BookOpen className="h-12 w-12 mx-auto text-purple-400 mb-4" />
                <CardTitle className="text-xl text-white">High Schools</CardTitle>
                <CardDescription>Teacher integration & parent communication platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span className="text-gray-300">Teacher integration tools</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span className="text-gray-300">Parent communication</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span className="text-gray-300">College preparation</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span className="text-gray-300">Academic tracking</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Interactive Demo Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-white">Interactive Platform Demo</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Experience our platform with role-specific dashboards and real-time features.
            </p>
          </div>

          <Tabs defaultValue="academic-advisor" className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto bg-slate-800 border-slate-700">
              <TabsTrigger value="academic-advisor" className="data-[state=active]:bg-blue-600">
                Academic Advisor
              </TabsTrigger>
              <TabsTrigger value="position-coach" className="data-[state=active]:bg-purple-600">
                Position Coach
              </TabsTrigger>
              <TabsTrigger value="teacher" className="data-[state=active]:bg-cyan-600">
                Teacher
              </TabsTrigger>
            </TabsList>

            <TabsContent value="academic-advisor" className="mt-8">
              <Card className="bg-slate-800/50 border-slate-700 max-w-4xl mx-auto">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-400">
                    <GraduationCap className="h-6 w-6" />
                    Academic Advisor Dashboard
                  </CardTitle>
                  <CardDescription>
                    Comprehensive student-athlete academic management and NCAA compliance monitoring
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-4">
                      <div className="text-2xl font-bold text-blue-400 mb-1">24</div>
                      <div className="text-sm text-gray-400">Active Student-Athletes</div>
                    </div>
                    <div className="bg-green-600/10 border border-green-500/30 rounded-lg p-4">
                      <div className="text-2xl font-bold text-green-400 mb-1">100%</div>
                      <div className="text-sm text-gray-400">NCAA Compliance</div>
                    </div>
                    <div className="bg-purple-600/10 border border-purple-500/30 rounded-lg p-4">
                      <div className="text-2xl font-bold text-purple-400 mb-1">3.4</div>
                      <div className="text-sm text-gray-400">Average GPA</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-white">Recent Alerts</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-yellow-600/10 border border-yellow-500/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                          <span className="text-sm text-gray-300">Marcus Thompson - Grade threshold alert</span>
                        </div>
                        <Badge variant="outline" className="text-yellow-400 border-yellow-400/30">Action Needed</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-600/10 border border-green-500/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-sm text-gray-300">Sarah Johnson - Academic excellence milestone</span>
                        </div>
                        <Badge variant="outline" className="text-green-400 border-green-400/30">Achieved</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="position-coach" className="mt-8">
              <Card className="bg-slate-800/50 border-slate-700 max-w-4xl mx-auto">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-400">
                    <Trophy className="h-6 w-6" />
                    Position Coach Dashboard
                  </CardTitle>
                  <CardDescription>
                    Athletic performance tracking and recruitment management
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-purple-600/10 border border-purple-500/30 rounded-lg p-4">
                      <div className="text-2xl font-bold text-purple-400 mb-1">12</div>
                      <div className="text-sm text-gray-400">Active Recruits</div>
                    </div>
                    <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-lg p-4">
                      <div className="text-2xl font-bold text-cyan-400 mb-1">89%</div>
                      <div className="text-sm text-gray-400">Performance Score</div>
                    </div>
                    <div className="bg-green-600/10 border border-green-500/30 rounded-lg p-4">
                      <div className="text-2xl font-bold text-green-400 mb-1">6</div>
                      <div className="text-sm text-gray-400">Viral Highlights</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-white">Performance Analytics</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-700/50 rounded-lg">
                        <div className="text-sm text-gray-400 mb-2">Speed Improvement</div>
                        <div className="text-2xl font-bold text-purple-400">+15%</div>
                      </div>
                      <div className="p-4 bg-slate-700/50 rounded-lg">
                        <div className="text-sm text-gray-400 mb-2">Technique Score</div>
                        <div className="text-2xl font-bold text-cyan-400">94/100</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="teacher" className="mt-8">
              <Card className="bg-slate-800/50 border-slate-700 max-w-4xl mx-auto">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-cyan-400">
                    <BookOpen className="h-6 w-6" />
                    Teacher Integration Portal
                  </CardTitle>
                  <CardDescription>
                    Academic progress tracking and parent communication tools
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-lg p-4">
                      <div className="text-2xl font-bold text-cyan-400 mb-1">18</div>
                      <div className="text-sm text-gray-400">Student-Athletes</div>
                    </div>
                    <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-4">
                      <div className="text-2xl font-bold text-blue-400 mb-1">92%</div>
                      <div className="text-sm text-gray-400">Assignment Completion</div>
                    </div>
                    <div className="bg-green-600/10 border border-green-500/30 rounded-lg p-4">
                      <div className="text-2xl font-bold text-green-400 mb-1">45</div>
                      <div className="text-sm text-gray-400">Parent Communications</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-white">Recent Activities</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-blue-600/10 border border-blue-500/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <span className="text-sm text-gray-300">Math assignment graded - Class average: 87%</span>
                        </div>
                        <Badge variant="outline" className="text-blue-400 border-blue-400/30">Completed</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-cyan-600/10 border border-cyan-500/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                          <span className="text-sm text-gray-300">Parent conference scheduled with Johnson family</span>
                        </div>
                        <Badge variant="outline" className="text-cyan-400 border-cyan-400/30">Scheduled</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Texas Charter School Information */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="bg-gradient-to-br from-red-600/20 to-blue-600/20 border-red-500/30">
          <CardHeader className="text-center">
            <Badge className="bg-red-500/20 text-red-300 border-red-400/30 px-4 py-2 w-fit mx-auto mb-4">
              Texas Charter School
            </Badge>
            <CardTitle className="text-2xl text-white">
              Authorized Texas Charter School Component
            </CardTitle>
            <CardDescription className="text-lg">
              Fully compliant with Texas Education Agency requirements and regulations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center space-y-2">
                <Shield className="h-8 w-8 text-red-400 mx-auto" />
                <div className="font-semibold text-white">TEA Approved</div>
                <div className="text-sm text-gray-400">Texas Education Agency Charter</div>
              </div>
              <div className="text-center space-y-2">
                <Award className="h-8 w-8 text-blue-400 mx-auto" />
                <div className="font-semibold text-white">State Standards</div>
                <div className="text-sm text-gray-400">TEKS Curriculum Aligned</div>
              </div>
              <div className="text-center space-y-2">
                <Target className="h-8 w-8 text-green-400 mx-auto" />
                <div className="font-semibold text-white">Athletic Focus</div>
                <div className="text-sm text-gray-400">Student-Athlete Specialization</div>
              </div>
            </div>

            <div className="text-center space-y-4">
              <p className="text-gray-300 max-w-3xl mx-auto">
                As an authorized component of the Universal One School system, Go4it Sports Academy operates under Texas charter school regulations, 
                providing specialized education for student-athletes while maintaining full academic standards and NCAA compliance.
              </p>
              
              <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                <MapPin className="h-4 w-4" />
                <span>Serving Texas and expanding nationally</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student Dashboard Access Section */}
      <div id="enrollment" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30 px-4 py-2">
              Student Access Portal
            </Badge>
            <h2 className="text-3xl font-bold text-white">Student Dashboard & Enrollment</h2>
            <p className="text-gray-400 max-w-3xl mx-auto">
              Comprehensive student management system with enrollment, progress tracking, and AI-powered academic support for student-athletes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border-blue-500/30">
              <CardHeader>
                <BookOpen className="w-12 h-12 text-blue-400 mb-4" />
                <CardTitle className="text-white">Student Dashboard</CardTitle>
                <CardDescription>Real-time progress tracking and AI tutoring access</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>Live academic performance metrics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>Athletic training schedules & results</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>AI-powered study recommendations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>College recruitment tracking</span>
                  </div>
                </div>
                <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700" onClick={() => window.open('/dashboard', '_blank')}>
                  Access Student Dashboard
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-purple-500/30">
              <CardHeader>
                <Users className="w-12 h-12 text-purple-400 mb-4" />
                <CardTitle className="text-white">Enrollment Portal</CardTitle>
                <CardDescription>4 student categories with different access levels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-yellow-400" />
                    <span>On-Site Students ($2,500/semester)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-blue-400" />
                    <span>Online Premium ($1,800/semester)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-green-400" />
                    <span>Hybrid Students ($2,000/semester)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-gray-400" />
                    <span>Free Access (Limited features)</span>
                  </div>
                </div>
                <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700" onClick={() => window.open('/enrollment', '_blank')}>
                  Start Enrollment Process
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-green-500/30">
              <CardHeader>
                <Brain className="w-12 h-12 text-green-400 mb-4" />
                <CardTitle className="text-white">AI Academic Support</CardTitle>
                <CardDescription>Personalized learning with neurodivergent adaptations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>ADHD & dyslexia accommodations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>Personalized study schedules</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>Real-time progress analytics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>24/7 AI tutor availability</span>
                  </div>
                </div>
                <Button className="w-full mt-4 bg-green-600 hover:bg-green-700" onClick={() => window.open('/ai-tutor', '_blank')}>
                  Try AI Tutor Demo
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Parent Portal Section */}
      <div id="parent-portal" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-r from-slate-800/50 to-blue-800/50">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <Badge className="bg-green-500/20 text-green-300 border-green-400/30 px-4 py-2">
              Family Engagement Platform
            </Badge>
            <h2 className="text-3xl font-bold text-white">Parent Portal & Family Access</h2>
            <p className="text-gray-400 max-w-3xl mx-auto">
              Comprehensive parent engagement tools with real-time updates, multilingual support, and direct communication channels.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-6 text-center">
                <BarChart3 className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Progress Tracking</h3>
                <p className="text-sm text-gray-300 mb-4">Real-time academic and athletic performance monitoring</p>
                <Button variant="outline" className="border-blue-400 text-blue-300 hover:bg-blue-400/10" onClick={() => window.open('/parent-dashboard', '_blank')}>
                  View Progress
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-6 text-center">
                <Calendar className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Schedule Access</h3>
                <p className="text-sm text-gray-300 mb-4">Complete visibility into daily schedules and alerts</p>
                <Button variant="outline" className="border-green-400 text-green-300 hover:bg-green-400/10" onClick={() => window.open('/parent-schedule', '_blank')}>
                  View Schedule
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Communication Hub</h3>
                <p className="text-sm text-gray-300 mb-4">Direct messaging with coaches and teachers</p>
                <Button variant="outline" className="border-purple-400 text-purple-300 hover:bg-purple-400/10" onClick={() => window.open('/parent-messages', '_blank')}>
                  Messages
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">College Recruiting</h3>
                <p className="text-sm text-gray-300 mb-4">Scholarship opportunities and college connections</p>
                <Button variant="outline" className="border-orange-400 text-orange-300 hover:bg-orange-400/10" onClick={() => window.open('/college-recruiting', '_blank')}>
                  Recruiting
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="bg-white/10 rounded-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-6">Multi-Language Support</h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <h4 className="text-lg font-semibold text-blue-400 mb-2">English</h4>
                <p className="text-sm text-gray-300">Full platform access with native support</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-green-400 mb-2">Español</h4>
                <p className="text-sm text-gray-300">Complete translation and cultural adaptation</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-purple-400 mb-2">Deutsch</h4>
                <p className="text-sm text-gray-300">Vienna campus integration support</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Schedule & Alerts Section */}
      <div id="schedule" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400/30 px-4 py-2">
              Intelligent Scheduling System
            </Badge>
            <h2 className="text-3xl font-bold text-white">Smart Schedule & Phone Alerts</h2>
            <p className="text-gray-400 max-w-3xl mx-auto">
              AI-optimized daily scheduling with seamless phone integration, real-time alerts, and biometric-driven optimization for peak performance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border-yellow-500/30">
              <CardHeader>
                <Calendar className="w-12 h-12 text-yellow-400 mb-4" />
                <CardTitle className="text-white">Daily Class Schedule</CardTitle>
                <CardDescription>6 optimized classes per day with athletic integration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>8:00 AM - Advanced Mathematics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>9:45 AM - Sports Science Lab</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>2:15 PM - Primary Sport Training</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>5:00 PM - AI Tutoring Session</span>
                  </div>
                </div>
                <Button className="w-full mt-4 bg-yellow-600 hover:bg-yellow-700" onClick={() => window.open('/schedule', '_blank')}>
                  View Full Schedule
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border-blue-500/30">
              <CardHeader>
                <Zap className="w-12 h-12 text-blue-400 mb-4" />
                <CardTitle className="text-white">Smart Phone Alerts</CardTitle>
                <CardDescription>Multi-platform notifications with intelligent timing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>iOS & Android native apps</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>Apple Watch & Wear OS integration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>Calendar sync (Google, Outlook, Apple)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>Emergency & wellness alerts</span>
                  </div>
                </div>
                <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700" onClick={() => window.open('/phone-integration', '_blank')}>
                  Setup Phone Alerts
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-green-500/30">
              <CardHeader>
                <Brain className="w-12 h-12 text-green-400 mb-4" />
                <CardTitle className="text-white">AI Schedule Optimization</CardTitle>
                <CardDescription>Biometric-driven personalized learning windows</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>Heart rate & sleep quality tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>Optimal study time prediction</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>Training load balance management</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>Stress level interventions</span>
                  </div>
                </div>
                <Button className="w-full mt-4 bg-green-600 hover:bg-green-700" onClick={() => window.open('/ai-optimization', '_blank')}>
                  Enable AI Optimization
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="bg-white/10 rounded-lg p-8 max-w-5xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-6">Emergency Response Protocols</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-8 h-8 text-red-400" />
                </div>
                <h4 className="font-semibold text-white mb-2">Medical Emergency</h4>
                <p className="text-sm text-gray-300">Immediate notification to nurse, trainer, and parents</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <MapPin className="w-8 h-8 text-blue-400" />
                </div>
                <h4 className="font-semibold text-white mb-2">Weather Alert</h4>
                <p className="text-sm text-gray-300">Automatic schedule modifications with indoor alternatives</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Target className="w-8 h-8 text-yellow-400" />
                </div>
                <h4 className="font-semibold text-white mb-2">Facility Issue</h4>
                <p className="text-sm text-gray-300">Alternative location booking with equipment alternatives</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Users className="w-8 h-8 text-purple-400" />
                </div>
                <h4 className="font-semibold text-white mb-2">Transportation</h4>
                <p className="text-sm text-gray-300">Alternative arrangements with parent notification</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Academy Improvements Integration */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-r from-slate-800/50 to-purple-800/50">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/30 px-4 py-2">
              Revolutionary Enhancements
            </Badge>
            <h2 className="text-3xl font-bold text-white">10 Academy Improvements</h2>
            <p className="text-gray-400 max-w-3xl mx-auto">
              $45M investment over 5 years with 200% ROI projection, featuring cutting-edge technology and comprehensive student-athlete development.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-4 text-center">
                <Eye className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <h4 className="font-semibold text-white text-sm mb-1">Hybrid Learning Pods</h4>
                <p className="text-xs text-gray-300">Holographic virtual-physical classrooms</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-4 text-center">
                <Brain className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <h4 className="font-semibold text-white text-sm mb-1">AI Athletic Advisor</h4>
                <p className="text-xs text-gray-300">Biometric performance optimization</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-4 text-center">
                <Zap className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <h4 className="font-semibold text-white text-sm mb-1">Sports Science Lab</h4>
                <p className="text-xs text-gray-300">STEM training integration</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <h4 className="font-semibold text-white text-sm mb-1">Peer Mentorship</h4>
                <p className="text-xs text-gray-300">AI-powered matching network</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-4 text-center">
                <Award className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <h4 className="font-semibold text-white text-sm mb-1">Alumni Network</h4>
                <p className="text-xs text-gray-300">Career acceleration program</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">95%</div>
              <p className="text-sm text-gray-300">Students maintain 3.5+ GPA during sports seasons</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">100%</div>
              <p className="text-sm text-gray-300">College acceptance rate with 90% athletic scholarships</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">200%</div>
              <p className="text-sm text-gray-300">Expected ROI by year 5 implementation</p>
            </div>
          </div>

          <Button 
            size="lg" 
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3"
            onClick={() => window.open('/academy-improvements', '_blank')}
          >
            View Full Implementation Plan <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Strategic Improvements Section */}
      <div id="improvements" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <Badge className="bg-green-500/20 text-green-300 border-green-400/30 px-4 py-2">
              Strategic Academy Enhancements
            </Badge>
            <h2 className="text-3xl font-bold text-white">10 Revolutionary Improvements</h2>
            <p className="text-gray-400 max-w-3xl mx-auto">
              Comprehensive enhancements to support on-site dorms, flexible learning options, 
              international student pathways, and optimized athlete training schedules.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Improvement 1: Elite Athletic Residential Campus */}
            <Card className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border-blue-500/30">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">1</div>
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30">Infrastructure</Badge>
                </div>
                <CardTitle className="text-lg text-white">Elite Athletic Residential Campus</CardTitle>
                <CardDescription>800-capacity dormitory with specialized athlete amenities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>24/7 sports medicine clinic on-site</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>Recovery suites with ice baths and saunas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>Study halls with AI tutoring access</span>
                  </div>
                </div>
                <div className="pt-2 text-xs text-blue-300">
                  Investment: $45M • Revenue Impact: +$12M annually
                </div>
              </CardContent>
            </Card>

            {/* Improvement 2: Flexible Academic Scheduling */}
            <Card className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-purple-500/30">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold">2</div>
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/30">Academic Innovation</Badge>
                </div>
                <CardTitle className="text-lg text-white">Flexible Academic Scheduling</CardTitle>
                <CardDescription>Optimize training around peak performance windows</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>Morning, afternoon, evening athlete tracks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>Hybrid: 2 days campus, 3 days virtual</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>AI circadian rhythm optimization</span>
                  </div>
                </div>
                <div className="pt-2 text-xs text-purple-300">
                  Teacher Training: $2M • Schedule Optimization: AI-Powered
                </div>
              </CardContent>
            </Card>

            {/* Improvement 3: International Student Visa Pipeline */}
            <Card className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-green-500/30">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold">3</div>
                  <Badge className="bg-green-500/20 text-green-300 border-green-400/30">Global Expansion</Badge>
                </div>
                <CardTitle className="text-lg text-white">International Student Visa Pipeline</CardTitle>
                <CardDescription>6-month home country to Texas campus transition</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>Phase 1: Online with VR training</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>F-1 visa support and legal assistance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>Cultural integration and ESL support</span>
                  </div>
                </div>
                <div className="pt-2 text-xs text-green-300">
                  Target Countries: Brazil, Germany, Japan, South Korea, Australia
                </div>
              </CardContent>
            </Card>

            {/* Improvement 4: Accelerated Academic Pathways */}
            <Card className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border-yellow-500/30">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center text-white font-bold">4</div>
                  <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400/30">Academic Excellence</Badge>
                </div>
                <CardTitle className="text-lg text-white">Accelerated Academic Pathways</CardTitle>
                <CardDescription>Competency-based progression and early graduation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>Mastery learning advancement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>Dual enrollment college credits</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>3-year graduation option</span>
                  </div>
                </div>
                <div className="pt-2 text-xs text-yellow-300">
                  STEM Fast-Track: 4 years in 2.5 years
                </div>
              </CardContent>
            </Card>

            {/* Improvement 5: Professional Training Integration */}
            <Card className="bg-gradient-to-br from-red-600/20 to-pink-600/20 border-red-500/30">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center text-white font-bold">5</div>
                  <Badge className="bg-red-500/20 text-red-300 border-red-400/30">Athletic Development</Badge>
                </div>
                <CardTitle className="text-lg text-white">Professional Training Integration</CardTitle>
                <CardDescription>NFL, NBA, MLS academy partnerships</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>Dallas Cowboys facility access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>Olympic Training Center collaborations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>24/7 biometric monitoring</span>
                  </div>
                </div>
                <div className="pt-2 text-xs text-red-300">
                  NFL Combine Prep • NBA Development League
                </div>
              </CardContent>
            </Card>

            {/* Improvement 6: Virtual Reality Learning Labs */}
            <Card className="bg-gradient-to-br from-cyan-600/20 to-teal-600/20 border-cyan-500/30">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center text-white font-bold">6</div>
                  <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-400/30">Technology Innovation</Badge>
                </div>
                <CardTitle className="text-lg text-white">Virtual Reality Learning Labs</CardTitle>
                <CardDescription>Immersive VR for academics and athletic training</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>Historical event simulations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>Game strategy practice environments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>Virtual opponent analysis</span>
                  </div>
                </div>
                <div className="pt-2 text-xs text-cyan-300">
                  Investment: $8M • Academic & Athletic Integration
                </div>
              </CardContent>
            </Card>

            {/* Improvement 7: Industry Mentorship Network */}
            <Card className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border-indigo-500/30">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold">7</div>
                  <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-400/30">Career Development</Badge>
                </div>
                <CardTitle className="text-lg text-white">Industry Mentorship Network</CardTitle>
                <CardDescription>Professional athlete and sports industry mentors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>Current and former professional athletes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>ESPN, Fox Sports media personalities</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>Summer internship programs</span>
                  </div>
                </div>
                <div className="pt-2 text-xs text-indigo-300">
                  Target: 95% College Scholarships • Professional Pathways
                </div>
              </CardContent>
            </Card>

            {/* Improvement 8: Mental Health and Wellness Center */}
            <Card className="bg-gradient-to-br from-emerald-600/20 to-green-600/20 border-emerald-500/30">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold">8</div>
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30">Student Support</Badge>
                </div>
                <CardTitle className="text-lg text-white">Mental Health & Wellness Center</CardTitle>
                <CardDescription>Specialized support for high-performance athletes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>Sports psychologists and counselors</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>Performance anxiety treatment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>Meditation and biofeedback training</span>
                  </div>
                </div>
                <div className="pt-2 text-xs text-emerald-300">
                  Injury Recovery Support • Family Counseling
                </div>
              </CardContent>
            </Card>

            {/* Improvement 9: Advanced Analytics and AI Coaching */}
            <Card className="bg-gradient-to-br from-violet-600/20 to-purple-600/20 border-violet-500/30">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-violet-500 rounded-lg flex items-center justify-center text-white font-bold">9</div>
                  <Badge className="bg-violet-500/20 text-violet-300 border-violet-400/30">Performance Technology</Badge>
                </div>
                <CardTitle className="text-lg text-white">Advanced Analytics & AI Coaching</CardTitle>
                <CardDescription>Computer vision and predictive performance models</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>Real-time technique analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>Injury risk prediction models</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>AI-generated game strategy</span>
                  </div>
                </div>
                <div className="pt-2 text-xs text-violet-300">
                  24/7 Biometric Monitoring • Sleep & Nutrition Optimization
                </div>
              </CardContent>
            </Card>

            {/* Improvement 10: Global Competition and Exchange Programs */}
            <Card className="bg-gradient-to-br from-rose-600/20 to-pink-600/20 border-rose-500/30">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center text-white font-bold">10</div>
                  <Badge className="bg-rose-500/20 text-rose-300 border-rose-400/30">International Experience</Badge>
                </div>
                <CardTitle className="text-lg text-white">Global Competition & Exchange</CardTitle>
                <CardDescription>International academy partnerships and competition</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>Sister academies in Europe, Asia, Americas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>Tournament travel opportunities</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>Cultural immersion programs</span>
                  </div>
                </div>
                <div className="pt-2 text-xs text-rose-300">
                  Global Network Building • International Recruitment Advantage
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Implementation Summary */}
          <Card className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-slate-600">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-4 gap-6 text-center">
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-green-400">$95M</div>
                  <div className="text-sm text-gray-400">Total Investment</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-blue-400">24 Months</div>
                  <div className="text-sm text-gray-400">Implementation Timeline</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-purple-400">+900</div>
                  <div className="text-sm text-gray-400">Student Enrollment Growth</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-yellow-400">$85M</div>
                  <div className="text-sm text-gray-400">Projected Annual Revenue</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30">
          <CardContent className="p-8 text-center space-y-6">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-white">
                Ready to Transform Your Student-Athlete Program?
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Join Go4it Sports Academy and experience the future of educational athletics with AI-powered tools, NCAA compliance, and comprehensive student success management.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
              >
                Start Free 30-Day Trial
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-blue-400 text-blue-300 hover:bg-blue-400/10 px-8 py-3"
              >
                Schedule Demo Call
              </Button>
            </div>

            <div className="text-sm text-gray-400">
              No credit card required • Full platform access • Texas charter school approved
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Elite Infrastructure & Programs Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8 mb-12">
          <div className="space-y-4">
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30 px-4 py-2">
              World-Class Infrastructure
            </Badge>
            <h2 className="text-3xl font-bold text-white">Elite Athletic Facilities & Programs</h2>
            <p className="text-gray-400 max-w-3xl mx-auto">
              $95M investment in cutting-edge facilities designed for elite student-athlete development with 24-month implementation timeline.
            </p>
            <div className="mt-6">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 shadow-lg"
                onClick={() => window.location.href = '/campus-3d-model'}
              >
                <Eye className="mr-2 h-5 w-5" />
                Explore 3D/4D Campus Model
              </Button>
            </div>
          </div>
        </div>

        {/* Infrastructure Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-slate-800/50 border-slate-700 text-center">
            <CardContent className="p-6">
              <Building2 className="h-12 w-12 mx-auto text-blue-400 mb-4" />
              <div className="text-3xl font-bold text-blue-300">800</div>
              <div className="text-sm text-gray-400">Campus Capacity</div>
              <div className="text-xs text-green-400 mt-1">647 Currently Enrolled</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 text-center">
            <CardContent className="p-6">
              <Stethoscope className="h-12 w-12 mx-auto text-green-400 mb-4" />
              <div className="text-3xl font-bold text-green-300">24/7</div>
              <div className="text-sm text-gray-400">Sports Medicine</div>
              <div className="text-xs text-green-400 mt-1">40+ Medical Staff</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 text-center">
            <CardContent className="p-6">
              <TrendingUp className="h-12 w-12 mx-auto text-purple-400 mb-4" />
              <div className="text-3xl font-bold text-purple-300">+23%</div>
              <div className="text-sm text-gray-400">Performance</div>
              <div className="text-xs text-green-400 mt-1">vs National Average</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 text-center">
            <CardContent className="p-6">
              <Star className="h-12 w-12 mx-auto text-yellow-400 mb-4" />
              <div className="text-3xl font-bold text-yellow-300">94.7%</div>
              <div className="text-sm text-gray-400">Satisfaction</div>
              <div className="text-xs text-green-400 mt-1">Top 5% Nationally</div>
            </CardContent>
          </Card>
        </div>

        {/* Comprehensive Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Dormitory & Housing */}
          <Card className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-blue-500/30">
            <CardHeader>
              <Bed className="w-12 h-12 text-blue-400 mb-4" />
              <CardTitle className="text-white">Elite Residential Campus</CardTitle>
              <CardDescription>800-capacity dormitory with specialized athlete amenities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div className="p-2 bg-blue-900/30 rounded border border-blue-600/30">
                  <div className="font-bold text-blue-300">120</div>
                  <div className="text-gray-400">Single</div>
                  <div className="text-xs text-blue-200">$3,200</div>
                </div>
                <div className="p-2 bg-blue-900/30 rounded border border-blue-600/30">
                  <div className="font-bold text-blue-300">340</div>
                  <div className="text-gray-400">Double</div>
                  <div className="text-xs text-blue-200">$2,400</div>
                </div>
                <div className="p-2 bg-blue-900/30 rounded border border-blue-600/30">
                  <div className="font-bold text-blue-300">60</div>
                  <div className="text-gray-400">Suite</div>
                  <div className="text-xs text-blue-200">$4,800</div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300">24/7 support services</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300">Athlete nutrition center</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300">Study halls with AI tutoring</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sports Medicine Clinic */}
          <Card className="bg-gradient-to-br from-green-600/20 to-green-800/20 border-green-500/30">
            <CardHeader>
              <Stethoscope className="w-12 h-12 text-green-400 mb-4" />
              <CardTitle className="text-white">Sports Medicine Clinic</CardTitle>
              <CardDescription>24/7 medical care with elite sports medicine staff</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center text-sm">
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-green-300">8</div>
                  <div className="text-gray-400">Physicians</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-blue-300">12</div>
                  <div className="text-gray-400">Therapists</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-purple-300">6</div>
                  <div className="text-gray-400">Psychologists</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-orange-300">14</div>
                  <div className="text-gray-400">Specialists</div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300">MRI & advanced imaging</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300">Underwater treadmills</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300">3-minute emergency response</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recovery Center */}
          <Card className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-purple-500/30">
            <CardHeader>
              <Waves className="w-12 h-12 text-purple-400 mb-4" />
              <CardTitle className="text-white">Elite Recovery Center</CardTitle>
              <CardDescription>Ice baths, saunas, compression therapy, and massage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div className="p-2 bg-purple-900/30 rounded border border-purple-600/30">
                  <div className="font-bold text-purple-300">12</div>
                  <div className="text-gray-400">Ice Baths</div>
                  <div className="text-xs text-purple-200">50-55°F</div>
                </div>
                <div className="p-2 bg-purple-900/30 rounded border border-purple-600/30">
                  <div className="font-bold text-purple-300">8</div>
                  <div className="text-gray-400">Saunas</div>
                  <div className="text-xs text-purple-200">160-180°F</div>
                </div>
                <div className="p-2 bg-purple-900/30 rounded border border-purple-600/30">
                  <div className="font-bold text-purple-300">16</div>
                  <div className="text-gray-400">Massage</div>
                  <div className="text-xs text-purple-200">6AM-11PM</div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300">35% faster recovery</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300">Compression therapy</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300">92.1% utilization rate</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Flexible Academic Scheduling */}
          <Card className="bg-gradient-to-br from-orange-600/20 to-orange-800/20 border-orange-500/30">
            <CardHeader>
              <Calendar className="w-12 h-12 text-orange-400 mb-4" />
              <CardTitle className="text-white">Flexible Academic Scheduling</CardTitle>
              <CardDescription>AI-optimized schedules around training and competition</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-orange-900/30 rounded border border-orange-600/30">
                  <div className="flex justify-between items-center">
                    <div className="font-semibold text-orange-300">Morning Track</div>
                    <Badge variant="outline">234 Students</Badge>
                  </div>
                  <div className="text-sm text-gray-400">6:00 AM - 12:00 PM</div>
                </div>
                <div className="p-3 bg-blue-900/30 rounded border border-blue-600/30">
                  <div className="flex justify-between items-center">
                    <div className="font-semibold text-blue-300">Afternoon Track</div>
                    <Badge variant="outline">456 Students</Badge>
                  </div>
                  <div className="text-sm text-gray-400">12:00 PM - 6:00 PM</div>
                </div>
                <div className="p-3 bg-purple-900/30 rounded border border-purple-600/30">
                  <div className="flex justify-between items-center">
                    <div className="font-semibold text-purple-300">Evening Track</div>
                    <Badge variant="outline">178 Students</Badge>
                  </div>
                  <div className="text-sm text-gray-400">3:00 PM - 9:00 PM</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* VR Learning Labs */}
          <Card className="bg-gradient-to-br from-cyan-600/20 to-cyan-800/20 border-cyan-500/30">
            <CardHeader>
              <Eye className="w-12 h-12 text-cyan-400 mb-4" />
              <CardTitle className="text-white">Virtual Reality Learning</CardTitle>
              <CardDescription>$8M investment in immersive VR technology</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-cyan-900/30 rounded border border-cyan-600/30">
                  <div className="font-semibold text-cyan-300">Historical Simulations</div>
                  <div className="text-gray-400">Ancient civilizations, battles, discoveries</div>
                </div>
                <div className="p-2 bg-green-900/30 rounded border border-green-600/30">
                  <div className="font-semibold text-green-300">Athletic Training</div>
                  <div className="text-gray-400">Game strategy, opponent analysis</div>
                </div>
                <div className="p-2 bg-blue-900/30 rounded border border-blue-600/30">
                  <div className="font-semibold text-blue-300">Science Labs</div>
                  <div className="text-gray-400">Chemistry, physics experiments</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 bg-green-900/30 rounded">
                  <div className="font-bold text-green-300">+67%</div>
                  <div className="text-gray-400">Engagement</div>
                </div>
                <div className="p-2 bg-blue-900/30 rounded">
                  <div className="font-bold text-blue-300">+45%</div>
                  <div className="text-gray-400">Retention</div>
                </div>
                <div className="p-2 bg-purple-900/30 rounded">
                  <div className="font-bold text-purple-300">+78%</div>
                  <div className="text-gray-400">Application</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Global Competition & Exchange */}
          <Card className="bg-gradient-to-br from-blue-600/20 to-cyan-800/20 border-blue-500/30">
            <CardHeader>
              <Globe className="w-12 h-12 text-blue-400 mb-4" />
              <CardTitle className="text-white">Global Competition Network</CardTitle>
              <CardDescription>International academies and competition opportunities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-blue-900/30 rounded border border-blue-600/30">
                  <div className="font-semibold text-blue-300">Sister Academies</div>
                  <div className="text-gray-400">Europe, Asia, Americas partnerships</div>
                </div>
                <div className="p-2 bg-green-900/30 rounded border border-green-600/30">
                  <div className="font-semibold text-green-300">Tournament Travel</div>
                  <div className="text-gray-400">International competition access</div>
                </div>
                <div className="p-2 bg-purple-900/30 rounded border border-purple-600/30">
                  <div className="font-semibold text-purple-300">Cultural Exchange</div>
                  <div className="text-gray-400">Global citizenship development</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center text-sm">
                <div className="p-2 bg-green-900/30 rounded">
                  <div className="font-bold text-green-300">+900</div>
                  <div className="text-gray-400">Growth</div>
                </div>
                <div className="p-2 bg-orange-900/30 rounded">
                  <div className="font-bold text-orange-300">$85M</div>
                  <div className="text-gray-400">Revenue</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Investment Summary */}
        <Card className="mt-12 bg-gradient-to-r from-slate-800/50 to-blue-900/30 border-blue-500/30">
          <CardHeader>
            <CardTitle className="text-white text-center text-2xl">Total Infrastructure Investment</CardTitle>
            <CardDescription className="text-center text-gray-400">
              Comprehensive facility development with proven ROI and student success metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div className="space-y-2">
                <div className="text-4xl font-bold text-green-300">$95M</div>
                <div className="text-sm text-gray-400">Total Investment</div>
                <div className="text-xs text-green-400">Infrastructure & Technology</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-blue-300">24</div>
                <div className="text-sm text-gray-400">Months Timeline</div>
                <div className="text-xs text-blue-400">Implementation Schedule</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-purple-300">+900</div>
                <div className="text-sm text-gray-400">Student Growth</div>
                <div className="text-xs text-purple-400">Enrollment Projection</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-orange-300">$85M</div>
                <div className="text-sm text-gray-400">Annual Revenue</div>
                <div className="text-xs text-orange-400">Projected Annual</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}