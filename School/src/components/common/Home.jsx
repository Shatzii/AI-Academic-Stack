import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useBranding } from '../../context/BrandingContext.jsx'
import CourseRecommendations from './CourseRecommendations'

const Home = () => {
  const { isAuthenticated } = useAuth()
  const { branding } = useBranding()

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section bg-primary text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">
                <i className="fas fa-graduation-cap text-warning me-3"></i>
                Welcome to {branding?.school_name || 'OpenEdTex'}
              </h1>
              <p className="lead mb-4">
                Experience the future of education with our AI-powered learning platform.
                Interactive courses, real-time classrooms, and intelligent study assistance.
              </p>
              <div className="d-flex gap-3">
                {isAuthenticated ? (
                  <>
                    <Link to="/courses" className="btn btn-light btn-lg">
                      <i className="fas fa-book me-2"></i>Browse Courses
                    </Link>
                    <Link to="/dashboard" className="btn btn-outline-light btn-lg">
                      <i className="fas fa-tachometer-alt me-2"></i>Dashboard
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/register" className="btn btn-light btn-lg">
                      <i className="fas fa-user-plus me-2"></i>Get Started
                    </Link>
                    <Link to="/login" className="btn btn-outline-light btn-lg">
                      <i className="fas fa-sign-in-alt me-2"></i>Login
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="col-lg-6">
              <div className="hero-image">
                <div className="tech-stack-grid">
                  <div className="tech-item">
                    <i className="fab fa-react text-primary"></i>
                    <span>React</span>
                  </div>
                  <div className="tech-item">
                    <i className="fab fa-python text-warning"></i>
                    <span>Django</span>
                  </div>
                  <div className="tech-item">
                    <i className="fas fa-brain text-info"></i>
                    <span>OpenAI</span>
                  </div>
                  <div className="tech-item">
                    <i className="fas fa-users text-success"></i>
                    <span>Real-time</span>
                  </div>
                  <div className="tech-item">
                    <i className="fas fa-chart-line text-danger"></i>
                    <span>Analytics</span>
                  </div>
                  <div className="tech-item">
                    <i className="fab fa-docker text-primary"></i>
                    <span>Docker</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-5">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h2 className="display-5 fw-bold mb-3">Why Choose {branding?.school_name || 'OpenEdTex'}?</h2>
              <p className="lead text-muted">
                Discover the features that make learning more effective and engaging
              </p>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-lg-4 col-md-6">
              <div className="card feature-card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="feature-icon mb-3">
                    <i className="fas fa-brain fa-3x text-primary"></i>
                  </div>
                  <h5 className="card-title fw-bold">AI-Powered Learning</h5>
                  <p className="card-text text-muted">
                    Get personalized assistance from our AI tutor. Ask questions, get explanations,
                    and receive tailored study recommendations.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="card feature-card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="feature-icon mb-3">
                    <i className="fas fa-users fa-3x text-success"></i>
                  </div>
                  <h5 className="card-title fw-bold">Real-time Classrooms</h5>
                  <p className="card-text text-muted">
                    Join interactive classrooms with live chat, polls, and collaborative features.
                    Learn together in real-time.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="card feature-card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="feature-icon mb-3">
                    <i className="fas fa-chart-line fa-3x text-info"></i>
                  </div>
                  <h5 className="card-title fw-bold">Advanced Analytics</h5>
                  <p className="card-text text-muted">
                    Track your progress with detailed analytics. Understand your learning patterns
                    and optimize your study habits.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="card feature-card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="feature-icon mb-3">
                    <i className="fas fa-book fa-3x text-warning"></i>
                  </div>
                  <h5 className="card-title fw-bold">Rich Course Content</h5>
                  <p className="card-text text-muted">
                    Access comprehensive courses with multimedia content, interactive exercises,
                    and TEKS-aligned learning objectives.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="card feature-card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="feature-icon mb-3">
                    <i className="fas fa-mobile-alt fa-3x text-danger"></i>
                  </div>
                  <h5 className="card-title fw-bold">Mobile Friendly</h5>
                  <p className="card-text text-muted">
                    Learn anywhere, anytime with our responsive design. Access your courses
                    on any device with a consistent experience.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="card feature-card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="feature-icon mb-3">
                    <i className="fas fa-shield-alt fa-3x text-secondary"></i>
                  </div>
                  <h5 className="card-title fw-bold">Secure & Private</h5>
                  <p className="card-text text-muted">
                    Your data is protected with enterprise-grade security. Learn with confidence
                    knowing your information is safe.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section bg-light py-5">
        <div className="container">
          <div className="row text-center">
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="stat-item">
                <h3 className="display-4 fw-bold text-primary mb-2">1000+</h3>
                <p className="text-muted mb-0">Active Students</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="stat-item">
                <h3 className="display-4 fw-bold text-success mb-2">500+</h3>
                <p className="text-muted mb-0">Courses Available</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="stat-item">
                <h3 className="display-4 fw-bold text-info mb-2">50+</h3>
                <p className="text-muted mb-0">Expert Instructors</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="stat-item">
                <h3 className="display-4 fw-bold text-warning mb-2">95%</h3>
                <p className="text-muted mb-0">Completion Rate</p>
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
      <section className="cta-section bg-primary text-white py-5">
        <div className="container text-center">
          <h2 className="display-5 fw-bold mb-3">Ready to Start Learning?</h2>
          <p className="lead mb-4">
            Join thousands of students who are already transforming their learning experience
          </p>
          {isAuthenticated ? (
            <Link to="/courses" className="btn btn-light btn-lg">
              <i className="fas fa-rocket me-2"></i>Explore Courses
            </Link>
          ) : (
            <Link to="/register" className="btn btn-light btn-lg">
              <i className="fas fa-user-plus me-2"></i>Start Your Journey
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home
