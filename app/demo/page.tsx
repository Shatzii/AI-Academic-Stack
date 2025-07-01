'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Sparkles, Bot, Brain, GraduationCap, Trophy, 
  Users, Star, Play, ChevronRight, BookOpen 
} from 'lucide-react'

export default function DemoPage() {
  const [activeDemo, setActiveDemo] = useState('ai-tutor')

  const aiFeatures = [
    {
      id: 'ai-tutor',
      name: 'AI Personal Tutor',
      icon: <Bot className="h-6 w-6" />,
      description: 'Personalized learning with adaptive AI tutoring',
      demo: 'Interactive conversation with Dean Wonder for superhero-themed math problems'
    },
    {
      id: 'ai-analytics',
      name: 'Learning Analytics',
      icon: <Brain className="h-6 w-6" />,
      description: 'Real-time performance insights and pattern recognition',
      demo: 'Dashboard showing learning progress with neurodivergent adaptations'
    },
    {
      id: 'vr-classroom',
      name: 'VR Learning Hub',
      icon: <Sparkles className="h-6 w-6" />,
      description: 'Immersive virtual reality educational experiences',
      demo: 'Virtual theater stage for Stage Prep School performance practice'
    },
    {
      id: 'blockchain-achievements',
      name: 'Blockchain Achievements',
      icon: <Trophy className="h-6 w-6" />,
      description: 'Secure, verifiable academic credentials and achievements',
      demo: 'NFT certificate minting for completed learning milestones'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Universal One School 3.0
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                  AI Demo Center
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Experience the future of education with our revolutionary AI-powered learning platform
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge variant="secondary" className="text-lg px-4 py-2 bg-cyan-500/20 text-cyan-400">
                  <Sparkles className="h-4 w-4 mr-2" />
                  12 Revolutionary Features
                </Badge>
                <Badge variant="secondary" className="text-lg px-4 py-2 bg-purple-500/20 text-purple-400">
                  <Users className="h-4 w-4 mr-2" />
                  Neurodivergent Support
                </Badge>
                <Badge variant="secondary" className="text-lg px-4 py-2 bg-green-500/20 text-green-400">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Texas Charter School
                </Badge>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        {/* Demo Selection */}
        <Card className="mb-8 bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-white">Interactive AI Demo</CardTitle>
            <CardDescription className="text-center text-gray-300">
              Experience our advanced AI features with live demonstrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeDemo} onValueChange={setActiveDemo} className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-slate-700">
                {aiFeatures.map((feature) => (
                  <TabsTrigger 
                    key={feature.id} 
                    value={feature.id}
                    className="data-[state=active]:bg-cyan-500 data-[state=active]:text-black"
                  >
                    <div className="flex items-center space-x-2">
                      {feature.icon}
                      <span className="hidden sm:inline">{feature.name}</span>
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>

              {aiFeatures.map((feature) => (
                <TabsContent key={feature.id} value={feature.id} className="mt-6">
                  <Card className="bg-slate-700/50 border-slate-600">
                    <CardHeader>
                      <CardTitle className="flex items-center text-white">
                        {feature.icon}
                        <span className="ml-3">{feature.name}</span>
                      </CardTitle>
                      <CardDescription className="text-gray-300">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-slate-800 rounded-lg p-6 mb-4">
                        <h4 className="font-semibold mb-3 text-cyan-400">Live Demo Preview:</h4>
                        <p className="text-gray-300 mb-4">{feature.demo}</p>
                        <div className="flex items-center space-x-4">
                          <Button className="bg-cyan-500 hover:bg-cyan-600 text-black">
                            <Play className="h-4 w-4 mr-2" />
                            Start Demo
                          </Button>
                          <Button variant="outline" className="border-slate-600 text-gray-300 hover:bg-slate-700">
                            <BookOpen className="h-4 w-4 mr-2" />
                            Learn More
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* School Demo Links */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              name: 'SuperHero School',
              grade: 'K-6',
              theme: 'Cyberpunk/Neon',
              link: '/schools/primary-school',
              color: 'from-green-500 to-cyan-500'
            },
            {
              name: 'Stage Prep School',
              grade: '7-12',
              theme: 'Theatrical/Purple',
              link: '/schools/secondary-school',
              color: 'from-purple-500 to-pink-500'
            },
            {
              name: 'Law School',
              grade: 'College',
              theme: 'Professional/Gold',
              link: '/schools/law-school',
              color: 'from-yellow-500 to-orange-500'
            },
            {
              name: 'Language Academy',
              grade: 'All Ages',
              theme: 'Cultural/Blue',
              link: '/schools/language-school',
              color: 'from-blue-500 to-indigo-500'
            }
          ].map((school) => (
            <Card key={school.name} className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors cursor-pointer" onClick={() => window.location.href = school.link}>
              <CardContent className="p-6">
                <div className={`w-full h-32 rounded-lg bg-gradient-to-br ${school.color} mb-4 flex items-center justify-center`}>
                  <GraduationCap className="h-12 w-12 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2">{school.name}</h3>
                <p className="text-sm text-gray-400 mb-1">{school.grade}</p>
                <p className="text-sm text-gray-500 mb-3">{school.theme}</p>
                <Button size="sm" variant="outline" className="w-full border-slate-600 text-gray-300 hover:bg-slate-700">
                  Demo School
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-cyan-600 to-purple-600 border-0">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Transform Education?
            </h3>
            <p className="text-cyan-100 mb-6 max-w-2xl mx-auto">
              Join the Universal One School revolution and experience the most advanced educational platform ever created
            </p>
            <div className="space-x-4">
              <Button size="lg" variant="secondary" onClick={() => window.location.href = '/enrollment-portal'}>
                Start Enrollment
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-purple-800" onClick={() => window.location.href = '/contact'}>
                Schedule Demo
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}