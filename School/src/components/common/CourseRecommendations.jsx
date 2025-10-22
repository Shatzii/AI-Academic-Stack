import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchCourses, enrollInCourse } from '../../slices/coursesSlice'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const CourseRecommendations = ({ maxCourses = 6, showTitle = true }) => {
  const dispatch = useDispatch()
  const { user } = useAuth()
  const { courses, loading } = useSelector(state => state.courses)
  const [recommendations, setRecommendations] = useState([])
  const [recommendationReason, setRecommendationReason] = useState('')

  useEffect(() => {
    if (courses.length > 0 && user) {
      generateRecommendations()
    }
  }, [courses, user])

  const generateRecommendations = () => {
    let recommended = []
    let reason = ''

    // Priority 1: Grade-level matching courses
    if (user.grade_level) {
      const gradeMatches = courses.filter(course =>
        course.grade_level === user.grade_level &&
        course.status === 'published'
      )
      if (gradeMatches.length > 0) {
        recommended = [...recommended, ...gradeMatches.slice(0, 3)]
        reason = `Based on your ${user.grade_level} grade level`
      }
    }

    // Priority 2: Popular courses in user's subjects of interest
    if (recommended.length < maxCourses) {
      const popularCourses = courses
        .filter(course =>
          course.status === 'published' &&
          (course.enrolled_count > 5 || course.is_featured)
        )
        .sort((a, b) => (b.enrolled_count || 0) - (a.enrolled_count || 0))
        .slice(0, maxCourses - recommended.length)

      if (popularCourses.length > 0) {
        recommended = [...recommended, ...popularCourses]
        if (!reason) reason = 'Popular courses you might enjoy'
      }
    }

    // Priority 3: New courses
    if (recommended.length < maxCourses) {
      const newCourses = courses
        .filter(course => course.status === 'published')
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, maxCourses - recommended.length)

      if (newCourses.length > 0) {
        recommended = [...recommended, ...newCourses]
        if (!reason) reason = 'New courses to explore'
      }
    }

    // Remove duplicates and limit to maxCourses
    const uniqueRecommendations = recommended
      .filter((course, index, self) =>
        index === self.findIndex(c => c.id === course.id)
      )
      .slice(0, maxCourses)

    setRecommendations(uniqueRecommendations)
    setRecommendationReason(reason)
  }

  const handleEnroll = async (courseId) => {
    try {
      await dispatch(enrollInCourse(courseId)).unwrap()
      toast.success('Successfully enrolled in course!')

      // Refresh recommendations to remove enrolled course
      setRecommendations(prev => prev.filter(course => course.id !== courseId))
    } catch (error) {
      toast.error('Failed to enroll in course')
    }
  }

  const isEnrolled = (courseId) => {
    return courses?.find(course => course.id === courseId)?.is_enrolled || false
  }

  if (loading || recommendations.length === 0) {
    return null
  }

  return (
    <div className="course-recommendations mb-5">
      {showTitle && (
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold mb-1">
              <i className="fas fa-lightbulb text-warning me-2"></i>
              Recommended for You
            </h3>
            {recommendationReason && (
              <p className="text-muted small mb-0">{recommendationReason}</p>
            )}
          </div>
          <Link to="/courses" className="btn btn-outline-primary btn-sm">
            View All Courses
            <i className="fas fa-arrow-right ms-2"></i>
          </Link>
        </div>
      )}

      <div className="row g-3">
        {recommendations.map(course => (
          <div key={course.id} className="col-lg-4 col-md-6">
            <div className="card recommendation-card h-100 border-0 shadow-sm hover-lift">
              <div className="card-body p-3">
                <div className="d-flex align-items-start mb-2">
                  <div className="flex-grow-1">
                    <h6 className="card-title mb-1 fw-bold">{course.title}</h6>
                    <div className="course-badges mb-2">
                      <span className="badge bg-primary badge-sm me-1">{course.subject}</span>
                      <span className="badge bg-secondary badge-sm">{course.grade_level}</span>
                    </div>
                  </div>
                  {course.is_featured && (
                    <span className="badge bg-warning text-dark">
                      <i className="fas fa-star me-1"></i>
                      Featured
                    </span>
                  )}
                </div>

                <p className="card-text small text-muted mb-3">
                  {course.description.length > 80
                    ? `${course.description.substring(0, 80)}...`
                    : course.description
                  }
                </p>

                <div className="course-stats small text-muted mb-3">
                  <span className="me-3">
                    <i className="fas fa-users me-1"></i>
                    {course.enrolled_count || 0}
                  </span>
                  {course.average_rating && (
                    <span className="me-3">
                      <i className="fas fa-star text-warning me-1"></i>
                      {course.average_rating.toFixed(1)}
                    </span>
                  )}
                  {course.duration && (
                    <span>
                      <i className="fas fa-clock me-1"></i>
                      {course.duration}
                    </span>
                  )}
                </div>

                <div className="d-flex gap-2">
                  <Link
                    to={`/courses/${course.id}`}
                    className="btn btn-outline-primary btn-sm flex-grow-1"
                  >
                    <i className="fas fa-eye me-1"></i>
                    Preview
                  </Link>

                  {isEnrolled(course.id) ? (
                    <span className="btn btn-success btn-sm">
                      <i className="fas fa-check me-1"></i>
                      Enrolled
                    </span>
                  ) : (
                    <button
                      className="btn btn-primary btn-sm"
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
        ))}
      </div>

      <style jsx>{`
        .recommendation-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .recommendation-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
        }

        .badge-sm {
          font-size: 0.7rem;
          padding: 0.25rem 0.5rem;
        }

        .course-stats {
          border-top: 1px solid #f0f0f0;
          padding-top: 0.5rem;
        }
      `}</style>
    </div>
  )
}

export default CourseRecommendations
