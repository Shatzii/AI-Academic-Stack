import React from 'react'
import Link from 'next/link'

export default function TexasEnrollmentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-red-800 to-blue-900">
      {/* Header */}
      <header className="relative z-10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <nav className="flex justify-between items-center">
            <Link href="/" className="text-white font-bold text-2xl hover:text-blue-300 transition-colors">
              ← The Universal One School
            </Link>
            <div className="text-white font-bold text-xl">
              Texas Charter School Enrollment
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="text-8xl mb-6">🏫📝</div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Student
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent">
              Enrollment
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            TEA-compliant enrollment system with comprehensive neurodivergent support tracking and accommodation planning.
          </p>
        </div>
      </section>

      {/* Enrollment Form Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              New Student Enrollment
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Student Information */}
              <div className="space-y-6">
                <div>
                  <label className="block text-white font-semibold mb-2">Student Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:border-blue-400 focus:outline-none"
                    placeholder="Full legal name"
                  />
                </div>
                
                <div>
                  <label className="block text-white font-semibold mb-2">Date of Birth</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-3 rounded-lg bg-white/20 text-white border border-white/30 focus:border-blue-400 focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-white font-semibold mb-2">Grade Level</label>
                  <select className="w-full px-4 py-3 rounded-lg bg-white/20 text-white border border-white/30 focus:border-blue-400 focus:outline-none">
                    <option value="">Select Grade</option>
                    <option value="K">Kindergarten</option>
                    <option value="1">1st Grade</option>
                    <option value="2">2nd Grade</option>
                    <option value="3">3rd Grade</option>
                    <option value="4">4th Grade</option>
                    <option value="5">5th Grade</option>
                    <option value="6">6th Grade</option>
                    <option value="7">7th Grade</option>
                    <option value="8">8th Grade</option>
                    <option value="9">9th Grade</option>
                    <option value="10">10th Grade</option>
                    <option value="11">11th Grade</option>
                    <option value="12">12th Grade</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-white font-semibold mb-2">Preferred School Program</label>
                  <select className="w-full px-4 py-3 rounded-lg bg-white/20 text-white border border-white/30 focus:border-blue-400 focus:outline-none">
                    <option value="">Select Program</option>
                    <option value="superhero">SuperHero School (K-6)</option>
                    <option value="stage">S.T.A.G.E Prep (7-12)</option>
                    <option value="law">Law School</option>
                    <option value="language">LIOTA Language School</option>
                  </select>
                </div>
              </div>

              {/* Parent/Guardian Information */}
              <div className="space-y-6">
                <div>
                  <label className="block text-white font-semibold mb-2">Parent/Guardian Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:border-blue-400 focus:outline-none"
                    placeholder="Full name"
                  />
                </div>
                
                <div>
                  <label className="block text-white font-semibold mb-2">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:border-blue-400 focus:outline-none"
                    placeholder="parent@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-white font-semibold mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:border-blue-400 focus:outline-none"
                    placeholder="(555) 123-4567"
                  />
                </div>
                
                <div>
                  <label className="block text-white font-semibold mb-2">Address</label>
                  <textarea 
                    className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:border-blue-400 focus:outline-none"
                    rows={3}
                    placeholder="Street address, city, state, ZIP"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Neurodivergent Support Section */}
            <div className="mt-8 p-6 bg-purple-500/20 rounded-xl border border-purple-400/30">
              <h3 className="text-2xl font-bold text-white mb-4">Neurodivergent Learning Support</h3>
              <p className="text-white/80 mb-4">
                Our platform is designed specifically for neurodivergent learners. Please help us understand your child's unique needs.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white font-semibold mb-2">Learning Differences (Check all that apply)</label>
                  <div className="grid md:grid-cols-2 gap-3">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-white/30 bg-white/20 text-purple-500"/>
                      <span className="text-white">ADHD</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-white/30 bg-white/20 text-purple-500"/>
                      <span className="text-white">Dyslexia</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-white/30 bg-white/20 text-purple-500"/>
                      <span className="text-white">Autism Spectrum</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-white/30 bg-white/20 text-purple-500"/>
                      <span className="text-white">Processing Differences</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-white/30 bg-white/20 text-purple-500"/>
                      <span className="text-white">Sensory Sensitivities</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-white/30 bg-white/20 text-purple-500"/>
                      <span className="text-white">Executive Function</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-white font-semibold mb-2">Additional Support Needs</label>
                  <textarea 
                    className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:border-blue-400 focus:outline-none"
                    rows={3}
                    placeholder="Please describe any specific accommodations, IEP/504 plans, or support strategies that work well for your child"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 text-center">
              <button className="bg-gradient-to-r from-blue-600 to-red-600 text-white px-12 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                Submit Enrollment Application
              </button>
              <p className="text-white/60 mt-4 text-sm">
                Applications are reviewed within 24-48 hours. You will receive a confirmation email with next steps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TEA Compliance Notice */}
      <section className="py-16 px-4 bg-black/20">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold text-white mb-6">Texas Education Agency Compliance</h3>
          <p className="text-white/80 mb-8 max-w-3xl mx-auto">
            The Universal One School is fully compliant with all Texas Education Agency requirements, including STAAR testing accommodations, PEIMS reporting, and special education services.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              href="/texas-assessments" 
              className="bg-white/10 text-white px-6 py-3 rounded-full border border-white/20 hover:bg-white/20 transition-colors"
            >
              STAAR Testing Info
            </Link>
            <Link 
              href="/texas-reporting" 
              className="bg-white/10 text-white px-6 py-3 rounded-full border border-white/20 hover:bg-white/20 transition-colors"
            >
              Academic Reports
            </Link>
            <Link 
              href="/texas-peims" 
              className="bg-white/10 text-white px-6 py-3 rounded-full border border-white/20 hover:bg-white/20 transition-colors"
            >
              PEIMS Data
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}