'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  GraduationCap, 
  Target, 
  Trophy, 
  Star, 
  MapPin, 
  DollarSign, 
  Clock, 
  Users, 
  BookOpen, 
  Award,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Home,
  Search,
  Filter,
  Heart,
  Zap
} from 'lucide-react'
import Link from 'next/link'

export default function CollegeReadinessCenter() {
  const [selectedStudent, setSelectedStudent] = useState('maya_rodriguez')
  const [selectedSport, setSelectedSport] = useState('theater')
  const [collegeFilter, setCollegeFilter] = useState('all')

  // Student profiles with athletic/performance data
  const studentProfiles = {
    'maya_rodriguez': {
      name: 'Maya Rodriguez',
      grade: 11,
      gpa: 3.7,
      classRank: 15,
      classSize: 120,
      satScore: 1280,
      actScore: 28,
      sport: 'Theater Performance',
      position: 'Lead Actress',
      achievements: ['Regional Theater Champion', 'All-State Drama Team', 'Theater Scholarship Recipient'],
      interests: ['Performing Arts', 'Creative Writing', 'Psychology'],
      careerGoals: ['Professional Theater', 'Arts Education', 'Drama Therapy'],
      ncaaEligible: true,
      athleticScholarships: ['Arts Excellence', 'Performance Merit'],
      recommendedColleges: ['juilliard', 'yale', 'northwestern', 'carnegie_mellon']
    },
    'jordan_kim': {
      name: 'Jordan Kim',
      grade: 10,
      gpa: 3.9,
      classRank: 8,
      classSize: 115,
      satScore: 1420,
      actScore: 32,
      sport: 'Technical Theater',
      position: 'Stage Manager',
      achievements: ['State Technical Theater Award', 'Innovation in Design'],
      interests: ['Engineering', 'Digital Arts', 'Computer Science'],
      careerGoals: ['Entertainment Technology', 'Digital Media', 'Sound Engineering'],
      ncaaEligible: true,
      athleticScholarships: ['STEM Excellence', 'Technical Arts'],
      recommendedColleges: ['mit', 'stanford', 'ucla', 'nyu']
    }
  }

  // NCAA Eligibility Requirements
  const ncaaRequirements = {
    coreGPA: 2.3,
    coreCourses: 16,
    satScore: 900,
    actScore: 19,
    coreCourseBreakdown: {
      english: 4,
      mathematics: 3,
      science: 2,
      socialStudies: 2,
      additionalCore: 5
    }
  }

  // College database with detailed information
  const collegeDatabase = {
    'juilliard': {
      name: 'The Juilliard School',
      location: 'New York, NY',
      type: 'Private',
      size: 'Small (900 students)',
      acceptance: 8,
      avgSAT: 1450,
      avgACT: 33,
      tuition: 52180,
      strengths: ['Performing Arts', 'Music', 'Drama'],
      athleticPrograms: ['Theater Performance', 'Dance'],
      scholarships: ['Merit-Based', 'Need-Based', 'Talent Scholarships'],
      matchScore: 95,
      reasons: ['Elite performing arts program', 'Strong alumni network', 'NYC location'],
      aiRecommendation: 'Perfect match for Maya\'s theater performance goals with world-class training'
    },
    'yale': {
      name: 'Yale University',
      location: 'New Haven, CT',
      type: 'Private',
      size: 'Medium (6,000 students)',
      acceptance: 6,
      avgSAT: 1510,
      avgACT: 34,
      tuition: 59950,
      strengths: ['Liberal Arts', 'Drama', 'Psychology'],
      athleticPrograms: ['Theater', 'Various NCAA Sports'],
      scholarships: ['Need-Based', 'Academic Merit'],
      matchScore: 88,
      reasons: ['Prestigious drama program', 'Strong academics', 'Extensive resources'],
      aiRecommendation: 'Excellent academics combined with top-tier theater program'
    },
    'northwestern': {
      name: 'Northwestern University',
      location: 'Evanston, IL',
      type: 'Private',
      size: 'Medium (8,500 students)',
      acceptance: 9,
      avgSAT: 1480,
      avgACT: 34,
      tuition: 58702,
      strengths: ['Theater', 'Communications', 'Business'],
      athleticPrograms: ['NCAA Division I', 'Theater Performance'],
      scholarships: ['Merit', 'Need-Based', 'Athletic'],
      matchScore: 92,
      reasons: ['Renowned theater program', 'Strong career placement', 'Research opportunities'],
      aiRecommendation: 'Outstanding theater program with excellent career preparation'
    },
    'carnegie_mellon': {
      name: 'Carnegie Mellon University',
      location: 'Pittsburgh, PA',
      type: 'Private',
      size: 'Medium (7,000 students)',
      acceptance: 17,
      avgSAT: 1465,
      avgACT: 33,
      tuition: 58924,
      strengths: ['Drama', 'Technology', 'Engineering'],
      athleticPrograms: ['NCAA Division III', 'Performance Arts'],
      scholarships: ['Merit-Based', 'Talent Awards'],
      matchScore: 89,
      reasons: ['Top-ranked drama school', 'Technology integration', 'Industry connections'],
      aiRecommendation: 'Perfect blend of traditional theater and modern technology'
    },
    'mit': {
      name: 'Massachusetts Institute of Technology',
      location: 'Cambridge, MA',
      type: 'Private',
      size: 'Medium (4,500 students)',
      acceptance: 7,
      avgSAT: 1520,
      avgACT: 35,
      tuition: 55450,
      strengths: ['Engineering', 'Technology', 'Innovation'],
      athleticPrograms: ['NCAA Division III', 'Technical Arts'],
      scholarships: ['Need-Based', 'Merit'],
      matchScore: 85,
      reasons: ['World-class engineering', 'Innovation focus', 'Strong tech theater'],
      aiRecommendation: 'Ideal for technical theater with cutting-edge technology focus'
    },
    'stanford': {
      name: 'Stanford University',
      location: 'Stanford, CA',
      type: 'Private',
      size: 'Large (7,000 students)',
      acceptance: 4,
      avgSAT: 1500,
      avgACT: 34,
      tuition: 56169,
      strengths: ['Technology', 'Innovation', 'Entrepreneurship'],
      athleticPrograms: ['NCAA Division I', 'Technical Arts'],
      scholarships: ['Need-Based', 'Merit', 'Athletic'],
      matchScore: 82,
      reasons: ['Top engineering program', 'Silicon Valley connections', 'Innovation culture'],
      aiRecommendation: 'Excellent for technology-focused theater and entertainment industry'
    }
  }

  const selectedStudentData = studentProfiles[selectedStudent]

  // Calculate NCAA eligibility
  const calculateNCAAEligibility = (student) => {
    const gpaEligible = student.gpa >= ncaaRequirements.coreGPA
    const satEligible = student.satScore >= ncaaRequirements.satScore
    const actEligible = student.actScore >= ncaaRequirements.actScore
    
    return {
      overall: gpaEligible && (satEligible || actEligible),
      gpa: gpaEligible,
      standardizedTest: satEligible || actEligible,
      recommendations: []
    }
  }

  // AI College Matching Algorithm
  const calculateCollegeMatch = (student, college) => {
    let score = 0
    let factors = []
    
    // Academic fit (40% weight)
    const gpaFit = (student.gpa / 4.0) * 100
    const testFit = Math.min((student.satScore / college.avgSAT) * 100, 100)
    const academicScore = (gpaFit + testFit) / 2
    score += academicScore * 0.4
    factors.push({ factor: 'Academic Fit', score: Math.round(academicScore), weight: '40%' })
    
    // Program strength (35% weight)
    const hasStrongProgram = college.strengths.some(strength => 
      student.interests.some(interest => 
        strength.toLowerCase().includes(interest.toLowerCase()) ||
        interest.toLowerCase().includes(strength.toLowerCase())
      )
    )
    const programScore = hasStrongProgram ? 95 : 60
    score += programScore * 0.35
    factors.push({ factor: 'Program Strength', score: programScore, weight: '35%' })
    
    // Athletic/Performance opportunities (15% weight)
    const hasAthletic = college.athleticPrograms.some(program =>
      program.toLowerCase().includes(student.sport.toLowerCase())
    )
    const athleticScore = hasAthletic ? 90 : 50
    score += athleticScore * 0.15
    factors.push({ factor: 'Performance Opportunities', score: athleticScore, weight: '15%' })
    
    // Financial accessibility (10% weight)
    const financialScore = Math.max(0, 100 - (college.tuition / 600)) // Rough affordability score
    score += financialScore * 0.1
    factors.push({ factor: 'Financial Accessibility', score: Math.round(financialScore), weight: '10%' })
    
    return {
      totalScore: Math.round(score),
      factors,
      recommendation: score >= 85 ? 'Excellent Match' : score >= 70 ? 'Good Match' : score >= 55 ? 'Moderate Match' : 'Reach School'
    }
  }

  // Generate personalized recommendations
  const generateRecommendations = (student) => {
    const recommendations = []
    
    // Academic recommendations
    if (student.gpa < 3.5) {
      recommendations.push({
        type: 'academic',
        priority: 'high',
        title: 'GPA Improvement',
        description: 'Focus on raising GPA through strong performance in remaining courses',
        actions: ['Meet with counselor', 'Consider tutoring', 'Prioritize core subjects']
      })
    }
    
    // Test score recommendations
    if (student.satScore < 1200) {
      recommendations.push({
        type: 'testing',
        priority: 'medium',
        title: 'SAT/ACT Preparation',
        description: 'Consider retaking standardized tests to improve college admission chances',
        actions: ['Take practice tests', 'Consider test prep courses', 'Schedule retake dates']
      })
    }
    
    // Athletic/performance recommendations
    recommendations.push({
      type: 'athletic',
      priority: 'medium',
      title: 'Performance Portfolio',
      description: 'Develop a comprehensive portfolio showcasing theater achievements',
      actions: ['Create performance reel', 'Document achievements', 'Get recommendation letters']
    })
    
    return recommendations
  }

  const ncaaStatus = calculateNCAAEligibility(selectedStudentData)
  const personalizedRecommendations = generateRecommendations(selectedStudentData)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Link href="/schools/secondary-school">
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Home className="h-4 w-4 mr-2" />
                Back to Secondary School
              </Button>
            </Link>
            <Link href="/texas-graduation">
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <GraduationCap className="h-4 w-4 mr-2" />
                Graduation Tracker
              </Button>
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            College Readiness & Athletic Recruitment Center
          </h1>
          <p className="text-blue-200 text-lg">
            AI-Powered College Matching | NCAA Eligibility | Student-Athlete Support
          </p>
          <div className="mt-4 flex justify-center gap-4 flex-wrap">
            <Badge className="bg-blue-600/20 text-blue-300 px-4 py-2">
              NCAA Clearinghouse
            </Badge>
            <Badge className="bg-green-600/20 text-green-300 px-4 py-2">
              AI College Matching
            </Badge>
            <Badge className="bg-purple-600/20 text-purple-300 px-4 py-2">
              Athletic Recruitment
            </Badge>
            <Badge className="bg-yellow-600/20 text-yellow-300 px-4 py-2">
              Performance Arts Focus
            </Badge>
          </div>
        </div>

        {/* Student Selector */}
        <div className="flex gap-4 mb-6 justify-center">
          <Select value={selectedStudent} onValueChange={setSelectedStudent}>
            <SelectTrigger className="w-64 bg-white/10 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(studentProfiles).map(([id, student]) => (
                <SelectItem key={id} value={id}>
                  {student.name} - Grade {student.grade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white/10 border-white/20">
            <TabsTrigger value="overview" className="text-white">Overview</TabsTrigger>
            <TabsTrigger value="ncaa" className="text-white">NCAA Status</TabsTrigger>
            <TabsTrigger value="colleges" className="text-white">College Match</TabsTrigger>
            <TabsTrigger value="athletic" className="text-white">Athletic Profile</TabsTrigger>
            <TabsTrigger value="recommendations" className="text-white">AI Guidance</TabsTrigger>
            <TabsTrigger value="timeline" className="text-white">Action Plan</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Student Profile */}
              <Card className="bg-white/10 border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Student Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Name:</span>
                    <span className="font-medium">{selectedStudentData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Grade:</span>
                    <span>{selectedStudentData.grade}th</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GPA:</span>
                    <Badge className="bg-green-600/20 text-green-300">{selectedStudentData.gpa}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Class Rank:</span>
                    <span>{selectedStudentData.classRank} of {selectedStudentData.classSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sport/Activity:</span>
                    <span className="text-purple-300">{selectedStudentData.sport}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Position:</span>
                    <span className="text-blue-300">{selectedStudentData.position}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Test Scores */}
              <Card className="bg-white/10 border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Test Scores
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">
                      {selectedStudentData.satScore}
                    </div>
                    <p className="text-sm text-blue-200">SAT Score</p>
                    <div className="text-lg font-bold text-green-400 mt-2">
                      {selectedStudentData.actScore}
                    </div>
                    <p className="text-sm text-green-200">ACT Score</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span>SAT Percentile:</span>
                      <span className="text-blue-300">85th</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>ACT Percentile:</span>
                      <span className="text-green-300">88th</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>NCAA Eligible:</span>
                      <Badge className="bg-green-600/20 text-green-300">Yes</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Athletic Achievements */}
              <Card className="bg-white/10 border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedStudentData.achievements.map((achievement, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <Award className="h-3 w-3 text-yellow-400" />
                      <span>{achievement}</span>
                    </div>
                  ))}
                  <div className="mt-4">
                    <div className="text-sm text-purple-300 font-medium mb-2">Scholarship Opportunities:</div>
                    {selectedStudentData.athleticScholarships.map((scholarship, idx) => (
                      <Badge key={idx} className="bg-purple-600/20 text-purple-300 mr-2 mb-1 text-xs">
                        {scholarship}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* College Readiness */}
              <Card className="bg-white/10 border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    College Readiness
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400">A-</div>
                    <p className="text-sm text-green-200">Overall Rating</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span>Academic Readiness:</span>
                      <Badge className="bg-green-600/20 text-green-300">Strong</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Test Scores:</span>
                      <Badge className="bg-green-600/20 text-green-300">Competitive</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Athletic Profile:</span>
                      <Badge className="bg-blue-600/20 text-blue-300">Excellent</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>College Matches:</span>
                      <Badge className="bg-purple-600/20 text-purple-300">{selectedStudentData.recommendedColleges.length}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* NCAA Status Tab */}
          <TabsContent value="ncaa" className="space-y-6">
            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  NCAA Eligibility Center Status
                </CardTitle>
                <CardDescription className="text-blue-200">
                  Performance arts students can benefit from NCAA pathways through related programs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Current Status */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-green-300">Eligibility Status</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-green-600/10 rounded-lg">
                        <span>Overall NCAA Eligibility</span>
                        <Badge className="bg-green-600/20 text-green-300">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Eligible
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <span>Core GPA Requirement (2.3+)</span>
                        <Badge className="bg-green-600/20 text-green-300">
                          {selectedStudentData.gpa} ✓
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <span>SAT Score (900+)</span>
                        <Badge className="bg-green-600/20 text-green-300">
                          {selectedStudentData.satScore} ✓
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <span>ACT Score (19+)</span>
                        <Badge className="bg-green-600/20 text-green-300">
                          {selectedStudentData.actScore} ✓
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Core Course Requirements */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-blue-300">Core Course Progress</h3>
                    <div className="space-y-3">
                      {Object.entries(ncaaRequirements.coreCourseBreakdown).map(([subject, required]) => (
                        <div key={subject} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="capitalize">{subject}</span>
                            <span className="text-sm">{required}/{required}</span>
                          </div>
                          <Progress value={100} className="h-2" />
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 p-3 bg-blue-600/10 rounded-lg">
                      <div className="text-blue-300 font-medium mb-1">Total Core Courses</div>
                      <div className="text-2xl font-bold">16/16 Complete</div>
                      <div className="text-sm text-blue-200">All NCAA core requirements met</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-yellow-600/10 rounded-lg border border-yellow-600/20">
                  <h4 className="font-bold text-yellow-300 mb-2">Performance Arts & NCAA</h4>
                  <p className="text-yellow-200 text-sm mb-3">
                    While traditional sports dominate NCAA, performance arts students can leverage:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-yellow-300 mb-2">Academic Scholarships:</div>
                      <ul className="space-y-1 text-yellow-200">
                        <li>• Merit-based academic awards</li>
                        <li>• Arts excellence scholarships</li>
                        <li>• Leadership recognition</li>
                      </ul>
                    </div>
                    <div>
                      <div className="font-medium text-yellow-300 mb-2">Performance Opportunities:</div>
                      <ul className="space-y-1 text-yellow-200">
                        <li>• University theater programs</li>
                        <li>• Performance ensembles</li>
                        <li>• Arts competition teams</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* College Matching Tab */}
          <TabsContent value="colleges" className="space-y-6">
            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  AI-Powered College Matching
                </CardTitle>
                <CardDescription className="text-blue-200">
                  Personalized college recommendations based on academic profile and performance arts focus
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {selectedStudentData.recommendedColleges.map(collegeId => {
                    const college = collegeDatabase[collegeId]
                    const match = calculateCollegeMatch(selectedStudentData, college)
                    
                    return (
                      <div key={collegeId} className="p-6 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-white">{college.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-blue-200 mt-1">
                              <MapPin className="h-3 w-3" />
                              {college.location} • {college.type} • {college.size}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-400">{match.totalScore}%</div>
                            <Badge className={`${
                              match.totalScore >= 85 ? 'bg-green-600/20 text-green-300' :
                              match.totalScore >= 70 ? 'bg-blue-600/20 text-blue-300' :
                              match.totalScore >= 55 ? 'bg-yellow-600/20 text-yellow-300' :
                              'bg-red-600/20 text-red-300'
                            }`}>
                              {match.recommendation}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div className="text-center p-3 bg-white/5 rounded-lg">
                            <div className="text-red-300 font-medium">Acceptance Rate</div>
                            <div className="text-white text-lg">{college.acceptance}%</div>
                          </div>
                          <div className="text-center p-3 bg-white/5 rounded-lg">
                            <div className="text-blue-300 font-medium">Avg SAT</div>
                            <div className="text-white text-lg">{college.avgSAT}</div>
                          </div>
                          <div className="text-center p-3 bg-white/5 rounded-lg">
                            <div className="text-green-300 font-medium">Avg ACT</div>
                            <div className="text-white text-lg">{college.avgACT}</div>
                          </div>
                          <div className="text-center p-3 bg-white/5 rounded-lg">
                            <div className="text-yellow-300 font-medium">Tuition</div>
                            <div className="text-white text-lg">${(college.tuition / 1000).toFixed(0)}k</div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <h4 className="font-medium text-purple-300 mb-2">Program Strengths:</h4>
                          <div className="flex flex-wrap gap-2">
                            {college.strengths.map(strength => (
                              <Badge key={strength} className="bg-purple-600/20 text-purple-300">
                                {strength}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="mb-4">
                          <h4 className="font-medium text-blue-300 mb-2">AI Recommendation:</h4>
                          <p className="text-blue-200 text-sm">{college.aiRecommendation}</p>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                          {match.factors.map(factor => (
                            <div key={factor.factor} className="text-center p-2 bg-white/5 rounded">
                              <div className="text-xs text-gray-300">{factor.factor}</div>
                              <div className="text-sm font-bold">{factor.score}%</div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 flex gap-2">
                          <Button size="sm" className="bg-blue-600/20 border-blue-600/30 text-blue-300 hover:bg-blue-600/30">
                            <Heart className="h-3 w-3 mr-1" />
                            Add to Favorites
                          </Button>
                          <Button size="sm" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                            View Details
                          </Button>
                          <Button size="sm" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                            Schedule Visit
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Athletic Profile Tab */}
          <TabsContent value="athletic" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/10 border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Performance Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Primary Focus:</span>
                      <Badge className="bg-purple-600/20 text-purple-300">{selectedStudentData.sport}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Position/Role:</span>
                      <span className="text-blue-300">{selectedStudentData.position}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Experience Level:</span>
                      <Badge className="bg-green-600/20 text-green-300">Advanced</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Competition Level:</span>
                      <Badge className="bg-yellow-600/20 text-yellow-300">State/Regional</Badge>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-semibold text-yellow-300 mb-3">Career Interests</h4>
                    <div className="space-y-2">
                      {selectedStudentData.careerGoals.map((goal, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 bg-white/5 rounded">
                          <Star className="h-3 w-3 text-yellow-400" />
                          <span className="text-sm">{goal}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Achievements & Recognition
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {selectedStudentData.achievements.map((achievement, idx) => (
                      <div key={idx} className="p-3 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-center gap-2 mb-1">
                          <Trophy className="h-4 w-4 text-yellow-400" />
                          <span className="font-medium">{achievement}</span>
                        </div>
                        <div className="text-xs text-blue-200 ml-6">
                          {idx === 0 ? 'Regional Competition' : idx === 1 ? 'State Recognition' : 'Merit Award'}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <h4 className="font-semibold text-green-300 mb-3">Scholarship Opportunities</h4>
                    <div className="space-y-2">
                      {selectedStudentData.athleticScholarships.map((scholarship, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-green-600/10 rounded">
                          <span className="text-sm">{scholarship}</span>
                          <Badge className="bg-green-600/20 text-green-300 text-xs">Available</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* AI Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6">
            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Personalized AI Guidance
                </CardTitle>
                <CardDescription className="text-blue-200">
                  Tailored recommendations based on your academic profile and performance goals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {personalizedRecommendations.map((rec, idx) => (
                    <div key={idx} className={`p-4 rounded-lg border ${
                      rec.priority === 'high' ? 'bg-red-600/10 border-red-600/30' :
                      rec.priority === 'medium' ? 'bg-yellow-600/10 border-yellow-600/30' :
                      'bg-blue-600/10 border-blue-600/30'
                    }`}>
                      <div className="flex items-center gap-2 mb-3">
                        {rec.priority === 'high' ? (
                          <AlertTriangle className="h-5 w-5 text-red-400" />
                        ) : rec.priority === 'medium' ? (
                          <Clock className="h-5 w-5 text-yellow-400" />
                        ) : (
                          <Star className="h-5 w-5 text-blue-400" />
                        )}
                        <h3 className="font-bold text-lg">{rec.title}</h3>
                        <Badge className={`${
                          rec.priority === 'high' ? 'bg-red-600/20 text-red-300' :
                          rec.priority === 'medium' ? 'bg-yellow-600/20 text-yellow-300' :
                          'bg-blue-600/20 text-blue-300'
                        }`}>
                          {rec.priority} Priority
                        </Badge>
                      </div>
                      <p className="text-sm mb-4">{rec.description}</p>
                      <div className="space-y-2">
                        <h4 className="font-medium text-green-300">Recommended Actions:</h4>
                        {rec.actions.map((action, actionIdx) => (
                          <div key={actionIdx} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-400" />
                            <span>{action}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-6">
            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  College Preparation Timeline
                </CardTitle>
                <CardDescription className="text-blue-200">
                  Structured action plan for college and performance career readiness
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {/* Current Year */}
                  <div className="border-l-4 border-blue-500 pl-6">
                    <h3 className="text-xl font-bold text-blue-300">Grade 11 (Current Year)</h3>
                    <div className="mt-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-blue-600/10 rounded-lg">
                          <h4 className="font-medium text-blue-300 mb-2">Fall Semester</h4>
                          <ul className="space-y-1 text-sm">
                            <li>• Take PSAT/NMSQT</li>
                            <li>• Research college programs</li>
                            <li>• Build performance portfolio</li>
                            <li>• Meet with college counselor</li>
                          </ul>
                        </div>
                        <div className="p-4 bg-green-600/10 rounded-lg">
                          <h4 className="font-medium text-green-300 mb-2">Spring Semester</h4>
                          <ul className="space-y-1 text-sm">
                            <li>• Take SAT/ACT (first time)</li>
                            <li>• Visit college campuses</li>
                            <li>• Apply for summer programs</li>
                            <li>• Begin college list creation</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Senior Year */}
                  <div className="border-l-4 border-green-500 pl-6">
                    <h3 className="text-xl font-bold text-green-300">Grade 12 (Senior Year)</h3>
                    <div className="mt-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-purple-600/10 rounded-lg">
                          <h4 className="font-medium text-purple-300 mb-2">Fall Semester</h4>
                          <ul className="space-y-1 text-sm">
                            <li>• Submit college applications</li>
                            <li>• Complete performance auditions</li>
                            <li>• Apply for scholarships</li>
                            <li>• Retake SAT/ACT if needed</li>
                          </ul>
                        </div>
                        <div className="p-4 bg-yellow-600/10 rounded-lg">
                          <h4 className="font-medium text-yellow-300 mb-2">Spring Semester</h4>
                          <ul className="space-y-1 text-sm">
                            <li>• Receive admission decisions</li>
                            <li>• Compare financial aid offers</li>
                            <li>• Make final college choice</li>
                            <li>• Complete graduation requirements</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}