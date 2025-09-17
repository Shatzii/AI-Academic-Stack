import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api'
import VideoConference from './VideoConference'

const ClassroomDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [classroom, setClassroom] = useState(null)
  const [participants, setParticipants] = useState([])
  const [chatMessages, setChatMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isJoined, setIsJoined] = useState(false)
  const [activeTab, setActiveTab] = useState('chat')
  const chatContainerRef = useRef(null)
  const wsRef = useRef(null)

  useEffect(() => {
    fetchClassroom()
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [id])

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chatMessages])

  const fetchClassroom = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/classrooms/${id}/`)
      setClassroom(response.data)

      // Fetch participants
      const participantsResponse = await api.get(`/classrooms/${id}/participants/`)
      setParticipants(participantsResponse.data)

      // Fetch chat messages
      const chatResponse = await api.get(`/classrooms/${id}/chat/`)
      setChatMessages(chatResponse.data)

      // Check if user is already a participant
      const userParticipant = participantsResponse.data.find(p => p.user.id === user?.id)
      setIsJoined(!!userParticipant)

    } catch (err) {
      setError('Failed to load classroom')
      // console.error('Error fetching classroom:', err)
    } finally {
      setLoading(false)
    }
  }

  const connectWebSocket = () => {
    const wsUrl = `ws://localhost:8001/ws/classroom/${id}/`
    wsRef.current = new WebSocket(wsUrl)

    wsRef.current.onopen = () => {
      // console.log('WebSocket connected')
    }

    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data)
      handleWebSocketMessage(data)
    }

    wsRef.current.onclose = () => {
      // console.log('WebSocket disconnected')
    }

    wsRef.current.onerror = (error) => {
      // console.error('WebSocket error:', error)
    }
  }

  const handleWebSocketMessage = (data) => {
    switch (data.type) {
      case 'chat_message':
        setChatMessages(prev => [...prev, data.message])
        break
      case 'participant_update':
        // Update participant count
        break
      case 'status_update':
        setClassroom(prev => ({ ...prev, status: data.status }))
        break
      default:
        break
    }
  }

  const handleJoinClassroom = async () => {
    try {
      await api.post(`/classrooms/${id}/join/`)
      setIsJoined(true)
      connectWebSocket()
      fetchClassroom() // Refresh data
    } catch (err) {
      // console.error('Error joining classroom:', err)
    }
  }

  const handleLeaveClassroom = async () => {
    try {
      await api.post(`/classrooms/${id}/leave/`)
      setIsJoined(false)
      if (wsRef.current) {
        wsRef.current.close()
      }
    } catch (err) {
      // console.error('Error leaving classroom:', err)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !wsRef.current) return

    try {
      wsRef.current.send(JSON.stringify({
        type: 'chat_message',
        content: newMessage,
        message_type: 'text'
      }))
      setNewMessage('')
    } catch (err) {
      // console.error('Error sending message:', err)
    }
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading classroom...</span>
          </div>
          <p className="mt-2">Loading classroom...</p>
        </div>
      </div>
    )
  }

  if (error || !classroom) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error || 'Classroom not found'}
        </div>
        <button
          className="btn btn-secondary mt-3"
          onClick={() => navigate('/classrooms')}
        >
          <i className="fas fa-arrow-left me-2"></i>
          Back to Classrooms
        </button>
      </div>
    )
  }

  return (
    <div className="classroom-detail-page">
      <div className="container-fluid mt-4">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="/classrooms">Classrooms</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      {classroom.title}
                    </li>
                  </ol>
                </nav>
                <h1 className="mb-2">
                  <i className="fas fa-chalkboard-teacher me-2 text-primary"></i>
                  {classroom.title}
                </h1>
                <p className="text-muted mb-2">{classroom.description}</p>
                <div className="classroom-meta">
                  <span className="me-3">
                    <i className="fas fa-user-tie me-1"></i>
                    {classroom.instructor?.full_name || 'Instructor'}
                  </span>
                  <span className="me-3">
                    <i className="fas fa-calendar me-1"></i>
                    {new Date(classroom.scheduled_at).toLocaleString()}
                  </span>
                  <span className="me-3">
                    <i className="fas fa-clock me-1"></i>
                    {classroom.duration_minutes} minutes
                  </span>
                  <span className={`badge ${classroom.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                    {classroom.status}
                  </span>
                </div>
              </div>

              <div className="d-flex gap-2">
                {isAuthenticated && (
                  <>
                    {isJoined ? (
                      <button
                        className="btn btn-danger"
                        onClick={handleLeaveClassroom}
                      >
                        <i className="fas fa-sign-out-alt me-2"></i>
                        Leave Classroom
                      </button>
                    ) : (
                      <button
                        className="btn btn-success"
                        onClick={handleJoinClassroom}
                      >
                        <i className="fas fa-sign-in-alt me-2"></i>
                        Join Classroom
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Main Content */}
          <div className="col-lg-8">
            {/* Video Area */}
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="fas fa-video me-2"></i>
                  Live Session
                </h5>
              </div>
              <div className="card-body">
                {classroom.status === 'active' && isJoined ? (
                  <VideoConference
                    classroomId={id}
                    isActive={true}
                  />
                ) : (
                  <div className="text-center py-5">
                    <i className="fas fa-video fa-3x text-muted mb-3"></i>
                    <h4>Classroom Not Active</h4>
                    <p className="text-muted">
                      {classroom.status === 'scheduled'
                        ? `This classroom will start at ${new Date(classroom.scheduled_at).toLocaleString()}`
                        : 'This classroom session has ended.'
                      }
                    </p>
                    {!isJoined && isAuthenticated && (
                      <p className="text-info mt-3">
                        <i className="fas fa-info-circle me-1"></i>
                        Join the classroom to access the live session when it starts.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="card">
              <div className="card-header">
                <ul className="nav nav-tabs card-header-tabs">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'chat' ? 'active' : ''}`}
                      onClick={() => setActiveTab('chat')}
                    >
                      <i className="fas fa-comments me-1"></i>
                      Chat ({chatMessages.length})
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'participants' ? 'active' : ''}`}
                      onClick={() => setActiveTab('participants')}
                    >
                      <i className="fas fa-users me-1"></i>
                      Participants ({participants.length})
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'resources' ? 'active' : ''}`}
                      onClick={() => setActiveTab('resources')}
                    >
                      <i className="fas fa-file me-1"></i>
                      Resources
                    </button>
                  </li>
                </ul>
              </div>

              <div className="card-body">
                {activeTab === 'chat' && (
                  <div className="chat-section">
                    <div
                      className="chat-messages"
                      ref={chatContainerRef}
                      style={{ height: '400px', overflowY: 'auto' }}
                    >
                      {chatMessages.length === 0 ? (
                        <div className="text-center text-muted py-4">
                          <i className="fas fa-comments fa-2x mb-2"></i>
                          <p>No messages yet. Start the conversation!</p>
                        </div>
                      ) : (
                        chatMessages.map((message, index) => (
                          <div key={index} className="chat-message mb-3">
                            <div className="d-flex">
                              <div className="message-avatar me-2">
                                <i className="fas fa-user-circle fa-2x"></i>
                              </div>
                              <div className="flex-grow-1">
                                <div className="message-header">
                                  <strong>{message.sender}</strong>
                                  <small className="text-muted ms-2">
                                    {formatTime(message.timestamp)}
                                  </small>
                                </div>
                                <div className="message-content">
                                  {message.content}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {isJoined && (
                      <form onSubmit={handleSendMessage} className="chat-input mt-3">
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                          />
                          <button type="submit" className="btn btn-primary">
                            <i className="fas fa-paper-plane"></i>
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}

                {activeTab === 'participants' && (
                  <div className="participants-section">
                    <div className="participants-list">
                      {participants.length === 0 ? (
                        <div className="text-center text-muted py-4">
                          <i className="fas fa-users fa-2x mb-2"></i>
                          <p>No participants yet.</p>
                        </div>
                      ) : (
                        participants.map((participant) => (
                          <div key={participant.id} className="participant-item d-flex align-items-center mb-2">
                            <div className="participant-avatar me-2">
                              <i className="fas fa-user-circle fa-lg"></i>
                            </div>
                            <div className="flex-grow-1">
                              <div className="participant-name">
                                {participant.user.full_name}
                              </div>
                              <div className="participant-role text-muted small">
                                {participant.role}
                              </div>
                            </div>
                            <div className={`status-indicator ${participant.is_active ? 'active' : 'inactive'}`}>
                              <i className={`fas fa-circle ${participant.is_active ? 'text-success' : 'text-muted'}`}></i>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'resources' && (
                  <div className="resources-section">
                    <div className="text-center text-muted py-4">
                      <i className="fas fa-file fa-2x mb-2"></i>
                      <p>Resources section coming soon...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            {/* Classroom Info */}
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">Classroom Info</h5>
              </div>
              <div className="card-body">
                <div className="info-item mb-2">
                  <i className="fas fa-users me-2"></i>
                  <strong>Participants:</strong> {participants.length}
                </div>
                <div className="info-item mb-2">
                  <i className="fas fa-clock me-2"></i>
                  <strong>Duration:</strong> {classroom.duration_minutes} minutes
                </div>
                {classroom.max_participants && (
                  <div className="info-item mb-2">
                    <i className="fas fa-user-friends me-2"></i>
                    <strong>Max Participants:</strong> {classroom.max_participants}
                  </div>
                )}
                {classroom.is_recording_enabled && (
                  <div className="info-item mb-2">
                    <i className="fas fa-video me-2"></i>
                    <strong>Recording:</strong> Enabled
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            {isJoined && (
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">Quick Actions</h5>
                </div>
                <div className="card-body">
                  <div className="d-grid gap-2">
                    <button className="btn btn-outline-primary">
                      <i className="fas fa-hand-paper me-2"></i>
                      Raise Hand
                    </button>
                    <button className="btn btn-outline-primary">
                      <i className="fas fa-poll me-2"></i>
                      View Polls
                    </button>
                    <button className="btn btn-outline-primary">
                      <i className="fas fa-users me-2"></i>
                      Breakout Rooms
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClassroomDetail
