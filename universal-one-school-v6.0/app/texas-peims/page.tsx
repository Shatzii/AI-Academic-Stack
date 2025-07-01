import React from 'react'
import Link from 'next/link'

export default function TexasPeimsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-red-800 to-orange-900">
      <header className="relative z-10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <nav className="flex justify-between items-center">
            <Link href="/" className="text-white font-bold text-2xl hover:text-orange-300 transition-colors">
              ← The Universal One School
            </Link>
            <div className="text-white font-bold text-xl">
              PEIMS Data Management
            </div>
          </nav>
        </div>
      </header>

      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="text-8xl mb-6">🏛️📊</div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            PEIMS Data
            <br />
            <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Integration
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            Public Education Information Management System integration with automated data collection and TEA submission protocols.
          </p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            PEIMS Data Collections
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-2xl font-bold text-white mb-2">Student Enrollment</h3>
              <p className="text-white/80 mb-4">
                Comprehensive student demographic data, enrollment status, and attendance tracking for TEA reporting.
              </p>
              <div className="space-y-2 text-white/70 text-sm">
                <div>• Student demographic information</div>
                <div>• Enrollment dates and status</div>
                <div>• Attendance and mobility data</div>
                <div>• Special program participation</div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-2xl font-bold text-white mb-2">Academic Performance</h3>
              <p className="text-white/80 mb-4">
                STAAR test results, course completion, and academic achievement data with neurodivergent accommodations.
              </p>
              <div className="space-y-2 text-white/70 text-sm">
                <div>• STAAR assessment results</div>
                <div>• Course enrollment and completion</div>
                <div>• Grade progression and retention</div>
                <div>• Accommodation usage tracking</div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="text-4xl mb-4">👨‍🏫</div>
              <h3 className="text-2xl font-bold text-white mb-2">Staff Information</h3>
              <p className="text-white/80 mb-4">
                Teacher credentials, assignments, and professional development tracking for compliance verification.
              </p>
              <div className="space-y-2 text-white/70 text-sm">
                <div>• Teacher certification status</div>
                <div>• Course assignments</div>
                <div>• Professional development hours</div>
                <div>• Special education qualifications</div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-2xl font-bold text-white mb-2">Financial Data</h3>
              <p className="text-white/80 mb-4">
                Budget allocation, expenditures, and funding source tracking for state accountability measures.
              </p>
              <div className="space-y-2 text-white/70 text-sm">
                <div>• Revenue by funding source</div>
                <div>• Expenditure by function</div>
                <div>• Special program funding</div>
                <div>• Per-pupil expenditure data</div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="text-4xl mb-4">🏫</div>
              <h3 className="text-2xl font-bold text-white mb-2">Organizational Data</h3>
              <p className="text-white/80 mb-4">
                School organizational structure, programs offered, and facility information for state records.
              </p>
              <div className="space-y-2 text-white/70 text-sm">
                <div>• School organization details</div>
                <div>• Program offerings</div>
                <div>• Facility capacity and usage</div>
                <div>• Technology infrastructure</div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="text-4xl mb-4">♿</div>
              <h3 className="text-2xl font-bold text-white mb-2">Special Services</h3>
              <p className="text-white/80 mb-4">
                Special education, 504 plans, and neurodivergent support services data for compliance tracking.
              </p>
              <div className="space-y-2 text-white/70 text-sm">
                <div>• IEP and 504 plan data</div>
                <div>• Related services provision</div>
                <div>• Accommodation effectiveness</div>
                <div>• Transition services tracking</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-black/20">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Data Submission Schedule
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h4 className="text-xl font-bold text-white mb-4">2024-2025 Submission Calendar</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-white">
                  <span>Fall Snapshot</span>
                  <span className="text-green-400">✓ Submitted</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Winter Collection</span>
                  <span className="text-yellow-400">⏳ In Progress</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Spring Snapshot</span>
                  <span className="text-gray-400">📅 March 2025</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Summer Collection</span>
                  <span className="text-gray-400">📅 June 2025</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h4 className="text-xl font-bold text-white mb-4">Data Quality Metrics</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-white">
                  <span>Completion Rate</span>
                  <span className="text-green-400 font-bold">98.5%</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Accuracy Score</span>
                  <span className="text-green-400 font-bold">99.2%</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Timeliness</span>
                  <span className="text-green-400 font-bold">100%</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Error Rate</span>
                  <span className="text-green-400 font-bold">0.3%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}