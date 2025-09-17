import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import toast from 'react-hot-toast'

const AchievementNotifications = () => {
  const { user } = useAuth()
  const [shownNotifications, setShownNotifications] = useState(new Set())

  useEffect(() => {
    if (!user) return

    // Check for first enrollment milestone
    const checkFirstEnrollment = async () => {
      try {
        const response = await fetch('/api/courses/enrollments/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        })
        const enrollments = await response.json()

        if (enrollments.length === 1 && !shownNotifications.has('first-enrollment')) {
          setTimeout(() => {
            toast.success(
              <div className="celebration-toast">
                <div className="celebration-icon">
                  <i className="fas fa-rocket"></i>
                </div>
                <div className="celebration-content">
                  <h6 className="mb-1">🎉 First Course Enrolled!</h6>
                  <p className="mb-0 small">Welcome to your learning journey!</p>
                </div>
              </div>,
              {
                duration: 5000,
                style: {
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px'
                }
              }
            )
            setShownNotifications(prev => new Set([...prev, 'first-enrollment']))
          }, 2000) // Show after 2 seconds
        }
      } catch (error) {
        // Error checking enrollments
      }
    }

    // Check for ID card creation milestone
    const checkIdCardMilestone = async () => {
      try {
        // This would typically check if the user has an ID card
        // For now, we'll simulate this based on enrollment
        const hasIdCard = localStorage.getItem(`id_card_created_${user.id}`)

        if (!hasIdCard && !shownNotifications.has('id-card-created')) {
          // Simulate ID card creation after enrollment
          setTimeout(() => {
            toast.success(
              <div className="celebration-toast">
                <div className="celebration-icon">
                  <i className="fas fa-id-card"></i>
                </div>
                <div className="celebration-content">
                  <h6 className="mb-1">🆔 Student ID Created!</h6>
                  <p className="mb-0 small">Your digital student ID is ready!</p>
                </div>
              </div>,
              {
                duration: 6000,
                style: {
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px'
                }
              }
            )
            localStorage.setItem(`id_card_created_${user.id}`, 'true')
            setShownNotifications(prev => new Set([...prev, 'id-card-created']))
          }, 3000) // Show after 3 seconds
        }
      } catch (error) {
        // Error checking ID card
      }
    }

    // Check for course completion milestone
    const checkCourseCompletion = async () => {
      try {
        const response = await fetch('/api/courses/enrollments/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        })
        const enrollments = await response.json()

        const completedCourses = enrollments.filter(e => e.progress_percentage === 100)

        if (completedCourses.length === 1 && !shownNotifications.has('first-completion')) {
          setTimeout(() => {
            toast.success(
              <div className="celebration-toast">
                <div className="celebration-icon">
                  <i className="fas fa-trophy"></i>
                </div>
                <div className="celebration-content">
                  <h6 className="mb-1">🏆 First Course Completed!</h6>
                  <p className="mb-0 small">Amazing work! Keep it up!</p>
                </div>
              </div>,
              {
                duration: 7000,
                style: {
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px'
                }
              }
            )
            setShownNotifications(prev => new Set([...prev, 'first-completion']))
          }, 1000)
        }
      } catch (error) {
        // Error checking completions
      }
    }

    // Check for multiple enrollments milestone
    const checkMultipleEnrollments = async () => {
      try {
        const response = await fetch('/api/courses/enrollments/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        })
        const enrollments = await response.json()

        if (enrollments.length === 3 && !shownNotifications.has('three-enrollments')) {
          setTimeout(() => {
            toast.success(
              <div className="celebration-toast">
                <div className="celebration-icon">
                  <i className="fas fa-graduation-cap"></i>
                </div>
                <div className="celebration-content">
                  <h6 className="mb-1">📚 Learning Enthusiast!</h6>
                  <p className="mb-0 small">You&apos;ve enrolled in 3 courses!</p>
                </div>
              </div>,
              {
                duration: 5000,
                style: {
                  background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px'
                }
              }
            )
            setShownNotifications(prev => new Set([...prev, 'three-enrollments']))
          }, 1500)
        }
      } catch (error) {
        // Error checking multiple enrollments
      }
    }

    // Run all checks
    checkFirstEnrollment()
    checkIdCardMilestone()
    checkCourseCompletion()
    checkMultipleEnrollments()

  }, [user, shownNotifications])

  return null // This component doesn't render anything visible
}

export default AchievementNotifications
