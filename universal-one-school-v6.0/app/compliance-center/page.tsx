'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  FileText, 
  Gavel, 
  BookOpen, 
  Users, 
  Target, 
  Clock, 
  Home, 
  Download, 
  Search, 
  Filter,
  Eye,
  Settings,
  Award,
  Calendar,
  TrendingUp,
  Bell,
  Flag,
  Scale,
  Lock,
  Key,
  Database,
  Zap,
  Brain,
  UserCheck
} from 'lucide-react'
import Link from 'next/link'

export default function ComplianceCenterPage() {
  const [selectedSection, setSelectedSection] = useState('28.002')
  const [complianceScore, setComplianceScore] = useState(95)
  const [lastAudit, setLastAudit] = useState('2024-12-20')
  const [activeViolations, setActiveViolations] = useState(2)

  // Texas Education Code Database
  const texasEducationCode = {
    '28.002': {
      title: 'Required Curriculum',
      chapter: 'Chapter 28 - Courses of Study; Textbooks',
      summary: 'Establishes the foundation curriculum that each school district must provide',
      keyRequirements: [
        'English language arts (4 credits minimum)',
        'Mathematics (4 credits minimum including Algebra II)',
        'Science (4 credits minimum including Biology, Chemistry, and Physics)',
        'Social studies (4 credits minimum including US History and Government)',
        'Health education as integrated subject or separate course',
        'Physical education with substitutions allowed',
        'Fine arts (1 credit minimum)',
        'Career and technical education (1 credit minimum)',
        'Technology applications integrated throughout'
      ],
      gradeSpecific: {
        'K': ['Reading instruction minimum 90 minutes daily', 'Phonics-based approach required'],
        '1-3': ['Continued phonics instruction', 'Reading comprehension development'],
        '4-8': ['Accelerated instruction for at-risk students', 'STAAR preparation'],
        '9-12': ['College and career readiness standards', 'Endorsement requirements']
      },
      penalties: 'Loss of accreditation, state funding reduction, required corrective action',
      lastUpdated: '2023-09-01'
    },
    '28.025': {
      title: 'High School Diploma and Certificate Requirements',
      chapter: 'Chapter 28 - Courses of Study; Textbooks',
      summary: 'Specifies graduation requirements and diploma types for Texas high schools',
      keyRequirements: [
        'Foundation High School Program (22 credits minimum)',
        'Endorsement requirements (26 credits total)',
        'Distinguished Level of Achievement criteria',
        'College, Career, and Military Readiness (CCMR) indicators',
        'State assessment requirements (STAAR End-of-Course)',
        'Personal Graduation Plan for each student',
        'Four-year course planning requirement'
      ],
      gradeSpecific: {
        '9': ['Personal Graduation Plan development', 'Endorsement pathway selection'],
        '10': ['Mid-course corrections and support', 'Career exploration'],
        '11': ['College readiness assessment', 'Advanced coursework'],
        '12': ['CCMR indicator achievement', 'Transition planning']
      },
      penalties: 'Student graduation delays, district accountability ratings reduction',
      lastUpdated: '2023-08-15'
    },
    '28.0211': {
      title: 'Students with Dyslexia and Related Disorders',
      chapter: 'Chapter 28 - Courses of Study; Textbooks',
      summary: 'Mandates screening, identification, and services for students with dyslexia',
      keyRequirements: [
        'Universal dyslexia screening for K-2 students',
        'Teacher training in dyslexia and related disorders',
        'Evidence-based structured literacy instruction',
        'Individualized instruction programs',
        'Progress monitoring and data collection',
        'Parent notification and involvement',
        'Qualified instructor requirements'
      ],
      gradeSpecific: {
        'K-2': ['Mandatory screening instruments', 'Early intervention protocols'],
        '3-12': ['Continued services and accommodations', 'Transition planning']
      },
      penalties: 'Federal compliance violations, individual student lawsuits',
      lastUpdated: '2023-06-01'
    },
    '29.081': {
      title: 'Certification Required',
      chapter: 'Chapter 29 - Educational Programs',
      summary: 'Requirements for teacher certification and professional development',
      keyRequirements: [
        'Valid teaching certificate for all instructional staff',
        'Subject-specific certification requirements',
        'Continuing education and professional development',
        'Emergency certification procedures',
        'Substitute teacher qualifications',
        'Administrator certification requirements'
      ],
      gradeSpecific: {
        'K-6': ['Elementary certification or subject-specific'],
        '7-12': ['Secondary certification in teaching field required']
      },
      penalties: 'Teacher removal, district sanctions, reduced funding',
      lastUpdated: '2023-07-10'
    },
    '25.112': {
      title: 'Class Size Limitations',
      chapter: 'Chapter 25 - Admission, Transfer, and Attendance',
      summary: 'Establishes maximum class sizes and student-teacher ratios',
      keyRequirements: [
        'K-4 classes limited to 22 students per teacher',
        'Waiver process for exceeding limits',
        'Documentation and reporting requirements',
        'Monitoring and compliance procedures',
        'Parent notification of overages'
      ],
      gradeSpecific: {
        'K-4': ['22 student maximum per certified teacher', 'Aide requirements for larger classes']
      },
      penalties: 'Funding reductions, required corrective action',
      lastUpdated: '2023-05-15'
    }
  }

  // Compliance monitoring data
  const [complianceData] = useState({
    overall: {
      score: 95,
      grade: 'A',
      lastAudit: '2024-12-20',
      nextAudit: '2025-01-15',
      violations: 2,
      warnings: 5
    },
    sections: {
      '28.002': { score: 98, status: 'Compliant', lastCheck: '2024-12-20', issues: 0 },
      '28.025': { score: 94, status: 'Minor Issues', lastCheck: '2024-12-19', issues: 1 },
      '28.0211': { score: 96, status: 'Compliant', lastCheck: '2024-12-18', issues: 0 },
      '29.081': { score: 92, status: 'Minor Issues', lastCheck: '2024-12-17', issues: 1 },
      '25.112': { score: 89, status: 'Warning', lastCheck: '2024-12-16', issues: 3 }
    },
    recentAudits: [
      {
        date: '2024-12-20',
        section: 'TEC §28.002',
        auditor: 'TEA Compliance Agent',
        result: 'Passed',
        score: 98,
        findings: ['All curriculum requirements met', 'Excellent documentation']
      },
      {
        date: '2024-12-19',
        section: 'TEC §28.025',
        auditor: 'TEA Compliance Agent',
        result: 'Minor Issues',
        score: 94,
        findings: ['One student missing Personal Graduation Plan', 'Otherwise compliant']
      },
      {
        date: '2024-12-18',
        section: 'TEC §28.0211',
        auditor: 'TEA Compliance Agent',
        result: 'Passed',
        score: 96,
        findings: ['Dyslexia program fully implemented', 'Teacher training current']
      }
    ],
    violations: [
      {
        id: 'V-2024-001',
        section: 'TEC §25.112',
        severity: 'Medium',
        description: 'Grade 2 class exceeds 22 student limit (24 students)',
        dueDate: '2024-12-30',
        status: 'In Progress',
        correctionPlan: 'Hiring additional teacher, temporary aide assigned'
      },
      {
        id: 'V-2024-002',
        section: 'TEC §29.081',
        severity: 'Low',
        description: 'Substitute teacher lacks proper certification',
        dueDate: '2024-12-25',
        status: 'Resolved',
        correctionPlan: 'Certified substitute assigned, documentation updated'
      }
    ],
    warnings: [
      {
        id: 'W-2024-001',
        section: 'TEC §28.002',
        description: 'PE substitution documentation needs updating',
        priority: 'Low',
        dueDate: '2025-01-15'
      },
      {
        id: 'W-2024-002',
        section: 'TEC §28.025',
        description: 'Three students approaching credit deficiency',
        priority: 'Medium',
        dueDate: '2025-01-10'
      }
    ]
  })

  const getComplianceColor = (score) => {
    if (score >= 95) return 'text-green-400'
    if (score >= 85) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getStatusBadge = (status) => {
    const colors = {
      'Compliant': 'bg-green-600/20 text-green-300',
      'Minor Issues': 'bg-yellow-600/20 text-yellow-300',
      'Warning': 'bg-red-600/20 text-red-300',
      'Critical': 'bg-red-700/30 text-red-200'
    }
    return colors[status] || 'bg-gray-600/20 text-gray-300'
  }

  const runComplianceCheck = () => {
    // Simulate automated compliance check
    setComplianceScore(Math.floor(Math.random() * 10) + 90)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Link href="/">
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
            <Link href="/curriculum-generator">
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <BookOpen className="h-4 w-4 mr-2" />
                Curriculum Generator
              </Button>
            </Link>
            <Link href="/curriculum-library">
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <FileText className="h-4 w-4 mr-2" />
                Curriculum Library
              </Button>
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Texas Education Code Compliance Center
          </h1>
          <p className="text-orange-200 text-lg">
            Automated Compliance Monitoring | Legal Requirement Tracking | Risk Management
          </p>
          <div className="mt-4 flex justify-center gap-4 flex-wrap">
            <Badge className="bg-red-600/20 text-red-300 px-4 py-2">
              TEC Monitoring
            </Badge>
            <Badge className="bg-orange-600/20 text-orange-300 px-4 py-2">
              Automated Audits
            </Badge>
            <Badge className="bg-yellow-600/20 text-yellow-300 px-4 py-2">
              Risk Prevention
            </Badge>
            <Badge className="bg-green-600/20 text-green-300 px-4 py-2">
              {complianceData.overall.score}% Compliant
            </Badge>
          </div>
        </div>

        {/* Compliance Dashboard Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 border-white/20 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Overall Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${getComplianceColor(complianceData.overall.score)}`}>
                {complianceData.overall.score}%
              </div>
              <p className="text-xs text-white/70">Grade {complianceData.overall.grade}</p>
              <div className="mt-2">
                <Button 
                  size="sm" 
                  onClick={runComplianceCheck}
                  className="bg-orange-600/20 border-orange-600/30 text-orange-300 hover:bg-orange-600/30"
                >
                  <Zap className="h-3 w-3 mr-1" />
                  Run Check
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Active Violations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-400">
                {complianceData.violations.filter(v => v.status !== 'Resolved').length}
              </div>
              <p className="text-xs text-red-300">Requiring action</p>
              <div className="text-xs text-white/70 mt-1">
                Due by {complianceData.violations[0]?.dueDate}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Warnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-400">
                {complianceData.warnings.length}
              </div>
              <p className="text-xs text-yellow-300">Preventive items</p>
              <div className="text-xs text-white/70 mt-1">
                Next due {complianceData.warnings[1]?.dueDate}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Last Audit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-green-400">
                {complianceData.overall.lastAudit}
              </div>
              <p className="text-xs text-green-300">TEA Approved</p>
              <div className="text-xs text-white/70 mt-1">
                Next: {complianceData.overall.nextAudit}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/10 border-white/20">
            <TabsTrigger value="overview" className="text-white">Overview</TabsTrigger>
            <TabsTrigger value="sections" className="text-white">TEC Sections</TabsTrigger>
            <TabsTrigger value="violations" className="text-white">Violations</TabsTrigger>
            <TabsTrigger value="audits" className="text-white">Audit History</TabsTrigger>
            <TabsTrigger value="monitoring" className="text-white">Monitoring</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Compliance Status by Section */}
            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Texas Education Code Compliance Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(complianceData.sections).map(([section, data]) => (
                    <div key={section} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="font-medium">TEC §{section}</div>
                          <div className="text-sm text-white/70">{texasEducationCode[section]?.title}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className={`font-bold ${getComplianceColor(data.score)}`}>
                            {data.score}%
                          </div>
                          <div className="text-xs text-white/70">{data.lastCheck}</div>
                        </div>
                        <Badge className={getStatusBadge(data.status)}>
                          {data.status}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                          onClick={() => setSelectedSection(section)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white/10 border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Urgent Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {complianceData.violations
                      .filter(v => v.status !== 'Resolved')
                      .slice(0, 3)
                      .map(violation => (
                      <div key={violation.id} className="p-3 bg-red-600/20 rounded-lg border border-red-600/30">
                        <div className="text-sm font-medium text-red-300">{violation.section}</div>
                        <div className="text-xs text-red-200 mt-1">{violation.description}</div>
                        <div className="text-xs text-white/70 mt-2">Due: {violation.dueDate}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Upcoming Deadlines
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {complianceData.warnings.map(warning => (
                      <div key={warning.id} className="p-3 bg-yellow-600/20 rounded-lg border border-yellow-600/30">
                        <div className="text-sm font-medium text-yellow-300">{warning.section}</div>
                        <div className="text-xs text-yellow-200 mt-1">{warning.description}</div>
                        <div className="text-xs text-white/70 mt-2">Due: {warning.dueDate}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Compliance Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">This Month</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-white/20 rounded-full h-2">
                          <div className="bg-green-400 h-2 rounded-full" style={{width: '95%'}}></div>
                        </div>
                        <span className="text-green-400 text-sm">95%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Last Month</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-white/20 rounded-full h-2">
                          <div className="bg-yellow-400 h-2 rounded-full" style={{width: '87%'}}></div>
                        </div>
                        <span className="text-yellow-400 text-sm">87%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">6 Months Ago</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-white/20 rounded-full h-2">
                          <div className="bg-red-400 h-2 rounded-full" style={{width: '78%'}}></div>
                        </div>
                        <span className="text-red-400 text-sm">78%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TEC Sections Tab */}
          <TabsContent value="sections" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Section Selection */}
              <div>
                <Card className="bg-white/10 border-white/20 text-white">
                  <CardHeader>
                    <CardTitle>TEC Sections</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.entries(texasEducationCode).map(([section, data]) => (
                        <Button
                          key={section}
                          variant={selectedSection === section ? 'default' : 'outline'}
                          className={`w-full justify-start ${
                            selectedSection === section 
                              ? 'bg-orange-600/30 border-orange-600/50' 
                              : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                          }`}
                          onClick={() => setSelectedSection(section)}
                        >
                          <div className="text-left">
                            <div className="font-medium">§{section}</div>
                            <div className="text-xs opacity-70">{data.title}</div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Section Details */}
              <div className="lg:col-span-2">
                <Card className="bg-white/10 border-white/20 text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div>
                        <div>TEC §{selectedSection}</div>
                        <div className="text-sm text-orange-300 font-normal">
                          {texasEducationCode[selectedSection]?.title}
                        </div>
                      </div>
                      <Badge className={getStatusBadge(complianceData.sections[selectedSection]?.status)}>
                        {complianceData.sections[selectedSection]?.status}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-white/70">
                      {texasEducationCode[selectedSection]?.chapter}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-blue-300 mb-2">Summary</h4>
                      <p className="text-sm text-white/80">
                        {texasEducationCode[selectedSection]?.summary}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-green-300 mb-3">Key Requirements</h4>
                      <div className="space-y-2">
                        {texasEducationCode[selectedSection]?.keyRequirements.map((req, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                            <span>{req}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-purple-300 mb-3">Grade-Specific Requirements</h4>
                      <div className="space-y-3">
                        {Object.entries(texasEducationCode[selectedSection]?.gradeSpecific || {}).map(([grade, reqs]) => (
                          <div key={grade} className="p-3 bg-white/5 rounded-lg">
                            <div className="font-medium text-purple-300 mb-2">
                              {grade === 'K' ? 'Kindergarten' : 
                               grade.includes('-') ? `Grades ${grade}` : 
                               `Grade ${grade}`}
                            </div>
                            <div className="space-y-1">
                              {reqs.map((req, idx) => (
                                <div key={idx} className="text-sm text-white/80 flex items-start gap-2">
                                  <Target className="h-3 w-3 text-purple-400 mt-1" />
                                  <span>{req}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-red-600/20 rounded-lg border border-red-600/30">
                      <h4 className="font-semibold text-red-300 mb-2">Penalties for Non-Compliance</h4>
                      <p className="text-sm text-red-200">{texasEducationCode[selectedSection]?.penalties}</p>
                    </div>

                    <div className="text-xs text-white/50">
                      Last updated: {texasEducationCode[selectedSection]?.lastUpdated}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Violations Tab */}
          <TabsContent value="violations" className="space-y-6">
            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Active Violations and Corrective Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {complianceData.violations.map(violation => (
                    <div key={violation.id} className={`p-4 rounded-lg border ${
                      violation.severity === 'High' ? 'bg-red-600/20 border-red-600/30' :
                      violation.severity === 'Medium' ? 'bg-yellow-600/20 border-yellow-600/30' :
                      'bg-blue-600/20 border-blue-600/30'
                    }`}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="font-medium">{violation.id}</div>
                          <div className="text-sm text-white/70">{violation.section}</div>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={`${
                            violation.severity === 'High' ? 'bg-red-700/30 text-red-200' :
                            violation.severity === 'Medium' ? 'bg-yellow-700/30 text-yellow-200' :
                            'bg-blue-700/30 text-blue-200'
                          }`}>
                            {violation.severity}
                          </Badge>
                          <Badge className={`${
                            violation.status === 'Resolved' ? 'bg-green-600/20 text-green-300' :
                            violation.status === 'In Progress' ? 'bg-orange-600/20 text-orange-300' :
                            'bg-red-600/20 text-red-300'
                          }`}>
                            {violation.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm mb-3">{violation.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-orange-400" />
                          <span>Due Date: {violation.dueDate}</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <Settings className="h-4 w-4 text-blue-400 mt-0.5" />
                          <span>Correction Plan: {violation.correctionPlan}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit History Tab */}
          <TabsContent value="audits" className="space-y-6">
            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Compliance Audit History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {complianceData.recentAudits.map((audit, idx) => (
                    <div key={idx} className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="font-medium">{audit.section}</div>
                          <div className="text-sm text-white/70">{audit.date}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`text-2xl font-bold ${getComplianceColor(audit.score)}`}>
                            {audit.score}%
                          </div>
                          <Badge className={`${
                            audit.result === 'Passed' ? 'bg-green-600/20 text-green-300' :
                            audit.result === 'Minor Issues' ? 'bg-yellow-600/20 text-yellow-300' :
                            'bg-red-600/20 text-red-300'
                          }`}>
                            {audit.result}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="text-sm text-blue-300 mb-2">Auditor: {audit.auditor}</div>
                      
                      <div>
                        <h4 className="font-medium text-green-300 mb-2">Findings:</h4>
                        <ul className="space-y-1">
                          {audit.findings.map((finding, findingIdx) => (
                            <li key={findingIdx} className="text-sm flex items-start gap-2">
                              <CheckCircle className="h-3 w-3 text-green-400 mt-1" />
                              <span>{finding}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Monitoring Tab */}
          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/10 border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    AI Compliance Agent
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-green-600/20 rounded-lg border border-green-600/30">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="font-medium text-green-300">Agent Status: Active</span>
                      </div>
                      <div className="text-sm text-green-200">
                        Continuously monitoring curriculum and operations for TEC compliance
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Last Scan:</span>
                        <span className="text-blue-300">2 minutes ago</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Items Checked:</span>
                        <span className="text-green-300">1,247</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Alerts Generated:</span>
                        <span className="text-orange-300">3 today</span>
                      </div>
                    </div>
                    
                    <Button className="w-full bg-green-600/20 border-green-600/30 text-green-300 hover:bg-green-600/30">
                      <Zap className="h-4 w-4 mr-2" />
                      Force Compliance Scan
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Monitoring Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Real-time Monitoring</span>
                      <Badge className="bg-green-600/20 text-green-300">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Email Alerts</span>
                      <Badge className="bg-green-600/20 text-green-300">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Weekly Reports</span>
                      <Badge className="bg-green-600/20 text-green-300">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Curriculum Validation</span>
                      <Badge className="bg-green-600/20 text-green-300">Auto</Badge>
                    </div>
                    
                    <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}