'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Network, 
  Users, 
  Globe2, 
  Zap, 
  Brain,
  MessageCircle,
  Video,
  Share2,
  FileText,
  Lightbulb,
  Target,
  Clock,
  Award,
  Star,
  Send,
  Mic,
  Camera,
  Link,
  Download,
  Sparkles,
  Atom,
  Layers,
  Wifi,
  Shield,
  Eye,
  Heart,
  Trophy,
  Rocket
} from 'lucide-react'

interface QuantumStudent {
  id: string
  name: string
  avatar: string
  location: string
  timezone: string
  school: string
  specialization: string
  quantumScore: number
  isOnline: boolean
  currentActivity: string
  neurodivergentProfile?: {
    type: string
    adaptations: string[]
  }
}

interface CollaborationSession {
  id: string
  title: string
  type: 'project' | 'study' | 'research' | 'creative'
  participants: string[]
  leader: string
  startTime: Date
  duration: number
  subject: string
  quantumSyncLevel: number
  sharedBrainpower: number
}

interface QuantumIdea {
  id: string
  author: string
  content: string
  timestamp: Date
  quantumResonance: number
  connections: string[]
  category: string
  collaborative: boolean
}

export default function QuantumCollaborationHub() {
  const [selectedSession, setSelectedSession] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [quantumSync, setQuantumSync] = useState(0)
  const [globalBrainpower, setGlobalBrainpower] = useState(0)
  const [connectedStudents, setConnectedStudents] = useState<QuantumStudent[]>([])
  const [ideaStream, setIdeaStream] = useState<QuantumIdea[]>([])

  const quantumStudents: QuantumStudent[] = [
    {
      id: '1',
      name: 'Emma Chen',
      avatar: '👧',
      location: 'Dallas, Texas',
      timezone: 'UTC-6',
      school: 'SuperHero School',
      specialization: 'Quantum Physics',
      quantumScore: 94,
      isOnline: true,
      currentActivity: 'Exploring molecular structures',
      neurodivergentProfile: {
        type: 'ADHD',
        adaptations: ['Quick transitions', 'Visual focus aids']
      }
    },
    {
      id: '2',
      name: 'Alex Rodriguez',
      avatar: '👦',
      location: 'Merida, Mexico',
      timezone: 'UTC-6',
      school: 'Global Language Academy',
      specialization: 'Linguistic Quantum Patterns',
      quantumScore: 87,
      isOnline: true,
      currentActivity: 'Translating quantum concepts',
      neurodivergentProfile: {
        type: 'Autism',
        adaptations: ['Structured communication', 'Pattern recognition']
      }
    },
    {
      id: '3',
      name: 'Sofia Wagner',
      avatar: '👧',
      location: 'Vienna, Austria',
      timezone: 'UTC+1',
      school: 'Stage Prep School',
      specialization: 'Creative Quantum Expression',
      quantumScore: 91,
      isOnline: true,
      currentActivity: 'Choreographing particle movements'
    },
    {
      id: '4',
      name: 'Marcus Thompson',
      avatar: '👦',
      location: 'London, UK',
      timezone: 'UTC+0',
      school: 'The Lawyer Makers',
      specialization: 'Quantum Legal Theory',
      quantumScore: 89,
      isOnline: true,
      currentActivity: 'Analyzing parallel legal systems'
    }
  ]

  const collaborationSessions: CollaborationSession[] = [
    {
      id: '1',
      title: 'Global Climate Solutions',
      type: 'project',
      participants: ['1', '2', '3'],
      leader: '1',
      startTime: new Date(),
      duration: 90,
      subject: 'Environmental Science',
      quantumSyncLevel: 89,
      sharedBrainpower: 276
    },
    {
      id: '2',
      title: 'Multilingual Storytelling',
      type: 'creative',
      participants: ['2', '4'],
      leader: '2',
      startTime: new Date(),
      duration: 60,
      subject: 'Language Arts',
      quantumSyncLevel: 76,
      sharedBrainpower: 186
    }
  ]

  // Simulate quantum synchronization
  useEffect(() => {
    const interval = setInterval(() => {
      setQuantumSync(prev => Math.max(0, Math.min(100, prev + (Math.random() - 0.5) * 10)))
      setGlobalBrainpower(prev => Math.max(0, prev + Math.random() * 50 - 20))
      
      // Add new ideas to the stream
      const newIdea: QuantumIdea = {
        id: Date.now().toString(),
        author: quantumStudents[Math.floor(Math.random() * quantumStudents.length)].name,
        content: [
          "What if we could use sound waves to visualize mathematical equations?",
          "Could we create a universal translator using quantum entanglement?",
          "Imagine learning history by experiencing parallel timelines!",
          "What if dance movements could teach physics principles?"
        ][Math.floor(Math.random() * 4)],
        timestamp: new Date(),
        quantumResonance: Math.floor(Math.random() * 100),
        connections: [],
        category: ['Science', 'Art', 'Technology', 'Language'][Math.floor(Math.random() * 4)],
        collaborative: Math.random() > 0.5
      }
      
      setIdeaStream(prev => [newIdea, ...prev.slice(0, 9)])
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getQuantumColor = (score: number) => {
    if (score > 90) return 'text-purple-600 bg-purple-50'
    if (score > 80) return 'text-blue-600 bg-blue-50'
    if (score > 70) return 'text-green-600 bg-green-50'
    return 'text-yellow-600 bg-yellow-50'
  }

  const initiateQuantumConnection = (studentIds: string[]) => {
    // Simulate quantum entanglement between students
    setConnectedStudents(quantumStudents.filter(s => studentIds.includes(s.id)))
    setQuantumSync(85)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl font-bold flex items-center">
                  <Network className="w-8 h-8 mr-3" />
                  Quantum Collaboration Hub
                </CardTitle>
                <CardDescription className="text-purple-100 text-lg">
                  Instantaneous global learning through quantum-entangled minds
                </CardDescription>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{quantumSync.toFixed(0)}%</div>
                  <div className="text-xs text-purple-200">Quantum Sync</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{globalBrainpower.toFixed(0)}</div>
                  <div className="text-xs text-purple-200">Global IQ Points</div>
                </div>
                <Badge className="bg-cyan-500 text-cyan-900 hover:bg-cyan-400">
                  <Atom className="w-3 h-3 mr-1" />
                  Quantum Active
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Global Students Network */}
          <div className="space-y-4">
            <Card className="bg-gray-800 text-white border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe2 className="w-5 h-5 mr-2 text-cyan-400" />
                  Global Network
                </CardTitle>
                <CardDescription className="text-gray-300">
                  {quantumStudents.length} students across 4 continents
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {quantumStudents.map(student => (
                  <div key={student.id} className="p-3 bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{student.avatar}</span>
                        <div>
                          <div className="font-semibold text-sm">{student.name}</div>
                          <div className="text-xs text-gray-400">{student.location}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {student.isOnline && (
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        )}
                        <Badge className={getQuantumColor(student.quantumScore)} size="sm">
                          Q{student.quantumScore}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-300 mb-2">
                      {student.school} • {student.specialization}
                    </div>
                    
                    <div className="text-xs text-cyan-300 bg-cyan-900/30 p-2 rounded">
                      {student.currentActivity}
                    </div>
                    
                    {student.neurodivergentProfile && (
                      <div className="mt-2">
                        <Badge variant="outline" className="text-xs">
                          {student.neurodivergentProfile.type} Support
                        </Badge>
                      </div>
                    )}
                    
                    <Button
                      size="sm"
                      className="w-full mt-2 bg-purple-600 hover:bg-purple-700"
                      onClick={() => initiateQuantumConnection([student.id])}
                    >
                      <Zap className="w-3 h-3 mr-1" />
                      Quantum Connect
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-gray-800 text-white border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-yellow-400" />
                  Quantum Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Sync Level</span>
                  <span className="font-bold text-purple-400">{quantumSync.toFixed(0)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Active Connections</span>
                  <span className="font-bold text-blue-400">{connectedStudents.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Ideas Generated</span>
                  <span className="font-bold text-green-400">{ideaStream.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Quantum Resonance</span>
                  <span className="font-bold text-yellow-400">
                    {ideaStream.length > 0 ? ideaStream[0].quantumResonance : 0}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Collaboration Space */}
          <div className="lg:col-span-3 space-y-6">
            <Tabs defaultValue="sessions" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4 bg-gray-800 text-white">
                <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
                <TabsTrigger value="ideas">Idea Stream</TabsTrigger>
                <TabsTrigger value="quantum">Quantum Lab</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
              </TabsList>

              <TabsContent value="sessions" className="space-y-4">
                <Card className="bg-gray-800 text-white border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="w-6 h-6 mr-2 text-blue-400" />
                      Live Collaboration Sessions
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      Real-time global learning partnerships
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {collaborationSessions.map(session => (
                      <div key={session.id} className="p-4 bg-gray-700 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-lg">{session.title}</h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-300">
                              <span>📚 {session.subject}</span>
                              <span>👥 {session.participants.length} students</span>
                              <span>⏱️ {session.duration} min</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className="bg-purple-500 text-white mb-1">
                              {session.type.toUpperCase()}
                            </Badge>
                            <div className="text-xs text-gray-400">
                              Sync: {session.quantumSyncLevel}%
                            </div>
                          </div>
                        </div>

                        <div className="mb-3">
                          <div className="text-sm font-medium mb-1">Participants:</div>
                          <div className="flex items-center space-x-2">
                            {session.participants.map(participantId => {
                              const student = quantumStudents.find(s => s.id === participantId)
                              return student ? (
                                <div key={participantId} className="flex items-center space-x-1 bg-gray-600 px-2 py-1 rounded">
                                  <span>{student.avatar}</span>
                                  <span className="text-xs">{student.name}</span>
                                  {participantId === session.leader && (
                                    <Star className="w-3 h-3 text-yellow-400" />
                                  )}
                                </div>
                              ) : null
                            })}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div className="text-center p-2 bg-blue-900/30 rounded">
                            <div className="text-lg font-bold text-blue-400">{session.quantumSyncLevel}%</div>
                            <div className="text-xs text-gray-400">Quantum Sync</div>
                          </div>
                          <div className="text-center p-2 bg-purple-900/30 rounded">
                            <div className="text-lg font-bold text-purple-400">{session.sharedBrainpower}</div>
                            <div className="text-xs text-gray-400">Shared IQ</div>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                            onClick={() => setSelectedSession(session.id)}
                          >
                            <Video className="w-4 h-4 mr-1" />
                            Join Session
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            Observe
                          </Button>
                          <Button size="sm" variant="outline">
                            <Share2 className="w-4 h-4 mr-1" />
                            Share
                          </Button>
                        </div>
                      </div>
                    ))}

                    <Button className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                      <Rocket className="w-5 h-5 mr-2" />
                      Create Quantum Session
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ideas" className="space-y-4">
                <Card className="bg-gray-800 text-white border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Lightbulb className="w-6 h-6 mr-2 text-yellow-400" />
                      Global Idea Stream
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      Real-time collaborative thoughts from around the world
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex space-x-2 mb-4">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Share your quantum idea..."
                        className="flex-1 bg-gray-700 border-gray-600 text-white"
                      />
                      <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {ideaStream.map(idea => (
                        <div key={idea.id} className="p-3 bg-gray-700 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold text-sm">{idea.author}</span>
                              <Badge variant="outline" className="text-xs">
                                {idea.category}
                              </Badge>
                              {idea.collaborative && (
                                <Badge className="bg-purple-500 text-white text-xs">
                                  <Network className="w-2 h-2 mr-1" />
                                  Quantum
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs text-gray-400">
                              {idea.timestamp.toLocaleTimeString()}
                            </div>
                          </div>
                          
                          <p className="text-sm mb-2">{idea.content}</p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-xs">
                              <span className="text-yellow-400">
                                ⚡ {idea.quantumResonance}% resonance
                              </span>
                              <span className="text-gray-400">
                                🔗 {idea.connections.length} connections
                              </span>
                            </div>
                            <div className="flex space-x-1">
                              <Button size="sm" variant="ghost" className="h-6 px-2">
                                <Heart className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="ghost" className="h-6 px-2">
                                <Link className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="ghost" className="h-6 px-2">
                                <Share2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="quantum" className="space-y-4">
                <Card className="bg-gray-800 text-white border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Atom className="w-6 h-6 mr-2 text-cyan-400" />
                      Quantum Learning Laboratory
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      Experimental learning through quantum consciousness
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-cyan-400">Quantum Experiments</h4>
                        
                        <div className="p-4 bg-blue-900/30 rounded-lg">
                          <h5 className="font-semibold mb-2">Parallel Learning</h5>
                          <p className="text-sm text-gray-300 mb-3">
                            Experience multiple learning paths simultaneously
                          </p>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            <Layers className="w-4 h-4 mr-1" />
                            Enter Parallel Mode
                          </Button>
                        </div>

                        <div className="p-4 bg-purple-900/30 rounded-lg">
                          <h5 className="font-semibold mb-2">Consciousness Sync</h5>
                          <p className="text-sm text-gray-300 mb-3">
                            Share direct knowledge with other students
                          </p>
                          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                            <Brain className="w-4 h-4 mr-1" />
                            Sync Minds
                          </Button>
                        </div>

                        <div className="p-4 bg-green-900/30 rounded-lg">
                          <h5 className="font-semibold mb-2">Time Dilation Learning</h5>
                          <p className="text-sm text-gray-300 mb-3">
                            Experience accelerated learning states
                          </p>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <Clock className="w-4 h-4 mr-1" />
                            Accelerate Time
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold text-yellow-400">Quantum Insights</h4>
                        
                        <div className="space-y-2">
                          <div className="p-3 bg-yellow-900/30 rounded text-sm">
                            <strong>Entanglement Effect:</strong> When students collaborate quantumly, 
                            their learning speed increases by an average of 340%.
                          </div>
                          <div className="p-3 bg-cyan-900/30 rounded text-sm">
                            <strong>Superposition Learning:</strong> Students can grasp contradictory 
                            concepts simultaneously, improving critical thinking.
                          </div>
                          <div className="p-3 bg-purple-900/30 rounded text-sm">
                            <strong>Quantum Tunneling:</strong> Knowledge barriers become permeable, 
                            allowing breakthrough understanding.
                          </div>
                        </div>

                        <div className="p-4 bg-gray-700 rounded-lg">
                          <h5 className="font-semibold mb-2">Current Quantum State</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Coherence Level:</span>
                              <span className="text-cyan-400">{quantumSync.toFixed(0)}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Entangled Pairs:</span>
                              <span className="text-purple-400">{Math.floor(connectedStudents.length / 2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Quantum Field Strength:</span>
                              <span className="text-yellow-400">{(globalBrainpower / 10).toFixed(1)} THz</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="achievements" className="space-y-4">
                <Card className="bg-gray-800 text-white border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Trophy className="w-6 h-6 mr-2 text-gold-400" />
                      Quantum Achievements
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      Unlock new levels of consciousness and collaboration
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gold-400">Unlocked Achievements</h4>
                        
                        <div className="p-3 bg-gold-900/30 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <Award className="w-5 h-5 text-gold-400" />
                            <span className="font-semibold">Quantum Entangler</span>
                          </div>
                          <p className="text-sm text-gray-300">
                            Successfully linked minds with 5+ students globally
                          </p>
                        </div>

                        <div className="p-3 bg-purple-900/30 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <Sparkles className="w-5 h-5 text-purple-400" />
                            <span className="font-semibold">Idea Catalyst</span>
                          </div>
                          <p className="text-sm text-gray-300">
                            Generated 50+ collaborative ideas with 90%+ resonance
                          </p>
                        </div>

                        <div className="p-3 bg-blue-900/30 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <Brain className="w-5 h-5 text-blue-400" />
                            <span className="font-semibold">Consciousness Voyager</span>
                          </div>
                          <p className="text-sm text-gray-300">
                            Explored 10+ parallel learning dimensions
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-400">Next Level Goals</h4>
                        
                        <div className="p-3 bg-gray-700 rounded-lg border-2 border-dashed border-gray-600">
                          <div className="flex items-center space-x-2 mb-2">
                            <Network className="w-5 h-5 text-gray-400" />
                            <span className="font-semibold text-gray-300">Global Connector</span>
                          </div>
                          <p className="text-sm text-gray-400">
                            Link with students from all 6 continents
                          </p>
                          <div className="mt-2 text-xs text-cyan-400">Progress: 4/6 continents</div>
                        </div>

                        <div className="p-3 bg-gray-700 rounded-lg border-2 border-dashed border-gray-600">
                          <div className="flex items-center space-x-2 mb-2">
                            <Zap className="w-5 h-5 text-gray-400" />
                            <span className="font-semibold text-gray-300">Quantum Master</span>
                          </div>
                          <p className="text-sm text-gray-400">
                            Achieve 95%+ quantum synchronization
                          </p>
                          <div className="mt-2 text-xs text-purple-400">Progress: {quantumSync.toFixed(0)}/95%</div>
                        </div>

                        <div className="p-3 bg-gray-700 rounded-lg border-2 border-dashed border-gray-600">
                          <div className="flex items-center space-x-2 mb-2">
                            <Rocket className="w-5 h-5 text-gray-400" />
                            <span className="font-semibold text-gray-300">Innovation Pioneer</span>
                          </div>
                          <p className="text-sm text-gray-400">
                            Lead 10 successful quantum collaboration sessions
                          </p>
                          <div className="mt-2 text-xs text-yellow-400">Progress: 3/10 sessions</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}