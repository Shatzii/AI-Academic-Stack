'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { 
  Brain, 
  Zap, 
  Target, 
  Activity, 
  TrendingUp,
  Clock,
  Settings,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react'

interface LearningModule {
  id: string
  title: string
  subject: string
  currentDifficulty: number
  adaptiveLevel: number
  completionRate: number
  timeSpent: number
  accuracy: number
  status: 'active' | 'paused' | 'completed'
  adaptations: string[]
}

interface AdaptiveSettings {
  autoAdjust: boolean
  sensitivity: number
  minDifficulty: number
  maxDifficulty: number
  adaptationSpeed: number
}

export default function LearningEngine() {
  const [modules, setModules] = useState<LearningModule[]>([
    {
      id: '1',
      title: 'Algebraic Equations',
      subject: 'Mathematics',
      currentDifficulty: 3,
      adaptiveLevel: 75,
      completionRate: 68,
      timeSpent: 45,
      accuracy: 87,
      status: 'active',
      adaptations: ['Increased complexity', 'Added word problems', 'Reduced scaffolding']
    },
    {
      id: '2',
      title: 'Reading Comprehension',
      subject: 'English',
      currentDifficulty: 2,
      adaptiveLevel: 45,
      completionRate: 72,
      timeSpent: 38,
      accuracy: 72,
      status: 'active',
      adaptations: ['Maintained level', 'Added vocabulary support', 'Enhanced visuals']
    },
    {
      id: '3',
      title: 'Cell Biology',
      subject: 'Science',
      currentDifficulty: 4,
      adaptiveLevel: 60,
      completionRate: 45,
      timeSpent: 52,
      accuracy: 65,
      status: 'active',
      adaptations: ['Decreased complexity', 'Added diagrams', 'Increased practice']
    }
  ])

  const [settings, setSettings] = useState<AdaptiveSettings>({
    autoAdjust: true,
    sensitivity: 75,
    minDifficulty: 1,
    maxDifficulty: 5,
    adaptationSpeed: 50
  })

  const [isEngineRunning, setIsEngineRunning] = useState(true)

  const getDifficultyColor = (level: number) => {
    if (level <= 1) return 'text-blue-600'
    if (level <= 2) return 'text-green-600'
    if (level <= 3) return 'text-yellow-600'
    if (level <= 4) return 'text-orange-600'
    return 'text-red-600'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleModuleToggle = (moduleId: string) => {
    setModules(modules.map(module => 
      module.id === moduleId 
        ? { ...module, status: module.status === 'active' ? 'paused' : 'active' }
        : module
    ))
  }

  const handleResetModule = (moduleId: string) => {
    setModules(modules.map(module => 
      module.id === moduleId 
        ? { ...module, adaptiveLevel: 50, currentDifficulty: 3, adaptations: ['Reset to baseline'] }
        : module
    ))
  }

  const simulateAdaptation = () => {
    if (!isEngineRunning) return

    setModules(modules.map(module => {
      if (module.status !== 'active') return module

      const performanceScore = (module.accuracy + module.completionRate) / 2
      let newDifficulty = module.currentDifficulty
      let newAdaptations = [...module.adaptations]

      if (performanceScore > 85 && module.currentDifficulty < settings.maxDifficulty) {
        newDifficulty = Math.min(settings.maxDifficulty, module.currentDifficulty + 0.5)
        newAdaptations.push('Increased difficulty due to high performance')
      } else if (performanceScore < 60 && module.currentDifficulty > settings.minDifficulty) {
        newDifficulty = Math.max(settings.minDifficulty, module.currentDifficulty - 0.5)
        newAdaptations.push('Decreased difficulty to improve confidence')
      } else {
        newAdaptations.push('Maintained current level')
      }

      return {
        ...module,
        currentDifficulty: newDifficulty,
        adaptiveLevel: Math.min(100, module.adaptiveLevel + Math.random() * 10 - 5),
        adaptations: newAdaptations.slice(-3) // Keep only last 3 adaptations
      }
    }))
  }

  useEffect(() => {
    if (!isEngineRunning) return

    const interval = setInterval(simulateAdaptation, 10000) // Simulate every 10 seconds
    return () => clearInterval(interval)
  }, [isEngineRunning, settings])

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3">
          <Zap className="h-8 w-8 text-orange-500" />
          Adaptive Learning Engine
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Real-time difficulty adjustment engine that optimizes learning content based on student performance
        </p>
      </div>

      {/* Engine Controls */}
      <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-orange-600" />
              Engine Status
            </span>
            <div className="flex items-center gap-3">
              <Badge className={isEngineRunning ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {isEngineRunning ? 'Active' : 'Paused'}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEngineRunning(!isEngineRunning)}
              >
                {isEngineRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isEngineRunning ? 'Pause' : 'Start'}
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            {isEngineRunning 
              ? 'Engine is actively monitoring and adjusting difficulty levels'
              : 'Engine is paused - no automatic adjustments will be made'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {modules.filter(m => m.status === 'active').length}
              </div>
              <p className="text-sm text-gray-600">Active Modules</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {modules.reduce((acc, m) => acc + m.adaptations.length, 0)}
              </div>
              <p className="text-sm text-gray-600">Total Adaptations</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {Math.round(modules.reduce((acc, m) => acc + m.accuracy, 0) / modules.length)}%
              </div>
              <p className="text-sm text-gray-600">Avg Accuracy</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {modules.map((module) => (
          <Card key={module.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{module.title}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(module.status)}>
                    {module.status}
                  </Badge>
                  <Badge variant="outline">
                    {module.subject}
                  </Badge>
                </div>
              </div>
              <CardDescription>
                Difficulty Level: <span className={getDifficultyColor(module.currentDifficulty)}>
                  {module.currentDifficulty.toFixed(1)}/5.0
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Performance Metrics */}
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="text-center">
                  <div className="font-semibold">{module.accuracy}%</div>
                  <div className="text-gray-600">Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">{module.completionRate}%</div>
                  <div className="text-gray-600">Complete</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">{module.timeSpent}m</div>
                  <div className="text-gray-600">Time</div>
                </div>
              </div>

              {/* Adaptive Level Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Adaptive Learning Progress</span>
                  <span className="font-medium">{module.adaptiveLevel}%</span>
                </div>
                <Progress value={module.adaptiveLevel} className="h-2" />
              </div>

              {/* Recent Adaptations */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Recent Adaptations:</h4>
                <div className="space-y-1">
                  {module.adaptations.slice(-2).map((adaptation, idx) => (
                    <div key={idx} className="text-xs bg-gray-50 p-2 rounded">
                      • {adaptation}
                    </div>
                  ))}
                </div>
              </div>

              {/* Module Controls */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleModuleToggle(module.id)}
                >
                  {module.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {module.status === 'active' ? 'Pause' : 'Resume'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleResetModule(module.id)}
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Engine Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-6 w-6 text-gray-600" />
            Adaptive Engine Settings
          </CardTitle>
          <CardDescription>
            Configure how the AI engine adjusts difficulty levels
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Auto-Adjust Difficulty</h4>
                  <p className="text-sm text-gray-600">Enable automatic difficulty adjustments</p>
                </div>
                <Switch
                  checked={settings.autoAdjust}
                  onCheckedChange={(checked) => setSettings({...settings, autoAdjust: checked})}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Sensitivity Level</h4>
                  <span className="text-sm font-medium">{settings.sensitivity}%</span>
                </div>
                <Slider
                  value={[settings.sensitivity]}
                  onValueChange={(value) => setSettings({...settings, sensitivity: value[0]})}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <p className="text-xs text-gray-600">How quickly the system responds to performance changes</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Adaptation Speed</h4>
                  <span className="text-sm font-medium">{settings.adaptationSpeed}%</span>
                </div>
                <Slider
                  value={[settings.adaptationSpeed]}
                  onValueChange={(value) => setSettings({...settings, adaptationSpeed: value[0]})}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <p className="text-xs text-gray-600">Rate of difficulty level changes</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Minimum Difficulty</h4>
                  <span className="text-sm font-medium">{settings.minDifficulty}</span>
                </div>
                <Slider
                  value={[settings.minDifficulty]}
                  onValueChange={(value) => setSettings({...settings, minDifficulty: value[0]})}
                  min={1}
                  max={3}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Maximum Difficulty</h4>
                  <span className="text-sm font-medium">{settings.maxDifficulty}</span>
                </div>
                <Slider
                  value={[settings.maxDifficulty]}
                  onValueChange={(value) => setSettings({...settings, maxDifficulty: value[0]})}
                  min={3}
                  max={5}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="pt-4">
                <Button className="w-full">
                  Save Engine Settings
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}