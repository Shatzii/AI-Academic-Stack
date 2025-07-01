'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { 
  Wand2, 
  Brain, 
  Image, 
  FileText, 
  Video, 
  Volume2,
  Settings,
  Download,
  Share2,
  Lightbulb,
  Palette,
  Mic,
  Eye,
  Heart,
  Target,
  Zap,
  BookOpen,
  Users,
  Clock,
  Star,
  Check,
  RefreshCw
} from 'lucide-react'

interface ContentRequest {
  topic: string
  gradeLevel: string
  learningStyle: string
  neurodivergentSupport: string[]
  contentType: string
  duration: string
  difficulty: string
}

interface GeneratedContent {
  id: string
  type: string
  title: string
  content: string
  adaptations: string[]
  estimatedTime: string
  preview?: string
}

export default function AIContentGenerator() {
  const [contentRequest, setContentRequest] = useState<ContentRequest>({
    topic: '',
    gradeLevel: '4',
    learningStyle: 'visual',
    neurodivergentSupport: [],
    contentType: 'lesson',
    duration: '30',
    difficulty: 'medium'
  })

  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([])
  const [activePreview, setActivePreview] = useState<string | null>(null)

  const learningStyles = [
    { value: 'visual', label: 'Visual', icon: Eye, color: 'text-blue-600' },
    { value: 'auditory', label: 'Auditory', icon: Volume2, color: 'text-green-600' },
    { value: 'kinesthetic', label: 'Kinesthetic', icon: Heart, color: 'text-red-600' },
    { value: 'mixed', label: 'Mixed', icon: Target, color: 'text-purple-600' }
  ]

  const neurodivergentSupports = [
    { value: 'adhd', label: 'ADHD Support', description: 'Short segments, movement breaks' },
    { value: 'dyslexia', label: 'Dyslexia-Friendly', description: 'Audio support, special fonts' },
    { value: 'autism', label: 'Autism Accommodations', description: 'Predictable structure, sensory considerations' },
    { value: 'processing', label: 'Processing Support', description: 'Extra time, simplified instructions' }
  ]

  const contentTypes = [
    { value: 'lesson', label: 'Interactive Lesson', icon: BookOpen },
    { value: 'video', label: 'Educational Video', icon: Video },
    { value: 'worksheet', label: 'Practice Worksheet', icon: FileText },
    { value: 'game', label: 'Learning Game', icon: Zap },
    { value: 'assessment', label: 'Assessment', icon: Target },
    { value: 'story', label: 'Educational Story', icon: Heart }
  ]

  const generateContent = async () => {
    setIsGenerating(true)
    
    // Simulate AI content generation
    setTimeout(() => {
      const newContent: GeneratedContent = {
        id: Date.now().toString(),
        type: contentRequest.contentType,
        title: `${contentRequest.topic} - Grade ${contentRequest.gradeLevel} ${contentRequest.learningStyle} Learning`,
        content: `This is an AI-generated ${contentRequest.contentType} about ${contentRequest.topic} specifically designed for ${contentRequest.learningStyle} learners in grade ${contentRequest.gradeLevel}.`,
        adaptations: contentRequest.neurodivergentSupport.map(support => 
          neurodivergentSupports.find(s => s.value === support)?.description || support
        ),
        estimatedTime: `${contentRequest.duration} minutes`,
        preview: `🎯 ${contentRequest.topic}\n📚 Grade ${contentRequest.gradeLevel}\n👁️ ${contentRequest.learningStyle} Learning\n⏱️ ${contentRequest.duration} minutes`
      }
      
      setGeneratedContent(prev => [newContent, ...prev])
      setIsGenerating(false)
    }, 3000)
  }

  const toggleNeurodivergentSupport = (support: string) => {
    setContentRequest(prev => ({
      ...prev,
      neurodivergentSupport: prev.neurodivergentSupport.includes(support)
        ? prev.neurodivergentSupport.filter(s => s !== support)
        : [...prev.neurodivergentSupport, support]
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">AI Content Generation Studio</h1>
          <p className="text-gray-600 text-lg">Create personalized educational content powered by advanced AI</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Content Creation Panel */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <Wand2 className="w-6 h-6 mr-2" />
                  Create New Content
                </CardTitle>
                <CardDescription className="text-purple-100">
                  Describe what you'd like to create and we'll generate it for you
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="topic" className="text-lg font-semibold">What topic would you like to teach?</Label>
                    <Input
                      id="topic"
                      value={contentRequest.topic}
                      onChange={(e) => setContentRequest(prev => ({ ...prev, topic: e.target.value }))}
                      placeholder="e.g., Fractions, Solar System, American Revolution..."
                      className="mt-2 h-12 text-lg"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="font-semibold">Grade Level</Label>
                      <Select value={contentRequest.gradeLevel} onValueChange={(value) => 
                        setContentRequest(prev => ({ ...prev, gradeLevel: value }))
                      }>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => (
                            <SelectItem key={i + 1} value={(i + 1).toString()}>
                              Grade {i + 1}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="font-semibold">Duration</Label>
                      <Select value={contentRequest.duration} onValueChange={(value) => 
                        setContentRequest(prev => ({ ...prev, duration: value }))
                      }>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="45">45 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label className="font-semibold mb-3 block">Learning Style</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {learningStyles.map((style) => (
                        <Button
                          key={style.value}
                          variant={contentRequest.learningStyle === style.value ? "default" : "outline"}
                          className="h-16 flex flex-col items-center justify-center space-y-1"
                          onClick={() => setContentRequest(prev => ({ ...prev, learningStyle: style.value }))}
                        >
                          <style.icon className={`w-5 h-5 ${style.color}`} />
                          <span className="text-sm">{style.label}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="font-semibold mb-3 block">Content Type</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {contentTypes.map((type) => (
                        <Button
                          key={type.value}
                          variant={contentRequest.contentType === type.value ? "default" : "outline"}
                          className="h-16 flex flex-col items-center justify-center space-y-1"
                          onClick={() => setContentRequest(prev => ({ ...prev, contentType: type.value }))}
                        >
                          <type.icon className="w-5 h-5" />
                          <span className="text-sm">{type.label}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="font-semibold mb-3 block">Neurodivergent Support</Label>
                    <div className="space-y-2">
                      {neurodivergentSupports.map((support) => (
                        <div
                          key={support.value}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                            contentRequest.neurodivergentSupport.includes(support.value)
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => toggleNeurodivergentSupport(support.value)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{support.label}</div>
                              <div className="text-sm text-gray-600">{support.description}</div>
                            </div>
                            {contentRequest.neurodivergentSupport.includes(support.value) && (
                              <Check className="w-5 h-5 text-purple-600" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={generateContent}
                    disabled={!contentRequest.topic || isGenerating}
                    className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                        Generating Content...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-5 h-5 mr-2" />
                        Generate Content
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Generated Content Library */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
                  Generated Content
                </CardTitle>
                <CardDescription>
                  Your AI-created educational materials
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {generatedContent.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Brain className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No content generated yet.</p>
                    <p className="text-sm">Create your first lesson above!</p>
                  </div>
                ) : (
                  generatedContent.map((content) => (
                    <Card key={content.id} className="border-l-4 border-l-purple-500">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm">{content.title}</h4>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="secondary" className="text-xs">{content.type}</Badge>
                                <span className="text-xs text-gray-500">{content.estimatedTime}</span>
                              </div>
                            </div>
                          </div>
                          
                          {content.adaptations.length > 0 && (
                            <div>
                              <div className="text-xs font-medium text-gray-700 mb-1">Accommodations:</div>
                              <div className="space-y-1">
                                {content.adaptations.map((adaptation, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs mr-1">
                                    {adaptation}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline" className="flex-1">
                              <Eye className="w-3 h-3 mr-1" />
                              Preview
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Share2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Quick Templates */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-600" />
                  Quick Templates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { title: 'Math Word Problems', icon: '🧮', color: 'bg-blue-100' },
                  { title: 'Science Experiments', icon: '🔬', color: 'bg-green-100' },
                  { title: 'Reading Comprehension', icon: '📚', color: 'bg-purple-100' },
                  { title: 'Creative Writing', icon: '✍️', color: 'bg-orange-100' }
                ].map((template, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className={`w-full justify-start h-12 ${template.color}`}
                    onClick={() => setContentRequest(prev => ({ ...prev, topic: template.title }))}
                  >
                    <span className="text-lg mr-3">{template.icon}</span>
                    <span className="text-sm">{template.title}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}