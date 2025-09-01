import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'
import { Toaster } from 'react-hot-toast'

// Layout Components
import Navbar from './components/layout/Navbar'
import Sidebar from './components/layout/Sidebar'
import Footer from './components/layout/Footer'

// Auth Components
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Profile from './components/auth/Profile'

// Course Components
import CourseList from './components/courses/CourseList'
import CourseDetail from './components/courses/CourseDetail'
import CourseCreate from './components/courses/CourseCreate'
import CourseEdit from './components/courses/CourseEdit'
import LessonView from './components/courses/LessonView'

// Classroom Components
import ClassroomList from './components/classrooms/ClassroomList'
import ClassroomDetail from './components/classrooms/ClassroomDetail'
import ClassroomCreate from './components/classrooms/ClassroomCreate'

// AI Assistant Components
import AIChat from './components/ai/AIChat'
import StudyPlans from './components/ai/StudyPlans'
import QuizGenerator from './components/ai/QuizGenerator'
import QuizAttempt from './components/ai/QuizAttempt'

// Analytics Components
import Dashboard from './components/analytics/Dashboard'
import Analytics from './components/analytics/Analytics'

// Common Components
import Home from './components/common/Home'
import NotFound from './components/common/NotFound'
import Loading from './components/common/Loading'

// Context
import { AuthProvider } from './context/AuthContext'

// Styles
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <div className="app">
            <Navbar />
            <div className="main-content">
              <Sidebar />
              <main className="content">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Protected Routes */}
                  <Route path="/courses" element={<CourseList />} />
                  <Route path="/courses/:id" element={<CourseDetail />} />
                  <Route path="/courses/:id/lessons/:lessonId" element={<LessonView />} />
                  <Route path="/courses/create" element={<CourseCreate />} />
                  <Route path="/courses/:id/edit" element={<CourseEdit />} />

                  <Route path="/classrooms" element={<ClassroomList />} />
                  <Route path="/classrooms/:id" element={<ClassroomDetail />} />
                  <Route path="/classrooms/create" element={<ClassroomCreate />} />

                  <Route path="/ai/chat" element={<AIChat />} />
                  <Route path="/ai/study-plans" element={<StudyPlans />} />
                  <Route path="/ai/quiz-generator" element={<QuizGenerator />} />
                  <Route path="/ai/quiz/:id" element={<QuizAttempt />} />

                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/profile" element={<Profile />} />

                  {/* 404 Route */}
                  <Route path="/404" element={<NotFound />} />
                  <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
              </main>
            </div>
            <Footer />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </Provider>
  )
}

