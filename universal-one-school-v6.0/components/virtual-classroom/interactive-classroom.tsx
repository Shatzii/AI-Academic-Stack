'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Users, 
  MessageCircle, 
  Hand,
  BookOpen,
  Lightbulb,
  Heart,
  Star,
  Send,
  Monitor,
  Camera,
  Volume2,
  VolumeX,
  Settings,
  UserPlus,
  Award,
  Brain
} from 'lucide-react'
import { Screen } from '@/components/ui/missing-icons'

interface Student {
  id: string
  name: string
  avatar: string
  isOnline: boolean
  hasHandRaised: boolean
  neurodivergentSupport?: {
    type: 'ADHD' | 'Dyslexia' | 'Autism'
    adaptations: string[]
  }
}

interface ChatMessage {
  id: string
  author: string
  message: string
  timestamp: Date
  isAI?: boolean
  supportType?: string
}

export default function InteractiveClassroom() {
  const [isVideoOn, setIsVideoOn] = useState(false)
  const [isAudioOn, setIsAudioOn] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [handRaised, setHandRaised] = useState(false)
  const [currentTab, setCurrentTab] = useState('main')
  const [chatMessage, setChatMessage] = useState('')
  const [whiteboardActive, setWhiteboardActive] = useState(false)
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)

  const [students] = useState<Student[]>([
    {
      id: '1',
      name: 'Emma Wilson',
      avatar: '👧',
      isOnline: true,
      hasHandRaised: false,
      neurodivergentSupport: {
        type: 'ADHD',
        adaptations: ['Movement breaks', 'Focus timer', 'Reduced distractions']
      }
    },
    {
      id: '2',
      name: 'Marcus Chen',
      avatar: '👦',
      isOnline: true,
      hasHandRaised: true,
      neurodivergentSupport: {
        type: 'Dyslexia',
        adaptations: ['Audio support', 'Extended time', 'Font adjustment']
      }
    },
    {
      id: '3',
      name: 'Sofia Rodriguez',
      avatar: '👧',
      isOnline: true,
      hasHandRaised: false,
      neurodivergentSupport: {
        type: 'Autism',
        adaptations: ['Sensory breaks', 'Predictable routines', 'Visual schedules']
      }
    }
  ])

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      author: 'AI Teaching Assistant',
      message: 'Welcome to today\'s session! I\'m here to help with any questions about our lesson on fractions.',
      timestamp: new Date(),
      isAI: true,
      supportType: 'General'
    },
    {
      id: '2',
      author: 'Emma Wilson',
      message: 'Can you show the visual diagram again? It helps me understand better.',
      timestamp: new Date(),
      supportType: 'ADHD'
    }
  ])

  const [currentLesson] = useState({
    title: 'Understanding Fractions',
    subject: 'Mathematics',
    grade: '4th Grade',
    duration: '45 minutes',
    neurodivergentFocus: true
  })

  const sendChatMessage = () => {
    if (!chatMessage.trim()) return
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      author: 'You',
      message: chatMessage,
      timestamp: new Date()
    }
    
    setChatMessages(prev => [...prev, newMessage])
    setChatMessage('')
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        author: 'AI Teaching Assistant',
        message: 'Great question! Let me create a visual example to help explain that concept.',
        timestamp: new Date(),
        isAI: true
      }
      setChatMessages(prev => [...prev, aiResponse])
    }, 1000)
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!whiteboardActive) return
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    ctx.beginPath()
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !whiteboardActive) return
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.strokeStyle = '#2563eb'
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold flex items-center">
                  <Video className="w-6 h-6 mr-2" />
                  {currentLesson.title}
                </CardTitle>
                <CardDescription className="text-blue-100">
                  {currentLesson.subject} • {currentLesson.grade} • {currentLesson.duration}
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-yellow-500 text-yellow-900 hover:bg-yellow-400">
                  <Brain className="w-3 h-3 mr-1" />
                  Neurodivergent-Focused
                </Badge>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm">Live</span>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Main Video Area */}
          <div className="lg:col-span-3 space-y-4">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative bg-gray-900 aspect-video">
                  {/* Teacher Video */}
                  <div className="absolute inset-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="text-6xl mb-2">👩‍🏫</div>
                      <div className="text-lg font-semibold">Mrs. Johnson</div>
                      <div className="text-sm opacity-75">Math Teacher</div>
                    </div>
                  </div>
                  
                  {/* Student Video Grid */}
                  <div className="absolute bottom-4 right-4 grid grid-cols-3 gap-2">
                    {students.map(student => (
                      <div key={student.id} className="relative">
                        <div className="w-20 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center text-white text-2xl">
                          {student.avatar}
                        </div>
                        {student.hasHandRaised && (
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                            <Hand className="w-3 h-3 text-yellow-900" />
                          </div>
                        )}
                        {student.neurodivergentSupport && (
                          <div className="absolute -bottom-1 -left-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                            <Brain className="w-2 h-2 text-white" />
                          </div>
                        )}
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${student.isOnline ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                      </div>
                    ))}
                  </div>

                  {/* Controls Overlay */}
                  <div className="absolute bottom-4 left-4 flex items-center space-x-2">
                    <Button
                      variant={isVideoOn ? "default" : "destructive"}
                      size="sm"
                      onClick={() => setIsVideoOn(!isVideoOn)}
                    >
                      {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant={isAudioOn ? "default" : "destructive"}
                      size="sm"
                      onClick={() => setIsAudioOn(!isAudioOn)}
                    >
                      {isAudioOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant={isScreenSharing ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => setIsScreenSharing(!isScreenSharing)}
                    >
                      <Screen className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={handRaised ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => setHandRaised(!handRaised)}
                      className={handRaised ? "bg-yellow-500 hover:bg-yellow-600" : ""}
                    >
                      <Hand className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Interactive Whiteboard */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <Monitor className="w-5 h-5 mr-2" />
                  Interactive Whiteboard
                </CardTitle>
                <Button
                  variant={whiteboardActive ? "destructive" : "default"}
                  size="sm"
                  onClick={() => setWhiteboardActive(!whiteboardActive)}
                >
                  {whiteboardActive ? "Stop Drawing" : "Start Drawing"}
                </Button>
              </CardHeader>
              <CardContent>
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={400}
                  className="w-full border-2 border-dashed border-gray-300 rounded-lg bg-white cursor-crosshair"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
                <div className="mt-4 text-center text-sm text-gray-600">
                  {whiteboardActive ? "Click and drag to draw. Perfect for visual learners!" : "Click 'Start Drawing' to use the collaborative whiteboard"}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Student List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Students ({students.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {students.map(student => (
                  <div key={student.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{student.avatar}</span>
                      <div>
                        <div className="font-medium text-sm">{student.name}</div>
                        {student.neurodivergentSupport && (
                          <Badge variant="outline" className="text-xs">
                            {student.neurodivergentSupport.type}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {student.hasHandRaised && (
                        <Hand className="w-4 h-4 text-yellow-600" />
                      )}
                      <div className={`w-2 h-2 rounded-full ${student.isOnline ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* AI Teaching Assistant */}
            <Card className="border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center text-purple-700">
                  <Brain className="w-5 h-5 mr-2" />
                  AI Teaching Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-purple-600">
                  I'm monitoring student engagement and can provide real-time support for different learning needs.
                </div>
                <div className="space-y-2">
                  <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700">
                    Generate Visual Aid
                  </Button>
                  <Button size="sm" variant="outline" className="w-full">
                    Suggest Break Activity
                  </Button>
                  <Button size="sm" variant="outline" className="w-full">
                    Adapt Content
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Chat */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Class Chat
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="h-64 overflow-y-auto space-y-2 p-2 bg-gray-50 rounded-lg">
                  {chatMessages.map(msg => (
                    <div key={msg.id} className={`p-2 rounded-lg text-sm ${
                      msg.isAI ? 'bg-purple-100 border-l-4 border-purple-500' : 'bg-white'
                    }`}>
                      <div className="font-medium text-xs text-gray-600 mb-1">
                        {msg.author}
                        {msg.supportType && (
                          <Badge variant="outline" className="ml-1 text-xs">
                            {msg.supportType}
                          </Badge>
                        )}
                      </div>
                      <div>{msg.message}</div>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Input
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Type a message..."
                    onKeyDown={(e) => e.key === 'Enter' && sendChatMessage()}
                    className="flex-1"
                  />
                  <Button size="sm" onClick={sendChatMessage}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}