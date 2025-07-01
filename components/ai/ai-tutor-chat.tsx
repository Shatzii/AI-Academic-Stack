'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Send, 
  Mic, 
  MicOff, 
  Bot, 
  User, 
  BookOpen, 
  Lightbulb,
  Target,
  Brain,
  Zap,
  Volume2,
  VolumeX,
  RefreshCw,
  Settings
} from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  agent?: string
  context?: any
}

interface AIAgent {
  id: string
  name: string
  avatar: string
  description: string
  specialization: string[]
  schoolId: string
  personality: string
}

export default function AITutorChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [selectedAgent, setSelectedAgent] = useState<string>('dean_wonder')
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const aiAgents: AIAgent[] = [
    {
      id: 'dean_wonder',
      name: 'Dean Wonder',
      avatar: '🦸‍♂️',
      description: 'SuperHero School AI tutor for K-6 students',
      specialization: ['Elementary Math', 'Reading', 'Science', 'ADHD Support'],
      schoolId: 'primary-school',
      personality: 'Energetic, encouraging, uses superhero metaphors'
    },
    {
      id: 'dean_sterling',
      name: 'Dean Sterling',
      avatar: '🎭',
      description: 'Stage Prep School AI tutor for 7-12 students',
      specialization: ['Theater Arts', 'Literature', 'History', 'Performance'],
      schoolId: 'secondary-school',
      personality: 'Dramatic, inspiring, theatrical approach to learning'
    },
    {
      id: 'professor_babel',
      name: 'Professor Babel',
      avatar: '🌍',
      description: 'Global Language Academy AI tutor',
      specialization: ['World Languages', 'Cultural Studies', 'ESL', 'Translation'],
      schoolId: 'language-school',
      personality: 'Multilingual, culturally aware, patient with language learning'
    },
    {
      id: 'professor_barrett',
      name: 'Professor Barrett',
      avatar: '⚖️',
      description: 'Future Legal Professionals AI tutor',
      specialization: ['Law', 'Legal Research', 'Ethics', 'Critical Thinking'],
      schoolId: 'law-school',
      personality: 'Analytical, precise, Socratic method approach'
    }
  ]

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Initialize with welcome message
    const currentAgent = aiAgents.find(agent => agent.id === selectedAgent)
    if (currentAgent && messages.length === 0) {
      setMessages([{
        id: '1',
        type: 'ai',
        content: getWelcomeMessage(currentAgent),
        timestamp: new Date(),
        agent: selectedAgent
      }])
    }
  }, [selectedAgent])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const getWelcomeMessage = (agent: AIAgent): string => {
    switch (agent.id) {
      case 'dean_wonder':
        return "🦸‍♂️ Hey there, future superhero! I'm Dean Wonder, and I'm here to help you discover your learning superpowers! What adventure should we go on today? Math missions? Reading quests? Science explorations?"
      case 'dean_sterling':
        return "🎭 Welcome to the stage of learning! I'm Dean Sterling, your theatrical learning companion. Whether you're diving into Shakespeare, exploring history, or preparing for your next performance, I'm here to make learning a masterpiece!"
      case 'professor_babel':
        return "🌍 Hola! Bonjour! Hello! I'm Professor Babel, and I'm excited to help you explore the wonderful world of languages and cultures. Which language adventure shall we embark on today?"
      case 'professor_barrett':
        return "⚖️ Welcome to the halls of justice and learning! I'm Professor Barrett, and I'm here to guide you through the fascinating world of law and critical thinking. What legal concept or case would you like to explore?"
      default:
        return "Hello! I'm your AI tutor, ready to help you learn and grow. What would you like to explore today?"
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      // Simulate AI response - in real implementation, call your AI service
      const response = await simulateAIResponse(inputMessage, selectedAgent)
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response,
        timestamp: new Date(),
        agent: selectedAgent
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const simulateAIResponse = async (message: string, agentId: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const agent = aiAgents.find(a => a.id === agentId)
    
    // Simple response simulation based on agent
    if (message.toLowerCase().includes('math')) {
      return agent?.id === 'dean_wonder' 
        ? "🦸‍♂️ Math time! Let's turn those numbers into superpowers! What specific math challenge are you facing? Addition adventures? Multiplication missions? I'll help you become a Math Hero!"
        : "Let me help you with that math concept! What specific area would you like to work on?"
    }
    
    if (message.toLowerCase().includes('help')) {
      return agent?.id === 'dean_sterling'
        ? "🎭 Every hero needs guidance! I'm here to help you shine on the stage of learning. Tell me more about what you're working on, and we'll create a learning performance worthy of applause!"
        : "I'm here to help! Can you tell me more about what you're struggling with or what you'd like to learn?"
    }
    
    return `Thank you for your message! As ${agent?.name}, I specialize in ${agent?.specialization.join(', ')}. How can I help you with your learning journey today?`
  }

  const toggleListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsListening(!isListening)
      // In real implementation, implement speech recognition
    } else {
      alert('Speech recognition not supported in this browser')
    }
  }

  const toggleSpeaking = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel()
        setIsSpeaking(false)
      } else {
        const lastAIMessage = messages.filter(m => m.type === 'ai').pop()
        if (lastAIMessage) {
          const utterance = new SpeechSynthesisUtterance(lastAIMessage.content)
          utterance.onend = () => setIsSpeaking(false)
          window.speechSynthesis.speak(utterance)
          setIsSpeaking(true)
        }
      }
    } else {
      alert('Text-to-speech not supported in this browser')
    }
  }

  const clearChat = () => {
    const currentAgent = aiAgents.find(agent => agent.id === selectedAgent)
    setMessages([{
      id: '1',
      type: 'ai',
      content: getWelcomeMessage(currentAgent!),
      timestamp: new Date(),
      agent: selectedAgent
    }])
  }

  const currentAgent = aiAgents.find(agent => agent.id === selectedAgent)

  return (
    <div className="h-full flex flex-col">
      {/* Agent Selection */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <span>Choose Your AI Tutor</span>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={clearChat}>
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {aiAgents.map((agent) => (
              <Button
                key={agent.id}
                variant={selectedAgent === agent.id ? 'default' : 'outline'}
                onClick={() => setSelectedAgent(agent.id)}
                className="h-20 flex flex-col p-2"
              >
                <span className="text-2xl mb-1">{agent.avatar}</span>
                <span className="font-semibold text-xs">{agent.name}</span>
                <span className="text-xs text-gray-500">{agent.schoolId.replace('-', ' ')}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Agent Info */}
      {currentAgent && (
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{currentAgent.avatar}</span>
              <div>
                <h3 className="font-semibold">{currentAgent.name}</h3>
                <p className="text-sm text-gray-600">{currentAgent.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {currentAgent.specialization.map((spec, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chat Messages */}
      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 p-4 overflow-y-auto max-h-96">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.type === 'ai' && currentAgent && (
                      <span className="text-lg">{currentAgent.avatar}</span>
                    )}
                    {message.type === 'user' && (
                      <User className="h-5 w-5 mt-1" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-5 w-5" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>

        {/* Input Area */}
        <CardContent className="p-4 border-t">
          <div className="flex items-center space-x-2">
            <div className="flex-1 flex items-center space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder={`Ask ${currentAgent?.name} anything...`}
                disabled={isLoading}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={toggleListening}
                className={isListening ? 'bg-red-100' : ''}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleSpeaking}
                className={isSpeaking ? 'bg-blue-100' : ''}
              >
                {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </div>
            <Button onClick={sendMessage} disabled={!inputMessage.trim() || isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputMessage("I need help with my homework")}
            >
              <BookOpen className="h-3 w-3 mr-1" />
              Homework Help
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputMessage("Can you explain this concept?")}
            >
              <Lightbulb className="h-3 w-3 mr-1" />
              Explain Concept
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputMessage("I'm struggling with this topic")}
            >
              <Target className="h-3 w-3 mr-1" />
              Get Support
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputMessage("Quiz me on this subject")}
            >
              <Brain className="h-3 w-3 mr-1" />
              Practice Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}