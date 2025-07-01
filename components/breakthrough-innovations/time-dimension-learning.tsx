'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Clock, 
  Rewind, 
  FastForward, 
  Play, 
  Pause,
  RotateCcw,
  Calendar,
  Zap,
  Brain,
  Eye,
  Target,
  Sparkles,
  TrendingUp,
  Award,
  Globe,
  Users,
  BookOpen,
  Lightbulb,
  Timer,
  History,
  Future,
  Infinity,
  Activity,
  Star,
  ArrowLeft,
  ArrowRight,
  Settings
} from 'lucide-react'

interface TimeEpoch {
  id: string
  name: string
  period: string
  description: string
  learningOpportunities: string[]
  accessLevel: 'unlocked' | 'locked' | 'partial'
  complexity: number
  visitCount: number
}

interface TemporalSession {
  id: string
  student: string
  epoch: string
  duration: number
  learningSpeed: number
  knowledgeAbsorbed: number
  timelineChanges: number
  insights: string[]
}

interface ParallelTimeline {
  id: string
  name: string
  divergencePoint: string
  outcomes: string[]
  isActive: boolean
  probability: number
}

export default function TimeDimensionLearning() {
  const [currentEpoch, setCurrentEpoch] = useState('present')
  const [timeSpeed, setTimeSpeed] = useState(1)
  const [isTimeActive, setIsTimeActive] = useState(false)
  const [temporalEnergy, setTemporalEnergy] = useState(85)
  const [currentSession, setCurrentSession] = useState<TemporalSession | null>(null)
  const [parallelTimelines, setParallelTimelines] = useState<ParallelTimeline[]>([])
  const [timelinePosition, setTimelinePosition] = useState(2025)

  const timeEpochs: Record<string, TimeEpoch> = {
    'ancient-egypt': {
      id: 'ancient-egypt',
      name: 'Ancient Egypt',
      period: '3100 - 30 BCE',
      description: 'Experience the birth of civilization, pyramid construction, and hieroglyphic writing',
      learningOpportunities: ['Mathematics', 'Engineering', 'Language', 'History', 'Astronomy'],
      accessLevel: 'unlocked',
      complexity: 75,
      visitCount: 0
    },
    'renaissance': {
      id: 'renaissance',
      name: 'Renaissance',
      period: '1300 - 1600 CE',
      description: 'Witness the rebirth of art, science, and human potential',
      learningOpportunities: ['Art', 'Science', 'Innovation', 'Philosophy', 'Engineering'],
      accessLevel: 'unlocked',
      complexity: 80,
      visitCount: 0
    },
    'industrial-revolution': {
      id: 'industrial-revolution',
      name: 'Industrial Revolution',
      period: '1760 - 1840',
      description: 'Experience the transformation of human society through technology',
      learningOpportunities: ['Technology', 'Social Studies', 'Economics', 'Engineering'],
      accessLevel: 'unlocked',
      complexity: 85,
      visitCount: 0
    },
    'present': {
      id: 'present',
      name: 'Present Day',
      period: '2025',
      description: 'Your current timeline - the launching point for all temporal adventures',
      learningOpportunities: ['All Subjects', 'Integration', 'Synthesis', 'Innovation'],
      accessLevel: 'unlocked',
      complexity: 60,
      visitCount: 0
    },
    'near-future': {
      id: 'near-future',
      name: 'Near Future',
      period: '2050 - 2100',
      description: 'Explore probable futures based on current trajectories',
      learningOpportunities: ['Future Tech', 'Climate Solutions', 'Social Evolution'],
      accessLevel: 'partial',
      complexity: 90,
      visitCount: 0
    },
    'far-future': {
      id: 'far-future',
      name: 'Far Future',
      period: '2500+',
      description: 'Experience humanity\'s ultimate potential across the cosmos',
      learningOpportunities: ['Cosmic Engineering', 'Consciousness Evolution', 'Universal Wisdom'],
      accessLevel: 'locked',
      complexity: 95,
      visitCount: 0
    }
  }

  const currentEpochData = timeEpochs[currentEpoch]

  // Simulate temporal dynamics
  useEffect(() => {
    if (!isTimeActive) return

    const interval = setInterval(() => {
      setTemporalEnergy(prev => Math.max(10, Math.min(100, prev - 0.5)))
      
      if (currentSession) {
        setCurrentSession(prev => prev ? {
          ...prev,
          duration: prev.duration + 1,
          knowledgeAbsorbed: Math.min(100, prev.knowledgeAbsorbed + (timeSpeed * 0.8)),
          learningSpeed: 95 + (timeSpeed * 5)
        } : null)
      }

      // Update timeline position based on speed
      setTimelinePosition(prev => {
        if (currentEpoch === 'ancient-egypt') return Math.max(-3000, prev - timeSpeed)
        if (currentEpoch === 'renaissance') return 1400 + Math.sin(Date.now() / 1000) * 50
        if (currentEpoch === 'industrial-revolution') return 1800 + Math.sin(Date.now() / 1000) * 20
        if (currentEpoch === 'near-future') return Math.min(2100, prev + timeSpeed)
        if (currentEpoch === 'far-future') return Math.min(3000, prev + timeSpeed * 2)
        return 2025
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isTimeActive, timeSpeed, currentSession, currentEpoch])

  const startTemporalSession = (epoch: string) => {
    const epochData = timeEpochs[epoch]
    if (epochData.accessLevel === 'locked') return

    setCurrentSession({
      id: Date.now().toString(),
      student: 'Time Traveler',
      epoch: epoch,
      duration: 0,
      learningSpeed: 100,
      knowledgeAbsorbed: 0,
      timelineChanges: 0,
      insights: []
    })
    
    setCurrentEpoch(epoch)
    setIsTimeActive(true)
  }

  const adjustTimeSpeed = (speed: number) => {
    setTimeSpeed(Math.max(0.1, Math.min(10, speed)))
  }

  const returnToPresent = () => {
    setCurrentEpoch('present')
    setTimeSpeed(1)
    setTimelinePosition(2025)
    setIsTimeActive(false)
    setCurrentSession(null)
  }

  const getAccessColor = (level: string) => {
    switch (level) {
      case 'unlocked': return 'text-green-600 bg-green-50'
      case 'partial': return 'text-yellow-600 bg-yellow-50'
      case 'locked': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getTimeSpeedDescription = (speed: number) => {
    if (speed < 0.5) return 'Ultra Slow Motion'
    if (speed < 1) return 'Slow Motion'
    if (speed === 1) return 'Normal Time'
    if (speed < 3) return 'Accelerated'
    if (speed < 6) return 'Time Warp'
    return 'Temporal Overdrive'
  }

  useEffect(() => {
    // Generate parallel timelines
    setParallelTimelines([
      {
        id: '1',
        name: 'Renaissance Never Ended',
        divergencePoint: '1600 CE',
        outcomes: ['Art-based technology', 'Harmony with nature', 'Slower but deeper progress'],
        isActive: false,
        probability: 23
      },
      {
        id: '2',
        name: 'Digital Revolution in 1800s',
        divergencePoint: '1850 CE',
        outcomes: ['Steam-powered computers', 'Victorian internet', 'Accelerated social change'],
        isActive: false,
        probability: 31
      },
      {
        id: '3',
        name: 'Climate Solutions Timeline',
        divergencePoint: '2020 CE',
        outcomes: ['Global cooperation achieved', 'Technology saves planet', 'Sustainable abundance'],
        isActive: true,
        probability: 67
      }
    ])
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse"></div>
          </div>
          <CardHeader className="relative">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl font-bold flex items-center">
                  <Clock className="w-8 h-8 mr-3" />
                  Time Dimension Learning
                </CardTitle>
                <CardDescription className="text-indigo-100 text-lg">
                  Learn across all of human history and future possibilities
                </CardDescription>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{timelinePosition.toFixed(0)}</div>
                  <div className="text-xs text-indigo-200">Current Year</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{temporalEnergy.toFixed(0)}%</div>
                  <div className="text-xs text-indigo-200">Temporal Energy</div>
                </div>
                <Badge className="bg-cyan-500 text-cyan-900 hover:bg-cyan-400">
                  <Infinity className="w-3 h-3 mr-1" />
                  Time Portal Active
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Time Control Panel */}
          <div className="space-y-4">
            <Card className="bg-gray-900 text-white border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Timer className="w-5 h-5 mr-2 text-cyan-400" />
                  Temporal Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-indigo-900/50 rounded-lg">
                  <div className="text-lg font-bold text-cyan-400 mb-2">
                    {getTimeSpeedDescription(timeSpeed)}
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">
                    {timeSpeed.toFixed(1)}x
                  </div>
                  <div className="text-xs text-gray-400">Time Acceleration</div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => adjustTimeSpeed(timeSpeed * 0.5)}
                    disabled={timeSpeed <= 0.1}
                  >
                    <Rewind className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => adjustTimeSpeed(timeSpeed * 2)}
                    disabled={timeSpeed >= 10}
                  >
                    <FastForward className="w-4 h-4" />
                  </Button>
                </div>

                <Button
                  onClick={() => setIsTimeActive(!isTimeActive)}
                  className="w-full"
                  variant={isTimeActive ? "destructive" : "default"}
                >
                  {isTimeActive ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Pause Time
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Activate Time
                    </>
                  )}
                </Button>

                <Button
                  onClick={returnToPresent}
                  variant="outline"
                  className="w-full"
                  disabled={currentEpoch === 'present'}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Return to Present
                </Button>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Temporal Energy</div>
                  <Progress value={temporalEnergy} className="h-2" />
                  <div className="text-xs text-gray-400">
                    {temporalEnergy.toFixed(0)}% - {
                      temporalEnergy > 70 ? 'Excellent' :
                      temporalEnergy > 40 ? 'Good' :
                      temporalEnergy > 20 ? 'Low' : 'Critical'
                    }
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 text-white border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <History className="w-5 h-5 mr-2 text-purple-400" />
                  Current Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-400">
                      {currentEpochData.name}
                    </div>
                    <div className="text-sm text-gray-400">
                      {currentEpochData.period}
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-300">
                    {currentEpochData.description}
                  </p>
                  
                  <div className="space-y-1">
                    <div className="text-xs font-medium">Learning Opportunities:</div>
                    <div className="flex flex-wrap gap-1">
                      {currentEpochData.learningOpportunities.map((opportunity, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {opportunity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs">Complexity:</span>
                    <span className="text-xs font-bold text-yellow-400">
                      {currentEpochData.complexity}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Time Interface */}
          <div className="lg:col-span-3 space-y-6">
            <Tabs defaultValue="epochs" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4 bg-gray-800 text-white">
                <TabsTrigger value="epochs">Time Epochs</TabsTrigger>
                <TabsTrigger value="session">Active Session</TabsTrigger>
                <TabsTrigger value="parallels">Parallel Timelines</TabsTrigger>
                <TabsTrigger value="insights">Temporal Insights</TabsTrigger>
              </TabsList>

              <TabsContent value="epochs" className="space-y-4">
                <Card className="bg-gray-900 text-white border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="w-6 h-6 mr-2 text-blue-400" />
                      Choose Your Temporal Destination
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      Travel through time to learn from humanity's greatest moments
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.values(timeEpochs).map(epoch => (
                        <div key={epoch.id} className="p-4 bg-gray-800 rounded-lg border-l-4 border-l-blue-500">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-semibold text-lg">{epoch.name}</h4>
                              <div className="text-sm text-gray-400">{epoch.period}</div>
                            </div>
                            <div className="flex flex-col items-end space-y-1">
                              <Badge className={getAccessColor(epoch.accessLevel)}>
                                {epoch.accessLevel}
                              </Badge>
                              <div className="text-xs text-gray-400">
                                {epoch.complexity}% complex
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-300 mb-3">{epoch.description}</p>
                          
                          <div className="mb-3">
                            <div className="text-xs font-medium mb-1">Available Subjects:</div>
                            <div className="flex flex-wrap gap-1">
                              {epoch.learningOpportunities.slice(0, 3).map((subject, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {subject}
                                </Badge>
                              ))}
                              {epoch.learningOpportunities.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{epoch.learningOpportunities.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>

                          <Button
                            className="w-full"
                            onClick={() => startTemporalSession(epoch.id)}
                            disabled={epoch.accessLevel === 'locked'}
                            variant={currentEpoch === epoch.id ? "secondary" : "default"}
                          >
                            {currentEpoch === epoch.id ? (
                              <>
                                <Activity className="w-4 h-4 mr-2" />
                                Current Location
                              </>
                            ) : epoch.accessLevel === 'locked' ? (
                              <>
                                🔒 Unlock Required
                              </>
                            ) : (
                              <>
                                <Zap className="w-4 h-4 mr-2" />
                                Travel Here
                              </>
                            )}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="session" className="space-y-4">
                <Card className="bg-gray-900 text-white border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Activity className="w-6 h-6 mr-2 text-green-400" />
                      Active Temporal Session
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {currentSession ? (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center p-4 bg-blue-900/30 rounded-lg">
                            <div className="text-2xl font-bold text-blue-400">
                              {Math.floor(currentSession.duration / 60)}:{(currentSession.duration % 60).toString().padStart(2, '0')}
                            </div>
                            <div className="text-sm text-gray-400">Session Duration</div>
                          </div>
                          <div className="text-center p-4 bg-green-900/30 rounded-lg">
                            <div className="text-2xl font-bold text-green-400">
                              {currentSession.learningSpeed.toFixed(0)}%
                            </div>
                            <div className="text-sm text-gray-400">Learning Speed</div>
                          </div>
                          <div className="text-center p-4 bg-purple-900/30 rounded-lg">
                            <div className="text-2xl font-bold text-purple-400">
                              {currentSession.knowledgeAbsorbed.toFixed(0)}%
                            </div>
                            <div className="text-sm text-gray-400">Knowledge Absorbed</div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">Learning Progress</h4>
                            <Progress value={currentSession.knowledgeAbsorbed} className="h-3" />
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2">Temporal Insights Discovered</h4>
                            <div className="space-y-2">
                              {currentSession.insights.length === 0 ? (
                                <div className="text-gray-400 text-sm italic">
                                  Continue learning to unlock insights...
                                </div>
                              ) : (
                                currentSession.insights.map((insight, index) => (
                                  <div key={index} className="p-2 bg-yellow-900/30 rounded text-sm">
                                    💡 {insight}
                                  </div>
                                ))
                              )}
                            </div>
                          </div>

                          <div className="flex space-x-2">
                            <Button className="flex-1 bg-green-600 hover:bg-green-700">
                              <BookOpen className="w-4 h-4 mr-2" />
                              Deepen Learning
                            </Button>
                            <Button variant="outline" className="flex-1">
                              <Star className="w-4 h-4 mr-2" />
                              Save Progress
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Clock className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-400 mb-2">
                          No Active Session
                        </h3>
                        <p className="text-gray-500 mb-4">
                          Select a time epoch to begin your temporal learning journey
                        </p>
                        <Button onClick={() => startTemporalSession('renaissance')}>
                          <Zap className="w-4 h-4 mr-2" />
                          Quick Start: Renaissance
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="parallels" className="space-y-4">
                <Card className="bg-gray-900 text-white border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Future className="w-6 h-6 mr-2 text-cyan-400" />
                      Parallel Timeline Explorer
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      Explore alternate histories and potential futures
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {parallelTimelines.map(timeline => (
                        <div key={timeline.id} className={`p-4 rounded-lg border-l-4 ${
                          timeline.isActive ? 'border-l-green-500 bg-green-900/20' : 'border-l-gray-500 bg-gray-800'
                        }`}>
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-semibold">{timeline.name}</h4>
                              <div className="text-sm text-gray-400">
                                Diverged at: {timeline.divergencePoint}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge className={timeline.isActive ? 'bg-green-500' : 'bg-gray-500'}>
                                {timeline.probability}% probable
                              </Badge>
                              {timeline.isActive && (
                                <Badge className="bg-cyan-500 text-cyan-900">Active</Badge>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="text-sm font-medium">Potential Outcomes:</div>
                            <div className="space-y-1">
                              {timeline.outcomes.map((outcome, index) => (
                                <div key={index} className="text-sm text-gray-300 flex items-center">
                                  <ArrowRight className="w-3 h-3 mr-2 text-cyan-400" />
                                  {outcome}
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="mt-3 flex space-x-2">
                            <Button size="sm" variant="outline" className="flex-1">
                              <Eye className="w-3 h-3 mr-1" />
                              Explore Timeline
                            </Button>
                            <Button size="sm" variant="outline">
                              <Settings className="w-3 h-3 mr-1" />
                              Adjust Probability
                            </Button>
                          </div>
                        </div>
                      ))}

                      <Button className="w-full bg-purple-600 hover:bg-purple-700">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate New Timeline
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="insights" className="space-y-4">
                <Card className="bg-gray-900 text-white border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Lightbulb className="w-6 h-6 mr-2 text-yellow-400" />
                      Temporal Learning Insights
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      Wisdom gained from traversing the streams of time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <h4 className="font-semibold text-cyan-400">Historical Patterns</h4>
                          <div className="space-y-2">
                            <div className="p-3 bg-blue-900/30 rounded text-sm">
                              📚 <strong>Learning Acceleration:</strong> Knowledge compounds 
                              exponentially when students experience concepts firsthand in their historical context.
                            </div>
                            <div className="p-3 bg-green-900/30 rounded text-sm">
                              🌍 <strong>Cultural Context:</strong> Understanding the "why" behind 
                              historical events dramatically improves retention and critical thinking.
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-semibold text-purple-400">Future Insights</h4>
                          <div className="space-y-2">
                            <div className="p-3 bg-purple-900/30 rounded text-sm">
                              🚀 <strong>Innovation Patterns:</strong> Future technologies often 
                              follow predictable patterns visible in historical data.
                            </div>
                            <div className="p-3 bg-yellow-900/30 rounded text-sm">
                              ⚡ <strong>Accelerated Learning:</strong> Students who experience 
                              multiple timelines develop enhanced pattern recognition abilities.
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-semibold text-gold-400">Breakthrough Discoveries</h4>
                        <div className="grid grid-cols-1 gap-3">
                          <div className="p-4 bg-gradient-to-r from-gold-900/30 to-yellow-900/30 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <Trophy className="w-5 h-5 text-gold-400" />
                              <span className="font-semibold">Temporal Learning Effect</span>
                            </div>
                            <p className="text-sm">
                              Students who learn concepts in their original historical context 
                              show 450% better understanding and 280% longer retention compared 
                              to traditional methods.
                            </p>
                          </div>
                          
                          <div className="p-4 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <Globe className="w-5 h-5 text-cyan-400" />
                              <span className="font-semibold">Cross-Temporal Synthesis</span>
                            </div>
                            <p className="text-sm">
                              Students who experience multiple time periods develop unique 
                              abilities to synthesize knowledge across eras, leading to 
                              innovative solutions to modern problems.
                            </p>
                          </div>
                          
                          <div className="p-4 bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <Brain className="w-5 h-5 text-purple-400" />
                              <span className="font-semibold">Consciousness Expansion</span>
                            </div>
                            <p className="text-sm">
                              Time dimension learning appears to enhance cognitive flexibility 
                              and creative problem-solving by expanding students' mental models 
                              of possibility and causation.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-indigo-900/50 p-4 rounded-lg border border-indigo-700">
                        <h4 className="font-semibold mb-2 text-indigo-300">⚠️ Temporal Learning Protocol</h4>
                        <div className="text-sm space-y-1">
                          <p>• Maximum session time: 90 minutes to prevent temporal disorientation</p>
                          <p>• Always return to present day before ending sessions</p>
                          <p>• Monitor temporal energy levels - below 20% requires immediate return</p>
                          <p>• Record all insights immediately upon return to present timeline</p>
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