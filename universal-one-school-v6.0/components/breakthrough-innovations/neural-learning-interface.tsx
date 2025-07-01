'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Brain, 
  Eye, 
  Waves, 
  Zap, 
  Target, 
  Heart,
  Activity,
  Lightbulb,
  Focus,
  Timer,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Pause,
  Play,
  Settings,
  Monitor,
  Camera,
  Volume2,
  Headphones,
  Sparkles,
  Gauge
} from 'lucide-react'

interface NeuroFeedback {
  attentionLevel: number
  stressLevel: number
  engagementScore: number
  cognitiveLoad: number
  learningOptimization: number
  brainwavePatterns: {
    alpha: number
    beta: number
    theta: number
    gamma: number
  }
}

interface AdaptiveResponse {
  type: 'content' | 'environment' | 'pace' | 'modality'
  action: string
  reasoning: string
  confidence: number
}

export default function NeuralLearningInterface() {
  const [isActive, setIsActive] = useState(false)
  const [currentSession, setCurrentSession] = useState(0)
  const [neurofeedback, setNeurofeedback] = useState<NeuroFeedback>({
    attentionLevel: 75,
    stressLevel: 23,
    engagementScore: 88,
    cognitiveLoad: 62,
    learningOptimization: 92,
    brainwavePatterns: {
      alpha: 45,
      beta: 35,
      theta: 15,
      gamma: 5
    }
  })
  
  const [adaptiveResponses, setAdaptiveResponses] = useState<AdaptiveResponse[]>([])
  const [eyeTrackingData, setEyeTrackingData] = useState({
    gazePosition: { x: 50, y: 50 },
    focusAreas: ['text-content', 'visual-aids'],
    blinkRate: 18,
    pupilDilation: 4.2
  })

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [brainwaveVisual, setBrainwaveVisual] = useState<number[]>([])

  // Simulate real-time neural interface updates
  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      // Simulate neurofeedback updates
      setNeurofeedback(prev => ({
        ...prev,
        attentionLevel: Math.max(10, Math.min(100, prev.attentionLevel + (Math.random() - 0.5) * 15)),
        stressLevel: Math.max(0, Math.min(100, prev.stressLevel + (Math.random() - 0.5) * 10)),
        engagementScore: Math.max(20, Math.min(100, prev.engagementScore + (Math.random() - 0.5) * 8)),
        cognitiveLoad: Math.max(0, Math.min(100, prev.cognitiveLoad + (Math.random() - 0.5) * 12)),
        brainwavePatterns: {
          alpha: Math.max(0, Math.min(100, prev.brainwavePatterns.alpha + (Math.random() - 0.5) * 10)),
          beta: Math.max(0, Math.min(100, prev.brainwavePatterns.beta + (Math.random() - 0.5) * 8)),
          theta: Math.max(0, Math.min(100, prev.brainwavePatterns.theta + (Math.random() - 0.5) * 6)),
          gamma: Math.max(0, Math.min(100, prev.brainwavePatterns.gamma + (Math.random() - 0.5) * 4))
        }
      }))

      // Update eye tracking
      setEyeTrackingData(prev => ({
        ...prev,
        gazePosition: {
          x: Math.max(0, Math.min(100, prev.gazePosition.x + (Math.random() - 0.5) * 20)),
          y: Math.max(0, Math.min(100, prev.gazePosition.y + (Math.random() - 0.5) * 20))
        },
        blinkRate: Math.max(10, Math.min(30, prev.blinkRate + (Math.random() - 0.5) * 4)),
        pupilDilation: Math.max(2, Math.min(8, prev.pupilDilation + (Math.random() - 0.5) * 0.8))
      }))

      // Update brainwave visualization
      setBrainwaveVisual(prev => {
        const newData = [...prev, Math.sin(Date.now() / 200) * 50 + 50].slice(-50)
        return newData
      })

      setCurrentSession(prev => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive])

  // Generate adaptive responses based on neural data
  useEffect(() => {
    if (neurofeedback.attentionLevel < 40) {
      const response: AdaptiveResponse = {
        type: 'environment',
        action: 'Reduce visual distractions and increase contrast',
        reasoning: 'Low attention detected - simplifying environment',
        confidence: 0.85
      }
      setAdaptiveResponses(prev => [response, ...prev.slice(0, 4)])
    }

    if (neurofeedback.stressLevel > 70) {
      const response: AdaptiveResponse = {
        type: 'pace',
        action: 'Suggest 5-minute mindfulness break',
        reasoning: 'High stress levels detected - recommending break',
        confidence: 0.92
      }
      setAdaptiveResponses(prev => [response, ...prev.slice(0, 4)])
    }

    if (neurofeedback.cognitiveLoad > 85) {
      const response: AdaptiveResponse = {
        type: 'content',
        action: 'Switch to simpler concepts and add visual aids',
        reasoning: 'Cognitive overload detected - reducing complexity',
        confidence: 0.78
      }
      setAdaptiveResponses(prev => [response, ...prev.slice(0, 4)])
    }
  }, [neurofeedback])

  const drawBrainwaves = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = '#3B82F6'
    ctx.lineWidth = 2
    ctx.beginPath()

    brainwaveVisual.forEach((value, index) => {
      const x = (index / brainwaveVisual.length) * canvas.width
      const y = (value / 100) * canvas.height
      
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()
  }

  useEffect(() => {
    drawBrainwaves()
  }, [brainwaveVisual])

  const getAttentionColor = (level: number) => {
    if (level > 80) return 'text-green-600 bg-green-50'
    if (level > 60) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const getStressColor = (level: number) => {
    if (level < 30) return 'text-green-600 bg-green-50'
    if (level < 60) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl font-bold flex items-center">
                  <Brain className="w-8 h-8 mr-3" />
                  Neural Learning Interface
                </CardTitle>
                <CardDescription className="text-indigo-100 text-lg">
                  Real-time brain-computer interface for optimized learning
                </CardDescription>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => setIsActive(!isActive)}
                  size="lg"
                  variant={isActive ? "destructive" : "secondary"}
                  className="bg-white text-indigo-600 hover:bg-gray-100"
                >
                  {isActive ? (
                    <>
                      <Pause className="w-5 h-5 mr-2" />
                      Stop Session
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Start Session
                    </>
                  )}
                </Button>
                {isActive && (
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm">Neural Link Active</span>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Real-Time Neural Metrics */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Eye className="w-5 h-5 mr-2 text-blue-600" />
                  Attention Level
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${getAttentionColor(neurofeedback.attentionLevel).split(' ')[0]} mb-2`}>
                  {neurofeedback.attentionLevel.toFixed(0)}%
                </div>
                <Progress value={neurofeedback.attentionLevel} className="h-3 mb-2" />
                <Badge className={getAttentionColor(neurofeedback.attentionLevel)}>
                  {neurofeedback.attentionLevel > 80 ? 'Excellent' : 
                   neurofeedback.attentionLevel > 60 ? 'Good' : 'Needs Support'}
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-red-600" />
                  Stress Level
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${getStressColor(neurofeedback.stressLevel).split(' ')[0]} mb-2`}>
                  {neurofeedback.stressLevel.toFixed(0)}%
                </div>
                <Progress value={neurofeedback.stressLevel} className="h-3 mb-2" />
                <Badge className={getStressColor(neurofeedback.stressLevel)}>
                  {neurofeedback.stressLevel < 30 ? 'Relaxed' : 
                   neurofeedback.stressLevel < 60 ? 'Moderate' : 'High Stress'}
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-green-600" />
                  Engagement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {neurofeedback.engagementScore.toFixed(0)}%
                </div>
                <Progress value={neurofeedback.engagementScore} className="h-3 mb-2" />
                <Badge className="text-green-600 bg-green-50">
                  Highly Engaged
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Gauge className="w-5 h-5 mr-2 text-purple-600" />
                  Cognitive Load
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {neurofeedback.cognitiveLoad.toFixed(0)}%
                </div>
                <Progress value={neurofeedback.cognitiveLoad} className="h-3 mb-2" />
                <Badge className="text-purple-600 bg-purple-50">
                  Optimal Range
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Main Neural Interface */}
          <div className="lg:col-span-3 space-y-6">
            <Tabs defaultValue="brainwaves" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="brainwaves">Brainwave Patterns</TabsTrigger>
                <TabsTrigger value="eyetracking">Eye Tracking</TabsTrigger>
                <TabsTrigger value="adaptive">AI Adaptations</TabsTrigger>
                <TabsTrigger value="optimization">Learning Optimization</TabsTrigger>
              </TabsList>

              <TabsContent value="brainwaves" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Waves className="w-6 h-6 mr-2 text-blue-600" />
                      Real-Time Brainwave Activity
                    </CardTitle>
                    <CardDescription>
                      Live EEG monitoring with adaptive learning optimization
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-gray-900 p-4 rounded-lg">
                      <canvas
                        ref={canvasRef}
                        width={800}
                        height={200}
                        className="w-full border border-gray-700 rounded"
                      />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(neurofeedback.brainwavePatterns).map(([wave, value]) => (
                        <div key={wave} className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-xl font-bold text-blue-600">{value.toFixed(0)}%</div>
                          <div className="text-sm text-gray-600 capitalize">{wave} Waves</div>
                          <Progress value={value} className="mt-2 h-2" />
                        </div>
                      ))}
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Neural State Analysis</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>Alpha (8-12 Hz):</strong> Relaxed, creative state - optimal for learning</p>
                        <p><strong>Beta (13-30 Hz):</strong> Alert, focused attention - good for problem solving</p>
                        <p><strong>Theta (4-7 Hz):</strong> Deep creativity and memory consolidation</p>
                        <p><strong>Gamma (30+ Hz):</strong> Peak cognitive performance and insight</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="eyetracking" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Eye className="w-6 h-6 mr-2 text-green-600" />
                      Advanced Eye Tracking Analytics
                    </CardTitle>
                    <CardDescription>
                      Gaze patterns, attention mapping, and reading behavior analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="relative bg-gray-100 p-8 rounded-lg h-64">
                      <div className="text-center text-gray-600 mb-4">Content Display Area</div>
                      <div 
                        className="absolute w-4 h-4 bg-red-500 rounded-full transform -translate-x-2 -translate-y-2 animate-pulse"
                        style={{
                          left: `${eyeTrackingData.gazePosition.x}%`,
                          top: `${eyeTrackingData.gazePosition.y}%`
                        }}
                      />
                      <div className="absolute bottom-4 left-4 text-sm text-gray-500">
                        🔴 Current Gaze Position
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{eyeTrackingData.blinkRate}</div>
                        <div className="text-sm text-gray-600">Blinks/min</div>
                        <div className="text-xs text-gray-500 mt-1">Normal: 15-20</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{eyeTrackingData.pupilDilation.toFixed(1)}mm</div>
                        <div className="text-sm text-gray-600">Pupil Size</div>
                        <div className="text-xs text-gray-500 mt-1">Cognitive load indicator</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">94%</div>
                        <div className="text-sm text-gray-600">Reading Efficiency</div>
                        <div className="text-xs text-gray-500 mt-1">Words/min comprehension</div>
                      </div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Focus Areas Detected</h4>
                      <div className="flex flex-wrap gap-2">
                        {eyeTrackingData.focusAreas.map((area, index) => (
                          <Badge key={index} className="bg-green-100 text-green-800">
                            {area.replace('-', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="adaptive" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Lightbulb className="w-6 h-6 mr-2 text-yellow-600" />
                      AI-Powered Real-Time Adaptations
                    </CardTitle>
                    <CardDescription>
                      Automatic learning environment optimization based on neural feedback
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {adaptiveResponses.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Sparkles className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>Neural analysis in progress...</p>
                        <p className="text-sm">AI will suggest adaptations based on your brain activity</p>
                      </div>
                    ) : (
                      adaptiveResponses.map((response, index) => (
                        <div key={index} className="border rounded-lg p-4 bg-gradient-to-r from-yellow-50 to-orange-50">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <Badge className="bg-yellow-100 text-yellow-800 capitalize">
                                  {response.type}
                                </Badge>
                                <span className="text-sm text-gray-500">
                                  Confidence: {(response.confidence * 100).toFixed(0)}%
                                </span>
                              </div>
                              <h4 className="font-semibold text-gray-900">{response.action}</h4>
                              <p className="text-sm text-gray-600 mt-1">{response.reasoning}</p>
                            </div>
                            <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                              Apply
                            </Button>
                          </div>
                        </div>
                      ))
                    )}

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Neural Adaptation Types</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong>Content:</strong> Difficulty, pace, examples
                        </div>
                        <div>
                          <strong>Environment:</strong> Colors, sounds, distractions
                        </div>
                        <div>
                          <strong>Modality:</strong> Visual, auditory, kinesthetic
                        </div>
                        <div>
                          <strong>Pace:</strong> Speed, breaks, chunking
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="optimization" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="w-6 h-6 mr-2 text-indigo-600" />
                      Learning Optimization Dashboard
                    </CardTitle>
                    <CardDescription>
                      Performance metrics and neural learning efficiency
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                      <div className="text-4xl font-bold text-indigo-600 mb-2">
                        {neurofeedback.learningOptimization.toFixed(0)}%
                      </div>
                      <div className="text-lg text-gray-700">Neural Learning Efficiency</div>
                      <Progress value={neurofeedback.learningOptimization} className="mt-3 h-3" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold">Optimization Metrics</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Memory Retention</span>
                            <span className="font-semibold">96%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Focus Duration</span>
                            <span className="font-semibold">23 min</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Learning Speed</span>
                            <span className="font-semibold">+34%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Comprehension Rate</span>
                            <span className="font-semibold">89%</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold">Neural Insights</h4>
                        <div className="space-y-2">
                          <div className="flex items-center p-2 bg-green-50 rounded">
                            <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                            <span className="text-sm">Optimal alpha wave activity</span>
                          </div>
                          <div className="flex items-center p-2 bg-blue-50 rounded">
                            <CheckCircle className="w-4 h-4 text-blue-600 mr-2" />
                            <span className="text-sm">Sustained attention patterns</span>
                          </div>
                          <div className="flex items-center p-2 bg-yellow-50 rounded">
                            <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2" />
                            <span className="text-sm">Consider movement break soon</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Session Summary</h4>
                      <p className="text-sm text-gray-700">
                        Your brain is showing excellent learning patterns! Neural feedback indicates 
                        optimal engagement with enhanced memory consolidation. The AI has made 
                        {adaptiveResponses.length} real-time optimizations to maintain peak performance.
                      </p>
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