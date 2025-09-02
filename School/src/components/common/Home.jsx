import React, { useEffect, useState, useCallback, memo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useBranding } from '../../context/BrandingContext.jsx'
import CourseRecommendations from './CourseRecommendations'
import Footer from './Footer'

const Home = memo(() => {
  const { isAuthenticated } = useAuth()
  const { branding } = useBranding()
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [animatedStats, setAnimatedStats] = useState({ students: 0, courses: 0, instructors: 0, completion: 0 })
  const [showOnboarding, setShowOnboarding] = useState(false)

  const handleScroll = useCallback(() => {
    setShowScrollTop(window.scrollY > 300)
  }, [])

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const handleOnboardingToggle = useCallback(() => {
    setShowOnboarding(prev => !prev)
  }, [])

  const handleOnboardingClose = useCallback(() => {
    setShowOnboarding(false)
  }, [])

  useEffect(() => {
    setIsVisible(true)

    // Simulate loading delay
    const loadingTimer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    // Animate stats
    const animateStats = () => {
      const targets = { students: 1247, courses: 683, instructors: 89, completion: 94 }
      const duration = 2000
      const steps = 60
      const increment = duration / steps

      let step = 0
      const timer = setInterval(() => {
        step++
        const progress = step / steps

        setAnimatedStats({
          students: Math.floor(targets.students * progress),
          courses: Math.floor(targets.courses * progress),
          instructors: Math.floor(targets.instructors * progress),
          completion: Math.floor(targets.completion * progress)
        })

        if (step >= steps) clearInterval(timer)
      }, increment)

      return () => clearInterval(timer)
    }

    const timer = setTimeout(animateStats, 1500)
    return () => {
      clearTimeout(timer)
      clearTimeout(loadingTimer)
    }
  }, [])

  return (
    <div className="home-page">
      {/* ===== HERO SECTION ===== */}
      <section className="hero-section py-5" style={{ background: 'linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-secondary) 100%)' }}>
        <div className="container">
          <div className="row min-vh-75 align-items-center">
            <div className="col-lg-6">
              <div className={`hero-content ${isVisible ? 'animate-in' : ''}`}>
                {/* Hero Badge */}
                <div className="mb-4">
                  <span className="badge bg-white text-primary px-3 py-2 rounded-pill shadow-sm">
                    <i className="fas fa-sparkles me-2"></i>
                    AI-Powered Learning Platform
                  </span>
                </div>

                {/* Hero Title */}
                <h1 className="display-4 fw-bold text-white mb-4">
                  Transform Your Learning Experience with
                  <span className="text-warning"> OpenEdTex</span>
                </h1>

                {/* Hero Subtitle */}
                <p className="lead text-white-50 mb-4">
                  Experience the future of education with our cutting-edge AI-powered platform.
                  Interactive courses, real-time collaboration, and personalized learning paths.
                </p>

                {/* Feature Highlights */}
                <div className="d-flex flex-wrap gap-3 mb-4">
                  <div className="d-flex align-items-center text-white-50">
                    <i className="fas fa-brain me-2 text-warning"></i>
                    <span>AI Tutor</span>
                  </div>
                  <div className="d-flex align-items-center text-white-50">
                    <i className="fas fa-users me-2 text-warning"></i>
                    <span>Live Classes</span>
                  </div>
                  <div className="d-flex align-items-center text-white-50">
                    <i className="fas fa-chart-line me-2 text-warning"></i>
                    <span>Analytics</span>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-3 p-3 shadow-lg mb-4">
                  <div className="input-group">
                    <span className="input-group-text bg-transparent border-0">
                      <i className="fas fa-search text-muted"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control border-0 ps-0"
                      placeholder="Search for courses, subjects, or skills..."
                      style={{ boxShadow: 'none' }}
                    />
                    <button className="btn btn-primary rounded-pill px-4">
                      <i className="fas fa-arrow-right me-2"></i>
                      Search
                    </button>
                  </div>
                  <div className="d-flex gap-2 mt-2">
                    <span className="badge bg-light text-muted rounded-pill px-3 py-1">Python</span>
                    <span className="badge bg-light text-muted rounded-pill px-3 py-1">Data Science</span>
                    <span className="badge bg-light text-muted rounded-pill px-3 py-1">Machine Learning</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="d-flex gap-3 flex-wrap">
                  {isAuthenticated ? (
                    <>
                      <Link to="/courses" className="btn btn-warning btn-lg px-4 py-3 rounded-pill">
                        <i className="fas fa-book me-2"></i>
                        Explore Courses
                      </Link>
                      <Link to="/dashboard" className="btn btn-outline-light btn-lg px-4 py-3 rounded-pill">
                        <i className="fas fa-tachometer-alt me-2"></i>
                        My Dashboard
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/register" className="btn btn-warning btn-lg px-4 py-3 rounded-pill">
                        <i className="fas fa-rocket me-2"></i>
                        Start Learning Free
                      </Link>
                      <Link to="/login" className="btn btn-outline-light btn-lg px-4 py-3 rounded-pill">
                        <i className="fas fa-sign-in-alt me-2"></i>
                        Sign In
                      </Link>
                    </>
                  )}
                </div>

                {/* Stats */}
                <div className="row mt-5 pt-4">
                  <div className="col-4 text-center">
                    <div className="text-white-50 mb-1">Students</div>
                    <div className="h3 text-white fw-bold">
                      {isLoading ? '...' : `${animatedStats.students.toLocaleString()}+`}
                    </div>
                  </div>
                  <div className="col-4 text-center">
                    <div className="text-white-50 mb-1">Courses</div>
                    <div className="h3 text-white fw-bold">
                      {isLoading ? '...' : `${animatedStats.courses}+`}
                    </div>
                  </div>
                  <div className="col-4 text-center">
                    <div className="text-white-50 mb-1">Success Rate</div>
                    <div className="h3 text-white fw-bold">
                      {isLoading ? '...' : `${animatedStats.completion}%`}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className={`hero-visual ${isVisible ? 'animate-in-delay' : ''}`}>
                <div className="bg-white rounded-4 shadow-lg p-4">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <div className="d-flex gap-1">
                        <div className="bg-danger rounded-circle" style={{ width: '12px', height: '12px' }}></div>
                        <div className="bg-warning rounded-circle" style={{ width: '12px', height: '12px' }}></div>
                        <div className="bg-success rounded-circle" style={{ width: '12px', height: '12px' }}></div>
                      </div>
                      <span className="text-muted small">OpenEdTex Dashboard</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="d-flex gap-2 mb-3">
                      <span className="badge bg-primary">Courses</span>
                      <span className="badge bg-light text-muted">Progress</span>
                      <span className="badge bg-light text-muted">AI Assistant</span>
                    </div>

                    <div className="border rounded-3 p-3 mb-3">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <div className="d-flex align-items-center gap-3">
                          <div className="bg-primary bg-opacity-10 rounded-3 p-2">
                            <i className="fas fa-brain text-primary"></i>
                          </div>
                          <div>
                            <div className="fw-semibold">Advanced Mathematics</div>
                            <div className="text-muted small">Chapter 3: Calculus Fundamentals</div>
                          </div>
                        </div>
                        <span className="badge bg-warning text-dark">In Progress</span>
                      </div>
                      <div className="mt-3">
                        <div className="progress mb-2" style={{ height: '6px' }}>
                          <div className="progress-bar bg-primary" style={{ width: '75%' }}></div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="text-muted small">75% Complete</span>
                          <div className="d-flex gap-2">
                            <button className="btn btn-primary btn-sm rounded-pill">
                              <i className="fas fa-play me-1"></i>
                              Continue
                            </button>
                            <button className="btn btn-outline-primary btn-sm rounded-pill">
                              <i className="fas fa-robot"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-3 p-3">
                      <div className="d-flex align-items-center gap-3">
                        <div className="bg-success bg-opacity-10 rounded-3 p-2">
                          <i className="fas fa-robot text-success"></i>
                        </div>
                        <div className="flex-grow-1">
                          <div className="text-muted small mb-1">AI Assistant • 2 min ago</div>
                          <div className="small">"Need help with derivatives? I can explain the chain rule with interactive examples!"</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8 text-center">
              <div className="mb-3">
                <span className="badge bg-primary text-white px-3 py-2 rounded-pill">
                  <i className="fas fa-bolt me-2"></i>
                  Powerful Features
                </span>
              </div>
              <h2 className="display-5 fw-bold mb-3">
                Everything You Need to
                <span className="text-primary"> Succeed</span>
              </h2>
              <p className="lead text-muted">
                Our comprehensive platform combines cutting-edge technology with proven educational methods
                to deliver an unparalleled learning experience.
              </p>
            </div>
          </div>

          {/* Features Carousel */}
          <div id="featuresCarousel" className="carousel slide" data-bs-ride="carousel">
            {/* Carousel Indicators */}
            <div className="carousel-indicators mb-4">
              <button type="button" data-bs-target="#featuresCarousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
              <button type="button" data-bs-target="#featuresCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
            </div>

            {/* Carousel Inner */}
            <div className="carousel-inner">
              {/* First Slide */}
              <div className="carousel-item active">
                <div className="row g-4 justify-content-center">
                  <div className="col-lg-4 col-md-6">
                    <div className="card h-100 border-0 shadow-sm hover-lift">
                      <div className="card-body text-center p-4">
                        <div className="bg-primary bg-opacity-10 rounded-3 d-inline-flex p-3 mb-3">
                          <i className="fas fa-brain text-primary fa-2x"></i>
                        </div>
                        <h5 className="card-title fw-bold mb-3">AI Study Assistant</h5>
                        <p className="card-text text-muted mb-3">
                          Get instant help with complex topics, personalized explanations, and 24/7 academic support.
                        </p>
                        <div className="d-flex gap-2 justify-content-center flex-wrap">
                          <span className="badge bg-primary bg-opacity-10 text-primary">AI-Powered</span>
                          <span className="badge bg-primary bg-opacity-10 text-primary">24/7 Support</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-4 col-md-6">
                    <div className="card h-100 border-0 shadow-sm hover-lift">
                      <div className="card-body text-center p-4">
                        <div className="bg-success bg-opacity-10 rounded-3 d-inline-flex p-3 mb-3">
                          <i className="fas fa-users text-success fa-2x"></i>
                        </div>
                        <h5 className="card-title fw-bold mb-3">Interactive Classrooms</h5>
                        <p className="card-text text-muted mb-3">
                          Join live sessions with instructors and peers. Participate in discussions and collaborative projects.
                        </p>
                        <div className="d-flex gap-2 justify-content-center flex-wrap">
                          <span className="badge bg-success bg-opacity-10 text-success">Live Sessions</span>
                          <span className="badge bg-success bg-opacity-10 text-success">Collaboration</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-4 col-md-6 d-none d-lg-block">
                    <div className="card h-100 border-0 shadow-sm hover-lift">
                      <div className="card-body text-center p-4">
                        <div className="bg-info bg-opacity-10 rounded-3 d-inline-flex p-3 mb-3">
                          <i className="fas fa-chart-line text-info fa-2x"></i>
                        </div>
                        <h5 className="card-title fw-bold mb-3">Advanced Analytics</h5>
                        <p className="card-text text-muted mb-3">
                          Track your progress with detailed analytics, performance insights, and personalized recommendations.
                        </p>
                        <div className="d-flex gap-2 justify-content-center flex-wrap">
                          <span className="badge bg-info bg-opacity-10 text-info">Progress Tracking</span>
                          <span className="badge bg-info bg-opacity-10 text-info">Insights</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Second Slide */}
              <div className="carousel-item">
                <div className="row g-4 justify-content-center">
                  <div className="col-lg-4 col-md-6">
                    <div className="card h-100 border-0 shadow-sm hover-lift">
                      <div className="card-body text-center p-4">
                        <div className="bg-warning bg-opacity-10 rounded-3 d-inline-flex p-3 mb-3">
                          <i className="fas fa-book text-warning fa-2x"></i>
                        </div>
                        <h5 className="card-title fw-bold mb-3">Rich Course Content</h5>
                        <p className="card-text text-muted mb-3">
                          Access comprehensive courses with multimedia content, interactive exercises, and TEKS-aligned objectives.
                        </p>
                        <div className="d-flex gap-2 justify-content-center flex-wrap">
                          <span className="badge bg-warning bg-opacity-10 text-warning">Multimedia</span>
                          <span className="badge bg-warning bg-opacity-10 text-warning">TEKS-Aligned</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-4 col-md-6">
                    <div className="card h-100 border-0 shadow-sm hover-lift">
                      <div className="card-body text-center p-4">
                        <div className="bg-secondary bg-opacity-10 rounded-3 d-inline-flex p-3 mb-3">
                          <i className="fas fa-mobile-alt text-secondary fa-2x"></i>
                        </div>
                        <h5 className="card-title fw-bold mb-3">Mobile Learning</h5>
                        <p className="card-text text-muted mb-3">
                          Learn anywhere, anytime with our fully responsive mobile app. Download courses and study offline.
                        </p>
                        <div className="d-flex gap-2 justify-content-center flex-wrap">
                          <span className="badge bg-secondary bg-opacity-10 text-secondary">Mobile App</span>
                          <span className="badge bg-secondary bg-opacity-10 text-secondary">Offline Access</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-4 col-md-6 d-none d-lg-block">
                    <div className="card h-100 border-0 shadow-sm hover-lift">
                      <div className="card-body text-center p-4">
                        <div className="bg-danger bg-opacity-10 rounded-3 d-inline-flex p-3 mb-3">
                          <i className="fas fa-shield-alt text-danger fa-2x"></i>
                        </div>
                        <h5 className="card-title fw-bold mb-3">Enterprise Security</h5>
                        <p className="card-text text-muted mb-3">
                          Your data is protected with bank-level security, GDPR compliance, and advanced encryption.
                        </p>
                        <div className="d-flex gap-2 justify-content-center flex-wrap">
                          <span className="badge bg-danger bg-opacity-10 text-danger">Secure</span>
                          <span className="badge bg-danger bg-opacity-10 text-danger">GDPR Compliant</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Carousel Controls */}
            <button className="carousel-control-prev" type="button" data-bs-target="#featuresCarousel" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#featuresCarousel" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>

          {/* Mobile Navigation Dots (for smaller screens) */}
          <div className="d-lg-none mt-4">
            <div className="row g-2 justify-content-center">
              <div className="col-auto">
                <button className="btn btn-outline-primary rounded-circle p-2" data-bs-target="#featuresCarousel" data-bs-slide-to="0">
                  <span className="visually-hidden">First slide</span>
                </button>
              </div>
              <div className="col-auto">
                <button className="btn btn-outline-primary rounded-circle p-2" data-bs-target="#featuresCarousel" data-bs-slide-to="1">
                  <span className="visually-hidden">Second slide</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS SECTION ===== */}
      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8 text-center">
              <div className="mb-3">
                <span className="badge bg-success text-white px-3 py-2 rounded-pill">
                  <i className="fas fa-play-circle me-2"></i>
                  How It Works
                </span>
              </div>
              <h2 className="display-5 fw-bold mb-3">
                Your Learning Journey in
                <span className="text-success"> 3 Simple Steps</span>
              </h2>
              <p className="lead text-muted">
                Get started with OpenEdTex and transform your educational experience
              </p>
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="row g-4 align-items-center">
                <div className="col-lg-4">
                  <div className="text-center">
                    <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px', fontSize: '2rem', fontWeight: 'bold' }}>
                      1
                    </div>
                    <div className="bg-primary bg-opacity-10 rounded-4 p-4 h-100">
                      <div className="text-primary mb-3">
                        <i className="fas fa-user-plus fa-2x"></i>
                      </div>
                      <h5 className="fw-bold mb-3">Create Your Account</h5>
                      <p className="text-muted mb-3">
                        Sign up for free and set up your personalized learning profile. Tell us about your goals and preferences.
                      </p>
                      <div className="d-flex gap-2 justify-content-center flex-wrap">
                        <span className="badge bg-primary bg-opacity-25 text-primary">Free Registration</span>
                        <span className="badge bg-primary bg-opacity-25 text-primary">Personalized Setup</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-1 d-none d-lg-flex justify-content-center">
                  <div className="text-primary" style={{ fontSize: '2rem' }}>
                    <i className="fas fa-arrow-right"></i>
                  </div>
                </div>

                <div className="col-lg-3">
                  <div className="text-center">
                    <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px', fontSize: '2rem', fontWeight: 'bold' }}>
                      2
                    </div>
                    <div className="bg-success bg-opacity-10 rounded-4 p-4 h-100">
                      <div className="text-success mb-3">
                        <i className="fas fa-search fa-2x"></i>
                      </div>
                      <h5 className="fw-bold mb-3">Choose Your Courses</h5>
                      <p className="text-muted mb-3">
                        Browse our extensive library of courses or let our AI recommend the perfect learning path.
                      </p>
                      <div className="d-flex gap-2 justify-content-center flex-wrap">
                        <span className="badge bg-success bg-opacity-25 text-success">AI Recommendations</span>
                        <span className="badge bg-success bg-opacity-25 text-success">Extensive Library</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-1 d-none d-lg-flex justify-content-center">
                  <div className="text-success" style={{ fontSize: '2rem' }}>
                    <i className="fas fa-arrow-right"></i>
                  </div>
                </div>

                <div className="col-lg-3">
                  <div className="text-center">
                    <div className="bg-warning text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px', fontSize: '2rem', fontWeight: 'bold' }}>
                      3
                    </div>
                    <div className="bg-warning bg-opacity-10 rounded-4 p-4 h-100">
                      <div className="text-warning-emphasis mb-3">
                        <i className="fas fa-graduation-cap fa-2x"></i>
                      </div>
                      <h5 className="fw-bold mb-3">Start Learning</h5>
                      <p className="text-muted mb-3">
                        Begin your educational journey with interactive lessons, AI assistance, and progress tracking.
                      </p>
                      <div className="d-flex gap-2 justify-content-center flex-wrap">
                        <span className="badge bg-warning bg-opacity-25 text-warning-emphasis">Interactive Lessons</span>
                        <span className="badge bg-warning bg-opacity-25 text-warning-emphasis">Progress Tracking</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section className="py-5 bg-white border-top">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8 text-center">
              <h2 className="display-5 fw-bold mb-3">
                Trusted by <span className="text-primary">Learners Worldwide</span>
              </h2>
              <p className="lead text-muted">
                Join a growing community of successful students and educators
              </p>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-lg-3 col-md-6">
              <div className="text-center p-4 bg-light rounded-4">
                <div className="text-primary mb-3">
                  <i className="fas fa-users fa-3x"></i>
                </div>
                <div className="h2 fw-bold text-primary mb-2">
                  {isLoading ? '...' : `${animatedStats.students.toLocaleString()}+`}
                </div>
                <div className="text-muted fw-semibold">Active Students</div>
                <div className="text-muted small">Learning and growing every day</div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="text-center p-4 bg-light rounded-4">
                <div className="text-success mb-3">
                  <i className="fas fa-book fa-3x"></i>
                </div>
                <div className="h2 fw-bold text-success mb-2">
                  {isLoading ? '...' : `${animatedStats.courses}+`}
                </div>
                <div className="text-muted fw-semibold">Courses Available</div>
                <div className="text-muted small">Comprehensive learning paths</div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="text-center p-4 bg-light rounded-4">
                <div className="text-warning mb-3">
                  <i className="fas fa-chalkboard-teacher fa-3x"></i>
                </div>
                <div className="h2 fw-bold text-warning mb-2">
                  {isLoading ? '...' : `${animatedStats.instructors}+`}
                </div>
                <div className="text-muted fw-semibold">Expert Instructors</div>
                <div className="text-muted small">Industry-leading educators</div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="text-center p-4 bg-light rounded-4">
                <div className="text-danger mb-3">
                  <i className="fas fa-trophy fa-3x"></i>
                </div>
                <div className="h2 fw-bold text-danger mb-2">
                  {isLoading ? '...' : `${animatedStats.completion}%`}
                </div>
                <div className="text-muted fw-semibold">Completion Rate</div>
                <div className="text-muted small">Students who finish their courses</div>
              </div>
            </div>
          </div>

          <div className="row justify-content-center mt-5">
            <div className="col-lg-8">
              <div className="d-flex justify-content-center gap-4 flex-wrap">
                <div className="d-flex align-items-center gap-2">
                  <i className="fas fa-star text-warning"></i>
                  <span className="fw-semibold">4.9/5 Rating</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <i className="fas fa-certificate text-success"></i>
                  <span className="fw-semibold">Certified Platform</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <i className="fas fa-shield-alt text-primary"></i>
                  <span className="fw-semibold">GDPR Compliant</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <i className="fas fa-mobile-alt text-info"></i>
                  <span className="fw-semibold">Mobile Optimized</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS SECTION ===== */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8 text-center">
              <div className="mb-3">
                <span className="badge bg-success text-white px-3 py-2 rounded-pill">
                  <i className="fas fa-comments me-2"></i>
                  Student Success Stories
                </span>
              </div>
              <h2 className="display-5 fw-bold mb-3">
                What Our <span className="text-success">Students Say</span>
              </h2>
              <p className="lead text-muted">
                Real experiences from learners who transformed their education with OpenEdTex
              </p>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-lg-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="d-flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className="fas fa-star text-warning"></i>
                    ))}
                  </div>
                  <p className="card-text text-muted mb-4">
                    "OpenEdTex completely changed how I approach learning. The AI tutor helped me understand complex math concepts that I struggled with for years."
                  </p>
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                      <span className="text-primary fw-bold">SA</span>
                    </div>
                    <div>
                      <div className="fw-semibold">Sarah Anderson</div>
                      <div className="text-muted small">Computer Science Student</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="d-flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className="fas fa-star text-warning"></i>
                    ))}
                  </div>
                  <p className="card-text text-muted mb-4">
                    "As a working professional, I needed flexible learning options. OpenEdTex's mobile app and offline access allowed me to study during my commute."
                  </p>
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                      <span className="text-success fw-bold">MJ</span>
                    </div>
                    <div>
                      <div className="fw-semibold">Michael Johnson</div>
                      <div className="text-muted small">Business Administration</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="d-flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className="fas fa-star text-warning"></i>
                    ))}
                  </div>
                  <p className="card-text text-muted mb-4">
                    "The live classroom feature connected me with amazing instructors and peers from around the world. The collaborative projects helped me build real-world skills."
                  </p>
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-info bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                      <span className="text-info fw-bold">EC</span>
                    </div>
                    <div>
                      <div className="fw-semibold">Emily Chen</div>
                      <div className="text-muted small">Data Science Student</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row justify-content-center mt-5">
            <div className="col-lg-6">
              <div className="bg-white rounded-4 p-4 text-center shadow-sm">
                <div className="row g-4">
                  <div className="col-4">
                    <div className="h3 fw-bold text-primary mb-1">4.9/5</div>
                    <div className="text-muted small">Average Rating</div>
                  </div>
                  <div className="col-4">
                    <div className="h3 fw-bold text-success mb-1">10,000+</div>
                    <div className="text-muted small">Happy Students</div>
                  </div>
                  <div className="col-4">
                    <div className="h3 fw-bold text-warning mb-1">95%</div>
                    <div className="text-muted small">Satisfaction Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PRICING SECTION ===== */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8 text-center">
              <div className="mb-3">
                <span className="badge bg-primary text-white px-3 py-2 rounded-pill">
                  <i className="fas fa-tags me-2"></i>
                  Pricing Plans
                </span>
              </div>
              <h2 className="display-5 fw-bold mb-3">
                Choose Your <span className="text-primary">Learning Path</span>
              </h2>
              <p className="lead text-muted">
                Flexible pricing options designed for every type of learner
              </p>
            </div>
          </div>

          <div className="row g-4 justify-content-center">
            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="mb-4">
                    <h4 className="fw-bold mb-3">Free</h4>
                    <div className="h2 fw-bold text-success mb-1">$0</div>
                    <div className="text-muted">/month</div>
                    <p className="text-muted small mt-2">Perfect for trying out our platform</p>
                  </div>

                  <div className="mb-4">
                    <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                      <i className="fas fa-check text-success"></i>
                      <span className="small">Access to 10 courses</span>
                    </div>
                    <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                      <i className="fas fa-check text-success"></i>
                      <span className="small">Basic AI assistance</span>
                    </div>
                    <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                      <i className="fas fa-check text-success"></i>
                      <span className="small">Community forums</span>
                    </div>
                    <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                      <i className="fas fa-times text-muted"></i>
                      <span className="small text-muted">Live classroom sessions</span>
                    </div>
                  </div>

                  <Link to="/register" className="btn btn-outline-primary w-100 rounded-pill">
                    Get Started Free
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border-primary border-2 shadow-lg position-relative">
                <div className="position-absolute top-0 start-50 translate-middle">
                  <span className="badge bg-primary text-white px-3 py-2 rounded-pill">Most Popular</span>
                </div>
                <div className="card-body text-center p-4">
                  <div className="mb-4">
                    <h4 className="fw-bold mb-3">Pro</h4>
                    <div className="h2 fw-bold text-primary mb-1">$19</div>
                    <div className="text-muted">/month</div>
                    <p className="text-muted small mt-2">For serious learners and professionals</p>
                  </div>

                  <div className="mb-4">
                    <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                      <i className="fas fa-check text-success"></i>
                      <span className="small">Unlimited course access</span>
                    </div>
                    <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                      <i className="fas fa-check text-success"></i>
                      <span className="small">Advanced AI tutor</span>
                    </div>
                    <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                      <i className="fas fa-check text-success"></i>
                      <span className="small">Live classroom sessions</span>
                    </div>
                    <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                      <i className="fas fa-check text-success"></i>
                      <span className="small">Progress analytics</span>
                    </div>
                  </div>

                  <Link to="/register" className="btn btn-primary w-100 rounded-pill">
                    Start Pro Trial
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="mb-4">
                    <h4 className="fw-bold mb-3">Enterprise</h4>
                    <div className="h2 fw-bold text-secondary mb-1">Custom</div>
                    <div className="text-muted">pricing</div>
                    <p className="text-muted small mt-2">For organizations and institutions</p>
                  </div>

                  <div className="mb-4">
                    <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                      <i className="fas fa-check text-success"></i>
                      <span className="small">Everything in Pro</span>
                    </div>
                    <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                      <i className="fas fa-check text-success"></i>
                      <span className="small">Custom course creation</span>
                    </div>
                    <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                      <i className="fas fa-check text-success"></i>
                      <span className="small">Admin dashboard</span>
                    </div>
                    <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                      <i className="fas fa-check text-success"></i>
                      <span className="small">API access</span>
                    </div>
                  </div>

                  <Link to="/contact" className="btn btn-outline-secondary w-100 rounded-pill">
                    Contact Sales
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="row justify-content-center mt-5">
            <div className="col-lg-8">
              <div className="bg-light rounded-4 p-4">
                <h5 className="fw-bold text-center mb-4">Frequently Asked Questions</h5>
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="fw-semibold mb-2">Can I cancel anytime?</div>
                      <div className="text-muted small">Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="fw-semibold mb-2">Is there a free trial?</div>
                      <div className="text-muted small">Yes! You can try Pro features free for 14 days. No credit card required to start your trial.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER SECTION ===== */}
      <section className="py-5 bg-primary text-white">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="mb-4">
                <span className="badge bg-white text-primary px-3 py-2 rounded-pill">
                  <i className="fas fa-envelope me-2"></i>
                  Stay Connected
                </span>
              </div>
              <h2 className="display-5 fw-bold mb-3">
                Get the Latest <span className="text-warning">Educational Insights</span>
              </h2>
              <p className="lead mb-4">
                Join 10,000+ learners who receive weekly tips, course recommendations,
                and exclusive content to accelerate their learning journey.
              </p>
              <div className="row g-3 mb-4">
                <div className="col-6">
                  <div className="d-flex align-items-center gap-2">
                    <i className="fas fa-lightbulb text-warning"></i>
                    <span className="small">Learning Tips & Strategies</span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex align-items-center gap-2">
                    <i className="fas fa-book text-warning"></i>
                    <span className="small">New Course Announcements</span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex align-items-center gap-2">
                    <i className="fas fa-chart-line text-warning"></i>
                    <span className="small">Exclusive Study Resources</span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex align-items-center gap-2">
                    <i className="fas fa-users text-warning"></i>
                    <span className="small">Community Updates</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="bg-white text-dark rounded-4 p-4 shadow-lg">
                <div className="mb-4">
                  <input
                    type="email"
                    className="form-control form-control-lg rounded-pill border-0 bg-light"
                    placeholder="Enter your email address"
                  />
                </div>
                <button className="btn btn-primary btn-lg w-100 rounded-pill mb-3">
                  <i className="fas fa-paper-plane me-2"></i>
                  Subscribe Now
                </button>
                <div className="text-center text-muted small mb-4">
                  <i className="fas fa-shield-alt me-2"></i>
                  We respect your privacy. Unsubscribe at any time.
                </div>
                <div className="row text-center g-3">
                  <div className="col-4">
                    <div className="h4 fw-bold text-primary mb-1">10,000+</div>
                    <div className="text-muted small">Subscribers</div>
                  </div>
                  <div className="col-4">
                    <div className="h4 fw-bold text-success mb-1">95%</div>
                    <div className="text-muted small">Open Rate</div>
                  </div>
                  <div className="col-4">
                    <div className="h4 fw-bold text-warning mb-1">Weekly</div>
                    <div className="text-muted small">Updates</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== COURSE RECOMMENDATIONS ===== */}
      {isAuthenticated && (
        <section className="py-5 bg-light">
          <div className="container">
            <CourseRecommendations maxCourses={6} showTitle={true} />
          </div>
        </section>
      )}

      {/* ===== FINAL CTA SECTION ===== */}
      <section className="py-5 bg-gradient" style={{ background: 'linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-secondary) 100%)' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h2 className="display-4 fw-bold text-white mb-3">
                Ready to Transform Your
                <span className="text-warning"> Learning Journey?</span>
              </h2>
              <p className="lead text-white-50 mb-4">
                Join thousands of students who are already experiencing the future of education.
                Start learning today and unlock your full potential.
              </p>
              <div className="d-flex gap-3 flex-wrap mb-4">
                <div className="d-flex align-items-center gap-2 text-white-50">
                  <i className="fas fa-check text-success"></i>
                  <span>Free to get started</span>
                </div>
                <div className="d-flex align-items-center gap-2 text-white-50">
                  <i className="fas fa-check text-success"></i>
                  <span>No credit card required</span>
                </div>
                <div className="d-flex align-items-center gap-2 text-white-50">
                  <i className="fas fa-check text-success"></i>
                  <span>Cancel anytime</span>
                </div>
              </div>

              {isAuthenticated ? (
                <div className="d-flex gap-3 flex-wrap">
                  <Link to="/courses" className="btn btn-warning btn-lg px-4 py-3 rounded-pill">
                    <i className="fas fa-rocket me-2"></i>
                    Explore Courses
                  </Link>
                  <Link to="/dashboard" className="btn btn-outline-light btn-lg px-4 py-3 rounded-pill">
                    <i className="fas fa-tachometer-alt me-2"></i>
                    My Dashboard
                  </Link>
                </div>
              ) : (
                <div className="d-flex gap-3 flex-wrap">
                  <Link to="/register" className="btn btn-warning btn-lg px-4 py-3 rounded-pill">
                    <i className="fas fa-user-plus me-2"></i>
                    Start Learning Free
                  </Link>
                  <Link to="/login" className="btn btn-outline-light btn-lg px-4 py-3 rounded-pill">
                    <i className="fas fa-sign-in-alt me-2"></i>
                    Sign In
                  </Link>
                </div>
              )}
            </div>

            <div className="col-lg-4 text-center">
              <div className="bg-white bg-opacity-10 rounded-4 p-4 backdrop-blur">
                <div className="d-flex justify-content-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="fas fa-star text-warning"></i>
                  ))}
                </div>
                <div className="text-white-50 small mb-3">Trusted by 10,000+ students worldwide</div>
                <div className="row g-3 text-center">
                  <div className="col-4">
                    <div className="h4 fw-bold text-white mb-1">4.9</div>
                    <div className="text-white-50 small">Rating</div>
                  </div>
                  <div className="col-4">
                    <div className="h4 fw-bold text-white mb-1">95%</div>
                    <div className="text-white-50 small">Success</div>
                  </div>
                  <div className="col-4">
                    <div className="h4 fw-bold text-white mb-1">24/7</div>
                    <div className="text-white-50 small">Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section className="py-5 bg-white border-top">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8 text-center">
              <h2 className="display-5 fw-bold mb-3">
                Trusted by <span className="text-primary">Learners Worldwide</span>
              </h2>
              <p className="lead text-muted">
                Join a growing community of successful students and educators
              </p>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-lg-3 col-md-6">
              <div className="text-center p-4 bg-light rounded-4">
                <div className="text-primary mb-3">
                  <i className="fas fa-users fa-3x"></i>
                </div>
                <div className="h2 fw-bold text-primary mb-2">
                  {isLoading ? '...' : `${animatedStats.students.toLocaleString()}+`}
                </div>
                <div className="text-muted fw-semibold">Active Students</div>
                <div className="text-muted small">Learning and growing every day</div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="text-center p-4 bg-light rounded-4">
                <div className="text-success mb-3">
                  <i className="fas fa-book fa-3x"></i>
                </div>
                <div className="h2 fw-bold text-success mb-2">
                  {isLoading ? '...' : `${animatedStats.courses}+`}
                </div>
                <div className="text-muted fw-semibold">Courses Available</div>
                <div className="text-muted small">Comprehensive learning paths</div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="text-center p-4 bg-light rounded-4">
                <div className="text-warning mb-3">
                  <i className="fas fa-chalkboard-teacher fa-3x"></i>
                </div>
                <div className="h2 fw-bold text-warning mb-2">
                  {isLoading ? '...' : `${animatedStats.instructors}+`}
                </div>
                <div className="text-muted fw-semibold">Expert Instructors</div>
                <div className="text-muted small">Industry-leading educators</div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="text-center p-4 bg-light rounded-4">
                <div className="text-danger mb-3">
                  <i className="fas fa-trophy fa-3x"></i>
                </div>
                <div className="h2 fw-bold text-danger mb-2">
                  {isLoading ? '...' : `${animatedStats.completion}%`}
                </div>
                <div className="text-muted fw-semibold">Completion Rate</div>
                <div className="text-muted small">Students who finish their courses</div>
              </div>
            </div>
          </div>

          <div className="row justify-content-center mt-5">
            <div className="col-lg-8">
              <div className="d-flex justify-content-center gap-4 flex-wrap">
                <div className="d-flex align-items-center gap-2">
                  <i className="fas fa-star text-warning"></i>
                  <span className="fw-semibold">4.9/5 Rating</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <i className="fas fa-certificate text-success"></i>
                  <span className="fw-semibold">Certified Platform</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <i className="fas fa-shield-alt text-primary"></i>
                  <span className="fw-semibold">GDPR Compliant</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <i className="fas fa-mobile-alt text-info"></i>
                  <span className="fw-semibold">Mobile Optimized</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS SECTION ===== */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8 text-center">
              <div className="mb-3">
                <span className="badge bg-success text-white px-3 py-2 rounded-pill">
                  <i className="fas fa-comments me-2"></i>
                  Student Success Stories
                </span>
              </div>
              <h2 className="display-5 fw-bold mb-3">
                What Our <span className="text-success">Students Say</span>
              </h2>
              <p className="lead text-muted">
                Real experiences from learners who transformed their education with OpenEdTex
              </p>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-lg-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="d-flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className="fas fa-star text-warning"></i>
                    ))}
                  </div>
                  <p className="card-text text-muted mb-4">
                    "OpenEdTex completely changed how I approach learning. The AI tutor helped me understand complex math concepts that I struggled with for years."
                  </p>
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                      <span className="text-primary fw-bold">SA</span>
                    </div>
                    <div>
                      <div className="fw-semibold">Sarah Anderson</div>
                      <div className="text-muted small">Computer Science Student</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="d-flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className="fas fa-star text-warning"></i>
                    ))}
                  </div>
                  <p className="card-text text-muted mb-4">
                    "As a working professional, I needed flexible learning options. OpenEdTex's mobile app and offline access allowed me to study during my commute."
                  </p>
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                      <span className="text-success fw-bold">MJ</span>
                    </div>
                    <div>
                      <div className="fw-semibold">Michael Johnson</div>
                      <div className="text-muted small">Business Administration</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="d-flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className="fas fa-star text-warning"></i>
                    ))}
                  </div>
                  <p className="card-text text-muted mb-4">
                    "The live classroom feature connected me with amazing instructors and peers from around the world. The collaborative projects helped me build real-world skills."
                  </p>
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-info bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                      <span className="text-info fw-bold">EC</span>
                    </div>
                    <div>
                      <div className="fw-semibold">Emily Chen</div>
                      <div className="text-muted small">Data Science Student</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row justify-content-center mt-5">
            <div className="col-lg-6">
              <div className="bg-white rounded-4 p-4 text-center shadow-sm">
                <div className="row g-4">
                  <div className="col-4">
                    <div className="h3 fw-bold text-primary mb-1">4.9/5</div>
                    <div className="text-muted small">Average Rating</div>
                  </div>
                  <div className="col-4">
                    <div className="h3 fw-bold text-success mb-1">10,000+</div>
                    <div className="text-muted small">Happy Students</div>
                  </div>
                  <div className="col-4">
                    <div className="h3 fw-bold text-warning mb-1">95%</div>
                    <div className="text-muted small">Satisfaction Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PRICING SECTION ===== */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8 text-center">
              <div className="mb-3">
                <span className="badge bg-primary text-white px-3 py-2 rounded-pill">
                  <i className="fas fa-tags me-2"></i>
                  Pricing Plans
                </span>
              </div>
              <h2 className="display-5 fw-bold mb-3">
                Choose Your <span className="text-primary">Learning Path</span>
              </h2>
              <p className="lead text-muted">
                Flexible pricing options designed for every type of learner
              </p>
            </div>
          </div>

          <div className="row g-4 justify-content-center">
            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="mb-4">
                    <h4 className="fw-bold mb-3">Free</h4>
                    <div className="h2 fw-bold text-success mb-1">$0</div>
                    <div className="text-muted">/month</div>
                    <p className="text-muted small mt-2">Perfect for trying out our platform</p>
                  </div>

                  <div className="mb-4">
                    <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                      <i className="fas fa-check text-success"></i>
                      <span className="small">Access to 10 courses</span>
                    </div>
                    <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                      <i className="fas fa-check text-success"></i>
                      <span className="small">Basic AI assistance</span>
                    </div>
                    <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                      <i className="fas fa-check text-success"></i>
                      <span className="small">Community forums</span>
                    </div>
                    <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                      <i className="fas fa-times text-muted"></i>
                      <span className="small text-muted">Live classroom sessions</span>
                    </div>
                  </div>

                  <Link to="/register" className="btn btn-outline-primary w-100 rounded-pill">
                    Get Started Free
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border-primary border-2 shadow-lg position-relative">
                <div className="position-absolute top-0 start-50 translate-middle">
                  <span className="badge bg-primary text-white px-3 py-2 rounded-pill">Most Popular</span>
                </div>
                <div className="card-body text-center p-4">
                  <div className="mb-4">
                    <h4 className="fw-bold mb-3">Pro</h4>
                    <div className="h2 fw-bold text-primary mb-1">$19</div>
                    <div className="text-muted">/month</div>
                    <p className="text-muted small mt-2">For serious learners and professionals</p>
                  </div>

                  <div className="mb-4">
                    <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                      <i className="fas fa-check text-success"></i>
                      <span className="small">Unlimited course access</span>
                    </div>
                    <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                      <i className="fas fa-check text-success"></i>
                      <span className="small">Advanced AI tutor</span>
                    </div>
                    <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                      <i className="fas fa-check text-success"></i>
                      <span className="small">Live classroom sessions</span>
                    </div>
                    <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                      <i className="fas fa-check text-success"></i>
                      <span className="small">Progress analytics</span>
                    </div>
                  </div>

                  <Link to="/register" className="btn btn-primary w-100 rounded-pill">
                    Start Pro Trial
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="mb-4">
                    <h4 className="fw-bold mb-3">Enterprise</h4>
                    <div className="h2 fw-bold text-secondary mb-1">Custom</div>
                    <div className="text-muted">pricing</div>
                    <p className="text-muted small mt-2">For organizations and institutions</p>
                  </div>

                  <div className="mb-4">
                    <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                      <i className="fas fa-check text-success"></i>
                      <span className="small">Everything in Pro</span>
                    </div>
                    <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                      <i className="fas fa-check text-success"></i>
                      <span className="small">Custom course creation</span>
                    </div>
                    <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                      <i className="fas fa-check text-success"></i>
                      <span className="small">Admin dashboard</span>
                    </div>
                    <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                      <i className="fas fa-check text-success"></i>
                      <span className="small">API access</span>
                    </div>
                  </div>

                  <Link to="/contact" className="btn btn-outline-secondary w-100 rounded-pill">
                    Contact Sales
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="row justify-content-center mt-5">
            <div className="col-lg-8">
              <div className="bg-light rounded-4 p-4">
                <h5 className="fw-bold text-center mb-4">Frequently Asked Questions</h5>
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="fw-semibold mb-2">Can I cancel anytime?</div>
                      <div className="text-muted small">Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="fw-semibold mb-2">Is there a free trial?</div>
                      <div className="text-muted small">Yes! You can try Pro features free for 14 days. No credit card required to start your trial.</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="fw-semibold mb-2">What payment methods do you accept?</div>
                      <div className="text-muted small">We accept all major credit cards, PayPal, and bank transfers for Enterprise customers.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER SECTION ===== */}
      <section className="py-5 bg-primary text-white">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="mb-4">
                <span className="badge bg-white text-primary px-3 py-2 rounded-pill">
                  <i className="fas fa-envelope me-2"></i>
                  Stay Connected
                </span>
              </div>
              <h2 className="display-5 fw-bold mb-3">
                Get the Latest <span className="text-warning">Educational Insights</span>
              </h2>
              <p className="lead mb-4">
                Join 10,000+ learners who receive weekly tips, course recommendations,
                and exclusive content to accelerate their learning journey.
              </p>
              <div className="row g-3 mb-4">
                <div className="col-6">
                  <div className="d-flex align-items-center gap-2">
                    <i className="fas fa-lightbulb text-warning"></i>
                    <span className="small">Learning Tips & Strategies</span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex align-items-center gap-2">
                    <i className="fas fa-book text-warning"></i>
                    <span className="small">New Course Announcements</span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex align-items-center gap-2">
                    <i className="fas fa-chart-line text-warning"></i>
                    <span className="small">Exclusive Study Resources</span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex align-items-center gap-2">
                    <i className="fas fa-users text-warning"></i>
                    <span className="small">Community Updates</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="bg-white text-dark rounded-4 p-4 shadow-lg">
                <div className="mb-4">
                  <input
                    type="email"
                    className="form-control form-control-lg rounded-pill border-0 bg-light"
                    placeholder="Enter your email address"
                  />
                </div>
                <button className="btn btn-primary btn-lg w-100 rounded-pill mb-3">
                  <i className="fas fa-paper-plane me-2"></i>
                  Subscribe Now
                </button>
                <div className="text-center text-muted small mb-4">
                  <i className="fas fa-shield-alt me-2"></i>
                  We respect your privacy. Unsubscribe at any time.
                </div>
                <div className="row text-center g-3">
                  <div className="col-4">
                    <div className="h4 fw-bold text-primary mb-1">10,000+</div>
                    <div className="text-muted small">Subscribers</div>
                  </div>
                  <div className="col-4">
                    <div className="h4 fw-bold text-success mb-1">95%</div>
                    <div className="text-muted small">Open Rate</div>
                  </div>
                  <div className="col-4">
                    <div className="h4 fw-bold text-warning mb-1">Weekly</div>
                    <div className="text-muted small">Updates</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== COURSE RECOMMENDATIONS ===== */}
      {isAuthenticated && (
        <section className="py-5 bg-light">
          <div className="container">
            <CourseRecommendations maxCourses={6} showTitle={true} />
          </div>
        </section>
      )}

      {/* ===== FINAL CTA SECTION ===== */}
      <section className="py-5 bg-gradient" style={{ background: 'linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-secondary) 100%)' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h2 className="display-4 fw-bold text-white mb-3">
                Ready to Transform Your
                <span className="text-warning"> Learning Journey?</span>
              </h2>
              <p className="lead text-white-50 mb-4">
                Join thousands of students who are already experiencing the future of education.
                Start learning today and unlock your full potential.
              </p>
              <div className="d-flex gap-3 flex-wrap mb-4">
                <div className="d-flex align-items-center gap-2 text-white-50">
                  <i className="fas fa-check text-success"></i>
                  <span>Free to get started</span>
                </div>
                <div className="d-flex align-items-center gap-2 text-white-50">
                  <i className="fas fa-check text-success"></i>
                  <span>No credit card required</span>
                </div>
                <div className="d-flex align-items-center gap-2 text-white-50">
                  <i className="fas fa-check text-success"></i>
                  <span>Cancel anytime</span>
                </div>
              </div>

              {isAuthenticated ? (
                <div className="d-flex gap-3 flex-wrap">
                  <Link to="/courses" className="btn btn-warning btn-lg px-4 py-3 rounded-pill">
                    <i className="fas fa-rocket me-2"></i>
                    Explore Courses
                  </Link>
                  <Link to="/dashboard" className="btn btn-outline-light btn-lg px-4 py-3 rounded-pill">
                    <i className="fas fa-tachometer-alt me-2"></i>
                    My Dashboard
                  </Link>
                </div>
              ) : (
                <div className="d-flex gap-3 flex-wrap">
                  <Link to="/register" className="btn btn-warning btn-lg px-4 py-3 rounded-pill">
                    <i className="fas fa-user-plus me-2"></i>
                    Start Learning Free
                  </Link>
                  <Link to="/login" className="btn btn-outline-light btn-lg px-4 py-3 rounded-pill">
                    <i className="fas fa-sign-in-alt me-2"></i>
                    Sign In
                  </Link>
                </div>
              )}
            </div>

            <div className="col-lg-4 text-center">
              <div className="bg-white bg-opacity-10 rounded-4 p-4 backdrop-blur">
                <div className="d-flex justify-content-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="fas fa-star text-warning"></i>
                  ))}
                </div>
                <div className="text-white-50 small mb-3">Trusted by 10,000+ students worldwide</div>
                <div className="row g-3 text-center">
                  <div className="col-4">
                    <div className="h4 fw-bold text-white mb-1">4.9</div>
                    <div className="text-white-50 small">Rating</div>
                  </div>
                  <div className="col-4">
                    <div className="h4 fw-bold text-white mb-1">95%</div>
                    <div className="text-white-50 small">Success</div>
                  </div>
                  <div className="col-4">
                    <div className="h4 fw-bold text-white mb-1">24/7</div>
                    <div className="text-white-50 small">Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Onboarding Modal */}
      {showOnboarding && (
        <div className="onboarding-modal-overlay" onClick={() => setShowOnboarding(false)}>
          <div className="onboarding-modal" onClick={(e) => e.stopPropagation()}>
            <div className="onboarding-header">
              <h3>Welcome to OpenEdTex! 🎉</h3>
              <button
                className="onboarding-close"
                onClick={handleOnboardingClose}
                aria-label="Close onboarding"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="onboarding-content">
              <div className="onboarding-step">
                <div className="step-icon">
                  <i className="fas fa-user-plus"></i>
                </div>
                <div className="step-content">
                  <h4>Step 1: Create Your Profile</h4>
                  <p>Set up your learning goals and preferences to get personalized recommendations.</p>
                </div>
              </div>
              <div className="onboarding-step">
                <div className="step-icon">
                  <i className="fas fa-search"></i>
                </div>
                <div className="step-content">
                  <h4>Step 2: Explore Courses</h4>
                  <p>Browse our extensive library or let our AI suggest the perfect courses for you.</p>
                </div>
              </div>
              <div className="onboarding-step">
                <div className="step-icon">
                  <i className="fas fa-play"></i>
                </div>
                <div className="step-content">
                  <h4>Step 3: Start Learning</h4>
                  <p>Dive into interactive lessons and track your progress with detailed analytics.</p>
                </div>
              </div>
            </div>
            <div className="onboarding-actions">
              <button
                className="btn-modern btn-secondary-modern"
                onClick={handleOnboardingClose}
              >
                Skip Tour
              </button>
              <Link
                to="/register"
                className="btn-modern btn-primary-modern"
                onClick={handleOnboardingClose}
              >
                Get Started
                <i className="fas fa-arrow-right ms-2"></i>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          className="scroll-to-top-btn"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <i className="fas fa-arrow-up"></i>
        </button>
      )}
    </div>
  )
})

export default Home
