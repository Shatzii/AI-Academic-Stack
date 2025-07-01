'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Heart, 
  Smile, 
  Frown, 
  Meh, 
  Angry, 
  Zap,
  MessageCircle,
  Camera,
  Mic,
  Volume2,
  Sparkles,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Send,
  Bot,
  User,
  Brain,
  Eye,
  Timer,
  Award,
  BookOpen,
  Lightbulb,
  Coffee,
  Music,
  Gamepad2
} from 'lucide-react'

interface EmotionalState {
  primary: 'happy' | 'sad' | 'frustrated' | 'excited' | 'calm' | 'anxious'
  confidence: number
  energy: number
  motivation: number
  socialConnection: number
  learningReceptivity: number
}

interface AIPersonality {
  name: string
  avatar: string
  specialization: string
  voiceStyle: string
  interactionStyle: 'playful' | 'calm' | 'energetic' | 'supportive'
}

interface Conversation {
  id: string
  speaker: 'student' | 'ai'
  message: string
  timestamp: Date
  emotionalTone: string
  aiResponse?: {
    empathy: number
    encouragement: number
    guidance: number
  }
}

export default function EmotionalAICompanion() {
  const [currentEmotion, setCurrentEmotion] = useState<EmotionalState>({
    primary: 'calm',
    confidence: 75,
    energy: 68,
    motivation: 82,
    socialConnection: 91,
    learningReceptivity: 88
  })

  const [selectedCompanion, setSelectedCompanion] = useState('buddy')
  const [isListening, setIsListening] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      speaker: 'ai',
      message: "Hi there! I can sense you're feeling pretty good today. Ready to tackle some awesome learning adventures? 🌟",
      timestamp: new Date(),
      emotionalTone: 'encouraging',
      aiResponse: { empathy: 85, encouragement: 95, guidance: 70 }
    }
  ])

  const aiCompanions: Record<string, AIPersonality> = {
    buddy: {
      name: 'Learning Buddy',
      avatar: '🤖',
      specialization: 'General Support & Motivation',
      voiceStyle: 'Friendly & Encouraging',
      interactionStyle: 'playful'
    },
    sage: {
      name: 'Wise Sage',
      avatar: '🧙‍♂️',
      specialization: 'Deep Learning & Problem Solving',
      voiceStyle: 'Calm & Thoughtful',
      interactionStyle: 'calm'
    },
    spark: {
      name: 'Energy Spark',
      avatar: '⚡',
      specialization: 'ADHD Support & Energy Management',
      voiceStyle: 'Energetic & Fun',
      interactionStyle: 'energetic'
    },
    care: {
      name: 'Caring Helper',
      avatar: '💝',
      specialization: 'Emotional Support & Confidence',
      voiceStyle: 'Gentle & Supportive',
      interactionStyle: 'supportive'
    }
  }

  const emotionalActivities = {
    happy: [
      { icon: Target, title: 'Challenge Mode', description: 'Try harder problems while you\'re feeling great!' },
      { icon: Award, title: 'Share Success', description: 'Tell someone about your awesome progress!' }
    ],
    frustrated: [
      { icon: Coffee, title: 'Take a Break', description: 'Step away for 5 minutes and breathe' },
      { icon: Lightbulb, title: 'Try Different Way', description: 'Let\'s approach this from a new angle' }
    ],
    anxious: [
      { icon: Music, title: 'Calming Sounds', description: 'Listen to peaceful background music' },
      { icon: Heart, title: 'Breathing Exercise', description: 'Let\'s do some deep breathing together' }
    ],
    excited: [
      { icon: Gamepad2, title: 'Learning Game', description: 'Channel that energy into a fun activity!' },
      { icon: BookOpen, title: 'Explore More', description: 'Dive deeper into topics you love' }
    ],
    sad: [
      { icon: MessageCircle, title: 'Talk it Out', description: 'Share what\'s bothering you' },
      { icon: Sparkles, title: 'Small Win', description: 'Let\'s start with something easy and build up' }
    ],
    calm: [
      { icon: Brain, title: 'Deep Learning', description: 'Perfect time for complex concepts' },
      { icon: Timer, title: 'Extended Focus', description: 'You can probably focus longer right now' }
    ]
  }

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const userMessage: Conversation = {
      id: Date.now().toString(),
      speaker: 'student',
      message: newMessage,
      timestamp: new Date(),
      emotionalTone: 'neutral'
    }

    setConversations(prev => [...prev, userMessage])
    setNewMessage('')

    // Simulate AI response with emotional intelligence
    setTimeout(() => {
      const companion = aiCompanions[selectedCompanion]
      let aiResponse = ''
      let responseStyle = { empathy: 70, encouragement: 70, guidance: 70 }

      // Analyze emotional content and respond appropriately
      if (newMessage.toLowerCase().includes('frustrat') || newMessage.toLowerCase().includes('hard')) {
        aiResponse = `I can hear that you're feeling frustrated. That's totally normal when learning new things! Let's break this down into smaller steps. ${companion.name} believes in you! 💪`
        responseStyle = { empathy: 90, encouragement: 85, guidance: 95 }
      } else if (newMessage.toLowerCase().includes('happy') || newMessage.toLowerCase().includes('good')) {
        aiResponse = `I love hearing that positive energy! When you're feeling good like this, your brain is in the perfect state for learning. Want to try something a bit more challenging? 🌟`
        responseStyle = { empathy: 80, encouragement: 95, guidance: 75 }
      } else if (newMessage.toLowerCase().includes('tired') || newMessage.toLowerCase().includes('break')) {
        aiResponse = `It sounds like you might need a little recharge. How about we take a quick movement break or try some deep breathing? Your brain will thank you! 🌱`
        responseStyle = { empathy: 95, encouragement: 70, guidance: 90 }
      } else {
        aiResponse = `Thanks for sharing that with me! I'm here to support you however you need. What would help you most right now - encouragement, a different approach, or just someone to listen? 🤗`
        responseStyle = { empathy: 85, encouragement: 80, guidance: 80 }
      }

      const aiMessage: Conversation = {
        id: (Date.now() + 1).toString(),
        speaker: 'ai',
        message: aiResponse,
        timestamp: new Date(),
        emotionalTone: 'supportive',
        aiResponse: responseStyle
      }

      setConversations(prev => [...prev, aiMessage])
    }, 1500)
  }

  // Simulate emotional state changes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEmotion(prev => ({
        ...prev,
        confidence: Math.max(20, Math.min(100, prev.confidence + (Math.random() - 0.5) * 10)),
        energy: Math.max(10, Math.min(100, prev.energy + (Math.random() - 0.5) * 15)),
        motivation: Math.max(30, Math.min(100, prev.motivation + (Math.random() - 0.5) * 8)),
        socialConnection: Math.max(40, Math.min(100, prev.socialConnection + (Math.random() - 0.5) * 5)),
        learningReceptivity: Math.max(20, Math.min(100, prev.learningReceptivity + (Math.random() - 0.5) * 12))
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case 'happy': return <Smile className="w-6 h-6 text-yellow-500" />
      case 'sad': return <Frown className="w-6 h-6 text-blue-500" />
      case 'frustrated': return <Angry className="w-6 h-6 text-red-500" />
      case 'excited': return <Zap className="w-6 h-6 text-orange-500" />
      case 'anxious': return <AlertTriangle className="w-6 h-6 text-purple-500" />
      default: return <Meh className="w-6 h-6 text-green-500" />
    }
  }

  const getEmotionColor = (level: number) => {
    if (level > 80) return 'text-green-600 bg-green-50'
    if (level > 60) return 'text-yellow-600 bg-yellow-50'
    if (level > 40) return 'text-orange-600 bg-orange-50'
    return 'text-red-600 bg-red-50'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl font-bold flex items-center">
                  <Heart className="w-8 h-8 mr-3" />
                  Emotional AI Companion
                </CardTitle>
                <CardDescription className="text-pink-100 text-lg">
                  Your empathetic learning partner with emotional intelligence
                </CardDescription>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {getEmotionIcon(currentEmotion.primary)}
                  <span className="text-lg font-semibold capitalize">{currentEmotion.primary}</span>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Emotional State Dashboard */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-purple-600" />
                  Emotional State
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Confidence</span>
                    <Badge className={getEmotionColor(currentEmotion.confidence)}>
                      {currentEmotion.confidence.toFixed(0)}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Energy</span>
                    <Badge className={getEmotionColor(currentEmotion.energy)}>
                      {currentEmotion.energy.toFixed(0)}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Motivation</span>
                    <Badge className={getEmotionColor(currentEmotion.motivation)}>
                      {currentEmotion.motivation.toFixed(0)}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Social Connection</span>
                    <Badge className={getEmotionColor(currentEmotion.socialConnection)}>
                      {currentEmotion.socialConnection.toFixed(0)}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Learning Readiness</span>
                    <Badge className={getEmotionColor(currentEmotion.learningReceptivity)}>
                      {currentEmotion.learningReceptivity.toFixed(0)}%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-yellow-600" />
                  AI Companions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(aiCompanions).map(([key, companion]) => (
                  <Button
                    key={key}
                    variant={selectedCompanion === key ? "default" : "ghost"}
                    className="w-full justify-start h-auto p-3"
                    onClick={() => setSelectedCompanion(key)}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{companion.avatar}</span>
                      <div className="text-left">
                        <div className="font-semibold text-sm">{companion.name}</div>
                        <div className="text-xs text-gray-500">{companion.specialization}</div>
                      </div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2 text-blue-600" />
                  Suggested Activities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {emotionalActivities[currentEmotion.primary]?.map((activity, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <activity.icon className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-sm">{activity.title}</span>
                    </div>
                    <p className="text-xs text-gray-600">{activity.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Conversation Area */}
          <div className="lg:col-span-3 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <span className="text-2xl mr-2">{aiCompanions[selectedCompanion].avatar}</span>
                    Chatting with {aiCompanions[selectedCompanion].name}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{aiCompanions[selectedCompanion].voiceStyle}</Badge>
                    <Button
                      variant={isListening ? "destructive" : "outline"}
                      size="sm"
                      onClick={() => setIsListening(!isListening)}
                    >
                      <Mic className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  {aiCompanions[selectedCompanion].specialization} - {aiCompanions[selectedCompanion].interactionStyle} interaction style
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-96 overflow-y-auto space-y-4 p-4 bg-gray-50 rounded-lg">
                  {conversations.map((conv) => (
                    <div
                      key={conv.id}
                      className={`flex ${conv.speaker === 'student' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          conv.speaker === 'student'
                            ? 'bg-blue-500 text-white'
                            : 'bg-white border shadow-sm'
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          {conv.speaker === 'student' ? (
                            <User className="w-4 h-4" />
                          ) : (
                            <Bot className="w-4 h-4" />
                          )}
                          <span className="text-xs font-medium">
                            {conv.speaker === 'student' ? 'You' : aiCompanions[selectedCompanion].name}
                          </span>
                        </div>
                        <p className="text-sm">{conv.message}</p>
                        {conv.aiResponse && (
                          <div className="mt-2 pt-2 border-t border-gray-200">
                            <div className="flex space-x-4 text-xs">
                              <span>💝 Empathy: {conv.aiResponse.empathy}%</span>
                              <span>🌟 Encourage: {conv.aiResponse.encouragement}%</span>
                              <span>🎯 Guidance: {conv.aiResponse.guidance}%</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Share how you're feeling or ask for help..."
                    className="flex-1"
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {['😊 I feel great!', '😤 This is hard', '😴 I need a break', '🎉 I did it!'].map((quick, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => {
                        setNewMessage(quick.split(' ').slice(1).join(' '))
                      }}
                    >
                      {quick}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="insights" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="insights">Emotional Insights</TabsTrigger>
                <TabsTrigger value="progress">Emotional Growth</TabsTrigger>
                <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
              </TabsList>

              <TabsContent value="insights" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Eye className="w-5 h-5 mr-2 text-indigo-600" />
                      Real-Time Emotional Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <h4 className="font-semibold">Current State</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                            <span className="text-sm">Primary Emotion</span>
                            <Badge className="bg-green-100 text-green-800 capitalize">
                              {currentEmotion.primary}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                            <span className="text-sm">Learning Mode</span>
                            <Badge className="bg-blue-100 text-blue-800">
                              {currentEmotion.learningReceptivity > 70 ? 'Optimal' : 'Needs Support'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="font-semibold">AI Insights</h4>
                        <div className="space-y-2 text-sm">
                          <p className="p-2 bg-purple-50 rounded">
                            Your emotional pattern suggests you learn best with interactive activities right now.
                          </p>
                          <p className="p-2 bg-yellow-50 rounded">
                            High social connection indicates group activities would be beneficial.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="progress" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                      Emotional Learning Journey
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">7</div>
                          <div className="text-sm text-gray-600">Days of Growth</div>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">23</div>
                          <div className="text-sm text-gray-600">Positive Interactions</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">94%</div>
                          <div className="text-sm text-gray-600">Emotional Stability</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-semibold">Recent Achievements</h4>
                        <div className="space-y-1">
                          <div className="flex items-center p-2 bg-green-50 rounded">
                            <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                            <span className="text-sm">Improved stress management skills</span>
                          </div>
                          <div className="flex items-center p-2 bg-blue-50 rounded">
                            <CheckCircle className="w-4 h-4 text-blue-600 mr-2" />
                            <span className="text-sm">Better emotional expression in conversations</span>
                          </div>
                          <div className="flex items-center p-2 bg-purple-50 rounded">
                            <CheckCircle className="w-4 h-4 text-purple-600 mr-2" />
                            <span className="text-sm">Increased learning motivation through emotional support</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="recommendations" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
                      Personalized Emotional Support
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                        <h4 className="font-semibold mb-2">For Today</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Try collaborative learning - your social connection is high!</li>
                          <li>• Take advantage of your current calm state for complex topics</li>
                          <li>• Schedule a movement break in 15 minutes to maintain energy</li>
                        </ul>
                      </div>
                      
                      <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                        <h4 className="font-semibold mb-2">This Week</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Practice emotional check-ins before each lesson</li>
                          <li>• Use the AI companion when feeling overwhelmed</li>
                          <li>• Celebrate small wins to maintain motivation</li>
                        </ul>
                      </div>
                      
                      <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                        <h4 className="font-semibold mb-2">Long-term Growth</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Develop emotional vocabulary through AI conversations</li>
                          <li>• Build resilience through supportive learning experiences</li>
                          <li>• Strengthen social-emotional learning skills</li>
                        </ul>
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