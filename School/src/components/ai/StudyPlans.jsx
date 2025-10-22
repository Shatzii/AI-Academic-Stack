import React, { useState, useEffect } from 'react'
import { aiAPI } from '../../api'
import toast from 'react-hot-toast'

const StudyPlans = () => {
  const [studyPlans, setStudyPlans] = useState([])
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)

  // Form state for generating new study plan
  const [formData, setFormData] = useState({
    course_id: '',
    duration_weeks: 4,
    learning_style: 'balanced',
    goals: ''
  })

  useEffect(() => {
    fetchStudyPlans()
  }, [])

  const fetchStudyPlans = async () => {
    try {
      setLoading(true)
      const response = await aiAPI.getStudyPlans()
      setStudyPlans(response.data)
    } catch (error) {
      toast.error('Failed to fetch study plans')
    } finally {
      setLoading(false)
    }
  }

  const handleGeneratePlan = async (e) => {
    e.preventDefault()

    if (!formData.course_id) {
      toast.error('Please select a course')
      return
    }

    try {
      setGenerating(true)
      await aiAPI.generateStudyPlan(formData)
      toast.success('Study plan generated successfully!')
      fetchStudyPlans() // Refresh the list
      // Reset form
      setFormData({
        course_id: '',
        duration_weeks: 4,
        learning_style: 'balanced',
        goals: ''
      })
    } catch (error) {
      toast.error('Failed to generate study plan')
    } finally {
      setGenerating(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="study-plans-page">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2 className="mb-1">AI Study Plans</h2>
                <p className="text-muted">Generate personalized study plans for your courses</p>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Generate New Plan */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">
                  <i className="fas fa-plus me-2"></i>
                  Generate Study Plan
                </h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleGeneratePlan}>
                  <div className="mb-3">
                    <label className="form-label">Course ID</label>
                    <input
                      type="number"
                      className="form-control"
                      name="course_id"
                      value={formData.course_id}
                      onChange={handleInputChange}
                      placeholder="Enter course ID"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Duration (weeks)</label>
                    <select
                      className="form-select"
                      name="duration_weeks"
                      value={formData.duration_weeks}
                      onChange={handleInputChange}
                    >
                      <option value={2}>2 weeks</option>
                      <option value={4}>4 weeks</option>
                      <option value={6}>6 weeks</option>
                      <option value={8}>8 weeks</option>
                      <option value={12}>12 weeks</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Learning Style</label>
                    <select
                      className="form-select"
                      name="learning_style"
                      value={formData.learning_style}
                      onChange={handleInputChange}
                    >
                      <option value="visual">Visual</option>
                      <option value="auditory">Auditory</option>
                      <option value="kinesthetic">Kinesthetic</option>
                      <option value="balanced">Balanced</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Specific Goals (optional)</label>
                    <textarea
                      className="form-control"
                      name="goals"
                      value={formData.goals}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Any specific goals or focus areas..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={generating}
                  >
                    {generating ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Generating...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-magic me-2"></i>
                        Generate Plan
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Study Plans List */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white">
                <h5 className="mb-0">
                  <i className="fas fa-list me-2"></i>
                  Your Study Plans
                </h5>
              </div>
              <div className="card-body">
                {loading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : studyPlans.length > 0 ? (
                  <div className="study-plans-list">
                    {studyPlans.map((plan, index) => (
                      <div key={index} className="study-plan-item card mb-3 border">
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h6 className="card-title mb-1">{plan.title}</h6>
                              <p className="card-text small text-muted mb-2">{plan.description}</p>
                              <span className="badge bg-info">{plan.duration_weeks} weeks</span>
                            </div>
                            <button className="btn btn-sm btn-outline-primary">
                              <i className="fas fa-eye me-1"></i>
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <i className="fas fa-book-open fa-3x text-muted mb-3"></i>
                    <h5 className="text-muted">No Study Plans Yet</h5>
                    <p className="text-muted">Generate your first AI-powered study plan to get started!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudyPlans