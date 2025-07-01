import React from 'react'
import Link from 'next/link'

export default function TexasReportingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-purple-900">
      <header className="relative z-10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <nav className="flex justify-between items-center">
            <Link href="/" className="text-white font-bold text-2xl hover:text-purple-300 transition-colors">
              ← The Universal One School
            </Link>
            <div className="text-white font-bold text-xl">
              TEA Reporting & Analytics
            </div>
          </nav>
        </div>
      </header>

      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="text-8xl mb-6">📈📊</div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            TEA Reporting
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Dashboard
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            Comprehensive Texas Education Agency reporting with real-time analytics and compliance monitoring.
          </p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Compliance Reports
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-2xl font-bold text-white mb-2">Monthly Reports</h3>
              <p className="text-white/80 mb-4">
                Automated monthly compliance reports including enrollment, attendance, and academic progress data.
              </p>
              <button className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-colors w-full">
                Generate Report
              </button>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-2xl font-bold text-white mb-2">Performance Analytics</h3>
              <p className="text-white/80 mb-4">
                Detailed academic performance tracking with neurodivergent support effectiveness metrics.
              </p>
              <button className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition-colors w-full">
                View Analytics
              </button>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-2xl font-bold text-white mb-2">Compliance Status</h3>
              <p className="text-white/80 mb-4">
                Real-time monitoring of all TEA compliance requirements with automated alerts and recommendations.
              </p>
              <button className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-colors w-full">
                Check Status
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-black/20">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Current Compliance Metrics
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-green-500/20 rounded-xl p-6 text-center">
              <div className="text-3xl mb-2">✅</div>
              <h4 className="text-white font-bold mb-2">STAAR Compliance</h4>
              <div className="text-3xl font-bold text-green-400 mb-2">100%</div>
              <p className="text-white/80 text-sm">All assessments completed with accommodations</p>
            </div>
            <div className="bg-blue-500/20 rounded-xl p-6 text-center">
              <div className="text-3xl mb-2">📚</div>
              <h4 className="text-white font-bold mb-2">TEKS Alignment</h4>
              <div className="text-3xl font-bold text-blue-400 mb-2">98%</div>
              <p className="text-white/80 text-sm">Curriculum aligned with state standards</p>
            </div>
            <div className="bg-purple-500/20 rounded-xl p-6 text-center">
              <div className="text-3xl mb-2">👥</div>
              <h4 className="text-white font-bold mb-2">Special Ed Services</h4>
              <div className="text-3xl font-bold text-purple-400 mb-2">100%</div>
              <p className="text-white/80 text-sm">IEP and 504 plan compliance</p>
            </div>
            <div className="bg-orange-500/20 rounded-xl p-6 text-center">
              <div className="text-3xl mb-2">📊</div>
              <h4 className="text-white font-bold mb-2">Data Reporting</h4>
              <div className="text-3xl font-bold text-orange-400 mb-2">100%</div>
              <p className="text-white/80 text-sm">PEIMS data submission current</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}