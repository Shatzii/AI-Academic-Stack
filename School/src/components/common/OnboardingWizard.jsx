import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useAuth } from '../../context/AuthContext.jsx'
import { fetchCourses, enrollInCourse } from '../../slices/coursesSlice'
import toast from 'react-hot-toast'

const OnboardingWizard = () => {
  const [step, setStep] = useState(1)
  const [selectedGrade, setSelectedGrade] = useState('')
  const [selectedCourses, setSelectedCourses] = useState([])
  const [completedSteps, setCompletedSteps] = useState([])

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useAuth()
  const { courses, loading } = useSelector(state => state.courses)

  useEffect(() => {
    dispatch(fetchCourses())
  }, [dispatch])

  const gradeLevels = [
    'Kindergarten', '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade',
    '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade', '11th Grade', '12th Grade'
  ]

  const handleGradeSelect = (grade) => {
    setSelectedGrade(grade)
    setCompletedSteps([...completedSteps, 1])
    setStep(2)
  }

  const handleCourseSelect = (courseId) => {
    if (selectedCourses.includes(courseId)) {
      setSelectedCourses(selectedCourses.filter(id => id !== courseId))
    } else {
      setSelectedCourses([...selectedCourses, courseId])
    }
  }

  const handleEnrollSelected = async () => {
    try {
      for (const courseId of selectedCourses) {
        await dispatch(enrollInCourse(courseId)).unwrap()
      }
      setCompletedSteps([...completedSteps, 2])
      setStep(3)
      toast.success(`Successfully enrolled in ${selectedCourses.length} course${selectedCourses.length > 1 ? 's' : ''}!`)
    } catch (error) {
      toast.error('Failed to enroll in some courses')
    }
  }

  const handleCompleteOnboarding = () => {
    setCompletedSteps([...completedSteps, 3])
    toast.success('Welcome to OpenEdTex! Your learning journey begins now.')
    navigate('/dashboard')
  }

  const skipOnboarding = () => {
    navigate('/courses')
  }

  // Filter courses based on selected grade
  const recommendedCourses = courses?.filter(course =>
    !selectedGrade || course.grade_level === selectedGrade
  ).slice(0, 6) || []

  const totalSteps = 3
  const progress = (completedSteps.length / totalSteps) * 100

  return (
    <div className="onboarding-wizard">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10">
            <div className="card shadow-lg border-0">
              <div className="card-body p-5">
                {/* Header */}
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-primary mb-3">
                    <i className="fas fa-magic me-2"></i>
                    Welcome to OpenEdTex!
                  </h2>
                  <p className="text-muted mb-4">
                    Let's personalize your learning experience in just a few steps
                  </p>

                  {/* Progress Bar */}
                  <div className="progress mb-4" style={{ height: '8px' }}>
                    <div
                      className="progress-bar bg-success"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>

                  <div className="d-flex justify-content-between mb-4">
                    <small className={completedSteps.includes(1) ? 'text-success fw-semibold' : step === 1 ? 'text-primary fw-semibold' : 'text-muted'}>
                      <i className={`fas ${completedSteps.includes(1) ? 'fa-check-circle' : 'fa-circle'} me-1`}></i>
                      Grade Level
                    </small>
                    <small className={completedSteps.includes(2) ? 'text-success fw-semibold' : step === 2 ? 'text-primary fw-semibold' : 'text-muted'}>
                      <i className={`fas ${completedSteps.includes(2) ? 'fa-check-circle' : 'fa-circle'} me-1`}></i>
                      Choose Courses
                    </small>
                    <small className={completedSteps.includes(3) ? 'text-success fw-semibold' : step === 3 ? 'text-primary fw-semibold' : 'text-muted'}>
                      <i className={`fas ${completedSteps.includes(3) ? 'fa-check-circle' : 'fa-circle'} me-1`}></i>
                      Get Started
                    </small>
                  </div>
                </div>

                {/* Step 1: Grade Level Selection */}
                {step === 1 && (
                  <div className="step-content">
                    <h4 className="mb-4 text-center">
                      <i className="fas fa-school text-primary me-2"></i>
                      What grade are you in?
                    </h4>
                    <p className="text-muted text-center mb-4">
                      This helps us recommend the most relevant courses for you
                    </p>

                    <div className="grade-selection">
                      <div className="row g-3">
                        {gradeLevels.map((grade, index) => (
                          <div key={index} className="col-md-4 col-sm-6">
                            <button
                              type="button"
                              className="btn btn-outline-primary w-100 p-3"
                              onClick={() => handleGradeSelect(grade)}
                            >
                              <i className="fas fa-graduation-cap me-2"></i>
                              {grade}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="text-center mt-4">
                      <button
                        type="button"
                        className="btn btn-link text-decoration-none"
                        onClick={skipOnboarding}
                      >
                        Skip for now
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Course Selection */}
                {step === 2 && (
                  <div className="step-content">
                    <h4 className="mb-4 text-center">
                      <i className="fas fa-book text-primary me-2"></i>
                      Choose Your First Courses
                    </h4>
                    <p className="text-muted text-center mb-4">
                      Select courses that interest you. You can always add more later!
                    </p>

                    {loading ? (
                      <div className="text-center py-4">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading courses...</span>
                        </div>
                        <p className="mt-2">Finding great courses for you...</p>
                      </div>
                    ) : (
                      <div className="course-selection">
                        <div className="row g-3">
                          {recommendedCourses.map(course => (
                            <div key={course.id} className="col-md-6">
                              <div
                                className={`course-card-select card h-100 border-2 ${
                                  selectedCourses.includes(course.id)
                                    ? 'border-primary bg-light'
                                    : 'border-light'
                                }`}
                                onClick={() => handleCourseSelect(course.id)}
                                style={{ cursor: 'pointer' }}
                              >
                                <div className="card-body p-3">
                                  <div className="d-flex align-items-start">
                                    <div className="flex-grow-1">
                                      <h6 className="card-title mb-2">{course.title}</h6>
                                      <p className="card-text small text-muted mb-2">
                                        {course.description.length > 80
                                          ? `${course.description.substring(0, 80)}...`
                                          : course.description
                                        }
                                      </p>
                                      <div className="d-flex align-items-center">
                                        <span className="badge bg-secondary me-2">{course.subject}</span>
                                        <small className="text-muted">
                                          <i className="fas fa-users me-1"></i>
                                          {course.enrolled_count || 0} students
                                        </small>
                                      </div>
                                    </div>
                                    <div className="ms-2">
                                      <div className={`selection-indicator ${
                                        selectedCourses.includes(course.id)
                                          ? 'selected'
                                          : ''
                                      }`}>
                                        <i className={`fas ${
                                          selectedCourses.includes(course.id)
                                            ? 'fa-check-circle text-primary'
                                            : 'fa-circle text-muted'
                                        }`}></i>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {recommendedCourses.length === 0 && (
                          <div className="text-center py-4">
                            <i className="fas fa-search fa-3x text-muted mb-3"></i>
                            <p className="text-muted">No courses found for your grade level.</p>
                            <button
                              type="button"
                              className="btn btn-outline-primary"
                              onClick={() => navigate('/courses')}
                            >
                              Browse All Courses
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="d-flex justify-content-between mt-4">
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setStep(1)}
                      >
                        <i className="fas fa-arrow-left me-2"></i>
                        Back
                      </button>

                      <div>
                        {selectedCourses.length > 0 && (
                          <button
                            type="button"
                            className="btn btn-primary me-2"
                            onClick={handleEnrollSelected}
                          >
                            <i className="fas fa-plus me-2"></i>
                            Enroll in {selectedCourses.length} Course{selectedCourses.length > 1 ? 's' : ''}
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn btn-link text-decoration-none"
                          onClick={skipOnboarding}
                        >
                          Skip for now
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Welcome & Next Steps */}
                {step === 3 && (
                  <div className="step-content">
                    <div className="text-center mb-4">
                      <div className="success-icon mb-3">
                        <i className="fas fa-check-circle fa-4x text-success"></i>
                      </div>
                      <h4 className="mb-3">
                        <i className="fas fa-rocket text-primary me-2"></i>
                        You're All Set!
                      </h4>
                      <p className="text-muted mb-4">
                        Welcome to OpenEdTex! Your learning journey is about to begin.
                      </p>
                    </div>

                    <div className="row g-3 mb-4">
                      <div className="col-md-4">
                        <div className="card bg-light border-0 text-center p-3">
                          <div className="card-body">
                            <i className="fas fa-book fa-2x text-primary mb-2"></i>
                            <h6 className="card-title">Access Your Courses</h6>
                            <p className="card-text small">Start learning from your enrolled courses</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="card bg-light border-0 text-center p-3">
                          <div className="card-body">
                            <i className="fas fa-brain fa-2x text-info mb-2"></i>
                            <h6 className="card-title">AI Assistant</h6>
                            <p className="card-text small">Get help from our AI learning assistant</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="card bg-light border-0 text-center p-3">
                          <div className="card-body">
                            <i className="fas fa-users fa-2x text-success mb-2"></i>
                            <h6 className="card-title">Join Classrooms</h6>
                            <p className="card-text small">Connect with teachers and classmates</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-center gap-3">
                      <button
                        type="button"
                        className="btn btn-primary btn-lg"
                        onClick={handleCompleteOnboarding}
                      >
                        <i className="fas fa-play me-2"></i>
                        Start Learning
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-lg"
                        onClick={() => navigate('/dashboard')}
                      >
                        <i className="fas fa-tachometer-alt me-2"></i>
                        Go to Dashboard
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .course-card-select:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          transition: all 0.2s ease;
        }

        .selection-indicator {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .onboarding-wizard {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem 0;
        }

        .onboarding-wizard .card {
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.95);
        }
      `}</style>
    </div>
  )
}

export default OnboardingWizard