export default App
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeSection === 'architecture' ? 'active' : ''}`}
                  onClick={() => setActiveSection('architecture')}
                >
                  Architecture
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeSection === 'frontend' ? 'active' : ''}`}
                  onClick={() => setActiveSection('frontend')}
                >
                  Frontend
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeSection === 'backend' ? 'active' : ''}`}
                  onClick={() => setActiveSection('backend')}
                >
                  Backend
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeSection === 'database' ? 'active' : ''}`}
                  onClick={() => setActiveSection('database')}
                >
                  Database
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeSection === 'deployment' ? 'active' : ''}`}
                  onClick={() => setActiveSection('deployment')}
                >
                  Deployment
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}
                  onClick={() => setActiveSection('contact')}
                >
                  Contact
                </button>
              </li>
            </ul>
            
            {/* Search Bar */}
            <div className="d-flex me-3">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <button className="btn btn-outline-light" type="button">
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </div>
            
            <div>
              <button className="btn btn-outline-light me-2" onClick={toggleDarkMode}>
                <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'} me-2`}></i>
                {darkMode ? 'Light' : 'Dark'}
              </button>
              <button className="btn btn-outline-light me-2">
                <i className="fas fa-download me-2"></i>Docs
              </button>
              <button className="btn btn-light">
                <i className="fas fa-code me-2"></i>GitHub
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Header Section */}
      <section className="header-section">
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-4">OpenEdTex Full-Stack Architecture</h1>
          <p className="lead mb-4">Complete full-stack implementation for a virtual K-12 school platform</p>
          <button className="btn btn-primary btn-lg me-3">
            <i className="fas fa-play me-2"></i>Get Started
          </button>
          <button className="btn btn-outline-light btn-lg">
            <i className="fas fa-code me-2"></i>View Code
          </button>
        </div>
      </section>

      {/* Search Results */}
      {searchTerm && (
        <div className="search-results py-3 bg-light">
          <div className="container">
            <h5>Search Results for "{searchTerm}"</h5>
            {isSearching ? (
              <div className="text-center py-3">
                <div className="loading"></div>
                <p className="mt-2">Searching...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="row">
                {searchResults.map((result, index) => (
                  <div key={index} className="col-md-4 mb-3">
                    <div className="card h-100">
                      <div className="card-body">
                        <h6 className="card-title">{result.title}</h6>
                        <p className="card-text small">{result.content}</p>
                        <button 
                          className="btn btn-sm btn-primary"
                          onClick={() => setActiveSection(result.section)}
                        >
                          View Section
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No results found for "{searchTerm}"</p>
            )}
          </div>
        </div>
      )}

      {/* Dynamic Content Based on Active Section */}
      <main className="py-5">
        <div className="container">
          {activeSection === 'architecture' && <ArchitectureSection 
            expandedDiagram={expandedDiagram} 
            toggleDiagramExpansion={toggleDiagramExpansion}
            copyToClipboard={copyToClipboard}
            copiedCode={copiedCode}
          />}
          {activeSection === 'frontend' && <FrontendSection 
            copyToClipboard={copyToClipboard}
            copiedCode={copiedCode}
          />}
          {activeSection === 'backend' && <BackendSection 
            copyToClipboard={copyToClipboard}
            copiedCode={copiedCode}
          />}
          {activeSection === 'database' && <DatabaseSection 
            copyToClipboard={copyToClipboard}
            copiedCode={copiedCode}
          />}
          {activeSection === 'deployment' && <DeploymentSection 
            copyToClipboard={copyToClipboard}
            copiedCode={copiedCode}
          />}
          {activeSection === 'contact' && <ContactSection 
            contactForm={contactForm}
            handleContactChange={handleContactChange}
            handleContactSubmit={handleContactSubmit}
            formSubmitted={formSubmitted}
          />}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="row">
            <div className="col-md-6 mb-4">
              <h5>OpenEdTex Full-Stack Implementation</h5>
              <p>Complete architecture for a virtual K-12 school platform using open-source technologies.</p>
            </div>
            <div className="col-md-3 mb-4">
              <h5>Repository</h5>
              <ul className="list-unstyled">
                <li><a href="#" className="text-white">Frontend Code</a></li>
                <li><a href="#" className="text-white">Backend API</a></li>
                <li><a href="#" className="text-white">Deployment Scripts</a></li>
              </ul>
            </div>
            <div className="col-md-3 mb-4">
              <h5>Documentation</h5>
              <ul className="list-unstyled">
                <li><a href="#" className="text-white">API Docs</a></li>
                <li><a href="#" className="text-white">Setup Guide</a></li>
                <li><a href="#" className="text-white">Architecture</a></li>
              </ul>
            </div>
          </div>
          <hr className="mt-0 mb-4" />
          <div className="row">
            <div className="col-md-6 mb-3">
              <p className="mb-0">© 2023 OpenEdTex. Full-stack virtual school platform.</p>
            </div>
            <div className="col-md-6 text-md-end mb-3">
              <a href="#" className="text-white me-3"><i className="fab fa-github fa-lg"></i></a>
              <a href="#" className="text-white me-3"><i className="fab fa-docker fa-lg"></i></a>
              <a href="#" className="text-white"><i className="fab fa-aws fa-lg"></i></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Component Sections
function ArchitectureSection({ expandedDiagram, toggleDiagramExpansion, copyToClipboard, copiedCode }) {
  return (
    <>
      <h2 className="text-center mb-5">Full-Stack Architecture Overview</h2>
      <div className="architecture-diagram">
        <div className="row text-center mb-4">
          <div className="col-md-3">
            <div 
              className="component-box frontend-component clickable"
              onClick={() => toggleDiagramExpansion('frontend')}
              style={{ cursor: 'pointer' }}
            >
              <h5>Frontend</h5>
              <p>React, Bootstrap, BigBlueButton UI</p>
              <small className="text-muted">Click to expand</small>
            </div>
          </div>
          <div className="col-md-3">
            <div 
              className="component-box backend-component clickable"
              onClick={() => toggleDiagramExpansion('backend')}
              style={{ cursor: 'pointer' }}
            >
              <h5>Backend API</h5>
              <p>Django REST Framework, Node.js</p>
              <small className="text-muted">Click to expand</small>
            </div>
          </div>
          <div className="col-md-3">
            <div 
              className="component-box database-component clickable"
              onClick={() => toggleDiagramExpansion('database')}
              style={{ cursor: 'pointer' }}
            >
              <h5>Database</h5>
              <p>PostgreSQL, MongoDB, Redis</p>
              <small className="text-muted">Click to expand</small>
            </div>
          </div>
          <div className="col-md-3">
            <div 
              className="component-box infra-component clickable"
              onClick={() => toggleDiagramExpansion('infra')}
              style={{ cursor: 'pointer' }}
            >
              <h5>Infrastructure</h5>
              <p>AWS, Docker, Nginx</p>
              <small className="text-muted">Click to expand</small>
            </div>
          </div>
        </div>
        
        {/* Expanded Details */}
        {expandedDiagram && (
          <div className="expanded-details mb-4">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  {expandedDiagram === 'frontend' && 'Frontend Details'}
                  {expandedDiagram === 'backend' && 'Backend Details'}
                  {expandedDiagram === 'database' && 'Database Details'}
                  {expandedDiagram === 'infra' && 'Infrastructure Details'}
                </h5>
                <button 
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => toggleDiagramExpansion(null)}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="card-body">
                {expandedDiagram === 'frontend' && (
                  <div>
                    <h6>Technologies:</h6>
                    <ul>
                      <li>React 18 with Hooks</li>
                      <li>Bootstrap 5 for responsive design</li>
                      <li>Redux Toolkit for state management</li>
                      <li>WebRTC for video conferencing</li>
                      <li>Socket.io for real-time communication</li>
                    </ul>
                    <h6>Key Features:</h6>
                    <ul>
                      <li>Single Page Application (SPA)</li>
                      <li>Progressive Web App (PWA) capabilities</li>
                      <li>Responsive design for all devices</li>
                      <li>LTI consumer integration</li>
                    </ul>
                  </div>
                )}
                {expandedDiagram === 'backend' && (
                  <div>
                    <h6>Technologies:</h6>
                    <ul>
                      <li>Django REST Framework</li>
                      <li>Node.js microservices</li>
                      <li>Socket.io server</li>
                      <li>Celery for task queuing</li>
                      <li>PostgreSQL with Django ORM</li>
                    </ul>
                    <h6>Key Features:</h6>
                    <ul>
                      <li>RESTful API design</li>
                      <li>Real-time WebSocket support</li>
                      <li>Asynchronous task processing</li>
                      <li>Authentication & authorization</li>
                    </ul>
                  </div>
                )}
                {expandedDiagram === 'database' && (
                  <div>
                    <h6>Technologies:</h6>
                    <ul>
                      <li>PostgreSQL (primary database)</li>
                      <li>MongoDB (document storage)</li>
                      <li>Redis (caching & sessions)</li>
                      <li>Elasticsearch (search)</li>
                    </ul>
                    <h6>Data Strategy:</h6>
                    <ul>
                      <li>Relational data in PostgreSQL</li>
                      <li>Unstructured data in MongoDB</li>
                      <li>Cached data in Redis</li>
                      <li>Full-text search with Elasticsearch</li>
                    </ul>
                  </div>
                )}
                {expandedDiagram === 'infra' && (
                  <div>
                    <h6>Technologies:</h6>
                    <ul>
                      <li>Docker containers</li>
                      <li>AWS ECS/EKS orchestration</li>
                      <li>GitHub Actions CI/CD</li>
                      <li>Nginx load balancer</li>
                      <li>Let's Encrypt SSL</li>
                    </ul>
                    <h6>Deployment Strategy:</h6>
                    <ul>
                      <li>Containerized microservices</li>
                      <li>Auto-scaling on AWS</li>
                      <li>Automated testing & deployment</li>
                      <li>SSL termination at edge</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        <div className="text-center">
          <i className="fas fa-arrow-down fa-2x mb-3 text-primary"></i>
        </div>
        <div className="row text-center">
          <div className="col-md-4 mx-auto">
            <div className="component-box" style={{backgroundColor: 'rgba(108, 117, 125, 0.15)', border: '1px solid #6c757d'}}>
              <h5>Integrations</h5>
              <p>Moodle, BigBlueButton, LTI Tools</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function FrontendSection({ copyToClipboard, copiedCode }) {
  const frontendCode = `import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { io } from 'socket.io-client';

function Classroom({ classroomId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const socket = useRef();
  
  useEffect(() => {
    socket.current = io('https://api.openedtex.org');
    socket.current.emit('join-classroom', classroomId);
    
    socket.current.on('message', (message) => {
      setMessages(prev => [...prev, message]);
    });
    
    return () => socket.current.disconnect();
  }, [classroomId]);
  
  const sendMessage = () => {
    socket.current.emit('send-message', {
      classroomId,
      message: newMessage,
      timestamp: new Date()
    });
    setNewMessage('');
  };
  
  return (
    <div className="classroom-container">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <strong>{msg.user}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="message-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}`;

  return (
    <>
      <h2 className="text-center mb-5">Frontend Architecture</h2>
      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className="architecture-card card frontend-card">
            <div className="card-body">
              <h3 className="card-title"><i className="fas fa-code me-2"></i>Modern React-Based Frontend</h3>
              <p className="text-muted">Responsive SPA with real-time capabilities and PWA features</p>
              
              <h5>Core Technologies:</h5>
              <div className="mb-3">
                <span className="layer-badge bg-success">React 18</span>
                <span className="layer-badge bg-success">Bootstrap 5</span>
                <span className="layer-badge bg-success">Redux Toolkit</span>
                <span className="layer-badge bg-success">WebRTC</span>
                <span className="layer-badge bg-success">Socket.io Client</span>
              </div>
              
              <h5>Key Features:</h5>
              <ul>
                <li>Dynamic Single Page Application (SPA)</li>
                <li>Real-time virtual classroom interface</li>
                <li>Responsive design for all devices</li>
                <li>Progressive Web App (PWA) capabilities</li>
                <li>LTI consumer for external tool integration</li>
              </ul>
              
              <h5>Example Implementation:</h5>
              <div className="code-block-container">
                <div className="code-block">
                  <pre><code>{frontendCode}</code></pre>
                </div>
                <button 
                  className="btn btn-sm btn-outline-primary copy-btn"
                  onClick={() => copyToClipboard(frontendCode, 'frontend-code')}
                >
                  <i className="fas fa-copy me-1"></i>
                  {copiedCode === 'frontend-code' ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function BackendSection({ copyToClipboard, copiedCode }) {
  const backendCode = `// Django REST Framework - Classroom API
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Classroom, Message
from .serializers import ClassroomSerializer, MessageSerializer

class ClassroomViewSet(viewsets.ModelViewSet):
    queryset = Classroom.objects.all()
    serializer_class = ClassroomSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=True, methods=['post'])
    def join(self, request, pk=None):
        classroom = self.get_object()
        classroom.participants.add(request.user)
        
        # Notify other participants via WebSocket
        from channels.layers import get_channel_layer
        channel_layer = get_channel_layer()
        
        async_to_sync(channel_layer.group_send)(
            f'classroom_{classroom.id}',
            {
                'type': 'user_joined',
                'user': request.user.username,
                'message': f'{request.user.username} joined the classroom'
            }
        )
        
        return Response({'status': 'joined'})
    
    @action(detail=True, methods=['get'])
    def messages(self, request, pk=None):
        classroom = self.get_object()
        messages = classroom.messages.all()[:50]  # Last 50 messages
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)`;

  return (
    <>
      <h2 className="text-center mb-5">Backend Architecture</h2>
      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className="architecture-card card backend-card">
            <div className="card-body">
              <h3 className="card-title"><i className="fas fa-server me-2"></i>Scalable API Architecture</h3>
              <p className="text-muted">Django REST Framework with Node.js microservices for optimal performance</p>
              
              <h5>Core Technologies:</h5>
              <div className="mb-3">
                <span className="layer-badge bg-warning text-dark">Django 4</span>
                <span className="layer-badge bg-warning text-dark">Django REST Framework</span>
                <span className="layer-badge bg-warning text-dark">Node.js</span>
                <span className="layer-badge bg-warning text-dark">Socket.io</span>
                <span className="layer-badge bg-warning text-dark">Celery</span>
              </div>
              
              <h5>Key Services:</h5>
              <ul>
                <li>RESTful API for core platform functionality</li>
                <li>WebSocket server for real-time features</li>
                <li>Task queue for asynchronous processing</li>
                <li>Authentication and authorization service</li>
                <li>Integration endpoints for Moodle and BBB</li>
              </ul>
              
              <h5>Django REST API Example:</h5>
              <div className="code-block-container">
                <div className="code-block">
                  <pre><code>{backendCode}</code></pre>
                </div>
                <button 
                  className="btn btn-sm btn-outline-primary copy-btn"
                  onClick={() => copyToClipboard(backendCode, 'backend-code')}
                >
                  <i className="fas fa-copy me-1"></i>
                  {copiedCode === 'backend-code' ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function DatabaseSection({ copyToClipboard, copiedCode }) {
  const databaseCode = `-- PostgreSQL Schema for OpenEdTex
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table with role-based access
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('student', 'teacher', 'admin', 'parent')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Courses with TEKS alignment
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    subject VARCHAR(100),
    grade_level VARCHAR(20),
    teks_alignment JSONB, -- Store TEKS standards as JSON
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Classrooms for virtual sessions
CREATE TABLE classrooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id),
    title VARCHAR(255) NOT NULL,
    scheduled_at TIMESTAMP WITH TIME ZONE,
    duration INTERVAL,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_courses_subject ON courses(subject);
CREATE INDEX idx_classrooms_course ON classrooms(course_id);
CREATE INDEX idx_classrooms_scheduled ON classrooms(scheduled_at);`;

  return (
    <>
      <h2 className="text-center mb-5">Database Architecture</h2>
      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className="architecture-card card database-card">
            <div className="card-body">
              <h3 className="card-title"><i className="fas fa-database me-2"></i>Hybrid Database Solution</h3>
              <p className="text-muted">Optimized data storage with PostgreSQL, MongoDB, and Redis</p>
              
              <h5>Core Technologies:</h5>
              <div className="mb-3">
                <span className="layer-badge bg-primary">PostgreSQL</span>
                <span className="layer-badge bg-primary">MongoDB</span>
                <span className="layer-badge bg-primary">Redis</span>
                <span className="layer-badge bg-primary">Elasticsearch</span>
              </div>
              
              <h5>Data Strategy:</h5>
              <ul>
                <li>PostgreSQL for structured data (users, courses, grades)</li>
                <li>MongoDB for unstructured data (content, analytics events)</li>
                <li>Redis for caching and real-time features</li>
                <li>Elasticsearch for search and analytics</li>
              </ul>
              
              <h5>PostgreSQL Schema Example:</h5>
              <div className="code-block-container">
                <div className="code-block">
                  <pre><code>{databaseCode}</code></pre>
                </div>
                <button 
                  className="btn btn-sm btn-outline-primary copy-btn"
                  onClick={() => copyToClipboard(databaseCode, 'database-code')}
                >
                  <i className="fas fa-copy me-1"></i>
                  {copiedCode === 'database-code' ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function DeploymentSection({ copyToClipboard, copiedCode }) {
  const deploymentCode = `# Docker Compose for OpenEdTex
version: '3.8'

services:
  # Django Backend API
  api:
    build: 
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - DJANGO_SETTINGS_MODULE=config.settings.production
      - DATABASE_URL=postgresql://user:password@db:5432/openedtex
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - db
      - redis
    volumes:
      - static_files:/app/static
      - media_files:/app/media

  # PostgreSQL Database
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: openedtex
      POSTGRES_USER: openedtex_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  # Redis Cache
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  # React Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:8000/api

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
      - static_files:/app/static
    depends_on:
      - api
      - frontend

volumes:
  postgres_data:
  redis_data:
  static_files:
  media_files:`;

  return (
    <>
      <h2 className="text-center mb-5">Infrastructure & Deployment</h2>
      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className="architecture-card card infra-card">
            <div className="card-body">
              <h3 className="card-title"><i className="fas fa-cloud me-2"></i>Cloud-Native Deployment</h3>
              <p className="text-muted">Scalable infrastructure with Docker, AWS, and CI/CD pipelines</p>
              
              <h5>Core Technologies:</h5>
              <div className="mb-3">
                <span className="layer-badge bg-danger">Docker</span>
                <span className="layer-badge bg-danger">AWS ECS</span>
                <span className="layer-badge bg-danger">GitHub Actions</span>
                <span className="layer-badge bg-danger">Nginx</span>
                <span className="layer-badge bg-danger">Let's Encrypt</span>
              </div>
              
              <h5>Deployment Strategy:</h5>
              <ul>
                <li>Containerized microservices architecture</li>
                <li>AWS ECS/EKS for orchestration</li>
                <li>CI/CD pipelines with GitHub Actions</li>
                <li>Nginx as reverse proxy and load balancer</li>
                <li>SSL certificates with Let's Encrypt</li>
              </ul>
              
              <h5>Docker Compose Configuration:</h5>
              <div className="code-block-container">
                <div className="code-block">
                  <pre><code>{deploymentCode}</code></pre>
                </div>
                <button 
                  className="btn btn-sm btn-outline-primary copy-btn"
                  onClick={() => copyToClipboard(deploymentCode, 'deployment-code')}
                >
                  <i className="fas fa-copy me-1"></i>
                  {copiedCode === 'deployment-code' ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function ContactSection({ contactForm, handleContactChange, handleContactSubmit, formSubmitted }) {
  return (
    <>
      <h2 className="text-center mb-5">Contact Us</h2>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title mb-4">Get In Touch</h4>
              <p className="text-muted mb-4">
                Have questions about OpenEdTex? Want to contribute or learn more about our full-stack implementation?
                We'd love to hear from you!
              </p>
              
              <form onSubmit={handleContactSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="name" className="form-label">Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={contactForm.name}
                      onChange={handleContactChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="email" className="form-label">Email *</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={contactForm.email}
                      onChange={handleContactChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="subject" className="form-label">Subject *</label>
                  <select
                    className="form-select"
                    id="subject"
                    name="subject"
                    value={contactForm.subject}
                    onChange={handleContactChange}
                    required
                  >
                    <option value="">Choose a subject...</option>
                    <option value="general">General Inquiry</option>
                    <option value="technical">Technical Question</option>
                    <option value="collaboration">Collaboration Opportunity</option>
                    <option value="support">Technical Support</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="message" className="form-label">Message *</label>
                  <textarea
                    className="form-control"
                    id="message"
                    name="message"
                    rows="5"
                    value={contactForm.message}
                    onChange={handleContactChange}
                    placeholder="Tell us about your inquiry..."
                    required
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary btn-lg"
                  disabled={formSubmitted}
                >
                  {formSubmitted ? (
                    <>
                      <div className="loading" style={{display: 'inline-block', marginRight: '8px'}}></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane me-2"></i>
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
          
          <div className="row mt-5">
            <div className="col-md-4 text-center">
              <div className="contact-info">
                <i className="fas fa-envelope fa-2x text-primary mb-3"></i>
                <h5>Email</h5>
                <p>hello@openedtex.org</p>
              </div>
            </div>
            <div className="col-md-4 text-center">
              <div className="contact-info">
                <i className="fab fa-github fa-2x text-primary mb-3"></i>
                <h5>GitHub</h5>
                <p>github.com/openedtex</p>
              </div>
            </div>
            <div className="col-md-4 text-center">
              <div className="contact-info">
                <i className="fab fa-discord fa-2x text-primary mb-3"></i>
                <h5>Community</h5>
                <p>Join our Discord</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
