'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { 
  Home,
  BookOpen,
  MessageCircle,
  Award,
  Bell,
  User,
  Camera,
  Mic,
  Search,
  Calendar,
  Clock,
  Heart,
  Brain,
  Zap,
  Target,
  Star,
  Download,
  Wifi,
  WifiOff,
  Volume2,
  VolumeX,
  Menu,
  X
} from 'lucide-react'

interface MobileAppState {
  isOnline: boolean
  notifications: number
  offlineContent: boolean
  voiceRecording: boolean
  currentStreak: number
  todayGoals: number
  completedGoals: number
}

export default function MobileDashboard() {
  const [appState, setAppState] = useState<MobileAppState>({
    isOnline: true,
    notifications: 3,
    offlineContent: true,
    voiceRecording: false,
    currentStreak: 7,
    todayGoals: 5,
    completedGoals: 3
  })

  const [menuOpen, setMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('home')
  const [voiceSearch, setVoiceSearch] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  // Simulate PWA features
  useEffect(() => {
    // Simulate online/offline detection
    const handleOnlineStatus = () => {
      setAppState(prev => ({ ...prev, isOnline: navigator.onLine }))
    }

    window.addEventListener('online', handleOnlineStatus)
    window.addEventListener('offline', handleOnlineStatus)

    return () => {
      window.removeEventListener('online', handleOnlineStatus)
      window.removeEventListener('offline', handleOnlineStatus)
    }
  }, [])

  const quickActions = [
    { icon: BookOpen, label: 'Start Lesson', color: 'bg-blue-500', action: () => console.log('Starting lesson') },
    { icon: Camera, label: 'Scan QR', color: 'bg-green-500', action: () => console.log('Opening camera') },
    { icon: Mic, label: 'Voice Note', color: 'bg-purple-500', action: () => setVoiceSearch(!voiceSearch) },
    { icon: MessageCircle, label: 'Ask AI', color: 'bg-yellow-500', action: () => console.log('Opening AI chat') }
  ]

  const neurodivergentFeatures = [
    { 
      icon: Brain, 
      title: 'Focus Mode', 
      description: 'Reduce distractions for 25 minutes',
      active: false,
      color: 'text-blue-600'
    },
    { 
      icon: Heart, 
      title: 'Sensory Break', 
      description: 'Calming activities for 5 minutes',
      active: false,
      color: 'text-pink-600'
    },
    { 
      icon: Zap, 
      title: 'Movement Time', 
      description: 'Physical activities to boost energy',
      active: true,
      color: 'text-yellow-600'
    },
    { 
      icon: Volume2, 
      title: 'Audio Support', 
      description: 'Text-to-speech for all content',
      active: true,
      color: 'text-green-600'
    }
  ]

  const todaySchedule = [
    { time: '9:00 AM', subject: 'Math', status: 'completed', type: 'superhero' },
    { time: '10:00 AM', subject: 'Reading', status: 'current', type: 'superhero' },
    { time: '11:00 AM', subject: 'Science', status: 'upcoming', type: 'superhero' },
    { time: '2:00 PM', subject: 'Art Therapy', status: 'upcoming', type: 'break' }
  ]

  const progressData = {
    weeklyGoals: 85,
    readingLevel: 92,
    mathSkills: 78,
    focusTime: 156 // minutes this week
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'} transition-colors duration-300`}>
      {/* Mobile Header */}
      <div className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-b shadow-sm`}>
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          
          <h1 className="text-lg font-bold">SuperHero School</h1>
          
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Button variant="ghost" size="sm">
                <Bell className="w-5 h-5" />
                {appState.notifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 text-xs p-0 flex items-center justify-center bg-red-500">
                    {appState.notifications}
                  </Badge>
                )}
              </Button>
            </div>
            <div className="flex items-center space-x-1">
              {appState.isOnline ? (
                <Wifi className="w-4 h-4 text-green-500" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-500" />
              )}
            </div>
          </div>
        </div>

        {/* Connection Status */}
        {!appState.isOnline && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-2">
            <div className="flex items-center">
              <Download className="w-4 h-4 text-yellow-600 mr-2" />
              <span className="text-sm text-yellow-700">Offline mode - Using downloaded content</span>
            </div>
          </div>
        )}
      </div>

      {/* Slide-out Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setMenuOpen(false)}>
          <div className={`fixed left-0 top-0 h-full w-64 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg transform transition-transform duration-300`}>
            <div className="p-4 space-y-4">
              <div className="flex items-center space-x-3 pb-4 border-b">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl">
                  🦸‍♂️
                </div>
                <div>
                  <div className="font-semibold">Alex Hero</div>
                  <div className="text-sm text-gray-500">4th Grade</div>
                </div>
              </div>
              
              <nav className="space-y-2">
                <Button variant="ghost" className="w-full justify-start">
                  <Home className="w-4 h-4 mr-3" />
                  Dashboard
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <BookOpen className="w-4 h-4 mr-3" />
                  My Lessons
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Award className="w-4 h-4 mr-3" />
                  Achievements
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-3" />
                  Schedule
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <User className="w-4 h-4 mr-3" />
                  Profile
                </Button>
              </nav>
              
              <div className="pt-4 border-t">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => setDarkMode(!darkMode)}
                >
                  {darkMode ? '☀️' : '🌙'} {darkMode ? 'Light Mode' : 'Dark Mode'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="p-4 space-y-6">
        {/* Welcome Card */}
        <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : ''} bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Welcome back, Alex! 🦸‍♂️</h2>
                <p className="text-blue-100">Ready for another super learning day?</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{appState.currentStreak}</div>
                <div className="text-xs text-blue-100">Day Streak</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className={`h-20 flex flex-col items-center justify-center space-y-1 ${darkMode ? 'border-gray-600 hover:bg-gray-700' : ''}`}
                onClick={action.action}
              >
                <div className={`w-8 h-8 ${action.color} rounded-full flex items-center justify-center text-white`}>
                  <action.icon className="w-4 h-4" />
                </div>
                <span className="text-sm">{action.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Voice Search */}
        {voiceSearch && (
          <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : ''} border-purple-200 bg-purple-50`}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center animate-pulse">
                  <Mic className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-purple-700">Listening...</div>
                  <div className="text-sm text-purple-600">Say "Help me with math" or ask any question</div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setVoiceSearch(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Today's Progress */}
        <Card className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2 text-green-600" />
              Today's Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Daily Goals</span>
              <span className="font-semibold">{appState.completedGoals}/{appState.todayGoals}</span>
            </div>
            <Progress value={(appState.completedGoals / appState.todayGoals) * 100} className="h-2" />
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-xl font-bold text-blue-600">{progressData.readingLevel}%</div>
                <div className="text-xs text-gray-600">Reading Level</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-xl font-bold text-green-600">{progressData.mathSkills}%</div>
                <div className="text-xs text-gray-600">Math Skills</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Neurodivergent Support Features */}
        <Card className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="w-5 h-5 mr-2 text-purple-600" />
              Support Tools
            </CardTitle>
            <CardDescription>
              Tools designed to help you learn your best way
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {neurodivergentFeatures.map((feature, index) => (
              <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center space-x-3">
                  <feature.icon className={`w-5 h-5 ${feature.color}`} />
                  <div>
                    <div className="font-medium text-sm">{feature.title}</div>
                    <div className="text-xs text-gray-500">{feature.description}</div>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant={feature.active ? "default" : "outline"}
                >
                  {feature.active ? 'Active' : 'Start'}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Today's Schedule */}
        <Card className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-orange-600" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {todaySchedule.map((item, index) => (
              <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                item.status === 'current' ? 'bg-blue-50 border-l-4 border-blue-500' :
                item.status === 'completed' ? 'bg-green-50 border-l-4 border-green-500' :
                darkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className="text-sm font-medium">{item.time}</div>
                  <div>
                    <div className="font-medium text-sm">{item.subject}</div>
                    <div className="text-xs text-gray-500">
                      {item.type === 'superhero' ? '🦸‍♂️ SuperHero Learning' : '🎨 Creative Break'}
                    </div>
                  </div>
                </div>
                <div>
                  {item.status === 'completed' && <div className="text-green-600">✓</div>}
                  {item.status === 'current' && <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>}
                  {item.status === 'upcoming' && <Clock className="w-4 h-4 text-gray-400" />}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Bottom Spacing for Tab Bar */}
        <div className="h-20"></div>
      </div>

      {/* Bottom Tab Navigation */}
      <div className={`fixed bottom-0 left-0 right-0 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} border-t shadow-lg`}>
        <div className="grid grid-cols-5 gap-1 p-2">
          {[
            { icon: Home, label: 'Home', key: 'home' },
            { icon: BookOpen, label: 'Lessons', key: 'lessons' },
            { icon: Award, label: 'Rewards', key: 'rewards' },
            { icon: MessageCircle, label: 'Chat', key: 'chat' },
            { icon: User, label: 'Profile', key: 'profile' }
          ].map((tab) => (
            <Button
              key={tab.key}
              variant="ghost"
              className={`flex flex-col items-center justify-center h-16 space-y-1 ${
                activeTab === tab.key ? 'text-blue-600' : 'text-gray-400'
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-xs">{tab.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}