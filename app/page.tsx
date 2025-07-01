import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Header */}
      <header className="relative z-10 bg-black/20 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 py-6">
          <nav className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img 
                src="/logo-main.jpeg" 
                alt="Universal One School Logo" 
                className="w-12 h-12 object-contain"
              />
              <div className="text-white font-bold text-2xl">
                The Universal One School
              </div>
            </div>
            <div className="hidden md:flex space-x-6">
              <Link href="#schools" className="text-white hover:text-blue-300 transition-colors">
                Schools
              </Link>
              <Link href="/marketplace" className="text-white hover:text-blue-300 transition-colors">
                Marketplace
              </Link>
              <Link href="/marketing" className="text-white hover:text-purple-300 transition-colors">
                AI Recruiting
              </Link>
              <Link href="/creator-dashboard" className="text-white hover:text-pink-300 transition-colors">
                Creator Hub
              </Link>
              <Link href="/go4it-academy" className="text-white hover:text-yellow-300 transition-colors">
                Go4it Sports Academy
              </Link>

            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="mb-8">
            <span className="inline-block bg-gradient-to-r from-blue-400 to-purple-400 text-white px-6 py-2 rounded-full text-sm font-semibold mb-4">
              🌟 1,999+ Students • 5 AI Agents • Global Network
            </span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight">
            The Future of
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Education is Here
            </span>
          </h1>
          
          <p className="text-2xl md:text-3xl text-white/90 mb-6 max-w-4xl mx-auto font-light">
            Where AI meets human potential. Where neurodiversity is celebrated. 
            Where every student finds their path to excellence.
          </p>
          
          <p className="text-lg text-white/70 mb-12 max-w-2xl mx-auto">
            From K-6 superheroes to Olympic athletes, from future lawyers to global linguists — 
            discover the school designed specifically for your unique learning style.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link 
              href="#discover-schools" 
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-10 py-5 rounded-full font-bold text-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 group"
            >
              <span className="flex items-center gap-3">
                Discover Your School
                <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            
            <Link 
              href="/demo" 
              className="border-2 border-white/30 text-white px-10 py-5 rounded-full font-bold text-xl hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1"
            >
              Try AI Demo
            </Link>
          </div>
          
          <div className="mt-16 text-center">
            <p className="text-white/60 text-sm mb-4">Trusted by students worldwide</p>
            <div className="flex justify-center gap-8 text-white/80">
              <div>
                <div className="text-2xl font-bold">1,999+</div>
                <div className="text-sm">Active Students</div>
              </div>
              <div>
                <div className="text-2xl font-bold">5</div>
                <div className="text-sm">AI Teachers</div>
              </div>
              <div>
                <div className="text-2xl font-bold">3</div>
                <div className="text-sm">Global Campuses</div>
              </div>
              <div>
                <div className="text-2xl font-bold">95%</div>
                <div className="text-sm">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating particles animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full opacity-60 animate-pulse"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-400 rounded-full opacity-80 animate-bounce"></div>
          <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-cyan-400 rounded-full opacity-40 animate-ping"></div>
        </div>
      </section>

      {/* Your Educational Journey Starts Here */}
      <section id="discover-schools" className="py-32 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-8">
              Your Educational
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Journey Awaits
              </span>
            </h2>
            <p className="text-2xl text-white/80 max-w-3xl mx-auto">
              Every great story begins with choosing the right path. 
              Discover which of our specialized schools will unlock your potential.
            </p>
          </div>

          {/* Learning Path Visualization */}
          <div className="relative max-w-7xl mx-auto">
            {/* Journey Timeline */}
            <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-cyan-400 via-purple-400 to-pink-400 opacity-30"></div>
            
            {/* School Journey Cards */}
            <div className="space-y-32">
              
              {/* Universal One Academy - K-6 */}
              <div className="relative">
                <div className="lg:flex lg:items-center lg:gap-16">
                  <div className="lg:w-1/2 mb-12 lg:mb-0">
                    <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-3xl p-8 border border-blue-400/30 hover:border-blue-400/60 transition-all duration-500 group hover:scale-105">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center overflow-hidden">
                          <img 
                            src="/logo-main.jpeg" 
                            alt="Universal One Academy Logo" 
                            className="w-14 h-14 object-contain"
                          />
                        </div>
                        <div>
                          <h3 className="text-3xl font-bold text-white">Universal One Academy</h3>
                          <p className="text-blue-300 text-lg">Ages 5-11 • Primary Education</p>
                        </div>
                      </div>
                      
                      <p className="text-white/90 text-lg mb-6 leading-relaxed">
                        Where young minds discover their academic potential! Personalized learning designed 
                        specifically for neurodivergent children with ADHD, autism, and dyslexia support.
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-blue-500/20 rounded-lg p-3">
                          <div className="text-blue-300 font-semibold">✨ AI Teacher</div>
                          <div className="text-white">Dean Wonder</div>
                        </div>
                        <div className="bg-purple-500/20 rounded-lg p-3">
                          <div className="text-purple-300 font-semibold">🎯 Focus</div>
                          <div className="text-white">ADHD & Autism Support</div>
                        </div>
                      </div>
                      
                      <Link 
                        href="/schools/primary-school"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full font-bold hover:shadow-xl transition-all duration-300 group-hover:scale-105"
                      >
                        Begin Learning Journey
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                  
                  <div className="lg:w-1/2">
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                      <div className="relative bg-black/50 rounded-3xl p-8 border border-blue-400/30">
                        <h4 className="text-2xl font-bold text-white mb-4">Student Success Story</h4>
                        <blockquote className="text-white/90 italic text-lg mb-4">
                          "Marcus went from struggling with focus to becoming a confident learner. 
                          The personalized approach and AI support helped him embrace his ADHD as a strength!"
                        </blockquote>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold">
                            M
                          </div>
                          <div>
                            <div className="text-white font-semibold">Marcus, Age 8</div>
                            <div className="text-blue-300">Universal One Academy Graduate</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* S.T.A.G.E Prep School - 7-12 */}
              <div className="relative">
                <div className="lg:flex lg:items-center lg:gap-16 lg:flex-row-reverse">
                  <div className="lg:w-1/2 mb-12 lg:mb-0">
                    <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-3xl p-8 border border-purple-400/30 hover:border-purple-400/60 transition-all duration-500 group hover:scale-105">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-3xl">
                          🎭
                        </div>
                        <div>
                          <h3 className="text-3xl font-bold text-white">S.T.A.G.E Prep School</h3>
                          <p className="text-purple-300 text-lg">Ages 12-18 • Secondary Education</p>
                        </div>
                      </div>
                      
                      <p className="text-white/90 text-lg mb-6 leading-relaxed">
                        Master the art of performance and academics. Theater-focused education with 
                        executive function support, college prep, and professional development.
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-purple-500/20 rounded-lg p-3">
                          <div className="text-purple-300 font-semibold">🎪 AI Teacher</div>
                          <div className="text-white">Dean Sterling</div>
                        </div>
                        <div className="bg-pink-500/20 rounded-lg p-3">
                          <div className="text-pink-300 font-semibold">🎯 Focus</div>
                          <div className="text-white">Theater & College Prep</div>
                        </div>
                      </div>
                      
                      <Link 
                        href="/schools/secondary-school"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-bold hover:shadow-xl transition-all duration-300 group-hover:scale-105"
                      >
                        Take the Stage
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                  
                  <div className="lg:w-1/2">
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                      <div className="relative bg-black/50 rounded-3xl p-8 border border-purple-400/30">
                        <h4 className="text-2xl font-bold text-white mb-4">Achievement Spotlight</h4>
                        <blockquote className="text-white/90 italic text-lg mb-4">
                          "Sofia discovered her passion for theater direction and got accepted to 
                          Yale Drama School. The executive function support was life-changing!"
                        </blockquote>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                            S
                          </div>
                          <div>
                            <div className="text-white font-semibold">Sofia, Age 17</div>
                            <div className="text-purple-300">Yale Drama School Accepted</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Go4it Sports Academy */}
              <div className="relative">
                <div className="lg:flex lg:items-center lg:gap-16">
                  <div className="lg:w-1/2 mb-12 lg:mb-0">
                    <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-sm rounded-3xl p-8 border border-blue-400/30 hover:border-blue-400/60 transition-all duration-500 group hover:scale-105">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center overflow-hidden">
                          <img 
                            src="/go4it-logo.jpg" 
                            alt="Go4it Academy Logo" 
                            className="w-14 h-14 object-contain"
                          />
                        </div>
                        <div>
                          <h3 className="text-3xl font-bold text-white">Go4it Sports Academy</h3>
                          <p className="text-blue-300 text-lg">Ages 14-18 • Elite Athletics</p>
                        </div>
                      </div>
                      
                      <p className="text-white/90 text-lg mb-6 leading-relaxed">
                        Train like a champion at our $95M Vienna campus. Elite athletic education 
                        with Division I recruitment, residential programs, and academic excellence.
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-blue-500/20 rounded-lg p-3">
                          <div className="text-blue-300 font-semibold">🥇 AI Coach</div>
                          <div className="text-white">Coach Elite</div>
                        </div>
                        <div className="bg-cyan-500/20 rounded-lg p-3">
                          <div className="text-cyan-300 font-semibold">🏟️ Campus</div>
                          <div className="text-white">Vienna, Austria</div>
                        </div>
                      </div>
                      
                      <Link 
                        href="/go4it-academy"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-full font-bold hover:shadow-xl transition-all duration-300 group-hover:scale-105"
                      >
                        Train with Champions
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                  
                  <div className="lg:w-1/2">
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                      <div className="relative bg-black/50 rounded-3xl p-8 border border-blue-400/30">
                        <h4 className="text-2xl font-bold text-white mb-4">Champion's Story</h4>
                        <blockquote className="text-white/90 italic text-lg mb-4">
                          "Alex combined elite soccer training with AP academics and earned a 
                          full scholarship to Stanford. The balance of athletics and education is unmatched!"
                        </blockquote>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold">
                            A
                          </div>
                          <div>
                            <div className="text-white font-semibold">Alex, Age 18</div>
                            <div className="text-blue-300">Stanford Full Scholarship</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Law School and Language Academy */}
              <div className="relative">
                <div className="lg:flex lg:items-center lg:gap-16 lg:flex-row-reverse">
                  <div className="lg:w-1/2 mb-12 lg:mb-0">
                    <div className="bg-gradient-to-br from-yellow-600/20 to-amber-600/20 backdrop-blur-sm rounded-3xl p-8 border border-yellow-400/30 hover:border-yellow-400/60 transition-all duration-500 group hover:scale-105">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full flex items-center justify-center text-3xl">
                          ⚖️
                        </div>
                        <div>
                          <h3 className="text-3xl font-bold text-white">Future Legal Professionals</h3>
                          <p className="text-yellow-300 text-lg">Ages 18+ • Legal Education</p>
                        </div>
                      </div>
                      
                      <p className="text-white/90 text-lg mb-6 leading-relaxed">
                        Master the law with Professor Barrett AI. Bar exam preparation, case studies, 
                        legal writing, and real-world courtroom simulations.
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-yellow-500/20 rounded-lg p-3">
                          <div className="text-yellow-300 font-semibold">⚖️ AI Professor</div>
                          <div className="text-white">Professor Barrett</div>
                        </div>
                        <div className="bg-amber-500/20 rounded-lg p-3">
                          <div className="text-amber-300 font-semibold">🎯 Focus</div>
                          <div className="text-white">Bar Exam Prep</div>
                        </div>
                      </div>
                      
                      <Link 
                        href="/schools/law-school"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-white px-6 py-3 rounded-full font-bold hover:shadow-xl transition-all duration-300 group-hover:scale-105"
                      >
                        Practice Law
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                  
                  <div className="lg:w-1/2">
                    <div className="bg-gradient-to-br from-emerald-600/20 to-green-600/20 backdrop-blur-sm rounded-3xl p-8 border border-emerald-400/30 hover:border-emerald-400/60 transition-all duration-500 group hover:scale-105">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center overflow-hidden">
                          <img 
                            src="/liota-logo.jfif" 
                            alt="LIOTA Logo" 
                            className="w-14 h-14 object-contain"
                          />
                        </div>
                        <div>
                          <h3 className="text-3xl font-bold text-white">LIOTA Global Language</h3>
                          <p className="text-emerald-300 text-lg">All Ages • Cultural Immersion</p>
                        </div>
                      </div>
                      
                      <p className="text-white/90 text-lg mb-6 leading-relaxed">
                        Learn languages through cultural celebration with Professor Lingua. 
                        Real-time translation, conversation practice, and global community.
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-emerald-500/20 rounded-lg p-3">
                          <div className="text-emerald-300 font-semibold">🌐 AI Teacher</div>
                          <div className="text-white">Professor Lingua</div>
                        </div>
                        <div className="bg-green-500/20 rounded-lg p-3">
                          <div className="text-green-300 font-semibold">🎯 Focus</div>
                          <div className="text-white">Cultural Immersion</div>
                        </div>
                      </div>
                      
                      <Link 
                        href="/global-language"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-3 rounded-full font-bold hover:shadow-xl transition-all duration-300 group-hover:scale-105"
                      >
                        Explore Languages
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Universal One School */}
      <section className="py-32 px-4 bg-gradient-to-b from-black to-slate-900">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-8">
              Why Choose
              <br />
              <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Universal One?
              </span>
            </h2>
            <p className="text-2xl text-white/80 max-w-3xl mx-auto">
              We're not just different — we're designed for you.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
            {/* AI-Powered Personalization */}
            <div className="group">
              <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 backdrop-blur-sm rounded-3xl p-8 border border-blue-400/20 group-hover:border-blue-400/50 transition-all duration-500 group-hover:scale-105">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform">
                  🤖
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">AI-Powered Learning</h3>
                <p className="text-white/80 text-lg leading-relaxed">
                  Every student gets a dedicated AI teacher that adapts in real-time to their learning style, 
                  pace, and challenges. It's like having a personal tutor available 24/7.
                </p>
              </div>
            </div>

            {/* Neurodivergent Excellence */}
            <div className="group">
              <div className="bg-gradient-to-br from-emerald-600/10 to-cyan-600/10 backdrop-blur-sm rounded-3xl p-8 border border-emerald-400/20 group-hover:border-emerald-400/50 transition-all duration-500 group-hover:scale-105">
                <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform">
                  🧠
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">Neurodivergent Excellence</h3>
                <p className="text-white/80 text-lg leading-relaxed">
                  Purpose-built for ADHD, autism, dyslexia, and other learning differences. 
                  We don't just accommodate — we celebrate neurodiversity as a superpower.
                </p>
              </div>
            </div>

            {/* Global Community */}
            <div className="group">
              <div className="bg-gradient-to-br from-orange-600/10 to-pink-600/10 backdrop-blur-sm rounded-3xl p-8 border border-orange-400/20 group-hover:border-orange-400/50 transition-all duration-500 group-hover:scale-105">
                <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform">
                  🌍
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">Global Network</h3>
                <p className="text-white/80 text-lg leading-relaxed">
                  Connect with students worldwide. From Dallas to Vienna to global partnerships, 
                  you're part of an international community of learners and achievers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-32 px-4 bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight">
            Ready to Begin Your
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Transformation?
            </span>
          </h2>
          
          <p className="text-2xl text-white/90 mb-12 max-w-3xl mx-auto">
            Join 1,999+ students who've discovered their potential through personalized AI education.
          </p>
          
          <div className="flex flex-col lg:flex-row gap-8 justify-center items-center">
            <Link 
              href="/enrollment-portal"
              className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white px-12 py-6 rounded-full font-bold text-2xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 group"
            >
              <span className="flex items-center gap-4">
                Start Your Journey Today
                <svg className="w-8 h-8 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            
            <div className="text-center">
              <div className="text-white/60 text-sm mb-2">Or schedule a consultation</div>
              <Link 
                href="/demo"
                className="text-cyan-400 hover:text-cyan-300 font-semibold text-lg underline decoration-2 underline-offset-4"
              >
                Talk to our AI counselors
              </Link>
            </div>
          </div>

          <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">5</div>
              <div className="text-white/70">Specialized Schools</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">95%</div>
              <div className="text-white/70">Success Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-white/70">AI Support</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">Global</div>
              <div className="text-white/70">Community</div>
            </div>
          </div>
        </div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-bold mb-6">Universal One School</h3>
              <p className="text-white/70 leading-relaxed">
                Revolutionizing education through AI-powered personalized learning, 
                neurodivergent support, and global accessibility.
              </p>
            </div>
            
            <div>
              <h4 className="text-xl font-semibold mb-6">Our Schools</h4>
              <div className="space-y-3">
                <Link href="/schools/primary-school" className="block text-white/70 hover:text-cyan-400 transition-colors">
                  SuperHero School (K-6)
                </Link>
                <Link href="/schools/secondary-school" className="block text-white/70 hover:text-purple-400 transition-colors">
                  S.T.A.G.E Prep (7-12)
                </Link>
                <Link href="/go4it-academy" className="block text-white/70 hover:text-orange-400 transition-colors">
                  Go4it Sports Academy
                </Link>
                <Link href="/schools/law-school" className="block text-white/70 hover:text-yellow-400 transition-colors">
                  Law School
                </Link>
                <Link href="/global-language" className="block text-white/70 hover:text-emerald-400 transition-colors">
                  LIOTA Language
                </Link>
              </div>
            </div>
            
            <div>
              <h4 className="text-xl font-semibold mb-6">Resources</h4>
              <div className="space-y-3">
                <Link href="/virtual-classroom" className="block text-white/70 hover:text-cyan-400 transition-colors">
                  Virtual Classroom
                </Link>
                <Link href="/ai-tutor" className="block text-white/70 hover:text-cyan-400 transition-colors">
                  AI Tutoring
                </Link>
                <Link href="/campus-3d-model" className="block text-white/70 hover:text-cyan-400 transition-colors">
                  Vienna Campus Tour
                </Link>
                <Link href="/texas-charter-compliance" className="block text-white/70 hover:text-cyan-400 transition-colors">
                  Texas Charter Info
                </Link>
              </div>
            </div>
            
            <div>
              <h4 className="text-xl font-semibold mb-6">Get Started</h4>
              <div className="space-y-3">
                <Link href="/enrollment-portal" className="block text-white/70 hover:text-cyan-400 transition-colors">
                  Enroll Now
                </Link>
                <Link href="/demo" className="block text-white/70 hover:text-cyan-400 transition-colors">
                  Try AI Demo
                </Link>
                <Link href="/student-management" className="block text-white/70 hover:text-cyan-400 transition-colors">
                  Student Portal
                </Link>
                <Link href="/dashboard" className="block text-white/70 hover:text-cyan-400 transition-colors">
                  Learning Dashboard
                </Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/20 pt-8 text-center text-white/60">
            <p>&copy; 2025 Universal One School. Transforming education through AI and inclusion.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
