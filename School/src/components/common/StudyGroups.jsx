import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api'

const StudyGroups = () => {
  const { user, isAuthenticated } = useAuth()
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    subject: '',
    max_members: 10,
    is_private: false
  })

  useEffect(() => {
    fetchStudyGroups()
  }, [])

  const fetchStudyGroups = async () => {
    try {
      setLoading(true)
      // For now, we'll simulate study groups data since the backend might not have this endpoint yet
      // In a real implementation, this would be: const response = await api.get('/study-groups/')
      const mockGroups = [
        {
          id: 1,
          name: 'Advanced Mathematics Study Group',
          description: 'Weekly sessions covering calculus, linear algebra, and statistics',
          subject: 'Mathematics',
          members_count: 8,
          max_members: 12,
          is_private: false,
          created_by: { full_name: 'Dr. Sarah Johnson' },
          created_at: '2025-09-01T10:00:00Z',
          last_activity: '2025-09-01T14:30:00Z'
        },
        {
          id: 2,
          name: 'Computer Science Fundamentals',
          description: 'Group study for algorithms, data structures, and programming concepts',
          subject: 'Computer Science',
          members_count: 15,
          max_members: 20,
          is_private: false,
          created_by: { full_name: 'Prof. Michael Chen' },
          created_at: '2025-08-28T09:00:00Z',
          last_activity: '2025-09-01T16:45:00Z'
        },
        {
          id: 3,
          name: 'Physics Problem Solving',
          description: 'Collaborative problem-solving sessions for physics concepts',
          subject: 'Physics',
          members_count: 6,
          max_members: 8,
          is_private: true,
          created_by: { full_name: 'Dr. Emily Davis' },
          created_at: '2025-08-30T11:00:00Z',
          last_activity: '2025-09-01T13:15:00Z'
        }
      ]
      setGroups(mockGroups)
    } catch (err) {
      setError('Failed to load study groups')
      // console.error('Error fetching study groups:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateGroup = async (e) => {
    e.preventDefault()
    try {
      // In a real implementation: await api.post('/study-groups/', newGroup)
      const newGroupData = {
        id: groups.length + 1,
        ...newGroup,
        members_count: 1,
        created_by: { full_name: user?.full_name || 'You' },
        created_at: new Date().toISOString(),
        last_activity: new Date().toISOString()
      }
      setGroups(prev => [newGroupData, ...prev])
      setNewGroup({
        name: '',
        description: '',
        subject: '',
        max_members: 10,
        is_private: false
      })
      setShowCreateForm(false)
    } catch (err) {
      // console.error('Error creating study group:', err)
    }
  }

  const handleJoinGroup = async (groupId) => {
    try {
      // In a real implementation: await api.post(`/study-groups/${groupId}/join/`)
      setGroups(prev => prev.map(group =>
        group.id === groupId
          ? { ...group, members_count: group.members_count + 1 }
          : group
      ))
    } catch (err) {
      // console.error('Error joining study group:', err)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  const getSubjectColor = (subject) => {
    const colors = {
      'Mathematics': 'badge-primary',
      'Computer Science': 'badge-success',
      'Physics': 'badge-info',
      'Chemistry': 'badge-warning',
      'Biology': 'badge-danger',
      'English': 'badge-secondary'
    }
    return colors[subject] || 'badge-secondary'
  }

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading study groups...</span>
          </div>
          <p className="mt-2">Loading study groups...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="study-groups-page">
      <div className="container mt-4">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="mb-2">
                  <i className="fas fa-users me-2 text-primary"></i>
                  Study Groups
                </h1>
                <p className="text-muted mb-0">
                  Join collaborative study sessions and learn together with peers
                </p>
              </div>
              {isAuthenticated && (
                <button
                  className="btn btn-primary"
                  onClick={() => setShowCreateForm(true)}
                >
                  <i className="fas fa-plus me-2"></i>
                  Create Group
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Create Group Modal */}
        {showCreateForm && (
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Create Study Group</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowCreateForm(false)}
                  ></button>
                </div>
                <form onSubmit={handleCreateGroup}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label htmlFor="groupName" className="form-label">Group Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="groupName"
                        value={newGroup.name}
                        onChange={(e) => setNewGroup(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="groupDescription" className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        id="groupDescription"
                        rows="3"
                        value={newGroup.description}
                        onChange={(e) => setNewGroup(prev => ({ ...prev, description: e.target.value }))}
                        required
                      ></textarea>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="groupSubject" className="form-label">Subject</label>
                      <select
                        className="form-select"
                        id="groupSubject"
                        value={newGroup.subject}
                        onChange={(e) => setNewGroup(prev => ({ ...prev, subject: e.target.value }))}
                        required
                      >
                        <option value="">Select Subject</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Physics">Physics</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Biology">Biology</option>
                        <option value="English">English</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="maxMembers" className="form-label">Max Members</label>
                      <input
                        type="number"
                        className="form-control"
                        id="maxMembers"
                        min="2"
                        max="50"
                        value={newGroup.max_members}
                        onChange={(e) => setNewGroup(prev => ({ ...prev, max_members: parseInt(e.target.value) }))}
                      />
                    </div>
                    <div className="mb-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="isPrivate"
                          checked={newGroup.is_private}
                          onChange={(e) => setNewGroup(prev => ({ ...prev, is_private: e.target.checked }))}
                        />
                        <label className="form-check-label" htmlFor="isPrivate">
                          Private Group (invite only)
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowCreateForm(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Create Group
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Study Groups Grid */}
        {groups.length === 0 ? (
          <div className="text-center py-5">
            <i className="fas fa-users fa-3x text-muted mb-3"></i>
            <h3 className="text-muted">No study groups found</h3>
            <p className="text-muted">Be the first to create a study group!</p>
            {isAuthenticated && (
              <button
                className="btn btn-primary mt-3"
                onClick={() => setShowCreateForm(true)}
              >
                <i className="fas fa-plus me-2"></i>
                Create Your First Study Group
              </button>
            )}
          </div>
        ) : (
          <div className="row">
            {groups.map((group) => (
              <div key={group.id} className="col-lg-4 col-md-6 mb-4">
                <div className="card study-group-card h-100">
                  <div className="card-header">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h5 className="card-title mb-1">{group.name}</h5>
                        <span className={`badge ${getSubjectColor(group.subject)} mb-2`}>
                          {group.subject}
                        </span>
                      </div>
                      {group.is_private && (
                        <i className="fas fa-lock text-muted" title="Private Group"></i>
                      )}
                    </div>
                  </div>

                  <div className="card-body">
                    <p className="card-text text-truncate">
                      {group.description}
                    </p>

                    <div className="group-stats mb-3">
                      <div className="stat-item">
                        <i className="fas fa-users me-1"></i>
                        <span>{group.members_count}/{group.max_members} members</span>
                      </div>
                      <div className="stat-item">
                        <i className="fas fa-user-tie me-1"></i>
                        <span>{group.created_by.full_name}</span>
                      </div>
                      <div className="stat-item">
                        <i className="fas fa-calendar me-1"></i>
                        <span>Created {formatDate(group.created_at)}</span>
                      </div>
                    </div>

                    <div className="group-activity">
                      <small className="text-muted">
                        <i className="fas fa-clock me-1"></i>
                        Last activity: {formatDate(group.last_activity)}
                      </small>
                    </div>
                  </div>

                  <div className="card-footer">
                    <div className="d-flex gap-2">
                      <Link
                        to={`/study-groups/${group.id}`}
                        className="btn btn-primary flex-fill"
                      >
                        View Group
                      </Link>
                      {isAuthenticated && group.members_count < group.max_members && (
                        <button
                          className="btn btn-outline-success"
                          onClick={() => handleJoinGroup(group.id)}
                        >
                          <i className="fas fa-user-plus"></i>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Features Section */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="text-center mb-4">
              <h3>Why Join Study Groups?</h3>
              <p className="text-muted">Collaborative learning enhances understanding and retention</p>
            </div>
            <div className="row">
              <div className="col-md-4 mb-4">
                <div className="feature-card text-center">
                  <i className="fas fa-brain fa-3x text-primary mb-3"></i>
                  <h5>Enhanced Learning</h5>
                  <p>Learn from peers, discuss complex topics, and gain new perspectives</p>
                </div>
              </div>
              <div className="col-md-4 mb-4">
                <div className="feature-card text-center">
                  <i className="fas fa-users fa-3x text-success mb-3"></i>
                  <h5>Community Support</h5>
                  <p>Connect with like-minded students and build lasting relationships</p>
                </div>
              </div>
              <div className="col-md-4 mb-4">
                <div className="feature-card text-center">
                  <i className="fas fa-trophy fa-3x text-warning mb-3"></i>
                  <h5>Achievement Boost</h5>
                  <p>Stay motivated and achieve better academic results together</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudyGroups
