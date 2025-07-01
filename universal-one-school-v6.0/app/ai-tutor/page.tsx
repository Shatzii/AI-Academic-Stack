'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  subject?: string
}

export default function AITutorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI Tutor. I can help you with any subject from K-12 through college level. I specialize in neurodivergent learning support and can adapt my teaching style to your needs. What would you like to learn about today?',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState('General')
  const [learningStyle, setLearningStyle] = useState('Visual')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const subjects = ['General', 'Mathematics', 'Science', 'English', 'History', 'Foreign Languages', 'Programming', 'Law', 'Art', 'Music']
  const learningStyles = ['Visual', 'Auditory', 'Kinesthetic', 'Reading/Writing', 'ADHD Support', 'Dyslexia Support', 'Autism Support']

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
      subject: selectedSubject
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          subject: selectedSubject,
          learningStyle,
          conversationHistory: messages.slice(-5)
        })
      })

      const data = await response.json()
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date(),
        subject: selectedSubject
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('AI Tutor Error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I\'m experiencing technical difficulties. Please try again in a moment.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex justify-between items-center">
            <Link href="/" className="text-white font-bold text-xl hover:text-blue-300 transition-colors">
              ← The Universal One School
            </Link>
            <div className="text-white font-bold text-xl">
              AI Personal Tutor
            </div>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-white font-bold text-lg mb-4">Learning Preferences</h3>
              
              <div className="mb-4">
                <label className="block text-white/80 mb-2 text-sm font-medium">Subject Focus</label>
                <select 
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full p-2 rounded-lg bg-black/30 text-white border border-white/30 focus:border-blue-400"
                >
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-white/80 mb-2 text-sm font-medium">Learning Style</label>
                <select 
                  value={learningStyle}
                  onChange={(e) => setLearningStyle(e.target.value)}
                  className="w-full p-2 rounded-lg bg-black/30 text-white border border-white/30 focus:border-blue-400"
                >
                  {learningStyles.map(style => (
                    <option key={style} value={style}>{style}</option>
                  ))}
                </select>
              </div>

              <div className="text-white/60 text-sm">
                <p className="mb-2">Your AI tutor adapts to:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Your learning style</li>
                  <li>Subject preferences</li>
                  <li>Neurodivergent needs</li>
                  <li>Conversation context</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 h-[600px] flex flex-col">
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-lg ${
                      message.role === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white/20 text-white border border-white/30'
                    }`}>
                      {message.role === 'assistant' && (
                        <div className="flex items-center mb-2">
                          <span className="text-blue-300 text-sm font-medium">AI Tutor</span>
                          {message.subject && (
                            <span className="text-blue-200 text-xs ml-2 bg-blue-500/30 px-2 py-1 rounded">
                              {message.subject}
                            </span>
                          )}
                        </div>
                      )}
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      <div className="text-xs opacity-60 mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white/20 text-white border border-white/30 p-4 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full"></div>
                        <span>AI Tutor is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="border-t border-white/20 p-4">
                <form onSubmit={handleSubmit} className="flex space-x-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything about your studies..."
                    className="flex-1 p-3 rounded-lg bg-black/30 text-white border border-white/30 focus:border-blue-400 focus:outline-none"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}