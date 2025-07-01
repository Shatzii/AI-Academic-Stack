'use client'

import React, { useState } from 'react'
import Link from 'next/link'

interface ContentRequest {
  type: 'lesson' | 'worksheet' | 'quiz' | 'presentation' | 'study-guide'
  subject: string
  gradeLevel: string
  topic: string
  duration: number
  learningObjectives: string[]
  neurodivergentSupport: string[]
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
}

interface GeneratedContent {
  title: string
  content: string
  materials: string[]
  assessments: string[]
  adaptations: string[]
  timeline: string
}

export default function AIContentCreatorPage() {
  const [contentRequest, setContentRequest] = useState<ContentRequest>({
    type: 'lesson',
    subject: 'Mathematics',
    gradeLevel: '6-8',
    topic: '',
    duration: 45,
    learningObjectives: [''],
    neurodivergentSupport: ['ADHD Support'],
    difficulty: 'Intermediate'
  })
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const contentTypes = [
    { value: 'lesson', label: 'Full Lesson Plan', icon: '📚' },
    { value: 'worksheet', label: 'Interactive Worksheet', icon: '📝' },
    { value: 'quiz', label: 'Adaptive Quiz', icon: '🧩' },
    { value: 'presentation', label: 'Visual Presentation', icon: '📊' },
    { value: 'study-guide', label: 'Study Guide', icon: '📖' }
  ]

  const subjects = ['Mathematics', 'Science', 'English', 'History', 'Art', 'Music', 'Programming', 'Law', 'Foreign Languages']
  const gradeLevels = ['K-2', '3-5', '6-8', '9-12', 'College', 'Adult']
  const supportOptions = ['ADHD Support', 'Dyslexia Support', 'Autism Support', 'Visual Learning', 'Kinesthetic Learning', 'Extended Time', 'Simplified Language']

  const generateContent = async () => {
    if (!contentRequest.topic.trim()) return

    setIsGenerating(true)
    try {
      const response = await fetch('/api/ai-content-creator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contentRequest)
      })

      const data = await response.json()
      setGeneratedContent(data.content)
    } catch (error) {
      console.error('Content generation error:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const addLearningObjective = () => {
    setContentRequest(prev => ({
      ...prev,
      learningObjectives: [...prev.learningObjectives, '']
    }))
  }

  const updateLearningObjective = (index: number, value: string) => {
    setContentRequest(prev => ({
      ...prev,
      learningObjectives: prev.learningObjectives.map((obj, i) => i === index ? value : obj)
    }))
  }

  const removeLearningObjective = (index: number) => {
    setContentRequest(prev => ({
      ...prev,
      learningObjectives: prev.learningObjectives.filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex justify-between items-center">
            <Link href="/" className="text-white font-bold text-xl hover:text-indigo-300 transition-colors">
              ← The Universal One School
            </Link>
            <div className="text-white font-bold text-xl">
              AI Content Creator
            </div>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">AI-Powered Educational Content Creator</h1>
          <p className="text-indigo-200">Generate personalized learning materials with neurodivergent adaptations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Content Request Form */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-white font-bold text-lg mb-4">Content Specifications</h3>
              
              {/* Content Type */}
              <div className="mb-4">
                <label className="block text-white/80 mb-2 text-sm font-medium">Content Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {contentTypes.map(type => (
                    <button
                      key={type.value}
                      onClick={() => setContentRequest(prev => ({ ...prev, type: type.value as any }))}
                      className={`p-3 rounded-lg border text-sm transition-colors ${
                        contentRequest.type === type.value
                          ? 'bg-indigo-600 border-indigo-500 text-white'
                          : 'bg-black/30 border-white/30 text-white/80 hover:bg-white/10'
                      }`}
                    >
                      <div className="text-lg mb-1">{type.icon}</div>
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject and Grade */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-white/80 mb-2 text-sm font-medium">Subject</label>
                  <select 
                    value={contentRequest.subject}
                    onChange={(e) => setContentRequest(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full p-2 rounded-lg bg-black/30 text-white border border-white/30 focus:border-indigo-400"
                  >
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-white/80 mb-2 text-sm font-medium">Grade Level</label>
                  <select 
                    value={contentRequest.gradeLevel}
                    onChange={(e) => setContentRequest(prev => ({ ...prev, gradeLevel: e.target.value }))}
                    className="w-full p-2 rounded-lg bg-black/30 text-white border border-white/30 focus:border-indigo-400"
                  >
                    {gradeLevels.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Topic */}
              <div className="mb-4">
                <label className="block text-white/80 mb-2 text-sm font-medium">Topic</label>
                <input
                  type="text"
                  value={contentRequest.topic}
                  onChange={(e) => setContentRequest(prev => ({ ...prev, topic: e.target.value }))}
                  placeholder="Enter the specific topic or concept..."
                  className="w-full p-3 rounded-lg bg-black/30 text-white border border-white/30 focus:border-indigo-400 focus:outline-none"
                />
              </div>

              {/* Duration and Difficulty */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-white/80 mb-2 text-sm font-medium">Duration (minutes)</label>
                  <input
                    type="number"
                    value={contentRequest.duration}
                    onChange={(e) => setContentRequest(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                    className="w-full p-2 rounded-lg bg-black/30 text-white border border-white/30 focus:border-indigo-400"
                    min="15"
                    max="180"
                  />
                </div>
                <div>
                  <label className="block text-white/80 mb-2 text-sm font-medium">Difficulty</label>
                  <select 
                    value={contentRequest.difficulty}
                    onChange={(e) => setContentRequest(prev => ({ ...prev, difficulty: e.target.value as any }))}
                    className="w-full p-2 rounded-lg bg-black/30 text-white border border-white/30 focus:border-indigo-400"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Learning Objectives */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-white font-bold text-lg mb-4">Learning Objectives</h3>
              <div className="space-y-2">
                {contentRequest.learningObjectives.map((objective, index) => (
                  <div key={index} className="flex space-x-2">
                    <input
                      type="text"
                      value={objective}
                      onChange={(e) => updateLearningObjective(index, e.target.value)}
                      placeholder="Students will be able to..."
                      className="flex-1 p-2 rounded-lg bg-black/30 text-white border border-white/30 focus:border-indigo-400 focus:outline-none"
                    />
                    {contentRequest.learningObjectives.length > 1 && (
                      <button
                        onClick={() => removeLearningObjective(index)}
                        className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addLearningObjective}
                  className="w-full p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                >
                  + Add Learning Objective
                </button>
              </div>
            </div>

            {/* Neurodivergent Support */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-white font-bold text-lg mb-4">Neurodivergent Support</h3>
              <div className="grid grid-cols-2 gap-2">
                {supportOptions.map(option => (
                  <label key={option} className="flex items-center text-white/80 text-sm">
                    <input
                      type="checkbox"
                      checked={contentRequest.neurodivergentSupport.includes(option)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setContentRequest(prev => ({
                            ...prev,
                            neurodivergentSupport: [...prev.neurodivergentSupport, option]
                          }))
                        } else {
                          setContentRequest(prev => ({
                            ...prev,
                            neurodivergentSupport: prev.neurodivergentSupport.filter(s => s !== option)
                          }))
                        }
                      }}
                      className="mr-2"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={generateContent}
              disabled={isGenerating || !contentRequest.topic.trim()}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isGenerating ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Generating Content...</span>
                </div>
              ) : (
                'Generate AI Content'
              )}
            </button>
          </div>

          {/* Generated Content Display */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-white font-bold text-lg mb-4">Generated Content</h3>
            
            {isGenerating ? (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-indigo-400 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-white/70">AI is creating your personalized content...</p>
              </div>
            ) : generatedContent ? (
              <div className="space-y-6">
                <div>
                  <h4 className="text-indigo-300 font-medium mb-2">Content Title</h4>
                  <p className="text-white">{generatedContent.title}</p>
                </div>
                
                <div>
                  <h4 className="text-indigo-300 font-medium mb-2">Main Content</h4>
                  <div className="bg-black/20 p-4 rounded-lg text-white whitespace-pre-wrap text-sm max-h-64 overflow-y-auto">
                    {generatedContent.content}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-indigo-300 font-medium mb-2">Materials Needed</h4>
                    <ul className="text-white/80 text-sm space-y-1">
                      {generatedContent.materials?.map((material, index) => (
                        <li key={index}>• {material}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-indigo-300 font-medium mb-2">Assessment Methods</h4>
                    <ul className="text-white/80 text-sm space-y-1">
                      {generatedContent.assessments?.map((assessment, index) => (
                        <li key={index}>• {assessment}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="text-indigo-300 font-medium mb-2">Neurodivergent Adaptations</h4>
                  <ul className="text-white/80 text-sm space-y-1">
                    {generatedContent.adaptations?.map((adaptation, index) => (
                      <li key={index}>• {adaptation}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex space-x-2">
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm">
                    Download PDF
                  </button>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    Save to Library
                  </button>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm">
                    Share with Colleagues
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-white/60">
                <div className="text-4xl mb-4">🎨</div>
                <p>Fill out the form and click "Generate AI Content" to create personalized learning materials</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}