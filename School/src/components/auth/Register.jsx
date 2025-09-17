import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser } from '../../slices/authSlice'
// import { useBranding } from '../../context/BrandingContext.jsx' // Commented out - not used
import toast from 'react-hot-toast'

const Register = () => {
  const [step, setStep] = useState(1) // 1: Basic Info, 2: Role Details, 3: Advanced
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirm: '',
    role: 'student',
    grade_level: '',
    subjects: []
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [quickMode, setQuickMode] = useState(true) // Start in quick mode

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector(state => state.auth)
  // const { branding } = useBranding() // Commented out - not used

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    if (type === 'checkbox') {
      if (name === 'subjects') {
        const updatedSubjects = checked
          ? [...formData.subjects, value]
          : formData.subjects.filter(subject => subject !== value)
        setFormData({
          ...formData,
          subjects: updatedSubjects
        })
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }
  }

  const handleQuickSubmit = async (e) => {
    e.preventDefault()

    // Quick mode validation - minimal fields
    if (!formData.first_name || !formData.last_name || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields')
      return
    }

    if (formData.password !== formData.password_confirm) {
      toast.error('Passwords do not match')
      return
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long')
      return
    }

    try {
      // const result = await dispatch(registerUser({ // Commented out - not used
      await dispatch(registerUser({
        ...formData,
        grade_level: '', // Skip grade level in quick mode
        subjects: [] // Skip subjects in quick mode
      })).unwrap()
      toast.success('Welcome to OpenEdTex! Let&apos;s get you started with your first course.')
      navigate('/onboarding')
    } catch (error) {
      // Error is handled by the slice and displayed via toast
    }
  }

  const handleFullSubmit = async (e) => {
    e.preventDefault()

    // Full validation
    if (!formData.first_name || !formData.last_name || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields')
      return
    }

    if (formData.password !== formData.password_confirm) {
      toast.error('Passwords do not match')
      return
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long')
      return
    }

    if (formData.role === 'student' && !formData.grade_level) {
      toast.error('Please select your grade level')
      return
    }

    if (formData.role === 'teacher' && formData.subjects.length === 0) {
      toast.error('Please select at least one subject you teach')
      return
    }

    try {
      // const result = await dispatch(registerUser(formData)).unwrap() // Commented out - not used
      await dispatch(registerUser(formData)).unwrap()
      toast.success('Registration successful! Please check your email to verify your account.')
      navigate('/login')
    } catch (error) {
      // Error is handled by the slice and displayed via toast
    }
  }

  const nextStep = () => {
    if (step < 3) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const subjectOptions = [
    'Mathematics', 'English Language Arts', 'Science', 'Social Studies',
    'History', 'Geography', 'Physics', 'Chemistry', 'Biology',
    'Computer Science', 'Art', 'Music', 'Physical Education', 'Foreign Languages'
  ]

  const gradeLevels = [
    'Kindergarten', '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade',
    '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade', '11th Grade', '12th Grade'
  ]

  // Quick Mode Registration Form
  if (quickMode) {
    return (
      <div className="register-page">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-8">
              <div className="card shadow-lg border-0">
                <div className="card-body p-5">
                  <div className="text-center mb-4">
                    <h2 className="fw-bold text-primary">
                      <i className="fas fa-rocket me-2"></i>
                      Quick Start
                    </h2>
                    <p className="text-muted">Get started in under 2 minutes</p>
                  </div>

                  <form onSubmit={handleQuickSubmit}>
                    {/* Basic Information */}
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="first_name" className="form-label fw-semibold">
                          <i className="fas fa-user me-2"></i>First Name *
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          id="first_name"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleChange}
                          placeholder="Enter your first name"
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="last_name" className="form-label fw-semibold">
                          <i className="fas fa-user me-2"></i>Last Name *
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          id="last_name"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleChange}
                          placeholder="Enter your last name"
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="email" className="form-label fw-semibold">
                        <i className="fas fa-envelope me-2"></i>Email Address *
                      </label>
                      <input
                        type="email"
                        className="form-control form-control-lg"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email address"
                        required
                      />
                    </div>

                    {/* Password Fields */}
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="password" className="form-label fw-semibold">
                          <i className="fas fa-lock me-2"></i>Password *
                        </label>
                        <div className="input-group">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            className="form-control form-control-lg"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a password"
                            required
                          />
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                          </button>
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="password_confirm" className="form-label fw-semibold">
                          <i className="fas fa-lock me-2"></i>Confirm *
                        </label>
                        <div className="input-group">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            className="form-control form-control-lg"
                            id="password_confirm"
                            name="password_confirm"
                            value={formData.password_confirm}
                            onChange={handleChange}
                            placeholder="Confirm password"
                            required
                          />
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary btn-lg w-100 mb-3"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-rocket me-2"></i>
                          Start Learning Now
                        </>
                      )}
                    </button>
                  </form>

                  <div className="text-center mb-3">
                    <button
                      type="button"
                      className="btn btn-link text-decoration-none"
                      onClick={() => setQuickMode(false)}
                    >
                      <i className="fas fa-cog me-2"></i>
                      Advanced Registration
                    </button>
                  </div>

                  <div className="text-center">
                    <p className="mb-0">
                      Already have an account?{' '}
                      <Link to="/login" className="text-primary fw-semibold text-decoration-none">
                        Sign in here
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Full Registration Form (Multi-step)
  return (
    <div className="register-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10">
            <div className="card shadow-lg border-0">
              <div className="card-body p-5">
                {/* Progress Indicator */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2 className="fw-bold text-primary mb-0">
                      <i className="fas fa-user-plus me-2"></i>
                      Complete Registration
                    </h2>
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => setQuickMode(true)}
                    >
                      <i className="fas fa-fast-forward me-2"></i>
                      Quick Mode
                    </button>
                  </div>
                  <div className="progress" style={{ height: '8px' }}>
                    <div
                      className="progress-bar bg-primary"
                      style={{ width: `${(step / 3) * 100}%` }}
                    ></div>
                  </div>
                  <div className="d-flex justify-content-between mt-2">
                    <small className={step >= 1 ? 'text-primary fw-semibold' : 'text-muted'}>Basic Info</small>
                    <small className={step >= 2 ? 'text-primary fw-semibold' : 'text-muted'}>Role Details</small>
                    <small className={step >= 3 ? 'text-primary fw-semibold' : 'text-muted'}>Review</small>
                  </div>
                </div>

                <form onSubmit={handleFullSubmit}>
                  {/* Step 1: Basic Information */}
                  {step === 1 && (
                    <div>
                      <h4 className="mb-4">Step 1: Basic Information</h4>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label htmlFor="first_name" className="form-label fw-semibold">
                            <i className="fas fa-user me-2"></i>First Name *
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-lg"
                            id="first_name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            placeholder="Enter your first name"
                            required
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label htmlFor="last_name" className="form-label fw-semibold">
                            <i className="fas fa-user me-2"></i>Last Name *
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-lg"
                            id="last_name"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            placeholder="Enter your last name"
                            required
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label htmlFor="email" className="form-label fw-semibold">
                          <i className="fas fa-envelope me-2"></i>Email Address *
                        </label>
                        <input
                          type="email"
                          className="form-control form-control-lg"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter your email address"
                          required
                        />
                        <div className="form-text">
                          We&apos;ll send you a verification link to confirm your account
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label htmlFor="password" className="form-label fw-semibold">
                            <i className="fas fa-lock me-2"></i>Password *
                          </label>
                          <div className="input-group">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              className="form-control form-control-lg"
                              id="password"
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                              placeholder="Create a password"
                              required
                            />
                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </button>
                          </div>
                          <div className="form-text">
                            Must be at least 8 characters long
                          </div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <label htmlFor="password_confirm" className="form-label fw-semibold">
                            <i className="fas fa-lock me-2"></i>Confirm Password *
                          </label>
                          <div className="input-group">
                            <input
                              type={showConfirmPassword ? 'text' : 'password'}
                              className="form-control form-control-lg"
                              id="password_confirm"
                              name="password_confirm"
                              value={formData.password_confirm}
                              onChange={handleChange}
                              placeholder="Confirm your password"
                              required
                            />
                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Role Details */}
                  {step === 2 && (
                    <div>
                      <h4 className="mb-4">Step 2: Tell us about yourself</h4>

                      <div className="mb-4">
                        <label className="form-label fw-semibold">
                          <i className="fas fa-user-tag me-2"></i>I am a: *
                        </label>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-check form-check-inline">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="role"
                                id="student"
                                value="student"
                                checked={formData.role === 'student'}
                                onChange={handleChange}
                              />
                              <label className="form-check-label" htmlFor="student">
                                <i className="fas fa-graduation-cap me-2"></i>Student
                              </label>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-check form-check-inline">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="role"
                                id="teacher"
                                value="teacher"
                                checked={formData.role === 'teacher'}
                                onChange={handleChange}
                              />
                              <label className="form-check-label" htmlFor="teacher">
                                <i className="fas fa-chalkboard-teacher me-2"></i>Teacher
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      {formData.role === 'student' && (
                        <div className="mb-4">
                          <label htmlFor="grade_level" className="form-label fw-semibold">
                            <i className="fas fa-school me-2"></i>Grade Level *
                          </label>
                          <select
                            className="form-select form-select-lg"
                            id="grade_level"
                            name="grade_level"
                            value={formData.grade_level}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Select your grade level</option>
                            {gradeLevels.map((grade, index) => (
                              <option key={index} value={grade}>{grade}</option>
                            ))}
                          </select>
                        </div>
                      )}

                      {formData.role === 'teacher' && (
                        <div className="mb-4">
                          <label className="form-label fw-semibold">
                            <i className="fas fa-book me-2"></i>Subjects You Teach *
                          </label>
                          <div className="row">
                            {subjectOptions.map((subject, index) => (
                              <div key={index} className="col-md-6">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id={`subject-${index}`}
                                    name="subjects"
                                    value={subject}
                                    checked={formData.subjects.includes(subject)}
                                    onChange={handleChange}
                                  />
                                  <label className="form-check-label" htmlFor={`subject-${index}`}>
                                    {subject}
                                  </label>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 3: Review */}
                  {step === 3 && (
                    <div>
                      <h4 className="mb-4">Step 3: Review & Create Account</h4>

                      <div className="card bg-light mb-4">
                        <div className="card-body">
                          <h6 className="card-title">Account Information</h6>
                          <p className="mb-1"><strong>Name:</strong> {formData.first_name} {formData.last_name}</p>
                          <p className="mb-1"><strong>Email:</strong> {formData.email}</p>
                          <p className="mb-1"><strong>Role:</strong> {formData.role === 'student' ? 'Student' : 'Teacher'}</p>
                          {formData.role === 'student' && formData.grade_level && (
                            <p className="mb-1"><strong>Grade Level:</strong> {formData.grade_level}</p>
                          )}
                          {formData.role === 'teacher' && formData.subjects.length > 0 && (
                            <p className="mb-1"><strong>Subjects:</strong> {formData.subjects.join(', ')}</p>
                          )}
                        </div>
                      </div>

                      <div className="alert alert-info">
                        <i className="fas fa-info-circle me-2"></i>
                        By creating an account, you agree to our Terms of Service and Privacy Policy
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="d-flex justify-content-between mt-4">
                    {step > 1 && (
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={prevStep}
                      >
                        <i className="fas fa-arrow-left me-2"></i>
                        Previous
                      </button>
                    )}

                    {step < 3 ? (
                      <button
                        type="button"
                        className="btn btn-primary ms-auto"
                        onClick={nextStep}
                      >
                        Next
                        <i className="fas fa-arrow-right ms-2"></i>
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="btn btn-success ms-auto"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Creating Account...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-check me-2"></i>
                            Create Account
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </form>

                <div className="text-center mt-4">
                  <p className="mb-0">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary fw-semibold text-decoration-none">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
