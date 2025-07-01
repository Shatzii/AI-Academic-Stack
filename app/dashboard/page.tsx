'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import StudentDashboard from '@/components/dashboard/student-dashboard'
import ParentPortal from '@/components/dashboard/parent-portal'
import AdminDashboard from '@/components/dashboard/admin-dashboard'
import AdminToggle from '@/components/ui/admin-toggle'
import LoginForm from '@/components/auth/login-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  GraduationCap, 
  Settings, 
  MessageCircle, 
  Trophy, 
  Calendar, 
  BookOpen, 
  Activity, 
  Target, 
  Brain, 
  Award, 
  TrendingUp, 
  Clock, 
  Heart, 
  Zap,
  Dumbbell,
  Star,
  CheckCircle,
  AlertCircle,
  Bell
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import Image from 'next/image'

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const [userRole, setUserRole] = useState<string | null>(null)
  const [showRoleSelector, setShowRoleSelector] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (isAuthenticated && user) {
      // Set role based on user data
      const role = user.role || 'student'
      setUserRole(role)
      setShowRoleSelector(false)
    } else {
      setUserRole(null)
      setShowRoleSelector(false)
    }
  }, [user, isAuthenticated])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-blue-300 mb-2">Go4it Sports Academy</h1>
            <p className="text-blue-200">Access your student-athlete dashboard</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-blue-500/30">
            <LoginForm redirectTo="/dashboard" />
          </div>
          <div className="text-center">
            <Button 
              variant="outline" 
              onClick={() => setShowRoleSelector(true)}
              className="text-sm"
            >
              Demo Mode (No Login Required)
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Mock student-athlete data for comprehensive demonstration
  const mockStudentData = {
    name: 'Alex Rodriguez',
    sport: 'Basketball',
    grade: '11th Grade',
    gpa: 3.8,
    athleticLevel: 'Varsity',
    enrollmentType: 'On-Site Premium',
    academicProgress: {
      currentGPA: 3.8,
      targetGPA: 3.9,
      completedCredits: 18,
      totalCredits: 26,
      currentCourses: [
        { name: 'Advanced Mathematics', grade: 'A-', progress: 85, nextAssignment: 'Calculus Problem Set Due Tomorrow' },
        { name: 'Sports Science Lab', grade: 'A', progress: 92, nextAssignment: 'Biomechanics Report Due Friday' },
        { name: 'English Literature', grade: 'B+', progress: 78, nextAssignment: 'Essay Analysis Due Monday' },
        { name: 'College Prep', grade: 'A', progress: 95, nextAssignment: 'Scholarship Application Review' }
      ]
    },
    athleticProgress: {
      trainingStreak: 28,
      performanceRating: 4.2,
      upcomingCompetitions: [
        { name: 'State Championships', date: '2025-07-15', location: 'Austin Sports Complex' },
        { name: 'Regional Tournament', date: '2025-07-22', location: 'Dallas Athletic Center' }
      ],
      recentStats: { strength: 87, endurance: 92, skill: 89, recovery: 85 }
    },
    schedule: {
      today: [
        { time: '8:00 AM', activity: 'Advanced Mathematics', type: 'academic', location: 'Math Lab 201' },
        { time: '9:45 AM', activity: 'Sports Science Laboratory', type: 'academic', location: 'Biomechanics Lab' },
        { time: '11:30 AM', activity: 'English Literature', type: 'academic', location: 'Liberal Arts 105' },
        { time: '1:00 PM', activity: 'Lunch & Nutrition Session', type: 'wellness', location: 'Athletic Dining Hall' },
        { time: '2:15 PM', activity: 'Basketball Training', type: 'athletic', location: 'Court 1' },
        { time: '5:00 PM', activity: 'AI Tutoring Session', type: 'academic', location: 'Learning Commons' }
      ],
      alerts: [
        { type: 'urgent', message: 'Training session starts in 15 minutes', time: '1:45 PM' },
        { type: 'reminder', message: 'Scholarship application deadline tomorrow', time: '2:00 PM' }
      ]
    },
    wellness: { sleepHours: 8.2, hydrationLevel: 75, stressLevel: 35, recoveryScore: 92 },
    collegeRecruiting: {
      scholarshipOpportunities: 7,
      recruitmentLevel: 'Division I Prospect',
      collegeInterest: [
        { name: 'University of Texas', level: 'High Interest', status: 'Active Recruitment' },
        { name: 'Duke University', level: 'Moderate Interest', status: 'Initial Contact' }
      ]
    }
  }

  // Render comprehensive student-athlete dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black text-blue-100">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-blue-500/30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative w-12 h-12">
                <Image
                  src="/go4it-logo.jpg"
                  alt="Go4it Logo"
                  fill
                  sizes="48px"
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-blue-200">Go4it Sports Academy</h1>
                <p className="text-blue-300">Student-Athlete Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30">
                {mockStudentData.enrollmentType}
              </Badge>
              <Button 
                variant="outline" 
                className="border-blue-400 text-blue-300 hover:bg-blue-400/10"
                onClick={() => window.location.href = '/go4it-academy'}
              >
                <Settings className="w-4 h-4 mr-2" />
                Academy Home
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Student Info Bar */}
      <div className="bg-gradient-to-r from-blue-800/50 to-purple-800/50 border-b border-blue-500/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div>
                <h2 className="text-xl font-bold text-blue-200">{mockStudentData.name}</h2>
                <p className="text-blue-300">{mockStudentData.grade} • {mockStudentData.sport} • {mockStudentData.athleticLevel}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{mockStudentData.academicProgress.currentGPA}</div>
                  <div className="text-sm text-blue-300">Current GPA</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{mockStudentData.athleticProgress.performanceRating}</div>
                  <div className="text-sm text-blue-300">Athletic Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{mockStudentData.athleticProgress.trainingStreak}</div>
                  <div className="text-sm text-blue-300">Day Streak</div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-blue-400" />
              <Badge className="bg-red-500/20 text-red-300 border-red-400/30">
                {mockStudentData.schedule.alerts.length} Alerts
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white/10 border border-blue-500/30">
            <TabsTrigger value="overview" className="text-blue-200">Overview</TabsTrigger>
            <TabsTrigger value="academics" className="text-blue-200">Academics</TabsTrigger>
            <TabsTrigger value="athletics" className="text-blue-200">Athletics</TabsTrigger>
            <TabsTrigger value="schedule" className="text-blue-200">Schedule</TabsTrigger>
            <TabsTrigger value="wellness" className="text-blue-200">Wellness</TabsTrigger>
            <TabsTrigger value="recruiting" className="text-blue-200">Recruiting</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-white/10 border-blue-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-300 text-sm">Academic Progress</p>
                      <p className="text-2xl font-bold text-blue-200">{Math.round((mockStudentData.academicProgress.completedCredits / mockStudentData.academicProgress.totalCredits) * 100)}%</p>
                    </div>
                    <BookOpen className="w-8 h-8 text-blue-400" />
                  </div>
                  <Progress value={(mockStudentData.academicProgress.completedCredits / mockStudentData.academicProgress.totalCredits) * 100} className="mt-3" />
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 border-purple-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-300 text-sm">Athletic Performance</p>
                      <p className="text-2xl font-bold text-purple-200">{mockStudentData.athleticProgress.performanceRating}/5.0</p>
                    </div>
                    <Dumbbell className="w-8 h-8 text-purple-400" />
                  </div>
                  <Progress value={(mockStudentData.athleticProgress.performanceRating / 5) * 100} className="mt-3" />
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 border-green-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-300 text-sm">Wellness Score</p>
                      <p className="text-2xl font-bold text-green-200">{mockStudentData.wellness.recoveryScore}%</p>
                    </div>
                    <Heart className="w-8 h-8 text-green-400" />
                  </div>
                  <Progress value={mockStudentData.wellness.recoveryScore} className="mt-3" />
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 border-yellow-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-300 text-sm">Scholarships</p>
                      <p className="text-2xl font-bold text-yellow-200">{mockStudentData.collegeRecruiting.scholarshipOpportunities}</p>
                    </div>
                    <GraduationCap className="w-8 h-8 text-yellow-400" />
                  </div>
                  <p className="text-xs text-yellow-300 mt-2">Active opportunities</p>
                </CardContent>
              </Card>
            </div>

            {/* Today's Schedule & Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/10 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-200">
                    <Calendar className="w-5 h-5 mr-2" />
                    Today's Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mockStudentData.schedule.today.map((item, index) => (
                    <div key={index} className="flex items-center p-3 bg-white/5 rounded-lg border border-blue-500/20">
                      <div className="w-2 h-2 rounded-full bg-blue-400 mr-3"></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-blue-200">{item.activity}</p>
                          <Badge className={`text-xs ${
                            item.type === 'academic' ? 'bg-blue-500/20 text-blue-300' :
                            item.type === 'athletic' ? 'bg-red-500/20 text-red-300' :
                            'bg-green-500/20 text-green-300'
                          }`}>
                            {item.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-blue-300">{item.time} • {item.location}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-yellow-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center text-yellow-200">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    Active Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mockStudentData.schedule.alerts.map((alert, index) => (
                    <div key={index} className={`flex items-start p-3 rounded-lg border ${
                      alert.type === 'urgent' ? 'bg-red-500/20 border-red-500/30' :
                      'bg-yellow-500/20 border-yellow-500/30'
                    }`}>
                      <div className={`w-2 h-2 rounded-full mt-2 mr-3 ${
                        alert.type === 'urgent' ? 'bg-red-400' : 'bg-yellow-400'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm text-blue-200">{alert.message}</p>
                        <p className="text-xs text-blue-400 mt-1">{alert.time}</p>
                      </div>
                    </div>
                  ))}
                  
                  <Button 
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => {
                      alert('Notification Center: You have 3 urgent alerts and 5 reminders. This would open a detailed notifications panel.')
                    }}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    View All Notifications
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="academics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 bg-white/10 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-blue-200">Current Courses</CardTitle>
                  <CardDescription className="text-blue-300">Track your academic progress and upcoming assignments</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockStudentData.academicProgress.currentCourses.map((course, index) => (
                    <div key={index} className="p-4 bg-white/5 rounded-lg border border-blue-500/20">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-blue-200">{course.name}</h3>
                        <Badge className="bg-green-500/20 text-green-300 border-green-400/30">
                          {course.grade}
                        </Badge>
                      </div>
                      <Progress value={course.progress} className="mb-2" />
                      <p className="text-sm text-blue-300">Next: {course.nextAssignment}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-green-200">Academic Goals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-green-300">Current GPA</span>
                      <span className="text-green-200">{mockStudentData.academicProgress.currentGPA}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-3">
                      <span className="text-green-300">Target GPA</span>
                      <span className="text-green-200">{mockStudentData.academicProgress.targetGPA}</span>
                    </div>
                    <Progress value={(mockStudentData.academicProgress.currentGPA / mockStudentData.academicProgress.targetGPA) * 100} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-green-300">Credits Completed</span>
                      <span className="text-green-200">{mockStudentData.academicProgress.completedCredits}/{mockStudentData.academicProgress.totalCredits}</span>
                    </div>
                    <Progress value={(mockStudentData.academicProgress.completedCredits / mockStudentData.academicProgress.totalCredits) * 100} />
                  </div>
                  
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => {
                      alert('AI Study Assistant activated! This would integrate with Claude AI for personalized tutoring.')
                    }}
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    AI Study Assistant
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="athletics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/10 border-red-500/30">
                <CardHeader>
                  <CardTitle className="text-red-200">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(mockStudentData.athleticProgress.recentStats).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-red-300 capitalize">{key}</span>
                        <span className="text-red-200">{value}%</span>
                      </div>
                      <Progress value={value} />
                    </div>
                  ))}
                  
                  <div className="mt-6 p-4 bg-red-500/20 rounded-lg border border-red-500/30">
                    <h4 className="font-semibold text-red-200 mb-2">Training Streak</h4>
                    <div className="text-3xl font-bold text-red-200">{mockStudentData.athleticProgress.trainingStreak} Days</div>
                    <p className="text-sm text-red-300">Keep it up! You're on track for your monthly goal.</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-purple-200">Upcoming Competitions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockStudentData.athleticProgress.upcomingCompetitions.map((comp, index) => (
                    <div key={index} className="p-4 bg-purple-500/20 rounded-lg border border-purple-500/30">
                      <h4 className="font-semibold text-purple-200">{comp.name}</h4>
                      <p className="text-sm text-purple-300">{comp.date}</p>
                      <p className="text-sm text-purple-300">{comp.location}</p>
                    </div>
                  ))}
                  
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={() => setActiveTab('schedule')}
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    View Competition Schedule
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <Card className="bg-white/10 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-blue-200">Smart Schedule Management</CardTitle>
                <CardDescription className="text-blue-300">AI-optimized scheduling with phone integration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-blue-200">Today's Classes</h3>
                    {mockStudentData.schedule.today.filter(item => item.type === 'academic').map((item, index) => (
                      <div key={index} className="p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
                        <p className="font-medium text-blue-200">{item.activity}</p>
                        <p className="text-sm text-blue-300">{item.time}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold text-red-200">Training Sessions</h3>
                    {mockStudentData.schedule.today.filter(item => item.type === 'athletic').map((item, index) => (
                      <div key={index} className="p-3 bg-red-500/20 rounded-lg border border-red-500/30">
                        <p className="font-medium text-red-200">{item.activity}</p>
                        <p className="text-sm text-red-300">{item.time}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold text-green-200">Wellness</h3>
                    {mockStudentData.schedule.today.filter(item => item.type === 'wellness').map((item, index) => (
                      <div key={index} className="p-3 bg-green-500/20 rounded-lg border border-green-500/30">
                        <p className="font-medium text-green-200">{item.activity}</p>
                        <p className="text-sm text-green-300">{item.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6 flex gap-4">
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => {
                      alert('Calendar Sync: This would connect to your phone calendar app (iPhone Calendar, Google Calendar) and sync all Go4it Academy events.')
                    }}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Sync with Phone Calendar
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-blue-400 text-blue-300 hover:bg-blue-400/10"
                    onClick={() => {
                      alert('Smart Alerts Setup: This would configure push notifications for classes, training sessions, and emergency alerts.')
                    }}
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    Setup Alerts
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wellness" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white/10 border-green-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-300 text-sm">Sleep</p>
                      <p className="text-2xl font-bold text-green-200">{mockStudentData.wellness.sleepHours}h</p>
                    </div>
                    <Clock className="w-8 h-8 text-green-400" />
                  </div>
                  <p className="text-xs text-green-300 mt-2">Target: 8-9 hours</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 border-blue-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-300 text-sm">Hydration</p>
                      <p className="text-2xl font-bold text-blue-200">{mockStudentData.wellness.hydrationLevel}%</p>
                    </div>
                    <Activity className="w-8 h-8 text-blue-400" />
                  </div>
                  <Progress value={mockStudentData.wellness.hydrationLevel} className="mt-3" />
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 border-yellow-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-300 text-sm">Stress Level</p>
                      <p className="text-2xl font-bold text-yellow-200">{mockStudentData.wellness.stressLevel}%</p>
                    </div>
                    <Brain className="w-8 h-8 text-yellow-400" />
                  </div>
                  <p className="text-xs text-yellow-300 mt-2">Low stress is optimal</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 border-purple-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-300 text-sm">Recovery</p>
                      <p className="text-2xl font-bold text-purple-200">{mockStudentData.wellness.recoveryScore}%</p>
                    </div>
                    <Heart className="w-8 h-8 text-purple-400" />
                  </div>
                  <Progress value={mockStudentData.wellness.recoveryScore} className="mt-3" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="recruiting" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/10 border-yellow-500/30">
                <CardHeader>
                  <CardTitle className="text-yellow-200">College Interest</CardTitle>
                  <CardDescription className="text-yellow-300">Active recruitment opportunities</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockStudentData.collegeRecruiting.collegeInterest.map((college, index) => (
                    <div key={index} className="p-4 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-yellow-200">{college.name}</h4>
                        <Badge className={`${
                          college.level === 'High Interest' ? 'bg-green-500/20 text-green-300' : 'bg-blue-500/20 text-blue-300'
                        }`}>
                          {college.level}
                        </Badge>
                      </div>
                      <p className="text-sm text-yellow-300">{college.status}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-green-200">Recruitment Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-6 bg-green-500/20 rounded-lg border border-green-500/30">
                    <div className="text-3xl font-bold text-green-200 mb-2">{mockStudentData.collegeRecruiting.scholarshipOpportunities}</div>
                    <p className="text-green-300">Active Scholarship Opportunities</p>
                  </div>
                  
                  <div className="text-center p-4 bg-blue-500/20 rounded-lg border border-blue-500/30">
                    <p className="text-blue-300 text-sm">Recruitment Level</p>
                    <p className="text-xl font-bold text-blue-200">{mockStudentData.collegeRecruiting.recruitmentLevel}</p>
                  </div>
                  
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => setActiveTab('recruiting')}
                  >
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Access Full Recruiting Portal
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );

  // Render appropriate dashboard based on role
  const renderDashboard = () => {
    switch (userRole) {
      case 'student':
        return <StudentDashboard />
      case 'parent':
        return <ParentPortal />
      case 'admin':
        return <AdminDashboard />
      case 'teacher':
        return <AdminDashboard /> // Use admin dashboard for teachers for now
      default:
        return <StudentDashboard />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminToggle />
      {/* Admin Access Notice */}
      {(localStorage.getItem('admin_mode') === 'true' || localStorage.getItem('master_admin') === 'true') && (
        <div className="bg-blue-100 border-l-4 border-blue-500 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Admin Access:</strong> You have full access to all dashboard views and can switch between roles.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">
                The Universal One School
              </h1>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {userRole?.charAt(0).toUpperCase() + userRole?.slice(1)} Dashboard
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.href = '/innovations'}
              >
                <Users className="h-4 w-4 mr-2" />
                Innovations
              </Button>
              <Button variant="outline" size="sm">
                <MessageCircle className="h-4 w-4 mr-2" />
                Messages
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setUserRole(null)
                  localStorage.removeItem('user_role')
                }}
              >
                Switch Role
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.href = '/'}
              >
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderDashboard()}
      </div>
    </div>
  )
}