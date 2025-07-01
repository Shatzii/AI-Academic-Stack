'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Globe, Languages, MapPin, Users, Book, Star, Award, Headphones } from 'lucide-react'

export default function LanguageSchoolPage() {
  const [selectedLanguage, setSelectedLanguage] = useState('spanish')

  const languagePrograms = {
    spanish: {
      name: 'Spanish Immersion',
      flag: '🇪🇸',
      description: 'Complete Spanish language and culture program',
      levels: ['Beginner', 'Intermediate', 'Advanced', 'Native Fluency'],
      culturalFocus: 'Hispanic Heritage & Traditions'
    },
    french: {
      name: 'French Excellence',
      flag: '🇫🇷',
      description: 'French language with Francophone culture',
      levels: ['Débutant', 'Intermédiaire', 'Avancé', 'Maîtrise'],
      culturalFocus: 'French Culture & Literature'
    },
    mandarin: {
      name: 'Mandarin Mastery',
      flag: '🇨🇳',
      description: 'Mandarin Chinese with cultural immersion',
      levels: ['初级', '中级', '高级', '流利'],
      culturalFocus: 'Chinese Culture & Philosophy'
    },
    arabic: {
      name: 'Arabic Studies',
      flag: '🇸🇦',
      description: 'Modern Standard Arabic and culture',
      levels: ['مبتدئ', 'متوسط', 'متقدم', 'طليق'],
      culturalFocus: 'Arab Culture & History'
    },
    esl: {
      name: 'English as Second Language',
      flag: '🇺🇸',
      description: 'English proficiency for international students',
      levels: ['Basic', 'Intermediate', 'Advanced', 'Academic'],
      culturalFocus: 'American Culture & Communication'
    },
    german: {
      name: 'German Precision',
      flag: '🇩🇪',
      description: 'German language and European culture',
      levels: ['Anfänger', 'Mittelstufe', 'Fortgeschritten', 'Muttersprachler'],
      culturalFocus: 'German Culture & Technology'
    }
  }

  const learningMethods = [
    {
      name: 'Total Physical Response',
      icon: <Users className="h-6 w-6" />,
      description: 'Learning through movement and physical activity',
      benefits: ['Kinesthetic learners', 'Memory retention', 'Natural acquisition']
    },
    {
      name: 'Cultural Immersion',
      icon: <MapPin className="h-6 w-6" />,
      description: 'Virtual cultural experiences and real-world connections',
      benefits: ['Cultural understanding', 'Authentic context', 'Global awareness']
    },
    {
      name: 'Technology Integration',
      icon: <Headphones className="h-6 w-6" />,
      description: 'AI-powered pronunciation and interactive exercises',
      benefits: ['Pronunciation accuracy', 'Instant feedback', 'Personalized pace']
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-orange-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-blue-600 to-orange-500 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 to-blue-900/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-4 mb-6">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center overflow-hidden">
                <img 
                  src="/liota-logo.jfif" 
                  alt="LIOTA Logo" 
                  className="w-16 h-16 object-contain"
                />
              </div>
              <Globe className="h-16 w-16 text-blue-300" />
              <Languages className="h-12 w-12 text-green-300" />
              <MapPin className="h-14 w-14 text-orange-300" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              LIOTA Global Language Academy
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              All Ages • Where Languages Open Doors to the World
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <Users className="h-4 w-4 mr-2" />
                156 Global Students
              </Badge>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <Globe className="h-4 w-4 mr-2" />
                6 Languages Offered
              </Badge>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <Award className="h-4 w-4 mr-2" />
                Cultural Immersion
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Language Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Choose Your Language Journey</CardTitle>
            <CardDescription className="text-center">
              Each language program includes cultural immersion and real-world application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {Object.entries(languagePrograms).map(([key, program]) => (
                <Button
                  key={key}
                  variant={selectedLanguage === key ? 'default' : 'outline'}
                  onClick={() => setSelectedLanguage(key)}
                  className="h-24 flex flex-col"
                >
                  <span className="text-2xl mb-1">{program.flag}</span>
                  <span className="font-semibold text-xs">{program.name}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Selected Language Program */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Languages className="h-6 w-6 text-green-600" />
              <span>{languagePrograms[selectedLanguage as keyof typeof languagePrograms].name}</span>
              <span className="text-2xl">{languagePrograms[selectedLanguage as keyof typeof languagePrograms].flag}</span>
            </CardTitle>
            <CardDescription>
              {languagePrograms[selectedLanguage as keyof typeof languagePrograms].description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Proficiency Levels</h4>
                <div className="space-y-3">
                  {languagePrograms[selectedLanguage as keyof typeof languagePrograms].levels.map((level, index) => (
                    <div key={level} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="font-medium">{level}</span>
                      <Progress value={25 + index * 25} className="w-24 h-2" />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Cultural Focus</h4>
                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <p className="text-sm mb-3">
                      {languagePrograms[selectedLanguage as keyof typeof languagePrograms].culturalFocus}
                    </p>
                    <ul className="text-sm space-y-1">
                      <li>• Traditional celebrations and customs</li>
                      <li>• Contemporary culture and media</li>
                      <li>• Historical context and geography</li>
                      <li>• Literature and arts appreciation</li>
                      <li>• Business and professional communication</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Learning Methods */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Book className="h-6 w-6 text-orange-600" />
              <span>Innovative Learning Methods</span>
            </CardTitle>
            <CardDescription>
              Research-based approaches designed for neurodivergent and multilingual learners
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {learningMethods.map((method) => (
                <Card key={method.name} className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center space-x-2 text-lg">
                      {method.icon}
                      <span>{method.name}</span>
                    </CardTitle>
                    <CardDescription>{method.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {method.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-center space-x-2 text-sm">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Features Tabs */}
        <Tabs defaultValue="curriculum" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="technology">Technology</TabsTrigger>
            <TabsTrigger value="cultural">Cultural Programs</TabsTrigger>
            <TabsTrigger value="assessment">Assessment</TabsTrigger>
          </TabsList>

          <TabsContent value="curriculum" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Comprehensive Language Curriculum</CardTitle>
                <CardDescription>
                  Four-skill approach: listening, speaking, reading, and writing with cultural integration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Core Components</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Conversational fluency development</li>
                      <li>• Grammar in context learning</li>
                      <li>• Vocabulary through immersion</li>
                      <li>• Pronunciation and accent training</li>
                      <li>• Reading comprehension strategies</li>
                      <li>• Writing skills progression</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Neurodivergent Adaptations</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Visual learning supports</li>
                      <li>• Kinesthetic language activities</li>
                      <li>• Social communication scripts</li>
                      <li>• Sensory-friendly materials</li>
                      <li>• Executive function aids</li>
                      <li>• Individualized pacing</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="technology" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI-Enhanced Language Learning</CardTitle>
                <CardDescription>
                  Cutting-edge technology supporting natural language acquisition
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <Headphones className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <h4 className="font-semibold">Speech Recognition</h4>
                    <p className="text-sm text-gray-600">Real-time pronunciation feedback</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Globe className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <h4 className="font-semibold">Virtual Immersion</h4>
                    <p className="text-sm text-gray-600">360° cultural experiences</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Star className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                    <h4 className="font-semibold">Adaptive Learning</h4>
                    <p className="text-sm text-gray-600">Personalized learning paths</p>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Translation & Communication Tools</h4>
                  <p className="text-sm text-gray-700">
                    Real-time translation assistance, cultural context explanations, and native speaker 
                    video conversations through secure virtual exchange programs.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cultural" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cultural Immersion Programs</CardTitle>
                <CardDescription>
                  Authentic cultural experiences bringing languages to life
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="border-l-4 border-l-green-600">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Virtual Exchange</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-2">Connect with students worldwide</p>
                        <Badge variant="outline">Monthly Sessions</Badge>
                      </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-blue-600">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Cultural Festivals</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-2">Celebrate global traditions</p>
                        <Badge variant="outline">Seasonal Events</Badge>
                      </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-orange-600">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">International Cuisine</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-2">Cooking classes in target language</p>
                        <Badge variant="outline">Weekly Classes</Badge>
                      </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-purple-600">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Study Abroad Prep</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-2">Preparation for international programs</p>
                        <Badge variant="outline">Advanced Students</Badge>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="bg-gradient-to-r from-green-100 to-blue-100 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Community Partnerships</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Local cultural centers and embassies</li>
                      <li>• International business mentorship programs</li>
                      <li>• Sister school relationships globally</li>
                      <li>• Professional translator shadowing opportunities</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assessment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Proficiency Assessment & Certification</CardTitle>
                <CardDescription>
                  International standards with accommodations for diverse learners
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Assessment Methods</h4>
                      <ul className="space-y-2 text-sm">
                        <li>• Portfolio-based evaluation</li>
                        <li>• Oral proficiency interviews</li>
                        <li>• Cultural competency projects</li>
                        <li>• Peer communication assessments</li>
                        <li>• Real-world task completion</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Certification Pathways</h4>
                      <ul className="space-y-2 text-sm">
                        <li>• Common European Framework (CEFR)</li>
                        <li>• American Council Teaching Foreign Languages (ACTFL)</li>
                        <li>• International Language Certifications</li>
                        <li>• College Credit by Examination</li>
                        <li>• Professional Translator Preparation</li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Neurodivergent Assessment Accommodations</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <ul className="space-y-1">
                          <li>• Extended time allowances</li>
                          <li>• Alternative format options</li>
                          <li>• Sensory break provisions</li>
                        </ul>
                      </div>
                      <div>
                        <ul className="space-y-1">
                          <li>• Choice of demonstration methods</li>
                          <li>• Technology assistance tools</li>
                          <li>• Flexible scheduling options</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Student Access Portal */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Global Learning Portal</CardTitle>
            <CardDescription className="text-center">
              Access your multilingual learning dashboard and cultural resources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="border-2 border-green-400 hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Language Dashboard</h3>
                  <p className="text-sm text-gray-600 mb-4">Track your progress across all languages</p>
                  <Button className="w-full" onClick={() => window.location.href = '/dashboard'}>
                    Enter Dashboard
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-blue-400 hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Globe className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">AI Language Coach</h3>
                  <p className="text-sm text-gray-600 mb-4">Practice with Professor Babel, your multilingual AI tutor</p>
                  <Button className="w-full border-2 border-green-400 text-slate-900 hover:bg-green-50" variant="outline" onClick={() => window.location.href = '/dashboard'}>
                    🌍 Chat with Professor Babel
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-orange-400 hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <MapPin className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Cultural Exchange</h3>
                  <p className="text-sm text-gray-600 mb-4">Connect with global classmates and cultural experiences</p>
                  <Button className="w-full" variant="outline" onClick={() => window.location.href = '/cultural-exchange'}>
                    Explore Cultures
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Quick Language Tools */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Languages className="h-6 w-6 text-green-600" />
              <span>Language Learning Tools</span>
            </CardTitle>
            <CardDescription>Immerse yourself in languages and cultures</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex flex-col" onClick={() => window.location.href = '/conversation-practice'}>
                <Headphones className="h-6 w-6 mb-2 text-green-600" />
                <span className="text-sm">Conversation Practice</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col" onClick={() => window.location.href = '/language-assessment'}>
                <Star className="h-6 w-6 mb-2 text-blue-600" />
                <span className="text-sm">Proficiency Tests</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col" onClick={() => window.location.href = '/cultural-immersion'}>
                <MapPin className="h-6 w-6 mb-2 text-orange-600" />
                <span className="text-sm">Virtual Immersion</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col" onClick={() => window.location.href = '/translation-tools'}>
                <Book className="h-6 w-6 mb-2 text-purple-600" />
                <span className="text-sm">Translation Tools</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Enrollment CTA */}
        <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <CardContent className="text-center py-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Connect with the World?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join our global community where language learning opens doors to infinite possibilities
            </p>
            <div className="space-x-4">
              <Button size="lg" variant="secondary" onClick={() => window.location.href = '/register'}>
                Schedule Assessment
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-green-600" onClick={() => window.location.href = '/apply'}>
                Start Learning
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}