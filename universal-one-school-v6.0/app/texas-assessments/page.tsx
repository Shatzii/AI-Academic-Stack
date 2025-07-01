import React from 'react'
import Link from 'next/link'

export default function TexasAssessmentsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-blue-800 to-green-900">
      <header className="relative z-10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <nav className="flex justify-between items-center">
            <Link href="/" className="text-white font-bold text-2xl hover:text-green-300 transition-colors">
              ← The Universal One School
            </Link>
            <div className="text-white font-bold text-xl">
              STAAR Testing & Assessments
            </div>
          </nav>
        </div>
      </header>

      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="text-8xl mb-6">📊📝</div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            STAAR Testing
            <br />
            <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Center
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            Comprehensive STAAR testing with full neurodivergent accommodations and TEA-compliant assessment protocols.
          </p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Assessment Programs
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-2xl font-bold text-white mb-2">STAAR Testing</h3>
              <p className="text-white/80 mb-4">
                State of Texas Assessments of Academic Readiness with comprehensive accommodations for neurodivergent learners.
              </p>
              <ul className="space-y-2 text-white/70">
                <li>• Extended time accommodations</li>
                <li>• Assistive technology support</li>
                <li>• Sensory-friendly testing environments</li>
                <li>• Alternative response formats</li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-white mb-2">Benchmark Assessments</h3>
              <p className="text-white/80 mb-4">
                Regular progress monitoring aligned with Texas Essential Knowledge and Skills (TEKS) standards.
              </p>
              <ul className="space-y-2 text-white/70">
                <li>• Quarterly progress checks</li>
                <li>• Individual growth tracking</li>
                <li>• Skill gap identification</li>
                <li>• Personalized intervention planning</li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="text-2xl font-bold text-white mb-2">Neurodivergent Assessments</h3>
              <p className="text-white/80 mb-4">
                Specialized evaluations for ADHD, dyslexia, autism, and other learning differences.
              </p>
              <ul className="space-y-2 text-white/70">
                <li>• Learning style profiling</li>
                <li>• Accommodation planning</li>
                <li>• Strength-based evaluation</li>
                <li>• IEP/504 plan integration</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-black/20">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Assessment Schedule & Results
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h4 className="text-xl font-bold text-white mb-4">2024-2025 Testing Calendar</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-white">
                  <span>Fall Benchmark</span>
                  <span>September 2024</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Winter Benchmark</span>
                  <span>December 2024</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Spring STAAR</span>
                  <span>April-May 2025</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>End-of-Year Assessment</span>
                  <span>June 2025</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h4 className="text-xl font-bold text-white mb-4">Accommodation Options</h4>
              <div className="space-y-2 text-white/80">
                <div>• Extended time (time and a half or double time)</div>
                <div>• Small group or individual testing</div>
                <div>• Frequent breaks with movement</div>
                <div>• Assistive technology (screen readers, speech-to-text)</div>
                <div>• Alternative formats (large print, Braille)</div>
                <div>• Sensory accommodations (noise-canceling headphones)</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}