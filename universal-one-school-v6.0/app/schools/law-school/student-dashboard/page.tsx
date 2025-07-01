'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function LawStudentDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  const studentData = {
    name: 'Sophia Rodriguez',
    year: '2L',
    gpa: 3.72,
    rank: '15/142',
    barEligibility: 'On Track'
  }

  const courses = [
    { id: 1, name: 'Constitutional Law II', credits: 4, grade: 'A-', professor: 'Prof. Barrett' },
    { id: 2, name: 'Corporate Law', credits: 3, grade: 'B+', professor: 'Prof. Williams' },
    { id: 3, name: 'Evidence', credits: 4, grade: 'A', professor: 'Prof. Chen' },
    { id: 4, name: 'Federal Tax Law', credits: 3, grade: 'B', professor: 'Prof. Davis' }
  ]

  const barSubjects = [
    { subject: 'Constitutional Law', progress: 85, mastery: 'Advanced' },
    { subject: 'Contracts', progress: 92, mastery: 'Expert' },
    { subject: 'Torts', progress: 78, mastery: 'Proficient' },
    { subject: 'Criminal Law', progress: 88, mastery: 'Advanced' },
    { subject: 'Civil Procedure', progress: 82, mastery: 'Advanced' },
    { subject: 'Real Property', progress: 75, mastery: 'Proficient' }
  ]

  const assignments = [
    { course: 'Constitutional Law II', title: 'Due Process Analysis', type: 'Brief', due: 'Jan 26', status: 'pending' },
    { course: 'Corporate Law', title: 'Merger Agreement Review', type: 'Memo', due: 'Jan 28', status: 'in_progress' },
    { course: 'Evidence', title: 'Hearsay Exceptions Quiz', type: 'Exam', due: 'Jan 30', status: 'pending' },
    { course: 'Federal Tax Law', title: 'Tax Planning Scenario', type: 'Problem Set', due: 'Feb 2', status: 'pending' }
  ]

  const careerProgress = {
    clinicalHours: { completed: 45, required: 60 },
    externshipStatus: 'Completed',
    jobSearchStatus: 'Active',
    barPrepProgress: 35
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/schools/law-school" className="text-white font-semibold text-lg hover:text-blue-300">
              ← The Lawyer Makers
            </Link>
            <h1 className="text-2xl font-bold text-white">Law Student Portal</h1>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="font-semibold text-white">{studentData.name}</div>
                <div className="text-sm text-blue-200">{studentData.year} • Class Rank: {studentData.rank}</div>
              </div>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {studentData.name.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Academic Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{studentData.gpa}</div>
              <div className="text-blue-200 text-sm">Cumulative GPA</div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{studentData.rank.split('/')[0]}</div>
              <div className="text-blue-200 text-sm">Class Rank</div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{courses.reduce((sum, c) => sum + c.credits, 0)}</div>
              <div className="text-blue-200 text-sm">Current Credits</div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">✓</div>
              <div className="text-blue-200 text-sm">Bar Eligible</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 mb-8">
          <div className="border-b border-white/20">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview', icon: '📊' },
                { id: 'courses', name: 'Courses', icon: '📚' },
                { id: 'bar-prep', name: 'Bar Prep', icon: '⚖️' },
                { id: 'career', name: 'Career', icon: '💼' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-400 text-blue-300'
                      : 'border-transparent text-white/70 hover:text-white hover:border-white/30'
                  }`}
                >
                  {tab.icon} {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <h3 className="text-xl font-bold text-white mb-6">Upcoming Assignments</h3>
                  <div className="space-y-4">
                    {assignments.slice(0, 3).map((assignment, index) => (
                      <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-3 py-1 bg-blue-500/30 text-blue-200 rounded-full text-sm">
                            {assignment.course}
                          </span>
                          <span className="px-2 py-1 bg-gray-500/30 text-gray-200 rounded text-xs">
                            {assignment.type}
                          </span>
                        </div>
                        <h4 className="font-semibold text-white mb-1">{assignment.title}</h4>
                        <div className="flex justify-between items-center">
                          <p className="text-blue-200 text-sm">Due: {assignment.due}</p>
                          <span className={`px-2 py-1 rounded text-xs ${
                            assignment.status === 'completed' ? 'bg-green-500/30 text-green-200' :
                            assignment.status === 'in_progress' ? 'bg-yellow-500/30 text-yellow-200' :
                            'bg-red-500/30 text-red-200'
                          }`}>
                            {assignment.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-6">Career Progress</h3>
                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <h4 className="text-white font-semibold mb-2">Clinical Hours</h4>
                      <div className="flex justify-between text-sm text-blue-200 mb-2">
                        <span>Progress</span>
                        <span>{careerProgress.clinicalHours.completed}/{careerProgress.clinicalHours.required}</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{width: `${(careerProgress.clinicalHours.completed / careerProgress.clinicalHours.required) * 100}%`}}
                        ></div>
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <h4 className="text-white font-semibold mb-2">Externship</h4>
                      <span className="bg-green-500/30 text-green-200 px-2 py-1 rounded text-sm">
                        {careerProgress.externshipStatus}
                      </span>
                    </div>

                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <h4 className="text-white font-semibold mb-2">Job Search</h4>
                      <span className="bg-blue-500/30 text-blue-200 px-2 py-1 rounded text-sm">
                        {careerProgress.jobSearchStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'courses' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-6">Current Semester</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {courses.map((course) => (
                    <div key={course.id} className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-white">{course.name}</h4>
                          <p className="text-blue-200 text-sm">{course.professor} • {course.credits} Credits</p>
                        </div>
                        <span className="text-2xl font-bold text-blue-300">{course.grade}</span>
                      </div>
                      <div className="flex space-x-2">
                        <button className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                          View Syllabus
                        </button>
                        <button className="flex-1 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
                          Assignments
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'bar-prep' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-6">Bar Exam Preparation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">MBE Subject Mastery</h4>
                    <div className="space-y-4">
                      {barSubjects.map((subject, index) => (
                        <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-white font-medium">{subject.subject}</span>
                            <span className={`px-2 py-1 rounded text-xs ${
                              subject.mastery === 'Expert' ? 'bg-green-500/30 text-green-200' :
                              subject.mastery === 'Advanced' ? 'bg-blue-500/30 text-blue-200' :
                              'bg-yellow-500/30 text-yellow-200'
                            }`}>
                              {subject.mastery}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm text-blue-200 mb-1">
                            <span>Progress</span>
                            <span>{subject.progress}%</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                subject.progress >= 90 ? 'bg-green-500' :
                                subject.progress >= 80 ? 'bg-blue-500' :
                                'bg-yellow-500'
                              }`}
                              style={{width: `${subject.progress}%`}}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Exam Schedule</h4>
                    <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <div className="text-center mb-6">
                        <div className="text-4xl font-bold text-white mb-2">July 2025</div>
                        <div className="text-blue-200">Texas Bar Exam</div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-blue-200">Day 1 - MBE</span>
                          <span className="text-white">July 29, 2025</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-200">Day 2 - MEE/MPT</span>
                          <span className="text-white">July 30, 2025</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-200">Registration Due</span>
                          <span className="text-yellow-300">March 15, 2025</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 bg-white/5 rounded-lg p-6 border border-white/10">
                      <h5 className="text-white font-semibold mb-3">Study Schedule</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-blue-200">Daily Study Hours</span>
                          <span className="text-white">6-8 hours</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-200">Practice Tests</span>
                          <span className="text-white">2 per week</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-200">Essay Practice</span>
                          <span className="text-white">Daily</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'career' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-6">Career Development</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <h4 className="text-lg font-semibold text-white mb-4">Networking</h4>
                    <div className="space-y-3">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-300">25</div>
                        <div className="text-sm text-blue-200">Professional Contacts</div>
                      </div>
                      <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                        View Network
                      </button>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <h4 className="text-lg font-semibold text-white mb-4">Applications</h4>
                    <div className="space-y-3">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">12</div>
                        <div className="text-sm text-blue-200">Submitted</div>
                      </div>
                      <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                        Track Applications
                      </button>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <h4 className="text-lg font-semibold text-white mb-4">Interviews</h4>
                    <div className="space-y-3">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-400">3</div>
                        <div className="text-sm text-blue-200">Scheduled</div>
                      </div>
                      <button className="w-full bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700">
                        Prep Materials
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <button className="bg-blue-600/20 text-blue-200 p-4 rounded-lg hover:bg-blue-600/30 transition-colors">
              📝 Submit Brief
            </button>
            <button className="bg-green-600/20 text-green-200 p-4 rounded-lg hover:bg-green-600/30 transition-colors">
              📚 Case Research
            </button>
            <button className="bg-purple-600/20 text-purple-200 p-4 rounded-lg hover:bg-purple-600/30 transition-colors">
              ⚖️ Practice MBE
            </button>
            <button className="bg-yellow-600/20 text-yellow-200 p-4 rounded-lg hover:bg-yellow-600/30 transition-colors">
              💼 Career Center
            </button>
            <button className="bg-indigo-600/20 text-indigo-200 p-4 rounded-lg hover:bg-indigo-600/30 transition-colors">
              👨‍🏫 Professor Barrett
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}