import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useBranding } from '../../context/BrandingContext.jsx'
import CourseRecommendations from './CourseRecommendations'

const Home = () => {
  const { isAuthenticated } = useAuth()
  const { branding } = useBranding()
  const [isVisible, setIsVisible] = useState(false)
  const [animatedStats, setAnimatedStats] = useState({
    students: 0,
    courses: 0,
    instructors: 0,
    completion: 0
  })

  useEffect(() => {
    setIsVisible(true)

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

    const timer = setTimeout(animateStats, 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="home-page">
      {/* Modern Hero Section */}
      <section className="hero-section-modern">
        <div className="hero-background">
          <div className="gradient-overlay"></div>
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
            <div className="shape shape-4"></div>
          </div>
        </div>

        <div className="container">
          <div className="row align-items-center min-vh-100">
            <div className="col-lg-7">
              <div className={`hero-content ${isVisible ? 'animate-in' : ''}`}>
                <div className="hero-badge">
                  <span className="badge-modern">
                    <i className="fas fa-sparkles me-2"></i>
                    AI-Powered Learning Platform
                  </span>
                </div>

                <h1 className="hero-title">
                  Transform Your
                  <span className="gradient-text"> Learning Experience</span>
                  <br />
                  with <span className="brand-highlight">OpenEdTex</span>
                </h1>

                <p className="hero-subtitle">
                  Experience the future of education with our cutting-edge AI-powered platform.
                  Interactive courses, real-time collaboration, and personalized learning paths
                  designed for the modern student.
                </p>

                <div className="hero-features">
                  <div className="feature-item">
                    <i className="fas fa-brain"></i>
                    <span>AI Tutor</span>
                  </div>
                  <div className="feature-item">
                    <i className="fas fa-users"></i>
                    <span>Live Classes</span>
                  </div>
                  <div className="feature-item">
                    <i className="fas fa-chart-line"></i>
                    <span>Analytics</span>
                  </div>
                  <div className="feature-item">
                    <i className="fas fa-mobile-alt"></i>
                    <span>Mobile Ready</span>
                  </div>
                </div>

                <div className="hero-actions">
                  {isAuthenticated ? (
                    <>
                      <Link to="/courses" className="btn-modern btn-primary-modern">
                        <i className="fas fa-book me-2"></i>
                        Explore Courses
                        <div className="btn-glow"></div>
                      </Link>
                      <Link to="/dashboard" className="btn-modern btn-secondary-modern">
                        <i className="fas fa-tachometer-alt me-2"></i>
                        My Dashboard
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/register" className="btn-modern btn-primary-modern">
                        <i className="fas fa-rocket me-2"></i>
                        Start Learning Free
                        <div className="btn-glow"></div>
                      </Link>
                      <Link to="/login" className="btn-modern btn-ghost-modern">
                        <i className="fas fa-sign-in-alt me-2"></i>
                        Sign In
                      </Link>
                    </>
                  )}
                </div>

                <div className="hero-stats">
                  <div className="stat-item-modern">
                    <span className="stat-number">{animatedStats.students.toLocaleString()}+</span>
                    <span className="stat-label">Students</span>
                  </div>
                  <div className="stat-item-modern">
                    <span className="stat-number">{animatedStats.courses}+</span>
                    <span className="stat-label">Courses</span>
                  </div>
                  <div className="stat-item-modern">
                    <span className="stat-number">{animatedStats.completion}%</span>
                    <span className="stat-label">Success Rate</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-5">
              <div className={`hero-visual ${isVisible ? 'animate-in-delay' : ''}`}>
                <div className="dashboard-preview">
                  <div className="preview-header">
                    <div className="preview-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <div className="preview-title">OpenEdTex Dashboard</div>
                  </div>
                  <div className="preview-content">
                    <div className="preview-card">
                      <div className="card-icon">
                        <i className="fas fa-brain"></i>
                      </div>
                      <div className="card-content">
                        <h4>AI Study Assistant</h4>
                        <p>Get instant help with any subject</p>
                      </div>
                    </div>
                    <div className="preview-card">
                      <div className="card-icon">
                        <i className="fas fa-users"></i>
                      </div>
                      <div className="card-content">
                        <h4>Live Classroom</h4>
                        <p>Interactive learning sessions</p>
                      </div>
                    </div>
                    <div className="preview-progress">
                      <div className="progress-bar-modern">
                        <div className="progress-fill" style={{width: '75%'}}></div>
                      </div>
                      <span>Course Progress: 75%</span>
                    </div>
                  </div>
                </div>

                <div className="floating-elements">
                  <div className="floating-card card-1">
                    <i className="fas fa-star"></i>
                    <span>4.9/5 Rating</span>
                  </div>
                  <div className="floating-card card-2">
                    <i className="fas fa-certificate"></i>
                    <span>Certified</span>
                  </div>
                  <div className="floating-card card-3">
                    <i className="fas fa-shield-alt"></i>
                    <span>Secure</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="scroll-indicator">
          <div className="scroll-mouse">
            <div className="scroll-wheel"></div>
          </div>
          <span>Scroll to explore</span>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section-modern">
        <div className="container">
          <div className="section-header-modern text-center">
            <div className="section-badge">
              <i className="fas fa-bolt"></i>
              <span>Powerful Features</span>
            </div>
            <h2 className="section-title-modern">
              Everything You Need to
              <span className="gradient-text"> Succeed</span>
            </h2>
            <p className="section-subtitle-modern">
              Our comprehensive platform combines cutting-edge technology with proven educational methods
              to deliver an unparalleled learning experience.
            </p>
          </div>

          <div className="features-grid-modern">
            <div className="feature-card-modern">
              <div className="feature-icon-modern">
                <i className="fas fa-brain"></i>
                <div className="icon-glow"></div>
              </div>
              <h3>AI Study Assistant</h3>
              <p>Get instant help with complex topics, personalized explanations, and 24/7 academic support powered by advanced AI.</p>
              <div className="feature-tags">
                <span className="tag">AI-Powered</span>
                <span className="tag">24/7 Support</span>
              </div>
            </div>

            <div className="feature-card-modern">
              <div className="feature-icon-modern">
                <i className="fas fa-users"></i>
                <div className="icon-glow"></div>
              </div>
              <h3>Interactive Classrooms</h3>
              <p>Join live sessions with instructors and peers. Participate in discussions, collaborative projects, and real-time Q&A.</p>
              <div className="feature-tags">
                <span className="tag">Live Sessions</span>
                <span className="tag">Collaboration</span>
              </div>
            </div>

            <div className="feature-card-modern">
              <div className="feature-icon-modern">
                <i className="fas fa-chart-line"></i>
                <div className="icon-glow"></div>
              </div>
              <h3>Advanced Analytics</h3>
              <p>Track your progress with detailed analytics, performance insights, and personalized recommendations for improvement.</p>
              <div className="feature-tags">
                <span className="tag">Progress Tracking</span>
                <span className="tag">Insights</span>
              </div>
            </div>

            <div className="feature-card-modern">
              <div className="feature-icon-modern">
                <i className="fas fa-book"></i>
                <div className="icon-glow"></div>
              </div>
              <h3>Rich Course Content</h3>
              <p>Access comprehensive courses with multimedia content, interactive exercises, and TEKS-aligned learning objectives.</p>
              <div className="feature-tags">
                <span className="tag">Multimedia</span>
                <span className="tag">TEKS-Aligned</span>
              </div>
            </div>

            <div className="feature-card-modern">
              <div className="feature-icon-modern">
                <i className="fas fa-mobile-alt"></i>
                <div className="icon-glow"></div>
              </div>
              <h3>Mobile Learning</h3>
              <p>Learn anywhere, anytime with our fully responsive mobile app. Download courses and study offline when convenient.</p>
              <div className="feature-tags">
                <span className="tag">Mobile App</span>
                <span className="tag">Offline Access</span>
              </div>
            </div>

            <div className="feature-card-modern">
              <div className="feature-icon-modern">
                <i className="fas fa-shield-alt"></i>
                <div className="icon-glow"></div>
              </div>
              <h3>Enterprise Security</h3>
              <p>Your data is protected with bank-level security, GDPR compliance, and advanced encryption technologies.</p>
              <div className="feature-tags">
                <span className="tag">Secure</span>
                <span className="tag">GDPR Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section-modern">
        <div className="container">
          <div className="stats-header text-center">
            <h2 className="stats-title">
              Trusted by <span className="gradient-text">Learners Worldwide</span>
            </h2>
            <p className="stats-subtitle">
              Join a growing community of successful students and educators
            </p>
          </div>

          <div className="stats-grid-modern">
            <div className="stat-card-modern">
              <div className="stat-icon-modern">
                <i className="fas fa-users"></i>
              </div>
              <div className="stat-content-modern">
                <div className="stat-number-modern">{animatedStats.students.toLocaleString()}+</div>
                <div className="stat-label-modern">Active Students</div>
                <div className="stat-description">Learning and growing every day</div>
              </div>
            </div>

            <div className="stat-card-modern">
              <div className="stat-icon-modern">
                <i className="fas fa-book"></i>
              </div>
              <div className="stat-content-modern">
                <div className="stat-number-modern">{animatedStats.courses}+</div>
                <div className="stat-label-modern">Courses Available</div>
                <div className="stat-description">Comprehensive learning paths</div>
              </div>
            </div>

            <div className="stat-card-modern">
              <div className="stat-icon-modern">
                <i className="fas fa-chalkboard-teacher"></i>
              </div>
              <div className="stat-content-modern">
                <div className="stat-number-modern">{animatedStats.instructors}+</div>
                <div className="stat-label-modern">Expert Instructors</div>
                <div className="stat-description">Industry-leading educators</div>
              </div>
            </div>

            <div className="stat-card-modern">
              <div className="stat-icon-modern">
                <i className="fas fa-trophy"></i>
              </div>
              <div className="stat-content-modern">
                <div className="stat-number-modern">{animatedStats.completion}%</div>
                <div className="stat-label-modern">Completion Rate</div>
                <div className="stat-description">Students who finish their courses</div>
              </div>
            </div>
          </div>

          <div className="stats-visual">
            <div className="achievement-badges">
              <div className="badge-item">
                <i className="fas fa-star"></i>
                <span>4.9/5 Rating</span>
              </div>
              <div className="badge-item">
                <i className="fas fa-certificate"></i>
                <span>Certified Platform</span>
              </div>
              <div className="badge-item">
                <i className="fas fa-shield-alt"></i>
                <span>GDPR Compliant</span>
              </div>
              <div className="badge-item">
                <i className="fas fa-mobile-alt"></i>
                <span>Mobile Optimized</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Recommendations Section - Only for authenticated users */}
      {isAuthenticated && (
        <section className="recommendations-section py-5">
          <div className="container">
            <CourseRecommendations maxCourses={6} showTitle={true} />
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="cta-section-modern">
        <div className="container">
          <div className="cta-content-modern">
            <div className="cta-text">
              <h2 className="cta-title">
                Ready to Transform Your
                <span className="gradient-text"> Learning Journey?</span>
              </h2>
              <p className="cta-subtitle">
                Join thousands of students who are already experiencing the future of education.
                Start learning today and unlock your full potential.
              </p>
              <div className="cta-features">
                <div className="cta-feature">
                  <i className="fas fa-check"></i>
                  <span>Free to get started</span>
                </div>
                <div className="cta-feature">
                  <i className="fas fa-check"></i>
                  <span>No credit card required</span>
                </div>
                <div className="cta-feature">
                  <i className="fas fa-check"></i>
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>

            <div className="cta-actions">
              {isAuthenticated ? (
                <div className="cta-buttons-group">
                  <Link to="/courses" className="btn-modern btn-primary-modern btn-large">
                    <i className="fas fa-rocket me-2"></i>
                    Explore Courses
                    <div className="btn-glow"></div>
                  </Link>
                  <Link to="/dashboard" className="btn-modern btn-secondary-modern btn-large">
                    <i className="fas fa-tachometer-alt me-2"></i>
                    My Dashboard
                  </Link>
                </div>
              ) : (
                <div className="cta-buttons-group">
                  <Link to="/register" className="btn-modern btn-primary-modern btn-large">
                    <i className="fas fa-user-plus me-2"></i>
                    Start Learning Free
                    <div className="btn-glow"></div>
                  </Link>
                  <Link to="/login" className="btn-modern btn-ghost-modern btn-large">
                    <i className="fas fa-sign-in-alt me-2"></i>
                    Sign In
                  </Link>
                </div>
              )}

              <div className="cta-trust">
                <div className="trust-icons">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <span className="trust-text">Trusted by 10,000+ students worldwide</span>
              </div>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="cta-background">
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
