'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('30_days')
  const [selectedMetric, setSelectedMetric] = useState('overview')

  // Analytics data
  const performanceMetrics = {
    studentEngagement: {
      current: 87.3,
      previous: 84.1,
      trend: 'up',
      target: 85.0
    },
    academicProgress: {
      current: 92.1,
      previous: 89.7,
      trend: 'up',
      target: 90.0
    },
    attendanceRate: {
      current: 94.8,
      previous: 93.2,
      trend: 'up',
      target: 95.0
    },
    parentEngagement: {
      current: 78.5,
      previous: 81.2,
      trend: 'down',
      target: 80.0
    }
  }

  const studentOutcomes = [
    { grade: 'K', reading: 89, math: 85, science: 87, socialStudies: 91, count: 125 },
    { grade: '1', reading: 92, math: 88, science: 90, socialStudies: 89, count: 132 },
    { grade: '2', reading: 87, math: 91, science: 85, socialStudies: 88, count: 128 },
    { grade: '3', reading: 95, math: 89, science: 92, socialStudies: 90, count: 135 },
    { grade: '4', reading: 91, math: 93, science: 88, socialStudies: 92, count: 129 },
    { grade: '5', reading: 88, math: 87, science: 91, socialStudies: 89, count: 142 },
    { grade: '6', reading: 93, math: 92, science: 94, socialStudies: 91, count: 138 },
    { grade: '7', reading: 86, math: 89, science: 87, socialStudies: 85, count: 145 },
    { grade: '8', reading: 90, math: 91, science: 89, socialStudies: 88, count: 151 },
    { grade: '9', reading: 88, math: 85, science: 90, socialStudies: 87, count: 156 },
    { grade: '10', reading: 92, math: 88, science: 91, socialStudies: 89, count: 148 },
    { grade: '11', reading: 89, math: 90, science: 88, socialStudies: 91, count: 142 },
    { grade: '12', reading: 94, math: 92, science: 93, socialStudies: 90, count: 139 }
  ]

  const iepEffectiveness = {
    goalsAchieved: 78.5,
    onTrackStudents: 234,
    totalIepStudents: 298,
    serviceDelivery: 94.2,
    parentSatisfaction: 89.7,
    transitionSuccess: 82.3
  }

  const predictiveInsights = [
    {
      type: 'attendance_risk',
      priority: 'high',
      students: 23,
      message: '23 students at risk of chronic absenteeism',
      action: 'Schedule family outreach meetings',
      timeline: 'Next 2 weeks'
    },
    {
      type: 'academic_intervention',
      priority: 'medium',
      students: 47,
      message: '47 students may need reading intervention',
      action: 'Implement targeted reading support',
      timeline: 'Next month'
    },
    {
      type: 'behavioral_support',
      priority: 'high',
      students: 12,
      message: '12 students showing increased behavioral incidents',
      action: 'Review behavior intervention plans',
      timeline: 'This week'
    },
    {
      type: 'graduation_risk',
      priority: 'critical',
      students: 8,
      message: '8 seniors at risk of not graduating',
      action: 'Intensive credit recovery program',
      timeline: 'Immediate'
    }
  ]

  const schoolComparison = {
    primarySchool: {
      name: 'SuperHero School (K-6)',
      enrollment: 889,
      performance: 91.2,
      satisfaction: 87.8,
      engagement: 89.5
    },
    secondarySchool: {
      name: 'Stage Prep Academy (7-12)',
      enrollment: 881,
      performance: 88.7,
      satisfaction: 85.3,
      engagement: 84.2
    },
    lawSchool: {
      name: 'The Lawyer Makers',
      enrollment: 45,
      performance: 94.1,
      satisfaction: 92.4,
      engagement: 91.8
    },
    languageSchool: {
      name: 'Language Learning School',
      enrollment: 156,
      performance: 89.3,
      satisfaction: 88.7,
      engagement: 90.1
    }
  }

  const neurodivergentSupport = {
    totalStudents: 342,
    byCondition: [
      { condition: 'ADHD', count: 128, successRate: 87.3 },
      { condition: 'Dyslexia', count: 94, successRate: 91.2 },
      { condition: 'Autism Spectrum', count: 73, successRate: 89.7 },
      { condition: 'Processing Disorders', count: 47, successRate: 85.1 }
    ],
    accommodationEffectiveness: 92.4,
    assistiveTechUsage: 78.9,
    familySatisfaction: 94.1
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/admin/dashboard" className="text-indigo-600 font-semibold text-lg hover:text-indigo-500">
              ← Admin Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Advanced Analytics Dashboard</h1>
            <div className="flex space-x-2">
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="7_days">Last 7 Days</option>
                <option value="30_days">Last 30 Days</option>
                <option value="semester">This Semester</option>
                <option value="year">This Year</option>
              </select>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                Export Report
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {Object.entries(performanceMetrics).map(([key, metric]) => (
            <div key={key} className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">{metric.current}%</p>
                </div>
                <div className={`p-2 rounded-lg ${
                  metric.trend === 'up' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <span className={`text-2xl ${
                    metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.trend === 'up' ? '📈' : '📉'}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <span className={`${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.trend === 'up' ? '+' : ''}{(metric.current - metric.previous).toFixed(1)}% from last period
                </span>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Target: {metric.target}%</span>
                  <span>{metric.current >= metric.target ? 'Above Target' : 'Below Target'}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      metric.current >= metric.target ? 'bg-green-500' : 'bg-yellow-500'
                    }`}
                    style={{width: `${(metric.current / 100) * 100}%`}}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Predictive Analytics Alerts */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Predictive Analytics & Early Interventions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {predictiveInsights.map((insight, index) => (
                <div key={index} className={`p-4 rounded-lg border-l-4 ${
                  insight.priority === 'critical' ? 'border-red-500 bg-red-50' :
                  insight.priority === 'high' ? 'border-orange-500 bg-orange-50' :
                  insight.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                  'border-blue-500 bg-blue-50'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-900">{insight.message}</h4>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      insight.priority === 'critical' ? 'bg-red-100 text-red-800' :
                      insight.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                      insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {insight.priority.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    <strong>Recommended Action:</strong> {insight.action}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Timeline: {insight.timeline}</span>
                    <button className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                      Create Action Plan
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Academic Performance by Grade */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Academic Performance by Grade Level</h2>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Grade</th>
                    <th className="text-left py-3 px-4">Students</th>
                    <th className="text-left py-3 px-4">Reading</th>
                    <th className="text-left py-3 px-4">Math</th>
                    <th className="text-left py-3 px-4">Science</th>
                    <th className="text-left py-3 px-4">Social Studies</th>
                    <th className="text-left py-3 px-4">Overall</th>
                  </tr>
                </thead>
                <tbody>
                  {studentOutcomes.map((grade) => {
                    const overall = (grade.reading + grade.math + grade.science + grade.socialStudies) / 4
                    return (
                      <tr key={grade.grade} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{grade.grade}</td>
                        <td className="py-3 px-4">{grade.count}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <span>{grade.reading}%</span>
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-500 h-2 rounded-full" style={{width: `${grade.reading}%`}}></div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <span>{grade.math}%</span>
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div className="bg-green-500 h-2 rounded-full" style={{width: `${grade.math}%`}}></div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <span>{grade.science}%</span>
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div className="bg-purple-500 h-2 rounded-full" style={{width: `${grade.science}%`}}></div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <span>{grade.socialStudies}%</span>
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div className="bg-yellow-500 h-2 rounded-full" style={{width: `${grade.socialStudies}%`}}></div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`font-semibold ${
                            overall >= 90 ? 'text-green-600' :
                            overall >= 80 ? 'text-blue-600' :
                            overall >= 70 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {overall.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* School Comparison Dashboard */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">School Performance Comparison</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.values(schoolComparison).map((school, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">{school.name}</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Enrollment</span>
                        <span className="font-medium">{school.enrollment}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Performance</span>
                        <span className="font-medium">{school.performance}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{width: `${school.performance}%`}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Satisfaction</span>
                        <span className="font-medium">{school.satisfaction}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: `${school.satisfaction}%`}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Engagement</span>
                        <span className="font-medium">{school.engagement}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{width: `${school.engagement}%`}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Neurodivergent Student Support Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">IEP Effectiveness Metrics</h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Goals Achieved</span>
                    <span className="text-2xl font-bold text-green-600">{iepEffectiveness.goalsAchieved}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-green-500 h-3 rounded-full" style={{width: `${iepEffectiveness.goalsAchieved}%`}}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Service Delivery</span>
                    <span className="text-2xl font-bold text-blue-600">{iepEffectiveness.serviceDelivery}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-blue-500 h-3 rounded-full" style={{width: `${iepEffectiveness.serviceDelivery}%`}}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Parent Satisfaction</span>
                    <span className="text-2xl font-bold text-purple-600">{iepEffectiveness.parentSatisfaction}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-purple-500 h-3 rounded-full" style={{width: `${iepEffectiveness.parentSatisfaction}%`}}></div>
                  </div>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{iepEffectiveness.onTrackStudents}</div>
                  <div className="text-sm text-gray-600">of {iepEffectiveness.totalIepStudents} IEP students on track</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Neurodivergent Support Analytics</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="text-center p-4 bg-indigo-50 rounded-lg">
                  <div className="text-3xl font-bold text-indigo-600">{neurodivergentSupport.totalStudents}</div>
                  <div className="text-sm text-indigo-700">Total Neurodivergent Students</div>
                </div>
                
                <div className="space-y-3">
                  {neurodivergentSupport.byCondition.map((condition, index) => (
                    <div key={index} className="p-3 border rounded">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{condition.condition}</span>
                        <div className="text-right">
                          <div className="text-sm font-semibold">{condition.count} students</div>
                          <div className="text-xs text-green-600">{condition.successRate}% success rate</div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: `${condition.successRate}%`}}></div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-600">{neurodivergentSupport.accommodationEffectiveness}%</div>
                    <div className="text-xs text-gray-600">Accommodation Effectiveness</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-purple-600">{neurodivergentSupport.assistiveTechUsage}%</div>
                    <div className="text-xs text-gray-600">Assistive Tech Usage</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}