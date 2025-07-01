'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function LawParentPortal() {
  const [activeTab, setActiveTab] = useState('overview')

  const studentData = {
    name: 'Sophia Rodriguez',
    year: '2L',
    gpa: 3.72,
    rank: '15/142',
    graduationYear: '2026',
    barEligibility: 'On Track'
  }

  const academicProgress = [
    { course: 'Constitutional Law II', grade: 'A-', credits: 4, professor: 'Prof. Barrett' },
    { course: 'Corporate Law', grade: 'B+', credits: 3, professor: 'Prof. Williams' },
    { course: 'Evidence', grade: 'A', credits: 4, professor: 'Prof. Chen' },
    { course: 'Federal Tax Law', grade: 'B', credits: 3, professor: 'Prof. Davis' }
  ]

  const barPrepProgress = [
    { subject: 'Constitutional Law', score: 85, trend: 'up' },
    { subject: 'Contracts', score: 92, trend: 'up' },
    { subject: 'Torts', score: 78, trend: 'stable' },
    { subject: 'Criminal Law', score: 88, trend: 'up' }
  ]

  const careerProgress = {
    internships: { completed: 2, upcoming: 1 },
    clinicalHours: { completed: 45, required: 60 },
    jobApplications: { submitted: 8, interviews: 3 },
    networking: { events: 12, contacts: 28 }
  }

  const upcomingEvents = [
    { date: 'Jan 28', event: 'Moot Court Competition', time: '2:00 PM' },
    { date: 'Feb 2', event: 'Career Fair', time: '10:00 AM' },
    { date: 'Feb 8', event: 'Bar Prep Session', time: '6:00 PM' },
    { date: 'Feb 15', event: 'Parent-Student Conference', time: '4:30 PM' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/schools/law-school" className="text-white font-semibold text-lg hover:text-blue-300">
              ← The Lawyer Makers
            </Link>
            <h1 className="text-2xl font-bold text-white">Parent Portal</h1>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="font-semibold text-white">{studentData.name}'s Family</div>
                <div className="text-sm text-blue-200">Law Student Parent</div>
              </div>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                P
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white">{studentData.name}</h2>
              <p className="text-lg text-blue-200">{studentData.year} Law Student • Class Rank: {studentData.rank}</p>
              <p className="text-blue-300">Expected Graduation: {studentData.graduationYear}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{studentData.gpa}</div>
              <div className="text-blue-200">Cumulative GPA</div>
              <div className="text-sm text-green-400 mt-1">{studentData.barEligibility}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {academicProgress.map((course, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="text-white font-semibold mb-2">{course.course}</h4>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-white">{course.grade}</span>
                  <span className="text-blue-300 text-sm">{course.credits} credits</span>
                </div>
                <div className="text-blue-200 text-sm">{course.professor}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 mb-8">
          <div className="border-b border-white/20">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview', icon: '📊' },
                { id: 'academics', name: 'Academics', icon: '📚' },
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
                  <h3 className="text-xl font-bold text-white mb-6">Academic Highlights</h3>
                  <div className="space-y-4">
                    <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                      <h4 className="text-white font-semibold mb-2">Outstanding Performance in Constitutional Law</h4>
                      <p className="text-green-200 text-sm">Sophia earned an A- in Constitutional Law II, demonstrating exceptional understanding of due process and equal protection doctrines.</p>
                    </div>
                    
                    <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                      <h4 className="text-white font-semibold mb-2">Moot Court Team Selection</h4>
                      <p className="text-blue-200 text-sm">Selected for the National Moot Court Competition team representing the school in constitutional law arguments.</p>
                    </div>

                    <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
                      <h4 className="text-white font-semibold mb-2">Summer Internship Secured</h4>
                      <p className="text-purple-200 text-sm">Accepted prestigious internship at Federal District Court for summer 2025.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-6">Upcoming Events</h3>
                  <div className="space-y-4">
                    {upcomingEvents.map((event, index) => (
                      <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="text-blue-300 text-sm font-medium">{event.date}</div>
                        <div className="text-white font-semibold">{event.event}</div>
                        <div className="text-blue-200 text-sm">{event.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'academics' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-6">Current Semester Performance</h3>
                <div className="space-y-6">
                  {academicProgress.map((course, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-white">{course.course}</h4>
                          <p className="text-blue-200">{course.professor} • {course.credits} Credit Hours</p>
                        </div>
                        <span className="text-3xl font-bold text-blue-300">{course.grade}</span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-white font-semibold">Attendance</div>
                          <div className="text-green-400">100%</div>
                        </div>
                        <div className="text-center">
                          <div className="text-white font-semibold">Participation</div>
                          <div className="text-blue-400">Excellent</div>
                        </div>
                        <div className="text-center">
                          <div className="text-white font-semibold">Assignments</div>
                          <div className="text-yellow-400">On Time</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'bar-prep' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-6">Bar Examination Preparation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Subject Mastery</h4>
                    <div className="space-y-4">
                      {barPrepProgress.map((subject, index) => (
                        <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                          <div className="flex justify-between items-center mb-2">
                            <h5 className="text-white font-semibold">{subject.subject}</h5>
                            <div className="flex items-center space-x-2">
                              <span className="text-blue-300 font-bold">{subject.score}%</span>
                              <span className={`text-sm ${
                                subject.trend === 'up' ? 'text-green-400' :
                                subject.trend === 'down' ? 'text-red-400' :
                                'text-yellow-400'
                              }`}>
                                {subject.trend === 'up' ? '↗' : subject.trend === 'down' ? '↘' : '→'}
                              </span>
                            </div>
                          </div>
                          <div className="w-full bg-white/20 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                subject.score >= 85 ? 'bg-green-500' :
                                subject.score >= 75 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{width: `${subject.score}%`}}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Exam Timeline</h4>
                    <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <div className="text-center mb-6">
                        <div className="text-4xl font-bold text-white mb-2">July 2026</div>
                        <div className="text-blue-200">Texas Bar Examination</div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-blue-200">Registration Opens</span>
                          <span className="text-white">March 2026</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-200">Prep Course Start</span>
                          <span className="text-white">May 2026</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-200">Current Readiness</span>
                          <span className="text-green-400">82%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'career' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-6">Career Development Progress</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Professional Experience</h4>
                    <div className="space-y-4">
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="flex justify-between items-center mb-2">
                          <h5 className="text-white font-semibold">Internships</h5>
                          <span className="text-blue-300">{careerProgress.internships.completed} Completed</span>
                        </div>
                        <div className="text-blue-200 text-sm">Next: Federal District Court (Summer 2025)</div>
                      </div>

                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="flex justify-between items-center mb-2">
                          <h5 className="text-white font-semibold">Clinical Hours</h5>
                          <span className="text-blue-300">{careerProgress.clinicalHours.completed}/{careerProgress.clinicalHours.required}</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{width: `${(careerProgress.clinicalHours.completed / careerProgress.clinicalHours.required) * 100}%`}}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Job Search Progress</h4>
                    <div className="space-y-4">
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-300 mb-1">{careerProgress.jobApplications.submitted}</div>
                          <div className="text-blue-200 text-sm">Applications Submitted</div>
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-400 mb-1">{careerProgress.jobApplications.interviews}</div>
                          <div className="text-blue-200 text-sm">Interviews Scheduled</div>
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-400 mb-1">{careerProgress.networking.contacts}</div>
                          <div className="text-blue-200 text-sm">Professional Contacts</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-6">Parent Resources</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="bg-blue-600/20 text-blue-200 p-4 rounded-lg hover:bg-blue-600/30 transition-colors">
              📊 Academic Reports
            </button>
            <button className="bg-green-600/20 text-green-200 p-4 rounded-lg hover:bg-green-600/30 transition-colors">
              💼 Career Guidance
            </button>
            <button className="bg-purple-600/20 text-purple-200 p-4 rounded-lg hover:bg-purple-600/30 transition-colors">
              ⚖️ Bar Prep Resources
            </button>
            <button className="bg-yellow-600/20 text-yellow-200 p-4 rounded-lg hover:bg-yellow-600/30 transition-colors">
              💰 Financial Planning
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}