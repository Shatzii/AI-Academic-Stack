import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchCourses, enrollInCourse } from '../../slices/coursesSlice'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const CoursesList = () => {
  const dispatch = useDispatch()
  const { user } = useAuth()
  const { courses, loading, error } = useSelector(state => state.courses)

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedGrade, setSelectedGrade] = useState('')
  const [beginnerMode, setBeginnerMode] = useState(true) // Start in beginner mode
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    dispatch(fetchCourses())
  }, [dispatch])

  const handleEnroll = async (courseId) => {
    try {
      await dispatch(enrollInCourse(courseId)).unwrap()
      toast.success('Successfully enrolled in course!')
      dispatch(fetchCourses()) // Refresh the courses list
    } catch (error) {
      toast.error('Failed to enroll in course')
    }
  }

  // Filter courses based on search and filters
  const filteredCourses = courses?.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.subject.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSubject = !selectedSubject || course.subject === selectedSubject
    const matchesGrade = !selectedGrade || course.grade_level === selectedGrade

    return matchesSearch && matchesSubject && matchesGrade
  }) || []

  // Get unique subjects and grade levels for filters
  const subjects = [...new Set(courses?.map(course => course.subject) || [])]
  const gradeLevels = [...new Set(courses?.map(course => course.grade_level) || [])]

  const isEnrolled = (courseId) => {
    return courses?.find(course => course.id === courseId)?.is_enrolled || false
  }

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading courses...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          Error loading courses: {error}
        </div>
      </div>
    )
  }

  return (
    <div className="courses-list-page">
      <div className="container-fluid">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h1 className="display-5 fw-bold mb-2">
                  <i className="fas fa-book text-primary me-3"></i>
                  Courses
                </h1>
                <p className="text-muted mb-0">
                  {beginnerMode
                    ? "Discover courses perfect for you"
                    : "Discover and enroll in courses to enhance your learning journey"
                  }
                </p>
              </div>
              <div className="d-flex align-items-center gap-2">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="beginnerMode"
                    checked={beginnerMode}
                    onChange={(e) => setBeginnerMode(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="beginnerMode">
                    <small className="text-muted">Beginner Mode</small>
                  </label>
                </div>
                {user?.role === 'teacher' && (
                  <button className="btn btn-primary btn-lg" disabled>
                    <i className="fas fa-plus me-2"></i>
                    Create Course (Coming Soon)
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">
                    <i className="fas fa-search me-2"></i>
                    {beginnerMode ? "Quick Search" : "Search & Filter"}
                  </h5>
                  {!beginnerMode && (
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      <i className={`fas ${showFilters ? 'fa-chevron-up' : 'fa-chevron-down'} me-2`}></i>
                      {showFilters ? 'Hide' : 'Show'} Filters
                    </button>
                  )}
                </div>

                <div className="row g-3">
                  <div className="col-lg-4">
                    <div className="search-box">
                      <i className="fas fa-search search-icon"></i>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="Search courses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  {(!beginnerMode || showFilters) && (
                    <>
                      <div className="col-lg-4">
                        <select
                          className="form-select form-select-lg"
                          value={selectedSubject}
                          onChange={(e) => setSelectedSubject(e.target.value)}
                        >
                          <option value="">All Subjects</option>
                          {subjects.map((subject, index) => (
                            <option key={index} value={subject}>{subject}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-lg-4">
                        <select
                          className="form-select form-select-lg"
                          value={selectedGrade}
                          onChange={(e) => setSelectedGrade(e.target.value)}
                        >
                          <option value="">All Grade Levels</option>
                          {gradeLevels.map((grade, index) => (
                            <option key={index} value={grade}>{grade}</option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}

                  {beginnerMode && !showFilters && (
                    <div className="col-lg-8">
                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => setSelectedGrade(user?.grade_level || '')}
                        >
                          <i className="fas fa-school me-2"></i>
                          My Grade
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-success btn-sm"
                          onClick={() => setSearchTerm('popular')}
                        >
                          <i className="fas fa-star me-2"></i>
                          Popular
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-info btn-sm"
                          onClick={() => setSearchTerm('new')}
                        >
                          <i className="fas fa-clock me-2"></i>
                          New
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="row">
          {filteredCourses.length > 0 ? (
            filteredCourses.map(course => (
              beginnerMode ? (
                // Simplified Beginner Mode Card
                <div key={course.id} className="col-lg-6 col-md-6 mb-4">
                  <div className="card course-card-simple h-100 border-0 shadow-sm hover-lift">
                    <div className="card-body p-4 text-center">
                      <div className="course-icon mb-3">
                        <i className="fas fa-book fa-3x text-primary"></i>
                      </div>
                      <h5 className="card-title fw-bold mb-3">{course.title}</h5>
                      <p className="card-text text-muted mb-3">
                        {course.description.length > 100
                          ? `${course.description.substring(0, 100)}...`
                          : course.description
                        }
                      </p>

                      <div className="d-flex justify-content-center gap-2 mb-3">
                        <span className="badge bg-primary">{course.subject}</span>
                        <span className="badge bg-secondary">{course.grade_level}</span>
                      </div>

                      <div className="course-actions">
                        <div className="row g-2">
                          <div className="col-6">
                            <Link
                              to={`/courses/${course.id}`}
                              className="btn btn-outline-primary w-100"
                            >
                              <i className="fas fa-eye me-1"></i>
                              Preview
                            </Link>
                          </div>
                          <div className="col-6">
                            {isEnrolled(course.id) ? (
                              <span className="btn btn-success w-100 disabled">
                                <i className="fas fa-check me-1"></i>
                                Enrolled
                              </span>
                            ) : (
                              <button
                                className="btn btn-primary w-100"
                                onClick={() => handleEnroll(course.id)}
                              >
                                <i className="fas fa-plus me-1"></i>
                                Enroll
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Advanced Mode Card (original)
                <div key={course.id} className="col-lg-4 col-md-6 mb-4">
                  <div className="card course-card h-100 border-0 shadow-sm hover-lift">
                    <div className="card-header bg-white border-0 pt-4 pb-0">
                      <div className="course-badge">
                        <span className="badge bg-primary">{course.subject}</span>
                        <span className="badge bg-secondary ms-1">{course.grade_level}</span>
                      </div>
                    </div>
                    <div className="card-body pb-3">
                      <h5 className="card-title fw-bold mb-3">{course.title}</h5>
                      <p className="card-text text-muted mb-3">
                        {course.description.length > 120
                          ? `${course.description.substring(0, 120)}...`
                          : course.description
                        }
                      </p>

                      <div className="course-meta mb-3">
                        <div className="meta-item">
                          <i className="fas fa-chalkboard-teacher text-primary me-2"></i>
                          <span className="small">{course.teacher_name || 'TBD'}</span>
                        </div>
                        <div className="meta-item">
                          <i className="fas fa-users text-success me-2"></i>
                          <span className="small">{course.enrolled_count || 0} students</span>
                        </div>
                        <div className="meta-item">
                          <i className="fas fa-clock text-info me-2"></i>
                          <span className="small">{course.duration || 'TBD'}</span>
                        </div>
                      </div>

                      {course.teks_standards && course.teks_standards.length > 0 && (
                        <div className="teks-tags mb-3">
                          <small className="text-muted d-block mb-2">TEKS Standards:</small>
                          <div className="d-flex flex-wrap gap-1">
                            {course.teks_standards.slice(0, 3).map((standard, index) => (
                              <span key={index} className="badge bg-light text-dark small">
                                {standard}
                              </span>
                            ))}
                            {course.teks_standards.length > 3 && (
                              <span className="badge bg-light text-dark small">
                                +{course.teks_standards.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="card-footer bg-white border-0 pt-0">
                      <div className="d-flex justify-content-between align-items-center">
                        <Link
                          to={`/courses/${course.id}`}
                          className="btn btn-outline-primary"
                        >
                          <i className="fas fa-eye me-2"></i>
                          View Details
                        </Link>
                        {isEnrolled(course.id) ? (
                          <span className="text-success fw-semibold">
                            <i className="fas fa-check me-2"></i>
                            Enrolled
                          </span>
                        ) : (
                          <button
                            className="btn btn-primary"
                            onClick={() => handleEnroll(course.id)}
                          >
                            <i className="fas fa-plus me-2"></i>
                            Enroll
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            ))
          ) : (
            <div className="col-12">
              <div className="text-center py-5">
                <i className="fas fa-search fa-4x text-muted mb-4"></i>
                <h4 className="text-muted mb-3">No courses found</h4>
                <p className="text-muted mb-4">
                  Try adjusting your search criteria or browse all courses
                </p>
                <button
                  className="btn btn-outline-primary"
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedSubject('')
                    setSelectedGrade('')
                  }}
                >
                  <i className="fas fa-undo me-2"></i>
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Load More */}
        {filteredCourses.length > 0 && filteredCourses.length >= 12 && (
          <div className="row">
            <div className="col-12 text-center mt-4">
              <button className="btn btn-outline-primary btn-lg">
                <i className="fas fa-plus me-2"></i>
                Load More Courses
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CoursesList
