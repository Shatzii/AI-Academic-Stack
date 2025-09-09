import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { sendMessage, fetchConversation, clearConversation } from '../../slices/aiSlice'
import { useAuth } from '../../context/AuthContext.jsx'
import toast from 'react-hot-toast'

const AIAssistant = () => {
  const dispatch = useDispatch()
  const { user } = useAuth()
  const { messages, loading, conversationId, aiServiceInfo } = useSelector(state => state.ai)

  const [inputMessage, setInputMessage] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const messagesEndRef = useRef(null)

  const subjects = [
    'Mathematics', 'English Language Arts', 'Science', 'Social Studies',
    'History', 'Geography', 'Physics', 'Chemistry', 'Biology',
    'Computer Science', 'Art', 'Music', 'Physical Education'
  ]

  useEffect(() => {
    // Load existing conversation if available
    if (conversationId) {
      dispatch(fetchConversation(conversationId))
    }
  }, [dispatch, conversationId])

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()

    if (!inputMessage.trim()) {
      toast.error('Please enter a message')
      return
    }

    try {
      const messageData = {
        message: inputMessage,
        subject: selectedSubject || null
      }

      await dispatch(sendMessage(messageData)).unwrap()
      setInputMessage('')
    } catch (error) {
      toast.error('Failed to send message')
    }
  }

  const handleNewConversation = () => {
    dispatch(clearConversation())
    setInputMessage('')
    setSelectedSubject('')
    toast.success('Started new conversation')
  }

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="ai-assistant-page">
      <div className="container-fluid">
        <div className="row">
          {/* Chat Area */}
          <div className="col-lg-8">
            <div className="chat-container">
              {/* Header */}
              <div className="chat-header bg-primary text-white p-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h4 className="mb-1">
                      <i className="fas fa-brain me-2"></i>
                      AI Learning Assistant
                    </h4>
                    <p className="mb-0 small">
                      Get help with your studies, ask questions, and receive personalized guidance
                    </p>
                  </div>
                  <button
                    className="btn btn-outline-light btn-sm"
                    onClick={handleNewConversation}
                    title="Start New Conversation"
                  >
                    <i className="fas fa-plus me-2"></i>
                    New Chat
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="chat-messages p-3" style={{ height: '60vh', overflowY: 'auto' }}>
                {messages && messages.length > 0 ? (
                  messages.map((message, index) => (
                    <div
                      key={index}
                      className={`message ${message.sender === 'user' ? 'user-message' : 'ai-message'} mb-3`}
                    >
                      <div className="message-content">
                        <div className="message-header mb-2">
                          <span className="sender-badge">
                            {message.sender === 'user' ? (
                              <>
                                <i className="fas fa-user me-2"></i>
                                You
                              </>
                            ) : (
                              <>
                                <i className="fas fa-brain me-2"></i>
                                AI Assistant
                              </>
                            )}
                          </span>
                          <span className="timestamp small text-muted ms-2">
                            {formatTimestamp(message.timestamp)}
                          </span>
                        </div>
                        <div className="message-text">
                          {message.message}
                        </div>
                        {message.subject && (
                          <div className="message-subject mt-2">
                            <span className="badge bg-light text-dark small">
                              <i className="fas fa-tag me-1"></i>
                              {message.subject}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="welcome-message text-center py-5">
                    <i className="fas fa-brain fa-4x text-primary mb-4"></i>
                    <h5 className="text-muted mb-3">Welcome to your AI Learning Assistant!</h5>
                    <p className="text-muted mb-4">
                      I'm here to help you with your studies. Ask me questions about any subject,
                      get explanations for difficult concepts, or request study tips and resources.
                    </p>
                    <div className="suggestion-chips">
                      <span className="badge bg-primary me-2 mb-2 p-2">
                        "Explain photosynthesis"
                      </span>
                      <span className="badge bg-success me-2 mb-2 p-2">
                        "Help with algebra problems"
                      </span>
                      <span className="badge bg-info me-2 mb-2 p-2">
                        "Study tips for history"
                      </span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="chat-input bg-light p-3">
                <form onSubmit={handleSendMessage}>
                  <div className="row">
                    <div className="col-md-9">
                      <div className="input-group">
                        <select
                          className="form-select"
                          value={selectedSubject}
                          onChange={(e) => setSelectedSubject(e.target.value)}
                          style={{ maxWidth: '200px' }}
                        >
                          <option value="">All Subjects</option>
                          {subjects.map((subject, index) => (
                            <option key={index} value={subject}>{subject}</option>
                          ))}
                        </select>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Ask me anything about your studies..."
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          disabled={loading}
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={loading || !inputMessage.trim()}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Thinking...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-paper-plane me-2"></i>
                            Send
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            <div className="ai-sidebar">
              {/* Quick Actions */}
              <div className="card mb-4 border-0 shadow-sm">
                <div className="card-header bg-white border-0">
                  <h6 className="mb-0 fw-bold">
                    <i className="fas fa-bolt text-warning me-2"></i>
                    Quick Actions
                  </h6>
                </div>
                <div className="card-body">
                  <div className="d-grid gap-2">
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => setInputMessage("Explain the concept of ")}
                    >
                      <i className="fas fa-lightbulb me-2"></i>
                      Explain Concept
                    </button>
                    <button
                      className="btn btn-outline-success"
                      onClick={() => setInputMessage("Help me solve this problem: ")}
                    >
                      <i className="fas fa-calculator me-2"></i>
                      Solve Problem
                    </button>
                    <button
                      className="btn btn-outline-info"
                      onClick={() => setInputMessage("Give me study tips for ")}
                    >
                      <i className="fas fa-book me-2"></i>
                      Study Tips
                    </button>
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => setInputMessage("Create a quiz about ")}
                    >
                      <i className="fas fa-question-circle me-2"></i>
                      Create Quiz
                    </button>
                  </div>
                </div>
              </div>

              {/* Subject Focus */}
              <div className="card mb-4 border-0 shadow-sm">
                <div className="card-header bg-white border-0">
                  <h6 className="mb-0 fw-bold">
                    <i className="fas fa-tag text-info me-2"></i>
                    Subject Focus
                  </h6>
                </div>
                <div className="card-body">
                  <p className="text-muted small mb-3">
                    Select a subject to get more targeted assistance
                  </p>
                  <div className="subject-grid">
                    {subjects.slice(0, 6).map((subject, index) => (
                      <button
                        key={index}
                        className={`btn btn-sm ${selectedSubject === subject ? 'btn-primary' : 'btn-outline-secondary'} me-2 mb-2`}
                        onClick={() => setSelectedSubject(subject)}
                      >
                        {subject}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Service Info */}
              <div className="card mb-4 border-0 shadow-sm">
                <div className="card-header bg-white border-0">
                  <h6 className="mb-0 fw-bold">
                    <i className="fas fa-cogs text-primary me-2"></i>
                    AI Service Status
                  </h6>
                </div>
                <div className="card-body">
                  <div className="ai-service-info">
                    <div className="mb-2">
                      <small className="text-muted">Service:</small>
                      <div>
                        <span className={`badge ${aiServiceInfo.serviceType === 'ollama' ? 'bg-success' : aiServiceInfo.serviceType === 'openai' ? 'bg-info' : 'bg-warning'}`}>
                          {aiServiceInfo.serviceType ? aiServiceInfo.serviceType.toUpperCase() : 'HYBRID'}
                        </span>
                      </div>
                    </div>
                    {aiServiceInfo.model && (
                      <div className="mb-2">
                        <small className="text-muted">Model:</small>
                        <div className="small fw-bold">{aiServiceInfo.model}</div>
                      </div>
                    )}
                    {aiServiceInfo.tokensUsed > 0 && (
                      <div className="mb-2">
                        <small className="text-muted">Tokens Used:</small>
                        <div className="small fw-bold">{aiServiceInfo.tokensUsed}</div>
                      </div>
                    )}
                    {aiServiceInfo.responseTime > 0 && (
                      <div className="mb-2">
                        <small className="text-muted">Response Time:</small>
                        <div className="small fw-bold">{aiServiceInfo.responseTime.toFixed(2)}s</div>
                      </div>
                    )}
                    {!aiServiceInfo.serviceType && (
                      <div className="text-muted small">
                        <i className="fas fa-info-circle me-1"></i>
                        Service info will appear after your first message
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0">
                  <h6 className="mb-0 fw-bold">
                    <i className="fas fa-info-circle text-success me-2"></i>
                    Tips for Better Results
                  </h6>
                </div>
                <div className="card-body">
                  <ul className="list-unstyled small">
                    <li className="mb-2">
                      <i className="fas fa-check text-success me-2"></i>
                      Be specific about your question
                    </li>
                    <li className="mb-2">
                      <i className="fas fa-check text-success me-2"></i>
                      Include context when asking for help
                    </li>
                    <li className="mb-2">
                      <i className="fas fa-check text-success me-2"></i>
                      Select a subject for targeted assistance
                    </li>
                    <li className="mb-2">
                      <i className="fas fa-check text-success me-2"></i>
                      Ask follow-up questions for clarification
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIAssistant
