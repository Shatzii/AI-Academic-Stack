'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function JuvenileJusticeEducationPage() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [selectedSection, setSelectedSection] = useState('overview')

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  const facilities = [
    {
      name: 'Detention Centers',
      population: 45,
      description: 'Short-term secure facilities for youth awaiting court proceedings',
      avgStay: '15-45 days',
      programs: ['Crisis intervention', 'Immediate assessment', 'Continuation education', 'Mental health support']
    },
    {
      name: 'Residential Treatment',
      population: 28,
      description: 'Long-term therapeutic communities for rehabilitation',
      avgStay: '6-18 months',
      programs: ['Therapeutic education', 'Vocational training', 'Life skills', 'Family therapy']
    },
    {
      name: 'Group Homes',
      population: 12,
      description: 'Community-based residential care with family-style environment',
      avgStay: '3-12 months',
      programs: ['Community school integration', 'Independent living skills', 'Career exploration', 'Mentorship']
    },
    {
      name: 'Community Probation',
      population: 62,
      description: 'Youth living at home under court supervision',
      avgStay: '6-24 months',
      programs: ['School support services', 'Family counseling', 'Peer mentoring', 'Check-in support']
    }
  ]

  const supportPrograms = [
    {
      title: 'Essential Life Skills',
      description: 'Financial literacy, communication, time management, health education',
      duration: 'Ongoing',
      approach: 'Hands-on learning, real-world application'
    },
    {
      title: 'Career Readiness',
      description: 'Career exploration, job search skills, interview preparation, workplace ethics',
      duration: '1-2 semesters',
      approach: 'Multiple career pathways, flexible scheduling'
    },
    {
      title: 'Social-Emotional Learning',
      description: 'Emotional regulation, relationship building, problem-solving, empathy',
      duration: 'Integrated',
      approach: 'Individual and group sessions, peer support'
    },
    {
      title: 'Restorative Justice Education',
      description: 'Understanding harm, community responsibility, victim awareness, making amends',
      duration: '1 semester',
      approach: 'Community service projects, reflection, cultural practices'
    }
  ]

  const traumaApproaches = [
    {
      principle: 'Physical & Emotional Safety',
      strategies: 'Predictable routines, calm environments, crisis protocols, safe spaces'
    },
    {
      principle: 'Trustworthiness & Transparency',
      strategies: 'Consistent communication, clear consequences, transparent decisions, regular feedback'
    },
    {
      principle: 'Peer Support & Collaboration',
      strategies: 'Peer mentoring, collaborative learning, student voice, group problem-solving'
    },
    {
      principle: 'Empowerment & Choice',
      strategies: 'Student-directed learning, goal-setting, strengths recognition, leadership opportunities'
    }
  ]

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-black via-gray-900 to-black' : 'bg-gradient-to-br from-blue-900 via-purple-900 to-red-900'}`}>
      {/* Header */}
      <header className="relative z-10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <nav className="flex justify-between items-center">
            <Link href="/" className={`font-bold text-2xl transition-colors ${isDarkMode ? 'text-white hover:text-blue-400' : 'text-white hover:text-blue-300'}`}>
              ← The Universal One School
            </Link>
            <div className={`font-bold text-xl ${isDarkMode ? 'text-blue-400' : 'text-white'}`}>
              Juvenile Justice Education
            </div>
            <button
              onClick={toggleTheme}
              className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              {isDarkMode ? '🛡️ Justice Mode' : '🌙 Dark Mode'}
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="text-8xl mb-6">🛡️⚖️</div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Juvenile Justice
            <br />
            <span className={`bg-clip-text text-transparent ${isDarkMode ? 'bg-gradient-to-r from-blue-400 to-cyan-400' : 'bg-gradient-to-r from-purple-400 to-blue-400'}`}>
              Education System
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            Comprehensive educational support for justice-involved youth with trauma-informed approaches and reentry planning
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-white/10' : 'bg-white/20'} backdrop-blur-sm border border-white/20`}>
              <div className="text-3xl font-bold text-white">147</div>
              <div className="text-white/80">Active Students</div>
            </div>
            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-white/10' : 'bg-white/20'} backdrop-blur-sm border border-white/20`}>
              <div className="text-3xl font-bold text-green-400">82%</div>
              <div className="text-white/80">Success Rate</div>
            </div>
            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-white/10' : 'bg-white/20'} backdrop-blur-sm border border-white/20`}>
              <div className="text-3xl font-bold text-blue-400">73%</div>
              <div className="text-white/80">Graduation Rate</div>
            </div>
            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-white/10' : 'bg-white/20'} backdrop-blur-sm border border-white/20`}>
              <div className="text-3xl font-bold text-purple-400">18%</div>
              <div className="text-white/80">Recidivism Rate</div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {['overview', 'facilities', 'programs', 'trauma-informed', 'reentry'].map((section) => (
              <button
                key={section}
                onClick={() => setSelectedSection(section)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  selectedSection === section
                    ? (isDarkMode ? 'bg-blue-600 text-white' : 'bg-purple-600 text-white')
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          
          {/* Overview Section */}
          {selectedSection === 'overview' && (
            <div className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-4">Comprehensive Support System</h2>
                <p className="text-xl text-white/80 max-w-3xl mx-auto">
                  Evidence-based educational approaches designed specifically for justice-involved youth across multiple facility types and settings
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-white/10' : 'bg-white/20'} backdrop-blur-sm border border-white/20`}>
                  <div className="text-4xl mb-4">🏢</div>
                  <h3 className="text-xl font-bold text-white mb-2">Multi-Facility Support</h3>
                  <p className="text-white/80">Detention centers, residential facilities, group homes, and community probation programs</p>
                </div>
                
                <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-white/10' : 'bg-white/20'} backdrop-blur-sm border border-white/20`}>
                  <div className="text-4xl mb-4">❤️</div>
                  <h3 className="text-xl font-bold text-white mb-2">Trauma-Informed Care</h3>
                  <p className="text-white/80">Safety-focused approaches that recognize and respond to the impact of traumatic stress</p>
                </div>
                
                <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-white/10' : 'bg-white/20'} backdrop-blur-sm border border-white/20`}>
                  <div className="text-4xl mb-4">🔄</div>
                  <h3 className="text-xl font-bold text-white mb-2">Reentry Support</h3>
                  <p className="text-white/80">Comprehensive transition planning and 6-month post-release support services</p>
                </div>
                
                <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-white/10' : 'bg-white/20'} backdrop-blur-sm border border-white/20`}>
                  <div className="text-4xl mb-4">📚</div>
                  <h3 className="text-xl font-bold text-white mb-2">Specialized Curriculum</h3>
                  <p className="text-white/80">Life skills, career readiness, social-emotional learning, and restorative justice education</p>
                </div>
                
                <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-white/10' : 'bg-white/20'} backdrop-blur-sm border border-white/20`}>
                  <div className="text-4xl mb-4">💻</div>
                  <h3 className="text-xl font-bold text-white mb-2">Secure Technology</h3>
                  <p className="text-white/80">Filtered internet access, virtual classrooms, and progress monitoring systems</p>
                </div>
                
                <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-white/10' : 'bg-white/20'} backdrop-blur-sm border border-white/20`}>
                  <div className="text-4xl mb-4">👥</div>
                  <h3 className="text-xl font-bold text-white mb-2">Community Integration</h3>
                  <p className="text-white/80">Family involvement, peer mentoring, and community service opportunities</p>
                </div>
              </div>
            </div>
          )}

          {/* Facilities Section */}
          {selectedSection === 'facilities' && (
            <div className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-4">Facility Types & Programs</h2>
                <p className="text-xl text-white/80 max-w-3xl mx-auto">
                  Tailored educational approaches for different facility types and placement durations
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {facilities.map((facility, index) => (
                  <div key={index} className={`p-8 rounded-xl ${isDarkMode ? 'bg-white/10' : 'bg-white/20'} backdrop-blur-sm border border-white/20`}>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-bold text-white">{facility.name}</h3>
                      <div className={`px-3 py-1 rounded-full text-sm ${isDarkMode ? 'bg-blue-600/20 text-blue-300' : 'bg-purple-600/20 text-purple-300'}`}>
                        {facility.population} students
                      </div>
                    </div>
                    <p className="text-white/80 mb-4">{facility.description}</p>
                    <div className="flex items-center mb-4">
                      <span className="text-green-400 font-semibold">Average Stay: </span>
                      <span className="text-white ml-2">{facility.avgStay}</span>
                    </div>
                    
                    <h4 className="text-lg font-semibold text-blue-300 mb-3">Educational Programs</h4>
                    <div className="space-y-2">
                      {facility.programs.map((program, idx) => (
                        <div key={idx} className="flex items-center">
                          <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                          <span className="text-white/90">{program}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Programs Section */}
          {selectedSection === 'programs' && (
            <div className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-4">Specialized Curricula</h2>
                <p className="text-xl text-white/80 max-w-3xl mx-auto">
                  Evidence-based curricula designed for the unique needs of justice-involved youth
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {supportPrograms.map((program, index) => (
                  <div key={index} className={`p-8 rounded-xl ${isDarkMode ? 'bg-white/10' : 'bg-white/20'} backdrop-blur-sm border border-white/20`}>
                    <h3 className="text-2xl font-bold text-white mb-3">{program.title}</h3>
                    <p className="text-white/80 mb-4">{program.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-blue-600/10' : 'bg-purple-600/10'} border border-blue-600/20`}>
                        <span className="text-blue-300 text-sm font-medium">Duration: </span>
                        <span className="text-white/80 text-sm">{program.duration}</span>
                      </div>
                      <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-green-600/10' : 'bg-green-600/10'} border border-green-600/20`}>
                        <span className="text-green-300 text-sm font-medium">Approach: </span>
                        <span className="text-white/80 text-sm">{program.approach}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trauma-Informed Section */}
          {selectedSection === 'trauma-informed' && (
            <div className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-4">Trauma-Informed Educational Approaches</h2>
                <p className="text-xl text-white/80 max-w-3xl mx-auto">
                  Evidence-based strategies for supporting youth who have experienced trauma
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {traumaApproaches.map((approach, index) => (
                  <div key={index} className={`p-8 rounded-xl ${isDarkMode ? 'bg-white/10' : 'bg-white/20'} backdrop-blur-sm border border-white/20`}>
                    <h3 className="text-2xl font-bold text-green-300 mb-4">{approach.principle}</h3>
                    <p className="text-white/80 leading-relaxed">{approach.strategies}</p>
                  </div>
                ))}
              </div>

              <div className={`p-8 rounded-xl ${isDarkMode ? 'bg-white/10' : 'bg-white/20'} backdrop-blur-sm border border-white/20 text-center`}>
                <h3 className="text-2xl font-bold text-white mb-4">Implementation Focus</h3>
                <p className="text-white/80 max-w-3xl mx-auto">
                  All staff receive trauma-informed care training, and our educational environments are designed to promote healing, 
                  build resilience, and support positive youth development through consistent, predictable, and supportive relationships.
                </p>
              </div>
            </div>
          )}

          {/* Reentry Section */}
          {selectedSection === 'reentry' && (
            <div className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-4">Reentry & Transition Support</h2>
                <p className="text-xl text-white/80 max-w-3xl mx-auto">
                  Comprehensive support for successful community reintegration and educational continuity
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className={`p-8 rounded-xl ${isDarkMode ? 'bg-white/10' : 'bg-white/20'} backdrop-blur-sm border border-white/20`}>
                  <div className="text-4xl mb-4">📋</div>
                  <h3 className="text-xl font-bold text-orange-300 mb-3">Pre-Release Planning</h3>
                  <p className="text-white/80 mb-4">30-60 days before release</p>
                  <ul className="space-y-2 text-white/80">
                    <li>• Educational needs assessment</li>
                    <li>• School enrollment coordination</li>
                    <li>• Housing arrangement verification</li>
                    <li>• Support service referrals</li>
                  </ul>
                </div>

                <div className={`p-8 rounded-xl ${isDarkMode ? 'bg-white/10' : 'bg-white/20'} backdrop-blur-sm border border-white/20`}>
                  <div className="text-4xl mb-4">🚀</div>
                  <h3 className="text-xl font-bold text-blue-300 mb-3">Immediate Transition</h3>
                  <p className="text-white/80 mb-4">0-30 days post-release</p>
                  <ul className="space-y-2 text-white/80">
                    <li>• School enrollment completion</li>
                    <li>• Weekly check-in calls</li>
                    <li>• Crisis intervention availability</li>
                    <li>• Academic progress monitoring</li>
                  </ul>
                </div>

                <div className={`p-8 rounded-xl ${isDarkMode ? 'bg-white/10' : 'bg-white/20'} backdrop-blur-sm border border-white/20`}>
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="text-xl font-bold text-green-300 mb-3">Long-term Support</h3>
                  <p className="text-white/80 mb-4">6+ months post-release</p>
                  <ul className="space-y-2 text-white/80">
                    <li>• Monthly check-in meetings</li>
                    <li>• College/career preparation</li>
                    <li>• Leadership development</li>
                    <li>• Alumni network participation</li>
                  </ul>
                </div>
              </div>

              <div className={`p-8 rounded-xl ${isDarkMode ? 'bg-green-600/10' : 'bg-green-600/10'} backdrop-blur-sm border border-green-600/20`}>
                <h3 className="text-2xl font-bold text-green-300 mb-4">Success Outcomes</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">89%</div>
                    <div className="text-green-200">School Re-enrollment</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">72%</div>
                    <div className="text-green-200">Employment Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">91%</div>
                    <div className="text-green-200">Stable Housing</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">78%</div>
                    <div className="text-green-200">Family Reunification</div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 border-t border-white/20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Contact our team to learn more about our juvenile justice education programs and support services.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/global-campuses" className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700'} text-white`}>
              Global Campuses
            </Link>
            <Link href="/reentry-support" className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-600 hover:bg-green-700'} text-white`}>
              Reentry Support
            </Link>
            <Link href="/" className="px-8 py-3 rounded-full font-semibold transition-all duration-300 bg-white/20 hover:bg-white/30 text-white">
              Back to Main Platform
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}