'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Brain, 
  Heart, 
  Eye, 
  Ear, 
  Hand, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw,
  Settings,
  Zap,
  Wind,
  Waves
} from 'lucide-react'

interface SensoryActivity {
  id: string
  name: string
  type: 'visual' | 'auditory' | 'tactile' | 'movement' | 'breathing'
  duration: number
  description: string
  instructions: string[]
  neurotype: string[]
  difficulty: 'easy' | 'medium' | 'hard'
}

export default function SensoryBreakSystem() {
  const [selectedNeurotype, setSelectedNeurotype] = useState<string>('ADHD')
  const [currentActivity, setCurrentActivity] = useState<SensoryActivity | null>(null)
  const [isActive, setIsActive] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [completedBreaks, setCompletedBreaks] = useState(0)

  const sensoryActivities: SensoryActivity[] = [
    {
      id: 'deep_breathing',
      name: 'Deep Breathing Exercise',
      type: 'breathing',
      duration: 180,
      description: 'Calming breath work to reduce anxiety and improve focus',
      instructions: [
        'Sit comfortably with your back straight',
        'Breathe in slowly through your nose for 4 counts',
        'Hold your breath for 4 counts',
        'Exhale slowly through your mouth for 6 counts',
        'Repeat this pattern'
      ],
      neurotype: ['ADHD', 'autism', 'anxiety'],
      difficulty: 'easy'
    },
    {
      id: 'fidget_sequence',
      name: 'Digital Fidget Sequence',
      type: 'tactile',
      duration: 120,
      description: 'Interactive tactile stimulation for focus and regulation',
      instructions: [
        'Follow the on-screen patterns with your finger',
        'Press and hold different textured areas',
        'Match the rhythm of the vibration patterns',
        'Focus on the tactile sensations'
      ],
      neurotype: ['ADHD', 'autism'],
      difficulty: 'medium'
    },
    {
      id: 'eye_movement',
      name: 'Eye Movement Exercise',
      type: 'visual',
      duration: 90,
      description: 'Reduce eye strain and improve visual processing',
      instructions: [
        'Follow the moving dot with your eyes only',
        'Keep your head still',
        'Blink naturally throughout',
        'Focus on smooth, controlled movements'
      ],
      neurotype: ['dyslexia', 'autism', 'processing'],
      difficulty: 'easy'
    },
    {
      id: 'progressive_muscle',
      name: 'Progressive Muscle Relaxation',
      type: 'movement',
      duration: 300,
      description: 'Systematic muscle tension and release for calming',
      instructions: [
        'Start with your toes - tense for 5 seconds, then relax',
        'Move up to your calves, thighs, and so on',
        'Tense each muscle group firmly but not painfully',
        'Notice the contrast between tension and relaxation',
        'End with deep breathing'
      ],
      neurotype: ['ADHD', 'autism', 'anxiety'],
      difficulty: 'medium'
    },
    {
      id: 'auditory_focus',
      name: 'Auditory Focus Training',
      type: 'auditory',
      duration: 150,
      description: 'Sound-based exercises to improve auditory processing',
      instructions: [
        'Listen to the layered sounds',
        'Focus on one sound at a time',
        'Identify different instruments or tones',
        'Notice how sounds fade in and out'
      ],
      neurotype: ['ADHD', 'auditory_processing'],
      difficulty: 'hard'
    },
    {
      id: 'movement_break',
      name: 'Energy Release Movement',
      type: 'movement',
      duration: 240,
      description: 'Physical movement to regulate energy and attention',
      instructions: [
        'Stand up and stretch your arms overhead',
        'Do 10 jumping jacks or march in place',
        'Roll your shoulders and neck gently',
        'Do wall push-ups if space allows',
        'End with gentle stretching'
      ],
      neurotype: ['ADHD', 'hyperactivity'],
      difficulty: 'easy'
    }
  ]

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsActive(false)
            setCompletedBreaks(prev => prev + 1)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isActive, timeRemaining])

  const startActivity = (activity: SensoryActivity) => {
    setCurrentActivity(activity)
    setTimeRemaining(activity.duration)
    setIsActive(true)
  }

  const pauseActivity = () => {
    setIsActive(!isActive)
  }

  const resetActivity = () => {
    setIsActive(false)
    setTimeRemaining(currentActivity?.duration || 0)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getActivitiesByNeurotype = () => {
    return sensoryActivities.filter(activity => 
      activity.neurotype.includes(selectedNeurotype) || 
      activity.neurotype.includes('all')
    )
  }

  const getIconForType = (type: string) => {
    switch (type) {
      case 'visual': return <Eye className="h-5 w-5" />
      case 'auditory': return <Ear className="h-5 w-5" />
      case 'tactile': return <Hand className="h-5 w-5" />
      case 'movement': return <Zap className="h-5 w-5" />
      case 'breathing': return <Wind className="h-5 w-5" />
      default: return <Brain className="h-5 w-5" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500'
      case 'medium': return 'bg-yellow-500'
      case 'hard': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-blue-600" />
            <span>Sensory Break System</span>
          </CardTitle>
          <CardDescription>
            Personalized sensory activities to support regulation and focus
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {['ADHD', 'autism', 'dyslexia', 'anxiety'].map((type) => (
              <Button
                key={type}
                variant={selectedNeurotype === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedNeurotype(type)}
              >
                {type}
              </Button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{completedBreaks}</div>
              <div className="text-sm text-gray-600">Breaks Today</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {Math.floor(completedBreaks * 2.5)}
              </div>
              <div className="text-sm text-gray-600">Minutes Regulated</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {isActive ? 'Active' : 'Ready'}
              </div>
              <div className="text-sm text-gray-600">Current Status</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Activity */}
      {currentActivity && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getIconForType(currentActivity.type)}
                <span>{currentActivity.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{currentActivity.type}</Badge>
                <div className={`w-3 h-3 rounded-full ${getDifficultyColor(currentActivity.difficulty)}`} />
              </div>
            </CardTitle>
            <CardDescription>{currentActivity.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {formatTime(timeRemaining)}
              </div>
              <Progress 
                value={currentActivity.duration > 0 ? ((currentActivity.duration - timeRemaining) / currentActivity.duration) * 100 : 0} 
                className="w-full h-3 mb-4"
              />
              <div className="flex justify-center space-x-2">
                <Button
                  onClick={pauseActivity}
                  variant={isActive ? 'secondary' : 'default'}
                  size="lg"
                >
                  {isActive ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
                <Button onClick={resetActivity} variant="outline" size="lg">
                  <RotateCcw className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Instructions:</h4>
              <ol className="space-y-1">
                {currentActivity.instructions.map((instruction, index) => (
                  <li key={index} className="text-sm flex items-start space-x-2">
                    <span className="flex-shrink-0 w-5 h-5 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Activity Selection */}
      <Tabs defaultValue="recommended" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recommended">Recommended</TabsTrigger>
          <TabsTrigger value="all">All Activities</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>

        <TabsContent value="recommended" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {getActivitiesByNeurotype().slice(0, 4).map((activity) => (
              <Card key={activity.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-lg">
                    <div className="flex items-center space-x-2">
                      {getIconForType(activity.type)}
                      <span>{activity.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">{Math.floor(activity.duration / 60)}m</span>
                      <div className={`w-3 h-3 rounded-full ${getDifficultyColor(activity.difficulty)}`} />
                    </div>
                  </CardTitle>
                  <CardDescription>{activity.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => startActivity(activity)}
                    className="w-full"
                    disabled={isActive && currentActivity?.id === activity.id}
                  >
                    {isActive && currentActivity?.id === activity.id ? 'In Progress' : 'Start Activity'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sensoryActivities.map((activity) => (
              <Card key={activity.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-base">
                    <div className="flex items-center space-x-2">
                      {getIconForType(activity.type)}
                      <span>{activity.name}</span>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${getDifficultyColor(activity.difficulty)}`} />
                  </CardTitle>
                  <CardDescription className="text-sm">{activity.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="text-xs">{activity.type}</Badge>
                    <span className="text-sm text-gray-500">{Math.floor(activity.duration / 60)}m</span>
                  </div>
                  <Button 
                    onClick={() => startActivity(activity)}
                    size="sm"
                    className="w-full"
                    disabled={isActive && currentActivity?.id === activity.id}
                  >
                    {isActive && currentActivity?.id === activity.id ? 'Active' : 'Start'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="favorites" className="space-y-4">
          <div className="text-center py-12">
            <Heart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600">No Favorites Yet</h3>
            <p className="text-gray-500">Try some activities and mark your favorites!</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Sensory Tools</CardTitle>
          <CardDescription>Instant access to common regulation tools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="h-16 flex flex-col">
              <Wind className="h-6 w-6 mb-1" />
              <span className="text-sm">Quick Breathing</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col">
              <Waves className="h-6 w-6 mb-1" />
              <span className="text-sm">Calming Sounds</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col">
              <Hand className="h-6 w-6 mb-1" />
              <span className="text-sm">Digital Fidget</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col">
              <Settings className="h-6 w-6 mb-1" />
              <span className="text-sm">Preferences</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}