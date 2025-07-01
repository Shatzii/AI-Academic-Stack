'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Shield, CheckCircle, AlertTriangle, FileText, Users, 
  GraduationCap, BarChart3, Calendar, Award, Eye 
} from 'lucide-react'

export default function TexasCharterCompliance() {
  const complianceMetrics = {
    overall: 95,
    academic: 98,
    financial: 94,
    governance: 92,
    safety: 97,
    specialEducation: 93
  }

  const complianceAreas = [
    {
      id: 'academic',
      name: 'Academic Standards',
      score: 98,
      status: 'compliant',
      description: 'Texas Essential Knowledge and Skills (TEKS) alignment',
      requirements: [
        'TEKS curriculum alignment - 100%',
        'STAAR testing preparation - 98%',
        'Teacher certification - 100%',
        'Instructional time requirements - 95%'
      ]
    },
    {
      id: 'financial',
      name: 'Financial Reporting',
      score: 94,
      status: 'compliant',
      description: 'TEA financial accountability and reporting',
      requirements: [
        'Annual financial audit - Complete',
        'PEIMS data submission - 100%',
        'Budget transparency - 98%',
        'Federal grant compliance - 90%'
      ]
    },
    {
      id: 'governance',
      name: 'Governance & Operations',
      score: 92,
      status: 'compliant',
      description: 'Charter school board and operational compliance',
      requirements: [
        'Open meetings compliance - 95%',
        'Board training requirements - 100%',
        'Policy documentation - 85%',
        'Public records access - 95%'
      ]
    },
    {
      id: 'safety',
      name: 'Student Safety',
      score: 97,
      status: 'compliant',
      description: 'Campus safety and security protocols',
      requirements: [
        'Emergency response plans - 100%',
        'Background check compliance - 100%',
        'Facility safety inspections - 95%',
        'Transportation safety - 90%'
      ]
    }
  ]

  const recentActivities = [
    {
      date: '2025-06-25',
      type: 'audit',
      title: 'Financial Audit Completed',
      status: 'success',
      description: 'Annual financial audit completed with no findings'
    },
    {
      date: '2025-06-20',
      type: 'submission',
      title: 'PEIMS Summer Data Submission',
      status: 'success',
      description: 'All required PEIMS data submitted on time'
    },
    {
      date: '2025-06-15',
      type: 'training',
      title: 'Board Member Training',
      status: 'success',
      description: 'All board members completed required annual training'
    }
  ]

  const upcomingDeadlines = [
    {
      date: '2025-07-15',
      title: 'Teacher Certification Verification',
      priority: 'high',
      description: 'Verify all teacher certifications for new school year'
    },
    {
      date: '2025-08-01',
      title: 'STAAR Results Analysis',
      priority: 'medium',
      description: 'Complete analysis of spring STAAR test results'
    },
    {
      date: '2025-08-15',
      title: 'Emergency Plan Update',
      priority: 'high',
      description: 'Annual update of campus emergency response plans'
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircle className="h-5 w-5 text-green-400" />
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-400" />
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-400" />
      default: return <CheckCircle className="h-5 w-5 text-gray-400" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900">
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
                Texas Charter School
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                  Compliance Dashboard
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Comprehensive monitoring and reporting for Texas Education Agency compliance
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge variant="secondary" className="text-lg px-4 py-2 bg-green-500/20 text-green-400">
                  <Shield className="h-4 w-4 mr-2" />
                  {complianceMetrics.overall}% Compliant
                </Badge>
                <Badge variant="secondary" className="text-lg px-4 py-2 bg-blue-500/20 text-blue-400">
                  <FileText className="h-4 w-4 mr-2" />
                  TEA Approved
                </Badge>
                <Badge variant="secondary" className="text-lg px-4 py-2 bg-purple-500/20 text-purple-400">
                  <Users className="h-4 w-4 mr-2" />
                  1,247 Active Students
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
        {/* Overall Compliance Score */}
        <Card className="mb-8 bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-2xl flex items-center">
              <Shield className="h-8 w-8 text-green-400 mr-3" />
              Overall Compliance Score
            </CardTitle>
            <CardDescription className="text-gray-300">
              Real-time compliance monitoring across all Texas charter school requirements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
              {Object.entries(complianceMetrics).map(([key, score]) => (
                <div key={key} className="text-center">
                  <div className="mb-2">
                    <div className={`text-3xl font-bold ${score >= 95 ? 'text-green-400' : score >= 90 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {score}%
                    </div>
                    <Progress value={score} className="h-2 mt-2" />
                  </div>
                  <p className="text-sm text-gray-300 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Compliance Areas */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {complianceAreas.map((area) => (
            <Card key={area.id} className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span className="flex items-center">
                    {getStatusIcon(area.status)}
                    <span className="ml-3">{area.name}</span>
                  </span>
                  <Badge variant="secondary" className={`${
                    area.score >= 95 ? 'bg-green-500/20 text-green-400' : 
                    area.score >= 90 ? 'bg-yellow-500/20 text-yellow-400' : 
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {area.score}%
                  </Badge>
                </CardTitle>
                <CardDescription className="text-gray-300">
                  {area.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {area.requirements.map((req, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">{req.split(' - ')[0]}</span>
                      <span className="text-cyan-400 font-medium">{req.split(' - ')[1]}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Progress value={area.score} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activities & Upcoming Deadlines */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Activities */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <BarChart3 className="h-6 w-6 text-blue-400 mr-3" />
                Recent Compliance Activities
              </CardTitle>
              <CardDescription className="text-gray-300">
                Latest compliance actions and submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-slate-700/30">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.status === 'success' ? 'bg-green-400' : 
                      activity.status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-white font-medium">{activity.title}</p>
                        <span className="text-xs text-gray-400">{activity.date}</span>
                      </div>
                      <p className="text-sm text-gray-300 mt-1">{activity.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Deadlines */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Calendar className="h-6 w-6 text-orange-400 mr-3" />
                Upcoming Deadlines
              </CardTitle>
              <CardDescription className="text-gray-300">
                Important compliance deadlines and requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingDeadlines.map((deadline, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-slate-700/30">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      deadline.priority === 'high' ? 'bg-red-400' : 
                      deadline.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-white font-medium">{deadline.title}</p>
                        <span className="text-xs text-gray-400">{deadline.date}</span>
                      </div>
                      <p className="text-sm text-gray-300 mt-1">{deadline.description}</p>
                      <Badge 
                        variant="secondary" 
                        className={`mt-2 text-xs ${
                          deadline.priority === 'high' ? 'bg-red-500/20 text-red-400' : 
                          deadline.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 
                          'bg-green-500/20 text-green-400'
                        }`}
                      >
                        {deadline.priority.toUpperCase()} PRIORITY
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Compliance Management Tools
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Access detailed reports, submit required documentation, and manage compliance workflows
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="secondary">
                <FileText className="h-4 w-4 mr-2" />
                Generate Reports
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-purple-800">
                <Award className="h-4 w-4 mr-2" />
                View Certifications
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-purple-800">
                <Eye className="h-4 w-4 mr-2" />
                TEA Portal Access
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}