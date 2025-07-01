'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Scale, GraduationCap, Book, Users, Award, Briefcase, FileText, Gavel } from 'lucide-react'

export default function LawSchoolPage() {
  const [selectedTrack, setSelectedTrack] = useState('pre-law')

  const careerTracks = {
    'pre-law': {
      name: 'Pre-Law Foundation',
      description: 'Undergraduate preparation for law school',
      duration: '4 years',
      focus: 'Critical thinking, writing, and legal reasoning fundamentals'
    },
    'paralegal': {
      name: 'Paralegal Certification',
      description: 'Professional paralegal training program',
      duration: '18 months',
      focus: 'Legal research, document preparation, and case management'
    },
    'legal-studies': {
      name: 'Legal Studies Degree',
      description: 'Comprehensive legal education program',
      duration: '2-3 years',
      focus: 'Law theory, legal systems, and practical applications'
    },
    'continuing-ed': {
      name: 'Continuing Legal Education',
      description: 'Professional development for legal practitioners',
      duration: 'Ongoing',
      focus: 'Current legal trends, ethics, and specialized practice areas'
    }
  }

  const practiceAreas = [
    {
      name: 'Constitutional Law',
      icon: <Scale className="h-6 w-6" />,
      description: 'Fundamental rights and governmental powers',
      skills: ['Constitutional interpretation', 'Civil rights advocacy', 'Judicial review', 'Federal/state law']
    },
    {
      name: 'Criminal Justice',
      icon: <Gavel className="h-6 w-6" />,
      description: 'Criminal law and justice system procedures',
      skills: ['Criminal procedure', 'Evidence law', 'Trial advocacy', 'Sentencing guidelines']
    },
    {
      name: 'Corporate Law',
      icon: <Briefcase className="h-6 w-6" />,
      description: 'Business law and corporate governance',
      skills: ['Contract law', 'Securities regulation', 'Mergers & acquisitions', 'Compliance']
    },
    {
      name: 'Family Law',
      icon: <Users className="h-6 w-6" />,
      description: 'Family relationships and domestic matters',
      skills: ['Divorce proceedings', 'Child custody', 'Adoption law', 'Domestic relations']
    },
    {
      name: 'Environmental Law',
      icon: <FileText className="h-6 w-6" />,
      description: 'Environmental protection and regulation',
      skills: ['Environmental compliance', 'Natural resources', 'Climate law', 'Regulatory analysis']
    },
    {
      name: 'Intellectual Property',
      icon: <Book className="h-6 w-6" />,
      description: 'Patents, trademarks, and copyrights',
      skills: ['Patent prosecution', 'Trademark registration', 'Copyright law', 'Trade secrets']
    }
  ]

  const texasLegalSystem = [
    {
      level: 'Municipal Courts',
      jurisdiction: 'Local ordinances, traffic violations, minor offenses',
      experience: 'Observation and basic research'
    },
    {
      level: 'Justice of the Peace',
      jurisdiction: 'Small claims, magistrate duties, civil matters under $20,000',
      experience: 'Document preparation and filing'
    },
    {
      level: 'County Courts',
      jurisdiction: 'Misdemeanors, civil suits, probate matters',
      experience: 'Legal research and case analysis'
    },
    {
      level: 'District Courts',
      jurisdiction: 'Felonies, major civil cases, family law',
      experience: 'Trial preparation and advocacy skills'
    },
    {
      level: 'Courts of Appeals',
      jurisdiction: 'Appellate review of lower court decisions',
      experience: 'Brief writing and appellate advocacy'
    },
    {
      level: 'Supreme Court of Texas',
      jurisdiction: 'Civil matters, constitutional issues',
      experience: 'Advanced constitutional law and policy'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-amber-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-800 via-blue-900 to-amber-800 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/20 to-blue-900/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-4 mb-6">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center overflow-hidden">
                <img 
                  src="/logo-main.jpeg" 
                  alt="Universal One School Logo" 
                  className="w-16 h-16 object-contain"
                />
              </div>
              <Scale className="h-16 w-16 text-amber-300" />
              <Gavel className="h-12 w-12 text-blue-300" />
              <GraduationCap className="h-14 w-14 text-slate-300" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Future Legal Professionals
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              All Levels • Where Justice Meets Excellence in Legal Education
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <Users className="h-4 w-4 mr-2" />
                87 Law Students
              </Badge>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <Award className="h-4 w-4 mr-2" />
                Bar Exam Ready
              </Badge>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <Scale className="h-4 w-4 mr-2" />
                Texas Law Focus
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Career Track Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Choose Your Legal Career Path</CardTitle>
            <CardDescription className="text-center">
              Comprehensive programs from pre-law preparation to continuing legal education
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(careerTracks).map(([key, track]) => (
                <Button
                  key={key}
                  variant={selectedTrack === key ? 'default' : 'outline'}
                  onClick={() => setSelectedTrack(key)}
                  className="h-24 flex flex-col p-4"
                >
                  <span className="font-bold text-sm">{track.name}</span>
                  <span className="text-xs text-gray-600">{track.duration}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Selected Track Details */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Scale className="h-6 w-6 text-blue-600" />
              <span>{careerTracks[selectedTrack as keyof typeof careerTracks].name}</span>
            </CardTitle>
            <CardDescription>
              {careerTracks[selectedTrack as keyof typeof careerTracks].description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Program Focus</h4>
                <p className="text-sm text-gray-700 mb-4">
                  {careerTracks[selectedTrack as keyof typeof careerTracks].focus}
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Core Curriculum</span>
                    <Progress value={85} className="w-24 h-2" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Practical Experience</span>
                    <Progress value={75} className="w-24 h-2" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Legal Research</span>
                    <Progress value={90} className="w-24 h-2" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Professional Ethics</span>
                    <Progress value={95} className="w-24 h-2" />
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Career Outcomes</h4>
                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <ul className="text-sm space-y-1">
                      {selectedTrack === 'pre-law' && (
                        <>
                          <li>• Law school admission preparation</li>
                          <li>• LSAT preparation and strategy</li>
                          <li>• Legal research foundation</li>
                          <li>• Critical thinking development</li>
                          <li>• Professional writing skills</li>
                        </>
                      )}
                      {selectedTrack === 'paralegal' && (
                        <>
                          <li>• Certified paralegal certification</li>
                          <li>• Law firm employment readiness</li>
                          <li>• Legal document preparation</li>
                          <li>• Case management systems</li>
                          <li>• Client communication skills</li>
                        </>
                      )}
                      {selectedTrack === 'legal-studies' && (
                        <>
                          <li>• Legal analyst positions</li>
                          <li>• Government compliance roles</li>
                          <li>• Corporate legal departments</li>
                          <li>• Legal consulting opportunities</li>
                          <li>• Advanced degree preparation</li>
                        </>
                      )}
                      {selectedTrack === 'continuing-ed' && (
                        <>
                          <li>• CLE credit fulfillment</li>
                          <li>• Specialization development</li>
                          <li>• Professional network expansion</li>
                          <li>• Current law updates</li>
                          <li>• Ethics requirement satisfaction</li>
                        </>
                      )}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Practice Areas */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Briefcase className="h-6 w-6 text-amber-600" />
              <span>Practice Area Specializations</span>
            </CardTitle>
            <CardDescription>
              Explore different areas of legal practice through specialized courses and experiences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {practiceAreas.map((area) => (
                <Card key={area.name} className="border-l-4 border-l-amber-500 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center space-x-2 text-lg">
                      {area.icon}
                      <span>{area.name}</span>
                    </CardTitle>
                    <CardDescription>{area.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {area.skills.map((skill) => (
                        <li key={skill} className="flex items-center space-x-2 text-sm">
                          <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                          <span>{skill}</span>
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
            <TabsTrigger value="practical">Practical Experience</TabsTrigger>
            <TabsTrigger value="texas">Texas Law Focus</TabsTrigger>
            <TabsTrigger value="bar">Bar Preparation</TabsTrigger>
          </TabsList>

          <TabsContent value="curriculum" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Comprehensive Legal Education</CardTitle>
                <CardDescription>
                  Rigorous academic foundation with practical application and ethical grounding
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Core Legal Subjects</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Constitutional Law and Civil Rights</li>
                      <li>• Contracts and Commercial Law</li>
                      <li>• Torts and Personal Injury</li>
                      <li>• Criminal Law and Procedure</li>
                      <li>• Property Law and Real Estate</li>
                      <li>• Evidence and Trial Advocacy</li>
                      <li>• Legal Research and Writing</li>
                      <li>• Professional Responsibility and Ethics</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Skills Development</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Legal research methodologies</li>
                      <li>• Brief writing and legal analysis</li>
                      <li>• Oral advocacy and presentation</li>
                      <li>• Client interviewing and counseling</li>
                      <li>• Negotiation and mediation</li>
                      <li>• Technology in legal practice</li>
                      <li>• Case management and organization</li>
                      <li>• Cross-cultural legal communication</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="practical" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Real-World Legal Experience</CardTitle>
                <CardDescription>
                  Hands-on learning through internships, clinics, and simulated practice
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="border-l-4 border-l-blue-600">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Legal Clinic</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-2">Real cases under supervision</p>
                        <Badge variant="outline">Community Service</Badge>
                      </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-green-600">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Moot Court</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-2">Appellate advocacy competition</p>
                        <Badge variant="outline">Advanced Skills</Badge>
                      </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-purple-600">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Internship Program</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-2">Law firms, courts, government</p>
                        <Badge variant="outline">Professional Network</Badge>
                      </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-orange-600">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Mock Trial</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-2">Trial advocacy simulation</p>
                        <Badge variant="outline">Competitive Team</Badge>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Partnership Network</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Texas state courts and federal district courts</li>
                      <li>• Major law firms in Dallas, Houston, Austin, and San Antonio</li>
                      <li>• Texas Attorney General's Office and district attorneys</li>
                      <li>• Public defender offices and legal aid organizations</li>
                      <li>• Corporate legal departments of Fortune 500 companies</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="texas" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Texas Legal System Expertise</CardTitle>
                <CardDescription>
                  Comprehensive understanding of Texas state law and court systems
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-4">Texas Court System Hierarchy</h4>
                    <div className="space-y-3">
                      {texasLegalSystem.map((court, index) => (
                        <div key={court.level} className="flex items-center space-x-4 p-3 border rounded-lg">
                          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h5 className="font-semibold text-sm">{court.level}</h5>
                            <p className="text-xs text-gray-600">{court.jurisdiction}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {court.experience}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Texas-Specific Law</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Texas Constitution and state law</li>
                        <li>• Property rights and oil/gas law</li>
                        <li>• Texas Family Code</li>
                        <li>• Business Organizations Code</li>
                        <li>• Texas Rules of Civil Procedure</li>
                        <li>• Local government law</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Professional Development</h4>
                      <ul className="text-sm space-y-1">
                        <li>• State Bar of Texas requirements</li>
                        <li>• CLE and professional responsibility</li>
                        <li>• Texas legal practice management</li>
                        <li>• Attorney advertising rules</li>
                        <li>• Trust account regulations</li>
                        <li>• Disciplinary procedures</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bar" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Texas Bar Examination Preparation</CardTitle>
                <CardDescription>
                  Comprehensive preparation for the Texas Bar Exam and legal practice
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <Scale className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                      <h4 className="font-semibold">Multistate Bar Exam</h4>
                      <p className="text-sm text-gray-600">200 multiple choice questions</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <FileText className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <h4 className="font-semibold">Texas Essays</h4>
                      <p className="text-sm text-gray-600">12 essay questions</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <Gavel className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                      <h4 className="font-semibold">Procedure & Evidence</h4>
                      <p className="text-sm text-gray-600">50 multiple choice questions</p>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Bar Prep Program Features</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <ul className="space-y-1">
                        <li>• Comprehensive review courses</li>
                        <li>• Practice exams and simulations</li>
                        <li>• One-on-one tutoring available</li>
                        <li>• Essay writing workshops</li>
                      </ul>
                      <ul className="space-y-1">
                        <li>• Performance tracking and analytics</li>
                        <li>• Stress management and test-taking strategies</li>
                        <li>• Character and fitness guidance</li>
                        <li>• Post-exam career placement assistance</li>
                      </ul>
                    </div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Success Statistics</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-2xl font-bold text-green-600">94%</div>
                        <div className="text-sm">First-Time Pass Rate</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">89%</div>
                        <div className="text-sm">Employment Rate</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">95%</div>
                        <div className="text-sm">Alumni Satisfaction</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Student Access Portal */}
        <Card className="mb-8 border-2 border-slate-300 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-slate-900">Legal Education Portal</CardTitle>
            <CardDescription className="text-center text-slate-700">
              Access your legal studies dashboard and professional development tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="border-2 border-slate-400 hover:shadow-lg hover:border-slate-500 transition-all cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-slate-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2 text-slate-900">Student Dashboard</h3>
                  <p className="text-sm text-slate-700 mb-4">Track courses, case studies, and bar exam prep</p>
                  <Button className="w-full" onClick={() => window.location.href = '/dashboard'}>
                    Enter Dashboard
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-blue-400 hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Scale className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">AI Legal Mentor</h3>
                  <p className="text-sm text-gray-600 mb-4">Study with Professor Barrett, your AI legal studies tutor</p>
                  <Button className="w-full border-2 border-slate-400 text-slate-900 hover:bg-slate-50" variant="outline" onClick={() => window.location.href = '/dashboard'}>
                    ⚖️ Chat with Professor Barrett
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-amber-400 hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-amber-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Gavel className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Bar Exam Prep</h3>
                  <p className="text-sm text-gray-600 mb-4">Access Texas Bar exam preparation and practice tests</p>
                  <Button className="w-full" variant="outline" onClick={() => window.location.href = '/bar-prep'}>
                    Start Prep
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Quick Legal Tools */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-slate-600" />
              <span>Legal Study Tools</span>
            </CardTitle>
            <CardDescription>Professional legal education and career preparation resources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex flex-col" onClick={() => window.location.href = '/case-studies'}>
                <FileText className="h-6 w-6 mb-2 text-slate-600" />
                <span className="text-sm">Case Studies</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col" onClick={() => window.location.href = '/legal-research'}>
                <Book className="h-6 w-6 mb-2 text-blue-600" />
                <span className="text-sm">Legal Research</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col" onClick={() => window.location.href = '/mock-trials'}>
                <Gavel className="h-6 w-6 mb-2 text-amber-600" />
                <span className="text-sm">Mock Trials</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col" onClick={() => window.location.href = '/internships'}>
                <Briefcase className="h-6 w-6 mb-2 text-green-600" />
                <span className="text-sm">Internships</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Enrollment CTA */}
        <Card className="bg-gradient-to-r from-slate-800 to-blue-900 text-white">
          <CardContent className="text-center py-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Pursue Justice?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join our community of future legal professionals and make a difference in the world
            </p>
            <div className="space-x-4">
              <Button size="lg" variant="secondary" onClick={() => window.location.href = '/register'}>
                Schedule Consultation
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-slate-800" onClick={() => window.location.href = '/apply'}>
                Apply Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}