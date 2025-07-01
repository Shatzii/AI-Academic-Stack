'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  MessageCircle, 
  Calendar, 
  TrendingUp, 
  Home, 
  Bell,
  Video,
  BookOpen,
  Heart,
  Brain,
  Users,
  Star,
  Clock,
  Award,
  AlertCircle,
  CheckCircle,
  Send,
  Phone,
  Mail,
  Globe,
  Camera,
  Download,
  Share2,
  Settings,
  HelpCircle
} from 'lucide-react'

interface ChildProgress {
  id: string
  name: string
  grade: string
  avatar: string
  currentStreak: number
  weeklyGoals: number
  completedGoals: number
  neurodivergentSupport: string
  recentAchievements: string[]
  upcomingMilestones: string[]
}

interface Message {
  id: string
  from: string
  type: 'teacher' | 'ai' | 'system'
  message: string
  timestamp: Date
  priority: 'low' | 'medium' | 'high'
  read: boolean
}

export default function ParentEngagementPlatform() {
  const [selectedChild, setSelectedChild] = useState('1')
  const [newMessage, setNewMessage] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('en')

  const children: ChildProgress[] = [
    {
      id: '1',
      name: 'Emma Wilson',
      grade: '4th Grade',
      avatar: '👧',
      currentStreak: 7,
      weeklyGoals: 5,
      completedGoals: 4,
      neurodivergentSupport: 'ADHD Support',
      recentAchievements: ['Completed 20-minute focus session', 'Mastered multiplication tables', 'Helped classmate with reading'],
      upcomingMilestones: ['Math assessment next week', 'Science fair project due']
    },
    {
      id: '2',
      name: 'Alex Wilson',
      grade: '2nd Grade',
      avatar: '👦',
      currentStreak: 12,
      weeklyGoals: 4,
      completedGoals: 4,
      neurodivergentSupport: 'Autism Accommodations',
      recentAchievements: ['Completed daily routine independently', 'Shared favorite book with class', 'Used communication board successfully'],
      upcomingMilestones: ['Parent-teacher conference', 'IEP review meeting']
    }
  ]

  const messages: Message[] = [
    {
      id: '1',
      from: 'Mrs. Johnson - Math Teacher',
      type: 'teacher',
      message: 'Emma showed excellent progress in fractions today! She helped another student understand the concept.',
      timestamp: new Date(),
      priority: 'medium',
      read: false
    },
    {
      id: '2',
      from: 'AI Learning Assistant',
      type: 'ai',
      message: 'Emma has been maintaining focus for longer periods. Consider gradually increasing lesson duration.',
      timestamp: new Date(),
      priority: 'low',
      read: true
    },
    {
      id: '3',
      from: 'School System',
      type: 'system',
      message: 'Parent-teacher conference scheduled for next Tuesday at 3:00 PM.',
      timestamp: new Date(),
      priority: 'high',
      read: false
    }
  ]

  const homeActivities = [
    {
      title: 'Reading Together',
      description: 'Spend 20 minutes reading with your child',
      icon: BookOpen,
      difficulty: 'Easy',
      time: '20 min',
      neurodivergentTip: 'Use shorter books and take breaks if needed'
    },
    {
      title: 'Math in Cooking',
      description: 'Practice fractions while measuring ingredients',
      icon: Heart,
      difficulty: 'Medium',
      time: '30 min',
      neurodivergentTip: 'Visual measuring cups help with fraction concepts'
    },
    {
      title: 'Science Exploration',
      description: 'Simple experiments using household items',
      icon: Brain,
      difficulty: 'Medium',
      time: '45 min',
      neurodivergentTip: 'Hands-on learning reinforces concepts'
    }
  ]

  const currentChild = children.find(c => c.id === selectedChild) || children[0]

  const translations = {
    en: { welcome: 'Welcome to Your Parent Portal', progress: 'Progress Overview' },
    es: { welcome: 'Bienvenido a su Portal de Padres', progress: 'Resumen del Progreso' },
    de: { welcome: 'Willkommen in Ihrem Elternportal', progress: 'Fortschrittsübersicht' }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">
                  {translations[selectedLanguage as keyof typeof translations].welcome}
                </CardTitle>
                <CardDescription className="text-green-100">
                  Stay connected with your child's learning journey
                </CardDescription>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="bg-white text-gray-900 rounded px-2 py-1 text-sm"
                >
                  <option value="en">🇺🇸 English</option>
                  <option value="es">🇪🇸 Español</option>
                  <option value="de">🇩🇪 Deutsch</option>
                </select>
                <div className="relative">
                  <Bell className="w-6 h-6" />
                  <Badge className="absolute -top-2 -right-2 w-5 h-5 text-xs p-0 flex items-center justify-center bg-red-500">
                    3
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Child Selector */}
        <div className="flex space-x-4">
          {children.map(child => (
            <Button
              key={child.id}
              variant={selectedChild === child.id ? "default" : "outline"}
              className="h-16 flex items-center space-x-3 px-4"
              onClick={() => setSelectedChild(child.id)}
            >
              <span className="text-2xl">{child.avatar}</span>
              <div className="text-left">
                <div className="font-semibold">{child.name}</div>
                <div className="text-xs opacity-75">{child.grade}</div>
              </div>
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                  {currentChild.name}'s Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">{currentChild.currentStreak}</div>
                    <div className="text-sm text-gray-600">Day Learning Streak</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">
                      {currentChild.completedGoals}/{currentChild.weeklyGoals}
                    </div>
                    <div className="text-sm text-gray-600">Weekly Goals</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600">A+</div>
                    <div className="text-sm text-gray-600">Overall Grade</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Brain className="w-4 h-4 mr-2 text-purple-600" />
                    Neurodivergent Support
                  </h4>
                  <Badge className="bg-purple-100 text-purple-800">
                    {currentChild.neurodivergentSupport}
                  </Badge>
                  <p className="text-sm text-gray-600 mt-2">
                    Specialized accommodations and support strategies are being used to optimize learning.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 mr-2 text-yellow-600" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentChild.recentAchievements.map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm">{achievement}</span>
                      <Badge variant="outline" className="ml-auto text-xs">Today</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Home Learning Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Home className="w-5 h-5 mr-2 text-green-600" />
                  Suggested Home Activities
                </CardTitle>
                <CardDescription>
                  Fun learning activities you can do together at home
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {homeActivities.map((activity, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <activity.icon className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{activity.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                            <div className="flex items-center space-x-4 mt-2">
                              <Badge variant="outline" className="text-xs">{activity.difficulty}</Badge>
                              <span className="text-xs text-gray-500 flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {activity.time}
                              </span>
                            </div>
                            <div className="mt-2 p-2 bg-purple-50 rounded text-xs text-purple-700">
                              <Brain className="w-3 h-3 inline mr-1" />
                              {activity.neurodivergentTip}
                            </div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          Start
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-orange-600" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {currentChild.upcomingMilestones.map((milestone, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                    <span className="text-sm">{milestone}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Messages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2 text-blue-600" />
                  Messages
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="max-h-64 overflow-y-auto space-y-3">
                  {messages.map(message => (
                    <div
                      key={message.id}
                      className={`p-3 rounded-lg border-l-4 ${
                        message.priority === 'high' ? 'border-red-500 bg-red-50' :
                        message.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                        'border-blue-500 bg-blue-50'
                      } ${!message.read ? 'font-semibold' : ''}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium">{message.from}</span>
                        <Badge
                          variant={message.type === 'teacher' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {message.type}
                        </Badge>
                      </div>
                      <p className="text-sm">{message.message}</p>
                    </div>
                  ))}
                </div>
                
                <div className="flex space-x-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1"
                  />
                  <Button size="sm">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-gray-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Video className="w-4 h-4 mr-2" />
                  Schedule Conference
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Progress Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share with Family
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Get Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}