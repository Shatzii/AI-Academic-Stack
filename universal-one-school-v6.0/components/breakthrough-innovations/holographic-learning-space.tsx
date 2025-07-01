'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Zap, 
  Layers, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut,
  Palette,
  Play,
  Pause,
  SkipForward,
  Volume2,
  Hand,
  Eye,
  Brain,
  Sparkles,
  Target,
  Settings,
  Download,
  Share2,
  BookOpen,
  Lightbulb,
  Globe,
  Atom,
  Dna,
  Heart,
  Mountain
} from 'lucide-react'

interface HolographicScene {
  id: string
  title: string
  subject: string
  description: string
  complexity: number
  interactivity: number
  objects: HolographicObject[]
  environment: string
}

interface HolographicObject {
  id: string
  type: 'molecule' | 'planet' | 'cell' | 'equation' | 'building' | 'ecosystem'
  name: string
  position: { x: number; y: number; z: number }
  rotation: { x: number; y: number; z: number }
  scale: number
  interactive: boolean
  properties: Record<string, any>
}

export default function HolographicLearningSpace() {
  const [currentScene, setCurrentScene] = useState<string>('solar-system')
  const [isPlaying, setIsPlaying] = useState(false)
  const [viewAngle, setViewAngle] = useState({ x: 0, y: 0, z: 0 })
  const [zoomLevel, setZoomLevel] = useState(50)
  const [selectedObject, setSelectedObject] = useState<string | null>(null)
  const [handTracking, setHandTracking] = useState(false)
  const [environmentLighting, setEnvironmentLighting] = useState(75)
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [animationFrame, setAnimationFrame] = useState(0)

  const holographicScenes: Record<string, HolographicScene> = {
    'solar-system': {
      id: 'solar-system',
      title: 'Solar System Explorer',
      subject: 'Astronomy',
      description: 'Interactive 3D solar system with planetary orbits and detailed information',
      complexity: 80,
      interactivity: 95,
      environment: 'space',
      objects: [
        {
          id: 'sun',
          type: 'planet',
          name: 'Sun',
          position: { x: 0, y: 0, z: 0 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: 3,
          interactive: true,
          properties: { temperature: '5778K', mass: '1.989×10³⁰ kg', type: 'G-type star' }
        },
        {
          id: 'earth',
          type: 'planet',
          name: 'Earth',
          position: { x: 8, y: 0, z: 0 },
          rotation: { x: 23.5, y: 0, z: 0 },
          scale: 1,
          interactive: true,
          properties: { distance: '149.6M km', period: '365.25 days', moons: 1 }
        },
        {
          id: 'mars',
          type: 'planet',
          name: 'Mars',
          position: { x: 12, y: 0, z: 0 },
          rotation: { x: 25.2, y: 0, z: 0 },
          scale: 0.8,
          interactive: true,
          properties: { distance: '227.9M km', period: '687 days', moons: 2 }
        }
      ]
    },
    'human-cell': {
      id: 'human-cell',
      title: 'Inside a Human Cell',
      subject: 'Biology',
      description: 'Journey inside a cell to explore organelles and cellular processes',
      complexity: 75,
      interactivity: 88,
      environment: 'cellular',
      objects: [
        {
          id: 'nucleus',
          type: 'cell',
          name: 'Nucleus',
          position: { x: 0, y: 0, z: 0 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: 2,
          interactive: true,
          properties: { function: 'Controls cell activities', contains: 'DNA, RNA, Nucleolus' }
        },
        {
          id: 'mitochondria',
          type: 'cell',
          name: 'Mitochondria',
          position: { x: 4, y: 2, z: 1 },
          rotation: { x: 45, y: 0, z: 0 },
          scale: 1.2,
          interactive: true,
          properties: { function: 'Powerhouse of the cell', produces: 'ATP energy' }
        }
      ]
    },
    'dna-structure': {
      id: 'dna-structure',
      title: 'DNA Double Helix',
      subject: 'Genetics',
      description: 'Explore the structure of DNA and genetic coding',
      complexity: 85,
      interactivity: 92,
      environment: 'molecular',
      objects: [
        {
          id: 'dna-helix',
          type: 'molecule',
          name: 'DNA Double Helix',
          position: { x: 0, y: 0, z: 0 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: 1,
          interactive: true,
          properties: { bases: 'A, T, G, C', structure: 'Double helix', discovery: 'Watson & Crick 1953' }
        }
      ]
    },
    'math-3d': {
      id: 'math-3d',
      title: '3D Mathematical Functions',
      subject: 'Mathematics',
      description: 'Visualize complex mathematical functions in 3D space',
      complexity: 90,
      interactivity: 85,
      environment: 'mathematical',
      objects: [
        {
          id: 'function',
          type: 'equation',
          name: 'f(x,y) = sin(x)cos(y)',
          position: { x: 0, y: 0, z: 0 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: 1,
          interactive: true,
          properties: { type: 'Trigonometric function', variables: 'x, y', range: '[-1, 1]' }
        }
      ]
    }
  }

  const currentSceneData = holographicScenes[currentScene]

  // Simulate 3D rendering and animation
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setAnimationFrame(prev => prev + 1)
      setViewAngle(prev => ({
        x: prev.x,
        y: (prev.y + 1) % 360,
        z: prev.z
      }))
    }, 100)

    return () => clearInterval(interval)
  }, [isPlaying])

  const draw3DScene = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Set background based on environment
    const backgrounds = {
      space: 'linear-gradient(to bottom, #000011, #000033)',
      cellular: 'linear-gradient(to bottom, #e6f3ff, #b3d9ff)',
      molecular: 'linear-gradient(to bottom, #f0f8ff, #e6f3ff)',
      mathematical: 'linear-gradient(to bottom, #1a1a2e, #16213e)'
    }
    
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, '#000011')
    gradient.addColorStop(1, '#000033')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw objects with pseudo-3D effect
    currentSceneData.objects.forEach((obj, index) => {
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      
      // Apply zoom and rotation
      const scale = (zoomLevel / 100) * obj.scale
      const x = centerX + (obj.position.x * scale * 20) * Math.cos(viewAngle.y * Math.PI / 180)
      const y = centerY + (obj.position.y * scale * 20)
      
      // Draw object based on type
      ctx.save()
      ctx.translate(x, y)
      
      if (obj.type === 'planet') {
        // Draw planet
        const radius = 20 * scale
        const planetColors = { sun: '#FDB813', earth: '#4A90E2', mars: '#CD5C5C' }
        ctx.fillStyle = planetColors[obj.name.toLowerCase() as keyof typeof planetColors] || '#CCCCCC'
        ctx.beginPath()
        ctx.arc(0, 0, radius, 0, 2 * Math.PI)
        ctx.fill()
        
        // Add glow effect
        const glowGradient = ctx.createRadialGradient(0, 0, radius, 0, 0, radius * 1.5)
        glowGradient.addColorStop(0, ctx.fillStyle + '40')
        glowGradient.addColorStop(1, 'transparent')
        ctx.fillStyle = glowGradient
        ctx.beginPath()
        ctx.arc(0, 0, radius * 1.5, 0, 2 * Math.PI)
        ctx.fill()
      } else if (obj.type === 'cell') {
        // Draw cell organelle
        ctx.fillStyle = obj.name === 'Nucleus' ? '#4A90E2' : '#E74C3C'
        ctx.beginPath()
        ctx.ellipse(0, 0, 15 * scale, 10 * scale, 0, 0, 2 * Math.PI)
        ctx.fill()
      } else if (obj.type === 'molecule') {
        // Draw DNA helix
        ctx.strokeStyle = '#4A90E2'
        ctx.lineWidth = 3
        ctx.beginPath()
        for (let i = 0; i < 100; i++) {
          const angle = (i / 10) + (animationFrame / 10)
          const helixY = i * 2 - 100
          const helixX1 = Math.sin(angle) * 15
          const helixX2 = Math.sin(angle + Math.PI) * 15
          
          if (i === 0) {
            ctx.moveTo(helixX1, helixY)
          } else {
            ctx.lineTo(helixX1, helixY)
          }
        }
        ctx.stroke()
      } else if (obj.type === 'equation') {
        // Draw 3D function surface
        ctx.strokeStyle = '#E74C3C'
        ctx.lineWidth = 1
        for (let i = -50; i < 50; i += 5) {
          for (let j = -50; j < 50; j += 5) {
            const x1 = i
            const y1 = j
            const z1 = Math.sin(x1 / 10) * Math.cos(y1 / 10) * 20
            
            const x2 = i + 5
            const y2 = j
            const z2 = Math.sin(x2 / 10) * Math.cos(y2 / 10) * 20
            
            ctx.beginPath()
            ctx.moveTo(x1, y1 + z1)
            ctx.lineTo(x2, y2 + z2)
            ctx.stroke()
          }
        }
      }
      
      // Draw selection indicator
      if (selectedObject === obj.id) {
        ctx.strokeStyle = '#FFD700'
        ctx.lineWidth = 3
        ctx.setLineDash([5, 5])
        ctx.beginPath()
        ctx.arc(0, 0, 30 * scale, 0, 2 * Math.PI)
        ctx.stroke()
        ctx.setLineDash([])
      }
      
      ctx.restore()
      
      // Draw label
      ctx.fillStyle = '#FFFFFF'
      ctx.font = '12px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(obj.name, x, y + 40 * scale)
    })
  }

  useEffect(() => {
    draw3DScene()
  }, [currentScene, viewAngle, zoomLevel, selectedObject, animationFrame, environmentLighting])

  const resetView = () => {
    setViewAngle({ x: 0, y: 0, z: 0 })
    setZoomLevel(50)
    setSelectedObject(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl font-bold flex items-center">
                  <Cube className="w-8 h-8 mr-3" />
                  Holographic Learning Space
                </CardTitle>
                <CardDescription className="text-blue-100 text-lg">
                  Immersive 3D learning with spatial computing and gesture control
                </CardDescription>
              </div>
              <div className="flex items-center space-x-4">
                <Badge className="bg-cyan-500 text-cyan-900 hover:bg-cyan-400">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Next-Gen Learning
                </Badge>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm">Holographic Active</span>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Scene Controls */}
          <div className="space-y-4">
            <Card className="bg-gray-800 text-white border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Layers className="w-5 h-5 mr-2 text-cyan-400" />
                  Learning Scenes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.values(holographicScenes).map((scene) => (
                  <Button
                    key={scene.id}
                    variant={currentScene === scene.id ? "default" : "ghost"}
                    className="w-full justify-start h-auto p-3 text-left"
                    onClick={() => setCurrentScene(scene.id)}
                  >
                    <div className="space-y-1">
                      <div className="font-semibold text-sm">{scene.title}</div>
                      <div className="text-xs text-gray-400">{scene.subject}</div>
                      <div className="flex items-center space-x-2 text-xs">
                        <Badge variant="outline" className="px-1 py-0">
                          {scene.complexity}% Complex
                        </Badge>
                        <Badge variant="outline" className="px-1 py-0">
                          {scene.interactivity}% Interactive
                        </Badge>
                      </div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-gray-800 text-white border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-purple-400" />
                  3D Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Zoom Level</label>
                  <Slider
                    value={[zoomLevel]}
                    onValueChange={(value) => setZoomLevel(value[0])}
                    max={200}
                    min={10}
                    step={5}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-400">{zoomLevel}%</div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Lighting</label>
                  <Slider
                    value={[environmentLighting]}
                    onValueChange={(value) => setEnvironmentLighting(value[0])}
                    max={100}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-400">{environmentLighting}%</div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" variant="outline" onClick={resetView}>
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Reset View
                  </Button>
                  <Button 
                    size="sm" 
                    variant={handTracking ? "default" : "outline"}
                    onClick={() => setHandTracking(!handTracking)}
                  >
                    <Hand className="w-4 h-4 mr-1" />
                    Hand Track
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 text-white border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2 text-green-400" />
                  Interaction Mode
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Eye className="w-4 h-4 mr-2" />
                  Eye Tracking
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Brain className="w-4 h-4 mr-2" />
                  Neural Control
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Volume2 className="w-4 h-4 mr-2" />
                  Voice Commands
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main 3D Viewport */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader className="bg-gray-800 text-white">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Globe className="w-6 h-6 mr-2 text-cyan-400" />
                    {currentSceneData.title}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => setIsPlaying(!isPlaying)}
                      size="sm"
                      variant={isPlaying ? "destructive" : "default"}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription className="text-gray-300">
                  {currentSceneData.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative bg-black">
                  <canvas
                    ref={canvasRef}
                    width={800}
                    height={500}
                    className="w-full cursor-pointer"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect()
                      const x = e.clientX - rect.left
                      const y = e.clientY - rect.top
                      // Simulate object selection based on click position
                      const clickedObject = currentSceneData.objects.find(obj => {
                        const centerX = rect.width / 2
                        const centerY = rect.height / 2
                        const objX = centerX + (obj.position.x * (zoomLevel / 100) * obj.scale * 20)
                        const objY = centerY + (obj.position.y * (zoomLevel / 100) * obj.scale * 20)
                        const distance = Math.sqrt((x - objX) ** 2 + (y - objY) ** 2)
                        return distance < 30
                      })
                      setSelectedObject(clickedObject?.id || null)
                    }}
                    onMouseMove={(e) => {
                      if (e.buttons === 1) { // Left mouse button held
                        const rect = e.currentTarget.getBoundingClientRect()
                        const deltaX = e.movementX
                        const deltaY = e.movementY
                        setViewAngle(prev => ({
                          x: Math.max(-90, Math.min(90, prev.x + deltaY * 0.5)),
                          y: (prev.y + deltaX * 0.5) % 360,
                          z: prev.z
                        }))
                      }
                    }}
                  />
                  
                  {/* Overlay UI */}
                  <div className="absolute top-4 left-4 space-y-2">
                    <Badge className="bg-black/50 text-white border-gray-600">
                      View: {viewAngle.x.toFixed(0)}°, {viewAngle.y.toFixed(0)}°
                    </Badge>
                    <Badge className="bg-black/50 text-white border-gray-600">
                      Zoom: {zoomLevel}%
                    </Badge>
                    {handTracking && (
                      <Badge className="bg-green-500/80 text-white border-green-400">
                        <Hand className="w-3 h-3 mr-1" />
                        Hand Tracking Active
                      </Badge>
                    )}
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-black/70 rounded-lg p-3 text-white text-sm">
                      <div className="flex items-center space-x-4">
                        <span>🖱️ Click & drag to rotate</span>
                        <span>🎯 Click objects to select</span>
                        <span>⚡ Use hand gestures when enabled</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Object Information Panel */}
            {selectedObject && (
              <Card className="bg-gray-800 text-white border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lightbulb className="w-5 h-5 mr-2 text-yellow-400" />
                    {currentSceneData.objects.find(obj => obj.id === selectedObject)?.name} Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(
                      currentSceneData.objects.find(obj => obj.id === selectedObject)?.properties || {}
                    ).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center">
                        <span className="text-gray-300 capitalize">{key}:</span>
                        <span className="font-semibold">{value.toString()}</span>
                      </div>
                    ))}
                    
                    <div className="mt-4 flex space-x-2">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <BookOpen className="w-4 h-4 mr-1" />
                        Learn More
                      </Button>
                      <Button size="sm" variant="outline">
                        <Zap className="w-4 h-4 mr-1" />
                        Interactive Mode
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Tabs defaultValue="learning" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3 bg-gray-800 text-white">
                <TabsTrigger value="learning">Learning Objectives</TabsTrigger>
                <TabsTrigger value="interaction">Interaction Guide</TabsTrigger>
                <TabsTrigger value="assessment">Quick Assessment</TabsTrigger>
              </TabsList>

              <TabsContent value="learning" className="space-y-4">
                <Card className="bg-gray-800 text-white border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="w-5 h-5 mr-2 text-green-400" />
                      Learning Objectives for {currentSceneData.subject}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {currentScene === 'solar-system' && (
                        <>
                          <div className="flex items-center p-2 bg-blue-900/30 rounded">
                            <Atom className="w-4 h-4 text-blue-400 mr-2" />
                            <span className="text-sm">Understand planetary distances and scale</span>
                          </div>
                          <div className="flex items-center p-2 bg-purple-900/30 rounded">
                            <Globe className="w-4 h-4 text-purple-400 mr-2" />
                            <span className="text-sm">Observe orbital mechanics and gravity</span>
                          </div>
                          <div className="flex items-center p-2 bg-green-900/30 rounded">
                            <Mountain className="w-4 h-4 text-green-400 mr-2" />
                            <span className="text-sm">Compare planetary characteristics</span>
                          </div>
                        </>
                      )}
                      {currentScene === 'human-cell' && (
                        <>
                          <div className="flex items-center p-2 bg-red-900/30 rounded">
                            <Heart className="w-4 h-4 text-red-400 mr-2" />
                            <span className="text-sm">Identify cellular organelles and functions</span>
                          </div>
                          <div className="flex items-center p-2 bg-green-900/30 rounded">
                            <Dna className="w-4 h-4 text-green-400 mr-2" />
                            <span className="text-sm">Understand cellular processes</span>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="interaction" className="space-y-4">
                <Card className="bg-gray-800 text-white border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Hand className="w-5 h-5 mr-2 text-purple-400" />
                      Advanced Interaction Methods
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h4 className="font-semibold text-cyan-400">Gesture Controls</h4>
                          <div className="text-sm space-y-1">
                            <p>👋 Wave to reset view</p>
                            <p>👆 Point to select objects</p>
                            <p>✋ Palm to pause animation</p>
                            <p>👍 Thumbs up to zoom in</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-semibold text-green-400">Voice Commands</h4>
                          <div className="text-sm space-y-1">
                            <p>"Show me Earth" - Focus on planet</p>
                            <p>"Rotate faster" - Speed control</p>
                            <p>"Explain this" - Get information</p>
                            <p>"Take me closer" - Zoom in</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-blue-900/30 p-3 rounded-lg">
                        <h4 className="font-semibold text-blue-400 mb-2">Neural Interface (Beta)</h4>
                        <p className="text-sm">Control the learning space with your thoughts! Focus on an object to select it, or imagine rotating the scene to change the view.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="assessment" className="space-y-4">
                <Card className="bg-gray-800 text-white border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Brain className="w-5 h-5 mr-2 text-yellow-400" />
                      Quick Knowledge Check
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-900/30 rounded-lg">
                        <h4 className="font-semibold mb-2">Question 1</h4>
                        <p className="text-sm mb-3">Which planet is closest to the Sun?</p>
                        <div className="space-y-2">
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            A) Venus
                          </Button>
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            B) Mercury
                          </Button>
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            C) Earth
                          </Button>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <Badge className="bg-green-500 text-white">
                          Interactive Assessment Active
                        </Badge>
                        <p className="text-sm text-gray-400 mt-2">
                          Answer by selecting objects in the 3D space!
                        </p>
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