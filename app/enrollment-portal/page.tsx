'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  GraduationCap, Users, DollarSign, Calendar, 
  CheckCircle, Star, Shield, FileText, CreditCard 
} from 'lucide-react'

export default function EnrollmentPortal() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedProgram, setSelectedProgram] = useState('')
  const [enrollmentType, setEnrollmentType] = useState('')

  const enrollmentOptions = [
    {
      id: 'on-site',
      name: 'On-Site Student',
      price: '$2,500/semester',
      description: 'Full campus access with in-person classes and all AI features',
      features: [
        'Full campus access',
        'In-person classes with certified teachers',
        'All AI learning tools unlimited',
        'Personal AI tutor sessions',
        'Hands-on lab experiences',
        'Theater/performance facilities',
        'Meal plans available',
        'Transportation assistance'
      ],
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'hybrid',
      name: 'Hybrid Student',
      price: '$2,000/semester',
      description: 'Flexible combination of on-site and online learning',
      features: [
        '2-3 days per week on campus',
        'Live online classes',
        'AI learning tools unlimited',
        'Personal AI tutor sessions',
        'Virtual lab simulations',
        'Access to campus events',
        'Study groups both formats',
        'Flexible scheduling'
      ],
      color: 'from-purple-500 to-violet-500'
    },
    {
      id: 'online-premium',
      name: 'Online Premium',
      price: '$1,800/semester',
      description: 'Complete online learning with live teacher interaction',
      features: [
        'Live online classes daily',
        'Real teacher interaction',
        'AI learning tools unlimited',
        'Personal AI tutor sessions',
        'Virtual reality experiences',
        'Digital lab simulations',
        'Online study groups',
        'Progress tracking'
      ],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'online-free',
      name: 'Online Free',
      price: '$0 - Limited Access',
      description: 'Limited access to AI tools and recorded content',
      features: [
        'Recorded lesson access',
        'AI tools (10 queries/day)',
        'Basic progress tracking',
        'Community forums',
        'Self-paced learning',
        'Email support only',
        'No live teacher access',
        'Basic certificates'
      ],
      color: 'from-gray-500 to-slate-500'
    }
  ]

  const schools = [
    {
      id: 'primary',
      name: 'SuperHero School',
      grades: 'K-6',
      description: 'Gamified learning with superhero themes',
      ai: 'Dean Wonder'
    },
    {
      id: 'secondary',
      name: 'Stage Prep School',
      grades: '7-12',
      description: 'Theater arts meets academic excellence',
      ai: 'Dean Sterling'
    },
    {
      id: 'law',
      name: 'Law School',
      grades: 'College',
      description: 'Professional legal education',
      ai: 'Professor Barrett'
    },
    {
      id: 'language',
      name: 'Language Academy',
      grades: 'All Ages',
      description: 'Global language and cultural immersion',
      ai: 'Professor Lingua'
    }
  ]

  const steps = [
    { id: 1, name: 'School Selection', description: 'Choose your educational program' },
    { id: 2, name: 'Enrollment Type', description: 'Select learning format and pricing' },
    { id: 3, name: 'Student Information', description: 'Personal and academic details' },
    { id: 4, name: 'Payment & Confirmation', description: 'Complete enrollment process' }
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
                Student Enrollment
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                  Portal
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Join the Universal One School family and begin your AI-powered educational journey
              </p>
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
        {/* Progress Steps */}
        <Card className="mb-8 bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    currentStep >= step.id 
                      ? 'bg-cyan-500 border-cyan-500 text-black' 
                      : 'border-slate-600 text-gray-400'
                  }`}>
                    {currentStep > step.id ? <CheckCircle className="h-5 w-5" /> : step.id}
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <p className={`text-sm font-medium ${currentStep >= step.id ? 'text-cyan-400' : 'text-gray-400'}`}>
                      {step.name}
                    </p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`hidden sm:block w-16 h-0.5 ml-6 ${
                      currentStep > step.id ? 'bg-cyan-500' : 'bg-slate-600'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <Progress value={(currentStep / steps.length) * 100} className="h-2" />
          </CardContent>
        </Card>

        {/* Step Content */}
        {currentStep === 1 && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Choose Your School Program</CardTitle>
              <CardDescription className="text-gray-300">
                Select the educational program that best fits your academic goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {schools.map((school) => (
                  <Card 
                    key={school.id} 
                    className={`cursor-pointer transition-all ${
                      selectedProgram === school.id 
                        ? 'border-cyan-500 bg-cyan-500/10' 
                        : 'border-slate-600 hover:border-slate-500'
                    }`}
                    onClick={() => setSelectedProgram(school.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <GraduationCap className="h-8 w-8 text-cyan-400" />
                        {selectedProgram === school.id && <CheckCircle className="h-6 w-6 text-cyan-400" />}
                      </div>
                      <h3 className="font-semibold text-white mb-2">{school.name}</h3>
                      <p className="text-sm text-gray-400 mb-1">Grades: {school.grades}</p>
                      <p className="text-sm text-gray-500 mb-3">{school.description}</p>
                      <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
                        AI Teacher: {school.ai}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <Button 
                  onClick={() => setCurrentStep(2)} 
                  disabled={!selectedProgram}
                  className="bg-cyan-500 hover:bg-cyan-600 text-black"
                >
                  Continue to Enrollment Type
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Select Enrollment Type</CardTitle>
              <CardDescription className="text-gray-300">
                Choose the learning format and pricing tier that works for you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid lg:grid-cols-2 gap-6">
                {enrollmentOptions.map((option) => (
                  <Card 
                    key={option.id} 
                    className={`cursor-pointer transition-all ${
                      enrollmentType === option.id 
                        ? 'border-cyan-500 bg-cyan-500/10' 
                        : 'border-slate-600 hover:border-slate-500'
                    }`}
                    onClick={() => setEnrollmentType(option.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${option.color} flex items-center justify-center`}>
                          <DollarSign className="h-6 w-6 text-white" />
                        </div>
                        {enrollmentType === option.id && <CheckCircle className="h-6 w-6 text-cyan-400" />}
                      </div>
                      <h3 className="font-semibold text-white mb-2">{option.name}</h3>
                      <p className="text-lg font-bold text-cyan-400 mb-2">{option.price}</p>
                      <p className="text-sm text-gray-400 mb-4">{option.description}</p>
                      <div className="space-y-2">
                        {option.features.map((feature, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-300">
                            <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(1)} className="border-slate-600 text-gray-300">
                  Back
                </Button>
                <Button 
                  onClick={() => setCurrentStep(3)} 
                  disabled={!enrollmentType}
                  className="bg-cyan-500 hover:bg-cyan-600 text-black"
                >
                  Continue to Student Info
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 3 && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Student Information</CardTitle>
              <CardDescription className="text-gray-300">
                Please provide student details for enrollment and Texas charter school compliance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-gray-300">First Name</Label>
                  <Input id="firstName" placeholder="Enter first name" className="bg-slate-700 border-slate-600 text-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-gray-300">Last Name</Label>
                  <Input id="lastName" placeholder="Enter last name" className="bg-slate-700 border-slate-600 text-white" />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="birthDate" className="text-gray-300">Date of Birth</Label>
                  <Input id="birthDate" type="date" className="bg-slate-700 border-slate-600 text-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grade" className="text-gray-300">Current Grade Level</Label>
                  <Select>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="k">Kindergarten</SelectItem>
                      <SelectItem value="1">1st Grade</SelectItem>
                      <SelectItem value="2">2nd Grade</SelectItem>
                      <SelectItem value="3">3rd Grade</SelectItem>
                      <SelectItem value="4">4th Grade</SelectItem>
                      <SelectItem value="5">5th Grade</SelectItem>
                      <SelectItem value="6">6th Grade</SelectItem>
                      <SelectItem value="7">7th Grade</SelectItem>
                      <SelectItem value="8">8th Grade</SelectItem>
                      <SelectItem value="9">9th Grade</SelectItem>
                      <SelectItem value="10">10th Grade</SelectItem>
                      <SelectItem value="11">11th Grade</SelectItem>
                      <SelectItem value="12">12th Grade</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="parentEmail" className="text-gray-300">Parent/Guardian Email</Label>
                <Input id="parentEmail" type="email" placeholder="Enter parent email" className="bg-slate-700 border-slate-600 text-white" />
              </div>

              <div className="space-y-4">
                <Label className="text-gray-300">Learning Support Needs (Optional)</Label>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    'ADHD Support',
                    'Dyslexia Support',
                    'Autism Spectrum Support',
                    'Gifted/Talented',
                    'English Language Learner',
                    '504 Plan'
                  ].map((support) => (
                    <div key={support} className="flex items-center space-x-2">
                      <Checkbox id={support} />
                      <Label htmlFor={support} className="text-sm text-gray-300">{support}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(2)} className="border-slate-600 text-gray-300">
                  Back
                </Button>
                <Button 
                  onClick={() => setCurrentStep(4)} 
                  className="bg-cyan-500 hover:bg-cyan-600 text-black"
                >
                  Continue to Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 4 && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Payment & Confirmation</CardTitle>
              <CardDescription className="text-gray-300">
                Complete your enrollment with secure payment processing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-slate-700/50 rounded-lg p-6">
                <h4 className="font-semibold text-white mb-4">Enrollment Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">School Program:</span>
                    <span className="text-white">{schools.find(s => s.id === selectedProgram)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Enrollment Type:</span>
                    <span className="text-white">{enrollmentOptions.find(e => e.id === enrollmentType)?.name}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg">
                    <span className="text-gray-300">Total Cost:</span>
                    <span className="text-cyan-400">{enrollmentOptions.find(e => e.id === enrollmentType)?.price}</span>
                  </div>
                </div>
              </div>

              {enrollmentType !== 'online-free' && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-white">Payment Information</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber" className="text-gray-300">Card Number</Label>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" className="bg-slate-700 border-slate-600 text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expiry" className="text-gray-300">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM/YY" className="bg-slate-700 border-slate-600 text-white" />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="cvv" className="text-gray-300">CVV</Label>
                      <Input id="cvv" placeholder="123" className="bg-slate-700 border-slate-600 text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="billingZip" className="text-gray-300">Billing ZIP</Label>
                      <Input id="billingZip" placeholder="12345" className="bg-slate-700 border-slate-600 text-white" />
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Shield className="h-6 w-6 text-green-400" />
                  <div>
                    <p className="font-semibold text-green-400">Secure & Texas Compliant</p>
                    <p className="text-sm text-gray-300">Your information is protected and meets all Texas charter school requirements</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(3)} className="border-slate-600 text-gray-300">
                  Back
                </Button>
                <Button className="bg-green-500 hover:bg-green-600 text-black">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Complete Enrollment
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  )
}